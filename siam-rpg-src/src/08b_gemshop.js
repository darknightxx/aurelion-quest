/* ============================================================
   Gem shop + top-up (DEMO: no real payment is ever taken)
   ============================================================ */
Object.assign(ICONS, {
  gem: '<path d="M7 3h10l4 6-9 12L3 9z" fill="#9b6bff"/><path d="M3 9h18M7 3l2 6 3 12 3-12 2-6M9 9l3-6 3 6" stroke="#e6d6ff" stroke-width="1" fill="none" opacity=".75"/><path d="M7 3h10l-2 6H9z" fill="#c9b2ff" opacity=".7"/>',
  halo: '<ellipse cx="12" cy="10" rx="8" ry="3.4" fill="none" stroke="#f3d27a" stroke-width="2.4"/><path d="M8 17l4 4 4-4" stroke="#f3d27a" stroke-width="1.6" fill="none" opacity=".5"/>',
  wingD: '<path d="M12 13 2 4l1 6-1 5 4-1 1 5 3-2zM12 13l10-9-1 6 1 5-4-1-1 5-3-2z" fill="#d8452e"/><path d="M12 13 3 5M12 13l9-8" stroke="#7a1e12" stroke-width="1"/>',
  rainbow: '<path d="M3 17a9 9 0 0 1 18 0" stroke="#ff6b6b" stroke-width="2" fill="none"/><path d="M5.5 17a6.5 6.5 0 0 1 13 0" stroke="#ffd36b" stroke-width="2" fill="none"/><path d="M8 17a4 4 0 0 1 8 0" stroke="#6bdcff" stroke-width="2" fill="none"/>',
  feather: '<path d="M20 4C12 4 6 9 5 16l-2 4 3-1c7-1 12-7 14-15z" fill="#ff8a3d"/><path d="M5 19 16 8" stroke="#ffd36b" stroke-width="1.4"/>',
  receipt: '<path d="M6 3h12v18l-2-1.5L14 21l-2-1.5L10 21l-2-1.5L6 21z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" stroke-width="1.8"/>'
});
const gemSvg = (cls = '') => `<svg class="ic gemic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS.gem}</svg>`;
function gemArt(level) {
  const n = [1, 3, 5, 8, 11, 15][level - 1] || 1; let s = '';
  const rng = mulberry32(level * 77);
  for (let i = 0; i < n; i++) { const x = 30 + (rng() - .5) * (12 + level * 9), y = 44 - rng() * (6 + level * 4) + (i / n) * 6, k = .55 + rng() * .35; s += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${k.toFixed(2)})"><path d="M-7-9h14l6 9-13 17-13-17z" fill="#8a5cf0"/><path d="M-7-9h14l-3 9h-8z" fill="#c9b2ff"/><path d="M-13 0h26L0 17z" fill="#6a3fd0"/></g>`; }
  const bag = level >= 3 ? `<path d="M14 40c0-10 6-16 16-16s16 6 16 16c0 8-6 12-16 12s-16-4-16-12z" fill="#8a6240"/><path d="M20 26c4-4 16-4 20 0" stroke="#5a3a22" stroke-width="3" fill="none"/>` : '';
  const glow = level >= 5 ? `<circle cx="30" cy="34" r="26" fill="url(#gglow)"/>` : '';
  return `<svg class="gemart" viewBox="0 0 60 60" aria-hidden="true"><defs><radialGradient id="gglow"><stop offset="0" stop-color="#c9b2ff" stop-opacity=".55"/><stop offset="1" stop-color="#c9b2ff" stop-opacity="0"/></radialGradient></defs>${glow}${bag}${s}</svg>`;
}

const Gems = {
  ensure() {
    const S = Save.d; if (!S) return;
    if (S.gems === undefined) S.gems = 0;
    S.topup = Object.assign({ spent: 0, first: {}, starter: false, monthly: null, claimed: {}, history: [] }, S.topup || {});
    S.gemBuys = S.gemBuys || {}; S.perm = Object.assign({ atk: 0, hp: 0 }, S.perm || {});
  },
  add(n, why) { const S = Save.d; S.gems += n; this.log('+' + n, why); UI.gemPop(); },
  log(delta, what) { const h = Save.d.topup.history; h.unshift({ t: Date.now(), d: delta, w: what }); if (h.length > 60) h.length = 60; },
  // ---- top-up (demo) ----
  packGems(p) { const first = !Save.d.topup.first[p.id]; return { base: p.gems + p.bonus, total: first ? (p.gems + p.bonus) * 2 : p.gems + p.bonus, first }; },
  completeTopup(kind, p) {
    const S = Save.d, T = S.topup; let got = 0, items = [];
    if (kind === 'pack') { const g = this.packGems(p); got = g.total; T.first[p.id] = true; }
    else if (p.id === 'starter') { got = p.gems; items = p.items; T.starter = true; }
    else if (p.id === 'monthly') { got = p.gems; const now = Date.now(); const base = T.monthly && T.monthly.until > now ? T.monthly.until : now; T.monthly = { until: base + p.days * 864e5, last: '' }; }
    T.spent += p.thb; S.gems += got; this.log('+' + got, `เติมเพชร ฿${p.thb} (ทดลอง)`);
    for (const [it, n] of items) Game.addItem(it, n, true); if (p.title) Titles.grant(p.title, p.name);
    Save.write(); UI.gemPop(); Audio.sfx('level'); Achievements.check();
    return { got, items };
  },
  monthlyState() { const m = Save.d.topup.monthly; if (!m || m.until < Date.now()) return null; return { days: Math.ceil((m.until - Date.now()) / 864e5), canClaim: m.last !== today() }; },
  claimMonthly() { const st = this.monthlyState(); if (!st || !st.canClaim) return; Save.d.topup.monthly.last = today(); this.add(60, 'บัตรรายเดือน รายวัน'); Audio.sfx('coin'); },
  claimMilestone(i) {
    const S = Save.d, m = TOPUP_MILESTONES[i]; if (S.topup.spent < m.thb || S.topup.claimed[i]) return;
    S.topup.claimed[i] = true; this.add(m.gems, `รางวัลเติมสะสม ฿${m.thb}`); for (const [it, n] of m.items) Game.addItem(it, n, true);
    if (m.title) Titles.grant(m.title, 'รางวัลเติมสะสม'); UI.toast('รับรางวัล: ' + m.label, 'rare'); Audio.sfx('level');
  },
  // ---- gem shop ----
  price(g) { return weeklyDeals().includes(g) ? Math.round(g.gems * .8) : g.gems; },
  owned(g) { return g.item && (Save.d.inv[g.item] || 0) > 0; },
  limitLeft(g) { return g.limit ? g.limit - (Save.d.gemBuys[g.id] || 0) : 99; },
  buy(g) {
    const S = Save.d, pr = this.price(g);
    if (this.owned(g) || this.limitLeft(g) <= 0) return false;
    if (S.gems < pr) { UI.toast('เพชรไม่พอ เติมเพชรได้ที่ปุ่ม + เติมเพชร', 'warn'); return false; }
    S.gems -= pr; S.gemBuys[g.id] = (S.gemBuys[g.id] || 0) + 1; this.log('−' + pr, this.name(g));
    if (g.item) { Game.addItem(g.item, 1, true); if (S.tryon && S.tryon.id === g.item) { S.tryon = null; delete S.buffs.tryon; } Game.equip(g.item); }
    if (g.give) for (const [it, n] of g.give) Game.addItem(it, n, true);
    if (g.buff) Game.addBuff(g.buff[0], (S.buffs[g.buff[0]] || 0) + g.buff[1]);
    if (g.coins) Game.gainCoins(g.coins);
    if (g.statpt) S.points += g.statpt;
    if (g.perm) { for (const k in g.perm) S.perm[k] += g.perm[k]; Player.recalc(); }
    Audio.sfx('coin'); UI.toast('ซื้อ ' + this.name(g) + ' แล้ว', 'item'); UI.gemPop(); Save.write(); UI.refreshAll(); return true;
  },
  name(g) { return g.name || ITEMS[g.item].name; },
  desc(g) { return g.desc || (g.item ? ITEMS[g.item].desc : g.give ? g.give.map(([i, n]) => ITEMS[i].name + ' ×' + n).join(' · ') : ''); },
  icon(g) { return g.item ? UI.itemIcon(g.item) : icon(g.icon || 'star', 'r-gear'); },
  tryOn(g) {
    const S = Save.d, it = ITEMS[g.item]; if (!it || it.kind !== 'cos') return;
    if (S.tryon) this.endTry(true);
    S.tryon = { slot: it.slot, id: g.item, prev: S.cos[it.slot] }; S.cos[it.slot] = g.item; S.buffs.tryon = 120;
    Player.recalc(); UI.refreshHUD(); UI.toast('ลองใส่ ' + it.name + ' 2 นาที ปิดร้านเพื่อดูตัวละครได้เลย', 'quest'); Audio.sfx('ui');
  },
  endTry(silent) {
    const S = Save.d, t = S.tryon; if (!t) return;
    if (S.cos[t.slot] === t.id && !(S.inv[t.id] > 0)) S.cos[t.slot] = t.prev && S.inv[t.prev] ? t.prev : null;
    S.tryon = null; delete S.buffs.tryon; Player.recalc(); UI.refreshHUD(); if (!silent) UI.toast('หมดเวลาลองใส่แล้ว ซื้อได้ที่ร้านเพชร', 'info');
  }
};

function buildGemModels(R) {
  let g = new Geo(90); g.jit = 0; for (let i = 0; i < 20; i++) { const a0 = i / 20 * TAU, a1 = (i + 1) / 20 * TAU; const P = (a, r, y) => [Math.cos(a) * r, y, Math.sin(a) * r]; const c = hexc('#f6d77e'); g.quad(P(a0, .32, .03), P(a1, .32, .03), P(a1, .4, .03), P(a0, .4, .03), c); g.quad(P(a0, .4, -.03), P(a1, .4, -.03), P(a1, .32, -.03), P(a0, .32, -.03), c); g.quad(P(a0, .4, .03), P(a1, .4, .03), P(a1, .4, -.03), P(a0, .4, -.03), c); }
  Models.c_halo = R.mesh(g);
  g = new Geo(91); g.jit = .03;
  for (let i = 0; i < 4; i++) { const rz = .75 - i * .36, L = 1.05 - i * .12; g.at(.1, 0, 0, 0, 1, 1, 1, 0, rz); g.box(L / 2 + .05, 0, 0, L, .07, .07, hexc('#5a1a10')); g.box(L / 2 + .05, -.13, 0, L * .92, .24, .03, i % 2 ? hexc('#d8452e') : hexc('#b8321f')); g.reset(); }
  g.cone(.12, .05, 0, 0, 1, 0, .05, .2, 4, hexc('#f3d27a'));
  Models.c_dragon = R.mesh(g);
}

Object.assign(UI, {
  gemPop() { const b = $('#gembox'); if (!b) return; $('#gems').textContent = fmt(Save.d.gems || 0); b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); },
  /* ---------- top-up panel ---------- */
  pTopup(o) {
    Gems.ensure(); const S = Save.d, T = S.topup;
    const ms = Gems.monthlyState();
    const specials = SPECIAL_PACKS.map(p => {
      let btn; if ((p.id === 'starter' && T.starter) || (p.mount && Mounts.data().own[p.mount])) btn = '<span class="sold">ซื้อแล้ว</span>';
      else if (p.id === 'monthly' && ms) btn = `<button class="btn sm primary" data-claim="1" ${ms.canClaim ? '' : 'disabled'}>${ms.canClaim ? 'รับ 60 เพชรวันนี้' : 'รับแล้ววันนี้'}</button><small class="muted">เหลือ ${ms.days} วัน</small>`;
      else btn = `<button class="btn gembtn" data-sp="${p.id}">฿${p.thb}</button>`;
      return `<li class="spk ${p.id}"><div class="spart">${p.mount ? `<img class="mthumb" src="${StableView.thumb(p.mount)}" alt="">` + gemSvg() : p.id === 'starter' ? icon('wing') + icon('potR2') : icon('scroll') + gemSvg()}</div><div class="in"><span class="ptag">${p.tag}</span><b>${p.name}</b><small>${p.desc}</small></div><div class="spbtn">${btn}</div></li>`;
    }).join('');
    const packs = GEM_PACKS.map(p => { const g = Gems.packGems(p); return `<li class="gpk">${g.first ? '<span class="x2">×2 ครั้งแรก</span>' : ''}${gemArt(p.art)}<b class="gnum">${fmt(g.total)}</b><span class="gunit">เพชร</span><span class="gbonus">${g.first ? `ปกติ ${fmt(g.base)} · ` : ''}${p.bonus ? 'รวมโบนัส ' + fmt(p.bonus + (g.first ? g.base : 0)) : g.first ? 'โบนัส ' + fmt(g.base) : 'ไม่มีโบนัส'}</span><button class="btn gembtn" data-pk="${p.id}">฿${fmt(p.thb)}</button></li>`; }).join('');
    const maxT = TOPUP_MILESTONES[TOPUP_MILESTONES.length - 1].thb;
    const miles = TOPUP_MILESTONES.map((m, i) => { const ok = T.spent >= m.thb, c = T.claimed[i]; return `<li class="${ok ? 'ok' : ''} ${c ? 'done' : ''}"><span class="mthb">฿${fmt(m.thb)}</span><span class="mrew">${m.label}</span>${c ? '<span class="sold">รับแล้ว</span>' : `<button class="btn sm ${ok ? 'primary' : 'ghost'}" data-ms="${i}" ${ok ? '' : 'disabled'}>รับ</button>`}</li>`; }).join('');
    this.setPanel(`${gemSvg()} เติมเพชร <span class="demo">โหมดทดลอง</span>`, `
      <div class="gemhead"><div class="gembal">${gemSvg('big')}<b>${fmt(S.gems)}</b><span>เพชรของคุณ</span></div>
        <div class="gempromo"><b>เติมครั้งแรกทุกแพ็ก รับเพชร ×2</b><span>ใช้เพชรซื้อชุดแต่งตัว บูสต์ และของหายากในร้านเพชร</span></div></div>
      <p class="demonote">${icon('receipt')} หน้านี้เป็นการจำลองการเติมเงินเพื่อทดสอบเกม ไม่มีการเชื่อมต่อระบบชำระเงินและไม่มีการตัดเงินจริง</p>
      <h4>แพ็กพิเศษ</h4><ul class="splist">${specials}</ul>
      <h4>แพ็กเพชร</h4><ul class="gpgrid">${packs}</ul>
      <h4>รางวัลเติมสะสม <small class="muted">ยอดสะสม ฿${fmt(T.spent)}</small></h4>
      <div class="mbar"><i style="width:${Math.min(100, T.spent / maxT * 100)}%"></i></div><ul class="mlist">${miles}</ul>
      <div class="row"><button class="btn ghost" data-go="gemshop">${gemSvg()} ไปร้านเพชร</button><button class="btn ghost" data-go="ghist">${icon('receipt')} ประวัติ</button></div>
      <div id="tsheet" hidden></div>`, true);
    const sheet = $('#tsheet');
    const confirmBuy = (kind, p) => {
      const title = kind === 'pack' ? `เพชร ${fmt(Gems.packGems(p).total)}` : p.name;
      sheet.hidden = false;
      sheet.innerHTML = `<div class="tsbox" role="dialog" aria-label="ยืนยันการเติม"><h3>ยืนยันการเติม (ทดลอง)</h3><div class="tsrow"><span>รายการ</span><b>${title}</b></div><div class="tsrow"><span>ราคา</span><b>฿${fmt(p.thb)}</b></div>
        <p class="demonote">โหมดทดลอง: กดยืนยันแล้วจะได้รับเพชรทันที ไม่มีการตัดเงินจริง</p><div class="row"><button class="btn ghost" data-ts="no">ยกเลิก</button><button class="btn primary" data-ts="yes">ยืนยัน (ทดลอง)</button></div></div>`;
      sheet.onclick = e => {
        const b = e.target.closest('[data-ts]'); if (!b) { if (e.target === sheet) sheet.hidden = true; return; }
        if (b.dataset.ts === 'no') { sheet.hidden = true; return; }
        const r = Gems.completeTopup(kind, p);
        sheet.innerHTML = `<div class="tsbox ok"><div class="okburst">${gemSvg('huge')}</div><h3>เติมสำเร็จ (ทดลอง)</h3><p class="gotgems">+${fmt(r.got)} เพชร</p>${r.items.length ? `<p class="muted">พร้อม ${r.items.map(([i, n]) => ITEMS[i].name + (n > 1 ? ' ×' + n : '')).join(', ')}</p>` : ''}<div class="row"><button class="btn primary" data-ts2="ok">ตกลง</button></div></div>`;
        sheet.onclick = ev => { if (ev.target.closest('[data-ts2]')) this.renderPanel(); };
      };
    };
    this.el.pbody.onclick = e => {
      const pk = e.target.closest('[data-pk]'); if (pk) return confirmBuy('pack', GEM_PACKS.find(p => p.id === pk.dataset.pk));
      const sp = e.target.closest('[data-sp]'); if (sp) return confirmBuy('special', SPECIAL_PACKS.find(p => p.id === sp.dataset.sp));
      if (e.target.closest('[data-claim]')) { Gems.claimMonthly(); return this.renderPanel(); }
      const m = e.target.closest('[data-ms]'); if (m) { Gems.claimMilestone(+m.dataset.ms); return this.renderPanel(); }
      const g = e.target.closest('[data-go]'); if (g) return this.openPanel(g.dataset.go === 'ghist' ? 'gemshop' : g.dataset.go, g.dataset.go === 'ghist' ? { cat: 'hist' } : {});
    };
  },
  /* ---------- gem shop ---------- */
  pGemShop(o) {
    Gems.ensure(); const S = Save.d; const cat = o.cat || 'deal'; this.panelOpt.cat = cat;
    const deals = weeklyDeals();
    const count = c => c === 'deal' ? deals.length : GEM_ITEMS.filter(g => g.cat === c).length;
    const cats = GEM_CATS.map(c => `<button class="gcat ${c.id === cat ? 'on' : ''} ${c.id === 'deal' ? 'deal' : ''}" data-cat="${c.id}"><span>${c.name}</span><i>${count(c.id)}</i></button>`).join('');
    let body;
    if (cat === 'hist') {
      const h = S.topup.history;
      body = `<h4>ประวัติเพชร</h4><ul class="hist">${h.length ? h.map(x => `<li><span>${new Date(x.t).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' })}</span><b class="${x.d[0] === '+' ? 'pos' : 'neg'}">${x.d}</b><span>${esc(x.w)}</span></li>`).join('') : '<li class="emptyrow">ยังไม่มีรายการ</li>'}</ul>`;
    } else {
      const meta = GEM_CATS.find(c => c.id === cat);
      const list = cat === 'deal' ? deals : GEM_ITEMS.filter(g => g.cat === cat);
      const ms = nextMonday(); const dd = Math.floor(ms / 864e5), hh = Math.floor(ms % 864e5 / 36e5);
      body = `<div class="gcathead"><b>${meta.name}</b><span>${meta.desc}${cat === 'deal' ? ` · เหลืออีก ${dd} วัน ${hh} ชม.` : ''}</span></div><ul class="glist">${list.map(g => {
        const pr = Gems.price(g), disc = pr !== g.gems, owned = Gems.owned(g), left = Gems.limitLeft(g);
        const trying = S.tryon && S.tryon.id === g.item;
        const buyBtn = owned ? `<span class="sold">มีแล้ว</span>` : left <= 0 ? `<span class="sold">ครบจำนวนแล้ว</span>` : `<button class="btn gembuy" data-buy="${g.id}" ${S.gems < pr ? 'data-short="1"' : ''}>${gemSvg()}<b>${fmt(pr)}</b>${disc ? `<s>${fmt(g.gems)}</s>` : ''}</button>`;
        return `<li class="${disc ? 'disc' : ''} ${g.hot ? 'hot' : ''}"><div class="gico">${Gems.icon(g)}</div><div class="in"><b>${Gems.name(g)}</b><small>${Gems.desc(g)}${g.limit ? ` · เหลือ ${left}/${g.limit}` : ''}</small></div><div class="gact">${g.mount ? `<button class="btn sm ghost" data-mview="${g.mount}">ดู 3D</button>` : ''}${g.tryon && !owned ? `<button class="btn sm ghost" data-try="${g.id}">${trying ? 'กำลังลองใส่' : 'ลองใส่ 2 นาที'}</button>` : ''}${buyBtn}</div></li>`;
      }).join('')}</ul>`;
    }
    this.setPanel(`${gemSvg()} ร้านเพชร`, `
      <div class="gshead"><div class="gembal small">${gemSvg()}<b>${fmt(S.gems)}</b><span>เพชร</span></div><button class="btn gembtn" data-go="topup">+ เติมเพชร</button><button class="btn ghost ${cat === 'hist' ? 'on' : ''}" data-cat="hist">ประวัติ</button></div>
      <div class="gcats">${cats}</div>${body}`, true);
    this.el.pbody.onclick = e => {
      const c = e.target.closest('[data-cat]'); if (c) { this.panelOpt.cat = c.dataset.cat; return this.renderPanel(); }
      if (e.target.closest('[data-go]')) return this.openPanel('topup');
      const b = e.target.closest('[data-buy]'); if (b) { const g = GEM_ITEMS.find(x => x.id === b.dataset.buy); if (b.dataset.short) { this.toast('เพชรไม่พอ ไปหน้าเติมเพชรได้เลย', 'warn'); return this.openPanel('topup'); } Gems.buy(g); return this.renderPanel(); }
      const mv = e.target.closest('[data-mview]'); if (mv) return this.openPanel('stable', { sel: mv.dataset.mview });
      const t = e.target.closest('[data-try]'); if (t) { Gems.tryOn(GEM_ITEMS.find(x => x.id === t.dataset.try)); return this.renderPanel(); }
    };
  }
});

