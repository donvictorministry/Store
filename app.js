(function () {
  'use strict';

  /* Payment and contact details exist only as this encoded string.
     They are decoded in memory to draw the QR code and appear nowhere on the page. */
  var DV_SECRET = 'NDcJPyQ3MVIgMwQzKDU2eCYXPhlbWTUTCBsAExhzJBEHGSUcFVkrBwkUNQBbWVVDVkVkR1dOXUtuNzMRDgwLBkQ4MR8EQ0UxDAQ5AUEzChoKBT8ca3MmPSoiETE1WSE3MDcZPjJzMRcITHBZU0pRKjwuCCo5IT0qPHwVHwAQCUhEBSUCERYXBiQbORwIChEAHVg/AAY=';
  var DV_KEY = 'dvPrayer';

  var CONFIG = {
    waUrl: 'https://wa.me/234XXXXXXXXXX',
    dark: '#0A3F8F',
    light: '#FFFFFF'
  };

  function dvDecode(b64, key) {
    var s = atob(b64), out = '';
    for (var i = 0; i < s.length; i++) {
      out += String.fromCharCode(s.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return decodeURIComponent(escape(out));
  }

  var container = document.getElementById('qr-container');
  var svg = null;

  try {
    svg = window.dvQR.render(dvDecode(DV_SECRET, DV_KEY), CONFIG.dark, CONFIG.light);
  } catch (e) {
    svg = null;
  }

  if (container) {
    if (svg) container.innerHTML = svg;
    else container.textContent = 'Unable to generate QR code. Please verify the payment details.';
  }

  var wa = document.querySelectorAll('[data-dv-wa]');
  for (var w = 0; w < wa.length; w++) wa[w].href = CONFIG.waUrl;

  var stack = [];

  function dvLock() {
    if (stack.length) document.body.classList.add('dv-lock');
    else document.body.classList.remove('dv-lock');
  }

  function dvOpen(id) {
    var page = document.getElementById(id);
    if (!page) return;
    stack.push(page);
    page.style.zIndex = 100 + stack.length;
    page.hidden = false;
    page.scrollTop = 0;
    dvLock();
    var back = page.querySelector('.dv-back');
    if (back) back.focus();
  }

  function dvClose() {
    var page = stack.pop();
    if (page) page.hidden = true;
    dvLock();
  }

  function dvHome() {
    while (stack.length) stack.pop().hidden = true;
    dvLock();
  }

  var openers = document.querySelectorAll('[data-dv-open]');
  for (var o = 0; o < openers.length; o++) {
    openers[o].addEventListener('click', function () {
      dvOpen(this.getAttribute('data-dv-open'));
    });
  }

  var closers = document.querySelectorAll('[data-dv-close]');
  for (var c = 0; c < closers.length; c++) {
    closers[c].addEventListener('click', dvClose);
  }

  var homers = document.querySelectorAll('[data-dv-home]');
  for (var h = 0; h < homers.length; h++) {
    homers[h].addEventListener('click', dvHome);
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    });
  }
})();
