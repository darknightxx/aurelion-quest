/* ============================================================
   Item detail popup: description, properties, where to get it
   ============================================================ */
const ITEM_LORE = {
  hp_s: 'ยาสมุนไพรสีแดงที่พ่อค้าพิพัฒน์ต้มเองทุกเช้า กลิ่นคล้ายสตรอว์เบอร์รี',
  hp_l: 'ยาเข้มข้นในขวดแก้วหนา ดื่มอึกเดียวก็รู้สึกกลับมามีแรงเต็มที่',
  mp_s: 'น้ำค้างจากดอกจันทราผสมผงผลึก ช่วยให้จิตใจสงบและมานาไหลกลับคืน',
  scroll: 'คัมภีร์ที่ปราชญ์พรหมจารึกพิกัดของลานน้ำพุผลึกไว้ ฉีกเมื่อไรก็กลับบ้านได้ทันที',
  w_iron: 'อาวุธคู่ใจของนักผจญภัยมือใหม่ ตีจากเหล็กกล้าสมดุล ใช้งานง่าย ทนทาน',
  w_mith: 'มิทริลเบาราวขนนกแต่แข็งกว่าเหล็กหลายเท่า เหมาะกับผู้ที่ผ่านศึกมาบ้างแล้ว',
  w_gob: 'มีดสั้นหยาบๆ ที่ยักษ์น้อยใช้ ถึงหน้าตาไม่สวยแต่คมและเบามือ ฟันได้รวดเร็ว',
  w_crys: 'ตีขึ้นจากแกนผลึกของยักษ์ศิลา ผู้พิทักษ์ผลึก ใบมีดเรืองแสงสีฟ้าอ่อนเมื่อจับไว้',
  a_leather: 'เสื้อหนังที่สอดใยเหนียวไว้ข้างใน กันรอยข่วนจากสัตว์ป่าได้ดี',
  a_moon: 'เกราะเงินที่หลอมใต้แสงจันทร์เต็มดวง สะท้อนพลังโจมตีได้ดีเยี่ยม',
  a_hunter: 'เสื้อคลุมที่นายพรานรุ่งใช้ตอนหนุ่มๆ เบาและพรางตัวในป่าได้ดี',
  r_mana: 'แหวนฝังหินมานาสีน้ำเงิน ช่วยให้ร่างกายเก็บพลังเวทได้มากขึ้น',
  r_wind: 'รองเท้าที่ปักลายขนนกสายลม สวมแล้วฝีเท้าเบาราวกับลอยได้',
  r_heart: 'หัวใจผลึกที่ยังเต้นอ่อนๆ หลงเหลือจากยักษ์ศิลา มอบทั้งพลังและชีวิต',
  c_straw: 'สานจากฟางข้าวทุ่งหญ้าใต้เมือง กันแดดได้ แถมดูเป็นมิตรสุดๆ',
  c_sheep: 'หมวกขนแกะนุ่มฟู มีเขาม้วนน่ารัก ฮิตมากในหมู่นักเรียนเวท',
  c_crown: 'มงกุฎที่หล่นจากยักษ์ศิลา ผู้พิทักษ์ผลึก เป็นเครื่องหมายของผู้พิชิตดันเจี้ยน',
  c_angel: 'ปีกขนสีขาวบริสุทธิ์ กระพือเบาๆ ทุกครั้งที่ก้าวเดิน',
  c_bat: 'ปีกค้างคาวสีม่วงรัตติกาล เข้ากับเทศกาลฮาโลวีนเป็นที่สุด',
  c_fairy: 'ภูตพรายตัวจิ๋วที่ชอบติดตามคนเรียนเก่ง ส่องประกายรอบตัวตลอดเวลา',
  c_ember: 'ประกายไฟอุ่นๆ ที่ลอยขึ้นจากตัว ไม่ร้อน ไม่ไหม้ แค่ดูเท่',
  c_halo: 'วงแหวนทองคำลอยเหนือศีรษะ ว่ากันว่าเทพแห่งปัญญาประทานให้คนตอบถูกเสมอ',
  c_dragon: 'ปีกที่ทำจากเกล็ดมังกรเพลิง ร้อนแรงจนอากาศรอบๆ สั่นไหว',
  c_rainbow: 'แสงเจ็ดสีหมุนวนรอบตัว เกิดจากผลึกที่หักเหแสงอาทิตย์',
  c_star: 'ดวงดาวเล็กๆ โคจรรอบตัวผู้พิชิตซีซั่น',
  c_kingcrown: 'มงกุฎราชันย์ประดับอัญมณี สงวนไว้สำหรับผู้ถือ Season Pass พรีเมียม',
  c_crystalw: 'ปีกผลึกสวรรค์ รางวัลสูงสุดของซีซั่น 1 ส่องแสงระยิบเมื่อกระพือ',
  feather: 'ขนนกจากนกฟีนิกซ์ที่ไม่มีวันมอดไหม้ พาผู้ถือฟื้นคืนจากความพ่ายแพ้ได้หนึ่งครั้ง',
  statbook: 'ตำราโบราณที่บันทึกเคล็ดลับการฝึกฝน อ่านจบแล้วจะรู้สึกแข็งแกร่งขึ้นทันที',
  m_jelly: 'เมือกใสเหนียวหนึบ ช่างฝีมือใช้ทำกาวและยาบางชนิด',
  m_cap: 'หมวกเห็ดสีแดงจุดขาว คาเสะบอกว่าเอาไปทำซุปอร่อยมาก',
  m_fang: 'เขี้ยวหมาในที่ยังคมกริบ นายพรานรุ่งรับซื้อไว้ทำเครื่องราง',
  m_totem: 'เครื่องรางไม้แกะสลักที่ยักษ์น้อยใช้เรียกพวก นายกองลำดวนต้องการเป็นหลักฐาน',
  m_bone: 'กระดูกเก่าแก่จากทหารโครงกระดูกกรุงเก่าในถ้ำ แห้งและเปราะ',
  m_shard: 'ผลึกเรืองแสงหายากจากถ้ำนาคา พ่อค้าทุกคนอยากได้'
};
const KIND_TH = { gear: 'อุปกรณ์', use: 'ไอเทมใช้งาน', mat: 'วัตถุดิบ', cos: 'ของแต่งตัว' };
const SLOT_TH = { weapon: 'อาวุธ (มือขวา)', armor: 'ชุดเกราะ', acc: 'เครื่องประดับ', head: 'ศีรษะ', face: 'ใบหน้า', back: 'หลัง', aura: 'ออร่า', outfit: 'ชุดทั้งตัว', wskin: 'สกินอาวุธ' };
const STAT_TH = [['atk', 'ATK'], ['def', 'DEF'], ['hp', 'HP'], ['mp', 'MP'], ['spd', 'SPD']];

const ItemInfo = {
  id: null,
  pct(p) { return (p * 100 < 1 ? (p * 100).toFixed(1) : Math.round(p * 100)) + '%'; },
  statLine(it) {
    const a = STAT_TH.filter(([k]) => it[k]).map(([k, l]) => `${l} +${it[k]}`);
    if (it.bonus && it.bonus.spdPct) a.push(`SPD +${Math.round(it.bonus.spdPct * 100)}%`);
    if (it.heal) a.push(`ฟื้นฟู HP ${it.heal}`); if (it.mana) a.push(`ฟื้นฟู MP ${it.mana}`);
    if (it.ret) a.push('วาร์ปกลับเมือง'); if (it.revive) a.push('ฟื้นคืนชีพ 1 ครั้ง'); if (it.statpt) a.push('แต้มสถานะ +1');
    return a.join(' · ');
  },
  sources(id) {
    const out = [], it = ITEMS[id];
    for (const [m, d] of Object.entries(MONSTERS)) for (const dr of d.drops || []) if (dr[0] === id)
      out.push({ ic: 'sword', t: `ดรอปจาก ${d.name} (Lv.${d.lvl})`, s: `โอกาส ${this.pct(dr[1])}${dr[2] ? ' · ดรอปเฉพาะตอนรับเควสอยู่' : ''} · ${this.where(m)}`, go: { mon: m } });
    const boss = { c_crown: 'ปราบครั้งแรกได้แน่นอน 100%', w_crys: 'โอกาส 45% ทุกครั้งที่ปราบ', r_heart: 'โอกาส 45% ทุกครั้งที่ปราบ' }[id];
    if (boss) out.push({ ic: 'crown', t: 'ดรอปจากบอส ยักษ์ศิลา ผู้พิทักษ์ผลึก (Lv.10)', s: boss + ' · ลานผู้พิทักษ์ ในถ้ำนาคา', go: { boss: 1 } });
    if (SHOP_ITEMS.includes(id)) out.push({ ic: 'bag', t: 'ร้านไอเทมของพ่อค้าพิพัฒน์', s: `ราคา ${fmt(it.price)} เหรียญ${it.lvl ? ' · ต้องเลเวล ' + it.lvl : ''} · เมืองหลวงสยาม`, go: { npc: 'pip' } });
    if (TAILOR_ITEMS.includes(id)) out.push({ ic: 'outfit', t: 'ร้านชุดของช่างตัดเสื้อมีนา', s: `ราคา ${fmt(it.price)} เหรียญ · เมืองหลวงสยาม`, go: { npc: 'mina' } });
    for (const [qid, q] of Object.entries(QUESTS)) { const r = q.rew && q.rew.items && q.rew.items.find(x => x[0] === id); if (r) out.push({ ic: 'scroll', t: `รางวัลเควส: ${q.title}`, s: `×${r[1]} · รับเควสจาก ${NPCS[q.giver] ? NPCS[q.giver].name : ''}`, go: { quest: qid } }); }
    const gi = GEM_ITEMS.filter(g => g.item === id || (g.give && g.give.some(x => x[0] === id)));
    for (const g of gi) out.push({ ic: 'gem', t: `ร้านเพชร: ${g.name || it.name}`, s: `${fmt(g.gems)} เพชร${g.tryon ? ' · ลองใส่ฟรีได้ก่อนซื้อ' : ''}`, go: { panel: 'gemshop' } });
    for (const p of SPECIAL_PACKS) if (p.items && p.items.some(x => x[0] === id)) out.push({ ic: 'gem', t: `แพ็กพิเศษ: ${p.name}`, s: `฿${p.thb} (โหมดทดลอง)`, go: { panel: 'topup' } });
    for (const m of TOPUP_MILESTONES) if (m.items.some(x => x[0] === id)) out.push({ ic: 'trophy', t: `รางวัลยอดเติมสะสม ฿${fmt(m.thb)}`, s: m.label, go: { panel: 'topup' } });
    const tr = { free: 'ฟรี', normal: 'ธรรมดา', prem: 'พรีเมียม' };
    for (const k of ['free', 'normal', 'prem']) { const L = SEASON_REWARDS.filter(r => r[k].it && r[k].it.some(x => x[0] === id)).map(r => r.L); if (L.length) out.push({ ic: 'star', t: `Season Pass แทร็ก${tr[k]}`, s: 'เลเวล ' + (L.length > 6 ? L.slice(0, 6).join(', ') + ` และอีก ${L.length - 6} ขั้น` : L.join(', ')), go: { panel: 'season' } }); }
    const lg = LOGIN_REWARDS.map((r, i) => r.it && r.it.some(x => x[0] === id) ? i + 1 : 0).filter(Boolean);
    if (lg.length) out.push({ ic: 'star', t: 'ของขวัญล็อกอินรายวัน', s: 'วันที่ ' + lg.join(', ') + ' ของรอบ 7 วัน' });
    return out;
  },
  where(m) { const sp = SPAWNS.find(s => s[0] === m); return sp ? World.placeName(sp[1], sp[2]) : ''; },
  open(id) {
    const it = ITEMS[id]; if (!it || !Save.d) return; this.id = id; const S = Save.d; Audio.sfx('ui');
    const have = S.inv[id] || 0;
    const eq = it.kind === 'gear' ? S.equip[it.slot] === id : it.kind === 'cos' ? S.cos[it.slot] === id : false;
    const sell = it.quest ? 'ขายไม่ได้ (ของเควส)' : it.kind === 'cos' ? 'ขายไม่ได้' : (it.sell || Math.floor((it.price || 0) / 2)) ? fmt(it.sell || Math.floor(it.price / 2)) + ' เหรียญ' : 'ขายไม่ได้';
    const rows = [
      ['ประเภท', KIND_TH[it.kind] || '-'],
      it.slot ? ['ตำแหน่ง', SLOT_TH[it.slot]] : null,
      it.kind === 'gear' || it.kind === 'cos' ? ['ใช้ได้โดย', 'ทุกอาชีพ' + (it.lvl ? ` · Lv.${it.lvl}+` : '')] : null,
      it.price ? ['ราคาซื้อ', fmt(it.price) + ' เหรียญ'] : null,
      ['ราคาขาย', sell],
      ['มีในกระเป๋า', it.kind === 'gear' || it.kind === 'cos' ? (have ? 'มีแล้ว' : 'ยังไม่มี') : '×' + have],
      ['สถานะ', eq ? 'กำลังสวมใส่' : have ? 'อยู่ในกระเป๋า' : 'ยังไม่ได้รับ'],
      it.rare ? ['ความหายาก', 'หายาก'] : null
    ].filter(Boolean);
    let cmp = '';
    if (it.kind === 'gear') {
      const cur = S.equip[it.slot];
      if (cur && cur !== id) {
        const c = ITEMS[cur];
        const diff = STAT_TH.map(([k, l]) => { const d = +((it[k] || 0) - (c[k] || 0)).toFixed(2); return d ? `<span class="${d > 0 ? 'up' : 'dn'}">${l} ${d > 0 ? '+' : ''}${d}</span>` : ''; }).filter(Boolean).join(' ');
        cmp = `<div class="iicmp"><small>กำลังสวมใส่ · ${SLOT_TH[it.slot]}</small><p>${UI.itemIcon(cur)} <b>${c.name}</b> <span class="muted">${this.statLine(c)}</span></p><p class="iidiff">ถ้าเปลี่ยนเป็นชิ้นนี้: ${diff || 'ค่าสถานะเท่าเดิม'}</p></div>`;
      } else if (eq) cmp = `<div class="iicmp"><small>กำลังสวมใส่ชิ้นนี้อยู่</small></div>`;
    }
    const src = this.sources(id);
    const srcH = src.length ? src.map((s, i) => `<li>${icon(s.ic in ICONS ? s.ic : 'star')}<div><b>${s.t}</b><small>${s.s}</small></div>${s.go ? `<button class="btn sm ghost" data-isrc="${i}">${s.go.panel ? 'เปิด' : 'นำทาง'}</button>` : ''}</li>`).join('') : '<li class="emptyrow">ยังไม่มีวิธีหาเพิ่มในเวอร์ชันนี้</li>';
    let act = '';
    if (have && it.kind === 'use' && !it.revive) act = `<button class="btn" data-iact="use">ใช้</button>`;
    if (have && (it.kind === 'gear' || it.kind === 'cos')) act = `<button class="btn ${eq ? 'ghost' : ''}" data-iact="eq">${eq ? 'ถอด' : 'สวมใส่'}</button>`;
    const stat = this.statLine(it);
    const el = $('#itempop');
    el.innerHTML = `<div class="iibox" role="dialog" aria-modal="true" aria-labelledby="iiname">
      <div class="iihead"><span class="lbdia"></span><h3>รายละเอียดไอเทม</h3><span class="lbdia"></span><button class="iiclose" data-iact="close" aria-label="ปิด">${icon('close')}</button></div>
      <div class="iiscroll"><div class="iil">
        <div class="iitop"><div class="iiart ${it.rare ? 'rare' : ''}">${UI.itemIcon(id)}</div><div><h2 id="iiname">${it.name}</h2><small>${KIND_TH[it.kind] || ''}${it.slot ? ' · ' + SLOT_TH[it.slot] : ''}</small></div></div>
        ${stat ? `<div class="iistat">${stat}</div>` : ''}
        <p class="iilore">${ITEM_LORE[id] || it.desc}</p>
        <h4 class="iisec">${icon('book')} คุณสมบัติ</h4>
        <dl class="iiprops">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>
        ${cmp}</div>
        <div class="iir"><h4 class="iisec">${icon('map')} ได้จากที่ไหน</h4>
        <ul class="iisrc">${srcH}</ul></div>
      </div>
      ${act ? `<div class="iifoot">${act}</div>` : ''}
    </div>`;
    el.hidden = false; this.src = src;
    const f = el.querySelector('.iiclose'); if (f) f.focus({ preventScroll: true });
  },
  close() { const el = $('#itempop'); if (el) { el.hidden = true; el.innerHTML = ''; } this.id = null; },
  go(g) {
    const id = this.id; this.close();
    if (g.panel) return UI.openPanel(g.panel);
    UI.closePanel();
    if (g.quest) return Nav.goQuest(g.quest);
    let ok = false;
    if (g.npc) ok = Nav.goNpc(g.npc, 'ไปหา');
    else if (g.boss) ok = Nav.go({ zone: 'dungeon', x: DX, z: -86, r: 3, label: 'บุกลานผู้พิทักษ์ผลึก', arrive: () => UI.toast('ยักษ์ศิลา อยู่ข้างหน้า! ระวังวงสีแดงบนพื้น', 'boss') });
    else if (g.mon) { const sp = Nav.monsterSpot(g.mon); if (sp) ok = Nav.go({ zone: sp.zone, x: sp.x, z: sp.z, r: 4, label: 'ไปล่า' + MONSTERS[g.mon].name, arrive: () => UI.toast(`ถึงแล้ว! ปราบ${MONSTERS[g.mon].name}เพื่อหา ${ITEMS[id].name}`, 'quest') }); }
    if (!ok) UI.toast('ยังไปที่นั่นไม่ได้ ลองทำเควสหลักเพื่อเปิดเส้นทางก่อน', 'warn');
  },
  init() {
    const el = $('#itempop');
    el.addEventListener('click', e => {
      if (e.target === el) return this.close();
      const a = e.target.closest('[data-iact]');
      if (a) { const k = a.dataset.iact, id = this.id; if (k === 'close') return this.close(); this.close(); if (k === 'use') Game.useItem(id); else if (k === 'eq') Game.equip(id); if (UI.panelOpen) UI.renderPanel(); return; }
      const s = e.target.closest('[data-isrc]'); if (s) this.go(this.src[+s.dataset.isrc].go);
    });
    document.addEventListener('click', e => {
      const t = e.target.closest('[data-info]'); if (!t || e.target.closest('button:not([data-info])')) return;
      this.open(t.dataset.info);
    });
    addEventListener('keydown', e => { if (e.key === 'Escape' && this.id) { e.stopPropagation(); this.close(); } }, true);
  }
};

