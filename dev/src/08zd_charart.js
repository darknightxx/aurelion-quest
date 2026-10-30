
/* ============================================================
   Character look "ภาพวาด 2D" (default): players, NPCs and other
   players are drawn with the game's hand-drawn character art,
   RO style — 8 viewing directions picked from the sheet, paper-
   doll walk deformation, action/emote poses, hair recoloured per
   NPC. Settings → ภาพตัวละคร switches back to the 3D models.
   Also: 80 emotes (ท่าทาง) with motions for both looks.
   ============================================================ */
const AF = { front: 0, happy: 1, front2: 2, f34: 3, sideR: 4, sideL: 5, back: 6, back2: 7, b34: 8, shield: 9, cheer: 10, think: 11, ready: 12, run: 13, hurt: 14, wave: 15 };
const EMO2D = {};
const ATK_CLIPS = new Set(['slash', 'throw', 'bow', 'bowUp', 'spin', 'cleave', 'bash', 'dash', 'slam', 'leap']);
const CharArt = {
  q: [], cache: {},
  on() { return Settings.d.charStyle !== '3d'; },
  recolor(c, hair) {
    const x = c.getContext('2d'), im = x.getImageData(0, 0, c.width, c.height), d = im.data, kwRGB = { white: [.93, .93, .9], black: [.16, .15, .2], brown: [.42, .26, .14] }, kw = typeof hair === 'string' ? kwRGB[hair] : null;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] < 20) continue; const r = d[i] / 255, g = d[i + 1] / 255, b = d[i + 2] / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, s = mx === mn ? 0 : (mx - mn) / (1 - Math.abs(2 * l - 1));
      let h = 0; if (mx !== mn) { if (mx === r) h = ((g - b) / (mx - mn)) % 6; else if (mx === g) h = (b - r) / (mx - mn) + 2; else h = (r - g) / (mx - mn) + 4; h *= 60; if (h < 0) h += 360; }
      if (h < 52 || h > 165 || s < .14 || (h < 70 && g < r * .95)) continue;
      let rr, gg, bb;
      if (kw) { if (hair === 'white') { rr = gg = bb = .55 + l * .5; } else { const t = l * 1.25; rr = kw[0] * t; gg = kw[1] * t; bb = kw[2] * t; } }
      else { const H = hair / 60, C2 = (1 - Math.abs(2 * l - 1)) * Math.min(1, s * 1.05), X = C2 * (1 - Math.abs(H % 2 - 1)), m0 = l - C2 / 2; [rr, gg, bb] = [[C2, X, 0], [X, C2, 0], [0, C2, X], [0, X, C2], [X, 0, C2], [C2, 0, X]][Math.floor(H) % 6]; rr += m0; gg += m0; bb += m0; }
      d[i] = clamp(rr, 0, 1) * 255; d[i + 1] = clamp(gg, 0, 1) * 255; d[i + 2] = clamp(bb, 0, 1) * 255;
    }
    x.putImageData(im, 0, 0);
  },
  // texture for a rig: base class sheets, job → base class, NPC hair recolour
  tex(rig) {
    if (rig._artTex !== undefined && rig._artFor === rig.cls) return rig._artTex;
    let sheet = rig.cls, hair;
    if (!Game.tex[sheet]) sheet = JOBS[sheet] && JOBS[sheet].base;
    if (!sheet || !Game.tex[sheet]) { if (rig === Player.rig && Save.d) sheet = Save.d.cls; else for (const p of Remote.map.values()) if (p.rig === rig || p._rig === rig) { sheet = p.st && p.st.c; break; } }
    const npc = NPCList.find(n => n.rig === rig); if (npc && NPCS[npc.id] && NPCS[npc.id].hair !== undefined) hair = NPCS[npc.id].hair;
    let t = sheet && Game.tex[sheet] ? Game.tex[sheet] : null;
    if (t && hair !== undefined) { const k = sheet + '|' + hair; if (!this.cache[k]) { const img = Game.images[sheet]; const c = document.createElement('canvas'); c.width = 1024; c.height = 512; c.getContext('2d').drawImage(img, 0, 0, 1024, 512); try { this.recolor(c, hair); this.cache[k] = Game.R.texture(c); } catch (e) { this.cache[k] = t; } } t = this.cache[k]; }
    rig._artTex = t; rig._artFor = rig.cls; return t;
  },
  dirFrame(face, x, z) {
    const R = Game.R; let cx = R.cam[0] - x, cz = R.cam[2] - z; const l = Math.hypot(cx, cz) || 1; cx /= l; cz /= l;
    const fx = Math.sin(face), fz = Math.cos(face), dot = fx * cx + fz * cz, rt = R.camRight, sx = fx * rt[0] + fz * rt[2];
    const deg = Math.atan2(sx, dot) * 180 / Math.PI, ad = Math.abs(deg), right = deg > 0;
    if (ad < 22) return { f: AF.front, flip: false, st: 0 };
    if (ad < 68) return { f: AF.f34, flip: right, st: .6, dir: right ? 1 : -1 };
    if (ad < 112) return { f: right ? AF.sideR : AF.sideL, flip: false, st: 1, dir: right ? 1 : -1 };
    if (ad < 158) return { f: AF.b34, flip: right, st: .6, dir: right ? 1 : -1 };
    return { f: AF.back, flip: false, st: 0 };
  },
  pose(rig, it) {
    const st = rig._st || {}, t = rig.t || 0, clip = rig.clip ? rig.clipName : null, u = rig.clip ? Math.min(1, rig.clipT) : 0;
    const d = this.dirFrame(it.face, it.x, it.z); let o = { f: d.f, flip: d.flip, y: 0, rot: 0, lean: 0, sq: 1, h: 1, amp: st.ride ? 0 : st.walk || 0, ph: st.ph || 0, stride: d.st || 0, br: Math.sin(t * 2.2) * (1 - (st.walk || 0)) };
    o.lean = (d.dir || 0) * o.amp * .05 * o.stride;
    if (st.dead || it.fall > 0) { o.f = AF.hurt; o.rot = (it.fall || 1) * 1.45 * (d.dir || 1); o.y = -.35 * (it.fall || 1); o.amp = 0; return o; }
    if (clip && EMO2D[clip]) { Object.assign(o, EMO2D[clip](u, t, d)); return o; }
    if (clip && ATK_CLIPS.has(clip)) { const k = Math.sin(Math.min(1, u * 1.6) * Math.PI); if (d.st >= .6) { o.lean = (d.dir || 1) * k * .35; } else { o.f = AF.ready; o.flip = d.dir > 0; o.h = 1 + k * .05; } if (clip === 'spin') o.flip = Math.floor(u * 8) % 2 === 1; if (clip === 'leap' || clip === 'slam') o.y = Math.sin(u * Math.PI) * 1.2; return o; }
    if (clip === 'cast' || clip === 'pray') { o.f = clip === 'pray' ? AF.think : AF.wave; o.flip = (d.dir || 0) > 0; o.y = Math.sin(u * Math.PI) * .15; return o; }
    if (clip === 'cheer') { o.f = AF.cheer; o.y = Math.abs(Math.sin(u * Math.PI * 2)) * .4; return o; }
    if (clip === 'hurt') { o.f = AF.hurt; o.lean = -(d.dir || 1) * .15 * (1 - u); return o; }
    if (st.think) { o.f = AF.think; return o; }
    if (st.wave) { o.f = AF.wave; return o; }
    if (it.sit) { o.f = AF.front; o.h = .72; o.y = -.05; o.amp = 0; }
    return o;
  },
  flush(R) {
    if (!this.q.length) return; const q = this.q; this.q = [];
    const c = R.cam; q.sort((a, b) => dist2(b.x, b.z, c[0], c[2]) - dist2(a.x, a.z, c[0], c[2]));
    R.useSprite();
    for (const it of q) {
      const o = this.pose(it.rig, it), s = it.s || 1, k = s / CHAR_SCALE;
      const an = { ph: o.ph, amp: o.amp, lean: o.lean, br: o.br, stride: o.stride, sq: o.sq };
      R.sprRot = o.rot || 0;
      R.drawSprite(it.tex, it.x, it.y + (o.y || 0), it.z, SPR_W * k, SPR_H * k * (o.h || 1), UVS[o.f], o.flip, null, it.flash || 0, 1, 1, an);
    }
    R.sprRot = 0; R.endSprite(); R.useLit();
  }
};
Settings.d.charStyle = Settings.d.charStyle || '2d';
{
  const RP = Rig.prototype;
  const op = RP.pose; RP.pose = function (x, y, z, face, s, fall) { this._p = [x, y, z, face, s || CHAR_SCALE, fall || 0]; return op.call(this, x, y, z, face, s, fall); };
  const ou = RP.update; RP.update = function (dt, st) { this._st = st; return ou.call(this, dt, st); };
  const od = RP.draw; RP.draw = function (R, parts, opts) {
    if (!CharArt.on() || R !== Game.R || !this._p) return od.call(this, R, parts, opts);
    const tex = CharArt.tex(this); if (!tex) return od.call(this, R, parts, opts);
    const [x, y, z, face, s, fall] = this._p; CharArt.q.push({ rig: this, tex, x, y: y > .3 ? y + HIPY * CHAR_SCALE - .55 : y, z, face, s, fall, flash: opts && opts.flash, sit: this === Player.rig && Player.sitting });
  };
  const oc = drawCosmetics3D; drawCosmetics3D = function (R, rig, o) { if (CharArt.on() && rig && rig._artTex) return; return oc(R, rig, o); };
  const oe = Sprites.end.bind(Sprites); Sprites.end = function (R) { oe(R); if (R === Game.R) try { CharArt.flush(R); } catch (e) { console.error(e); CharArt.q = []; } };
  const os = UI.pSettings.bind(UI);
  UI.pSettings = function () {
    os(); const b = this.el.pbody, fs = document.createElement('fieldset');
    fs.innerHTML = `<legend>ภาพตัวละคร</legend>${[['2d', 'ภาพวาด 2D แบบ RO (เหมือนภาพตัวละครในหน้าเลือกอาชีพ)'], ['3d', 'โมเดล 3 มิติ (เห็นชุดแต่งตัว หมวก ปีก บนตัว)']].map(([v, l]) => `<label class="radio"><input type="radio" name="cstyle" value="${v}" ${Settings.d.charStyle === v ? 'checked' : ''}> ${l}</label>`).join('')}`;
    const first = b.querySelector('fieldset'); b.insertBefore(fs, first ? first.nextSibling : null);
    fs.querySelectorAll('[name=cstyle]').forEach(r => r.onchange = () => { Settings.d.charStyle = r.value; Settings.save(); });
  };
}

/* ---------------- 80 emotes ---------------- */
// pose helpers for the 3D rig (bones: chest head shL elL shR elR thL knL thR knR hips root{y,z,spin})
const EP = {
  armsUp: { shL: [-2.9, 0, .3], shR: [-2.9, 0, -.3], elL: [-.2, 0, 0], elR: [-.2, 0, 0] },
  armsOut: { shL: [0, 0, 1.45], shR: [0, 0, -1.45] },
  armsFwd: { shL: [-1.5, 0, .1], shR: [-1.5, 0, -.1] },
  handsChest: { shL: [-1.1, .5, .3], elL: [-1.9, 0, 0], shR: [-1.1, -.5, -.3], elR: [-1.9, 0, 0] },
  handsFace: { shL: [-1.7, .4, .3], elL: [-2.3, 0, 0], shR: [-1.7, -.4, -.3], elR: [-2.3, 0, 0], head: [.25, 0, 0] },
  handsHips: { shL: [-.2, 0, .7], elL: [-1.6, 0, 0], shR: [-.2, 0, -.7], elR: [-1.6, 0, 0] },
  squat: { thL: [-1.3, 0, .2], thR: [-1.3, 0, -.2], knL: [2.2, 0, 0], knR: [2.2, 0, 0], root: { y: -.55 } },
  sitF: { thL: [-1.5, 0, .25], thR: [-1.5, 0, -.25], knL: [1.5, 0, 0], knR: [1.5, 0, 0], root: { y: -.75 } },
  lunge: { thL: [-.8, 0, 0], knL: [.9, 0, 0], thR: [.5, 0, 0], knR: [.3, 0, 0], root: { y: -.2 } },
  bowF: { chest: [.75, 0, 0], head: [.3, 0, 0] }, leanB: { chest: [-.4, 0, 0], head: [-.3, 0, 0] }
};
const mergeP = (...ps) => { const o = {}; for (const p of ps) for (const k in p) { if (k === 'root') { o.root = Object.assign({ y: 0, z: 0, spin: 0 }, o.root, p.root); continue; } o[k] = p[k].slice(); } return o; };
const loopK = (a, b, n) => { const k = [[0, {}]]; for (let i = 0; i < n; i++) { k.push([(i * 2 + 1) / (n * 2 + 1), a]); k.push([(i * 2 + 2) / (n * 2 + 1), b]); } k.push([1, {}]); return k; };
const holdK = (a) => [[0, {}], [.15, a], [.85, a], [1, {}]];
const NEW_EMOTES = [
  // id, emoji, name, 3D keys, 2D motion
  ['jump', '🦘', 'กระโดด', loopK(mergeP(EP.armsUp, { root: { y: 1.1 } }), { root: { y: 0 } }, 3), (u) => ({ f: AF.cheer, y: Math.abs(Math.sin(u * Math.PI * 3)) * 1.1 })],
  ['spin', '🌀', 'หมุนตัว', [[0, {}], [.5, mergeP(EP.armsOut, { root: { spin: Math.PI * 2 } })], [1, { root: { spin: Math.PI * 4 } }]], (u, t, d) => ({ f: [AF.front, AF.sideR, AF.back, AF.sideL][Math.floor(u * 12) % 4] })],
  ['clap', '👏', 'ปรบมือ', loopK(mergeP(EP.handsChest), mergeP(EP.armsFwd, { shL: [-1.2, .7, .5], shR: [-1.2, -.7, -.5] }), 4), (u) => ({ f: AF.happy, h: 1 + Math.abs(Math.sin(u * 40)) * .02 })],
  ['salute', '🫡', 'ทำความเคารพ', holdK({ shR: [-1.8, -.6, -.9], elR: [-2.3, 0, 0], chest: [-.1, 0, 0] }), () => ({ f: AF.ready })],
  ['wai', '🙏', 'ไหว้', holdK(mergeP(EP.handsChest, EP.bowF, { shL: [-1.3, .6, .2], shR: [-1.3, -.6, -.2] })), (u) => ({ f: AF.think, h: 1 - Math.sin(u * Math.PI) * .08 })],
  ['sleep', '😴', 'นอนหลับ', holdK(mergeP(EP.sitF, EP.bowF, { head: [.6, 0, .3] })), (u) => ({ f: AF.hurt, rot: Math.min(1, u * 6) * 1.5, y: -.4 * Math.min(1, u * 6) })],
  ['lie', '🛌', 'นอนเล่น', holdK(mergeP(EP.sitF, EP.leanB)), (u) => ({ f: AF.happy, rot: -Math.min(1, u * 6) * 1.5, y: -.4 * Math.min(1, u * 6) })],
  ['cry', '😭', 'ร้องไห้', loopK(mergeP(EP.handsFace), mergeP(EP.handsFace, { chest: [.3, 0, 0] }), 5), (u) => ({ f: AF.hurt, h: 1 - Math.abs(Math.sin(u * 30)) * .03 })],
  ['shy', '😳', 'เขินอาย', holdK(mergeP(EP.handsChest, { head: [.3, .4, 0], chest: [.15, .2, 0] })), (u) => ({ f: AF.f34, lean: Math.sin(u * 12) * .05 })],
  ['wink', '😉', 'ขยิบตา', holdK({ shR: [-1.2, 0, -.3], elR: [-1.2, 0, 0], head: [0, 0, .25] }), () => ({ f: AF.happy })],
  ['kiss', '😘', 'ส่งจูบ', [[0, {}], [.3, { shR: [-1.9, -.4, -.3], elR: [-2.4, 0, 0] }], [.6, { shR: [-1.6, 0, -.6], elR: [-.3, 0, 0] }], [1, {}]], () => ({ f: AF.wave })],
  ['heart', '🫶', 'ทำมือหัวใจ', holdK({ shL: [-2.8, .3, .7], elL: [-1.6, 0, 0], shR: [-2.8, -.3, -.7], elR: [-1.6, 0, 0] }), () => ({ f: AF.cheer })],
  ['think2', '🤔', 'ครุ่นคิด', holdK({ shR: [-1.9, .3, -.1], elR: [-2.1, 0, 0], head: [.12, -.15, .12] }), () => ({ f: AF.think })],
  ['shrug', '🤷', 'ยักไหล่', holdK({ shL: [-.4, 0, 1.0], elL: [-1.4, 0, 0], shR: [-.4, 0, -1.0], elR: [-1.4, 0, 0], head: [0, 0, .2] }), (u) => ({ f: AF.front, y: Math.sin(u * Math.PI) * .08 })],
  ['facepalm', '🤦', 'กุมขมับ', holdK({ shR: [-2, -.3, -.4], elR: [-2.4, 0, 0], head: [.35, 0, 0], chest: [.2, 0, 0] }), () => ({ f: AF.think, lean: .06 })],
  ['yawn', '🥱', 'หาว', holdK(mergeP(EP.armsUp, EP.leanB)), (u) => ({ f: AF.cheer, h: 1 + Math.sin(u * Math.PI) * .05 })],
  ['stretch', '🙆', 'ยืดเส้น', loopK(mergeP(EP.armsUp, { chest: [0, 0, .4] }), mergeP(EP.armsUp, { chest: [0, 0, -.4] }), 2), (u) => ({ f: AF.cheer, lean: Math.sin(u * 12) * .2 })],
  ['pushup', '💪', 'วิดพื้น', loopK(mergeP(EP.bowF, EP.armsFwd, { chest: [1.4, 0, 0], root: { y: -.9 } }), mergeP(EP.armsFwd, { chest: [1.4, 0, 0], root: { y: -1.2 } }), 4), (u) => ({ f: AF.sideR, rot: 1.45, y: -.6 + Math.abs(Math.sin(u * Math.PI * 4)) * .25 })],
  ['yoga', '🧘', 'โยคะ', holdK(mergeP(EP.armsUp, { thR: [0, 0, -1.2], knR: [2, 0, 0] })), (u) => ({ f: AF.cheer, lean: Math.sin(u * 6) * .04 })],
  ['meditate', '🧘', 'นั่งสมาธิ', holdK(mergeP(EP.sitF, { shL: [-.6, 0, .4], elL: [-1.2, 0, 0], shR: [-.6, 0, -.4], elR: [-1.2, 0, 0] })), (u) => ({ f: AF.think, h: .72, y: Math.sin(u * 20) * .03 })],
  ['kungfu', '🥋', 'ท่ากังฟู', holdK(mergeP(EP.lunge, { shL: [-1.6, 0, .6], elL: [-.2, 0, 0], shR: [-.5, 0, -.3], elR: [-2, 0, 0] })), () => ({ f: AF.ready })],
  ['punch', '👊', 'ต่อยลม', loopK({ shR: [-1.6, 0, 0], elR: [0, 0, 0], chest: [0, -.4, 0] }, { shL: [-1.6, 0, 0], elL: [0, 0, 0], chest: [0, .4, 0] }, 3), (u, t, d) => ({ f: AF.ready, lean: Math.sin(u * 19) * .15 })],
  ['kick', '🦵', 'เตะ', [[0, {}], [.3, { thR: [-.4, 0, 0], knR: [1.8, 0, 0] }], [.5, { thR: [-1.7, 0, 0], knR: [0, 0, 0], chest: [-.3, 0, 0] }], [.8, { thR: [-.3, 0, 0] }], [1, {}]], (u, t, d) => ({ f: AF.sideR, flip: false, lean: Math.sin(u * Math.PI) * .3 })],
  ['boxing', '🥊', 'ชกมวย', loopK(mergeP(EP.lunge, { shL: [-1.4, .3, .3], elL: [-1.8, 0, 0], shR: [-1.6, 0, 0], elR: [-.1, 0, 0] }), mergeP(EP.lunge, { shR: [-1.4, -.3, -.3], elR: [-1.8, 0, 0], shL: [-1.6, 0, 0], elL: [-.1, 0, 0] }), 3), (u) => ({ f: AF.ready, y: Math.abs(Math.sin(u * 25)) * .1 })],
  ['muaythai', '🇹🇭', 'ไหว้ครูมวยไทย', loopK(mergeP(EP.squat, EP.handsChest), mergeP(EP.lunge, EP.armsOut), 2), (u) => ({ f: u % .5 < .25 ? AF.think : AF.ready, h: .85 + Math.abs(Math.sin(u * 6)) * .15 })],
  ['swordtwirl', '⚔️', 'ควงอาวุธ', loopK({ shR: [-2.4, 0, -.6], elR: [-.4, 0, 0], chest: [0, .5, 0] }, { shR: [-1, 0, -1.2], chest: [0, -.5, 0] }, 3), (u) => ({ f: AF.shield, flip: Math.floor(u * 6) % 2 === 1 })],
  ['guardup', '🛡️', 'ตั้งการ์ด', holdK(mergeP(EP.lunge, { shL: [-1.4, .4, .3], elL: [-1.5, 0, 0] })), () => ({ f: AF.shield })],
  ['taunt', '😜', 'ยั่วยุ', loopK({ shR: [-1.4, 0, -.3], elR: [-1.6, 0, 0], head: [0, .4, .2] }, { shR: [-1.4, 0, -.3], elR: [-.6, 0, 0], head: [0, -.4, -.2] }, 3), (u) => ({ f: AF.happy, lean: Math.sin(u * 18) * .1 })],
  ['roar', '🦁', 'คำราม', holdK(mergeP(EP.armsOut, EP.leanB, EP.lunge)), (u) => ({ f: AF.cheer, h: 1 + Math.abs(Math.sin(u * 30)) * .03 })],
  ['scared', '😱', 'ตกใจ', holdK(mergeP(EP.handsFace, EP.leanB, { root: { y: .15 } })), (u) => ({ f: AF.hurt, y: Math.sin(Math.min(1, u * 4) * Math.PI) * .4 })],
  ['shiver', '🥶', 'หนาวสั่น', loopK(mergeP(EP.handsChest, { chest: [.2, .1, 0] }), mergeP(EP.handsChest, { chest: [.2, -.1, 0] }), 8), (u) => ({ f: AF.hurt, lean: Math.sin(u * 80) * .03 })],
  ['dizzy', '😵‍💫', 'มึนหัว', loopK({ chest: [0, 0, .3], head: [0, 0, .4] }, { chest: [0, 0, -.3], head: [0, 0, -.4] }, 3), (u) => ({ f: AF.hurt, lean: Math.sin(u * 15) * .15 })],
  ['hungry', '🤤', 'หิวจัง', holdK({ shL: [-.6, .4, .4], elL: [-1.6, 0, 0], shR: [-.6, -.4, -.4], elR: [-1.6, 0, 0], chest: [.3, 0, 0] }), () => ({ f: AF.hurt, h: .95 })],
  ['eat', '🍙', 'กินข้าว', loopK(mergeP(EP.sitF, { shR: [-1.8, -.3, -.3], elR: [-2.3, 0, 0] }), mergeP(EP.sitF, { shR: [-1, -.3, -.3], elR: [-1.5, 0, 0] }), 4), (u) => ({ f: AF.happy, h: .72 })],
  ['drink', '🧃', 'ดื่มน้ำ', holdK({ shR: [-2, -.3, -.3], elR: [-2.2, 0, 0], head: [-.4, 0, 0] }), () => ({ f: AF.wave })],
  ['sing', '🎤', 'ร้องเพลง', loopK({ shR: [-1.7, -.3, -.3], elR: [-2, 0, 0], shL: [-.5, 0, 1], head: [-.2, 0, .2] }, { shR: [-1.7, -.3, -.3], elR: [-2, 0, 0], shL: [-.5, 0, 1.4], head: [-.2, 0, -.2] }, 3), (u) => ({ f: AF.happy, lean: Math.sin(u * 12) * .08 })],
  ['guitar', '🎸', 'เล่นกีตาร์', loopK({ shL: [-1, .5, .5], elL: [-1, 0, 0], shR: [-.6, -.3, -.2], elR: [-1.5, 0, 0] }, { shL: [-1, .5, .5], elL: [-1, 0, 0], shR: [-.4, -.3, -.2], elR: [-1.2, 0, 0], head: [.2, 0, 0] }, 5), (u) => ({ f: AF.ready, y: Math.abs(Math.sin(u * 20)) * .05 })],
  ['drum', '🥁', 'ตีกลอง', loopK({ shL: [-1.4, 0, .2], elL: [-1, 0, 0], shR: [-.6, 0, -.2] }, { shR: [-1.4, 0, -.2], elR: [-1, 0, 0], shL: [-.6, 0, .2] }, 6), (u) => ({ f: AF.ready, h: 1 + Math.abs(Math.sin(u * 40)) * .02 })],
  ['photo', '📸', 'ถ่ายรูป', holdK(mergeP(EP.handsFace, { head: [0, 0, 0] })), () => ({ f: AF.think })],
  ['selfie', '🤳', 'เซลฟี่', holdK({ shR: [-2.4, -.4, -.5], elR: [-.3, 0, 0], head: [-.1, 0, .2], shL: [-.6, 0, .9], elL: [-1.2, 0, 0] }), () => ({ f: AF.happy })],
  ['call', '📱', 'โทรศัพท์', holdK({ shR: [-1.6, -.4, -.4], elR: [-2.5, 0, 0], head: [0, 0, .2] }), () => ({ f: AF.think })],
  ['read', '📖', 'อ่านหนังสือ', holdK({ shL: [-1.1, .3, .2], elL: [-1.5, 0, 0], shR: [-1.1, -.3, -.2], elR: [-1.5, 0, 0], head: [.35, 0, 0] }), () => ({ f: AF.think })],
  ['writen', '✍️', 'จดบันทึก', loopK({ shL: [-1.1, .3, .2], elL: [-1.5, 0, 0], shR: [-.9, -.3, -.2], elR: [-1.8, 0, 0], head: [.35, 0, 0] }, { shL: [-1.1, .3, .2], elL: [-1.5, 0, 0], shR: [-.9, -.1, -.2], elR: [-1.6, 0, 0], head: [.35, 0, 0] }, 5), () => ({ f: AF.think })],
  ['fish', '🎣', 'ตกปลา', holdK(mergeP(EP.sitF, { shL: [-1.4, 0, .1], elL: [-.5, 0, 0], shR: [-1.4, 0, -.1], elR: [-.5, 0, 0] })), (u) => ({ f: AF.sideR, h: .72, y: Math.sin(u * 8) * .02 })],
  ['runplace', '🏃', 'วิ่งอยู่กับที่', loopK({ thL: [-1.1, 0, 0], knL: [1.5, 0, 0], shL: [.8, 0, .1], shR: [-.8, 0, -.1], root: { y: .15 } }, { thR: [-1.1, 0, 0], knR: [1.5, 0, 0], shR: [.8, 0, -.1], shL: [-.8, 0, .1], root: { y: .15 } }, 6), (u) => ({ f: AF.run, y: Math.abs(Math.sin(u * 40)) * .15 })],
  ['moonwalk', '🕺', 'มูนวอล์ก', loopK({ thL: [.4, 0, 0], knR: [.6, 0, 0], root: { z: -.2 } }, { thR: [.4, 0, 0], knL: [.6, 0, 0], root: { z: -.2 } }, 5), (u) => ({ f: AF.sideL, lean: -.1, y: Math.abs(Math.sin(u * 30)) * .04 })],
  ['robot', '🤖', 'เต้นหุ่นยนต์', loopK({ shL: [0, 0, 1.5], elL: [-1.57, 0, 0], shR: [-1.57, 0, 0], head: [0, .5, 0] }, { shR: [0, 0, -1.5], elR: [-1.57, 0, 0], shL: [-1.57, 0, 0], head: [0, -.5, 0] }, 4), (u) => ({ f: Math.floor(u * 8) % 2 ? AF.sideL : AF.sideR })],
  ['hiphop', '🧢', 'ฮิปฮอป', loopK(mergeP(EP.squat, { shL: [-1, 0, .8], shR: [-2, 0, -.6], root: { y: -.3 } }), mergeP({ shR: [-1, 0, -.8], shL: [-2, 0, .6] }), 4), (u) => ({ f: AF.ready, flip: Math.floor(u * 8) % 2 === 1, h: .9 + Math.abs(Math.sin(u * 25)) * .1 })],
  ['ballet', '🩰', 'บัลเล่ต์', [[0, {}], [.25, mergeP(EP.armsUp, { thR: [0, 0, -.8], root: { y: .2 } })], [.6, mergeP(EP.armsUp, { thR: [0, 0, -.8], root: { y: .2, spin: Math.PI * 2 } })], [1, { root: { spin: Math.PI * 2 } }]], (u) => ({ f: [AF.cheer, AF.sideR, AF.back, AF.sideL][Math.floor(u * 8) % 4], y: .15 })],
  ['thaidance', '💃', 'รำไทย', loopK({ shL: [-1.2, 0, 1], elL: [-1.2, 0, 0], shR: [-.3, 0, -1], elR: [-1.6, 0, 0], thL: [-.2, 0, 0], knL: [.5, 0, 0] }, { shR: [-1.2, 0, -1], elR: [-1.2, 0, 0], shL: [-.3, 0, 1], elL: [-1.6, 0, 0], thR: [-.2, 0, 0], knR: [.5, 0, 0] }, 2), (u) => ({ f: AF.wave, flip: Math.floor(u * 4) % 2 === 1, lean: Math.sin(u * 12) * .05 })],
  ['cartwheel', '🤸', 'ตีลังกาข้าง', [[0, {}], [.5, mergeP(EP.armsUp, EP.armsOut, { root: { y: .3 } })], [1, {}]], (u) => ({ f: AF.cheer, rot: u * Math.PI * 2, y: Math.sin(u * Math.PI) * .6 })],
  ['backflip', '🔄', 'ตีลังกาหลัง', [[0, {}], [.2, EP.squat], [.6, mergeP(EP.armsUp, { chest: [-1.2, 0, 0], root: { y: 1.5 } })], [1, {}]], (u) => ({ f: AF.cheer, rot: -Math.max(0, u - .2) / .8 * Math.PI * 2, y: Math.sin(u * Math.PI) * 1.5 })],
  ['headstand', '🙃', 'ยืนหัว', holdK(mergeP(EP.armsUp, { chest: [3.1, 0, 0], root: { y: .4 } })), (u) => ({ f: AF.happy, rot: Math.PI * Math.min(1, u * 5), y: Math.min(1, u * 5) * .9 })],
  ['wave2', '🙌', 'โบกสองมือ', loopK({ shL: [-2.7, 0, .6], shR: [-2.7, 0, -.6] }, { shL: [-2.7, 0, .1], shR: [-2.7, 0, -.1] }, 4), (u) => ({ f: AF.cheer, lean: Math.sin(u * 20) * .08 })],
  ['bye', '👋', 'บ๊ายบาย', loopK({ shR: [-2.7, 0, -.6], elR: [-.5, 0, 0] }, { shR: [-2.7, 0, -.1], elR: [-.5, 0, 0] }, 4), () => ({ f: AF.wave })],
  ['hi5', '🖐️', 'ไฮไฟว์', [[0, {}], [.4, { shR: [-2.6, 0, -.3] }], [.55, { shR: [-2.4, 0, -.1], chest: [.1, 0, 0] }], [1, {}]], () => ({ f: AF.wave })],
  ['fist', '✊', 'ชูกำปั้น', holdK({ shR: [-2.9, 0, -.2], elR: [-.2, 0, 0] }), (u) => ({ f: AF.cheer, y: Math.sin(u * Math.PI) * .2 })],
  ['peace', '✌️', 'ชูสองนิ้ว', holdK({ shR: [-1.8, -.3, -.4], elR: [-1.6, 0, 0], head: [0, 0, .15] }), () => ({ f: AF.happy })],
  ['okay', '👌', 'โอเค', holdK({ shR: [-1.2, 0, -.3], elR: [-1.8, 0, 0] }), () => ({ f: AF.happy })],
  ['no', '🙅', 'ส่ายหัว', loopK({ head: [0, .6, 0], shL: [-1.2, .4, .4], shR: [-1.2, -.4, -.4] }, { head: [0, -.6, 0], shL: [-1.2, .4, .4], shR: [-1.2, -.4, -.4] }, 3), (u) => ({ f: Math.floor(u * 12) % 2 ? AF.f34 : AF.front, flip: Math.floor(u * 6) % 2 === 1 })],
  ['yes', '🙆‍♂️', 'พยักหน้า', loopK({ head: [.4, 0, 0] }, { head: [-.1, 0, 0] }, 3), (u) => ({ f: AF.happy, h: 1 - Math.abs(Math.sin(u * 20)) * .03 })],
  ['confused', '😕', 'งงๆ', holdK({ shR: [-1.6, -.2, -.3], elR: [-2.4, 0, 0], head: [0, 0, .35] }), (u) => ({ f: AF.think, lean: Math.sin(u * 4) * .08 })],
  ['stomp', '😤', 'กระทืบเท้า', loopK({ thL: [-.9, 0, 0], knL: [.9, 0, 0], shL: [-.2, 0, .5], shR: [-.2, 0, -.5] }, { thR: [-.9, 0, 0], knR: [.9, 0, 0], shL: [-.2, 0, .5], shR: [-.2, 0, -.5] }, 4), (u) => ({ f: AF.hurt, y: Math.abs(Math.sin(u * 25)) * .12 })],
  ['proud', '😎', 'ยืดอก', holdK(mergeP(EP.handsHips, EP.leanB)), () => ({ f: AF.ready, h: 1.03 })],
  ['sneak', '🥷', 'ย่องเบา', loopK(mergeP(EP.squat, { root: { y: -.3 }, thL: [-.6, 0, 0] }), mergeP(EP.squat, { root: { y: -.3 }, thR: [-.6, 0, 0] }), 3), (u) => ({ f: AF.f34, h: .85, lean: .08 })],
  ['hide', '🙈', 'ปิดตา', holdK(mergeP(EP.handsFace, EP.squat)), () => ({ f: AF.hurt, h: .8 })],
  ['magic', '✨', 'ร่ายเวท', loopK({ shL: [-2, .3, .6], shR: [-2, -.3, -.6], elL: [-.3, 0, 0], elR: [-.3, 0, 0] }, { shL: [-2.6, .3, .2], shR: [-2.6, -.3, -.2] }, 3), (u) => ({ f: AF.wave, y: .1 + Math.sin(u * 12) * .05 })],
  ['pray2', '🛐', 'อธิษฐาน', holdK(mergeP(EP.handsChest, EP.squat, { shL: [-1.3, .6, .2], shR: [-1.3, -.6, -.2], head: [.3, 0, 0] })), () => ({ f: AF.think, h: .8 })],
  ['celebrate', '🥳', 'ฉลอง', loopK(mergeP(EP.armsUp, { root: { y: .6 } }), mergeP(EP.armsOut), 4), (u) => ({ f: AF.cheer, y: Math.abs(Math.sin(u * Math.PI * 4)) * .7 })],
  ['firework', '🎆', 'จุดพลุ', [[0, {}], [.3, mergeP(EP.squat, { shR: [-1, 0, -.2] })], [.6, mergeP(EP.armsUp, EP.leanB)], [1, {}]], (u) => ({ f: u < .4 ? AF.ready : AF.cheer })],
  ['fly', '🕊️', 'กางแขนบิน', loopK(mergeP(EP.armsOut, { chest: [.4, 0, .3], root: { y: .2 } }), mergeP(EP.armsOut, { chest: [.4, 0, -.3], root: { y: .2 } }), 3), (u) => ({ f: AF.cheer, lean: Math.sin(u * 12) * .15, y: .3 })],
  ['zombie', '🧟', 'ท่าซอมบี้', loopK(mergeP(EP.armsFwd, { head: [.3, 0, .3], thL: [-.3, 0, 0] }), mergeP(EP.armsFwd, { head: [.3, 0, -.3], thR: [-.3, 0, 0] }), 3), (u) => ({ f: AF.hurt, lean: Math.sin(u * 10) * .1 })],
  ['boo', '👻', 'ทำท่าผีหลอก', holdK(mergeP(EP.armsUp, { elL: [-1.4, 0, 0], elR: [-1.4, 0, 0], root: { y: .2 } })), (u) => ({ f: AF.cheer, y: .2 + Math.sin(u * 15) * .1 })],
  ['cat', '🐱', 'ท่าแมว', loopK({ shR: [-1.8, -.3, -.3], elR: [-2, 0, 0], head: [0, 0, .2] }, { shR: [-1.8, -.3, -.3], elR: [-1.5, 0, 0], head: [0, 0, -.2] }, 3), () => ({ f: AF.happy })],
  ['chicken', '🐔', 'ท่าไก่', loopK({ shL: [0, 0, .3], elL: [-2, 0, 0], shR: [0, 0, -.3], elR: [-2, 0, 0] }, { shL: [0, 0, 1], elL: [-2, 0, 0], shR: [0, 0, -1], elR: [-2, 0, 0], head: [.3, 0, 0] }, 5), (u) => ({ f: AF.ready, h: 1 - Math.abs(Math.sin(u * 30)) * .04 })],
  ['surf', '🏄', 'โต้คลื่น', holdK(mergeP(EP.lunge, EP.armsOut, { chest: [.2, .4, 0] })), (u) => ({ f: AF.sideR, lean: Math.sin(u * 8) * .15, y: Math.sin(u * 8) * .1 })],
  ['swim', '🏊', 'ว่ายน้ำ', loopK({ shL: [-3, 0, .2], shR: [0, 0, -.2], chest: [1.2, 0, 0] }, { shR: [-3, 0, -.2], shL: [0, 0, .2], chest: [1.2, 0, 0] }, 4), (u) => ({ f: AF.sideR, rot: 1.3, y: -.3 + Math.sin(u * 20) * .05 })],
  ['lift', '🏋️', 'ยกน้ำหนัก', loopK(mergeP(EP.squat, { shL: [-1.5, 0, .4], shR: [-1.5, 0, -.4], elL: [-2, 0, 0], elR: [-2, 0, 0], root: { y: -.3 } }), mergeP(EP.armsUp), 3), (u) => ({ f: AF.cheer, h: .85 + Math.abs(Math.sin(u * Math.PI * 3)) * .15 })],
  ['dab', '🫢', 'แดบ', holdK({ shL: [-2.6, 0, 1.0], elL: [-.1, 0, 0], shR: [-1.6, -.4, -.4], elR: [-2.3, 0, 0], head: [.4, .4, 0] }), () => ({ f: AF.f34, lean: .1 })],
  ['bow2', '🙇‍♀️', 'โค้งงาม', holdK(mergeP(EP.bowF, { shL: [0, 0, .6], shR: [-1.2, -.5, -.3], elR: [-1.6, 0, 0], thR: [.3, 0, 0], knR: [.4, 0, 0] })), (u) => ({ f: AF.front, h: 1 - Math.sin(u * Math.PI) * .1 })],
  ['tantrum', '😡', 'งอแง', loopK(mergeP(EP.sitF, EP.armsUp), mergeP(EP.sitF, EP.armsOut), 5), (u) => ({ f: AF.hurt, h: .72, lean: Math.sin(u * 30) * .1 })],
  ['ready', '😤', 'พร้อมลุย', holdK(mergeP(EP.lunge, { shL: [-1.2, .3, .3], elL: [-1.8, 0, 0], shR: [-1.2, -.3, -.3], elR: [-1.8, 0, 0] })), () => ({ f: AF.ready })],
  ['laugh2', '🤣', 'หัวเราะท้องแข็ง', loopK(mergeP(EP.handsChest, EP.bowF), mergeP(EP.handsChest, EP.leanB), 4), (u) => ({ f: AF.happy, h: 1 - Math.abs(Math.sin(u * 30)) * .05 })]
];
{
  for (const [id, e, n, keys, m2] of NEW_EMOTES) {
    const dur = keys.length > 6 ? 2.6 : 2.0; CLIPS['emo_' + id] = { dur, hit: 2, keys };
    EMOTE_CLIP[id] = 'emo_' + id; EMOTES.push({ id, e, n }); EMO2D['emo_' + id] = m2;
  }
  // classic emotes in 2D
  Object.assign(EMO2D, { laugh: () => ({ f: AF.happy }), love: () => ({ f: AF.happy }), good: () => ({ f: AF.ready }), thanks: () => ({ f: AF.think }), sad: () => ({ f: AF.hurt }), angry: () => ({ f: AF.hurt }), bow: (u) => ({ f: AF.front, h: 1 - Math.sin(u * Math.PI) * .1 }), flex: () => ({ f: AF.cheer }), dance: (u) => ({ f: AF.cheer, flip: Math.floor(u * 6) % 2 === 1, y: Math.abs(Math.sin(u * 20)) * .2 }), sit: () => ({ f: AF.front, h: .72 }), point: () => ({ f: AF.wave }), kneel: () => ({ f: AF.think, h: .78 }), victory: (u) => ({ f: AF.cheer, y: Math.sin(u * Math.PI) * .5 }) });
}
