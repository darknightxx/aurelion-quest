
/* ============================================================
   Mobile-MMO HUD layout (default): portrait + thin bars top-left,
   currencies top-centre, icon row top-right, gold quest card and
   side icon column on the right, big attack button with target /
   AUTO / mount buttons bottom-right, wide quick-slot row bottom-
   centre, level · combat power · EXP % · clock bottom-left.
   Settings → รูปแบบ HUD switches back to the classic layout.
   ============================================================ */
ICONS.bell = '<path d="M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9.5 19a2.5 2.5 0 0 0 5 0" stroke="currentColor" stroke-width="1.8" fill="none"/>';
ICONS.shop = '<path d="M4 9l1.5-5h13L20 9M4 9h16v2a2.5 2.5 0 0 1-5 0 2.5 2.5 0 0 1-5 0 2.5 2.5 0 0 1-5 0zM5 13v7h14v-7" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linejoin="round"/>';
ICONS.menu = '<path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>';
ICONS.target = '<circle cx="12" cy="12" r="7.5" stroke="currentColor" stroke-width="1.8" fill="none"/><circle cx="12" cy="12" r="2.5" fill="currentColor"/><path d="M12 1.5v4M12 18.5v4M1.5 12h4M18.5 12h4" stroke="currentColor" stroke-width="1.8"/>';
ICONS.auto = '<path d="M20 12a8 8 0 1 1-2.3-5.7" stroke="currentColor" stroke-width="1.8" fill="none"/><path d="M18 2.5v4.2h-4.2" stroke="currentColor" stroke-width="1.8" fill="none"/><text x="12" y="15.2" font-size="7.5" font-weight="700" text-anchor="middle" fill="currentColor" font-family="sans-serif">AUTO</text>';
ICONS.claw = '<path d="M5 19C9 13 14 8 20 4M7 21c4-5 8-9 14-12M3 16c4-5 8-9 13-12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>';
ICONS.chart = '<path d="M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>';

/* ---- auto battle (AUTO button) ---- */
const AutoBattle = {
  on: false, t: 0,
  toggle(v) { this.on = v === undefined ? !this.on : v; UI.toast(this.on ? 'เปิดต่อสู้อัตโนมัติ (AUTO)' : 'ปิดต่อสู้อัตโนมัติ', this.on ? 'quest' : 'info'); Audio.sfx('ui'); HUD2.sync(); },
  update(dt) {
    if (!this.on) return; this.t -= dt; if (this.t > 0) return; this.t = .35;
    const P = Player, S = Save.d; if (P.dead || Game.paused || AutoHunt.on || Nav.active || Mounts.riding() && Seats && Seats.driver) return;
    if (S.hp < P.stats.maxhp * .4 && (S.inv.hp_s || S.inv.hp_l) && !(Skills.potCD > 0)) Game.useItem(S.inv.hp_s ? 'hp_s' : 'hp_l', true);
    if (S.mp < P.stats.maxmp * .2 && S.inv.mp_s && !(Skills.potCD > 0)) Game.useItem('mp_s', true);
    let t = P.target && P.target.kind === 'mon' && !P.target.ref.dead && P.target.ref.zone === P.zone ? P.target.ref : null;
    if (!t) { let bd = 18 * 18; for (const m of Monsters.list) { if (m.dead || m.zone !== P.zone || m.d.boss && !m.engaged) continue; const d = dist2(m.x, m.z, P.x, P.z); if (d < bd) { bd = d; t = m; } } if (t) { P.target = { kind: 'mon', ref: t }; UI.setTarget(t); } else return; }
    if (Input.moveVec().x || Input.moveVec().z) return;
    const d = Math.sqrt(dist2(t.x, t.z, P.x, P.z)); const ids = Cls.of(S).skills;
    if (!Player.getRig().busy && d < 7) for (let i = 0; i < ids.length; i++) { const sk = SKILLS[ids[i]]; if (!sk || sk.quiz || Skills.cd[i] > 0 || S.mp < SkillLv.mp(ids[i])) continue; if (sk.type === 'combo' && d > sk.r + .8) continue; Skills.use(i); break; }
    if (!P.moveTo && !Player.getRig().busy) Game.attackNearest();
  }
};

const HUD2 = {
  on() { return Settings.d.hud !== 'classic'; },
  built: false,
  build() {
    if (this.built) return; this.built = true; const hud = $('#hud');
    const mk = (id, html) => { const d = document.createElement('div'); d.id = id; d.className = 'h2'; d.innerHTML = html; hud.appendChild(d); return d; };
    const ib = (p, ic, label, extra = '') => `<button data-p="${p}" title="${label}" aria-label="${label}">${icon(ic)}${extra}</button>`;
    mk('h2cur', '');
    mk('h2top', ib('news', 'bell', 'ประกาศ') + ib('season', 'pass', 'Season Pass') + ib('gemshop', 'shop', 'ร้านเพชร') + ib('inv', 'bag', 'กระเป๋า (I)', '<small id="h2bag">0%</small>') + ib('menu', 'menu', 'เมนู'));
    mk('h2right', `<div id="h2quest"></div><div id="h2side">${ib('skills', 'star', 'สกิล (P)')}${ib('char', 'person', 'ตัวละคร (C)')}${ib('quest', 'book', 'เควส (L)')}${ib('map', 'map', 'แผนที่ (M)')}${ib('pets', 'paw', 'สัตว์เลี้ยง (U)')}${ib('ach', 'chart', 'ความสำเร็จ (K)')}</div>`);
    mk('h2left', ib('friends', 'person', 'เพื่อน (Y)', '<b class="fbadge" hidden>0</b>') + ib('wardrobe', 'outfit', 'ตู้เสื้อผ้า (O)') + ib('jobs', 'trophy', 'สายอาชีพ (J)'));
    mk('h2bl', `<b id="h2lv">1</b><div><span id="h2cp">⚔ 0</span><span><em id="h2xp">EXP 0.00%</em> · <em id="h2clock">00:00</em></span></div>`);
    mk('h2act', `<button class="h2big" data-x="atk" aria-label="โจมตี (Space)">${icon('claw')}</button><button class="h2c c1" data-x="tgt" aria-label="เปลี่ยนเป้าหมาย (Tab)">${icon('target')}</button><button class="h2c c2" data-x="auto" aria-label="ต่อสู้อัตโนมัติ">${icon('auto')}</button><button class="h2c c3" data-x="ride" aria-label="ขี่สัตว์ (V)">${icon('ride')}</button><button class="h2c c4" data-x="loot" aria-label="เก็บของรอบตัว (Z)">${icon('bag')}</button>`);
    hud.addEventListener('click', e => {
      const b = e.target.closest('.h2 [data-p]'); if (b) { Audio.init(); Audio.sfx('ui'); const p = b.dataset.p; if (WM.isOpen(p)) WM.close(p); else UI.openPanel(p); return; }
      const x = e.target.closest('.h2 [data-x]'); if (!x) return; Audio.init(); const k = x.dataset.x;
      if (k === 'atk') Game.attackNearest(); else if (k === 'tgt') Game.cycleTarget(); else if (k === 'auto') AutoBattle.toggle(); else if (k === 'ride') Mounts.ride(); else if (k === 'loot') Loot.pickAround(6);
    });
    this.apply();
  },
  apply() {
    const on = this.on(); document.body.classList.toggle('hud2', on); if (!this.built) return;
    const coin = $('#coinbox'), gem = $('#gembox'), tr = $('#tracker');
    if (on) { $('#h2cur').append(coin, gem); $('#h2quest').append(tr); }
    else { const bf = $('#buffs'); bf.parentNode.insertBefore(coin, bf); bf.parentNode.insertBefore(gem, bf); $('#mapcol').append(tr); }
  },
  sync() {
    if (!this.built || !Save.d) return; const S = Save.d, P = Player;
    const set = (id, v) => { const e = document.getElementById(id); if (e && e.textContent !== v) e.textContent = v; };
    set('h2lv', String(S.level)); const st = P.stats || {}; const cp = Math.round((st.atk || 0) * 12 + (st.def || 0) * 9 + (st.maxhp || 0) * 1.4 + (st.maxmp || 0) * .7 + S.level * 25);
    set('h2cp', '⚔ ' + fmt(cp)); set('h2xp', 'EXP ' + (S.xp / xpNeed(S.level) * 100).toFixed(2) + '%');
    const d = new Date(); set('h2clock', String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'));
    set('h2bag', Math.min(100, Object.keys(S.inv).length) + '%');
    const a = document.querySelector('#h2act [data-x="auto"]'); if (a) a.classList.toggle('on', AutoBattle.on);
    const r = document.querySelector('#h2act [data-x="ride"]'); if (r) { r.hidden = !Mounts.cur(); r.classList.toggle('on', Mounts.riding()); }
    const l = document.querySelector('#h2act [data-x="loot"]'); if (l) l.classList.toggle('on', Loot.list.some(x => x.zone === P.zone && dist2(x.x, x.z, P.x, P.z) < 36));
    // mirror notification dots from the classic menu buttons
    for (const b of document.querySelectorAll('.h2 [data-p]')) { const o = document.querySelector(`#menubtns [data-p="${b.dataset.p}"]`); b.classList.toggle('dot', !!(o && o.classList.contains('dot')) || (b.dataset.p === 'menu' && Friends.reqs.length > 0)); }
    const fb = document.querySelector('#h2left .fbadge'); if (fb) { const n = Friends.reqs.length; fb.textContent = n; fb.hidden = !n; }
  }
};
{
  const oi = UI.init.bind(UI); UI.init = function () { oi(); try { HUD2.build(); } catch (e) { console.error('hud2', e); } };
  const ou = Game.update.bind(Game); Game.update = function (dt) { ou(dt); if (!this.started || !Save.d) return; AutoBattle.update(dt); this._h2T = (this._h2T || 0) + dt; if (this._h2T > .5) { this._h2T = 0; HUD2.sync(); } };
  const ol = Settings.load.bind(Settings); Settings.load = function () { ol(); HUD2.apply(); };
  const os = UI.pSettings.bind(UI);
  UI.pSettings = function () {
    os(); const b = this.el.pbody, fs = document.createElement('fieldset');
    fs.innerHTML = `<legend>รูปแบบ HUD</legend>${[['mmo', 'แบบเกม MMO มือถือ (ปุ่มโจมตีใหญ่ขวาล่าง, AUTO, ไอคอนเมนูบนขวา)'], ['classic', 'แบบคลาสสิก (แถบสกิลกลางจอ, เมนูใต้แผนที่)']].map(([v, l]) => `<label class="radio"><input type="radio" name="hudl" value="${v}" ${(Settings.d.hud || 'mmo') === v ? 'checked' : ''}> ${l}</label>`).join('')}`;
    const first = b.querySelector('fieldset'); b.insertBefore(fs, first ? first.nextSibling : null);
    fs.querySelectorAll('[name=hudl]').forEach(r => r.onchange = () => { Settings.d.hud = r.value; Settings.save(); HUD2.apply(); });
  };
  // keyboard: Tab already cycles targets; add A? no — use Backquote for AUTO
  document.addEventListener('keydown', e => { if (e.code === 'Backquote' && Game.started && !e.repeat && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) AutoBattle.toggle(); });
  // manual moving with the keyboard / joystick doesn't fight AUTO, but death or teleport turns it off
  const od = Game.die.bind(Game); Game.die = function () { AutoBattle.on = false; return od(); };
}
/* bell → news window */
UI.extraPanels = UI.extraPanels || {}; UI.extraPanels.news = 'pNews';
UI.pNews = function () {
  const ann = ANNOUNCE.slice(0, 8).map(a => `<li class="nw"><i class="ntag">${esc(a.tag || 'ข่าว')}</i><b>${esc(a.title)}</b><p>${esc(a.body || '')}</p></li>`).join('');
  const pn = PATCH.slice(0, 10).map(p => `<li class="nw pn"><b>${icon(p.ic || 'star')} ${esc(p.t)}</b><p>${esc(p.x || '')}</p><small>${p.d || ''}</small></li>`).join('');
  this.setPanel(`${icon('bell')} ประกาศและอัปเดต`, `<ul class="newslist">${ann}</ul><h4>บันทึกอัปเดตล่าสุด</h4><ul class="newslist">${pn}</ul>`, true);
};
