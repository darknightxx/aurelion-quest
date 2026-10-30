/* ============================================================
   Front page (lobby), character slots, loading, landscape
   ============================================================ */
const EVENT = { name: 'เทศกาลฮาโลวีนแห่งสยาม', start: new Date(2026, 9, 24).getTime(), end: new Date(2026, 10, 1, 23, 59).getTime(), xpMul: 2 };
const eventOn = () => { const n = Date.now(); return n >= EVENT.start && n <= EVENT.end; };
const LOGIN_REWARDS = [
  { label: 'เหรียญ 300', c: 300 }, { label: 'ยาฟื้นพลัง ×5', it: [['hp_s', 5]] }, { label: 'เพชร 20', g: 20 }, { label: 'ยามานา ×5', it: [['mp_s', 5]] },
  { label: 'ตำราพลังแฝง', it: [['statbook', 1]] }, { label: 'เพชร 50', g: 50 }, { label: 'ขนนกฟีนิกซ์ + เพชร 80', it: [['feather', 1]], g: 80, big: true }
];
const ANNOUNCE = [
  { tag: 'กิจกรรม', title: 'เทศกาลฮาโลวีน: EXP ×2 จากทุกแหล่ง', body: 'ตั้งแต่วันนี้ถึง 1 พ.ย. 2569 ได้รับ EXP เป็น 2 เท่า (รวมกับใบคูณ EXP ได้) และมีฟักทองแสงจันทร์ประดับทั่วเมืองสยาม', date: '29 ต.ค. 2569', hot: true },
  { tag: 'ซีซั่นใหม่', title: 'Season Pass ซีซั่น 1: เสียงเพรียกแห่งผลึก เปิดแล้ว', body: 'เลเวล 1–50 พร้อมรางวัลแทร็กฟรี ธรรมดา และพรีเมียม ทำเควสและภารกิจซีซั่นเพื่อเลื่อนเลเวล รางวัลสูงสุดคือปีกผลึกสวรรค์ ซีซั่นจบ 31 ธ.ค. 2569', date: '29 ต.ค. 2569' },
  { tag: 'แจ้งให้ทราบ', title: 'ร้านเพชรและการเติมเพชรอยู่ในโหมดทดลอง', body: 'ทุกการเติมเงินในเวอร์ชันนี้เป็นการจำลอง ไม่มีการเชื่อมต่อระบบชำระเงินและไม่มีการตัดเงินจริง', date: '29 ต.ค. 2569' }
];
const PATCH = [
  { d: '29/10', ic: 'book', t: 'ระบบสกิลตาม 4 สายบทบาท', x: 'แทงค์ / โจมตีประชิด / ระยะไกล-เวท / ซัพพอร์ต อาชีพละ 4 สกิล (Q E R T) + สกิลใหญ่ตอบคำถาม (X) ทุกสกิลมีรูปประจำ แตะค้างเพื่อดูรายละเอียด อัปเลเวลสกิลได้ถึง 5 ด้วยแต้มสกิล มีความสามารถติดตัวตามบทบาท' },
  { d: '29/10', ic: 'star', t: 'สถานะผิดปกติ: พิษ ช้าลง คำสาป', x: 'มอนสเตอร์บางชนิดทำให้ติดพิษหรือช้าลง บอสสาปลดพลังโจมตี ใช้สกิลชำระล้างของนักบวชเพื่อลบสถานะ' },
  { d: '29/10', ic: 'paw', t: 'สัตว์ขี่ 13 ชนิด', x: 'ฉลาม แมว สิงโต นกกระจอกเทศ กระต่าย มังกร แพนด้า ยูนิคอร์น เต่า กบ เพนกวิน จิ้งจอก ช้าง แต่ละตัวมีความเร็ว ความสามารถพิเศษ และสกิลต่อสู้ของตัวเอง (V ขี่ / G สกิล)' },
  { d: '29/10', ic: 'bag', t: 'แตะไอเทมเพื่อดูรายละเอียดและแหล่งที่ได้', x: 'บอกค่าพลัง เทียบกับของที่สวมอยู่ และบอกว่าได้จากมอนสเตอร์ ร้าน เควส หรือกิจกรรมไหน พร้อมปุ่มนำทาง' },
  { d: '29/10', ic: 'phone', t: 'UI มือถือแนวนอนกระชับขึ้น + เลื่อนหน้าต่างได้', x: 'ปุ่มและแผงข้อมูลเล็กลงให้เห็นฉากกว้าง แตะค้างแล้วลากเพื่อเลื่อนรายการในทุกหน้าต่าง' },
  { d: '29/10', ic: 'pass', t: 'Season Pass เลเวล 1–50 สามแทร็ก', x: 'รับ Season XP จากเควส การปราบมอนสเตอร์ การตอบคำถาม และภารกิจซีซั่นรายวัน/รายสัปดาห์ ปลดล็อกเลเวลด้วยเพชรได้' },
  { d: '29/10', ic: 'gem', t: 'ร้านเพชร + หน้าเติมเพชรพร้อมโปรโมชั่น (ทดลอง)', x: 'เติมครั้งแรก ×2 ทุกแพ็ก แพ็กมือใหม่ บัตรรายเดือน รางวัลเติมสะสม ลดราคาประจำสัปดาห์ และลองใส่ของแต่งตัว 2 นาที' },
  { d: '29/10', ic: 'map', t: 'นำทางอัตโนมัติจากรายการเควส', x: 'แตะเควสเพื่อเดินไปเอง หาทางอ้อมสิ่งกีดขวาง ล่ามอนสเตอร์อัตโนมัติจนครบเป้าหมาย แล้วกลับไปส่งเควส' },
  { d: '29/10', ic: 'pause', t: 'เปิดเมนูแล้วเกมหยุดทั้งโลก', x: 'ตัวละคร มอนสเตอร์ กล้อง และเอฟเฟกต์หยุดนิ่งเมื่อเปิดหน้าต่างใดๆ ปุ่มที่ค้างไว้จะถูกล้าง' },
  { d: '29/10', ic: 'person', t: 'ตัวละครโมเดล 3D ทั้ง 6 อาชีพ', x: 'มีโครงกระดูก ท่าเดิน วิ่ง หายใจ กระพริบตา ผ้าคลุมพลิ้ว และท่าออกสกิลแบบง้าง-ปล่อย-ตามตัว' },
  { d: '29/10', ic: 'star', t: 'เสียงตัวละครและเอฟเฟกต์สกิลใหม่', x: 'ตะโกนตอนใช้สกิล พากย์ชื่อสกิลใหญ่ รอยฟันโค้ง เสาแสง อุกกาบาต หนามน้ำแข็ง ฝนลูกศร และเงาตามตัว' },
  { d: '29/10', ic: 'phone', t: 'หน้าแรกใหม่ + 3 ช่องตัวละคร + หมุนแนวนอนอัตโนมัติ', x: 'บนมือถือ เมื่อกดเริ่มเกมจะเข้าเต็มจอแนวนอนให้เอง' },
  { d: '28/10', ic: 'sword', t: 'เปิดทดลองเล่นแดนสยาม', x: 'เควสหลัก 3 บท บอสยักษ์ศิลา ระบบตอบคำถาม 6 หมวด และคำถามของครูเพิ่มเองได้' }
];
const DOCS = {
  support: ['ช่วยเหลือ', '<p>ติดปัญหาในเกม ลองดูหัวข้อ <b>วิธีเล่น</b> ในเมนูก่อน หากเกมค้างให้กด "บันทึกและกลับหน้าแรก" แล้วเข้าใหม่ ข้อมูลตัวละครบันทึกไว้ในเบราว์เซอร์ของเครื่องนี้</p><p>ถ้าภาพไม่ขึ้น ลองเปิดด้วย Chrome, Edge, Safari หรือ Firefox รุ่นล่าสุด</p>'],
  faq: ['คำถามที่พบบ่อย', '<dl class="faq"><dt>เซฟเกมเก็บไว้ที่ไหน?</dt><dd>ในเบราว์เซอร์ของอุปกรณ์นี้ ถ้าล้างข้อมูลเว็บหรือเปลี่ยนเครื่อง ตัวละครจะหายไป</dd><dt>เติมเพชรเสียเงินจริงไหม?</dt><dd>ไม่ เวอร์ชันนี้เป็นโหมดทดลอง ไม่มีการตัดเงิน</dd><dt>ตัวเลขผู้เล่นออนไลน์มาจากไหน?</dt><dd>ทุกเครื่องที่เปิดเกมจะส่งรหัสสุ่มกับเวลาล่าสุดไปนับรวม ไม่มีชื่อหรือข้อมูลส่วนตัว ปิดเกมแล้วจะหายจากการนับภายใน 1–2 นาที</dd><dt>เพิ่มคำถามเองได้ไหม?</dt><dd>ได้ ที่ ตั้งค่า → คำถามของฉัน</dd><dt>ทำไมเกมหมุนจอ?</dt><dd>บนมือถือ เกมจะเล่นในแนวนอนเพื่อให้เห็นฉากกว้างขึ้น ถ้าเครื่องไม่รองรับการล็อกจอ เกมจะหมุนภาพให้เอง</dd></dl>'],
  terms: ['ข้อตกลงการใช้งาน', '<p>สยาม RPG เป็นเกมเพื่อการเรียนรู้เวอร์ชันทดลองเล่น ใช้เพื่อความบันเทิงและการศึกษา ระบบร้านค้าและการเติมเงินทั้งหมดเป็นการจำลอง ไม่มีธุรกรรมทางการเงินจริง เนื้อหาและระบบอาจเปลี่ยนแปลงได้โดยไม่ต้องแจ้งล่วงหน้า</p>'],
  privacy: ['ความเป็นส่วนตัว', '<p>เกมนี้ไม่เก็บข้อมูลส่วนตัวของคุณไว้ที่เซิร์ฟเวอร์ ชื่อตัวละคร ความคืบหน้า และการตั้งค่าบันทึกเฉพาะในเบราว์เซอร์ของอุปกรณ์นี้ (localStorage) และลบได้จากหน้าเลือกตัวละครหรือการตั้งค่า</p>']
};

/* ---------- landscape handling ---------- */
const Rot = {
  on: false, want: false, W: innerWidth, H: innerHeight,
  // real visible viewport (excludes mobile browser toolbars; 100vh does not)
  measure() { const de = document.documentElement; const W = Math.round(Math.min(innerWidth, de.clientWidth || innerWidth)), H = Math.round(Math.min(innerHeight, de.clientHeight || innerHeight)); if (W === this.W && H === this.H && de.style.getPropertyValue('--vw')) return false; this.W = W; this.H = H; de.style.setProperty('--vw', W + 'px'); de.style.setProperty('--vh', H + 'px'); window.scrollTo(0, 0); return true; },
  async enter() {
    this.want = true;
    const touch = matchMedia('(pointer: coarse)').matches;
    if (touch) {
      try { if (!document.fullscreenElement && document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen({ navigationUI: 'hide' }); } catch (e) { }
      try { if (screen.orientation && screen.orientation.lock) await screen.orientation.lock('landscape'); } catch (e) { }
    }
    setTimeout(() => this.check(), 350);
  },
  exit() { this.want = false; this.set(false); try { if (screen.orientation && screen.orientation.unlock) screen.orientation.unlock(); } catch (e) { } },
  check() {
    const ch = this.measure(); const portrait = this.H > this.W * 1.05; const touch = matchMedia('(pointer: coarse)').matches || this.W < 600;
    this.set(this.want && portrait && touch); if (ch) setTimeout(() => Game.R && Game.R.resize(), 30);
  },
  set(v) { if (this.on !== v) { this.on = v; document.body.classList.toggle('rot', v); setTimeout(() => Game.R && Game.R.resize(), 30); } this.compact(); },
  compact() { const w = this.on ? this.H : this.W, h = this.on ? this.W : this.H; document.body.classList.toggle('compact', h <= 540 && w > h); },
  // client -> app-local coordinates
  map(x, y) { return this.on ? { x: y, y: this.W - x } : { x, y }; },
  delta(dx, dy) { return this.on ? { dx: dy, dy: -dx } : { dx, dy }; }
};
addEventListener('resize', () => Rot.check());
if (window.visualViewport) visualViewport.addEventListener('resize', () => Rot.check());
Rot.measure(); Rot.compact();
setInterval(() => { if (Rot.measure()) Rot.check(); }, 700);
addEventListener('orientationchange', () => setTimeout(() => Rot.check(), 200));

/* ---------- lobby ---------- */
const Lobby = {
  tab: 'ann', sel: null,
  progress(p, text) { const b = $('#ldbar'), t = $('#ldtext'); if (b) b.style.width = Math.round(p * 100) + '%'; if (t) t.textContent = `${text}… ${Math.round(p * 100)}%`; },
  show() {
    Save.migrate();
    $('#lobby').hidden = false; $('#charsel').hidden = true; $('#title').hidden = true; $('#hud').hidden = true;
    const n = Save.list().filter(Boolean).length;
    $('#lbwho').textContent = n ? `มีตัวละคร ${n} ตัวในอุปกรณ์นี้` : 'เล่นบนอุปกรณ์นี้ · บันทึกในเบราว์เซอร์';
    let seen = 0; try { seen = +(localStorage.getItem('siam_ann_seen') || 0); } catch (e) { }
    const unread = Math.max(0, ANNOUNCE.length - seen); const bd = $('#annbadge'); bd.textContent = unread; bd.hidden = !unread;
    this.render();
    $('#lobby').onclick = e => {
      const t = e.target.closest('[data-lt]'); if (t) { this.tab = t.dataset.lt; if (this.tab === 'ann') this.markRead(); Audio.init(); Audio.sfx('ui'); return this.render(); }
      const pi = e.target.closest('[data-pi]'); if (pi) { pi.parentElement.classList.toggle('open'); return; }
      const d = e.target.closest('[data-doc]'); if (d) return this.doc(d.dataset.doc);
      const l = e.target.closest('[data-link]'); if (l) { const k = l.dataset.link; if (k === 'patch') { this.tab = 'patch'; return this.render(); } if (k === 'help' || k === 'settings') return UI.openPanel(k); return this.doc(k); }
    };
    $('#lbstart').onclick = () => { Audio.init(); Audio.sfx('ui'); this.charSel(); };
    $('#lbgift').onclick = () => { Audio.init(); this.gifts(); };
    $('#lbgear').onclick = () => UI.openPanel('settings');
    this.markRead(true);
  },
  markRead(onlyIfAnn) { if (onlyIfAnn && this.tab !== 'ann') return; try { localStorage.setItem('siam_ann_seen', ANNOUNCE.length); } catch (e) { } },
  render() {
    document.querySelectorAll('.lbtab').forEach(b => { b.classList.toggle('on', b.dataset.lt === this.tab); b.setAttribute('aria-selected', b.dataset.lt === this.tab); });
    const B = $('#lbbody'); let h = '';
    if (this.tab === 'ann') {
      if (eventOn()) h += `<div class="evbar">${icon('star')} ${EVENT.name}: EXP ×${EVENT.xpMul} ถึง 1 พ.ย. 2569</div>`;
      h += `<h4 class="lbsec">ข่าวล่าสุด</h4>` + ANNOUNCE.map(a => `<article class="ann ${a.hot ? 'hot' : ''}"><span class="atag">${a.tag}</span><h3>${a.title}</h3><p>${a.body}</p>${a.date ? `<small>ลงข่าวเมื่อ ${a.date}</small>` : ''}</article>`).join('');
    } else if (this.tab === 'patch') {
      h = `<ul class="patch">${PATCH.map((p, i) => `<li><button class="prow" data-pi="${i}"><span class="pd">${p.d}</span>${icon(p.ic in ICONS ? p.ic : 'star')}<span class="pt">${p.t}</span><span class="pc" aria-hidden="true">▾</span></button><p class="px">${p.x}</p></li>`).join('')}</ul>`;
    } else {
      const card = (k, ic, t, s, cls = '') => `<button class="lnk ${cls}" data-link="${k}">${icon(ic)}<span><b>${t}</b><small>${s}</small></span><i aria-hidden="true">↗</i></button>`;
      h = `<h4 class="lbsec">คู่มือและข้อมูล</h4><div class="lnks">${card('help', 'book', 'วิธีเล่น / คู่มือเกม', 'การควบคุม ระบบคำถาม และบอส')}${card('faq', 'help', 'FAQ', 'คำถามที่ผู้เล่นถามบ่อย')}${card('patch', 'scroll', 'บันทึกอัปเดต', 'สิ่งใหม่ทั้งหมดในเวอร์ชันนี้')}${card('settings', 'gear', 'ตั้งค่า', 'เสียง การควบคุม และคำถามของครู')}</div>
        <h4 class="lbsec">ชุมชน</h4><div class="lnks">${card('support', 'person', 'กลุ่มผู้เล่น', 'ยังไม่เปิด จะประกาศช่องทางเร็วๆ นี้', 'comm')}${card('support', 'help', 'แจ้งปัญหา', 'วิธีแก้ปัญหาเบื้องต้น', 'comm2')}</div>`;
    }
    B.innerHTML = h; B.scrollTop = 0;
  },
  doc(k) { const d = DOCS[k]; if (!d) return; UI.openPanel('doc', { title: d[0], html: d[1] }); },
  gifts() {
    const rows = LOGIN_REWARDS.map((r, i) => `<li class="${r.big ? 'big' : ''}"><span class="gd">วันที่ ${i + 1}</span>${r.g && !r.it ? gemSvg() : r.it ? UI.itemIcon(r.it[0][0]) : icon('coin')}<b>${r.label}</b></li>`).join('');
    UI.openPanel('doc', { title: 'ของขวัญล็อกอิน & กิจกรรม', html: `${eventOn() ? `<div class="evbar">${icon('star')} ${EVENT.name}: EXP ×${EVENT.xpMul} ทุกตัวละคร ถึง 1 พ.ย. 2569</div>` : ''}<p>เข้าเกมวันละครั้งเพื่อรับของขวัญตามลำดับวัน ครบ 7 วันแล้ววนใหม่ ถ้าขาดเกิน 1 วันจะเริ่มนับวันที่ 1 ใหม่ (รับแยกตามตัวละคร)</p><ul class="gifts">${rows}</ul>` });
  },
  /* ---------- character select ---------- */
  charSel() {
    $('#lobby').hidden = true; $('#title').hidden = true; $('#charsel').hidden = false;
    const L = Save.list(); this.sel = L.findIndex(Boolean); if (this.sel < 0) this.sel = null;
    const paint = () => {
      $('#cscount').textContent = `${L.filter(Boolean).length}/3`;
      $('#csslots').innerHTML = L.map((d, i) => d ? `<button class="slot full ${this.sel === i ? 'on' : ''}" data-slot="${i}"><span class="slv">Lv.${d.level}</span><img src="${UI.bodies[(d.cos && d.cos.outfit) ? ITEMS[d.cos.outfit].sheet : d.cls]}" alt=""><b class="snm">${esc(d.name)}</b><span class="scl">${(d.job && JOBS[d.job] ? (d.awk ? 'ผู้ตื่นรู้ ' : '') + JOBS[d.job].name : CLASSES[d.cls].name)}</span><small>${d.title ? '「' + esc(d.title) + '」' : World.placeName(d.pos.x, d.pos.z)}</small></button>`
        : `<button class="slot empty" data-new="${i}"><span class="slv">ช่องว่าง</span><span class="plus" aria-hidden="true">+</span><b class="snm">สร้างตัวละคร</b><small>เริ่มที่เลเวล 1</small></button>`).join('');
      $('#csstart').disabled = this.sel === null; const del = $('#csdel'); del.disabled = this.sel === null; del.textContent = 'ลบตัวละคร'; delete del.dataset.c;
    };
    paint();
    $('#csslots').onclick = e => {
      const s = e.target.closest('[data-slot]'); if (s) { this.sel = +s.dataset.slot; Audio.sfx('ui'); paint(); if (e.detail === 2) this.play(); return; }
      const n = e.target.closest('[data-new]'); if (n) { Audio.sfx('ui'); this.create(+n.dataset.new); }
    };
    $('#csstart').onclick = () => this.play();
    $('#csdel').onclick = () => { const b = $('#csdel'); if (this.sel === null) return; if (!b.dataset.c) { b.dataset.c = 1; b.textContent = `กดอีกครั้งเพื่อลบ ${L[this.sel].name}`; return; } Save.slot = this.sel; Save.wipe(); this.charSel(); };
    $('#csback').onclick = () => this.show();
  },
  create(slot) { Save.slot = slot; $('#charsel').hidden = true; UI.showTitle(); },
  play() { if (this.sel === null) return; Save.slot = this.sel; if (!Save.load()) return; Audio.init(); this.go(() => Game.start(Save.d)); },
  go(fn) { $('#charsel').hidden = true; $('#title').hidden = true; $('#lobby').hidden = true; Rot.enter(); UI.fade(fn); }
};

Object.assign(UI, {
  pDoc(o) { this.setPanel(o.title, `<div class="docbody">${o.html}</div>`); this.el.pbody.onclick = null; }
});

/* ---------- touch scrolling while the app is rotated ----------
   Native touch scrolling follows the physical screen axes, which are
   swapped when we rotate #app, so drag-scroll is done here instead. */
const RotScroll = {
  d: null, v: [0, 0], raf: 0, block: 0,
  scroller(el) {
    for (; el && el.id !== 'app'; el = el.parentElement) {
      const cs = getComputedStyle(el); const oy = /(auto|scroll)/.test(cs.overflowY) && el.scrollHeight > el.clientHeight + 1; const ox = /(auto|scroll)/.test(cs.overflowX) && el.scrollWidth > el.clientWidth + 1;
      if (oy || ox) return el;
    }
    return null;
  },
  init() {
    const app = document.getElementById('app');
    app.addEventListener('pointerdown', e => {
      if (!Rot.on || e.pointerType === 'mouse' || e.target.closest('#gl, #joy, #skillbar, #mountbtns')) return;
      const el = this.scroller(e.target); if (!el) return;
      cancelAnimationFrame(this.raf); const p = Rot.map(e.clientX, e.clientY);
      this.d = { el, id: e.pointerId, x: p.x, y: p.y, sx: p.x, sy: p.y, moved: false, t: performance.now() }; this.v = [0, 0];
    }, true);
    addEventListener('pointermove', e => {
      const d = this.d; if (!d || e.pointerId !== d.id) return;
      const p = Rot.map(e.clientX, e.clientY); const dx = p.x - d.x, dy = p.y - d.y; d.x = p.x; d.y = p.y;
      if (!d.moved && Math.hypot(p.x - d.sx, p.y - d.sy) > 7) d.moved = true;
      if (!d.moved) return;
      const now = performance.now(), dt = Math.max(1, now - d.t); d.t = now;
      d.el.scrollTop -= dy; d.el.scrollLeft -= dx; this.v = [this.v[0] * .6 + dx / dt * .4, this.v[1] * .6 + dy / dt * .4];
      e.preventDefault();
    }, { passive: false });
    const end = e => {
      const d = this.d; if (!d || e.pointerId !== d.id) return; this.d = null;
      if (!d.moved) return;
      this.block = performance.now() + 350; // swallow the click that follows a drag
      let [vx, vy] = this.v; let last = performance.now();
      const step = now => { const dt = now - last; last = now; d.el.scrollTop -= vy * dt; d.el.scrollLeft -= vx * dt; const k = Math.pow(.994, dt); vx *= k; vy *= k; if (Math.hypot(vx, vy) > .02) this.raf = requestAnimationFrame(step); };
      this.raf = requestAnimationFrame(step);
    };
    addEventListener('pointerup', end); addEventListener('pointercancel', end);
    addEventListener('click', e => { if (performance.now() < this.block) { e.stopPropagation(); e.preventDefault(); this.block = 0; } }, true);
  }
};

