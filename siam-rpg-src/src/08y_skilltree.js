
/* ============================================================
   RO-style skill tree: every class gets 4 passive skills and 2
   extra active skills on top of its 5 class skills, plus the
   skills of its 2nd job. Skills have prerequisites (lines in the
   tree), passives go to Lv.10, and the player chooses which
   actives sit on the Q E R T keys (X stays the quiz ultimate).
   ============================================================ */
const PASSIVE_TH = { atkP: 'ATK', defP: 'DEF', hpP: 'HP สูงสุด', mpP: 'MP สูงสุด', spdP: 'ความเร็ว', crit: 'คริติคอล', reduce: 'ลดความเสียหาย', regen: 'ฟื้น HP/วิ', mpregen: 'ฟื้น MP/วิ', coin: 'เหรียญ', xp: 'EXP', heal: 'พลังฟื้นฟู' };
const TREE_SK = {
  adventurer: {
    p: [['p_adv1', 'ความชำนาญอาวุธ', 'combo', { atkP: .03 }, 'ฝึกใช้อาวุธทุกชนิดจนคล่องมือ'], ['p_adv2', 'ร่างกายแข็งแรง', 'guard', { hpP: .03 }, 'ออกกำลังกายทุกเช้า ร่างกายทนทานขึ้น'], ['p_adv3', 'โชคของนักผจญภัย', 'focus', { coin: .03, xp: .01 }, 'โชคเข้าข้างคนกล้าเสมอ'], ['p_adv4', 'พักฟื้นเร็ว', 'heal', { regen: .0015 }, 'ฟื้นตัวจากบาดแผลได้รวดเร็ว']],
    a: [['a_quake', 'ผ่าปฐพี', { type: 'cone', mp: 14, cd: 8, mult: 2.6, r: 5.5, ang: .45, col: [1, .75, .4], icon: 'slash', glyph: 'cleave', cat: 'โจมตีแนวตรง', desc: 'ฟาดอาวุธลงพื้นจนแผ่นดินแยกเป็นแนวยาวไปข้างหน้า', fx: ['แนวยาว 5.5 เมตร ATK ×2.6'] }], ['a_cry', 'ตะโกนปลุกใจ', { type: 'buff', mp: 12, cd: 22, buffs: [['atk', 12]], col: [1, .6, .3], icon: 'star', glyph: 'focus', cat: 'บัฟตัวเอง', desc: 'ตะโกนปลุกพลังในตัวให้ลุกโชน', fx: ['พลังโจมตี +20% นาน 12 วินาที'] }]]
  },
  knight: {
    p: [['p_kn1', 'ความชำนาญดาบ', 'cleave', { atkP: .025 }, 'อัศวินฝึกฟันดาบวันละพันครั้ง'], ['p_kn2', 'ร่างกายเหล็กไหล', 'guard', { defP: .04 }, 'เกราะและกายแกร่งดั่งเหล็ก'], ['p_kn3', 'ความอดทน', 'bash', { hpP: .04 }, 'ยืนหยัดได้นานกว่าใคร'], ['p_kn4', 'ฟื้นฟู HP', 'heal', { regen: .002 }, 'ฟื้นพลังชีวิตได้แม้ยืนนิ่ง']],
    a: [['k_pierce', 'แทงทะลวง', { type: 'cone', mp: 12, cd: 7, mult: 2.7, r: 6.5, ang: .3, col: [.8, .9, 1], icon: 'sword', glyph: 'charge', cat: 'โจมตีแนวตรง', desc: 'แทงดาบไปข้างหน้าอย่างรุนแรง ทะลุศัตรูที่เรียงกัน', fx: ['แนวยาว 6.5 เมตร ATK ×2.7'] }], ['k_aura', 'ออร่าศักดิ์สิทธิ์', { type: 'heal', mp: 16, cd: 20, heal: .18, buffs: [['def', 10]], col: [1, .95, .6], icon: 'heart', glyph: 'guard', cat: 'ฟื้นฟู + ป้องกัน', desc: 'แสงศักดิ์สิทธิ์โอบล้อม รักษาบาดแผลและเสริมเกราะ', fx: ['ฟื้น HP 18%', 'DEF +25% นาน 10 วินาที'] }]]
  },
  ninja: {
    p: [['p_nj1', 'ความชำนาญมีด', 'crescent', { atkP: .025 }, 'มีดสั้นคือส่วนหนึ่งของร่างกาย'], ['p_nj2', 'วิชาหลบหลีก', 'smoke', { reduce: .015 }, 'หลบการโจมตีได้อย่างพลิ้วไหว'], ['p_nj3', 'จุดตาย', 'assassin', { crit: .012 }, 'มองเห็นจุดอ่อนของศัตรู'], ['p_nj4', 'ฝีเท้าเงา', 'shadow', { spdP: .015 }, 'เคลื่อนไหวเร็วดั่งเงา']],
    a: [['n_venom', 'มีดอาบพิษ', { type: 'proj', mp: 10, cd: 5, mult: 1.9, n: 1, proj: 'star', dot: { k: .25, t: 5 }, col: [.5, 1, .35], icon: 'dagger', glyph: 'venom', cat: 'โจมตี + พิษ', desc: 'ขว้างมีดที่อาบพิษร้ายใส่เป้าหมาย', fx: ['ATK ×1.9', 'พิษต่อเนื่อง 5 วินาที'] }], ['n_phantom', 'เงาพันร่าง', { type: 'nova', mp: 18, cd: 11, mult: 2.0, r: 5, col: [.6, .4, .9], icon: 'burst', glyph: 'blades', cat: 'โจมตีหมู่ (AoE)', desc: 'แยกร่างเงาโจมตีศัตรูรอบตัวพร้อมกัน', fx: ['รัศมี 5 เมตร ATK ×2.0'] }]]
  },
  archer: {
    p: [['p_ar1', 'ตาเหยี่ยว', 'power', { atkP: .025 }, 'มองเห็นเป้าหมายได้ชัดแม้อยู่ไกล'], ['p_ar2', 'ยิงจุดตาย', 'venom', { crit: .01 }, 'ลูกศรพุ่งเข้าจุดสำคัญ'], ['p_ar3', 'ฝีเท้าพราน', 'leap', { spdP: .015 }, 'วิ่งในป่าได้คล่องแคล่ว'], ['p_ar4', 'สมาธินักธนู', 'multi', { mpP: .04 }, 'ใจนิ่ง ลมหายใจสงบ']],
    a: [['r_flame', 'ศรเพลิง', { type: 'proj', mp: 12, cd: 6, mult: 2.2, n: 1, splash: 2.6, proj: 'fire', col: [1, .5, .15], icon: 'fire', glyph: 'fire', cat: 'โจมตี + กระจาย', desc: 'ยิงลูกศรติดไฟที่ระเบิดเมื่อโดนเป้าหมาย', fx: ['ATK ×2.2', 'ระเบิดกระจาย 2.6 เมตร'] }], ['r_bolt', 'ศรสายฟ้า', { type: 'proj', mp: 14, cd: 8, mult: 1.35, n: 3, spread: .12, pierce: true, proj: 'arrow', col: [.6, .8, 1], icon: 'fan', glyph: 'multi', cat: 'โจมตีทะลุ', desc: 'ยิงศรสายฟ้า 3 ดอกที่ทะลุศัตรูทุกตัว', fx: ['3 ดอก ดอกละ ATK ×1.35', 'ทะลุเป้าหมาย'] }]]
  },
  mage: {
    p: [['p_mg1', 'สมาธิแห่งมานา', 'blink', { mpP: .05 }, 'จิตใจสงบ มานาไหลเวียนดี'], ['p_mg2', 'ฟื้นฟูมานา', 'frost', { mpregen: .002 }, 'ดึงมานาจากธรรมชาติรอบตัว'], ['p_mg3', 'พลังเวทลึกล้ำ', 'fire', { atkP: .03 }, 'คาถาแรงขึ้นทุกครั้งที่ฝึก'], ['p_mg4', 'เกราะมานา', 'storm', { reduce: .012 }, 'มานาห่อหุ้มร่างกายกันความเสียหาย']],
    a: [['m_thunder', 'สายฟ้าฟาด', { type: 'rain', mp: 18, cd: 10, mult: 2.6, r: 4.5, col: [.7, .8, 1], icon: 'rain', glyph: 'storm', cat: 'โจมตีหมู่ระยะไกล', desc: 'เรียกสายฟ้าฟาดลงจุดที่เป้าหมายอยู่', fx: ['รัศมี 4.5 เมตร ATK ×2.6'] }], ['m_blizzard', 'พายุหิมะ', { type: 'nova', mp: 20, cd: 12, mult: 1.7, r: 6, slow: 4, col: [.6, .9, 1], icon: 'snow', glyph: 'frost', cat: 'โจมตีหมู่ + ชะลอ', desc: 'ปลดปล่อยพายุหิมะรอบตัว ศัตรูช้าลง', fx: ['รัศมี 6 เมตร ATK ×1.7', 'ชะลอ 4 วินาที'] }]]
  },
  priest: {
    p: [['p_pr1', 'ศรัทธาแรงกล้า', 'bless', { hpP: .03 }, 'ศรัทธาทำให้ร่างกายแข็งแกร่ง'], ['p_pr2', 'ฟื้นฟูมานา', 'cleanse', { mpregen: .002 }, 'สวดภาวนาฟื้นพลังจิต'], ['p_pr3', 'พลังรักษา', 'heal', { heal: .05 }, 'การรักษาแรงขึ้นทุกครั้งที่ฝึก'], ['p_pr4', 'เกราะศักดิ์สิทธิ์', 'angel', { defP: .03 }, 'พรจากเบื้องบนปกป้องร่างกาย']],
    a: [['p_holy', 'แสงศักดิ์สิทธิ์', { type: 'proj', mp: 10, cd: 4, mult: 2.2, n: 1, proj: 'holy', col: [1, 1, .7], icon: 'sun', glyph: 'judge', cat: 'โจมตีเดี่ยว', desc: 'ยิงลำแสงศักดิ์สิทธิ์ใส่ศัตรู', fx: ['ATK ×2.2'] }], ['p_agi', 'พรแห่งความว่องไว', { type: 'buff', mp: 12, cd: 25, buffs: [['haste', 15]], col: [.6, 1, .8], icon: 'boots', glyph: 'bless', cat: 'บัฟตัวเอง', desc: 'ขอพรให้ร่างกายเบาดั่งขนนก', fx: ['ความเร็ว +30% นาน 15 วินาที'] }]]
  }
};
const TREE_EXTRA = new Set(), TREE_PASSIVE = {};
for (const cls in TREE_SK) {
  for (const [id, name, glyph, fx, desc] of TREE_SK[cls].p) { TREE_EXTRA.add(id); TREE_PASSIVE[id] = fx; SKILLS[id] = { name, type: 'passive', passive: true, mp: 0, cd: 0, col: [.8, .8, .9], icon: 'star', glyph, cat: 'สกิลติดตัว (Passive)', desc, fx: Object.entries(fx).map(([k, v]) => `${PASSIVE_TH[k]} +${k === 'regen' || k === 'mpregen' ? (v * 100).toFixed(2) + '%' : Math.round(v * 1000) / 10 + '%'} ต่อเลเวล (สูงสุด Lv.10)`) }; }
  for (const [id, name, def] of TREE_SK[cls].a) { TREE_EXTRA.add(id); SKILLS[id] = Object.assign({ name }, def); }
}
const passiveV = k => { const S = Save.d; if (!S || !S.skillLv) return 0; const T = TREE_SK[S.cls]; if (!T) return 0; let v = 0; for (const [id] of T.p) { const lv = S.skillLv[id] || 0, f = TREE_PASSIVE[id][k]; if (lv && f) v += f * lv; } return v; };
const Tree = {
  // layout: [id, row, col, req [[id, lv]], minLv]
  layout(S) {
    const cls = S.cls, C = CLASSES[cls], T = TREE_SK[cls]; const base = C.skills, L = [];
    base.forEach((id, i) => L.push([id, 0, i, [], 1]));
    L.push([T.a[0][0], 1, 0, [[base[0], 3]], 4]); L.push([T.a[1][0], 1, 1, [[base[1], 3]], 6]);
    L.push([T.p[0][0], 1, 2, [], 2]); L.push([T.p[1][0], 1, 3, [[T.p[0][0], 3]], 4]); L.push([T.p[2][0], 1, 4, [[base[2], 2]], 6]);
    L.push([T.p[3][0], 2, 4, [[T.p[1][0], 3]], 8]);
    const job = S.job && JOBS[S.job]; if (job) { const extra = job.skills.filter(x => !base.includes(x)); extra.forEach((id, i) => L.push([id, 2, i, [], JOB_LV])); }
    return L;
  },
  avail(S, id) { const C = CLASSES[S.cls]; if (C.skills.includes(id)) return true; const j = S.job && JOBS[S.job]; if (j && j.skills.includes(id)) return true; return TREE_EXTRA.has(id) && (S.skillLv[id] || 0) > 0; },
  node(S, id) { return this.layout(S).find(n => n[0] === id); },
  reqOk(S, id) { const n = this.node(S, id); if (!n) return true; if (S.level < n[4]) return false; return n[3].every(([r, lv]) => SkillLv.get(r) >= lv); },
  maxOf(id) { return SKILLS[id] && SKILLS[id].passive ? 10 : SkillLv.max(); }
};
{
  const og = SkillLv.get.bind(SkillLv); SkillLv.get = function (id) { if (TREE_EXTRA.has(id)) { const S = Save.d; return (S && S.skillLv && S.skillLv[id]) || 0; } return og(id); };
  const ocu = SkillLv.canUp.bind(SkillLv); SkillLv.canUp = function (id) { const S = Save.d; if (!S || !(S.skillPts > 0)) return false; if (!Tree.reqOk(S, id)) return false; if (TREE_EXTRA.has(id)) return this.get(id) < Tree.maxOf(id); return ocu(id); };
  const of = SkillLv.f.bind(SkillLv); SkillLv.f = function (id, lv) { const r = of(id, lv || Math.max(1, this.get(id))); const h = passiveV('heal'); if (h) r.heal *= 1 + h; return r; };
  // skill bar: player-chosen actives on Q E R T
  const oo = Cls.of.bind(Cls); const barCache = new Map();
  Cls.of = function (S) {
    const c = oo(S); if (!S || !S.bar || !S.skillLv) return c; const sk = c.skills.slice();
    for (let i = 0; i < 4; i++) { const id = S.bar[i]; if (id && SKILLS[id] && !SKILLS[id].passive && !SKILLS[id].quiz && Tree.avail(S, id)) { const j = sk.indexOf(id); if (j >= 0 && j !== i) sk[j] = sk[i]; sk[i] = id; } }
    const key = (c.id || S.cls) + '|' + sk.join(','); let o = barCache.get(key); if (!o) { o = Object.assign(Object.create(c), { skills: sk }); barCache.set(key, o); } return o;
  };
  // passive stats
  const orc = Player.recalc.bind(Player);
  Player.recalc = function () {
    orc(); const st = this.stats, S = Save.d; if (!S || !S.skillLv) return;
    const a = passiveV('atkP'), d = passiveV('defP'), h = passiveV('hpP'), m = passiveV('mpP'), s = passiveV('spdP');
    if (a) st.atk = Math.round(st.atk * (1 + a)); if (d) st.def = Math.round(st.def * (1 + d)); if (h) st.maxhp = Math.round(st.maxhp * (1 + h)); if (m) st.maxmp = Math.round(st.maxmp * (1 + m)); if (s) st.spd *= 1 + s;
    S.hp = Math.min(S.hp, st.maxhp); S.mp = Math.min(S.mp, st.maxmp);
  };
  const ocb = RoleSys.critBonus.bind(RoleSys); RoleSys.critBonus = function () { return ocb() + passiveV('crit'); };
  const ox = Game.gainXP.bind(Game); Game.gainXP = function (n) { return ox(n * (1 + passiveV('xp'))); };
  const oc = Game.gainCoins.bind(Game); Game.gainCoins = function (n) { return oc(n * (1 + passiveV('coin'))); };
  const ohp = Combat.hitPlayer.bind(Combat); Combat.hitPlayer = function (raw, src) { const r = passiveV('reduce'); return ohp(r ? raw * (1 - Math.min(.3, r)) : raw, src); };
  const ou = Game.update.bind(Game);
  Game.update = function (dt) { ou(dt); if (!this.started || this.paused || !Save.d || Player.dead) return; this._psT = (this._psT || 0) + dt; if (this._psT >= 1) { this._psT = 0; const S = Save.d, st = Player.stats, r = passiveV('regen'), m = passiveV('mpregen'); if (r) S.hp = Math.min(st.maxhp, S.hp + st.maxhp * r); if (m) S.mp = Math.min(st.maxmp, S.mp + st.maxmp * m); } };
  // the old skills window gets a button to the tree
  const ops = UI.pSkills.bind(UI); UI.pSkills = function () { ops(); const h = this.el.pbody.querySelector('.skhead'); if (h) { const b = document.createElement('button'); b.className = 'btn primary'; b.textContent = '🌳 เปิดสกิลทรีแบบ RO'; b.onclick = () => this.openPanel('tree'); h.after(b); } };
}
UI.extraPanels = UI.extraPanels || {}; UI.extraPanels.tree = 'pTree';
UI.pTree = function (o) {
  const S = Save.d; SkillLv.ensure(S); const L = Tree.layout(S), cls = Cls.of(S), bar = cls.skills; const sel = o.sel && SKILLS[o.sel] ? o.sel : L[0][0]; this.panelOpt.sel = sel;
  const CW = 96, RH = 112, pos = (r, c) => [c * CW + CW / 2, r * RH + 40];
  let lines = '';
  for (const [id, r, c, req] of L) for (const [q] of req) { const n = L.find(x => x[0] === q); if (!n) continue; const [x1, y1] = pos(n[1], n[2]), [x2, y2] = pos(r, c); const ok = Tree.reqOk(S, id); lines += `<path d="M${x1} ${y1 + 30}C${x1} ${(y1 + y2) / 2 + 20},${x2} ${(y1 + y2) / 2 - 20},${x2} ${y2 - 30}" class="tl ${ok ? 'ok' : ''}"/>`; }
  const nodes = L.map(([id, r, c, req, minLv]) => { const sk = SKILLS[id], lv = SkillLv.get(id), mx = Tree.maxOf(id), ok = Tree.reqOk(S, id), slot = bar.indexOf(id); const [x, y] = pos(r, c);
    return `<button class="tnode ${sk.passive ? 'pas' : ''} ${lv ? 'got' : ''} ${ok ? '' : 'lock'} ${id === sel ? 'on' : ''}" style="left:${x - 36}px;top:${y - 34}px" data-tn="${id}">${SkillArt.art(id)}<b class="tlv">${lv}/${mx}</b>${slot >= 0 ? `<kbd>${SKILL_KEYS[slot]}</kbd>` : ''}${!ok ? '<i class="tlk">🔒</i>' : ''}<span>${sk.name}</span></button>`; }).join('');
  const rows = Math.max(...L.map(n => n[1])) + 1;
  const sk = SKILLS[sel], lv = SkillLv.get(sel), n = Tree.node(S, sel), reqT = n ? [n[4] > 1 ? `เลเวลตัวละคร ${n[4]}` : '', ...n[3].map(([q, l]) => `${SKILLS[q].name} Lv.${l}`)].filter(Boolean) : [];
  const canBar = !sk.passive && !sk.quiz && Tree.avail(S, sel) && lv > 0;
  const det = `<div class="tdet"><div class="tdh">${SkillArt.art(sel)}<div><h3>${sk.name} <small>Lv.${lv}/${Tree.maxOf(sel)}</small></h3><small>${sk.cat || ''}${sk.passive ? '' : ` · MP ${SkillLv.mp(sel)} · คูลดาวน์ ${SkillLv.cd(sel)} วิ`}</small></div></div>
    <p>${sk.desc || ''}</p>${sk.fx ? `<ul class="tfx">${sk.fx.map(f => `<li>${f}</li>`).join('')}</ul>` : ''}${reqT.length ? `<p class="treq ${Tree.reqOk(S, sel) ? 'ok' : ''}">ต้องการ: ${reqT.join(' · ')}</p>` : ''}
    <div class="tbtn"><button class="btn primary" data-tu="${sel}" ${SkillLv.canUp(sel) ? '' : 'disabled'}>${lv ? 'อัปเลเวล' : 'เรียนสกิล'} (แต้ม ${S.skillPts || 0})</button>${sk.passive ? '' : `<button class="btn ghost" data-ti="${sel}">รายละเอียด</button>`}</div>
    ${canBar ? `<div class="tbar"><small>ใส่ปุ่มลัด:</small>${[0, 1, 2, 3].map(i => `<button class="btn sm ${bar[i] === sel ? 'primary' : ''}" data-tb="${i}">${SKILL_KEYS[i]}</button>`).join('')}</div>` : sk.quiz ? '<p class="muted">สกิลใหญ่อยู่ที่ปุ่ม X เสมอ</p>' : ''}
    </div>`;
  this.setPanel(`🌳 สกิลทรี · ${Cls.name(S)} <span class="coin">แต้มสกิล <b>${S.skillPts || 0}</b></span>`, `<div class="tree"><div class="tgrid" style="width:${5 * CW}px;height:${rows * RH + 20}px"><svg class="tlines" width="${5 * CW}" height="${rows * RH + 20}">${lines}</svg>${nodes}</div>${det}</div>
    <p class="muted">แถวบน: สกิลประจำอาชีพ · แถวกลาง: สกิลเสริมและสกิลติดตัว (Passive) · แถวล่าง: สกิลอาชีพขั้นสอง ${S.job ? '' : '(เปลี่ยนอาชีพที่ Lv.' + JOB_LV + ')'} · เส้นเชื่อมคือเงื่อนไขก่อนเรียน</p>`, true);
  this.el.pbody.onclick = e => {
    const t = e.target.closest('[data-tn]'); if (t) { this.panelOpt.sel = t.dataset.tn; Audio.sfx('ui'); this.renderPanel(); return; }
    const u = e.target.closest('[data-tu]'); if (u) { if (SkillLv.up(u.dataset.tu)) { Player.recalc(); this.buildSkillbar(); } this.renderPanel(); return; }
    const i = e.target.closest('[data-ti]'); if (i) { SkillInfo.open(i.dataset.ti); return; }
    const b = e.target.closest('[data-tb]'); if (b) { const k = +b.dataset.tb; S.bar = (S.bar || Cls.of(S).skills.slice(0, 4)).slice(0, 4); const cur = Cls.of(S).skills.slice(0, 4); for (let j = 0; j < 4; j++) S.bar[j] = S.bar[j] || cur[j]; const j0 = S.bar.indexOf(sel); if (j0 >= 0) S.bar[j0] = S.bar[k]; S.bar[k] = sel; Skills.cd[k] = Math.max(Skills.cd[k], 1); this.buildSkillbar(); Audio.sfx('ui'); UI.toast(`ใส่ ${sk.name} ที่ปุ่ม ${SKILL_KEYS[k]} แล้ว`, 'quest'); this.renderPanel(); }
  };
};
