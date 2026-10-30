
/* ============================================================
   Events: calendar festivals (Halloween, Loy Krathong, Christmas,
   New Year, Valentine, Songkran) and GM-started events.
   While an event runs: an event NPC stands in the capital with
   event quests, monsters drop event tokens, and the event
   cabinet (ตู้กิจกรรม) exchanges tokens for event-only fashion and
   lucky boxes of tiered gear (ธรรมดา → เทพในตำนาน, class weapons,
   rare tiers glow when worn). GMs can start any event for the
   whole server and conjure items / send gifts to everyone.
   ============================================================ */
const GEAR_TIERS = [
  ['ธรรมดา', '#c9c9c9', 52], ['เหล็กกล้า', '#9ab4c8', 24], ['ทองแดง', '#d88a4a', 12], ['เงิน', '#e6eef8', 6.5],
  ['ทอง', '#ffd24a', 3.4], ['แพลทินัม', '#7ae8e0', 1.4], ['เพชร', '#9ad0ff', .55], ['เทพในตำนาน', '#ff6ad8', .15]
];
const CLASS_WEAPON = { adventurer: ['ขวานนักผจญภัย', 'sword2'], knight: ['ดาบอัศวิน', 'sword3'], ninja: ['มีดคู่นินจา', 'dagger'], archer: ['ธนูพราน', 'arrow'], mage: ['ไม้เท้าเวท', 'meteor'], priest: ['คทาศักดิ์สิทธิ์', 'sun'] };
for (let t = 0; t < GEAR_TIERS.length; t++) {
  const [tn] = GEAR_TIERS[t], q = t + 1, lv = [1, 3, 6, 9, 12, 16, 20, 25][t];
  for (const cls of CLASS_ORDER) { const [wn, ic] = CLASS_WEAPON[cls]; ITEMS[`tg_w_${cls}_${t}`] = { name: `${wn} ขั้น${tn}`, kind: 'gear', slot: 'weapon', atk: Math.round(5 + q * 6 + q * q * 1.6), price: 0, sell: 40 * q * q, lvl: lv, cls, tier: t, desc: `อาวุธประจำ${CLASSES[cls].name} ขั้น${tn}`, icon: ic, rare: t >= 3 }; }
  ITEMS[`tg_a_${t}`] = { name: `เกราะ ขั้น${tn}`, kind: 'gear', slot: 'armor', def: Math.round(3 + q * 3.5 + q * q * .9), hp: q * 18 + q * q * 4, price: 0, sell: 40 * q * q, lvl: lv, tier: t, desc: `ชุดเกราะขั้น${tn} ใส่ได้ทุกอาชีพ`, icon: t >= 4 ? 'armor2' : 'armor', rare: t >= 3 };
  ITEMS[`tg_r_${t}`] = { name: `แหวน ขั้น${tn}`, kind: 'gear', slot: 'acc', hp: q * 14 + q * q * 3, mp: q * 8, atk: Math.round(q * q * .6), spd: +(t * .08).toFixed(2), price: 0, sell: 40 * q * q, lvl: lv, tier: t, desc: `เครื่องประดับขั้น${tn} ใส่ได้ทุกอาชีพ`, icon: 'ring', rare: t >= 3 };
}
for (const id in ITEMS) { const it = ITEMS[id]; if (it.tier !== undefined) it.desc += ' · ' + [it.atk ? 'ATK +' + it.atk : '', it.def ? 'DEF +' + it.def : '', it.hp ? 'HP +' + it.hp : '', it.mp ? 'MP +' + it.mp : '', it.spd ? 'SPD +' + it.spd : ''].filter(Boolean).join(' · ') + (it.tier >= 3 ? ' · มีเอฟเฟกต์เมื่อสวมใส่' : ''); }
const rollTier = (luck = 0) => { const tot = GEAR_TIERS.reduce((a, t) => a + t[2], 0); let r = Math.random() * tot * (1 - luck); for (let i = GEAR_TIERS.length - 1; i >= 0; i--) { r -= GEAR_TIERS[i][2] * (i >= 3 ? 1 + luck * 4 : 1); if (r <= 0) return i; } return 0; };

const EVENTS = {
  halloween: { name: 'เทศกาลฮาโลวีน', from: [10, 20], to: [11, 2], col: '#ff8a2a', token: 'ev_candy', tokenName: 'ลูกอมฮาโลวีน', tokenIc: 'heart', qitem: 'ev_pumpkin', qitemName: 'ฟักทองแกะสลัก',
    npc: { name: 'แม่มดปัมกิ้น', role: 'ผู้จัดงานฮาโลวีน', sheet: 'mage', hair: 25, pose: 15, voice: [1.3, 1.05], lines: ['Trick or treat! 🎃', 'ลูกอมอยู่กับมอนสเตอร์ทุกตัวเลยนะ', 'ฟักทองแกะสลักหายไปไหนหมดนะ'] },
    shop: ['o_cs_pumpkin', 'h_pumpkin', 'h_witch', 'o_cs_witch', 'o_cs_vampire', 'b_tail_devil', 'c_bat'], intro: 'ฮาโลวีนมาแล้ว! มอนสเตอร์ทุกตัวแอบพกลูกอมไว้ เก็บมาแลกของในตู้กิจกรรมได้เลย มีชุดและหมวกที่หาได้เฉพาะช่วงนี้ แล้วก็กล่องนำโชคที่อาจได้อุปกรณ์ขั้นเทพในตำนานด้วยนะ!' },
  loykrathong: { name: 'เทศกาลลอยกระทง', from: [11, 15], to: [11, 30], col: '#ffd45a', token: 'ev_krathong', tokenName: 'ดอกบัวกระทง', tokenIc: 'flower', qitem: 'ev_banana', qitemName: 'ใบตองสด',
    npc: { name: 'แม่นางบัวผัน', role: 'ผู้จัดงานลอยกระทง', sheet: 'priest', hair: 'black', pose: 15, voice: [1.25, 1], lines: ['วันเพ็ญเดือนสิบสอง น้ำนองเต็มตลิ่ง ♪', 'มาลอยกระทงด้วยกันนะ', 'ใบตองสดหาได้จากมอนสเตอร์ในป่า'] },
    shop: ['o_cs_thai', 'h_chada', 'ws_lotusrod', 'c_star', 'h_flowers'], intro: 'ลอยกระทงปีนี้ ช่วยแม่นางเก็บดอกบัวกับใบตองสดมาทำกระทงหน่อยนะ แลกของสวยๆ ในตู้กิจกรรมได้' },
  christmas: { name: 'เทศกาลคริสต์มาส', from: [12, 18], to: [12, 31], col: '#e04a4a', token: 'ev_bell', tokenName: 'กระดิ่งคริสต์มาส', tokenIc: 'bell', qitem: 'ev_sock', qitemName: 'ถุงเท้าของขวัญ',
    npc: { name: 'ซานต้าคุณปู่', role: 'ผู้แจกของขวัญ', sheet: 'knight', hair: 'white', pose: 15, voice: [.6, .9], lines: ['โฮ่ โฮ่ โฮ่! 🎅', 'เด็กดีได้ของขวัญนะ', 'ถุงเท้าของขวัญหายไปกับมอนสเตอร์'] },
    shop: ['o_cs_santa', 'h_santa', 'b_cape_star', 'ws_ice'], intro: 'โฮ่ โฮ่! กระดิ่งคริสต์มาสกระจายไปทั่วทวีป ช่วยปู่เก็บมาแลกของขวัญหน่อยนะ' },
  newyear: { name: 'เทศกาลปีใหม่', from: [1, 1], to: [1, 10], col: '#ffd24a', token: 'ev_firework', tokenName: 'ประทัดปีใหม่', tokenIc: 'star4', qitem: 'ev_lantern', qitemName: 'โคมไฟนำโชค',
    npc: { name: 'นายพรานโชคดี', role: 'ผู้จัดงานปีใหม่', sheet: 'archer', hair: 0, pose: 10, voice: [1.1, 1.1], lines: ['สวัสดีปีใหม่! 🎆', 'ปีนี้ขอให้ดรอปของดีๆ', 'โคมไฟนำโชคลอยหายไปในป่า'] },
    shop: ['o_cs_dragon', 'ws_gold', 'c_star', 'o_cs_knightgold'], intro: 'สวัสดีปีใหม่! เก็บประทัดปีใหม่มาแลกของนำโชค ใครโชคดีอาจเปิดกล่องได้อุปกรณ์ขั้นเทพในตำนาน!' },
  valentine: { name: 'เทศกาลวาเลนไทน์', from: [2, 10], to: [2, 16], col: '#ff6aa8', token: 'ev_heart', tokenName: 'หัวใจสีชมพู', tokenIc: 'heart', qitem: 'ev_rose', qitemName: 'กุหลาบแดง',
    npc: { name: 'คิวปิดน้อย', role: 'ผู้จัดงานวาเลนไทน์', sheet: 'priest', hair: 330, pose: 10, voice: [1.5, 1.1], lines: ['ความรักลอยอยู่ในอากาศ 💕', 'ชวนเพื่อนมาเล่นด้วยกันนะ', 'กุหลาบแดงหาได้จากมอนสเตอร์'] },
    shop: ['o_cs_angel', 'c_halo', 'ws_rosebow', 'h_bunny', 'b_wings_butterfly'], intro: 'วาเลนไทน์นี้มาแบ่งปันความรักกัน เก็บหัวใจสีชมพูมาแลกชุดเทวดากับธนูกุหลาบได้นะ' },
  songkran: { name: 'เทศกาลสงกรานต์', from: [4, 10], to: [4, 20], col: '#5ab0ff', token: 'ev_bowl', tokenName: 'ขันน้ำเงิน', tokenIc: 'potB', qitem: 'ev_powder', qitemName: 'กระป๋องแป้งดินสอพอง',
    npc: { name: 'น้องสงกรานต์', role: 'ผู้จัดงานสงกรานต์', sheet: 'adventurer', hair: 200, pose: 10, voice: [1.45, 1.15], lines: ['สาดน้ำ สาดน้ำ! 💦', 'สุขสันต์วันสงกรานต์', 'มอนสเตอร์ขโมยกระป๋องแป้งไปหมดเลย'] },
    shop: ['o_cs_thai', 'h_flowers', 'h_chada', 'b_wings_butterfly', 'h_mongkol'], intro: 'สงกรานต์มาแล้ว! ล่ามอนสเตอร์ให้ดรอปขันน้ำกับกระป๋องแป้ง แล้วเอามาแลกของในตู้กิจกรรมนะ' }
};
for (const k in EVENTS) {
  const E = EVENTS[k];
  ITEMS[E.token] = { name: E.tokenName, kind: 'mat', price: 0, sell: 0, desc: `เหรียญกิจกรรม${E.name} ใช้แลกของที่ตู้กิจกรรม`, icon: E.tokenIc, rare: true, ev: k };
  ITEMS[E.qitem] = { name: E.qitemName, kind: 'mat', quest: true, price: 0, desc: `ของเควสกิจกรรม${E.name}`, icon: 'flower', ev: k };
  ITEMS['ev_box_' + k] = { name: `กล่องนำโชค${E.name}`, kind: 'use', box: k, price: 0, sell: 0, desc: 'เปิดสุ่มอุปกรณ์ขั้นธรรมดา → เทพในตำนาน (อาวุธตามอาชีพ เกราะ แหวน)', icon: 'gem', rare: true };
  NPCS['ev_' + k] = Object.assign({ zone: 'world', x: 10, z: 58, face: -2.6, hidden: true }, E.npc);
  NPC_IDLE['ev_' + k] = E.intro;
  QUESTS['evq1_' + k] = { type: 'daily', giver: 'ev_' + k, title: `${E.qitemName}หาย! (${E.name})`, obj: [{ k: 'collect', item: E.qitem, n: 8 }], ev: k,
    text: `ช่วยด้วย! ${E.qitemName}ของงาน${E.name}ถูกมอนสเตอร์ขโมยไปหมด ล่ามอนสเตอร์ตัวไหนก็ได้แล้วเอา${E.qitemName}คืนมา 8 ชิ้นนะ (ทำได้วันละครั้ง)`,
    done: 'ขอบใจมาก! งานเทศกาลจะได้สนุกเหมือนเดิม รับกล่องนำโชคไปเลย', rew: { xp: 300, coin: 200, items: [['ev_box_' + k, 1], [E.token, 10]] }, take: true };
  QUESTS['evq2_' + k] = { type: 'side', giver: 'ev_' + k, title: `นักล่าแห่ง${E.name}`, obj: [{ k: 'killany', n: 40 }], ev: k,
    text: `ช่วงเทศกาลมอนสเตอร์ออกมาเยอะเป็นพิเศษ ปราบให้ได้ 40 ตัว แล้วฉันจะให้ของขวัญพิเศษที่มีเฉพาะ${E.name}`,
    done: 'สุดยอด! นี่ของขวัญพิเศษประจำเทศกาล', rew: { xp: 600, coin: 300, items: [['ev_box_' + k, 2], [E.token, 25]] }, gems: 20 };
  QUEST_ORDER.push('evq1_' + k, 'evq2_' + k);
}
// cabinet price list: [item, cost]
const evCab = k => { const E = EVENTS[k]; return [['ev_box_' + k, 15], ...E.shop.filter(id => ITEMS[id]).map((id, i) => [id, 60 + i * 20]), ['rf_stone', 5], ['rf_stone2', 30], ['rf_guard', 45], ['pet_treat', 8], ['hp_l', 3]]; };

const EventSys = {
  gm: null,
  load() { try { this.gm = JSON.parse(localStorage.getItem('siam_gmevent') || 'null'); } catch (e) { } },
  inRange(E, d) { const m = d.getMonth() + 1, day = d.getDate(), v = m * 100 + day, a = E.from[0] * 100 + E.from[1], b = E.to[0] * 100 + E.to[1]; return a <= b ? v >= a && v <= b : v >= a || v <= b; },
  active() { const d = new Date(), out = []; for (const k in EVENTS) if (this.inRange(EVENTS[k], d)) out.push(k); if (this.gm && this.gm.until > Date.now() && EVENTS[this.gm.id] && !out.includes(this.gm.id)) out.push(this.gm.id); return out; },
  on(k) { return this.active().includes(k); },
  sync() {
    const act = this.active();
    for (const k in EVENTS) { const id = 'ev_' + k, on = act.includes(k); const i = NPCList.findIndex(n => n.id === id);
      if (on && i < 0) { const n = NPCS[id]; const off = act.indexOf(k) * 3.2; NPCList.push({ id, ...n, x: n.x + off, face0: n.face, anim: Math.random() * 5, waveT: 0, rig: new Rig(n.sheet) }); }
      else if (!on && i >= 0) NPCList.splice(i, 1); }
    for (const k in EVENTS) { QUESTS['evq1_' + k].hidden = !act.includes(k); QUESTS['evq2_' + k].hidden = !act.includes(k); }
  },
  start(id, hours) { this.gm = { id, until: Date.now() + hours * 3600e3 }; try { localStorage.setItem('siam_gmevent', JSON.stringify(this.gm)); } catch (e) { } this.sync(); },
  openBox(k) {
    const S = Save.d, it = 'ev_box_' + k; if (!S.inv[it]) return; Game.addItem(it, -1, true);
    const t = rollTier(), r = Math.random(), id = r < .45 ? `tg_w_${S.cls}_${t}` : r < .75 ? `tg_a_${t}` : `tg_r_${t}`;
    Game.addItem(id, 1, true); const [tn, col] = GEAR_TIERS[t]; UI.banner(`ได้รับ ${ITEMS[id].name}!`, t >= 4 ? 'level' : 'buff'); Audio.sfx(t >= 3 ? 'level' : 'coin');
    for (let i = 0; i < 20 + t * 10; i++) Particles.add(Player.x + rand(-.6, .6), rand(.5, 2), Player.z + rand(-.6, .6), { c: hexc(col), s: .4, life: 1.2, vy: rand(1, 4 + t) });
    if (t >= 5) Announce.send('drop', `${S.name} เปิดกล่องนำโชคได้ ${ITEMS[id].name}!`);
    return id;
  }
};
EventSys.load();
QUESTS && (() => { const oa = Quests.available.bind(Quests); Quests.available = function (id) { if (QUESTS[id].ev && !EventSys.on(QUESTS[id].ev)) return false; return oa(id); }; })();
{
  const oi = initNPCs; initNPCs = function () { oi(); for (let i = NPCList.length - 1; i >= 0; i--) if (NPCS[NPCList[i].id] && NPCS[NPCList[i].id].hidden) NPCList.splice(i, 1); EventSys.sync(); };
  // event drops
  const ok = Combat.kill.bind(Combat);
  Combat.kill = function (m) {
    ok(m); if (m.summon) return; const act = EventSys.active(); if (!act.length) return; const S = Save.d;
    for (const k of act) { const E = EVENTS[k]; if (Math.random() < (m.d.elite || m.d.boss || m.d.wboss ? 1 : .22)) { Loot._killing = Loot.on() && !m.d.boss && !m.d.wboss ? m : null; try { Game.addItem(E.token, m.d.boss || m.d.mvp ? 5 : 1); } finally { Loot._killing = null; } }
      if (Quests.active('evq1_' + k) && Math.random() < .3) { Loot._killing = Loot.on() && !m.d.boss && !m.d.wboss ? m : null; try { Game.addItem(E.qitem, 1); } finally { Loot._killing = null; } } }
  };
  // open boxes from the bag
  const ouse = Game.useItem.bind(Game); Game.useItem = function (id, q) { const it = ITEMS[id]; if (it && it.box && Save.d.inv[id]) { EventSys.openBox(it.box); UI.refreshInvIfOpen(); return; } return ouse(id, q); };
  // class-locked event weapons
  const oeq = Game.equip.bind(Game); Game.equip = function (id) { const it = ITEMS[id], S = Save.d; if (it && it.cls && it.cls !== S.cls) { UI.toast(`อาวุธนี้สำหรับ${CLASSES[it.cls].name}เท่านั้น`, 'warn'); return; } return oeq(id); };
  // event NPC dialog: cabinet button
  const od = UI.pDialog.bind(UI);
  UI.pDialog = function (o) { od(o); if (!String(o.npc).startsWith('ev_')) return; const k = o.npc.slice(3), bt = this.el.pbody.querySelector('.dbtns'); if (!bt) return; const b = document.createElement('button'); b.className = 'btn primary'; b.textContent = '🎁 ตู้กิจกรรม'; b.onclick = e => { e.stopPropagation(); Audio.sfx('ui'); this.openPanel('evcab', { ev: k }); }; bt.insertBefore(b, bt.lastElementChild); };
  // GM: events, item conjuring, gifts (sent through the GM announcement channel)
  const oan = Net.onAnnounce.bind(Net);
  Net.onAnnounce = function (v) {
    if (v && typeof v.m === 'string' && v.m.startsWith('[[EV]]')) { if (v.t <= (this.lastEvAnn || 0)) return; this.lastEvAnn = v.t; const [id, h] = v.m.slice(6).split('|'); const until = v.t + (+h || 1) * 3600e3; if (EVENTS[id] && until > this.be.now()) { const fresh = !EventSys.gm || EventSys.gm.id !== id || EventSys.gm.until !== until; EventSys.gm = { id, until }; try { localStorage.setItem('siam_gmevent', JSON.stringify(EventSys.gm)); } catch (e) { } EventSys.sync(); if (fresh) Announce.show('spawn', `GM เปิด${EVENTS[id].name}! ถึง ${new Date(until).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' })} · ไปหา ${EVENTS[id].npc.name} ที่จัตุรัสเมืองหลวง`); } return; }
    if (v && typeof v.m === 'string' && v.m.startsWith('[[GIFT]]')) { const [item, n, code] = v.m.slice(8).split('|'); const S = Save.d; if (!S || !ITEMS[item]) return; S.gmGifts = S.gmGifts || {}; if (S.gmGifts[code] || this.be.now() - v.t > 24 * 3600e3) return; S.gmGifts[code] = 1; Game.addItem(item, Math.min(99, +n || 1)); Announce.show('drop', `ของขวัญจาก GM: ${ITEMS[item].name} ×${n}`); Save.write(); return; }
    return oan(v);
  };
  const opg = UI.pGM.bind(UI);
  UI.pGM = async function (o) {
    if (!Net.gm || (o.tab || 'players') !== 'tools') return opg(o);
    await opg(o); const b = this.el.pbody, fs = document.createElement('fieldset');
    const items = Object.keys(ITEMS).filter(id => ITEMS[id].kind !== 'cos' || true);
    fs.innerHTML = `<legend>กิจกรรมทั้งเซิร์ฟเวอร์</legend><div class="row"><select id="gmev">${Object.entries(EVENTS).map(([k, E]) => `<option value="${k}">${E.name}</option>`).join('')}</select><input id="gmevh" type="number" min="1" max="336" value="24" style="width:70px"> ชั่วโมง <button class="btn" id="gmevgo">เปิดกิจกรรม</button></div>
      <p class="muted">ตอนนี้: ${EventSys.active().map(k => EVENTS[k].name).join(', ') || 'ไม่มีกิจกรรม'}</p>
      <legend>เสกไอเทม</legend><div class="row"><input id="gmit" list="gmitl" placeholder="รหัสไอเทม เช่น ev_box_halloween" style="flex:1"><datalist id="gmitl">${items.slice(0, 600).map(id => `<option value="${id}">${esc(ITEMS[id].name)}</option>`).join('')}</datalist><input id="gmitn" type="number" min="1" max="99" value="1" style="width:60px"></div>
      <div class="row"><button class="btn" id="gmitme">เสกให้ตัวเอง</button><button class="btn primary" id="gmitall">ส่งเป็นของขวัญให้ทุกคน</button></div>`;
    b.appendChild(fs);
    fs.querySelector('#gmevgo').onclick = async () => { const id = fs.querySelector('#gmev').value, h = +fs.querySelector('#gmevh').value || 24; try { await Net.announce(`[[EV]]${id}|${h}`); EventSys.start(id, h); UI.toast('เปิดกิจกรรมแล้ว', 'quest'); } catch (e) { UI.toast('เปิดกิจกรรมไม่สำเร็จ', 'warn'); } };
    const get = () => { const id = fs.querySelector('#gmit').value.trim(), n = Math.max(1, Math.min(99, +fs.querySelector('#gmitn').value || 1)); if (!ITEMS[id]) { UI.toast('ไม่พบรหัสไอเทมนี้', 'warn'); return null; } return [id, n]; };
    fs.querySelector('#gmitme').onclick = () => { const g = get(); if (g) { Game.addItem(g[0], g[1]); } };
    fs.querySelector('#gmitall').onclick = async () => { const g = get(); if (!g) return; try { await Net.announce(`[[GIFT]]${g[0]}|${g[1]}|${Date.now().toString(36)}`); UI.toast('ส่งของขวัญถึงทุกคนแล้ว', 'quest'); } catch (e) { UI.toast('ส่งไม่สำเร็จ', 'warn'); } };
  };
  const ou = Game.update.bind(Game); Game.update = function (dt) { ou(dt); if (!this.started) return; const n = performance.now(); if (n - (this._evN || 0) > 30000) { this._evN = n; EventSys.sync(); } TierFx.tick(dt); };
}
/* wearing high-tier gear shows an effect (ทอง+ sparkles, แพลทินัม+ ring, เทพในตำนาน pillar + rainbow) */
const TierFx = {
  t: 0,
  top() { const S = Save.d; let t = -1; for (const sl of ['weapon', 'armor', 'acc']) { const id = S.equip[sl]; if (id && ITEMS[id] && ITEMS[id].tier !== undefined) t = Math.max(t, ITEMS[id].tier); } return t; },
  tick(dt) {
    const P = Player; if (!Save.d || P.dead || Game.paused) return; const t = this.top(); if (t < 3) return; this.t += dt;
    const col = t === 7 ? hexc(['#ff6ad8', '#ffd24a', '#7ae8e0', '#9ad0ff', '#ff8a5a'][Math.floor(this.t * 3) % 5]) : hexc(GEAR_TIERS[t][1]);
    if (Math.random() < dt * (6 + t * 4)) { const a = Math.random() * TAU; Particles.add(P.x + Math.cos(a) * .7, rand(.1, 2.2), P.z + Math.sin(a) * .7, { c: col, s: .3 + t * .03, life: 1, vy: rand(.5, 1.6) }); }
    if (t >= 5 && Math.random() < dt * 2) Particles.ring(P.x, .1, P.z, .9, 18, col, .6, .3);
    if (t === 7 && Math.random() < dt * .6) Fx.pillar(P.x, P.z, .8, 3.5, col, .7);
  }
};
/* event cabinet window */
UI.extraPanels = UI.extraPanels || {}; Object.assign(UI.extraPanels, { evcab: 'pEvCab', events: 'pEvents' });
UI.pEvCab = function (o) {
  const S = Save.d, k = o.ev && EVENTS[o.ev] ? o.ev : EventSys.active()[0]; if (!k) { this.setPanel('ตู้กิจกรรม', '<p class="muted">ตอนนี้ยังไม่มีกิจกรรม</p>'); return; }
  const E = EVENTS[k], have = S.inv[E.token] || 0;
  const rows = evCab(k).map(([id, c]) => { const it = ITEMS[id], own = it.kind === 'cos' && S.inv[id]; return `<li class="hasinfo" data-info="${id}">${this.itemIcon(id)}<div class="in"><b>${it.name}</b><small>${it.desc}</small></div><span class="price">${icon(E.tokenIc)}${c}</span>${own ? '<span class="qty">มีแล้ว</span>' : `<button class="btn sm" data-ex="${id}:${c}" ${have >= c ? '' : 'disabled'}>แลก</button>`}</li>`; }).join('');
  const odds = GEAR_TIERS.map(([n, col, p]) => `<span style="color:${col}">${n} ${p}%</span>`).join(' · ');
  this.setPanel(`🎁 ตู้กิจกรรม · ${E.name} <span class="coin">${icon(E.tokenIc)} ${E.tokenName} ${have}</span>`, `<ul class="ilist">${rows}</ul><p class="muted">กล่องนำโชค: ${odds} · อาวุธในกล่องตรงกับอาชีพของคุณ · ขั้นเงินขึ้นไปมีเอฟเฟกต์เมื่อสวมใส่</p>${S.inv['ev_box_' + k] ? `<button class="btn primary" data-open="1">เปิดกล่องนำโชค (มี ${S.inv['ev_box_' + k]})</button>` : ''}`, true);
  this.el.pbody.onclick = e => {
    const x = e.target.closest('[data-ex]'); if (x) { const [id, c] = x.dataset.ex.split(':'); if ((S.inv[E.token] || 0) < +c) return; Game.addItem(E.token, -c, true); Game.addItem(id, 1); Audio.sfx('coin'); if (ITEMS[id].kind === 'cos') Game.equip(id); this.renderPanel(); return; }
    if (e.target.closest('[data-open]')) { EventSys.openBox(k); this.renderPanel(); }
  };
};
UI.pEvents = function () {
  const act = EventSys.active(), d = new Date();
  const rows = Object.entries(EVENTS).map(([k, E]) => `<li class="evrow ${act.includes(k) ? 'on' : ''}" style="--ec:${E.col}"><b>${E.name}</b><small>${E.from[1]}/${E.from[0]} – ${E.to[1]}/${E.to[0]} ของทุกปี${EventSys.gm && EventSys.gm.id === k && EventSys.gm.until > Date.now() ? ' · GM เปิดพิเศษ' : ''}</small><span>${act.includes(k) ? 'กำลังจัดอยู่!' : 'ยังไม่ถึง'}</span>${act.includes(k) ? `<button class="btn sm" data-evgo="${k}">ไปหา ${E.npc.name}</button><button class="btn sm ghost" data-evcab="${k}">ตู้กิจกรรม</button>` : ''}</li>`).join('');
  this.setPanel('🎉 กิจกรรมและเทศกาล', `<ul class="evlist">${rows}</ul><p class="muted">ช่วงกิจกรรม: มอนสเตอร์ทุกตัวดรอปเหรียญกิจกรรม รับเควสพิเศษกับ NPC ประจำเทศกาลที่จัตุรัสเมืองหลวง และแลกของที่หาได้เฉพาะช่วงนี้ · GM เปิดกิจกรรมพิเศษได้ทุกเมื่อ</p>`, true);
  this.el.pbody.onclick = e => { const g = e.target.closest('[data-evgo]'); if (g) { const n = NPCList.find(x => x.id === 'ev_' + g.dataset.evgo); if (n) { this.closePanel(); Nav.go({ zone: n.zone, x: n.x, z: n.z + 2, r: 2, label: 'ไปหา ' + n.name, arrive: () => UI.dialog(n) }); } return; } const c = e.target.closest('[data-evcab]'); if (c) this.openPanel('evcab', { ev: c.dataset.evcab }); };
};
{
  const oi = UI.itemIcon.bind(UI); UI.itemIcon = function (id) { const it = ITEMS[id]; if (it && it.tier !== undefined) return icon(it.icon, 'r-tier tt' + it.tier); return oi(id); };
}
