/* ============================================================
   Ghost AI: special attacks with ground telegraphs, enemy
   projectiles, lingering hazards, player displacement, sounds
   ============================================================ */
const GSound = {
  whistle() { Audio.tone(1900, .7, 'sine', .06, 1.6); Audio.tone(2400, .6, 'sine', .04, .7, .15); },
  jingle() { [1800, 2200, 2000].forEach((f, i) => Audio.tone(f, .12, 'triangle', .04, 1, i * .07)); },
  wail() { Audio.tone(520, 1.4, 'sine', .07, .7); Audio.tone(780, 1.2, 'triangle', .03, .6, .1); },
  splash() { Audio.noise(.35, .2, 900); },
  thud() { Audio.noise(.3, .3, 300); Audio.tone(70, .3, 'sine', .2, .5); },
  call() { Audio.tone(330, .18, 'square', .04, .8); Audio.tone(260, .25, 'square', .04, .8, .22); },
  hiss() { Audio.noise(.5, .1, 3000); },
  charm() { [660, 830, 990].forEach((f, i) => Audio.tone(f, .5, 'sine', .04, 1, i * .1)); },
  coin() { for (let i = 0; i < 4; i++) Audio.tone(1300 + i * 120, .1, 'square', .03, 1, i * .06); },
  laugh() { [0, 1, 2, 3].forEach(i => Audio.tone(420 - i * 30, .1, 'sawtooth', .04, .8, i * .12)); },
  owl() { Audio.noise(.6, .06, 2600); Audio.tone(1400, .5, 'sawtooth', .015, .6); },
  dog() { Audio.tone(380, 1.6, 'sine', .035, 1.4); Audio.tone(560, 1.2, 'sine', .02, .9, .5); },
  bell() { [220, 554, 880].forEach((f, i) => Audio.tone(f, 2.4, 'sine', [.05, .025, .015][i])); },
  cricket() { for (let i = 0; i < 6; i++) Audio.tone(4200, .03, 'square', .006, 1, i * .07); }
};

const GhostAI = {
  proj: [], hazards: [], hands: [], heads: [], seenT: 0,
  init(m) { m.spCD = {}; for (const s of m.d.sp || []) if (!s.at) m.spCD[s.k] = (s.cd || 5) * (.25 + Math.random() * .5); },
  // returns true when the ghost handled this frame (casting / special / ranged)
  update(m, dt) {
    const P = Player; if (!m.spCD) this.init(m);
    for (const k in m.spCD) m.spCD[k] -= dt;
    if (m.jump) { this.updJump(m, dt); return true; }
    if (m.d.blind && m.aggro && !m.cast) { const P0 = Player, d0 = Math.sqrt(dist2(m.x, m.z, P0.x, P0.z)); if (!P0.moving && d0 > 2.5 && !(P0.combatT > 5.4)) { m.lostT = (m.lostT || 0) + dt; if (m.lostT > 1.6) { m.lostT = 0; m.aggro = false; m.state = 'idle'; m.t = 2.5; UI.floatText(m.x, m.d.h + .8, m.z, 'หาไม่เจอ...', 'immune'); return false; } } else m.lostT = 0; }
    if (m.cast) {
      m.cast.t -= dt; if (m.cast.track !== false) m.face += angWrap(Math.atan2(P.x - m.x, P.z - m.z) - m.face) * Math.min(1, dt * 6);
      if (m.cast.t <= 0) m.cast = null; return true;
    }
    for (const s of m.d.sp || []) if (s.at) for (const th of s.at) { m.sumDone = m.sumDone || {}; if (m.aggro && m.hp / m.max <= th && !m.sumDone[th]) { m.sumDone[th] = 1; this.SP[s.k](m, s); return true; } }
    if (!m.aggro || P.dead || P.zone !== m.zone || Game.safeT > 0) return false;
    const dP = Math.sqrt(dist2(m.x, m.z, P.x, P.z));
    for (const s of m.d.sp || []) { if (s.at || m.spCD[s.k] > 0 || dP > (s.rng || 6)) continue; if (this.SP[s.k](m, s, dP)) { m.spCD[s.k] = (s.cd || 6) * rand(.85, 1.2); return true; } }
    if (m.d.ranged) return this.ranged(m, dt, dP);
    return false;
  },
  cast(m, k, t, clip, track) { m.cast = { k, t, track }; m.wind = 0; if (clip && m.rig) m.rig.play(clip, 1); },
  // ---- hit helpers ----
  near(x, z, r) { const P = Player; return !P.dead && (P.zone === 'temple' || P.zone === 'amazon') && dist2(P.x, P.z, x, z) <= (r + .35) ** 2; },
  apply(m, mult, fx = {}) {
    const P = Player, S = Save.d; Combat.hitPlayer(m.d.atk * mult, m);
    if (P.dead) return;
    if (fx.buff) for (let i = 0; i < fx.buff.length; i += 2) { const k = fx.buff[i], t = fx.buff[i + 1]; if (S.buffs.ward && BUFFS[k].bad) continue; const first = !S.buffs[k]; S.buffs[k] = Math.max(S.buffs[k] || 0, t); if (k === 'poison') S.poisonDps = 1 + m.d.lvl * .9; if (first) UI.floatText(P.x, 3.1, P.z, BUFFS[k].name + '!', 'immune'); }
    if (fx.buff) Player.recalc();
    if (fx.mp) { const n = Math.min(S.mp, fx.mp); S.mp -= n; if (n > 0) { UI.floatText(P.x, 3.4, P.z, `-${Math.round(n)} MP`, 'immune'); for (let i = 0; i < 10; i++) Particles.add(P.x, 1.4, P.z, { c: [.4, .6, 1], s: .3, life: .6, vx: (m.x - P.x) * 1.5, vz: (m.z - P.z) * 1.5, vy: rand(0, 1) }); } }
    if (fx.heal) { const h = Math.round(m.d.atk * mult * fx.heal); m.hp = Math.min(m.max, m.hp + h); UI.dmgNum(m.x, (m.d.fly ? 2.2 : m.d.h) + .5, m.z, h, 'heal'); for (let i = 0; i < 12; i++) Particles.add(P.x + rand(-.3, .3), 1.3, P.z + rand(-.3, .3), { c: [.9, .1, .15], s: .3, life: .7, vx: (m.x - P.x) * 1.3, vz: (m.z - P.z) * 1.3, vy: 1 }); }
    if (fx.push) { const a = Math.atan2(P.x - fx.push[0], P.z - fx.push[1]); this.displace(P.x + Math.sin(a) * fx.push[2], P.z + Math.cos(a) * fx.push[2], .28); }
    if (fx.pull) { const a = Math.atan2(fx.pull[0] - P.x, fx.pull[1] - P.z), d = Math.max(0, Math.sqrt(dist2(P.x, P.z, fx.pull[0], fx.pull[1])) - fx.pull[2]); this.displace(P.x + Math.sin(a) * d, P.z + Math.cos(a) * d, .32); }
  },
  circle(m, x, z, r, dur, col, mult, fx, onFire) {
    return Effects.add({ tele: true, kind: 'circle', x, z, r, dur, col: col || [1, .3, .25, .55], onFire: e => { if (m.dead) return; if (this.near(e.x, e.z, e.r)) this.apply(m, mult, fx); onFire && onFire(e); } });
  },
  cone(m, r, ang, dur, col, mult, fx, onFire) {
    const rot = Math.atan2(Player.x - m.x, Player.z - m.z); m.face = rot;
    return Effects.add({ tele: true, kind: 'cone', x: m.x, z: m.z, r, rot, ang, dur, col: col || [1, .3, .25, .55], onFire: e => {
      if (m.dead) return; const P = Player; if (this.near(e.x, e.z, e.r)) { const a = Math.abs(angWrap(Math.atan2(P.x - e.x, P.z - e.z) - e.rot)); if (a <= e.ang + .12) this.apply(m, mult, fx); } onFire && onFire(e);
    } });
  },
  rect(m, x0, z0, rot, len, w, dur, col, mult, fx, onFire) {
    return Effects.add({ tele: true, kind: 'rect', x: x0 + Math.sin(rot) * len / 2, z: z0 + Math.cos(rot) * len / 2, x0, z0, w, l: len / 2, len, rot, dur, col: col || [1, .3, .25, .55], onFire: e => {
      if (m.dead) return; const P = Player; if (!P.dead && (P.zone === 'temple' || P.zone === 'amazon')) { const dx = P.x - e.x0, dz = P.z - e.z0, fx0 = Math.sin(e.rot), fz0 = Math.cos(e.rot); const al = dx * fx0 + dz * fz0, sd = dx * fz0 - dz * fx0; if (al >= -.5 && al <= e.len + .4 && Math.abs(sd) <= e.w + .4) this.apply(m, mult, fx); } onFire && onFire(e);
    } });
  },
  displace(tx, tz, dur) { const P = Player; if (P.dashT > 0) return; P.kb = { x0: P.x, z0: P.z, x1: tx, z1: tz, t: 0, dur }; P.moveTo = null; },
  // leap / dive arcs
  jump(m, tx, tz, wind, dur, h, onLand, low) {
    const r = Col.resolve(tx, tz, m.d.r * .8); m.jump = { x0: m.x, z0: m.z, x1: r[0], z1: r[1], t: -wind, dur, h, onLand, low, y: 0 }; m.face = Math.atan2(r[0] - m.x, r[1] - m.z); m.wind = 0;
  },
  updJump(m, dt) {
    const j = m.jump; j.t += dt;
    if (j.t < 0) { j.y = -.15 * Math.sin(-j.t * 20); return; }
    const u = Math.min(1, j.t / j.dur); m.x = lerp(j.x0, j.x1, u); m.z = lerp(j.z0, j.z1, u);
    j.y = j.low ? j.h * Math.sin(u * Math.PI * .85) - (m.d.fly ? 1.7 : 0) * smooth(.55, 1, u) : j.h * 4 * u * (1 - u);
    if (u >= 1) { m.jump = null; m.x = j.x1; m.z = j.z1; j.onLand && j.onLand(); m.atkCD = Math.max(m.atkCD, .8); }
  },
  // ---- ranged (khamot) ----
  ranged(m, dt, dP) {
    const P = Player; const leash = Math.sqrt(dist2(m.x, m.z, m.home.x, m.home.z));
    if (leash > m.home.r + 18 || dP > 30) { m.aggro = false; m.state = 'return'; return false; }
    let mx = 0, mz = 0; m.face = Math.atan2(P.x - m.x, P.z - m.z);
    if (dP > m.d.range) { mx = (P.x - m.x) / dP; mz = (P.z - m.z) / dP; } else if (dP < 3.5) { mx = -(P.x - m.x) / dP; mz = -(P.z - m.z) / dP; }
    if (dP <= m.d.range + .5) { m.atkCD -= dt; if (m.atkCD <= 0) { m.atkCD = m.d.rate; this.shoot(m, P); } }
    if (mx || mz) { const sp = m.d.spd * (m.slow > 0 ? .5 : 1); const r = Col.resolve(m.x + mx * sp * dt, m.z + mz * sp * dt, m.d.r * .8); m.x = r[0]; m.z = r[1]; World.clampBounds(m); m.moving = true; } else m.moving = false;
    return true;
  },
  shoot(m, P) {
    const y = 1.7, lead = .35; const tx = P.x + (P.vx || 0) * lead, tz = P.z + (P.vz || 0) * lead;
    this.shots = (this.shots || 0) + 1; this.proj.push({ x: m.x, y, z: m.z, dir: Math.atan2(tx - m.x, tz - m.z), sp: 11, dmg: m.d.atk, life: 2.2, src: m, col: [.4, 1, .85] });
    Audio.tone(900, .15, 'sine', .04, .5);
  },
  // ---- special skills ----
  SP: {
    scream(m, s) { GhostAI.cast(m, 'scream', 1.05); GSound.whistle(); GhostAI.circle(m, m.x, m.z, s.r, .95, [.85, .85, 1, .5], 1.1, { buff: ['slowed', 3] }, e => { for (let i = 0; i < 3; i++) setTimeout(() => Fx.shock(e.x, e.z, e.r * (.5 + i * .25), [.85, .9, 1], .45), i * 90); Particles.ring(e.x, 4.5, e.z, 1, 30, [.9, .9, 1], .6, .4); }); return true; },
    bump(m, s) { GhostAI.cast(m, 'bump', .65, 'bash'); GSound.jingle(); GhostAI.cone(m, 3.2, .8, .5, [1, .75, .3, .55], 1.0, { push: [m.x, m.z, 3.6] }, e => Fx.shock(e.x + Math.sin(e.rot) * 1.5, e.z + Math.cos(e.rot) * 1.5, 2, [1, .85, .3], .35)); return true; },
    blink(m, s, dP) {
      const P = Player; let best = null;
      for (let k = 0; k < 8; k++) { const a = Math.random() * TAU, d = 6.5 + Math.random() * 2.5; const x = P.x + Math.sin(a) * d, z = P.z + Math.cos(a) * d; if (Col.blocked(x, z, .6) || dist2(x, z, m.home.x, m.home.z) > (m.home.r + 10) ** 2) continue; best = [x, z]; break; }
      if (!best) return false; Particles.burst(m.x, 1.6, m.z, 20, [.4, 1, .85], 3, .5, .35, 1); m.x = best[0]; m.z = best[1]; World.clampBounds(m); Particles.burst(m.x, 1.6, m.z, 20, [.4, 1, .85], 3, .5, .35, 1); Audio.tone(1500, .2, 'sine', .04, .3); m.atkCD = .6; return true;
    },
    charm(m, s) { const P = Player; GhostAI.cast(m, 'charm', 1.15, 'pray'); GSound.charm(); GhostAI.circle(m, P.x, P.z, 2.6, 1.05, [1, .5, .8, .5], .6, { pull: [m.x, m.z, 2.4], buff: ['slowed', 2.5] }, e => { for (let i = 0; i < 16; i++) Particles.add(e.x, 1.4, e.z, { c: [1, .55, .85], s: .4, life: .7, vx: (m.x - e.x) * 1.6, vz: (m.z - e.z) * 1.6, vy: rand(0, 1) }); }); return true; },
    leap(m, s) { const P = Player; GSound.call(); const tx = P.x + (P.vx || 0) * .3, tz = P.z + (P.vz || 0) * .3; GhostAI.jump(m, tx, tz, .3, .6, 3.2, () => { Fx.shock(m.x, m.z, s.r, [.6, .3, .3], .4); GSound.thud(); Particles.burst(m.x, .3, m.z, 16, [.4, .35, .3], 4, .5, .4, 2); }); GhostAI.circle(m, m.jump.x1, m.jump.z1, s.r, .9, null, 1.4, { buff: ['poison', 6] }); return true; },
    dive(m, s) { const P = Player; GSound.hiss(); GhostAI.jump(m, P.x, P.z, .25, .75, 2.4, () => { Fx.shock(m.x, m.z, s.r, [.3, 1, .45], .45); Particles.burst(m.x, .4, m.z, 24, [.3, 1, .45], 4, .6, .4, 2); }, true); GhostAI.circle(m, m.jump.x1, m.jump.z1, s.r, 1.0, [.4, 1, .5, .5], 1.5, { heal: .5 }); return true; },
    pound(m, s) { const P = Player; GhostAI.jump(m, P.x, P.z, .2, .95, 2.8, () => { Fx.shock(m.x, m.z, s.r, [1, .8, .4], .5); Fx.shock(m.x, m.z, s.r * .5, [1, 1, .8], .35); Game.shake(.35); GSound.thud(); Particles.burst(m.x, .3, m.z, 26, [.8, .7, .5], 5, .6, .45, 3); }, true); GhostAI.circle(m, m.jump.x1, m.jump.z1, s.r, 1.15, null, 1.6, { buff: ['bound', .9] }); return true; },
    pounce(m, s) { const P = Player; Audio.tone(300, .2, 'sawtooth', .05, 1.5); GhostAI.jump(m, P.x - Math.sin(Math.atan2(P.x - m.x, P.z - m.z)) * 1.4, P.z - Math.cos(Math.atan2(P.x - m.x, P.z - m.z)) * 1.4, .2, .45, 2, () => { for (let i = 0; i < 2; i++) setTimeout(() => { if (m.dead) return; GhostAI.cone(m, s.r, .8, .12, [1, .4, .3, .55], .8, i ? { buff: ['poison', 4] } : {}, e => Fx.arc(m.x, 1.2, m.z, e.rot, i ? .5 : -.5, 2.4, [1, .3, .25], .22)); }, i * 260); }); return true; },
    hands(m, s) { const P = Player; GhostAI.cast(m, 'hands', 1.2, 'cast'); GSound.splash(); GhostAI.circle(m, P.x, P.z, s.r, 1.1, [.35, .75, 1, .55], 1.0, { buff: ['bound', 1.4] }, e => { for (let i = 0; i < 5; i++) GhostAI.hands.push({ x: e.x + Math.cos(i * 1.26) * e.r * .55, z: e.z + Math.sin(i * 1.26) * e.r * .55, t: 0, dur: 1.2, a: i * 1.26 + 1.5 }); Particles.burst(e.x, .2, e.z, 30, [.4, .7, .9], 4, .7, .4, 4); GSound.splash(); }); return true; },
    hair(m, s) { GhostAI.cast(m, 'hair', 1.0, 'cast'); Audio.tone(200, .6, 'sawtooth', .04, .5); GhostAI.cone(m, s.r, .55, .85, [.6, .2, .35, .55], 1.3, { buff: ['bound', 1.6] }, e => { for (let i = 0; i < 40; i++) { const a = e.rot + rand(-e.ang, e.ang), d = rand(.5, e.r); Particles.add(m.x + Math.sin(a) * d, rand(.6, 2), m.z + Math.cos(a) * d, { c: [.15, .08, .12], s: .5, life: .7, vy: .3 }); } Fx.arc(m.x, 1.3, m.z, e.rot, 0, e.r * .8, [.7, .2, .4], .3); }); return true; },
    dance(m, s) { GhostAI.cast(m, 'dance', 1.15, 'spin'); [523, 587, 659, 784].forEach((f, i) => Audio.tone(f, .25, 'triangle', .04, 1, i * .15)); GhostAI.circle(m, m.x, m.z, s.r, 1.0, [.75, .45, 1, .55], 1.2, { buff: ['curse', 6] }, e => { Fx.shock(e.x, e.z, e.r, [.85, .6, 1], .5); for (let i = 0; i < 36; i++) { const a = i / 36 * TAU; Particles.add(e.x + Math.cos(a) * e.r * .8, 1, e.z + Math.sin(a) * e.r * .8, { c: i % 2 ? [1, .85, .4] : [.8, .5, 1], s: .4, life: .8, vx: -Math.sin(a) * 3, vz: Math.cos(a) * 3, vy: 1 }); } }); return true; },
    stench(m, s) { const P = Player; GhostAI.cast(m, 'stench', .9, 'cast'); Audio.noise(.6, .08, 500); Effects.add({ tele: true, kind: 'circle', x: P.x, z: P.z, r: s.r, dur: .8, col: [.5, .85, .25, .5], onFire: e => { GhostAI.hazards.push({ x: e.x, z: e.z, r: e.r, t: 0, dur: 5, tick: .1, m }); } }); return true; },
    breath(m, s) { GhostAI.cast(m, 'breath', .95, 'bash'); Audio.noise(.7, .1, 1200); GhostAI.cone(m, s.r, .6, .8, [.6, .9, 1, .5], 1.2, { mp: 18, buff: ['slowed', 3] }, e => { for (let i = 0; i < 30; i++) { const a = e.rot + rand(-e.ang, e.ang); Particles.add(m.x, 1.8, m.z, { c: [.75, .95, 1], s: .5, life: .6, vx: Math.sin(a) * 7, vz: Math.cos(a) * 7, vy: rand(-.5, .5), drag: 2 }); } }); return true; },
    devour(m, s) { GhostAI.cast(m, 'devour', .85, 'dash'); GSound.laugh(); GhostAI.cone(m, s.r, .5, .6, [.9, .15, .15, .55], 1.8, { heal: .5, buff: ['poison', 5] }, e => { const r = Col.resolve(m.x + Math.sin(e.rot) * 2.4, m.z + Math.cos(e.rot) * 2.4, m.d.r * .8); m.x = r[0]; m.z = r[1]; Fx.arc(m.x, 1.3, m.z, e.rot, 0, 2, [.9, .2, .2], .25); }); return true; },
    headthrow(m, s) { const P = Player; GhostAI.cast(m, 'headthrow', 1.4, 'throw'); const tx = P.x, tz = P.z; m.headOut = { x0: m.x, z0: m.z, x1: tx, z1: tz, t: 0, dur: 1.25, back: 0 }; GhostAI.heads.push(m); GhostAI.circle(m, tx, tz, s.r, 1.25, null, 1.5, { buff: ['bound', .6] }, e => { Fx.shock(e.x, e.z, e.r, [1, .4, .3], .4); Game.shake(.25); GSound.thud(); Particles.burst(e.x, .3, e.z, 18, [.7, .2, .15], 4, .5, .35, 2); }); GSound.laugh(); return true; },
    roar(m, s) { GhostAI.cast(m, 'roar', 1.1); Audio.tone(110, .9, 'sawtooth', .12, .6); Audio.noise(.8, .25, 600); GhostAI.circle(m, m.x, m.z, s.r, .9, [1, .6, .2, .5], 1.0, { buff: ['curse', 6, 'slowed', 3] }, e => { for (let i = 0; i < 3; i++) setTimeout(() => Fx.shock(e.x, e.z, e.r * (.4 + i * .3), [1, .7, .3], .45), i * 80); Game.shake(.35); }); return true; },
    slam(m, s) { GhostAI.cast(m, 'slam', 1.3, 'slam'); GhostAI.circle(m, m.x, m.z, s.r, 1.1, [1, .8, .3, .55], 1.6, {}, e => { Fx.shock(e.x, e.z, e.r, [1, .85, .3], .5); Fx.pillar(e.x, e.z, 1, 4, [1, .85, .3], .4); Game.shake(.45); GSound.thud(); }); return true; },
    goldrain(m, s) { const P = Player; GhostAI.cast(m, 'goldrain', 1.1, 'pray'); GSound.coin(); for (let i = 0; i < 5; i++) { const x = P.x + (i ? rand(-5, 5) : 0), z = P.z + (i ? rand(-5, 5) : 0); GhostAI.circle(m, x, z, s.r, 1.3 + i * .1, [1, .85, .25, .5], .9, {}, e => { for (let k = 0; k < 14; k++) Particles.add(e.x + rand(-1, 1), 6 + rand(0, 2), e.z + rand(-1, 1), { c: [1, .85, .3], s: .35, life: .45, vy: -14 }); Particles.burst(e.x, .3, e.z, 10, [1, .8, .3], 3, .4, .3, 2); GSound.coin(); }); } return true; },
    summon(m, s) {
      GhostAI.cast(m, 'summon', 1.0, 'pray'); UI.toast(`${m.d.name} เรียกงูจงอางเฝ้าทรัพย์!`, 'boss'); GSound.hiss();
      for (let i = 0; i < 2; i++) { const a = m.face + (i ? 1 : -1) * 1.2, r = Col.resolve(m.x + Math.sin(a) * 3, m.z + Math.cos(a) * 3, .8); const n = makeMonster('ngu', r[0], r[1], { x: m.home.x, z: m.home.z, r: 14 }); n.aggro = true; n.state = 'chase'; n.summon = true; n.zone = 'temple'; Monsters.list.push(n); Particles.burst(r[0], .5, r[1], 24, [.5, .7, .3], 4, .6, .5, 2); }
      return true;
    }
  },
  // ---- global per-frame update (projectiles, hazards, displacement, bestiary sightings) ----
  tick(dt) {
    const P = Player, S = Save.d;
    if (P.kb) { const k = P.kb; k.t += dt; const u = Math.min(1, k.t / k.dur); const r = Col.resolve(lerp(k.x0, k.x1, u), lerp(k.z0, k.z1, u), .55); P.x = r[0]; P.z = r[1]; World.clampBounds(P); if (u >= 1) P.kb = null; }
    for (let i = this.proj.length - 1; i >= 0; i--) {
      const p = this.proj[i]; p.life -= dt;
      if ((P.zone === 'temple' || P.zone === 'amazon') && !P.dead) { const a = Math.atan2(P.x - p.x, P.z - p.z); p.dir += clamp(angWrap(a - p.dir), -dt * .9, dt * .9); }
      p.x += Math.sin(p.dir) * p.sp * dt; p.z += Math.cos(p.dir) * p.sp * dt;
      if (Math.random() < .8) Particles.add(p.x, p.y, p.z, { c: p.col, s: .4, life: .35, vy: .5 });
      let done = p.life <= 0 || Col.blocked(p.x, p.z, .1);
      if (!done && !P.dead && (P.zone === 'temple' || P.zone === 'amazon') && dist2(p.x, p.z, P.x, P.z) < .8) { Combat.hitPlayer(p.dmg, p.src); Particles.burst(p.x, p.y, p.z, 14, p.col, 3, .4, .35, 2); done = true; }
      if (done) this.proj.splice(i, 1);
    }
    for (let i = this.hazards.length - 1; i >= 0; i--) {
      const h = this.hazards[i]; h.t += dt; h.tick -= dt;
      if (Math.random() < dt * 30) { const a = Math.random() * TAU, d = Math.sqrt(Math.random()) * h.r; Particles.add(h.x + Math.cos(a) * d, .2 + Math.random() * .8, h.z + Math.sin(a) * d, { c: [.35, .6, .15], s: 1.1, life: 1.3, vy: .3, a: .6 }); }
      if (h.tick <= 0) { h.tick = .8; if (!h.m.dead && this.near(h.x, h.z, h.r)) this.apply(h.m, .35, { buff: ['poison', 3] }); }
      if (h.t >= h.dur) this.hazards.splice(i, 1);
    }
    for (let i = this.hands.length - 1; i >= 0; i--) { this.hands[i].t += dt; if (this.hands[i].t >= this.hands[i].dur) this.hands.splice(i, 1); }
    for (let i = this.heads.length - 1; i >= 0; i--) { const m = this.heads[i], h = m.headOut; if (!h) { this.heads.splice(i, 1); continue; } h.t += dt; if (m.dead || h.t > h.dur + .7) { m.headOut = null; this.heads.splice(i, 1); } }
    // bestiary sightings
    this.seenT -= dt;
    if (S && P.zone === 'temple' && this.seenT <= 0) {
      this.seenT = .5; S.ghostSeen = S.ghostSeen || {};
      for (const m of Monsters.list) { if (m.dead || m.zone !== 'temple' || !m.d.ghost || S.ghostSeen[m.type]) continue; if (dist2(m.x, m.z, P.x, P.z) < 18 * 18) { S.ghostSeen[m.type] = 1; UI.toast(`บันทึกลงตำราผีไทย: ${m.d.name}`, 'quest'); break; } }
    }
  },
  // drawn in the opaque pass
  draw(R) {
    const M = Game.tmpM, P = Player; if (P.zone !== 'temple' && P.zone !== 'amazon') return;
    for (const p of this.proj) { M4.compose(M, p.x, p.y, p.z, 0, Game.time * 4, 0, .7, .7, .7); R.drawMesh(Models.orb, M, [.2, .4, .35], [.35, .9, .75]); GhostDraw.glow(p.x, p.y, p.z, .9, [.05, .2, .17]); }
    for (const h of this.hands) { const u = h.t / h.dur, y = -1.3 + Math.sin(Math.min(1, u * 1.6) * Math.PI * .5) * 1.2 - smooth(.7, 1, u) * 1.2; M4.compose(M, h.x, y, h.z, (Math.sin(Game.time * 8 + h.a)) * .15, h.a, 0, 1, 1, 1); R.drawMesh(GM.hand, M, null, [.1, .2, .25]); }
    for (const m of this.heads) {
      const h = m.headOut; if (!h) continue; let x, y, z;
      if (h.t <= h.dur) { const u = h.t / h.dur; x = lerp(m.x, h.x1, u); z = lerp(m.z, h.z1, u); y = 1.4 + 5 * u * (1 - u) - u * 1.0; }
      else { const u = Math.min(1, (h.t - h.dur) / .7); x = lerp(h.x1, m.x, u); z = lerp(h.z1, m.z, u); y = .4 + u * 1.0 + 2.5 * u * (1 - u); }
      M4.compose(M, x, y, z, Game.time * 9, Game.time * 3, 0, 1.25, 1.25, 1.25); R.drawMesh(GM.flyHead, M, null, [.08, .03, .02]);
      if (Math.random() < .5) Particles.add(x, y, z, { c: [.7, .1, .1], s: .3, life: .5, vy: -1 });
    }
  },
  drawDecals(R) {
    for (const h of this.hazards) { const f = 1 - smooth(.7, 1, h.t / h.dur); R.drawDecal(h.x, .07, h.z, h.r, h.r, 0, 0, [.35, .7, .15, .55 * f]); R.drawDecal(h.x, .075, h.z, h.r, h.r, 0, 2, [.5, .85, .25, .7 * f], .97); }
  },
  reset() { this.proj = []; this.hazards = []; this.hands = []; this.heads = []; const P = Player; P.kb = null; }
};

/* ============================================================
   Mae Nak boss: long arm, wail, geysers, phrai, ethereal phases
   bound by three sai-sin posts (quiz at each post)
   ============================================================ */
const NakBoss = {
  cur: null, posts: [], cords: 0,
  initPosts() { this.posts = [-Math.PI / 2, Math.PI / 6, Math.PI * 5 / 6].map((a, i) => ({ i, x: NAK_ARENA.x + Math.cos(a) * 10.5, z: NAK_ARENA.z + Math.sin(a) * 10.5, zone: 'temple', bound: false, cd: 0, name: 'เสาสายสิญจน์' })); },
  inArena(P) { return P.zone === 'temple' && dist2(P.x, P.z, NAK_ARENA.x, NAK_ARENA.z) < NAK_ARENA.r * NAK_ARENA.r; },
  update(m, dt) {
    const P = Player; if (!this.posts.length) this.initPosts();
    m.chainT = (m.chainT || 0) + dt; for (const p of this.posts) p.cd = Math.max(0, p.cd - dt);
    if (!m.engaged) {
      m.face += angWrap(Math.PI / 2 - m.face) * Math.min(1, dt * 2); m.moving = false;
      if (m.wailT === undefined) m.wailT = 6; m.wailT -= dt; if (m.wailT <= 0) { m.wailT = 9 + Math.random() * 6; if (P.zone === 'temple' && dist2(P.x, P.z, m.x, m.z) < 40 * 40) GSound.wail(); }
      if (this.inArena(P) && !P.dead && Game.safeT <= 0) this.engage(m); return;
    }
    if (P.dead || P.zone !== 'temple' || dist2(P.x, P.z, NAK_ARENA.x, NAK_ARENA.z) > (NAK_ARENA.r + 9) ** 2) { this.disengage(m); return; }
    if (m.stunT > 0) { m.stunT -= dt; if (m.stunT <= 0) UI.toast('แม่นากหลุดจากการสะกดแล้ว!', 'boss'); return; }
    // phases -> ethereal
    const ratio = m.hp / m.max;
    if (!m.ethereal && ((m.phase === 0 && ratio <= .66) || (m.phase === 1 && ratio <= .33))) { m.phase++; this.goEthereal(m); }
    // movement inside arena
    const dP = Math.sqrt(dist2(m.x, m.z, P.x, P.z));
    if (m.grab) { m.grab.t += dt; if (m.grab.t > m.grab.dur) m.grab = null; }
    if (!m.cast && dP > 5.5) { const s = m.d.spd * (m.slow > 0 ? .5 : 1) * (m.ethereal ? 1.25 : 1); m.face = Math.atan2(P.x - m.x, P.z - m.z); let nx = m.x + Math.sin(m.face) * s * dt, nz = m.z + Math.cos(m.face) * s * dt; const dc = Math.hypot(nx - NAK_ARENA.x, nz - NAK_ARENA.z); if (dc > NAK_ARENA.r - 2) { nx = NAK_ARENA.x + (nx - NAK_ARENA.x) / dc * (NAK_ARENA.r - 2); nz = NAK_ARENA.z + (nz - NAK_ARENA.z) / dc * (NAK_ARENA.r - 2); } [m.x, m.z] = Col.resolve(nx, nz, 1.2); m.moving = true; }
    else { m.moving = false; m.face += angWrap(Math.atan2(P.x - m.x, P.z - m.z) - m.face) * Math.min(1, dt * 3); }
    if (m.cast) { m.cast.t -= dt; if (m.cast.t <= 0) m.cast = null; return; }
    m.atkT -= dt;
    if (m.atkT <= 0) {
      const sp = m.ethereal ? .75 : m.phase >= 2 ? .82 : 1, r = Math.random();
      if (dP < 5 && r < .4) this.swipe(m); else if (r < .45) this.grabAtk(m); else if (r < .72) this.wail(m); else this.geyser(m);
      m.atkT = 2.9 * sp + Math.random() * .7;
    }
  },
  engage(m) {
    m.engaged = true; this.cur = m; m.atkT = 2; m.phase = m.phase || 0; Cam.dist = Math.max(Cam.dist, 21); UI.bossBar(true, 'แม่นาก ผีตายทั้งกลม · Lv.15'); UI.toast('แม่นากหันมาทางคุณ... "พี่มากกลับมาแล้วหรือ..."', 'boss'); GSound.wail(); Audio.sfx('boss');
  },
  disengage(m) {
    if (!m.engaged) return; m.engaged = false; this.cur = null; UI.bossBar(false); m.hp = Math.min(m.max, m.hp + m.max * .5); m.ethereal = false; m.grab = null; m.cast = null; m.phase = Math.max(0, (m.hp / m.max > .66 ? 0 : m.hp / m.max > .33 ? 1 : 2));
    m.x = m.home.x; m.z = m.home.z; for (const p of this.posts) { p.bound = false; p.cd = 0; } GhostAI.reset();
  },
  reset(m) { Object.assign(m, { engaged: false, ethereal: false, phase: 0, atkT: 3, stunT: 0, grab: null, cast: null, x: m.home.x, z: m.home.z }); if (this.cur === m) this.cur = null; for (const p of this.posts) { p.bound = false; p.cd = 0; } },
  goEthereal(m) {
    m.ethereal = true; for (const p of this.posts) { p.bound = false; p.cd = 0; }
    UI.banner('แม่นากกลายร่างเป็นวิญญาณ!', 'fizzle'); UI.toast('อาวุธทำร้ายไม่ได้! วิ่งไปผูกสายสิญจน์ที่เสาทั้ง 3 ต้น (กด F ที่เสา)', 'boss'); GSound.wail(); Audio.sfx('barrier');
    for (let i = 0; i < 2; i++) { const a = -.4 + i * .8, x = NAK_ARENA.x + 11 + Math.cos(a) * 2, z = NAK_ARENA.z + Math.sin(a) * 6; const n = makeMonster('phrai', x, z, { x: NAK_ARENA.x, z: NAK_ARENA.z, r: 14 }); n.aggro = true; n.state = 'chase'; n.summon = true; n.zone = 'temple'; Monsters.list.push(n); Particles.burst(x, .3, z, 30, [.4, .7, .9], 4, .7, .4, 4); }
    Particles.burst(m.x, 2.5, m.z, 80, [.6, .85, 1], 8, 1, .6, 4);
  },
  bind(p) {
    const m = this.cur; if (!m || !m.ethereal || p.bound) return;
    if (p.cd > 0) { UI.toast(`สายสิญจน์ยังพันกันอยู่ รออีก ${Math.ceil(p.cd)} วินาที`, 'warn'); return; }
    Quiz.run({
      title: 'ผูกสายสิญจน์ ' + (this.posts.filter(q => q.bound).length + 1) + '/3', sub: 'ตอบถูกเพื่อผูกสายสิญจน์ที่เสาต้นนี้ ถ้าผิดต้องรอ 5 วินาที', count: 1, time: Settings.d.qtime + 3, mode: 'chain',
      onEnd: r => {
        if (r.correct) {
          p.bound = true; Fx.pillar(p.x, p.z, .6, 6, [1, 1, .9], .7); Particles.burst(p.x, 2.2, p.z, 30, [1, 1, .9], 4, .7, .35, 3); Audio.sfx('barrier');
          const n = this.posts.filter(q => q.bound).length;
          if (n >= 3) { m.ethereal = false; m.stunT = 7; m.cast = null; m.grab = null; UI.banner('สายสิญจน์สะกดแม่นากไว้ได้!', 'crit'); UI.toast('แม่นากถูกสะกด 7 วินาที รับความเสียหาย ×1.5', 'quest'); Game.shake(.5); Particles.burst(m.x, 3, m.z, 120, [1, 1, .85], 9, 1.2, .6, 5); }
          else UI.toast(`ผูกสายสิญจน์แล้ว ${n}/3 เสา`, 'quest');
        } else { p.cd = 5; UI.toast('สายสิญจน์หลุด! ลองใหม่ใน 5 วินาที', 'warn'); }
      }
    });
  },
  // attacks
  swipe(m) { m.cast = { t: .8 }; if (m.rig) m.rig.play('slash'); GhostAI.cone(m, 6.2, .95, .7, null, 1.35, {}, e => { Fx.arc(m.x, 2, m.z, e.rot, -.4, 5, [.6, .85, 1], .3); Game.shake(.25); }); },
  grabAtk(m) {
    const P = Player, rot = Math.atan2(P.x - m.x, P.z - m.z); m.face = rot; m.cast = { t: 1.45 }; if (m.rig) m.rig.play('cast', .7);
    const len = 22; GhostAI.rect(m, m.x, m.z, rot, len, 1.1, 1.15, [.6, .8, 1, .5], 1.65, { pull: [m.x + Math.sin(rot) * 2.6, m.z + Math.cos(rot) * 2.6, 0], buff: ['bound', .9] }, e => { m.grab = { rot: e.rot, len: e.len, t: 0, dur: .55 }; Audio.tone(240, .4, 'sawtooth', .06, 2.2); });
    UI.floatText(m.x, 6.5, m.z, 'แขนยาว!', 'immune');
  },
  wail(m) { m.cast = { t: 1.6 }; if (m.rig) m.rig.play('pray', .8); GSound.wail(); GhostAI.circle(m, m.x, m.z, 9, 1.4, [.55, .45, 1, .5], 1.15, { buff: ['curse', 6, 'slowed', 3] }, e => { for (let i = 0; i < 4; i++) setTimeout(() => Fx.shock(e.x, e.z, e.r * (.3 + i * .23), [.7, .6, 1], .5), i * 80); Game.shake(.3); }); },
  geyser(m) {
    const P = Player; m.cast = { t: 1.2 }; if (m.rig) m.rig.play('slam', .8); GSound.splash();
    const n = m.phase >= 2 ? 7 : 5;
    for (let i = 0; i < n; i++) { const x = P.x + (i ? rand(-6, 6) : (P.vx || 0) * .5), z = P.z + (i ? rand(-6, 6) : (P.vz || 0) * .5); GhostAI.circle(m, x, z, 2.5, 1.3 + i * .08, [.35, .7, 1, .5], 1.0, { buff: ['slowed', 2] }, e => { for (let k = 0; k < 26; k++) Particles.add(e.x + rand(-.6, .6), .2, e.z + rand(-.6, .6), { c: [.5, .8, 1], s: .5, life: .9, vy: rand(5, 10), grav: -14 }); GSound.splash(); }); }
  },
  defeated(m) {
    const S = Save.d; m.engaged = false; m.ethereal = false; m.stunT = 0; m.grab = null; this.cur = null; UI.bossBar(false); GhostAI.reset();
    Monsters.list.forEach(o => { if (o.summon && o.zone === 'temple') o.dead = true; });
    Fx.pillar(m.x, m.z, 2.4, 14, [.85, .95, 1], 2.2); Fx.shock(m.x, m.z, 10, [.8, .9, 1], 1); for (let i = 0; i < 90; i++) Particles.add(m.x + rand(-1.5, 1.5), rand(0, 3), m.z + rand(-1.5, 1.5), { c: [.85, .95, 1], s: .45, life: 2.2, vy: rand(2, 5) });
    UI.banner('แม่นากได้ไปสู่สุคติแล้ว', 'level'); Game.shake(.6); Audio.sfx('level');
    const first = !S.flags.nak; S.flags.nak = (S.flags.nak || 0) + 1;
    if (first) { Gems.add(60, 'ส่งวิญญาณแม่นากครั้งแรก'); UI.toast('ได้รับเพชร 60 เม็ด', 'rare'); Game.addItem('r_nakpin', 1); }
    else if (Math.random() < .4) Game.addItem('r_nakpin', 1);
    if (Math.random() < (first ? .6 : .35)) Game.addItem('w_exo', 1);
    Game.addItem('holy', 3); Game.addItem('m_goldjar', 1);
    for (const p of this.posts) { p.bound = false; p.cd = 0; }
  },
  // drawing: long arm, ethereal glow, posts & cords
  drawExtra(R, m, rig, s, t, tint, fl) {
    if (m.ethereal) { GhostDraw.glow(m.x, 2.6, m.z, 3.2, [.08, .14, .2]); if (Math.random() < .5) Particles.add(m.x + rand(-1.2, 1.2), rand(.5, 4.5), m.z + rand(-1.2, 1.2), { c: [.6, .85, 1], s: .45, life: 1.1, vy: 1.2 }); }
    if (m.stunT > 0) for (const p of this.posts) this.cord(R, p.x, 2.3, p.z, m.x, 2.6, m.z, [1, 1, .85], .5 + Math.sin(t * 12) * .1);
    if (m.grab) {
      const g = m.grab, u = g.t / g.dur, ext = u < .35 ? u / .35 : u < .55 ? 1 : 1 - (u - .55) / .45; const L = g.len * Math.max(.05, ext);
      const sh = rig.bonePos('shR'); const ex = sh[0] + Math.sin(g.rot) * L, ez = sh[2] + Math.cos(g.rot) * L, ey = .8;
      this.cord(R, sh[0], sh[1], sh[2], ex, ey, ez, null, 1.6, GHC.blue); M4.compose(Game.tmpM, ex, ey, ez, Math.PI / 2 - .2, g.rot, 0, .55, .55, .55); R.drawMesh(GM.hand, Game.tmpM, null, [.1, .14, .18]);
    }
  },
  cord(R, x0, y0, z0, x1, y1, z1, emis, w = .4, tint) {
    const dx = x1 - x0, dy = y1 - y0, dz = z1 - z0, L = Math.hypot(dx, dy, dz) || .01;
    M4.compose(Game.tmpM, x0, y0, z0, Math.acos(clamp(dy / L, -1, 1)), Math.atan2(dx, dz), 0, w, L, w); R.drawMesh(GM.armExt, Game.tmpM, tint || [1, 1, 1], emis || [.15, .2, .25]);
  },
  draw(R) {
    if (Player.zone !== 'temple') return; if (!this.posts.length) this.initPosts(); const M = Game.tmpM, m = this.cur, t = Game.time;
    for (const p of this.posts) {
      const act = m && m.ethereal; M4.compose(M, p.x, 0, p.z, 0, p.i * 2, 0, 1, 1, 1);
      R.drawMesh(GM.post, M, null, p.bound ? [.6, .5, .15] : act ? [.25 + Math.sin(t * 5) * .1, .3, .35] : [.02, .02, .02]);
      if (act && !p.bound) { GhostDraw.glow(p.x, 1.8, p.z, 1.5, [.12, .14, .16]); if (Math.random() < .2) Particles.add(p.x, 2.4, p.z, { c: [1, 1, .9], s: .3, life: .8, vy: 1 }); }
      if (p.bound && m && m.ethereal) this.cord(R, p.x, 2.3, p.z, m.x, 2.6, m.z, [.8, .75, .5], .45);
    }
  }
};

