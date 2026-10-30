
/* ============================================================
   Profile (tap the portrait): RO-style equipment window with
   the character art in the middle, gear / fashion / pet / mount
   slots on both sides, full status, title, and profile frames
   unlocked from levels, quests, events, MVPs, pets, cards,
   refining and top-ups.
   ============================================================ */
const FRAMES = [
  { id: 'basic', name: 'ทองเหลือง', how: 'เริ่มต้น', ok: () => true },
  { id: 'wood', name: 'ไม้โอ๊ก', how: 'ถึงเลเวล 5', ok: S => S.level >= 5 },
  { id: 'silver', name: 'เงินยวง', how: 'ถึงเลเวล 10', ok: S => S.level >= 10 },
  { id: 'gold', name: 'ทองคำ', how: 'ถึงเลเวล 20', ok: S => S.level >= 20 },
  { id: 'leaf', name: 'ใบไม้แห่งป่ากระซิบ', how: 'เควส "ก้าวแรกแห่งสยาม"', ok: S => qd(S, 'm1') },
  { id: 'crystal', name: 'ผลึกยักษ์ศิลา', how: 'เควส "หัวใจผลึกแห่งถ้ำลึก"', ok: S => qd(S, 'm3') },
  { id: 'explorer', name: 'เข็มทิศนักสำรวจ', how: 'เควส "สามมุมโลกของนักทำแผนที่"', ok: S => qd(S, 'n_explore') },
  { id: 'ghost', name: 'สายสิญจน์ปราบผี', how: 'ปราบผีในวัดร้าง 50 ตัว', ok: S => (S.stats.ghostKills || 0) >= 50 },
  { id: 'nak', name: 'แม่นากพระโขนง', how: 'ส่งวิญญาณแม่นาก', ok: S => (S.stats.nakKills || 0) >= 1 },
  { id: 'mvp', name: 'มงกุฎ MVP', how: 'ได้ MVP จากบอส MVP', ok: S => (S.stats.mvpKills || 0) >= 1 },
  { id: 'pet', name: 'อุ้งเท้าน่ารัก', how: 'มีสัตว์เลี้ยง 3 ตัว', ok: S => S.pets && Object.keys(S.pets.own).length >= 3 },
  { id: 'card', name: 'นักสะสมการ์ด', how: 'สะสมการ์ด 8 ใบ', ok: S => S.cardBook && Object.keys(S.cardBook).length >= 8 },
  { id: 'smith', name: 'ประกายตีบวก', how: 'ตีบวกอุปกรณ์ถึง +10', ok: S => S.refine && Object.values(S.refine).some(v => v >= 10) },
  { id: 'friend', name: 'มิตรภาพ', how: 'มีเพื่อน 3 คน', ok: S => S.friends && Object.keys(S.friends).length >= 3 },
  { id: 'halloween', name: 'ฮาโลวีนฟักทอง', how: 'กิจกรรมฮาโลวีน (เข้าเกมช่วงเทศกาล)', ok: S => !!(S.evFrames && S.evFrames.halloween) },
  { id: 'vip', name: 'VIP ผู้สนับสนุน', how: 'เติมเพชรสะสม ฿300 (ทดลอง)', ok: S => S.topup && S.topup.spent >= 300 },
  { id: 'legend', name: 'ตำนานสายรุ้ง', how: 'เติมเพชรสะสม ฿1,000 (ทดลอง)', ok: S => S.topup && S.topup.spent >= 1000 }
];
const qd = (S, id) => S.quests[id] && S.quests[id].s === 'done';
const Profile = {
  frames(S) { return FRAMES.filter(f => f.ok(S)); },
  cur(S) { const f = FRAMES.find(x => x.id === S.frame); return f && f.ok(S) ? f.id : 'basic'; },
  apply() { const S = Save.d; const p = $('#portrait'); if (!p || !S) return; const id = this.cur(S); for (const c of [...p.classList]) if (c.startsWith('pf-')) p.classList.remove(c); p.classList.add('pf-' + id); },
  checkNew() { const S = Save.d; if (!S) return; S.frameSeen = S.frameSeen || {}; for (const f of this.frames(S)) if (!S.frameSeen[f.id]) { S.frameSeen[f.id] = 1; if (f.id !== 'basic') UI.toast(`ปลดล็อกกรอบโปรไฟล์ "${f.name}" แตะรูปตัวละครเพื่อเปลี่ยน`, 'rare'); } }
};
{
  const oi = UI.init.bind(UI);
  UI.init = function () { oi(); const p = $('#portrait'); if (p) { p.style.cursor = 'pointer'; p.title = 'ดูข้อมูลตัวละคร'; p.addEventListener('click', e => { e.stopPropagation(); if (!Game.started) return; Audio.sfx('ui'); if (WM.isOpen('profile')) WM.close('profile'); else UI.openPanel('profile'); }); } };
  const ou = Game.update.bind(Game); Game.update = function (dt) { ou(dt); if (!this.started || !Save.d) return; this._pfT = (this._pfT || 0) + dt; if (this._pfT > 3) { this._pfT = 0; Profile.checkNew(); Profile.apply(); } };
  const os = Game.start.bind(Game); Game.start = function (d) { os(d); const m = new Date().getMonth(); if (m === 9 || (m === 10 && new Date().getDate() <= 1)) { d.evFrames = d.evFrames || {}; d.evFrames.halloween = 1; } Profile.apply(); };
}
UI.extraPanels = UI.extraPanels || {}; UI.extraPanels.profile = 'pProfile';
UI.pProfile = function (o) {
  const S = Save.d, P = Player, st = P.stats, tab = o.tab || 'eq'; this.panelOpt.tab = tab;
  const art = (this.bodies && (this.bodies[P.sheet] || this.bodies[S.cls])) || '';
  const slot = (kind, key, label) => {
    let id = null, ic = '', nm = 'ว่าง';
    if (kind === 'g') { id = S.equip[key]; if (id) { ic = this.itemIcon(id); nm = (typeof Refine !== 'undefined' ? Refine.label(id) : ITEMS[id].name); } }
    else if (kind === 'c') { id = S.cos[key]; if (id) { ic = this.itemIcon(id); nm = ITEMS[id].name; } }
    else if (kind === 'pet') { const k = Pets.cur(); if (k) { ic = `<span class="ic eggic">${PetThumb.img(k)}</span>`; nm = Pets.info(k).name; } }
    else if (kind === 'mount') { const k = Mounts.cur(); if (k) { ic = `<img class="ic pimg mthumb" src="${StableView.thumb(k)}" alt="">`; nm = MOUNTS[k].name + ' Lv.' + Mounts.lv(k); } }
    const cards = kind === 'g' && id && S.cards && S.cards[id] ? S.cards[id].length : 0, slots = kind === 'g' && id ? itemSlots(id) : 0;
    return `<div class="pfslot ${ic ? 'on' : ''} ${id ? 'hasinfo' : ''}" ${id ? `data-info="${id}"` : ''} data-pk="${kind}">${ic || '<span class="empty"></span>'}<div><small>${label}</small><b>${esc(nm)}</b>${slots ? `<i class="pfcards">${'◆'.repeat(cards)}${'◇'.repeat(Math.max(0, slots - cards))}</i>` : ''}</div></div>`;
  };
  const cp = Math.round((st.atk || 0) * 12 + (st.def || 0) * 9 + (st.maxhp || 0) * 1.4 + (st.maxmp || 0) * .7 + S.level * 25);
  const crit = Math.round((.06 + Mounts.pas('crit') + RoleSys.critBonus()) * 100);
  const stats = [['เลเวล', S.level], ['อาชีพ', Cls.name(S)], ['พลังต่อสู้', '⚔ ' + fmt(cp)], ['ATK', st.atk], ['DEF', st.def], ['HP', `${Math.round(S.hp)}/${st.maxhp}`], ['MP', `${Math.round(S.mp)}/${st.maxmp}`], ['ความเร็ว', (+st.spd).toFixed(1)], ['คริติคอล', crit + '%'], ['EXP', (S.xp / xpNeed(S.level) * 100).toFixed(2) + '%'], ['ปราบมอนสเตอร์', fmt(S.stats.kills || 0)], ['MVP', S.stats.mvpKills || 0], ['การ์ดที่สะสม', S.cardBook ? Object.keys(S.cardBook).length : 0], ['สัตว์เลี้ยง', S.pets ? Object.keys(S.pets.own).length : 0], ['เวลาเล่น', Math.floor((S.playT || 0) / 3600) + ' ชม. ' + Math.floor((S.playT || 0) % 3600 / 60) + ' นาที']];
  const fr = Profile.cur(S);
  let body;
  if (tab === 'eq') body = `<div class="pfeq">
      <div class="pfcol">${slot('c', 'head', 'หมวก')}${slot('c', 'face', 'ใบหน้า')}${slot('g', 'weapon', 'อาวุธ')}${slot('g', 'acc', 'เครื่องประดับ')}${slot('pet', '', 'สัตว์เลี้ยง')}</div>
      <div class="pfmid"><div class="pfport pf-${fr}"><div class="pfpimg" style="background-image:${this.portraits && this.portraits[P.sheet] ? `url(${this.portraits[P.sheet]})` : 'none'}"></div></div><img class="pfart" src="${art}" alt=""><b class="pfname">${esc(S.name)}</b><small class="pfttl">${S.title ? '「' + esc(S.title) + '」' : ''}</small></div>
      <div class="pfcol">${slot('c', 'outfit', 'ชุด')}${slot('c', 'back', 'หลัง')}${slot('g', 'armor', 'ชุดเกราะ')}${slot('c', 'aura', 'ออร่า')}${slot('mount', '', 'พาหนะ')}</div></div>
      <dl class="pfstats">${stats.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`;
  else body = `<p class="muted">กรอบโปรไฟล์จะแสดงรอบรูปตัวละครมุมซ้ายบน ปลดล็อกได้จากเลเวล เควส กิจกรรม บอส MVP สัตว์เลี้ยง การ์ด การตีบวก และการเติมเพชร</p><div class="pfgrid">${FRAMES.map(f => { const ok = f.ok(S); return `<button class="pfpick ${ok ? '' : 'lock'} ${f.id === fr ? 'on' : ''}" data-pf="${f.id}" ${ok ? '' : 'disabled'}><span class="pfport sm pf-${f.id}"><span class="pfpimg" style="background-image:${this.portraits && this.portraits[P.sheet] ? `url(${this.portraits[P.sheet]})` : 'none'}"></span></span><b>${f.name}</b><small>${ok ? (f.id === fr ? 'ใช้อยู่' : 'แตะเพื่อใช้') : '🔒 ' + f.how}</small></button>`; }).join('')}</div>`;
  this.setPanel(`${icon('person')} ข้อมูลตัวละคร`, `<div class="tabs"><button class="tab ${tab === 'eq' ? 'on' : ''}" data-tab="eq">อุปกรณ์และสถานะ</button><button class="tab ${tab === 'fr' ? 'on' : ''}" data-tab="fr">กรอบโปรไฟล์ (${Profile.frames(S).length}/${FRAMES.length})</button><button class="tab" data-go="char">อัปสเตตัส</button></div>${body}`, true);
  this.el.pbody.onclick = e => {
    const t = e.target.closest('[data-tab]'); if (t) { this.panelOpt.tab = t.dataset.tab; this.renderPanel(); return; }
    const g = e.target.closest('[data-go]'); if (g) { this.openPanel(g.dataset.go); return; }
    const f = e.target.closest('[data-pf]'); if (f) { S.frame = f.dataset.pf; Profile.apply(); Audio.sfx('level'); this.renderPanel(); return; }
    const k = e.target.closest('[data-pk]'); if (k && !k.dataset.info) { const m = { pet: 'pets', mount: 'stable', c: 'wardrobe', g: 'inv' }[k.dataset.pk]; if (m) this.openPanel(m); }
  };
};
