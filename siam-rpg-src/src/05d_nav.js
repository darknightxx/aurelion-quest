/* ============================================================
   Navigation: A* over a collision grid + quest auto-travel
   ============================================================ */
const Nav = {
  grids: {},
  build() {
    const dyn = Col.boxes.filter(b => b.tag === 'barricade' || b.tag === 'gate');
    const saved = dyn.map(b => b.on); dyn.forEach(b => b.on = false);
    const mk = (zone, x0, x1, z0, z1) => {
      const S = 2, w = Math.round((x1 - x0) / S) + 1, h = Math.round((z1 - z0) / S) + 1; const g = new Uint8Array(w * h);
      for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const x = x0 + i * S, z = z0 + j * S; g[j * w + i] = Col.blocked(x, z, .8) ? 1 : 0; }
      this.grids[zone] = { x0, z0, S, w, h, g };
    };
    mk('world', -146, 146, -144, 144);
    mk('dungeon', 962, 1038, -128, 14);
    dyn.forEach((b, i) => b.on = saved[i]);
    this.dyn = dyn;
  },
  free(G, i, j) {
    if (i < 0 || j < 0 || i >= G.w || j >= G.h || G.g[j * G.w + i]) return false;
    const x = G.x0 + i * G.S, z = G.z0 + j * G.S;
    for (const b of this.dyn) if (b.on && x > b.x0 - 1 && x < b.x1 + 1 && z > b.z0 - 1 && z < b.z1 + 1) return false;
    return true;
  },
  cell(G, x, z) { return [Math.round((x - G.x0) / G.S), Math.round((z - G.z0) / G.S)]; },
  nearestFree(G, i, j) { if (this.free(G, i, j)) return [i, j]; for (let r = 1; r < 8; r++) for (let dj = -r; dj <= r; dj++) for (let di = -r; di <= r; di++) if (Math.max(Math.abs(di), Math.abs(dj)) === r && this.free(G, i + di, j + dj)) return [i + di, j + dj]; return null; },
  // A* returns list of world points or null
  find(zone, sx, sz, tx, tz) {
    const G = this.grids[zone]; if (!G) return null;
    const s = this.nearestFree(G, ...this.cell(G, sx, sz)), t = this.nearestFree(G, ...this.cell(G, tx, tz)); if (!s || !t) return null;
    const W = G.w, N = W * G.h; const gS = new Float32Array(N).fill(1e9), came = new Int32Array(N).fill(-1), closed = new Uint8Array(N);
    const si = s[1] * W + s[0], ti = t[1] * W + t[0];
    const heap = []; const push = (k, f) => { heap.push([f, k]); let c = heap.length - 1; while (c > 0) { const p = (c - 1) >> 1; if (heap[p][0] <= heap[c][0]) break; [heap[p], heap[c]] = [heap[c], heap[p]]; c = p; } };
    const pop = () => { const top = heap[0]; const last = heap.pop(); if (heap.length) { heap[0] = last; let c = 0; for (;;) { const l = c * 2 + 1, r = l + 1; let m = c; if (l < heap.length && heap[l][0] < heap[m][0]) m = l; if (r < heap.length && heap[r][0] < heap[m][0]) m = r; if (m === c) break; [heap[m], heap[c]] = [heap[c], heap[m]]; c = m; } } return top; };
    const hfn = k => { const i = k % W, j = (k / W) | 0; const dx = Math.abs(i - t[0]), dz = Math.abs(j - t[1]); return (dx + dz) + (1.4142 - 2) * Math.min(dx, dz); };
    gS[si] = 0; push(si, hfn(si)); let it = 0;
    while (heap.length && it++ < 60000) {
      const [, k] = pop(); if (closed[k]) continue; closed[k] = 1; if (k === ti) break;
      const i = k % W, j = (k / W) | 0;
      for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
        if (!di && !dj) continue; const ni = i + di, nj = j + dj; if (!this.free(G, ni, nj)) continue;
        if (di && dj && (!this.free(G, i + di, j) || !this.free(G, i, j + dj))) continue;
        const nk = nj * W + ni; if (closed[nk]) continue; const ng = gS[k] + (di && dj ? 1.4142 : 1);
        if (ng < gS[nk]) { gS[nk] = ng; came[nk] = k; push(nk, ng + hfn(nk)); }
      }
    }
    if (came[ti] < 0 && si !== ti) return null;
    const cells = []; for (let k = ti; k >= 0 && k !== si; k = came[k]) cells.push(k); cells.push(si); cells.reverse();
    const pts = cells.map(k => [G.x0 + (k % W) * G.S, G.z0 + ((k / W) | 0) * G.S]);
    // string pulling
    const out = [pts[0]]; let a = 0;
    while (a < pts.length - 1) { let b = pts.length - 1; while (b > a + 1 && !this.los(G, pts[a], pts[b])) b--; out.push(pts[b]); a = b; }
    out[out.length - 1] = [tx, tz];
    return out.slice(1).map(p => ({ x: p[0], z: p[1] }));
  },
  los(G, a, b) { const d = Math.hypot(b[0] - a[0], b[1] - a[1]); const n = Math.ceil(d / (G.S * .5)); for (let k = 1; k < n; k++) { const x = lerp(a[0], b[0], k / n), z = lerp(a[1], b[1], k / n); const [i, j] = this.cell(G, x, z); if (!this.free(G, i, j)) return false; } return true; },

  /* ---------- quest auto-travel ---------- */
  active: null,
  stop(msg) { if (!this.active) return; this.active = null; Player.nav = null; UI.navBar(null); if (msg) UI.toast(msg, 'info'); },
  // goal: {zone, x, z, label, arrive: fn}
  go(goal) {
    const P = Player; this.active = goal; P.target = null; P.moveTo = null;
    if (!this.plan()) { this.active = null; return false; }
    UI.navBar(goal.label); Audio.sfx('ui'); return true;
  },
  plan() {
    const P = Player, g = this.active; if (!g) return false;
    let tx = g.x, tz = g.z;
    if (g.zone !== P.zone) {
      if (P.zone === 'world') { if (!(Save.d.flags.gate && Save.d.level >= 5)) { UI.toast(!Save.d.flags.gate ? 'ยังเข้าถ้ำไม่ได้ ต้องทำเควสหลักก่อน' : 'ต้องมีเลเวล 5 ขึ้นไปจึงจะเข้าถ้ำได้', 'warn'); return false; } tx = 0; tz = -142; }
      else { tx = DX; tz = 12.5; }
    }
    const path = this.find(P.zone, P.x, P.z, tx, tz);
    if (!path) { UI.toast(P.zone === 'world' && !Save.d.flags.bridge && tz < 4 ? 'สะพานยังปิดอยู่ ทำเควสแรกให้เสร็จก่อน' : 'หาเส้นทางไปจุดหมายไม่ได้', 'warn'); return false; }
    P.nav = { path, i: 0, stuck: 0, final: g.zone === P.zone };
    return true;
  },
  // called by Player.update every frame while nav active; returns [dx,dz]
  steer(dt) {
    const P = Player, n = P.nav; if (!n || !this.active) return null;
    while (n.i < n.path.length) {
      const p = n.path[n.i]; const d = Math.hypot(p.x - P.x, p.z - P.z);
      if (d < (n.i === n.path.length - 1 ? (this.active.r || 1.2) : 1.4)) n.i++; else return [(p.x - P.x) / d, (p.z - P.z) / d];
    }
    // reached end of current-zone path
    if (n.final) { const g = this.active; this.active = null; P.nav = null; UI.navBar(null); g.arrive && g.arrive(); }
    else { P.moveTo = null; return [0, -1 * (P.zone === 'world' ? 1 : -1)]; } // keep walking into the portal
    return null;
  },
  retreat() {
    const P = Player; let best = null, bd = 1e12;
    for (const w of WARPS) { if (w.zone !== P.zone) continue; const d = dist2(w.x, w.z, P.x, P.z); if (d < bd) { bd = d; best = w; } }
    if (best) this.go({ zone: best.zone, x: best.x + 2.5, z: best.z + 2.5, r: 2, label: 'ถอยไปพักที่ ' + best.name, arrive: () => UI.toast('พักฟื้นที่นี่ HP จะค่อยๆ เพิ่มขึ้นเมื่อไม่ได้ต่อสู้', 'info') });
  },
  onTeleport() { if (this.active) setTimeout(() => { if (this.active && !this.plan()) this.stop(); }, 50); },
  onStuck() { if (this.active && !this.plan()) this.stop('ทางถูกขวางอยู่ หยุดนำทาง'); },

  /* destinations */
  ITEM_MON: { m_jelly: 'slime', m_cap: 'shroom', m_fang: 'wolf', m_totem: 'goblin', m_bone: 'skel' },
  monsterSpot(type) {
    const P = Player; let best = null, bd = 1e12;
    for (const [t, x, z] of SPAWNS) { if (type && t !== type) continue; if (!type && t === 'goblin' && Save.d.level < 4) continue; const zone = World.zoneOf(x); const d = (zone === P.zone ? 0 : 1e6) + dist2(x, z, P.x, P.z); if (zone === 'world' && z < 0 && !Save.d.flags.bridge) continue; if (d < bd) { bd = d; best = { x, z, zone, type: t }; } }
    return best;
  },
  goNpc(npcId, why) { const n = NPCList.find(x => x.id === npcId); if (!n) return false; return this.go({ zone: n.zone, x: n.x, z: n.z + 2.2, r: 2.2, label: why + ' ' + n.name, arrive: () => { n.face = Math.atan2(Player.x - n.x, Player.z - n.z); Game.interact({ kind: 'npc', ref: n }); } }); },
  goQuest(id) {
    const q = QUESTS[id]; const S = Save.d;
    if (Player.dead) return;
    const npcGoal = (npcId, why) => { const n = NPCList.find(x => x.id === npcId); return this.go({ zone: n.zone, x: n.x, z: n.z + 2.2, r: 2.2, label: why + ' ' + n.name, arrive: () => { n.face = Math.atan2(Player.x - n.x, Player.z - n.z); Game.interact({ kind: 'npc', ref: n }); } }); };
    if (!Quests.st(id) || Quests.available(id)) return npcGoal(q.giver, 'ไปรับเควสกับ');
    if (Quests.complete(id)) return npcGoal(q.giver, 'ไปส่งเควสกับ');
    // first unfinished objective
    const pr = Quests.progress(id); const k = pr.findIndex(o => o.have < o.n); const o = q.obj[k];
    if (!o) return false;
    if (o.k === 'boss') return this.go({ zone: 'dungeon', x: DX, z: -86, r: 3, label: 'บุกลานผู้พิทักษ์ผลึก', arrive: () => UI.toast('ยักษ์ศิลา อยู่ข้างหน้า! ระวังวงสีแดงบนพื้น', 'boss') });
    if (o.k === 'quiz') return npcGoal(q.giver, 'ไปหา');
    const type = o.k === 'kill' ? o.mon : o.k === 'collect' ? this.ITEM_MON[o.item] : null;
    const spot = this.monsterSpot(type);
    if (!spot) { UI.toast('ไม่พบพื้นที่ของมอนสเตอร์นี้', 'warn'); return false; }
    const name = type ? MONSTERS[type].name : 'มอนสเตอร์';
    return this.go({ zone: spot.zone, x: spot.x, z: spot.z, r: 4, label: 'ไปล่า' + name, arrive: () => AutoHunt.start(id) });
  }
};

/* auto battle for a quest objective after arriving */
const AutoHunt = {
  on: false, quest: null, type: null, idle: 0,
  start(id) {
    const pr0 = Quests.progress(id), k0 = pr0.findIndex(o => o.have < o.n), o0 = QUESTS[id].obj[k0];
    const type = !o0 ? null : o0.k === 'kill' ? o0.mon : o0.k === 'collect' ? Nav.ITEM_MON[o0.item] : (o0.k === 'killany' || o0.k === 'killzone') ? null : undefined;
    if (!o0 || type === undefined) { Nav.goQuest(id); return; }
    const lv = type ? MONSTERS[type].lvl : 1; if (type && lv > Save.d.level + 1) UI.toast(`ระวัง! ${MONSTERS[type].name} เลเวล ${lv} สูงกว่าคุณ เตรียมยาไว้ให้พร้อม`, 'warn');
    this.on = true; this.quest = id; this.type = type; this.idle = 0; this.obj = Math.max(0, Quests.progress(id).findIndex(o => o.have < o.n)); UI.navBar('ล่าอัตโนมัติ: ' + (type ? MONSTERS[type].name : 'มอนสเตอร์'), true); UI.toast('เริ่มล่าอัตโนมัติ ขยับตัวเพื่อหยุด', 'quest'); },
  stop(msg) { if (!this.on) return; this.on = false; UI.navBar(null); if (msg) UI.toast(msg, 'quest'); },
  update(dt) {
    const P = Player;
    // while auto-travelling: drink potions and fight back against attackers
    if (Nav.active && !P.dead) {
      const S0 = Save.d;
      if (S0.hp < P.stats.maxhp * .35 && (S0.inv.hp_s || S0.inv.hp_l) && !(Skills.potCD > 0)) Game.useItem(S0.inv.hp_s ? 'hp_s' : 'hp_l');
      if (!P.target) { let best = null, bd = 6 * 6; for (const m of Monsters.list) { if (m.dead || !m.aggro || m.zone !== P.zone) continue; const d = dist2(m.x, m.z, P.x, P.z); if (d < bd) { bd = d; best = m; } } if (best) { P.target = { kind: 'mon', ref: best, defend: true }; UI.setTarget(best); } }
    }
    if (!this.on) return;
    if (P.dead) return this.stop();
    if (!Quests.active(this.quest)) return this.stop();
    const pr = Quests.progress(this.quest); const objDone = pr[this.obj] && pr[this.obj].have >= pr[this.obj].n;
    if (Quests.complete(this.quest) || objDone) {
      const q = this.quest, all = Quests.complete(q); this.stop(all ? 'ทำเป้าหมายครบแล้ว กำลังกลับไปส่งเควส' : 'เป้าหมายนี้ครบแล้ว ไปเป้าหมายถัดไป');
      if (P.target && P.target.kind === 'mon') P.target = null;
      if (!Player.dead) Nav.goQuest(q); return;
    }
    const S = Save.d;
    if (S.hp < P.stats.maxhp * .35 && (S.inv.hp_s || S.inv.hp_l) && !(Skills.potCD > 0)) Game.useItem(S.inv.hp_s ? 'hp_s' : 'hp_l');
    if (S.hp < P.stats.maxhp * .3 && !S.inv.hp_s && !S.inv.hp_l) { P.target = null; this.stop('HP ต่ำและยาหมดแล้ว ถอยกลับไปพักก่อน'); Nav.retreat(); return; }
    // use the small skills when they are ready
    if (P.target && P.target.kind === 'mon' && !P.target.ref.dead && dist2(P.target.ref.x, P.target.ref.z, P.x, P.z) < 49) {
      const sk = Cls.of(S).skills; for (let i = 0; i < 4; i++) { const d = SKILLS[sk[i]]; const ok = DMG_TYPES.includes(d.type) || (d.type === 'heal' && S.hp < P.stats.maxhp * .6) || (d.type === 'cleanse' && Object.keys(S.buffs).some(k => BUFFS[k] && BUFFS[k].bad)); if (Skills.cd[i] <= 0 && S.mp >= SkillLv.mp(sk[i]) + 6 && ok && !P.getRig().busy) { Skills.use(i); break; } }
    }
    if (P.target && P.target.kind === 'mon' && !P.target.ref.dead) { this.idle = 0; return; }
    let best = null, bd = 32 * 32;
    for (const m of Monsters.list) { if (m.dead || m.zone !== P.zone || (this.type && m.type !== this.type)) continue; const d = dist2(m.x, m.z, P.x, P.z); if (d < bd) { bd = d; best = m; } }
    if (best) { P.target = { kind: 'mon', ref: best }; UI.setTarget(best); this.idle = 0; }
    else {
      this.idle += dt;
      if (this.idle > 3) {
        this.idle = 0; let tgt = null, td = 1e12;
        for (const m of Monsters.list) { if (m.dead || m.zone !== P.zone || (this.type && m.type !== this.type) || m.summon) continue; const d = dist2(m.x, m.z, P.x, P.z); if (d < td) { td = d; tgt = m; } }
        if (tgt) { const q = this.quest, ty = this.type; this.on = false; Nav.go({ zone: tgt.zone, x: tgt.x, z: tgt.z, r: 5, label: 'ไปล่า' + MONSTERS[tgt.type].name, arrive: () => this.start(q) }); }
      }
    }
  }
};

