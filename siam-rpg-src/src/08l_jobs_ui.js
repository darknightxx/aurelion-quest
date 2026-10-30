/* ============================================================
   Jobs UI: lazy 3D portraits, jobs panel, hooks
   ============================================================ */
{
  const or = Player.recalc.bind(Player);
  Player.recalc = function () { or(); const S = Save.d; if (S && S.awk) { const st = this.stats; st.maxhp = Math.round(st.maxhp * 1.15); st.maxmp = Math.round(st.maxmp * 1.15); st.atk = Math.round(st.atk * 1.12); st.def = Math.round(st.def * 1.12); } };
  const obd = Game.bossDefeated.bind(Game); Game.bossDefeated = function (m) { obd(m); JobSys.giveStone('st_light', 'แกนผลึกของยักษ์ศิลาเรืองแสง'); };
  const ond = NakBoss.defeated.bind(NakBoss); NakBoss.defeated = function (m) { ond(m); JobSys.giveStone('st_dark', 'แม่นากทิ้งศิลาไว้ก่อนจากไป'); };
  const ok = Combat.kill.bind(Combat); Combat.kill = function (m) { ok(m); if (m.type === 'pusom') JobSys.giveStone('st_spirit', 'ปู่โสมมอบให้ผู้ไม่โลภ'); };
  // remote players: awakened aura
  const ord = Remote.draw.bind(Remote);
  Remote.draw = function (R) { ord(R); for (const p of this.map.values()) if (p.st.k && p.zone === Player.zone && !p.st.d) JobSys.awkFx(p.dx, p.dz, p.anim); };
}

/* ---- portraits for any sheet (3D render when no sprite sheet) ---- */
{
  const mkProxy = (kind) => new Proxy({}, { get(t, k) { if (typeof k !== 'string') return t[k]; if (t[k] === undefined && (OUTFITS[k] || (typeof Sheets !== 'undefined' && Sheets.ensure(k)))) t[k] = CharThumb[kind](k); return t[k]; }, set(t, k, v) { t[k] = v; return true; } });
  const CharThumb = {
    portrait(sheet) { return ThumbR.shot('cp_' + sheet, 128, 128, [.35, 2.1, 1.55], [0, 1.75, 0], .66, R => CharThumb.rig(R, sheet, false)); },
    body(sheet) { return ThumbR.shot('cb_' + sheet, 224, 320, [.95, 2.1, 4.8], [0, 1.35, 0], .7, R => CharThumb.rig(R, sheet, false)); },
    rig(R, sheet, wave) { if (!ThumbR.cm[sheet]) { if (typeof Sheets !== 'undefined') Sheets.ensure(sheet); ThumbR.cm[sheet] = buildCharModel(R, sheet); } const rig = new Rig(sheet); for (let i = 0; i < 30; i++) rig.update(.05, { wave }); rig.pose(0, 0, 0, .3, CHAR_SCALE); rig.draw(R, ThumbR.cm[sheet], {}); }
  };
  const op = UI.portraits, ob = UI.bodies; UI.portraits = mkProxy('portrait'); UI.bodies = mkProxy('body'); Object.assign(UI.portraits, op); Object.assign(UI.bodies, ob);
  const on = ThumbR.npc.bind(ThumbR); ThumbR.npc = function (sheet) { if (!this.cm[sheet] && OUTFITS[sheet]) { this.ensure(); this.cm[sheet] = buildCharModel(this.R, sheet); } return on(sheet); };
  window.CharThumb = CharThumb;
}
Object.assign(NPC_IDLE, { zen: 'ข้าคืออาจารย์เซน ผู้ชี้ทางแห่งอาชีพ เมื่อเจ้าถึงเลเวล 10 จงกลับมาเลือกเส้นทางขั้นสอง และเมื่อถึงเลเวล 20 ข้าจะบอกความลับของการปลุกพลัง' });
Object.assign(SKILL_TIPS, {
  bowling: 'ใช้เมื่อถูกล้อม ศัตรูจะกระเด็นและมึนงงให้ตามตีต่อ', brandish: 'ยืนให้ศัตรูเรียงเป็นแนวหน้ากว้างแล้วฟาด', dragonblade: 'กระโดดลงกลางกลุ่ม ตอบถูกได้ ×2', grandcross: 'ใช้ในวัดร้าง ผีรับดาเมจเพิ่ม 30%', shieldchain: 'โจมตีระยะไกลของแทงค์ ใช้ดึงศัตรูจากไกล', devotion: 'เปิดก่อนรับท่าแรงของบอส ลดดาเมจเกือบทั้งหมด',
  hammerfall: 'มึนงงยาว ใช้เปิดก่อนค้อนสายฟ้า', thunderforge: 'ดาเมจเดี่ยวสูง ใช้หลังค้อนถล่ม', mammonite: 'ปิดงานศัตรูตัวใหญ่ ตอบถูก ×2', aciddemo: 'กัดกร่อนต่อเนื่อง ยิงแล้วถอย', potionpitch: 'ใช้ตอน HP ต่ำกว่าครึ่ง', acidbomb: 'ปาใส่จุดที่ศัตรูรวมกัน',
  sonicblow: 'ดาเมจเดี่ยวรัว 6 ครั้ง ใช้หลังพิษมรณะ', edp: 'เปิดก่อนโซนิคโบลว์ คริติคอลแทบทุกครั้ง', meteorassault: 'สกิลหมู่ของแอสซาซิน', backstab: 'พุ่งทะลุไปหลังเป้าหมาย ดาเมจสูงมาก', chasewalk: 'หนีออกจากวงล้อมแล้วกลับมาแทงข้างหลัง', raid: 'เปิดศึกด้วยสกิลนี้ ศัตรูมึนงง 2 วิ',
  blitz: 'เหยี่ยวโจมตีได้แม้ศัตรูอยู่หลังสิ่งกีดขวาง', truesight: 'เปิดก่อนชาร์ปชูตติ้ง', sharpshoot: 'ยืนเป็นแนวเดียวกับศัตรูหลายตัว', bragi: 'เปิดตอนปาร์ตี้อยู่ใกล้กัน ทุกคนได้ผล', idun: 'เพิ่ม HP สูงสุดก่อนสู้บอส', arrowvulcan: 'ดาเมจเดี่ยวรัวสูงสุดของสายธนู',
  napalm: 'ลูกไฟตามล่าเป้าหมาย ยิงได้บ่อย', gravity: 'ใช้คู่วงแหวนน้ำแข็ง ศัตรูหนีไม่ได้', stormgust: 'พื้นที่กว้างที่สุดในเกม', heavensdrive: 'สกิลหมู่รอบตัวของนักเวท', blindmist: 'ใช้ตอนโดนล้อม ศัตรูช้าลงและตัวเองได้เกราะ', soulburn: 'ทั้งโจมตีและฟื้นฟู',
  magnus: 'ปล่อยใส่ฝูงผีในวัดร้าง ดาเมจ ×1.5', meditation: 'ล้างสถานะและฟื้นฟูในสกิลเดียว', redemption: 'ฟื้นฟู 35% พร้อมโจมตี', ragingpalm: 'ใช้ตัดจังหวะศัตรูที่ง้างโจมตี', spheres: 'เปิดก่อนหมัดอสุรา', asura: 'ดาเมจเดี่ยวสูงที่สุดในเกม ตอบถูกได้ ×20'
});
/* ---- jobs panel ---- */
UI.pJobs = function (o) {
  const S = Save.d, base = CLASSES[S.cls], jobs = JOB_OF[S.cls] || [];
  const skillRow = id => { const s = SKILLS[id]; return `<li class="hasinfo" data-skinfo="${id}">${SkillArt.art(id, { cls: 'xs' })}<div><b>${s.name}</b><small>${s.cat}</small></div></li>`; };
  const cards = jobs.map(id => { const j = JOBS[id]; const cur = S.job === id; return `<div class="jobcard ${cur ? 'cur' : ''} ${S.job && !cur ? 'off' : ''}" style="--jc:${j.color}"><img src="${UI.bodies[id]}" alt=""><div class="jobin"><h3>${j.name} <small>${j.en}</small></h3><p class="crole" style="--rc:${ROLES[j.role].col}">${icon(ROLES[j.role].icon)} ${ROLES[j.role].name}</p><p>${j.desc}</p><p class="muted">HP +${j.hp} · MP +${j.mp} · ATK +${j.atk} · DEF +${j.def}${j.spd ? ' · SPD +' + j.spd : ''}</p><ul class="skl mini">${j.skills.slice(2).map(skillRow).join('')}</ul>${cur ? '<p class="jobnow">อาชีพปัจจุบัน</p>' : !S.job ? `<button class="btn primary" data-job="${id}" ${S.level >= JOB_LV && S.coins >= JobSys.cost ? '' : 'disabled'}>เปลี่ยนเป็น ${j.name} (${JobSys.cost} เหรียญ)</button>` : ''}</div></div>`; }).join('');
  const st = JobSys.stoneProgress(S);
  const awk = S.job ? `<h4>ปลุกพลัง (Awakening) · เลเวล ${AWK_LV}+</h4><div class="awkbox ${S.awk ? 'done' : ''}">${S.awk ? `<p><b>ปลุกพลังแล้ว!</b> ${Cls.name(S)} · เลเวลสูงสุด ${AWK_LV_CAP} · สกิลอัปได้ถึง Lv.10 · สกิล ${JOBS[S.job].awk.map(k => SKILLS[k].name).join(' และ ')} แข็งแกร่งขึ้น 30% · HP/MP +15% · ATK/DEF +12%</p>` : `<p>รับเควส "ปลดผนึกแห่งพลัง" จาก <b>อาจารย์เซน</b> ในเมือง แล้วรวบรวมศิลาทั้ง 4 จากนั้นเข้าพิธีกรรม (ตอบคำถามถูกติดกัน 3 ข้อ) ใช้ ${fmt(JobSys.ritualCost)} เหรียญ</p><ul class="stones">${st.map(s => `<li class="${s.have ? 'have' : ''}">${icon('gem')}<b>${ITEMS[s.id].name}</b><small>${STONES[s.id]}</small>${s.have ? '<i>✓</i>' : ''}</li>`).join('')}</ul><p class="muted">รางวัล: เลเวลสูงสุด ${AWK_LV_CAP} · สกิลสูงสุด Lv.10 · สกิลประจำอาชีพ 2 สกิลแข็งแกร่งขึ้น 30% · HP/MP +15% · ATK/DEF +12% · ออร่าเปลวไฟทอง · ฉายา "ผู้ตื่นรู้"</p>${S.quests.awk && S.quests.awk.s === 'done' ? '<button class="btn primary" data-ritual="1">เข้าพิธีกรรมปลุกพลัง</button>' : `<button class="btn" data-navnpc="zen">ไปหาอาจารย์เซน</button>`}`}</div>` : '';
  this.setPanel(`${icon('person')} สายอาชีพ <small>${base.name} → ขั้นสอง → ผู้ตื่นรู้</small>`, `<p class="muted">เลือกอาชีพขั้นสองได้เมื่อถึงเลเวล ${JOB_LV} (เลือกได้ครั้งเดียว) สกิล Q และ E คงเดิม ส่วน R, T และสกิลใหญ่ X จะเปลี่ยนเป็นสกิลประจำอาชีพใหม่</p><div class="jobgrid">${cards}</div>${awk}`, true);
  this.el.pbody.onclick = e => {
    const sk = e.target.closest('[data-skinfo]'); if (sk) return SkillInfo.open(sk.dataset.skinfo);
    const b = e.target.closest('[data-job]'); if (b) { if (JobSys.change(b.dataset.job)) this.renderPanel(); return; }
    if (e.target.closest('[data-ritual]')) { this.closePanel(); JobSys.ritual(); return; }
    const n = e.target.closest('[data-navnpc]'); if (n) { this.closePanel(); Nav.goNpc(n.dataset.navnpc, 'ไปหา'); }
  };
};
{
  const oh = UI.pHelp.bind(UI);
  UI.pHelp = function () { oh(); const h = this.el.pbody.querySelector('.help'); if (h) h.insertAdjacentHTML('afterbegin', `<section><h4>สายอาชีพและการปลุกพลัง</h4><p>เลเวล ${JOB_LV} ไปหา <b>อาจารย์เซน</b> ในเมืองเพื่อเลือกอาชีพขั้นสอง (อาชีพละ 2 สาย ได้สกิลใหม่ 3 สกิล) เลเวล ${AWK_LV} รับเควส "ปลดผนึกแห่งพลัง" เก็บศิลา 4 ชนิดจากยักษ์ศิลา แม่นาก ปู่โสม และบททดสอบของโอริน แล้วเข้าพิธีกรรมเพื่อปลุกพลัง เลเวลสูงสุดจะขยายเป็น ${AWK_LV_CAP} · กด <kbd>J</kbd> เพื่อดูสายอาชีพ</p></section>`); };
}

