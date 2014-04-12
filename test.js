'use strict';
var mocha = require('mocha');
var assert = require('assert');
var crypto = require('crypto');

var bhpack = require('./bhpack');
var hpack = require('./hpack');

function assertBufferEqual(a, b) {
  assert.equal(a.length, b.length);
  for (var i = 0; i < a.length; ++i) {
    assert.equal(a[i], b[i]);
  }
}

function reversible(encoder, x) {
  var encoded = encoder.encode(x);
  var decoded = encoder.decode(encoded);
  assertBufferEqual(x, decoded);
}

var ALLOWED = bhpack.ALLOWED_COOKIE;
var cookie = bhpack.cookie;

describe('bhpack', function() {
  it('encodes to allowed character set', function() {
    for (var i = 0; i <= 0xff; ++i) {
      var x = new Buffer([i]);
      var encoded = cookie.encode(x);
      for (var j = 0; j < encoded.length; ++j) {
        assert.ok(ALLOWED.indexOf(encoded.charAt(j)) >= 0,
                  'Found illegal char ' + encoded.charCodeAt(j) + ' from ' + i);
      }
    }
  });

  it('should be reversible', function() {
    for (var i = 0; i <= 0xffff; ++i) {
      reversible(cookie, new Buffer([i >> 8, i & 0xff]));
    }
  });

  it('should handle random bytes', function() {
    for (var i = 0; i < 1000; ++i) {
      reversible(cookie, crypto.randomBytes(i % 16 + 1));
    }
  });
});

function toSpec(string, hex) {
  var header = new Buffer(string, 'utf8');
  var encoded = new Buffer(hex, 'hex');
  assertBufferEqual(encoded, hpack.encode(header));
  assertBufferEqual(header, hpack.decode(encoded));
}

describe('hpack', function() {
  it('is reversible', function() {
    for (var i = 0; i < 0xffff; ++i) {
      reversible(hpack, new Buffer([i >> 8, i & 0xff]));
    }
  });

  it('encodes and decodes to spec', function() {
    toSpec('www.example.com', 'e7cf9bebe89b6fb16fa9b6ff');
    toSpec('no-cache', 'b9b9949556bf');
    toSpec('custom-key', '571c5cdb737b2faf');
    toSpec('custom-value', '571c5cdb73724d9c57');
    toSpec('private', 'bf06724b97');
    toSpec('Mon, 21 Oct 2013 20:13:21 GMT', 'd6dbb29884de2a718805062098513109b56ba3');
    toSpec('https://www.example.com', 'adcebf198e7e7cf9bebe89b6fb16fa9b6f');
    toSpec('Mon, 21 Oct 2013 20:13:22 GMT', 'd6dbb29884de2a718805062098513111b56ba3');
    toSpec('gzip', 'abdd97ff');
    toSpec('foo=ASDJKHQKBZXOQWEOPIUAXQWEOIU; max-age=3600; version=1',
           'e0d6cf9f6e8f9fd3e5f6fa76fefd3c7edf9eff1f2f0f3cfe9f6fcf7f8f879f61ad4f4' +
           'cc9a973a2200ec3725e18b1b74e3f');
  });
});
