/* ============================================================
   Season Pass: levels 1-50, free / normal / premium tracks
   ============================================================ */
Object.assign(ITEMS, {
  c_crystalw: { name: 'ปีกผลึกสวรรค์', kind: 'cos', slot: 'back', price: 0, desc: 'รางวัลสูงสุด Season Pass · ปีกผลึกเรืองแสง · SPD +3%', bonus: { spdPct: .03 }, icon: 'wingC', season: true },
  c_kingcrown: { name: 'มงกุฎราชันย์', kind: 'cos', slot: 'head', price: 0, desc: 'มงกุฎทองฝังอัญมณี จาก Season Pass พรีเมียม', icon: 'crown', season: true },
  c_star: { name: 'ออร่าดวงดาว', kind: 'cos', slot: 'aura', price: 0, desc: 'ดาวสีทองหมุนรอบตัว จาก Season Pass', icon: 'star4', season: true }
});
Object.assign(ICONS, {
  wingC: '<path d="M12 12 3 3l2 7-3 4 5-1 1 6 4-4zM12 12l9-9-2 7 3 4-5-1-1 6-4-4z" fill="#7fe6ff"/><path d="M12 12 4 4M12 12l8-8" stroke="#e8fbff" stroke-width="1"/>',
  pass: '<rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 5v14M12 10l1.2 2.4 2.6.4-1.9 1.8.5 2.6L12 16l-2.4 1.2.5-2.6-1.9-1.8 2.6-.4z" fill="currentColor"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2" fill="currentColor"/><path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="2" fill="none"/>'
});
const SEASON = { id: 's1', name: 'ซีซั่น 1: เสียงเพรียกแห่งผลึก', ends: new Date(2026, 11, 31, 23, 59).getTime(), maxLv: 50, xpPerLv: 100, lvGems: 120,
  passes: { normal: { name: 'Season Pass ธรรมดา', thb: 149, desc: 'ปลดล็อกแทร็กธรรมดาทุกเลเวล', perks: ['ปลดล็อกรางวัลแทร็กธรรมดา 50 ขั้น', 'ออร่าดวงดาว ที่เลเวล 50', 'ปีกมังกรเพลิง และออร่ารุ้งเจ็ดสี', 'เพชรรวมกว่า 900 เม็ด'] },
    premium: { name: 'Season Pass พรีเมียม', thb: 399, desc: 'รวมแทร็กธรรมดา + แทร็กพรีเมียม + ข้ามทันที 10 เลเวล', perks: ['ทุกอย่างในแบบธรรมดา', 'ข้ามทันที +10 เลเวล', 'ปีกผลึกสวรรค์ และฉายา "ราชันแห่งสยาม" ที่เลเวล 50', 'มงกุฎราชันย์ วงแหวนเทวดา และ ATK +3 ถาวร', 'เพชรรวมกว่า 3,000 เม็ด'] } } };
// reward: {g: gems, c: coins, it: [[id,n]], buff:[k,sec], perm:{atk}, title:'...'}
function seasonRewards() {
  const R = [];
  for (let L = 1; L <= 50; L++) {
    let free, normal, prem;
    // free track: modest, a reward every level
    if (L === 50) free = { g: 150, it: [['statbook', 1]], big: true };
    else if (L % 10 === 0) free = { g: 50 };
    else if (L % 5 === 0) free = { g: 20 };
    else free = [{ c: 100 + L * 10 }, { it: [['hp_s', 3]] }, { it: [['mp_s', 2]] }, { it: [['scroll', 1]] }][L % 4];
    // normal pass
    const nm = { 10: { buff: ['xp2', 7200], g: 50 }, 20: { it: [['c_rainbow', 1]] }, 30: { it: [['statbook', 2]], g: 80 }, 40: { it: [['c_dragon', 1]] }, 50: { it: [['c_star', 1]], g: 300, title: 'ผู้พิชิตซีซั่น 1', big: true } };
    normal = nm[L] || (L % 7 === 0 ? { it: [['feather', 1]] } : L % 3 === 0 ? { g: 25 } : L % 2 ? { it: [['hp_l', 2]] } : { c: 300 });
    // premium track
    const pm = { 5: { it: [['statbook', 1]], g: 60 }, 10: { it: [['c_halo', 1]] }, 15: { buff: ['luck', 7200], g: 80 }, 20: { it: [['feather', 5]], g: 200 }, 25: { it: [['c_kingcrown', 1]] }, 30: { perm: { atk: 3 }, g: 100 }, 35: { it: [['statbook', 2]], g: 120 }, 40: { g: 500, title: 'ตำนานผลึก' }, 45: { it: [['statbook', 3]], g: 150 }, 50: { it: [['c_crystalw', 1]], g: 1000, title: 'ราชันแห่งสยาม', big: true } };
    prem = pm[L] || (L % 2 ? { g: 40 } : { it: [['hp_l', 3], ['mp_s', 3]] });
    R.push({ L, free, normal, prem });
  }
  return R;
}
const SEASON_REWARDS = seasonRewards();
const SEASON_MISSIONS = {
  daily: [{ id: 'kill', name: 'ปราบมอนสเตอร์ 20 ตัว', n: 20, xp: 150 }, { id: 'correct', name: 'ตอบคำถามถูก 8 ข้อ', n: 8, xp: 150 }, { id: 'shrine', name: 'รับพรจากแท่นบูชา 1 ครั้ง', n: 1, xp: 100 }, { id: 'quest', name: 'ทำเควสสำเร็จ 1 เควส', n: 1, xp: 150 }],
  weekly: [{ id: 'kill', name: 'ปราบมอนสเตอร์ 150 ตัว', n: 150, xp: 600 }, { id: 'correct', name: 'ตอบคำถามถูก 50 ข้อ', n: 50, xp: 600 }, { id: 'boss', name: 'ปราบบอสยักษ์ศิลา', n: 1, xp: 700 }, { id: 'lvl', name: 'เลเวลอัป 2 ครั้ง', n: 2, xp: 400 }]
};
const QUEST_SXP = { main: 400, side: 200, daily: 150 };

const Season = {
  st() {
    const S = Save.d; if (!S) return null;
    if (!S.season || S.season.id !== SEASON.id) S.season = { id: SEASON.id, xp: 0, pass: null, claimed: { free: {}, normal: {}, prem: {} }, d: { day: today() }, w: { week: weekKey() } };
    const s = S.season; if (s.d.day !== today()) s.d = { day: today() }; if (s.w.week !== weekKey()) s.w = { week: weekKey() };
    return s;
  },
  level() { const s = this.st(); return Math.min(SEASON.maxLv, 1 + Math.floor(s.xp / SEASON.xpPerLv)); },
  has(track) { const p = this.st().pass; return track === 'free' || (track === 'normal' && !!p) || (track === 'prem' && p === 'premium'); },
  addXP(n, why) {
    const s = this.st(); if (!s) return; const before = this.level();
    s.xp = Math.min(s.xp + n, (SEASON.maxLv - 1) * SEASON.xpPerLv);
    const after = this.level();
    if (n >= 50 && why) UI.toast(`Season XP +${n} · ${why}`, 'info');
    if (after > before) { UI.toast(`Season Pass เลเวล ${after}! มีรางวัลรอรับ`, 'rare'); Audio.sfx('quest'); }
    UI.seasonDot();
  },
  bump(id, k = 1) {
    const s = this.st(); if (!s) return;
    for (const per of ['daily', 'weekly']) {
      const box = per === 'daily' ? s.d : s.w; const m = SEASON_MISSIONS[per].find(x => x.id === id); if (!m) continue;
      const was = box[id] || 0; if (was >= m.n) continue; box[id] = was + k;
      if (box[id] >= m.n) { this.addXP(m.xp, `ภารกิจซีซั่น: ${m.name}`); }
    }
  },
  claimable(track, L) { const s = this.st(); return this.has(track) && L <= this.level() && !s.claimed[track][L]; },
  anyClaim() { if (!Save.d) return false; const lv = this.level(); for (let L = 1; L <= lv; L++) for (const t of ['free', 'normal', 'prem']) if (this.claimable(t, L)) return true; return false; },
  grant(rw) {
    const S = Save.d; const got = [];
    if (rw.g) { Gems.add(rw.g, 'รางวัล Season Pass'); got.push(`เพชร ${rw.g}`); }
    if (rw.c) { S.coins += rw.c; got.push(`เหรียญ ${rw.c}`); }
    if (rw.it) for (const [id, n] of rw.it) { const it = ITEMS[id]; if (it.kind === 'cos' && S.inv[id]) { Gems.add(100, 'แลกของซ้ำ Season Pass'); got.push(`${it.name} (มีแล้ว → เพชร 100)`); } else { Game.addItem(id, n, true); got.push(it.name + (n > 1 ? ' ×' + n : '')); } }
    if (rw.buff) { Game.addBuff(rw.buff[0], (S.buffs[rw.buff[0]] || 0) + rw.buff[1]); got.push(BUFFS[rw.buff[0]].name + ' ' + Math.round(rw.buff[1] / 3600) + ' ชม.'); }
    if (rw.perm) { for (const k in rw.perm) S.perm[k] += rw.perm[k]; Player.recalc(); got.push('ATK +' + rw.perm.atk + ' ถาวร'); }
    if (rw.title) { S.extraTitles = S.extraTitles || []; if (!S.extraTitles.includes(rw.title)) S.extraTitles.push(rw.title); got.push(`ฉายา "${rw.title}"`); }
    return got;
  },
  claim(track, L) {
    if (!this.claimable(track, L)) return []; const s = this.st(); s.claimed[track][L] = Date.now();
    const rw = SEASON_REWARDS[L - 1][track]; return this.grant(rw);
  },
  claimAll() { const got = []; const lv = this.level(); for (let L = 1; L <= lv; L++) for (const t of ['free', 'normal', 'prem']) if (this.claimable(t, L)) got.push(...this.claim(t, L)); return got; },
  buyPass(kind) {
    const s = this.st(), p = SEASON.passes[kind], S = Save.d;
    if (kind === 'normal' && s.pass) return; if (kind === 'premium' && s.pass === 'premium') return;
    const upgrade = kind === 'premium' && s.pass === 'normal'; const thb = upgrade ? p.thb - SEASON.passes.normal.thb : p.thb;
    s.pass = kind; S.topup.spent += thb; Gems.log('฿' + thb, `ซื้อ ${p.name}${upgrade ? ' (อัปเกรด)' : ''} (ทดลอง)`);
    if (kind === 'premium') this.addXP(10 * SEASON.xpPerLv, 'ข้ามทันที 10 เลเวล');
    Audio.sfx('level'); Save.write(); UI.seasonDot();
  },
  buyLevels(n) {
    const S = Save.d, lv = this.level(); n = Math.min(n, SEASON.maxLv - lv); if (n <= 0) return false;
    const cost = n * SEASON.lvGems; if (S.gems < cost) { UI.toast('เพชรไม่พอ ไปหน้าเติมเพชรได้เลย', 'warn'); return false; }
    S.gems -= cost; Gems.log('−' + cost, `ปลดล็อก Season Pass +${n} เลเวล`); const s = this.st();
    s.xp = Math.min((SEASON.maxLv - 1) * SEASON.xpPerLv, (lv - 1 + n) * SEASON.xpPerLv + (s.xp % SEASON.xpPerLv));
    UI.toast(`ปลดล็อกถึงเลเวล ${this.level()} แล้ว`, 'rare'); Audio.sfx('level'); UI.gemPop(); UI.seasonDot(); Save.write(); return true;
  }
};

function addSeasonModels(R) {
  let g = new Geo(92); g.jit = .06;
  for (let i = 0; i < 5; i++) { const rz = .9 - i * .36, L = 1.0 - i * .1; g.at(.1, 0, 0, 0, 1, 1, 1, 0, rz - Math.PI / 2); g.cyl(0, .05, 0, .09, 0, L, 4, i % 2 ? hexc('#9ff2ff') : hexc('#6fd8f5')); g.reset(); }
  g.sphere(.1, 0, 0, .1, hexc('#e8fbff'), 5, 4); Models.c_crystalw = R.mesh(g);
  g = new Geo(93); g.cyl(0, 0, 0, .5, .5, .2, 12, hexc('#e2b54a'), hexc('#f3d27a'), false);
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; g.cyl(Math.cos(a) * .46, .2, Math.sin(a) * .46, .1, 0, i % 2 ? .28 : .4, 4, hexc('#f3d27a')); g.sphere(Math.cos(a) * .51, .1, Math.sin(a) * .51, .05, i % 2 ? hexc('#d65aa0') : hexc('#6fe0f0'), 4, 3); }
  Models.c_kingcrown = R.mesh(g);
}

Object.assign(UI, {
  seasonDot() { const b = document.querySelector('#menubtns [data-p="season"]'); if (b) b.classList.toggle('dot', Season.anyClaim()); },
  rwHtml(rw) {
    const parts = [];
    if (rw.it) for (const [id, n] of rw.it) parts.push(`<span class="rwi ${ITEMS[id].kind === 'cos' ? 'cos' : ''}">${this.itemIcon(id)}<em>${n > 1 ? '×' + n : ''}</em></span>`);
    if (rw.g) parts.push(`<span class="rwi gem">${gemSvg()}<em>${rw.g}</em></span>`);
    if (rw.c) parts.push(`<span class="rwi">${icon('coin')}<em>${rw.c}</em></span>`);
    if (rw.buff) parts.push(`<span class="rwi">${icon('scroll')}<em>${BUFFS[rw.buff[0]].name}</em></span>`);
    if (rw.perm) parts.push(`<span class="rwi">${icon('sword')}<em>+${rw.perm.atk}</em></span>`);
    if (rw.title) parts.push(`<span class="rwi ttl">ฉายา</span>`);
    return parts.join('');
  },
  rwTitle(rw) { const t = []; if (rw.it) rw.it.forEach(([id, n]) => t.push(ITEMS[id].name + (n > 1 ? ' ×' + n : ''))); if (rw.g) t.push('เพชร ' + rw.g); if (rw.c) t.push('เหรียญ ' + rw.c); if (rw.buff) t.push(BUFFS[rw.buff[0]].name); if (rw.perm) t.push('ATK +' + rw.perm.atk + ' ถาวร'); if (rw.title) t.push('ฉายา ' + rw.title); return t.join(' · '); },
  pSeason(o) {
    Gems.ensure(); const s = Season.st(), S = Save.d, lv = Season.level(); const tab = o.tab || 'rw'; this.panelOpt.tab = tab;
    const inLv = lv >= SEASON.maxLv ? SEASON.xpPerLv : s.xp % SEASON.xpPerLv;
    const left = SEASON.ends - Date.now(); const dd = Math.max(0, Math.floor(left / 864e5));
    const passBtns = s.pass === 'premium' ? '<span class="passown prem">พรีเมียม</span>' : `${s.pass ? '<span class="passown">ธรรมดา</span>' : `<button class="btn passbtn" data-pass="normal">ธรรมดา ฿${SEASON.passes.normal.thb}</button>`}<button class="btn passbtn prem" data-pass="premium">${s.pass ? `อัปเกรดพรีเมียม ฿${SEASON.passes.premium.thb - SEASON.passes.normal.thb}` : `พรีเมียม ฿${SEASON.passes.premium.thb}`}</button>`;
    let body = '';
    if (tab === 'rw') {
      const cell = (track, r) => {
        const rw = r[track], got = s.claimed[track][r.L], has = Season.has(track), reach = r.L <= lv, can = has && reach && !got;
        return `<button class="rwc ${track} ${rw.big ? 'big' : ''} ${got ? 'got' : ''} ${can ? 'can' : ''} ${!has ? 'locked' : ''}" data-cl="${track}:${r.L}" title="${esc(this.rwTitle(rw))}" ${can ? '' : 'aria-disabled="true"'}>${this.rwHtml(rw)}${got ? '<span class="tick">รับแล้ว</span>' : !has ? `<span class="lk">${icon('lock')}</span>` : ''}</button>`;
      };
      body = `<div class="sprow"><div class="spleg"><span></span><b class="t-free">ฟรี</b><b class="t-normal">ธรรมดา</b><b class="t-prem">พรีเมียม</b></div>
        <div class="sptrack" id="sptrack">${SEASON_REWARDS.map(r => `<div class="spcol ${r.L <= lv ? 'reached' : ''} ${r.L === lv ? 'cur' : ''} ${r.L % 10 === 0 ? 'mile' : ''}"><span class="splv">${r.L}</span>${cell('free', r)}${cell('normal', r)}${cell('prem', r)}</div>`).join('')}</div></div>
        <div class="sphint">${s.pass ? '' : 'ซื้อ Season Pass เพื่อปลดล็อกแทร็กธรรมดาและพรีเมียม รางวัลที่เลเวลถึงแล้วจะรับย้อนหลังได้ทันที · '}แตะช่องที่เรืองแสงเพื่อรับ · เลเวล 50 คือรางวัลที่ดีที่สุด</div>`;
    } else {
      const mrow = (per, m) => { const box = per === 'daily' ? s.d : s.w; const v = Math.min(m.n, box[m.id] || 0); return `<li class="${v >= m.n ? 'done' : ''}"><div><b>${m.name}</b><div class="xpb"><i style="width:${v / m.n * 100}%"></i></div><small>${v}/${m.n}</small></div><span class="sxp">+${m.xp} XP</span></li>`; };
      body = `<h4>ภารกิจรายวัน <small class="muted">รีเซ็ตทุกวัน</small></h4><ul class="smis">${SEASON_MISSIONS.daily.map(m => mrow('daily', m)).join('')}</ul>
        <h4>ภารกิจรายสัปดาห์ <small class="muted">รีเซ็ตทุกวันจันทร์</small></h4><ul class="smis">${SEASON_MISSIONS.weekly.map(m => mrow('weekly', m)).join('')}</ul>
        <h4>Season XP จากเควส</h4><p class="muted">เควสหลัก +${QUEST_SXP.main} · เควสย่อย +${QUEST_SXP.side} · เควสประจำวัน +${QUEST_SXP.daily} · ปราบมอนสเตอร์ +2 · ตอบถูก +5</p>`;
    }
    this.setPanel(`${icon('pass')} Season Pass <span class="demo">โหมดทดลอง</span>`, `
      <div class="sphead"><div class="spinfo"><small>${SEASON.name} · เหลืออีก ${dd} วัน</small><div class="splvl"><span class="lvbig">${lv}</span><div class="spbar"><div class="xpb"><i style="width:${inLv / SEASON.xpPerLv * 100}%"></i></div><small>${lv >= SEASON.maxLv ? 'เลเวลสูงสุดแล้ว' : `${inLv} / ${SEASON.xpPerLv} XP ถึงเลเวล ${lv + 1}`}</small></div></div></div>
        <div class="spbuy">${passBtns}</div></div>
      <div class="spact"><div class="tabs"><button class="tab ${tab === 'rw' ? 'on' : ''}" data-tab="rw">รางวัล</button><button class="tab ${tab === 'ms' ? 'on' : ''}" data-tab="ms">ภารกิจซีซั่น</button></div>
        <div class="spbtns">${lv < SEASON.maxLv ? `<button class="btn sm gembtn" data-lv="1">${gemSvg()} +1 เลเวล ${SEASON.lvGems}</button><button class="btn sm gembtn" data-lv="10">+10 เลเวล ${fmt(SEASON.lvGems * Math.min(10, SEASON.maxLv - lv))}</button>` : ''}<button class="btn sm primary" data-all="1" ${Season.anyClaim() ? '' : 'disabled'}>รับทั้งหมด</button></div></div>
      ${body}<div id="tsheet" hidden></div>`, true);
    const tr = $('#sptrack'); if (tr && !o.keepScroll) { const c = tr.querySelector('.cur'); if (c) tr.scrollLeft = c.offsetLeft - tr.clientWidth / 2 + 40; }
    if (tr && o.keepScroll) tr.scrollLeft = o.keepScroll;
    const keep = () => { this.panelOpt.keepScroll = tr ? tr.scrollLeft : 0; };
    this.el.pbody.onclick = e => {
      const t = e.target.closest('[data-tab]'); if (t) { this.panelOpt.tab = t.dataset.tab; this.panelOpt.keepScroll = 0; return this.renderPanel(); }
      const c = e.target.closest('[data-cl]'); if (c) { const [track, L] = c.dataset.cl.split(':'); if (!Season.has(track)) { this.toast(track === 'prem' ? 'ต้องซื้อ Season Pass พรีเมียม' : 'ต้องซื้อ Season Pass', 'warn'); return; } if (+L > Season.level()) { this.toast(`ต้องถึงเลเวล ${L} ก่อน`, 'warn'); return; } const got = Season.claim(track, +L); if (got.length) { this.toast('ได้รับ ' + got.join(', '), 'rare'); Audio.sfx('coin'); } keep(); return this.renderPanel(); }
      if (e.target.closest('[data-all]')) { const got = Season.claimAll(); if (got.length) { this.toast(`รับรางวัล ${got.length} รายการ`, 'rare'); Audio.sfx('level'); } keep(); UI.refreshAll(); return this.renderPanel(); }
      const lvb = e.target.closest('[data-lv]'); if (lvb) { const n = +lvb.dataset.lv; this.demoConfirm({ title: `ปลดล็อก Season Pass +${Math.min(n, SEASON.maxLv - Season.level())} เลเวล`, price: `${fmt(Math.min(n, SEASON.maxLv - Season.level()) * SEASON.lvGems)} เพชร`, gems: true }, () => { Season.buyLevels(n); keep(); this.renderPanel(); }); return; }
      const pb = e.target.closest('[data-pass]'); if (pb) {
        const kind = pb.dataset.pass, p = SEASON.passes[kind]; const up = kind === 'premium' && s.pass === 'normal';
        this.demoConfirm({ title: p.name + (up ? ' (อัปเกรด)' : ''), price: '฿' + (up ? p.thb - SEASON.passes.normal.thb : p.thb), perks: p.perks }, () => { Season.buyPass(kind); this.toast(`ปลดล็อก ${p.name} แล้ว (ทดลอง)`, 'rare'); keep(); this.renderPanel(); });
      }
    };
  },
  demoConfirm(o, ok) {
    const sheet = $('#tsheet'); if (!sheet) return; sheet.hidden = false;
    sheet.innerHTML = `<div class="tsbox" role="dialog" aria-label="ยืนยัน"><h3>${o.gems ? 'ยืนยันการใช้เพชร' : 'ยืนยันการซื้อ (ทดลอง)'}</h3><div class="tsrow"><span>รายการ</span><b>${o.title}</b></div><div class="tsrow"><span>ราคา</span><b>${o.price}</b></div>
      ${o.perks ? `<ul class="perks">${o.perks.map(p => `<li>${p}</li>`).join('')}</ul>` : ''}${o.gems ? '' : '<p class="demonote">โหมดทดลอง: ไม่มีการตัดเงินจริง</p>'}<div class="row"><button class="btn ghost" data-ts="no">ยกเลิก</button><button class="btn primary" data-ts="yes">ยืนยัน${o.gems ? '' : ' (ทดลอง)'}</button></div></div>`;
    sheet.onclick = e => { const b = e.target.closest('[data-ts]'); if (!b) { if (e.target === sheet) sheet.hidden = true; return; } sheet.hidden = true; if (b.dataset.ts === 'yes') ok(); };
  }
});

