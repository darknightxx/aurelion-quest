/* ============================================================
   Skill VFX (additive meshes) and character voice
   ============================================================ */
const FxModels = {};
function buildFxModels(R) {
  const W = [1, 1, 1];
  // crescent slash arc in XZ plane, opening toward +z, radius 1
  let g = new Geo(70); g.jit = 0;
  const seg = 18;
  for (let i = 0; i < seg; i++) {
    const a0 = -1.2 + i / seg * 2.4, a1 = -1.2 + (i + 1) / seg * 2.4;
    const w0 = Math.sin((i / seg) * Math.PI) * .32 + .02, w1 = Math.sin(((i + 1) / seg) * Math.PI) * .32 + .02;
    const P = (a, r) => [Math.sin(a) * r, 0, Math.cos(a) * r];
    g.quad(P(a0, 1 - w0), P(a1, 1 - w1), P(a1, 1), P(a0, 1), W);
  }
  FxModels.arc = R.mesh(g);
  // flat ring, radius 1, width .12
  g = new Geo(71); g.jit = 0;
  for (let i = 0; i < 40; i++) { const a0 = i / 40 * TAU, a1 = (i + 1) / 40 * TAU; const P = (a, r) => [Math.cos(a) * r, 0, Math.sin(a) * r]; g.quad(P(a0, .86), P(a1, .86), P(a1, 1), P(a0, 1), W); }
  FxModels.ring = R.mesh(g);
  // open tall cylinder (light pillar), radius 1 height 1
  g = new Geo(72); g.jit = 0; g.cyl(0, 0, 0, 1, 1, 1, 16, W, null, true); FxModels.pillar = R.mesh(g);
  // tapered column (beam)
  g = new Geo(73); g.jit = 0; g.cyl(0, 0, 0, 1, .55, 1, 12, W, null, true); FxModels.beam = R.mesh(g);
  // ice spike
  g = new Geo(74); g.jit = .1; g.cyl(0, 0, 0, .35, 0, 1.6, 5, hexc('#bff4ff')); FxModels.spike = R.mesh(g);
  // meteor rock
  g = new Geo(75); g.jit = .2; g.rock(0, -.6, 0, 1.0, hexc('#5a3a2a')); g.at(0, 0, 0, 0, 1, 1, 1, Math.PI); g.rock(0, -.6, 0, .9, hexc('#4a2e22')); FxModels.meteor = R.mesh(g);
  // sphere glow
  g = new Geo(76); g.jit = 0; g.sphere(0, 0, 0, 1, W, 12, 8); FxModels.glow = R.mesh(g);
  // 4-point star (sparkle/shuriken flash)
  g = new Geo(77); g.jit = 0; for (let i = 0; i < 4; i++) { const a = i / 4 * TAU; g.tri([0, 0, 0], [Math.cos(a + .25) * .25, 0, Math.sin(a + .25) * .25], [Math.cos(a) * 1, 0, Math.sin(a) * 1], W); g.tri([0, 0, 0], [Math.cos(a) * 1, 0, Math.sin(a) * 1], [Math.cos(a - .25) * .25, 0, Math.sin(a - .25) * .25], W); }
  FxModels.star = R.mesh(g);
}

const Fx = {
  list: [], ghosts: [],
  add(o) { o.t = 0; this.list.push(o); return o; },
  arc(x, y, z, yaw, tilt, r, col, dur = .28) { return this.add({ k: 'arc', x, y, z, yaw, tilt, r, col, dur }); },
  shock(x, z, r, col, dur = .5, y = .08) { return this.add({ k: 'shock', x, y, z, r, col, dur }); },
  pillar(x, z, r, h, col, dur = .6) { return this.add({ k: 'pillar', x, z, r, h, col, dur }); },
  beam(x, z, r, h, col, dur = .5, delay = 0) { return this.add({ k: 'beam', x, z, r, h, col, dur, delay }); },
  spikes(x, z, r, n, dur = 1.1) { for (let i = 0; i < n; i++) { const a = i / n * TAU + Math.random() * .3, d = r * (.35 + Math.random() * .65); this.add({ k: 'spike', x: x + Math.cos(a) * d, z: z + Math.sin(a) * d, s: .6 + Math.random() * .7, rx: (Math.random() - .5) * .5, rz: (Math.random() - .5) * .5, dur, delay: d / r * .18 }); } },
  glow(x, y, z, r, col, dur = .35) { return this.add({ k: 'glow', x, y, z, r, col, dur }); },
  star(x, y, z, r, col, dur = .3) { return this.add({ k: 'star', x, y, z, r, col, dur, rot: Math.random() * TAU }); },
  meteor(x, z, delay, onImpact) { return this.add({ k: 'meteor', x, z, dur: .55, delay, onImpact, sx: x + 6, sy: 26, sz: z - 10 }); },
  arrows(x, z, r, n, dur = .5) { for (let i = 0; i < n; i++) { const a = Math.random() * TAU, d = Math.sqrt(Math.random()) * r; this.add({ k: 'arrow', x: x + Math.cos(a) * d, z: z + Math.sin(a) * d, dur, delay: Math.random() * .35 }); } },
  ghost(rig, parts, col, dur = .35) { if (!parts || rig.isGlb) return; this.ghosts.push({ mats: rig.world.map(m => Float32Array.from(m)), parts, col, t: 0, dur }); if (this.ghosts.length > 16) this.ghosts.shift(); },
  flash(col, a = .35) { const f = document.getElementById('skflash'); if (!f) return; f.style.background = `radial-gradient(circle, transparent 30%, rgba(${col.map(v => Math.round(v * 255)).join(',')},${a}))`; f.classList.remove('on'); void f.offsetWidth; f.classList.add('on'); },
  update(dt) {
    for (let i = this.list.length - 1; i >= 0; i--) {
      const o = this.list[i];
      if (o.delay > 0) { o.delay -= dt; continue; }
      o.t += dt;
      if (o.k === 'meteor') {
        const u = Math.min(1, o.t / o.dur);
        const x = lerp(o.sx, o.x, u), y = lerp(o.sy, 0, u), z = lerp(o.sz, o.z, u);
        for (let k = 0; k < 3; k++) Particles.add(x + rand(-.4, .4), y + rand(-.4, .4), z + rand(-.4, .4), { c: [1, .45 + Math.random() * .3, .1], s: 1.1, life: .45, vy: 1 });
        if (u >= 1 && !o.hit) { o.hit = true; o.onImpact && o.onImpact(); }
      }
      if (o.k === 'arrow' && o.t >= o.dur && !o.hit) { o.hit = true; Particles.burst(o.x, .2, o.z, 4, [1, .9, .6], 3, .3, .25, 2); }
      if (o.t >= o.dur + (o.k === 'spike' ? .3 : 0)) this.list.splice(i, 1);
    }
    for (let i = this.ghosts.length - 1; i >= 0; i--) { this.ghosts[i].t += dt; if (this.ghosts[i].t >= this.ghosts[i].dur) this.ghosts.splice(i, 1); }
  },
  // solid (lit) fx like ice spikes and meteor
  drawSolid(R) {
    const M = Game.tmpM;
    for (const o of this.list) {
      if (o.delay > 0) continue; const u = o.t / o.dur;
      if (o.k === 'spike') { const grow = Math.min(1, o.t / .12), sink = Math.max(0, (o.t - o.dur) / .3); const s = o.s * grow * (1 - sink); M4.compose(M, o.x, -.1 - sink * 1.2, o.z, o.rx, 0, o.rz, s, s, s); R.drawMesh(FxModels.spike, M, [.7, .9, 1], [.25, .45, .6]); }
      if (o.k === 'meteor' && u < 1) { const x = lerp(o.sx, o.x, u), y = lerp(o.sy, 0, u), z = lerp(o.sz, o.z, u); M4.compose(M, x, y + 1, z, o.t * 6, o.t * 4, 0, .95, .95, .95); R.drawMesh(FxModels.meteor, M, null, [.6, .2, .05]); }
      if (o.k === 'arrow') { const uu = Math.min(1, o.t / o.dur); M4.compose(M, o.x - (1 - uu) * 2, (1 - uu) * 10 + .3, o.z, Math.PI / 2 - .25, Math.PI / 2, 0, 1.2, 1.2, 1.2); R.drawMesh(Models.arrow, M, null, [.25, .2, .08]); }
    }
  },
  // additive glow fx
  drawGlow(R) {
    const gl = R.gl, M = Game.tmpM;
    R.useLit(); gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_COLOR); gl.depthMask(false); gl.disable(gl.CULL_FACE);
    const blk = [0, 0, 0];
    for (const o of this.list) {
      if (o.delay > 0) continue; const u = clamp(o.t / o.dur, 0, 1); const fade = 1 - u;
      const C = (k) => o.col.map(v => v * k);
      if (o.k === 'arc') { const s = o.r * (.85 + u * .35); M4.compose(M, o.x, o.y, o.z, o.tilt, o.yaw - .6 + u * 1.2, 0, s, s, s); R.drawMesh(FxModels.arc, M, blk, C(fade * .85)); M4.compose(M, o.x, o.y + .02, o.z, o.tilt, o.yaw - .6 + u * 1.2, 0, s * .94, s, s * .94); R.drawMesh(FxModels.arc, M, blk, [fade * .28, fade * .28, fade * .28]); }
      else if (o.k === 'shock') { const s = o.r * (.15 + .85 * Math.sqrt(u)); M4.compose(M, o.x, o.y, o.z, 0, 0, 0, s, 1, s); R.drawMesh(FxModels.ring, M, blk, C(fade * .8)); }
      else if (o.k === 'pillar') { const s = o.r * (1 - u * .7); M4.compose(M, o.x, 0, o.z, 0, o.t, 0, s, o.h * (u < .2 ? u / .2 : 1), s); R.drawMesh(FxModels.pillar, M, blk, C(fade * fade * .3)); }
      else if (o.k === 'beam') { const s = o.r * (u < .15 ? u / .15 : 1 - (u - .15) * .9); M4.compose(M, o.x, 0, o.z, 0, 0, 0, s, o.h, s); R.drawMesh(FxModels.beam, M, blk, C(fade * .4)); }
      else if (o.k === 'glow') { const s = o.r * (.6 + u * .6); M4.compose(M, o.x, o.y, o.z, 0, 0, 0, s, s, s); R.drawMesh(FxModels.glow, M, blk, C(fade * .35)); }
      else if (o.k === 'star') { const s = o.r * (u < .3 ? u / .3 : 1 - (u - .3)); const p = R.camFwd; M4.compose(M, o.x, o.y, o.z, Math.PI / 2 - Math.asin(clamp(-p[1], -1, 1)), Cam.yaw, o.rot + u * 2, s, s, s); R.drawMesh(FxModels.star, M, blk, C(1.3)); }
    }
    for (const gh of this.ghosts) { const a = (1 - gh.t / gh.dur) * .55; for (let i = 0; i < BONES.length; i++) { const mesh = gh.parts[BONES[i][0]]; if (mesh) R.drawMesh(mesh, gh.mats[i], blk, gh.col.map(v => v * a)); } }
    gl.enable(gl.CULL_FACE); gl.depthMask(true); gl.disable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }
};

/* ---------- character voice ---------- */
const VOICE_PITCH = { adventurer: 420, knight: 330, ninja: 440, archer: 400, mage: 500, priest: 450 };
const VOWELS = { a: [850, 1250, 2800], e: [500, 1900, 2600], i: [320, 2400, 3000], o: [520, 880, 2600], u: [350, 900, 2400] };
const VoiceFx = {
  // short formant shout, e.g. 'hya', 'ha', 'ei', 'ta'
  shout(word, cls, vol = .22) {
    const A = Audio; if (!A.ctx || !Settings.d.sound || Settings.d.voice === 0) return;
    const c = A.ctx, t0 = c.currentTime, f0 = (VOICE_PITCH[cls] || 420) * (1 + (Math.random() - .5) * .08);
    const out = c.createGain(); out.gain.value = vol; out.connect(c.destination);
    const vs = word.replace(/[^aeiou]/g, '').split(''); if (!vs.length) vs.push('a');
    const total = .16 + vs.length * .1;
    // breath noise attack for consonant
    if (/^[hst]/.test(word)) { const n = c.sampleRate * .06; const b = c.createBuffer(1, n, c.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n); const s = c.createBufferSource(); s.buffer = b; const hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = word[0] === 's' ? 4000 : 1500; const g = c.createGain(); g.gain.value = .5; s.connect(hp); hp.connect(g); g.connect(out); s.start(t0); }
    const src = c.createOscillator(); src.type = 'sawtooth';
    src.frequency.setValueAtTime(f0 * 1.05, t0); src.frequency.linearRampToValueAtTime(f0 * 1.25, t0 + total * .3); src.frequency.exponentialRampToValueAtTime(f0 * .8, t0 + total);
    const env = c.createGain(); env.gain.setValueAtTime(0, t0); env.gain.linearRampToValueAtTime(1, t0 + .03); env.gain.setValueAtTime(1, t0 + total * .6); env.gain.exponentialRampToValueAtTime(.001, t0 + total);
    src.connect(env);
    [0, 1, 2].forEach(fi => {
      const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = fi === 0 ? 6 : 9;
      vs.forEach((v, k) => { const F = VOWELS[v] || VOWELS.a; bp.frequency.setValueAtTime(F[fi] * 1.12, t0 + .04 + k * .1); });
      const g = c.createGain(); g.gain.value = [1, .55, .25][fi]; env.connect(bp); bp.connect(g); g.connect(out);
    });
    src.start(t0); src.stop(t0 + total + .05);
  },
  say(text, cls) {
    if (!Settings.d.sound || !Settings.d.voice || !('speechSynthesis' in window)) return;
    try {
      const vs = speechSynthesis.getVoices(); const th = vs.find(v => /^th/i.test(v.lang)); if (!th) return;
      speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.voice = th; u.lang = th.lang;
      u.pitch = cls === 'knight' ? 1.25 : 1.7; u.rate = 1.2; u.volume = .9; speechSynthesis.speak(u);
    } catch (e) { }
  }
};
const SKILL_SHOUT = { swift: 'hya', wind: 'haa', hero: 'heiyaa', bash: 'ha', guard: 'hoo', cleave: 'uooa', shuriken: 'sha', shadow: 'shu', blades: 'haiya', power: 'ha', multi: 'hya', rain: 'eiyaa', fire: 'haa', frost: 'eia', meteor: 'oooaa', holy: 'haa', bless: 'aaa', judge: 'eiyaa' };

