'use strict';
var mocha = require('mocha');
var assert = require('assert');

var bhpack = require('./bhpack');

function assertBufferEqual(a, b) {
  assert.equal(a.length, b.length);
  for (var i = 0; i < a.length; ++i) {
    assert.equal(a[i], b[i]);
  }
}

var ALLOWED = bhpack.ALLOWED_COOKIE;
var cookie = bhpack.cookie;

describe('bhpack', function() {
  it('encodes to allowed character set', function() {
    for (var i = 0; i <= 0/*xff*/; ++i) {
      var x = new Buffer([i]);
      var encoded = cookie.encode(x);
//      console.log(x.toString('hex') + ': ' + encoded);
      for (var j = 0; j < encoded.length; ++j) {
        assert.ok(ALLOWED.indexOf(encoded.charAt(j)) >= 0,
                  'Found illegal char ' + encoded.charCodeAt(j) + ' from ' + i);
      }
    }
  });

  it('should be reversible', function() {
    for (var i = 0; i <= 0xffff; ++i) {
      var x = new Buffer([i >> 8, i & 0xff]);
      var encoded = cookie.encode(x);
      var decoded = cookie.decode(encoded);
      console.log(x.toString('hex'), encoded, decoded.toString('hex'));
      assertBufferEqual(x, decoded);
    }
  });
});
