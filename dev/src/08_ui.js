/* ============================================================
   UI: HUD, panels, quiz, dialog, shop, map, summary, title
   ============================================================ */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = n => Math.floor(n).toLocaleString('en-US');

const ICONS = {
  slash: '<path d="M4 20 20 4M7 21l-4-4M14 6l4 4" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round"/>',
  heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="currentColor"/>',
  star: '<path d="m12 3 2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.5 6.7 19.4l1.2-6L3.4 9.3l6-.7z" fill="currentColor"/>',
  star4: '<path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z" fill="currentColor"/>',
  shield: '<path d="M12 3 4 6v6c0 4.5 3.4 7.8 8 9 4.6-1.2 8-4.5 8-9V6z" fill="currentColor"/>',
  guard: '<path d="M12 3 4 6v6c0 4.5 3.4 7.8 8 9 4.6-1.2 8-4.5 8-9V6z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 12l3 3 5-6" stroke="currentColor" stroke-width="2" fill="none"/>',
  sword: '<path d="M14 4h6v6L9 21l-3-3zM5 15l4 4M3 21l3-3" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/>',
  sword2: '<path d="M14 4h6v6L9 21l-3-3zM5 15l4 4M3 21l3-3" stroke="currentColor" stroke-width="2.4" fill="none"/><circle cx="17" cy="7" r="1.5" fill="currentColor"/>',
  sword3: '<path d="M15 3h6v6L9 21l-3-3z" fill="currentColor" opacity=".5"/><path d="M14 4h6v6L9 21l-3-3zM5 15l4 4" stroke="currentColor" stroke-width="2" fill="none"/>',
  dagger: '<path d="M16 3l5 5-9 9-4-4zM8 13l-4 4 3 3 4-4" stroke="currentColor" stroke-width="2" fill="none"/>',
  dash: '<path d="M3 8h9M2 12h12M3 16h9M15 6l6 6-6 6" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round"/>',
  burst: '<path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M19 5l-4 4M9 15l-4 4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
  arrow: '<path d="M3 21 18 6M13 5h6v6M3 21l1-5M3 21l5-1" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round"/>',
  fan: '<path d="M4 20 12 4M4 20l12-11M4 20l16-6M4 20l4-16" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/>',
  rain: '<path d="M6 3v6M12 5v6M18 3v6M5 13l-2 6M11 14l-2 6M17 13l-2 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
  fire: '<path d="M12 22c4 0 7-2.7 7-6.5 0-3.4-2.4-5.5-3.6-8.5-1 2.3-2.4 3.4-3.4 3.4.4-3-1-6.4-3.5-8.4.3 3.3-4.5 6.2-4.5 11 0 4 3.4 9 8 9z" fill="currentColor"/>',
  snow: '<path d="M12 2v20M3.3 7l17.4 10M20.7 7 3.3 17M9 4l3 3 3-3M9 20l3-3 3 3" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>',
  meteor: '<circle cx="15" cy="15" r="5" fill="currentColor"/><path d="M3 3l8 8M7 3l6 6M3 7l6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  sun: '<circle cx="12" cy="12" r="4.5" fill="currentColor"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  potR: '<path d="M9 3h6M10 3v5l-4 6a5 5 0 0 0 4 8h4a5 5 0 0 0 4-8l-4-6V3" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M7 15h10a5 5 0 0 1-3.5 6h-3A5 5 0 0 1 7 15z" fill="#e0533d"/>',
  potR2: '<path d="M9 3h6M10 3v4l-5 6a6 6 0 0 0 5 9h4a6 6 0 0 0 5-9l-5-6V3" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M5.5 13h13a6 6 0 0 1-4.5 9h-4a6 6 0 0 1-4.5-9z" fill="#e0533d"/>',
  potB: '<path d="M9 3h6M10 3v5l-4 6a5 5 0 0 0 4 8h4a5 5 0 0 0 4-8l-4-6V3" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M7 15h10a5 5 0 0 1-3.5 6h-3A5 5 0 0 1 7 15z" fill="#4d8fe0"/>',
  scroll: '<path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M5 4a2 2 0 0 0 0 4h2M9 9h7M9 13h7" stroke="currentColor" stroke-width="1.8" fill="none"/>',
  armor: '<path d="M8 3 4 6l2 4 2-1v12h8V9l2 1 2-4-4-3-2 2h-4z" fill="currentColor"/>',
  armor2: '<path d="M8 3 4 6l2 4 2-1v12h8V9l2 1 2-4-4-3-2 2h-4z" fill="currentColor"/><path d="M12 9v9M9 13h6" stroke="#1d1712" stroke-width="1.6"/>',
  cloak: '<path d="M12 3c-3 0-5 2-5 4L4 21h16L17 7c0-2-2-4-5-4z" fill="currentColor"/>',
  ring: '<circle cx="12" cy="14" r="6" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M9 6l3-3 3 3-3 3z" fill="#7ab8ff"/>',
  boots: '<path d="M7 3h6v10l6 3v4H5V13z" fill="currentColor"/>',
  gem: '<path d="M6 4h12l4 6-10 11L2 10z" fill="currentColor"/><path d="M2 10h20M8 4l4 6 4-6M12 10v11" stroke="#1d1712" stroke-width="1" fill="none" opacity=".5"/>',
  jelly: '<path d="M4 18c0-6 3-11 8-11s8 5 8 11c-3 1-13 1-16 0z" fill="#79d65a"/><circle cx="10" cy="13" r="1" fill="#1d2b16"/><circle cx="14" cy="13" r="1" fill="#1d2b16"/>',
  shroom: '<path d="M3 12a9 7 0 0 1 18 0z" fill="#d9483a"/><circle cx="8" cy="9" r="1.4" fill="#fff"/><circle cx="14" cy="8" r="1.4" fill="#fff"/><path d="M9 12h6v7a3 3 0 0 1-6 0z" fill="#f1e3c6"/>',
  fang: '<path d="M8 3h8l-3 18h-2z" fill="#f1ead8"/>',
  totem: '<path d="M9 3h6v18H9z" fill="#8a6240"/><circle cx="12" cy="7" r="2.2" fill="#e3c37a"/><path d="M6 12h12" stroke="#d4483b" stroke-width="2.4"/>',
  bone: '<path d="M7 7l10 10" stroke="#f1ead8" stroke-width="3.4" stroke-linecap="round"/><circle cx="6" cy="8" r="2" fill="#f1ead8"/><circle cx="8" cy="6" r="2" fill="#f1ead8"/><circle cx="16" cy="18" r="2" fill="#f1ead8"/><circle cx="18" cy="16" r="2" fill="#f1ead8"/>',
  straw: '<ellipse cx="12" cy="15" rx="10" ry="3.4" fill="#e3c37a"/><path d="M7 15c0-5 2-8 5-8s5 3 5 8" fill="#ecd08e"/><path d="M7 13h10" stroke="#c8473a" stroke-width="2"/>',
  sheep: '<circle cx="12" cy="12" r="7" fill="#f7f4ec"/><circle cx="6" cy="9" r="3" fill="#f7f4ec"/><circle cx="18" cy="9" r="3" fill="#f7f4ec"/><circle cx="5" cy="15" r="2.4" fill="#b9a27c"/><circle cx="19" cy="15" r="2.4" fill="#b9a27c"/>',
  crown: '<path d="M3 18 4 7l5 5 3-6 3 6 5-5 1 11z" fill="#e2b54a"/><circle cx="12" cy="14" r="2" fill="#6fe0f0"/>',
  wing: '<path d="M12 12C9 6 5 4 2 5c1 3 1 7 4 9-1 2 0 4 2 5 2-2 4-4 4-7z" fill="#fff"/><path d="M12 12c3-6 7-8 10-7-1 3-1 7-4 9 1 2 0 4-2 5-2-2-4-4-4-7z" fill="#eef3fa"/>',
  wingB: '<path d="M12 12 2 6l2 5-2 4 4-1 2 4 4-6zM12 12l10-6-2 5 2 4-4-1-2 4-4-6z" fill="#5a3f84"/>',
  spark: '<path d="M12 3l1.5 5L18 9.5 13.5 11 12 16l-1.5-5L6 9.5 10.5 8zM18 14l.8 2.2 2.2.8-2.2.8L18 20l-.8-2.2-2.2-.8 2.2-.8zM6 15l.6 1.6L8 17l-1.4.6L6 19l-.6-1.4L4 17l1.4-.4z" fill="#4fb89a"/>',
  outfit: '<path d="M8 3 4 6l2 4 2-1v12h8V9l2 1 2-4-4-3a4 4 0 0 1-8 0z" fill="currentColor"/>',
  bag: '<path d="M6 8h12l1 13H5zM9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" stroke-width="2" fill="none"/>',
  person: '<circle cx="12" cy="7" r="4" fill="currentColor"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" fill="currentColor"/>',
  book: '<path d="M4 4h7a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4zM20 4h-7a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h7z" stroke="currentColor" stroke-width="2" fill="none"/>',
  map: '<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z M9 4v14M15 6v14" stroke="currentColor" stroke-width="1.8" fill="none"/>',
  trophy: '<path d="M7 4h10v5a5 5 0 0 1-10 0zM7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4M12 14v4M8 21h8" stroke="currentColor" stroke-width="2" fill="none"/>',
  gear: '<circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  help: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7V14M12 17.5v.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>',
  close: '<path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
  coin: '<circle cx="12" cy="12" r="8.5" fill="#e2b54a"/><circle cx="12" cy="12" r="5.5" fill="none" stroke="#a87a22" stroke-width="1.6"/>',
  potion: '<path d="M9 3h6M10 3v5l-4 6a5 5 0 0 0 4 8h4a5 5 0 0 0 4-8l-4-6V3" stroke="currentColor" stroke-width="1.6" fill="none"/>',
  hand: '<path d="M8 13V5a1.5 1.5 0 0 1 3 0v6V3.5a1.5 1.5 0 0 1 3 0V11V5a1.5 1.5 0 0 1 3 0v9c0 4-2.5 7-6.5 7-3 0-4.5-1.5-6-4l-2-3.5a1.5 1.5 0 0 1 2.5-1.6z" fill="currentColor"/>'
};
const icon = (k, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[k] || ICONS.star}</svg>`;

/* shop registry: [title, NPC button label, () => item list, can sell] — modules add their own shops */
const SHOPS = {
  items: ['ร้านไอเทมของพิป', 'ดูสินค้า', () => SHOP_ITEMS, 1],
  tailor: ['ร้านชุดแต่งตัวของมีนา', 'ดูชุดแต่งตัว', () => TAILOR_ITEMS, 0],
  temple: ['เครื่องรางกันผีของตาเผือก', 'ดูเครื่องรางกันผี', () => TEMPLE_SHOP, 1]
};
const UI = {
  panelOpen: null, quizOpen: false, summaryOpen: false, portraits: {}, bodies: {}, floats: [], plates: new Map(), toastQ: [], targetM: null,
  init() { ItemInfo.init(); RotScroll.init(); UI.netInit(); $('#mride').onclick = () => { Audio.init(); Mounts.ride(); }; $('#mskill').onclick = () => Mounts.useSkill();
    this.el = {
      hud: $('#hud'), hp: $('#hpbar'), mp: $('#mpbar'), xp: $('#xpbar'), hpT: $('#hptxt'), mpT: $('#mptxt'), lvl: $('#lvl'), name: $('#pname'), title: $('#ptitle'), coins: $('#coins'), buffs: $('#buffs'), por: $('#portrait'),
      mini: $('#minimap'), place: $('#place'), tracker: $('#tracker'), skills: $('#skillbar'), prompt: $('#prompt'), target: $('#target'), boss: $('#bossbar'),
      toasts: $('#toasts'), banner: $('#banner'), floats: $('#floats'), plates: $('#plates'), panel: $('#panel'), pbody: $('#pbody'), ptitle: $('#ptitlebar'),
      quiz: $('#quiz'), summary: $('#summary'), fade: $('#fade'), hurt: $('#hurt'), joy: $('#joy'), knob: $('#knob')
    };
    this.miniCtx = this.el.mini.getContext('2d');
    this.buildMapImage();
    this.buildSkillbar();
    this.initJoystick();
    $('#gembox').addEventListener('click', () => { Audio.sfx('ui'); this.openPanel('topup'); });
    $('#menubtns').addEventListener('click', e => { const b = e.target.closest('[data-p]'); if (b) { Audio.sfx('ui'); this.openPanel(b.dataset.p); } });
    $('#pclose').addEventListener('click', () => this.closePanel());
    this.el.panel.addEventListener('click', e => { if (e.target === this.el.panel) this.closePanel(); });
    this.el.prompt.addEventListener('click', () => Game.interactNearest());
    this.el.mini.addEventListener('click', () => this.openPanel('map'));
    $('#trackhead').addEventListener('click', () => this.el.tracker.classList.toggle('min'));
    $('#tracklist').addEventListener('click', e => { const li = e.target.closest('[data-q]'); if (li && Game.started && !Game.paused) { Audio.init(); Nav.goQuest(li.dataset.q); } });
    $('#tracklist').addEventListener('keydown', e => { if (e.key === 'Enter') { const li = e.target.closest('[data-q]'); if (li) Nav.goQuest(li.dataset.q); } });
    $('#navcancel').addEventListener('click', () => { Nav.stop(); AutoHunt.stop(); Player.target = null; });
  },
  fatal() { $('#loading').innerHTML = '<div class="fatal"><h2>เปิดเกมไม่ได้</h2><p>เบราว์เซอร์นี้ไม่รองรับ WebGL ลองเปิดด้วย Chrome, Edge, Safari หรือ Firefox รุ่นใหม่</p></div>'; },
  makePortraits(images) {
    for (const k of CLASS_ORDER) {
      const im = images[k]; if (!im) continue;
      const c = document.createElement('canvas'); c.width = 128; c.height = 128; const x = c.getContext('2d');
      const meta = SPRITE_META[k][0]; const topY = 320 - meta.head * 320; x.drawImage(im, 112 - 70, topY - 6, 140, 140, 0, 0, 128, 128);
      this.portraits[k] = c.toDataURL();
      const b = document.createElement('canvas'); b.width = 224; b.height = 320; b.getContext('2d').drawImage(im, 0, 0, 224, 320, 0, 0, 224, 320); this.bodies[k] = b.toDataURL();
      const w = document.createElement('canvas'); w.width = 224; w.height = 320; w.getContext('2d').drawImage(im, 7 * 224, 320, 224, 320, 0, 0, 224, 320); this.bodies[k + '_wave'] = w.toDataURL();
    }
  },
  /* ---------- Title ---------- */
  showTitle() {
    const t = $('#title'); t.hidden = false; $('#hud').hidden = true;
    const has = false, peek = null;
    let sel = 'adventurer';
    const cards = CLASS_ORDER.map(k => { const c = CLASSES[k]; return `<button class="ccard" data-k="${k}" id="cc-${k}" aria-pressed="false"><img src="${this.bodies[k] || ''}" alt=""><span class="cname">${c.name}</span><span class="cen">${c.en}</span></button>`; }).join('');
    $('#cgrid').innerHTML = cards;
    const info = () => {
      const c = CLASSES[sel]; const sk = c.skills.map(s => SKILLS[s]);
      $('#cinfo').innerHTML = `<h3>${c.name} <small>${c.en}</small></h3><p>${c.desc}</p>
      <dl class="cstats"><div><dt>HP</dt><dd>${c.hp}</dd></div><div><dt>MP</dt><dd>${c.mp}</dd></div><div><dt>ATK</dt><dd>${c.atk}</dd></div><div><dt>DEF</dt><dd>${c.def}</dd></div><div><dt>SPD</dt><dd>${c.spd}</dd></div><div><dt>ระยะ</dt><dd>${c.melee ? 'ประชิด' : 'ไกล'}</dd></div></dl>
      <p class="crole" style="--rc:${ROLES[c.role].col}">${icon(ROLES[c.role].icon)} <b>${ROLES[c.role].name}</b> <small>${ROLES[c.role].en}</small> · ${ROLES[c.role].desc}</p>
      <ul class="cskills">${c.skills.map((id, i) => { const s = SKILLS[id]; return `<li>${SkillArt.art(id, { cls: 'xs' })}<b>${SKILL_KEYS[i]}</b> ${s.name} <small>${s.cat}</small>${s.quiz ? ' <em>ตอบคำถาม ×2</em>' : ''}</li>`; }).join('')}</ul>`;
      document.querySelectorAll('.ccard').forEach(b => b.setAttribute('aria-pressed', b.dataset.k === sel));
    };
    $('#cgrid').onclick = e => { const b = e.target.closest('.ccard'); if (b) { sel = b.dataset.k; info(); Audio.init(); Audio.sfx('ui'); } };
    info();
    $('#cont').hidden = !has;
    if (has) $('#cont').innerHTML = `เล่นต่อ <small>${esc(peek.name)} · ${CLASSES[peek.cls].name} Lv.${peek.level}</small>`;
    $('#cont').onclick = () => { Audio.init(); if (Save.load()) Game.start(Save.d); };
    $('#startbtn').onclick = () => {
      Audio.init();
      const nm = ($('#pnameinput').value || '').trim().slice(0, 16) || 'นักผจญภัย';
      Lobby.go(() => Game.start(Save.fresh(nm, sel)));
    };
    $('#tback').onclick = () => Lobby.charSel();
    $('#tsettings').onclick = () => this.openPanel('settings');
    $('#thelp').onclick = () => this.openPanel('help');
  },
  hideTitle() { $('#title').hidden = true; },
  showHUD() { $('#hud').hidden = false; document.body.classList.add('ingame'); },
  /* ---------- HUD ---------- */
  refreshAll() { this.refreshHUD(); this.refreshTracker(); this.buildSkillbar(); this.seasonDot && this.seasonDot(); },
  refreshHUD() {
    const S = Save.d; if (!S) return; const st = Player.stats;
    this.el.name.textContent = S.name; this.el.title.textContent = S.title || Cls.name(S); this.el.lvl.textContent = S.level;
    this.el.por.style.backgroundImage = `url(${this.portraits[Player.sheet]})`;
    this.el.coins.textContent = fmt(S.coins);
  },
  buildSkillbar() {
    const S = Save.d; const sk = (S ? Cls.of(S) : CLASSES.adventurer).skills;
    const b = this.el.skills;
    b.innerHTML = `<button class="sk atk" data-a="atk" aria-label="โจมตี">${icon('sword')}<kbd>Space</kbd></button>` +
      sk.map((id, i) => { const s = SKILLS[id]; return `<button class="sk ${s.quiz ? 'ult' : ''}" data-a="s${i}" aria-label="${s.name}">${icon(s.icon)}<kbd>${'QER'[i]}</kbd><span class="mpc">${s.mp}</span><i class="cd"></i>${s.quiz ? '<span class="qbadge">?</span>' : ''}<span class="tip">${s.name}${s.quiz ? ' · ตอบถูก ×2' : ''}</span></button>`; }).join('') +
      `<button class="sk pot" data-a="hp" aria-label="ยา HP">${icon('potR')}<kbd>1</kbd><span class="cnt" id="cnt-hp"></span></button><button class="sk pot" data-a="mp" aria-label="ยา MP">${icon('potB')}<kbd>2</kbd><span class="cnt" id="cnt-mp"></span></button>`;
    b.onclick = e => { const t = e.target.closest('.sk'); if (!t) return; Audio.init(); const a = t.dataset.a; if (a === 'atk') Game.attackNearest(); else if (a === 'hp') Game.useItem(S.inv.hp_l && !S.inv.hp_s ? 'hp_l' : 'hp_s', true); else if (a === 'mp') Game.useItem('mp_s', true); else Skills.use(+a[1]); };
  },
  update(dt) {
    if (!Game.started) { this.updateFloats(dt); return; }
    UI.mountCd(); const S = Save.d, st = Player.stats;
    this.el.hp.style.width = (S.hp / st.maxhp * 100) + '%'; this.el.mp.style.width = (S.mp / st.maxmp * 100) + '%';
    this.el.xp.style.width = (S.xp / xpNeed(S.level) * 100) + '%';
    this.el.hpT.textContent = `${Math.ceil(S.hp)} / ${st.maxhp}`; this.el.mpT.textContent = `${Math.floor(S.mp)} / ${st.maxmp}`;
    this.el.coins.textContent = fmt(S.coins); const ge = $('#gems'); if (ge) ge.textContent = fmt(S.gems || 0);
    // skill cooldowns
    const sk = Cls.of(S).skills; const btns = this.el.skills.querySelectorAll('.sk');
    sk.forEach((id, i) => { const b = btns[i + 1]; if (!b) return; const p = Skills.cd[i] / SkillLv.cd(id); b.querySelector('.cd').style.setProperty('--p', p); b.classList.toggle('nomp', S.mp < SkillLv.mp(id)); b.classList.toggle('cool', p > 0); });
    const ch = $('#cnt-hp'), cm = $('#cnt-mp'); if (ch) ch.textContent = (S.inv.hp_s || 0) + (S.inv.hp_l || 0); if (cm) cm.textContent = S.inv.mp_s || 0;
    // buffs
    this.buffT = (this.buffT || 0) - dt;
    if (this.buffT <= 0) {
      this.buffT = .5;
      this.el.buffs.innerHTML = Object.keys(S.buffs).map(k => { const b = BUFFS[k]; const t = S.buffs[k]; if (!b) return ''; return `<span class="buff ${b.bad ? 'bad' : ''}" style="--c:${b.col}" title="${b.desc}">${b.name}<b>${t > 60 ? Math.ceil(t / 60) + ' นาที' : Math.ceil(t) + ' วิ'}</b></span>`; }).join('');
      if (S.points > 0) this.el.lvl.parentElement.classList.add('pts'); else this.el.lvl.parentElement.classList.remove('pts');
    }
    // prompt
    const n = Game.nearTarget;
    if (n && !Game.paused && !Player.dead) {
      const label = n.label ? n.label : n.kind === 'npc' ? 'คุยกับ ' + n.ref.name : n.kind === 'warp' ? 'ใช้จุดวาร์ป' : n.kind === 'shrine' ? 'สักการะ ' + n.ref.name : n.kind === 'bindpost' ? 'ผูกสายสิญจน์ (ตอบคำถาม)' : 'ทำลายเกราะ (Chain Quiz)';
      this.el.prompt.hidden = false; this.el.prompt.innerHTML = `<kbd>F</kbd>${label}`; this.el.prompt.classList.toggle('boss', n.kind === 'barrier' || n.kind === 'bindpost');
    } else this.el.prompt.hidden = true;
    // target frame
    const T = Player.target && Player.target.kind === 'mon' ? Player.target.ref : null;
    if (T && !T.dead && !T.d.boss) { this.el.target.hidden = false; this.el.target.querySelector('.tn').textContent = `${T.d.name} Lv.${T.d.lvl}`; this.el.target.querySelector('.tb i').style.width = (T.hp / T.max * 100) + '%'; this.el.target.classList.toggle('hostile', !!(T.d.aggro || T.aggro)); }
    else this.el.target.hidden = true;
    const B = NakBoss.cur || Monsters.boss;
    if (B && B.engaged && !B.dead) { this.el.boss.querySelector('.bb i').style.width = (B.hp / B.max * 100) + '%'; this.el.boss.classList.toggle('shield', !!(B.barrier || B.ethereal)); this.el.boss.querySelector('.bstate').textContent = B.ethereal ? `ร่างวิญญาณ: อาวุธทำร้ายไม่ได้ · ผูกสายสิญจน์ที่เสา ${NakBoss.posts.filter(p => p.bound).length}/3 (กด F)` : B.barrier ? 'เกราะผลึก: ภูมิคุ้มกัน · กด F ใกล้บอสเพื่อเริ่ม Chain Quiz' : B.stunT > 0 ? (B.d.wboss ? 'ถูกสายสิญจน์สะกด! รับความเสียหาย ×1.5' : 'มึนงง! รับความเสียหาย ×1.5') : `เฟส ${B.phase + 1}/3`; }
    this.updateFloats(dt); this.updatePlates(); this.drawMinimap();
  },
  setTarget(m) { this.targetM = m; },
  navBar(label, hunt) { const b = $('#navbar'); if (!label) { b.hidden = true; return; } b.hidden = false; b.classList.toggle('hunt', !!hunt); $('#navlabel').textContent = label; },
  mark(m) { },
  bossBar(on, name) { this.el.boss.hidden = !on; if (on) this.el.boss.querySelector('.bn').textContent = name || 'คราก ผู้พิทักษ์ผลึก · Lv.10'; },
  hurtFlash() { const h = this.el.hurt; h.classList.remove('on'); void h.offsetWidth; h.classList.add('on'); },
  /* ---------- floats ---------- */
  dmgNum(x, y, z, n, kind) { this.floats.push({ x, y, z, t: 0, life: kind === 'xp' ? 1.3 : (kind === 'hit' || kind === 'crit' || kind === 'player') && Settings.d.roPlates !== 0 ? 1.05 : 1, text: kind === 'xp' ? `+${n} XP` : kind === 'heal' ? `+${n}` : String(n), kind, dx: rand(-.4, .4) }); },
  floatText(x, y, z, text, kind) { if (this.floats.filter(f => f.kind === kind).length > 2) return; this.floats.push({ x, y, z, t: 0, life: 1, text, kind, dx: 0 }); },
  updateFloats(dt) {
    const R = Game.R; let html = '';
    for (let i = this.floats.length - 1; i >= 0; i--) { const f = this.floats[i]; f.t += dt; if (f.t > f.life) { this.floats.splice(i, 1); continue; } }
    const c = this.el.floats; while (c.children.length < this.floats.length) c.appendChild(document.createElement('span'));
    for (let i = 0; i < c.children.length; i++) {
      const sp = c.children[i]; const f = this.floats[i];
      if (!f) { sp.style.display = 'none'; continue; }
      const ro = Settings.d.roPlates !== 0 && (f.kind === 'hit' || f.kind === 'crit' || f.kind === 'player'); const u = f.t / f.life;
      const fy = ro ? f.y + 3.6 * f.t - 4.2 * f.t * f.t : f.y + f.t * (f.kind === 'heal' && Settings.d.roPlates !== 0 ? .9 : 1.4);
      const p = R.project(f.x + f.dx * (ro ? 1 + f.t * 2.4 : 1), fy, f.z); if (!p) { sp.style.display = 'none'; continue; }
      sp.style.display = ''; sp.className = 'fl ' + f.kind + (ro ? ' ro' : ''); if (sp.textContent !== f.text) sp.textContent = f.text;
      const a = ro ? (u < .75 ? 1 : 1 - (u - .75) / .25) : f.t < .15 ? f.t / .15 : 1 - Math.max(0, (f.t - f.life * .6) / (f.life * .4)); const s = ro ? (f.kind === 'crit' ? 1.6 : 1.25) - u * .55 : f.kind === 'crit' ? 1.3 - Math.min(.3, f.t) : 1;
      sp.style.transform = `translate(${p.x}px,${p.y}px) translate(-50%,-50%) scale(${s * UIScale.pl})`; sp.style.opacity = a;
    }
  },
  updatePlates() {
    const R = Game.R, P = Player; const want = [];
    for (const n of NPCList) { if (n.zone !== P.zone || dist2(n.x, n.z, P.x, P.z) > 40 * 40) continue; want.push({ key: 'n' + n.id, x: n.x, y: SPR_H + .35, z: n.z, html: () => { const mk = Quests.marker(n.id); return `${mk ? `<b class="mk ${mk === '?' ? 'ready' : mk === '!' ? 'avail' : 'prog'}">${mk}</b>` : ''}<span class="nm npc">${n.name}</span><span class="rl">${n.role}</span>`; } }); }
    for (const m of Monsters.list) {
      if (m.dead || m.zone !== P.zone || m.d.boss || (m.d.wboss && m.engaged && !m.bubble)) continue; const d2 = dist2(m.x, m.z, P.x, P.z); if (d2 > (m.d.wboss || m.d.elite ? 40 : 28) ** 2) continue;
      const tgt = P.target && P.target.ref === m; const show = tgt || m.hp < m.max || m.aggro || d2 < 12 * 12 || m.d.elite || m.d.wboss || m.bubble;
      if (!show) continue;
      want.push({ key: 'm' + m.id, x: m.x, y: (m.d.fly ? 2.4 : m.d.h) + .55 + (m.jump ? m.jump.y : 0), fy: (m.d.fly ? 1.4 : 0) + (m.jump ? m.jump.y : 0), z: m.z, cls: (m.d.aggro || m.d.elite || m.d.wboss ? 'hostile' : 'calm') + (tgt ? ' tgt' : '') + (m.d.elite || m.d.wboss ? ' elite' : ''), html: () => `${m.bubble ? `<span class="mbub">${esc(m.bubble.text)}</span>` : ''}${m.d.wboss && m.engaged ? '' : `<span class="nm">${m.d.elite ? '<i class="elt">หัวหน้า</i> ' : m.d.wboss ? '<i class="elt">บอส</i> ' : ''}${m.d.name} <small>Lv.${m.d.lvl}</small></span><span class="hpb"><i style="width:${m.hp / m.max * 100}%"></i></span>${(m.stun > 0 || m.slow > 0 || m.dotT > 0 || m.weakT > 0) ? `<span class="sts">${m.stun > 0 ? '<i class="s-stun">มึน</i>' : ''}${m.slow > 0 ? '<i class="s-slow">ช้า</i>' : ''}${m.dotT > 0 ? '<i class="s-dot">พิษ</i>' : ''}${m.weakT > 0 ? '<i class="s-weak">ยั่ว</i>' : ''}</span>` : ''}`}` });
    }
    UI.netPlates(want);
    if (Game.started) want.push({ key: 'player', x: P.x, y: SPR_H + .3 + (Mounts.riding() ? MOUNTS[Mounts.cur()].seat[0] * .8 : 0), z: P.z, cls: 'me' + (Net.gm ? ' gm' : ''), html: () => `${UI.selfPlate()}<span class="nm me">${Net.gm ? '<i class="gmtag">GM</i> ' : ''}${esc(Save.d.name)}</span>${Settings.d.roPlates !== 0 ? `<span class="robar hp"><i style="width:${Math.round(Save.d.hp / P.stats.maxhp * 100)}%"></i></span><span class="robar sp"><i style="width:${Math.round(Save.d.mp / P.stats.maxmp * 100)}%"></i></span>` : ''}` });
    const seen = new Set();
    for (const w of want) {
      let el = this.plates.get(w.key); if (!el) { el = document.createElement('div'); el.className = 'plate'; this.el.plates.appendChild(el); this.plates.set(w.key, el); }
      seen.add(w.key);
      const p = R.project(w.x, w.y, w.z); if (!p) { el.style.display = 'none'; continue; }
      el.style.display = ''; const h = w.html(); if (el._h !== h) { el.innerHTML = h; el._h = h; }
      if (Settings.d.roPlates !== 0) { // RO layout: names/bars under the feet, bubbles & markers above the head
        const f = R.project(w.x, w.fy || 0, w.z) || p; el.className = 'plate ro ' + (w.cls || ''); el.style.setProperty('--hh', Math.max(0, f.y - p.y) + 'px');
        el.style.transform = `translate(${f.x}px,${f.y}px) translate(-50%,3px) scale(${UIScale.pl})`;
      } else { el.className = 'plate ' + (w.cls || ''); el.style.transform = `translate(${p.x}px,${p.y}px) translate(-50%,-100%) scale(${UIScale.pl})`; }
    }
    for (const [k, el] of this.plates) if (!seen.has(k)) { el.remove(); this.plates.delete(k); }
  },
  /* ---------- toasts & banners ---------- */
  toast(msg, kind = 'info') {
    const t = document.createElement('div'); t.className = 'toast ' + kind; t.textContent = msg; this.el.toasts.appendChild(t);
    while (this.el.toasts.children.length > 5) this.el.toasts.firstChild.remove();
    setTimeout(() => t.classList.add('out'), 3200); setTimeout(() => t.remove(), 3800);
  },
  banner(text, kind) { const b = this.el.banner; b.textContent = text; b.className = 'banner ' + kind; void b.offsetWidth; b.classList.add('show'); clearTimeout(this.bT); this.bT = setTimeout(() => b.classList.remove('show'), 1600); },
  coinPop(n) { const c = $('#coinbox'); c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop'); },
  placeName(n) { const p = $('#placename'); p.textContent = n; p.classList.remove('show'); void p.offsetWidth; p.classList.add('show'); this.el.place.textContent = n; },
  achievement(a) { const t = document.createElement('div'); t.className = 'achpop'; t.style.marginTop = (document.querySelectorAll('.achpop').length * (document.body.classList.contains('compact') ? 50 : 78)) + 'px'; t.innerHTML = `${icon('trophy')}<div><small>ปลดล็อกความสำเร็จ</small><b>${a.name}</b><span>${a.coin ? '+' + a.coin + ' เหรียญ · ' : ''}ฉายา "${a.title}"</span></div>`; ($('#app') || document.body).appendChild(t); Audio.sfx('level'); setTimeout(() => t.classList.add('out'), 3800); setTimeout(() => t.remove(), 4400); },
  fade(mid) { const f = this.el.fade; f.classList.add('on'); setTimeout(() => { mid(); setTimeout(() => f.classList.remove('on'), 120); }, 380); },
  /* ---------- tracker ---------- */
  refreshTracker() {
    const S = Save.d; if (!S) return;
    const act = QUEST_ORDER.filter(id => Quests.active(id));
    let html = act.map(id => { const q = QUESTS[id]; const pr = Quests.progress(id); const done = Quests.complete(id); return `<li class="${q.type} ${done ? 'done' : ''} nav" data-q="${id}" tabindex="0" title="แตะเพื่อนำทางอัตโนมัติ"><b>${q.title}<i class="go-ic">นำทาง</i></b>${pr.map(o => `<span>${o.label} <em>${o.have}/${o.n}</em></span>`).join('')}${done ? `<span class="go">กลับไปส่งเควสที่ ${NPCS[q.turnTo || q.giver].name}</span>` : ''}</li>`; }).join('');
    if (!act.length) { const av = QUEST_ORDER.find(id => Quests.available(id) && QUESTS[id].type === 'main'); html = av ? `<li class="hint nav" data-q="${av}" tabindex="0"><b>${QUESTS[av].title}<i class="go-ic">นำทาง</i></b><span>คุยกับ ${NPCS[QUESTS[av].giver].name} เพื่อรับเควส</span></li>` : '<li class="hint"><span>สำรวจทวีปต่อ หรือรับเควสประจำวัน</span></li>'; }
    $('#tracklist').innerHTML = html;
  },
  /* ---------- minimap ---------- */
  buildMapImage() {
    const N = 300, c = document.createElement('canvas'); c.width = N; c.height = N; const x = c.getContext('2d'); const img = x.createImageData(N, N);
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      const wx = -150 + i, wz = -150 + j; const h = worldHeight(wx, wz); let col = groundColor(wx, wz, h);
      if (h < -.6) col = [.24, .55, .78];
      const k = (j * N + i) * 4; img.data[k] = col[0] * 255; img.data[k + 1] = col[1] * 255; img.data[k + 2] = col[2] * 255; img.data[k + 3] = 255;
    }
    x.putImageData(img, 0, 0);
    // trees darker dots
    x.fillStyle = 'rgba(30,70,35,.55)';
    for (const o of Col.circles) if (o.tag === 'tree' && Math.abs(o.x) < 150) { x.beginPath(); x.arc(o.x + 150, o.z + 150, 1.3, 0, TAU); x.fill(); }
    x.fillStyle = 'rgba(110,80,60,.9)'; for (const o of Col.circles) if (o.tag === 'house') { x.beginPath(); x.arc(o.x + 150, o.z + 150, o.r * .8, 0, TAU); x.fill(); }
    x.strokeStyle = '#8f8576'; x.lineWidth = 2.2; x.beginPath(); x.arc(150, 62 + 150, TOWN.r, 0, TAU); x.stroke();
    x.fillStyle = '#4a4440'; x.fillRect(0, 0, 300, 150 - 136);
    this.mapImg = c;
    // dungeon map
    const d = document.createElement('canvas'); d.width = 100; d.height = 160; const y = d.getContext('2d');
    y.fillStyle = '#1c1826'; y.fillRect(0, 0, 100, 160); y.fillStyle = '#5a556e';
    const rr = (x0, x1, z0, z1) => y.fillRect(x0 - 950, z0 + 140, x1 - x0, z1 - z0);
    rr(988, 1012, -8, 12); rr(996, 1004, -24, -8); rr(976, 1024, -62, -24); rr(996, 1004, -77, -62); y.beginPath(); y.arc(50, 40, 24, 0, TAU); y.fill();
    this.dunImg = d;
  },
  drawMinimap() {
    const ctx = this.miniCtx, cv = this.el.mini; const W = cv.width, H = cv.height; const P = Player;
    const scale = 1.6; ctx.save(); ctx.clearRect(0, 0, W, H);
    ctx.beginPath(); ctx.arc(W / 2, H / 2, W / 2 - 2, 0, TAU); ctx.clip();
    ctx.fillStyle = P.zone === 'dungeon' ? '#1c1826' : P.zone === 'temple' ? '#1e2a1e' : '#4a7a3a'; ctx.fillRect(0, 0, W, H);
    ctx.translate(W / 2, H / 2); ctx.scale(scale, scale);
    if (P.zone === 'world') ctx.drawImage(this.mapImg, -150 - P.x, -150 - P.z); else if (P.zone === 'temple') { if (!this.tplImg) this.buildTempleMap(); ctx.drawImage(this.tplImg, (TX - 75) - P.x, -75 - P.z); } else ctx.drawImage(this.dunImg, 950 - P.x, -140 - P.z);
    const dot = (x, z, c, r) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x - P.x, z - P.z, r, 0, TAU); ctx.fill(); };
    for (const m of Monsters.list) if (!m.dead && m.zone === P.zone) dot(m.x, m.z, m.d.boss ? '#ff4fd8' : m.d.aggro ? '#ff5a3c' : '#f2d34b', m.d.boss ? 3 : 1.3);
    for (const w of WARPS) if (w.zone === P.zone) dot(w.x, w.z, Save.d.warps[w.id] ? '#7fe6ff' : '#5a6b78', 2);
    for (const s of SHRINES) if (s.zone === P.zone) dot(s.x, s.z, BUFFS[s.buff].col, 2);
    for (const n of NPCList) if (n.zone === P.zone) { const mk = Quests.marker(n.id); dot(n.x, n.z, mk === '?' ? '#a5e84a' : mk === '!' ? '#ffd24a' : '#f3e7cc', 1.8); }
    ctx.restore();
    // player arrow + camera cone (screen space, north up)
    ctx.save(); ctx.translate(W / 2, H / 2);
    ctx.fillStyle = 'rgba(255,255,255,.14)'; ctx.beginPath(); ctx.moveTo(0, 0); const cy = -Cam.yaw + Math.PI; ctx.arc(0, 0, 40, -cy - Math.PI / 2 - .5, -cy - Math.PI / 2 + .5); ctx.closePath(); ctx.fill();
    ctx.rotate(-P.face + Math.PI); ctx.fillStyle = '#a5e84a'; ctx.strokeStyle = '#1d1712'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, -7); ctx.lineTo(5, 5); ctx.lineTo(0, 2.5); ctx.lineTo(-5, 5); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.restore();
  },
  /* ---------- joystick ---------- */
  initJoystick() {
    const j = this.el.joy, k = this.el.knob; let id = null, cx = 0, cy = 0;
    j.addEventListener('pointerdown', e => { e.preventDefault(); Audio.init(); id = e.pointerId; try { j.setPointerCapture(id); } catch (_) { } const r = j.getBoundingClientRect(); cx = r.left + r.width / 2; cy = r.top + r.height / 2; mv(e); });
    const mv = e => { if (e.pointerId !== id) return; const dd = Rot.delta(e.clientX - cx, e.clientY - cy); let dx = dd.dx / UIScale.bt, dy = dd.dy / UIScale.bt; const R = 46; const l = Math.hypot(dx, dy); if (l > R) { dx = dx / l * R; dy = dy / l * R; } k.style.transform = `translate(${dx}px,${dy}px)`; const m = l < 8 ? 0 : 1; Input.joy.x = m * dx / R; Input.joy.z = m * -dy / R; };
    j.addEventListener('pointermove', mv);
    const up = e => { if (e.pointerId !== id) return; id = null; k.style.transform = ''; Input.joy.x = Input.joy.z = 0; };
    j.addEventListener('pointerup', up); j.addEventListener('pointercancel', up);
  },
  /* ---------- panels ---------- */
  openPanel(kind, opt = {}) {
    if (this.quizOpen) return;
    if (this.panelOpen !== kind) this.el.pbody.scrollTop = 0;
    this.panelOpen = kind; this.panelOpt = opt; this.el.panel.hidden = false; this.el.panel.dataset.kind = kind;
    if (Game.started) { Game.pause(true, 'panel'); this.haltPlayer(); }
    this.renderPanel();
  },
  // stop every kind of movement so nothing resumes after a window closes
  haltPlayer() {
    const P = Player; P.moveTo = null; P.nav = null; if (P.target && P.target.kind !== 'mon') P.target = null; if (AutoHunt.on || Nav.active) P.target = null;
    Nav.stop(); AutoHunt.stop(); Input.release(); P.moving = false; P.vx = P.vz = 0;
  },
  closePanel() {
    if (!this.panelOpen) return;
    this.panelOpen = null; this.el.panel.hidden = true; Game.pause(false, 'panel');
    if (Save.d) Save.write();
  },
  refreshInvIfOpen() { if (this.panelOpen === 'inv' || this.panelOpen === 'shop') this.renderPanel(); },
  renderPanel() {
    const k = this.panelOpen; const fn = { models: 'pModels', wardrobe: 'pWardrobe', jobs: 'pJobs', ghost: 'pGhost', gm: 'pGM', chat: 'pChat', channels: 'pChannels', skills: 'pSkills', stable: 'pStable', doc: 'pDoc', season: 'pSeason', gemshop: 'pGemShop', topup: 'pTopup', inv: 'pInv', char: 'pChar', quest: 'pQuest', map: 'pMap', ach: 'pAch', settings: 'pSettings', help: 'pHelp', menu: 'pMenu', shop: 'pShop', dialog: 'pDialog' }[k] || (UI.extraPanels && UI.extraPanels[k]);
    if (fn) this[fn](this.panelOpt || {});
  },
  setPanel(title, html, wide) { this.el.ptitle.innerHTML = title; this.el.pbody.innerHTML = html; this.el.panel.querySelector('.pwin').classList.toggle('wide', !!wide); },
  pMenu() {
    this.setPanel('เมนู', `<div class="menugrid">
      ${[['season', 'pass', 'Season Pass', ''], ['gemshop', 'gem', 'ร้านเพชร', ''], ['topup', 'gem', 'เติมเพชร', ''], ['inv', 'bag', 'กระเป๋า', 'I'], ['char', 'person', 'ตัวละคร', 'C'], ['quest', 'book', 'เควส', 'L'], ['map', 'map', 'แผนที่โลก', 'M'], ['jobs', 'person', 'สายอาชีพ', 'J'], ['wardrobe', 'outfit', 'ตู้เสื้อผ้า', 'O'], ['pets', 'paw', 'สัตว์เลี้ยง', 'U'], ['friends', 'person', 'เพื่อน', 'Y'], ['refine', 'gear', 'ตีบวก/การ์ด', ''], ['mvp', 'crown', 'บอส MVP', ''], ['tree', 'star', 'สกิลทรี', ''], ['cards', 'book', 'สมุดการ์ด', ''], ['ghost', 'ghost', 'ตำราผีไทย', 'B'], ['ach', 'trophy', 'ความสำเร็จ', 'K'], ['settings', 'gear', 'ตั้งค่า', ''], ['help', 'help', 'วิธีเล่น', 'H']].map(([p, ic, l, kb]) => `<button class="mbtn" data-go="${p}">${icon(ic)}<span>${l}</span>${kb ? `<kbd>${kb}</kbd>` : ''}</button>`).join('')}
      <button class="mbtn" data-go="title">${icon('close')}<span>บันทึกและกลับหน้าแรก</span></button></div>`);
    this.el.pbody.onclick = e => { const b = e.target.closest('[data-go]'); if (!b) return; if (b.dataset.go === 'title') { Save.write(); location.reload(); return; } this.openPanel(b.dataset.go); };
  },
  itemIcon(id) { const it = ITEMS[id]; if (it.slot === 'outfit') return `<img class="ic pimg" src="${this.portraits[it.sheet]}" alt="">`; return icon(it.icon, 'r-' + (it.rare ? 'rare' : it.kind)); },
  pInv(o) {
    const S = Save.d; const tab = o.tab || 'gear'; this.panelOpt.tab = tab;
    const tabs = [['gear', 'อุปกรณ์'], ['use', 'ไอเทมใช้งาน'], ['mat', 'ของเควส/วัตถุดิบ'], ['cos', 'ของแต่งตัว']];
    const slots = [['weapon', 'อาวุธ'], ['armor', 'ชุดเกราะ'], ['acc', 'เครื่องประดับ']].map(([s, l]) => { const id = S.equip[s]; return `<div class="slot ${id ? 'on hasinfo' : ''}" ${id ? `data-info="${id}"` : ''}>${id ? this.itemIcon(id) : '<span class="empty"></span>'}<div><small>${l}</small><b>${id ? ITEMS[id].name : 'ว่าง'}</b></div></div>`; }).join('');
    const cslots = [['outfit', 'ชุด'], ['head', 'หมวก'], ['face', 'ใบหน้า'], ['back', 'หลัง'], ['wskin', 'สกินอาวุธ'], ['aura', 'ออร่า']].map(([s, l]) => { const id = S.cos[s]; return `<div class="slot ${id ? 'on hasinfo' : ''}" ${id ? `data-info="${id}"` : ''}>${id ? this.itemIcon(id) : '<span class="empty"></span>'}<div><small>${l}</small><b>${id ? ITEMS[id].name : s === 'outfit' ? 'ชุดประจำอาชีพ' : 'ว่าง'}</b></div></div>`; }).join('');
    const ids = Object.keys(S.inv).filter(id => ITEMS[id] && ITEMS[id].kind === tab && S.inv[id] > 0);
    const rows = ids.map(id => {
      const it = ITEMS[id]; const eq = it.kind === 'gear' ? S.equip[it.slot] === id : it.kind === 'cos' ? S.cos[it.slot] === id : false;
      let act = '';
      if (it.kind === 'use') act = `<button class="btn sm" data-use="${id}">ใช้</button>`;
      else if (it.kind === 'gear' || it.kind === 'cos') act = `<button class="btn sm ${eq ? 'ghost' : ''}" data-eq="${id}">${eq ? 'ถอด' : 'สวมใส่'}</button>`;
      return `<li class="${eq ? 'eq' : ''} hasinfo" data-info="${id}">${this.itemIcon(id)}<div class="in"><b>${it.name}</b><small>${it.desc}</small></div><span class="qty">${it.kind === 'gear' || it.kind === 'cos' ? (eq ? 'สวมอยู่' : '') : '×' + S.inv[id]}</span>${act}</li>`;
    }).join('') || `<li class="emptyrow">ยังไม่มีไอเทมในหมวดนี้${tab === 'cos' ? ' ซื้อได้ที่ร้านของช่างตัดเสื้อมีนาในเมือง' : tab === 'gear' ? ' ซื้อได้ที่ร้านพ่อค้าพิปในเมือง' : ''}</li>`;
    this.setPanel(`${icon('bag')} กระเป๋า <span class="coin">${icon('coin')}${fmt(S.coins)}</span>`, `
      <div class="eqgrid"><div><h4>สวมใส่</h4><div class="slots">${slots}</div></div><div><h4>ของแต่งตัว</h4><div class="slots">${cslots}</div></div></div>
      <div class="tabs" role="tablist">${tabs.map(([k, l]) => `<button role="tab" class="tab ${k === tab ? 'on' : ''}" data-tab="${k}">${l}</button>`).join('')}</div>
      <ul class="ilist">${rows}</ul><p class="ihint">แตะไอเทมเพื่อดูรายละเอียดและวิธีหา</p>`, true);
    this.el.pbody.onclick = e => {
      const t = e.target.closest('[data-tab]'); if (t) { this.panelOpt.tab = t.dataset.tab; this.renderPanel(); return; }
      const u = e.target.closest('[data-use]'); if (u) { Game.useItem(u.dataset.use); this.renderPanel(); return; }
      const q = e.target.closest('[data-eq]'); if (q) { Game.equip(q.dataset.eq); this.renderPanel(); }
    };
  },
  pChar() {
    const S = Save.d, st = Player.stats, c = Cls.of(S);
    const rows = [['hp', 'HP สูงสุด', st.maxhp, '+10'], ['mp', 'MP สูงสุด', st.maxmp, '+6'], ['atk', 'พลังโจมตี (ATK)', st.atk, '+2'], ['def', 'พลังป้องกัน (DEF)', st.def, '+1.5'], ['spd', 'ความเร็ว (SPD)', st.spd.toFixed(2), '+0.12']];
    this.setPanel(`${icon('person')} ตัวละคร`, `
      <div class="charhead"><img src="${this.bodies[Player.sheet]}" alt=""><div><h3>${esc(S.name)}</h3><p class="ttl">${S.title ? '「' + S.title + '」' : ''}</p><p>${Cls.name(S)} · เลเวล ${S.level}${S.job ? '' : ` · <button class="btn sm ghost" data-go="jobinfo">เปลี่ยนอาชีพ Lv.${JOB_LV}</button>`}${S.job && !S.awk ? ` · <button class="btn sm ghost" data-go="jobinfo">ปลุกพลัง Lv.${AWK_LV}</button>` : ''}</p><p class="xpline">XP ${fmt(S.xp)} / ${fmt(xpNeed(S.level))}</p><div class="xpb"><i style="width:${S.xp / xpNeed(S.level) * 100}%"></i></div></div></div>
      <p class="pts">แต้มสถานะคงเหลือ: <b>${S.points}</b> ${S.points ? '· กด + เพื่ออัปเกรด' : '· ได้รับ 3 แต้มทุกครั้งที่เลเวลอัป'}</p>
      <ul class="stats">${rows.map(([k, l, v, inc]) => `<li><span>${l}</span><b>${v}</b><small>อัปแล้ว ${S.alloc[k]}</small><button class="btn sm" data-al="${k}" ${S.points ? '' : 'disabled'}>+ <small>${inc}</small></button></li>`).join('')}</ul>
      <h4>สกิล · ${ROLES[c.role].name} <button class="btn sm ghost" data-go="skills">เปิดหน้าสกิล</button></h4><ul class="skl">${c.skills.map((id, i) => { const s = SKILLS[id]; return `<li class="hasinfo" data-skinfo="${id}">${SkillArt.art(id, { cls: 'sm' })}<div><b>${SKILL_KEYS[i]} · ${s.name} <em>Lv.${SkillLv.get(id)}</em></b><small>${s.cat} · MP ${SkillLv.mp(id)} · คูลดาวน์ ${SkillLv.cd(id)} วินาที${s.quiz ? ' · ตอบถูก = พลัง ×2' : ''}</small></div></li>`; }).join('')}</ul>
      <p class="muted">เวลาเล่นรวม ${Math.floor((S.playT || 0) / 60)} นาที · ปราบมอนสเตอร์ ${S.stats.kills} ตัว · ตอบถูก ${S.stats.correct} ข้อ</p>`);
    this.el.pbody.onclick = e => { const sk = e.target.closest('[data-skinfo]'); if (sk) return SkillInfo.open(sk.dataset.skinfo); if (e.target.closest('[data-go="skills"]')) return this.openPanel('skills'); if (e.target.closest('[data-go="jobinfo"]')) return this.openPanel('jobs'); const b = e.target.closest('[data-al]'); if (!b || !S.points) return; S.points--; S.alloc[b.dataset.al]++; Player.recalc(); if (b.dataset.al === 'hp') S.hp += 10; Audio.sfx('ui'); this.renderPanel(); };
  },
  pQuest() {
    const S = Save.d;
    const card = id => {
      const q = QUESTS[id], s = Quests.st(id); const pr = Quests.progress(id); const state = Quests.active(id) ? (Quests.complete(id) ? 'พร้อมส่ง' : 'กำลังทำ') : s && s.s === 'done' && !(q.type === 'daily' && s.day !== today()) ? 'สำเร็จ' : Quests.available(id) ? 'รับได้' : 'ยังล็อกอยู่';
      return `<li class="qc ${q.type}"><div class="qh"><span class="qt">${{ main: 'เควสหลัก', side: 'เควสย่อย', daily: 'ประจำวัน' }[q.type]}</span><b>${q.title}</b><em class="qs s-${state}">${state}</em></div>
        <p>${q.text}</p>${pr.length ? `<div class="qobj">${pr.map(o => `<span>${o.label}: <b>${o.have}/${o.n}</b></span>`).join('')}</div>` : ''}
        ${(state === 'กำลังทำ' || state === 'พร้อมส่ง' || state === 'รับได้') ? `<button class="btn sm" data-navq="${id}">นำทาง</button> ` : ''}<small>ผู้ให้เควส: ${NPCS[q.giver].name}${q.rew.xp ? ` · รางวัล ${q.rew.xp} XP, ${q.rew.coin} เหรียญ` : ''}${q.rew.items.length ? ', ' + q.rew.items.map(([i, n]) => ITEMS[i].name + (n > 1 ? ' ×' + n : '')).join(', ') : ''}${q.title ? ` · ฉายา "${q.title}"` : ''}${q.gems ? ` · เพชร ${q.gems}` : ''}</small></li>`;
    };
    const vis = QUEST_ORDER.filter(id => { const q = QUESTS[id]; return Quests.st(id) || Quests.available(id) || q.type === 'main'; });
    this.setPanel(`${icon('book')} บันทึกเควส`, `<ul class="qlist">${vis.map(card).join('')}</ul><p class="muted">เควสประจำวันรีเซ็ตทุกวันตามเวลาในเครื่องของคุณ · กดปุ่มนำทางเพื่อให้ตัวละครเดินไปเอง</p>`, true);
    this.el.pbody.onclick = e => { const b = e.target.closest('[data-navq]'); if (!b) return; const id = b.dataset.navq; this.closePanel(); setTimeout(() => Nav.goQuest(id), 60); };
  },
  pMap(o) {
    const S = Save.d; const P = Player;
    this.setPanel(`${icon('map')} แผนที่ทวีป${o.warp ? ' · เลือกจุดวาร์ป' : ''}`, `<div class="mapwrap"><canvas id="bigmap" width="600" height="600"></canvas></div>
      <div class="warps"><h4>จุดวาร์ป</h4>${WARPS.map(w => `<button class="btn ${S.warps[w.id] ? '' : 'ghost'}" data-w="${w.id}" ${S.warps[w.id] && o.warp ? '' : 'disabled'}>${w.name}${S.warps[w.id] ? '' : ' (ยังไม่ค้นพบ)'}</button>`).join('')}
      <p class="muted">${o.warp ? 'แตะชื่อจุดวาร์ปที่ค้นพบแล้วเพื่อเดินทางทันที' : 'เดินไปที่คริสตัลวาร์ปแล้วกด F เพื่อเดินทางเร็ว'}</p></div>`, true);
    const cv = $('#bigmap'), x = cv.getContext('2d');
    x.imageSmoothingEnabled = true; x.drawImage(this.mapImg, 0, 0, 600, 600);
    const tp = (wx, wz) => [(wx + 150) * 2, (wz + 150) * 2];
    x.font = '600 15px Mitr, sans-serif'; x.textAlign = 'center';
    const lbl = (t, wx, wz, c = '#fff') => { const [a, b] = tp(wx, wz); x.lineWidth = 4; x.strokeStyle = 'rgba(20,14,10,.8)'; x.strokeText(t, a, b); x.fillStyle = c; x.fillText(t, a, b); };
    for (const k of ['town', 'meadow', 'forest', 'camp', 'goblin', 'gate']) lbl(PLACES[k].name, PLACES[k].x, PLACES[k].z + (k === 'town' ? -38 : 0), '#f3e7cc');
    lbl('แม่น้ำเงินยวง', -95, 4, '#cfe8ff');
    if (!S.flags.bridge) lbl('สะพานปิด', 0, 18, '#ff9a7a');
    if (!(S.flags.gate && S.level >= 5)) lbl('ประตูผนึก', 0, -128, '#ff9a7a');
    for (const w of WARPS) if (w.zone === 'world') { const [a, b] = tp(w.x, w.z); x.fillStyle = S.warps[w.id] ? '#7fe6ff' : '#5a6b78'; x.beginPath(); x.moveTo(a, b - 8); x.lineTo(a + 6, b); x.lineTo(a, b + 8); x.lineTo(a - 6, b); x.fill(); }
    for (const s of SHRINES) { const [a, b] = tp(s.x, s.z); x.fillStyle = BUFFS[s.buff].col; x.beginPath(); x.arc(a, b, 6, 0, TAU); x.fill(); x.strokeStyle = '#1d1712'; x.lineWidth = 2; x.stroke(); }
    if (P.zone === 'world') { const [a, b] = tp(P.x, P.z); x.fillStyle = '#a5e84a'; x.strokeStyle = '#1d1712'; x.lineWidth = 2; x.beginPath(); x.arc(a, b, 7, 0, TAU); x.fill(); x.stroke(); }
    else lbl('คุณอยู่ในถ้ำผลึก', 0, -110, '#a5e84a');
    this.el.pbody.onclick = e => { const b = e.target.closest('[data-w]'); if (!b || b.disabled) return; const w = WARPS.find(v => v.id === b.dataset.w); if (Monsters.boss.engaged) { this.toast('วาร์ปไม่ได้ระหว่างต่อสู้กับบอส', 'warn'); return; } this.closePanel(); Game.teleport(w.x + 2.5, w.z + 2.5, w.name); };
  },
  pAch() {
    const S = Save.d; const titles = ACHIEVEMENTS.filter(a => S.ach[a.id]).map(a => a.title).concat(S.extraTitles || []);
    this.setPanel(`${icon('trophy')} ความสำเร็จ`, `<div class="titlesel"><label for="titlepick">ฉายาที่ใช้</label><select id="titlepick"><option value="">ไม่ใช้ฉายา</option>${titles.map(t => `<option ${S.title === t ? 'selected' : ''}>${t}</option>`).join('')}</select></div>
      <ul class="achl">${ACHIEVEMENTS.map(a => { const v = Math.min(a.n, Achievements.val(a)); const done = !!S.ach[a.id]; return `<li class="${done ? 'done' : ''}">${icon('trophy')}<div><b>${a.name}</b><small>${a.desc}</small><div class="xpb"><i style="width:${v / a.n * 100}%"></i></div><small>${fmt(v)} / ${fmt(a.n)} · รางวัล ${a.coin ? a.coin + ' เหรียญ + ' : ''}ฉายา "${a.title}"</small></div></li>`; }).join('')}</ul>`, true);
    $('#titlepick').onchange = e => { S.title = e.target.value || null; this.refreshHUD(); };
    this.el.pbody.onclick = null;
  },
  pSettings() {
    const D = Settings.d;
    const diffL = ['', 'ประถมต้น', 'ประถมปลาย', 'มัธยม'];
    this.setPanel(`${icon('gear')} ตั้งค่า`, `
      <fieldset><legend>การควบคุมการเดิน</legend>
        ${[['both', 'ใช้ทั้งคลิกเมาส์และ WASD'], ['click', 'คลิกเพื่อเดิน (Click-to-Move) อย่างเดียว'], ['wasd', 'WASD อย่างเดียว (คลิกใช้เลือกเป้าหมาย)']].map(([v, l]) => `<label class="radio"><input type="radio" name="mv" id="mv-${v}" value="${v}" ${D.move === v ? 'checked' : ''}> ${l}</label>`).join('')}
      </fieldset>
      <fieldset><legend>คำถาม</legend>
        <label for="qtime">เวลาตอบต่อข้อ: <b id="qtv">${D.qtime}</b> วินาที</label><input type="range" id="qtime" min="8" max="40" step="1" value="${D.qtime}">
        <label for="qdiff">ระดับความยาก: <b id="qdv">${diffL[D.diff]}</b></label><input type="range" id="qdiff" min="1" max="3" step="1" value="${D.diff}">
        <div class="cats">${Object.keys(QCATS).map(k => `<label class="chk"><input type="checkbox" id="cat-${k}" data-cat="${k}" ${D.cats[k] ? 'checked' : ''}> <i style="background:${QCATS[k].col}"></i>${QCATS[k].name}</label>`).join('')}</div>
      </fieldset>
      <fieldset><legend>คำถามของฉัน (สำหรับครูและผู้ปกครอง)</legend>
        <p class="muted">หนึ่งบรรทัดต่อหนึ่งข้อ: <code>คำถาม | คำตอบที่ถูก | ตัวเลือกผิด | ตัวเลือกผิด | ตัวเลือกผิด</code></p>
        <textarea id="customq" rows="5" placeholder="ดวงอาทิตย์ขึ้นทางทิศใด | ทิศตะวันออก | ทิศตะวันตก | ทิศเหนือ | ทิศใต้">${esc(D.custom.map(c => [c.q, c.a, ...c.w].join(' | ')).join('\n'))}</textarea>
        <label class="chk"><input type="checkbox" id="customonly" ${D.customOnly ? 'checked' : ''}> ใช้เฉพาะคำถามของฉัน</label>
        <p id="cqmsg" class="muted">มีคำถามของฉัน ${D.custom.length} ข้อ</p>
      </fieldset>
      <fieldset><legend>เสียง</legend><label class="chk"><input type="checkbox" id="snd" ${D.sound ? 'checked' : ''}> เปิดเสียงเอฟเฟกต์</label><label class="chk"><input type="checkbox" id="mus" ${D.music ? 'checked' : ''}> เพลงประกอบและเสียงบรรยากาศ (เปลี่ยนตามแมพ)</label><label class="chk"><input type="checkbox" id="vox" ${D.voice ? 'checked' : ''}> เสียงตัวละครตะโกนและพากย์ชื่อสกิล</label></fieldset>
      <fieldset><legend>ภาพแบบ RO</legend><label class="chk"><input type="checkbox" id="rospr" ${D.sprites !== 0 ? 'checked' : ''}> ตัวละครและมอนสเตอร์แบบสไปรต์พิกเซล (สไตล์ RO)</label><label class="chk"><input type="checkbox" id="roplt" ${D.roPlates !== 0 ? 'checked' : ''}> ชื่อใต้เท้า แถบ HP/SP และตัวเลขดาเมจเด้งแบบ RO</label><label class="chk"><input type="checkbox" id="pausew" ${D.pauseWin !== 0 ? 'checked' : ''}> หยุดเกมเมื่อเปิดหน้าต่าง (ปิดเพื่อเล่นไปพร้อมเปิดหน้าต่างหลายอันแบบ RO)</label></fieldset>
      <fieldset><legend>โมเดล 3 มิติ</legend><p class="muted">นำเข้าโมเดล .glb ที่ทำเอง (Tripo / Meshy + Blender) มาแทนตัวละคร</p><button class="btn" data-go="models">จัดการโมเดล 3 มิติ</button></fieldset>
      <fieldset><legend>ผู้ดูแลเกม (GM)</legend><div id="gmset">${UI.gmSettingsHtml()}</div></fieldset>
      <div class="row"><button class="btn" id="savesettings">บันทึกการตั้งค่า</button>${Save.d ? '<button class="btn ghost danger" id="wipe">ลบเซฟและเริ่มใหม่</button>' : ''}</div>`);
    $('#qtime').oninput = e => $('#qtv').textContent = e.target.value;
    this.el.pbody.querySelector('[data-go="models"]').onclick = () => this.openPanel('models');
    $('#qdiff').oninput = e => $('#qdv').textContent = diffL[e.target.value];
    $('#savesettings').onclick = () => {
      D.move = (document.querySelector('input[name=mv]:checked') || {}).value || 'both'; D.qtime = +$('#qtime').value; D.diff = +$('#qdiff').value; D.sound = $('#snd').checked ? 1 : 0; D.music = $('#mus').checked ? 1 : 0; MusicSys.setOn(!!D.music); Weather.sound(); D.voice = $('#vox').checked ? 1 : 0; D.sprites = $('#rospr').checked ? 1 : 0; D.roPlates = $('#roplt').checked ? 1 : 0; D.pauseWin = $('#pausew').checked ? 1 : 0; WM.pauseSync(); D.customOnly = $('#customonly').checked ? 1 : 0;
      document.querySelectorAll('[data-cat]').forEach(c => D.cats[c.dataset.cat] = c.checked ? 1 : 0);
      const lines = $('#customq').value.split('\n').map(l => l.split('|').map(s => s.trim())).filter(p => p.length >= 3 && p[0] && p[1] && p[2]);
      D.custom = lines.map(p => ({ q: p[0], a: p[1], w: p.slice(2, 5) }));
      Quiz.decks = {}; Settings.save();
      $('#cqmsg').textContent = `บันทึกแล้ว · มีคำถามของฉัน ${D.custom.length} ข้อ`; this.toast('บันทึกการตั้งค่าแล้ว', 'quest');
    };
    const w = $('#wipe'); if (w) w.onclick = () => { if (!w.dataset.c) { w.dataset.c = 1; w.textContent = 'กดอีกครั้งเพื่อยืนยันการลบเซฟ'; return; } Save.wipe(); location.reload(); }
    UI.gmSettingsBind();;
    this.el.pbody.onclick = null;
  },
  pHelp() {
    this.setPanel(`${icon('help')} วิธีเล่น`, `<div class="help">
      <section><h4>เป้าหมาย</h4><p>รับเควสจาก <b>กัปตันลีร่า</b> ในเมือง Aurelion ปราบมอนสเตอร์ในทุ่งหญ้า ข้ามสะพานไปป่ากระซิบ แล้วบุกถ้ำผลึกเพื่อปราบบอส <b>คราก</b></p></section>
      <section><h4>วัดร้างกลางป่า (เลเวล 6+)</h4><p>เดินตามถนนสายตะวันตกจากประตูเมืองไปจนสุดทาง จะพบวัดร้างที่มีผีไทย 17 ชนิด รับเควสจาก <b>หลวงตาพุฒ</b> ซื้อน้ำมนต์และธูปกันผีจาก <b>ตาเผือก</b> แล้วตามล่าบอส <b>แม่นาก</b> ที่เรือนไทยริมคลอง เมื่อแม่นากกลายเป็นวิญญาณ ให้กด F ที่เสาสายสิญจน์ทั้ง 3 ต้นแล้วตอบคำถามเพื่อสะกดนาง · เปิด <b>ตำราผีไทย</b> (B) เพื่ออ่านตำนานผีแต่ละชนิด</p></section>
      <section><h4>คอมพิวเตอร์</h4><ul>
        <li><kbd>คลิกซ้าย</kbd> บนพื้นเพื่อเดิน กดค้างเพื่อเดินตามเมาส์ · คลิกมอนสเตอร์เพื่อโจมตี · คลิก NPC เพื่อคุย</li>
        <li><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> เดินตามทิศกล้อง</li>
        <li><kbd>คลิกขวาค้าง</kbd> แล้วลากเพื่อหมุนกล้อง 360° · <kbd>ลูกกลิ้ง</kbd> ซูมเข้า-ออก · <kbd>←</kbd><kbd>→</kbd> หมุนกล้อง</li>
        <li><kbd>Space</kbd> โจมตีเป้าหมายใกล้สุด · <kbd>Tab</kbd> เปลี่ยนเป้าหมาย · <kbd>Q</kbd><kbd>E</kbd><kbd>R</kbd><kbd>T</kbd> สกิลตามบทบาท · <kbd>X</kbd> สกิลใหญ่ (ตอบคำถาม) · <kbd>P</kbd> หน้าสกิล · <kbd>V</kbd> ขี่สัตว์ · <kbd>G</kbd> สกิลสัตว์ขี่ · กดค้างปุ่มสกิล = ดูรายละเอียด · <kbd>1</kbd><kbd>2</kbd> ยา HP/MP</li>
        <li><kbd>F</kbd> คุย/ใช้แท่นบูชา/วาร์ป · <kbd>I</kbd> กระเป๋า · <kbd>C</kbd> ตัวละคร · <kbd>L</kbd> เควส · <kbd>M</kbd> แผนที่ · <kbd>K</kbd> ความสำเร็จ</li></ul></section>
      <section><h4>มือถือและแท็บเล็ต</h4><ul><li>จอยสติ๊กซ้ายล่างเพื่อเดิน หรือแตะพื้นเพื่อเดินไปจุดนั้น</li><li>ลากนิ้วบนฉากเพื่อหมุนกล้อง · ใช้สองนิ้วถ่างหรือหุบเพื่อซูม</li><li>ปุ่มขวาล่างคือโจมตี สกิล และยา</li></ul></section>
      <section><h4>ระบบตอบคำถาม</h4><ul>
        <li><b>สกิลใหญ่ (X)</b> มีคำถามเด้งขึ้น ตอบถูกในเวลา พลัง ×2 · ตอบผิด สกิลฟาวล์และติดคูลดาวน์</li>
        <li><b>แท่นบูชา</b> 3 แห่งบนแผนที่ ตอบถูกรับบัฟ 10 นาที</li>
        <li><b>บอส</b> จะสร้างเกราะผลึกที่ HP 70% และ 35% ต้องตอบถูกติดกัน 3 ข้อ (Chain Quiz) เพื่อทำลายเกราะ</li>
        <li><b>ปราชญ์โอริน</b> มีบททดสอบประจำวันให้ XP และเหรียญ</li></ul></section>
      <section><h4>เคล็ดลับ</h4><ul><li>มอนสเตอร์ชื่อสีเหลืองรักสงบ จะสู้กลับเมื่อโดนตีก่อน · ชื่อสีแดงดุร้าย จะวิ่งเข้าหาเมื่อเข้าใกล้</li><li>วงสีแดงบนพื้นคือท่าโจมตีของบอส เดินออกจากวงก่อนที่มันจะเต็ม</li><li>เกมบันทึกอัตโนมัติในเบราว์เซอร์เครื่องนี้</li></ul></section></div>`, true);
    this.el.pbody.onclick = null;
  },
  /* ---------- dialog / shop ---------- */
  dialog(n) { this.openPanel('dialog', { npc: n.id }); },
  pDialog(o) {
    const n = NPCS[o.npc]; const S = Save.d;
    let text = o.text, buttons = [];
    if (text) buttons.push(['next', 'ต่อไป', 'primary']);
    for (const id in S.quests) { const st = S.quests[id], qq = QUESTS[id]; if (st.s === 'active' && qq.obj.some(ob => ob.k === 'talk' && ob.npc === o.npc) && !st.k.talk) { st.k.talk = 1; Quests.onItem(); } }
    const quests = QUEST_ORDER.filter(id => QUESTS[id].giver === o.npc);
    if (!text) {
      const ready = QUEST_ORDER.find(id => (QUESTS[id].turnTo || QUESTS[id].giver) === o.npc && Quests.active(id) && Quests.complete(id) && QUESTS[id].obj[0].k !== 'quiz');
      const avail = quests.find(id => Quests.available(id));
      const act = quests.find(id => Quests.active(id));
      if (ready) { text = QUESTS[ready].done; buttons.push([`turn:${ready}`, 'ส่งเควส: ' + QUESTS[ready].title, 'primary']); }
      else if (avail) { text = QUESTS[avail].text; buttons.push([`acc:${avail}`, (QUESTS[avail].type === 'daily' && QUESTS[avail].obj[0].k === 'quiz' ? 'เริ่มบททดสอบ' : 'รับเควส: ') + (QUESTS[avail].obj[0].k === 'quiz' ? '' : QUESTS[avail].title), 'primary']); }
      else if (act) { const pr = Quests.progress(act); text = `ภารกิจ "${QUESTS[act].title}" เป็นยังไงบ้าง? ` + pr.map(p => `${p.label} ${p.have}/${p.n}`).join(' · '); }
      else text = NPC_IDLE[o.npc] || { lyra: 'Aurelion สงบสุขได้ก็เพราะนักผจญภัยอย่างเจ้า กลับมาหาฉันพรุ่งนี้สำหรับภารกิจล่าประจำวันนะ', orin: 'วันนี้เจ้าทดสอบไปแล้ว พรุ่งนี้ค่อยมาใหม่ ระหว่างนี้แท่นบูชาทั้งสามก็มีคำถามรออยู่', pip: 'ยินดีต้อนรับ! ยา อาวุธ ชุดเกราะ มีครบ', mina: 'อยากเปลี่ยนลุคไหม? ฉันมีหมวก ปีก ออร่า และชุดทั้งหกแบบ', kaze: 'ซุปเห็ดหม้อนั้นอร่อยมาก ขอบใจอีกครั้งนะ', rook: 'ป่ากระซิบช่วงนี้อันตราย ระวังหมาป่าที่ล่าเป็นฝูงด้วย' }[o.npc];
      if (n.shop) buttons.push([`shop:${n.shop}`, (SHOPS[n.shop] || SHOPS.items)[1], '']);
      if (o.npc === 'kuman') buttons.push(['bless', 'ขอพรกุมารทอง', '']);
      if (o.npc === 'zen') { if (!S.job) buttons.push(['jobs', 'เปลี่ยนอาชีพขั้นสอง', 'primary']); else if (!S.awk && S.quests.awk && S.quests.awk.s === 'done') buttons.push(['ritual', 'เข้าพิธีกรรมปลุกพลัง (5,000 เหรียญ)', 'primary']); else buttons.push(['jobs', 'ดูสายอาชีพ', '']); }
      if (o.npc === 'luangta' && S.quests.t0 && S.quests.t0.s === 'done') buttons.push(['ghostbook', 'ตำราผีไทย', '']);
    }
    buttons.push(['bye', 'ลาก่อน', 'ghost']);
    const npc = NPCList.find(x => x.id === o.npc);
    this.setPanel(`${n.name} <small>${n.role}</small>`, `<div class="dlg"><img src="${this.bodies[n.sheet + '_wave'] || NpcPortrait.get(n.sheet)}" alt=""><div><p>${text}</p><div class="dbtns">${buttons.map(([a, l, c]) => `<button class="btn ${c}" data-d="${a}">${l}</button>`).join('')}</div></div></div>`);
    this.el.pbody.onclick = e => {
      const b = e.target.closest('[data-d]'); if (!b) return; const [a, id] = b.dataset.d.split(':'); Audio.sfx('ui');
      if (a === 'bye') this.closePanel();
      else if (a === 'shop') this.openPanel('shop', { shop: id, tab: 'buy' });
      else if (a === 'bless') { const d = today(); if (S.kumanDay === d) { this.panelOpt = { npc: o.npc, text: 'วันนี้หนูให้พรไปแล้วนะ พรุ่งนี้ค่อยมาใหม่น้า' }; } else { S.kumanDay = d; Game.addBuff('luck', 900); this.panelOpt = { npc: o.npc, text: 'เพี้ยง! ขอให้พี่โชคดี ดรอปของดีๆ ตลอด 15 นาทีเลยนะ' }; Particles.ring(Player.x, 1, Player.z, 1.2, 30, [1, .85, .3], 1, .45); Audio.sfx('level'); } this.renderPanel(); }
      else if (a === 'ghostbook') this.openPanel('ghost');
      else if (a === 'jobs') this.openPanel('jobs');
      else if (a === 'ritual') { this.closePanel(); JobSys.ritual(); }
      else if (a === 'turn') { Quests.turnIn(id); this.panelOpt = { npc: o.npc, text: QUESTS[id].done || 'ขอบใจมาก!' }; this.renderPanel(); }
      else if (a === 'next') { this.panelOpt = { npc: o.npc }; this.renderPanel(); }
      else if (a === 'acc') {
        if (QUESTS[id].obj[0].k === 'quiz') { this.closePanel(); this.dailyQuiz(id); }
        else { Quests.accept(id); this.closePanel(); }
      }
    };
  },
  dailyQuiz(id) {
    Quests.accept(id);
    Quiz.run({
      title: 'บททดสอบของนักปราชญ์', sub: 'ตอบให้ถูกมากที่สุด 5 ข้อ', count: 5, time: Settings.d.qtime, mode: 'daily',
      onEach: ok => { if (ok) { const s = Quests.st(id); s.k.quiz = (s.k.quiz || 0) + 1; } },
      onEnd: r => {
        const s = Quests.st(id); s.s = 'done'; s.day = today();
        const xp = r.correct * 15, coin = r.correct * 10 + (r.correct === 5 ? 50 : 0); Season.addXP(QUEST_SXP.daily, 'บททดสอบนักปราชญ์'); Season.bump('quest');
        if (xp) Game.gainXP(xp); if (coin) Game.gainCoins(coin); JobSys.onDaily(r.correct);
        this.banner(`ตอบถูก ${r.correct}/5`, r.correct >= 3 ? 'level' : 'buff');
        this.toast(`บททดสอบเสร็จสิ้น: ได้ ${xp} XP และ ${coin} เหรียญ`, 'quest'); this.refreshTracker(); Game.autosave();
      }
    });
  },
  pShop(o) {
    const S = Save.d; const list = (SHOPS[o.shop] || SHOPS.items)[2](); const tab = o.tab || 'buy';
    let rows;
    if (tab === 'buy') rows = list.map(id => {
      const it = ITEMS[id]; const owned = (it.kind === 'gear' || it.kind === 'cos') && S.inv[id]; const lock = it.lvl && S.level < it.lvl;
      return `<li class="hasinfo" data-info="${id}">${this.itemIcon(id)}<div class="in"><b>${it.name}</b><small>${it.desc}</small></div><span class="price">${icon('coin')}${it.price}</span>${owned ? '<span class="qty">มีแล้ว</span>' : `<button class="btn sm" data-buy="${id}" ${S.coins < it.price ? 'disabled' : ''}>${lock ? 'ซื้อ (Lv.' + it.lvl + ')' : 'ซื้อ'}</button>`}</li>`;
    }).join('');
    else {
      const ids = Object.keys(S.inv).filter(id => { const it = ITEMS[id]; if (!it || it.quest) return false; if (it.kind === 'cos') return false; if (it.kind === 'gear' && S.equip[it.slot] === id) return false; return (it.sell || it.price) > 0; });
      rows = ids.map(id => { const it = ITEMS[id]; const pr = it.sell || Math.floor(it.price / 2); return `<li class="hasinfo" data-info="${id}">${this.itemIcon(id)}<div class="in"><b>${it.name}</b><small>มี ×${S.inv[id]}</small></div><span class="price">${icon('coin')}${pr}</span><button class="btn sm" data-sell="${id}">ขาย 1</button></li>`; }).join('') || '<li class="emptyrow">ไม่มีของที่ขายได้ (ของที่สวมอยู่และของแต่งตัวขายไม่ได้)</li>';
    }
    this.setPanel(`${(SHOPS[o.shop] || SHOPS.items)[0]} <span class="coin">${icon('coin')}${fmt(S.coins)}</span>`,
      `<div class="tabs"><button class="tab ${tab === 'buy' ? 'on' : ''}" data-tab="buy">ซื้อ</button>${(SHOPS[o.shop] || SHOPS.items)[3] ? `<button class="tab ${tab === 'sell' ? 'on' : ''}" data-tab="sell">ขาย</button>` : ''}</div><ul class="ilist">${rows}</ul>${o.shop === 'tailor' ? '<p class="muted">ของแต่งตัวเปลี่ยนรูปลักษณ์ทันทีที่สวมใส่ บางชิ้นเพิ่มความเร็วเล็กน้อย</p>' : ''}`, true);
    this.el.pbody.onclick = e => {
      const t = e.target.closest('[data-tab]'); if (t) { this.panelOpt.tab = t.dataset.tab; this.renderPanel(); return; }
      const b = e.target.closest('[data-buy]'); if (b) { const id = b.dataset.buy, it = ITEMS[id]; if (S.coins < it.price) return; S.coins -= it.price; Game.addItem(id, 1, true); Audio.sfx('coin'); this.toast('ซื้อ ' + it.name + ' แล้ว', 'item'); if (it.kind === 'cos' || it.kind === 'gear') { Game.equip(id); this.toast('สวมใส่ ' + it.name + ' แล้ว', 'quest'); } this.renderPanel(); return; }
      const s = e.target.closest('[data-sell]'); if (s) { const id = s.dataset.sell, it = ITEMS[id]; const pr = it.sell || Math.floor(it.price / 2); Game.addItem(id, -1, true); S.coins += pr; Audio.sfx('coin'); this.renderPanel(); }
    };
  },
  /* ---------- quiz ---------- */
  quizShow(cfg, q, idx, res, cb) {
    const el = this.el.quiz; el.hidden = false; this.quizOpen = true; this.quizCb = null; this.curQ = q; Input.release(); Player.moveTo = null;
    if (this.panelOpen) { this.panelOpen = null; this.el.panel.hidden = true; Game.pause(false, 'panel'); }
    const cat = QCATS[q.cat] || QCATS.gen; const total = cfg.count;
    el.innerHTML = `<div class="qwin ${cfg.mode}"><header><span class="qcat" style="--c:${cat.col}">${cat.name}</span><h3>${cfg.title}</h3><p>${cfg.sub}</p>
      ${total > 1 ? `<div class="qdots">${Array.from({ length: total }, (_, i) => `<i class="${i < idx ? (i < res.correct + res.wrong ? 'd' : '') : i === idx ? 'cur' : ''}"></i>`).join('')}</div>` : ''}</header>
      <div class="qtimer"><i></i></div><p class="qq">${esc(q.q)}</p>
      <div class="qopts">${q.opts.map((o, i) => `<button class="qo" data-i="${i}"><kbd>${i + 1}</kbd><span>${esc(o)}</span></button>`).join('')}</div><p class="qfb" aria-live="polite"></p></div>`;
    const dots = el.querySelectorAll('.qdots i'); for (let i = 0; i < idx; i++) dots[i] && dots[i].classList.add('ok');
    const bar = el.querySelector('.qtimer i'); const T = cfg.time; let left = T; let done = false;
    const finish = (i) => {
      if (done) return; done = true; clearInterval(this.qInt);
      const ok = i >= 0 && q.opts[i] === q.a; const btns = el.querySelectorAll('.qo');
      btns.forEach((b, j) => { b.disabled = true; if (q.opts[j] === q.a) b.classList.add('right'); else if (j === i) b.classList.add('wrong'); });
      el.querySelector('.qfb').innerHTML = ok ? '<b class="ok">ถูกต้อง!</b>' : (i < 0 ? '<b class="no">หมดเวลา!</b> ' : '<b class="no">ยังไม่ถูก</b> ') + (ok ? '' : `คำตอบคือ "${esc(q.a)}"`);
      cb(ok);
    };
    this.quizPickFn = finish;
    el.querySelector('.qopts').onclick = e => { const b = e.target.closest('.qo'); if (b) finish(+b.dataset.i); };
    bar.style.width = '100%';
    this.qInt = setInterval(() => { left -= .1; bar.style.width = Math.max(0, left / T * 100) + '%'; bar.classList.toggle('low', left < T * .3); if (left <= 0) finish(-1); }, 100);
  },
  quizPick(i) { if (this.quizPickFn) this.quizPickFn(i); },
  quizHide() { this.el.quiz.hidden = true; this.quizOpen = false; this.quizPickFn = null; clearInterval(this.qInt); },
  /* ---------- summary ---------- */
  summary(kind) {
    const S = Save.d, R = Game.run; this.summaryOpen = true; Game.pause(true, 'summary'); this.haltPlayer();
    const kills = S.stats.kills - R.k0; const mins = Math.max(1, Math.round((performance.now() - R.t0) / 60000));
    const drops = R.drops.length ? R.drops.map(id => `<li class="hasinfo" data-info="${id}">${this.itemIcon(id)}${ITEMS[id].name}</li>`).join('') : '<li class="emptyrow">ไม่มีไอเทมหายากในรอบนี้</li>';
    const el = this.el.summary; el.hidden = false;
    el.innerHTML = `<div class="sumwin ${kind}"><img src="${this.bodies[Player.sheet + (kind === 'victory' ? '' : '')]}" alt="" class="${kind}">
      <div><p class="eyebrow">${kind === 'victory' ? 'ภารกิจหลักสำเร็จ' : 'Game Over'}</p><h2>${kind === 'victory' ? 'ผู้พิทักษ์แห่ง Aurelion' : 'คุณหมดสติไปแล้ว...'}</h2>
      <p>${kind === 'victory' ? 'คุณปราบคราก ผู้พิทักษ์ผลึกได้สำเร็จ เมือง Aurelion กลับมาสงบสุขอีกครั้ง' : 'ทหารเมือง Aurelion พาคุณกลับมาพักฟื้นที่จัตุรัสเมือง ของทุกชิ้นยังอยู่ครบ'}</p>
      <dl class="sumstats"><div><dt>XP ที่ได้</dt><dd>${fmt(R.xp)}</dd></div><div><dt>เหรียญที่ได้</dt><dd>${fmt(R.coins)}</dd></div><div><dt>มอนสเตอร์ที่ปราบ</dt><dd>${kills}</dd></div><div><dt>เวลา</dt><dd>${mins} นาที</dd></div></dl>
      <h4>ไอเทมหายากที่ได้</h4><ul class="drops">${drops}</ul>
      <div class="row">${kind === 'defeat' && S.inv.feather ? `<button class="btn" id="sum-feather">${icon('feather')} ใช้ขนนกฟีนิกซ์ ฟื้นที่เดิม (มี ${S.inv.feather})</button>` : ''}${kind === 'victory' ? '<button class="btn primary" id="sum-go">สำรวจทวีปต่อ</button><button class="btn" id="sum-town">กลับเมืองหลวง</button>' : '<button class="btn primary" id="sum-town">เกิดใหม่ที่เมืองหลวง</button>'}</div></div></div>`;
    const close = () => { el.hidden = true; this.summaryOpen = false; Game.pause(false, 'summary'); };
    const fe = $('#sum-feather'); if (fe) fe.onclick = () => { close(); Game.reviveHere(); };
    const g = $('#sum-go'); if (g) g.onclick = () => { close(); Game.run = { xp: 0, coins: 0, kills: 0, drops: [], t0: performance.now(), k0: S.stats.kills }; };
    $('#sum-town').onclick = () => { close(); if (kind === 'defeat') Game.respawn(); else { Game.run = { xp: 0, coins: 0, kills: 0, drops: [], t0: performance.now(), k0: S.stats.kills }; Game.teleport(9, 70, 'เมืองหลวง Aurelion'); } };
  }
};

