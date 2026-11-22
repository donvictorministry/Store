(function () {
  'use strict';

  var API = 'PASTE_WEB_APP_URL_HERE';
  var POLL_MS = 3600000, MAX_PINGS = 24;
  var BOOKS = [
    { id: 'prayer', t: 'The Prayer App' },
    { id: 'dontgiveup', t: "Don't Give Up" },
    { id: 'prophesy', t: 'Prophesy Your Future' },
    { id: 'frame', t: 'Frame Your World' }
  ];

  var host = document.getElementById('dvReviews');
  if (!host) return;

  /* ---------- styles ---------- */
  var css = '.dvr{display:flex;flex-direction:column;gap:14px;width:100%}' +
    '.dvr-h{color:#0A3F8F;font-size:23px;font-weight:900;line-height:1.3}' +
    '.dvr-sum{display:flex;gap:16px;align-items:center}' +
    '.dvr-avg{display:flex;flex-direction:column;align-items:center;gap:4px;min-width:96px}' +
    '.dvr-avg b{font-size:52px;line-height:1;color:#121212;font-weight:900}' +
    '.dvr-avg small{font-size:17px;color:#303030}' +
    '.dvr-bars{flex:1;display:flex;flex-direction:column;gap:6px;min-width:0}' +
    '.dvr-bar{display:flex;align-items:center;gap:8px;font-size:17px;color:#303030}' +
    '.dvr-bar i{flex:1;height:10px;border-radius:5px;background:#DDE5F2;overflow:hidden;display:block}' +
    '.dvr-bar u{display:block;height:100%;background:#0A3F8F;text-decoration:none}' +
    '.dvr-stars{display:inline-flex;gap:2px}' +
    '.dvr-st{display:inline-flex;border:0;background:none;padding:0}' +
    '.dvr-st svg{width:22px;height:22px;fill:#CBD3E1;display:block}' +
    '.dvr-st.on svg{fill:#E9B93C}' +
    '.dvr-rate{display:flex;flex-direction:column;align-items:center;gap:8px}' +
    '.dvr-rate p{font-size:19px;font-weight:500;color:#303030}' +
    '.dvr-big .dvr-st svg{width:42px;height:42px}' +
    '.dvr-card{background:#F0F4FA;border-radius:14px;padding:16px;display:flex;flex-direction:column;gap:8px}' +
    '.dvr-top{display:flex;align-items:center;gap:12px}' +
    '.dvr-av{width:44px;height:44px;border-radius:50%;background:#0A3F8F;color:#E9B93C;font-weight:900;font-size:19px;display:flex;align-items:center;justify-content:center;flex-shrink:0}' +
    '.dvr-who{display:flex;flex-direction:column;min-width:0}' +
    '.dvr-who b{font-size:19px;color:#121212}' +
    '.dvr-who small{font-size:17px;color:#303030}' +
    '.dvr-meta{display:flex;align-items:center;gap:10px;flex-wrap:wrap}' +
    '.dvr-meta .dvr-st svg{width:18px;height:18px}' +
    '.dvr-chip{font-size:17px;font-weight:700;color:#0A3F8F;background:#fff;border:1px solid rgba(10,63,143,.2);border-radius:999px;padding:2px 12px}' +
    '.dvr-tx{font-size:19px;line-height:1.55;color:#121212;overflow-wrap:anywhere}' +
    '.dvr-help{align-self:flex-start;min-height:44px;border:2px solid #0A3F8F;background:#fff;color:#0A3F8F;border-radius:999px;padding:6px 18px;font-size:17px;font-weight:900;font-family:inherit;cursor:pointer;white-space:nowrap}' +
    '.dvr-help.done{background:#0A3F8F;color:#fff}' +
    '.dvr-btn{width:100%;min-height:56px;border:3px solid #E9B93C;border-radius:999px;background:#0A3F8F;color:#fff;font-family:inherit;font-size:19px;font-weight:900;line-height:1.2;padding:10px 16px;white-space:nowrap;cursor:pointer;-webkit-tap-highlight-color:transparent}' +
    '.dvr-btn:active{transform:scale(.97)}' +
    '.dvr-btn.ghost{background:#fff;color:#0A3F8F;border-color:#0A3F8F}' +
    '.dvr-btn.danger{background:#C62828;border-color:#C62828}' +
    '.dvr-ov{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:3000;display:flex;align-items:center;justify-content:center}' +
    '.dvr-box{width:92%;max-height:88dvh;overflow-y:auto;background:#fff;border-radius:20px;padding:22px;display:flex;flex-direction:column;gap:14px;color:#121212}' +
    '.dvr-mt{color:#0A3F8F;font-size:23px;font-weight:900;line-height:1.3}' +
    '.dvr-mb{font-size:19px;line-height:1.55;display:flex;flex-direction:column;gap:12px}' +
    '.dvr-ma{display:flex;flex-direction:column;gap:10px}' +
    '.dvr-lbl{font-size:19px;font-weight:900;color:#0A3F8F}' +
    '.dvr-opt{display:flex;flex-direction:column;gap:8px}' +
    '.dvr-pick{width:100%;min-height:52px;text-align:left;border:2px solid rgba(10,63,143,.25);border-radius:14px;background:#fff;color:#121212;font-family:inherit;font-size:19px;font-weight:500;padding:10px 14px;cursor:pointer}' +
    '.dvr-pick.on{border-color:#0A3F8F;background:#F0F4FA;font-weight:900;color:#0A3F8F}' +
    '.dvr-ta{width:100%;min-height:120px;border:2px solid rgba(10,63,143,.25);border-radius:14px;padding:12px;font-family:inherit;font-size:19px;line-height:1.5;resize:vertical}' +
    '.dvr-cnt{font-size:17px;color:#303030;text-align:right}' +
    '.dvr-sp{position:fixed;inset:0;z-index:4000;background:rgba(255,255,255,.55);display:flex;align-items:center;justify-content:center}' +
    '.dvr-sp i{width:56px;height:56px;border:6px solid #DDE5F2;border-top-color:#0A3F8F;border-radius:50%;animation:dvrsp .8s linear infinite}' +
    '@keyframes dvrsp{to{transform:rotate(360deg)}}' +
    '.dvr-toast{position:fixed;left:50%;bottom:28px;transform:translateX(-50%);z-index:5000;background:#323232;color:#fff;font-size:17px;border-radius:999px;padding:12px 22px;width:max-content;box-shadow:0 4px 14px rgba(0,0,0,.3)}';
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  /* ---------- tiny DOM and UI kit ---------- */
  function h(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  var STAR = '<svg viewBox="0 0 24 24"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/></svg>';
  function stars(n, cls) {
    var s = h('span', 'dvr-stars ' + (cls || ''));
    for (var i = 0; i < 5; i++) {
      var x = h('span', 'dvr-st' + (i < Math.round(n) ? ' on' : ''));
      x.innerHTML = STAR;
      s.appendChild(x);
    }
    return s;
  }
  function modal(o) {
    var ov = h('div', 'dvr-ov'), bx = h('div', 'dvr-box'), mb = h('div', 'dvr-mb'), ac = h('div', 'dvr-ma');
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');
    if (o.title) bx.appendChild(h('h3', 'dvr-mt', o.title));
    if (typeof o.body === 'string') mb.appendChild(h('p', '', o.body));
    else if (o.body) mb.appendChild(o.body);
    bx.appendChild(mb);
    function close() { if (ov.parentNode) ov.parentNode.removeChild(ov); }
    (o.actions || [{ t: 'OK' }]).forEach(function (a) {
      var b = h('button', 'dvr-btn ' + (a.k || ''), a.t);
      b.type = 'button';
      b.onclick = function () { if (a.f && a.f(close) === false) return; close(); };
      ac.appendChild(b);
    });
    bx.appendChild(ac);
    ov.appendChild(bx);
    document.body.appendChild(ov);
    return close;
  }
  function notice(title, msg) { modal({ title: title, body: msg }); }
  var spEl = null;
  function spin(on) {
    if (on && !spEl) { spEl = h('div', 'dvr-sp'); spEl.appendChild(h('i')); document.body.appendChild(spEl); }
    if (!on && spEl) { spEl.parentNode.removeChild(spEl); spEl = null; }
  }
  function toast(msg) {
    var t = h('div', 'dvr-toast', msg);
    document.body.appendChild(t);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 3000);
  }

  /* ---------- storage, identity, analytics meta ---------- */
  function get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  var S = get('dv_rv_state') || {};
  var VOTED = get('dv_rv_voted') || {};
  function wat() { return new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Lagos' }); }

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

  /* ---------- backend ---------- */
  async function post(body, quiet) {
    if (!API || API.indexOf('PASTE') === 0) { if (!quiet) notice('Not connected', 'The review system is not connected yet.'); return null; }
    try {
      var r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body), redirect: 'follow' });
      return await r.json();
    } catch (e) {
      return { ok: false, msg: 'Network problem. Please check your connection and try again.' };
    }
  }
  function apply(r) {
    if (!r || !r.ok || r.skip) return false;
    if (r.cfg) S.cfg = r.cfg;
    if (r.sum) S.sum = r.sum;
    if (r.items) { S.items = r.items; S.more = !!r.more; }
    if (r.v) S.v = r.v;
    set('dv_rv_state', S);
    return true;
  }

  /* ---------- render ---------- */
  function render() {
    host.innerHTML = '';
    var c = S.cfg || {};
    if (c.re === false) return;
    var w = h('div', 'dvr'), all = (S.sum && S.sum.all) || { n: 0, a: 0, d: [0, 0, 0, 0, 0] };
    w.appendChild(h('h2', 'dvr-h', 'Ratings & Reviews'));

    var sum = h('div', 'dvr-sum'), avg = h('div', 'dvr-avg');
    avg.appendChild(h('b', '', all.n ? all.a.toFixed(1) : '0.0'));
    avg.appendChild(stars(all.a));
    avg.appendChild(h('small', '', all.n + (all.n === 1 ? ' rating' : ' ratings')));
    var bars = h('div', 'dvr-bars');
    for (var i = 5; i >= 1; i--) {
      var row = h('div', 'dvr-bar'), tr = h('i'), fl = h('u');
      fl.style.width = (all.n ? Math.round(all.d[i - 1] / all.n * 100) : 0) + '%';
      tr.appendChild(fl);
      row.appendChild(h('span', '', String(i)));
      row.appendChild(tr);
      bars.appendChild(row);
    }
    sum.appendChild(avg); sum.appendChild(bars);
    w.appendChild(sum);

    if (c.sub !== false || c.ra !== false) {
      var rate = h('div', 'dvr-rate');
      rate.appendChild(h('p', '', 'Tap a star to rate'));
      var big = h('span', 'dvr-stars dvr-big');
      for (var k = 1; k <= 5; k++) (function (n) {
        var b = h('button', 'dvr-st'); b.type = 'button'; b.innerHTML = STAR; b.setAttribute('aria-label', n + ' star');
        b.onclick = function () { openForm(n); };
        big.appendChild(b);
      })(k);
      rate.appendChild(big);
      w.appendChild(rate);
      var wb = h('button', 'dvr-btn', 'Write a review'); wb.type = 'button';
      wb.onclick = function () { openForm(0); };
      w.appendChild(wb);
    }

    if (c.ur !== false) {
      if (!S.items) {
        var lb = h('button', 'dvr-btn ghost', 'Load reviews'); lb.type = 'button';
        lb.onclick = function () { load(0); };
        w.appendChild(lb);
      } else {
        if (!S.items.length) w.appendChild(h('p', 'dvr-tx', 'No reviews yet. Be the first to share your thoughts.'));
        S.items.forEach(function (x) { w.appendChild(card(x, c)); });
        if (S.more) {
          var mb = h('button', 'dvr-btn ghost', 'Show more reviews'); mb.type = 'button';
          mb.onclick = function () { load(S.items.length); };
          w.appendChild(mb);
        }
      }
    }
    host.appendChild(w);
  }

  function card(x, c) {
    var d = h('div', 'dvr-card'), top = h('div', 'dvr-top'), who = h('div', 'dvr-who');
    top.appendChild(h('div', 'dvr-av', (x.u || 'R').charAt(0)));
    who.appendChild(h('b', '', 'Reader ' + x.u));
    who.appendChild(h('small', '', x.d));
    top.appendChild(who);
    d.appendChild(top);
    var m = h('div', 'dvr-meta');
    m.appendChild(stars(x.s));
    m.appendChild(h('span', 'dvr-chip', x.t));
    d.appendChild(m);
    d.appendChild(h('p', 'dvr-tx', x.x));
    if (c.vo !== false) {
      var b = h('button', 'dvr-help' + (VOTED[x.i] ? ' done' : ''), (VOTED[x.i] ? 'Helpful ' : 'Helpful? ') + '(' + x.h + ')');
      b.type = 'button';
      b.onclick = function () { vote(x); };
      d.appendChild(b);
    }
    return d;
  }

  /* ---------- explicit actions ---------- */
  async function load(off) {
    spin(true);
    var r = await post({ a: 'reviews', o: off });
    spin(false);
    if (r && r.ok) {
      if (r.cfg) S.cfg = r.cfg;
      if (r.sum) S.sum = r.sum;
      if (r.items) { S.items = off ? (S.items || []).concat(r.items) : r.items; S.more = !!r.more; }
      set('dv_rv_state', S);
      render();
    } else if (r) notice('Reviews', r.msg || 'Unable to load reviews right now.');
  }

  async function vote(x) {
    if (VOTED[x.i]) { toast('You already marked this as helpful.'); return; }
    spin(true);
    var ids = await ident(), m = await meta();
    var r = await post({ a: 'vote', u: ids.u, d: ids.d, r: x.i, m: m });
    spin(false);
    if (r && r.ok) {
      x.h = r.h; VOTED[x.i] = 1; set('dv_rv_voted', VOTED); set('dv_rv_state', S);
      render(); toast('Thanks for your feedback.');
    } else if (r) notice('Helpful vote', r.msg || 'Unable to record your vote.');
  }

  function openForm(pre) {
    var c = S.cfg || {}, max = c.max || 300, book = '', rating = pre || 0;
    var body = h('div', 'dvr-mb');
    body.appendChild(h('p', 'dvr-lbl', 'Choose a book'));
    var opt = h('div', 'dvr-opt'), picks = [];
    BOOKS.forEach(function (b) {
      var p = h('button', 'dvr-pick', b.t); p.type = 'button';
      p.onclick = function () { book = b.id; picks.forEach(function (q) { q.className = 'dvr-pick'; }); p.className = 'dvr-pick on'; };
      picks.push(p); opt.appendChild(p);
    });
    body.appendChild(opt);
    body.appendChild(h('p', 'dvr-lbl', 'Your rating'));
    var sr = h('span', 'dvr-stars dvr-big'), sb = [];
    function paint() { sb.forEach(function (b, i) { b.className = 'dvr-st' + (i < rating ? ' on' : ''); }); }
    for (var i = 1; i <= 5; i++) (function (n) {
      var b = h('button', 'dvr-st'); b.type = 'button'; b.innerHTML = STAR; b.setAttribute('aria-label', n + ' star');
      b.onclick = function () { rating = n; paint(); };
      sb.push(b); sr.appendChild(b);
    })(i);
    paint();
    body.appendChild(sr);
    body.appendChild(h('p', 'dvr-lbl', 'Your review (optional for a quick rating)'));
    var ta = h('textarea', 'dvr-ta'); ta.maxLength = max; ta.placeholder = 'Share your thoughts about this e-book';
    var cnt = h('p', 'dvr-cnt', '0/' + max);
    ta.oninput = function () { cnt.textContent = ta.value.length + '/' + max; };
    body.appendChild(ta); body.appendChild(cnt);

    modal({
      title: 'Rate & Review', body: body,
      actions: [
        { t: 'Submit', f: function (close) { submit(close); return false; } },
        { t: 'Cancel', k: 'ghost' }
      ]
    });

    async function submit(close) {
      var txt = ta.value.trim();
      if (!book) { toast('Please choose a book.'); return; }
      if (!rating) { toast('Please tap a star rating.'); return; }
      if (txt && txt.length < 5) { toast('Please write a little more.'); return; }
      spin(true);
      var ids = await ident(), m = await meta(), isRev = !!txt;
      var r = await post({ a: isRev ? 'review' : 'rate', u: ids.u, d: ids.d, b: book, s: rating, x: txt, m: m });
      spin(false);
      if (r && r.ok) {
        close();
        apply(r); render();
        var b2 = h('div', 'dvr-mb');
        b2.appendChild(h('p', '', isRev ? r.msg : 'Thank you for rating.'));
        if (isRev && r.status === 'Pending') b2.appendChild(h('p', '', 'It will appear once it has been approved.'));
        modal({ title: 'Thank you', body: b2 });
      } else if (r) notice('Unable to submit', r.msg || 'Something went wrong. Please try again.');
    }
  }

  /* ---------- hourly ping (only while the app stays open) ---------- */
  async function ping() {
    if (!navigator.onLine) return;
    var p = get('dv_rv_pc') || {};
    if (p.d !== wat()) p = { d: wat(), n: 0 };
    if (p.n >= MAX_PINGS) return;
    p.n++; set('dv_rv_pc', p);
    var ids = await ident();
    var r = await post({ a: 'poll', m: 'r', d: ids.d }, true);
    if (apply(r)) { render(); announce(); }
  }
  setInterval(ping, POLL_MS);
  try {
    var bc = new BroadcastChannel('dv-ebook');
    bc.onmessage = function (e) { if (e.data === 'purge') ping(); };
  } catch (e) {}

  function announce() {
    var a = S.cfg && S.cfg.an;
    if (!a || !a.x) return;
    try { if (localStorage.getItem('dv_rv_ann') === a.i) return; localStorage.setItem('dv_rv_ann', a.i); } catch (e) {}
    modal({ title: 'Announcement', body: a.x });
  }

  render();
  announce();
})();
