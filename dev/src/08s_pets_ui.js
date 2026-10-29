
/* ============================================================
   Pets UI + hooks: pet window (U), pet shop NPC ปุยฝ้าย,
   ground-loot hooks, pet ability hooks into combat/XP/coins.
   ============================================================ */
ICONS.egg = '<path d="M12 2.5c-4 0-7 6-7 11a7 7 0 0 0 14 0c0-5-3-11-7-11z" fill="currentColor"/><path d="M7.5 13l2.2-1.6 2.3 1.8 2.3-1.8 2.2 1.6" stroke="#fff" stroke-width="1.3" fill="none" opacity=".7"/>';
const PetThumb = {
  R: null, cache: {},
  ensure() {
    if (this.R) return true;
    try {
      const cv = document.createElement('canvas'); cv.width = 128; cv.height = 128; this.R = new Renderer(cv); const R = this.R; TexGen.init(R);
      R.resize = function () { this.cv.width = 128; this.cv.height = 128; this.gl.viewport(0, 0, 128, 128); };
      Object.assign(R.env, { sun: [.45, .8, .4], sunC: [.75, .72, .66], sky: [.62, .64, .76], gnd: [.36, .34, .4], fogC: [.11, .08, .06], fog: [1e4, 1e4 + 1], noSky: true, top: [.72, .78, .95], bot: [.93, .92, .98] });
      const l = Math.hypot(...R.env.sun); R.env.sun = R.env.sun.map(v => v / l); return true;
    } catch (e) { this.R = null; return false; }
  },
  get(k) {
    if (this.cache[k]) return this.cache[k]; if (!this.ensure()) return '';
    const R = this.R, D = PETS[k], m = PetMesh.get(R, k); R.resize(); R.time = 1;
    const fly = m.fly || 0, h = (m.h || 1) * D.sz + fly * D.sz * .7, dist = h * 1.15 + .55, cy = h * .5 + fly * D.sz * .25;
    R.setCamera([Math.sin(.55) * dist, cy + h * .35, Math.cos(.55) * dist], [0, cy, 0], .72); R.setLights([{ x: 2, y: 4, z: 3, r: 10, c: [.35, .3, .4] }]); R.begin(); R.useLit();
    try { drawPet(R, k, 0, 0, 0, 0, { t: 1, amp: 0, ph: 0 }); } catch (e) { console.warn(e); }
    return this.cache[k] = this.cut(R.cv);
  },
  // make the sky background transparent and crop to the pet
  cut(cv) {
    try {
      const c = document.createElement('canvas'); c.width = cv.width; c.height = cv.height; const x = c.getContext('2d'); x.drawImage(cv, 0, 0);
      const im = x.getImageData(0, 0, c.width, c.height), d = im.data, b = [d[0], d[1], d[2]];
      for (let i = 0; i < d.length; i += 4) { const e = Math.abs(d[i] - b[0]) + Math.abs(d[i + 1] - b[1]) + Math.abs(d[i + 2] - b[2]); if (e < 10) d[i + 3] = 0; else if (e < 40) d[i + 3] = Math.round(255 * (e - 10) / 30); }
      x.putImageData(im, 0, 0); return c.toDataURL('image/png');
    } catch (e) { return cv.toDataURL('image/png'); }
  },
  img(k, cls = '') { const s = this.get(k); return s ? `<img class="petimg ${cls}" src="${s}" alt="">` : icon('paw'); }
};
{
  // icons: eggs show the pet inside
  const oi = UI.itemIcon.bind(UI); UI.itemIcon = function (id) { const it = ITEMS[id]; if (it && it.egg) return `<span class="ic eggic r-${it.rare ? 'rare' : 'use'}">${PetThumb.img(it.egg)}</span>`; return oi(id); };
  const gi = Gems.icon.bind(Gems); Gems.icon = function (g) { return g.pet ? `<span class="ic eggic r-rare">${PetThumb.img(g.pet)}</span>` : gi(g); };

  /* ---- ground loot: drops from normal monsters fall on the floor ---- */
  const ok = Combat.kill.bind(Combat);
  Combat.kill = function (m) {
    const ground = Loot.on() && !m.summon && !m.d.boss && !m.d.wboss; Loot._killing = ground ? m : null;
    try { ok(m); } finally { Loot._killing = null; }
    const luck = Pets.v('luck'); if (luck && !m.summon && Math.random() < luck) { const pool = m.d.drops.filter(d => !d[2]); if (pool.length) { const [id] = pool[randi(0, pool.length - 1)]; if (ground) Loot.drop(m, id, 1); else Game.addItem(id, 1); Pets.say('เจอของเพิ่ม!'); } }
  };
  const oa = Game.addItem.bind(Game);
  Game.addItem = function (id, n, silent) { if (Loot._killing && n > 0 && !Loot._picking && ITEMS[id]) { Loot.drop(Loot._killing, id, n); return; } oa(id, n, silent); };

  /* ---- pet ability hooks ---- */
  const orc = Player.recalc.bind(Player);
  Player.recalc = function () {
    orc(); const st = this.stats, S = Save.d; if (!Pets.cur()) return;
    const a = Pets.v('atk'), d = Pets.v('def'), h = Pets.v('hpmax'), s = Pets.v('spd');
    if (a) st.atk = Math.round(st.atk * (1 + a)); if (d) st.def = Math.round(st.def * (1 + d)); if (h) st.maxhp = Math.round(st.maxhp * (1 + h)); if (s) st.spd *= 1 + s;
    S.hp = Math.min(S.hp, st.maxhp);
  };
  const ocb = RoleSys.critBonus.bind(RoleSys); RoleSys.critBonus = function () { return ocb() + Pets.v('crit'); };
  const ox = Game.gainXP.bind(Game); Game.gainXP = function (n) { return ox(n * (1 + Pets.v('xp'))); };
  const oc = Game.gainCoins.bind(Game); Game.gainCoins = function (n) { return oc(n * (1 + Pets.v('coin'))); };
  const odm = Combat.damageMonster.bind(Combat);
  Combat.damageMonster = function (m, raw, o) {
    const h0 = m.hp; odm(m, raw, o); const dealt = Math.max(0, h0 - Math.max(0, m.hp)); if (!dealt) return;
    const L = Pets.v('leech'); if (L) { const S = Save.d; S.hp = Math.min(Player.stats.maxhp, S.hp + dealt * L); }
    const st = Pets.v('steal'); if (st && Math.random() < st) { const c = randi(1, 3 + Math.round(m.d.lvl || 1)); Save.d.coins += c; UI.coinPop(c); if (Math.random() < .3) Pets.say('ขโมยได้ ' + c + ' เหรียญ!', 1.6); }
  };
  const ohp = Combat.hitPlayer.bind(Combat); Combat.hitPlayer = function (raw, src) { const s = Pets.v('shield'); return ohp(s ? raw * (1 - s) : raw, src); };

  /* ---- loop / draw ---- */
  const ou = Game.update.bind(Game);
  Game.update = function (dt) { ou(dt); if (this.started && !this.paused && Save.d) { Pets.update(dt); Loot.update(dt); } };
  const omd = Monsters.draw; Monsters.draw = function (R, t) { omd.call(this, R, t); if (Game.started) { try { Pets.draw(R); Loot.draw(R); } catch (e) { console.error(e); } } };

  /* ---- items ---- */
  const ouse = Game.useItem.bind(Game);
  Game.useItem = function (id, quick) {
    const it = ITEMS[id], S = Save.d; if (!it || !S.inv[id]) return ouse(id, quick);
    if (it.egg) { if (Pets.hatch(it.egg)) { oa(id, -1, true); UI.refreshAll && UI.refreshAll(); if (!WM.isOpen('pets')) UI.openPanel('pets', { sel: it.egg }); } return; }
    if (id === 'pet_food' || id === 'pet_treat') { Pets.feed(id); if (WM.isOpen('pets')) WM.render('pets'); return; }
    return ouse(id, quick);
  };

  /* ---- plates: pet name & speech bubble, loot labels ---- */
  const onp = UI.netPlates.bind(UI);
  UI.netPlates = function (want) {
    onp(want); const P = Player; if (!Game.started) return;
    const k = Pets.cur();
    if (k && Pets.zone === P.zone) { const D = PETS[k], m = Game.R && PetMesh.get(Game.R, k); const h = ((m && m.h) || 1) * D.sz + ((m && m.fly) || 0) * D.sz; want.push({ key: 'pet', x: Pets.x, y: h + .35, fy: ((m && m.fly) || 0) * D.sz * .6, z: Pets.z, cls: 'pet', html: () => `${Pets.bubble ? `<span class="mbub">${esc(Pets.bubble)}</span>` : ''}<span class="nm petn">${esc(Pets.info(k).name)}</span>` }); }
    let n = 0;
    for (const l of Loot.list) { if (l.zone !== P.zone || l.t < .55 || dist2(l.x, l.z, P.x, P.z) > 16 * 16 || n++ > 14) continue; const it = ITEMS[l.id]; want.push({ key: 'l' + l.uid, x: l.x, y: .55, fy: .05, z: l.z, cls: 'loot', html: () => `<span class="nm lootn ${l.rare ? 'rare' : ''}">${esc(it.name)}${l.n > 1 ? ' ×' + l.n : ''}</span>` }); }
  };

  /* ---- shop + NPC ---- */
  SHOPS.pets = ['ร้านสัตว์เลี้ยงของปุยฝ้าย', 'ดูสัตว์เลี้ยงและอาหาร', () => PET_SHOP, 1];
  NPCS.puifai = { name: 'ปุยฝ้าย', role: 'ร้านสัตว์เลี้ยง', sheet: 'adventurer', zone: 'world', x: 20, z: 56, face: -2.2, shop: 'pets' };
  NPC_IDLE.puifai = 'ไข่สัตว์เลี้ยงมาใหม่ทุกวันเลยจ้ะ! ใช้ไข่ในกระเป๋าเพื่อฟัก แล้วอย่าลืมให้อาหารตอนน้องหิวนะ น้องจะได้รักเรามากขึ้น';

  /* ---- settings ---- */
  if (Settings.d.groundLoot === undefined) Settings.d.groundLoot = 1;
  const os = UI.pSettings.bind(UI);
  UI.pSettings = function () {
    os(); const b = this.el.pbody, fs = document.createElement('fieldset');
    fs.innerHTML = `<legend>ของดรอปและสัตว์เลี้ยง</legend><label class="chk"><input type="checkbox" id="gloot" ${Settings.d.groundLoot !== 0 ? 'checked' : ''}> ของที่มอนสเตอร์ดรอปตกพื้นแบบ RO (เดินทับหรือให้สัตว์เลี้ยงเก็บ · กด Z เก็บรอบตัว)</label>`;
    const ref = b.querySelector('.row'); b.insertBefore(fs, ref || null);
    fs.querySelector('#gloot').onchange = e => { Settings.d.groundLoot = e.target.checked ? 1 : 0; Settings.save(); };
  };
}

/* ---- pet window ---- */
UI.extraPanels = UI.extraPanels || {}; UI.extraPanels.pets = 'pPets';
UI.pPets = function (o) {
  const S = Save.d, d = Pets.data(), owned = PET_ORDER.filter(k => d.own[k]);
  const sel = o.sel && d.own[o.sel] ? o.sel : (Pets.cur() || owned[0]); if (sel) o.sel = sel;
  const bar = (v, max, cls) => `<span class="pbar ${cls}"><i style="width:${Math.round(v / max * 100)}%"></i></span>`;
  let det = '';
  if (sel) {
    const D = PETS[sel], p = d.own[sel], tr = petTier(p.int), out = Pets.cur() === sel;
    det = `<div class="petdet"><div class="petbig">${PetThumb.img(sel, 'big')}</div><div class="petinfo">
      <b class="petname">${esc(p.name)}</b> <small>${D.name}</small>
      <div class="pstat"><span>ความสนิทสนม</span>${bar(p.int, 1000, 'int')}<em class="t${PET_TIERS.indexOf(tr)}">${tr[1]}</em></div>
      <div class="pstat"><span>ความหิว</span>${bar(p.hun, 100, 'hun')}<em>${petHunger(p.hun)}</em></div>
      <p class="pab"><b>${icon('star')} ความสามารถ:</b> ${D.ab.d} <small>(ตอนนี้ได้ผล ${Math.round(tr[2] * 100)}%)</small></p>
      <p class="muted">${D.story}</p>
      <div class="petbtns">
        ${out ? `<button class="btn" data-pt="recall">เก็บเข้าไข่</button>` : `<button class="btn primary" data-pt="summon">เรียกออกมา</button>`}
        <button class="btn" data-pt="feed" ${out ? '' : 'disabled'}>ให้อาหาร (${S.inv.pet_food || 0})</button>
        <button class="btn" data-pt="treat" ${out && S.inv.pet_treat ? '' : 'disabled'}>ให้ขนม (${S.inv.pet_treat || 0})</button>
        <button class="btn ghost" data-pt="perf" ${out ? '' : 'disabled'}>แสดงท่า</button>
        <button class="btn ghost" data-pt="name" ${out ? '' : 'disabled'}>ตั้งชื่อ</button>
        <label class="chk"><input type="checkbox" id="petloot" ${d.loot !== 0 ? 'checked' : ''}> ให้เก็บของที่ตกพื้น</label>
      </div></div></div>`;
  } else det = `<div class="petdet empty"><p>ยังไม่มีสัตว์เลี้ยง ไปที่ <b>ปุยฝ้าย ร้านสัตว์เลี้ยง</b> ในเมืองหลวงเพื่อซื้อไข่ แล้วกด "ใช้" ไข่ในกระเป๋าเพื่อฟัก</p><button class="btn primary" data-pt="goshop">นำทางไปร้านสัตว์เลี้ยง</button></div>`;
  const grid = PET_ORDER.map(k => { const D = PETS[k], own = d.own[k]; return `<button class="petcard ${own ? 'own' : 'lock'} ${k === sel ? 'on' : ''}" data-ps="${k}" title="${D.name}">${PetThumb.img(k)}<span>${own ? esc(own.name) : D.name}</span>${Pets.cur() === k ? '<i class="pcur">ออกอยู่</i>' : ''}${own ? '' : `<small>${D.gems ? gemSvg() + D.gems : icon('coin') + fmt(D.price)}</small>`}</button>`; }).join('');
  this.setPanel(`${icon('paw')} สัตว์เลี้ยง <small>${owned.length}/${PET_ORDER.length}</small>`, `${det}<h4 class="petall">สัตว์เลี้ยงทั้งหมด ${PET_ORDER.length} ชนิด</h4><div class="petgrid">${grid}</div><p class="muted">ไข่ที่ใช้เหรียญซื้อได้ที่ร้านของปุยฝ้าย · ไข่หายากอยู่ในร้านเพชร หมวดสัตว์เลี้ยง · ป้อนอาหารตอนหิวจะสนิทกันขึ้น ป้อนตอนอิ่มความสนิทจะลดลง</p>`, true);
  const b = this.el.pbody;
  const lt = b.querySelector('#petloot'); if (lt) lt.onchange = e => { d.loot = e.target.checked ? 1 : 0; };
  b.onclick = e => {
    const c = e.target.closest('[data-ps]'); if (c) { const k = c.dataset.ps; if (d.own[k]) { this.panelOpt.sel = k; this.renderPanel(); } else if (PETS[k].gems) this.openPanel('gemshop', { cat: 'pet' }); else UI.toast(`ซื้อ ไข่${PETS[k].name} ได้ที่ร้านของปุยฝ้าย (${fmt(PETS[k].price)} เหรียญ)`, 'info'); return; }
    const t = e.target.closest('[data-pt]'); if (!t) return; const a = t.dataset.pt; Audio.sfx('ui');
    if (a === 'summon') Pets.summon(sel); else if (a === 'recall') Pets.recall(); else if (a === 'feed') Pets.feed('pet_food'); else if (a === 'treat') Pets.feed('pet_treat'); else if (a === 'perf') Pets.perform();
    else if (a === 'name') { const n = prompt('ตั้งชื่อสัตว์เลี้ยง (ไม่เกิน 14 ตัวอักษร)', d.own[sel].name); if (n) Pets.rename(n); }
    else if (a === 'goshop') { const n = NPCList.find(x => x.id === 'puifai'); if (n) { this.closePanel(); Nav.go({ zone: n.zone, x: n.x, z: n.z + 1.6, label: 'ร้านสัตว์เลี้ยงของปุยฝ้าย', arrive: () => UI.dialog(n) }); } return; }
    this.renderPanel();
  };
};
