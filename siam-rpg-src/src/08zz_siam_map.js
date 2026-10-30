/* ============================================================
   สยาม RPG — map window (M): search · map picker · big map · options · filters
   Wraps UI.pMap: the AQ zone tab still paints the map picture, area names and
   the player; this file moves it into the สยาม layout and draws every marker
   (MVP, mini-boss, bosses, monsters, NPCs, warps, shrines) from Zones
   (02z_zones.js) so the filters can show or hide each kind. The AQ tabs skip
   their own markers when SiamMap exists (patched in by siam_rebrand.py).
   ============================================================ */
const SiamMap = {
  KEY: 'siam_mapfilter', OPT_KEY: 'siam_mapopt',
  CATS: [
    { k: 'mvp', n: 'บอส MVP', c: '#ffb02e' },
    { k: 'mini', n: 'มินิบอส', c: '#c46bff' },
    { k: 'boss', n: 'บอสประจำพื้นที่', c: '#ff5fd0' },
    { k: 'mon', n: 'มอนสเตอร์', c: '#ff8a5a' },
    { k: 'npc', n: 'NPC', c: '#ffd24a' },
    { k: 'warp', n: 'จุดวาร์ป', c: '#7fe6ff' },
    { k: 'shrine', n: 'แท่นบูชา', c: '#8fe0c9' }
  ],
  OPTS: [['labels', 'แสดงชื่อมอนสเตอร์และบอส', true], ['npcLabels', 'แสดงชื่อ NPC', false], ['timers', 'แสดงเวลาเกิดบอส MVP', true], ['found', 'ซ่อนจุดวาร์ปที่ยังไม่ค้นพบ', false]],
  load(key, def) { let v = null; try { v = JSON.parse(localStorage.getItem(key) || 'null'); } catch (e) { } return Object.assign({}, def, v || {}); },
  save(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) { } },
  filters() { return this.load(this.KEY, Object.fromEntries(this.CATS.map(c => [c.k, true]))); },
  opts() { return this.load(this.OPT_KEY, Object.fromEntries(this.OPTS.map(o => [o[0], o[2]]))); },
  zoneOfPanel(tab) { return ZONES[tab] && ZONES[tab].map ? tab : 'world'; },
  timeLeft(s) { s = Math.max(0, Math.round(s)); const m = Math.floor(s / 60); return `${m}:${String(s % 60).padStart(2, '0')}`; },
  esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); },

  // every marker of a zone, one row each: { cat, name, sub, x, z, zone }
  items(zone) {
    const S = Save.d, out = [];
    for (const m of Zones.mvps(zone)) out.push({ cat: m.tier === 'mvp' ? 'mvp' : 'mini', name: m.name, lvl: m.lvl, sub: `Lv.${m.lvl} · ${m.alive ? 'ออกมาแล้ว!' : 'เกิดในอีก ' + this.timeLeft(m.left)}`, alive: m.alive, left: m.left, x: m.home.x, z: m.home.z, zone });
    for (const r of Zones.monsters(zone)) out.push({ cat: r.boss ? 'boss' : 'mon', name: r.name, lvl: r.lvl, sub: `Lv.${r.lvl} · ${r.n} ตัวในพื้นที่`, x: r.home.x, z: r.home.z, zone });
    for (const n of Zones.npcs(zone)) out.push({ cat: 'npc', name: n.name, sub: n.role || '', x: n.x, z: n.z, zone });
    for (const w of Zones.warps(zone)) out.push({ cat: 'warp', name: w.name, sub: S.warps[w.id] ? 'ค้นพบแล้ว · วาร์ปได้' : 'ยังไม่ค้นพบ', found: !!S.warps[w.id], x: w.x, z: w.z, zone });
    for (const s of SHRINES) if ((s.zone || 'world') === zone) out.push({ cat: 'shrine', name: s.name, sub: BUFFS[s.buff].name + ' · ' + BUFFS[s.buff].desc, buff: s.buff, x: s.x, z: s.z, zone });
    return out;
  },
  visible(it, f, o) { return f[it.cat] && !(o.found && it.cat === 'warp' && !it.found); },
  // search across every zone, maps included
  search(q) {
    q = q.trim(); if (!q) return [];
    const res = [];
    for (const id of ZONE_ORDER) {
      const Z = ZONES[id];
      if (Z.name.includes(q)) res.push({ cat: 'map', name: Z.name, sub: `Lv.${Z.lv.join('–')}${Z.map ? '' : ' · ยังไม่มีแผนที่'}`, zone: id });
      if (Z.map) for (const it of this.items(id)) if (it.name.includes(q)) res.push(it);
    }
    return res.slice(0, 10);
  },

  layout(zone, f, o) {
    const items = this.items(zone), cnt = k => items.filter(i => i.cat === k).length;
    const shown = items.filter(i => this.visible(i, f, o)).length;
    const zoneOpts = ZONE_ORDER.map(id => `<option value="${id}" ${id === zone ? 'selected' : ''} ${ZONES[id].map ? '' : 'disabled'}>${ZONES[id].name} (Lv.${ZONES[id].lv.join('–')})${ZONES[id].map ? '' : ' · เร็ว ๆ นี้'}</option>`).join('');
    const cats = this.CATS.filter(c => cnt(c.k)).map(c => `<button class="smcat ${f[c.k] ? 'on' : ''}" data-mf="${c.k}" aria-pressed="${!!f[c.k]}"><span class="smdot" style="background:${c.c}"></span><span class="smcn">${c.n}</span><b>${cnt(c.k)}</b></button>`).join('');
    const opts = this.OPTS.map(([k, n]) => `<label class="smopt"><input type="checkbox" data-mo="${k}" ${o[k] ? 'checked' : ''}> ${n}</label>`).join('');
    const coarse = matchMedia('(pointer: coarse)').matches;
    return `<div class="smap">
      <div class="smtop"><label class="smsearch">${icon('map')}<input id="smq" type="search" autocomplete="off" placeholder="ค้นหาแผนที่ บอส มอนสเตอร์ NPC" aria-label="ค้นหาบนแผนที่"></label>
        <label class="smzone">แผนที่ <select id="smzone" aria-label="เลือกแผนที่">${zoneOpts}</select></label>
        <div id="smres" class="smres" hidden></div></div>
      <div class="smbody"><div class="smmain"><div id="smslot"></div><div id="smpop" class="smpop" hidden></div>
        <p class="smdesc">${this.esc(ZONES[zone].desc)} · ต้องการ Lv.${ZONES[zone].minLv}+</p></div>
        <aside class="smside">
          <details class="smbox" ${coarse ? '' : 'open'}><summary>ตัวเลือก</summary><div class="smopts">${opts}</div></details>
          <details class="smbox" open><summary>กรอง <small>${shown} จุด</small></summary>
            <div class="small"><button class="btn sm ${this.CATS.every(c => f[c.k]) ? '' : 'ghost'}" data-mall="1">ทั้งหมด</button><button class="btn sm ghost" data-mall="0">ซ่อนทั้งหมด</button></div>
            <div class="smcats">${cats}</div></details>
        </aside></div></div>`;
  },

  draw(zone, focus) {
    const Z = ZONES[zone], cv = document.getElementById('bigmap'); this.hits = []; if (!Z || !Z.map || !cv) return;
    const x = cv.getContext('2d'), M = Z.map, f = this.filters(), o = this.opts();
    const tp = (wx, wz) => [(wx + M.offX) * M.k, (wz + M.offZ) * M.k];
    const lbl = (t, a, b, c, size = 11) => { x.font = `600 ${size}px Mitr, sans-serif`; x.textAlign = 'center'; x.lineWidth = 4; x.strokeStyle = 'rgba(20,10,6,.88)'; x.strokeText(t, a, b); x.fillStyle = c; x.fillText(t, a, b); };
    const col = k => this.CATS.find(c => c.k === k).c;
    const order = ['shrine', 'warp', 'npc', 'mon', 'boss', 'mini', 'mvp'];
    const items = this.items(zone).filter(i => this.visible(i, f, o)).sort((a, b) => order.indexOf(a.cat) - order.indexOf(b.cat));
    for (const it of items) {
      const [a, b] = tp(it.x, it.z), c = it.cat === 'warp' && !it.found ? '#5a6b78' : it.cat === 'shrine' ? BUFFS[it.buff].col : col(it.cat);
      const r = { mvp: 9, mini: 8, boss: 7, mon: 5, npc: 4.5, warp: 7, shrine: 6 }[it.cat];
      x.fillStyle = c; x.strokeStyle = '#1d1712'; x.lineWidth = 1.5; x.beginPath();
      if (it.cat === 'warp' || it.cat === 'boss') { x.moveTo(a, b - r); x.lineTo(a + r * .8, b); x.lineTo(a, b + r); x.lineTo(a - r * .8, b); x.closePath(); } else x.arc(a, b, r, 0, TAU);
      x.fill(); x.stroke();
      if (it.cat === 'mvp' || it.cat === 'mini') lbl(it.cat === 'mvp' ? '👑' : '★', a, b + 4, '#fff', 10);
      if (it.cat === 'npc' ? o.npcLabels : o.labels && it.cat !== 'warp' && it.cat !== 'shrine') {
        const big = it.cat === 'mvp' || it.cat === 'mini';
        lbl(it.lvl ? `${it.name} Lv.${it.lvl}` : it.name, a, b - r - 4, big ? '#ffe08a' : it.cat === 'npc' ? '#fff1b8' : '#ffd0b0', big ? 12 : 11);
        if (big && o.timers) lbl(it.alive ? 'ออกมาแล้ว!' : `เกิดในอีก ${this.timeLeft(it.left)}`, a, b + r + 13, it.alive ? '#a5e84a' : '#d8cdb8', 11);
      }
      this.hits.push({ a, b, r: Math.max(r, 10), it });
    }
    if (focus && focus.zone === zone) { const [a, b] = tp(focus.x, focus.z); x.strokeStyle = '#ffe08a'; x.lineWidth = 3; x.beginPath(); x.arc(a, b, 16, 0, TAU); x.stroke(); x.lineWidth = 1.5; x.beginPath(); x.arc(a, b, 22, 0, TAU); x.stroke(); }
    const P = Player; // the player's own dot stays on top
    if (P.zone === zone) { const [a, b] = tp(P.x, P.z); x.fillStyle = '#a5e84a'; x.strokeStyle = '#1d1712'; x.lineWidth = 2; x.beginPath(); x.arc(a, b, 7, 0, TAU); x.fill(); x.stroke(); }
  },

  popup(it) {
    const pop = document.getElementById('smpop'); if (!pop) return;
    const c = it.cat === 'map' ? '#f3d48a' : this.CATS.find(k => k.k === it.cat).c, cn = it.cat === 'map' ? 'แผนที่' : this.CATS.find(k => k.k === it.cat).n;
    pop.innerHTML = `<div class="smph"><span class="smdot" style="background:${c}"></span><b>${this.esc(it.name)}</b><small>${cn}</small><button class="smx" data-smclose aria-label="ปิด">×</button></div>
      <p>${this.esc(it.sub || '')}</p>${it.cat === 'map' ? '' : '<button class="btn sm" data-smgo>นำทาง</button>'}`;
    pop.hidden = false; this.sel = it;
  },
  go(it) {
    if (Monsters.boss && Monsters.boss.engaged) { UI.toast('นำทางไม่ได้ระหว่างต่อสู้กับบอส', 'warn'); return; }
    UI.closePanel(); setTimeout(() => Nav.go({ zone: it.zone, x: it.x, z: it.z, r: 4, label: 'ไปที่ ' + it.name }), 60);
  },

  install() {
    const base = UI.pMap;
    UI.pMap = function (o) {
      base.call(this, o);
      const body = this.el.pbody, wrap = body.querySelector('.mapwrap'); if (!wrap) return;
      const zone = SiamMap.zoneOfPanel(this.panelOpt && this.panelOpt.tab), f = SiamMap.filters(), opt = SiamMap.opts();
      const tabs = body.querySelector('.maptabs'); if (tabs) tabs.hidden = true;
      this.el.ptitle.innerHTML = `${icon('map')} แผนที่${ZONES[zone].name}${o && o.warp ? ' · เลือกจุดวาร์ป' : ''}`;
      wrap.insertAdjacentHTML('beforebegin', SiamMap.layout(zone, f, opt));
      body.querySelector('#smslot').replaceWith(wrap);
      const warps = body.querySelector('.warps'); if (warps) body.querySelector('.smap').appendChild(warps);
      const focus = this.panelOpt.focus; SiamMap.draw(zone, focus);
      if (focus && focus.zone === zone && focus.it) SiamMap.popup(focus.it);
      const sm = body.querySelector('.smap'), q = sm.querySelector('#smq'), res = sm.querySelector('#smres');
      const rerender = () => UI.renderPanel();
      sm.addEventListener('click', e => {
        const t = e.target;
        const cat = t.closest('[data-mf]'); if (cat) { Audio.sfx('ui'); const v = SiamMap.filters(); v[cat.dataset.mf] = !v[cat.dataset.mf]; SiamMap.save(SiamMap.KEY, v); return rerender(); }
        const all = t.closest('[data-mall]'); if (all) { Audio.sfx('ui'); SiamMap.save(SiamMap.KEY, Object.fromEntries(SiamMap.CATS.map(c => [c.k, all.dataset.mall === '1']))); return rerender(); }
        if (t.closest('[data-smclose]')) { sm.querySelector('#smpop').hidden = true; UI.panelOpt.focus = null; return; }
        if (t.closest('[data-smgo]') && SiamMap.sel) return SiamMap.go(SiamMap.sel);
        const r = t.closest('[data-smr]'); if (r) { const it = SiamMap.lastRes[+r.dataset.smr]; Audio.sfx('ui'); UI.panelOpt.tab = it.zone; UI.panelOpt.focus = it.cat === 'map' ? null : { zone: it.zone, x: it.x, z: it.z, it }; return rerender(); }
        if (t.id === 'bigmap') {
          const cv = t, rc = cv.getBoundingClientRect(), a = (e.clientX - rc.left) * cv.width / rc.width, b = (e.clientY - rc.top) * cv.height / rc.height;
          let best = null, bd = 1e9; for (const h of SiamMap.hits) { const d = Math.hypot(h.a - a, h.b - b); if (d <= h.r + 6 && d < bd) { bd = d; best = h; } }
          if (best) { Audio.sfx('ui'); UI.panelOpt.focus = { zone, x: best.it.x, z: best.it.z, it: best.it }; SiamMap.draw(zone, UI.panelOpt.focus); SiamMap.popup(best.it); }
        }
      });
      sm.querySelectorAll('[data-mo]').forEach(cb => cb.addEventListener('change', () => { const v = SiamMap.opts(); v[cb.dataset.mo] = cb.checked; SiamMap.save(SiamMap.OPT_KEY, v); rerender(); }));
      sm.querySelector('#smzone').addEventListener('change', e => { UI.panelOpt.tab = e.target.value; UI.panelOpt.focus = null; rerender(); });
      q.addEventListener('input', () => {
        const list = SiamMap.lastRes = SiamMap.search(q.value);
        res.hidden = !q.value.trim();
        res.innerHTML = list.length ? list.map((it, i) => { const c = it.cat === 'map' ? '#f3d48a' : SiamMap.CATS.find(k => k.k === it.cat).c; return `<button class="smr" data-smr="${i}"><span class="smdot" style="background:${c}"></span><b>${SiamMap.esc(it.name)}</b><small>${SiamMap.esc(ZONES[it.zone].name)}${it.lvl ? ' · Lv.' + it.lvl : ''}</small></button>`; }).join('') : '<p class="muted">ไม่พบ</p>';
      });
      q.addEventListener('keydown', e => e.stopPropagation()); // typing must not move the character or open other windows
    };
    const css = document.createElement('style');
    css.textContent = `
.smap{--sm-gold:#d9a441;--sm-gold2:#f3d48a;--sm-red:#8e2a1f;--sm-teak:#24160f;--sm-teak2:#33211a;display:flex;flex-direction:column;gap:10px}
.smap .smtop{position:relative;display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:center}
.smap .smsearch{flex:1 1 220px;max-width:340px;display:flex;align-items:center;gap:6px;padding:6px 10px;border-radius:10px;background:var(--sm-teak);border:1px solid var(--sm-gold)}
.smap .smsearch input{flex:1;min-width:0;background:none;border:0;color:#f6ead2;font:inherit;outline:none}
.smap .smzone{display:flex;align-items:center;gap:6px;color:var(--sm-gold2);font-size:.9em}
.smap .smzone select{background:var(--sm-teak);color:#f6ead2;border:1px solid var(--sm-gold);border-radius:8px;padding:5px 8px;font:inherit}
.smap .smres{position:absolute;top:100%;left:50%;transform:translateX(-50%);z-index:5;width:min(420px,96%);margin-top:4px;padding:6px;border-radius:10px;background:var(--sm-teak);border:1px solid var(--sm-gold);box-shadow:0 8px 24px rgba(0,0,0,.5);display:flex;flex-direction:column;gap:2px}
.smap .smr{display:flex;align-items:center;gap:8px;text-align:left;padding:6px 8px;border-radius:7px;background:none;border:0;color:#f6ead2;font:inherit;cursor:pointer}
.smap .smr:hover,.smap .smr:focus-visible{background:var(--sm-teak2)}.smap .smr small{margin-left:auto;color:#cbb994}
.smap .smbody{display:flex;flex-wrap:wrap;gap:12px;align-items:flex-start}
.smap .smmain{flex:1 1 360px;min-width:0;position:relative}
.smap .smmain .mapwrap{max-width:none;width:100%;margin:0;padding:6px;border-radius:12px;background:linear-gradient(135deg,var(--sm-red),#5a1812);box-shadow:inset 0 0 0 2px var(--sm-gold),inset 0 0 0 5px var(--sm-red),inset 0 0 0 6px var(--sm-gold2)}
.smap .smmain canvas{display:block;width:100%;height:auto;border-radius:8px;cursor:pointer}
.smap .smdesc{margin:6px 2px 0;font-size:.85em;color:#cbb994}
.smap .smside{flex:0 1 230px;min-width:200px;display:flex;flex-direction:column;gap:10px}
.smap .smbox{border-radius:10px;background:var(--sm-teak);border:1px solid rgba(217,164,65,.55);overflow:hidden}
.smap .smbox>summary{cursor:pointer;padding:8px 12px;font-weight:600;color:var(--sm-gold2);background:linear-gradient(90deg,var(--sm-teak2),var(--sm-teak));border-bottom:1px solid rgba(217,164,65,.35);list-style:none}
.smap .smbox>summary::before{content:'◈ ';color:var(--sm-gold)}.smap .smbox>summary small{float:right;font-weight:400;color:#cbb994}
.smap .smopts{display:flex;flex-direction:column;gap:6px;padding:10px 12px}.smap .smopt{display:flex;gap:6px;align-items:center;font-size:.88em;color:#f0e2c4}
.smap .small{display:flex;gap:6px;padding:8px 10px 0}
.smap .smcats{display:flex;flex-direction:column;gap:6px;padding:8px 10px 10px}
.smap .smcat{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:9px;background:var(--sm-teak2);border:1px solid rgba(217,164,65,.25);color:#a9997d;font:inherit;cursor:pointer;text-align:left}
.smap .smcat.on{color:#f6ead2;border-color:var(--sm-gold);box-shadow:inset 3px 0 0 var(--sm-gold)}
.smap .smcat .smcn{flex:1}.smap .smcat b{color:var(--sm-gold2);font-weight:600}
.smap .smdot{width:10px;height:10px;border-radius:50%;flex:none;box-shadow:0 0 0 1.5px #1d1712}
.smap .smpop{position:absolute;left:12px;top:12px;max-width:min(280px,80%);padding:10px 12px;border-radius:10px;background:rgba(36,22,15,.96);border:1px solid var(--sm-gold);box-shadow:0 6px 20px rgba(0,0,0,.5);color:#f6ead2}
.smap .smph{display:flex;align-items:center;gap:6px}.smap .smph small{color:#cbb994}.smap .smx{margin-left:auto;background:none;border:0;color:#f3d48a;font-size:20px;line-height:1;cursor:pointer}
.smap .smpop p{margin:6px 0 8px;font-size:.88em;color:#e3d3b2}
@media (max-width:720px){.smap .smside{flex-basis:100%}}`;
    document.head.appendChild(css);
  }
};
SiamMap.install();
