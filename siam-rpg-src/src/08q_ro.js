/* ============================================================
   RO-style presentation: casting circles, hit sparks, level-up
   column, skill shout, RO click/hit sounds
   ============================================================ */
const RoFx = {
  casts: [], marks: [],
  cast(x, z, col, dur) { this.casts.push({ x, z, col, t: 0, dur }); },
  update(dt) { for (const L of [this.casts, this.marks]) for (let i = L.length - 1; i >= 0; i--) { L[i].t += dt; if (L[i].t > L[i].dur) L.splice(i, 1); } },
  decals(R) {
    for (const c of this.casts) {
      const u = c.t / c.dur, a = u < .15 ? u / .15 : u > .85 ? (1 - u) / .15 : 1, r = 1.5 + Math.min(1, u * 4) * .4;
      R.drawDecal(c.x, .07, c.z, r, r, Game.time * 1.4, 4, [c.col[0], c.col[1], c.col[2], .95 * a], 0);
      R.drawDecal(c.x, .065, c.z, r * .78, r * .78, -Game.time * 2, 4, [1, 1, 1, .7 * a], 0);
      R.drawDecal(c.x, .06, c.z, r * 1.05, r * 1.05, 0, 0, [c.col[0], c.col[1], c.col[2], .35 * a]);
    }
    for (const m of this.marks) { const u = m.t / m.dur; R.drawDecal(m.x, .07, m.z, .5 + u * .4, .5 + u * .4, 0, 2, [.4, 1, .4, 1 - u], u); }
  },
  hit(x, y, z, crit) {
    const n = crit ? 14 : 8; for (let i = 0; i < n; i++) { const a = Math.random() * TAU, v = rand(3, crit ? 8 : 5.5); Particles.add(x, y, z, { c: crit ? [1, .85, .3] : [1, 1, .9], s: crit ? .38 : .28, life: .22, vx: Math.cos(a) * v, vy: Math.sin(a) * v * .7 + 1, vz: Math.sin(a) * v * .4 }); }
    Fx.glow(x, y, z, crit ? 1.1 : .7, crit ? [1, .7, .2] : [1, 1, .85], .12);
  },
  levelUp(x, z) {
    Fx.pillar(x, z, 1.1, 9, [1, .9, .45], 1.4); Fx.pillar(x, z, .6, 11, [1, 1, .85], 1.1); Fx.shock(x, z, 3.2, [1, .85, .35], .9);
    for (let i = 0; i < 60; i++) setTimeout(() => { const a = Math.random() * TAU, r = rand(.3, 1.3); Particles.add(x + Math.cos(a) * r, rand(.2, 1), z + Math.sin(a) * r, { c: pick([[1, .9, .4], [1, 1, .8], [1, .75, .3]]), s: .35, life: 1.4, vy: rand(3, 6) }); }, i * 18);
  }
};
// RO click / hit / cast sounds (synthesised)
const RoSfx = {
  play(k) {
    if (!Audio.ctx || !Settings.d.sound) return;
    if (k === 'click') { Audio.tone(1400, .04, 'square', .03, .6); }
    else if (k === 'hit') { Audio.noise(.07, .09, 2400); Audio.tone(180, .07, 'triangle', .06, .5); }
    else if (k === 'crit') { Audio.noise(.12, .12, 3200); Audio.tone(240, .12, 'sawtooth', .06, .4); Audio.tone(900, .1, 'square', .03, 1.6, .03); }
    else if (k === 'cast') { [660, 880, 990].forEach((f, i) => Audio.tone(f, .18, 'sine', .035, 1.4, i * .07)); }
    else if (k === 'lvl') { [523, 659, 784, 1047].forEach((f, i) => Audio.tone(f, .32, 'triangle', .06, 1, i * .1)); }
  }
};
{
  // casting circle under the caster for magic / support skills
  const MAGIC = new Set(['cast', 'slam', 'pray', 'bowUp']);
  const oe = Skills.exec.bind(Skills);
  Skills.exec = function (slot, sk, tgt, mult, id) {
    const P = Player, clip = SKILL_ANIM[id]; if (MAGIC.has(clip)) { RoFx.cast(P.x, P.z, sk.col || [.5, .7, 1], ((CLIPS[clip] && CLIPS[clip].dur) || .7) + .25); RoSfx.play('cast'); }
    const r = oe(slot, sk, tgt, mult, id);
    if (sk.type === 'heal') { // RO Heal: soft light column + rising green sparkles
      Fx.pillar(P.x, P.z, .9, 4, [.55, 1, .6], .7); for (let i = 0; i < 40; i++) setTimeout(() => { const a = Math.random() * TAU, rr = rand(.2, .9); Particles.add(P.x + Math.cos(a) * rr, rand(.1, .8), P.z + Math.sin(a) * rr, { c: pick([[.5, 1, .55], [.85, 1, .85], [1, 1, 1]]), s: .3, life: 1, vy: rand(1.5, 3) }); }, i * 15);
    } else if (sk.type === 'buff' || sk.type === 'cleanse') { // RO blessing: spiralling sparkles around the body
      const c = sk.col || [1, .95, .6]; for (let i = 0; i < 36; i++) setTimeout(() => { const a = i * .5, rr = .8; Particles.add(P.x + Math.cos(a) * rr, .2 + i * .07, P.z + Math.sin(a) * rr, { c, s: .34, life: .7, vy: .6 }); }, i * 18);
      Fx.shock(P.x, P.z, 1.8, c, .5);
    }
    return r;
  };
  const odn = UI.dmgNum.bind(UI);
  UI.dmgNum = function (x, y, z, n, kind) { odn(x, y, z, n, kind); if (kind === 'hit' || kind === 'crit') { RoFx.hit(x, y - .3, z, kind === 'crit'); RoSfx.play(kind === 'crit' ? 'crit' : 'hit'); } };
  const oend = Renderer.prototype.endDecal;
  Renderer.prototype.endDecal = function () { if (this === Game.R) RoFx.decals(this); return oend.call(this); };
  const ou = Game.update.bind(Game);
  Game.update = function (dt) { ou(dt); if (this.started && !this.paused) RoFx.update(dt); };
  const ob = UI.banner.bind(UI);
  UI.banner = function (text, kind) { ob(text, kind); if (kind === 'level' && Game.started) { RoFx.levelUp(Player.x, Player.z); RoSfx.play('lvl'); } };
}
Settings.d.roPlates = Settings.d.roPlates === undefined ? 1 : Settings.d.roPlates;
Settings.d.sprites = Settings.d.sprites === undefined ? 1 : Settings.d.sprites;

