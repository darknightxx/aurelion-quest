/* ============================================================
   Amazon UI: jungle shop, minimap / world-map tab, patch notes.
   ============================================================ */
SHOPS.jungle = ['ร้านเสบียงป่าของโฮเซ่', 'ดูยาแก้พิษและอุปกรณ์', () => JUNGLE_SHOP, 1];
Object.assign(NPC_IDLE, { marco: 'ค่ายนี้เป็นที่ปลอดภัยแห่งเดียวในป่า พักให้หายเหนื่อยก่อนออกไปนะ', emma: 'สิ่งมีชีวิตในป่านี้มีมากกว่าหมื่นชนิด ฉันศึกษาไปได้แค่นิดเดียวเอง', jose: 'ซื้อยาแก้พิษไว้เยอะๆ นะ กบพิษกับงูอนาคอนด้าไม่ปรานีใคร' });
UI.buildAmazonMap = function () {
  const N = 220, c = document.createElement('canvas'); c.width = N; c.height = N; const x = c.getContext('2d'); const img = x.createImageData(N, N);
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const lx = -110 + i, z = -110 + j, h = amazonHeight(lx, z); let col = amazonColor(lx, z, h); if (h < -.2) col = inC(lx, z, ASWAMP, 1.2) ? [.25, .32, .18] : [.16, .38, .4];
    col = col.map(v => Math.min(1, v * 1.35)); const k = (j * N + i) * 4; img.data[k] = col[0] * 255; img.data[k + 1] = col[1] * 255; img.data[k + 2] = col[2] * 255; img.data[k + 3] = 255;
  }
  x.putImageData(img, 0, 0);
  x.fillStyle = 'rgba(10,30,12,.55)'; for (const o of Col.circles) { if (o.x < AX - 110 || o.x > AX + 110 || !/atree|apalm/.test(o.tag)) continue; x.beginPath(); x.arc(o.x - AX + 110, o.z + 110, Math.max(1, o.r * 1.6), 0, TAU); x.fill(); }
  x.fillStyle = '#8a6a44'; for (const o of Col.circles) { if (o.x < AX - 110 || o.x > AX + 110 || !/ahut|atent|apal/.test(o.tag)) continue; x.beginPath(); x.arc(o.x - AX + 110, o.z + 110, Math.max(1, o.r), 0, TAU); x.fill(); }
  x.fillStyle = '#9a9a88'; for (const o of Col.boxes) { if (o.x0 < AX - 110 || o.x0 > AX + 110) continue; x.fillRect(o.x0 - AX + 110, o.z0 + 110, o.x1 - o.x0, o.z1 - o.z0); }
  this.amzImg = c;
};
{
  const opm = UI.pMap.bind(UI);
  UI.pMap = function (o) {
    const P = Player, S = Save.d; if (!o.tab && P.zone === 'amazon') o.tab = 'amazon';
    if (o.tab !== 'amazon') { opm(o); const t = this.el.pbody.querySelector('.maptabs'); if (t && !t.querySelector('[data-mt="amazon"]')) t.insertAdjacentHTML('beforeend', `<button class="tab" data-mt="amazon">ป่าอเมซอน${S.level < AMAZON_LV ? ' 🔒' : ''}</button>`); return; }
    this.panelOpt.tab = 'amazon'; if (!this.amzImg) this.buildAmazonMap();
    this.setPanel(`${icon('map')} แผนที่ป่าอเมซอนมรณะ${o.warp ? ' · เลือกจุดวาร์ป' : ''}`, `<div class="tabs maptabs"><button class="tab" data-mt="world">ทวีป Aurelion</button><button class="tab" data-mt="temple">วัดร้างกลางป่า</button><button class="tab on" data-mt="amazon">ป่าอเมซอน</button></div>
      <div class="mapwrap"><canvas id="bigmap" width="660" height="660"></canvas></div>
      <div class="warps"><h4>จุดวาร์ป</h4>${WARPS.map(w => `<button class="btn ${S.warps[w.id] ? '' : 'ghost'}" data-w="${w.id}" ${S.warps[w.id] && o.warp ? '' : 'disabled'}>${w.name}${S.warps[w.id] ? '' : ' (ยังไม่ค้นพบ)'}</button>`).join('')}
      <p class="muted">ทางเข้า: ถนนสายตะวันออกของทวีป Aurelion (ขวาสุดของแผนที่) ต้องมีเลเวล ${AMAZON_LV} ขึ้นไป · มอนสเตอร์ Lv.15–26 ${o.warp ? '· แตะชื่อจุดวาร์ปเพื่อเดินทาง' : ''}</p></div>`, true);
    const cv = $('#bigmap'), x = cv.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(this.amzImg, 0, 0, 660, 660);
    const tp = (wx, wz) => [(wx - AX + 110) * 3, (wz + 110) * 3]; x.font = '600 13px Mitr, sans-serif'; x.textAlign = 'center';
    const lbl = (t, wx, wz, c = '#fff') => { const [a, b] = tp(wx, wz); x.lineWidth = 4; x.strokeStyle = 'rgba(8,16,8,.85)'; x.strokeText(t, a, b); x.fillStyle = c; x.fillText(t, a, b); };
    for (const [ax, az, r, n] of AMAZON_AREAS) lbl(n, AX + ax, az - r * .6, '#f3e7cc');
    const sp = {}; for (const [t, sx, sz] of SPAWNS) if (sx > 2500 && !sp[t]) { sp[t] = 1; const [a, b] = tp(sx, sz); x.fillStyle = '#ff8a5a'; x.beginPath(); x.arc(a, b, 6, 0, TAU); x.fill(); lbl(MONSTERS[t].name + ' Lv.' + MONSTERS[t].lvl, sx, sz + 6, '#ffd0b0'); }
    for (const m of MVPSys.list) if (m.zone === 'amazon') { const [a, b] = tp(m.home.x, m.home.z); x.fillStyle = m.d.mvp === 'mvp' ? '#ffb02e' : '#c46bff'; x.beginPath(); x.arc(a, b, 9, 0, TAU); x.fill(); lbl((m.d.mvp === 'mvp' ? '👑 ' : '★ ') + m.d.name, m.home.x, m.home.z - 4, '#ffe08a'); }
    for (const n of NPCList) if (n.zone === 'amazon') { const [a, b] = tp(n.x, n.z); x.fillStyle = '#ffd24a'; x.beginPath(); x.arc(a, b, 5, 0, TAU); x.fill(); }
    lbl('ทางออก ↓ ถนนสายตะวันออก', AX, 106, '#cfe8ff');
    if (P.zone === 'amazon') { const [a, b] = tp(P.x, P.z); x.fillStyle = '#a5e84a'; x.strokeStyle = '#1d1712'; x.lineWidth = 2; x.beginPath(); x.arc(a, b, 7, 0, TAU); x.fill(); x.stroke(); }
    this.el.pbody.onclick = e => {
      const t = e.target.closest('[data-mt]'); if (t) { this.panelOpt.tab = t.dataset.mt; return this.renderPanel(); }
      const b = e.target.closest('[data-w]'); if (!b || b.disabled) return; const w = WARPS.find(v => v.id === b.dataset.w); if (Monsters.boss.engaged || NakBoss.cur) { this.toast('วาร์ปไม่ได้ระหว่างต่อสู้กับบอส', 'warn'); return; } this.closePanel(); Game.teleport(w.x + 2.5, w.z + 1, w.name);
    };
  };
}
Object.assign(CARD_EMOJI, { piranha: '🐟', dartfrog: '🐸', jaguar: '🐆', spider: '🕷️', ana: '🐍', plant: '🌺', caiman: '🐊', ogre: '👹', ogresham: '🪶' });
