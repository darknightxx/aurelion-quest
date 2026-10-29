/* ============================================================
   Top-left net bar: FPS meter + players online (Firebase RTDB presence)
   ============================================================ */
// Firebase Realtime Database URL, e.g. https://aurelion-quest-default-rtdb.asia-southeast1.firebasedatabase.app
// Firebase web config (Project settings → Your apps → SDK setup and configuration). Public by design; access is controlled by the database rules.
const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyDr_PQ6LzMmAD4bnuUb_I66chc2zGA04UY',
  authDomain: 'aurelion-quest.firebaseapp.com',
  databaseURL: 'https://aurelion-quest-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'aurelion-quest',
  storageBucket: 'aurelion-quest.firebasestorage.app',
  messagingSenderId: '192414438931',
  appId: '1:192414438931:web:7559b2a21fed7da28fd1e6'
};
const ONLINE_DB = FIREBASE_CONFIG && FIREBASE_CONFIG.databaseURL ? FIREBASE_CONFIG.databaseURL : '';

const Online = {
  id: (crypto && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2)).replace(/-/g, '').slice(0, 20),
  count: null, offset: 0, ok: false, fps: 0, cleaned: false,
  enabled() { return !!ONLINE_DB; },
  url(p, q = '') { return ONLINE_DB.replace(/\/$/, '') + p + '.json' + q; },
  async beat() {
    if (!this.enabled()) return UI.netbar();
    try {
      const r = await fetch(this.url('/presence/' + this.id), { method: 'PUT', body: JSON.stringify({ '.sv': 'timestamp' }) });
      if (!r.ok) throw new Error('put ' + r.status);
      const ts = await r.json(); if (typeof ts === 'number') this.offset = ts - Date.now();
      const since = Date.now() + this.offset - 75000;
      const q = await fetch(this.url('/presence', `?orderBy=%22%24value%22&startAt=${since}`));
      if (!q.ok) throw new Error('get ' + q.status);
      const d = await q.json(); this.count = Math.max(1, d ? Object.keys(d).length : 1); this.ok = true;
      if (!this.cleaned) { this.cleaned = true; this.cleanup(since - 10 * 60e3); }
    } catch (e) { this.ok = false; }
    UI.netbar();
  },
  // remove entries left behind by tabs that closed without saying goodbye
  async cleanup(before) {
    try {
      const q = await fetch(this.url('/presence', `?orderBy=%22%24value%22&endAt=${before}&limitToFirst=100`)); if (!q.ok) return;
      const d = await q.json(); const ks = d ? Object.keys(d) : []; if (!ks.length) return;
      await fetch(this.url('/presence'), { method: 'PATCH', body: JSON.stringify(Object.fromEntries(ks.map(k => [k, null]))) });
    } catch (e) { }
  },
  leave() { if (!this.enabled()) return; try { fetch(this.url('/presence/' + this.id), { method: 'DELETE', keepalive: true }); } catch (e) { } },
  start() {
    // FPS: count real animation frames
    let n = 0, t0 = performance.now();
    const tick = t => { n++; if (t - t0 >= 500) { this.fps = Math.round(n * 1000 / (t - t0)); n = 0; t0 = t; UI.netbar(true); } requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
    this.beat(); setInterval(() => { if (document.visibilityState === 'visible') this.beat(); }, 30000);
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') this.beat(); else this.leave(); });
    addEventListener('pagehide', () => this.leave());
  }
};

Object.assign(UI, {
  netbar(fpsOnly) {
    const f = document.getElementById('fps');
    if (f) { const v = Online.fps; f.textContent = 'FPS ' + (v || '--'); f.className = v >= 50 ? 'good' : v >= 30 ? 'mid' : 'bad'; }
    if (fpsOnly) return;
    const txt = !Online.enabled() ? '—' : Online.ok ? fmt(Online.count) : '—';
    const tip = !Online.enabled() ? 'ยังไม่ได้เชื่อมต่อระบบนับผู้เล่น' : Online.ok ? `ผู้เล่นที่เปิดเกมอยู่ตอนนี้ ${fmt(Online.count)} คน` : 'เชื่อมต่อระบบนับผู้เล่นไม่ได้';
    const o = document.getElementById('online'); if (o) { o.querySelector('b').textContent = txt; o.title = tip; o.classList.toggle('off', !Online.ok); }
    const l = document.getElementById('lbonline'); if (l) { l.hidden = !(Online.enabled() && Online.ok); l.querySelector('b').textContent = txt; }
  }
});

