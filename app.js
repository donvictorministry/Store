(function () {
  'use strict';
  
  var DETAILS = {
    bankName: 'PalmPay',
    accountName: 'Don Victor',
    accountNumber: '8961346380',
    telephone: '+2347035794649',
    email: 'donvictorministry@gmail.com',
    facebook: 'facebook.com/Rev.DonVictor'
  };

  var CONFIG = {
    waUrl: 'https://wa.me/2347035794649',
    dark: '#0A3F8F',
    light: '#FFFFFF'
  };

  var PAYLOAD =
    'PAYMENT DETAILS\n' +
    'Bank: ' + DETAILS.bankName + '\n' +
    'Account Name: ' + DETAILS.accountName + '\n' +
    'Account Number: ' + DETAILS.accountNumber + '\n\n' +
    'CONTACT DETAILS\n' +
    'Tel: ' + DETAILS.telephone + '\n' +
    'Email: ' + DETAILS.email + '\n' +
    'Facebook: ' + DETAILS.facebook;

  var container = document.getElementById('qr-container');
  var svg = null;

  try {
    svg = window.dvQR.render(PAYLOAD, CONFIG.dark, CONFIG.light);
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
