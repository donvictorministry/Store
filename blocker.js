/* blocker.js: self-contained desktop computer blocker.
   Load it FIRST inside <head>. To remove it completely, delete the <script src="blocker.js"> line.
   Blocked: Windows, macOS, Linux, ChromeOS, smart TVs, game consoles and Android "Desktop site" mode.
   Allowed: Android and Apple touch devices (phones and tablets). */
(function () {
  'use strict';

  var CUT_NETWORK = true;   /* blocked devices cannot call your backend; set to false to turn this off */

  var d = document.documentElement, ua = navigator.userAgent || '', plat = navigator.platform || '';
  var pts = navigator.maxTouchPoints || 0;
  var tv = /SMART-?TV|Tizen|Web0S|WebOS|CrKey|AppleTV|GoogleTV|BRAVIA|Roku|Xbox|PlayStation/i.test(ua);
  var android = /Android/i.test(ua);
  var apple = /iPhone|iPod|iPad/i.test(ua) || (plat === 'MacIntel' && pts > 1);

  if (!tv && pts > 0 && (android || apple)) return;      /* a phone or tablet: let the app run */

  window.__DV_BLOCKED = true;
  if (CUT_NETWORK) {
    window.fetch = function () { return Promise.reject(new TypeError('Blocked')); };
    try { navigator.sendBeacon = function () { return false; }; } catch (e) {}
  }

  var st = document.createElement('style');
  st.textContent = 'html.dvb,html.dvb body{overflow:hidden!important;background:#0A3F8F!important}' +
    'html.dvb body>*:not(#dvb){display:none!important}' +
    '#dvb{position:fixed;inset:0;z-index:2147483647;background:#0A3F8F;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;padding:28px;text-align:center;font-family:Roboto,Arial,sans-serif}' +
    '#dvb svg{color:#E9B93C}' +
    '#dvb h2{color:#E9B93C;font-size:29px;font-weight:900;line-height:1.3}' +
    '#dvb p{font-size:19px;line-height:1.6}';
  document.head.appendChild(st);
  d.className += ' dvb';

  function show() {
    if (document.getElementById('dvb')) return;
    var b = document.createElement('div');
    b.id = 'dvb';
    b.setAttribute('role', 'alert');
    b.innerHTML = '<svg viewBox="0 0 24 24" width="72" height="72" fill="currentColor" aria-hidden="true"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zM17 19H7V5h10v14z"/></svg>' +
      '<h2>Phones and tablets only</h2>' +
      '<p>This app works on Android and iPhone devices. Desktop computers are not supported. If you are on a phone or tablet and see this, turn off "Desktop site" in your browser menu.</p>';
    document.body.appendChild(b);
  }
  if (document.body) show(); else document.addEventListener('DOMContentLoaded', show);
})();
