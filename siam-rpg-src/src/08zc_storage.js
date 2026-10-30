
/* ============================================================
   RO touches: account storage NPC (คลังสินค้า) in the capital,
   and sitting down (emote "นั่งพัก") doubles HP/SP regeneration.
   ============================================================ */
NPCS.nelly = { name: 'เนลลี่', role: 'พนักงานคลังสินค้า', sheet: 'priest', zone: 'world', x: -9, z: 62, face: 2.2, voice: [1.4, 1.1], hair: 45, pose: 15, lines: ['ฝากของไว้กับคลังสินค้าได้นะคะ', 'คลังสินค้ายินดีให้บริการค่ะ', 'กระเป๋าเต็มแล้วเหรอคะ?'] };
NPC_IDLE.nelly = 'สวัสดีค่ะ คลังสินค้าสยาม ยินดีให้บริการ ฝากของได้ 300 ช่อง ใช้ร่วมกันทุกตัวละครในเครื่องนี้ ค่าบริการครั้งละ 40 เหรียญค่ะ';
const STORAGE_KEY = 'siam_storage_v1', STORAGE_MAX = 300;
const Storage = {
  get() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {}; } catch (e) { return {}; } },
  set(v) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(v)); } catch (e) { } },
  put(id, n) { const S = Save.d, st = this.get(); n = Math.min(n, S.inv[id] || 0); if (!n) return; if (!st[id] && Object.keys(st).length >= STORAGE_MAX) { UI.toast('คลังสินค้าเต็มแล้ว', 'warn'); return; } for (const sl in S.equip) if (S.equip[sl] === id && S.inv[id] <= n) { UI.toast('ถอดอุปกรณ์ก่อนฝาก', 'warn'); return; } for (const sl in S.cos) if (S.cos[sl] === id) { UI.toast('ถอดของแต่งตัวก่อนฝาก', 'warn'); return; }
    st[id] = (st[id] || 0) + n; Game.addItem(id, -n, true); this.set(st); Save.write(); },
  take(id, n) { const st = this.get(); n = Math.min(n, st[id] || 0); if (!n) return; st[id] -= n; if (st[id] <= 0) delete st[id]; this.set(st); Game.addItem(id, n, true); Save.write(); }
};
{
  const od = UI.pDialog.bind(UI);
  UI.pDialog = function (o) {
    od(o); if (o.npc !== 'nelly') return; const bt = this.el.pbody.querySelector('.dbtns'); if (!bt) return;
    const b = document.createElement('button'); b.className = 'btn primary'; b.textContent = '📦 เปิดคลังสินค้า (40 เหรียญ)';
    b.onclick = e => { e.stopPropagation(); const S = Save.d; if (S.coins < 40) { UI.toast('เหรียญไม่พอ (ต้องใช้ 40 เหรียญ)', 'warn'); return; } S.coins -= 40; Audio.sfx('coin'); this.openPanel('storage'); };
    bt.insertBefore(b, bt.lastElementChild);
  };
}
UI.extraPanels = UI.extraPanels || {}; UI.extraPanels.storage = 'pStorage';
UI.pStorage = function (o) {
  const S = Save.d, st = Storage.get(), tab = o.tab || 'take'; this.panelOpt.tab = tab;
  const row = (id, n, act, lab) => ITEMS[id] ? `<li class="hasinfo" data-info="${id}">${this.itemIcon(id)}<div class="in"><b>${ITEMS[id].name}</b><small>×${n}</small></div><button class="btn sm" data-st="${act}:${id}:1">${lab} 1</button>${n > 1 ? `<button class="btn sm ghost" data-st="${act}:${id}:${n}">ทั้งหมด</button>` : ''}</li>` : '';
  const list = tab === 'take' ? Object.keys(st).map(id => row(id, st[id], 'take', 'ถอน')).join('') || '<li class="emptyrow">คลังว่างอยู่</li>'
    : Object.keys(S.inv).filter(id => ITEMS[id] && !ITEMS[id].quest).map(id => row(id, S.inv[id], 'put', 'ฝาก')).join('') || '<li class="emptyrow">ไม่มีของในกระเป๋า</li>';
  this.setPanel(`📦 คลังสินค้า <small>${Object.keys(st).length}/${STORAGE_MAX} ช่อง</small>`, `<div class="tabs"><button class="tab ${tab === 'take' ? 'on' : ''}" data-tab="take">ของในคลัง</button><button class="tab ${tab === 'put' ? 'on' : ''}" data-tab="put">ฝากจากกระเป๋า</button></div><ul class="ilist">${list}</ul><p class="muted">คลังสินค้าใช้ร่วมกันทุกตัวละครในอุปกรณ์นี้ ใช้ส่งของระหว่างตัวละครได้ · ของเควสฝากไม่ได้</p>`, true);
  this.el.pbody.onclick = e => { const t = e.target.closest('[data-tab]'); if (t) { this.panelOpt.tab = t.dataset.tab; this.renderPanel(); return; } const b = e.target.closest('[data-st]'); if (!b) return; const [a, id, n] = b.dataset.st.split(':'); if (a === 'put') Storage.put(id, +n); else Storage.take(id, +n); Audio.sfx('ui'); this.renderPanel(); };
};
/* sit to regenerate faster (RO) */
{
  const oe = Net.emote.bind(Net); Net.emote = function (id) { oe(id); if (id === 'sit') { Player.sitting = true; UI.toast('นั่งพัก: ฟื้น HP/MP เร็วขึ้น 2 เท่า (เดินเพื่อลุก)', 'info'); } };
  const ou = Game.update.bind(Game);
  Game.update = function (dt) {
    ou(dt); const P = Player; if (!this.started || this.paused || !Save.d) return;
    if (P.sitting && (P.moving || P.dead || P.combatT > 0)) P.sitting = false;
    if (P.sitting) { this._sitT = (this._sitT || 0) + dt; if (this._sitT >= 1) { this._sitT = 0; const S = Save.d, st = P.stats; S.hp = Math.min(st.maxhp, S.hp + st.maxhp * .03); S.mp = Math.min(st.maxmp, S.mp + st.maxmp * .05); if (Math.random() < .5) Particles.add(P.x, 2.6, P.z, { c: [.6, 1, .6], s: .3, life: .8, vy: .8 }); } }
  };
}
