/* ============================================================
   Systems: save, settings, audio, quiz, combat, quests
   ============================================================ */
const today = () => { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };
const LS = {
  get(k) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
  del(k) { try { localStorage.removeItem(k); } catch (e) { } }
};

const Settings = {
  d: { move: 'both', voice: 1, qtime: 15, diff: 2, cats: { sci: 1, math: 1, eng: 1, soc: 1, thai: 1, gen: 1, custom: 1 }, sound: 1, customOnly: 0, custom: [] },
  load() { const s = LS.get('aurelion_settings_v1'); if (s) { Object.assign(this.d, s); this.d.cats = Object.assign({ sci: 1, math: 1, eng: 1, soc: 1, thai: 1, gen: 1, custom: 1 }, s.cats || {}); } },
  save() { LS.set('aurelion_settings_v1', this.d); }
};

const Save = {
  slot: 0, d: null,
  get key() { return this.keyFor(this.slot); },
  keyFor(i) { return i ? 'aurelion_save_v1_s' + i : 'aurelion_save_v1'; },
  list() { return [0, 1, 2].map(i => { const d = LS.get(this.keyFor(i)); return d && d.v === 1 && CLASSES[d.cls] ? d : null; }); },
  migrate() { },
  fresh(name, cls) {
    const c = CLASSES[cls];
    return {
      v: 1, name, cls, level: 1, xp: 0, coins: 60, points: 0, alloc: { hp: 0, mp: 0, atk: 0, def: 0, spd: 0 }, hp: c.hp, mp: c.mp,
      skillLv: {}, skillPts: 0,
      inv: { hp_s: 3, mp_s: 1, scroll: 1, ['o_' + cls]: 1 }, equip: { weapon: null, armor: null, acc: null }, cos: { head: null, back: null, aura: null, outfit: null },
      quests: {}, ach: {}, title: null, stats: { kills: 0, correct: 0, wrong: 0, bossKills: 0, crits: 0, cosEquip: 0, shrines: 0, perfectChain: 0, sideDone: 0, cat_sci: 0 },
      shrinesUsed: {}, shrineCD: {}, warps: { w_town: true }, buffs: {}, flags: { bridge: false, gate: false }, pos: { x: 9, z: 68, zone: 'world' }, playT: 0, created: Date.now()
    };
  },
  load() { const d = LS.get(this.key); if (d && d.v === 1 && CLASSES[d.cls]) { this.d = d; return true; } return false; },
  exists() { const d = LS.get(this.key); return !!(d && d.v === 1 && CLASSES[d.cls]); },
  peek() { return LS.get(this.key); },
  write() { if (!this.d) return; this.d.pos = { x: Player.x, z: Player.z, zone: Player.zone }; LS.set(this.key, this.d); },
  wipe() { LS.del(this.key); }
};

/* ---------- Audio (synth) ---------- */
const Audio = {
  ctx: null,
  init() { if (this.ctx) return; try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { this.ctx = null; } },
  tone(f, t, type = 'sine', vol = .15, slide = 0, delay = 0) {
    if (!this.ctx || !Settings.d.sound) return; const c = this.ctx; const t0 = c.currentTime + delay;
    const o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.setValueAtTime(f, t0); if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, f * slide), t0 + t);
    g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(.0005, t0 + t); o.connect(g); g.connect(c.destination); o.start(t0); o.stop(t0 + t + .02);
  },
  noise(t, vol = .2, f = 800) {
    if (!this.ctx || !Settings.d.sound) return; const c = this.ctx; const n = c.sampleRate * t; const b = c.createBuffer(1, n, c.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const s = c.createBufferSource(); s.buffer = b; const fl = c.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = f; const g = c.createGain(); g.gain.value = vol; s.connect(fl); fl.connect(g); g.connect(c.destination); s.start();
  },
  sfx(k) {
    switch (k) {
      case 'hit': this.noise(.08, .18, 2200); this.tone(180, .08, 'square', .05, .5); break;
      case 'crit': this.noise(.15, .25, 3000); this.tone(520, .2, 'sawtooth', .07, 1.8); break;
      case 'hurt': this.tone(140, .18, 'square', .08, .5); break;
      case 'coin': this.tone(990, .08, 'square', .05); this.tone(1320, .12, 'square', .05, 1, .07); break;
      case 'level': [523, 659, 784, 1046].forEach((f, i) => this.tone(f, .25, 'triangle', .1, 1, i * .1)); break;
      case 'correct': this.tone(660, .12, 'triangle', .12); this.tone(990, .18, 'triangle', .12, 1, .1); break;
      case 'wrong': this.tone(220, .3, 'sawtooth', .07, .6); break;
      case 'skill': this.tone(300, .3, 'sawtooth', .06, 3); this.noise(.25, .12, 1500); break;
      case 'shoot': this.tone(700, .1, 'triangle', .05, .5); break;
      case 'boss': this.tone(80, 1.0, 'sawtooth', .12, .7); this.noise(.8, .15, 400); break;
      case 'slam': this.noise(.4, .35, 300); this.tone(60, .4, 'sine', .25, .5); break;
      case 'barrier': this.tone(880, .6, 'sine', .08, 1.5); this.tone(1320, .6, 'sine', .05, 1.5, .1); break;
      case 'crystal': this.tone(1500, .15, 'triangle', .05, .5); break;
      case 'ui': this.tone(800, .05, 'sine', .06); break;
      case 'warp': this.tone(300, .5, 'sine', .1, 4); break;
      case 'quest': [392, 523, 659].forEach((f, i) => this.tone(f, .2, 'triangle', .1, 1, i * .09)); break;
      case 'tick': this.tone(1200, .03, 'square', .03); break;
    }
  }
};

/* ---------- Quiz ---------- */
const Quiz = {
  decks: {},
  pool(cat) {
    const S = Settings.d;
    if (cat === 'custom') return S.custom.map((c, i) => ({ i, c }));
    return QBANK.map((q, i) => ({ i, q })).filter(o => o.q[0] === cat && o.q[1] <= Math.max(1, S.diff));
  },
  cats() {
    const S = Settings.d; let cs = Object.keys(QCATS).filter(k => S.cats[k]);
    if (!S.custom.length) cs = cs.filter(k => k !== 'custom');
    if (S.customOnly && S.custom.length) cs = ['custom'];
    if (!cs.length) cs = ['sci', 'math', 'eng', 'soc', 'thai', 'gen'];
    return cs;
  },
  next(forceCat) {
    const cat = forceCat || pick(this.cats());
    if (cat === 'math' && Math.random() < .55) { const g = genMath(Settings.d.diff); return this.shuffle({ cat, q: g.q, a: g.a, opts: g.opts }); }
    let d = this.decks[cat];
    if (!d || !d.length) { d = this.pool(cat).map(o => o.i); for (let i = d.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [d[i], d[j]] = [d[j], d[i]]; } this.decks[cat] = d; }
    if (!d.length) { const g = genMath(Settings.d.diff); return this.shuffle({ cat: 'math', q: g.q, a: g.a, opts: g.opts }); }
    const idx = d.pop();
    if (cat === 'custom') { const c = Settings.d.custom[idx]; return this.shuffle({ cat: 'custom', q: c.q, a: c.a, opts: [c.a, ...c.w] }); }
    const q = QBANK[idx]; return this.shuffle({ cat, q: q[2], a: q[3], opts: [q[3], q[4], q[5], q[6]] });
  },
  shuffle(o) { const a = o.opts.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } o.opts = a; return o; },
  // run a quiz session: {title, sub, count, chain(bool: stop on wrong), time, onEach(ok,q), onEnd(results)}
  run(cfg) {
    Game.pause(true); Player.doAct('think', 99);
    const res = { correct: 0, wrong: 0, total: cfg.count };
    let i = 0;
    const askNext = () => {
      const q = this.next(cfg.cat);
      UI.quizShow(cfg, q, i, res, (ok) => {
        const S = Save.d;
        if (ok) { res.correct++; S.stats.correct++; Season.addXP(5); Season.bump('correct'); S.stats['cat_' + q.cat] = (S.stats['cat_' + q.cat] || 0) + 1; Audio.sfx('correct'); }
        else { res.wrong++; S.stats.wrong++; Audio.sfx('wrong'); }
        cfg.onEach && cfg.onEach(ok, q);
        Achievements.check();
        i++;
        const stop = (cfg.chain && !ok) || i >= cfg.count;
        setTimeout(() => {
          if (stop) { UI.quizHide(); Game.pause(false); Player.act = null; Player.actT = 0; cfg.onEnd && cfg.onEnd(res); }
          else askNext();
        }, ok ? 750 : 1500);
      });
    };
    askNext();
  }
};

/* ---------- Combat ---------- */
const Combat = {
  basicAttack(m) {
    const P = Player, cls = Save.d.cls, c = Cls.of(Save.d), st = P.stats; const rig = P.getRig();
    if (rig.busy) return;
    P.atkCD = c.rate * (Save.d.buffs.frenzy ? .6 : 1); P.combatT = 6; Net.act('atk'); P.face = Math.atan2(m.x - P.x, m.z - P.z);
    const anim = BASIC_ANIM[cls]; const spd = Math.max(1, CLIPS[anim].dur / Math.max(.3, c.rate * .85));
    if (Math.random() < .35) VoiceFx.shout(pick(['ha', 'hu', 'ta', 'ei']), P.sheet, .12);
    rig.play(anim, spd, () => {
      if (m.dead) return;
      if (c.melee) {
        P.hitN = (P.hitN || 0) + 1; const fourth = c.role === 'melee' && P.hitN % 4 === 0;
        Combat.damageMonster(m, st.atk * (fourth ? 1.5 : 1), {}); if (fourth) { Fx.star(m.x, m.d.h * .6, m.z, 1.5, [1, .8, .4], .25); Fx.shock(m.x, m.z, 1.4, [1, .8, .4], .3); }
        const hp = rig.bonePos('elR', 0, -.26, 0);
        Fx.arc(P.x + Math.sin(P.face) * .9, 1.0, P.z + Math.cos(P.face) * .9, P.face, (Math.random() - .5) * .9, 1.5, [1, .92, .7], .22);
        Fx.star(m.x, (m.d.fly ? 1.8 : m.d.h * .55), m.z, .9, [1, .9, .6], .18);
        Particles.burst(m.x, m.d.h * .5, m.z, 6, [1, .95, .8], 4, .3, .3, 2);
        Audio.sfx('hit');
      } else {
        const kind = c.proj; const col = kind === 'orb' ? [.7, .5, 1] : kind === 'holy' ? [1, .95, .6] : [1, .9, .6];
        const hp = rig.bonePos(cls === 'archer' ? 'elL' : 'elR', 0, -.26, .1);
        Fx.glow(hp[0], hp[1], hp[2], .35, col, .2);
        Projectiles.fire({ x: hp[0], z: hp[2], y: Math.max(1, hp[1]), dir: Math.atan2(m.x - P.x, m.z - P.z), speed: kind === 'arrow' ? 32 : 22, dmg: st.atk, kind, col, target: m });
        if (c.role === 'support') { const S = Save.d; S.hp = Math.min(st.maxhp, S.hp + st.maxhp * .015); }
        Audio.sfx('shoot');
      }
    });
  },
  damageMonster(m, raw, o) {
    if (m.dead) return;
    const P = Player;
    if (m.barrier) { UI.floatText(m.x, m.d.h + 1, m.z, 'เกราะผลึก!', 'immune'); Particles.burst(m.x, 3, m.z, 4, [.6, .9, 1], 3, .3); return; }
    if (m.ethereal) { UI.floatText(m.x, m.d.h * 1.6, m.z, 'ร่างวิญญาณ!', 'immune'); Particles.burst(m.x, 3, m.z, 4, [.6, .85, 1], 3, .3); return; }
    let crit = o.crit || Math.random() < .06 + Mounts.pas('crit') + RoleSys.critBonus();
    let dmg = raw * RoleSys.dmgBonus(m) * rand(.9, 1.1) * (crit && !o.crit ? 1.6 : 1) * ((m.stunT > 0 || m.stun > 0) ? 1.5 : 1) - m.d.def * .55;
    dmg = Math.max(1, Math.round(dmg));
    m.hp -= dmg; m.flash = 1; m.hit = .15; P.combatT = 6; Mounts.onDealt(m, dmg);
    UI.dmgNum(m.x, (m.d.fly ? 2.2 : m.d.h) + .6, m.z, dmg, crit ? 'crit' : 'hit');
    if (crit) Audio.sfx('crit');
    if (!m.aggro && !m.d.boss) { m.aggro = true; m.state = 'chase'; m.atkCD = .6; }
    if (o.stun && !m.d.boss && !m.d.wboss) m.stun = o.stun * (m.d.elite ? .5 : 1);
    if (o.slow) m.slow = Math.max(m.slow || 0, o.slow);
    if (o.dot) RoleSys.applyDot(m, o.dot);
    if (m.hp <= 0) this.kill(m);
  },
  kill(m) {
    const S = Save.d, P = Player;
    m.dead = true; m.deathT = 0; m.hp = 0; m.respawn = m.d.boss ? 300 : m.d.respawn || 16 + Math.random() * 8; m.cast = null; m.jump = null;
    Particles.burst(m.x, 1, m.z, m.d.boss ? 120 : 22, m.type === 'slime' ? [.5, 1, .4] : [1, .9, .6], m.d.boss ? 10 : 4, .8, m.d.boss ? .9 : .4, 3);
    if (P.target && P.target.ref === m) P.target = null;
    if (m.d.ghost || m.type === 'ngu') { Fx.pillar(m.x, m.z, .7, 5, [1, .95, .75], .8); for (let i = 0; i < 18; i++) Particles.add(m.x + rand(-.5, .5), rand(.3, 2), m.z + rand(-.5, .5), { c: [1, .95, .7], s: .35, life: 1.4, vy: rand(1.5, 3.5) }); }
    if (m.summon) return;
    S.stats.kills++; Season.addXP(2); Season.bump('kill'); if (m.d.boss) Season.bump('boss');
    const lvlGap = Math.max(.25, 1 - Math.max(0, S.level - m.d.lvl - 2) * .2);
    Game.gainXP(Math.round(m.d.xp * lvlGap));
    Game.gainCoins(randi(m.d.coin[0], m.d.coin[1]));
    for (const [id, ch, needQ] of m.d.drops) {
      if (needQ) { const qid = needQ === 'q_totem' ? 'm2' : needQ; if (!(S.quests[qid] && S.quests[qid].s === 'active')) continue; }
      if (Math.random() < ch * (S.buffs.luck ? 1.5 : 1)) Game.addItem(id, 1);
    }
    if (m.d.ghost) { S.stats.ghostKills = (S.stats.ghostKills || 0) + 1; S.ghostKills = S.ghostKills || {}; S.ghostKills[m.type] = (S.ghostKills[m.type] || 0) + 1; S.stats.ghostTypes = GHOST_ORDER.filter(k => S.ghostKills[k]).length; if (m.type === 'pusom') S.stats.pusomKills = (S.stats.pusomKills || 0) + 1; if (m.type === 'maenak') S.stats.nakKills = (S.stats.nakKills || 0) + 1; (S.ghostSeen = S.ghostSeen || {})[m.type] = 1; }
    Quests.onKill(m.type, m.zone);
    if (m.d.boss) Game.bossDefeated(m);
    if (m.d.wboss) NakBoss.defeated(m);
    Achievements.check();
  },
  hitPlayer(raw, src) {
    const P = Player, S = Save.d;
    if (P.dead || Game.paused) return;
    if (Net.gm && S.gmGod) { UI.floatText(P.x, 2.6, P.z, 'GM', 'immune'); return; }
    const mk = Mounts.onHurt(raw, src); if (mk < 0) return;
    const rk = RoleSys.onPlayerHit(raw, src);
    let dmg = Math.max(1, Math.round((raw * rand(.85, 1.15) - P.stats.def * .6) * mk * rk));
    S.hp -= dmg; P.hurtT = .3; P.combatT = 6;
    UI.dmgNum(P.x, 2.9, P.z, dmg, 'player'); UI.hurtFlash(); Audio.sfx('hurt'); const rg = P.getRig(); if (!rg.busy) rg.play('hurt'); if (Math.random() < .3) VoiceFx.shout('u', P.sheet, .1);
    if (S.hp <= 0) { S.hp = 0; if (!RoleSys.tryRevive()) Game.die(); }
  }
};

/* ---------- Skills ---------- */
const Skills = {
  cd: [0, 0, 0, 0, 0],
  use(slot) {
    const P = Player, S = Save.d; if (P.dead || Game.paused) return;
    const id = Cls.of(S).skills[slot]; const sk = SKILLS[id];
    if (Player.getRig().busy || Player.dashT > 0) return;
    if (this.cd[slot] > 0) { UI.toast('สกิลยังคูลดาวน์อยู่', 'warn'); return; }
    if (S.mp < SkillLv.mp(id)) { UI.toast('MP ไม่พอ', 'warn'); return; }
    const tgt = this.pickTarget(sk);
    if (sk.type === 'combo' && (!tgt || dist2(tgt.x, tgt.z, P.x, P.z) > (sk.r + 1) ** 2)) { UI.toast('ต้องเข้าใกล้เป้าหมายก่อน (' + sk.r + ' เมตร)', 'warn'); return; }
    if (sk.quiz) {
      Quiz.run({
        title: 'สกิลใหญ่: ' + sk.name, sub: 'ตอบถูกภายในเวลา พลังสกิล ×2 (คริติคอล)', count: 1, time: Settings.d.qtime, mode: 'ult',
        onEnd: (r) => {
          if (r.correct) { S.stats.crits++; this.exec(slot, sk, tgt, 2, id); UI.banner('CRITICAL ×2', 'crit'); Achievements.check(); }
          else { S.mp -= Math.round(SkillLv.mp(id) / 2); this.cd[slot] = SkillLv.cd(id); UI.banner('สกิลฟาวล์!', 'fizzle'); VoiceFx.shout('uu', Player.sheet, .15); Player.getRig().play('hurt'); Particles.burst(P.x, 1.5, P.z, 20, [.5, .5, .55], 3, .6); }
        }
      });
      return;
    }
    this.exec(slot, sk, tgt, 1, id);
  },
  pickTarget(sk) {
    const P = Player; let best = null, bd = 1e9;
    if (P.target && P.target.kind === 'mon' && !P.target.ref.dead) return P.target.ref;
    for (const m of Monsters.list) { if (m.dead || m.zone !== P.zone) continue; const d = dist2(m.x, m.z, P.x, P.z); if (d < 16 * 16 && d < bd) { bd = d; best = m; } }
    return best;
  },
  exec(slot, sk, tgt, mult, id) {
    const P = Player, S = Save.d, st = P.stats, rig = P.getRig(), parts = CharModels[P.sheet];
    Net.act('sk', id); const L = SkillLv.f(id); S.mp -= SkillLv.mp(id); this.cd[slot] = SkillLv.cd(id); P.combatT = 6; P.moveTo = null;
    if (tgt) P.face = Math.atan2(tgt.x - P.x, tgt.z - P.z);
    const dmg = st.atk * (sk.mult || 0) * mult * L.dmg; const c = sk.col; const crit = mult > 1;
    VoiceFx.shout(SKILL_SHOUT[id] || 'hya', P.sheet, .24);
    if (sk.quiz || crit) setTimeout(() => VoiceFx.say(sk.name, P.sheet), 120);
    Audio.sfx('skill');
    // charge-up glow at the hands
    const hp0 = rig.bonePos('elR', 0, -.26, 0); Fx.glow(hp0[0], hp0[1], hp0[2], .5, c, .35);
    for (let i = 0; i < 14; i++) { const a = Math.random() * TAU; Particles.add(P.x + Math.cos(a) * 1.4, .2 + Math.random() * 1.8, P.z + Math.sin(a) * 1.4, { c, s: .35, life: .4, vx: -Math.cos(a) * 3, vz: -Math.sin(a) * 3, drag: 1 }); }
    if (crit) { Fx.flash([1, .85, .3], .3); Fx.pillar(P.x, P.z, .8, 4, [1, .85, .35], .5); Fx.shock(P.x, P.z, 2.5, [1, .85, .35], .5); }
    const inRange = (m, x, z, r) => !m.dead && m.zone === P.zone && dist2(m.x, m.z, x, z) < (r + m.d.r) ** 2;
    const hitArea = (x, z, r, o) => { for (const m of Monsters.list) if (inRange(m, x, z, r)) Combat.damageMonster(m, dmg, Object.assign({ crit }, o || {})); };
    const fwd = (d) => [P.x + Math.sin(P.face) * d, P.z + Math.cos(P.face) * d];
    const impact = () => {
      switch (sk.type) {
        case 'proj': {
          const base = tgt ? Math.atan2(tgt.x - P.x, tgt.z - P.z) : P.face; const n = sk.n || 1;
          const hp = rig.bonePos(P.sheet === 'archer' ? 'elL' : 'elR', 0, -.26, .1);
          Fx.star(hp[0], hp[1], hp[2], 1.1, c, .25); Fx.glow(hp[0], hp[1], hp[2], .7, c, .25);
          for (let i = 0; i < n; i++) { const off = (i - (n - 1) / 2) * (sk.spread || 0); Projectiles.fire({ x: hp[0], z: hp[2], y: Math.max(1, hp[1]), dir: base + off, speed: 28, dmg, kind: sk.proj, col: c, target: n === 1 ? tgt : null, pierce: sk.pierce, splash: sk.splash, opts: { crit, dot: RoleSys.dot(sk, st.atk, L), slow: sk.slow }, life: 1.4, big: true }); }
          if (id === 'venom') { Fx.glow(hp[0], hp[1], hp[2], .9, [.5, 1, .3], .3); for (let i = 0; i < 12; i++) Particles.add(hp[0], hp[1], hp[2], { c: [.5, .95, .3], s: .3, life: .5, vx: rand(-2, 2), vy: rand(0, 2), vz: rand(-2, 2) }); }
          if (sk.pierce) Fx.shock(P.x, P.z, 2.2, c, .35, 1.2);
          break;
        }
        case 'nova': {
          if (id === 'frost') { Fx.spikes(P.x, P.z, sk.r, 22); Fx.shock(P.x, P.z, sk.r, [.5, .85, 1], .55); Fx.shock(P.x, P.z, sk.r * .7, [.8, .95, 1], .7); for (let i = 0; i < 40; i++) { const a = Math.random() * TAU; Particles.add(P.x, .5, P.z, { c: [.8, .95, 1], s: .4, life: .8, vx: Math.cos(a) * 9, vz: Math.sin(a) * 9, vy: 1, drag: 2.5 }); } }
          else { for (let k = 0; k < 6; k++) setTimeout(() => { Fx.arc(P.x, .9 + k * .05, P.z, P.face + k * 1.05, (k % 2 ? .3 : -.3), sk.r * .75, c, .3); rig.pose(P.x, 0, P.z, P.face, CHAR_SCALE); Fx.ghost(rig, parts, c, .3); }, k * 55); Fx.shock(P.x, P.z, sk.r, c, .5); }
          Particles.ring(P.x, .6, P.z, 1, 46, c, .6, .5);
          if (id === 'smoke') { for (let i = 0; i < 46; i++) { const a = Math.random() * TAU, d = Math.random() * sk.r; Particles.add(P.x + Math.cos(a) * d, .3 + Math.random() * 1.6, P.z + Math.sin(a) * d, { c: pick([[.55, .7, .4], [.45, .55, .35], [.7, .85, .45]]), s: .9, life: 1.3, vy: .5, vx: Math.cos(a) * .8, vz: Math.sin(a) * .8 }); } }
          if (id === 'whirl') { Fx.spikes && Fx.shock(P.x, P.z, sk.r * .6, [1, 1, .85], .35); }
          hitArea(P.x, P.z, sk.r, { slow: sk.slow, stun: sk.stun ? sk.stun * L.dur : 0, dot: RoleSys.dot(sk, st.atk, L) }); Game.shake(.3); Audio.sfx('slam');
          break;
        }
        case 'cone': {
          const f = P.face; const [cx, cz] = fwd(sk.r * .45);
          Fx.arc(cx, 1.0, cz, f, id === 'cleave' ? 1.3 : .25, sk.r * .7, c, .32);
          Fx.arc(cx, .7, cz, f, id === 'cleave' ? 1.5 : -.2, sk.r * .55, [1, 1, 1], .25);
          if (id === 'cleave') { const [ix, iz] = fwd(2.2); Fx.shock(ix, iz, sk.r, c, .6); Fx.shock(ix, iz, sk.r * .6, [1, 1, .9], .45); Fx.pillar(ix, iz, 1.6, 6, c, .5); for (let i = 0; i < 24; i++) { const a = f + rand(-1, 1), d = rand(1, sk.r); Particles.add(P.x + Math.sin(a) * d, .3, P.z + Math.cos(a) * d, { c: [.75, .65, .5], s: .6, life: .7, vy: rand(2, 5), grav: -12 }); } Game.shake(.5); Audio.sfx('slam'); }
          if (id === 'bash') { const [ix, iz] = fwd(1.6); Fx.star(ix, 1.1, iz, 1.6, c, .3); Fx.shock(ix, iz, 2.5, c, .4, 1.0); }
          for (let i = 0; i < 26; i++) { const a = f + rand(-sk.ang, sk.ang), d = rand(1, sk.r); Particles.add(P.x + Math.sin(a) * d, 1 + Math.random(), P.z + Math.cos(a) * d, { c, s: .45, life: .4, vy: 1 }); }
          for (const m of Monsters.list) if (inRange(m, P.x, P.z, sk.r)) { const a = Math.abs(angWrap(Math.atan2(m.x - P.x, m.z - P.z) - f)); if (a <= sk.ang + .25) Combat.damageMonster(m, dmg, { crit, stun: sk.stun ? sk.stun * L.dur : 0 }); }
          Game.shake(.18); break;
        }
        case 'dash': {
          const f = tgt ? Math.atan2(tgt.x - P.x, tgt.z - P.z) : P.face; const x0 = P.x, z0 = P.z;
          P.face = f; P.dashDir = f; P.dashT = .22; P.dashSpd = sk.dist / .22; P.moveTo = null;
          Fx.shock(P.x, P.z, 1.6, c, .3);
          P.onDashEnd = () => { for (const m of Monsters.list) if (!m.dead && m.zone === P.zone && segDist(m.x, m.z, x0, z0, P.x, P.z) < 1.6 + m.d.r) { Combat.damageMonster(m, dmg, { crit }); Fx.arc(m.x, 1, m.z, f + 1.2, .4, 1.6, c, .25); } Fx.shock(P.x, P.z, 2, c, .35);
            if (sk.pull) { let n = 0; for (const m of Monsters.list) if (!m.dead && m.zone === P.zone && !m.d.boss && !m.d.wboss && dist2(m.x, m.z, P.x, P.z) < sk.pull * sk.pull) { const a = P.face + (n % 2 ? .5 : -.5) * Math.ceil(n / 2); const r = Col.resolve(P.x + Math.sin(a) * 2, P.z + Math.cos(a) * 2, m.d.r); Particles.burst(m.x, 1, m.z, 8, c, 3, .4, .3, 2); m.x = r[0]; m.z = r[1]; m.stun = Math.max(m.stun || 0, (sk.stun || .5) * L.dur); m.aggro = true; m.state = 'chase'; n++; } Fx.shock(P.x, P.z, sk.pull, c, .5); Fx.shock(P.x, P.z, sk.pull * .5, [1, 1, 1], .35); Game.shake(.35); Audio.sfx('slam'); }
          };
          break;
        }
        case 'heal': {
          const h = Math.round(st.maxhp * sk.heal * L.heal); S.hp = Math.min(st.maxhp, S.hp + h); UI.dmgNum(P.x, 3, P.z, h, 'heal');
          if (sk.buffs) { for (const [k, t] of sk.buffs) Game.addBuff(k, Math.max(S.buffs[k] || 0, t * L.dur)); } else if (sk.buff) Game.addBuff(sk.buff.spd ? 'haste' : 'regen', sk.buff.t);
          Fx.pillar(P.x, P.z, 1.2, 4.5, c, .9); Fx.shock(P.x, P.z, 2.4, c, .7); for (let i = 0; i < 30; i++) { const a = i / 30 * TAU * 3; Particles.add(P.x + Math.cos(a) * .9, .1 + i * .1, P.z + Math.sin(a) * .9, { c, s: .4, life: 1, vy: 1.5 }); }
          break;
        }
        case 'buff': { if (sk.buffs) { for (const [k, t] of sk.buffs) Game.addBuff(k, Math.max(S.buffs[k] || 0, t * L.dur)); } else Game.addBuff('guard', sk.buff.t);
          if (sk.heal) { const h = Math.round(st.maxhp * sk.heal * L.heal); S.hp = Math.min(st.maxhp, S.hp + h); UI.dmgNum(P.x, 3, P.z, h, 'heal'); }
          if (id === 'angel') { Fx.pillar(P.x, P.z, 1.4, 8, [1, 1, .85], .9); for (let i = 0; i < 30; i++) Particles.add(P.x + rand(-1, 1), 3 + rand(0, 2), P.z + rand(-1, 1), { c: [1, 1, .9], s: .35, life: 1.2, vy: -1.2 }); }
          if (id === 'focus' || id === 'assassin') { for (let i = 0; i < 30; i++) { const a = i / 30 * TAU; Particles.add(P.x + Math.cos(a) * 1, .2, P.z + Math.sin(a) * 1, { c, s: .45, life: .8, vy: 3.5 }); } } Fx.shock(P.x, P.z, 2.2, c, .5); Fx.glow(P.x, 1.3, P.z, 1.6, c, .6); Particles.ring(P.x, 1.2, P.z, 1.2, 30, c, .8, .5); Audio.sfx('barrier'); break; }
        case 'rain': {
          let x, z; if (tgt) { x = tgt.x; z = tgt.z; } else { [x, z] = fwd(6); }
          Effects.add({ kind: 'ring', x, z, r: sk.r, dur: .7, col: [...c, .9] });
          const land = () => { Particles.burst(x, .5, z, 60, c, sk.r * 1.4, .7, .6, 3); Fx.shock(x, z, sk.r, c, .6); Fx.shock(x, z, sk.r * .55, [1, 1, 1], .4); Game.shake(.4 * mult); Audio.sfx('slam'); hitArea(x, z, sk.r); if (sk.heal) { const h = Math.round(st.maxhp * sk.heal * L.heal); S.hp = Math.min(st.maxhp, S.hp + h); UI.dmgNum(P.x, 3, P.z, h, 'heal'); } };
          if (id === 'meteor') { Fx.meteor(x, z, 0, () => { land(); Fx.pillar(x, z, 2.2, 7, [1, .5, .15], .6); for (let i = 0; i < 8; i++) Fx.meteor(x + rand(-sk.r, sk.r) * .7, z + rand(-sk.r, sk.r) * .7, .05 + i * .06, () => Particles.burst(x, .5, z, 6, [1, .5, .2], 4, .4, .5, 3)); }); }
          else if (id === 'rain') { Fx.arrows(x, z, sk.r, 34, .45); setTimeout(land, 520); }
          else if (id === 'judge') { for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; Fx.beam(x + Math.cos(a) * sk.r * .6, z + Math.sin(a) * sk.r * .6, .7, 14, c, .6, i * .05); } Fx.beam(x, z, 1.8, 16, [1, 1, .85], .7, .32); setTimeout(land, 420); }
          else { Fx.pillar(x, z, 1.5, 6, c, .5); setTimeout(land, 60); }
          break;
        }
        default: RoleSys.impact(sk, id, { dmg, crit, tgt, fwd, L });
      }
    };
    rig.play(SKILL_ANIM[id] || 'cast', 1, impact);
  },
  update(dt) { for (let i = 0; i < 5; i++) this.cd[i] = Math.max(0, this.cd[i] - dt); this.potCD = Math.max(0, (this.potCD || 0) - dt); }
};

/* ---------- Quests ---------- */
const Quests = {
  st(id) { return Save.d.quests[id]; },
  isDaily(q) { return QUESTS[q].type === 'daily'; },
  available(id) {
    const q = QUESTS[id], s = this.st(id), S = Save.d;
    if (q.req && !(S.quests[q.req] && S.quests[q.req].s === 'done')) return false;
    if (q.minLv && S.level < q.minLv) return false;
    if (q.needJob && !S.job) return false;
    if (!s) return true;
    if (this.isDaily(id) && s.s === 'done' && s.day !== today()) return true;
    return false;
  },
  active(id) { const s = this.st(id); return s && s.s === 'active'; },
  accept(id) { Save.d.quests[id] = { s: 'active', k: {}, day: today() }; UI.toast('รับเควส: ' + QUESTS[id].title, 'quest'); Audio.sfx('quest'); UI.refreshTracker(); Game.autosave(); },
  progress(id) {
    const q = QUESTS[id], s = this.st(id), S = Save.d; if (!s) return [];
    return q.obj.map(o => {
      if (o.k === 'kill') return { have: Math.min(o.n, s.k[o.mon] || 0), n: o.n, label: 'ปราบ' + MONSTERS[o.mon].name };
      if (o.k === 'killany') return { have: Math.min(o.n, s.k.any || 0), n: o.n, label: 'ปราบมอนสเตอร์' };
      if (o.k === 'collect') return { have: Math.min(o.n, S.inv[o.item] || 0), n: o.n, label: 'เก็บ' + ITEMS[o.item].name };
      if (o.k === 'boss') return { have: s.k.boss ? 1 : 0, n: 1, label: 'ปราบ' + MONSTERS.boss.name };
      if (o.k === 'quiz') return { have: s.k.quiz || 0, n: o.n, label: 'ตอบคำถามนักปราชญ์' };
      if (o.k === 'talk') return { have: s.k.talk ? 1 : 0, n: 1, label: 'ไปพบ' + NPCS[o.npc].name };
      if (o.k === 'killzone') return { have: Math.min(o.n, s.k.zone || 0), n: o.n, label: 'สงบวิญญาณในวัดร้าง' };
      return { have: 0, n: 1, label: '' };
    });
  },
  complete(id) { const p = this.progress(id); return p.length && p.every(o => o.have >= o.n); },
  onKill(type, zone) {
    for (const id in Save.d.quests) {
      const s = Save.d.quests[id]; if (s.s !== 'active') continue; const q = QUESTS[id];
      for (const o of q.obj) { if (o.k === 'kill' && o.mon === type) s.k[type] = (s.k[type] || 0) + 1; if (o.k === 'killany') s.k.any = (s.k.any || 0) + 1; if (o.k === 'boss' && type === 'boss') s.k.boss = 1; if (o.k === 'killzone' && zone === o.zone && MONSTERS[type].ghost) s.k.zone = (s.k.zone || 0) + 1; }
      if (this.complete(id) && !s.notified) { s.notified = true; UI.toast('เควสพร้อมส่ง: ' + q.title, 'quest'); Audio.sfx('quest'); }
    }
    UI.refreshTracker();
  },
  onItem() {
    for (const id in Save.d.quests) { const s = Save.d.quests[id]; if (s.s !== 'active') continue; if (this.complete(id) && !s.notified) { s.notified = true; UI.toast('เควสพร้อมส่ง: ' + QUESTS[id].title, 'quest'); Audio.sfx('quest'); } }
    UI.refreshTracker();
  },
  turnIn(id) {
    const q = QUESTS[id], s = this.st(id), S = Save.d;
    for (const o of q.obj) if (o.k === 'collect' && (q.take || ITEMS[o.item].quest)) Game.addItem(o.item, -o.n, true);
    s.s = 'done'; s.day = today();
    if (q.rew.xp) Game.gainXP(q.rew.xp); if (q.rew.coin) Game.gainCoins(q.rew.coin); if (q.gems) { Gems.add(q.gems, 'เควส ' + q.title); UI.toast(`ได้รับเพชร ${q.gems} เม็ด`, 'rare'); }
    for (const [it, n] of q.rew.items) Game.addItem(it, n);
    if (q.unlock === 'bridge') { S.flags.bridge = true; Game.applyUnlocks(); UI.toast('สะพานข้ามแม่น้ำเปิดแล้ว!', 'quest'); }
    if (q.unlock === 'gate') { S.flags.gate = true; Game.applyUnlocks(); UI.toast('ประตูถ้ำผลึกปลดล็อกแล้ว (ต้องเลเวล 5)', 'quest'); }
    if (q.type === 'side') S.stats.sideDone++; if (q.title) Titles.grant(q.title, 'เควส ' + q.title);
    Season.addXP(QUEST_SXP[q.type] || 100, 'เควส ' + q.title); Season.bump('quest');
    Audio.sfx('quest'); Player.doAct('cheer', 1.0);
    Achievements.check(); UI.refreshTracker(); Game.autosave();
  },
  // marker for npc: '!' available, '?' ready, '…' in progress
  marker(npcId) {
    let m = null;
    for (const id of QUEST_ORDER) {
      const q = QUESTS[id]; if (q.giver !== npcId && q.turnTo !== npcId) continue;
      if (this.active(id) && this.complete(id) && (q.turnTo || q.giver) === npcId) return '?';
      if (q.giver !== npcId) { if (this.active(id) && q.obj.some(o => o.k === 'talk' && o.npc === npcId)) m = m || '!'; continue; }
      if (this.available(id)) m = '!';
      else if (this.active(id) && !m) m = '…';
    }
    return m;
  }
};

const Achievements = {
  val(a) { const S = Save.d; if (a.stat === 'level') return S.level; if (a.stat === 'coins') return S.coins; return S.stats[a.stat] || 0; },
  check() {
    const S = Save.d; if (!S) return;
    for (const a of ACHIEVEMENTS) {
      if (S.ach[a.id]) continue;
      if (this.val(a) >= a.n) {
        S.ach[a.id] = Date.now(); if (a.coin) S.coins += a.coin; if (S.gems !== undefined) { S.gems += 10; Gems.log('+10', 'ความสำเร็จ: ' + a.name); }
        UI.achievement(a); if (!S.title) S.title = a.title;
      }
    }
  }
};

