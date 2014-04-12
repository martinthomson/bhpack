'use strict';

var HPACK_TABLE = [
  '11111111111111111110111010',
  '11111111111111111110111011',
  '11111111111111111110111100',
  '11111111111111111110111101',
  '11111111111111111110111110',
  '11111111111111111110111111',
  '11111111111111111111000000',
  '11111111111111111111000001',
  '11111111111111111111000010',
  '11111111111111111111000011',
  '11111111111111111111000100',
  '11111111111111111111000101',
  '11111111111111111111000110',
  '11111111111111111111000111',
  '11111111111111111111001000',
  '11111111111111111111001001',
  '11111111111111111111001010',
  '11111111111111111111001011',
  '11111111111111111111001100',
  '11111111111111111111001101',
  '11111111111111111111001110',
  '11111111111111111111001111',
  '11111111111111111111010000',
  '11111111111111111111010001',
  '11111111111111111111010010',
  '11111111111111111111010011',
  '11111111111111111111010100',
  '11111111111111111111010101',
  '11111111111111111111010110',
  '11111111111111111111010111',
  '11111111111111111111011000',
  '11111111111111111111011001',
  '00110',
  '1111111111100',
  '111110000',
  '11111111111100',
  '111111111111100',
  '011110',
  '1100100',
  '1111111111101',
  '1111111010',
  '111110001',
  '1111111011',
  '1111111100',
  '1100101',
  '1100110',
  '011111',
  '00111',
  '0000',
  '0001',
  '0010',
  '01000',
  '100000',
  '100001',
  '100010',
  '100011',
  '100100',
  '100101',
  '100110',
  '11101100',
  '11111111111111100',
  '100111',
  '111111111111101',
  '1111111101',
  '111111111111110',
  '1100111',
  '11101101',
  '11101110',
  '1101000',
  '11101111',
  '1101001',
  '1101010',
  '111110010',
  '11110000',
  '111110011',
  '111110100',
  '111110101',
  '1101011',
  '1101100',
  '11110001',
  '11110010',
  '111110110',
  '111110111',
  '1101101',
  '101000',
  '11110011',
  '111111000',
  '111111001',
  '11110100',
  '111111010',
  '111111011',
  '11111111100',
  '11111111111111111111011010',
  '11111111101',
  '11111111111101',
  '1101110',
  '111111111111111110',
  '01001',
  '1101111',
  '01010',
  '101001',
  '01011',
  '1110000',
  '101010',
  '101011',
  '01100',
  '11110101',
  '11110110',
  '101100',
  '101101',
  '101110',
  '01101',
  '101111',
  '111111100',
  '110000',
  '110001',
  '01110',
  '1110001',
  '1110010',
  '1110011',
  '1110100',
  '1110101',
  '11110111',
  '11111111111111101',
  '111111111100',
  '11111111111111110',
  '111111111101',
  '11111111111111111111011011',
  '11111111111111111111011100',
  '11111111111111111111011101',
  '11111111111111111111011110',
  '11111111111111111111011111',
  '11111111111111111111100000',
  '11111111111111111111100001',
  '11111111111111111111100010',
  '11111111111111111111100011',
  '11111111111111111111100100',
  '11111111111111111111100101',
  '11111111111111111111100110',
  '11111111111111111111100111',
  '11111111111111111111101000',
  '11111111111111111111101001',
  '11111111111111111111101010',
  '11111111111111111111101011',
  '11111111111111111111101100',
  '11111111111111111111101101',
  '11111111111111111111101110',
  '11111111111111111111101111',
  '11111111111111111111110000',
  '11111111111111111111110001',
  '11111111111111111111110010',
  '11111111111111111111110011',
  '11111111111111111111110100',
  '11111111111111111111110101',
  '11111111111111111111110110',
  '11111111111111111111110111',
  '11111111111111111111111000',
  '11111111111111111111111001',
  '11111111111111111111111010',
  '11111111111111111111111011',
  '11111111111111111111111100',
  '11111111111111111111111101',
  '11111111111111111111111110',
  '11111111111111111111111111',
  '1111111111111111110000000',
  '1111111111111111110000001',
  '1111111111111111110000010',
  '1111111111111111110000011',
  '1111111111111111110000100',
  '1111111111111111110000101',
  '1111111111111111110000110',
  '1111111111111111110000111',
  '1111111111111111110001000',
  '1111111111111111110001001',
  '1111111111111111110001010',
  '1111111111111111110001011',
  '1111111111111111110001100',
  '1111111111111111110001101',
  '1111111111111111110001110',
  '1111111111111111110001111',
  '1111111111111111110010000',
  '1111111111111111110010001',
  '1111111111111111110010010',
  '1111111111111111110010011',
  '1111111111111111110010100',
  '1111111111111111110010101',
  '1111111111111111110010110',
  '1111111111111111110010111',
  '1111111111111111110011000',
  '1111111111111111110011001',
  '1111111111111111110011010',
  '1111111111111111110011011',
  '1111111111111111110011100',
  '1111111111111111110011101',
  '1111111111111111110011110',
  '1111111111111111110011111',
  '1111111111111111110100000',
  '1111111111111111110100001',
  '1111111111111111110100010',
  '1111111111111111110100011',
  '1111111111111111110100100',
  '1111111111111111110100101',
  '1111111111111111110100110',
  '1111111111111111110100111',
  '1111111111111111110101000',
  '1111111111111111110101001',
  '1111111111111111110101010',
  '1111111111111111110101011',
  '1111111111111111110101100',
  '1111111111111111110101101',
  '1111111111111111110101110',
  '1111111111111111110101111',
  '1111111111111111110110000',
  '1111111111111111110110001',
  '1111111111111111110110010',
  '1111111111111111110110011',
  '1111111111111111110110100',
  '1111111111111111110110101',
  '1111111111111111110110110',
  '1111111111111111110110111',
  '1111111111111111110111000',
  '1111111111111111110111001',
  '1111111111111111110111010',
  '1111111111111111110111011',
  '1111111111111111110111100',
  '1111111111111111110111101',
  '1111111111111111110111110',
  '1111111111111111110111111',
  '1111111111111111111000000',
  '1111111111111111111000001',
  '1111111111111111111000010',
  '1111111111111111111000011',
  '1111111111111111111000100',
  '1111111111111111111000101',
  '1111111111111111111000110',
  '1111111111111111111000111',
  '1111111111111111111001000',
  '1111111111111111111001001',
  '1111111111111111111001010',
  '1111111111111111111001011',
  '1111111111111111111001100',
  '1111111111111111111001101',
  '1111111111111111111001110',
  '1111111111111111111001111',
  '1111111111111111111010000',
  '1111111111111111111010001',
  '1111111111111111111010010',
  '1111111111111111111010011',
  '1111111111111111111010100',
  '1111111111111111111010101',
  '1111111111111111111010110',
  '1111111111111111111010111',
  '1111111111111111111011000',
  '1111111111111111111011001',
  '1111111111111111111011010',
  '1111111111111111111011011',
  '1111111111111111111011100'
];

var ALLOWED_COOKIE = '/!#$%&\'()*+.0123456789:=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]' +
  '^_`abcdefghijklmnopqrstuvwxyz{|}~';
// TODO add URI path component encoder (esp query string values),
//  which is probably more useful than the cookie one

function Node(c, p) {
  this.c = c; // on leaf nodes: a symbol; on branch nodes: the arms
  this.p = p;
}
Node.prototype = {
  // combines two nodes into a branch node
  combine: function(other) {
    return new Node([this, other], this.p + other.p);
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
  BinaryHpack: BinaryHpack,
  cookie: new BinaryHpack(HPACK_TABLE, ALLOWED_COOKIE)
};
