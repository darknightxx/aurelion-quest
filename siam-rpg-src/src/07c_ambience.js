/* ============================================================
   Ambience: procedural zone music, weather, ghost speech bubbles
   ============================================================ */
Settings.d.music = Settings.d.music === undefined ? 1 : Settings.d.music;
const MusicSys = {
  zone: null, gains: {}, master: null, timer: 0, next: 0, step: 0, bpm: 100,
  SCALES: { world: [0, 2, 4, 7, 9, 12, 14], dungeon: [0, 3, 5, 7, 10, 12], temple: [0, 2, 5, 7, 9, 12, 14] },
  ROOT: { world: 261.6, dungeon: 110, temple: 196 },
  ensure() { if (this.master) return true; const c = Audio.ctx; if (!c) return false; this.master = c.createGain(); this.master.gain.value = Settings.d.music ? .9 : 0; this.master.connect(c.destination); return true; },
  gainFor(z) { if (!this.gains[z]) { const g = Audio.ctx.createGain(); g.gain.value = 0; g.connect(this.master); this.gains[z] = g; } return this.gains[z]; },
  setZone(z) {
    if (!this.ensure()) { this.zone = z; return; } if (this.zone === z) return;
    const c = Audio.ctx, t = c.currentTime; if (this.zone) this.gains[this.zone].gain.linearRampToValueAtTime(0, t + 1.5);
    const g = this.gainFor(z); g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(g.gain.value, t); g.gain.linearRampToValueAtTime(1, t + 2.5);
    this.zone = z; this.step = 0; this.next = t + .1;
  },
  setOn(on) { if (!this.ensure()) return; this.master.gain.linearRampToValueAtTime(on ? .9 : 0, Audio.ctx.currentTime + .4); },
  note(z, f, t0, dur, type, vol, atk = .01, rel = .25, detune = 0) {
    const c = Audio.ctx, g = this.gainFor(z); const o = c.createOscillator(), e = c.createGain(); o.type = type; o.frequency.value = f; if (detune) o.detune.value = detune;
    e.gain.setValueAtTime(0, t0); e.gain.linearRampToValueAtTime(vol, t0 + atk); e.gain.setValueAtTime(vol, t0 + Math.max(atk, dur - rel)); e.gain.exponentialRampToValueAtTime(.0005, t0 + dur + .05);
    o.connect(e); e.connect(g); o.start(t0); o.stop(t0 + dur + .1);
  },
  pluck(z, f, t0, vol) { // ranad-like bright pluck
    const c = Audio.ctx, g = this.gainFor(z); const o = c.createOscillator(), o2 = c.createOscillator(), e = c.createGain(), fl = c.createBiquadFilter();
    o.type = 'triangle'; o.frequency.value = f; o2.type = 'sine'; o2.frequency.value = f * 3; fl.type = 'lowpass'; fl.frequency.setValueAtTime(4200, t0); fl.frequency.exponentialRampToValueAtTime(600, t0 + .4);
    e.gain.setValueAtTime(vol, t0); e.gain.exponentialRampToValueAtTime(.0005, t0 + .55); o.connect(fl); o2.connect(fl); fl.connect(e); e.connect(g); o.start(t0); o2.start(t0); o.stop(t0 + .6); o2.stop(t0 + .6);
  },
  update() {
    if (!this.zone || !Audio.ctx || !Settings.d.music) return; const c = Audio.ctx; if (!this.ensure()) return;
    while (this.next < c.currentTime + .4) { this.play(this.zone, this.step, this.next); const beat = 60 / (this.zone === 'world' ? 104 : this.zone === 'dungeon' ? 60 : 84); this.next += beat / 2; this.step++; }
  },
  play(z, i, t) {
    const sc = this.SCALES[z], root = this.ROOT[z]; const F = (deg, oct = 0) => root * Math.pow(2, (sc[((deg % sc.length) + sc.length) % sc.length] + 12 * (Math.floor(deg / sc.length) + oct)) / 12);
    const bar = Math.floor(i / 8), beat = i % 8;
    if (z === 'world') {
      const chords = [[0, 2, 4], [4, 6, 8], [5, 7, 9], [3, 5, 7]]; const ch = chords[bar % 4];
      if (beat === 0) for (const d of ch) this.note(z, F(d, -1), t, 2.2, 'triangle', .045, .4, .8, (d % 2) * 4);
      if (beat % 2 === 0) this.note(z, F(ch[0], -2), t, .35, 'sine', .09, .01, .15);
      if (Math.random() < .75) { this.mel = (this.mel === undefined ? 7 : this.mel + pick([-2, -1, -1, 0, 1, 1, 2])); this.mel = clamp(this.mel, 4, 13); this.note(z, F(this.mel), t, .28, 'square', .028, .01, .12); }
      if (beat === 4 && bar % 2 === 1) this.note(z, F(ch[1], 1), t, .5, 'sine', .035, .02, .3);
    } else if (z === 'dungeon') {
      if (beat === 0 && bar % 2 === 0) { this.note(z, root, t, 6, 'sawtooth', .022, 1.5, 2, -5); this.note(z, root * 1.5, t, 6, 'sine', .03, 1.5, 2); }
      if (Math.random() < .22) this.note(z, F(pick([0, 2, 3, 5]), 2), t, 1.2, 'sine', .035, .01, .8);
      if (beat === 6 && bar % 4 === 3) this.note(z, F(1, -1), t, 1.5, 'triangle', .04, .05, 1);
    } else {
      if (beat === 0 && bar % 2 === 0) { this.note(z, root / 2, t, 5.5, 'sine', .05, 1, 2); this.note(z, root / 2 * 1.498, t, 5.5, 'triangle', .015, 1, 2, 6); }
      const pat = [0, 2, 3, 5, 3, 2, 0, -2, 0, 2, 5, 7, 5, 3, 2, 0]; const d = pat[(i + bar) % pat.length];
      if (beat % 2 === 0 || Math.random() < .35) this.pluck(z, F(d, 1), t, .05); if (beat % 4 === 2 && Math.random() < .5) this.pluck(z, F(d + 4, 1), t + .02, .03);
      if (beat === 4 && bar % 4 === 0) this.note(z, root * 2, t, 1.2, 'sine', .025, .3, .8);
    }
  }
};

/* ---------- zone soundscapes (weather removed: sound only) ---------- */
const Weather = {
  zone: null, kind: 'clear', beds: {}, ev: {},
  BEDS: { // looping filtered-noise layers per zone: [filter, freq, Q, gain]
    world: { wind: ['lowpass', 380, .7, .028] },
    dungeon: { rumble: ['lowpass', 110, .8, .07], hiss: ['bandpass', 2400, 1.2, .006] },
    temple: { wind: ['bandpass', 520, 2.5, .03], low: ['lowpass', 90, .7, .05] },
    amazon: { river: ['lowpass', 700, .6, .035], insects: ['bandpass', 5200, 8, .016], canopy: ['bandpass', 1500, .6, .012] }
  },
  setZone(z) { this.zone = z; this.sound(); for (const k in this.ev) this.ev[k] = Math.random() * 3; },
  apply() { }, lightning() { },
  noiseBuf(c) { if (this._nb) return this._nb; const n = c.sampleRate * 3, b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1; return this._nb = b; },
  bed(c, id, spec) {
    if (this.beds[id]) return this.beds[id];
    const s = c.createBufferSource(); s.buffer = this.noiseBuf(c); s.loop = true; s.loopStart = Math.random(); const f = c.createBiquadFilter(); f.type = spec[0]; f.frequency.value = spec[1]; f.Q.value = spec[2];
    const g = c.createGain(); g.gain.value = 0; s.connect(f); f.connect(g); g.connect(c.destination); s.start(); return this.beds[id] = { g, f, base: spec[1] };
  },
  sound() {
    const c = Audio.ctx; if (!c) return; const on = !!Settings.d.sound;
    for (const z in this.BEDS) for (const k in this.BEDS[z]) { const sp = this.BEDS[z][k]; const want = on && z === this.zone ? sp[3] : 0; if (!want && !this.beds[z + k]) continue; const b = this.bed(c, z + k, sp); b.g.gain.cancelScheduledValues(c.currentTime); b.g.gain.linearRampToValueAtTime(want, c.currentTime + 2.5); }
  },
  // one-shot voices
  chirp(f0, n, vol = .025) { for (let i = 0; i < n; i++) { const f = f0 * (1 + Math.random() * .25); Audio.tone(f, .07, 'sine', vol, 1.35, i * .09); } },
  bell(f = 196, vol = .05) { [1, 2.76, 5.4, 8.9].forEach((k, i) => Audio.tone(f * k, 3.5 - i * .6, 'sine', vol / (i + 1), 0)); },
  owl() { Audio.tone(410, .35, 'sine', .03, .93); Audio.tone(400, .6, 'sine', .03, .9, .5); },
  wail() { Audio.tone(620, 2.2, 'sine', .016, .62); Audio.tone(632, 2.2, 'sine', .012, .6, .05); },
  whisper() { const c = Audio.ctx; if (!c) return; for (let i = 0; i < 4; i++) Audio.noise(.25 + Math.random() * .2, .012, 1800 + Math.random() * 1600); },
  creak() { Audio.tone(140 + Math.random() * 60, .7, 'sawtooth', .012, 1.6); },
  croak() { for (let i = 0; i < 3; i++) Audio.tone(110 + Math.random() * 20, .09, 'square', .02, .8, i * .12); },
  monkey() { for (let i = 0; i < 4; i++) Audio.tone(320 + i * 60, .22, 'sawtooth', .014, 1.6, i * .2); Audio.noise(.6, .01, 600); },
  parrot() { Audio.tone(1500, .12, 'square', .012, 1.8); Audio.tone(1900, .1, 'square', .01, .6, .12); },
  drip() { Audio.tone(1200 + Math.random() * 900, .12, 'sine', .035, .5); Audio.tone(600, .5, 'sine', .012, 1); },
  EVENTS: {
    world: [[4, 9, z => Weather.chirp(2600 + Math.random() * 1400, 3 + (Math.random() * 4 | 0))], [18, 30, () => Weather.chirp(1800, 2, .018)]],
    dungeon: [[1.5, 4, () => Weather.drip()], [14, 26, () => { Audio.noise(1.4, .05, 120); }]],
    temple: [[9, 18, () => Weather.whisper()], [22, 40, () => Weather.bell(185 + Math.random() * 20)], [12, 24, () => Weather.owl()], [26, 50, () => Weather.wail()], [10, 20, () => Weather.creak()], [6, 12, () => Weather.chirp(4200, 6, .006)]],
    amazon: [[2.5, 6, () => Weather.chirp(2200 + Math.random() * 2400, 4 + (Math.random() * 5 | 0), .02)], [7, 15, () => Weather.parrot()], [14, 30, () => Weather.monkey()], [3, 7, () => Weather.croak()]]
  },
  update(dt) {
    const z = Player.zone; if (z !== this.zone) this.setZone(z);
    if (Audio.ctx && !this._snd) { this._snd = true; this.sound(); }
    if (!Audio.ctx || !Settings.d.sound) return;
    const list = this.EVENTS[z] || [];
    list.forEach((e, i) => { const k = z + i; if (this.ev[k] === undefined) this.ev[k] = e[0] * Math.random(); this.ev[k] -= dt; if (this.ev[k] <= 0) { this.ev[k] = e[0] + Math.random() * (e[1] - e[0]); e[2](); } });
    const b = this.beds[z + 'wind']; if (b) b.f.frequency.value = b.base + Math.sin(Game.time * .5) * b.base * .35;
  }
};

/* ---------- ghost speech bubbles ---------- */
const GHOST_LINES = {
  maenak: ['พี่มากขาาา...', 'พี่มาก... กลับมาแล้วหรือ', 'อย่าทิ้งนากไปอีกนะ', 'ลูกของเรา... น่ารักไหมคะ', 'นากรอพี่มานานแล้ว...'],
  pret: ['ขอส่วนบุญด้วย...', 'หิว... หิวเหลือเกิน', 'กรวดน้ำให้ข้าที...', 'ญาติข้าอยู่ไหน...', 'วี้ดดดด...'],
  krasue: ['หิว... ของสดดด', 'แสงไฟนี้... ตามมาสิ', 'ผ้าใครตากไว้...'], krahang: ['กระด้งข้าบินได้นะ', 'ไปกินข้าวเปลือกกัน', 'ฮึ่ม... ยุ้งข้าวอยู่ไหน'],
  kongkoi: ['กองกอย กองกอย!', 'นิ้วเท้า... อร่อยจัง', 'ใครนอนในป่าข้า'], tani: ['มาหาข้าในคืนเดือนเพ็ญสิ...', 'อย่าทรยศข้านะ', 'กล้วยหอมๆ กินไหม'],
  takhian: ['ใครแตะต้นไม้ของข้า!', 'ผ้าแพรของข้าอยู่ไหน', 'ขอพรอะไรข้าก็ให้... ถ้าไม่โกหก'], khamot: ['ตามแสงมาสิ...', 'ทางนี้... ทางนี้...', 'หลงป่าหรือจ๊ะ'],
  phrai: ['ลงมาเล่นน้ำสิ...', 'น้ำเย็นสบายดีนะ...', 'จมลงมา... กับข้า'], pongkhang: ['ฮึ่ม... กลิ่นคนเป็น', 'ดินโป่งเป็นของข้า'],
  nangram: ['มาดูข้ารำสิ...', 'เสียงปี่พาทย์... ได้ยินไหม', 'เวทีนี้เป็นของข้า'], phong: ['อบ๊ะ... กบอร่อย', 'อย่าสบตาข้า', 'กลิ่นนี้... ของข้าเอง'],
  tabo: ['ใครอยู่ตรงนั้น!?', 'ได้ยินเสียงฝีเท้า...', 'อยู่ไหน... อยู่ไหน'], chakla: ['เมี้ยววว~', 'ข้ามศพแล้วจะเป็นยังไงนะ', 'ฟ่อออ!'],
  saming: ['ช่วยด้วย... ทางนี้ (เสียงคุ้นๆ)', 'คำรามมม!!', 'เนื้อสดๆ...'], phidip: ['ฮึ่บ... ฮึ่บ...', 'ลมหายใจ... ของเจ้า', 'ยันต์... แกะออกที'],
  pop: ['ตับไตไส้พุง...', 'ฮี่ๆ ปอบมาแล้ว', 'ใครจะโดนสิง...'], huakhat: ['หัวข้า... อยู่ไหน', 'ขอหัวคืนที', 'ข้าตายเพื่อแผ่นดิน...'],
  pusom: ['ทรัพย์ของข้า ห้ามแตะ!', 'ไอ้คนโลภ!', 'ใครขุดของไป...'], takhon: ['ปึ้ดๆ ป้าดๆ บุญหลวงมาแล้ว!', 'เล่นกันไหม?', 'กระดิ่งข้าดังกรุ๋งกริ๋ง']
};
const GhostTalk = {
  t: 0,
  update(dt) {
    const P = Player; if (P.zone !== 'temple') return; this.t -= dt; if (this.t > 0) return; this.t = 1.2;
    const near = Monsters.list.filter(m => !m.dead && m.zone === 'temple' && GHOST_LINES[m.type] && !m.bubble && dist2(m.x, m.z, P.x, P.z) < 26 * 26);
    if (!near.length || Math.random() > .5) return;
    const m = pick(near); this.say(m, pick(GHOST_LINES[m.type]), 3.2 + Math.random() * 1.5);
  },
  say(m, text, t = 3.5) { m.bubble = { text, t }; if (m.d.wboss || m.d.elite) { Audio.tone(240 + Math.random() * 80, .5, 'sine', .035, .7); } }
};
{
  const ou = Game.update.bind(Game);
  Game.update = function (dt) { ou(dt); if (this.started && !this.paused) { Weather.update(dt); GhostTalk.update(dt); for (const m of Monsters.list) if (m.bubble) { m.bubble.t -= dt; if (m.bubble.t <= 0) m.bubble = null; } } MusicSys.update(); if (this.started && Player.zone !== MusicSys.zone && Audio.ctx) MusicSys.setZone(Player.zone); };
  // boss lines on attacks
  const og = NakBoss.grabAtk.bind(NakBoss); NakBoss.grabAtk = function (m) { og(m); GhostTalk.say(m, pick(['พี่มากขาาา! มานี่!', 'อย่าหนีนากไป!']), 2.5); };
  const ow = NakBoss.wail.bind(NakBoss); NakBoss.wail = function (m) { ow(m); GhostTalk.say(m, pick(['ฮือออ... พี่มาก...', 'ทำไมถึงทิ้งนาก...']), 2.5); };
  const oe = NakBoss.engage.bind(NakBoss); NakBoss.engage = function (m) { oe(m); GhostTalk.say(m, 'พี่มาก... กลับมาแล้วหรือคะ', 4); };
  const oge = NakBoss.goEthereal.bind(NakBoss); NakBoss.goEthereal = function (m) { oge(m); GhostTalk.say(m, 'ไม่มีใครจับนากได้หรอก...', 4); };
  const od = NakBoss.defeated.bind(NakBoss); NakBoss.defeated = function (m) { GhostTalk.say(m, 'ขอบคุณ... นากไปแล้วนะ', 5); od(m); };
}

