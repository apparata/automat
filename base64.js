/*
 * base64.js - Base64 encoding and decoding functions
 *
 * See: http://developer.mozilla.org/en/docs/DOM:window.btoa
 *      http://developer.mozilla.org/en/docs/DOM:window.atob
 *
 * Copyright (c) 2007, David Lindquist <david.lindquist@gmail.com>
 * Released under the MIT license
 */

if (typeof btoa == 'undefined') {
    function btoa(str) {
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        var encoded = [];
        var c = 0;
        while (c < str.length) {
            var b0 = str.charCodeAt(c++);
            var b1 = str.charCodeAt(c++);
            var b2 = str.charCodeAt(c++);
            var buf = (b0 << 16) + ((b1 || 0) << 8) + (b2 || 0);
            var i0 = (buf & (63 << 18)) >> 18;
            var i1 = (buf & (63 << 12)) >> 12;
            var i2 = isNaN(b1) ? 64 : (buf & (63 << 6)) >> 6;
            var i3 = isNaN(b2) ? 64 : (buf & 63);
            encoded[encoded.length] = chars.charAt(i0);
            encoded[encoded.length] = chars.charAt(i1);
            encoded[encoded.length] = chars.charAt(i2);
            encoded[encoded.length] = chars.charAt(i3);
        }
        return encoded.join('');
    }
}
