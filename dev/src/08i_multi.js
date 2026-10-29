/* ============================================================
   Multiplayer stage 1: channels, remote players, chat, emotes, party
   Backends: Firebase Realtime Database (production) or a local
   BroadcastChannel stand-in (?net=local, for testing in two tabs).
   ============================================================ */
const NET_CHANNELS = 3, NET_CAP = 30, NET_PARTY_MAX = 4;
const FB_VER = '10.12.2';

/* ---------- local backend: replicated tree over BroadcastChannel ---------- */
class LocalBackend {
  async init() {
    this.uid = 'L' + Math.random().toString(36).slice(2, 10); this.tree = {}; this.watch_ = []; this.owned = new Set();
    this.bc = new BroadcastChannel('aurelion-net');
    this.bc.onmessage = e => this.recv(e.data);
    addEventListener('pagehide', () => { for (const p of this.owned) this.bc.postMessage({ op: 'set', path: p, val: null }); });
    this.bc.postMessage({ op: 'hello', from: this.uid });
    return this.uid;
  }
  now() { return Date.now(); }
  ts() { return Date.now(); }
  split(p) { return p.split('/').filter(Boolean); }
  get(path) { let n = this.tree; for (const k of this.split(path)) { if (!n || typeof n !== 'object') return null; n = n[k]; } return n === undefined ? null : n; }
  apply(path, val) {
    const ks = this.split(path); const before = {};
    for (const w of this.watch_) { const wk = this.split(w.path); if (ks.length > wk.length && wk.every((k, i) => k === ks[i])) { const ck = ks[wk.length]; before[w.id] = { ck, had: this.get(wk.concat(ck).join('/')) !== null }; } }
    let n = this.tree; for (let i = 0; i < ks.length - 1; i++) { if (!n[ks[i]] || typeof n[ks[i]] !== 'object') n[ks[i]] = {}; n = n[ks[i]]; }
    const last = ks[ks.length - 1];
    if (val === null || val === undefined) delete n[last]; else n[last] = JSON.parse(JSON.stringify(val));
    for (const w of this.watch_) {
      const wk = this.split(w.path); const b = before[w.id];
      if (b) { const cp = wk.concat(b.ck).join('/'); const v = this.get(cp); if (v === null) { if (b.had) w.cb.removed && w.cb.removed(b.ck); } else if (b.had) w.cb.changed && w.cb.changed(b.ck, v); else w.cb.added && w.cb.added(b.ck, v); }
      if (w.value && (ks.length >= wk.length ? wk.every((k, i) => k === ks[i]) : ks.every((k, i) => k === wk[i]))) w.value(this.get(w.path));
    }
  }
  recv(m) {
    if (m.op === 'set') this.apply(m.path, m.val);
    else if (m.op === 'hello') { for (const p of this.owned) { const v = this.get(p); if (v !== null) this.bc.postMessage({ op: 'set', path: p, val: v }); } }
  }
  set(path, val) { this.apply(path, val); this.bc.postMessage({ op: 'set', path, val }); if (val !== null) this.owned.add(path); else this.owned.delete(path); return Promise.resolve(); }
  update(path, obj) { for (const k in obj) this.set(path + '/' + k, obj[k]); return Promise.resolve(); }
  remove(path) { return this.set(path, null); }
  push(path, val) { const k = Date.now().toString(36) + Math.random().toString(36).slice(2, 6); this.set(path + '/' + k, val); return k; }
  onDisconnectRemove(path) { this.owned.add(path); }
  watch(path, cb) { const w = { id: Math.random(), path, cb }; this.watch_.push(w); const cur = this.get(path); if (cur && typeof cur === 'object') for (const k in cur) cb.added && cb.added(k, cur[k]); return () => { this.watch_ = this.watch_.filter(x => x !== w); }; }
  watchValue(path, fn) { const w = { id: Math.random(), path, cb: {}, value: fn }; this.watch_.push(w); fn(this.get(path)); return () => { this.watch_ = this.watch_.filter(x => x !== w); }; }
  async once(path) { return this.get(path); }
}

/* ---------- Firebase backend ---------- */
class FirebaseBackend {
  async init(cfg) {
    let mods;
    try { const b = `https://www.gstatic.com/firebasejs/${FB_VER}/`; mods = await Promise.all([import(b + 'firebase-app.js'), import(b + 'firebase-auth.js'), import(b + 'firebase-database.js')]); }
    catch (e) { const j = `https://cdn.jsdelivr.net/npm/firebase@${FB_VER}/`; mods = await Promise.all([import(j + 'app/+esm'), import(j + 'auth/+esm'), import(j + 'database/+esm')]); }
    const [A, Au, D] = mods; this.D = D;
    this.app = A.initializeApp(cfg, 'aurelion');
    // one anonymous player per browser tab (two tabs = two players, a reload keeps the same one)
    let auth; try { auth = Au.initializeAuth(this.app, { persistence: Au.browserSessionPersistence, popupRedirectResolver: Au.browserPopupRedirectResolver }); } catch (e) { auth = Au.getAuth(this.app); }
    this.Au = Au; this.auth = auth;
    // keep a signed-in user from earlier in this tab (e.g. a GM after reload), otherwise play anonymously
    const restored = await new Promise(r => { const u = Au.onAuthStateChanged(auth, x => { u(); r(x); }); });
    const user = restored || (await Au.signInAnonymously(auth)).user; this.uid = user.uid; this.email = user.email || '';
    this.db = D.getDatabase(this.app); this.off = 0;
    D.onValue(D.ref(this.db, '.info/serverTimeOffset'), s => { this.off = s.val() || 0; });
    return this.uid;
  }
  r(p) { return this.D.ref(this.db, p); }
  now() { return Date.now() + this.off; }
  ts() { return this.D.serverTimestamp(); }
  set(p, v) { return this.D.set(this.r(p), v); }
  update(p, v) { return this.D.update(this.r(p), v); }
  remove(p) { return this.D.remove(this.r(p)); }
  push(p, v) { const ref = this.D.push(this.r(p)); this.D.set(ref, v); return ref.key; }
  onDisconnectRemove(p) { this.D.onDisconnect(this.r(p)).remove(); }
  watch(p, cb, q) {
    const D = this.D; let ref = this.r(p); if (q && q.last) ref = D.query(ref, D.orderByChild('t'), D.limitToLast(q.last));
    const u = [D.onChildAdded(ref, s => cb.added && cb.added(s.key, s.val())), D.onChildChanged(ref, s => cb.changed && cb.changed(s.key, s.val())), D.onChildRemoved(ref, s => cb.removed && cb.removed(s.key))];
    return () => u.forEach(f => f());
  }
  watchValue(p, fn) { return this.D.onValue(this.r(p), s => fn(s.val())); }
  async once(p) { const s = await this.D.get(this.r(p)); return s.val(); }
}

/* ---------- chat safety ---------- */
const ChatFilter = {
  bad: ['fuck', 'fuk', 'fck', 'shit', 'bitch', 'asshole', 'dick', 'pussy', 'cunt', 'bastard', 'slut', 'whore', 'nigga', 'nigger', 'faggot', 'retard', 'motherfucker', 'wtf', 'stfu',
    'ควย', 'เหี้ย', 'เหี้ย', 'สัส', 'สัด', 'เย็ด', 'หี', 'แตด', 'ไอ้สัตว์', 'อีสัตว์', 'อีดอก', 'ดอกทอง', 'กะหรี่', 'ระยำ', 'ชาติหมา', 'พ่อมึงตาย', 'แม่มึงตาย', 'ส้นตีน', 'ตีน', 'จัญไร', 'อีเวร', 'ไอ้เวร', 'เงี่ยน', 'ร่าน', 'โง่ควาย', 'ไอ้ควาย', 'อีควาย', 'อีบ้า', 'ไอ้บ้า', 'มึงตาย', 'ไปตาย'],
  norm(s) { return s.toLowerCase().replace(/[0@4]/g, m => ({ '0': 'o', '@': 'a', '4': 'a' })[m]).replace(/[1!|]/g, 'i').replace(/3/g, 'e').replace(/\$/g, 's').replace(/[\s._\-*+~^'"`]/g, ''); },
  clean(text) {
    let t = String(text || '').replace(/[\u0000-\u001f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80);
    let pii = false;
    // links and contact details are hidden to keep players safe
    t = t.replace(/(https?:\/\/\S+|www\.\S+|\b\S+\.(com|net|org|io|gg|me|co|th|ly|xyz)\b\S*|line\.me\S*|discord\.gg\S*)/gi, () => { pii = true; return '[ลิงก์ถูกซ่อน]'; });
    t = t.replace(/(\+?\d[\d\s-]{7,}\d)/g, () => { pii = true; return '[ตัวเลขถูกซ่อน]'; });
    t = t.replace(/(ไลน์|line|ig|ไอจี|เฟส|facebook|fb)\s*(id)?\s*[:：]?\s*@?[a-z0-9._-]{3,}/gi, () => { pii = true; return '[ข้อมูลติดต่อถูกซ่อน]'; });
    // profanity, also when spaced out or written with symbols
    let bad = false;
    for (const w of this.bad) {
      const re = new RegExp(w.split('').map(ch => ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('[\\s._\\-*]*'), 'gi');
      if (re.test(t)) { bad = true; t = t.replace(re, m => '*'.repeat(Math.min(6, m.length))); }
    }
    if (!bad) { const n = this.norm(t); for (const w of this.bad) if (/^[a-z]+$/.test(w) && n.includes(w)) { bad = true; t = '*'.repeat(Math.min(12, t.length)); break; } }
    return { text: t, bad, pii };
  },
  name(n) { const r = this.clean(n || 'ผู้เล่น'); return (r.bad || r.pii) ? 'นักผจญภัย' : (r.text || 'นักผจญภัย'); }
};

/* ---------- remote players ---------- */
const Remote = {
  map: new Map(),
  list() { return [...this.map.values()]; },
  upsert(uid, st) {
    if (!st || uid === Net.uid) return;
    let p = this.map.get(uid);
    if (!p) { p = { uid, dx: st.x, dz: st.z, face: st.f || 0, walk: 0, ph: 0, anim: Math.random() * 9, mst: { ph: 0, amp: 0, t: 0 }, seen: '', bubble: null, emo: null }; this.map.set(uid, p); }
    const prevAc = p.st && p.st.ac;
    p.st = st; p.name = ChatFilter.name(st.n); p.last = performance.now();
    if (Math.hypot(st.x - p.dx, st.z - p.dz) > 12 || p.zone !== st.zn) { p.dx = st.x; p.dz = st.z; }
    p.zone = st.zn;
    if (st.ac && st.ac !== prevAc && st.ac !== p.seen) { p.seen = st.ac; this.action(p, st.ac); }
  },
  remove(uid) { this.map.delete(uid); },
  rig(p) { const sh = p.st.o && CharModels[p.st.o] ? p.st.o : p.st.c; if (!p.rig || p.rig.cls !== sh) p.rig = new Rig(sh); return p.rig; },
  action(p, ac) {
    const [k, id] = ac.split(':'); const rg = this.rig(p);
    if (performance.now() - p.last > 2000) return;
    if (k === 'atk') rg.play(BASIC_ANIM[p.st.c] || 'slash', 1.4);
    else if (k === 'sk') { rg.play(SKILL_ANIM[id] || 'cast', 1); const sk = SKILLS[id]; if (sk) { Fx.glow(p.dx, 1.3, p.dz, 1.2, sk.col, .4); Fx.shock(p.dx, p.dz, 2, sk.col, .45); } }
    else if (k === 'emo') this.emote(p, id);
  },
  emote(p, id) { const e = EMOTES.find(x => x.id === id); if (!e) return; p.emo = { e: e.e, t: 2.6 }; const rg = this.rig(p); if (id === 'wave') p.waveT = 1.6; else { rg.clip = null; rg.play(EMOTE_CLIP[id] || 'cheer', 1); } },
  update(dt) {
    const now = performance.now(), Pz = Player.zone;
    for (const p of this.map.values()) {
      if (Net.stale(p)) { this.map.delete(p.uid); continue; }
      const st = p.st; p.anim += dt;
      const ox = p.dx, oz = p.dz; const k = Math.min(1, dt * 9);
      p.dx += (st.x - p.dx) * k; p.dz += (st.z - p.dz) * k; p.face += angWrap((st.f || 0) - p.face) * Math.min(1, dt * 10);
      const sp = Math.hypot(p.dx - ox, p.dz - oz) / Math.max(dt, 1e-3);
      p.walk = lerp(p.walk, sp > .6 ? 1 : 0, Math.min(1, dt * 8)); p.ph += sp * dt * TAU / 2.1;
      if (p.emo) { p.emo.t -= dt; if (p.emo.t <= 0) p.emo = null; }
      if (p.bubble && now > p.bubble.until) p.bubble = null;
      p.waveT = Math.max(0, (p.waveT || 0) - dt);
      if (p.zone !== Pz) continue;
      const riding = !!st.m && MOUNTS[st.m];
      this.rig(p).update(dt, { walk: riding ? 0 : p.walk, ph: p.ph, speed: riding ? 0 : sp, ride: riding, dead: !!st.d, wave: p.waveT > 0 });
      if (riding) { p.mst.t += dt; p.mst.amp = lerp(p.mst.amp, sp > .6 ? 1 : 0, Math.min(1, dt * 8)); p.mst.ph += sp * dt * TAU / (MOUNTS[st.m].kind === 'hop' ? 1.6 : 2.6); }
      // cosmetic aura particles (light)
      if (st.a && Math.random() < dt * 6 && dist2(p.dx, p.dz, Player.x, Player.z) < 30 * 30) {
        const a = Math.random() * TAU, r = .8;
        const c = st.a === 'c_soul' ? [.55, .85, 1] : st.a === 'c_ember' ? [1, .5, .15] : st.a === 'c_fairy' ? pick([[.6, 1, .9], [1, .9, .5]]) : st.a === 'c_rainbow' ? [.5 + .5 * Math.cos(p.anim), .5 + .5 * Math.cos(p.anim - 2), .5 + .5 * Math.cos(p.anim - 4)] : [1, .95, .6];
        Particles.add(p.dx + Math.cos(a) * r, .4 + Math.random() * 1.8, p.dz + Math.sin(a) * r, { c, s: .22, life: 1, vy: .5 });
      }
    }
  },
  draw(R) {
    const Pz = Player.zone;
    for (const p of this.map.values()) {
      if (p.zone !== Pz || dist2(p.dx, p.dz, Player.x, Player.z) > 70 * 70) continue;
      const st = p.st, rig = this.rig(p); const riding = st.m && MOUNTS[st.m];
      let seat = null; if (riding && !st.d) seat = drawMount(R, MountMeshes, st.m, p.dx, 0, p.dz, p.face, p.mst, 1);
      if (seat) rig.pose(seat[0], seat[1] - HIPY * CHAR_SCALE + .05, seat[2], p.face, CHAR_SCALE);
      else rig.pose(p.dx, 0, p.dz, p.face, CHAR_SCALE, st.d ? 1 : 0);
      const sh = st.o && CharModels[st.o] ? st.o : st.c;
      rig.draw(R, CharModels[sh]);
      if (!st.d) drawCosmetics3D(R, rig, { head: st.h || null, face: st.fc || null, back: st.b || null, sheet: sh, anim: p.anim, walk: p.walk });
    }
  }
};

/* ---------- emotes ---------- */
const EMOTES = [
  { id: 'wave', e: '👋', n: 'ทักทาย' }, { id: 'cheer', e: '🎉', n: 'เฮ!' }, { id: 'laugh', e: '😂', n: 'ฮ่าๆ' },
  { id: 'love', e: '❤️', n: 'ชอบ' }, { id: 'good', e: '👍', n: 'เยี่ยม' }, { id: 'thanks', e: '🙏', n: 'ขอบคุณ' }, { id: 'sad', e: '😢', n: 'เศร้า' }, { id: 'angry', e: '😠', n: 'โกรธ' },
  { id: 'bow', e: '🙇', n: 'คำนับ' }, { id: 'flex', e: '💪', n: 'โชว์กล้าม' }, { id: 'dance', e: '💃', n: 'เต้น' }, { id: 'sit', e: '🪑', n: 'นั่งพัก' }, { id: 'point', e: '👉', n: 'ชี้' }, { id: 'kneel', e: '🧎', n: 'คุกเข่า' }, { id: 'victory', e: '🏆', n: 'ชัยชนะ' }
];

/* ---------- network session ---------- */
const Net = {
  mode: 'off', be: null, uid: null, ch: 0, joined: false, status: 'ออฟไลน์', unsub: [], sendT: 0, beatT: 0, lastSent: null, acN: 0, ac: '',
  chat: [], unread: 0, muted: new Set(), sendLog: [], party: null, partyId: '', invites: [], chatTab: 'all',
  async init() {
    try { this.muted = new Set(JSON.parse(localStorage.getItem('aurelion_muted') || '[]')); } catch (e) { }
    const q = new URLSearchParams(location.search);
    const want = q.get('net') === 'local' ? 'local' : (typeof FIREBASE_CONFIG === 'object' && FIREBASE_CONFIG && FIREBASE_CONFIG.apiKey ? 'firebase' : 'off');
    if (want === 'off') { this.status = 'ออฟไลน์ (เล่นคนเดียว)'; UI.netState(); return; }
    this.status = 'กำลังเชื่อมต่อ…'; UI.netState();
    try {
      this.be = want === 'local' ? new LocalBackend() : new FirebaseBackend();
      this.uid = await this.be.init(FIREBASE_CONFIG); this.mode = want; this.status = 'เชื่อมต่อแล้ว';
      if (Game.started) this.join();
    } catch (e) { console.warn('net', e); this.mode = 'off'; this.be = null; this.status = 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้'; }
    UI.netState();
  },
  online() { return this.mode !== 'off' && !!this.be; },
  stale(p) { return this.online() && p.st && typeof p.st.t === 'number' && this.be.now() - p.st.t > 25000; },
  async pickChannel() {
    let best = 1, bestN = -1;
    for (let c = 1; c <= NET_CHANNELS; c++) { const v = await this.be.once(`ch/${c}/players`); const n = v ? Object.values(v).filter(s => s && this.be.now() - (s.t || 0) < 25000).length : 0; if (n < NET_CAP && n > bestN) { best = c; bestN = n; } }
    return best;
  },
  async channelCounts() { const out = []; for (let c = 1; c <= NET_CHANNELS; c++) { const v = await this.be.once(`ch/${c}/players`); out.push(v ? Object.values(v).filter(s => s && this.be.now() - (s.t || 0) < 25000).length : 0); } return out; },
  async join(ch) {
    if (!this.online() || !Save.d) return;
    if (this.joined) this.leave(true);
    this.ch = ch || await this.pickChannel(); this.joined = true; Remote.map.clear(); this.chat = []; this.unread = 0;
    const base = `ch/${this.ch}`;
    this.be.onDisconnectRemove(`${base}/players/${this.uid}`);
    this.send(true);
    clearInterval(this.beatI); this.beatI = setInterval(() => { this.beatT += 5; this.send(false); }, 5000);
    this.unsub.push(this.be.watch(`${base}/players`, { added: (k, v) => Remote.upsert(k, v), changed: (k, v) => Remote.upsert(k, v), removed: k => Remote.remove(k) }));
    const t0 = this.be.now() - 10 * 60e3;
    this.unsub.push(this.be.watch(`${base}/chat`, { added: (k, v) => { if (v && (v.t || 0) > t0) this.onChat(k, v); } }, { last: 40 }));
    this.unsub.push(this.be.watch(`invites/${this.uid}`, { added: (k, v) => this.onInvite(k, v), removed: k => { this.invites = this.invites.filter(i => i.from !== k); UI.partyUI(); } }));
    if (this.partyId) this.watchParty(this.partyId);
    this.watchMod();
    this.status = `CH${this.ch}`; UI.netState(); UI.toast(`เข้าสู่เซิร์ฟเวอร์ CH${this.ch}`, 'info');
    // tidy chat older than an hour (rules allow anyone to remove stale messages)
    setTimeout(async () => { try { const v = await this.be.once(`${base}/chat`); if (!v) return; const old = Object.keys(v).filter(k => (v[k].t || 0) < this.be.now() - 3600e3).slice(0, 50); for (const k of old) this.be.remove(`${base}/chat/${k}`); } catch (e) { } }, 4000);
  },
  leave(silent) {
    if (!this.joined) return; this.unsub.forEach(f => { try { f(); } catch (e) { } }); this.unsub = [];
    clearInterval(this.beatI); this.be.remove(`ch/${this.ch}/players/${this.uid}`); this.joined = false; Remote.map.clear(); if (!silent) { this.status = 'เชื่อมต่อแล้ว'; UI.netState(); }
  },
  myState() {
    const S = Save.d, P = Player; const r2 = v => Math.round(v * 100) / 100;
    return { gm: this.gm ? 1 : 0, n: S.name.slice(0, 16), c: S.cls, j: S.job || '', k: S.awk ? 1 : 0, lv: S.level, o: P.sheet, h: S.cos.head || '', fc: S.cos.face || '', b: S.cos.back || '', a: S.cos.aura || '', m: Mounts.riding() ? Mounts.cur() : '', zn: P.zone, x: r2(P.x), z: r2(P.z), f: r2(P.face), hp: Math.max(0, Math.round(S.hp / P.stats.maxhp * 100)), d: P.dead ? 1 : 0, ac: this.ac, p: this.partyId || '', t: this.be.ts() };
  },
  send(force) {
    if (!this.joined) return; const st = this.myState(); const L = this.lastSent;
    const changed = !L || force || Math.abs(st.x - L.x) > .04 || Math.abs(st.z - L.z) > .04 || Math.abs(angWrap(st.f - L.f)) > .05 || ['zn', 'm', 'o', 'h', 'b', 'a', 'd', 'ac', 'p', 'lv', 'n', 'gm', 'j', 'k'].some(k => st[k] !== L[k]) || Math.abs(st.hp - L.hp) >= 5;
    if (!changed && this.beatT < 8) return;
    this.beatT = 0; this.lastSent = Object.assign({}, st); this.be.set(`ch/${this.ch}/players/${this.uid}`, st);
  },
  act(k, id) { if (!this.joined) return; this.acN = (this.acN + 1) % 1000; this.ac = `${k}:${id || ''}:${this.acN}`; this.send(true); },
  tick(dt) {
    if (!this.joined) return; this.sendT += dt; this.beatT += dt;
    if (this.sendT >= .2) { this.sendT = 0; this.send(false); }
  },
  /* ---- chat ---- */
  onChat(k, v) {
    if (this.chat.some(c => c.k === k)) return;
    const msg = { k, u: v.u, n: ChatFilter.name(v.n), m: v.gm ? String(v.m || '').slice(0, 100) : ChatFilter.clean(v.m).text, t: v.t, kind: v.k || 'w', p: v.p || '', gm: !!v.gm };
    if (msg.kind === 'p' && msg.p !== this.partyId) return;
    this.chat.push(msg); if (this.chat.length > 80) this.chat.shift();
    if (this.muted.has(msg.u)) return;
    const peer = Remote.map.get(msg.u); if (peer) peer.bubble = { text: msg.m, until: performance.now() + 5500 };
    if (msg.u === this.uid) this.selfBubble = { text: msg.m, until: performance.now() + 5500 };
    if (msg.u !== this.uid && !WM.isOpen('chat')) this.unread++;
    UI.chatLog(); if (WM.isOpen('chat')) UI.chatRender();
  },
  sendChat(text, kind = 'w') {
    if (!this.joined) { UI.toast('ยังไม่ได้เชื่อมต่อเซิร์ฟเวอร์', 'warn'); return false; }
    const now = performance.now(); this.sendLog = this.sendLog.filter(t => now - t < 15000);
    if (this.sendLog.length && now - this.sendLog[this.sendLog.length - 1] < 1500) { UI.toast('ส่งข้อความเร็วเกินไป รอสักครู่', 'warn'); return false; }
    if (this.sendLog.length >= 5) { UI.toast('ส่งข้อความถี่เกินไป รอ 15 วินาที', 'warn'); return false; }
    const r = ChatFilter.clean(text); if (!r.text) return false;
    if (this.lastText === r.text && now - (this.lastTextT || 0) < 30000) { UI.toast('ไม่ส่งข้อความซ้ำกันติดๆ', 'warn'); return false; }
    if (r.pii) UI.toast('ซ่อนลิงก์หรือข้อมูลติดต่อให้แล้ว เพื่อความปลอดภัย', 'warn');
    if (r.bad) UI.toast('คำไม่สุภาพถูกซ่อน', 'warn');
    if (kind === 'p' && !this.partyId) { UI.toast('ยังไม่ได้อยู่ในปาร์ตี้', 'warn'); return false; }
    this.sendLog.push(now); this.lastText = r.text; this.lastTextT = now;
    this.be.push(`ch/${this.ch}/chat`, { u: this.uid, n: Save.d.name.slice(0, 16), m: r.text, t: this.be.ts(), k: kind, p: kind === 'p' ? this.partyId : '', gm: this.gm ? 1 : 0 });
    return true;
  },
  mute(uid, on) { if (on) this.muted.add(uid); else this.muted.delete(uid); try { localStorage.setItem('aurelion_muted', JSON.stringify([...this.muted])); } catch (e) { } UI.chatLog(); },
  report(p) {
    const last = [...this.chat].reverse().find(c => c.u === p.uid);
    this.be.push('reports', { by: this.uid, target: p.uid, tn: (p.st.n || '').slice(0, 16), msg: last ? last.m : '', ch: this.ch, t: this.be.ts() });
    UI.toast('ส่งรายงานแล้ว ขอบคุณที่ช่วยดูแลชุมชน', 'quest');
  },
  emote(id) { const e = EMOTES.find(x => x.id === id); if (!e) return; this.selfEmo = { e: e.e, t: 2.6 }; const rg = Player.getRig(); if (id === 'wave') Player.waveT = 1.6; else if (!rg.busy) { rg.play(EMOTE_CLIP[id] || 'cheer'); Player.act = 'cheer'; Player.actT = CLIPS[EMOTE_CLIP[id] || 'cheer'].dur; } this.act('emo', id); },
  /* ---- party ---- */
  async invite(p) {
    if (!this.joined) return;
    if (p.st.p) { UI.toast(`${p.name} อยู่ในปาร์ตี้อื่นแล้ว`, 'warn'); return; }
    if (this.party && Object.keys(this.party.members || {}).length >= NET_PARTY_MAX) { UI.toast('ปาร์ตี้เต็มแล้ว (สูงสุด 4 คน)', 'warn'); return; }
    if (!this.partyId) {
      const pid = 'P' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      await this.be.set(`parties/${pid}/leader`, this.uid); await this.be.set(`parties/${pid}/members/${this.uid}`, this.memberInfo());
      this.setParty(pid);
    }
    this.be.set(`invites/${p.uid}/${this.uid}`, { n: Save.d.name.slice(0, 16), p: this.partyId, t: this.be.ts() });
    UI.toast(`ส่งคำชวนให้ ${p.name} แล้ว`, 'quest');
  },
  memberInfo() { return { n: Save.d.name.slice(0, 16), c: Save.d.cls, lv: Save.d.level }; },
  onInvite(from, v) { if (!v || this.muted.has(from)) { this.be.remove(`invites/${this.uid}/${from}`); return; } this.invites = this.invites.filter(i => i.from !== from); this.invites.push({ from, n: ChatFilter.name(v.n), p: v.p }); UI.partyUI(); Audio.sfx('quest'); },
  async answer(from, ok) {
    const inv = this.invites.find(i => i.from === from); this.invites = this.invites.filter(i => i.from !== from); this.be.remove(`invites/${this.uid}/${from}`);
    if (ok && inv) {
      const party = await this.be.once(`parties/${inv.p}`);
      if (!party || !party.members) { UI.toast('ปาร์ตี้นี้ไม่มีอยู่แล้ว', 'warn'); }
      else if (Object.keys(party.members).length >= NET_PARTY_MAX) UI.toast('ปาร์ตี้เต็มแล้ว', 'warn');
      else { if (this.partyId) await this.leaveParty(true); await this.be.set(`parties/${inv.p}/members/${this.uid}`, this.memberInfo()); this.setParty(inv.p); UI.toast(`เข้าร่วมปาร์ตี้ของ ${inv.n} แล้ว`, 'quest'); }
    }
    UI.partyUI();
  },
  setParty(pid) { this.partyId = pid; this.watchParty(pid); this.send(true); UI.partyUI(); },
  watchParty(pid) {
    if (this.partyUnsub) this.partyUnsub();
    this.partyUnsub = this.be.watchValue(`parties/${pid}`, v => {
      if (!v || !v.members || !v.members[this.uid]) { if (this.partyId === pid && this.party) UI.toast('ออกจากปาร์ตี้แล้ว', 'info'); this.party = null; this.partyId = ''; if (this.partyUnsub) { const f = this.partyUnsub; this.partyUnsub = null; setTimeout(f, 0); } this.send(true); UI.partyUI(); return; }
      this.party = v; UI.partyUI();
    });
  },
  async leaveParty(silent) {
    const pid = this.partyId, v = this.party; if (!pid) return;
    const others = v && v.members ? Object.keys(v.members).filter(k => k !== this.uid) : [];
    if (v && v.leader === this.uid) { if (others.length) await this.be.set(`parties/${pid}/leader`, others[0]); else await this.be.remove(`parties/${pid}/leader`); }
    await this.be.remove(`parties/${pid}/members/${this.uid}`);
    this.party = null; this.partyId = ''; if (this.partyUnsub) { this.partyUnsub(); this.partyUnsub = null; }
    this.send(true); UI.partyUI(); if (!silent) UI.toast('ออกจากปาร์ตี้แล้ว', 'info');
  },
  kick(uid) { if (this.party && this.party.leader === this.uid) this.be.remove(`parties/${this.partyId}/members/${uid}`); },
  partyNear() { if (!this.party || !this.party.members) return false; for (const uid in this.party.members) { if (uid === this.uid) continue; const p = Remote.map.get(uid); if (p && p.zone === Player.zone && dist2(p.dx, p.dz, Player.x, Player.z) < 40 * 40) return true; } return false; }
};

/* ---------- UI ---------- */
Object.assign(UI, {
  netState() {
    const c = document.getElementById('chpill'); if (!c) return;
    c.hidden = !Net.online(); c.querySelector('b').textContent = Net.joined ? 'CH' + Net.ch : '…';
    const w = document.getElementById('chatwrap'); if (w) w.hidden = !Net.online();
  },
  chatLog() {
    const el = document.getElementById('chatlog'); if (!el) return;
    const now = Net.be ? Net.be.now() : Date.now();
    const rows = Net.chat.filter(c => !Net.muted.has(c.u)).slice(-5);
    el.innerHTML = rows.map(c => `<p class="${c.kind === 'p' ? 'pt' : ''} ${c.kind === 'sys' ? 'sys' : ''} ${c.gm ? 'gm' : ''} ${c.u === Net.uid ? 'me' : ''}"><b>${c.kind === 'p' ? '[ปาร์ตี้] ' : ''}${c.gm ? '[GM] ' : ''}${esc(c.n)}:</b> ${esc(c.m)}</p>`).join('');
    el.classList.remove('fade'); clearTimeout(this._chatFade); this._chatFade = setTimeout(() => el.classList.add('fade'), 12000);
    const b = document.getElementById('chatunread'); if (b) { b.textContent = Net.unread > 9 ? '9+' : Net.unread; b.hidden = !Net.unread; }
  },
  chatRender() {
    const box = document.getElementById('chatfull'); if (!box) return;
    const tab = Net.chatTab; const rows = Net.chat.filter(c => !Net.muted.has(c.u) && (tab === 'all' || c.kind === 'p'));
    box.innerHTML = rows.length ? rows.map(c => `<li class="${c.kind === 'p' ? 'pt' : ''} ${c.kind === 'sys' ? 'sys' : ''} ${c.gm ? 'gm' : ''} ${c.u === Net.uid ? 'me' : ''}"><b>${c.kind === 'p' ? '[ปาร์ตี้] ' : ''}${c.gm ? '[GM] ' : ''}${esc(c.n)}</b><span>${esc(c.m)}</span></li>`).join('') : '<li class="emptyrow">ยังไม่มีข้อความ ทักทายเพื่อนๆ ได้เลย</li>';
    box.scrollTop = box.scrollHeight;
  },
  pChat() {
    Net.unread = 0; this.chatLog();
    const tab = Net.chatTab;
    this.setPanel(`${icon('help')} แชต <span class="coin">CH${Net.ch || '-'}</span>`, `
      <div class="tabs" role="tablist"><button class="tab ${tab === 'all' ? 'on' : ''}" data-ct="all">ทั้งหมด</button><button class="tab ${tab === 'p' ? 'on' : ''}" data-ct="p">ปาร์ตี้</button></div>
      <ul class="chatfull" id="chatfull"></ul>
      <div class="emorow">${EMOTES.map(e => `<button class="emo" data-emo="${e.id}" title="${e.n}" aria-label="${e.n}">${e.e}</button>`).join('')}</div>
      <form class="chatform" id="chatform"><input id="chatin" maxlength="80" autocomplete="off" placeholder="${tab === 'p' ? 'พิมพ์ถึงปาร์ตี้…' : 'พิมพ์ข้อความ… (สุภาพและไม่บอกข้อมูลส่วนตัว)'}" ${Rot.on ? 'readonly' : ''}><button class="btn" type="submit">ส่ง</button></form>
      <p class="muted chatnote">ข้อความหยาบ ลิงก์ เบอร์โทร และไอดีติดต่อจะถูกซ่อนอัตโนมัติ · แตะชื่อผู้เล่นในเกมเพื่อปิดเสียงหรือรายงาน</p>`, true);
    this.chatRender();
    const f = $('#chatform'), inp = $('#chatin');
    f.onsubmit = e => { e.preventDefault(); if (Net.sendChat(inp.value, Net.chatTab === 'p' ? 'p' : 'w')) inp.value = ''; };
    if (Rot.on) inp.onclick = () => this.compose(Net.chatTab === 'p' ? 'p' : 'w');
    this.el.pbody.onclick = e => {
      const t = e.target.closest('[data-ct]'); if (t) { Net.chatTab = t.dataset.ct; return this.renderPanel(); }
      const m = e.target.closest('[data-emo]'); if (m) { Net.emote(m.dataset.emo); this.closePanel(); }
    };
  },
  // text entry outside the rotated app so the phone keyboard lines up with the input
  compose(kind) {
    const c = document.getElementById('chatcompose'), i = document.getElementById('composein');
    c.hidden = false; i.value = ''; i.placeholder = kind === 'p' ? 'พิมพ์ถึงปาร์ตี้…' : 'พิมพ์ข้อความ…'; setTimeout(() => i.focus(), 30);
    const done = () => { c.hidden = true; i.blur(); };
    document.getElementById('composeform').onsubmit = e => { e.preventDefault(); if (Net.sendChat(i.value, kind)) { done(); if (WM.isOpen('chat')) UI.chatRender(); } };
    document.getElementById('composex').onclick = done;
  },
  peerCard(p) {
    const el = $('#peercard'); const st = p.st; const cls = (st.j && JOBS[st.j]) || CLASSES[st.c] || CLASSES.adventurer; const role = ROLES[cls.role];
    const inParty = Net.party && Net.party.members && Net.party.members[p.uid];
    const muted = Net.muted.has(p.uid);
    el.innerHTML = `<div class="pcbox" role="dialog" aria-label="ผู้เล่น ${esc(p.name)}"><button class="pcx" data-pc="x" aria-label="ปิด">${icon('close')}</button>
      <div class="pchead"><img src="${this.portraits[st.o] || this.portraits[st.c] || ''}" alt=""><div><b>${esc(p.name)}</b><small>${st.k ? 'ผู้ตื่นรู้ ' : ''}${cls.name} · Lv.${st.lv} · <span style="color:${role.col}">${role.name}</span></small>${st.p ? `<small>${inParty ? 'อยู่ปาร์ตี้เดียวกับคุณ' : 'อยู่ในปาร์ตี้'}</small>` : ''}</div></div>
      <div class="pcbtns">${inParty ? '' : `<button class="btn" data-pc="inv" ${st.p ? 'disabled' : ''}>ชวนเข้าปาร์ตี้</button>`}${inParty && Net.party.leader === Net.uid ? `<button class="btn ghost" data-pc="kick">เชิญออกจากปาร์ตี้</button>` : ''}
      <button class="btn ghost" data-pc="mute">${muted ? 'เลิกปิดเสียง' : 'ปิดเสียงแชต'}</button><button class="btn ghost danger" data-pc="rep">รายงาน</button></div></div>`;
    el.hidden = false;
    el.onclick = e => {
      const b = e.target.closest('[data-pc]'); if (e.target === el || (b && b.dataset.pc === 'x')) { el.hidden = true; return; } if (!b) return;
      const k = b.dataset.pc;
      if (k === 'rep' && !b.dataset.armed) { b.dataset.armed = 1; b.textContent = 'แตะอีกครั้งเพื่อยืนยันรายงาน'; return; }
      el.hidden = true;
      if (k === 'inv') Net.invite(p); else if (k === 'kick') Net.kick(p.uid); else if (k === 'mute') { Net.mute(p.uid, !muted); UI.toast(muted ? 'เลิกปิดเสียงแล้ว' : `ปิดเสียง ${p.name} แล้ว`, 'info'); } else if (k === 'rep') Net.report(p);
    };
  },
  partyUI() {
    const el = $('#partyhud'); if (!el) return;
    const inv = Net.invites[0];
    let h = '';
    if (inv) h += `<div class="pinv"><span><b>${esc(inv.n)}</b> ชวนเข้าปาร์ตี้</span><button class="btn sm" data-pi="ok:${inv.from}">เข้าร่วม</button><button class="btn sm ghost" data-pi="no:${inv.from}">ไม่</button></div>`;
    const P = Net.party;
    if (P && P.members) {
      const ms = Object.entries(P.members);
      h += `<div class="plist"><div class="phd">ปาร์ตี้ ${ms.length}/${NET_PARTY_MAX}${Net.partyNear() ? ' · EXP +10%' : ''}<button class="pleave" data-pi="leave">ออก</button></div>` + ms.map(([uid, m]) => {
        const me = uid === Net.uid; const peer = Remote.map.get(uid); const hp = me ? Math.round(Save.d.hp / Player.stats.maxhp * 100) : peer ? peer.st.hp : null; const far = !me && (!peer || peer.zone !== Player.zone);
        return `<div class="pm ${me ? 'me' : ''} ${far ? 'far' : ''}">${P.leader === uid ? '<i class="crown">★</i>' : ''}<span>${esc(ChatFilter.name(m.n))}</span><small>Lv.${m.lv}</small>${hp !== null && hp !== undefined ? `<span class="phb"><i style="width:${hp}%"></i></span>` : '<small>ออฟไลน์</small>'}</div>`;
      }).join('') + '</div>';
    }
    el.innerHTML = h; el.hidden = !h;
    el.onclick = e => { const b = e.target.closest('[data-pi]'); if (!b) return; const [k, id] = b.dataset.pi.split(':'); if (k === 'ok') Net.answer(id, true); else if (k === 'no') Net.answer(id, false); else if (k === 'leave') Net.leaveParty(); };
  },
  async pChannels() {
    this.setPanel(`${icon('map')} เลือกเซิร์ฟเวอร์`, `<p class="muted">กำลังโหลดจำนวนผู้เล่น…</p>`);
    let counts = []; try { counts = await Net.channelCounts(); } catch (e) { }
    if (UI.panelOpen !== 'channels') return;
    this.setPanel(`${icon('map')} เลือกเซิร์ฟเวอร์`, `<ul class="chlist">${Array.from({ length: NET_CHANNELS }, (_, i) => { const c = i + 1, n = counts[i] || 0, full = n >= NET_CAP; return `<li class="${Net.ch === c ? 'on' : ''}"><b>CH${c}</b><span class="chbar"><i style="width:${Math.min(100, n / NET_CAP * 100)}%"></i></span><small>${n}/${NET_CAP} คน</small><button class="btn sm" data-ch="${c}" ${Net.ch === c || full ? 'disabled' : ''}>${Net.ch === c ? 'อยู่ที่นี่' : full ? 'เต็ม' : 'ย้าย'}</button></li>`; }).join('')}</ul><p class="muted">ผู้เล่นในเซิร์ฟเวอร์เดียวกันจะเห็นกัน คุยกัน และตั้งปาร์ตี้ด้วยกันได้</p>`);
    this.el.pbody.onclick = e => { const b = e.target.closest('[data-ch]'); if (!b) return; Net.join(+b.dataset.ch); this.closePanel(); };
  },
  netPlates(want) {
    if (!Net.joined) return;
    const P = Player;
    for (const p of Remote.map.values()) {
      if (p.zone !== P.zone || dist2(p.dx, p.dz, P.x, P.z) > 36 * 36) continue;
      const party = Net.party && Net.party.members && Net.party.members[p.uid];
      const muted = Net.muted.has(p.uid);
      const y = SPR_H + .3 + (p.st.m && MOUNTS[p.st.m] ? MOUNTS[p.st.m].seat[0] * .8 : 0);
      want.push({ key: 'u' + p.uid, x: p.dx, y, z: p.dz, cls: 'peer' + (party ? ' party' : '') + (p.st.gm ? ' gm' : ''), html: () => `${p.emo ? `<span class="emob">${p.emo.e}</span>` : p.bubble && !muted ? `<span class="bub">${esc(p.bubble.text)}</span>` : ''}<span class="nm pe">${p.st.gm ? '<i class="gmtag">GM</i> ' : ''}${party ? '★ ' : ''}${esc(p.name)} <small>Lv.${p.st.lv}</small></span>` });
    }
  },
  selfPlate() {
    const e = Net.selfEmo, b = Net.selfBubble; const now = performance.now();
    if (e && (e.t -= 1 / 60) <= 0) Net.selfEmo = null; if (b && now > b.until) Net.selfBubble = null;
    return Net.selfEmo ? `<span class="emob">${Net.selfEmo.e}</span>` : Net.selfBubble ? `<span class="bub">${esc(Net.selfBubble.text)}</span>` : '';
  }
});

Object.assign(UI, {
  netInit() {
    const chb = document.getElementById('chatbtn'), emb = document.getElementById('emobtn'), pop = document.getElementById('emopop'), chp = document.getElementById('chpill');
    if (!chb) return;
    pop.innerHTML = EMOTES.map(e => `<button data-emo="${e.id}" title="${e.n}" aria-label="${e.n}">${e.e}</button>`).join('');
    chb.onclick = () => { Audio.init(); UI.openPanel('chat'); };
    emb.onclick = () => { pop.hidden = !pop.hidden; };
    pop.onclick = e => { const b = e.target.closest('[data-emo]'); if (!b) return; Net.emote(b.dataset.emo); pop.hidden = true; };
    chp.onclick = () => UI.openPanel('channels');
    const gp = document.getElementById('gmpill'); if (gp) gp.onclick = () => UI.openPanel('gm');
    setInterval(() => { if (Net.party) UI.partyUI(); }, 1000);
  }
});

