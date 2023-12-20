const Crypto = require('crypto-js')

const R = {
  getSign: function (e) {
    e.sign && delete e.sign;
    var t = [];
    for (var n in e)
      t.push(n + "=" + (R.isBaseParams(n) ? e[n] : encodeURIComponent(e[n])));
    var i = t.join("&").replace(/~/g, "%7E")
      , o = i.split("&")
      , s = o.sort().join("&");
    -1 != s.indexOf(":") && (s = s.replace(/:/g, "%3A")),
      -1 != s.indexOf("@") && (s = s.replace(/@/g, "%40")),
      -1 != s.indexOf(",") && (s = s.replace(/,/g, "%2C")),
      -1 != s.indexOf("%20") && (s = s.replace(/%20/g, "+"));
    var r = S.b8c7(s).toUpperCase();
    return this.encryptSign(r)
  },
  encryptSign: function (e) {
    for (var t = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"], n = e.substring(0, 8), a = 1073741823 & parseInt(n, 16), i = "", o = 0; o < 6; o++) {
      var s = 61 & a;
      i += t[parseInt(s)],
        a >>= 5
    }
    return i
  },
  getParamsAPP: function (e) {
    let t = JSON.parse(JSON.stringify(e));
    for (var n in t && (t.appkey = "i2n1Vu",
      t.appsecret = "rYH12u",
      t.appversion = "4.2.0",
      t.channel = 'app_web',
      t.market = "AppStore",
      t.sign = R.getSign(t)),
      t)
      if (!R.isBaseParams(n)) {
        let e = t[n];
        e = encodeURIComponent(e),
          t[n] = a.encode(e)
      }
    return t
  },
  getParams: function (e) {
    let t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1]
      , n = JSON.parse(JSON.stringify(e));
    if (n && (n.appkey = t ? "ncJx1e" : "IX8pBy",
      n.appsecret = t ? "Exyie3" : "u9KMNq",
      n.channel = 'app_web',
      n.appversion = e.appversion || "1.0.0",
      n.market = "web",
      n.sign = R.getSign(n)),
      false) {
      let e = new y;
      for (var a in n)
        R.isBaseParams(a) || (n[a] = e.strEnc(n[a], ...P))
    }
    if (true) {
      // let e = new v;
      for (var a in n)
        if (!R.isBaseParams(a)) {
          const i = encodeURIComponent(n[a]).replace(/%20/g, "+")
            , o = R.encrypt(t ? 'OhgkU9HlPbmmXvFpZd2zStk8HfVNHMd4cAbtuNwrpeyUyCMyNFuDHXgiAYBKgcQZNJUatazKWp7eiE4mdmqccQ9ourHF6Hz0WrjrXnbdQxDQ3JCC0i7kgXH6wwWLdSv0' : 'OhgkU9HlPbmmXvFpZd2zStk8HfVNHMd4cAbtuNwrpeyUyCMyNFuDHXgiAYBKgcQZNJUatazKWp7eiE4mdmqccQ9ourHF6Hz0WrjrXnbdQxDQ3JCC0i7kgXH6wwWLdSv0', i);
          n[a] = o
        }
    }
    return n
  },
  isBaseParams(e) {
    return "appkey" === e || "appsecret" === e || "appversion" === e || "channel" === e || "market" === e || "sign" === e
  },
  encrypt(e, t) {
    return R.bytes2HexString(R.string2Bytes(R.rc4(e, t)))
  },
  bytes2HexString(e) {
    let t = ""
      , n = "";
    for (let a = 0; a < e.length; a++)
      n = e[a].toString(16),
        1 == n.length && (n = "0" + n),
        t += n.toUpperCase();
    return t
  },
  string2Bytes(e) {
    const t = new Array;
    let n, a;
    n = e.length;
    for (let i = 0; i < n; i++)
      a = e.charCodeAt(i),
        a >= 65536 && a <= 1114111 ? (t.push(a >> 18 & 7 | 240),
          t.push(a >> 12 & 63 | 128),
          t.push(a >> 6 & 63 | 128),
          t.push(63 & a | 128)) : a >= 2048 && a <= 65535 ? (t.push(a >> 12 & 15 | 224),
            t.push(a >> 6 & 63 | 128),
            t.push(63 & a | 128)) : a >= 128 && a <= 2047 ? (t.push(a >> 6 & 31 | 192),
              t.push(63 & a | 128)) : t.push(255 & a);
    return t
  },
  rc4(e, t) {
    const n = [];
    let a, i = 0, o = 0, s = "";
    for (i = 0; i < 256; i++)
      n[i] = i;
    for (i = 0; i < 255; i++)
      o = (o + n[i] + e.charCodeAt(i % e.length)) % 256,
        a = n[i],
        n[i] = n[o],
        n[o] = a;
    i = 0,
      o = 0;
    for (let r = 0; r < t.length; r++)
      i = (i + 1) % 256,
        o = (o + n[i]) % 256,
        a = n[i],
        n[i] = n[o],
        n[o] = a,
        s += String.fromCharCode(t.charCodeAt(r) ^ n[(n[i] + n[o] % 256) % 256]);
    return s
  }
}
const a = {
  _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
  encode: function (e) {
    var t,
      n,
      i,
      o,
      s,
      r,
      c,
      l = '',
      d = 0
    e = this._utf8_encode(e)
    while (d < e.length)
      (t = e.charCodeAt(d++)),
        (n = e.charCodeAt(d++)),
        (i = e.charCodeAt(d++)),
        (o = t >> 2),
        (s = ((3 & t) << 4) | (n >> 4)),
        (r = ((15 & n) << 2) | (i >> 6)),
        (c = 63 & i),
        isNaN(n) ? (r = c = 64) : isNaN(i) && (c = 64),
        (l = l + a._keyStr.charAt(o) + a._keyStr.charAt(s) + a._keyStr.charAt(r) + a._keyStr.charAt(c))
    return l
  },
  decode: function (e) {
    var t,
      n,
      i,
      o,
      s,
      r,
      c,
      l = '',
      d = 0
    e = e.replace(/[^A-Za-z0-9\+\/\=]/g, '')
    while (d < e.length)
      (o = a._keyStr.indexOf(e.charAt(d++))),
        (s = a._keyStr.indexOf(e.charAt(d++))),
        (r = a._keyStr.indexOf(e.charAt(d++))),
        (c = a._keyStr.indexOf(e.charAt(d++))),
        (t = (o << 2) | (s >> 4)),
        (n = ((15 & s) << 4) | (r >> 2)),
        (i = ((3 & r) << 6) | c),
        (l += String.fromCharCode(t)),
        64 != r && (l += String.fromCharCode(n)),
        64 != c && (l += String.fromCharCode(i))
    return (l = a._utf8_decode(l)), l
  },
  _utf8_encode: function (e) {
    e = ('' + e).replace(/\r\n/g, '\n')
    for (var t = '', n = 0; n < e.length; n++) {
      var a = e.charCodeAt(n)
      a < 128
        ? (t += String.fromCharCode(a))
        : a > 127 && a < 2048
          ? ((t += String.fromCharCode((a >> 6) | 192)), (t += String.fromCharCode((63 & a) | 128)))
          : ((t += String.fromCharCode((a >> 12) | 224)), (t += String.fromCharCode(((a >> 6) & 63) | 128)), (t += String.fromCharCode((63 & a) | 128)))
    }
    return t
  },
  _utf8_decode: function (e) {
    var t,
      n,
      a = '',
      i = 0,
      o = (n = 0)
    while (i < e.length)
      (o = e.charCodeAt(i)),
        o < 128
          ? ((a += String.fromCharCode(o)), i++)
          : o > 191 && o < 224
            ? ((n = e.charCodeAt(i + 1)), (a += String.fromCharCode(((31 & o) << 6) | (63 & n))), (i += 2))
            : ((n = e.charCodeAt(i + 1)), (t = e.charCodeAt(i + 2)), (a += String.fromCharCode(((15 & o) << 12) | ((63 & n) << 6) | (63 & t))), (i += 3))
    return a
  }
}

S = {
  b8c7: function (e, t, n) {
    var i = 0
    function o(e) {
      return l(d(c(e), 8 * e.length))
    }
    function s(e) {
      for (var t, n = i ? '0123456789ABCDEF' : '0123456789abcdef', a = '', o = 0; o < e.length; o++) (t = e.charCodeAt(o)), (a += n.charAt((t >>> 4) & 15) + n.charAt(15 & t))
      return a
    }
    function r(e) {
      var t,
        n,
        a = '',
        i = -1
      while (++i < e.length)
        (t = e.charCodeAt(i)),
          (n = i + 1 < e.length ? e.charCodeAt(i + 1) : 0),
          t >= 55296 && t <= 56319 && n >= 56320 && n <= 57343 && ((t = 65536 + ((1023 & t) << 10) + (1023 & n)), i++),
          t <= 127
            ? (a += String.fromCharCode(t))
            : t <= 2047
              ? (a += String.fromCharCode(192 | ((t >>> 6) & 31), 128 | (63 & t)))
              : t <= 65535
                ? (a += String.fromCharCode(224 | ((t >>> 12) & 15), 128 | ((t >>> 6) & 63), 128 | (63 & t)))
                : t <= 2097151 && (a += String.fromCharCode(240 | ((t >>> 18) & 7), 128 | ((t >>> 12) & 63), 128 | ((t >>> 6) & 63), 128 | (63 & t)))
      return a
    }
    function c(e) {
      for (var t = Array(e.length >> 2), n = 0; n < t.length; n++) t[n] = 0
      for (n = 0; n < 8 * e.length; n += 8) t[n >> 5] |= (255 & e.charCodeAt(n / 8)) << n % 32
      return t
    }
    function l(e) {
      for (var t = '', n = 0; n < 32 * e.length; n += 8) t += String.fromCharCode((e[n >> 5] >>> n % 32) & 255)
      return t
    }
    function d(e, t) {
      ; (e[t >> 5] |= 128 << t % 32), (e[14 + (((t + 64) >>> 9) << 4)] = t)
      for (var n = 1732584193, a = -271733879, i = -1732584194, o = 271733878, s = 0; s < e.length; s += 16) {
        var r = n,
          c = a,
          l = i,
          d = o
          ; (n = g(n, a, i, o, e[s + 0], 7, -680876936)),
            (o = g(o, n, a, i, e[s + 1], 12, -389564586)),
            (i = g(i, o, n, a, e[s + 2], 17, 606105819)),
            (a = g(a, i, o, n, e[s + 3], 22, -1044525330)),
            (n = g(n, a, i, o, e[s + 4], 7, -176418897)),
            (o = g(o, n, a, i, e[s + 5], 12, 1200080426)),
            (i = g(i, o, n, a, e[s + 6], 17, -1473231341)),
            (a = g(a, i, o, n, e[s + 7], 22, -45705983)),
            (n = g(n, a, i, o, e[s + 8], 7, 1770035416)),
            (o = g(o, n, a, i, e[s + 9], 12, -1958414417)),
            (i = g(i, o, n, a, e[s + 10], 17, -42063)),
            (a = g(a, i, o, n, e[s + 11], 22, -1990404162)),
            (n = g(n, a, i, o, e[s + 12], 7, 1804603682)),
            (o = g(o, n, a, i, e[s + 13], 12, -40341101)),
            (i = g(i, o, n, a, e[s + 14], 17, -1502002290)),
            (a = g(a, i, o, n, e[s + 15], 22, 1236535329)),
            (n = m(n, a, i, o, e[s + 1], 5, -165796510)),
            (o = m(o, n, a, i, e[s + 6], 9, -1069501632)),
            (i = m(i, o, n, a, e[s + 11], 14, 643717713)),
            (a = m(a, i, o, n, e[s + 0], 20, -373897302)),
            (n = m(n, a, i, o, e[s + 5], 5, -701558691)),
            (o = m(o, n, a, i, e[s + 10], 9, 38016083)),
            (i = m(i, o, n, a, e[s + 15], 14, -660478335)),
            (a = m(a, i, o, n, e[s + 4], 20, -405537848)),
            (n = m(n, a, i, o, e[s + 9], 5, 568446438)),
            (o = m(o, n, a, i, e[s + 14], 9, -1019803690)),
            (i = m(i, o, n, a, e[s + 3], 14, -187363961)),
            (a = m(a, i, o, n, e[s + 8], 20, 1163531501)),
            (n = m(n, a, i, o, e[s + 13], 5, -1444681467)),
            (o = m(o, n, a, i, e[s + 2], 9, -51403784)),
            (i = m(i, o, n, a, e[s + 7], 14, 1735328473)),
            (a = m(a, i, o, n, e[s + 12], 20, -1926607734)),
            (n = p(n, a, i, o, e[s + 5], 4, -378558)),
            (o = p(o, n, a, i, e[s + 8], 11, -2022574463)),
            (i = p(i, o, n, a, e[s + 11], 16, 1839030562)),
            (a = p(a, i, o, n, e[s + 14], 23, -35309556)),
            (n = p(n, a, i, o, e[s + 1], 4, -1530992060)),
            (o = p(o, n, a, i, e[s + 4], 11, 1272893353)),
            (i = p(i, o, n, a, e[s + 7], 16, -155497632)),
            (a = p(a, i, o, n, e[s + 10], 23, -1094730640)),
            (n = p(n, a, i, o, e[s + 13], 4, 681279174)),
            (o = p(o, n, a, i, e[s + 0], 11, -358537222)),
            (i = p(i, o, n, a, e[s + 3], 16, -722521979)),
            (a = p(a, i, o, n, e[s + 6], 23, 76029189)),
            (n = p(n, a, i, o, e[s + 9], 4, -640364487)),
            (o = p(o, n, a, i, e[s + 12], 11, -421815835)),
            (i = p(i, o, n, a, e[s + 15], 16, 530742520)),
            (a = p(a, i, o, n, e[s + 2], 23, -995338651)),
            (n = h(n, a, i, o, e[s + 0], 6, -198630844)),
            (o = h(o, n, a, i, e[s + 7], 10, 1126891415)),
            (i = h(i, o, n, a, e[s + 14], 15, -1416354905)),
            (a = h(a, i, o, n, e[s + 5], 21, -57434055)),
            (n = h(n, a, i, o, e[s + 12], 6, 1700485571)),
            (o = h(o, n, a, i, e[s + 3], 10, -1894986606)),
            (i = h(i, o, n, a, e[s + 10], 15, -1051523)),
            (a = h(a, i, o, n, e[s + 1], 21, -2054922799)),
            (n = h(n, a, i, o, e[s + 8], 6, 1873313359)),
            (o = h(o, n, a, i, e[s + 15], 10, -30611744)),
            (i = h(i, o, n, a, e[s + 6], 15, -1560198380)),
            (a = h(a, i, o, n, e[s + 13], 21, 1309151649)),
            (n = h(n, a, i, o, e[s + 4], 6, -145523070)),
            (o = h(o, n, a, i, e[s + 11], 10, -1120210379)),
            (i = h(i, o, n, a, e[s + 2], 15, 718787259)),
            (a = h(a, i, o, n, e[s + 9], 21, -343485551)),
            (n = f(n, r)),
            (a = f(a, c)),
            (i = f(i, l)),
            (o = f(o, d))
      }
      return Array(n, a, i, o)
    }
    function u(e, t, n, a, i, o) {
      return f(A(f(f(t, e), f(a, o)), i), n)
    }
    function g(e, t, n, a, i, o, s) {
      return u((t & n) | (~t & a), e, t, i, o, s)
    }
    function m(e, t, n, a, i, o, s) {
      return u((t & a) | (n & ~a), e, t, i, o, s)
    }
    function p(e, t, n, a, i, o, s) {
      return u(t ^ n ^ a, e, t, i, o, s)
    }
    function h(e, t, n, a, i, o, s) {
      return u(n ^ (t | ~a), e, t, i, o, s)
    }
    function f(e, t) {
      var n = (65535 & e) + (65535 & t),
        a = (e >> 16) + (t >> 16) + (n >> 16)
      return (a << 16) | (65535 & n)
    }
    function A(e, t) {
      return (e << t) | (e >>> (32 - t))
    }
    return s(o(r(e)))
  }
}

const aesEncode = (e, t) => {
  const o = Crypto.enc.Utf8.parse("luOilfDYKv2fcSMGXHad3V5hMXAtclxQ")
    , s = Crypto.enc.Utf8.parse("0102030405060708 ")

  const n = t ? Crypto.enc.Utf8.parse(t) : o
    , a = Crypto.enc.Utf8.parse(e)

  const r = Crypto.AES.encrypt(a, n, {
    iv: s,
    mode: Crypto.mode.CBC,
    padding: Crypto.pad.Pkcs7
  });
  return r.ciphertext.toString().toUpperCase()
}
//导出R和a
module.exports = {
  R: R,
  a: a,
  aesEncode
}

// const qs = require('qs')
// console.log(
//   qs.stringify(
//     R.getParamsAPP({
//       mobileno: '17502309206',
//       _t: Math.random()
//     })
//   )
// )
console.log(a.decode('eyJyZXRjb2RlIjoiMDAwMCIsInJldG1zZyI6IiJ9'))
// console.log(a.encode("13571548722"));
// console.log(R.);
// console.log(b.a("_t=0.9371802556381867&appkey=i2n1Vu&appsecret=rYH12u&appversion=4.2.0&channel=app_web&market=AppStore&mobile=13571548722"));
