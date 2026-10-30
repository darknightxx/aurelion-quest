/* ============================================================
   Role skill systems: skill levels, DoT, taunt, cleanse, escape,
   monster debuffs on the player, role passives
   ============================================================ */
Object.assign(SKILL_ANIM, { taunt: 'guard', charge: 'dash', combo: 'slash', whirl: 'spin', rush: 'dash', focus: 'guard', crescent: 'slash', smoke: 'throw', assassin: 'pray', venom: 'bow', leap: 'dash', storm: 'cast', blink: 'cast', heal: 'pray', cleanse: 'pray', angel: 'pray' });
Object.assign(SKILL_SHOUT, { taunt: 'uooa', charge: 'hya', combo: 'ha', whirl: 'haiya', rush: 'hya', focus: 'hoo', crescent: 'sha', smoke: 'ha', assassin: 'hoo', venom: 'ha', leap: 'hu', storm: 'eia', blink: 'ha', heal: 'haa', cleanse: 'aaa', angel: 'aaa' });
const SKILL_MAXLV = 5;
const DMG_TYPES = ['proj', 'nova', 'cone', 'dash', 'combo', 'storm', 'rain'];

/* ---- skill levels ---- */
const SkillLv = {
  ensure(S) { if (!S.skillLv) S.skillLv = {}; if (S.skillPts === undefined) S.skillPts = Math.max(0, S.level - 1); },
  get(id) { const S = Save.d; return (S && S.skillLv && S.skillLv[id]) || 1; },
  role() { return Save.d ? Cls.of(Save.d).role : 'melee'; },
  // multipliers for a given level (defaults to current)
  f(id, lv) {
    lv = lv || this.get(id); const k = lv - 1;
    const aw = Cls.isAwkSkill(Save.d, id) ? 1.3 : 1;
    return { dmg: (1 + .15 * k) * aw, heal: (1 + .12 * k) * (this.role() === 'support' ? 1.2 : 1) * aw, dur: (1 + .1 * k) * (aw > 1 ? 1.2 : 1), cd: Math.max(.5, 1 - .04 * k), mp: k };
  },
  mp(id, lv) { return SKILLS[id].mp + this.f(id, lv).mp; },
  cd(id, lv) { return +(SKILLS[id].cd * this.f(id, lv).cd).toFixed(1); },
  max() { return Save.d && Save.d.awk ? 10 : SKILL_MAXLV; },
  canUp(id) { const S = Save.d; return S.skillPts > 0 && this.get(id) < this.max(); },
  up(id) {
    const S = Save.d; if (!this.canUp(id)) return false;
    S.skillPts--; S.skillLv[id] = this.get(id) + 1; Audio.sfx('level');
    UI.toast(`${SKILLS[id].name} เลเวล ${S.skillLv[id]}!`, 'quest'); Game.autosave(); UI.skillDot(); return true;
  }
};

/* ---- monster debuffs applied to the player ---- */
const MON_DEBUFF = { wolf: ['poison', .12, 4], goblin: ['poison', .15, 5], bat: ['poison', .2, 4], skel: ['slowed', .25, 3], boss: ['curse', .25, 5] };

const RoleSys = {
  tick: 0,
  dot(sk, atk, L) { return sk.dot ? { dps: atk * sk.dot.k * L.dmg, t: sk.dot.t * L.dur, col: sk.col } : null; },
  applyDot(m, d) {
    if (!d || m.dead) return;
    // stronger poison replaces weaker, durations refresh
    if (!m.dotT || m.dotT <= 0 || d.dps >= (m.dotDps || 0)) m.dotDps = d.dps;
    m.dotT = Math.max(m.dotT || 0, d.t); m.dotCol = d.col; m.dotAcc = m.dotAcc || 0;
  },
  update(dt) {
    const P = Player, S = Save.d;
    for (const m of Monsters.list) {
      if (m.dead) { m.dotT = 0; m.weakT = 0; continue; }
      if (m.weakT > 0) m.weakT -= dt;
      if (m.dotT > 0) {
        m.dotT -= dt; m.dotAcc = (m.dotAcc || 0) + dt;
        if (Math.random() < dt * 8) Particles.add(m.x + rand(-.4, .4), (m.d.fly ? 2 : m.d.h * .6) + rand(0, .6), m.z + rand(-.4, .4), { c: m.dotCol || [.6, .9, .3], s: .3, life: .6, vy: 1 });
        if (m.dotAcc >= .5) {
          m.dotAcc -= .5; if (m.barrier) continue;
          const dmg = Math.max(1, Math.round(m.dotDps * .5)); m.hp -= dmg; m.flash = .4;
          UI.dmgNum(m.x, (m.d.fly ? 2.2 : m.d.h) + .3, m.z, dmg, 'dot');
          if (m.hp <= 0) Combat.kill(m);
        }
      }
    }
    if (!S || P.dead) return;
    // player debuff visuals and poison ticks
    this.tick += dt;
    const B = S.buffs;
    if (B.poison && Math.random() < dt * 10) Particles.add(P.x + rand(-.5, .5), 1 + rand(0, 1), P.z + rand(-.5, .5), { c: [.55, .95, .35], s: .28, life: .6, vy: 1.2 });
    if (B.slowed && Math.random() < dt * 8) Particles.add(P.x + rand(-.5, .5), .2, P.z + rand(-.5, .5), { c: [.6, .8, 1], s: .3, life: .5, vy: .3 });
    if (B.curse && Math.random() < dt * 8) Particles.add(P.x + rand(-.5, .5), 2.2 + rand(0, .4), P.z + rand(-.5, .5), { c: [.75, .45, 1], s: .3, life: .7, vy: -.4 });
    if (B.ward && Math.random() < dt * 6) Particles.ring(P.x, 1.2, P.z, 1.1, 3, [.6, .85, 1], .4, .25);
    if (B.angel && Math.random() < dt * 5) Particles.add(P.x + rand(-.3, .3), 2.6, P.z - .3, { c: [1, 1, .8], s: .3, life: .8, vy: .5 });
    if (this.tick >= 1) {
      this.tick = 0;
      if (B.poison) { const d = Math.max(1, Math.round(S.poisonDps || 3)); S.hp -= d; UI.dmgNum(P.x, 2.6, P.z, d, 'player'); if (S.hp <= 0) { S.hp = 0; if (!this.tryRevive()) Game.die(); } }
    }
  },
  /* called from Combat.hitPlayer before damage; returns multiplier (0 = no damage) */
  onPlayerHit(raw, src) {
    const S = Save.d, P = Player, st = P.stats; let k = 1;
    if (src && src.weakT > 0) k *= .7;
    if (S.buffs.ward) k *= .6;
    if (SkillLv.role() === 'tank' && S.hp < st.maxhp * .3) k *= .85;
    // monster debuffs
    if (src && src.type && MON_DEBUFF[src.type] && !S.buffs.ward) {
      const [b, ch, t] = MON_DEBUFF[src.type];
      if (Math.random() < ch) {
        const first = !S.buffs[b]; S.buffs[b] = Math.max(S.buffs[b] || 0, t);
        if (b === 'poison') S.poisonDps = 1 + src.d.lvl * .8;
        if (first) { UI.floatText(P.x, 3.1, P.z, BUFFS[b].name + '!', 'immune'); if (b !== 'poison') P.recalc(); }
      }
    }
    return k;
  },
  tryRevive() {
    const S = Save.d, P = Player; if (!S.buffs.angel) return false;
    delete S.buffs.angel; const st = P.stats; S.hp = Math.round(st.maxhp * .5); S.mp = Math.max(S.mp, Math.round(st.maxmp * .3));
    for (const k in S.buffs) if (BUFFS[k] && BUFFS[k].bad) delete S.buffs[k];
    Fx.pillar(P.x, P.z, 1.8, 9, [1, 1, .8], 1.0); Fx.shock(P.x, P.z, 4, [1, .95, .7], .7); Particles.burst(P.x, 1.5, P.z, 60, [1, 1, .85], 5, 1, .5, 3);
    UI.banner('ฟื้นคืนชีพ!', 'crit'); Audio.sfx('level'); VoiceFx.shout('aaa', P.sheet, .2); P.recalc(); Game.safeT = 1.5; return true;
  },
  cleanse() { const S = Save.d; let n = 0; for (const k in S.buffs) if (BUFFS[k] && BUFFS[k].bad) { delete S.buffs[k]; n++; } Player.recalc(); return n; },
  /* role passives used by Combat */
  critBonus() { const B = Save.d.buffs; return (B.frenzy ? .2 : 0) + (B.assassin ? .35 : 0) + (SkillLv.role() === 'melee' ? .05 : 0); },
  dmgBonus(m) { return SkillLv.role() === 'ranged' && dist2(m.x, m.z, Player.x, Player.z) > 36 ? 1.12 : 1; },
  /* new skill types (called from Skills.exec impact) */
  impact(sk, id, c) {
    const P = Player, S = Save.d, st = P.stats, col = sk.col, L = c.L;
    switch (sk.type) {
      case 'taunt': {
        let n = 0;
        for (const m of Monsters.list) { if (m.dead || m.zone !== P.zone || dist2(m.x, m.z, P.x, P.z) > sk.r * sk.r) continue; m.weakT = sk.t * L.dur; n++; if (!m.d.boss && !m.d.wboss) { m.aggro = true; m.state = 'chase'; m.atkCD = Math.max(m.atkCD, .5); UI.mark(m); } Particles.burst(m.x, m.d.h + .6, m.z, 6, [1, .4, .3], 2, .5, .35, 2); }
        for (let i = 0; i < 3; i++) setTimeout(() => Fx.shock(P.x, P.z, sk.r * (.45 + i * .28), [1, .45 + i * .1, .3], .45), i * 110);
        Fx.glow(P.x, 2, P.z, 1.8, [1, .5, .3], .4); Game.shake(.35); Audio.sfx('boss');
        UI.floatText(P.x, 3.4, P.z, n ? `ยั่วยุ ${n} ตัว` : 'ไม่มีศัตรูในระยะ', 'immune');
        break;
      }
      case 'combo': {
        const t = c.tgt; const hits = sk.hits;
        for (let i = 0; i < hits; i++) setTimeout(() => {
          if (!t || t.dead || P.dead) return; const last = i === hits - 1;
          if (dist2(t.x, t.z, P.x, P.z) > (sk.r + 1.5) ** 2) return;
          P.face = Math.atan2(t.x - P.x, t.z - P.z);
          if (i > 0) { const rg = P.getRig(); rg.clip = null; rg.play('slash', id === 'crescent' ? 3 : 2.4); }
          Combat.damageMonster(t, c.dmg * (last ? 1.5 : 1), { crit: c.crit });
          Fx.arc(t.x, (t.d.fly ? 1.8 : t.d.h * .55), t.z, P.face + (i % 2 ? 1.2 : -1.2), i % 2 ? .5 : -.5, 1.5 + (last ? .8 : 0), last ? [1, 1, .8] : col, .22);
          Fx.star(t.x, (t.d.fly ? 1.8 : t.d.h * .55), t.z, last ? 1.6 : 1, col, .2);
          if (id === 'crescent') { const rg = P.getRig(); rg.pose(P.x, 0, P.z, P.face, CHAR_SCALE); Fx.ghost(rg, CharModels[P.sheet], col, .25); }
          Audio.sfx(last ? 'crit' : 'hit'); if (last) Game.shake(.2);
        }, i * (id === 'crescent' ? 95 : 150));
        break;
      }
      case 'escape': {
        // jump away from the nearest enemy (or backwards)
        const near = Game.nearestMonster(10); const away = near ? Math.atan2(P.x - near.x, P.z - near.z) : P.face + Math.PI;
        const x0 = P.x, z0 = P.z;
        for (const m of Monsters.list) if (!m.dead && m.zone === P.zone && dist2(m.x, m.z, x0, z0) < sk.r * sk.r) { m.slow = Math.max(m.slow || 0, sk.slow * L.dur); }
        Game.addBuff('ward', Math.max(S.buffs.ward || 0, 2));
        if (sk.blink) {
          let x = P.x, z = P.z; for (let d = .5; d <= sk.dist; d += .5) { const nx = x0 + Math.sin(away) * d, nz = z0 + Math.cos(away) * d; const r = Col.resolve(nx, nz, .55); if (Math.abs(r[0] - nx) > .05 || Math.abs(r[1] - nz) > .05) break; x = nx; z = nz; }
          Fx.shock(x0, z0, sk.r, [.75, .55, 1], .5); Fx.spikes(x0, z0, sk.r * .8, 10); Particles.burst(x0, 1, z0, 30, [.8, .6, 1], 4, .6, .4, 2);
          P.x = x; P.z = z; World.clampBounds(P); Fx.pillar(x, z, 1, 4, [.75, .55, 1], .4); Particles.burst(x, 1, z, 30, [.8, .6, 1], 4, .6, .4, 2);
          if (near) P.face = Math.atan2(near.x - P.x, near.z - P.z);
        } else {
          P.dashDir = away; P.dashT = .32; P.dashSpd = sk.dist / .32; P.moveTo = null;
          Fx.shock(x0, z0, sk.r, [.6, 1, .6], .45); for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; Fx.arc(x0 + Math.cos(a) * 1.5, .3, z0 + Math.sin(a) * 1.5, a, 0, 1.2, [.8, 1, .7], .5); }
          if (near) P.onDashEnd = () => { P.face = Math.atan2(near.x - P.x, near.z - P.z); };
        }
        Audio.sfx('warp');
        break;
      }
      case 'storm': {
        let x, z; if (c.tgt) { x = c.tgt.x; z = c.tgt.z; } else { [x, z] = c.fwd(6); }
        Effects.add({ kind: 'ring', x, z, r: sk.r, dur: .5, col: [...col, .9] });
        for (let k = 0; k < 3; k++) setTimeout(() => {
          for (let i = 0; i < 26; i++) { const a = i / 26 * TAU + k, rr = sk.r * (.3 + Math.random() * .7); Particles.add(x + Math.cos(a) * rr, .3 + Math.random() * 3, z + Math.sin(a) * rr, { c: pick([[1, .5, .15], [1, .75, .3], [1, .3, .1]]), s: .6, life: .7, vx: -Math.sin(a) * 5, vz: Math.cos(a) * 5, vy: 2.5 }); }
          Fx.shock(x, z, sk.r * (.6 + k * .2), col, .4); if (k === 0) Fx.pillar(x, z, sk.r * .5, 6, col, .8);
          for (const m of Monsters.list) if (!m.dead && m.zone === P.zone && dist2(m.x, m.z, x, z) < (sk.r + m.d.r) ** 2) { Combat.damageMonster(m, c.dmg * (k === 0 ? 1 : .3), { crit: c.crit, dot: k === 0 ? this.dot(sk, st.atk, L) : null }); }
          Audio.sfx(k === 0 ? 'slam' : 'hit'); if (k === 0) Game.shake(.3);
        }, 250 + k * 280);
        break;
      }
      case 'cleanse': {
        const n = this.cleanse(); const h = Math.round(st.maxhp * sk.heal * L.heal); S.hp = Math.min(st.maxhp, S.hp + h); UI.dmgNum(P.x, 3, P.z, h, 'heal');
        for (const [k, t] of sk.buffs) Game.addBuff(k, Math.max(S.buffs[k] || 0, t * L.dur));
        for (let i = 0; i < 4; i++) setTimeout(() => Fx.shock(P.x, P.z, 1 + i * 1.1, [.6, .9, 1], .45), i * 80);
        for (let i = 0; i < 36; i++) { const a = i / 36 * TAU; Particles.add(P.x + Math.cos(a) * .6, .3, P.z + Math.sin(a) * .6, { c: [.7, .95, 1], s: .4, life: .9, vx: Math.cos(a) * 5, vz: Math.sin(a) * 5, vy: 2, drag: 2 }); }
        for (const m of Monsters.list) if (!m.dead && m.zone === P.zone && dist2(m.x, m.z, P.x, P.z) < (sk.r + m.d.r) ** 2) Combat.damageMonster(m, c.dmg, { crit: c.crit });
        UI.floatText(P.x, 3.4, P.z, n ? `ล้างสถานะ ${n} อย่าง` : 'ชำระล้าง', 'immune'); Audio.sfx('correct');
        break;
      }
    }
  }
};

