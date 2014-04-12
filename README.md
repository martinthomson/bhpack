# bhpack

Pack binary header fields in HPACK more efficiently

# Usage

Encode binary data as strings that are more efficiently encoded
in HTTP/2.

```javascript
var bhpack = require('bhpack');
// For cookies
var cookies = {
  a: bhpack.cookie.encode(valueOfA)
};
// For URLs
var url = 'https://example.com/' +
          bhpack.uri.encode(pathComponent) +
          '?q=' + bhpack.query.encode(qParam);
```

Decode the resulting values again.

```javascript
var cookieA = bhpack.cookie.decode(encodedString);
var url = require('url').parse(url, true);
var pathComponent = bhpack.uri.decode(url.pathname.substring(1));
var qParam = bhpack.query.decode(url.query.q);
```

# Performance

It's a few percentage points.  That's not a big saving unless your bandwidth
costs are dominant.

I could implement this with arithmetic or range coding, which would shave this
down slightly, but that hasn't happened yet, and probably won't.

Here's what `node compare.js 100000 20` returned one time.  That is, what the
compression is like for 100,000 random 20 byte sequences for the different
modes.

```
100000 random sequences of lengths:     20
Average sizes: min/ave/max (size compared against Base64+Huffman)
Raw Huffman coding (invalid):           25/48.20803/64 (203.13%)
Base 64 (no Huffman):                   27/27/27 (113.77%)
Base 64 with Huffman:                   20/23.73286/27 (100%)
bhpack cookie with Huffman:             19/23.6052/30 (99.46%)
bhpack URI safe with Huffman:           20/22.98342/28 (96.84%)
bhpack URI query with Huffman:          20/23.01238/28 (96.96%)
```

# FAQ

*Why?*

Because HPACK is kind to URI-safe base64, but not as kind as it could be.

*Why not?*

You don't want to do this for security reasons.  Huffman encoding reveals a tiny
bit about your data based on the length that it encodes to.  This can be
slightly worse.
