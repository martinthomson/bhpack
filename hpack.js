'use strict'

// just the huffman encoder from hpack


function Node(c) {
  this.c = c; // on leaf nodes: a symbol; on branch nodes: the arms
}
Node.prototype = {
  // returns true if this is a leaf
  leaf: function() {
    return !Array.isArray(this.c);
  }
};


// mostly ripped from
// https://github.com/molnarg/node-http2-protocol/blob/master/lib/compressor.js
function Hpack(input) {
  function buildTree(table, depth) {
    if (table.length === 1) {
      return new Node(input.indexOf(table[0]));
    } else {
      var zero = [];
      var one = [];
      table.forEach(function(entry) {
        if (entry.charAt(depth) === '0') {
          zero.push(entry);
        } else {
          one.push(entry);
        }
      });
      return new Node([buildTree(zero, depth + 1), buildTree(one, depth + 1)]);
    }
  }

  this.tree = buildTree(input, 0);
  this.pathMap = {};
  input.forEach(function(bits, i) {
    this.pathMap[String.fromCharCode(i)] = {
      code: parseInt(bits, 2),
      len: bits.length
    };
  }.bind(this));
  this.pad = this.pathMap[String.fromCharCode(input.length - 1)];
}

Hpack.prototype = {
  encode: function(buffer) {
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
    for (var i = 0; i < buffer.length; ++i) {
      var entry = this.pathMap[String.fromCharCode(buffer[i])];
      push(entry.code, entry.len);
    }

    if (space > 0) {
      var d = this.pad.code >> (this.pad.len - space);
      result[result.length - 1] |= d;
    }
    return new Buffer(result);
  },

  decode: function(buffer) {
    function bit(x) {
      var sh = 7 - (x & 0x7);
      return (buffer[Math.floor(x / 8)] & (1 << sh)) >> sh;
    }

    var result = [];
    var cursor = this.tree;
    for (var i = 0; i < buffer.length * 8; ++i) {
      cursor = cursor.c[bit(i)];
      if (cursor.leaf()) {
        result.push(cursor.c);
        cursor = this.tree;
      }
    }
    return new Buffer(result);
  }
};


module.exports = new Hpack(require('./hpack-table'));
