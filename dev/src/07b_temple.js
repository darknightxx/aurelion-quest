/* ============================================================
   Temple zone integration: env, portals, cross-zone nav,
   night sky, ambience, items, ghost damage reduction
   ============================================================ */
Object.assign(MON_DEBUFF, { chakla: ['poison', .25, 4], saming: ['poison', .2, 5], tabo: ['slowed', .15, 3], kongkoi: ['poison', .2, 5], pongkhang: ['poison', .12, 4], pop: ['poison', .25, 5], phidip: ['slowed', .2, 3], takhian: ['slowed', .15, 3], nangram: ['curse', .12, 5], krasue: ['poison', .15, 4], phong: ['poison', .2, 4], maenak: ['curse', .15, 5], ngu: ['poison', .35, 5] });

/* ---- models: ghosts + new head cosmetics ---- */
{
  const ob = buildModels;
  buildModels = function (R) {
    ob(R); Object.assign(GM, buildGhostModels(R));
    let g = new Geo(950); g.jit = .03; // ta khon mask worn on the head (origin = top of head)
    g.ell(0, -.42, .12, .6, .66, .42, hexc('#e8d24a'), 12, 8); for (const s of [-1, 1]) { g.ell(s * .23, -.36, .48, .15, .13, .07, [1, 1, 1], 8, 5); g.ell(s * .23, -.36, .54, .07, .07, .03, hexc('#16141a'), 6, 4); g.ell(s * .23, -.2, .45, .19, .05, .05, hexc('#d8323a'), 6, 3); }
    g.cone(0, -.45, .5, 0, -.25, 1, .13, .5, 6, hexc('#d8323a')); g.cone(0, -.57, .96, 0, 1, .35, .07, .3, 5, hexc('#d8323a')); g.ell(0, -.72, .44, .24, .07, .05, hexc('#16141a'), 8, 3);
    for (let i = 0; i < 5; i++) g.ell(-.36 + i * .18, -.08, .32, .09, .13, .05, i % 2 ? hexc('#d8323a') : hexc('#2a8a4a'), 6, 4);
    g.cyl(0, 0, 0, .36, .6, .62, 12, hexc('#c8a86a')); for (let i = 0; i < 4; i++) g.cyl(0, .06 + i * .14, 0, .43 + i * .045, .45 + i * .045, .05, 12, hexc('#8a6a3a'), null, true);
    Models.c_takhon = R.mesh(g);
    g = new Geo(951); g.jit = .02; // chada crown
    g.cyl(0, -.12, 0, .5, .48, .14, 14, GHC.gold, null, true); for (let i = 0; i < 4; i++) g.cyl(0, i * .2, 0, .4 - i * .085, .32 - i * .085, .2, 10, i % 2 ? GHC.gold : GHC.gold2); g.cone(0, .8, 0, 0, 1, 0, .09, .62, 6, GHC.gold);
    for (const s of [-1, 1]) { g.push(s * .48, -.3, -.05, 0, 0, s * -.3); g.box(0, .08, 0, .05, .44, .26, GHC.gold2); g.pop(); } g.box(0, -.02, .41, .18, .12, .04, hexc('#c8323a'));
    Models.c_chada = R.mesh(g);
  };
}

/* ---- environment ---- */
{
  const ose = Game.setEnv.bind(Game);
  Game.setEnv = function (zone) {
    if (zone !== 'temple') return ose(zone);
    const e = this.R.env;
    Object.assign(e, { sun: [-.4, .8, -.5], sunC: [.34, .38, .54], sky: [.26, .28, .4], gnd: [.13, .12, .16], fogC: [.075, .085, .15], fog: [24, 118], top: [.015, .02, .07], bot: [.12, .12, .22], sprLight: .85, cloud: .35 });
    const l = Math.hypot(...e.sun); e.sun = e.sun.map(v => v / l);
  };
}

/* ---- portals & triggers ---- */
{
  const oct = Game.checkTriggers.bind(Game);
  Game.checkTriggers = function (dt) {
    const P = Player, S = Save.d;
    if (P.zone === 'world' && P.x < -138 && Math.abs(P.z - 70) < 5) {
      if (S.level >= TEMPLE_LV) { if (P.x < -144.2) { this.teleport(TX, 66, 'วัดร้างกลางป่า'); return; } }
      else if (this.msgT <= 0) { this.msgT = 4; UI.toast(`ทางข้างหน้าเต็มไปด้วยวิญญาณ ต้องมีเลเวล ${TEMPLE_LV} ขึ้นไปจึงจะเข้าไปได้`, 'warn'); }
    }
    if (P.zone === 'temple') {
      if (P.z > 71 && Math.abs(P.x - TX) < 5) { this.teleport(-139, 70, 'ถนนสายตะวันตก'); return; }
      if (!S.stats.templeVisit) { S.stats.templeVisit = 1; Achievements.check(); setTimeout(() => UI.toast('วัดร้างกลางป่า... ระวังตัวไว้ ที่นี่เต็มไปด้วยผีไทย', 'boss'), 1200); }
    }
    oct(dt);
  };
  const otp = Game.teleport.bind(Game);
  Game.teleport = function (x, z, msg) { if (NakBoss.cur) NakBoss.disengage(NakBoss.cur); GhostAI.reset(); otp(x, z, msg); };
  const oui = Game.useItem.bind(Game);
  Game.useItem = function (id, quick) {
    const it = ITEMS[id], S = Save.d, P = Player;
    if (it && (it.holy || it.incense) && S.inv[id] && !P.dead) {
      if (it.holy) { if ((Skills.potCD || 0) > 0) return; Skills.potCD = .8; const n = RoleSys.cleanse(); S.hp = Math.min(P.stats.maxhp, S.hp + it.heal); UI.dmgNum(P.x, 3, P.z, it.heal, 'heal'); Particles.ring(P.x, .6, P.z, 1, 30, [.7, .9, 1], .8, .45); for (let i = 0; i < 20; i++) Particles.add(P.x + rand(-.6, .6), 2.6, P.z + rand(-.6, .6), { c: [.75, .9, 1], s: .3, life: .7, vy: -3 }); if (n) UI.floatText(P.x, 3.4, P.z, `ล้างสถานะ ${n} อย่าง`, 'immune'); }
      else { Game.addBuff('incense', 600); Particles.ring(P.x, 1, P.z, 1, 24, [1, .8, .5], 1, .4); UI.toast('จุดธูปกันผีแล้ว รับความเสียหายจากผีลดลง 20% เป็นเวลา 10 นาที', 'quest'); }
      this.addItem(id, -1, true); Audio.sfx('ui'); return;
    }
    return oui(id, quick);
  };
}
{ const ooh = RoleSys.onPlayerHit.bind(RoleSys); RoleSys.onPlayerHit = function (raw, src) { let k = ooh(raw, src); const B = Save.d.buffs; if (src && src.d && (src.d.ghost || src.type === 'ngu')) { if (B.incense) k *= .8; if (B.jaoti) k *= .85; } return k; }; }

/* ---- navigation across three zones ---- */
Object.assign(Nav.ITEM_MON, { m_shroud: 'pret', m_cloth7: 'takhian', m_talis: 'phidip', m_top: 'takhon', m_ember: 'krasue', m_bulb: 'phong', m_leaf: 'tani', m_wisp: 'khamot', m_snout: 'kongkoi', m_drop: 'phrai', m_fur: 'pongkhang', m_nail: 'nangram', m_basket: 'krahang', m_fangp: 'pop', m_yant: 'huakhat', m_bell: 'takhon', m_goldjar: 'pusom', m_cane: 'tabo', m_whisker: 'chakla', m_hide: 'saming' });
{
  const onb = Nav.build.bind(Nav);
  Nav.build = function () {
    onb();
    const x0 = TX - 72, x1 = TX + 72, z0 = -72, z1 = 74, S = 2, w = Math.round((x1 - x0) / S) + 1, h = Math.round((z1 - z0) / S) + 1, g = new Uint8Array(w * h);
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) g[j * w + i] = Col.blocked(x0 + i * S, z0 + j * S, .8) ? 1 : 0;
    this.grids.temple = { x0, z0, S, w, h, g };
  };
}
// portal waypoints: [zone] -> exits leading toward other zones
Nav.exitTo = function (from, to) {
  const S = Save.d;
  if (from === 'world' && to === 'dungeon') { if (!(S.flags.gate && S.level >= 5)) { UI.toast(!S.flags.gate ? 'ยังเข้าถ้ำไม่ได้ ต้องทำเควสหลักก่อน' : 'ต้องมีเลเวล 5 ขึ้นไปจึงจะเข้าถ้ำได้', 'warn'); return null; } return { x: 0, z: -142, dir: [0, -1] }; }
  if (from === 'world' && to === 'temple') { if (S.level < TEMPLE_LV) { UI.toast(`ต้องมีเลเวล ${TEMPLE_LV} ขึ้นไปจึงจะเดินทางไปวัดร้างได้`, 'warn'); return null; } return { x: -146, z: 70, dir: [-1, 0] }; }
  if (from === 'dungeon') return { x: DX, z: 12.5, dir: [0, 1] };
  if (from === 'temple') return { x: TX, z: 73, dir: [0, 1] };
  return null;
};
Nav.plan = function () {
  const P = Player, g = this.active; if (!g) return false;
  let tx = g.x, tz = g.z, ex = null;
  if (g.zone !== P.zone) { ex = this.exitTo(P.zone, g.zone); if (!ex) return false; tx = ex.x; tz = ex.z; }
  const path = this.find(P.zone, P.x, P.z, tx, tz);
  if (!path) { UI.toast(P.zone === 'world' && !Save.d.flags.bridge && tz < 4 ? 'สะพานยังปิดอยู่ ทำเควสแรกให้เสร็จก่อน' : 'หาเส้นทางไปจุดหมายไม่ได้', 'warn'); return false; }
  P.nav = { path, i: 0, stuck: 0, final: g.zone === P.zone, dir: ex ? ex.dir : null };
  return true;
};
Nav.steer = function (dt) {
  const P = Player, n = P.nav; if (!n || !this.active) return null;
  while (n.i < n.path.length) { const p = n.path[n.i]; const d = Math.hypot(p.x - P.x, p.z - P.z); if (d < (n.i === n.path.length - 1 ? (this.active.r || 1.2) : 1.4)) n.i++; else return [(p.x - P.x) / d, (p.z - P.z) / d]; }
  if (n.final) { const g = this.active; this.active = null; P.nav = null; UI.navBar(null); g.arrive && g.arrive(); return null; }
  P.moveTo = null; return n.dir || [0, -1];
};
{
  const ogq = Nav.goQuest.bind(Nav);
  Nav.goQuest = function (id) {
    const q = QUESTS[id];
    if (Player.dead) return;
    const npcGoal = (npcId, why) => this.goNpc(npcId, why);
    if (Quests.active(id) && Quests.complete(id) && q.turnTo) return npcGoal(q.turnTo, 'ไปส่งเควสกับ');
    if (Quests.active(id) && !Quests.complete(id)) {
      const pr = Quests.progress(id); const k = pr.findIndex(o => o.have < o.n); const o = q.obj[k];
      if (o && o.k === 'talk') return npcGoal(o.npc, 'ไปพบ');
      if (o && o.k === 'killzone') return this.go({ zone: o.zone, x: TX, z: 30, r: 5, label: 'ไปสงบวิญญาณที่วัดร้าง', arrive: () => AutoHunt.start(id) });
    }
    return ogq(id);
  };
}

/* ---- rendering: temple meshes, sky, glow ---- */
const STARS = (() => { const a = [], r = mulberry32(31); for (let i = 0; i < 260; i++) { const u = r() * TAU, v = .08 + r() * .9; const cy = v, cr = Math.sqrt(1 - cy * cy); a.push({ d: [Math.cos(u) * cr, cy, Math.sin(u) * cr], s: .6 + r() * 1.0, tw: r() * TAU, c: r() < .2 ? [.8, .85, 1] : [1, .97, .9] }); } return a; })();
const MOON_DIR = (() => { const v = [.42, .5, -.76], l = Math.hypot(...v); return v.map(x => x / l); })();
const TempleGfx = {
  stars: STARS.map(s => ({ x: 0, y: 0, z: 0, s: s.s, r: 1, g: 1, b: 1, a: 1 })),
  drawSky(R) {
    const c = R.cam, e = R.env, fog = e.fog; e.fog = [5000, 9000]; R.useLit();
    const M = Game.tmpM, D = 320; M4.compose(M, c[0] + MOON_DIR[0] * D, c[1] + MOON_DIR[1] * D, c[2] + MOON_DIR[2] * D, 0, 0, 0, 15, 15, 15);
    R.gl.depthMask(false); R.drawMesh(FxModels.glow, M, [0, 0, 0], [.92, .9, .8]); R.gl.depthMask(true);
    e.fog = fog;
    const t = Game.time; for (let i = 0; i < STARS.length; i++) { const s = STARS[i], o = this.stars[i]; o.x = c[0] + s.d[0] * 300; o.y = c[1] + s.d[1] * 300; o.z = c[2] + s.d[2] * 300; o.r = s.c[0]; o.g = s.c[1]; o.b = s.c[2]; o.a = .55 + .45 * Math.sin(t * 2 + s.tw); }
    R.gl.depthMask(false); R.drawParticles(this.stars); R.gl.depthMask(true);
  },
  drawOpaque(R) {
    R.drawMesh(World.meshes.temple, null);
    const p = .75 + Math.sin(Game.time * 3) * .08 + Math.sin(Game.time * 11) * .04;
    R.drawMesh(World.meshes.tglow, null, null, [.75 * p, .5 * p, .2 * p]);
  },
  drawGlow(R) {
    const Q = GhostDraw.glowQ; if (!Q.length && Player.zone !== 'temple') return;
    // moon halo
    if (Player.zone === 'temple') { const c = R.cam, D = 320; for (let i = 0; i < 3; i++) Q.push({ x: c[0] + MOON_DIR[0] * D, y: c[1] + MOON_DIR[1] * D, z: c[2] + MOON_DIR[2] * D, r: 22 + i * 12, col: [.07 - i * .018, .075 - i * .018, .1 - i * .02] }); }
    // soft glows as big additive points (radial falloff)
    const pts = this.gpts || (this.gpts = []); pts.length = 0;
    for (const q of Q) pts.push({ x: q.x, y: q.y, z: q.z, s: q.r * 2.2, r: Math.min(1, q.col[0] * 3.2), g: Math.min(1, q.col[1] * 3.2), b: Math.min(1, q.col[2] * 3.2), a: 1 });
    Q.length = 0; if (pts.length) R.drawParticles(pts);
  },
  drawDecals(R) {
    const m = NakBoss.cur; if (m && m.ethereal) for (const p of NakBoss.posts) if (!p.bound) R.drawDecal(p.x, .07, p.z, 2.4, 2.4, 0, 4, [1, 1, .85, .9]);
    for (const mm of Monsters.list) if (!mm.dead && mm.zone === 'temple' && mm.d.elite) R.drawDecal(mm.x, .06, mm.z, 2.2, 2.2, 0, 4, [1, .8, .3, .55]);
  }
};

/* ---- ambience: fireflies, mist, incense smoke, sounds, ghost lights ---- */
const TempleFx = {
  sndT: 4, fbT: 8,
  update(dt) {
    const P = Player;
    if (Math.random() < dt * 9) { const a = Math.random() * TAU, d = 4 + Math.random() * 22; const x = P.x + Math.cos(a) * d, z = P.z + Math.sin(a) * d; Particles.add(x, .4 + Math.random() * 2, z, { c: Math.random() < .3 ? [.7, 1, .5] : [1, .95, .45], s: .22, life: 2.4, vx: rand(-.3, .3), vz: rand(-.3, .3), vy: rand(-.1, .2) }); }
    if (Math.random() < dt * 5) { const a = Math.random() * TAU, d = 6 + Math.random() * 24; Particles.add(P.x + Math.cos(a) * d, .25, P.z + Math.sin(a) * d, { c: [.22, .25, .34], s: 3.2, life: 4, vx: rand(-.4, .4), vz: rand(-.4, .4), vy: .05, a: .5 }); }
    for (const [x, y, z] of World.incense || []) if (dist2(x, z, P.x, P.z) < 900 && Math.random() < dt * 4) Particles.add(x + rand(-.05, .05), y, z + rand(-.05, .05), { c: [.35, .33, .38], s: .5, life: 2.2, vy: .55, vx: rand(-.1, .1), a: .6 });
    if (dist2(TX + 28, -56.8, P.x, P.z) < 2500 && Math.random() < dt * 3) Particles.add(TX + 28 + rand(-.4, .4), 13.4, -56.8, { c: [.3, .3, .32], s: 1.4, life: 3, vy: .8, vx: .3 });
    if (dist2(TX + 28, -50, P.x, P.z) < 1600 && Math.random() < dt * 6) { const a = Math.random() * TAU, d = Math.random() * 9; Particles.add(TX + 28 + Math.cos(a) * d, .5 + Math.random() * 1.5, -50 + Math.sin(a) * d, { c: [.3, 1, .55], s: .4, life: 1.6, vy: .4 }); }
    this.sndT -= dt;
    if (this.sndT <= 0) { this.sndT = 6 + Math.random() * 9; const r = Math.random(); if (r < .3) GSound.cricket(); else if (r < .5) GSound.owl(); else if (r < .65) GSound.dog(); else if (r < .78) GSound.bell(); else if (r < .9 && dist2(TX - 48, -52, P.x, P.z) < 2500) GSound.call(); else GSound.cricket(); }
    // phi phung tai: a fireball streaking across the sky now and then
    this.fbT -= dt;
    if (this.fbT <= 0) { this.fbT = 14 + Math.random() * 16; const a = Math.random() * TAU; this.fb = { x: P.x + Math.cos(a) * 60, z: P.z + Math.sin(a) * 60, y: 38, vx: -Math.cos(a) * 24 + rand(-6, 6), vz: -Math.sin(a) * 24 + rand(-6, 6), t: 1.8 }; }
    if (this.fb) { const f = this.fb; f.t -= dt; f.x += f.vx * dt; f.z += f.vz * dt; f.y -= 6 * dt; for (let i = 0; i < 3; i++) Particles.add(f.x, f.y, f.z, { c: [1, .55 + Math.random() * .3, .2], s: 1.6, life: .6 }); if (f.t <= 0) this.fb = null; }
  }
};

