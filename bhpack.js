'use strict';

var ALLOWED_CHARS = '!#$%&\'()*+.0123456789:=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~';
var INITIAL_ESCAPES = {
  '/': '0', ' ': '1', '"': 'a', ',': '2', ';': '3', '<': 'c', '\\': 'e'
};

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

// ripped mostly from
// https://github.com/molnarg/node-http2-protocol/blob/master/lib/compressor.js
function BinaryHpack(table, allowed, escaped) {
  function createTree(codes, position) {
    if (codes.length === 1) {
      return [table.indexOf(codes[0])];
    } else {
      position = position || 0;
      var zero = [];
      var one = [];
      for (var i = 0; i < codes.length; i++) {
        var string = codes[i];
        if (string[position] === '0') {
          zero.push(string);
        } else {
          one.push(string);
        }
      }
      return [createTree(zero, position + 1), createTree(one, position + 1)];
    }
  }

  this.tree = createTree(table);

  this.codes = table.map(function(bits) {
    return parseInt(bits, 2);
  });
  this.lengths = table.map(function(bits) {
    return bits.length;
  });

  this.allowed = allowed;

  this.escaped = escaped;
  this.reverseEscaped = {};
  Object.keys(this.escaped).forEach(function(k) {
    this.reverseEscaped[this.escaped[k]] = k.charCodeAt(0);
  }.bind(this));

  var escapeSequence = function(idx) {
    var result = [];
    while (idx > this.allowed.length) {
      result.push('/');
      idx -= this.allowed.length;
    }
    result.push(this.allowed.charAt(idx));
    return result.join('');
  }.bind(this);

  var next = 0;
  for (var i = 0; i <= 0xff; ++i) {
    var c = String.fromCharCode(i);
    if (!this.escaped.hasOwnProperty(c) && this.allowed.indexOf(c) < 0) {
      var esc = escapeSequence(next);
      while (this.reverseEscaped.hasOwnProperty(esc)) {
        esc = escapeSequence(++next);
      }
      this.escaped[c] = esc;
      this.reverseEscaped[esc] = i;
      console.log('escape: ' + esc + ': ' + i.toString(16));
   }
  }
}

function bit(buffer, x) {
  var sh = 7 - (x & 0x7);
  return (buffer[Math.floor(x / 8)] & (1 << sh)) >> sh ;
}

BinaryHpack.prototype = {
  bhpack: function(buffer) {
    var result = [];
    var subtree = this.tree;

    var push = function(code) {
      var ch = String.fromCharCode(code);
      if (this.allowed.indexOf(ch) < 0) {
        result.push('/');
        var esc = this.escaped[ch];
        result.push(esc);
        // return bits used:
        // = 5*number of slashes
        // + length of last character
        return this.lengths[this.reverseEscaped[esc]];
      }
      result.push(ch);
      return this.lengths[ch.charCodeAt(0)];
    }.bind(this); // () =>

    var start = 0;
    var size = buffer.length * 8;
    for (var i = 0; i < size; ++i) {
      subtree = subtree[bit(buffer, i)];
      if (subtree.length === 1) {
        push(subtree[0]);
        subtree = this.tree;
        start = i + 1;
      }
    }

    // we didn't provide bits for the last character
    if (subtree != this.tree) {
      while(subtree.length !== 1) {
        subtree = subtree[0];
      }
      // we're wasting bits equal to the size of the entry
      // less the number we need to encode
      var pushedSize = push(subtree[0]);
      var wasted = pushedSize - (size - start);
      console.log(size, start, pushedSize, wasted);
      // one slash for every byte (or part-byte) we are wasting
      for (var i = 0; i < Math.ceil(wasted / 8); ++i) {
        result.push('/');
      }
    }

    return result.join('');
  },

  unbhpack: function(str) {
    var b = [];
    var trim = 0;
    for (var i = 0; i < str.length; ++i) {
      var ch = str.charAt(i);
      if (ch === '/') {
        var escaped = '';
        while (++i < str.length) {
          ch = str.charAt(i);
          escaped += ch;
          if (ch !== '/') {
            b.push(this.reverseEscaped[escaped]);
            console.log('escape: ' + escaped + ': ' + this.reverseEscaped[escaped].toString(16));
            break;
          }
        }
        if (ch === '/') {
          trim = escaped.length + 1; // number of slashes == number of wasted bytes
        }
      } else {
        b.push(ch.charCodeAt(0));
      }
    }
    console.log(str + ' unbhpack ' + new Buffer(b).toString('hex') + ' trim ' + trim);
    var result =  this.huff(new Buffer(b));
    return result.slice(0, result.length - trim);
  },

  huff: function(buffer) {
    var result = [];
    var space = 8;

    function add(data) {
      if (space === 8) {
        result.push(data);
      } else {
        result[result.length - 1] |= data;
      }
    }

    for (var i = 0; i < buffer.length; i++) {
      var b = buffer[i];
      var code = this.codes[b];
      var length = this.lengths[b];

      while (length !== 0) {
        if (space >= length) {
          add(code << (space - length));
          code = 0;
          space -= length;
          length = 0;
        } else {
          var shift = length - space;
          var msb = code >> shift;
          add(msb);
          code -= msb << shift;
          length -= space;
          space = 0;
        }

        if (space === 0) {
          space = 8;
        }
      }
    }

    if (space !== 8) {
      add(this.codes[256] >> (this.lengths[256] - space));
    }

    return new Buffer(result);
  },

  dehuff: function(buffer) {
    var result = [];
    var subtree = this.tree;

    for (var i = 0; i < buffer.length * 8; ++i) {
      subtree = subtree[bit(buffer, i)];
      if (subtree.length === 1) {
        result.push(subtree[0]);
        subtree = this.tree;
      }
    }

    return new Buffer(result);
  }
};

// don't think that you can change this table...
module.exports = new BinaryHpack(HPACK_TABLE, ALLOWED_CHARS, INITIAL_ESCAPES);
