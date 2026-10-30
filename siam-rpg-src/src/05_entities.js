/* ============================================================
   Entities: player, monsters, NPCs, projectiles, effects
   ============================================================ */
const SPR_H = 2.7, SPR_W = SPR_H * 224 / 320;
const FR = { front: 0, fr34: 2, side: 3, side2: 4, sideL: 5, back34: 6, back: 7, attack: 9, cheer: 10, think: 11, skill: 12, run: 13, hurt: 14, wave: 15 };
function frameUV(i) { const c = i % 8, r = Math.floor(i / 8); return new Float32Array([c * 224 / 2048, r * 320 / 1024, (c + 1) * 224 / 2048, (r + 1) * 320 / 1024]); }
const UVS = []; for (let i = 0; i < 16; i++) UVS.push(frameUV(i));

// choose frame for a character based on facing vs camera
function viewFrame(face, x, z, moving, t) {
  const R = Game.R;
  let cx = R.cam[0] - x, cz = R.cam[2] - z; const l = Math.hypot(cx, cz) || 1; cx /= l; cz /= l;
  const fx = Math.sin(face), fz = Math.cos(face);
  const dot = fx * cx + fz * cz; const sx = fx * R.sprRight[0] + fz * R.sprRight[2];
  const deg = Math.atan2(sx, dot) * 180 / Math.PI; const ad = Math.abs(deg), right = deg > 0;
  const stride = Math.abs(Math.sin(deg * Math.PI / 180)), sx2 = Math.sign(sx);
  let r;
  if (ad < 25) r = { f: FR.front, flip: false };
  else if (ad < 70) r = { f: FR.fr34, flip: !right };
  else if (ad < 115) r = right ? { f: FR.side, flip: false } : { f: FR.sideL, flip: false };
  else if (ad < 155) r = { f: FR.back34, flip: right };
  else r = { f: FR.back, flip: false };
  r.stride = stride; r.dir = sx2; return r;
}

const Particles = {
  list: [],
  add(x, y, z, o) { if (this.list.length > 2400) return; this.list.push({ x, y, z, vx: o.vx || 0, vy: o.vy || 0, vz: o.vz || 0, s: o.s || .3, r: o.c[0], g: o.c[1], b: o.c[2], a: o.a || 1, life: o.life || .6, max: o.life || .6, grav: o.grav || 0, drag: o.drag || 0, fade: o.fade !== false, a0: o.a || 1 }); },
  burst(x, y, z, n, c, sp = 4, life = .6, s = .35, up = 2, grav = -6) { for (let i = 0; i < n; i++) { const a = Math.random() * TAU, v = Math.random() * sp; this.add(x, y, z, { vx: Math.cos(a) * v, vz: Math.sin(a) * v, vy: Math.random() * up + up * .3, c, life: life * (.6 + Math.random() * .6), s: s * (.6 + Math.random() * .8), grav, drag: 1.5 }); } },
  ring(x, y, z, r, n, c, life = .5, s = .4) { for (let i = 0; i < n; i++) { const a = i / n * TAU; this.add(x + Math.cos(a) * r, y, z + Math.sin(a) * r, { vx: Math.cos(a) * 2, vz: Math.sin(a) * 2, vy: 1 + Math.random(), c, life, s, drag: 2 }); } },
  update(dt) {
    const L = this.list;
    for (let i = L.length - 1; i >= 0; i--) {
      const p = L[i]; p.life -= dt; if (p.life <= 0) { L[i] = L[L.length - 1]; L.pop(); continue; }
      p.vy += p.grav * dt; const k = Math.max(0, 1 - p.drag * dt); p.vx *= k; p.vz *= k; p.vy *= (p.grav ? 1 : k);
      p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt; if (p.fade) p.a = p.a0 * (p.life / p.max);
    }
  }
};

const Effects = {
  list: [], // ground decals / telegraphs
  add(e) { e.t = 0; this.list.push(e); return e; },
  update(dt) {
    for (let i = this.list.length - 1; i >= 0; i--) {
      const e = this.list[i]; e.t += dt;
      if (e.tele && !e.fired && e.t >= e.dur) { e.fired = true; e.onFire && e.onFire(e); }
      if (e.t >= e.dur + (e.tele ? .25 : 0)) this.list.splice(i, 1);
    }
  }
};

/* ---------------- Monsters ---------------- */
let MID = 1;
function makeMonster(type, x, z, home) {
  const d = MONSTERS[type];
  const lvlBonus = 0;
  return {
    id: MID++, type, d, x, z, y: 0, home: home || { x, z, r: 8 }, face: Math.random() * TAU, hp: d.hp + lvlBonus, max: d.hp, state: 'idle', t: Math.random() * 3, anim: Math.random() * 10,
    atkCD: 1, wind: 0, flash: 0, hit: 0, aggro: false, dead: false, respawn: 0, stun: 0, slow: 0, zone: World.zoneOf(x), tgt: null, dmgBy: false, lastHit: 0
  };
}

const Monsters = {
  list: [], boss: null,
  init() {
    this.list = [];
    for (const [type, x, z, r, n] of SPAWNS) {
      for (let i = 0; i < n; i++) {
        let px, pz, tries = 0;
        do { const a = Math.random() * TAU, rr = Math.random() * r; px = x + Math.cos(a) * rr; pz = z + Math.sin(a) * rr; tries++; } while (Col.blocked(px, pz, 1) && tries < 20);
        this.list.push(makeMonster(type, px, pz, { x, z, r: r + 4 }));
      }
    }
    this.boss = makeMonster('boss', DX, -104, { x: DX, z: -100, r: 22 });
    Object.assign(this.boss, { barrier: false, phase: 0, armL: 0, armR: 0, atkT: 3, chainCD: 0, perfect: true, engaged: false, stunT: 0 });
    this.list.push(this.boss);
  },
  alive(zone) { return this.list.filter(m => !m.dead && m.zone === zone); },
  update(dt) {
    const P = Player;
    for (const m of this.list) {
      if (m.zone !== P.zone && !m.dead) { continue; }
      if (m.dead) {
        if (m.summon) continue;
        m.respawn -= dt;
        const far = m.zone !== P.zone || dist2(m.home.x, m.home.z, P.x, P.z) > (m.d.boss || m.d.wboss ? 40 * 40 : 26 * 26);
        if ((m.respawn <= 0 && far) || (!m.d.boss && !m.d.wboss && !m.d.elite && m.respawn < -25)) this.revive(m);
        continue;
      }
      m.anim += dt; m.flash = Math.max(0, m.flash - dt * 4); m.hit = Math.max(0, m.hit - dt);
      if (m.stun > 0) { m.stun -= dt; continue; }
      if (m.slow > 0) m.slow -= dt;
      if (m.d.boss) { Boss.update(m, dt); continue; }
      if (m.d.wboss) { NakBoss.update(m, dt); continue; }
      if ((m.d.sp || m.d.ranged) && GhostAI.update(m, dt)) continue;
      const dP = Math.sqrt(dist2(m.x, m.z, P.x, P.z));
      const leash = Math.sqrt(dist2(m.x, m.z, m.home.x, m.home.z));
      if (P.dead) m.aggro = false;
      if (!m.aggro && m.d.aggro > 0 && dP < m.d.aggro && !P.dead && Game.safeT <= 0 && (!m.d.blind || P.moving || dP < 2)) { m.aggro = true; m.state = 'chase'; UI.mark(m); }
      if (m.aggro && (leash > m.home.r + 18 || dP > 30)) { m.aggro = false; m.state = 'return'; m.hp = Math.min(m.max, m.hp + m.max * .3); }
      let spd = m.d.spd * (m.slow > 0 ? .5 : 1);
      let mx = 0, mz = 0;
      if (m.aggro) {
        if (m.wind > 0) {
          m.wind -= dt;
          if (m.wind <= 0) { if (dP < m.d.range + .8 + m.d.r * .3) Combat.hitPlayer(m.d.atk, m); m.atkCD = m.d.rate; }
        } else if (dP > m.d.range) { mx = (P.x - m.x) / dP; mz = (P.z - m.z) / dP; }
        else { m.face = Math.atan2(P.x - m.x, P.z - m.z); m.atkCD -= dt; if (m.atkCD <= 0) { m.wind = .45; } }
        if (dP > m.d.range) m.atkCD = Math.max(m.atkCD - dt, .25);
      } else if (m.state === 'return') {
        const dx = m.home.x - m.x, dz = m.home.z - m.z, l = Math.hypot(dx, dz); if (l < 2) m.state = 'idle'; else { mx = dx / l; mz = dz / l; spd *= 1.3; }
      } else {
        m.t -= dt;
        if (m.t <= 0) { if (m.state === 'wander') { m.state = 'idle'; m.t = 1.5 + Math.random() * 3; } else { m.state = 'wander'; m.t = 1 + Math.random() * 2; const a = Math.random() * TAU, r = Math.random() * m.home.r; m.wx = m.home.x + Math.cos(a) * r; m.wz = m.home.z + Math.sin(a) * r; } }
        if (m.state === 'wander') { const dx = m.wx - m.x, dz = m.wz - m.z, l = Math.hypot(dx, dz); if (l > .5) { mx = dx / l; mz = dz / l; spd *= .45; } }
      }
      if (mx || mz) {
        m.face = Math.atan2(mx, mz);
        let nx = m.x + mx * spd * dt, nz = m.z + mz * spd * dt;
        [nx, nz] = Col.resolve(nx, nz, m.d.r * .8);
        m.x = nx; m.z = nz; m.moving = true;
      } else m.moving = false;
      // separation from player
      const sep = m.d.r + .5; if (dP < sep && dP > .01) { m.x = P.x + (m.x - P.x) / dP * sep; m.z = P.z + (m.z - P.z) / dP * sep; }
    }
    // separation between monsters (cheap)
    const L = this.list;
    for (let i = 0; i < L.length; i++) { const a = L[i]; if (a.dead || a.zone !== P.zone || a.d.boss || a.d.wboss || a.jump) continue; for (let j = i + 1; j < L.length; j++) { const b = L[j]; if (b.dead || b.zone !== a.zone || b.d.boss || b.d.wboss || b.jump) continue; const dx = b.x - a.x, dz = b.z - a.z; const rr = a.d.r + b.d.r; const d2 = dx * dx + dz * dz; if (d2 < rr * rr && d2 > .0001) { const d = Math.sqrt(d2), push = (rr - d) / 2; a.x -= dx / d * push; a.z -= dz / d * push; b.x += dx / d * push; b.z += dz / d * push; } } }
  },
  revive(m) {
    m.dead = false; m.hp = m.max; m.aggro = false; m.state = 'idle'; m.alpha = 1; m.stun = 0; m.slow = 0; m.wind = 0; m.cast = null; m.jump = null; m.sumDone = null; m.headOut = null;
    if (m.d.wboss) NakBoss.reset(m);
    else if (!m.d.boss) { const a = Math.random() * TAU, r = Math.random() * (m.home.r - 4); m.x = m.home.x + Math.cos(a) * r; m.z = m.home.z + Math.sin(a) * r; [m.x, m.z] = Col.resolve(m.x, m.z, 1); }
    else { m.x = DX; m.z = -104; Object.assign(m, { barrier: false, phase: 0, engaged: false, atkT: 3, perfect: true, stunT: 0 }); }
  },
  draw(R, t) {
    const P = Player;
    for (const m of this.list) {
      if (m.zone !== P.zone) continue;
      if (m.dead && m.deathT === undefined) continue;
      if (m.zone === 'temple') { if (dist2(m.x, m.z, P.x, P.z) > 100 * 100) continue; const pp = R.project(m.x, (m.d.fly ? 2 : m.d.h * .5), m.z); if (!pp || pp.x < -260 || pp.x > R.cv.clientWidth + 260 || pp.y < -360 || pp.y > R.cv.clientHeight + 360) continue; }
      let alpha = 1, sc = 1;
      if (m.dead) { m.deathT += 1 / 60; if (m.deathT > .5) { m.deathT = undefined; continue; } sc = 1 - m.deathT * 1.6; }
      const fl = m.flash * .6; const tint = m.hit > 0 ? [1.4, .8, .8] : null;
      const wind = m.wind > 0 ? 1 - m.wind / .45 : 0;
      const type = m.type; const bob = Math.sin(m.anim * (m.moving ? 10 : 3));
      const M = Game.tmpM;
      if (GDRAW[type]) GDRAW[type](R, m, sc, tint, fl, t);
      else if (type === 'slime') {
        const hop = m.moving ? Math.abs(Math.sin(m.anim * 8)) * .5 : 0;
        M4.compose(M, m.x, hop, m.z, -wind * .3, m.face, 0, sc * (1 + bob * .06), sc * (1 - bob * .08 + wind * .2), sc * (1 + bob * .06)); R.drawMesh(Models.slime, M, tint, null, fl);
      } else if (type === 'shroom') {
        M4.compose(M, m.x, m.moving ? Math.abs(bob) * .2 : 0, m.z, -wind * .4 + (m.moving ? bob * .08 : 0), m.face, bob * .05, sc, sc * (1 + bob * .03), sc); R.drawMesh(Models.shroom, M, tint, null, fl);
      } else if (type === 'wolf') {
        M4.compose(M, m.x, m.moving ? Math.abs(bob) * .15 : 0, m.z, (m.moving ? bob * .08 : 0) - wind * .35, m.face, 0, sc, sc, sc); R.drawMesh(Models.wolf, M, tint, null, fl);
      } else if (type === 'goblin') {
        M4.compose(M, m.x, m.moving ? Math.abs(bob) * .15 : 0, m.z, -wind * .4, m.face, m.moving ? bob * .1 : 0, sc, sc, sc); R.drawMesh(Models.goblin, M, tint, null, fl);
      } else if (type === 'bat') {
        const y = 1.8 + Math.sin(m.anim * 3) * .3;
        M4.compose(M, m.x, y, m.z, -wind * .5, m.face, 0, sc, sc, sc); R.drawMesh(Models.batBody, M, tint, [.1, .08, .2], fl);
        const fa = Math.sin(m.anim * 16) * .7;
        M4.compose(M, m.x, y, m.z, 0, m.face, fa, sc, sc, sc); R.drawMesh(Models.batWing, M, tint, null, fl);
        M4.compose(M, m.x, y, m.z, 0, m.face + Math.PI, -fa, sc, sc, sc); R.drawMesh(Models.batWing, M, tint, null, fl);
      } else if (type === 'skel') {
        M4.compose(M, m.x, 0, m.z, -wind * .3, m.face, m.moving ? bob * .06 : 0, sc, sc, sc); R.drawMesh(Models.skel, M, tint, [.05, .05, .06], fl);
      } else if (type === 'boss') { Boss.draw(R, m, sc, tint); }
    }
  }
};

/* ---------------- Boss ---------------- */
const Boss = {
  update(m, dt) {
    const P = Player; const dP = Math.sqrt(dist2(m.x, m.z, P.x, P.z));
    const inArena = P.zone === 'dungeon' && dist2(P.x, P.z, DX, -100) < 26 * 26;
    if (!m.engaged) { if (inArena && !P.dead) { m.engaged = true; Cam.dist = Math.max(Cam.dist, 22); UI.bossBar(true); UI.toast('ยักษ์ศิลา ผู้พิทักษ์ผลึก ตื่นขึ้นแล้ว!', 'boss'); Audio.sfx('boss'); } else return; }
    if (!inArena || P.dead) { m.engaged = false; UI.bossBar(false); m.hp = Math.min(m.max, m.hp + m.max * .5); m.barrier = false; m.phase = Math.min(m.phase, 0); m.x = DX; m.z = -104; return; }
    m.chainCD = Math.max(0, m.chainCD - dt);
    if (m.stunT > 0) { m.stunT -= dt; return; }
    // phase barrier
    const ratio = m.hp / m.max;
    if (!m.barrier && ((m.phase === 0 && ratio <= .7) || (m.phase === 1 && ratio <= .35))) {
      m.barrier = true; m.phase++; UI.toast('ยักษ์ศิลา สร้างเกราะผลึก! เข้าใกล้แล้วกด F เพื่อเริ่ม Chain Quiz', 'boss');
      for (let i = 0; i < 2; i++) { const b = makeMonster('bat', m.x + rand(-6, 6), m.z + rand(2, 8), { x: DX, z: -100, r: 20 }); b.aggro = true; b.summon = true; Monsters.list.push(b); }
      Audio.sfx('barrier');
    }
    // move toward player
    if (dP > 5.5) { const s = m.d.spd * (m.slow > 0 ? .5 : 1); m.face = Math.atan2(P.x - m.x, P.z - m.z); m.x += Math.sin(m.face) * s * dt; m.z += Math.cos(m.face) * s * dt; m.moving = true; [m.x, m.z] = Col.resolve(m.x, m.z, 2.2); }
    else { m.moving = false; m.face += angWrap(Math.atan2(P.x - m.x, P.z - m.z) - m.face) * Math.min(1, dt * 3); }
    m.atkT -= dt;
    if (m.atkT <= 0) {
      const speedUp = m.phase >= 2 ? .7 : m.phase === 1 ? .85 : 1;
      const r = Math.random();
      if (dP < 6 && r < .45) this.swipe(m);
      else if (r < .4) this.slam(m);
      else if (r < .72) this.sweep(m);
      else this.rain(m);
      m.atkT = 2.8 * speedUp + Math.random() * .6;
    }
  },
  swipe(m) { const f = Math.atan2(Player.x - m.x, Player.z - m.z); m.face = f; m.armSwing = 1; Effects.add({ tele: true, kind: 'cone', x: m.x, z: m.z, r: 7, rot: f, ang: .8, dur: .7, col: [1, .3, .2, .6], onFire: e => { this.hitIn(e, m.d.atk * 1.0); Game.shake(.25); } }); },
  slam(m) { m.armSwing = 2; Effects.add({ tele: true, kind: 'circle', x: m.x, z: m.z, r: 8, dur: 1.6, col: [1, .25, .2, .6], onFire: e => { this.hitIn(e, m.d.atk * 1.5); Particles.ring(e.x, .3, e.z, 4, 40, [.6, .9, 1], .7, .8); Game.shake(.6); Audio.sfx('slam'); } }); },
  sweep(m) { const f = Math.atan2(Player.x - m.x, Player.z - m.z); m.face = f; m.armSwing = 1; Effects.add({ tele: true, kind: 'cone', x: m.x, z: m.z, r: 13, rot: f, ang: 1.05, dur: 1.3, col: [1, .3, .2, .6], onFire: e => { this.hitIn(e, m.d.atk * 1.3); Game.shake(.4); Audio.sfx('slam'); for (let i = 0; i < 20; i++) { const a = f + rand(-1, 1), d = rand(2, 12); Particles.burst(e.x + Math.sin(a) * d, .3, e.z + Math.cos(a) * d, 2, [.6, .9, 1], 3, .5); } } }); },
  rain(m) {
    const n = m.phase >= 2 ? 7 : 5;
    for (let i = 0; i < n; i++) {
      const px = Player.x + (i ? rand(-6, 6) : Player.vx * .6), pz = Player.z + (i ? rand(-6, 6) : Player.vz * .6);
      Effects.add({ tele: true, kind: 'circle', x: px, z: pz, r: 2.8, dur: 1.4 + i * .08, col: [.6, .4, 1, .6], onFire: e => { this.hitIn(e, m.d.atk * .9); Particles.burst(e.x, .5, e.z, 14, [.7, .6, 1], 5, .6, .5, 4); Audio.sfx('crystal'); } });
    }
  },
  hitIn(e, dmg) {
    const P = Player; if (P.dead || P.zone !== 'dungeon') return;
    const dx = P.x - e.x, dz = P.z - e.z, d = Math.hypot(dx, dz);
    if (e.kind === 'circle') { if (d <= e.r + .3) Combat.hitPlayer(dmg, Monsters.boss); }
    else { if (d <= e.r + .3) { const a = Math.abs(angWrap(Math.atan2(dx, dz) - e.rot)); if (a <= e.ang) Combat.hitPlayer(dmg, Monsters.boss); } }
  },
  draw(R, m, sc, tint) {
    const M = Game.tmpM; const t = m.anim;
    const bob = Math.sin(t * (m.moving ? 6 : 2)) * .12;
    m.armSwing = Math.max(0, (m.armSwing || 0) - 1 / 60 * 1.2);
    const stun = m.stunT > 0;
    M4.compose(M, m.x, bob, m.z, stun ? .25 : 0, m.face, stun ? Math.sin(t * 8) * .05 : 0, sc * 1.25, sc * 1.25, sc * 1.25); R.drawMesh(Models.bossBody, M, tint, [.04, .05, .08], m.flash);
    for (const s of [-1, 1]) {
      const sw = (m.armSwing || 0) * (s === 1 ? 1.6 : 1.2); const swing = Math.sin(t * (m.moving ? 6 : 2) + (s > 0 ? 0 : Math.PI)) * .25 - sw;
      const ox = Math.cos(m.face) * s * 2.6 * sc, oz = -Math.sin(m.face) * s * 2.6 * sc;
      M4.compose(M, m.x + ox, 4.9 * sc + bob, m.z + oz, swing, m.face, s * .12, sc * 1.25, sc * 1.25, sc * 1.25); R.drawMesh(Models.bossArm, M, tint, [.04, .05, .08], m.flash);
    }
  },
  drawBarrier(R, m) {
    if (!m.barrier || m.dead || m.zone !== Player.zone) return;
    const M = Game.tmpM; const p = .5 + Math.sin(m.anim * 3) * .05;
    M4.compose(M, m.x, 3.6, m.z, 0, m.anim * .4, 0, 5.2 + p, 5.4 + p, 5.2 + p);
    R.drawMesh(Models.barrier, M, [.6, .9, 1], [.25, .55, .75], 0, .32);
  }
};

/* ---------------- NPCs ---------------- */
const NPCList = [];
function initNPCs() { NPCList.length = 0; for (const id in NPCS) { const n = NPCS[id]; NPCList.push({ id, ...n, face0: n.face, anim: Math.random() * 5, waveT: 0, rig: new Rig(n.sheet) }); } }

/* ---------------- Projectiles ---------------- */
const Projectiles = {
  list: [],
  fire(o) { this.list.push(Object.assign({ life: 1.6, y: 1.3, hit: new Set(), spin: 0 }, o)); },
  update(dt) {
    for (let i = this.list.length - 1; i >= 0; i--) {
      const p = this.list[i]; p.life -= dt; p.spin += dt * 18;
      if (p.target && !p.target.dead && !p.pierce) { const dx = p.target.x - p.x, dz = p.target.z - p.z; const a = Math.atan2(dx, dz); p.dir += angWrap(a - p.dir) * Math.min(1, dt * 10); }
      p.x += Math.sin(p.dir) * p.speed * dt; p.z += Math.cos(p.dir) * p.speed * dt;
      const c = p.col; if (Math.random() < .7) Particles.add(p.x, p.y, p.z, { c, s: p.kind === 'fire' ? .6 : .3, life: .3, vy: .3 });
      let done = p.life <= 0;
      for (const m of Monsters.list) {
        if (m.dead || m.zone !== Player.zone || p.hit.has(m)) continue;
        const hy = m.d.fly ? 1.8 : 0;
        if (dist2(p.x, p.z, m.x, m.z) < (m.d.r + .5) ** 2) {
          p.hit.add(m);
          Combat.damageMonster(m, p.dmg, p.opts || {});
          if (p.splash) { for (const o of Monsters.list) if (o !== m && !o.dead && o.zone === m.zone && dist2(o.x, o.z, m.x, m.z) < p.splash * p.splash) Combat.damageMonster(o, p.dmg * .6, {}); Particles.burst(m.x, 1, m.z, 18, [1, .55, .2], 5, .5, .6, 3); }
          Particles.burst(p.x, p.y + hy * 0, p.z, 8, c, 3, .35, .3, 2);
          if (!p.pierce) { done = true; break; }
        }
      }
      if (Col.blocked(p.x, p.z, .15) && !p.pierce) done = true;
      if (done) this.list.splice(i, 1);
    }
  },
  draw(R) {
    const M = Game.tmpM;
    for (const p of this.list) {
      if (p.kind === 'arrow') { M4.compose(M, p.x, p.y, p.z, 0, p.dir, 0, 1, 1, 1); R.drawMesh(Models.arrow, M, null, [.15, .12, .05]); }
      else if (p.kind === 'star') { M4.compose(M, p.x, p.y, p.z, 0, p.spin, 0, 1, 1, 1); R.drawMesh(Models.star, M, null, [.2, .2, .25]); }
      else { const s = (p.kind === 'fire' ? 1.2 : 1) * (p.big ? 1.5 : 1); M4.compose(M, p.x, p.y, p.z, 0, 0, 0, s, s, s); R.drawMesh(Models.orb, M, [p.col[0] * .3, p.col[1] * .3, p.col[2] * .3], p.col); }
    }
  }
};

/* ---------------- Player ---------------- */
const Player = {
  x: 9, z: 66, zone: 'world', face: Math.PI, vx: 0, vz: 0, moving: false, moveTo: null, target: null, atkCD: 0, anim: 0,
  act: null, actT: 0, hurtT: 0, dead: false, stats: {}, stuckT: 0, regenT: 0, combatT: 0,
  reset() { this.dead = false; this.moveTo = null; this.target = null; this.act = null; this.hurtT = 0; },
  recalc() {
    const S = Save.d; const c = Cls.of(S); const L = S.level - 1; const al = S.alloc;
    const st = { maxhp: c.hp + L * 12 + al.hp * 10, maxmp: c.mp + L * 5 + al.mp * 6, atk: c.atk + L * 2 + al.atk * 2, def: c.def + L * 1 + al.def * 1.5, spd: c.spd + al.spd * .12, range: c.range };
    for (const slot of ['weapon', 'armor', 'acc']) { const id = S.equip[slot]; if (!id) continue; const it = ITEMS[id]; st.atk += it.atk || 0; st.def += it.def || 0; st.maxhp += it.hp || 0; st.maxmp += it.mp || 0; st.spd += it.spd || 0; }
    if (S.perm) { st.atk += S.perm.atk || 0; st.maxhp += S.perm.hp || 0; }
    let spdPct = 0; for (const slot in S.cos) { const id = S.cos[slot]; if (id && ITEMS[id] && ITEMS[id].bonus) spdPct += ITEMS[id].bonus.spdPct || 0; }
    const B = S.buffs;
    if (B.spd) spdPct += .25; if (B.haste) spdPct += .3; if (B.assassin) spdPct += .3;
    st.spd *= 1 + spdPct;
    Mounts.applyStats(st);
    if (Net.gm && S.gmFast) st.spd *= 2;
    if (B.atk) st.atk *= 1.2;
    if (B.def) st.def *= 1.25; if (B.guard) st.def *= 1.7;
    if (B.ironhp) st.maxhp = Math.round(st.maxhp * 1.2); if (B.curse) st.atk *= .8; if (B.slowed) st.spd *= .65; if (B.bound) st.spd *= .05; if (B.jaoti) st.def *= 1.15; if (c.role === 'tank') st.def *= 1.1;
    st.atk = Math.round(st.atk); st.def = Math.round(st.def);
    this.stats = st;
    S.hp = Math.min(S.hp, st.maxhp); S.mp = Math.min(S.mp, st.maxmp);
  },
  get sheet() { const o = Save.d.cos.outfit; return o ? ITEMS[o].sheet : (Save.d.job || Save.d.cls); },
  update(dt, input) {
    const S = Save.d; this.anim += dt; this.hurtT = Math.max(0, this.hurtT - dt); this.atkCD -= dt; this.combatT -= dt;
    if (this.actT > 0) { this.actT -= dt; if (this.actT <= 0) this.act = null; }
    const rig = this.getRig();
    if (this.dead) { rig.update(dt, { dead: true }); this.deadT = (this.deadT || 0) + dt; return; }
    this.deadT = 0;
    // regen
    this.regenT += dt;
    if (this.regenT >= 1) {
      this.regenT = 0; const st = this.stats; const ooc = this.combatT <= 0;
      S.hp = Math.min(st.maxhp, S.hp + st.maxhp * (ooc ? .03 : .006) + (S.buffs.regen ? 4 + S.level : 0) + (S.cls === 'priest' ? 1 : 0));
      S.mp = Math.min(st.maxmp, S.mp + st.maxmp * (ooc ? .05 : .02));
    }
    let dx = 0, dz = 0;
    const st = this.stats;
    if (input.x || input.z) {
      // camera-relative
      const yaw = Cam.yaw; const fx = -Math.sin(yaw), fz = -Math.cos(yaw), rx = Math.cos(yaw), rz = -Math.sin(yaw);
      dx = fx * input.z + rx * input.x; dz = fz * input.z + rz * input.x; const l = Math.hypot(dx, dz); dx /= l; dz /= l;
      this.moveTo = null; if (this.target && this.target.kind !== 'mon') this.target = null; if (Nav.active) Nav.stop(); if (AutoHunt.on) { AutoHunt.stop(); this.target = null; }
      if (this.target && this.target.kind === 'mon') this.target.manual = false;
    } else if (this.nav && Nav.active && !this.target) {
      const s = Nav.steer(dt); if (s) { dx = s[0]; dz = s[1]; }
    } else if (this.target) {
      const T = this.target; const o = T.ref;
      if ((T.kind === 'mon' && (o.dead || o.zone !== this.zone)) || (T.kind !== 'mon' && T.done)) { const wasDef = T.defend; this.target = null; if (wasDef && Nav.active) Nav.plan(); }
      else {
        const d = Math.sqrt(dist2(this.x, this.z, o.x, o.z));
        const reach = T.kind === 'mon' ? st.range + o.d.r * .6 : 2.6 + (T.r || 0);
        if (d > reach) { dx = (o.x - this.x) / d; dz = (o.z - this.z) / d; }
        else {
          this.face = Math.atan2(o.x - this.x, o.z - this.z);
          if (T.kind === 'mon') { if (this.atkCD <= 0 && !this.act) Combat.basicAttack(o); }
          else { this.target = null; Game.interact(T); }
        }
      }
    } else if (this.moveTo) {
      const ddx = this.moveTo.x - this.x, ddz = this.moveTo.z - this.z, d = Math.hypot(ddx, ddz);
      if (d < .35) this.moveTo = null; else { dx = ddx / d; dz = ddz / d; }
    }
    // dash (shadow step)
    if (this.dashT > 0) {
      this.dashT -= dt; const step = this.dashSpd * dt; let nx = this.x + Math.sin(this.dashDir) * step, nz = this.z + Math.cos(this.dashDir) * step;
      const r = Col.resolve(nx, nz, .55); if (Math.abs(r[0] - nx) > .05 || Math.abs(r[1] - nz) > .05) this.dashT = 0; else { this.x = nx; this.z = nz; World.clampBounds(this); }
      this.ghostT = (this.ghostT || 0) - dt; if (this.ghostT <= 0 && !Mounts.riding()) { this.ghostT = .035; rig.pose(this.x, 0, this.z, this.face, CHAR_SCALE); Fx.ghost(rig, CharModels[this.sheet], [.45, .3, .9], .32); }
      if (this.dashT <= 0 && this.onDashEnd) { const f = this.onDashEnd; this.onDashEnd = null; f(); }
      dx = dz = 0;
    }
    const busy = rig.busy || this.dashT > 0;
    if (busy && this.moveTo) { /* keep order for after action */ }
    const moving = !!(dx || dz) && !busy;
    if (moving) {
      this.spdF = Math.min(1, (this.spdF || 0) + dt * 7);
      const spd = st.spd * (.35 + .65 * this.spdF * this.spdF);
      const tf = Math.atan2(dx, dz); this.face += angWrap(tf - this.face) * Math.min(1, dt * 12);
      const ox = this.x, oz = this.z;
      let nx = this.x + dx * spd * dt, nz = this.z + dz * spd * dt;
      [nx, nz] = Col.resolve(nx, nz, .55);
      this.x = nx; this.z = nz; World.clampBounds(this);
      this.vx = (this.x - ox) / dt; this.vz = (this.z - oz) / dt;
      const moved = Math.hypot(this.x - ox, this.z - oz);
      if (moved < spd * dt * .2) { this.stuckT += dt; if (this.stuckT > .6) { this.moveTo = null; this.stuckT = 0; if (this.nav && Nav.active) Nav.onStuck(); } } else this.stuckT = 0;
      this.moving = true;
      this.walkPh = (this.walkPh || 0) + moved * TAU / 2.1;
    } else { this.moving = false; this.vx = this.vz = 0; this.spdF = Math.max(0, (this.spdF || 0) - dt * 8); }
    this.walkAmp = lerp(this.walkAmp || 0, this.moving ? Math.min(1, .55 + .45 * this.spdF) : 0, Math.min(1, dt * (this.moving ? 10 : 7)));
    if (!this.moving && this.walkAmp > .02) { const k = Math.round(this.walkPh / Math.PI) * Math.PI; this.walkPh += (k - this.walkPh) * Math.min(1, dt * 8); }
    const ride = Mounts.riding() || !!(typeof Seats !== 'undefined' && Seats.driver);
    rig.update(dt, { walk: ride ? 0 : this.walkAmp, ph: this.walkPh, speed: ride ? 0 : this.moving ? Math.hypot(this.vx, this.vz) : 0, think: this.act === 'think', ride, wave: (this.waveT = Math.max(0, (this.waveT || 0) - dt)) > 0 });
    if (ride) rig.rootZcarry = 0;
    if (rig.rootZcarry) { const c = rig.rootZcarry * CHAR_SCALE; rig.rootZcarry = 0; const r = Col.resolve(this.x + Math.sin(this.face) * c, this.z + Math.cos(this.face) * c, .55); this.x = r[0]; this.z = r[1]; World.clampBounds(this); }
    // aura particles
    const aura = S.cos.aura;
    if (aura && Math.random() < dt * 14) {
      const a = Math.random() * TAU, r = .7 + Math.random() * .5;
      if (aura === 'c_star') { const a2 = this.anim * 2.4 + Math.random() * .3; for (let k = 0; k < 2; k++) { const aa = a2 + k * Math.PI; Particles.add(this.x + Math.cos(aa) * 1.0, 1.2 + Math.sin(this.anim * 3 + k) * .6, this.z + Math.sin(aa) * 1.0, { c: [1, .85, .35], s: .35, life: .8, vy: .2 }); } }
      else if (aura === 'c_rainbow') { const h = (this.anim * .5 + Math.random() * .2) % 1; const c = [.5 + .5 * Math.cos(TAU * h), .5 + .5 * Math.cos(TAU * (h - .33)), .5 + .5 * Math.cos(TAU * (h - .66))]; const a2 = this.anim * 3 + Math.random() * .4; Particles.add(this.x + Math.cos(a2) * 1.1, .3 + Math.random() * 2, this.z + Math.sin(a2) * 1.1, { c, s: .3, life: 1, vy: .5 }); }
      else if (aura === 'c_soul') { const a2 = this.anim * 1.6 + Math.random() * .4; Particles.add(this.x + Math.cos(a2) * 1.1, .6 + Math.sin(this.anim * 2) * .4 + Math.random() * 1.4, this.z + Math.sin(a2) * 1.1, { c: [.55, .85, 1], s: .38, life: 1.3, vy: .35 }); }
      else if (aura === 'c_fairy') Particles.add(this.x + Math.cos(a) * r, .4 + Math.random() * 2.2, this.z + Math.sin(a) * r, { c: pick([[.6, 1, .9], [1, .9, .5], [.8, .7, 1]]), s: .22, life: 1.2, vy: .4 });
      else Particles.add(this.x + Math.cos(a) * r * .7, .2 + Math.random() * .6, this.z + Math.sin(a) * r * .7, { c: [1, .45 + Math.random() * .3, .12], s: .3, life: 1.0, vy: 1.6 });
    }
  },
  frame() {
    if (this.dead) return { f: FR.hurt, flip: false };
    if (this.act === 'attack') return { f: FR.attack, flip: this.actFlip };
    if (this.act === 'skill') return { f: FR.skill, flip: this.actFlip };
    if (this.act === 'cheer') return { f: FR.cheer, flip: false };
    if (this.act === 'think') return { f: FR.think, flip: false };
    if (this.hurtT > .15) return { f: FR.hurt, flip: false };
    return viewFrame(this.face, this.x, this.z, this.moving, this.anim);
  },
  // procedural animation params for the sprite shader
  animParams(fr) {
    const key = fr.f * 2 + (fr.flip ? 1 : 0);
    if (key !== this.lastKey) { if (this.lastKey !== undefined) this.turnT = .14; this.lastKey = key; }
    this.turnT = Math.max(0, (this.turnT || 0) - 1 / 60);
    const sq = 1 - Math.sin((this.turnT / .14) * Math.PI) * .18;
    const a = this.walkAmp || 0, ph = this.walkPh || 0;
    const act = this.act === 'attack' || this.act === 'skill';
    return {
      ph, amp: act ? a * .4 : a, lean: (fr.dir || 0) * a * .06 * (fr.stride || 0) - (this.hurtT > .15 ? .04 : 0),
      br: Math.sin(this.anim * 2.2) * (1 - a), stride: fr.stride || 0, sq,
      bob: a * .08 * Math.abs(Math.cos(ph)) + (this.act === 'cheer' ? Math.abs(Math.sin(this.anim * 9)) * .25 : 0)
    };
  },
  getRig() { const sh = this.sheet; if (!this.rig || this.rig.cls !== sh) this.rig = new Rig(sh); return this.rig; },
  doAct(a, t, targetX) {
    if (a === 'cheer') { const r = this.getRig(); if (!r.busy) r.play('cheer'); }
    this.act = a; this.actT = t;
    if (targetX !== undefined) { const p = Game.R.project(targetX.x, 1, targetX.z), me = Game.R.project(this.x, 1, this.z); this.actFlip = p && me ? p.x < me.x : false; }
    else this.actFlip = false;
  }
};

/* ---------------- Character sprite draw ---------------- */
function drawCharacter(R, sheet, x, z, fr, opts = {}) {
  const tex = Game.tex[sheet]; if (!tex) return;
  const bob = opts.bob || 0;
  R.drawSprite(tex, x, bob, z, SPR_W, SPR_H, UVS[fr.f], fr.flip, opts.tint, opts.flash || 0, opts.light || 1, opts.alpha || 1, opts.an);
}
function headPos(sheet, fr, x, z, bob) {
  const meta = SPRITE_META[sheet][fr.f]; const h = meta ? meta.head : .92; const R = Game.R;
  const up = R.sprUp; const k = SPR_H * h + (bob || 0);
  return [x + up[0] * k, up[1] * k, z + up[2] * k];
}
function drawCosmetics(R, x, z, fr, bob) {
  const S = Save.d; const M = Game.tmpM; const sheet = Player.sheet;
  const yaw = Cam.yaw; const f = R.camFwd;
  R.useLit();
  const head = S.cos.head;
  if (head) {
    const hp = headPos(sheet, fr, x, z, bob); const drop = head === 'c_crown' ? .12 : head === 'c_sheep' ? .38 : .3;
    const up = R.sprUp; const px = hp[0] - up[0] * drop - f[0] * .25, py = hp[1] - up[1] * drop, pz = hp[2] - up[2] * drop - f[2] * .25;
    const tilt = Math.asin(clamp(-f[1], -1, 1)) * .35;
    const hs = head === 'c_sheep' ? .82 : .9; M4.compose(M, px, py, pz, -tilt, yaw, fr.flip ? .06 : -.06, hs, hs, hs);
    R.drawMesh(Models[head], M, null, head === 'c_crown' ? [.15, .2, .25] : null);
  }
  const back = S.cos.back;
  if (back) {
    const backView = fr.f === FR.back || fr.f === FR.back34;
    const up = R.sprUp; const k = SPR_H * .58 + bob; const off = backView ? -.25 : .28;
    const px = x + up[0] * k + f[0] * off, py = up[1] * k, pz = z + up[2] * k + f[2] * off;
    const flap = Math.sin(Player.anim * (3 + 7 * (Player.walkAmp || 0))) * (.25 + .15 * (Player.walkAmp || 0));
    const mesh = Models[back];
    const ws = .85; M4.compose(M, px, py, pz, 0, yaw + .25 + flap, 0, ws, ws, ws); R.drawMesh(mesh, M, null, back === 'c_angel' ? [.12, .12, .14] : [.04, .02, .06]);
    M4.compose(M, px, py, pz, 0, yaw + Math.PI - .25 - flap, 0, ws, ws, ws); R.drawMesh(mesh, M, null, back === 'c_angel' ? [.12, .12, .14] : [.04, .02, .06]);
  }
}

