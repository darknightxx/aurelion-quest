/* ============================================================
   Multi-seat mounts: network hooks, passenger drawing, peer card button
   ============================================================ */
/* hooks */
{
  // net state: who I ride with
  const oms = Net.myState.bind(Net); Net.myState = function () { const st = oms(); st.rp = Seats.driver || ''; st.rt = Seats.since || 0; if (Seats.driver) st.m = ''; return st; };
  // player draw: mount seats cache + passenger pose
  const omd = Mounts.draw.bind(Mounts); Mounts.draw = function (R, P) { const r = omd(R, P); if (r && r.seat && r.seat.all) Seats.cache.me = r.seat.all; else if (!this.riding()) delete Seats.cache.me; return r; };
  const ou = Mounts.update.bind(Mounts); Mounts.update = function (dt) { ou(dt); Seats.update(dt); };
  const orr = Mounts.riding.bind(Mounts); Mounts.riding = function () { return !Seats.driver && orr(); };
  const ord = Mounts.ride.bind(Mounts); Mounts.ride = function (on) { if (Seats.driver) { Seats.leave(); return; } ord(on); };
  // peers: cache their seats, draw passengers on the mount
  const od = Remote.draw.bind(Remote);
  Remote.draw = function (R) {
    const Pz = Player.zone;
    for (const p of this.map.values()) {
      if (p.zone !== Pz || dist2(p.dx, p.dz, Player.x, Player.z) > 70 * 70) continue;
      const st = p.st, rig = this.rig(p);
      if (st.rp) { // passenger
        const pos = Seats.peerPos(p); const face = Seats.driverFace(p);
        Sprites.capture(R, pos ? pos[0] : p.dx, pos ? pos[1] + 1.2 : 1.5, pos ? pos[2] : p.dz, SPR_CHAR.w, SPR_CHAR.h, () => {
          if (pos) rig.pose(pos[0], pos[1] - HIPY * CHAR_SCALE + .05, pos[2], face, CHAR_SCALE); else rig.pose(p.dx, 0, p.dz, p.face, CHAR_SCALE, st.d ? 1 : 0);
          const sh = st.o && CharModels[st.o] ? st.o : st.c; rig.draw(R, CharModels[sh]);
          if (!st.d) drawCosmetics3D(R, rig, { head: st.h || null, face: st.fc || null, back: st.b || null, sheet: sh, anim: p.anim, walk: 0 });
        });
        continue;
      }
      const riding = st.m && MOUNTS[st.m]; const MD = riding && !st.d ? MOUNTS[st.m] : null;
      const cw = MD ? Math.max(4.2, (MD.seats ? 7 : 4.6) * MD.sc) : SPR_CHAR.w, ch = MD ? (MD.seat[0] + 2.7) * Math.max(1, MD.sc * .9) + (MD.kind === 'float' ? .6 : 0) : SPR_CHAR.h;
      Sprites.capture(R, p.dx, ch / 2 - .15, p.dz, cw, ch, () => {
        let seat = null; if (MD) seat = drawMount(R, MountMeshes, st.m, p.dx, 0, p.dz, p.face, p.mst, 1);
        if (seat && seat.all) Seats.cache[p.uid] = seat.all; else delete Seats.cache[p.uid];
        if (seat) rig.pose(seat[0], seat[1] - HIPY * CHAR_SCALE + .05, seat[2], p.face, CHAR_SCALE); else rig.pose(p.dx, 0, p.dz, p.face, CHAR_SCALE, st.d ? 1 : 0);
        const sh = st.o && CharModels[st.o] ? st.o : st.c; rig.draw(R, CharModels[sh]);
        if (!st.d) drawCosmetics3D(R, rig, { head: st.h || null, face: st.fc || null, back: st.b || null, sheet: sh, anim: p.anim, walk: p.walk });
      });
    }
  };
  const oup = Remote.update.bind(Remote);
  Remote.update = function (dt) { oup(dt); for (const p of this.map.values()) if (p.st && p.st.rp && p.zone === Player.zone && p.rig) p.rig.update(dt, { ride: true, dead: !!p.st.d }); };
}

KIND_ICON.vehicle = 'star';
/* peer card: ride together */
{
  const opc = UI.peerCard.bind(UI);
  UI.peerCard = function (p) {
    opc(p); const el = $('#peercard'); const box = el.querySelector('.pcbtns'); if (!box) return;
    const st = p.st; const b = document.createElement('button'); b.className = 'btn';
    if (Seats.driver === p.uid) { b.textContent = 'ลงจากพาหนะ'; b.onclick = e => { e.stopPropagation(); el.hidden = true; Seats.leave(); }; }
    else { const why = Seats.canJoin(p); const cap = st && st.m && MOUNTS[st.m] ? Seats.cap(st.m) : 1; if (cap < 2 && !(st && st.m)) return; b.textContent = `ขึ้นนั่งด้วย (${Seats.passengers(p.uid).length + 1}/${cap})`; if (why !== null) { b.disabled = true; b.title = why || ''; } b.onclick = e => { e.stopPropagation(); el.hidden = true; Seats.join(p); }; }
    box.prepend(b);
  };
  const omb = UI.mountBtns.bind(UI);
  UI.mountBtns = function () { omb(); const el = $('#mountbtns'); if (!el || !Save.d) return; if (Seats.driver) { el.hidden = false; const rb = $('#mride'); rb.classList.add('on'); rb.querySelector('.tip').textContent = 'ลงจากพาหนะ (V)'; $('#mskill').hidden = true; } };
}

