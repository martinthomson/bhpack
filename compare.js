'use strict';

var crypto = require('crypto');
var bhpack = require('./bhpack');
var hpack = require('./hpack');
var base64 = require('urlsafe-base64');

function Score() {
  this.len =  0;
  this.max = 0;
  this.min = Infinity;
}
Score.prototype = {
  add: function(d) {
    var l = d.length;
    this.len += l;
    if (l > this.max) {
      this.max = l;
    }
    if (l < this.min) {
      this.min = l;
    }
  },
  average: function(rounds) {
    return this.len / rounds;
  }
};
function compare(rounds, size) {
//  var rawSize = 0;
  var score = {};
  [
    'hpack', 'base64', 'base64Hpack', 'bhpackCookie', 'bhpackUri', 'bhpackQuery'
  ].forEach(function(k) {
    score[k] = new Score();
  });
  for (var i = 0; i < rounds; ++i) {
    var data = crypto.randomBytes(size);
    score.hpack.add(hpack.encode(data));
    var b64 = new Buffer(base64.encode(data), 'utf8');
    score.base64.add(b64);
    score.base64Hpack.add(hpack.encode(b64));
    var cookie = new Buffer(bhpack.cookie.encode(data), 'utf8');
    score.bhpackCookie.add(hpack.encode(cookie));
    var uri = new Buffer(bhpack.uri.encode(data), 'utf8');
    score.bhpackUri.add(hpack.encode(uri));
    var query = new Buffer(bhpack.query.encode(data), 'utf8');
    score.bhpackQuery.add(hpack.encode(query));
  }
  return score;
}

var argv = process.argv.slice(2);
if (argv.length < 2) {
  console.log('Usage: compare <rounds> <size> [size ...]');
  console.log('   Runs a comparison with <rounds> of random data of the various sizes');
  process.exit(2);
}

var rounds = parseInt(argv.shift(), 10);
var sizes = argv.map(function(size) {
  return parseInt(size, 10);
});
console.log(rounds + ' random sequences of lengths: \t' + sizes.join('\t\t\t'));
var results = sizes.map(function(size) {
  return compare(rounds, size);
});
console.log('Average sizes: min/ave/max (size compared against Base64+Huffman)');

var referenceKey = 'base64Hpack';
function printResults(label, key, pad) {
  pad = (typeof pad !== 'undefined') ? pad : '';
  console.log(label + ': \t\t' + pad + results.map(function(r) {
    var stats = r[key].min + '/' + r[key].average(rounds) + '/' + r[key].max;
    var improvement = Math.round(r[key].len / r[referenceKey].len * 10000) / 100;
    return stats + ' (' + improvement + '%)';
  }).join('\t'))
}
//console.log(results);
printResults('Raw Huffman coding (invalid)', 'hpack');
printResults('Base 64 (no Huffman)', 'base64', '\t');
printResults('Base 64 with Huffman', 'base64Hpack', '\t');
printResults('bhpack cookie with Huffman', 'bhpackCookie');
printResults('bhpack URI safe with Huffman', 'bhpackUri');
printResults('bhpack URI query with Huffman', 'bhpackQuery');
