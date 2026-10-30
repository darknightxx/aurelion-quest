
/* ============================================================
   MVP & mini-boss (RO style): giant named bosses spawn on a fixed
   world-clock schedule at their lairs (every client sees the same
   timer, so spawns are announced server-wide). The one who lands
   the killing blow becomes MVP: big banner, bonus EXP, an MVP
   reward, and the two rarest drops are announced to everyone.
   ============================================================ */
const MVP_DEFS = {
  mvp_slimeking: { base: 'slime', tier: 'mini', name: 'ราชาสไลม์', lvl: 8, k: 2.4, hp: 900, atk: 22, def: 6, xp: 600, coin: [120, 200], period: 600, zone: 'world', x: 30, z: 112, place: 'ทุ่งหญ้าทางใต้ของเมือง',
    drops: [['hp_l', .8], ['rf_stone', .6], ['m_jelly', 1], ['pet_treat', .25], ['egg_slimep', .08]] },
  mvp_alpha: { base: 'wolf', tier: 'mini', name: 'หมาป่าเขี้ยวเงิน', lvl: 10, k: 1.9, hp: 1400, atk: 30, def: 9, xp: 900, coin: [180, 260], period: 720, zone: 'world', x: -62, z: -64, place: 'ป่ากระซิบตะวันตก',
    drops: [['m_fang', 1], ['rf_stone', .7], ['a_hunter', .3], ['hp_l', .6], ['egg_dog', .06]] },
  mvp_shroomking: { base: 'shroom', tier: 'mvp', name: 'เห็ดยักษ์โบราณ', lvl: 13, k: 2.8, hp: 3200, atk: 34, def: 12, xp: 2200, coin: [400, 600], period: 1200, zone: 'world', x: -98, z: -24, place: 'ดงเห็ดป่ากระซิบ',
    drops: [['m_cap', 1], ['rf_stone', 1], ['rf_stone2', .35], ['rf_guard', .15], ['hp_l', .9], ['r_mana', .25], ['egg_fox', .05]] },
  mvp_warlord: { base: 'goblin', tier: 'mvp', name: 'จอมทัพก็อบลิน', lvl: 15, k: 2.1, hp: 4200, atk: 42, def: 15, xp: 3000, coin: [500, 800], period: 1500, zone: 'world', x: 82, z: -96, place: 'ค่ายก็อบลิน',
    drops: [['rf_stone', 1], ['rf_stone2', .45], ['rf_guard', .2], ['w_mith', .35], ['a_moon', .25], ['r_heart', .08], ['egg_monkey', .06]] },
  mvp_batqueen: { base: 'bat', tier: 'mini', name: 'ราชินีค้างคาวผลึก', lvl: 12, k: 2.0, hp: 1600, atk: 32, def: 8, xp: 1100, coin: [200, 320], period: 720, zone: 'dungeon', x: DX - 2, z: -30, place: 'ถ้ำผลึกชั้นบน',
    drops: [['mp_s', 1], ['rf_stone', .7], ['r_mana', .2], ['egg_bat', .05]] },
  mvp_deathknight: { base: 'skel', tier: 'mvp', name: 'อัศวินกระดูกมรณะ', lvl: 18, k: 1.8, hp: 6000, atk: 50, def: 20, xp: 4800, coin: [700, 1000], period: 1800, zone: 'dungeon', x: DX + 4, z: -58, place: 'ทางเดินโครงกระดูก',
    drops: [['m_bone', 1], ['rf_stone2', .6], ['rf_guard', .3], ['w_crys', .06], ['r_heart', .1], ['a_moon', .35], ['egg_dragon', .02]] }
};
for (const id in MVP_DEFS) {
  const D = MVP_DEFS[id], b = MONSTERS[D.base];
  MONSTERS[id] = Object.assign({}, b, { name: D.name, lvl: D.lvl, hp: D.hp, atk: D.atk, def: D.def, xp: D.xp, coin: D.coin, r: (b.r || .7) * Math.min(2, D.k * .8), h: (b.h || 1.4) * D.k, spd: b.spd * .9, aggro: Math.max(10, b.aggro || 0), range: (b.range || 1.8) * Math.min(1.8, D.k * .75), elite: true, mvp: D.tier, cardTier: D.tier === 'mvp' ? 'b' : 'm', drops: D.drops.slice(), respawn: 1e9, scale: D.k, baseType: D.base });
}
// draw the base monster scaled up
{
  for (const id in MVP_DEFS) GDRAW[id] = (R, m, sc, tint, fl, t) => {
    const k = m.d.scale, base = m.d.baseType, oc = M4.compose;
    const fake = Object.create(m); fake.type = base; fake.dead = false; fake.deathT = undefined; fake.zone = Player.zone;
    M4.compose = (o, x, y, z, rx, ry, rz, sx, sy, sz) => oc(o, m.x + (x - m.x) * k, y * k, m.z + (z - m.z) * k, rx, ry, rz, sx * k * sc, sy * k * sc, sz * k * sc);
    try { Monsters._drawRaw.call({ list: [fake], boss: Monsters.boss }, R, t); } finally { M4.compose = oc; }
    if (m.d.mvp === 'mvp' && !m.dead && Math.random() < .3) Particles.add(m.x + rand(-1, 1) * k * .4, rand(.2, m.d.h), m.z + rand(-1, 1) * k * .4, { c: [1, .75, .25], s: .35, life: .8, vy: 1 });
  };
}

const MVPSys = {
  list: [], cycle: {}, collect: null,
  now() { return (Net.be && Net.be.now ? Net.be.now() : Date.now()) / 1000; },
  cyc(D) { return Math.floor(this.now() / D.period); },
  left(D) { return D.period - (this.now() % D.period); },
  init() {
    this.list = [];
    for (const id in MVP_DEFS) { const D = MVP_DEFS[id]; const [x, z] = Col.resolve(D.x, D.z, 1.2); const m = makeMonster(id, x, z, { x, z, r: 10 }); m.dead = true; m.respawn = 1e9; m.mvpId = id; Monsters.list.push(m); this.list.push(m); }
  },
  st() { const S = Save.d; S.mvp = S.mvp || { kills: {}, dead: {} }; return S.mvp; },
  update(dt) {
    const st = this.st();
    for (const m of this.list) {
      const D = MVP_DEFS[m.mvpId], c = this.cyc(D); if (!Monsters.list.includes(m)) Monsters.list.push(m);
      if (m.dead) { m.respawn = 1e9; if (st.dead[m.mvpId] !== c && this.cycle[m.mvpId] !== c) { this.cycle[m.mvpId] = c; Monsters.revive(m); m.x = m.home.x; m.z = m.home.z; m.hp = m.max; const fresh = this.left(D) > D.period - 90; if (fresh) Announce.show('spawn', `${D.tier === 'mvp' ? 'บอส MVP' : 'มินิบอส'} ${D.name} ปรากฏตัวที่${D.place}! (${zoneTH(D.zone)})`); } }
    }
  },
  onKill(m) {
    const D = MVP_DEFS[m.mvpId], S = Save.d, st = this.st(); st.dead[m.mvpId] = this.cyc(D); st.kills[m.mvpId] = (st.kills[m.mvpId] || 0) + 1; m.respawn = 1e9;
    const got = this.collect || []; this.collect = null;
    const rar = got.map(id => [id, (m.d.drops.find(d => d[0] === id) || [id, 1])[1]]).sort((a, b) => a[1] - b[1]).slice(0, 2).map(([id]) => ITEMS[id].name);
    const bonus = Math.round(m.d.xp * (D.tier === 'mvp' ? 1 : .5)); Game.gainXP(bonus);
    const rew = D.tier === 'mvp' ? [['rf_stone2', 1], ['hp_l', 3]] : [['rf_stone', 2], ['hp_l', 1]]; for (const [i, n] of rew) Game.addItem(i, n, true);
    if (D.tier === 'mvp') { Gems.add(10, 'MVP ' + D.name); Titles.grant('MVP ' + D.name, 'กำจัด ' + D.name); }
    UI.banner(D.tier === 'mvp' ? '👑 MVP!' : 'ปราบมินิบอส!', 'level'); Audio.sfx('level');
    for (let i = 0; i < 50; i++) Particles.add(Player.x + rand(-1, 1), rand(0, 1), Player.z + rand(-1, 1), { c: [1, .85, .3], s: .5, life: 1.6, vy: rand(2, 7) });
    Announce.send('mvp', `${S.name} กำจัด ${D.name} และได้รับ${D.tier === 'mvp' ? ' MVP' : 'ชัยชนะ'}!${rar.length ? ' ดรอป: ' + rar.join(', ') : ''}`);
    S.stats.mvpKills = (S.stats.mvpKills || 0) + (D.tier === 'mvp' ? 1 : 0); Save.write();
  }
};
const zoneTH = z => ({ world: 'ทวีป Aurelion', dungeon: 'ถ้ำผลึก', temple: 'วัดร้าง', amazon: 'ป่าอเมซอน' }[z] || z);
{
  const omi = Monsters.init.bind(Monsters); Monsters.init = function () { omi(); MVPSys.init(); };
  const ok = Combat.kill.bind(Combat);
  Combat.kill = function (m) { if (!m.mvpId) return ok(m); MVPSys.collect = []; try { ok(m); } finally { MVPSys.onKill(m); } };
  const od = Loot.drop.bind(Loot); Loot.drop = function (m, id, n) { if (MVPSys.collect) MVPSys.collect.push(id); return od(m, id, n); };
  const oa = Game.addItem.bind(Game); Game.addItem = function (id, n, silent) { if (MVPSys.collect && n > 0 && !Loot._killing) MVPSys.collect.push(id); return oa(id, n, silent); };
  const ou = Game.update.bind(Game); Game.update = function (dt) { ou(dt); if (!this.started || !Save.d) return; this._mvpT = (this._mvpT || 0) + dt; if (this._mvpT > 1) { this._mvpT = 0; MVPSys.update(1); } };
  const onp = UI.netPlates.bind(UI);
  UI.netPlates = function (want) {
    onp(want);
    for (const w of want) { if (w.key[0] !== 'm') continue; const m = MVPSys.list.find(x => 'm' + x.id === w.key); if (!m) continue; const h0 = w.html; w.html = () => h0().replace('<i class="elt">หัวหน้า</i>', `<i class="elt ${m.d.mvp}">${m.d.mvp === 'mvp' ? 'MVP' : 'มินิบอส'}</i>`); w.cls = (w.cls || '') + ' mvpplate'; }
  };
  // revive() moves elites randomly; MVPs stay at the lair
}
UI.extraPanels = UI.extraPanels || {}; UI.extraPanels.mvp = 'pMvp';
UI.pMvp = function () {
  const st = MVPSys.st();
  const rows = Object.keys(MVP_DEFS).map(id => {
    const D = MVP_DEFS[id], m = MVPSys.list.find(x => x.mvpId === id), alive = m && !m.dead, left = Math.ceil(MVPSys.left(D)), mm = Math.floor(left / 60), ss = String(left % 60).padStart(2, '0');
    const top = D.drops.slice().sort((a, b) => a[1] - b[1]).slice(0, 3).map(([i, c]) => `${ITEMS[i].name} ${+(c * 100).toFixed(1)}%`).join(' · ');
    return `<li class="mvprow ${alive ? 'alive' : ''}"><span class="mvpemo">${CARD_EMOJI[D.base] || '👾'}</span><div><span><b>${D.name}</b> <i class="elt ${D.tier}">${D.tier === 'mvp' ? 'MVP' : 'มินิบอส'}</i></span><small>Lv.${D.lvl} · ${zoneTH(D.zone)} · ${D.place}</small><small>ดรอปหายาก: ${top}</small><small>ปราบแล้ว ${st.kills[id] || 0} ครั้ง · เกิดทุก ${Math.round(D.period / 60)} นาที</small></div><div class="mvpst">${alive ? '<b class="on">ออกอาละวาดอยู่!</b>' : `<span>เกิดใหม่ใน</span><b>${mm}:${ss}</b>`}<button class="btn sm" data-mv="${id}">นำทาง</button></div></li>`;
  }).join('');
  this.setPanel(`👑 บอส MVP และมินิบอส`, `<p class="muted">บอสเกิดตามเวลาเดียวกันทั้งเซิร์ฟเวอร์ ผู้ที่ปิดฉากเป็น MVP ได้รางวัลพิเศษ ชื่อและของที่ดรอปจะถูกประกาศให้ทุกคนเห็น</p><ul class="mvplist">${rows}</ul>`, true);
  this.el.pbody.onclick = e => { const b = e.target.closest('[data-mv]'); if (!b) return; const D = MVP_DEFS[b.dataset.mv]; this.closePanel(); Nav.go({ zone: D.zone, x: D.x + 6, z: D.z + 6, r: 4, label: 'ไปยังรังของ ' + D.name }); };
  clearTimeout(this._mvpI); this._mvpI = setTimeout(() => { if (WM.isOpen('mvp')) WM.render('mvp'); }, 1000);
};
