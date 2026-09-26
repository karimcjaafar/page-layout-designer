/* Page Layout Designer: lay a page out by numbers, not by eye.

   The page is one box cut into rows, top to bottom. Any box can be cut again, side by side or
   top to bottom, as often as needed. A size is set in dots, shares the room left over evenly, or
   fits what is inside. A gap is the usual one, a number of its own, or spread evenly. Because
   everything is worked out from numbers, things line up by themselves.

   One copy lives at https://karimcjaafar.github.io/page-layout-designer/ and every project
   points there, so an improvement reaches them all at once. Started 26 September 2026; the
   reasons behind each choice are in this folder's HANDOVER.md. */
(function () {
  'use strict';
  if (window.PageLayoutDesigner) return;

  const FONT = 'ui-rounded, "SF Pro Rounded", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

  const CSS = `
  .pld, .pld * { box-sizing: border-box; }
  .pld { display: flex; flex-direction: column; height: 100vh; height: 100dvh; background: #0b0f15; color: #c8ced8;
    font: 13px/1.4 ${FONT}; -webkit-text-size-adjust: 100%; }
  .pld-bar { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; padding: 8px 10px; background: #10151d;
    border-bottom: 1px solid #1d2532; }
  .pld-title { color: #fff; font-weight: 800; font-size: 15px; margin: 0 10px 0 4px; white-space: nowrap; }
  .pld-btn { height: 34px; padding: 0 14px; margin: 0; border-radius: 999px; border: 0; background: #263041; color: #fff;
    font: 700 13px/1 ${FONT}; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    white-space: nowrap; }
  .pld-btn:hover { background: #313d52; }
  .pld-btn:disabled { opacity: .32; cursor: default; }
  .pld-btn:disabled:hover { background: #263041; }
  .pld-btn.go { background: #d9f23f; color: #10160c; }
  .pld-btn.go:hover { background: #e4f86b; }
  .pld-btn.warn { background: #7a2a2a; }
  .pld-btn.warn:hover { background: #8a3232; }
  .pld-btn.icon { width: 34px; padding: 0; }
  .pld-main { flex: 1 1 auto; display: flex; min-height: 0; }
  .pld-side { width: 372px; flex: none; overflow-y: auto; padding: 12px 14px 40px; background: #10151d;
    border-right: 1px solid #1d2532; }
  .pld-stage { flex: 1 1 auto; overflow: auto; padding: 16px; }
  .pld-sheet { position: relative; margin: 0 auto; background: #151b25; outline: 1px solid #2b3648; border-radius: 6px; }
  .pld-margin { position: absolute; border: 1px dashed rgba(255,95,210,.3); pointer-events: none; }
  .pld-grp { position: absolute; border: 1.5px dashed rgba(93,179,242,.5); border-radius: 6px; cursor: pointer; }
  .pld-grp:hover { border-color: #9fd6ff; }
  .pld-grp.in { border-color: rgba(217,242,63,.6); }
  .pld-grp.sel { border: 2px solid #d9f23f; background: rgba(217,242,63,.05); }
  .pld-box { position: absolute; background: #263041; border: 1.5px solid #3b4b66; border-radius: 4px; cursor: pointer;
    overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px;
    text-align: center; line-height: 1.15; }
  .pld-box:hover { border-color: #9fd6ff; }
  .pld-box.in { border-color: rgba(217,242,63,.6); }
  .pld-box.sel { border: 2px solid #d9f23f; background: #2e3a26; }
  .pld-box .nm { color: #fff; font-weight: 700; font-size: 11.5px; white-space: nowrap; }
  .pld-box .sz { color: #aab3c0; font-weight: 600; font-size: 10.5px; white-space: nowrap; }
  .pld-box.over, .pld-grp.over { border-color: #e35d5d; box-shadow: 0 0 0 2px rgba(227,93,93,.45); }
  .pld-spare { position: absolute; pointer-events: none; border-radius: 4px; overflow: hidden; display: flex;
    align-items: center; justify-content: center; color: #6f7a8a; font-size: 10.5px; font-weight: 600; white-space: nowrap;
    background: repeating-linear-gradient(135deg, rgba(255,255,255,.05) 0 5px, transparent 5px 10px); }
  .pld-pill { position: absolute; transform: translate(-50%, -50%); z-index: 5; margin: 0; background: #ff5fd2;
    color: #10160c; border: 1.5px solid #10160c; border-radius: 999px; font: 800 10.5px/1 ${FONT}; padding: 1px 6px;
    cursor: pointer; white-space: nowrap; box-shadow: 0 1px 4px rgba(0,0,0,.5); }
  .pld-pill.spread { background: #ffb3ea; }
  .pld-gapfill { position: absolute; z-index: 4; background: rgba(255,95,210,.16); cursor: pointer; }
  .pld-gapfill:hover { background: rgba(255,95,210,.45); }
  .pld-pill-in { position: absolute; transform: translate(-50%, -50%); z-index: 6; width: 70px; height: 28px; border-radius: 999px;
    border: 2px solid #ff5fd2; background: #0b0f15; color: #fff; text-align: center; font: 800 14px/24px ${FONT}; outline: none;
    white-space: nowrap; overflow: hidden; cursor: text; }
  .pld-empty { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #6f7a8a;
    font-size: 14px; pointer-events: none; text-align: center; padding: 10px; }
  .pld-crumbs { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; }
  .pld-crumbs button { border: 0; margin: 0; background: #1b2230; color: #9fd6ff; border-radius: 7px; padding: 5px 8px;
    font: 700 12px/1.2 ${FONT}; cursor: pointer; }
  .pld-crumbs button.cur { background: #d9f23f; color: #10160c; }
  .pld-sep { color: #4d5869; }
  .pld-h1 { color: #fff; font-weight: 800; font-size: 17px; margin: 12px 0 2px; }
  .pld-sec { margin-top: 14px; padding-top: 12px; border-top: 1px solid #1d2532; }
  .pld-h { color: #fff; font-weight: 800; font-size: 13.5px; }
  .pld-row { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
  .pld-lab { width: 80px; flex: none; color: #98a0ad; }
  .pld-unit { color: #6f7a8a; font-size: 12px; }
  .pld-num, .pld-text { display: inline-block; height: 32px; margin: 0; background: #0b0f15; border: 1px solid #2b3648;
    border-radius: 8px; color: #fff; padding: 0 8px; font: 700 13px/30px ${FONT}; white-space: nowrap; overflow: hidden;
    cursor: text; -webkit-user-select: text; user-select: text; }
  .pld-num { width: 68px; flex: none; }
  .pld-text { flex: 1 1 auto; min-width: 0; font-weight: 600; }
  .pld-num:focus, .pld-text:focus { outline: none; border-color: #d9f23f; }
  .pld-num.auto { color: #6f7a8a; }
  .pld-num:empty::before, .pld-text:empty::before, .pld-pill-in:empty::before { content: attr(data-ph); color: #4d5869; }
  .pld-seg { display: inline-flex; flex-wrap: wrap; gap: 2px; padding: 2px; background: #0b0f15; border: 1px solid #2b3648;
    border-radius: 999px; }
  .pld-seg button { height: 28px; margin: 0; padding: 0 11px; border: 0; border-radius: 999px; background: transparent;
    color: #98a0ad; font: 700 12px/1 ${FONT}; cursor: pointer; white-space: nowrap; }
  .pld-seg button:hover { color: #fff; }
  .pld-seg button.on { background: #d9f23f; color: #10160c; }
  .pld-hint { font-size: 12px; color: #7d8796; margin-top: 6px; line-height: 1.4; }
  .pld-bad { margin-top: 10px; padding: 8px 10px; border-radius: 8px; background: rgba(227,93,93,.14);
    border: 1px solid rgba(227,93,93,.5); color: #ffb4b4; font-size: 12.5px; line-height: 1.4; }
  .pld-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 8px; }
  .pld-grid .pld-btn { width: 100%; }
  .pld-wide { width: 100%; margin-top: 8px; }
  .pld-step { display: inline-flex; align-items: center; gap: 4px; }
  .pld-step .pld-btn { width: 32px; height: 32px; padding: 0; font-size: 16px; }
  .pld-step .pld-num { width: 52px; text-align: center; }
  .pld-how { margin: 10px 0 0; padding-left: 18px; color: #aab3c0; }
  .pld-how li { margin-top: 4px; }
  .pld-toast { position: fixed; left: 50%; bottom: 20px; transform: translateX(-50%); z-index: 10000; background: #d9f23f;
    color: #10160c; font: 700 13px/1.3 ${FONT}; padding: 10px 16px; border-radius: 999px; box-shadow: 0 6px 20px rgba(0,0,0,.5);
    max-width: calc(100vw - 32px); text-align: center; }
  .pld-modal { position: fixed; inset: 0; z-index: 10001; background: rgba(5,8,12,.7); display: flex; align-items: center;
    justify-content: center; padding: 16px; }
  .pld-modal > div { width: min(640px, 100%); background: #141a24; border: 1px solid #2b3648; border-radius: 12px; padding: 14px; }
  .pld-modal textarea { width: 100%; height: 50vh; margin: 8px 0; background: #0b0f15; color: #c8ced8; border: 1px solid #2b3648;
    border-radius: 8px; padding: 8px; font: 12px/1.4 ui-monospace, Menlo, monospace; }
  @media (max-width: 819px) {
    .pld { height: auto; min-height: 100vh; }
    .pld-main { flex-direction: column; }
    .pld-stage { order: -1; position: sticky; top: 0; z-index: 20; flex: none; max-height: 42vh; padding: 12px; background: #0b0f15;
      border-bottom: 1px solid #1d2532; }
    .pld-side { width: auto; border-right: 0; padding-bottom: 60px; }
    .pld-num, .pld-text { font-size: 16px; }
  }`;

  // ---------- small helpers ----------
  function el(tag, props, ...kids) {
    const e = document.createElement(tag);
    if (props) for (const k in props) {
      const v = props[k];
      if (v == null || v === false) continue;
      if (k === 'class') e.className = v;
      else if (k === 'text') e.textContent = v;
      else if (k === 'html') e.innerHTML = v;
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? '' : v);
    }
    for (const c of kids.flat(Infinity)) if (c != null && c !== false) e.append(c.nodeType ? c : String(c));
    return e;
  }
  const fmt = n => { const r = Math.round(n * 10) / 10; return String(Object.is(r, -0) ? 0 : r); };
  const readNum = s => { const v = parseFloat(String(s).replace(',', '.')); return isFinite(v) ? v : null; };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  // A typing box that is not a form field. Password managers pop up "save this contact" over
  // form fields, and NordPass (Karim's) has no switch a page can use to stop it; they leave
  // these alone. It behaves like a field: .value, 'input' while typing, 'change' when left.
  function typeBox(cls, o) {
    o = o || {};
    const e = el('span', { class: cls, contenteditable: 'plaintext-only', role: 'textbox', spellcheck: 'false',
      autocapitalize: 'off', autocorrect: 'off', inputmode: o.decimal ? 'decimal' : null, enterkeyhint: 'done' });
    if (e.contentEditable !== 'plaintext-only') e.contentEditable = 'true';
    Object.defineProperty(e, 'value', { get() { return e.textContent; }, set(v) { e.textContent = v; } });
    Object.defineProperty(e, 'placeholder', { get() { return e.dataset.ph || ''; }, set(v) { e.dataset.ph = v; } });
    e.select = () => {
      const r = document.createRange(); r.selectNodeContents(e);
      const sl = window.getSelection(); sl.removeAllRanges(); sl.addRange(r);
    };
    let start = null;
    e.addEventListener('focus', () => {
      start = e.textContent;
      if (o.decimal) setTimeout(() => { if (document.activeElement === e) e.select(); }, 0);
    });
    e.addEventListener('blur', () => {
      const was = start; start = null;
      if (was !== null && e.textContent !== was) e.dispatchEvent(new Event('change'));
    });
    e.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); e.blur(); } });
    e.addEventListener('paste', ev => {
      ev.preventDefault();
      document.execCommand('insertText', false, (ev.clipboardData || window.clipboardData).getData('text').replace(/\s+/g, ' '));
    });
    return e;
  }
  const ICON = {
    back: '<svg viewBox="0 0 24 24" width="18" height="18"><path d="M20 12H5M11 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    fwd: '<svg viewBox="0 0 24 24" width="18" height="18"><path d="M4 12h15M13 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  };

  function mount(host, opts) {
    opts = opts || {};
    const KEY = opts.storageKey || 'pld-plan-v1';
    if (!document.getElementById('pld-css')) document.head.append(el('style', { id: 'pld-css', text: CSS }));

    let uid = 1;
    let plan = load() || blank();
    let sel = 'page', undo = [], redo = [], editBefore = null, fit = true, lay = null, scale = 1, binds = [];
    reseed();

    // ---------- the plan ----------
    // A box is { id, name, w, h }. A cut box also has dir ('across' or 'down'), gap, gaps and kids.
    // w and h: a number of dots, 'share' (share the room left over, or fill the row it sits in),
    // or 'fit' (just big enough for what is inside; cut boxes only).
    // gap: null for the page's usual gap, a number, or 'spread'. gaps[i] overrides the gap after kid i.
    function blank() {
      return { v: 1, page: { name: '', width: 1000, margin: 20, gap: 20 },
        root: { id: 'page', name: '', w: 1000, h: 'fit', dir: 'down', gap: null, gaps: [], align: 'start', kids: [] } };
    }
    function load() {
      try { const p = JSON.parse(localStorage.getItem(KEY) || 'null'); return p && p.root && p.page ? p : null; }
      catch (e) { return null; }
    }
    function save() {
      try { localStorage.setItem(KEY, JSON.stringify(plan)); } catch (e) { /* private window: works, just not kept */ }
    }
    function walk(n, fn, p) { fn(n, p || null); (n.kids || []).forEach(k => walk(k, fn, n)); }
    function reseed() {
      uid = 1;
      walk(plan.root, n => { const m = /^b(\d+)$/.exec(n.id); if (m) uid = Math.max(uid, +m[1] + 1); });
    }
    const newId = () => 'b' + (uid++);
    function find(id) { let hit = null; walk(plan.root, (n, p) => { if (n.id === id) hit = { n, p }; }); return hit; }
    const isCut = n => !!(n.kids && n.kids.length);
    function trail(id) {
      const out = []; let f = find(id);
      while (f) { out.unshift(f.n); f = f.p ? find(f.p.id) : null; }
      return out;
    }
    function baseName(n, p) {
      if (!p) return 'Page';
      return (p === plan.root ? 'Row ' : 'Box ') + (p.kids.indexOf(n) + 1);
    }
    function pathName(n) { return trail(n.id).slice(1).map(t => baseName(t, find(t.id).p)).join(' › '); }
    function clone(n) { const c = JSON.parse(JSON.stringify(n)); walk(c, x => { x.id = newId(); }); return c; }
    function normGaps(p) {
      const want = Math.max(0, p.kids.length - 1);
      p.gaps = (p.gaps || []).slice(0, want);
      while (p.gaps.length < want) p.gaps.push(null);
    }
    // A new kid at index i. The gap that was below the box before it stays below the new one.
    function insertKid(p, i, kid) {
      normGaps(p); p.kids.splice(i, 0, kid);
      if (p.kids.length > 1) p.gaps.splice(Math.max(0, i - 1), 0, null);
    }
    function removeKid(p, i) {
      normGaps(p); const n = p.kids.length; p.kids.splice(i, 1);
      if (n > 1) p.gaps.splice(i < n - 1 ? i : i - 1, 1);
    }

    // ---------- working out where everything goes ----------
    const mainAx = g => g.dir === 'across' ? 'w' : 'h';
    const padOf = n => n === plan.root ? plan.page.margin : 0;
    const usualGap = g => typeof g.gap === 'number' ? g.gap : plan.page.gap;
    function gapAt(g, i) {
      if (g.gap === 'spread') return 0;
      const o = g.gaps && g.gaps[i];
      return typeof o === 'number' ? o : usualGap(g);
    }
    function natural(n, ax) {
      const v = n[ax];
      if (typeof v === 'number') return v;
      if (!isCut(n)) return 0;
      const pad = padOf(n);
      if (ax === mainAx(n)) return n.kids.reduce((s, k, i) => s + natural(k, ax) + (i ? gapAt(n, i - 1) : 0), 0) + 2 * pad;
      return Math.max(...n.kids.map(k => natural(k, ax))) + 2 * pad;
    }
    function place(n, x, y, W, H, out) {
      out.box[n.id] = { x, y, w: W, h: H };
      if (!isCut(n)) return;
      const pad = padOf(n), m = mainAx(n), across = m === 'w', c = across ? 'h' : 'w';
      const L = (across ? W : H) - 2 * pad, C = (across ? H : W) - 2 * pad;
      const kids = n.kids, last = kids.length - 1;
      const size = kids.map(k => typeof k[m] === 'number' ? k[m] : k[m] === 'fit' ? natural(k, m) : null);
      const gaps = kids.slice(1).map((_, i) => gapAt(n, i));
      const sharers = size.filter(s => s === null).length;
      let left = L - size.reduce((a, s) => a + (s || 0), 0) - gaps.reduce((a, g) => a + g, 0);
      if (sharers) {
        const each = Math.max(0, left / sharers);
        size.forEach((s, i) => { if (s === null) size[i] = each; });
        if (left > 0) left = 0;
      } else if (n.gap === 'spread' && last > 0 && left > 0) {
        gaps.fill(left / last); left = 0;
      }
      let pos = pad;
      kids.forEach((k, i) => {
        const cs = typeof k[c] === 'number' ? k[c] : k[c] === 'fit' ? natural(k, c) : Math.max(0, C);
        const off = n.align === 'centre' ? (C - cs) / 2 : n.align === 'end' ? C - cs : 0;
        if (cs > C + 0.05) out.over.push({ id: k.id, by: cs - C, inside: false, across });
        const kx = across ? x + pos : x + pad + off, ky = across ? y + pad + off : y + pos;
        place(k, kx, ky, across ? size[i] : cs, across ? cs : size[i], out);
        pos += size[i];
        if (i < last) {
          const g = gaps[i];
          out.gaps.push(across ? { gid: n.id, i, x: x + pos, y: y + pad, w: g, h: C, v: g }
                               : { gid: n.id, i, x: x + pad, y: y + pos, w: C, h: g, v: g });
          pos += g;
        }
      });
      if (left > 0.05) out.spare.push(across ? { x: x + pos, y: y + pad, w: left, h: C, v: left }
                                             : { x: x + pad, y: y + pos, w: C, h: left, v: left });
      if (left < -0.05) out.over.push({ id: n.id, by: -left, inside: true, across });
    }
    function computeLayout() {
      const r = plan.root; r.w = plan.page.width;
      const out = { box: {}, gaps: [], spare: [], over: [] };
      const H = r.kids.length ? natural(r, 'h') : Math.max(160, 2 * plan.page.margin);
      place(r, 0, 0, r.w, H, out);
      return out;
    }

    // ---------- the screen ----------
    host.classList.add('pld');
    host.textContent = '';
    const bBack = el('button', { class: 'pld-btn icon', title: 'Back one change', html: ICON.back, onclick: () => back() });
    const bFwd = el('button', { class: 'pld-btn icon', title: 'Forward again', html: ICON.fwd, onclick: () => fwd() });
    const bWarn = el('button', { class: 'pld-btn warn', onclick: () => { if (lay.over.length) select(lay.over[0].id); } });
    const bFit = el('button', { class: 'pld-btn', onclick: () => { fit = !fit; renderAll(); } });
    const bar = el('div', { class: 'pld-bar' },
      bBack, bFwd, el('span', { class: 'pld-title', text: 'Page layout designer' }),
      el('button', { class: 'pld-btn go', text: 'Add a row', onclick: addRow }),
      el('button', { class: 'pld-btn', text: 'Copy the plan', onclick: copyPlan }),
      bFit,
      el('button', { class: 'pld-btn', text: 'Start again', onclick: startAgain }),
      bWarn);
    const side = el('div', { class: 'pld-side' });
    const sheet = el('div', { class: 'pld-sheet' });
    const stage = el('div', { class: 'pld-stage' }, sheet);
    host.append(bar, el('div', { class: 'pld-main' }, side, stage));

    stage.addEventListener('click', e => {
      if (e.target.closest('.pld-pill, .pld-pill-in, .pld-gapfill')) return;
      const t = e.target.closest('[data-id]');
      select(t ? t.dataset.id : 'page');
    });

    function draw() {
      lay = computeLayout();
      const pw = plan.page.width, ph = lay.box.page.h;
      const avail = Math.max(60, stage.clientWidth - (window.innerWidth < 820 ? 24 : 32));
      scale = fit ? Math.min(1, Math.max(0.05, avail / pw)) : 1;
      const S = v => (v * scale) + 'px';
      const put = (e, b) => { e.style.left = S(b.x); e.style.top = S(b.y); e.style.width = S(b.w); e.style.height = S(b.h); return e; };
      sheet.style.width = S(pw); sheet.style.height = S(ph);
      sheet.textContent = '';
      const m = plan.page.margin;
      if (m > 0) sheet.append(put(el('div', { class: 'pld-margin' }), { x: m, y: m, w: pw - 2 * m, h: ph - 2 * m }));
      if (!plan.root.kids.length) sheet.append(el('div', { class: 'pld-empty', text: 'Press Add a row to begin' }));

      const selNode = (find(sel) || {}).n;
      const inside = new Set();
      if (selNode && selNode !== plan.root) walk(selNode, n => { if (n !== selNode) inside.add(n.id); });
      const over = new Set(lay.over.map(o => o.id));
      const cls = (base, n) => base + (n.id === sel ? ' sel' : '') + (inside.has(n.id) ? ' in' : '') + (over.has(n.id) ? ' over' : '');
      const groups = [], leaves = [];
      walk(plan.root, (n, p) => { if (p) (isCut(n) ? groups : leaves).push(n); });
      groups.forEach(n => sheet.append(put(el('div', { class: cls('pld-grp', n), 'data-id': n.id }), lay.box[n.id])));
      leaves.forEach(n => {
        const b = lay.box[n.id], e = put(el('div', { class: cls('pld-box', n), 'data-id': n.id }), b);
        const sw = b.w * scale, sh = b.h * scale, size = fmt(b.w) + ' × ' + fmt(b.h);
        if (n.name && sw >= n.name.length * 6.5 + 8 && sh >= 28) e.append(el('div', { class: 'nm', text: n.name }));
        if (sw >= size.length * 5.6 + 8 && sh >= 14) e.append(el('div', { class: 'sz', text: size }));
        sheet.append(e);
      });
      lay.spare.forEach(s => {
        const e = put(el('div', { class: 'pld-spare' }), s), t = 'spare ' + fmt(s.v);
        if (s.w * scale >= t.length * 5.6 + 8 && s.h * scale >= 14) e.append(el('span', { text: t }));
        sheet.append(e);
      });
      // Gap labels: the page's own gaps, the chosen box's, and the gaps beside the chosen box.
      const focus = new Set(['page']);
      const f = find(sel);
      if (f) { if (isCut(f.n)) focus.add(f.n.id); if (f.p) focus.add(f.p.id); }
      // A gap too thin on screen for its number is shown pink; clicking it still lets you type.
      lay.gaps.forEach(g => {
        if (!focus.has(g.gid)) return;
        const grp = find(g.gid).n, spread = grp.gap === 'spread', text = fmt(g.v);
        const across = grp.dir === 'across', room = (across ? g.w : g.h) * scale;
        const fits = across ? room + 4 >= text.length * 6.2 + 12 : room + 4 >= 14;
        const tip = spread ? 'Spread evenly, ' + text + ' dots' : text + ' dots: click to type a new gap';
        const mark = fits
          ? el('button', { class: 'pld-pill' + (spread ? ' spread' : ''), text, title: tip })
          : put(el('div', { class: 'pld-gapfill', title: tip }), g);
        if (fits) { mark.style.left = S(g.x + g.w / 2); mark.style.top = S(g.y + g.h / 2); }
        mark.addEventListener('click', e => { e.stopPropagation(); editGap(mark, g); });
        sheet.append(mark);
      });
    }

    function editGap(pill, g) {
      const grp = find(g.gid).n;
      sel = g.gid;
      if (grp.gap === 'spread') { renderAll(); return; }
      renderSide();
      const inp = typeBox('pld-pill-in', { decimal: true }); inp.value = fmt(g.v);
      inp.style.left = (g.x + g.w / 2) * scale + 'px'; inp.style.top = (g.y + g.h / 2) * scale + 'px';
      pill.replaceWith(inp);
      inp.focus(); inp.select();
      let done = false;
      const finish = keep => {
        if (done) return; done = true;
        const v = readNum(inp.value);
        if (keep && v != null) commit(() => { normGaps(grp); grp.gaps[g.i] = Math.max(0, v); });
        else renderAll();
      };
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') finish(true); if (e.key === 'Escape') finish(false); });
      inp.addEventListener('blur', () => finish(true));
    }

    // ---------- changes, back and forward ----------
    function live(fn) {
      if (editBefore === null) editBefore = JSON.stringify(plan);
      fn(); save(); draw(); binds.forEach(b => b()); updateBar();
    }
    function endEdit() {
      if (editBefore === null) return;
      if (editBefore !== JSON.stringify(plan)) { undo.push(editBefore); if (undo.length > 300) undo.shift(); redo = []; }
      editBefore = null; updateBar();
    }
    function commit(fn) {
      endEdit();
      const before = JSON.stringify(plan);
      fn();
      if (JSON.stringify(plan) !== before) { undo.push(before); if (undo.length > 300) undo.shift(); redo = []; save(); }
      renderAll();
    }
    function back() {
      endEdit(); if (!undo.length) return;
      redo.push(JSON.stringify(plan)); plan = JSON.parse(undo.pop()); reseed();
      if (!find(sel)) sel = 'page';
      save(); renderAll();
    }
    function fwd() {
      endEdit(); if (!redo.length) return;
      undo.push(JSON.stringify(plan)); plan = JSON.parse(redo.pop()); reseed();
      if (!find(sel)) sel = 'page';
      save(); renderAll();
    }
    function select(id) { endEdit(); sel = find(id) ? id : 'page'; renderAll(); }

    function addRow() {
      let id;
      commit(() => {
        const row = { id: newId(), name: '', w: 'share', h: 50 };
        const t = trail(sel), at = t[1] ? plan.root.kids.indexOf(t[1]) + 1 : plan.root.kids.length;
        insertKid(plan.root, at, row); id = row.id;
      });
      select(id);
    }
    function startAgain() {
      if (!plan.root.kids.length) return;
      commit(() => { const keep = plan.page; plan = blank(); plan.page = keep; });
      sel = 'page'; renderAll();
      toast('Cleared. The back arrow brings it all back.');
    }
    function cut(n, count, dir) {
      commit(() => {
        n.dir = dir; n.gap = null; n.gaps = []; n.align = 'start';
        n.kids = Array.from({ length: count }, () => ({ id: newId(), name: '', w: 'share', h: 'share' }));
        normGaps(n);
      });
    }
    function join(n) {
      const b = lay.box[n.id];
      commit(() => {
        if (n.w === 'fit') n.w = Math.round(b.w);
        if (n.h === 'fit') n.h = Math.round(b.h);
        delete n.kids; delete n.dir; delete n.gap; delete n.gaps; delete n.align;
      });
    }
    function setCount(n, c) {
      c = clamp(Math.round(c), 1, 60);
      commit(() => {
        while (n.kids.length < c) insertKid(n, n.kids.length, clone(n.kids[n.kids.length - 1]));
        while (n.kids.length > c) removeKid(n, n.kids.length - 1);
      });
    }
    function copyBox(id) {
      const f = find(id); if (!f || !f.p) return;
      let nid;
      commit(() => { const c = clone(f.n); insertKid(f.p, f.p.kids.indexOf(f.n) + 1, c); nid = c.id; });
      select(nid);
    }
    function removeBox(id) {
      const f = find(id); if (!f || !f.p) return;
      const i = f.p.kids.indexOf(f.n);
      commit(() => {
        removeKid(f.p, i);
        if (f.p !== plan.root && !f.p.kids.length) { delete f.p.kids; delete f.p.dir; delete f.p.gap; delete f.p.gaps; delete f.p.align; }
      });
      const p = f.p;
      select(p.kids && p.kids.length ? p.kids[Math.min(i, p.kids.length - 1)].id : p.id);
    }
    function moveBox(id, by) {
      const f = find(id); if (!f || !f.p) return;
      const k = f.p.kids, i = k.indexOf(f.n), j = i + by;
      if (j < 0 || j >= k.length) return;
      commit(() => { k[i] = k[j]; k[j] = f.n; });
    }

    // ---------- the panel on the left ----------
    function numInput(get, set, o) {
      o = o || {};
      const inp = typeBox('pld-num', { decimal: true });
      const upd = () => {
        if (document.activeElement === inp) return;
        const r = get();
        inp.value = r.v == null ? '' : fmt(r.v);
        inp.placeholder = r.ph || '';
        inp.classList.toggle('auto', !!r.auto);
      };
      upd(); binds.push(upd);
      inp.addEventListener('input', () => {
        if (o.onEnter) return;
        if (inp.value.trim() === '' && o.blank) { live(o.blank); return; }
        const v = readNum(inp.value);
        if (v == null) return;
        live(() => set(v)); inp.classList.remove('auto');
      });
      inp.addEventListener('change', () => {
        if (o.onEnter) { const v = readNum(inp.value); if (v != null) o.onEnter(v); else upd(); return; }
        endEdit(); upd();
      });
      return inp;
    }
    function textInput(value, ph, set) {
      const inp = typeBox('pld-text');
      inp.value = value || ''; inp.placeholder = ph;
      inp.addEventListener('input', () => live(() => set(inp.value.trim())));
      inp.addEventListener('change', () => endEdit());
      return inp;
    }
    function seg(options, get, set) {
      const wrap = el('div', { class: 'pld-seg' });
      const btns = options.map(([k, t]) => {
        const b = el('button', { type: 'button', text: t, onclick: () => set(k) });
        b.dataset.k = k; wrap.append(b); return b;
      });
      const upd = () => { const cur = get(); btns.forEach(b => b.classList.toggle('on', b.dataset.k === cur)); };
      upd(); binds.push(upd);
      return wrap;
    }
    function liveText(fn) {
      const e = el('div', { class: 'pld-hint' });
      const upd = () => { const t = fn(); e.textContent = t; e.style.display = t ? '' : 'none'; };
      upd(); binds.push(upd); return e;
    }
    const row = (label, ...kids) => el('div', { class: 'pld-row' }, el('span', { class: 'pld-lab', text: label }), kids);
    const unit = t => el('span', { class: 'pld-unit', text: t });
    const sec = (title, ...kids) => el('div', { class: 'pld-sec' }, title ? el('div', { class: 'pld-h', text: title }) : null, kids);

    function renderSide() {
      binds = [];
      side.textContent = '';
      const f = find(sel) || find('page');
      const n = f.n, p = f.p, isRoot = !p;

      side.append(el('div', { class: 'pld-crumbs' }, trail(n.id).map((t, i) => [
        i ? el('span', { class: 'pld-sep', text: '›' }) : null,
        el('button', { class: t.id === n.id ? 'cur' : '', text: baseName(t, (find(t.id) || {}).p), onclick: () => select(t.id) }),
      ])));
      side.append(el('div', { class: 'pld-h1', text: isRoot ? 'The page' : baseName(n, p) }));
      side.append(row('Name', isRoot
        ? textInput(plan.page.name, 'e.g. Formula forum', v => { plan.page.name = v; })
        : textInput(n.name, 'e.g. Start button', v => { n.name = v; })));

      const bad = lay.over.filter(o => o.id === n.id);
      bad.forEach(o => side.append(el('div', { class: 'pld-bad', text: o.inside
        ? 'Too much inside: the boxes and gaps need ' + fmt(o.by) + ' more dots ' + (o.across ? 'across' : 'down') +
          ' than this box has. Make something inside smaller, or this box bigger.'
        : 'Too ' + (o.across ? 'tall' : 'wide') + ' for the ' + (o.across ? 'row' : 'column') + ' it sits in, by ' + fmt(o.by) + ' dots.' })));

      if (isRoot) {
        side.append(sec('Size and spacing',
          row('Width', numInput(() => ({ v: plan.page.width }), v => { plan.page.width = Math.max(1, v); }), unit('dots')),
          row('Margin', numInput(() => ({ v: plan.page.margin }), v => { plan.page.margin = Math.max(0, v); }), unit('dots round the edge')),
          row('Usual gap', numInput(() => ({ v: plan.page.gap }), v => { plan.page.gap = Math.max(0, v); }), unit('dots')),
          el('div', { class: 'pld-hint', text: 'The usual gap goes between everything, unless you give a gap a number of its own. A dot is one of the tiny dots a screen is made of.' })));
        if (!plan.root.kids.length) {
          side.append(sec('How it works', el('ol', { class: 'pld-how' },
            el('li', { text: 'Press Add a row. A row appears on the page.' }),
            el('li', { text: 'Click any box and give it numbers here.' }),
            el('li', { text: 'Cut a box to split it into smaller boxes, side by side or top to bottom. Any box can be cut again.' }),
            el('li', { text: 'Every size and gap is written on the drawing, so you can see it is neat.' }))));
        }
      } else {
        side.append(sec('Size', sizeRow(n, p, 'w'), sizeRow(n, p, 'h')));
      }

      if (isCut(n)) side.append(insideSection(n, isRoot));
      else if (!isRoot) side.append(cutSection(n));

      if (!isRoot) {
        const i = p.kids.indexOf(n), across = p.dir === 'across';
        const b = (t, fn, off) => el('button', { class: 'pld-btn', text: t, onclick: fn, disabled: off });
        side.append(sec('This ' + (p === plan.root ? 'row' : 'box'), el('div', { class: 'pld-grid' },
          b('Copy it', () => copyBox(n.id)),
          b('Remove it', () => removeBox(n.id)),
          b(across ? '‹ Move left' : 'Move up', () => moveBox(n.id, -1), i === 0),
          b(across ? 'Move right ›' : 'Move down', () => moveBox(n.id, 1), i === p.kids.length - 1)),
          el('div', { class: 'pld-hint', text: 'Copy puts an exact twin straight after it, so it lines up with no effort.' })));
      }
    }

    function sizeRow(n, p, ax) {
      const alongMain = mainAx(p) === ax;
      const parentFits = p === plan.root || p[mainAx(p)] === 'fit';
      const fill = ax === 'w' ? 'Full width' : 'Full height';
      const modes = [['set', 'Set']];
      if (!alongMain) modes.push(['share', fill]);
      else if (!parentFits) modes.push(['share', 'Share']);
      if (isCut(n)) modes.push(['fit', 'Fit inside']);
      const mode = () => typeof n[ax] === 'number' ? 'set' : n[ax];
      const wrap = el('div');
      wrap.append(
        row(ax === 'w' ? 'Width' : 'Height',
          numInput(() => ({ v: typeof n[ax] === 'number' ? n[ax] : lay.box[n.id][ax], auto: typeof n[ax] !== 'number' }),
            v => { n[ax] = Math.max(0, v); }),
          unit('dots')),
        row('', seg(modes, mode, m => commit(() => { n[ax] = m === 'set' ? Math.round(lay.box[n.id][ax]) : m; }))),
        liveText(() => {
          const md = mode();
          if (md === 'set') return '';
          if (md === 'fit') return 'Just big enough for the boxes inside it.';
          if (!alongMain) return p === plan.root ? 'As wide as the page, inside the margin.'
            : (ax === 'w' ? 'As wide as the column it sits in.' : 'As tall as the row it sits in.');
          return 'Shares the room left over, evenly, with the others set to Share.';
        }));
      return wrap;
    }

    function insideSection(n, isRoot) {
      const across = n.dir === 'across';
      const s = sec(isRoot ? 'The rows' : 'Inside this box');
      if (!isRoot) {
        const cnt = numInput(() => ({ v: n.kids.length }), null, { onEnter: v => setCount(n, v) });
        s.append(
          row('Boxes', el('div', { class: 'pld-step' },
            el('button', { class: 'pld-btn', text: '−', title: 'One fewer', onclick: () => setCount(n, n.kids.length - 1), disabled: n.kids.length <= 1 }),
            cnt,
            el('button', { class: 'pld-btn', text: '+', title: 'One more', onclick: () => setCount(n, n.kids.length + 1) }))),
          row('', seg([['across', 'Side by side'], ['down', 'Top to bottom']], () => n.dir, d => commit(() => { n.dir = d; }))),
          row('Gap', numInput(() => {
            if (typeof n.gap === 'number') return { v: n.gap };
            const g = lay.gaps.find(x => x.gid === n.id);
            return { v: g ? g.v : usualGap(n), auto: true };
          }, v => { n.gap = Math.max(0, v); }), unit('dots')),
          row('', seg([['usual', 'Usual ' + fmt(plan.page.gap)], ['set', 'Set'], ['spread', 'Spread evenly']],
            () => n.gap === 'spread' ? 'spread' : typeof n.gap === 'number' ? 'set' : 'usual',
            m => commit(() => { n.gap = m === 'spread' ? 'spread' : m === 'set' ? usualGap(n) : null; }))),
          liveText(() => n.gap === 'spread'
            ? 'The boxes keep their sizes and the room left over is shared out between them as gaps. It only works when no box inside is set to Share.'
            : ''));
        const every = ax => {
          const vals = n.kids.map(k => typeof k[ax] === 'number' ? k[ax] : null);
          if (vals.every(v => v !== null && v === vals[0])) return { v: vals[0] };
          const got = n.kids.map(k => Math.round(lay.box[k.id][ax] * 10) / 10);
          if (n.kids.every(k => k[ax] === n.kids[0][ax]) && got.every(v => v === got[0])) return { v: got[0], auto: true };
          return { v: null, ph: 'mixed' };
        };
        s.append(
          row('Every box', numInput(() => every('w'), v => n.kids.forEach(k => { k.w = Math.max(0, v); })), unit('wide'),
            numInput(() => every('h'), v => n.kids.forEach(k => { k.h = Math.max(0, v); })), unit('high')),
          el('div', { class: 'pld-hint', text: 'A number here sets every box inside to the same size.' }));
      }
      s.append(row('Line up', seg(across
        ? [['start', 'Top'], ['centre', 'Middle'], ['end', 'Bottom']]
        : [['start', 'Left'], ['centre', 'Centre'], ['end', 'Right']],
        () => n.align || 'start', a => commit(() => { n.align = a; }))));
      if (n.kids.length > 1 && n.gap !== 'spread' && n.kids.length <= 40) {
        const list = el('div');
        n.kids.slice(1).forEach((k, i) => list.append(row((across ? 'After ' : 'Below ') + baseName(n.kids[i], n),
          numInput(() => {
            const o = n.gaps && n.gaps[i];
            return typeof o === 'number' ? { v: o } : { v: null, ph: fmt(usualGap(n)) };
          }, v => { normGaps(n); n.gaps[i] = Math.max(0, v); }, { blank: () => { normGaps(n); n.gaps[i] = null; } }),
          unit('dots'))));
        s.append(el('div', { class: 'pld-sec' }, el('div', { class: 'pld-h', text: 'Each gap on its own' }),
          el('div', { class: 'pld-hint', text: 'Leave a box empty to use the usual gap. You can also click a pink gap on the drawing and type.' }),
          list));
      }
      if (!isRoot) s.append(el('button', { class: 'pld-btn pld-wide', text: 'Join back into one box', onclick: () => join(n) }));
      return s;
    }

    function cutSection(n) {
      let count = 2;
      const cnt = numInput(() => ({ v: count }), null, { onEnter: v => { count = clamp(Math.round(v), 2, 60); } });
      return sec('Cut this box',
        row('Into', cnt, unit('boxes')),
        el('div', { class: 'pld-grid' },
          el('button', { class: 'pld-btn go', text: 'Side by side', onclick: () => { const v = readNum(cnt.value); cut(n, clamp(Math.round(v || count), 2, 60), 'across'); } }),
          el('button', { class: 'pld-btn go', text: 'Top to bottom', onclick: () => { const v = readNum(cnt.value); cut(n, clamp(Math.round(v || count), 2, 60), 'down'); } })),
        el('div', { class: 'pld-hint', text: 'The box keeps its size and is split into equal boxes inside it. Each one can be sized, or cut again.' }));
    }

    function updateBar() {
      bBack.disabled = !undo.length && editBefore === null;
      bFwd.disabled = !redo.length;
      bFit.textContent = fit ? 'Actual size' : 'Fit to screen';
      const n = lay ? lay.over.length : 0;
      bWarn.style.display = n ? '' : 'none';
      bWarn.textContent = n === 1 ? '1 box does not fit' : n + ' boxes do not fit';
    }
    function renderAll() { draw(); renderSide(); updateBar(); }

    // ---------- the plan, in words, for Claude ----------
    function planText() {
      const L = computeLayout(), r = plan.root, pg = plan.page, out = [];
      const how = (v, p, ax) => typeof v === 'number' ? '' : v === 'fit' ? ' (fits what is inside)'
        : mainAx(p) === ax ? ' (sharing the room left over)' : (ax === 'w' ? ' (full width)' : ' (full height)');
      const gapWords = n => n.gap === 'spread'
        ? 'the gaps spread evenly' + (L.gaps.find(g => g.gid === n.id) ? ' (' + fmt(L.gaps.find(g => g.gid === n.id).v) + ' each)' : '')
        : typeof n.gap === 'number' ? 'gaps of ' + fmt(n.gap) : 'the usual gap of ' + fmt(pg.gap);
      const alignWords = n => !n.align || n.align === 'start' ? ''
        : ', lined up ' + (n.align === 'centre' ? (n.dir === 'across' ? 'in the middle' : 'in the centre') : (n.dir === 'across' ? 'at the bottom' : 'on the right'));
      function say(n, p, depth) {
        const b = L.box[n.id], pad = '  '.repeat(depth);
        let s = pad + baseName(n, p) + (n.name ? ' "' + n.name + '"' : '') + ': ' + fmt(b.w) + ' wide' + how(n.w, p, 'w') +
          ', ' + fmt(b.h) + ' high' + how(n.h, p, 'h');
        if (isCut(n)) s += '. Cut ' + (n.dir === 'across' ? 'side by side' : 'top to bottom') + ' into ' + n.kids.length + ', with ' + gapWords(n) + alignWords(n) + ':';
        out.push(s);
        if (isCut(n)) n.kids.forEach((k, i) => {
          say(k, n, depth + 1);
          const o = n.gaps && n.gaps[i];
          if (i < n.kids.length - 1 && n.gap !== 'spread' && typeof o === 'number') out.push(pad + '    then a gap of ' + fmt(o));
        });
      }
      out.push('PAGE LAYOUT PLAN' + (pg.name ? ': ' + pg.name : ''));
      out.push('Made with Page Layout Designer on ' + new Date().toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' }) + '.');
      out.push('Sizes are in dots (screen pixels). The page is ' + fmt(pg.width) + ' wide, with a margin of ' + fmt(pg.margin) +
        ' round the edge. The usual gap is ' + fmt(pg.gap) + '.' + alignWords(r).replace(', lined up', ' Rows are lined up'));
      out.push('', 'TOP TO BOTTOM:');
      r.kids.forEach((k, i) => { say(k, r, 1); if (i < r.kids.length - 1) out.push('  then a gap of ' + fmt(gapAt(r, i))); });
      if (L.over.length) {
        out.push('', 'WARNING, things that do not fit:');
        L.over.forEach(o => out.push('  ' + pathName(find(o.id).n) + ': too big by ' + fmt(o.by) + ' dots ' + (o.across === o.inside ? 'across' : 'down')));
      }
      out.push('', 'EVERY BOX, measured from the top left corner of the page (left, top, width, height):');
      walk(r, (n, p) => { if (!p) return; const b = L.box[n.id]; out.push('  ' + pathName(n) + (n.name ? ' "' + n.name + '"' : '') + ': ' + [b.x, b.y, b.w, b.h].map(fmt).join(', ')); });
      out.push('', 'FOR CLAUDE, the plan exactly (Page Layout Designer, plan version ' + plan.v + '):', JSON.stringify(plan));
      return out.join('\n');
    }
    async function copyPlan() {
      endEdit();
      if (!plan.root.kids.length) { toast('Nothing to copy yet. Add a row first.'); return; }
      const t = planText();
      let ok = false;
      try { await navigator.clipboard.writeText(t); ok = true; } catch (e) { /* try the older way */ }
      if (!ok) {
        try {
          const ta = el('textarea', { style: 'position:fixed;left:-9999px;top:0' }); ta.value = t;
          document.body.append(ta); ta.select(); ok = document.execCommand('copy'); ta.remove();
        } catch (e) { ok = false; }
      }
      if (ok) toast('Copied. Paste it into the chat with Claude.');
      else showText(t);
    }
    function showText(t) {
      const ta = el('textarea', { readonly: true }); ta.value = t;
      const m = el('div', { class: 'pld-modal', onclick: e => { if (e.target === m) m.remove(); } }, el('div', null,
        el('div', { class: 'pld-h', text: 'Your plan' }),
        el('div', { class: 'pld-hint', text: 'This browser would not copy by itself. Select all of this, copy it, and paste it to Claude.' }),
        ta, el('button', { class: 'pld-btn', text: 'Close', onclick: () => m.remove() })));
      document.body.append(m); ta.focus(); ta.select();
    }
    let toastTimer = null;
    function toast(t) {
      document.querySelectorAll('.pld-toast').forEach(x => x.remove());
      const e = el('div', { class: 'pld-toast', text: t }); document.body.append(e);
      clearTimeout(toastTimer); toastTimer = setTimeout(() => e.remove(), 2600);
    }

    document.addEventListener('keydown', e => {
      const typing = /^(INPUT|TEXTAREA)$/.test(e.target.tagName) || e.target.isContentEditable;
      if (typing) return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); if (e.shiftKey) fwd(); else back(); }
      else if ((e.key === 'Delete' || e.key === 'Backspace') && sel !== 'page') { e.preventDefault(); removeBox(sel); }
      else if (e.key === 'Escape') { const f = find(sel); if (f && f.p) select(f.p.id); }
    });
    let resizeTimer = null;
    window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(draw, 80); });

    renderAll();
    const api = { plan: () => JSON.parse(JSON.stringify(plan)), layout: () => computeLayout(), planText, select, back, fwd };
    host.pld = api;
    return api;
  }

  window.PageLayoutDesigner = { mount, version: 1 };
})();
