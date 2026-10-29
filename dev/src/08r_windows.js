/* ============================================================
   Window manager: every panel is its own draggable window, several
   can be open at once (RO style). Panels keep using this.el.pbody /
   this.setPanel / this.panelOpt — these now point at the window
   being rendered (the focused one).
   ============================================================ */
const WM = {
  wins: new Map(), cur: null, z: 60, layer: null, pos: {},
  init() {
    if (this.layer) return; this.layer = document.createElement('div'); this.layer.id = 'winlayer'; document.getElementById('app').appendChild(this.layer);
    try { this.pos = JSON.parse(localStorage.getItem('aq_winpos') || '{}') || {}; } catch (e) { this.pos = {}; }
    const old = UI.el; const base = { panel: old.panel, pbody: old.pbody, ptitle: old.ptitle };
    Object.defineProperty(old, 'panel', { get: () => WM.cur ? WM.cur.el : base.panel, configurable: true });
    Object.defineProperty(old, 'pbody', { get: () => WM.cur ? WM.cur.body : base.pbody, configurable: true });
    Object.defineProperty(old, 'ptitle', { get: () => WM.cur ? WM.cur.title : base.ptitle, configurable: true });
    base.panel.hidden = true;
    addEventListener('resize', () => { for (const w of this.wins.values()) this.clamp(w); });
  },
  isOpen(k) { return this.wins.has(k); },
  with(k, fn) { const w = this.wins.get(k); if (!w) return; const keep = this.cur; this.cur = w; try { fn(); } finally { if (this.wins.has(keep && keep.kind)) this.cur = keep; } },
  render(k) { this.with(k, () => UI.renderPanel()); },
  create(kind) {
    const el = document.createElement('div'); el.className = 'uwin'; el.dataset.kind = kind;
    el.innerHTML = `<div class="pwin frame" role="dialog" aria-label="${kind}"><div class="phead"><div class="ptitle"></div><button class="pclose" aria-label="ปิด"><svg class="ic" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg></button></div><div class="pbody"></div></div>`;
    const w = { kind, el, body: el.querySelector('.pbody'), title: el.querySelector('.ptitle'), opt: {}, placed: false };
    el.querySelector('.pclose').addEventListener('click', e => { e.stopPropagation(); this.close(kind); });
    el.addEventListener('pointerdown', () => this.focus(w), true);
    const head = el.querySelector('.phead');
    head.addEventListener('pointerdown', e => {
      if (e.target.closest('button,input,select,a')) return; e.preventDefault();
      const st = { x: e.clientX, y: e.clientY, l: w.x, t: w.y }; el.classList.add('drag'); try { head.setPointerCapture(e.pointerId); } catch (_) { }
      const mv = ev => { const d = Rot.delta(ev.clientX - st.x, ev.clientY - st.y); w.x = st.l + d.dx; w.y = st.t + d.dy; this.clamp(w); };
      const up = () => { el.classList.remove('drag'); head.removeEventListener('pointermove', mv); head.removeEventListener('pointerup', up); head.removeEventListener('pointercancel', up); this.pos[kind] = [Math.round(w.x), Math.round(w.y)]; try { localStorage.setItem('aq_winpos', JSON.stringify(this.pos)); } catch (_) { } };
      head.addEventListener('pointermove', mv); head.addEventListener('pointerup', up); head.addEventListener('pointercancel', up);
    });
    this.layer.appendChild(el); this.wins.set(kind, w); return w;
  },
  area() { const a = document.getElementById('app'); return { w: a.clientWidth, h: a.clientHeight }; },
  clamp(w) {
    const A = this.area(), r = w.el.firstElementChild; const z = UIScale.get('wiz'), ww = (r.offsetWidth || 400) * z, hh = (r.offsetHeight || 300) * z;
    w.x = clamp(w.x, -ww + 90, A.w - 90); w.y = clamp(w.y, 0, Math.max(0, A.h - 44));
    w.el.style.transform = `translate(${Math.round(w.x)}px,${Math.round(w.y)}px)`;
  },
  place(w) {
    const A = this.area(), r = w.el.firstElementChild, z = UIScale.get('wiz'), ww = (r.offsetWidth || 500) * z, hh = (r.offsetHeight || 400) * z; const p = this.pos[w.kind];
    if (p) { w.x = p[0]; w.y = p[1]; }
    else { const n = this.wins.size - 1; w.x = (A.w - ww) / 2 + n * 28; w.y = Math.max(8, (A.h - hh) / 2 + n * 24); }
    w.placed = true; this.clamp(w);
  },
  focus(w) { if (this.cur === w && w.el.style.zIndex) return; for (const o of this.wins.values()) o.el.classList.toggle('focus', o === w); w.el.style.zIndex = ++this.z; this.cur = w; },
  open(kind, opt = {}) {
    let w = this.wins.get(kind); const fresh = !w; if (!w) w = this.create(kind);
    w.opt = opt; this.focus(w); if (fresh) w.body.scrollTop = 0;
    UI.renderPanel(); if (!w.placed) this.place(w); else this.clamp(w);
    this.pauseSync();
  },
  close(kind) {
    const w = this.wins.get(kind); if (!w) return; w.el.remove(); this.wins.delete(kind);
    if (this.cur === w) { let top = null; for (const o of this.wins.values()) if (!top || +o.el.style.zIndex > +top.el.style.zIndex) top = o; this.cur = null; if (top) this.focus(top); }
    this.pauseSync(); if (Save.d) Save.write();
  },
  closeAll() { for (const k of [...this.wins.keys()]) this.close(k); },
  pauseSync() { const any = this.wins.size > 0; if (Settings.d.pauseWin === 0) { Game.pause(false, 'panel'); return; } Game.pause(any && Game.started, 'panel'); }
};
{
  const oinit = UI.init.bind(UI); UI.init = function () { oinit(); WM.init(); };
  Object.defineProperty(UI, 'panelOpen', { get() { return WM.cur ? WM.cur.kind : null; }, set(v) { if (v === null || v === undefined) WM.closeAll(); }, configurable: true });
  Object.defineProperty(UI, 'panelOpt', { get() { return WM.cur ? WM.cur.opt : {}; }, set(v) { if (WM.cur) WM.cur.opt = v || {}; }, configurable: true });
  UI.openPanel = function (kind, opt = {}) { if (this.quizOpen) return; if (Game.started && Settings.d.pauseWin !== 0) this.haltPlayer(); WM.open(kind, opt); };
  UI.closePanel = function () { if (WM.cur) WM.close(WM.cur.kind); };
  UI.setPanel = function (title, html, wide) { const w = WM.cur; if (!w) return; w.title.innerHTML = title; w.body.innerHTML = html; w.el.firstElementChild.classList.toggle('wide', !!wide); };
  UI.refreshInvIfOpen = function () { for (const k of ['inv', 'shop', 'wardrobe']) if (WM.isOpen(k)) WM.render(k); };
  // chat & channel & gm refreshers render into their own window even when another is focused
  const ocr = UI.chatRender && UI.chatRender.bind(UI); if (ocr) UI.chatRender = function () { if (WM.isOpen('chat')) WM.with('chat', () => ocr()); };
}

