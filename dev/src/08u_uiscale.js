
/* ============================================================
   UI scale: players can resize each part of the interface
   (HUD, action buttons, windows, name plates, chat) separately.
   Uses CSS zoom per group, so layouts stay anchored to the
   screen edges; windows zoom their inner frame so dragging keeps
   working in screen pixels.
   ============================================================ */
const UIScale = {
  defs: [
    ['uiz', 'แถบสถานะ แผนที่ย่อ เมนู และเควส', .6, 1.8],
    ['btz', 'ปุ่มสกิล ปุ่มโจมตี และจอยสติ๊ก', .6, 2],
    ['wiz', 'หน้าต่าง (กระเป๋า ร้านค้า ตั้งค่า ฯลฯ)', .6, 1.6],
    ['plz', 'ชื่อ แถบ HP ใต้ตัวละคร และตัวเลขดาเมจ', .6, 1.8],
    ['chz', 'แชท ข้อความแจ้งเตือน และประกาศ', .6, 1.8]
  ],
  presets: [['เล็ก', .8], ['ปกติ', 1], ['ใหญ่', 1.2], ['ใหญ่มาก', 1.45]],
  get(k) { const v = +Settings.d[k]; return v > 0 ? v : 1; },
  get pl() { return this.get('plz'); },
  get bt() { return this.get('btz'); },
  apply() { const de = document.documentElement; for (const [k] of this.defs) de.style.setProperty('--' + k, this.get(k)); },
  set(k, v) { Settings.d[k] = Math.round(v * 100) / 100; this.apply(); },
  html() {
    return `<div class="uisc">
      <div class="uipre">${this.presets.map(([l, v]) => `<button class="btn sm" data-uipre="${v}">${l}</button>`).join('')}<button class="btn sm ghost" data-uipre="reset">ค่าเริ่มต้น</button></div>
      ${this.defs.map(([k, l, a, b]) => `<label for="uis-${k}">${l}: <b id="uisv-${k}">${Math.round(this.get(k) * 100)}%</b></label><input type="range" id="uis-${k}" data-uis="${k}" min="${a}" max="${b}" step=".05" value="${this.get(k)}">`).join('')}
      <p class="muted">ปรับแล้วเห็นผลทันทีและบันทึกอัตโนมัติ · ลากหน้าต่างไปวางตรงไหนก็ได้</p></div>`;
  },
  bind(root) {
    root.querySelectorAll('[data-uis]').forEach(inp => {
      inp.oninput = () => { const k = inp.dataset.uis; this.set(k, +inp.value); const t = root.querySelector('#uisv-' + k); if (t) t.textContent = Math.round(+inp.value * 100) + '%'; };
      inp.onchange = () => { Settings.save(); this.fit(); };
    });
    root.querySelectorAll('[data-uipre]').forEach(b => b.onclick = e => {
      e.stopPropagation(); const v = b.dataset.uipre;
      for (const [k, , a, m] of this.defs) this.set(k, v === 'reset' ? 1 : clamp(+v * (k === 'btz' && +v > 1 ? 1.1 : 1), a, m));
      Settings.save(); Audio.sfx('ui'); this.fit();
      root.querySelectorAll('[data-uis]').forEach(inp => { inp.value = this.get(inp.dataset.uis); const t = root.querySelector('#uisv-' + inp.dataset.uis); if (t) t.textContent = Math.round(this.get(inp.dataset.uis) * 100) + '%'; });
    });
  },
  // keep open windows on screen after a size change
  fit() { if (typeof WM !== 'undefined') for (const w of WM.wins.values()) WM.clamp(w); },
  pUIScale() { UI.setPanel(`${icon('gear')} ปรับขนาด UI`, this.html()); this.bind(UI.el.pbody); }
};
Settings.d.uiz = Settings.d.uiz || 1;
UIScale.apply();
{
  UI.extraPanels = UI.extraPanels || {};
  UI.extraPanels.uiscale = 'pUIScale'; UI.pUIScale = () => UIScale.pUIScale();
  const ol = Settings.load.bind(Settings); Settings.load = function () { ol(); UIScale.apply(); };
  const os = UI.pSettings.bind(UI);
  UI.pSettings = function () {
    os(); const b = this.el.pbody; const fs = document.createElement('fieldset'); fs.innerHTML = `<legend>ขนาด UI</legend>${UIScale.html()}`;
    b.insertBefore(fs, b.firstChild); UIScale.bind(fs);
  };
  const om = UI.pMenu.bind(UI);
  UI.pMenu = function () { om(); const g = this.el.pbody.querySelector('.menugrid'); if (!g) return; const bt = document.createElement('button'); bt.className = 'mbtn'; bt.dataset.go = 'uiscale'; bt.innerHTML = `${icon('gear')}<span>ปรับขนาด UI</span>`; const ref = g.querySelector('[data-go="settings"]'); g.insertBefore(bt, ref || null); };
}
