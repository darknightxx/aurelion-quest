/* ============================================================
   Game core: camera, input, loop, interactions
   ============================================================ */
const Cam = {
  yaw: 0, pitch: .76, dist: 18, tx: 0, ty: 1.2, tz: 0, eye: [0, 10, 10], fov: .62,
  update(dt, snap) {
    const P = Player; const k = snap ? 1 : Math.min(1, dt * 10);
    this.tx += (P.x - this.tx) * k; this.tz += (P.z - this.tz) * k; this.ty = 1.3;
    this.pitch = clamp(this.pitch, .45, 1.2); this.dist = clamp(this.dist, 10, 48);
    const cp = Math.cos(this.pitch);
    let ex = this.tx + Math.sin(this.yaw) * cp * this.dist, ey = this.ty + Math.sin(this.pitch) * this.dist, ez = this.tz + Math.cos(this.yaw) * cp * this.dist;
    if (Game.shakeT > 0) { const s = Game.shakeT * .8; ex += rand(-s, s); ey += rand(-s, s); ez += rand(-s, s); }
    this.eye = [ex, ey, ez];
  }
};

const Input = {
  keys: {}, joy: { x: 0, z: 0 }, mouse: { x: 0, y: 0, l: false, r: false, lx: 0, ly: 0 }, holdT: 0, pointers: new Map(), pinch: 0, dragMoved: false,
  init(cv) {
    window.addEventListener('keydown', e => this.onKey(e, true));
    window.addEventListener('keyup', e => this.onKey(e, false));
    window.addEventListener('blur', () => { this.keys = {}; this.mouse.l = this.mouse.r = false; });
    cv.addEventListener('contextmenu', e => e.preventDefault());
    cv.addEventListener('wheel', e => { e.preventDefault(); if (Game.started && Game.paused) return; Cam.dist *= Math.pow(1.12, Math.sign(e.deltaY)); }, { passive: false });
    cv.addEventListener('pointerdown', e => this.down(e));
    window.addEventListener('pointermove', e => this.move(e));
    window.addEventListener('pointerup', e => this.up(e));
    window.addEventListener('pointercancel', e => this.up(e));
  },
  onKey(e, d) {
    const tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    const code = e.code;
    this.keys[code] = d;
    if (!d) return;
    Audio.init();
    if (UI.quizOpen) { const n = { Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3, Numpad1: 0, Numpad2: 1, Numpad3: 2, Numpad4: 3 }[code]; if (n !== undefined) UI.quizPick(n); return; }
    if (code === 'Escape') { if (UI.panelOpen) UI.closePanel(); else if (Game.started) UI.openPanel('menu'); return; }
    if (!Game.started || UI.summaryOpen) return;
    { const pmap = { KeyI: 'inv', KeyC: 'char', KeyL: 'quest', KeyM: 'map', KeyK: 'ach', KeyJ: 'jobs', KeyB: 'ghost', KeyH: 'help', KeyP: 'skills', KeyO: 'wardrobe', KeyY: 'friends', KeyU: 'pets', KeyN: 'npcs' }; if (pmap[code] && WM.isOpen(pmap[code])) { WM.close(pmap[code]); return; } if (UI.panelOpen && Game.paused) { if (pmap[code]) UI.openPanel(pmap[code]); return; } }
    switch (code) {
      case 'KeyQ': Skills.use(0); break; case 'KeyE': Skills.use(1); break; case 'KeyR': Skills.use(2); break; case 'KeyT': Skills.use(3); break; case 'KeyX': Skills.use(4); break; case 'KeyP': UI.openPanel('skills'); break;
      case 'Space': e.preventDefault(); Game.attackNearest(); break;
      case 'Digit1': Game.useItem('hp_s', true); break; case 'Digit2': Game.useItem('mp_s', true); break;
      case 'KeyF': Game.interactNearest(); break;
      case 'Enter': if (Net.online()) { UI.openPanel('chat'); setTimeout(() => { const i = document.getElementById('chatin'); if (i && !Rot.on) i.focus(); }, 60); } break;
      case 'KeyV': Mounts.ride(); break; case 'KeyG': Mounts.useSkill(); break;
      case 'Tab': e.preventDefault(); Game.cycleTarget(); break;
      case 'KeyI': UI.openPanel('inv'); break; case 'KeyC': UI.openPanel('char'); break; case 'KeyL': UI.openPanel('quest'); break;
      case 'KeyM': UI.openPanel('map'); break; case 'KeyB': UI.openPanel('ghost'); break; case 'KeyJ': UI.openPanel('jobs'); break; case 'KeyK': UI.openPanel('ach'); break; case 'KeyH': UI.openPanel('help'); break;
      case 'KeyO': UI.openPanel('wardrobe'); break; case 'KeyU': UI.openPanel('pets'); break; case 'KeyY': UI.openPanel('friends'); break; case 'KeyZ': Loot.pickAround(); break;
    }
  },
  moveVec() {
    let x = 0, z = 0; const K = this.keys;
    if (Settings.d.move !== 'click') { if (K.KeyW) z += 1; if (K.KeyS) z -= 1; if (K.KeyA) x -= 1; if (K.KeyD) x += 1; }
    if (this.joy.x || this.joy.z) { x = this.joy.x; z = this.joy.z; }
    return { x, z };
  },
  down(e) {
    Audio.init();
    if (!Game.started || Game.paused) return;
    e.preventDefault();
    const cv = e.target; try { cv.setPointerCapture(e.pointerId); } catch (_) { }
    const L0 = Rot.map(e.clientX, e.clientY);
    this.pointers.set(e.pointerId, { x: L0.x, y: L0.y, sx: L0.x, sy: L0.y, btn: e.button, type: e.pointerType, moved: false, t: performance.now() });
    if (e.pointerType === 'mouse') {
      if (e.button === 2 || e.button === 1) { this.mouse.r = true; }
      else if (e.button === 0) { this.mouse.l = true; this.holdT = 0; Game.click(L0.x, L0.y, false); }
    }
    if (this.pointers.size === 2) { const p = [...this.pointers.values()]; this.pinch = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y); }
  },
  move(e) {
    const L1 = Rot.map(e.clientX, e.clientY);
    this.mouse.x = L1.x; this.mouse.y = L1.y;
    const p = this.pointers.get(e.pointerId); if (!p) return;
    const dx = L1.x - p.x, dy = L1.y - p.y; p.x = L1.x; p.y = L1.y;
    if (Game.started && Game.paused) return;
    if (Math.hypot(p.x - p.sx, p.y - p.sy) > 10) p.moved = true;
    if (this.pointers.size === 2) {
      const ps = [...this.pointers.values()]; const d = Math.hypot(ps[0].x - ps[1].x, ps[0].y - ps[1].y);
      if (this.pinch) Cam.dist *= this.pinch / d; this.pinch = d; return;
    }
    if (p.type === 'mouse') {
      if (this.mouse.r) { Cam.yaw -= dx * .008; Cam.pitch += dy * .006; }
    } else if (p.moved) { Cam.yaw -= dx * .01; Cam.pitch += dy * .008; }
  },
  up(e) {
    const p = this.pointers.get(e.pointerId); if (!p) return;
    this.pointers.delete(e.pointerId); if (this.pointers.size < 2) this.pinch = 0;
    if (p.type === 'mouse') { if (p.btn === 0) this.mouse.l = false; else this.mouse.r = false; }
    else if (!p.moved && performance.now() - p.t < 450 && this.pointers.size === 0) Game.click(p.x, p.y, false);
  },
  release() { this.keys = {}; this.joy.x = this.joy.z = 0; this.mouse.l = this.mouse.r = false; this.pointers.clear(); this.pinch = 0; const k = document.getElementById('knob'); if (k) k.style.transform = ''; },
  update(dt) {
    const K = this.keys;
    if (K.ArrowLeft) Cam.yaw += dt * 1.8; if (K.ArrowRight) Cam.yaw -= dt * 1.8;
    if (K.ArrowUp) Cam.dist -= dt * 14; if (K.ArrowDown) Cam.dist += dt * 14;
    if (this.mouse.l && Game.started && !UI.panelOpen) { this.holdT += dt; if (this.holdT > .18) { this.holdT = .06; Game.click(this.mouse.x, this.mouse.y, true); } }
  }
};

const Game = {
  R: null, tex: {}, tmpM: M4.ident(), paused: false, pauseKeys: new Set(), started: false, shakeT: 0, safeT: 0, saveT: 0, time: 0,
  run: null, hover: null, msgT: 0, lastT: 0,
  async init() {
    const cv = document.getElementById('gl');
    try { this.R = new Renderer(cv); } catch (e) { UI.fatal(); return; }
    Settings.load();
    const tick = (p, t) => { Lobby.progress(p, t); return new Promise(r => setTimeout(r, 16)); };
    await tick(.05, 'กำลังโหลดภาพตัวละคร');
    const imgs = await Promise.all(CLASS_ORDER.map(k => new Promise(res => { const im = new Image(); im.onload = () => res([k, im]); im.onerror = () => res([k, null]); im.src = SPRITE_DATA[k]; })));
    this.images = {};
    for (const [k, im] of imgs) { if (im) { this.tex[k] = this.R.texture(im); this.images[k] = im; } }
    UI.makePortraits(this.images);
    await tick(.25, 'กำลังสร้างโมเดล 3 มิติ');
    TexGen.init(this.R); buildModels(this.R); buildCharModels(this.R); buildFxModels(this.R); buildGemModels(this.R); addSeasonModels(this.R); Object.assign(MountMeshes, buildMountMeshes(this.R));
    await tick(.5, 'กำลังเตรียมทวีป Aurelion');
    World.build(this.R);
    await tick(.7, 'กำลังวางเส้นทาง');
    Nav.build();
    await tick(.85, 'กำลังปลุกมอนสเตอร์');
    Monsters.init(); initNPCs();
    UI.init(); Input.init(cv);
    await tick(1, 'พร้อมแล้ว');
    Player.x = 0; Player.z = 70; Player.zone = 'world'; Cam.yaw = .6; Cam.pitch = .55; Cam.dist = 30; this.setEnv('world');
    Lobby.show(); Online.start(); Net.init(); GLBSys.init();
    this.lastT = performance.now();
    requestAnimationFrame(t => this.loop(t));
    { const ld = document.getElementById('loading'); ld.classList.add('out'); setTimeout(() => ld.hidden = true, 450); }
  },
  start(data) {
    Save.d = data; const S = Save.d;
    S.cos = Object.assign({ head: null, face: null, back: null, aura: null, outfit: null, wskin: null }, S.cos); Gems.ensure(); if (S.tryon) Gems.endTry(true); Season.st();
    $('#lobby').hidden = true; $('#charsel').hidden = true; UI.closePanel();
    Player.recalc();
    Player.x = S.pos.x; Player.z = S.pos.z; Player.zone = World.zoneOf(S.pos.x); Player.reset();
    if (S.hp <= 0) S.hp = Player.stats.maxhp;
    this.run = { xp: 0, coins: 0, kills: 0, drops: [], t0: performance.now(), k0: S.stats.kills };
    Cam.yaw = 0; Cam.pitch = .76; Cam.dist = 18; Cam.update(0, true);
    this.setEnv(Player.zone); this.applyUnlocks();
    this.started = true; this.safeT = 3;
    UI.hideTitle(); UI.showHUD(); UI.refreshAll(); UI.mountBtns();
    Achievements.check();
    Save.write();
    SkillLv.ensure(S); this.loginBonus(); if (Net.online()) Net.join();
    if (!S.seenIntro) { S.seenIntro = 1; setTimeout(() => UI.openPanel('help'), 400); }
  },
  loginBonus() {
    const S = Save.d, t = today(); const L = S.login || {}; if (L.day === t) return;
    const y = new Date(Date.now() - 864e5); const ys = y.getFullYear() + '-' + (y.getMonth() + 1) + '-' + y.getDate();
    const streak = L.day === ys ? (L.streak % 7) + 1 : 1; const r = LOGIN_REWARDS[streak - 1]; S.login = { day: t, streak };
    if (r.c) S.coins += r.c; if (r.g) Gems.add(r.g, 'ของขวัญล็อกอินวันที่ ' + streak); if (r.it) for (const [id, n] of r.it) this.addItem(id, n, true);
    setTimeout(() => { UI.toast(`ของขวัญล็อกอินวันที่ ${streak}: ${r.label}`, 'rare'); if (eventOn()) UI.toast(`${EVENT.name}: EXP ×${EVENT.xpMul}!`, 'quest'); }, 900);
  },
  pause(on, key = 'quiz') { if (on) { this.pauseKeys.add(key); this.shakeT = 0; } else this.pauseKeys.delete(key); this.paused = this.pauseKeys.size > 0; },
  shake(s) { this.shakeT = Math.max(this.shakeT, s); },
  setEnv(zone) {
    const e = this.R.env;
    if (zone === 'dungeon') Object.assign(e, { sun: [.25, .9, .35], sunC: [.2, .2, .28], sky: [.24, .22, .34], gnd: [.11, .1, .14], fogC: [.06, .05, .1], fog: [26, 100], top: [.05, .04, .1], bot: [.09, .07, .15], sprLight: .9, cloud: 0 });
    else Object.assign(e, { sun: [.5, .78, .38], sunC: [.72, .66, .54], sky: [.48, .52, .6], gnd: [.3, .27, .22], fogC: [.76, .84, .92], fog: [90, 240], top: [.3, .52, .9], bot: [.8, .88, .96], sprLight: 1.0, cloud: 1 });
    const l = Math.hypot(...e.sun); e.sun = e.sun.map(v => v / l);
  },
  applyUnlocks() { const S = Save.d; World.setUnlocks(S.flags.bridge, S.flags.gate && S.level >= 5); },
  loop(t) {
    let dt = Math.min(.05, (t - this.lastT) / 1000); this.lastT = t;
    try { this.update(dt); this.render(dt); } catch (e) { console.error(e); }
    requestAnimationFrame(tt => this.loop(tt));
  },
  update(dt) {
    const frozen = (this.started && this.paused) || (!this.started && !!UI.panelOpen);
    document.body.classList.toggle('frozen', frozen);
    if (frozen && !this._wasFrozen) { Input.keys = {}; Input.joy.x = Input.joy.z = 0; Input.mouse.l = Input.mouse.r = false; const k = document.getElementById('knob'); if (k) k.style.transform = ''; }
    this._wasFrozen = frozen;
    if (!this.started && frozen) { UI.update(0); return; }
    if (!frozen) { this.time += dt; this.R.time = this.time; Input.update(dt); }
    if (!this.started) { Cam.yaw += dt * .05; Cam.update(dt, true); Particles.update(dt); NPCList.forEach(n => n.rig.update(dt, {})); return; }
    const S = Save.d;
    Net.tick(dt); Remote.update(dt);
    if (!this.paused) {
      S.playT = (S.playT || 0) + dt;
      this.safeT -= dt; this.shakeT = Math.max(0, this.shakeT - dt);
      // buffs
      let changed = false;
      for (const k in S.buffs) { S.buffs[k] -= dt; if (S.buffs[k] <= 0 && k === 'tryon') { Gems.endTry(); changed = true; continue; } if (S.buffs[k] <= 0) { delete S.buffs[k]; changed = true; UI.toast((BUFFS[k] || {}).name + (BUFFS[k] && BUFFS[k].bad ? ' หายแล้ว' : ' หมดเวลาแล้ว'), 'info'); } }
      for (const k in S.shrineCD) { if (S.shrineCD[k] > 0) S.shrineCD[k] -= dt; }
      if (changed) Player.recalc();
      this.recalcT = (this.recalcT || 0) + dt; if (this.recalcT > 1) { this.recalcT = 0; Player.recalc(); }
      Player.update(dt, Input.moveVec()); Mounts.update(dt); RoleSys.update(dt);
      Monsters.update(dt); GhostAI.tick(dt);
      Monsters.list = Monsters.list.filter(m => !(m.summon && m.dead && m.deathT === undefined));
      Projectiles.update(dt); Effects.update(dt); Skills.update(dt); Fx.update(dt); AutoHunt.update(dt);
      this.checkTriggers(dt);
      this.saveT += dt; if (this.saveT > 20) { this.saveT = 0; Save.write(); }
    }
    if (frozen) { Cam.update(0); UI.update(0); return; }
    // ambient fire particles
    const P0 = Player;
    if (P0.zone === 'dungeon') { for (const t of World.torches) if (dist2(t.x, t.z, P0.x, P0.z) < 900 && Math.random() < dt * 14) Particles.add(t.x + rand(-.15, .15), t.y + .25, t.z + rand(-.15, .15), { c: [1, .55 + Math.random() * .3, .15], s: .45, life: .5, vy: 1.6 }); }
    if (P0.zone === 'world' && World.portalIn.open && dist2(0, -140, P0.x, P0.z) < 900 && Math.random() < dt * 20) { const a = Math.random() * TAU; Particles.add(Math.cos(a) * 3.2, 4.4 + Math.sin(a) * 3.2, -139.6, { c: [.5, .8, 1], s: .45, life: .9, vx: -Math.cos(a) * 2.5, vy: -Math.sin(a) * 2.5 }); }
    if (P0.zone === 'temple') TempleFx.update(dt);
    for (const f of World.fires) if (f.zone === P0.zone && dist2(f.x, f.z, P0.x, P0.z) < 2500 && Math.random() < dt * 22) Particles.add(f.x + rand(-.4, .4), .4, f.z + rand(-.4, .4), { c: [1, .5 + Math.random() * .35, .12], s: .7 * f.s, life: .7, vy: 2.2 });
    Particles.update(dt);
    NPCList.forEach(n => { n.anim += dt; n.waveT = Math.max(0, n.waveT - dt); if (!n.rig) n.rig = new Rig(n.sheet); n.rig.update(dt, { wave: n.waveT > 0 }); if (n.zone === Player.zone) { const d = dist2(n.x, n.z, Player.x, Player.z); if (d < 36) n.face += angWrap(Math.atan2(Player.x - n.x, Player.z - n.z) - n.face) * Math.min(1, dt * 4); else n.face += angWrap(n.face0 - n.face) * Math.min(1, dt * 2); } });
    Cam.update(dt);
    UI.update(dt);
  },
  checkTriggers(dt) {
    const P = Player, S = Save.d;
    this.msgT -= dt;
    if (P.zone === 'world') {
      if (S.flags.gate && S.level >= 5 && P.z < -139 && Math.abs(P.x) < 5) { this.teleport(DX, 5, 'เข้าสู่ถ้ำผลึกใต้พิภพ'); return; }
      if (this.msgT <= 0 && World.gate.col.on && dist2(P.x, P.z, 0, -135.5) < 36) { this.msgT = 4; UI.toast(!S.flags.gate ? 'ประตูถ้ำถูกผนึกไว้ ต้องทำเควสหลัก "เงามืดในป่ากระซิบ" ให้สำเร็จก่อน' : 'ต้องมีเลเวล 5 ขึ้นไปจึงจะผ่านประตูถ้ำได้', 'warn'); }
      if (this.msgT <= 0 && World.barricade.col.on && dist2(P.x, P.z, 0, 13.5) < 20) { this.msgT = 4; UI.toast('สะพานปิดอยู่ ไปรับเควสจากกัปตันลีร่าในเมืองก่อน', 'warn'); }
    } else {
      if (P.z > 10.2 && Math.abs(P.x - DX) < 3.6) { this.teleport(0, -131, 'กลับสู่หุบผาผลึก'); return; }
    }
    for (const w of WARPS) if (!S.warps[w.id] && w.zone === P.zone && dist2(w.x, w.z, P.x, P.z) < 16) { S.warps[w.id] = true; UI.toast('ค้นพบจุดวาร์ป: ' + w.name, 'quest'); Audio.sfx('warp'); }
    const place = World.placeName(P.x, P.z); if (place !== this.place) { this.place = place; UI.placeName(place); }
  },
  teleport(x, z, msg) {
    if (this.tele) return; this.tele = true; Audio.sfx('warp');
    const B = Monsters.boss; if (B && B.engaged) { B.engaged = false; UI.bossBar(false); }
    UI.fade(() => {
      const P = Player; P.x = x; P.z = z; P.zone = World.zoneOf(x); P.target = null; P.moveTo = null;
      Projectiles.list = []; Effects.list = [];
      this.setEnv(P.zone); Cam.update(0, true); this.safeT = 2;
      if (msg) UI.placeName(msg);
      this.tele = false; Save.write(); Nav.onTeleport();
    });
  },
  // -------- picking --------
  pick(sx, sy) {
    const R = this.R; const ray = R.ray(sx, sy); const o = ray.o, d = ray.d; const P = Player;
    let best = null, bt = 1e9;
    const sph = (cx, cy, cz, r, obj) => { const lx = o[0] - cx, ly = o[1] - cy, lz = o[2] - cz; const b = lx * d[0] + ly * d[1] + lz * d[2]; const c = lx * lx + ly * ly + lz * lz - r * r; const h = b * b - c; if (h < 0) return; const t = -b - Math.sqrt(h); if (t > 0 && t < bt) { bt = t; best = obj; } };
    for (const m of Monsters.list) { if (m.dead || m.zone !== P.zone) continue; const h = m.d.fly ? 1.8 : m.d.h * .5; sph(m.x, h, m.z, Math.max(m.d.r, m.d.h * .45) + .35, { kind: 'mon', ref: m }); }
    for (const n of NPCList) { if (n.zone !== P.zone) continue; sph(n.x, 1.3, n.z, 1.15, { kind: 'npc', ref: n }); }
    for (const r of Remote.map.values()) { if (r.zone !== P.zone) continue; sph(r.dx, 1.3, r.dz, 1.0, { kind: 'peer', ref: r }); }
    for (const w of WARPS) { if (w.zone !== P.zone) continue; sph(w.x, 1.6, w.z, 1.6, { kind: 'warp', ref: w, r: .8 }); }
    for (const s of SHRINES) { if (s.zone !== P.zone) continue; sph(s.x, 1.6, s.z, 2, { kind: 'shrine', ref: s, r: 1.2 }); }
    if (best) return best;
    if (Math.abs(d[1]) > 1e-4) { const t = -o[1] / d[1]; if (t > 0) return { kind: 'ground', x: o[0] + d[0] * t, z: o[2] + d[2] * t }; }
    return null;
  },
  click(sx, sy, hold) {
    if (this.paused || Player.dead) return;
    const h = this.pick(sx, sy); if (!h) return;
    if (!hold) { Nav.stop(); AutoHunt.stop(); }
    const P = Player;
    if (h.kind === 'ground') {
      if (Settings.d.move === 'wasd') return;
      if (hold && P.target && P.target.kind === 'mon') return;
      P.moveTo = { x: h.x, z: h.z }; P.target = null;
      if (!hold) Effects.add({ kind: 'marker', x: h.x, z: h.z, r: 1, dur: .5, col: [.65, .95, .35, .9] });
      return;
    }
    if (hold) return;
    if (h.kind === 'peer') { UI.peerCard(h.ref); return; }
    P.moveTo = null;
    if (h.kind === 'mon') { P.target = h; UI.setTarget(h.ref); }
    else P.target = h;
  },
  nearestMonster(r) { const P = Player; let m = null, bd = r * r; for (const o of Monsters.list) { if (o.dead || o.zone !== P.zone) continue; const d = dist2(o.x, o.z, P.x, P.z); if (d < bd) { bd = d; m = o; } } return m; },
  attackNearest() {
    const P = Player; if (P.dead) return;
    let m = P.target && P.target.kind === 'mon' && !P.target.ref.dead ? P.target.ref : null;
    if (!m) { let bd = 15 * 15; for (const o of Monsters.list) { if (o.dead || o.zone !== P.zone) continue; const d = dist2(o.x, o.z, P.x, P.z); if (d < bd) { bd = d; m = o; } } }
    if (m) { P.target = { kind: 'mon', ref: m }; P.moveTo = null; UI.setTarget(m); } else UI.toast('ไม่มีมอนสเตอร์อยู่ใกล้ๆ', 'info');
  },
  cycleTarget() {
    const P = Player; const list = Monsters.list.filter(o => !o.dead && o.zone === P.zone && dist2(o.x, o.z, P.x, P.z) < 400).sort((a, b) => dist2(a.x, a.z, P.x, P.z) - dist2(b.x, b.z, P.x, P.z));
    if (!list.length) return; const cur = P.target && P.target.ref; const i = list.indexOf(cur); const m = list[(i + 1) % list.length];
    P.target = { kind: 'mon', ref: m, manual: true }; P.moveTo = null; UI.setTarget(m);
  },
  nearestInteract() {
    const P = Player; let best = null, bd = 1e9;
    const consider = (kind, ref, range) => { if (ref.zone && ref.zone !== P.zone) return; const d = Math.sqrt(dist2(ref.x, ref.z, P.x, P.z)); if (d < range && d < bd) { bd = d; best = { kind, ref }; } };
    NPCList.forEach(n => consider('npc', n, 3.8)); WARPS.forEach(w => consider('warp', w, 3.4)); SHRINES.forEach(s => consider('shrine', s, 4));
    if (NakBoss.cur && NakBoss.cur.ethereal) NakBoss.posts.forEach(p => { if (!p.bound) consider('bindpost', p, 3.4); });
    const b = Monsters.boss; if (b && b.barrier && !b.dead && P.zone === 'dungeon') { const d = Math.sqrt(dist2(b.x, b.z, P.x, P.z)); if (d < 13 && d < bd) best = { kind: 'barrier', ref: b }; }
    return best;
  },
  interactNearest() { const n = this.nearestInteract(); if (n) this.interact(n); },
  interact(T) {
    const S = Save.d, P = Player;
    P.moveTo = null;
    if (T.kind === 'npc') { T.ref.waveT = 1.2; UI.dialog(T.ref); Audio.sfx('ui'); }
    else if (T.kind === 'warp') { S.warps[T.ref.id] = true; UI.openPanel('map', { warp: true }); }
    else if (T.kind === 'shrine') this.useShrine(T.ref);
    else if (T.kind === 'barrier') this.chainQuiz(T.ref);
    else if (T.kind === 'bindpost') NakBoss.bind(T.ref);
  },
  useShrine(sh) {
    const S = Save.d; const cd = S.shrineCD[sh.id] || 0;
    if (cd > 0) { UI.toast(`แท่นบูชากำลังฟื้นพลัง อีก ${Math.ceil(cd)} วินาที`, 'warn'); return; }
    const b = BUFFS[sh.buff];
    Quiz.run({
      title: sh.name, sub: 'ตอบถูกรับ "' + b.name + '" (' + b.desc + ') นาน 10 นาที', count: 1, time: Settings.d.qtime + 5, mode: 'shrine',
      onEnd: r => {
        if (r.correct) { Season.bump('shrine'); this.addBuff(sh.buff, 600); S.shrineCD[sh.id] = 90; if (!S.shrinesUsed[sh.id]) { S.shrinesUsed[sh.id] = 1; S.stats.shrines = Object.keys(S.shrinesUsed).length; } Particles.ring(Player.x, .5, Player.z, 1.5, 40, hexc(b.col), 1, .5); UI.banner(b.name, 'buff'); Achievements.check(); }
        else { S.shrineCD[sh.id] = 25; UI.toast('ยังไม่ถูกนะ ลองใหม่ได้ในอีก 25 วินาที', 'warn'); }
      }
    });
  },
  chainQuiz(b) {
    if (b.chainCD > 0) { UI.toast(`เกราะยังสั่นสะเทือน รออีก ${Math.ceil(b.chainCD)} วินาที`, 'warn'); return; }
    Quiz.run({
      title: 'Chain Quiz: ทำลายเกราะผลึก', sub: 'ตอบถูกติดต่อกัน 3 ข้อเพื่อทำลายเกราะ ถ้าผิดข้อเดียวต้องเริ่มใหม่', count: 3, chain: true, time: Settings.d.qtime, mode: 'chain',
      onEach: (ok) => { if (ok) { Particles.burst(b.x, 4, b.z, 20, [.6, .9, 1], 6, .6, .5, 3); Audio.sfx('crystal'); } },
      onEnd: r => {
        if (r.correct >= 3) {
          b.barrier = false; b.stunT = 5; Particles.burst(b.x, 4, b.z, 140, [.6, .95, 1], 14, 1.2, .7, 6); this.shake(.6); Audio.sfx('slam'); UI.banner('เกราะแตกแล้ว! คราก มึนงง', 'crit');
          if (b.perfect) { Save.d.stats.perfectChain = (Save.d.stats.perfectChain || 0) + 1; Achievements.check(); }
        } else { b.perfect = false; b.chainCD = 6; b.hp = Math.min(b.max, b.hp + b.max * .04); UI.toast('Chain ขาด! คราก ฟื้นพลังเล็กน้อย ลองใหม่ใน 6 วินาที', 'warn'); }
      }
    });
  },
  addBuff(k, t) { Save.d.buffs[k] = t; Player.recalc(); },
  gainXP(n) {
    const S = Save.d; if (S.buffs.xp2) n *= 2; if (eventOn()) n *= EVENT.xpMul; n = Math.round(n * (1 + Mounts.pas('xp')) * (Net.partyNear() ? 1.1 : 1)); S.xp += n; this.run.xp += n; UI.dmgNum(Player.x, 3.3, Player.z, n, 'xp');
    let lv = false;
    while (S.level < (S.awk ? AWK_LV_CAP : LV_CAP) && S.xp >= xpNeed(S.level)) { S.xp -= xpNeed(S.level); S.level++; S.points += 3; S.skillPts = (S.skillPts || 0) + 1; lv = true; Season.bump('lvl'); }
    if (lv) {
      Player.recalc(); S.hp = Player.stats.maxhp; S.mp = Player.stats.maxmp; Player.doAct('cheer', 1.3);
      Particles.ring(Player.x, .3, Player.z, 1.2, 50, [.75, 1, .4], 1.2, .6); for (let i = 0; i < 40; i++) Particles.add(Player.x + rand(-.8, .8), rand(0, 1), Player.z + rand(-.8, .8), { c: [1, .9, .4], s: .4, life: 1.4, vy: rand(2, 6) });
      UI.banner('เลเวลอัป! Lv.' + S.level, 'level'); Audio.sfx('level'); UI.toast('ได้รับแต้มสถานะ 3 แต้ม กด C เพื่ออัปเกรด', 'quest');
      this.applyUnlocks(); Achievements.check();
    }
    UI.refreshHUD();
  },
  gainCoins(n) { const S = Save.d; if (S.buffs.coin2) n *= 2; n = Math.round(n * (1 + Mounts.pas('coin'))); S.coins += n; this.run.coins += n; UI.coinPop(n); Audio.sfx('coin'); Achievements.check(); },
  addItem(id, n, silent) {
    const S = Save.d; S.inv[id] = (S.inv[id] || 0) + n; if (S.inv[id] <= 0) delete S.inv[id];
    if (n > 0 && !silent) { UI.toast(`ได้รับ ${ITEMS[id].name}${n > 1 ? ' ×' + n : ''}`, ITEMS[id].rare ? 'rare' : 'item'); if (ITEMS[id].rare || ['w_gob', 'w_crys', 'r_heart', 'c_crown'].includes(id)) this.run.drops.push(id); }
    Quests.onItem(); UI.refreshInvIfOpen();
  },
  useItem(id, quick) {
    const S = Save.d, it = ITEMS[id], P = Player; if (!S.inv[id]) { if (quick) UI.toast('ไม่มี' + it.name + 'เหลือแล้ว', 'warn'); return; }
    if (P.dead) return;
    if (it.heal || it.mana) {
      if ((Skills.potCD || 0) > 0) return; Skills.potCD = .8;
      if (it.heal) { if (S.hp >= P.stats.maxhp) { UI.toast('HP เต็มอยู่แล้ว', 'info'); return; } S.hp = Math.min(P.stats.maxhp, S.hp + it.heal); UI.dmgNum(P.x, 3, P.z, it.heal, 'heal'); Particles.ring(P.x, .5, P.z, .9, 20, [.5, 1, .5], .7, .4); }
      if (it.mana) { if (S.mp >= P.stats.maxmp) { UI.toast('MP เต็มอยู่แล้ว', 'info'); return; } S.mp = Math.min(P.stats.maxmp, S.mp + it.mana); Particles.ring(P.x, .5, P.z, .9, 20, [.5, .7, 1], .7, .4); }
      this.addItem(id, -1, true); Audio.sfx('ui');
    } else if (it.statpt) { S.points++; this.addItem(id, -1, true); UI.toast('ได้รับแต้มสถานะ +1 กด C เพื่ออัปเกรด', 'quest'); Audio.sfx('level'); UI.refreshHUD();
    } else if (it.revive) { UI.toast('ขนนกฟีนิกซ์ใช้ได้ตอนพ่ายแพ้ที่หน้าสรุปผล', 'info');
    } else if (it.ret) {
      if (Monsters.boss.engaged) { UI.toast('ใช้ไม่ได้ระหว่างต่อสู้กับบอส', 'warn'); return; }
      this.addItem(id, -1, true); UI.closePanel(); this.teleport(9, 70, 'เมืองหลวง Aurelion');
    }
  },
  equip(id) {
    const S = Save.d, it = ITEMS[id];
    if (it.lvl && S.level < it.lvl) { UI.toast(`ต้องมีเลเวล ${it.lvl} ขึ้นไป`, 'warn'); return; }
    if (it.kind === 'gear') S.equip[it.slot] = S.equip[it.slot] === id ? null : id;
    else if (it.kind === 'cos') {
      if (S.cos[it.slot] === id) S.cos[it.slot] = it.slot === 'outfit' ? null : null; else { S.cos[it.slot] = id; S.stats.cosEquip = (S.stats.cosEquip || 0) + 1; }
      if (S.cos[it.slot] === id) { Particles.ring(Player.x, 1, Player.z, 1, 26, [1, .9, .6], .7, .4); }
    }
    Player.recalc(); Achievements.check(); UI.refreshAll(); Audio.sfx('ui');
  },
  die() {
    const P = Player; P.dead = true; P.target = null; P.moveTo = null; Nav.stop(); AutoHunt.stop(); Save.write();
    UI.banner('พ่ายแพ้...', 'fizzle');
    setTimeout(() => UI.summary('defeat'), 1500);
  },
  reviveHere() {
    const S = Save.d, P = Player; if (!S.inv.feather) return; this.addItem('feather', -1, true); Player.recalc(); S.hp = P.stats.maxhp; S.mp = P.stats.maxmp; P.dead = false; P.deadT = 0; P.hurtT = 0; this.safeT = 3; const r = P.getRig(); r.clip = null;
    Fx.pillar(P.x, P.z, 1.4, 7, [1, .6, .25], .9); Fx.shock(P.x, P.z, 4, [1, .7, .3], .6); Particles.burst(P.x, 1, P.z, 60, [1, .7, .3], 6, 1, .6, 5); Audio.sfx('level'); UI.banner('ฟื้นคืนชีพ!', 'level');
    Monsters.list.forEach(m => { if (m.zone === P.zone && dist2(m.x, m.z, P.x, P.z) < 100) { m.stun = 2; } });
  },
  respawn() {
    const S = Save.d, P = Player; Player.recalc(); S.hp = P.stats.maxhp; S.mp = P.stats.maxmp; P.reset();
    this.run = { xp: 0, coins: 0, kills: 0, drops: [], t0: performance.now(), k0: S.stats.kills };
    Monsters.list.forEach(m => { m.aggro = false; m.state = 'return'; });
    this.teleport(9, 70, 'เมืองหลวง Aurelion');
  },
  bossDefeated(m) {
    const S = Save.d; S.stats.bossKills++;
    this.shake(1); UI.bossBar(false); m.engaged = false;
    if (!S.inv.c_crown) { this.addItem('c_crown', 1); Gems.add(50, 'ปราบบอสครากครั้งแรก'); UI.toast('ได้รับเพชร 50 เม็ด', 'rare'); }
    if (Math.random() < .45) this.addItem('w_crys', 1);
    if (Math.random() < .45) this.addItem('r_heart', 1);
    this.addItem('m_shard', 2);
    Monsters.list.forEach(o => { if (o.summon) o.dead = true; });
    if (S.quests.m3 && S.quests.m3.s === 'active') {
      S.quests.m3.k.boss = 1;
      setTimeout(() => { Quests.turnIn('m3'); setTimeout(() => UI.summary('victory'), 900); }, 1600);
    } else UI.banner('ปราบคราก สำเร็จ!', 'level');
  },
  autosave() { Save.write(); },
  // ---------- render ----------
  render(dt) {
    const R = this.R, P = Player;
    R.resize();
    R.setCamera(Cam.eye, [Cam.tx, Cam.ty, Cam.tz], Cam.fov);
    const zone = P.zone;
    const ls = World.lights.filter(l => l.zone === zone).map(l => ({ ...l, d: dist2(l.x, l.z, P.x, P.z) })).sort((a, b) => a.d - b.d).slice(0, 6)
      .map(l => { const f = (l.c[0] > 1 && zone !== 'world') || zone === 'world' ? .85 + Math.sin(this.time * 9 + l.x) * .08 + Math.sin(this.time * 23 + l.z) * .05 : 1; return { ...l, c: l.c.map(v => v * f) }; });
    R.setLights(ls);
    R.begin();
    if (zone === 'temple') TempleGfx.drawSky(R);
    R.useLit();
    if (zone === 'temple') TempleGfx.drawOpaque(R); else R.drawMesh(World.meshes.static, null);
    if (zone === 'world') R.drawMesh(World.meshes.westgate, null);
    if (zone === 'dungeon') {
      const p = .6 + Math.sin(this.time * 1.5) * .15;
      R.drawMesh(World.meshes.glowA, null, null, [.15 * p, .5 * p, .6 * p]); R.drawMesh(World.meshes.glowB, null, null, [.4 * p, .2 * p, .6 * p]); R.drawMesh(World.meshes.torches, null);
    }
    const M = this.tmpM;
    for (const o of World.objs) {
      if (o.zone !== zone || o.spirit) continue;
      if (o.type === 'warp') { const disc = Save.d && Save.d.warps[o.id]; M4.compose(M, o.x, 1.6 + Math.sin(this.time * 2 + o.x) * .2, o.z, 0, this.time * .8, 0, 1, 1, 1); R.drawMesh(o.mesh, M, disc ? null : [.6, .6, .65], disc ? [.2, .45, .6] : [.05, .06, .08]); }
      else if (o.type === 'shrine') { const cd = Save.d && (Save.d.shrineCD[o.id] || 0) > 0; const pl = .7 + Math.sin(this.time * 3) * .3; M4.compose(M, o.x, 2.3 + Math.sin(this.time * 1.6) * .25, o.z, 0, this.time, 0, .8, .8, .8); R.drawMesh(o.mesh, M, cd ? [.4, .4, .45] : o.col, cd ? [.02, .02, .03] : o.col.map(v => v * .5 * pl)); }
      else if (o.type === 'barricade') { if (!o.hidden) R.drawMesh(o.mesh, (M4.compose(M, o.x, 0, o.z, 0, 0, 0, 1, 1, 1), M)); }
      else if (o.type === 'gate') { o.lift = lerp(o.lift, o.open ? 8.5 : 0, Math.min(1, dt * 2)); M4.compose(M, o.x, o.lift, o.z, 0, 0, 0, 1, 1, 1); R.drawMesh(o.mesh, M); }
    }
    Sprites.begin(R);
    Monsters.draw(R, this.time);
    // characters (each into its own sprite cell when sprite mode is on)
    for (const n of NPCList) {
      if (n.zone !== zone || dist2(n.x, n.z, P.x, P.z) > 90 * 90) continue;
      const sc = (n.sc || CHAR_SCALE) / CHAR_SCALE;
      Sprites.capture(R, n.x, 1.5 * sc, n.z, SPR_CHAR.w * sc, SPR_CHAR.h * sc, () => { n.rig.pose(n.x, 0, n.z, n.face, n.sc || CHAR_SCALE); n.rig.draw(R, CharModels[n.sheet], n.sheet === 'kuman' ? { emis: [.18, .14, .04] } : undefined); });
    }
    if (this.started) {
      const rig = P.getRig(); const fall = P.dead ? Math.min(1, (P.deadT || 0) / .5) : 0;
      const mid = !P.dead && Mounts.riding() ? Mounts.cur() : null, MD = mid && MOUNTS[mid];
      const sp0 = !mid && !P.dead && Seats.driver ? Seats.myPos() : null;
      const cw = MD ? Math.max(4.2, (MD.seats ? 7 : 4.6) * MD.sc) : SPR_CHAR.w, ch = MD ? (MD.seat[0] + 2.7) * Math.max(1, MD.sc * .9) + (MD.kind === 'float' ? .6 : 0) : SPR_CHAR.h;
      const cx = sp0 ? sp0[0] : P.x, cz = sp0 ? sp0[2] : P.z, cy = sp0 ? sp0[1] + 1.2 : ch / 2 - .15;
      Sprites.capture(R, cx, cy, cz, cw, ch, () => {
        const mt = P.dead ? null : Mounts.draw(R, P);
        const sp = !mt && !P.dead && Seats.driver ? Seats.myPos() : null;
        if (mt) rig.pose(mt.seat[0], mt.seat[1] - HIPY * CHAR_SCALE + .05, mt.seat[2], mt.face, CHAR_SCALE);
        else if (sp) rig.pose(sp[0], sp[1] - HIPY * CHAR_SCALE + .05, sp[2], P.face, CHAR_SCALE);
        else rig.pose(P.x, 0, P.z, P.face, CHAR_SCALE, fall);
        rig.draw(R, CharModels[P.sheet], { flash: P.hurtT > .2 ? .45 : 0, emis: Save.d.awk ? AWK_EMIS : undefined });
        if (!P.dead) drawCosmetics3D(R, rig);
      });
      if (Save.d.awk && !P.dead) JobSys.awkFx(P.x, P.z, P.anim);
      Remote.draw(R);
    }
    Sprites.end(R);
    if (zone === 'temple') { GhostAI.draw(R); NakBoss.draw(R); }
    Projectiles.draw(R);
    Fx.drawSolid(R);
    // transparent meshes
    const gl = R.gl; R.useLit(); gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); gl.depthMask(false);
    if (zone === 'world') R.drawMesh(World.meshes.water, null, null, null, 0, .82, 1);
    if (zone === 'temple') R.drawMesh(World.meshes.twater, null, null, [.02, .04, .06], 0, .8, 1);
    const pin = World.portalIn, pout = World.portalOut;
    gl.disable(gl.CULL_FACE);
    if (zone === 'world' && pin.open) { M4.compose(M, 0, 4.4, -140.1, 0, 0, 0, 1.35, 1.35, 1); R.drawMesh(World.meshes.portal, M, [.4, .7, 1], [.3, .55, .9], 0, .55 + Math.sin(this.time * 3) * .1); }
    if (zone === 'dungeon') { M4.compose(M, DX, 3, 11.3, 0, 0, 0, .95, .95, 1); R.drawMesh(World.meshes.portal, M, [.4, .7, 1], [.3, .55, .9], 0, .5 + Math.sin(this.time * 3) * .1); }
    Boss.drawBarrier(R, Monsters.boss);
    gl.enable(gl.CULL_FACE); gl.depthMask(true); gl.disable(gl.BLEND);
    Fx.drawGlow(R); TempleGfx.drawGlow(R); R.useLit(); gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); gl.depthMask(false); gl.disable(gl.CULL_FACE);
    gl.enable(gl.CULL_FACE); gl.depthMask(true); gl.disable(gl.BLEND);
    // decals
    R.useDecal();
    const sh = [0, 0, 0, .35];
    if (this.started) R.drawDecal(P.x, .04, P.z, .9, .9, 0, 0, sh);
    for (const n of NPCList) if (n.zone === zone) R.drawDecal(n.x, .04, n.z, .9, .9, 0, 0, sh);
    for (const m of Monsters.list) { if (m.dead || m.zone !== zone) continue; const r = m.d.r * (m.d.boss ? 1.3 : 1.2); R.drawDecal(m.x, .04, m.z, r, r, 0, 0, m.d.fly ? [0, 0, 0, .2] : sh); }
    if (P.target && P.target.kind === 'mon' && !P.target.ref.dead) { const m = P.target.ref; const r = m.d.r + .7; R.drawDecal(m.x, .06, m.z, r, r, 0, 4, m.d.aggro || m.aggro ? [1, .35, .25, .9] : [1, .85, .3, .9]); }
    const near = this.started ? this.nearestInteract() : null; this.nearTarget = near;
    if (near && near.kind !== 'barrier') R.drawDecal(near.ref.x, .06, near.ref.z, 1.5, 1.5, 0, 4, [.65, .95, .4, .9]);
    if (P.nav && Nav.active) {
      let px = P.x, pz = P.z, acc = 1.2, left = 46; const pts = P.nav.path;
      for (let i = P.nav.i; i < pts.length && left > 0; i++) {
        const q = pts[i]; const seg = Math.hypot(q.x - px, q.z - pz);
        while (acc < seg && left > 0) { const t = acc / seg; const pul = .55 + .45 * Math.sin(this.time * 6 - (46 - left) * .5); R.drawDecal(lerp(px, q.x, t), .05, lerp(pz, q.z, t), .32, .32, 0, 0, [.66, .95, .35, .8 * pul]); acc += 2.2; left -= 2.2; }
        acc -= seg; px = q.x; pz = q.z;
      }
      if (Nav.active.zone === P.zone) R.drawDecal(Nav.active.x, .06, Nav.active.z, 1.8, 1.8, 0, 4, [.66, .95, .35, .9]);
    }
    for (const e of Effects.list) {
      const p = clamp(e.t / e.dur, 0, 1);
      if (e.kind === 'marker') R.drawDecal(e.x, .07, e.z, 1.2, 1.2, 0, 2, e.col, .3 + p * .6);
      else if (e.kind === 'ring') R.drawDecal(e.x, .07, e.z, e.r, e.r, 0, 2, e.col, p);
      else if (e.kind === 'coneFx') R.drawDecal(e.x, .07, e.z, e.r, e.r, e.rot, 3, [e.col[0], e.col[1], e.col[2], (1 - p) * .9], 1, e.ang);
      else if (e.kind === 'circle') R.drawDecal(e.x, .08, e.z, e.r, e.r, 0, 1, e.fired ? [1, 1, 1, .6] : e.col, p);
      else if (e.kind === 'cone') R.drawDecal(e.x, .08, e.z, e.r, e.r, e.rot, 3, e.fired ? [1, 1, 1, .6] : e.col, p, e.ang);
      else if (e.kind === 'rect') R.drawDecal(e.x, .08, e.z, e.w, e.l, e.rot, 5, e.fired ? [1, 1, 1, .6] : e.col, p);
    }
    if (zone === 'temple') { GhostAI.drawDecals(R); TempleGfx.drawDecals(R); }
    R.endDecal();
    R.drawParticles(Particles.list);
  }
};
function xpNeed(l) { return Math.round(60 * Math.pow(l, 1.55)); }

