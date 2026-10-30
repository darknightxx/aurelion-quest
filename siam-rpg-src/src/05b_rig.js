/* ============================================================
   3D chibi characters: models, skeleton, procedural + keyframed animation
   ============================================================ */
// extra geometry helpers
Geo.prototype.ell = function (cx, cy, cz, sx, sy, sz, col, ws = 8, hs = 6, rx = 0, ry = 0) {
  const keep = this.m; const M = M4.ident(); M4.compose(M, cx, cy, cz, rx, ry, 0, sx, sy, sz); this.m = M4.mul(M4.ident(), keep, M);
  this.sphere(0, 0, 0, 1, col, ws, hs); this.m = keep;
};
Geo.prototype.cone = function (bx, by, bz, dx, dy, dz, r, len, seg, col, rTop = 0) {
  const l = Math.hypot(dx, dy, dz) || 1; dx /= l; dy /= l; dz /= l;
  const th = Math.acos(clamp(dy, -1, 1)), ph = Math.atan2(dx, dz);
  const keep = this.m; const M = M4.ident(); M4.compose(M, bx, by, bz, th, ph, 0, 1, 1, 1); this.m = M4.mul(M4.ident(), keep, M);
  this.cyl(0, 0, 0, r, rTop, len, seg, col, null, true); this.m = keep;
};
Geo.prototype.push = function (x, y, z, rx = 0, ry = 0, rz = 0, s = 1) { this._st = this._st || []; this._st.push(this.m); const M = M4.ident(); M4.compose(M, x, y, z, rx, ry, rz, s, s, s); this.m = M4.mul(M4.ident(), this.m, M); return this; };
Geo.prototype.pop = function () { this.m = this._st.pop(); return this; };
Geo.prototype.sphereSkip = function (cx, cy, cz, r, col, ws, hs, skip) {
  for (let j = 0; j < hs; j++) {
    const p0 = j / hs * Math.PI, p1 = (j + 1) / hs * Math.PI;
    for (let i = 0; i < ws; i++) {
      const a0 = i / ws * TAU, a1 = (i + 1) / ws * TAU;
      const P = (p, a) => [Math.sin(p) * Math.cos(a) * r, Math.cos(p) * r, Math.sin(p) * Math.sin(a) * r];
      const A = P(p0, a0), B = P(p0, a1), C = P(p1, a1), D = P(p1, a0);
      const c = [(A[0] + C[0]) / 2, (A[1] + C[1]) / 2, (A[2] + C[2]) / 2]; if (skip(c)) continue;
      const T = v => [v[0] + cx, v[1] + cy, v[2] + cz];
      if (j === 0) this.tri(T(A), T(C), T(D), col); else if (j === hs - 1) this.tri(T(A), T(B), T(D), col); else this.quad(T(A), T(B), T(C), T(D), col);
    }
  }
};

const HIPY = .74;
const BONES = [
  ['hips', 'root', 0, HIPY, 0], ['chest', 'hips', 0, .05, 0], ['head', 'chest', 0, .44, 0], ['eyes', 'head', 0, .4, 0],
  ['shL', 'chest', .26, .35, 0], ['elL', 'shL', 0, -.24, 0], ['shR', 'chest', -.26, .35, 0], ['elR', 'shR', 0, -.24, 0],
  ['thL', 'hips', .12, -.02, 0], ['knL', 'thL', 0, -.3, 0], ['thR', 'hips', -.12, -.02, 0], ['knR', 'thR', 0, -.3, 0],
  ['cape', 'chest', 0, .4, -.17], ['tail', 'head', 0, .55, -.45]
];
const BONE_IDX = {}; BONES.forEach((b, i) => BONE_IDX[b[0]] = i);

const CHAR_COL = {
  hair: hexc('#9ee63e'), hair2: hexc('#72c42c'), hair3: hexc('#cdf56a'), skin: hexc('#ffe1c8'), blush: hexc('#f3a6a0'), eye: hexc('#5a2a10'), iris: hexc('#d08a2c'), white: [1, 1, 1], mouth: hexc('#9a3a2a'),
  gold: hexc('#d9a845'), steel: hexc('#c9ced8'), steel2: hexc('#9aa1ae'), wood: hexc('#8a6240'), leather: hexc('#6b4428')
};
tagTex(CHAR_COL.gold, 'metal'); tagTex(CHAR_COL.steel, 'metal'); tagTex(CHAR_COL.steel2, 'metal'); tagTex(CHAR_COL.wood, 'planks'); tagTex(CHAR_COL.leather, 'leather');
const OUTFITS = {
  adventurer: { shirt: hexc('#e6d2a6'), sleeve: hexc('#e6d2a6'), pants: hexc('#5a3a22'), boot: hexc('#7a4c2a'), glove: hexc('#6b4428'), belt: hexc('#6a4428'), cape: hexc('#8a5a32'), capelet: true, weapon: 'sword', pig: false },
  knight: { shirt: hexc('#c9ced8'), sleeve: hexc('#4a3528'), pants: hexc('#3b2c22'), boot: hexc('#c9ced8'), glove: hexc('#6b4428'), belt: hexc('#6a3a26'), cape: hexc('#a32f25'), armor: true, weapon: 'sword', shield: true, pig: true, band: 'helm' },
  ninja: { shirt: hexc('#4a3628'), sleeve: hexc('#f8d6b8'), pants: hexc('#23201f'), boot: hexc('#1f1c1c'), glove: hexc('#2b2422'), belt: hexc('#6b4428'), cape: hexc('#a32f25'), scarf: true, mask: true, weapon: 'kunai', pig: true, band: 'ninja', wraps: true },
  archer: { shirt: hexc('#efe2c6'), sleeve: hexc('#efe2c6'), pants: hexc('#4a3324'), boot: hexc('#7a4c2a'), glove: hexc('#6b4428'), belt: hexc('#6a4428'), vest: hexc('#7a4a26'), weapon: 'bow', quiver: true, pig: false },
  mage: { shirt: hexc('#6b4428'), sleeve: hexc('#6b4428'), pants: hexc('#3b2a1e'), boot: hexc('#7a4c2a'), glove: hexc('#6b4428'), belt: hexc('#4a2e1c'), cape: hexc('#5e3b22'), robe: hexc('#efe3c4'), weapon: 'staff', hat: true, pig: true, cloak: true },
  priest: { shirt: hexc('#f4f0e7'), sleeve: hexc('#f4f0e7'), pants: hexc('#4a3324'), boot: hexc('#7a4c2a'), glove: hexc('#6b4428'), belt: hexc('#6b4428'), robe: hexc('#f4f0e7'), weapon: 'rod', capelet: true, capeletCol: hexc('#a78a62'), pig: false }
};

const CharModels = new Proxy({}, { get(t, k) { if (t[k] === undefined && typeof k === 'string' && typeof Sheets !== 'undefined' && Game.R && Sheets.ensure(k)) t[k] = buildCharModel(Game.R, k); return t[k]; } });
function buildCharModels(R) {
  for (const cls of CLASS_ORDER) CharModels[cls] = buildCharModel(R, cls);
}
function buildCharModel(R, cls) {
  const O = OUTFITS[cls], C = Object.assign({}, CHAR_COL, O.col || {}); const like = O.like || cls; const parts = {};
  for (const k of ['shirt', 'sleeve', 'pants', 'cape', 'robe', 'vest', 'capeletCol']) if (O[k] && O[k].length) tagTex(O[k], 'cloth');
  for (const k of ['boot', 'glove', 'belt']) if (O[k] && O[k].length) tagTex(O[k], 'leather');
  const mk = (bone, fn) => { const g = new Geo(cls.length * 7 + bone.length); g.jit = .015; g.uvs = 2.5; fn(g); if (O.add && O.add[bone]) O.add[bone](g, C, O); if (g.d.length) { g.smoothNormals(58); parts[bone] = R.mesh(g); } };
  // hips
  mk('hips', g => {
    g.box(0, -.04, 0, .36, .2, .25, O.pants);
    g.cyl(0, 0, 0, .2, .2, .07, 10, O.belt); g.box(0, .035, .2, .1, .08, .03, C.gold);
    if (like === 'adventurer' || like === 'archer') { g.box(.18, -.06, .06, .08, .14, .14, C.leather); }
    if (O.robe) { g.cyl(0, -.44, 0, .36, .22, .46, 12, O.robe, null, true); g.cyl(0, -.44, 0, .37, .365, .05, 12, like === 'priest' ? C.gold : hexc('#d8c8a0'), null, true); if (like === 'priest') g.box(0, -.2, .25, .14, .4, .02, C.gold); }
    if (O.armor) { for (const s of [-1, 1]) { g.push(s * .14, -.12, .1, .15, 0, s * .08); g.box(0, 0, 0, .15, .22, .05, C.steel); g.pop(); } g.box(0, -.13, .14, .12, .24, .03, hexc('#7a3a26')); }
    if (like === 'ninja') { g.box(0, -.12, .12, .14, .24, .02, O.shirt); }
  });
  // chest / torso
  mk('chest', g => {
    g.cyl(0, 0, 0, .2, .17, .42, 14, O.shirt);
    g.cyl(0, .4, 0, .07, .07, .08, 8, C.skin);
    if (O.armor) { g.cyl(0, .08, 0, .215, .19, .3, 10, C.steel, C.steel); g.cyl(0, .06, 0, .22, .22, .04, 10, C.gold, null, true); g.box(0, .2, .17, .2, .16, .06, C.gold); g.box(0, .2, .19, .14, .1, .03, C.steel2); }
    if (O.vest) { g.cyl(0, .02, 0, .21, .18, .34, 10, O.vest); g.push(0, .2, 0, 0, 0, .6); g.box(0, 0, .19, .05, .5, .03, C.leather); g.pop(); }
    if (like === 'ninja') { g.push(0, .21, .12, .1, 0, 0); g.box(-.05, 0, .07, .26, .36, .04, hexc('#3c2b20')); g.pop(); g.cyl(0, .02, 0, .205, .2, .07, 10, C.leather); }
    if (like === 'mage') { g.cyl(0, .0, 0, .21, .2, .3, 10, O.shirt); g.box(0, .18, .19, .06, .3, .03, C.gold); }
    if (like === 'priest') { g.box(0, .2, .18, .1, .36, .03, C.gold); g.box(0, .26, .19, .2, .05, .03, C.gold); }
    if (O.capelet) { const cc = O.capeletCol || O.cape; g.cyl(0, .2, 0, .34, .17, .24, 10, cc); g.ell(0, .34, -.15, .2, .14, .1, shade(cc, .9)); g.box(0, .32, .16, .08, .05, .04, C.gold); }
    if (O.scarf) { g.cyl(0, .36, 0, .14, .12, .12, 8, O.cape); g.ell(0, .36, .08, .16, .08, .1, O.cape); }
    if (O.quiver) { g.push(-.08, .14, -.2, -.2, 0, .45); g.cyl(0, 0, 0, .08, .09, .5, 7, C.leather); for (let i = 0; i < 4; i++) g.cone(-.03 + i * .02, .5, (i % 2) * .03, 0, 1, 0, .045, .14, 3, [1, 1, 1]); g.pop(); }
    if (O.armor) { /* pauldrons on chest edges */ for (const s of [-1, 1]) { g.ell(s * .27, .37, 0, .13, .1, .13, C.steel); g.cyl(s * .27, .32, 0, .135, .135, .03, 8, C.gold, null, true); } }
  });
  // head: skin, mouth, blush, hair, hats
  mk('head', g => {
    const hc = [0, .42, 0];
    g.jit = .0; g.ell(0, .42, 0, .5, .48, .49, C.skin, 18, 12); g.jit = .03;
    g.ell(-.28, .28, .385, .07, .035, .03, C.blush, 6, 3); g.ell(.28, .28, .385, .07, .035, .03, C.blush, 6, 3);
    if (!O.mask) g.ell(0, .2, .455, .04, .018, .02, C.mouth, 5, 3);
    for (const s of [-1, 1]) g.ell(s * .49, .4, 0, .05, .09, .07, C.skin, 5, 4);
    if (O.mask) { g.ell(0, .16, .06, .43, .17, .43, hexc('#262838'), 14, 8); }
    // hair: smooth cap + layered locks (anime style)
    if (!O.nohair) {
    g.jit = .012;
    g.sphereSkip(0, .49, -.03, .545, C.hair, 16, 12, c => (c[2] > .14 && c[1] < .18) || c[1] < -.3);
    const rnd = mulberry32(99 + like.length);
    const lock = (a, y, len, w, tilt, col, out = .5) => { const cx = Math.cos(a) * out, cz = -.03 + Math.sin(a) * out; g.ell(cx, y, cz, w, len, w * .55, col, 8, 6, tilt * Math.cos(a), -a + Math.PI / 2, 0); };
    // back and side locks hanging from the cap edge
    for (let i = 0; i < 11; i++) { const a = Math.PI * .72 + i / 10 * Math.PI * 1.56; const dz = Math.sin(a); if (dz > .55) continue; const y = .28 - rnd() * .1 - (dz < -.5 ? .06 : 0); lock(a, y, .28 + rnd() * .1, .15, .35, i % 3 === 0 ? C.hair2 : C.hair, .47); }
    // crown: swept locks pointing up-back
    for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i - 2) * .5; g.ell(Math.cos(a) * .22, .98 + (i === 2 ? .06 : 0), -.1 + Math.sin(a) * .18, .13, .26 + rnd() * .08, .11, i % 2 ? C.hair3 : C.hair, 8, 6, -.75 - Math.sin(a) * .3, 0, Math.cos(a) * .55); }
    g.ell(0, .9, -.38, .3, .2, .16, C.hair2, 8, 6, .9, 0, 0);
    // bangs over the forehead
    for (let i = 0; i < 5; i++) { const x = -.32 + i * .16; const y = .64 - Math.abs(x) * .3; g.ell(x, y, .36 + (.32 - Math.abs(x)) * .15, .12, .26 + (i % 2) * .05, .07, i % 2 ? C.hair : C.hair2, 8, 6, .25, 0, -x * .9); }
    // locks framing the face
    for (const s of [-1, 1]) { g.ell(s * .47, .36, .2, .11, .34, .09, C.hair2, 8, 6, .1, 0, s * .12); g.ell(s * .43, .5, -.08, .12, .32, .1, C.hair, 8, 6, 0, 0, s * .2); }
    g.jit = .02;
    if (O.pig) for (const s of [-1, 1]) { g.ell(s * .42, .12, -.18, .05, .05, .05, hexc('#6b4428'), 5, 3); for (let k = 0; k < 3; k++) g.cone(s * .43, .1, -.18, s * (.2 + k * .15), -1, -.1 * k, .09, .26, 5, k % 2 ? C.hair : C.hair2); }
    }
    // headgear
    if (O.band === 'helm') { g.cyl(0, .6, 0, .53, .53, .12, 14, C.steel, null, true); g.push(0, .7, .46, -.2); g.box(0, 0, 0, .34, .2, .06, C.steel); g.box(0, 0, .035, .1, .12, .02, C.gold); g.pop(); g.cyl(0, .57, 0, .535, .535, .025, 14, hexc('#6b4428'), null, true); }
    if (O.band === 'ninja') { g.cyl(0, .64, 0, .535, .53, .11, 14, hexc('#262838'), null, true); g.push(0, .69, .48, -.22); g.box(0, 0, 0, .3, .13, .04, C.steel); g.box(0, 0, .022, .26, .09, .01, C.steel2); g.pop(); }
    if (O.hat) {
      g.cyl(0, .76, 0, .82, .8, .05, 16, hexc('#6b4428'), hexc('#7a5032')); g.cyl(0, .78, 0, .42, .4, .12, 12, C.gold, null, true);
      g.push(0, .8, -.04, -.18); g.cyl(0, 0, 0, .42, .2, .55, 10, hexc('#6b4428'), null, true); g.push(0, .55, 0, -.5); g.cyl(0, 0, 0, .2, 0, .5, 8, hexc('#6b4428'), null, true); g.pop(); g.pop();
      g.box(0, .86, .4, .14, .1, .04, C.gold);
    }
  });
  // eyes (separate for blinking) centred at bone origin
  mk('eyes', g => {
    for (const s of [-1, 1]) {
      g.ell(s * .185, 0, .43, .1, .14, .05, C.eye, 8, 6);
      g.ell(s * .185, -.05, .47, .075, .075, .02, C.iris, 7, 4);
      g.ell(s * .155, .045, .478, .03, .035, .012, C.white, 5, 3);
      g.ell(s * .2, -.075, .479, .014, .014, .01, C.white, 4, 3);
      g.push(s * .18, .12, .44, 0, 0, s * .12); g.box(0, 0, 0, .14, .022, .03, C.eye); g.pop();
    }
  });
  // arms
  const armU = (g, side) => {
    g.cyl(0, -.24, 0, .062, .072, .24, 9, O.sleeve);
    g.sphere(0, 0, 0, .075, O.sleeve, 8, 5);
    if (O.capelet && like === 'priest') g.cyl(0, -.24, 0, .1, .08, .2, 7, O.shirt);
  };
  const armL = (g, side) => {
    g.cyl(0, -.2, 0, .052, .062, .2, 9, O.wraps ? hexc('#2b2422') : O.sleeve === C.skin ? C.skin : O.glove);
    if (O.armor) g.cyl(0, -.18, 0, .075, .07, .16, 7, C.leather);
    if (like === 'mage' || like === 'priest') g.cyl(0, -.12, 0, .09, .065, .12, 7, O.sleeve);
    g.sphere(0, -.25, 0, .075, O.glove, 8, 6);
  };
  mk('shL', g => armU(g, 1)); mk('shR', g => armU(g, -1));
  mk('elL', g => {
    armL(g, 1);
    if (O.shield) { g.push(.1, -.15, .04, 0, 0, 0); g.box(0, 0, 0, .05, .5, .4, C.steel); g.box(.03, 0, 0, .02, .44, .34, hexc('#a6aebb')); g.box(.04, 0, 0, .02, .16, .12, C.gold); g.pop(); }
    if (O.weapon === 'bow') { g.push(0, -.26, .02, 0, 0, 0); for (let i = -4; i <= 4; i++) { const y = i * .1, z = .14 - Math.abs(i) * Math.abs(i) * .009; g.box(0, y, z, .04, .11, .04, C.leather); } g.box(0, 0, -.02, .006, .82, .006, [1, 1, 1]); g.pop(); }
    if (O.weapon === 'kunai') { g.push(0, -.27, 0, Math.PI / 2 + .3); g.box(0, .16, 0, .05, .22, .015, C.steel); g.cyl(0, -.05, 0, .02, .02, .1, 4, hexc('#2b2422')); g.pop(); }
  });
  mk('elR', g => {
    armL(g, -1);
    const w = O.weapon;
    if (w === 'sword') { g.push(0, -.26, 0, Math.PI / 2); g.box(0, .5, 0, .08, .78, .025, C.steel); g.box(0, .5, .016, .02, .74, .01, hexc('#eef1f6')); g.box(0, .1, 0, .3, .05, .09, C.gold); g.cyl(0, -.12, 0, .035, .035, .22, 5, C.leather); g.sphere(0, -.13, 0, .05, C.gold, 5, 3); g.pop(); }
    if (w === 'kunai') { g.push(0, -.27, 0, Math.PI / 2 + .3); g.box(0, .16, 0, .05, .22, .015, C.steel); g.cyl(0, -.05, 0, .02, .02, .1, 4, hexc('#2b2422')); g.pop(); }
    if (w === 'staff') { g.cyl(0, -.7, 0, .03, .035, 1.55, 6, C.wood); g.ell(0, .9, 0, .1, .17, .1, hexc('#9ff0ff'), 6, 4); for (let i = 0; i < 3; i++) g.cone(0, .78, 0, Math.cos(i * 2.1) * .5, 1, Math.sin(i * 2.1) * .5, .025, .22, 3, C.gold); }
    if (w === 'rod') { g.cyl(0, -.7, 0, .03, .035, 1.5, 6, C.gold); g.push(0, .95, 0, Math.PI / 2); g.cyl(0, -.02, 0, .2, .2, .04, 12, C.gold, null, false); g.pop(); g.ell(0, .95, 0, .07, .1, .07, hexc('#d65aa0'), 6, 4); }
  });
  // legs
  const legU = g => { g.cyl(0, -.3, 0, .085, .095, .3, 10, O.pants); };
  const legL = g => {
    g.cyl(0, -.28, 0, .072, .082, .28, 10, O.wraps ? hexc('#8a8378') : O.boot);
    g.box(0, -.335, .045, .17, .13, .27, O.boot); g.box(0, -.39, .05, .18, .03, .29, shade(O.boot, .6));
    g.cyl(0, -.14, 0, .095, .09, .07, 8, O.armor ? C.gold : shade(O.boot, 1.15), null, true);
    if (O.armor) { g.ell(0, -.02, .05, .09, .09, .07, C.steel, 6, 4); }
  };
  mk('thL', legU); mk('thR', legU); mk('knL', legL); mk('knR', legL);
  // cape / scarf tails / cloak
  mk('cape', g => {
    if (!O.cape || (O.add && O.add.cape)) return;
    if (like === 'knight') { g.box(0, -.48, -.02, .5, .96, .035, O.cape); g.box(0, -.94, -.02, .52, .06, .04, shade(O.cape, .8)); }
    if (like === 'ninja') { g.push(-.08, 0, 0, 0, 0, .1); g.box(0, -.32, -.02, .14, .66, .025, O.cape); g.pop(); g.push(.06, 0, 0, 0, 0, -.06); g.box(0, -.25, -.03, .12, .5, .025, shade(O.cape, .9)); g.pop(); }
    if (like === 'mage') { g.box(0, -.48, -.03, .56, .96, .035, O.cape); g.box(0, -.95, -.03, .58, .04, .04, C.gold); }
    if (like === 'adventurer') { g.box(0, -.22, -.02, .44, .4, .03, shade(O.cape, .95)); }
  });
  return parts;
}

/* ---------- keyframed action clips ----------
   pose keys: joint -> [rx, ry, rz]; root: {y, z (forward lunge), spin}
*/
const P0 = {};
const CLIPS = {
  // melee basic attack: wind up then diagonal slash
  slash: { dur: .42, hit: .5, keys: [
    [0, {}],
    [.32, { chest: [-.06, .55, 0], shR: [-2.5, 0, -.5], elR: [-.6, 0, 0], shL: [.3, 0, .3], thL: [-.3, 0, 0], knL: [.3, 0, 0], thR: [.2, 0, 0], hips: [0, .3, 0], root: { y: -.05 } }],
    [.55, { chest: [.18, -.6, 0], shR: [-.3, 0, -.2], elR: [-.2, 0, 0], shL: [-.6, 0, .4], thL: [-.55, 0, 0], knL: [.4, 0, 0], thR: [.35, 0, 0], hips: [0, -.35, 0], root: { y: -.12, z: .35 } }],
    [1, {}]] },
  // throw (shuriken, holy light, fire bolt basic)
  throw: { dur: .5, hit: .45, keys: [
    [0, {}],
    [.35, { chest: [-.1, .5, 0], shR: [-2.2, 0, -.9], elR: [-1.6, 0, 0], shL: [-.9, 0, .3], thL: [-.35, 0, 0], thR: [.25, 0, 0], hips: [0, .25, 0] }],
    [.5, { chest: [.2, -.45, 0], shR: [-1.5, 0, .1], elR: [-.1, 0, 0], shL: [.4, 0, .3], thL: [-.4, 0, 0], knL: [.3, 0, 0], thR: [.35, 0, 0], hips: [0, -.3, 0], root: { z: .2 } }],
    [1, {}]] },
  // bow draw & release
  bow: { dur: .62, hit: .62, keys: [
    [0, {}],
    [.25, { chest: [0, .7, 0], head: [0, -.6, 0], shL: [-1.55, -.2, .1], elL: [0, 0, 0], shR: [-1.5, 0, -.3], elR: [-1.9, 0, 0], thL: [-.25, 0, .1], thR: [.2, 0, -.1] }],
    [.6, { chest: [-.05, .75, 0], head: [0, -.65, 0], shL: [-1.6, -.2, .1], shR: [-1.45, 0, -.8], elR: [-2.4, 0, 0], thL: [-.25, 0, .1], thR: [.2, 0, -.1] }],
    [.68, { chest: [-.08, .8, 0], head: [0, -.65, 0], shL: [-1.6, -.2, .1], shR: [-1.2, 0, -1.3], elR: [-.6, 0, 0], thL: [-.25, 0, .1], thR: [.2, 0, -.1] }],
    [1, {}]] },
  bowUp: { dur: .7, hit: .6, keys: [
    [0, {}],
    [.3, { chest: [-.35, .5, 0], head: [-.5, -.4, 0], shL: [-2.5, -.2, .1], shR: [-2.3, 0, -.3], elR: [-1.9, 0, 0], thL: [-.3, 0, 0], thR: [.25, 0, 0], root: { y: -.06 } }],
    [.6, { chest: [-.4, .5, 0], head: [-.55, -.4, 0], shL: [-2.6, -.2, .1], shR: [-2.3, 0, -.8], elR: [-2.4, 0, 0], thL: [-.3, 0, 0], thR: [.25, 0, 0], root: { y: -.08 } }],
    [.68, { chest: [-.45, .5, 0], head: [-.55, -.4, 0], shL: [-2.6, -.2, .1], shR: [-2.0, 0, -1.4], elR: [-.4, 0, 0], thL: [-.3, 0, 0], thR: [.25, 0, 0] }],
    [1, {}]] },
  // staff cast forward (basic magic)
  cast: { dur: .55, hit: .5, keys: [
    [0, {}],
    [.3, { chest: [-.15, .25, 0], shR: [-2.4, 0, -.2], elR: [-.4, 0, 0], shL: [-.6, 0, .5], elL: [-1.2, 0, 0], thL: [-.2, 0, 0], thR: [.2, 0, 0], root: { y: .04 } }],
    [.5, { chest: [.22, -.15, 0], shR: [-1.3, 0, -.1], elR: [-.1, 0, 0], shL: [-.2, 0, .6], thL: [-.45, 0, 0], knL: [.35, 0, 0], thR: [.35, 0, 0], root: { y: -.1, z: .2 } }],
    [1, {}]] },
  // big spin (blades / swift slash)
  spin: { dur: .75, hit: .5, keys: [
    [0, {}],
    [.22, { chest: [.1, .8, 0], shR: [-1.6, 0, -1.2], elR: [-.3, 0, 0], shL: [-.8, 0, 1.2], thL: [-.4, 0, .1], knL: [.6, 0, 0], thR: [.3, 0, -.1], knR: [.5, 0, 0], root: { y: -.14, spin: .5 } }],
    [.6, { chest: [0, -.2, 0], shR: [-1.5, 0, -1.4], shL: [-1.5, 0, 1.4], thL: [-.2, 0, .3], thR: [.2, 0, -.3], root: { y: .18, spin: -TAU * 2 } }],
    [.8, { chest: [.15, 0, 0], shR: [-.5, 0, -.6], shL: [-.5, 0, .6], thL: [-.5, 0, 0], knL: [.6, 0, 0], thR: [.4, 0, 0], root: { y: -.1, spin: -TAU * 2 } }],
    [1, { root: { spin: -TAU * 2 } }]] },
  // heavy cleave: jump & smash
  cleave: { dur: .95, hit: .62, keys: [
    [0, {}],
    [.28, { chest: [-.35, .2, 0], shR: [-2.9, 0, -.2], elR: [-.4, 0, 0], shL: [-2.6, 0, .3], elL: [-.6, 0, 0], thL: [-.6, 0, 0], knL: [.9, 0, 0], thR: [-.4, 0, 0], knR: [.9, 0, 0], root: { y: -.16 } }],
    [.45, { chest: [-.4, .2, 0], shR: [-3.0, 0, -.2], elR: [-.3, 0, 0], shL: [-2.8, 0, .3], thL: [-.9, 0, 0], knL: [1.3, 0, 0], thR: [-.2, 0, 0], knR: [.6, 0, 0], root: { y: .9, z: .5 } }],
    [.62, { chest: [.55, -.2, 0], shR: [-.4, 0, -.2], elR: [0, 0, 0], shL: [-.5, 0, .3], thL: [-.9, 0, 0], knL: [1.1, 0, 0], thR: [.5, 0, 0], knR: [.6, 0, 0], head: [-.2, 0, 0], root: { y: -.22, z: 1.0 } }],
    [.85, { chest: [.4, -.2, 0], shR: [-.3, 0, -.2], shL: [-.4, 0, .3], thL: [-.8, 0, 0], knL: [1, 0, 0], thR: [.4, 0, 0], knR: [.6, 0, 0], root: { y: -.2, z: 1.0 } }],
    [1, { root: { z: 1.0 } }]] },
  // shield bash lunge
  bash: { dur: .55, hit: .45, keys: [
    [0, {}],
    [.3, { chest: [-.1, -.5, 0], shL: [-1.1, .3, .5], elL: [-1.5, 0, 0], shR: [.4, 0, -.3], thL: [.2, 0, 0], thR: [-.3, 0, 0], knR: [.4, 0, 0], root: { y: -.08, z: -.15 } }],
    [.48, { chest: [.25, .4, 0], shL: [-1.5, -.2, .2], elL: [-.6, 0, 0], shR: [.6, 0, -.3], thL: [-.7, 0, 0], knL: [.4, 0, 0], thR: [.5, 0, 0], root: { y: -.14, z: .8 } }],
    [1, { root: { z: .8 } }]] },
  // dash forward low
  dash: { dur: .5, hit: .3, keys: [
    [0, {}],
    [.25, { chest: [.6, 0, 0], head: [-.4, 0, 0], shR: [1.2, 0, -.3], elR: [-.4, 0, 0], shL: [1.2, 0, .3], thL: [-.8, 0, 0], knL: [1.2, 0, 0], thR: [.6, 0, 0], knR: [.6, 0, 0], root: { y: -.25 } }],
    [.6, { chest: [.5, 0, 0], head: [-.35, 0, 0], shR: [.9, 0, -.6], shL: [.9, 0, .6], thL: [-.3, 0, 0], thR: [.5, 0, 0], root: { y: -.2 } }],
    [1, {}]] },
  // raise both hands then slam down (meteor, judgment, frost nova)
  slam: { dur: .85, hit: .6, keys: [
    [0, {}],
    [.35, { chest: [-.3, 0, 0], head: [-.12, 0, 0], shR: [-2.9, 0, -.35], elR: [-.2, 0, 0], shL: [-2.9, 0, .35], elL: [-.2, 0, 0], thL: [-.1, 0, .12], thR: [.1, 0, -.12], root: { y: .22 } }],
    [.5, { chest: [-.35, 0, 0], head: [-.15, 0, 0], shR: [-3.0, 0, -.25], shL: [-3.0, 0, .25], root: { y: .3 } }],
    [.62, { chest: [.45, 0, 0], head: [.1, 0, 0], shR: [-.9, 0, -.2], elR: [-.3, 0, 0], shL: [-.9, 0, .2], elL: [-.3, 0, 0], thL: [-.55, 0, .1], knL: [.8, 0, 0], thR: [.45, 0, -.1], knR: [.5, 0, 0], root: { y: -.24 } }],
    [.85, { chest: [.3, 0, 0], shR: [-.7, 0, -.2], shL: [-.7, 0, .2], thL: [-.5, 0, .1], knL: [.7, 0, 0], thR: [.4, 0, -.1], knR: [.4, 0, 0], root: { y: -.2 } }],
    [1, {}]] },
  // leap strike (hero strike)
  leap: { dur: 1.0, hit: .64, keys: [
    [0, {}],
    [.22, { chest: [.3, 0, 0], shR: [.6, 0, -.3], shL: [.6, 0, .3], thL: [-.7, 0, 0], knL: [1.2, 0, 0], thR: [-.5, 0, 0], knR: [1.1, 0, 0], root: { y: -.25 } }],
    [.45, { chest: [-.3, 0, 0], shR: [-3.0, 0, -.1], elR: [-.6, 0, 0], shL: [-2.0, 0, .6], thL: [-1.0, 0, 0], knL: [1.5, 0, 0], thR: [-.3, 0, 0], knR: [1.0, 0, 0], root: { y: 1.6, z: .8, spin: -TAU } }],
    [.64, { chest: [.6, 0, 0], shR: [-.2, 0, -.2], elR: [0, 0, 0], shL: [-.4, 0, .5], thL: [-.9, 0, 0], knL: [1.2, 0, 0], thR: [.5, 0, 0], knR: [.7, 0, 0], root: { y: -.25, z: 1.6, spin: -TAU } }],
    [.88, { chest: [.4, 0, 0], shR: [-.3, 0, -.2], shL: [-.3, 0, .4], thL: [-.8, 0, 0], knL: [1.1, 0, 0], thR: [.4, 0, 0], knR: [.6, 0, 0], root: { y: -.22, z: 1.6, spin: -TAU } }],
    [1, { root: { z: 1.6, spin: -TAU } }]] },
  // heal / bless: hands together then open
  pray: { dur: .9, hit: .55, keys: [
    [0, {}],
    [.35, { chest: [.1, 0, 0], head: [.25, 0, 0], shR: [-1.0, .5, .2], elR: [-1.5, 0, 0], shL: [-1.0, -.5, -.2], elL: [-1.5, 0, 0], root: { y: -.03 } }],
    [.6, { chest: [-.3, 0, 0], head: [-.35, 0, 0], shR: [-2.5, 0, -.9], elR: [-.1, 0, 0], shL: [-2.5, 0, .9], elL: [-.1, 0, 0], root: { y: .12 } }],
    [1, {}]] },
  // guard stance
  guard: { dur: .7, hit: .4, keys: [
    [0, {}],
    [.35, { chest: [.1, -.3, 0], shL: [-1.4, .4, .3], elL: [-1.2, 0, 0], shR: [-.5, 0, -.5], elR: [-.6, 0, 0], thL: [-.4, 0, .15], knL: [.5, 0, 0], thR: [.3, 0, -.15], knR: [.4, 0, 0], root: { y: -.12 } }],
    [.7, { chest: [.12, -.3, 0], shL: [-1.45, .4, .3], elL: [-1.2, 0, 0], shR: [-.5, 0, -.5], elR: [-.6, 0, 0], thL: [-.4, 0, .15], knL: [.5, 0, 0], thR: [.3, 0, -.15], knR: [.4, 0, 0], root: { y: -.12 } }],
    [1, {}]] },
  hurt: { dur: .32, hit: 1, keys: [[0, {}], [.3, { chest: [-.35, .15, 0], head: [-.3, 0, 0], shR: [.4, 0, -.4], shL: [.4, 0, .4], root: { z: -.12 } }], [1, {}]] },
  cheer: { dur: 1.3, hit: 1, keys: [
    [0, {}], [.15, { thL: [-.3, 0, 0], knL: [.6, 0, 0], thR: [-.3, 0, 0], knR: [.6, 0, 0], root: { y: -.15 } }],
    [.35, { shR: [-2.9, 0, -.5], shL: [-2.9, 0, .5], elR: [-.3, 0, 0], elL: [-.3, 0, 0], head: [-.25, 0, 0], thL: [-.4, 0, 0], knL: [.9, 0, 0], thR: [.1, 0, 0], root: { y: .55 } }],
    [.55, { shR: [-2.9, 0, -.6], shL: [-2.9, 0, .6], head: [-.2, 0, 0], root: { y: 0 } }],
    [.75, { shR: [-2.8, 0, -.3], shL: [-2.8, 0, .3], elR: [-.6, 0, 0], elL: [-.6, 0, 0], head: [-.2, 0, 0], root: { y: .25 } }],
    [1, {}]] }
};
// which clip each skill uses, voice line and fx kind
const SKILL_ANIM = {
  swift: 'spin', wind: 'pray', hero: 'leap', bash: 'bash', guard: 'guard', cleave: 'cleave', shuriken: 'throw', shadow: 'dash', blades: 'spin',
  power: 'bow', multi: 'bow', rain: 'bowUp', fire: 'cast', frost: 'slam', meteor: 'slam', holy: 'cast', bless: 'pray', judge: 'slam'
};
const BASIC_ANIM = { adventurer: 'slash', knight: 'slash', ninja: 'slash', archer: 'bow', mage: 'cast', priest: 'cast' };

function sampleClip(clip, u) {
  const K = clip.keys; let i = 0; while (i < K.length - 2 && u > K[i + 1][0]) i++;
  const a = K[i], b = K[i + 1]; let t = clamp((u - a[0]) / Math.max(1e-4, b[0] - a[0]), 0, 1); t = t * t * (3 - 2 * t);
  const out = {}; const keys = new Set([...Object.keys(a[1]), ...Object.keys(b[1])]);
  for (const k of keys) {
    if (k === 'root') { const ra = a[1].root || {}, rb = b[1].root || {}; out.root = { y: lerp(ra.y || 0, rb.y || 0, t), z: lerp(ra.z || 0, rb.z || 0, t), spin: lerp(ra.spin || 0, rb.spin || 0, t) }; continue; }
    const va = a[1][k] || [0, 0, 0], vb = b[1][k] || [0, 0, 0]; out[k] = [lerp(va[0], vb[0], t), lerp(va[1], vb[1], t), lerp(va[2], vb[2], t)];
  }
  return out;
}

class Rig {
  constructor(cls) {
    this.cls = cls; this.n = BONES.length; this.ang = BONES.map(() => [0, 0, 0]); this.tgt = BONES.map(() => [0, 0, 0]);
    this.world = BONES.map(() => M4.ident()); this.loc = M4.ident(); this.rootM = M4.ident();
    this.t = Math.random() * 10; this.blinkT = 2 + Math.random() * 3; this.blink = 0; this.clip = null; this.clipT = 0; this.capeA = 0; this.rootY = 0; this.rootZ = 0; this.spin = 0;
    this.walkAmp = 0; this.ph = 0; this.hitDone = true;
  }
  play(name, speed = 1, onHit) { const c = CLIPS[name]; if (!c) return; this.clip = c; this.clipName = name; this.clipT = 0; this.clipSpd = speed; this.onHit = onHit; this.hitDone = !onHit; }
  get busy() { return !!this.clip && this.clipName !== 'hurt' && this.clipName !== 'cheer' && !(typeof EMOTE_CLIP !== 'undefined' && Object.values(EMOTE_CLIP).includes(this.clipName)); }
  // st: {walk, ph, speed, idle, dead, think, wave, vx, vz}
  update(dt, st) {
    this.t += dt; const T = this.tgt; for (const a of T) { a[0] = a[1] = a[2] = 0; }
    const set = (n, rx, ry, rz) => { const a = T[BONE_IDX[n]]; a[0] += rx; a[1] += ry || 0; a[2] += rz || 0; };
    let rootY = 0, rootZ = 0, spin = 0;
    const w = st.walk || 0, ph = st.ph || 0, run = clamp((st.speed || 0) / 7, 0, 1.2);
    // base locomotion
    const br = Math.sin(this.t * 2.2);
    set('chest', .02 * br * (1 - w) + .1 * w * run, .12 * w * Math.sin(ph), 0);
    set('hips', 0, -.1 * w * Math.sin(ph), .03 * w * Math.cos(ph));
    set('head', -.03 * br * (1 - w) - .06 * w, .12 * Math.sin(this.t * .45) * (1 - w), .03 * Math.sin(this.t * .7) * (1 - w));
    const sw = .5 + .25 * run;
    set('thL', -sw * w * Math.sin(ph), 0, .02); set('thR', sw * w * Math.sin(ph), 0, -.02);
    set('knL', w * (.12 + (.8 + .4 * run) * Math.max(0, -Math.cos(ph))), 0, 0); set('knR', w * (.12 + (.8 + .4 * run) * Math.max(0, Math.cos(ph))), 0, 0);
    set('shL', .45 * w * Math.sin(ph) * (1 + .3 * run) + .04 * br * (1 - w), 0, .14 + .03 * br); set('shR', -.45 * w * Math.sin(ph) * (1 + .3 * run) + .04 * br * (1 - w), 0, -.14 - .03 * br);
    set('elL', -.25 - .5 * w * run, 0, 0); set('elR', -.25 - .5 * w * run, 0, 0);
    rootY += w * (.045 + .03 * run) * Math.cos(2 * ph) - .02 * w;
    // weapon-specific idle hold
    const hold = (OUTFITS[this.cls] && (OUTFITS[this.cls].hold || OUTFITS[this.cls].like)) || this.cls;
    if (hold === 'mage' || hold === 'priest') set('elR', -.6 * (1 - w * .5), 0, 0);
    if (hold === 'archer') set('elL', -.3, 0, 0);
    if (st.think) { set('shR', -1.9, .3, -.1); set('elR', -2.1, 0, 0); set('head', .12, -.15, .12); set('chest', .05, 0, 0); }
    if (st.wave) { set('shR', -2.7, 0, -.35 + .25 * Math.sin(this.t * 11)); set('elR', -.5, 0, 0); set('head', -.05, 0, .1); }
    if (st.dead) { set('chest', -.3, 0, 0); set('head', -.3, 0, 0); set('shL', -.8, 0, .9); set('shR', -.8, 0, -.9); }
    // action clip overrides (blended over base)
    if (this.clip) {
      this.clipT += dt / this.clip.dur * (this.clipSpd || 1);
      const u = Math.min(1, this.clipT); const pose = sampleClip(this.clip, u);
      // blend weight: fade in quickly, fade out last 15%
      const wgt = Math.min(1, u / .08) * Math.min(1, (1 - u) / .12 + (u < .9 ? 1 : 0));
      for (const k in pose) {
        if (k === 'root') { rootY += pose.root.y * wgt; rootZ += pose.root.z; spin += pose.root.spin; continue; }
        const a = T[BONE_IDX[k]]; const v = pose[k]; a[0] = lerp(a[0], v[0], wgt); a[1] = lerp(a[1], v[1], wgt); a[2] = lerp(a[2], v[2], wgt);
      }
      if (!this.hitDone && u >= this.clip.hit) { this.hitDone = true; this.onHit && this.onHit(); }
      if (u >= 1) { this.clip = null; this.rootZcarry = rootZ; spin = 0; rootZ = 0; }
    }
    if (st.ride) { const lean = Math.sin(this.t * 2.2) * .02; for (const [n, v] of [['thL', [-1.45, 0, .5]], ['thR', [-1.45, 0, -.5]], ['knL', [1.35, 0, 0]], ['knR', [1.35, 0, 0]]]) { const a = T[BONE_IDX[n]]; a[0] = v[0]; a[1] = v[1]; a[2] = v[2]; } rootY = 0; rootZ = 0; if (!this.clip) { T[BONE_IDX.chest][0] += .12 + lean; T[BONE_IDX.shL][0] -= .5; T[BONE_IDX.shR][0] -= .5; T[BONE_IDX.elL][0] -= .5; T[BONE_IDX.elR][0] -= .5; } }
    // smoothing toward target (critically damped feel)
    const k = 1 - Math.exp(-dt * (this.clip ? 26 : 14));
    for (let i = 0; i < this.n; i++) { const a = this.ang[i], b = T[i]; a[0] += (b[0] - a[0]) * k; a[1] += (b[1] - a[1]) * k; a[2] += (b[2] - a[2]) * k; }
    this.rootY += (rootY - this.rootY) * Math.min(1, dt * 22); this.rootZ = rootZ; this.spin = spin;
    // cape secondary motion
    const capeT = .12 + w * (.25 + .2 * run) + (rootY > .2 ? .3 : 0);
    this.capeA += (capeT - this.capeA) * Math.min(1, dt * 5); this.ang[BONE_IDX.cape][0] = this.capeA + Math.sin(this.t * 3.1) * .04;
    this.ang[BONE_IDX.tail][0] = .3 + w * .3 + Math.sin(this.t * 4) * .05;
    // blink
    this.blinkT -= dt; if (this.blinkT <= 0) { this.blink = .14; this.blinkT = 2.2 + Math.random() * 3.5; }
    this.blink = Math.max(0, this.blink - dt);
  }
  // compute matrices. x,z position, face yaw, scale
  pose(x, y, z, face, s, fall = 0) {
    const fx = Math.sin(face), fz = Math.cos(face);
    const fe = fall * fall * (3 - 2 * fall);
    M4.compose(this.rootM, x + fx * this.rootZ * s - fx * fe * .3, y + this.rootY * s + fe * .2, z + fz * this.rootZ * s - fz * fe * .3, -1.45 * fe, face + this.spin, 0, s, s, s);
    for (let i = 0; i < this.n; i++) {
      const b = BONES[i]; const a = this.ang[i];
      let sy = 1; if (b[0] === 'eyes') sy = this.blink > 0 ? .12 : 1;
      if (b[0] === 'chest') sy = 1 + Math.sin(this.t * 2.2) * .012;
      M4.compose(this.loc, b[2], b[3], b[4], a[0], a[1], a[2], 1, sy, 1);
      const parent = b[1] === 'root' ? this.rootM : this.world[BONE_IDX[b[1]]];
      M4.mul(this.world[i], parent, this.loc);
    }
  }
  draw(R, parts, opts = {}) {
    for (let i = 0; i < this.n; i++) { const mesh = parts[BONES[i][0]]; if (mesh) R.drawMesh(mesh, this.world[i], opts.tint, opts.emis || RIG_FILL, opts.flash || 0, opts.alpha || 1); }
    if (!opts.noOutline && (opts.alpha || 1) >= 1) for (let i = 0; i < this.n; i++) { const mesh = parts[BONES[i][0]]; if (mesh && BONES[i][0] !== 'eyes') R.drawOutline(mesh, this.world[i], .02); }
  }
  boneM(name) { return this.world[BONE_IDX[name]]; }
  bonePos(name, lx = 0, ly = 0, lz = 0) { return M4.xform(this.world[BONE_IDX[name]], lx, ly, lz); }
}
const CHAR_SCALE = 1.08;
const RIG_FILL = new Float32Array([.11, .1, .09]);

// cosmetics attached to bones
const _cm = M4.ident(), _cl = M4.ident();
function drawCosmetics3D(R, rig, o) {
  o = o || { head: Save.d.cos.head, back: Save.d.cos.back, sheet: Player.sheet, anim: Player.anim, walk: Player.walkAmp || 0 };
  const head = o.head, back = o.back;
  if (head) {
    const y = head === 'c_kingcrown' ? .98 : head === 'c_halo' ? 1.18 + Math.sin(o.anim * 2) * .04 : head === 'c_crown' ? 1.0 : head === 'c_sheep' ? .86 : .9; const sc = head === 'c_sheep' ? .95 : head === 'c_straw' ? 1.05 : 1;
    const hasHat = o.sheet === 'mage';
    M4.compose(_cl, 0, hasHat ? y + .35 : y, -.02, -.08, 0, 0, sc, sc, sc); M4.mul(_cm, rig.boneM('head'), _cl);
    R.drawMesh(Models[head], _cm, null, head === 'c_crown' ? [.15, .2, .25] : head === 'c_halo' ? [.7, .55, .2] : null);
  }
  if (back) {
    const flap = Math.sin(o.anim * (3 + 7 * o.walk)) * (.22 + .18 * o.walk);
    const emis = back === 'c_crystalw' ? [.2, .45, .55] : back === 'c_angel' ? [.12, .12, .14] : back === 'c_dragon' ? [.15, .03, .01] : [.04, .02, .06];
    M4.compose(_cl, .05, .3, -.2, 0, .35 + flap, .25, .85, .85, .85); M4.mul(_cm, rig.boneM('chest'), _cl); R.drawMesh(Models[back], _cm, null, emis);
    M4.compose(_cl, -.05, .3, -.2, 0, Math.PI - .35 - flap, -.25, .85, .85, .85); M4.mul(_cm, rig.boneM('chest'), _cl); R.drawMesh(Models[back], _cm, null, emis);
  }
}

