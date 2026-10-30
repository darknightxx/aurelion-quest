
/* ============================================================
   Amazon zone integration: humid green environment, east gate
   portal, cross-zone navigation, swimmers stay in the water,
   coloured projectiles, ambient particles (fireflies, pollen,
   falling leaves), debuffs, music key.
   ============================================================ */
Object.assign(MON_DEBUFF, { dartfrog: ['poison', .3, 5], spider: ['slowed', .25, 3], ana: ['poison', .25, 5], plant: ['slowed', .2, 3], ogresham: ['curse', .25, 5] });
MONSTERS.dartfrog.shotCol = [.4, 1, .3]; MONSTERS.ogresham.shotCol = [.8, .4, 1];
Object.assign(Nav.ITEM_MON, { m_tooth: 'piranha', m_venom: 'dartfrog', m_jfur: 'jaguar', m_silk: 'spider', m_scale: 'ana', m_seed: 'plant', m_hide: 'caiman', m_mask: 'ogre', m_feather: 'ogresham' });
MusicSys.SCALES.amazon = [0, 3, 5, 7, 10, 12, 15]; MusicSys.ROOT.amazon = 174.6;
const AmazonGfx = {
  drawOpaque(R) {
    R.drawMesh(World.meshes.amazon, null);
    const p = .7 + Math.sin(Game.time * 2.2) * .2; R.drawMesh(World.meshes.aglow, null, null, [.45 * p, .55 * p, .5 * p]);
  }
};
{
  const ose = Game.setEnv.bind(Game);
  Game.setEnv = function (zone) {
    if (zone !== 'amazon') return ose(zone);
    const e = this.R.env;
    Object.assign(e, { sun: [.35, .85, .3], sunC: [.62, .66, .46], sky: [.38, .5, .4], gnd: [.16, .2, .12], fogC: [.42, .54, .44], fog: [26, 130], top: [.36, .56, .5], bot: [.62, .74, .62], sprLight: .95, cloud: .6 });
    const l = Math.hypot(...e.sun); e.sun = e.sun.map(v => v / l);
  };
  const oct = Game.checkTriggers.bind(Game);
  Game.checkTriggers = function (dt) {
    const P = Player, S = Save.d;
    if (P.zone === 'world' && P.x > 138 && Math.abs(P.z - 70) < 5) {
      if (S.level >= AMAZON_LV) { if (P.x > 144.2) { this.teleport(AX, 104, 'ป่าอเมซอนมรณะ'); return; } }
      else if (this.msgT <= 0) { this.msgT = 4; UI.toast(`ป่าดิบข้างหน้าอันตรายมาก ต้องมีเลเวล ${AMAZON_LV} ขึ้นไปจึงจะเข้าไปได้`, 'warn'); }
    }
    if (P.zone === 'amazon') {
      if (P.z > 107 && Math.abs(P.x - AX) < 6) { this.teleport(137, 70, 'ถนนสายตะวันออก'); return; }
      if (!S.stats.amazonVisit) { S.stats.amazonVisit = 1; S.warps.w_amazon = true; setTimeout(() => UI.toast('ป่าอเมซอนมรณะ… ทุกสิ่งที่นี่อยากกินคุณ! คุยกับ ดร.มาร์โก้ ที่ค่ายนักสำรวจ', 'boss'), 1500); }
    }
    oct(dt);
  };
  const ox = Nav.exitTo; Nav.exitTo = function (from, to) {
    const S = Save.d;
    if (from === 'amazon') return { x: AX, z: 109, dir: [0, 1] };
    if (to === 'amazon' && from === 'world') { if (S.level < AMAZON_LV) { UI.toast(`ต้องมีเลเวล ${AMAZON_LV} ขึ้นไปจึงจะเดินทางไปป่าอเมซอนได้`, 'warn'); return null; } return { x: 141, z: 70, dir: [1, 0] }; }
    if (to === 'amazon') return ox.call(this, from, 'world');
    return ox.call(this, from, to);
  };
  const onb = Nav.build.bind(Nav);
  Nav.build = function () {
    onb();
    const x0 = AX - 100, x1 = AX + 100, z0 = -102, z1 = 110, S = 2, w = Math.round((x1 - x0) / S) + 1, h = Math.round((z1 - z0) / S) + 1, g = new Uint8Array(w * h);
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) g[j * w + i] = Col.blocked(x0 + i * S, z0 + j * S, .8) ? 1 : 0;
    this.grids.amazon = { x0, z0, S, w, h, g };
  };
  // coloured enemy shots (frogs spit green poison, shamans throw purple curses)
  const osh = GhostAI.shoot.bind(GhostAI); GhostAI.shoot = function (m, P) { osh(m, P); const p = this.proj[this.proj.length - 1]; if (p && m.d.shotCol) p.col = m.d.shotCol; };
  // swimmers (piranhas) stay in deep water
  const omu = Monsters.update.bind(Monsters);
  Monsters.update = function (dt) {
    omu(dt); if (Player.zone !== 'amazon') return;
    for (const m of this.list) { if (m.dead || !m.d.swim || m.zone !== 'amazon') continue; if (amazonHeight(m.x - AX, m.z) > -.32) { const dx = m.home.x - m.x, dz = m.home.z - m.z, d = Math.hypot(dx, dz) || 1; m.x += dx / d * Math.min(d, 6 * dt); m.z += dz / d * Math.min(d, 6 * dt); } }
  };
  // ambience particles
  const ou = Game.update.bind(Game);
  Game.update = function (dt) {
    ou(dt); const P = Player; if (!this.started || this.paused || P.zone !== 'amazon') return;
    if (Math.random() < dt * 14) { const a = Math.random() * TAU, r = 4 + Math.random() * 18; Particles.add(P.x + Math.cos(a) * r, .4 + Math.random() * 2.5, P.z + Math.sin(a) * r, { c: Math.random() < .5 ? [.8, 1, .4] : [1, .95, .5], s: .22, life: 2.2, vy: .15, vx: rand(-.3, .3), vz: rand(-.3, .3) }); }
    if (Math.random() < dt * 5) { const a = Math.random() * TAU, r = 3 + Math.random() * 14; Particles.add(P.x + Math.cos(a) * r, 7 + Math.random() * 3, P.z + Math.sin(a) * r, { c: [.35, .6, .25], s: .3, life: 4, vy: -1.4, vx: rand(-.4, .4), grav: 0 }); }
    for (const f of World.fires) if (f.zone === 'amazon' && dist2(f.x, f.z, P.x, P.z) < 900 && Math.random() < dt * 30 * f.s) Particles.add(f.x + rand(-.4, .4) * f.s, .3, f.z + rand(-.4, .4) * f.s, { c: [1, .5 + Math.random() * .35, .15], s: .5 * f.s + .2, life: .7, vy: 2.2 });
  };
}
