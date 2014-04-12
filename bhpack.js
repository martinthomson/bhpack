'use strict';

var HPACK_TABLE = require('./hpack-table');
var ALLOWED_COOKIE = '/!#$%&\'()*+.0123456789:=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]' +
  '^_`abcdefghijklmnopqrstuvwxyz{|}~';
var ALLOWED_URI = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~:@';
// query components can include '/' and '?', which might be useful to improve performance
var ALLOWED_URI_QUERY = ALLOWED_URI + '/?';

function Node(c, p) {
  this.c = c; // on leaf nodes: a symbol; on branch nodes: the arms
  this.p = p;
}
Node.prototype = {
  // combines two nodes into a branch node
  combine: function(other) {
    var cc;
    if (other.p > this.p) {
      cc = [other, this];
    } else {
      cc = [this, other];
    }
    return new Node(cc, this.p + other.p);
  },
  // returns true if this is a leaf
  leaf: function() {
    return !Array.isArray(this.c);
  },
  // returns the side with the shorter path
  shortSide: function() {
    if (this.c[1].p > this.c[0].p) {
      return this.c[1];
    }
    return this.c[0];
  }
};

// builds a Huffman tree based on symbol probabilities
// input is a list of leaf nodes
// output is a single root node
function buildTree(symbols) {
  function next() {
    if (q.length === 0) {
      return symbols.shift();
    }
    if (symbols.length === 0 || q[0].p < symbols[0].p) {
      return q.shift();
    }
    return symbols.shift();
  }
  var q = [];
  while(symbols.length + q.length > 1) {
    q.push(next().combine(next()));
  }
  return q[0];
}

function walkTree(tree, path, pathMap) {
  if (tree.leaf()) {
    pathMap[tree.c] = { code: parseInt(path, 2), len: path.length, path: path };
  } else {
    walkTree(tree.c[0], path + '0', pathMap);
    walkTree(tree.c[1], path + '1', pathMap);
  }
}

// Arithmetic or range coding would be more efficient here, but that's a rework
function BinaryHpack(table, allowed) {
  var inputLengths = table.map(function(bits) {
    return bits.length;
  });

  // here we take the symbols, look at their lengths and fake out
  // relative probabilities for each
  this.symbols = [];
  for (var i = 0; i < allowed.length; ++i) {
    var ch = allowed.charAt(i);
    var code = allowed.charCodeAt(i);
    this.symbols.push(new Node(ch, 1 / inputLengths[code]));
  }
  this.symbols.sort(function(a, b) {
    return a.c.charCodeAt(0) - b.c.charCodeAt(0);
  });
  // sort by (ascending) probability
  this.symbols.sort(function(a, b) {
    return a.p - b.p;
  });
  // and build a tree
  this.tree = buildTree(this.symbols.concat());

  // the reverse tree is used to decode
  this.pathMap = {};
  walkTree(this.tree, '', this.pathMap);

  // we only keep this.symbols around for dealing with signaling of wasted
  // bytes, so we can trim this to only what is needed
  var longest = Object.keys(this.pathMap).reduce(function(a, k) {
    if (this.pathMap[k].len > a) {
      return this.pathMap[k].len;
    }
    return a;
  }.bind(this), 0);
  // need enough to signal 0 bytes wasted and up to
  // (longest symbol - 1) bits wasted
  var symbolsNeeded = Math.ceil((longest - 1) / 8) + 1;
  this.symbols = this.symbols.slice(this.symbols.length - symbolsNeeded);
}

function bit(buffer, x) {
  var sh = 7 - (x & 0x7);
  return (buffer[Math.floor(x / 8)] & (1 << sh)) >> sh;
}

// look at the last character to determine how many bytes were wasted
function getWasteBytes(symbols, lastCharacter) {
  for (var i = symbols.length - 1; i > 0; --i) {
    if (symbols[i].c === lastCharacter) {
      return symbols.length - 1 - i;
    }
  }
  return -1; // not found, safe case
}

BinaryHpack.prototype = {
  encode: function(buffer) {
    var result = [];
    var cursor = this.tree;
    for (var i = 0; i < buffer.length * 8; ++i) {
      cursor = cursor.c[bit(buffer, i)];
      if (cursor.leaf()) {
        result.push(cursor.c);
        cursor = this.tree;
      }
    }

    // we have to complete an unfinished node
    // and signal how many bytes are to be discarded
    // on decode as a result
    var wasteBits = 0;
    if (cursor != this.tree) {
      while(!cursor.leaf()) {
        cursor = cursor.shortSide();
        ++wasteBits;
      }
      result.push(cursor.c);
    }
    var wasteBytes = Math.ceil(wasteBits / 8);
    // for the waste byte indicator, we use the sorted symbol table,
    // which should have the cheapest symbol at the end
    // for each step away from the end, we've wasted more bytes
    var signalIndex = this.symbols.length - wasteBytes - 1;
    // hack to save more bytes:
    // if we are wasting one byte (which is by far the most common case)
    // then omit the waste sentinel character if it isn't a valid sentinel
    if (wasteBytes !== 1 || getWasteBytes(cursor.c) >= 0) {
      result.push(this.symbols[signalIndex].c);
    }
    return result.join('');
  },

  decode: function(str) {
    var result = [];
    var space = 0;

    // from code, put len bits into result
    function push(code, len) {
      var d;
      if (space > 0) {
        if (len > space) {
          d = code >> (len - space);
          len -= space;
          space = 0;
        } else {
          d = code << (space - len);
          space -= len;
          len = 0;
        }
        result[result.length - 1] |= d;
      }
      while (len >= 8) {
        d = code >> (len - 8);
        result.push(d & 0xff);
        len -= 8;
      }
      if (len > 0) {
        d = code << (8 - len);
        result.push(d & 0xff);
        space = 8 - len;
      }
    }

    // straightforward table lookup, Huffman encoding
    for (var i = 0; i < str.length - 1; ++i) {
      var entry = this.pathMap[str.charAt(i)];
      push(entry.code, entry.len);
    }

    // dealing with the trailing bits is tricky, see encode() for details
    var tail = str.charAt(str.length - 1);
    var waste = getWasteBytes(this.symbols, tail);
    if (waste > 0) {
      result = result.slice(0, result.length - waste);
    } else {
      // here the tail is needed
      var entry = this.pathMap[tail];
      push(entry.code, entry.len);
      // but it's also responsible for a byte of waste
      result.pop();
    }
    return new Buffer(result);
  }
};

module.exports = {
  HPACK_TABLE: HPACK_TABLE,
  ALLOWED_COOKIE: ALLOWED_COOKIE,
  ALLOWED_URI: ALLOWED_URI,
  ALLOWED_URI_QUERY: ALLOWED_URI_QUERY,
  BinaryHpack: BinaryHpack,
  cookie: new BinaryHpack(HPACK_TABLE, ALLOWED_COOKIE),
  uri: new BinaryHpack(HPACK_TABLE, ALLOWED_URI),
  query: new BinaryHpack(HPACK_TABLE, ALLOWED_URI_QUERY)
};
