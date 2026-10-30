
/* ============================================================
   Refine (ตีบวก) +0 → +20 at ช่างโบรัน, RO style: safe up to +4,
   then success drops; +5..+9 fail = −1, +10 and above fail = the
   equipment breaks unless a หินกันแตก is used (then −1).
   Monster cards: every monster has a card (ธรรมดา / หายาก /
   มินิบอส / บอส MVP). Cards drop very rarely and are inserted into
   card slots of weapons, armour and accessories for bonus stats.
   ============================================================ */
ICONS.card = '<rect x="5" y="3" width="14" height="18" rx="2" fill="currentColor"/><rect x="7.5" y="5.5" width="9" height="8" rx="1" fill="#fff" opacity=".55"/><path d="M8 16h8M8 18.5h5" stroke="#fff" stroke-width="1.3" opacity=".6"/>';
ICONS.hammer = '<path d="M13 4l7 7-3 3-7-7z" fill="currentColor"/><path d="M11.5 9.5 3 18l3 3 8.5-8.5" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
Object.assign(ITEMS, {
  rf_stone: { name: 'หินตีบวก', kind: 'mat', price: 250, sell: 60, desc: 'ใช้ตีบวกอุปกรณ์ +1 ถึง +10 ที่ช่างโบรัน', icon: 'gem' },
  rf_stone2: { name: 'หินตีบวกขั้นสูง', kind: 'mat', price: 1500, sell: 300, desc: 'ใช้ตีบวกอุปกรณ์ +11 ถึง +20 (หายาก)', icon: 'gem', rare: true },
  rf_guard: { name: 'หินกันแตก', kind: 'mat', price: 0, sell: 0, desc: 'ใส่ตอนตีบวก +10 ขึ้นไป ถ้าล้มเหลวอุปกรณ์จะไม่แตก (ลดระดับ −1 แทน)', icon: 'shield', rare: true }
});
const REFINE_MAX = 20;
const REFINE_RATE = [100, 100, 100, 100, 90, 75, 65, 55, 45, 38, 30, 26, 22, 18, 15, 12, 10, 8, 6, 5]; // chance to go from +i to +i+1
const refineCost = lv => Math.round(120 * Math.pow(lv + 1, 1.55));
const refineStone = lv => lv < 10 ? 'rf_stone' : 'rf_stone2';
const refineBonus = (id, lv) => {
  const it = ITEMS[id]; if (!it || !lv) return {}; const hi = Math.max(0, lv - 10);
  if (it.slot === 'weapon') return { atk: Math.round(lv * 2 + (it.atk || 0) * lv * .05 + hi * hi * .6) };
  if (it.slot === 'armor') return { def: Math.round(lv * 1.2 + (it.def || 0) * lv * .05 + hi * hi * .35), hp: lv * 6 };
  return { hp: lv * 10 + hi * hi * 2, mp: lv * 4 };
};
const ITEM_SLOTS = { w_crys: 2, r_heart: 2, a_hunter: 1, w_exo: 2, r_nakpin: 2 };
const itemSlots = id => { const it = ITEMS[id]; if (!it || it.kind !== 'gear') return 0; return it.slots || ITEM_SLOTS[id] || 1; };

/* ---- cards ---- */
const CARD_TIERS = { n: ['ธรรมดา', '#9aa3ad', .012], u: ['หายาก', '#5ab0ff', .008], m: ['มินิบอส', '#c46bff', .03], b: ['บอส MVP', '#ffb02e', .06] };
const CARD_FX_TH = { atk: 'ATK', def: 'DEF', hp: 'HP สูงสุด', mp: 'MP สูงสุด', spd: 'ความเร็ว', crit: 'คริติคอล', xp: 'EXP', coin: 'เหรียญ', drop: 'โอกาสดรอป', leech: 'ดูดเลือด', atkPct: 'ATK', defPct: 'DEF', hpPct: 'HP สูงสุด', regen: 'ฟื้น HP/วิ', mpregen: 'ฟื้น MP/วิ', reduce: 'ลดความเสียหายที่ได้รับ', boss: 'ความเสียหายต่อบอส' };
const CARD_PCT = new Set(['crit', 'xp', 'coin', 'drop', 'leech', 'atkPct', 'defPct', 'hpPct', 'regen', 'mpregen', 'reduce', 'boss']);
const CARD_SLOT_OF = { atk: 'weapon', atkPct: 'weapon', crit: 'weapon', leech: 'weapon', boss: 'weapon', def: 'armor', defPct: 'armor', hp: 'armor', hpPct: 'armor', regen: 'armor', reduce: 'armor', mp: 'acc', spd: 'acc', xp: 'acc', coin: 'acc', drop: 'acc', mpregen: 'acc' };
const CARD_EMOJI = { slime: '🟢', shroom: '🍄', wolf: '🐺', goblin: '👺', bat: '🦇', skel: '💀', boss: '💎', maenak: '👰', kuman: '👶', pret: '🧟', krasue: '🔥', takhon: '🎭', phidip: '🧛', huakhat: '⚔️', pop: '😈', krahang: '🦅', phrai: '💧', nangram: '💃', takhian: '🌳', tani: '🍌', kongkoi: '🦶', pongkhang: '🐒', khamot: '✨', phong: '🕯️' };
const CARD_DEF = {
  slime: { hp: 40 }, shroom: { mp: 25 }, wolf: { atk: 6 }, goblin: { crit: .03 }, bat: { leech: .02 }, skel: { def: 6 },
  boss: { atkPct: .1, def: 10, boss: .15 }
};
const CARDS = {};
{
  const tmpl = [['atk', 1.1], ['def', .7], ['hp', 7], ['mp', 4], ['crit', .004], ['xp', .007], ['coin', .01], ['drop', .006], ['regen', .0006], ['leech', .002], ['hpPct', .006], ['reduce', .004]];
  const keys = Object.keys(MONSTERS); keys.forEach((k, i) => {
    const d = MONSTERS[k]; if (d.summon || d.noCard) return; const lv = d.lvl || 1;
    const tier = d.boss || d.wboss ? 'b' : d.elite ? 'm' : lv >= 7 ? 'u' : 'n';
    let fx = CARD_DEF[k];
    if (!fx) { const [a, f] = tmpl[i % tmpl.length], [b, g] = tmpl[(i * 5 + 3) % tmpl.length]; const v = x => CARD_PCT.has(x) ? +(lv * 1 * (x === a ? f : g)).toFixed(3) : Math.round(lv * (x === a ? f : g)); fx = { [a]: v(a) }; if (tier !== 'n' && tier !== 'u') fx[b] = v(b) * 1.5; if (tier === 'b') { fx.atkPct = .08; fx.boss = .12; } if (tier === 'm') for (const x in fx) fx[x] = CARD_PCT.has(x) ? +(fx[x] * 1.6).toFixed(3) : Math.round(fx[x] * 1.6); }
    const slot = CARD_SLOT_OF[Object.keys(fx)[0]] || 'acc';
    const id = 'card_' + k; CARDS[id] = { mon: k, tier, fx, slot };
    ITEMS[id] = { name: 'การ์ด' + d.name, kind: 'mat', card: k, price: 0, sell: { n: 50, u: 120, m: 600, b: 2000 }[tier], desc: `การ์ด${CARD_TIERS[tier][0]} · ใส่ช่องการ์ดของ${{ weapon: 'อาวุธ', armor: 'ชุดเกราะ', acc: 'เครื่องประดับ' }[slot]} · ` + cardFxText(fx), icon: 'card', rare: tier !== 'n' };
    // drop chance (mini-boss & boss cards are rarer to meet but drop more often per kill)
    d.drops = (d.drops || []).concat([[id, CARD_TIERS[tier][2] * (d.boss ? 1 : 1)]]);
  });
}
function cardFxText(fx) { return Object.entries(fx).map(([k, v]) => `${CARD_FX_TH[k]} +${CARD_PCT.has(k) ? +(v * 100).toFixed(1) + '%' : v}`).join(' · '); }

const Refine = {
  data() { const S = Save.d; S.refine = S.refine || {}; S.cards = S.cards || {}; S.cardBook = S.cardBook || {}; return S; },
  lv(id) { return (this.data().refine[id]) || 0; },
  label(id) { const l = this.lv(id); return (l ? `+${l} ` : '') + ITEMS[id].name; },
  try(id, guard) {
    const S = this.data(), lv = this.lv(id); if (!S.inv[id]) return null; if (lv >= REFINE_MAX) { UI.toast('ตีบวกสูงสุดแล้ว (+20)', 'info'); return null; }
    const stone = refineStone(lv), cost = refineCost(lv);
    if (!S.inv[stone]) { UI.toast('ต้องใช้ ' + ITEMS[stone].name, 'warn'); return null; }
    if (S.coins < cost) { UI.toast('เหรียญไม่พอ', 'warn'); return null; }
    const useG = guard && lv >= 10 && S.inv.rf_guard;
    S.coins -= cost; Game.addItem(stone, -1, true); if (useG) Game.addItem('rf_guard', -1, true);
    const ok = Math.random() * 100 < REFINE_RATE[lv]; let res;
    if (ok) { S.refine[id] = lv + 1; res = { ok: true, lv: lv + 1 }; if (lv + 1 >= 10) Announce.send('refine', `${S.name} ตีบวก ${ITEMS[id].name} สำเร็จเป็น +${lv + 1}!`); }
    else if (lv < 10 || useG) { S.refine[id] = Math.max(0, lv - 1); res = { ok: false, lv: S.refine[id] }; }
    else { // broken
      Game.addItem(id, -1, true); for (const sl in S.equip) if (S.equip[sl] === id && !S.inv[id]) S.equip[sl] = null; if (!S.inv[id]) { delete S.refine[id]; delete S.cards[id]; }
      res = { ok: false, broke: true, lv: 0 };
    }
    S.stats.refines = (S.stats.refines || 0) + 1; Player.recalc(); Save.write(); return res;
  },
  insert(cid, id) {
    const S = this.data(), C = CARDS[cid], it = ITEMS[id]; if (!C || !it || !S.inv[cid] || !S.inv[id]) return false;
    if (C.slot !== it.slot) { UI.toast('การ์ดนี้ใส่ได้เฉพาะ' + { weapon: 'อาวุธ', armor: 'ชุดเกราะ', acc: 'เครื่องประดับ' }[C.slot], 'warn'); return false; }
    const arr = S.cards[id] = S.cards[id] || []; if (arr.length >= itemSlots(id)) { UI.toast('ช่องการ์ดเต็มแล้ว', 'warn'); return false; }
    arr.push(cid); Game.addItem(cid, -1, true); Player.recalc(); Audio.sfx('level'); UI.toast(`ใส่ ${ITEMS[cid].name} ลงใน ${ITEMS[id].name} แล้ว`, 'quest'); Save.write(); return true;
  },
  remove(id, i) {
    const S = this.data(), arr = S.cards[id]; if (!arr || !arr[i]) return; const cid = arr[i], cost = { n: 300, u: 600, m: 2000, b: 5000 }[CARDS[cid].tier];
    if (S.coins < cost) { UI.toast(`ต้องใช้ ${fmt(cost)} เหรียญ`, 'warn'); return; } S.coins -= cost; arr.splice(i, 1); Game.addItem(cid, 1, true); Player.recalc(); UI.toast('ถอดการ์ดแล้ว', 'info'); Save.write();
  },
  // total card effects from equipped gear
  fx() { const S = Save.d, out = {}; if (!S || !S.cards) return out; for (const sl of ['weapon', 'armor', 'acc']) { const id = S.equip[sl]; if (!id) continue; for (const cid of S.cards[id] || []) { const f = CARDS[cid] && CARDS[cid].fx; if (f) for (const k in f) out[k] = (out[k] || 0) + f[k]; } } return out; },
  v(k) { if (!this._fxT || performance.now() - this._fxT > 500) { this._fx = this.fx(); this._fxT = performance.now(); } return this._fx[k] || 0; }
};

/* ---- server-wide announcements (MVP, rare drops, refines) via the chat channels ---- */
const Announce = {
  TAG: '[[AQ]]',
  send(kind, text) {
    this.show(kind, text);
    if (!Net.joined || !Net.be) return;
    for (let c = 1; c <= NET_CHANNELS; c++) try { Net.be.push(`ch/${c}/chat`, { u: Net.uid, n: Save.d.name.slice(0, 16), m: (this.TAG + kind + '|' + text).slice(0, 100), t: Net.be.ts(), k: 'w', p: '', gm: 0 }); } catch (e) { }
  },
  seen: new Set(), keys: new Set(),
  show(kind, text) {
    const k = kind + text; if (this.seen.has(k)) return; this.seen.add(k); setTimeout(() => this.seen.delete(k), 20000);
    const lab = { mvp: '👑 MVP', spawn: '⚠️ บอสปรากฏ', drop: '🎁 ของหายาก', refine: '🔨 ตีบวก', card: '🃏 การ์ด' }[kind] || '📢 ประกาศ';
    { const el = document.getElementById('annbar'); if (el) { el.innerHTML = `<b>${lab}</b><span>${esc(text)}</span>`; el.hidden = false; el.classList.remove('out'); void el.offsetWidth; el.classList.add('in'); clearTimeout(this._t); this._t = setTimeout(() => { el.classList.add('out'); setTimeout(() => { el.hidden = true; }, 500); }, 8000); } }
    Net.chat.push({ k: 'aq' + Date.now() + Math.random(), u: '', n: lab, m: text, t: Date.now(), kind: 'sys', gm: true }); if (Net.chat.length > 80) Net.chat.shift(); UI.chatLog();
    if (kind === 'mvp' || kind === 'spawn') Audio.sfx('level');
  }
};
{
  const oc = Net.onChat.bind(Net);
  Net.onChat = function (k, v) { if (v && typeof v.m === 'string' && v.m.startsWith(Announce.TAG)) { if (Announce.keys.has(k)) return; Announce.keys.add(k); if (v.u !== this.uid && (v.t || 0) > Date.now() - 120000) { const [kind, ...rest] = v.m.slice(Announce.TAG.length).split('|'); Announce.show(kind, ChatFilter.clean(rest.join('|')).text || rest.join('|')); } return; } return oc(k, v); };
}

/* ---- stat hooks ---- */
{
  const orc = Player.recalc.bind(Player);
  Player.recalc = function () {
    orc(); const S = Save.d, st = this.stats; if (!S || !S.equip) return;
    for (const sl of ['weapon', 'armor', 'acc']) { const id = S.equip[sl]; if (!id) continue; const b = refineBonus(id, (S.refine || {})[id] || 0); st.atk += b.atk || 0; st.def += b.def || 0; st.maxhp += b.hp || 0; st.maxmp += b.mp || 0; }
    Refine._fxT = 0; const f = Refine.fx();
    st.atk += f.atk || 0; st.def += f.def || 0; st.maxhp += f.hp || 0; st.maxmp += f.mp || 0; st.spd += f.spd || 0;
    if (f.atkPct) st.atk *= 1 + f.atkPct; if (f.defPct) st.def *= 1 + f.defPct; if (f.hpPct) st.maxhp *= 1 + f.hpPct;
    st.atk = Math.round(st.atk); st.def = Math.round(st.def); st.maxhp = Math.round(st.maxhp); st.maxmp = Math.round(st.maxmp);
    S.hp = Math.min(S.hp, st.maxhp); S.mp = Math.min(S.mp, st.maxmp);
  };
  const ocb = RoleSys.critBonus.bind(RoleSys); RoleSys.critBonus = function () { return ocb() + Refine.v('crit'); };
  const ox = Game.gainXP.bind(Game); Game.gainXP = function (n) { return ox(n * (1 + Refine.v('xp'))); };
  const ogc = Game.gainCoins.bind(Game); Game.gainCoins = function (n) { return ogc(n * (1 + Refine.v('coin'))); };
  const odm = Combat.damageMonster.bind(Combat);
  Combat.damageMonster = function (m, raw, o) { const b = Refine.v('boss'); if (b && (m.d.boss || m.d.wboss || m.d.elite || m.mvp)) raw *= 1 + b; const h0 = m.hp; odm(m, raw, o); const L = Refine.v('leech'); if (L && h0 > m.hp) { const S = Save.d; S.hp = Math.min(Player.stats.maxhp, S.hp + (h0 - Math.max(0, m.hp)) * L); } };
  const ohp = Combat.hitPlayer.bind(Combat); Combat.hitPlayer = function (raw, src) { const r = Refine.v('reduce'); return ohp(r ? raw * (1 - Math.min(.5, r)) : raw, src); };
  const ok = Combat.kill.bind(Combat);
  Combat.kill = function (m) {
    ok(m); const dr = Refine.v('drop'); if (dr && !m.summon && Math.random() < dr) { const pool = m.d.drops.filter(d => !d[2] && !CARDS[d[0]]); if (pool.length) Game.addItem(pool[randi(0, pool.length - 1)][0], 1); }
  };
  // card drops: record in the card book, announce rare ones
  const oa = Game.addItem.bind(Game);
  Game.addItem = function (id, n, silent) {
    oa(id, n, silent); if (n > 0 && CARDS[id] && Save.d && !Loot._killing) { const S = Refine.data(); const first = !S.cardBook[id]; S.cardBook[id] = 1; const t = CARDS[id].tier; if (t !== 'n' || first) UI.banner(`ได้รับ ${ITEMS[id].name}!`, 'level'); if (t === 'm' || t === 'b') Announce.send('card', `${S.name} ได้รับ ${ITEMS[id].name} (${CARD_TIERS[t][0]})!`); }
  };
  const ou = Game.update.bind(Game);
  Game.update = function (dt) { ou(dt); if (!this.started || this.paused || !Save.d || Player.dead) return; this._crT = (this._crT || 0) + dt; if (this._crT >= 1) { this._crT = 0; const S = Save.d, st = Player.stats, r = Refine.v('regen'), m = Refine.v('mpregen'); if (r) S.hp = Math.min(st.maxhp, S.hp + st.maxhp * r); if (m) S.mp = Math.min(st.maxmp, S.mp + st.maxmp * m); } RefineFx.tick(dt); };
}

/* ---- refine glow on the player (+7 blue, +10 purple, +15 gold, +20 rainbow) ---- */
const RefineFx = {
  t: 0,
  tick(dt) {
    const S = Save.d, P = Player; const w = S.equip.weapon; const lv = w ? Refine.lv(w) : 0; if (lv < 7 || P.dead) return; this.t += dt; const rate = lv >= 15 ? 30 : lv >= 10 ? 18 : 9; if (Math.random() > dt * rate) return;
    const col = lv >= 20 ? [[1, .4, .4], [1, .9, .3], [.4, 1, .5], [.4, .7, 1], [.9, .5, 1]][randi(0, 4)] : lv >= 15 ? [1, .82, .3] : lv >= 10 ? [.8, .45, 1] : [.45, .75, 1];
    const a = Math.random() * TAU; Particles.add(P.x + Math.sin(a) * .5, rand(.4, 2), P.z + Math.cos(a) * .5, { c: col, s: lv >= 15 ? .4 : .3, life: .8, vy: rand(.6, 1.5) });
  }
};

/* ---- UI: refine / card window ---- */
UI.extraPanels = UI.extraPanels || {}; Object.assign(UI.extraPanels, { refine: 'pRefine', cards: 'pCards' });
UI.pRefine = function (o) {
  const S = Refine.data(), tab = o.tab || 'refine'; this.panelOpt.tab = tab;
  const gear = Object.keys(S.inv).filter(id => ITEMS[id] && ITEMS[id].kind === 'gear').sort((a, b) => (S.equip[ITEMS[b].slot] === b) - (S.equip[ITEMS[a].slot] === a));
  const sel = o.sel && S.inv[o.sel] ? o.sel : gear[0]; if (sel) this.panelOpt.sel = sel;
  const list = gear.map(id => `<button class="rfit ${id === sel ? 'on' : ''}" data-rs="${id}">${UI.itemIcon(id)}<span><b>${esc(Refine.label(id))}</b><small>${S.equip[ITEMS[id].slot] === id ? 'สวมใส่อยู่ · ' : ''}ช่องการ์ด ${(S.cards[id] || []).length}/${itemSlots(id)}</small></span></button>`).join('') || '<p class="muted">ยังไม่มีอุปกรณ์ในกระเป๋า</p>';
  let body = '';
  if (sel && tab === 'refine') {
    const lv = Refine.lv(sel), st = refineStone(lv), cost = refineCost(lv), cur = refineBonus(sel, lv), nx = refineBonus(sel, Math.min(REFINE_MAX, lv + 1));
    const line = b => Object.entries(b).map(([k, v]) => `${{ atk: 'ATK', def: 'DEF', hp: 'HP', mp: 'MP' }[k]} +${v}`).join(' · ') || '—';
    const risk = lv >= REFINE_MAX ? 'ตีบวกสูงสุดแล้ว' : lv < 4 ? 'ปลอดภัย 100%' : lv < 10 ? 'ล้มเหลว: ระดับ −1' : 'ล้มเหลว: อุปกรณ์แตก! (ใช้หินกันแตกเพื่อ −1 แทน)';
    body = `<div class="rfbox"><div class="rfbig">${UI.itemIcon(sel)}<b class="rflv l${lv >= 15 ? 3 : lv >= 10 ? 2 : lv >= 7 ? 1 : 0}">+${lv}</b></div>
      <h3>${esc(Refine.label(sel))}</h3>
      <p>โบนัสตอนนี้: <b>${line(cur)}</b></p>${lv < REFINE_MAX ? `<p>ถ้าสำเร็จ (+${lv + 1}): <b class="up">${line(nx)}</b></p>
      <p>โอกาสสำเร็จ <b class="rfp">${REFINE_RATE[lv]}%</b> · <span class="${lv >= 10 ? 'dn' : ''}">${risk}</span></p>
      <p>ใช้: ${ITEMS[st].name} ×1 (มี ${S.inv[st] || 0}) · ${icon('coin')} ${fmt(cost)}</p>
      ${lv >= 10 ? `<label class="chk"><input type="checkbox" id="rfg" ${S.inv.rf_guard ? 'checked' : 'disabled'}> ใช้หินกันแตก (มี ${S.inv.rf_guard || 0})</label>` : ''}
      <button class="btn primary big" data-rf="go" ${S.inv[st] && S.coins >= cost ? '' : 'disabled'}>${icon('hammer')} ตีบวก!</button>` : ''}<div id="rfres"></div></div>`;
  } else if (sel && tab === 'card') {
    const arr = S.cards[sel] || [], n = itemSlots(sel), it = ITEMS[sel];
    const slots = Array.from({ length: n }, (_, i) => arr[i] ? `<div class="cslot on">${cardArt(arr[i], 'sm')}<button class="btn sm ghost" data-rf="rm:${i}">ถอด (${fmt({ n: 300, u: 600, m: 2000, b: 5000 }[CARDS[arr[i]].tier])})</button></div>` : '<div class="cslot"><span>ช่องว่าง</span></div>').join('');
    const mine = Object.keys(S.inv).filter(id => CARDS[id] && CARDS[id].slot === it.slot).map(id => `<div class="cpick">${cardArt(id, 'sm')}<small>×${S.inv[id]}</small><button class="btn sm" data-rf="in:${id}" ${arr.length >= n ? 'disabled' : ''}>ใส่การ์ด</button></div>`).join('') || `<p class="muted">ยังไม่มีการ์ดที่ใส่ใน${{ weapon: 'อาวุธ', armor: 'ชุดเกราะ', acc: 'เครื่องประดับ' }[it.slot]}ได้ ล่ามอนสเตอร์เพื่อหาการ์ด</p>`;
    body = `<div class="rfbox"><h3>${esc(Refine.label(sel))} · ช่องการ์ด ${arr.length}/${n}</h3><div class="cslots">${slots}</div><h4>การ์ดในกระเป๋าที่ใส่ได้</h4><div class="cpicks">${mine}</div><p class="muted">ใส่การ์ดแล้วถอดได้ที่ช่างโบรัน (เสียเหรียญ) · การ์ดให้ผลเมื่อสวมใส่อุปกรณ์ชิ้นนั้น</p></div>`;
  }
  this.setPanel(`${icon('hammer')} ช่างโบรัน: ตีบวกและการ์ด`, `<div class="tabs"><button class="tab ${tab === 'refine' ? 'on' : ''}" data-tab="refine">ตีบวก</button><button class="tab ${tab === 'card' ? 'on' : ''}" data-tab="card">ใส่การ์ด</button><button class="tab" data-go="cards">สมุดการ์ด</button></div><div class="rfwrap"><div class="rflist">${list}</div>${body}</div>`, true);
  const B = this.el.pbody;
  B.onclick = e => {
    const t = e.target.closest('[data-tab]'); if (t) { this.panelOpt.tab = t.dataset.tab; this.renderPanel(); return; }
    const g = e.target.closest('[data-go]'); if (g) { this.openPanel('cards'); return; }
    const s = e.target.closest('[data-rs]'); if (s) { this.panelOpt.sel = s.dataset.rs; this.renderPanel(); return; }
    const b = e.target.closest('[data-rf]'); if (!b) return; const [k, a] = b.dataset.rf.split(':');
    if (k === 'go') {
      const gd = B.querySelector('#rfg'); b.disabled = true; Audio.sfx('slam'); const box = B.querySelector('.rfbig'); box.classList.add('hit');
      setTimeout(() => { const r = Refine.try(sel, gd && gd.checked); box.classList.remove('hit'); if (!r) { this.renderPanel(); return; }
        if (r.ok) { Audio.sfx('level'); UI.banner(`ตีบวกสำเร็จ! +${r.lv}`, 'level'); Particles.ring(Player.x, 1, Player.z, 1.2, 30, [1, .85, .4], 1, .5); }
        else if (r.broke) { Audio.sfx('hurt'); UI.banner('อุปกรณ์แตก!', 'fizzle'); }
        else { Audio.sfx('hurt'); UI.banner(`ล้มเหลว… +${r.lv}`, 'fizzle'); }
        this.renderPanel(); const rs = this.el.pbody.querySelector('#rfres'); if (rs) rs.innerHTML = `<p class="rfmsg ${r.ok ? 'ok' : 'bad'}">${r.ok ? 'สำเร็จ! ✨' : r.broke ? 'อุปกรณ์แตกสลาย…' : 'ล้มเหลว ระดับลดลง'}</p>`;
      }, 650);
    } else if (k === 'in') { if (Refine.insert(a, sel)) this.renderPanel(); }
    else if (k === 'rm') { Refine.remove(sel, +a); this.renderPanel(); }
  };
};
function cardArt(cid, cls = '') {
  const C = CARDS[cid]; if (!C) return ''; const T = CARD_TIERS[C.tier], d = MONSTERS[C.mon];
  return `<div class="cardart t-${C.tier} ${cls}" style="--cc:${T[1]}"><span class="ce">${CARD_EMOJI[C.mon] || (d.ghost ? '👻' : '👾')}</span><b>${esc(d.name)}</b><small>${cardFxText(C.fx)}</small><i>${T[0]}</i></div>`;
}
UI.pCards = function (o) {
  const S = Refine.data(), f = o.f || 'all'; this.panelOpt.f = f;
  const ids = Object.keys(CARDS).filter(id => f === 'all' || CARDS[id].tier === f).sort((a, b) => 'numb'.indexOf(CARDS[a].tier) - 'numb'.indexOf(CARDS[b].tier) || MONSTERS[CARDS[a].mon].lvl - MONSTERS[CARDS[b].mon].lvl);
  const have = Object.keys(S.cardBook).length;
  this.setPanel(`${icon('card')} สมุดสะสมการ์ด <small>${have}/${Object.keys(CARDS).length}</small>`, `<div class="tabs">${[['all', 'ทั้งหมด'], ['n', 'ธรรมดา'], ['u', 'หายาก'], ['m', 'มินิบอส'], ['b', 'บอส MVP']].map(([k, l]) => `<button class="tab ${f === k ? 'on' : ''}" data-cf="${k}">${l}</button>`).join('')}</div>
    <div class="cardgrid">${ids.map(id => `<div class="cbk ${S.cardBook[id] ? 'got' : 'no'}">${cardArt(id)}${S.inv[id] ? `<em>×${S.inv[id]}</em>` : ''}</div>`).join('')}</div>
    <p class="muted">การ์ดดรอปจากมอนสเตอร์ได้ยากมาก ยิ่งเป็นมินิบอสและบอส MVP ยิ่งหายาก · ใส่การ์ดได้ที่ช่างโบรันในเมืองหลวง</p>`, true);
  this.el.pbody.onclick = e => { const t = e.target.closest('[data-cf]'); if (t) { this.panelOpt.f = t.dataset.cf; this.renderPanel(); } };
};
{
  // smith NPC: shop + refine buttons
  SHOPS.smith = ['ร้านตีเหล็กของโบรัน', 'ดูหินตีบวกและอาวุธ', () => ['rf_stone', 'rf_stone2', 'w_iron', 'w_mith', 'a_leather', 'a_moon', 'r_mana', 'r_wind'], 1];
  NPCS.boran.shop = 'smith';
  const od = UI.pDialog.bind(UI);
  UI.pDialog = function (o) {
    od(o); if (o.npc !== 'boran') return; const bt = this.el.pbody.querySelector('.dbtns'); if (!bt) return;
    const mk = (k, l, c) => { const b = document.createElement('button'); b.className = 'btn ' + c; b.textContent = l; b.onclick = e => { e.stopPropagation(); Audio.sfx('ui'); this.openPanel('refine', { tab: k }); }; bt.insertBefore(b, bt.lastElementChild); };
    mk('refine', '🔨 ตีบวกอุปกรณ์', 'primary'); mk('card', '🃏 ใส่/ถอดการ์ด', '');
  };
  // show +N in inventory / character windows
  const deco = () => { const S = Save.d; if (!S || !S.refine) return; for (const el of document.querySelectorAll('.uwin [data-info]')) { const id = el.dataset.info, l = S.refine[id]; if (!l || el.dataset.rf) continue; const b = el.querySelector('b'); if (b && ITEMS[id] && ITEMS[id].kind === 'gear') { b.textContent = '+' + l + ' ' + b.textContent; el.dataset.rf = 1; } } };
  for (const f of ['pInv', 'pChar', 'pShop']) { const o = UI[f].bind(UI); UI[f] = function (a) { o(a); deco(); }; }
  // item info: refine & card rows
  const oo = ItemInfo.open.bind(ItemInfo);
  ItemInfo.open = function (id) { oo(id); const it = ITEMS[id], S = Save.d; const box = document.querySelector('#itempop'); if (!box || !it) return; let h = '';
    if (it.kind === 'gear') { const l = Refine.lv(id), arr = (S.cards || {})[id] || []; h = `<p class="iirf">ตีบวก: <b>+${l}</b> ${l ? '(' + Object.entries(refineBonus(id, l)).map(([k, v]) => k.toUpperCase() + ' +' + v).join(' · ') + ')' : ''} · ช่องการ์ด ${arr.length}/${itemSlots(id)}${arr.length ? '<br>' + arr.map(c => ITEMS[c].name + ': ' + cardFxText(CARDS[c].fx)).join('<br>') : ''}</p>`; }
    else if (CARDS[id]) h = cardArt(id);
    if (h) { const host = box.querySelector('.iil'); if (host) { const ref = host.querySelector('.iilore'); if (ref) ref.insertAdjacentHTML('afterend', h); else host.insertAdjacentHTML('beforeend', h); } } };
  // gem shop: guard stone
  GEM_ITEMS.push({ id: 'g_rfguard', cat: 'conv', gems: 40, give: [['rf_guard', 1]], name: 'หินกันแตก', desc: 'กันอุปกรณ์แตกตอนตีบวก +10 ขึ้นไป', icon: 'shield' });
  GEM_ITEMS.push({ id: 'g_rfstone2', cat: 'conv', gems: 25, give: [['rf_stone2', 1]], name: 'หินตีบวกขั้นสูง', desc: 'ใช้ตีบวก +11 ถึง +20', icon: 'gem' });
}
