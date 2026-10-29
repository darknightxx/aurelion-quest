/* ============================================================
   Temple UI: item icons & lore, NPC portraits, temple map,
   ghost bestiary "ตำราผีไทย"
   ============================================================ */
Object.assign(ICONS, {
  ghost: '<path d="M5 21V10a7 7 0 0 1 14 0v11l-2.3-2-2.4 2-2.3-2-2.3 2-2.4-2z" fill="currentColor"/><circle cx="9.5" cy="10.5" r="1.5" fill="#1d1712"/><circle cx="14.5" cy="10.5" r="1.5" fill="#1d1712"/>',
  potW: '<path d="M9 3h6M10 3v5l-4 6a5 5 0 0 0 4 8h4a5 5 0 0 0 4-8l-4-6V3" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M7 15h10a5 5 0 0 1-3.5 6h-3A5 5 0 0 1 7 15z" fill="#bfe6ff"/><path d="M12 9l1 2h-2z" fill="#e2b54a"/>',
  incense: '<path d="M8 20h8l-1-5H9z" fill="#8a6a3a"/><path d="M10 15V4M12 15V3M14 15V5" stroke="#c8342a" stroke-width="1.4"/><path d="M10 4c-1-1 0-2 0-3M12 3c1-1 0-2 1-3M14 5c1-1 0-2 0-3" stroke="#c8c4cc" stroke-width="1" fill="none"/>',
  yant: '<path d="M8 3 4 6l2 4 2-1v12h8V9l2 1 2-4-4-3-2 2h-4z" fill="#e8dcc0"/><path d="M9 11h6M9 14h6M12 9v8M10 17l4-6" stroke="#b8282a" stroke-width="1"/>',
  takrut: '<path d="M12 2v5" stroke="#f4f0e6" stroke-width="1.6"/><rect x="9" y="7" width="6" height="14" rx="3" fill="#c8a050"/><path d="M9 10h6M9 13h6M9 16h6M9 19h6" stroke="#f4f0e6" stroke-width="1.2"/>',
  pin: '<path d="M6 21 17 6" stroke="#d9a845" stroke-width="2.2" stroke-linecap="round"/><circle cx="18" cy="5" r="3" fill="#e2b54a"/><circle cx="18" cy="5" r="1.3" fill="#c8323a"/>',
  takhon: '<path d="M5 9a7 7 0 0 1 14 0v5a7 6 0 0 1-14 0z" fill="#e8d24a"/><path d="M6 6h12l-2-4H8z" fill="#c8a86a"/><circle cx="9" cy="10" r="2" fill="#fff"/><circle cx="15" cy="10" r="2" fill="#fff"/><circle cx="9" cy="10" r=".9" fill="#16141a"/><circle cx="15" cy="10" r=".9" fill="#16141a"/><path d="M12 11c0 4 3 6 5 5" stroke="#d8323a" stroke-width="2" fill="none" stroke-linecap="round"/>',
  chada: '<path d="M7 20h10l-1-4H8z" fill="#b8862e"/><path d="M8 16h8l-1-4H9zM9 12h6l-1-4h-4zM10 8h4L12 1z" fill="#e2b54a"/>',
  soul: '<circle cx="12" cy="13" r="5" fill="#8fd8ff" opacity=".85"/><path d="M12 8c-2-2-1-5 1-6 0 2 3 3 2 6" fill="#c8f0ff"/><circle cx="5" cy="7" r="1.5" fill="#bfe6ff"/><circle cx="19" cy="9" r="1.2" fill="#bfe6ff"/>',
  cloth: '<path d="M5 4h14l-2 16H7z" fill="#e4dfd2"/><path d="M8 8h8M8 12h8" stroke="#a89a80" stroke-width="1"/>',
  wisp: '<path d="M12 21a5 5 0 0 1-5-5c0-4 5-6 4-13 4 3 7 7 6 11a5 5 0 0 1-5 7z" fill="#7ff0c8"/><circle cx="12" cy="16" r="2" fill="#d8fff0"/>',
  leaf: '<path d="M4 20C6 9 12 4 20 4c-1 9-6 15-16 16z" fill="#5aa040"/><path d="M4 20 16 8" stroke="#3a7a2a" stroke-width="1.2"/>',
  snout: '<path d="M4 6c6 0 10 4 10 9v5h-3v-4c0-3-3-6-7-6z" fill="#5a3a3a"/><circle cx="17" cy="6" r="3" fill="#2a2622"/>',
  drop: '<path d="M12 3c4 6 6 9 6 12a6 6 0 0 1-12 0c0-3 2-6 6-12z" fill="#8ad0ee"/>',
  fur: '<path d="M4 18c2-6 4-10 8-12 4 2 6 6 8 12-3-2-5-2-8 0-3-2-5-2-8 0z" fill="#2a282c"/>',
  cloth7: '<path d="M3 6h18v3H3z" fill="#d23a3a"/><path d="M3 9h18v3H3z" fill="#e8c53a"/><path d="M3 12h18v3H3z" fill="#3aa85a"/><path d="M3 15h18v3H3z" fill="#3a6ad2"/>',
  nail: '<path d="M10 3h4v8c0 5-1 8-2 10-1-2-2-5-2-10z" fill="#e2b54a"/>',
  bulb: '<path d="M12 21c-4 0-6-3-6-6 0-4 3-6 6-6s6 2 6 6c0 3-2 6-6 6z" fill="#b89a6a"/><path d="M12 9V3M12 6l-3-3M12 6l3-3" stroke="#5aa040" stroke-width="1.6"/>',
  basket: '<ellipse cx="12" cy="12" rx="9" ry="9" fill="#c8a466"/><circle cx="12" cy="12" r="6" fill="none" stroke="#9a7a44"/><circle cx="12" cy="12" r="3" fill="none" stroke="#9a7a44"/>',
  talis: '<rect x="7" y="2" width="10" height="20" fill="#f0d040"/><path d="M9 6h6M12 6v12M9 10l6 4M9 14l6 4" stroke="#c8202a" stroke-width="1.2"/>',
  bell: '<path d="M6 17c1-2 1-6 2-8a4 4 0 0 1 8 0c1 2 1 6 2 8z" fill="#e2b54a"/><circle cx="12" cy="19" r="1.6" fill="#b8862e"/>',
  top: '<path d="M12 21 5 11c0-4 3-6 7-6s7 2 7 6z" fill="#c8823a"/><path d="M6 11h12" stroke="#c8323a" stroke-width="1.6"/><path d="M12 5V2" stroke="#6a4a2a" stroke-width="1.8"/>',
  cane: '<path d="M8 3c3 0 4 2 4 4v14" stroke="#8a6a3a" stroke-width="2.4" fill="none" stroke-linecap="round"/>',
  whisker: '<path d="M3 8l9 4M3 12h9M3 16l9-4M21 8l-9 4M21 12h-9M21 16l-9-4" stroke="#7ff08a" stroke-width="1.4"/><circle cx="12" cy="12" r="2" fill="#1a1418"/>',
  hide: '<path d="M5 5h14l2 6-3 8H6l-3-8z" fill="#c8742a"/><path d="M8 7l2 4M12 6v6M16 7l-2 4M8 17l2-4M16 17l-2-4" stroke="#1a1410" stroke-width="1.6"/>',
  jar: '<path d="M8 4h8l-1 3c3 1 5 4 5 8 0 4-3 6-8 6s-8-2-8-6c0-4 2-7 5-8z" fill="#6b4a2a"/><ellipse cx="12" cy="5" rx="4" ry="1.4" fill="#ffd257"/>',
  feather: ICONS.feather || '<path d="M5 19 19 5c-6 0-12 4-12 10z" fill="#e8742a"/>'
});
Object.assign(ITEM_LORE, {
  holy: 'น้ำมนต์ที่หลวงตาพุฒทำพิธีด้วยตัวเอง ใส่ขวดแก้วใสมีกลีบดอกไม้ลอย ดื่มแล้วรู้สึกเย็นสบาย',
  incense: 'ธูปผสมกำยานและสมุนไพรที่ตาเผือกปั้นเอง กลิ่นของมันทำให้ผีไม่กล้าเข้าใกล้',
  w_oldsword: 'ดาบของทหารโบราณที่เคยรักษาวัดแห่งนี้ ถึงจะขึ้นสนิมแต่คมดาบยังไม่ทื่อ',
  w_exo: 'ดาบที่หมอผีใช้สะกดวิญญาณ ตัวดาบสลักยันต์เต็มเล่ม เรืองแสงจางๆ เมื่ออยู่ใกล้ผี',
  a_yant: 'เสื้อผ้าฝ้ายที่ลงยันต์ด้วยหมึกแดง เชื่อกันว่าช่วยให้แคล้วคลาดจากภยันตราย',
  r_takrut: 'ตะกรุดทองเหลืองที่ม้วนแผ่นยันต์ไว้ข้างใน ร้อยด้วยสายสิญจน์สีขาว',
  r_pusom: 'แหวนทองโบราณจากไหทองคำใต้เจดีย์ ปู่โสมยอมยกให้คนที่ไม่โลภ',
  r_nakpin: 'ปิ่นปักผมเงินที่แม่นากทิ้งไว้ เมื่อสวมแล้วจะได้ยินเสียงเห่กล่อมเด็กแผ่วๆ',
  c_takhon: 'หน้ากากผีตาโขนทำจากกาบมะพร้าวกับหวดนึ่งข้าว ทาสีสดใสตามแบบประเพณีบุญหลวง',
  c_chada: 'ชฎาทองของนางรำ ยอดแหลมสูงประดับพลอยแดง สวมแล้วเดินได้สง่างามขึ้น',
  c_soul: 'ดวงวิญญาณที่ได้รับการปลดปล่อยจากวัดร้าง ลอยวนรอบตัวคุณอย่างสงบเพื่อขอบคุณ',
  m_shroud: 'ผ้าขาวที่ใช้ในพิธีบังสุกุล หลวงตาบอกว่าเป็นเครื่องหมายของวิญญาณที่ยังรอส่วนบุญ',
  m_wisp: 'เปลวไฟสีเขียวที่ไม่ร้อน ไม่ดับ และไม่มีเชื้อเพลิง',
  m_leaf: 'ใบตองของกล้วยตานีที่ร่วงลงมาในคืนเดือนเพ็ญ',
  m_snout: 'งวงเรียวยาวที่ผีกองกอยใช้ดูดเลือด',
  m_ember: 'แสงเรืองสีเขียวที่กระสือทิ้งไว้ ตาเผือกบอกว่าต้องเผาทิ้งในเมรุเท่านั้น',
  m_drop: 'หยดน้ำจากผีพรายที่เย็นเฉียบและไม่มีวันระเหย',
  m_fur: 'ขนดำเงาจากผีโป่งค่าง มีกลิ่นดินโป่งติดอยู่',
  m_cloth7: 'ผ้าแพรเจ็ดสีที่ชาวบ้านผูกถวายนางตะเคียน ต้องนำกลับไปผูกคืนให้นาง',
  m_nail: 'เล็บทองเหลืองที่นางรำสวมเวลารำ ยังสั่นเบาๆ เหมือนกำลังรำอยู่',
  m_bulb: 'หัวว่านต้องห้าม คนโบราณเชื่อว่าใครปลูกไว้จะกลายเป็นผีโพง',
  m_basket: 'กระด้งไม้ไผ่สานที่กระหังใช้ต่างปีก ขอบมีรอยไหม้',
  m_talis: 'ยันต์กระดาษสีเหลืองที่เขียนด้วยหมึกแดง ใช้แปะหน้าผากผีดิบเพื่อสะกดไว้',
  m_fangp: 'เขี้ยวดำคล้ำของผีปอบ หมอผีบางคนใช้ทำเครื่องราง',
  m_yant: 'ผ้าคาดศีรษะลงยันต์ที่ทหารโบราณสวมก่อนออกรบ',
  m_bell: 'กระดิ่งทองเหลืองของผีตาโขน เขย่าแล้วดังกรุ๋งกริ๋งไม่น่ากลัวเลย',
  m_top: 'ลูกข่างไม้ทาสีแดงของกุมารทอง มีรอยกัดเล็กๆ',
  m_goldjar: 'ไหดินเผาที่บรรจุทองคำโบราณเต็มไห พ่อค้าทุกร้านอยากรับซื้อ',
  m_cane: 'ไม้เท้าที่ผีตาโบ๋ใช้เคาะคลำทาง ได้ยินเสียงก๊อกๆ ในคืนที่ลมสงบ',
  m_whisker: 'หนวดแมวสีดำที่เรืองแสงเขียวในที่มืด หมอผีใช้ทำเครื่องรางกันผีจะกละ',
  m_hide: 'หนังเสือสมิงที่อุ่นอยู่ตลอดเวลาเหมือนยังมีชีวิต ขายได้ราคาดีมาก',
  r_tiger: 'เขี้ยวเสือสมิงที่ลงอาคมแล้ว ห้อยคอไว้จะได้ความว่องไวและดุดันของเสือ'
});
const NPC_IDLE = {
  luangta: 'เจริญพร วิญญาณในวัดนี้ยังมีอีกมาก ระวังตัวด้วยนะโยม ถ้าต้องการน้ำมนต์ ไปหาตาเผือกได้',
  sapphaw: 'ข้าเฝ้าป่าช้านี้มาทั้งชีวิต ผีไม่น่ากลัวเท่าคนโลภหรอก อยากได้ของกันผีก็ดูในร้านได้',
  kuman: 'หนูเฝ้าวัดนี้มานานมากแล้ว ถ้าพี่อยากโชคดี มาขอพรหนูได้วันละครั้งนะ'
};

/* ---------- offscreen renderer for portraits & bestiary thumbnails ---------- */
const ThumbR = {
  R: null, gm: null, cm: {}, cache: {},
  ensure() {
    if (this.R) return true;
    try {
      const cv = document.createElement('canvas'); cv.width = 160; cv.height = 160;
      this.R = new Renderer(cv); const R = this.R; TexGen.init(R);
      R.resize = function () { this.cv.width = this.fw || 160; this.cv.height = this.fh || 160; this.gl.viewport(0, 0, this.cv.width, this.cv.height); };
      this.gm = buildGhostModels(R); for (const k of ['monk', 'undertaker', 'kuman']) this.cm[k] = buildGChar(R, GCHAR_SPECS[k]);
      Object.assign(R.env, { sun: [.4, .8, .45], sunC: [.6, .58, .62], sky: [.5, .52, .62], gnd: [.25, .22, .26], fogC: [.1, .1, .16], fog: [60, 140], top: [.16, .14, .26], bot: [.36, .3, .4] });
      const l = Math.hypot(...R.env.sun); R.env.sun = R.env.sun.map(v => v / l);
      return true;
    } catch (e) { this.R = null; return false; }
  },
  shot(key, w, h, eye, tgt, fov, draw) {
    if (this.cache[key]) return this.cache[key]; if (!this.ensure()) return '';
    const R = this.R; R.fw = w; R.fh = h; R.cv.width = w; R.cv.height = h;
    R.setCamera(eye, tgt, fov); R.setLights([{ x: 2, y: 3, z: 4, r: 12, c: [.35, .3, .4] }]); R.begin(); R.useLit();
    const saved = Object.assign({}, GM), padd = Particles.add, gq = GhostDraw.glowQ.length;
    Object.assign(GM, this.gm); Particles.add = () => { };
    try { draw(R); } catch (e) { console.warn(e); }
    Object.assign(GM, saved); Particles.add = padd; GhostDraw.glowQ.length = gq;
    return this.cache[key] = R.cv.toDataURL('image/png');
  },
  ghost(type, sil) {
    const d = MONSTERS[type]; const h = d.fly ? (type === 'krahang' ? 4.4 : 3.2) : type === 'pret' ? 5.8 : d.wboss ? 5.5 : d.elite ? 4.8 : Math.max(2.4, d.h * 1.15);
    const dist = h * 1.25 + 1.4, eye = [Math.sin(.55) * dist, h * .75, Math.cos(.55) * dist];
    return this.shot('g_' + type + (sil ? '_s' : ''), 160, 160, eye, [0, h * .48, 0], .75, R => {
      const m = { type, d, x: 0, z: 0, face: .25, id: 7, hp: 1, max: 1, moving: false, wind: 0, anim: 1, flash: 0, hit: 0 };
      GDRAW[type](R, m, 1, sil ? [0, 0, 0] : null, 0, 1.3);
    });
  },
  npc(sheet) {
    return this.shot('n_' + sheet, 224, 320, [1.2, 2.0, 4.6], [0, 1.25, 0], .72, R => {
      const rig = new Rig(sheet); rig.update(.016, { wave: true }); for (let i = 0; i < 40; i++) rig.update(.05, { wave: true });
      rig.pose(0, 0, 0, .25, CHAR_SCALE * (sheet === 'kuman' ? .9 : 1)); rig.draw(R, this.cm[sheet], sheet === 'kuman' ? { emis: [.18, .14, .04] } : {});
    });
  }
};
const NpcPortrait = { get(sheet) { return ThumbR.npc(sheet); } };

/* ---------- temple map image ---------- */
UI.buildTempleMap = function () {
  const N = 150, c = document.createElement('canvas'); c.width = N; c.height = N; const x = c.getContext('2d'); const img = x.createImageData(N, N);
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const lx = -75 + i, z = -75 + j, h = templeHeight(lx, z); let col = templeColor(lx, z, h); if (h < -.4) col = [.18, .34, .44];
    col = col.map(v => Math.min(1, v * 1.25)); const k = (j * N + i) * 4; img.data[k] = col[0] * 255; img.data[k + 1] = col[1] * 255; img.data[k + 2] = col[2] * 255; img.data[k + 3] = 255;
  }
  x.putImageData(img, 0, 0);
  const tags = { ubosot: '#e8e2d2', chedi: '#b06a4a', kuti: '#8a6040', kitchen: '#8a6040', barn: '#8a6040', meru: '#d8d0c0', nakhouse: '#7a5030', stage: '#8a5a3a', sala: '#9a7050', shed: '#7a6050', spirit: '#e2b54a', takhian: '#2f5a2a', bodhi: '#3f6a34', owall: '#7a4a38', kwall: '#c8c2b2', grave: '#8a7a6a', stupa: '#d8d2c2', ossuary: '#c8c2b2', bell: '#c8b07a', bamboo: '#5a7a3a', banana: '#6aa04a', tree: '#203a20', pillar: '#9b5a42', vwall: '#9b5a42', gate: '#e8e2d2' };
  for (const o of Col.boxes) { if (o.x0 < TX - 80 || o.x0 > TX + 80 || !tags[o.tag]) continue; x.fillStyle = tags[o.tag]; x.fillRect(o.x0 - TX + 75, o.z0 + 75, Math.max(1, o.x1 - o.x0), Math.max(1, o.z1 - o.z0)); }
  for (const o of Col.circles) { if (o.x < TX - 80 || o.x > TX + 80 || !tags[o.tag]) continue; x.fillStyle = tags[o.tag]; x.beginPath(); x.arc(o.x - TX + 75, o.z + 75, Math.max(.8, o.r * .9), 0, TAU); x.fill(); }
  this.tplImg = c;
};
{
  const opm = UI.pMap.bind(UI);
  UI.pMap = function (o) {
    const P = Player, S = Save.d; const tab = o.tab || (P.zone === 'temple' ? 'temple' : 'world'); this.panelOpt.tab = tab;
    if (tab !== 'temple') {
      opm(o);
      const cv = $('#bigmap'); if (cv) { const x = cv.getContext('2d'); const [a, b] = [(-140 + 150) * 2, (70 + 150) * 2]; x.font = '600 14px Mitr, sans-serif'; x.textAlign = 'left'; x.lineWidth = 4; x.strokeStyle = 'rgba(20,14,10,.85)'; const t = S.level >= TEMPLE_LV ? '← วัดร้าง' : `← วัดร้าง (Lv.${TEMPLE_LV})`; x.strokeText(t, a + 6, b + 5); x.fillStyle = '#d8b8ff'; x.fillText(t, a + 6, b + 5); x.fillStyle = '#b48aff'; x.beginPath(); x.arc(a, b, 6, 0, TAU); x.fill(); }
      this.el.pbody.insertAdjacentHTML('afterbegin', `<div class="tabs maptabs"><button class="tab on" data-mt="world">ทวีป Aurelion</button><button class="tab" data-mt="temple">วัดร้างกลางป่า</button></div>`);
      const ob = this.el.pbody.onclick; this.el.pbody.onclick = e => { const t = e.target.closest('[data-mt]'); if (t) { this.panelOpt.tab = t.dataset.mt; return this.renderPanel(); } ob && ob(e); };
      return;
    }
    if (!this.tplImg) this.buildTempleMap();
    this.setPanel(`${icon('map')} แผนที่วัดร้างกลางป่า${o.warp ? ' · เลือกจุดวาร์ป' : ''}`, `<div class="tabs maptabs"><button class="tab" data-mt="world">ทวีป Aurelion</button><button class="tab on" data-mt="temple">วัดร้างกลางป่า</button></div><div class="mapwrap"><canvas id="bigmap" width="600" height="600"></canvas></div>
      <div class="warps"><h4>จุดวาร์ป</h4>${WARPS.map(w => `<button class="btn ${S.warps[w.id] ? '' : 'ghost'}" data-w="${w.id}" ${S.warps[w.id] && o.warp ? '' : 'disabled'}>${w.name}${S.warps[w.id] ? '' : ' (ยังไม่ค้นพบ)'}</button>`).join('')}
      <p class="muted">จุดสีม่วงคือแหล่งผีแต่ละชนิด · ${o.warp ? 'แตะชื่อจุดวาร์ปเพื่อเดินทาง' : 'เดินไปที่คริสตัลวาร์ปแล้วกด F เพื่อเดินทางเร็ว'}</p></div>`, true);
    const cv = $('#bigmap'), x = cv.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(this.tplImg, 0, 0, 600, 600);
    const tp = (wx, wz) => [(wx - TX + 75) * 4, (wz + 75) * 4];
    x.font = '600 13px Mitr, sans-serif'; x.textAlign = 'center';
    const lbl = (t, wx, wz, c = '#fff') => { const [a, b] = tp(wx, wz); x.lineWidth = 4; x.strokeStyle = 'rgba(14,10,18,.85)'; x.strokeText(t, a, b); x.fillStyle = c; x.fillText(t, a, b); };
    for (const [ax, az, r, n] of TEMPLE_AREAS) if (r >= 6) lbl(n, TX + ax, az + (n === 'อุโบสถร้าง' ? 0 : -r * .55), '#f3e7cc');
    const sp = {}; for (const [t, sx, sz] of SPAWNS) if (sx > 1500 && MONSTERS[t].ghost && !sp[t]) { sp[t] = 1; const [a, b] = tp(sx, sz); x.fillStyle = MONSTERS[t].wboss ? '#ff5fd0' : MONSTERS[t].elite ? '#ffc04a' : '#b48aff'; x.beginPath(); x.arc(a, b, MONSTERS[t].wboss || MONSTERS[t].elite ? 8 : 5, 0, TAU); x.fill(); x.strokeStyle = '#1d1712'; x.lineWidth = 2; x.stroke(); if (S.ghostSeen && S.ghostSeen[t]) { x.font = '500 11px Mitr, sans-serif'; x.lineWidth = 3; x.strokeText(MONSTERS[t].name.split(' ')[0], a, b + 17); x.fillStyle = '#e8d8ff'; x.fillText(MONSTERS[t].name.split(' ')[0], a, b + 17); x.font = '600 13px Mitr, sans-serif'; } }
    for (const w of WARPS) if (w.zone === 'temple') { const [a, b] = tp(w.x, w.z); x.fillStyle = S.warps[w.id] ? '#7fe6ff' : '#5a6b78'; x.beginPath(); x.moveTo(a, b - 9); x.lineTo(a + 7, b); x.lineTo(a, b + 9); x.lineTo(a - 7, b); x.fill(); }
    for (const n of NPCList) if (n.zone === 'temple') { const [a, b] = tp(n.x, n.z); x.fillStyle = '#ffd24a'; x.beginPath(); x.arc(a, b, 5, 0, TAU); x.fill(); }
    lbl('ทางออก ↓ ถนนสายตะวันตก', TX, 72, '#cfe8ff');
    if (P.zone === 'temple') { const [a, b] = tp(P.x, P.z); x.fillStyle = '#a5e84a'; x.strokeStyle = '#1d1712'; x.lineWidth = 2; x.beginPath(); x.arc(a, b, 7, 0, TAU); x.fill(); x.stroke(); }
    else lbl(P.zone === 'world' ? 'คุณอยู่บนทวีป Aurelion' : 'คุณอยู่ในถ้ำผลึก', TX, 0, '#a5e84a');
    this.el.pbody.onclick = e => {
      const t = e.target.closest('[data-mt]'); if (t) { this.panelOpt.tab = t.dataset.mt; return this.renderPanel(); }
      const b = e.target.closest('[data-w]'); if (!b || b.disabled) return; const w = WARPS.find(v => v.id === b.dataset.w); if (Monsters.boss.engaged || NakBoss.cur) { this.toast('วาร์ปไม่ได้ระหว่างต่อสู้กับบอส', 'warn'); return; } this.closePanel(); Game.teleport(w.x + 2.5, w.z + 2.5, w.name);
    };
  };
}

/* ---------- ghost bestiary ---------- */
UI.pGhost = function (o) {
  const S = Save.d; S.ghostSeen = S.ghostSeen || {}; S.ghostKills = S.ghostKills || {};
  const sel = o.sel || GHOST_ORDER.find(t => S.ghostSeen[t]) || GHOST_ORDER[0]; this.panelOpt.sel = sel;
  const seenN = GHOST_ORDER.filter(t => S.ghostSeen[t]).length, killN = GHOST_ORDER.filter(t => S.ghostKills[t]).length;
  const d = MONSTERS[sel], L = GHOST_LORE[sel], seen = !!S.ghostSeen[sel], kills = S.ghostKills[sel] || 0;
  const list = GHOST_ORDER.map(t => { const s = !!S.ghostSeen[t]; return `<button class="gbcard ${t === sel ? 'on' : ''} ${s ? '' : 'lock'}" data-gs="${t}" aria-label="${s ? MONSTERS[t].name : 'ยังไม่พบ'}"><img src="${ThumbR.ghost(t, !s)}" alt=""><span>${s ? MONSTERS[t].name.split(' ')[0] : '???'}</span>${S.ghostKills[t] ? '<i class="gbk">✓</i>' : ''}${MONSTERS[t].wboss ? '<i class="gbb">บอส</i>' : MONSTERS[t].elite ? '<i class="gbb e">หัวหน้า</i>' : ''}</button>`; }).join('');
  const drops = (d.drops || []).filter(x => ITEMS[x[0]]).map(([id, ch, q]) => `<li class="hasinfo" data-info="${id}">${UI.itemIcon(id)}<span>${ITEMS[id].name}</span><small>${q ? 'ระหว่างเควส' : ItemInfo.pct(ch)}</small></li>`).join('') + (sel === 'maenak' ? ['r_nakpin', 'w_exo', 'holy', 'm_goldjar'].map(id => `<li class="hasinfo" data-info="${id}">${UI.itemIcon(id)}<span>${ITEMS[id].name}</span><small>บอส</small></li>`).join('') : '');
  const detail = seen ? `<div class="gbhead"><img src="${ThumbR.ghost(sel)}" alt=""><div><h3>${d.name}</h3><p class="gben">${L.th}</p><p class="gbst">Lv.${d.lvl} · HP ${fmt(d.hp)} · ATK ${d.atk}${d.wboss ? ' · บอส' : d.elite ? ' · หัวหน้า' : ''}</p><p class="gbkill">ปราบแล้ว ${fmt(kills)} ตน</p></div></div>
      <dl class="gbdl"><dt>${icon('person')} รูปลักษณ์</dt><dd>${L.look}</dd><dt>${icon('book')} ตำนาน</dt><dd>${L.lore}</dd><dt>${icon('map')} พบได้ที่</dt><dd>${L.home} <button class="btn sm ghost" data-gnav="${sel}">นำทาง</button></dd><dt>${icon('sword')} ในการต่อสู้</dt><dd>${L.act}</dd><dt>${icon('star')} ความเชื่อ / วิธีรับมือ</dt><dd>${L.tip}</dd></dl>
      ${drops ? `<h4>ของที่ได้</h4><ul class="gbdrops">${drops}</ul>` : ''}`
    : `<div class="gbhead lock"><img src="${ThumbR.ghost(sel, true)}" alt=""><div><h3>??? ยังไม่พบ</h3><p class="gbst">เบาะแส: ${L.home}</p><p class="muted">เข้าใกล้ผีตนนี้ในวัดร้างเพื่อบันทึกลงตำรา</p><button class="btn sm ghost" data-gnav="${sel}">นำทางไปหาเบาะแส</button></div></div>`;
  this.setPanel(`${icon('ghost')} ตำราผีไทย <small>พบแล้ว ${seenN}/${GHOST_ORDER.length} · ปราบแล้ว ${killN}/${GHOST_ORDER.length}</small>`, `<div class="gbwrap"><div class="gblist">${list}</div><div class="gbdetail">${detail}</div></div>`, true);
  this.el.pbody.onclick = e => {
    const c = e.target.closest('[data-gs]'); if (c) { Audio.sfx('ui'); this.panelOpt.sel = c.dataset.gs; return this.renderPanel(); }
    const n = e.target.closest('[data-gnav]'); if (n) { const t = n.dataset.gnav; const sp = SPAWNS.find(s => s[0] === t); if (!sp) return; this.closePanel(); if (!Nav.go({ zone: 'temple', x: sp[1], z: sp[2] + (MONSTERS[t].wboss ? 13 : 0), r: 5, label: 'ไปหา' + MONSTERS[t].name.split(' ')[0], arrive: () => UI.toast(`ถึงแล้ว ระวัง${MONSTERS[t].name}!`, 'boss') })) UI.toast('ยังเดินทางไปวัดร้างไม่ได้', 'warn'); }
  };
};

/* ---------- item sources for temple items ---------- */
{
  const osrc = ItemInfo.sources.bind(ItemInfo);
  ItemInfo.sources = function (id) {
    const out = osrc(id), it = ITEMS[id];
    if (TEMPLE_SHOP.includes(id)) out.push({ ic: 'bag', t: 'เครื่องรางกันผีของตาเผือก', s: `ราคา ${fmt(it.price)} เหรียญ${it.lvl ? ' · ต้องเลเวล ' + it.lvl : ''} · วัดร้างกลางป่า`, go: { npc: 'sapphaw' } });
    const nak = { r_nakpin: 'ปราบครั้งแรกได้แน่นอน · ครั้งต่อไปโอกาส 40%', w_exo: 'โอกาส 35% (ครั้งแรก 60%)', holy: '×3 ทุกครั้งที่ปราบ', m_goldjar: '×1 ทุกครั้งที่ปราบ' }[id];
    if (nak) out.push({ ic: 'ghost', t: 'บอส แม่นาก ผีตายทั้งกลม (Lv.15)', s: nak + ' · เรือนไทยริมคลอง วัดร้าง', go: { mon: 'maenak' } });
    if (id === 'c_soul') out.unshift({ ic: 'ghost', t: 'รางวัลเควสหลัก: วิญญาณริมคลอง', s: 'ส่งวิญญาณแม่นากให้หลวงตาพุฒ', go: { quest: 't5' } });
    return out;
  };
}

