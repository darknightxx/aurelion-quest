/* ============================================================
   Stable (mount collection) panel, 3D preview, HUD buttons, shop hooks
   ============================================================ */
ICONS.paw = '<g fill="currentColor"><ellipse cx="12" cy="16" rx="5" ry="4"/><circle cx="5.5" cy="10.5" r="2.2"/><circle cx="9.5" cy="6.5" r="2.2"/><circle cx="14.5" cy="6.5" r="2.2"/><circle cx="18.5" cy="10.5" r="2.2"/></g>';
ICONS.ride = '<path d="M4 15c2-4 5-6 9-6l3-3 2 1-1 3c2 1 3 3 3 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="7" cy="18" r="2" fill="currentColor"/><circle cx="17" cy="18" r="2" fill="currentColor"/><circle cx="12" cy="5" r="2" fill="currentColor"/>';
const KIND_ICON = { quad: 'paw', hop: 'paw', biped: 'paw', float: 'star', slide: 'star' };

const StableView = {
  R: null, cv: null, meshes: null, raf: 0, id: null, yaw: 0, thumbs: {}, drag: null,
  ensure() {
    if (this.R) return true;
    try {
      this.cv = document.createElement('canvas'); this.cv.className = 'stcv';
      this.R = new Renderer(this.cv); TexGen.init(this.R); this.meshes = buildMountMeshes(this.R);
      Object.assign(this.R.env, { sun: [.45, .8, .4], sunC: [.75, .72, .66], sky: [.62, .64, .76], gnd: [.36, .34, .4], fogC: [.86, .87, .95], fog: [40, 120], top: [.72, .78, .95], bot: [.93, .92, .98] });
      const l = Math.hypot(...this.R.env.sun); this.R.env.sun = this.R.env.sun.map(v => v / l);
      const R = this.R, orig = R.resize.bind(R);
      R.resize = function () { if (this.fixed) { this.cv.width = this.fixed[0]; this.cv.height = this.fixed[1]; this.gl.viewport(0, 0, this.fixed[0], this.fixed[1]); } else orig(); };
      this.cv.addEventListener('pointerdown', e => { this.drag = { x: e.clientX, y: e.clientY }; try { this.cv.setPointerCapture(e.pointerId); } catch (_) { } });
      this.cv.addEventListener('pointermove', e => { if (!this.drag) return; const d = Rot.delta(e.clientX - this.drag.x, e.clientY - this.drag.y); this.drag = { x: e.clientX, y: e.clientY }; this.yaw += d.dx * .012; });
      const up = () => this.drag = null; this.cv.addEventListener('pointerup', up); this.cv.addEventListener('pointercancel', up);
      return true;
    } catch (e) { this.R = null; return false; }
  },
  frame(id, t, fixed) {
    const R = this.R, D = MOUNTS[id]; R.fixed = fixed || null; R.time = t;
    const h = (1.2 + D.seat[0] * .45) * (D.view ? .9 : 1), dist = (5.2 * D.sc + (D.kind === 'biped' ? .6 : 0)) * (D.view || 1);
    R.setCamera([Math.sin(.5) * dist, h + 1.0, Math.cos(.5) * dist], [0, h * .62, 0], .72);
    R.setLights([{ x: 2, y: 4, z: 3, r: 10, c: [.35, .3, .4] }]); R.begin(); R.useLit();
    const st = { t, amp: fixed ? 0 : .0, ph: t * 4 };
    drawMount(R, this.meshes, id, 0, 0, 0, fixed ? 0 : this.yaw, st, 1);
  },
  thumb(id) {
    if (this.thumbs[id]) return this.thumbs[id];
    if (!this.ensure()) return '';
    this.frame(id, 1.3, [160, 160]); this.thumbs[id] = this.cv.toDataURL('image/png'); this.R.fixed = null;
    return this.thumbs[id];
  },
  mount(host, id) {
    if (!this.ensure()) { host.innerHTML = '<p class="muted">อุปกรณ์นี้แสดงตัวอย่าง 3 มิติไม่ได้</p>'; return; }
    if (this.id !== id) this.yaw = -.35; this.id = id; host.appendChild(this.cv);
    cancelAnimationFrame(this.raf); const t0 = performance.now();
    const loop = now => { if (!this.cv.isConnected || !WM.isOpen('stable')) return; if (!this.drag) this.yaw += .006; this.frame(this.id, (now - t0) / 1000); this.raf = requestAnimationFrame(loop); };
    this.raf = requestAnimationFrame(loop);
  }
};

Object.assign(UI, {
  mountBtns() {
    const el = $('#mountbtns'); if (!el || !Save.d) return;
    const id = Mounts.cur(), on = Mounts.riding();
    el.hidden = !id;
    const rb = $('#mride'), sb = $('#mskill');
    rb.classList.toggle('on', on); rb.setAttribute('aria-label', on ? 'ลงจากสัตว์ขี่' : 'ขี่สัตว์');
    rb.querySelector('.tip').textContent = on ? 'ลงจากหลัง (V)' : 'ขี่ ' + (id ? MOUNTS[id].name : '') + ' (V)';
    sb.hidden = !on; if (id) sb.querySelector('.tip').textContent = MOUNTS[id].sk.name + ' (G)';
    const img = id ? StableView.thumb(id) : ''; const ri = rb.querySelector('img'); if (img && ri.getAttribute('src') !== img) ri.src = img;
  },
  mountCd() { const sb = $('#mskill'); if (!sb || sb.hidden || !Mounts.cur()) return; const p = Mounts.cd / MOUNTS[Mounts.cur()].sk.cd; sb.querySelector('.cd').style.setProperty('--p', p); sb.classList.toggle('cool', p > 0); },
  pStable(o) {
    const S = Save.d, M = Mounts.data(); const only = !!o.only; this.panelOpt.only = only;
    const sel = o.sel && MOUNTS[o.sel] ? o.sel : (M.cur || MOUNT_ORDER[0]); this.panelOpt.sel = sel;
    const D = MOUNTS[sel], own = !!M.own[sel], lv = Mounts.lv(sel), st = Mounts.statOf(sel, lv), riding = Mounts.riding() && M.cur === sel;
    const list = MOUNT_ORDER.filter(id => !only || M.own[id]).map(id => `<button class="stcard ${id === sel ? 'on' : ''} ${M.own[id] ? 'own' : 'lock'}" data-ms="${id}" aria-label="${MOUNTS[id].name}"><img src="${StableView.thumb(id)}" alt="">${M.cur === id && M.own[id] ? '<i class="stcur">ใช้อยู่</i>' : ''}${!M.own[id] ? `<span class="stprice">${gemSvg()}${fmt(MOUNTS[id].gems)}</span>` : `<span class="stlv">Lv.${M.own[id]}</span>`}</button>`).join('') || '<p class="muted">ยังไม่มีสัตว์ขี่</p>';
    const pct = Math.round(D.spd * 100);
    let btns = '';
    if (!own) btns = `<button class="btn gembuy big" data-mbuy="${sel}" ${S.gems < D.gems ? 'data-short="1"' : ''}>${gemSvg()}<b>${fmt(D.gems)}</b> ซื้อ</button><button class="btn ghost" data-mtry="${sel}">ทดลองขี่ 60 วิ</button>`;
    else btns = `<button class="btn ${riding ? 'ghost' : 'primary'} big" data-mride="${sel}">${riding ? 'ลงจากหลัง' : 'ขี่เลย'}</button>${lv < MOUNT_MAXLV ? `<button class="btn" data-mlv="${sel}" ${S.coins < mountLvCost(lv) ? 'disabled' : ''}>${icon('coin')} อัปเลเวล ${fmt(mountLvCost(lv))}</button>` : '<span class="sold">เลเวลสูงสุด</span>'}`;
    const nx = lv < MOUNT_MAXLV ? Mounts.statOf(sel, lv + 1) : null;
    const srow = (k, l) => `<li><span>${l}</span><b>+${st[k]}</b>${nx ? `<em>→ +${nx[k]}</em>` : ''}</li>`;
    this.setPanel(`${icon('paw')} สัตว์ขี่ <span class="coin">${gemSvg()}${fmt(S.gems)}</span>`, `
      <div class="stb">
        <div class="stside"><div class="stlist">${list}</div><label class="stonly"><input type="checkbox" id="stonly" ${only ? 'checked' : ''}> แสดงเฉพาะที่มี</label></div>
        <div class="stview"><div class="stname">${D.name}</div><div class="stcv-host" id="stcvhost"></div><div class="stmeta"><span>${icon(KIND_ICON[D.kind])}</span><span>${icon('boots')}</span><b>${pct}%</b><small>ลากเพื่อหมุน</small></div></div>
        <div class="stinfo">
          <h4>เรื่องราว</h4><p class="ststory">${D.story}</p>
          <div class="stlvrow"><b>Lv.${lv}</b><div class="stlvbar"><i style="width:${lv / MOUNT_MAXLV * 100}%"></i></div><small>${lv}/${MOUNT_MAXLV}</small></div>
          <h4>เพิ่มค่าสถานะตัวละคร</h4><ul class="ststat">${srow('atk', 'ATK')}${srow('def', 'DEF')}${srow('hp', 'Max HP')}<li><span>ความเร็วขณะขี่</span><b>${pct}%</b></li></ul>
          <h4>ความสามารถพิเศษ</h4><div class="stab"><b>${D.pas.name}</b><small>${D.pas.desc}</small></div>
          <h4>สกิลต่อสู้ <kbd>G</kbd></h4><div class="stab msk"><b>${D.sk.name}</b><small>${D.sk.desc} · คูลดาวน์ ${D.sk.cd} วิ</small></div>
          <div class="stbtns">${btns}</div>
          ${!own ? '<p class="muted stnote">ซื้อด้วยเพชรจากการเติมในร้านค้า (โหมดทดลอง) · ค่าสถานะมีผลเมื่อเลือกใช้ ความเร็ว ความสามารถพิเศษ และสกิลใช้ได้ขณะขี่</p>' : ''}
        </div>
      </div>`, true);
    StableView.mount($('#stcvhost'), sel);
    this.el.pbody.onclick = e => {
      const c = e.target.closest('[data-ms]'); if (c) { Audio.sfx('ui'); this.panelOpt.sel = c.dataset.ms; if (Mounts.data().own[c.dataset.ms]) Mounts.select(c.dataset.ms); UI.mountBtns(); return this.renderPanel(); }
      const b = e.target.closest('[data-mbuy]'); if (b) { if (b.dataset.short) { this.toast('เพชรไม่พอ ไปหน้าเติมเพชรได้เลย', 'warn'); return this.openPanel('topup'); } if (Mounts.buy(b.dataset.mbuy)) { UI.mountBtns(); } return this.renderPanel(); }
      const t = e.target.closest('[data-mtry]'); if (t) { Mounts.trial(t.dataset.mtry); UI.mountBtns(); return this.closePanel(); }
      const r = e.target.closest('[data-mride]'); if (r) { Mounts.select(r.dataset.mride); const was = Mounts.riding(); Mounts.ride(!was); if (!was) return this.closePanel(); return this.renderPanel(); }
      const l = e.target.closest('[data-mlv]'); if (l) { Mounts.levelUp(l.dataset.mlv); return this.renderPanel(); }
    };
    $('#stonly').onchange = e => { this.panelOpt.only = e.target.checked; this.renderPanel(); };
  }
});

/* ---- gem shop integration ---- */
{
  const o = { owned: Gems.owned, name: Gems.name, desc: Gems.desc, icon: Gems.icon, buy: Gems.buy, completeTopup: Gems.completeTopup };
  Gems.owned = function (g) { return g.mount ? !!Mounts.data().own[g.mount] : o.owned.call(this, g); };
  Gems.name = function (g) { return g.mount ? 'สัตว์ขี่: ' + MOUNTS[g.mount].name : o.name.call(this, g); };
  Gems.desc = function (g) { if (!g.mount) return o.desc.call(this, g); const D = MOUNTS[g.mount]; return `ความเร็ว ${Math.round(D.spd * 100)}% · ${D.pas.name} · สกิล ${D.sk.name}`; };
  Gems.icon = function (g) { return g.mount ? `<img class="ic pimg mthumb" src="${StableView.thumb(g.mount)}" alt="">` : o.icon.call(this, g); };
  Gems.buy = function (g) {
    if (!g.mount) return o.buy.call(this, g);
    const S = Save.d, pr = this.price(g); if (this.owned(g)) return false;
    if (S.gems < pr) { UI.toast('เพชรไม่พอ เติมเพชรได้ที่ปุ่ม + เติมเพชร', 'warn'); return false; }
    S.gems -= pr; S.gemBuys[g.id] = 1; this.log('−' + pr, this.name(g)); Mounts.grant(g.mount); UI.gemPop(); UI.mountBtns(); UI.refreshAll(); return true;
  };
  Gems.completeTopup = function (kind, p) {
    if (kind !== 'special' || !p.mount) return o.completeTopup.call(this, kind, p);
    const S = Save.d, T = S.topup; T.spent += p.thb; S.gems += p.gems; this.log('+' + p.gems, `${p.name} ฿${p.thb} (ทดลอง)`);
    for (const [it, n] of p.items || []) Game.addItem(it, n, true); Mounts.grant(p.mount, true); UI.mountBtns();
    Save.write(); UI.gemPop(); Audio.sfx('level'); Achievements.check();
    return { got: p.gems, items: [...(p.items || [])] };
  };
}

