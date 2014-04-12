'use strict';

var crypto = require('crypto');
var bhpack = require('./bhpack');
var hpack = require('./hpack');
var base64 = require('urlsafe-base64');

function compare(rounds, size) {
//  var rawSize = 0;
  var hpackLen = 0;
  var base64Len = 0;
  var base64HpackLen = 0;
  var bhpackCookieHpackLen = 0;
  var bhpackUriSafeHpackLen = 0;
  var bhpackUriQueryHpackLen = 0;
  for (var i = 0; i < rounds; ++i) {
    var data = crypto.randomBytes(size);
    hpackLen += hpack.encode(data).length;
    var b64 = new Buffer(base64.encode(data), 'utf8');
    base64Len += b64.length;
    base64HpackLen += hpack.encode(b64).length;
    var cookie = new Buffer(bhpack.cookie.encode(data), 'utf8');
    bhpackCookieHpackLen += hpack.encode(cookie).length;
    var uri = new Buffer(bhpack.uriSafe.encode(data), 'utf8');
    bhpackUriSafeHpackLen += hpack.encode(uri).length;
    var query = new Buffer(bhpack.uriQuery.encode(data), 'utf8');
    bhpackUriQueryHpackLen += hpack.encode(query).length;
  }
  return {
    hpack: hpackLen,
    base64: base64Len,
    base64Hpack: base64HpackLen,
    bhpackCookie: bhpackCookieHpackLen,
    bhpackUri: bhpackUriSafeHpackLen,
    bhpackQuery: bhpackUriQueryHpackLen
  };
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
console.log(rounds + ' random sequences of lengths: \t' + sizes.join('\t\t'));
var results = sizes.map(function(size) {
  return compare(rounds, size);
});
console.log('Average sizes:');

var referenceKey = 'base64Hpack';
function printResults(label, key, pad) {
  pad = (typeof pad !== 'undefined') ? pad : '';
  console.log(label + ': \t\t' + pad + results.map(function(r) {
    var average = r[key] / rounds;
    var improvement = Math.round(r[key] / r[referenceKey] * 10000) / 100;
    return average + ' (' + improvement + ')';
  }).join('\t'))
}
printResults('Raw Huffman coding (invalid)', 'hpack');
printResults('Base 64 (no Huffman)', 'base64', '\t');
printResults('Base 64 with Huffman', 'base64Hpack', '\t');
printResults('bhpack cookie with Huffman', 'bhpackCookie');
printResults('bhpack URI safe with Huffman', 'bhpackUri');
printResults('bhpack URI query with Huffman', 'bhpackQuery');
