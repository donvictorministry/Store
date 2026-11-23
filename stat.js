/* eBook Store: stat.js  */

(function () {
  'use strict';

  var API = 'https://script.google.com/macros/s/AKfycbxsfpjqWuvuoiYvJXGYqnr4zx1nTX-NMHH65GKoQ7073Kb7iLNExtEt_YAd9skssQgWpQ/exec';
  var POLL_MS = 3600000, MAX_PINGS = 24;
  var host = document.getElementById('dvStat');
  if (!host) return;

  var css = '.dvs{display:flex;gap:10px;width:100%}' +
    '.dvs-t{flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;gap:4px;padding:14px 4px;background:#fff;border:1px solid rgba(10,63,143,.14);border-radius:14px;font-family:inherit;color:#0A3F8F;cursor:pointer;-webkit-tap-highlight-color:transparent}' +
    '.dvs-t:active{transform:scale(.96)}' +
    '.dvs-t svg{width:28px;height:28px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}' +
    '.dvs-t.liked svg{fill:#E53935;stroke:#E53935}' +
    '.dvs-n{font-size:23px;font-weight:900;line-height:1.2;white-space:nowrap}' +
    '.dvs-l{font-size:17px;font-weight:500;color:#303030;white-space:nowrap}' +
    '.dvs-toast{position:fixed;left:50%;bottom:28px;transform:translateX(-50%);z-index:5000;background:#323232;color:#fff;font-size:17px;border-radius:999px;padding:12px 22px;width:max-content;box-shadow:0 4px 14px rgba(0,0,0,.3)}';
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  var ICON = {
    v: '<svg viewBox="0 0 24 24"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    l: '<svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
    r: '<svg viewBox="0 0 24 24"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/></svg>'
  };

  function get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function wat() { return new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Lagos' }); }
  function toast(msg) {
    var t = document.createElement('div');
    t.className = 'dvs-toast'; t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 3000);
  }
  function fmt(n) {
    n = Number(n) || 0;
    if (n < 1000) return String(n);
    if (n < 1e6) return (n / 1000).toFixed(n < 10000 ? 1 : 0).replace('.0', '') + 'K';
    return (n / 1e6).toFixed(1).replace('.0', '') + 'M';
  }

  var S = get('dv_st_state') || null;
  var tiles = {};

  function build() {
    var w = document.createElement('div');
    w.className = 'dvs';
    [['v', 'Views'], ['l', 'Likes'], ['r', 'Reviews']].forEach(function (d) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'dvs-t';
      b.innerHTML = ICON[d[0]];
      var n = document.createElement('span'); n.className = 'dvs-n';
      var l = document.createElement('span'); l.className = 'dvs-l'; l.textContent = d[1];
      b.appendChild(n); b.appendChild(l);
      b.setAttribute('aria-label', d[1]);
      tiles[d[0]] = { b: b, n: n };
      w.appendChild(b);
    });
    tiles.v.b.onclick = function () { toast('Total visits to this store.'); };
    tiles.l.b.onclick = like;
    tiles.r.b.onclick = function () {
      var t = document.getElementById('dvReviews');
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    host.appendChild(w);
  }
  function paint() {
    ['v', 'l', 'r'].forEach(function (k) { tiles[k].n.textContent = S ? fmt(S[k]) : '\u2014'; });
    tiles.l.b.className = 'dvs-t' + (get('dv_st_like') === wat() ? ' liked' : '');
  }
  function apply(r) {
    if (!r || !r.ok || !r.stat) return false;
    S = { v: r.stat.v, l: r.stat.l, r: r.stat.r };
    set('dv_st_state', S);
    paint();
    return true;
  }

  /* identity (same device fingerprint and user id as review.js) */
  var idCache = null;
  async function fingerprint() {
    var n = navigator, c = '', g = '';
    try {
      var cv = document.createElement('canvas'); cv.width = 200; cv.height = 40;
      var x = cv.getContext('2d'); x.textBaseline = 'top'; x.font = '16px Arial'; x.fillStyle = '#069'; x.fillText('eBook Store 1234', 4, 4);
      c = cv.toDataURL().slice(-80);
    } catch (e) {}
    try {
      var gl = document.createElement('canvas').getContext('webgl'), ex = gl && gl.getExtension('WEBGL_debug_renderer_info');
      g = ex ? gl.getParameter(ex.UNMASKED_RENDERER_WEBGL) : '';
    } catch (e) {}
    var s = [n.userAgent, n.language, (n.languages || []).join(','), n.platform, n.hardwareConcurrency, n.deviceMemory, n.maxTouchPoints,
      Math.max(screen.width, screen.height) + 'x' + Math.min(screen.width, screen.height), screen.colorDepth, window.devicePixelRatio,
      (Intl.DateTimeFormat().resolvedOptions() || {}).timeZone, c, g].join('|');
    if (window.crypto && crypto.subtle) {
      var b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
      return 'D' + Array.from(new Uint8Array(b)).map(function (v) { return v.toString(16).padStart(2, '0'); }).join('').slice(0, 40);
    }
    var k = 5381; for (var i = 0; i < s.length; i++) k = ((k << 5) + k + s.charCodeAt(i)) | 0;
    return 'D' + Math.abs(k).toString(36) + s.length;
  }
  async function ident() {
    if (idCache) return idCache;
    var d = await fingerprint(), u = null;
    try { u = localStorage.getItem('dv_uid'); } catch (e) {}
    if (!u) {
      u = 'U' + Array.from(crypto.getRandomValues(new Uint8Array(10))).map(function (v) { return v.toString(16).padStart(2, '0'); }).join('');
      try { localStorage.setItem('dv_uid', u); } catch (e) {}
    }
    idCache = { u: u, d: d };
    return idCache;
  }
  async function meta() {
    try { var m = sessionStorage.getItem('dv_meta'); if (m) return JSON.parse(m); } catch (e) {}
    var o = { la: navigator.language || '', pl: navigator.platform || '', sc: screen.width + 'x' + screen.height, ua: navigator.userAgent || '' };
    try {
      var ac = new AbortController(), t = setTimeout(function () { ac.abort(); }, 2500);
      var r = await fetch('https://ipapi.co/json/', { signal: ac.signal });
      clearTimeout(t);
      var j = await r.json();
      o.ci = j.city || ''; o.re = j.region || ''; o.co = j.country_name || ''; o.isp = j.org || ''; o.tz = j.timezone || '';
    } catch (e) {}
    try { sessionStorage.setItem('dv_meta', JSON.stringify(o)); } catch (e) {}
    return o;
  }
  async function post(body) {
    if (!API || API.indexOf('PASTE') === 0) return null;
    try {
      var r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body), redirect: 'follow' });
      return await r.json();
    } catch (e) { return null; }
  }

  /* buyer-intent events: queued on the phone, sent with the next explicit request or the hourly ping */
  var EVMAP = { dvAbout: 'prayer', dvDontGiveUp: 'dontgiveup', dvProphesy: 'prophesy', dvFrame: 'frame' };
  var lastBook = '';
  function queue(ev, book) {
    var q = get('dv_st_q') || [];
    q.push([ev, book || '']);
    set('dv_st_q', q.slice(-30));
  }
  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('[data-dv-open],[data-dv-wa],[data-dv-wa-invoice]') : null;
    if (!t) return;
    var id = t.getAttribute('data-dv-open');
    if (id) { if (EVMAP[id]) { lastBook = EVMAP[id]; queue('BookClick', lastBook); } }
    else queue('WhatsAppClick', lastBook);
  }, true);
  try {
    var qr = document.querySelector('.flyer-qr'), seenQr = false;
    if (qr && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (en) { if (en.isIntersecting && !seenQr) { seenQr = true; queue('QRView', lastBook); } });
      }, { threshold: 0.6 }).observe(qr);
    }
  } catch (e) {}
  async function send(body) {
    var q = get('dv_st_q') || [], n = Math.min(q.length, 10);
    if (n) body.ev = q.slice(0, n);
    var r = await post(body);
    if (n && r && r.ok) set('dv_st_q', (get('dv_st_q') || []).slice(n));
    return r;
  }

  /* explicit actions */
  async function like() {
    if (get('dv_st_like') === wat()) { toast('You have already liked this today.'); return; }
    var ids = await ident(), m = await meta();
    var r = await send({ a: 'like', u: ids.u, d: ids.d, m: m });
    if (r && r.ok) { set('dv_st_like', wat()); apply(r); toast('Thank you for the love.'); }
    else if (r && r.code === 'DAILY') { set('dv_st_like', wat()); paint(); toast(r.msg); }
    else toast((r && r.msg) || 'Unable to like right now.');
  }

  var counted = false;
  function first() {
    if (counted) return;
    counted = true;
    window.removeEventListener('pointerdown', first, true);
    window.removeEventListener('scroll', first, true);
    try { if (sessionStorage.getItem('dv_st_v')) return; sessionStorage.setItem('dv_st_v', '1'); } catch (e) {}
    (async function () {
      var ids = await ident(), m = await meta();
      apply(await send({ a: 'view', u: ids.u, d: ids.d, m: m }));
    })();
  }
  window.addEventListener('pointerdown', first, true);
  window.addEventListener('scroll', first, true);

  /* hourly ping (only while the app stays open) */
  async function ping() {
    if (!navigator.onLine) return;
    var p = get('dv_st_pc') || {};
    if (p.d !== wat()) p = { d: wat(), n: 0 };
    if (p.n >= MAX_PINGS) return;
    p.n++; set('dv_st_pc', p);
    var ids = await ident(), mt = null;
    try { mt = JSON.parse(sessionStorage.getItem('dv_meta')); } catch (e) {}
    apply(await send({ a: 'poll', m: 's', u: ids.u, d: ids.d, mt: mt }));
  }
  setInterval(ping, POLL_MS);
  try {
    var bc = new BroadcastChannel('dv-ebook');
    bc.onmessage = function (e) { if (e.data === 'purge') ping(); };
  } catch (e) {}

  /* review.js hands over fresh totals after a review or a refresh (no request needed) */
  window.addEventListener('dv-stat', function (e) { apply({ ok: true, stat: e.detail }); });

  build();
  paint();
})();
