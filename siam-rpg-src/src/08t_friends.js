
/* ============================================================
   Friends (Y): send / accept friend requests, see who is online
   and on which channel, warp to a friend, invite to party.
   Requests travel through the existing invites/{uid}/{from} path
   (p = 'F~lv~job' request, 'FA~lv~job' accepted).
   ============================================================ */
const Friends = {
  reqs: [], where: {}, pollT: 0, polling: false, seenOn: {},
  list() { const S = Save.d; if (!S.friends) S.friends = {}; return S.friends; },
  is(uid) { return !!this.list()[uid]; },
  tag(kind) { const S = Save.d; return `${kind}~${S.level}~${S.job || S.cls}`; },
  parse(v) { const [k, lv, j] = String(v.p || '').split('~'); return { k, lv: +lv || 1, j: j || 'adventurer' }; },
  request(p) {
    if (!Net.joined) { UI.toast('ต้องเชื่อมต่อเซิร์ฟเวอร์ก่อน', 'warn'); return; }
    if (this.is(p.uid)) { UI.toast(`${p.name} เป็นเพื่อนอยู่แล้ว`, 'info'); return; }
    if (Object.keys(this.list()).length >= 50) { UI.toast('รายชื่อเพื่อนเต็มแล้ว (50 คน)', 'warn'); return; }
    Net.be.set(`invites/${p.uid}/${Net.uid}`, { n: Save.d.name.slice(0, 16), p: this.tag('F'), t: Net.be.ts() });
    UI.toast(`ส่งคำขอเป็นเพื่อนถึง ${p.name} แล้ว`, 'quest');
  },
  onInvite(from, v) {
    const t = this.parse(v);
    if (t.k === 'FA') { Net.be.remove(`invites/${Net.uid}/${from}`); this.add(from, ChatFilter.name(v.n), t.lv, t.j); UI.toast(`${ChatFilter.name(v.n)} รับเป็นเพื่อนแล้ว!`, 'quest'); Audio.sfx('quest'); this.refresh(); return true; }
    if (t.k !== 'F') return false;
    if (this.is(from)) { this.answer(from, true, { n: ChatFilter.name(v.n), lv: t.lv, j: t.j }); return true; }
    this.reqs = this.reqs.filter(r => r.from !== from); this.reqs.push({ from, n: ChatFilter.name(v.n), lv: t.lv, j: t.j });
    UI.toast(`${ChatFilter.name(v.n)} ขอเป็นเพื่อน · กด Y เพื่อตอบรับ`, 'quest'); Audio.sfx('quest'); this.badge(); this.refresh(); return true;
  },
  add(uid, n, lv, j) { this.list()[uid] = { n, lv, j, since: Date.now() }; Save.write(); this.badge(); },
  answer(from, ok, r0) {
    const r = r0 || this.reqs.find(x => x.from === from); this.reqs = this.reqs.filter(x => x.from !== from);
    if (Net.be) Net.be.remove(`invites/${Net.uid}/${from}`);
    if (ok && r) { this.add(from, r.n, r.lv, r.j); if (Net.be) Net.be.set(`invites/${from}/${Net.uid}`, { n: Save.d.name.slice(0, 16), p: this.tag('FA'), t: Net.be.ts() }); UI.toast(`${r.n} เป็นเพื่อนกับคุณแล้ว`, 'quest'); }
    this.badge(); this.refresh();
  },
  remove(uid) { delete this.list()[uid]; delete this.where[uid]; Save.write(); this.refresh(); },
  async poll() {
    if (this.polling || !Net.online() || !Object.keys(this.list()).length) return; this.polling = true;
    try {
      const w = {}, now = Net.be.now();
      for (let c = 1; c <= NET_CHANNELS; c++) { const v = await Net.be.once(`ch/${c}/players`); if (!v) continue; for (const uid in v) { const s = v[uid]; if (s && this.is(uid) && now - (s.t || 0) < 25000) w[uid] = { ch: c, st: s }; } }
      for (const uid in w) { const f = this.list()[uid]; f.n = ChatFilter.name(w[uid].st.n) || f.n; f.lv = w[uid].st.lv || f.lv; f.j = w[uid].st.j || w[uid].st.c || f.j; if (!this.seenOn[uid] && Object.keys(this.where).length) UI.toast(`เพื่อน ${f.n} ออนไลน์อยู่ที่ CH${w[uid].ch}`, 'info'); this.seenOn[uid] = 1; }
      for (const uid in this.seenOn) if (!w[uid]) delete this.seenOn[uid];
      this.where = w;
    } catch (e) { console.warn('friends poll', e); }
    this.polling = false; this.refresh();
  },
  update(dt) { this.pollT -= dt; if (this.pollT <= 0) { this.pollT = WM.isOpen('friends') ? 10 : 45; this.poll(); } },
  async goTo(uid) {
    const w = this.where[uid]; if (!w) { UI.toast('เพื่อนออฟไลน์อยู่', 'warn'); return; }
    if (Monsters.boss && Monsters.boss.engaged) { UI.toast('วาร์ปไม่ได้ระหว่างสู้บอส', 'warn'); return; }
    if (w.ch !== Net.ch) { await Net.join(w.ch); }
    const s = w.st; UI.closePanel(); Game.teleport(s.x + .8, s.z + .8, 'ไปหา ' + this.list()[uid].n);
  },
  party(uid) { const p = Remote.map.get(uid); if (!p) { UI.toast('ต้องอยู่เซิร์ฟเวอร์เดียวกันก่อน (กด "ไปหา")', 'warn'); return; } Net.invite(p); },
  badge() { const b = document.querySelector('#menubtns [data-p="friends"] .fbadge'); const n = this.reqs.length; if (b) { b.textContent = n; b.hidden = !n; } const m = document.querySelector('#menubtns [data-p="menu"]'); if (m) m.classList.toggle('dot', !!n); },
  refresh() { if (WM.isOpen('friends')) WM.render('friends'); }
};
{
  const oinv = Net.onInvite.bind(Net);
  Net.onInvite = function (from, v) { if (v && /^F/.test(String(v.p || '')) && !this.muted.has(from)) { if (Friends.onInvite(from, v)) return; } return oinv(from, v); };
  const ojoin = Net.join.bind(Net); Net.join = async function (ch) { const r = await ojoin(ch); Friends.pollT = 3; return r; };
  const ou = Game.update.bind(Game); Game.update = function (dt) { ou(dt); if (this.started && Save.d) Friends.update(dt); };
  // peer card: add friend button
  const opc = UI.peerCard.bind(UI);
  UI.peerCard = function (p) {
    opc(p); const el = $('#peercard'), row = el.querySelector('.pcbtns'); if (!row) return;
    const b = document.createElement('button'); b.className = 'btn'; b.textContent = Friends.is(p.uid) ? 'เป็นเพื่อนกันแล้ว' : 'เพิ่มเพื่อน'; b.disabled = Friends.is(p.uid);
    b.onclick = e => { e.stopPropagation(); el.hidden = true; Friends.request(p); }; row.insertBefore(b, row.firstChild);
  };
}
UI.extraPanels = UI.extraPanels || {}; UI.extraPanels.friends = 'pFriends';
UI.pFriends = function () {
  const L = Friends.list(), ids = Object.keys(L).sort((a, b) => (Friends.where[b] ? 1 : 0) - (Friends.where[a] ? 1 : 0) || L[a].n.localeCompare(L[b].n));
  const job = j => ((JOBS[j] || CLASSES[j] || {}).name) || '';
  const zn = { world: 'แดนสยาม', dungeon: 'ถ้ำผลึก', temple: 'วัดร้าง', amazon: 'ป่าอเมซอน' };
  const reqs = Friends.reqs.map(r => `<div class="fr req"><span class="dotst on"></span><div class="frn"><b>${esc(r.n)}</b><small>Lv.${r.lv} · ${job(r.j)} · ขอเป็นเพื่อน</small></div><div class="fract"><button class="btn sm primary" data-fr="ok:${r.from}">ตอบรับ</button><button class="btn sm ghost" data-fr="no:${r.from}">ปฏิเสธ</button></div></div>`).join('');
  const rows = ids.map(uid => { const f = L[uid], w = Friends.where[uid]; return `<div class="fr ${w ? 'on' : ''}"><span class="dotst ${w ? 'on' : ''}"></span><div class="frn"><b>${esc(f.n)}</b><small>Lv.${f.lv} · ${job(f.j)} · ${w ? `ออนไลน์ CH${w.ch} · ${zn[w.st.zn] || w.st.zn}` : 'ออฟไลน์'}</small></div><div class="fract">${w ? `<button class="btn sm" data-fr="go:${uid}">ไปหา</button><button class="btn sm ghost" data-fr="pt:${uid}" ${Remote.map.get(uid) ? '' : 'disabled'}>ชวนปาร์ตี้</button>` : ''}<button class="btn sm ghost danger" data-fr="rm:${uid}">ลบ</button></div></div>`; }).join('') || '<p class="muted">ยังไม่มีเพื่อน แตะชื่อผู้เล่นคนอื่นแล้วกด "เพิ่มเพื่อน" หรือเลือกจากผู้เล่นใกล้ตัวด้านล่าง</p>';
  const near = [...Remote.map.values()].filter(p => p.st && p.zone === Player.zone && !Friends.is(p.uid) && !Net.stale(p)).slice(0, 12).map(p => `<div class="fr"><span class="dotst on"></span><div class="frn"><b>${esc(p.name)}</b><small>Lv.${p.st.lv} · ${job(p.st.j || p.st.c)}</small></div><div class="fract"><button class="btn sm" data-fr="add:${p.uid}">เพิ่มเพื่อน</button></div></div>`).join('');
  const off = !Net.joined ? `<p class="warnbox">ยังไม่ได้เชื่อมต่อเซิร์ฟเวอร์ ระบบเพื่อนต้องออนไลน์</p>` : '';
  this.setPanel(`${icon('person')} เพื่อน <small>${ids.length}/50 · ออนไลน์ ${Object.keys(Friends.where).length}</small>`, `${off}${reqs ? `<h4>คำขอเป็นเพื่อน</h4><div class="frlist">${reqs}</div>` : ''}<h4>รายชื่อเพื่อน</h4><div class="frlist">${rows}</div>${near ? `<h4>ผู้เล่นใกล้ตัว</h4><div class="frlist">${near}</div>` : ''}<div class="row"><button class="btn ghost" data-fr="poll:">รีเฟรชสถานะ</button></div>`);
  this.el.pbody.onclick = e => {
    const b = e.target.closest('[data-fr]'); if (!b) return; const [k, id] = b.dataset.fr.split(':'); Audio.sfx('ui');
    if (k === 'ok') Friends.answer(id, true); else if (k === 'no') Friends.answer(id, false);
    else if (k === 'go') Friends.goTo(id); else if (k === 'pt') Friends.party(id);
    else if (k === 'rm') { if (!b.dataset.armed) { b.dataset.armed = 1; b.textContent = 'ยืนยันลบ'; return; } Friends.remove(id); }
    else if (k === 'add') { const p = Remote.map.get(id); if (p) Friends.request(p); }
    else if (k === 'poll') { Friends.poll(); }
  };
};
