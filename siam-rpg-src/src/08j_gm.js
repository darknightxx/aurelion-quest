/* ============================================================
   GM (game master): Google sign-in verified by the database rules,
   announcements, mute / kick, chat and report moderation, self tools.
   GM status is decided by the server (gm_emails list in the database);
   nothing secret lives in this public code.
   ============================================================ */
FirebaseBackend.prototype.googleSignIn = async function () {
  const Au = this.Au, p = new Au.GoogleAuthProvider(); p.setCustomParameters({ prompt: 'select_account' });
  const r = await Au.signInWithPopup(this.auth, p); this.uid = r.user.uid; this.email = r.user.email || ''; return r.user;
};
FirebaseBackend.prototype.signOutToAnon = async function () {
  await this.Au.signOut(this.auth); const c = await this.Au.signInAnonymously(this.auth); this.uid = c.user.uid; this.email = '';
};
FirebaseBackend.prototype.isGM = async function () { if (!this.email) return false; try { await this.once('gmcheck'); return true; } catch (e) { return false; } };
// local test backend: ?net=local&gm=1 simulates a GM account
LocalBackend.prototype.googleSignIn = async function () { if (!/[?&]gm=1/.test(location.search)) throw Object.assign(new Error('not gm'), { code: 'local/not-gm' }); this.email = 'gm@local'; return { uid: this.uid }; };
LocalBackend.prototype.signOutToAnon = async function () { this.email = ''; };
LocalBackend.prototype.isGM = async function () { return this.email === 'gm@local'; };

Object.assign(Net, {
  gm: false, kickedUntil: 0, mutedUntil: 0, lastAnn: 0,
  async gmLogin() {
    if (!this.online()) { UI.toast('ยังไม่ได้เชื่อมต่อเซิร์ฟเวอร์', 'warn'); return; }
    const wasJoined = this.joined, ch = this.ch;
    try {
      await this.be.googleSignIn();
    } catch (e) {
      const c = (e && e.code) || '';
      UI.toast(c.includes('popup-blocked') ? 'เบราว์เซอร์บล็อกหน้าต่างล็อกอิน กรุณาอนุญาตป๊อปอัปแล้วลองใหม่' : c.includes('popup-closed') || c.includes('cancelled') ? 'ยกเลิกการล็อกอิน' : c.includes('unauthorized-domain') ? 'โดเมนนี้ยังไม่ได้รับอนุญาตใน Firebase' : c.includes('operation-not-allowed') ? 'ยังไม่ได้เปิดล็อกอินด้วย Google ใน Firebase' : 'ล็อกอินไม่สำเร็จ', 'warn');
      return;
    }
    const ok = await this.be.isGM();
    if (!ok) { UI.toast('บัญชีนี้ไม่มีสิทธิ์ GM', 'warn'); await this.be.signOutToAnon(); }
    if (wasJoined) this.leave(true);
    this.uid = this.be.uid; this.gm = ok;
    if (Game.started) await this.join(ch || undefined);
    UI.gmUI(); if (ok) { UI.toast('เข้าสู่โหมด GM แล้ว', 'rare'); Audio.sfx('level'); }
    if (UI.panelOpen === 'settings') UI.renderPanel();
  },
  async gmLogout() {
    if (!this.gm) return; const ch = this.ch, wasJoined = this.joined;
    if (wasJoined) this.leave(true);
    await this.be.signOutToAnon(); this.uid = this.be.uid; this.gm = false; Save.d && (Save.d.gmGod = false, Save.d.gmFast = false); Player.recalc && Save.d && Player.recalc();
    if (Game.started) await this.join(ch || undefined);
    UI.gmUI(); UI.toast('ออกจากโหมด GM แล้ว', 'info'); if (UI.panelOpen) UI.renderPanel();
  },
  watchMod() {
    if (this.modUnsub) this.modUnsub.forEach(f => f());
    this.modUnsub = [
      this.be.watchValue('announce', v => this.onAnnounce(v)),
      this.be.watchValue(`mod/mutes/${this.uid}`, v => { this.mutedUntil = typeof v === 'number' ? v : 0; }),
      this.be.watchValue(`mod/kicks/${this.uid}`, v => { if (typeof v === 'number' && this.be.now() - v < 600000 && v > this.kickedUntil - 600000) { this.kickedUntil = v + 600000; if (this.joined) { this.leave(); UI.banner('ถูกเชิญออกจากเซิร์ฟเวอร์', 'fizzle'); UI.toast('GM เชิญคุณออกจากเซิร์ฟเวอร์ออนไลน์ 10 นาที ยังเล่นคนเดียวต่อได้', 'warn'); } } })
    ];
  },
  onAnnounce(v) {
    if (!v || !v.m || !v.t || v.t <= this.lastAnn) return; this.lastAnn = v.t;
    if (this.be.now() - v.t > 5 * 60e3) return;
    UI.announce(String(v.m).slice(0, 200), ChatFilter.name(v.n || 'GM'));
    this.chat.push({ k: 'ann' + v.t, u: '', n: 'ประกาศจาก GM', m: String(v.m).slice(0, 200), t: v.t, kind: 'sys', gm: true }); UI.chatLog();
  },
  /* ---- GM actions (the database rules reject these for non-GMs) ---- */
  async announce(text) { const t = String(text || '').trim().slice(0, 200); if (!t) return; await this.be.set('announce', { m: t, n: Save.d ? Save.d.name.slice(0, 16) : 'GM', t: this.be.ts() }); UI.toast('ส่งประกาศถึงผู้เล่นทุกคนแล้ว', 'quest'); },
  async mutePlayer(uid, min) { await this.be.set(`mod/mutes/${uid}`, this.be.now() + min * 60e3); UI.toast(`ปิดแชตผู้เล่น ${min} นาทีแล้ว`, 'quest'); },
  async unmutePlayer(uid) { await this.be.remove(`mod/mutes/${uid}`); UI.toast('เปิดแชตให้ผู้เล่นแล้ว', 'quest'); },
  async kickPlayer(uid) { await this.be.set(`mod/kicks/${uid}`, this.be.ts()); await this.be.remove(`ch/${this.ch}/players/${uid}`); Remote.remove(uid); UI.toast('เชิญผู้เล่นออกจากเซิร์ฟเวอร์แล้ว (10 นาที)', 'quest'); },
  async deleteMsg(k) { await this.be.remove(`ch/${this.ch}/chat/${k}`); this.chat = this.chat.filter(c => c.k !== k); UI.chatLog(); },
  async reports() { const v = await this.be.once('reports'); return v ? Object.entries(v).map(([k, r]) => Object.assign({ k }, r)).sort((a, b) => (b.t || 0) - (a.t || 0)) : []; },
  async deleteReport(k) { await this.be.remove(`reports/${k}`); },
  teleportTo(p) { if (!p) return; Game.teleport(p.st.x + 1.5, p.st.z, 'ไปหา ' + p.name); }
});

/* guard normal actions against server-side mute / kick */
{
  const sendChat0 = Net.sendChat.bind(Net), join0 = Net.join.bind(Net);
  Net.sendChat = function (text, kind) {
    if (this.mutedUntil && this.be && this.be.now() < this.mutedUntil) { UI.toast(`คุณถูก GM ปิดแชตอีก ${Math.ceil((this.mutedUntil - this.be.now()) / 60000)} นาที`, 'warn'); return false; }
    return sendChat0(text, kind);
  };
  Net.join = async function (ch) {
    if (this.kickedUntil && this.be && this.be.now() < this.kickedUntil) { UI.toast(`เข้าเซิร์ฟเวอร์ได้อีกครั้งใน ${Math.ceil((this.kickedUntil - this.be.now()) / 60000)} นาที`, 'warn'); return; }
    return join0(ch);
  };
}

Object.assign(UI, {
  gmUI() {
    const b = document.getElementById('gmpill'); if (b) b.hidden = !Net.gm;
  },
  announce(text, by) {
    const el = document.getElementById('annbar'); if (!el) return;
    el.innerHTML = `<b>📢 ประกาศจาก GM ${esc(by)}</b><span>${esc(text)}</span>`; el.hidden = false; el.classList.remove('out'); void el.offsetWidth; el.classList.add('in');
    Audio.sfx('quest'); clearTimeout(this._annT); this._annT = setTimeout(() => { el.classList.add('out'); setTimeout(() => { el.hidden = true; }, 500); }, 9000);
  },
  gmSettingsHtml() {
    if (!Net.online()) return '<p class="muted">ต้องเชื่อมต่อเซิร์ฟเวอร์ออนไลน์ก่อน</p>';
    if (Net.gm) return `<p class="gmok"><i class="gmtag">GM</i> คุณอยู่ในโหมดผู้ดูแลเกม</p><div class="row"><button class="btn" id="gmopen">เปิดเครื่องมือ GM</button><button class="btn ghost" id="gmout">ออกจากโหมด GM</button></div>`;
    return `<p class="muted">สำหรับผู้ดูแลเกมเท่านั้น ล็อกอินด้วยบัญชี Google ที่ได้รับสิทธิ์ GM (ผู้เล่นทั่วไปไม่ต้องใช้)</p><button class="btn ghost" id="gmin">ล็อกอิน GM ด้วย Google</button>`;
  },
  gmSettingsBind() {
    const a = $('#gmin'), o = $('#gmout'), g = $('#gmopen');
    if (a) a.onclick = () => { a.disabled = true; a.textContent = 'กำลังล็อกอิน…'; Net.gmLogin().finally(() => { const s = $('#gmset'); if (s) { s.innerHTML = UI.gmSettingsHtml(); UI.gmSettingsBind(); } }); };
    if (o) o.onclick = () => Net.gmLogout().then(() => { const s = $('#gmset'); if (s) { s.innerHTML = UI.gmSettingsHtml(); UI.gmSettingsBind(); } });
    if (g) g.onclick = () => this.openPanel('gm');
  },
  async pGM(o) {
    if (!Net.gm) { this.setPanel('GM', '<p class="muted">ต้องเข้าสู่โหมด GM ก่อน (ตั้งค่า → ผู้ดูแลเกม)</p>'); return; }
    const tab = o.tab || 'players'; this.panelOpt.tab = tab;
    const tabs = [['players', 'ผู้เล่น'], ['ann', 'ประกาศ'], ['chat', 'แชต'], ['reports', 'รายงาน'], ['tools', 'เครื่องมือ']];
    const head = `<div class="tabs" role="tablist">${tabs.map(([k, l]) => `<button class="tab ${k === tab ? 'on' : ''}" data-gt="${k}">${l}</button>`).join('')}</div>`;
    let body = '';
    const now = Net.be.now();
    if (tab === 'players') {
      const ps = [...Remote.map.values()];
      body = `<p class="muted">ผู้เล่นใน CH${Net.ch} ตอนนี้ ${ps.length + 1} คน (รวมคุณ)</p><ul class="gmlist">${ps.map(p => `<li><div><b>${p.st.gm ? '<i class="gmtag">GM</i> ' : ''}${esc(p.name)}</b><small>${(CLASSES[p.st.c] || {}).name || ''} · Lv.${p.st.lv} · ${p.zone === 'dungeon' ? 'ดันเจี้ยน' : 'ทวีป'}</small></div><div class="gmact"><button class="btn sm" data-ga="tp:${p.uid}">ไปหา</button><button class="btn sm ghost" data-ga="m10:${p.uid}">ปิดแชต 10 น.</button><button class="btn sm ghost" data-ga="m60:${p.uid}">60 น.</button><button class="btn sm ghost" data-ga="um:${p.uid}">เปิดแชต</button><button class="btn sm ghost danger" data-ga="kick:${p.uid}">เชิญออก</button></div></li>`).join('') || '<li class="emptyrow">ยังไม่มีผู้เล่นคนอื่นในเซิร์ฟเวอร์นี้</li>'}</ul>`;
    } else if (tab === 'ann') {
      body = `<p class="muted">ข้อความจะขึ้นเป็นแถบประกาศกลางจอของผู้เล่นทุกคนทุกเซิร์ฟเวอร์ และอยู่ในช่องแชต</p><textarea id="gmann" rows="3" maxlength="200" placeholder="เช่น คืนนี้ 2 ทุ่มมีกิจกรรมล่าบอสพร้อมกัน!"></textarea><div class="row"><button class="btn" id="gmannsend">ส่งประกาศ</button></div>`;
    } else if (tab === 'chat') {
      const rows = Net.chat.filter(c => c.kind !== 'sys').slice(-40).reverse();
      body = `<ul class="gmlist chatmod">${rows.map(c => `<li><div><b>${c.gm ? '<i class="gmtag">GM</i> ' : ''}${esc(c.n)}</b><small>${esc(c.m)}</small></div><div class="gmact"><button class="btn sm ghost danger" data-ga="del:${c.k}">ลบ</button>${c.u && c.u !== Net.uid ? `<button class="btn sm ghost" data-ga="m10:${c.u}">ปิดแชต 10 น.</button>` : ''}</div></li>`).join('') || '<li class="emptyrow">ยังไม่มีข้อความ</li>'}</ul>`;
    } else if (tab === 'reports') {
      this.setPanel(`<i class="gmtag">GM</i> เครื่องมือผู้ดูแล`, head + '<p class="muted">กำลังโหลดรายงาน…</p>', true); this.gmBind();
      let reps = []; try { reps = await Net.reports(); } catch (e) { }
      if (UI.panelOpen !== 'gm' || this.panelOpt.tab !== 'reports') return;
      body = `<ul class="gmlist">${reps.slice(0, 40).map(r => `<li><div><b>${esc(ChatFilter.name(r.tn || '?'))}</b><small>${r.msg ? '“' + esc(r.msg) + '” · ' : ''}${r.t ? new Date(r.t).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' }) : ''} · CH${r.ch || '-'}</small></div><div class="gmact"><button class="btn sm ghost" data-ga="m60:${r.target}">ปิดแชต 60 น.</button><button class="btn sm ghost danger" data-ga="kick:${r.target}">เชิญออก</button><button class="btn sm ghost" data-ga="rdel:${r.k}">ลบรายงาน</button></div></li>`).join('') || '<li class="emptyrow">ไม่มีรายงาน</li>'}</ul>`;
    } else if (tab === 'tools') {
      const S = Save.d;
      body = `<p class="muted">มีผลกับตัวละครของคุณเท่านั้น</p><div class="gmtools">
        <button class="btn" data-ga="heal">ฟื้น HP/MP เต็ม</button><button class="btn" data-ga="lvl">เลเวล +1</button>
        <button class="btn" data-ga="coin">เหรียญ +1,000</button><button class="btn" data-ga="gem">เพชร +1,000</button>
        <button class="btn" data-ga="unlock">ปลดล็อกทุกพื้นที่</button><button class="btn" data-ga="mount">ได้สัตว์ขี่ครบ</button>
        <label class="chk"><input type="checkbox" id="gmgod" ${S.gmGod ? 'checked' : ''}> อมตะ (ไม่โดนดาเมจ)</label>
        <label class="chk"><input type="checkbox" id="gmfast" ${S.gmFast ? 'checked' : ''}> เดินเร็ว ×2</label></div>`;
    }
    this.setPanel(`<i class="gmtag">GM</i> เครื่องมือผู้ดูแล`, head + body, true);
    this.gmBind();
  },
  gmBind() {
    const S = Save.d;
    const ann = $('#gmannsend'); if (ann) ann.onclick = async () => { const t = $('#gmann').value; if (!t.trim()) return; try { await Net.announce(t); $('#gmann').value = ''; } catch (e) { UI.toast('ส่งประกาศไม่สำเร็จ (สิทธิ์ GM ไม่ถูกต้อง)', 'warn'); } };
    const god = $('#gmgod'); if (god) god.onchange = () => { S.gmGod = god.checked; };
    const fast = $('#gmfast'); if (fast) fast.onchange = () => { S.gmFast = fast.checked; Player.recalc(); };
    this.el.pbody.onclick = async e => {
      const t = e.target.closest('[data-gt]'); if (t) { this.panelOpt.tab = t.dataset.gt; return this.renderPanel(); }
      const b = e.target.closest('[data-ga]'); if (!b) return;
      const [k, id] = b.dataset.ga.split(':');
      try {
        if (k === 'tp') { const p = Remote.map.get(id); this.closePanel(); Net.teleportTo(p); return; }
        if (k === 'm10') await Net.mutePlayer(id, 10); else if (k === 'm60') await Net.mutePlayer(id, 60); else if (k === 'um') await Net.unmutePlayer(id);
        else if (k === 'kick') { if (!b.dataset.armed) { b.dataset.armed = 1; b.textContent = 'ยืนยันเชิญออก?'; return; } await Net.kickPlayer(id); }
        else if (k === 'del') await Net.deleteMsg(id); else if (k === 'rdel') await Net.deleteReport(id);
        else if (k === 'heal') { Player.recalc(); S.hp = Player.stats.maxhp; S.mp = Player.stats.maxmp; UI.toast('ฟื้นเต็มแล้ว', 'quest'); }
        else if (k === 'lvl') Game.gainXP(Math.max(1, xpNeed(S.level) - S.xp));
        else if (k === 'coin') Game.gainCoins(1000); else if (k === 'gem') Gems.add(1000, 'เครื่องมือ GM');
        else if (k === 'unlock') { S.flags.bridge = true; S.flags.gate = true; for (const w of WARPS) S.warps[w.id] = true; Game.applyUnlocks(); UI.toast('ปลดล็อกทุกพื้นที่และจุดวาร์ปแล้ว', 'quest'); }
        else if (k === 'mount') { for (const m of MOUNT_ORDER) Mounts.data().own[m] = Mounts.data().own[m] || 1; Save.write(); UI.mountBtns(); UI.toast(`ได้สัตว์ขี่ครบ ${MOUNT_ORDER.length} ตัวแล้ว`, 'quest'); }
      } catch (err) { UI.toast('ทำรายการไม่สำเร็จ (สิทธิ์ GM ไม่ถูกต้อง)', 'warn'); return; }
      this.renderPanel();
    };
  }
});

