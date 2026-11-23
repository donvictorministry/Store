/* eBook Store: ticker.js (self-contained "Are you new?" task ticker) */

(function () {
  'use strict';

  /* ---------- edit the words and actions here ---------- */
  var TITLE = 'Are you new?';
  var PICK_LABEL = 'Pick a task';
  var ROWS = [
    [
      ['Reach out to the man of God', 'reach'],
      ['Which of the book is your favorite?', 'favorite'],
      ['Scan QR code for donation details', 'qr'],
      ['Drop your invoice at WhatsApp', 'invoice'],
      ['Cannot Scan?', 'cannot']
    ],
    [
      ['Vote at least', 'vote'],
      ['What do you think about this platform', 'think'],
      ['Learn something', 'learn'],
      ['you will receive quick response', 'quick'],
      ['Explore technology', 'explore']
    ]
  ];
  var BOOKS = [
    ['The Prayer App', 'dvAbout'],
    ["Don't Give Up", 'dvDontGiveUp'],
    ['Prophesy Your Future', 'dvProphesy'],
    ['Frame Your World', 'dvFrame']
  ];

  var anchor = document.querySelector('.card-transaction');
  if (!anchor || !anchor.parentNode) return;

  /* ---------- styles ---------- */
  var css = '.dvt{background:#F0F4FA;padding-left:0;padding-right:0;gap:16px}' +
    '.dvt-h{color:#0A3F8F;font-size:27px;font-weight:900;line-height:1.35;text-align:center;padding:0 20px}' +
    '.dvt-row{width:100%;overflow:hidden;-webkit-mask-image:linear-gradient(to right,transparent,#000 9%,#000 91%,transparent);mask-image:linear-gradient(to right,transparent,#000 9%,#000 91%,transparent)}' +
    '.dvt-track{display:flex;width:max-content;animation:dvtL 32s linear infinite}' +
    '.dvt-row.rev .dvt-track{animation-name:dvtR;animation-duration:38s}' +
    '.dvt-row:active .dvt-track{animation-play-state:paused}' +
    '.dvt-pill{flex-shrink:0;margin-right:12px;min-height:56px;border:2px solid #E9B93C;border-radius:999px;background:#fff;color:#0A3F8F;font-family:inherit;font-size:19px;font-weight:700;line-height:1.2;padding:12px 24px;white-space:nowrap;cursor:pointer;-webkit-tap-highlight-color:transparent}' +
    '.dvt-row.rev .dvt-pill{background:#0A3F8F;color:#fff}' +
    '.dvt-pill:active{transform:scale(.96)}' +
    '.dvt-go{width:calc(100% - 40px);margin:6px 20px 0;min-height:60px;border:3px solid #E9B93C;border-radius:999px;background:#0A3F8F;color:#fff;font-family:inherit;font-size:clamp(17px,4.9vw,21px);font-weight:900;line-height:1.2;padding:12px 16px;white-space:nowrap;cursor:pointer;-webkit-tap-highlight-color:transparent}' +
    '.dvt-go:active{transform:scale(.97)}' +
    '@keyframes dvtL{from{transform:translateX(0)}to{transform:translateX(-50%)}}' +
    '@keyframes dvtR{from{transform:translateX(-50%)}to{transform:translateX(0)}}' +
    '@media(prefers-reduced-motion:reduce){.dvt-track{animation:none}.dvt-row{overflow-x:auto;-webkit-mask-image:none;mask-image:none}.dvt-clone{display:none}}' +
    '.dvt-ov{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:3000;display:flex;align-items:center;justify-content:center}' +
    '.dvt-box{width:92%;max-height:88dvh;overflow-y:auto;background:#fff;border-radius:20px;padding:22px;display:flex;flex-direction:column;gap:12px;color:#121212}' +
    '.dvt-mt{color:#0A3F8F;font-size:23px;font-weight:900;line-height:1.3}' +
    '.dvt-opt{width:100%;min-height:54px;text-align:left;border:2px solid rgba(10,63,143,.25);border-radius:14px;background:#fff;color:#0A3F8F;font-family:inherit;font-size:19px;font-weight:700;padding:10px 14px;cursor:pointer}' +
    '.dvt-opt:active{background:#F0F4FA}' +
    '.dvt-cancel{width:100%;min-height:56px;border:3px solid #0A3F8F;border-radius:999px;background:#fff;color:#0A3F8F;font-family:inherit;font-size:19px;font-weight:900;cursor:pointer}';
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  /* ---------- helpers ---------- */
  function h(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function click(sel) { var e = document.querySelector(sel); if (e) e.click(); return !!e; }
  function scrollTo(sel) {
    var e = document.querySelector(sel);
    if (e) e.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return !!e;
  }
  function modal(title, items) {
    var ov = h('div', 'dvt-ov'), bx = h('div', 'dvt-box');
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');
    bx.appendChild(h('h3', 'dvt-mt', title));
    function close() { if (ov.parentNode) ov.parentNode.removeChild(ov); }
    items.forEach(function (it) {
      var b = h('button', 'dvt-opt', it[0]);
      b.type = 'button';
      b.addEventListener('click', function () { close(); it[1](); });
      bx.appendChild(b);
    });
    var c = h('button', 'dvt-cancel', 'Cancel');
    c.type = 'button';
    c.addEventListener('click', close);
    bx.appendChild(c);
    ov.appendChild(bx);
    document.body.appendChild(ov);
  }

  /* ---------- what each pill opens ---------- */
  function favorite() {
    modal('Which book is your favorite?', BOOKS.map(function (b) {
      return [b[0], function () { click('[data-dv-open="' + b[1] + '"]'); }];
    }));
  }
  function think() {
    var host = document.getElementById('dvReviews'), btns = host ? host.querySelectorAll('button') : [];
    for (var i = 0; i < btns.length; i++) {
      if (btns[i].textContent === 'Write a review') { btns[i].click(); return; }
    }
    scrollTo('#dvReviews');
  }
  var ACTIONS = {
    reach: function () { click('[data-dv-wa]'); },
    favorite: favorite,
    qr: function () { scrollTo('.card-transaction'); },
    invoice: function () { click('[data-dv-wa-invoice]'); },
    cannot: function () { scrollTo('.qr-help'); },
    vote: function () { scrollTo('#dvReviews'); },
    think: think,
    learn: function () { click('[data-dv-open="dvFaq"]'); },
    quick: function () { click('[data-dv-wa]'); },
    explore: function () { click('[data-dv-open="dvAbout"]'); }
  };

  /* ---------- build the section ---------- */
  var sec = h('section', 'surface-card dvt');
  sec.id = 'dvTicker';
  sec.appendChild(h('h2', 'dvt-h', TITLE));

  ROWS.forEach(function (row, i) {
    var wrap = h('div', 'dvt-row' + (i % 2 ? ' rev' : '')), track = h('div', 'dvt-track');
    [false, true].forEach(function (clone) {
      row.forEach(function (t) {
        var b = h('button', 'dvt-pill' + (clone ? ' dvt-clone' : ''), t[0]);
        b.type = 'button';
        if (clone) { b.setAttribute('aria-hidden', 'true'); b.tabIndex = -1; }
        b.addEventListener('click', ACTIONS[t[1]]);
        track.appendChild(b);
      });
    });
    wrap.appendChild(track);
    sec.appendChild(wrap);
  });

  var go = h('button', 'dvt-go', PICK_LABEL);
  go.type = 'button';
  go.addEventListener('click', function () {
    var all = [];
    ROWS.forEach(function (row) { row.forEach(function (t) { all.push([t[0], ACTIONS[t[1]]]); }); });
    modal(PICK_LABEL, all);
  });
  sec.appendChild(go);

  anchor.parentNode.insertBefore(sec, anchor);
})();
