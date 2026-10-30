/* ============================================================
   Fashion UI: item thumbnails, full-look preview, wardrobe panel,
   gem-shop slot filter
   ============================================================ */
const FashionThumb = {
  info: {},
  bounds(id) {
    if (this.info[id]) return this.info[id];
    const g = new Geo(3); g.jit = 0; const sp = COS_MESH[id], W = WSKIN[id];
    if (sp) sp.mk(g); else if (W) { if (W.elR) W.elR(g); if (W.elL) { g.push(.3, 0, 0); W.elL(g); g.pop(); } }
    let mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9]; const d = g.d;
    for (let i = 0; i < d.length; i += 12) for (let k = 0; k < 3; k++) { if (d[i + k] < mn[k]) mn[k] = d[i + k]; if (d[i + k] > mx[k]) mx[k] = d[i + k]; }
    if (!d.length) mn = [0, 0, 0], mx = [1, 1, 1];
    const c = [(mn[0] + mx[0]) / 2, (mn[1] + mx[1]) / 2, (mn[2] + mx[2]) / 2]; const r = Math.max(.2, Math.hypot(mx[0] - mn[0], mx[1] - mn[1], mx[2] - mn[2]) / 2);
    return this.info[id] = { c, r, geo: g };
  },
  icon(id) {
    const b = this.bounds(id); const sp = COS_MESH[id]; const d = b.r * 2.3;
    const dir = sp && sp.slot === 'face' ? [.35, .25, 1] : sp && sp.bone === 'cape' ? [.4, .2, -1] : [.8, .55, 1]; const l = Math.hypot(...dir);
    const eye = [b.c[0] + dir[0] / l * d, b.c[1] + dir[1] / l * d, b.c[2] + dir[2] / l * d];
    return ThumbR.shot('fi_' + id, 96, 96, eye, b.c, .75, R => { let m; if (sp) m = CosMesh.get(R, id); else { m = R.mesh(b.geo); } if (m) R.drawMesh(m, IDM, null, (sp && sp.emis) || (WSKIN[id] && WSKIN[id].emis) || null); });
  },
  look(S, face = .3) {
    const sheet = Sheets.key(S), c = S.cos || {}; const key = `look_${sheet}|${c.head || ''}|${c.face || ''}|${c.back || ''}|${face}`;
    return ThumbR.shot(key, 240, 340, [.95, 2.1, 4.8], [0, 1.35, 0], .7, R => {
      Sheets.ensure(sheet); if (!ThumbR.cm[sheet]) ThumbR.cm[sheet] = buildCharModel(R, sheet);
      const rig = new Rig(sheet); for (let i = 0; i < 30; i++) rig.update(.05, {}); rig.pose(0, 0, 0, face, CHAR_SCALE); rig.draw(R, ThumbR.cm[sheet], {});
      drawCosmetics3D(R, rig, { head: c.head, face: c.face, back: c.back, sheet, anim: 1.2, walk: 0 });
    });
  }
};
{
  const oi = UI.itemIcon.bind(UI);
  UI.itemIcon = function (id) { const it = ITEMS[id]; if (it && it.fx3d && it.slot !== 'outfit') { const src = FashionThumb.icon(id); if (src) return `<img class="ic pimg" src="${src}" alt="">`; } return oi(id); };
}
const SLOT_TABS = [['outfit', 'ชุด'], ['head', 'หมวก'], ['face', 'ใบหน้า'], ['back', 'หลัง'], ['wskin', 'สกินอาวุธ'], ['aura', 'ออร่า']];
UI.pWardrobe = function (o) {
  const S = Save.d; const slot = o.slot || 'outfit'; this.panelOpt.slot = slot; const job = S.job || S.cls; const fam = WEAPON_FAM[job];
  const owned = id => S.inv[id] > 0; const src = id => { const g = GEM_ITEMS.find(x => x.item === id); if (g) return 'ร้านเพชร'; if (TAILOR_ITEMS.includes(id)) return 'ร้านตัดเสื้อ'; for (const q in QUESTS) if ((QUESTS[q].rew && QUESTS[q].rew.items || []).some(x => x[0] === id)) return 'เควส ' + QUESTS[q].name; return 'ของหายาก'; };
  const ids = Object.keys(ITEMS).filter(id => ITEMS[id].kind === 'cos' && ITEMS[id].slot === slot).sort((a, b) => (owned(b) - owned(a)) || (ITEMS[a].fx3d ? 0 : 1) - (ITEMS[b].fx3d ? 0 : 1));
  const cur = S.cos[slot];
  const cards = ids.map(id => { const it = ITEMS[id]; const on = cur === id; const ok = owned(id); const bad = slot === 'wskin' && !WSKIN[it.skin].fam.includes(fam); return `<div class="wcard ${on ? 'on' : ''} ${ok ? '' : 'locked'} ${bad ? 'bad' : ''}" data-wear="${id}" role="button" tabindex="0"><span class="winfo" data-info="${id}" title="รายละเอียด">i</span>${this.itemIcon(id)}<b>${it.name}</b><small>${on ? 'กำลังใส่' : ok ? 'คลิกเพื่อใส่' : src(id)}${bad ? ' · ใช้กับ' + FAM_TH[fam] + 'ไม่ได้' : ''}</small></div>`; }).join('');
  const worn = SLOT_TABS.map(([s, l]) => { const id = S.cos[s]; return `<li><small>${l}</small><b>${id ? ITEMS[id].name : s === 'outfit' ? 'ชุดประจำอาชีพ' : '-'}</b>${id ? `<button class="btn sm ghost" data-wear="${id}">ถอด</button>` : ''}</li>`; }).join('');
  this.setPanel(`${icon('person')} ตู้เสื้อผ้า`, `
    <div class="wardrobe">
      <div class="wprev"><img src="${FashionThumb.look(S, slot === 'back' ? 2.6 : .3)}" alt=""><p class="wname">${esc(S.name)} · ${Cls.name(S)}</p><ul class="wworn">${worn}</ul></div>
      <div class="wlist"><div class="wtabs">${SLOT_TABS.map(([s, l]) => `<button class="gcat ${s === slot ? 'on' : ''}" data-wslot="${s}"><span>${l}</span><i>${Object.keys(ITEMS).filter(id => ITEMS[id].kind === 'cos' && ITEMS[id].slot === s && owned(id)).length}</i></button>`).join('')}</div>
      <p class="muted">${slot === 'outfit' ? 'ชุดแฟชั่นจะใช้อาวุธของอาชีพปัจจุบัน และสีผมตามสายอาชีพ' : slot === 'wskin' ? `อาชีพของคุณใช้${FAM_TH[fam] || 'อาวุธ'} · สกินจะเปลี่ยนรูปร่างอาวุธที่ถือในมือ` : slot === 'head' ? 'หมวกบางแบบปิดทั้งหัว ใส่คู่กับชุดที่มีหมวกในตัวไม่ได้' : 'ไอเทมที่ยังไม่มีจะบอกแหล่งที่หาได้'}</p>
      <div class="wgrid">${cards || '<p class="muted">ยังไม่มีไอเทมในช่องนี้</p>'}</div></div>
    </div>`);
  this.el.pbody.onclick = e => {
    const t = e.target.closest('[data-wslot]'); if (t) { this.panelOpt.slot = t.dataset.wslot; return this.renderPanel(); }
    if (e.target.closest('[data-info]')) return; const w = e.target.closest('[data-wear]'); if (!w) return; const id = w.dataset.wear;
    if (!owned(id)) { ItemInfo.open(id); return; }
    const it = ITEMS[id]; if (it.slot === 'wskin' && !WSKIN[it.skin].fam.includes(fam)) { this.toast('สกินนี้ใช้กับอาวุธของอาชีพคุณไม่ได้', 'warn'); return; }
    Game.equip(id); Player.rig = null; this.renderPanel();
  };
};
/* menu entry + char panel shortcut */
{
  const oc = UI.pChar.bind(UI);
  UI.pChar = function (o) { oc(o); const b = this.el.pbody.querySelector('[data-go="jobinfo"]'); if (b && !this.el.pbody.querySelector('[data-go="wardrobe"]')) { const w = document.createElement('button'); w.className = 'btn sm ghost'; w.dataset.go = 'wardrobe'; w.textContent = 'ตู้เสื้อผ้า'; b.after(w); w.onclick = () => this.openPanel('wardrobe'); } };
  // gem shop: filter the fashion category by slot
  const og = UI.pGemShop.bind(UI);
  UI.pGemShop = function (o) {
    const fs = o.fslot; const all = GEM_ITEMS.slice();
    if ((o.cat || 'deal') === 'fashion' && fs) { GEM_ITEMS.length = 0; for (const g of all) if (g.cat !== 'fashion' || (ITEMS[g.item] || {}).slot === fs) GEM_ITEMS.push(g); }
    try { og(o); } finally { GEM_ITEMS.length = 0; for (const g of all) GEM_ITEMS.push(g); }
    if ((o.cat || 'deal') !== 'fashion') return;
    const head = this.el.pbody.querySelector('.gcathead'); if (!head) return;
    const chips = document.createElement('div'); chips.className = 'wtabs small'; chips.innerHTML = `<button class="gcat ${!fs ? 'on' : ''}" data-fslot=""><span>ทั้งหมด</span></button>` + SLOT_TABS.map(([s, l]) => `<button class="gcat ${fs === s ? 'on' : ''}" data-fslot="${s}"><span>${l}</span><i>${all.filter(g => g.cat === 'fashion' && (ITEMS[g.item] || {}).slot === s).length}</i></button>`).join('');
    head.after(chips); chips.onclick = e => { const b = e.target.closest('[data-fslot]'); if (!b) return; e.stopPropagation(); this.panelOpt.fslot = b.dataset.fslot || null; this.renderPanel(); };
  };
}

