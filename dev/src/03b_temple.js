/* ============================================================
   Temple zone world: "วัดร้างกลางป่า" (abandoned Thai temple)
   local coords: lx = x - TX, z. South gate at z=56, canal on the east.
   ============================================================ */
BOUNDS.temple = { x0: TX - 72, x1: TX + 72, z0: -72, z1: 73 };
const TLANTERNS = [[-3, 50], [3, 50], [-3, 24], [3, 24], [-16, 37], [24, 32], [-30, 18], [16, -12.5], [38, -11], [52, -10], [10, -26], [-14, -24], [40, -26], [-40, 18]];
const NAK_ARENA = { x: TX + 47, z: -34, r: 15 };
const TPOND = { x: 22, z: -14, r: 8 };
const TPATHS = [
  [[0, 76], [0, 17]], [[0, 40], [-26, 30], [-34, 15]], [[-26, 30], [-44, 22], [-46, 4]], [[0, 40], [28, 34], [40, 22]],
  [[-15, 18], [15, 18], [15, -22], [-15, -22], [-15, 18]], [[0, -22], [0, -33]], [[15, -10], [40, -8], [60, -6]], [[40, -8], [44, -24]],
  [[12, -22], [26, -40]], [[-15, -22], [-21, -28]], [[26, -40], [48, -52]]
];
function tPathDist(lx, z) { let m = 1e9; for (const p of TPATHS) for (let i = 0; i < p.length - 1; i++) m = Math.min(m, segDist(lx, z, p[i][0], p[i][1], p[i + 1][0], p[i + 1][1])); return m; }
function templeHeight(lx, z) {
  let h = 0;
  if (lx > 59) h -= 1.3 * smooth(59, 63, lx);
  const dp = Math.hypot(lx - TPOND.x, z - TPOND.z); if (dp < TPOND.r + 1) h -= 1.0 * (1 - smooth(TPOND.r - 2.5, TPOND.r + 1, dp));
  const ex = Math.max(Math.abs(lx) - 78, Math.abs(z) - 78); if (ex > 0 && lx < 70) h += ex * .6 + vnoise(lx * .07, z * .07) * ex * .4;
  return h;
}
const TPAL = {
  grass: hexc('#4c6a3c'), grass2: hexc('#3d5833'), sand: hexc('#a79a7a'), sand2: hexc('#998b6b'), brick: hexc('#8a6656'), brick2: hexc('#755446'), stone: hexc('#8c867a'),
  mud: hexc('#5c5040'), dry: hexc('#625a42'), dark: hexc('#2f3f2a'), wallW: hexc('#d6d0c2'), wallW2: hexc('#bdb6a6'), plaster: hexc('#cfc7b4'),
  red: hexc('#8e2e22'), tile: hexc('#b5552c'), tile2: hexc('#9c4423'), tileG: hexc('#3d6b48'), gold: hexc('#d9a845'), gold2: hexc('#b8862e'),
  wood: hexc('#6a4a30'), wood2: hexc('#4e3423'), woodD: hexc('#3a281c'), bark: hexc('#54463a'), leaf: hexc('#2f4a2c'), leaf2: hexc('#3b5a33'), leaf3: hexc('#4d7340'),
  ruin: hexc('#9b5a42'), ruin2: hexc('#7d4634'), moss: hexc('#4d6a3a'), bone: hexc('#d8d0bc'), water: hexc('#2e5a6e')
};
{ const T = { grass: ['grass', 'grass2'], sand: ['sand', 'sand2'], brick: ['brick', 'brick2', 'ruin', 'ruin2'], rough: ['stone', 'mud', 'dry', 'dark'], plaster: ['wallW', 'wallW2', 'plaster'], tiles: ['tile', 'tile2', 'tileG', 'red'], metal: ['gold', 'gold2'], planks: ['wood', 'wood2', 'woodD'], bark: ['bark'], leaves: ['leaf', 'leaf2', 'leaf3'], moss: ['moss'], water: ['water'] }; for (const t in T) for (const k of T[t]) tagTex(TPAL[k], t); }
function templeColor(lx, z, h) {
  const n = vnoise(lx * .09 + 30, z * .09), n2 = vnoise(lx * .3, z * .3 + 7);
  let c = mixc(TPAL.grass, TPAL.grass2, n);
  if (z > 14 && z < 55 && Math.abs(lx) < 37) c = mixc(c, mixc(TPAL.sand, TPAL.sand2, n2), clamp((37 - Math.abs(lx)) / 4, 0, 1) * clamp((z - 14) / 3, 0, 1) * clamp((55 - z) / 3, 0, 1));
  if (Math.abs(lx) < 13.5 && z < 17.5 && z > -21.5) c = mixc(TPAL.stone, TPAL.sand2, n2 * .4);
  if (lx > 8 && lx < 46 && z < -38) c = mixc(c, TPAL.dry, .75);
  if (lx > 40 && z < -46) c = mixc(c, hexc('#5a503c'), .6);
  if (lx < -30 && z < -36) c = mixc(c, TPAL.dark, .8);
  if (Math.hypot(lx + 60, z + 30) < 7) c = mixc(c, hexc('#6c5a42'), 1 - smooth(5, 7, Math.hypot(lx + 60, z + 30)));
  if (lx < -38 && z > 22 && z < 44) c = mixc(c, hexc('#43603a'), .6);
  const da = Math.hypot(lx - (NAK_ARENA.x - TX), z - NAK_ARENA.z); if (da < NAK_ARENA.r) c = mixc(c, hexc('#5e5444'), (1 - smooth(NAK_ARENA.r - 4, NAK_ARENA.r, da)) * .8);
  if (lx > 55) c = mixc(c, TPAL.mud, smooth(55, 60, lx));
  const pd = tPathDist(lx, z); if (pd < 1.9) { const cb = ((Math.floor((lx + 200) / 1.3) + Math.floor((z + 200) / 1.3)) & 1) ? TPAL.brick : TPAL.brick2; c = mixc(c, cb, (1 - smooth(1.2, 1.9, pd)) * .92); }
  if (n2 > .8) c = mixc(c, hexc('#5a4a34'), .3);
  if (h < -.4) c = mixc(TPAL.mud, hexc('#3a4a44'), clamp(-h - .4, 0, 1));
  if (h > .8) c = mixc(c, TPAL.dark, clamp(h / 5, 0, 1));
  return c;
}

/* ---------- builder helpers ---------- */
const TB = {
  // double-sided quad (roof planes seen from both sides)
  q2(g, a, b, c, d, col) { g.quad(a, b, c, d, col); g.quad(d, c, b, a, shade(col, .55)); },
  // Thai gable roof: ridge along local x (len), width wid, height h; chofa, bai raka, hang hong. rot around y.
  roof(g, cx, cy, cz, len, wid, h, rot, o = {}) {
    const tile = o.tile || TPAL.tile, edge = o.edge || TPAL.tileG, gab = o.gable || TPAL.red, gold = o.gold || TPAL.gold;
    g.push(cx, cy, cz, 0, rot, 0);
    const L = len / 2, W = wid / 2;
    const slope = (y0, l, w, hh, col) => {
      TB.q2(g, [-l, y0, w], [l, y0, w], [l, y0 + hh, 0], [-l, y0 + hh, 0], col);
      TB.q2(g, [l, y0, -w], [-l, y0, -w], [-l, y0 + hh, 0], [l, y0 + hh, 0], shade(col, .88));
    };
    slope(0, L, W, h, edge);
    { const l = L - .35, w = W - .45, d = .07, yb = h * (1 - w / W) + d; TB.q2(g, [-l, yb, w], [l, yb, w], [l, h + d, 0], [-l, h + d, 0], tile); TB.q2(g, [l, yb, -w], [-l, yb, -w], [-l, h + d, 0], [l, h + d, 0], shade(tile, .88)); }
    for (const s of [-1, 1]) { g.tri([s * (L - .02), 0, s * W], [s * (L - .02), 0, -s * W], [s * (L - .02), h, 0], gab); g.tri([s * (L - .02), 0, -s * W], [s * (L - .02), 0, s * W], [s * (L - .02), h, 0], shade(gab, .8)); }
    if (!o.plain) {
      for (const s of [-1, 1]) {
        g.box(s * (L + .01), h * .36, 0, .06, h * .3, W * .5, gold); // gable emblem
        g.cone(s * L, h - .05, 0, s * .25, 1, 0, .13, .9, 5, gold); g.cone(s * (L + .22), h + .82, 0, s * 1, .25, 0, .09, .55, 4, gold); // chofa
        for (const w of [-1, 1]) {
          for (let i = 1; i < 6; i++) { const t = i / 6; g.cone(s * L, h * t, w * W * (1 - t), s * .1, 1, w * .5, .07, .32, 3, gold); } // bai raka
          g.cone(s * L, .02, w * W, s * .25, .9, w * .25, .09, .55, 4, gold); // hang hong
        }
      }
      g.box(0, h + .05, 0, len - .2, .14, .2, gold);
    }
    g.pop();
  },
  // sloped skirt roof around a rect (inner w,d at yTop -> outer at yBot)
  skirt(g, cx, cz, iw, id, ow, od, yTop, yBot, col) {
    const I = [iw / 2, id / 2], O = [ow / 2, od / 2];
    const P = (x, y, z) => [cx + x, y, cz + z];
    TB.q2(g, P(-I[0], yTop, -I[1]), P(I[0], yTop, -I[1]), P(O[0], yBot, -O[1]), P(-O[0], yBot, -O[1]), col);
    TB.q2(g, P(I[0], yTop, I[1]), P(-I[0], yTop, I[1]), P(-O[0], yBot, O[1]), P(O[0], yBot, O[1]), shade(col, .92));
    TB.q2(g, P(I[0], yTop, -I[1]), P(I[0], yTop, I[1]), P(O[0], yBot, O[1]), P(O[0], yBot, -O[1]), shade(col, .85));
    TB.q2(g, P(-I[0], yTop, I[1]), P(-I[0], yTop, -I[1]), P(-O[0], yBot, -O[1]), P(-O[0], yBot, O[1]), shade(col, .85));
  },
  lantern(g, gw, x, z, h = 2.6) {
    g.cyl(x, 0, z, .12, .09, h, 5, TPAL.woodD); g.box(x, h + .02, z, .62, .06, .62, TPAL.woodD);
    gw.box(x, h + .32, z, .4, .5, .4, hexc('#ffcf7a')); g.cyl(x, h + .58, z, .36, 0, .32, 4, TPAL.woodD); Col.addCircle(x, z, .3, 'lamp');
  },
  candles(gw, x, z, n = 3, r = .3) { for (let i = 0; i < n; i++) { const a = i / n * TAU, cx = x + Math.cos(a) * r, cz = z + Math.sin(a) * r; gw.cyl(cx, 0, cz, .05, .05, .22 + (i % 2) * .1, 4, hexc('#f4ecd8')); gw.sphere(cx, .3 + (i % 2) * .1, cz, .05, hexc('#ffd26a'), 4, 3); } },
  incense(g, gw, x, y, z) { g.cyl(x, y, z, .22, .18, .22, 7, hexc('#8a6a3a')); for (let i = 0; i < 5; i++) { const a = i * 1.3; g.cone(x + Math.cos(a) * .08, y + .2, z + Math.sin(a) * .08, Math.cos(a) * .15, 1, Math.sin(a) * .15, .012, .5, 3, hexc('#b8342a')); gw.sphere(x + Math.cos(a) * .155, y + .7, z + Math.sin(a) * .155, .025, hexc('#ff8a3a'), 3, 2); } },
  garland(g, x, y, z, r, col) { for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; g.sphere(x + Math.cos(a) * r, y + Math.sin(a) * r * .3, z + Math.sin(a) * r * .6, .07, i % 3 ? col : hexc('#f4f0e2'), 4, 3); } },
  deadTree(g, x, z, s, rng) {
    g.cyl(x, 0, z, .32 * s, .2 * s, 3.4 * s, 5, hexc('#4a4038'));
    for (let i = 0; i < 4; i++) { const a = rng() * TAU, y = (1.8 + rng() * 1.4) * s; g.cone(x, y, z, Math.cos(a), .7 + rng() * .4, Math.sin(a), .12 * s, (1.4 + rng()) * s, 4, hexc('#4a4038')); }
    Col.addCircle(x, z, .45 * s, 'tree');
  },
  darkTree(g, x, z, s, rng) {
    g.cyl(x, 0, z, .4 * s, .28 * s, 2.6 * s, 5, TPAL.bark);
    const c = rng() < .5 ? TPAL.leaf : TPAL.leaf2;
    g.sphere(x, 3.6 * s, z, 1.9 * s, c, 7, 5, .85); g.sphere(x + .9 * s, 3.0 * s, z + .4 * s, 1.2 * s, shade(c, 1.1), 6, 4); g.sphere(x - .8 * s, 3.2 * s, z - .6 * s, 1.3 * s, shade(c, .9), 6, 4);
    Col.addCircle(x, z, .6 * s + .2, 'tree');
  }
};

/* ---------- landmark builders (absolute coords: x = TX + lx) ---------- */
function tBuildUbosot(g, gw) {
  const X = TX, Z = -2;
  g.box(X, .45, Z, 17, .9, 31, TPAL.wallW2, TPAL.stone); g.box(X, .05, Z, 19, .1, 33, TPAL.stone);
  for (let i = 0; i < 5; i++) g.box(X, .18 * i + .1, Z + 15.6 + (4 - i) * .45, 5, .2, .5, TPAL.stone); // front steps
  g.box(X, 3.5, Z, 11, 5.2, 22, TPAL.wallW, TPAL.wallW2);
  g.box(X, 6.2, Z, 11.6, .3, 22.6, TPAL.gold2); // cornice
  for (let i = 0; i < 6; i++) { const z = Z - 9 + i * 3.6; for (const s of [-1, 1]) { g.box(X + s * 5.52, 3.0, z, .1, 2.0, 1.2, TPAL.red); g.box(X + s * 5.56, 3.0, z, .05, 1.7, .08, TPAL.gold); g.box(X + s * 5.55, 4.15, z, .08, .2, 1.35, TPAL.gold); } }
  for (const s of [-1, 1]) { g.box(X + s * 1.5, 2.6, Z + 11.02, 2.2, 3.4, .12, TPAL.red); g.box(X + s * 1.5, 2.6, Z + 11.08, 1.6, 2.8, .05, TPAL.gold2); g.box(X + s * 1.5, 4.55, Z + 11.06, 2.6, .5, .1, TPAL.gold); }
  for (let i = 0; i < 8; i++) { const z = Z - 12.6 + i * 3.6; for (const s of [-1, 1]) { g.box(X + s * 7.2, 3.0, z, .7, 5.2, .7, TPAL.wallW, TPAL.wallW2); g.cyl(X + s * 7.2, 5.6, z, .42, .55, .45, 6, TPAL.gold2); } }
  for (const s of [-1, 1]) for (const zz of [-1, 1]) { g.box(X + s * 3.5, 3.0, Z + zz * 14.4, .7, 5.2, .7, TPAL.wallW, TPAL.wallW2); g.box(X + s * 7.2, 3.0, Z + zz * 14.4, .7, 5.2, .7, TPAL.wallW, TPAL.wallW2); }
  TB.skirt(g, X, Z, 11.4, 22.4, 16.2, 30.4, 7.0, 5.6, TPAL.tile2);
  TB.roof(g, X, 6.9, Z, 23.6, 12.6, 6.6, Math.PI / 2, {});
  TB.roof(g, X, 6.1, Z + 13.2, 3.4, 15.8, 5.4, Math.PI / 2, {});
  TB.roof(g, X, 6.1, Z - 13.2, 3.4, 15.8, 5.4, Math.PI / 2, {});
  // ruin: broken tiles, vines, cracks
  const r = mulberry32(55);
  for (let i = 0; i < 9; i++) { const z = Z - 10 + r() * 20, s = r() < .5 ? -1 : 1; g.push(X + s * (1.5 + r() * 3.5), 7.2 + r() * 3, z, 0, 0, s * -.95); g.box(0, 0, 0, 1.0 + r(), .12, .9 + r(), hexc('#3a2a22')); g.pop(); }
  for (let i = 0; i < 14; i++) { const s = r() < .5 ? -1 : 1, z = Z - 10 + r() * 20, h = 1 + r() * 3; g.box(X + s * 5.56, h / 2 + .9, z, .08, h, .16 + r() * .2, TPAL.moss); }
  for (let i = 0; i < 6; i++) g.rock(X + (r() - .5) * 18, 0, Z + 16.6 + r() * 2, .3 + r() * .4, TPAL.wallW2);
  Col.addBox(X - 8.6, Z - 15.6, X + 8.6, Z + 15.6, 'ubosot');
  // bai sema (8 boundary stones)
  const sema = (x, z, ry) => { g.cyl(x, 0, z, .55, .5, .5, 8, TPAL.stone); g.push(x, .5, z, 0, ry, 0); g.box(0, .55, 0, .7, 1.1, .16, TPAL.wallW2); g.cone(0, 1.1, 0, 0, 1, 0, .35, .5, 4, TPAL.wallW2); g.pop(); Col.addCircle(x, z, .55, 'sema'); };
  for (const [lx, lz] of [[-10.2, 15.2], [10.2, 15.2], [-10.2, -19.2], [10.2, -19.2], [-10.2, -2], [10.2, -2], [0, 15.8], [0, -19.8]]) sema(X + lx, lz, lx ? Math.PI / 2 : 0);
  // kampaeng kaew (low wall) with gaps, some segments collapsed
  const wallSeg = (x0, z0, x1, z1, i) => {
    const len = Math.hypot(x1 - x0, z1 - z0), mx = (x0 + x1) / 2, mz = (z0 + z1) / 2, ry = Math.atan2(x1 - x0, z1 - z0);
    const broken = (i * 37 % 11) === 3; const h = broken ? .45 : 1.2;
    g.push(mx, 0, mz, 0, ry, 0); g.box(0, h / 2, 0, .45, h, len + .05, TPAL.wallW, TPAL.wallW2); if (!broken) for (let k = 0; k < Math.floor(len / 1.6); k++) g.ell(0, h + .18, -len / 2 + .8 + k * 1.6, .18, .24, .18, TPAL.wallW, 6, 4); g.pop();
    if (broken) for (let k = 0; k < 3; k++) g.rock(mx + (k - 1) * .6, 0, mz + (k - 1) * .5, .25, TPAL.wallW2);
    Col.addBox(Math.min(x0, x1) - .25, Math.min(z0, z1) - .25, Math.max(x0, x1) + .25, Math.max(z0, z1) + .25, 'kwall');
  };
  let k = 0; const W = 13, Zf = 17, Zb = -21;
  for (let x = -W; x < W; x += 2.6) { const x1 = Math.min(W, x + 2.6); if (x1 > -2.8 && x < 2.8) continue; wallSeg(X + x, Zf, X + x1, Zf, k++); }
  for (let x = -W; x < W; x += 2.6) { const x1 = Math.min(W, x + 2.6); if (x1 > -2.4 && x < 2.4) continue; wallSeg(X + x, Zb, X + x1, Zb, k++); }
  for (const s of [-1, 1]) for (let z = Zb; z < Zf; z += 2.6) wallSeg(X + s * W, z, X + s * W, Math.min(Zf, z + 2.6), k++);
  // incense stand & candles at the front door
  TB.incense(g, gw, X, .9, Z + 16.2); TB.candles(gw, X - 1.2, Z + 16.4, 3, .2); TB.candles(gw, X + 1.2, Z + 16.4, 3, .2);
}
function tBuildChedi(g, gw, rng) {
  const X = TX, Z = -42, B = TPAL.ruin, B2 = TPAL.ruin2;
  g.box(X, .5, Z, 12, 1, 12, B2, B); g.box(X, 1.45, Z, 10, .9, 10, B, shade(B, 1.1)); g.box(X, 2.25, Z, 8.4, .7, 8.4, B2, B);
  g.cyl(X, 2.6, Z, 3.9, 3.5, .7, 12, TPAL.plaster); g.cyl(X, 3.3, Z, 3.5, 3.6, .3, 12, B);
  g.ell(X, 5.6, Z, 3.3, 3.0, 3.3, B, 14, 9);
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + .3; g.box(X + Math.cos(a) * 3.0, 4.8 + (i % 3) * .5, Z + Math.sin(a) * 3.0, .9, .6, .5, TPAL.plaster); }
  g.box(X, 8.9, Z, 2.3, 1.0, 2.3, B2, B); g.box(X, 9.5, Z, 2.7, .25, 2.7, B);
  g.push(X, 9.6, Z, .1, 0, .16);
  for (let i = 0; i < 7; i++) g.cyl(0, i * .42, 0, 1.0 - i * .1, .9 - i * .1, .36, 10, i % 2 ? B : B2);
  g.cone(0, 2.95, 0, .25, 1, 0, .35, 1.6, 6, B2); g.pop();
  // collapsed chunk + rubble
  g.push(X + 2.8, 4.2, Z + 2.6, .6, .7, .4); g.box(0, 0, 0, 2.4, 1.6, 1.8, hexc('#3a241c')); g.pop();
  for (let i = 0; i < 26; i++) { const a = rng() * TAU, d = 6.2 + rng() * 3; g.rock(X + Math.cos(a) * d, 0, Z + Math.sin(a) * d, .25 + rng() * .5, rng() < .5 ? B : B2); }
  // banyan growing on the chedi
  g.cyl(X - 3.2, 3.0, Z - 2.6, .55, .35, 4.5, 6, TPAL.bark);
  for (let i = 0; i < 7; i++) { const a = rng() * TAU; g.cone(X - 3.2, 3.2, Z - 2.6, Math.cos(a), -1.2, Math.sin(a), .18, 3.4, 4, TPAL.bark); }
  for (let i = 0; i < 5; i++) g.sphere(X - 3.2 + (rng() - .5) * 4, 8 + rng() * 2, Z - 2.6 + (rng() - .5) * 4, 2 + rng(), i % 2 ? TPAL.leaf : TPAL.leaf2, 7, 5, .8);
  Col.addCircle(X, Z, 6.6, 'chedi');
  // gold jars (glow)
  for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * .42, x = X + Math.cos(a) * 7.8, z = Z + Math.sin(a) * -7.8; g.ell(x, .42, z, .42, .45, .42, hexc('#6b4a2a'), 8, 5); g.cyl(x, .8, z, .22, .25, .18, 7, hexc('#5a3a22')); gw.ell(x, .98, z, .26, .12, .26, hexc('#ffd257'), 6, 3); Col.addCircle(x, z, .45, 'jar'); }
}
function tBuildViharn(g, rng) {
  const X = TX - 20, Z = -30;
  for (let x = -5; x <= 5; x += 1.4) for (let z = -8; z <= 8; z += 1.4) g.box(X + x, .03, Z + z, 1.36, .06, 1.36, ((x + z) / 1.4 & 1) ? TPAL.brick : TPAL.brick2);
  for (const s of [-1, 1]) for (let i = 0; i < 5; i++) {
    const z = Z - 7 + i * 3.5, h = [5.2, 3.1, 4.6, 1.6, 4.1][(i + (s > 0 ? 2 : 0)) % 5];
    g.box(X + s * 3.6, h / 2, z, .85, h, .85, TPAL.ruin, TPAL.ruin2); g.box(X + s * 3.6, h / 2 + .4, z, .95, h * .3, .95, TPAL.plaster);
    Col.addCircle(X + s * 3.6, z, .65, 'pillar');
  }
  g.box(X, 2.2, Z - 9, 8.4, 4.4, .9, TPAL.ruin, TPAL.ruin2); g.box(X + 1.4, 4.8, Z - 9, 4, 1.0, .9, TPAL.ruin2); Col.addBox(X - 4.2, Z - 9.5, X + 4.2, Z - 8.5, 'vwall');
  for (let i = 0; i < 4; i++) { g.push(X + (rng() - .5) * 6, .4, Z + (rng() - .5) * 12, 0, rng() * TAU, Math.PI / 2); g.box(0, 0, 0, .8, 2.4, .8, TPAL.ruin2); g.pop(); }
  for (let i = 0; i < 18; i++) g.rock(X + (rng() - .5) * 11, 0, Z + (rng() - .5) * 18, .2 + rng() * .4, rng() < .5 ? TPAL.ruin : TPAL.plaster);
}
function tBuildTakhian(g, gw, rng) {
  const X = TX - 48, Z = -8;
  g.cyl(X, 0, Z, 2.3, 1.5, 10, 9, TPAL.bark); g.cyl(X, 9.6, Z, 1.5, 1.0, 3, 8, TPAL.bark);
  for (let i = 0; i < 7; i++) { const a = i / 7 * TAU + .2; g.push(X + Math.cos(a) * 1.8, 0, Z + Math.sin(a) * 1.8, 0, -a + Math.PI / 2, 0); g.box(0, .9, .9, .5, 1.8, 2.4, shade(TPAL.bark, .9)); g.pop(); }
  for (let i = 0; i < 5; i++) { const a = i / 5 * TAU + rng(); g.cone(X, 8 + rng() * 3, Z, Math.cos(a), .8, Math.sin(a), .55, 5 + rng() * 2, 5, TPAL.bark); }
  for (let i = 0; i < 12; i++) { const a = rng() * TAU, d = rng() * 5.5; g.sphere(X + Math.cos(a) * d, 13 + rng() * 4, Z + Math.sin(a) * d, 3 + rng() * 2.2, i % 3 ? TPAL.leaf : TPAL.leaf2, 8, 6, .8); }
  const C7 = ['#d23a3a', '#e8873a', '#e8c53a', '#3aa85a', '#3a6ad2', '#8a4ad2', '#e86aa8'].map(hexc);
  for (let i = 0; i < 7; i++) g.cyl(X, 1.1 + i * .26, Z, 2.0 - i * .02, 1.99 - i * .02, .24, 12, C7[i], null, true);
  for (let i = 0; i < 7; i++) { const a = -1.4 + i * .4; g.push(X + Math.cos(a) * 2.05, 1.6, Z + Math.sin(a) * 2.05, 0, -a, 0); g.box(0, -.4, 0, .05, 1.4, .3, C7[i]); g.pop(); }
  // offerings: dresses on a rack, table, figurines, garlands, incense
  const ox = X + 3.6, oz = Z + 2.4;
  g.box(ox, .4, oz, 2.2, .08, 1.0, TPAL.wood); for (const s of [-1, 1]) for (const t of [-1, 1]) g.box(ox + s * .95, .2, oz + t * .4, .08, .4, .08, TPAL.woodD);
  for (let i = 0; i < 4; i++) g.box(ox - .7 + i * .45, .62, oz, .14, .38, .14, hexc(['#e86aa8', '#f4ead2', '#e86aa8', '#f4ead2'][i]));
  TB.incense(g, gw, ox + .6, .44, oz - .2); TB.candles(gw, ox - .4, oz + .25, 2, .12);
  g.box(X - 3.2, 1.6, Z + 1.8, 1.8, .06, .06, TPAL.woodD); g.cyl(X - 4.0, 0, Z + 1.8, .05, .05, 1.6, 4, TPAL.woodD); g.cyl(X - 2.4, 0, Z + 1.8, .05, .05, 1.6, 4, TPAL.woodD);
  for (let i = 0; i < 3; i++) { const x = X - 3.8 + i * .6; g.box(x, 1.25, Z + 1.8, .42, .7, .06, hexc(['#c83a5a', '#7a3ac8', '#d29a3a'][i])); g.box(x, 1.55, Z + 1.8, .46, .1, .07, TPAL.gold); }
  TB.garland(g, X + 1.6, 2.6, Z + 1.5, .35, hexc('#f4d23a')); TB.garland(g, X - 1.4, 2.4, Z + 1.7, .3, hexc('#e8873a'));
  Col.addCircle(X, Z, 2.8, 'takhian'); Col.addCircle(ox, oz, 1.0, 'table'); Col.addCircle(X - 3.2, Z + 1.8, .8, 'rack');
}
function tBuildBodhi(g, rng) {
  const X = TX - 26, Z = 22;
  g.cyl(X, 0, Z, 1.25, .8, 6.5, 8, hexc('#6a5a4a'));
  for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + .4; const bx = X + Math.cos(a) * 3.4, bz = Z + Math.sin(a) * 3.4; g.cone(X, 5.2, Z, Math.cos(a), .45, Math.sin(a), .4, 4.4, 5, hexc('#6a5a4a'));
    g.push(bx, 0, bz, 0, 0, 0); g.cone(0, 0, 0, -Math.cos(a) * .25, 1, -Math.sin(a) * .25, .09, 6.2, 4, hexc('#9a7a52')); g.pop(); g.box(bx, .1, bz, .3, .2, .3, TPAL.woodD); Col.addCircle(bx, bz, .25, 'prop'); }
  for (let i = 0; i < 11; i++) { const a = rng() * TAU, d = rng() * 4.5; g.sphere(X + Math.cos(a) * d, 8.2 + rng() * 2.5, Z + Math.sin(a) * d, 2.4 + rng() * 1.4, i % 2 ? TPAL.leaf3 : TPAL.leaf2, 8, 5, .82); }
  for (let i = 0; i < 3; i++) g.cyl(X, 1.4 + i * .3, Z, 1.2, 1.19, .26, 10, hexc(['#e8c53a', '#d23a3a', '#f4f0e2'][i]), null, true);
  g.box(X, .3, Z + 1.8, 2.6, .6, .5, TPAL.stone);
  Col.addCircle(X, Z, 1.6, 'bodhi');
}
function tBuildBanana(g, rng) {
  const plant = (x, z, s) => {
    const lean = (rng() - .5) * .2; g.push(x, 0, z, lean, rng() * TAU, lean * .5);
    g.cyl(0, 0, 0, .26 * s, .19 * s, 2.5 * s, 7, hexc('#5f8a3e'));
    for (let i = 0; i < 7; i++) { const a = i / 7 * TAU + rng() * .5, torn = rng() < .3; g.push(0, 2.4 * s, 0, 0, a, 0); g.push(0, 0, 0, -.55 - rng() * .5, 0, 0); g.box(0, 0, (torn ? .8 : 1.3) * s, .64 * s, .04, (torn ? 1.6 : 2.6) * s, i % 2 ? hexc('#6ea84a') : hexc('#5c9440')); g.box(0, .03, (torn ? .8 : 1.3) * s, .05, .03, (torn ? 1.6 : 2.6) * s, hexc('#8ac25a')); g.pop(); g.pop(); }
    if (rng() < .5) { g.cone(0, 2.1 * s, .35, 0, -1, .4, .18, .7, 5, hexc('#7a2a3a')); for (let k = 0; k < 6; k++) g.box(.1 + (k % 3) * .08, 1.6 * s + (k / 3 | 0) * .2, .32, .07, .22, .07, hexc('#a8c24a')); }
    g.pop(); Col.addCircle(x, z, .45 * s, 'banana');
  };
  for (let i = 0; i < 16; i++) { const a = rng() * TAU, d = 2 + rng() * 9; plant(TX - 50 + Math.cos(a) * d, 32 + Math.sin(a) * d * .9, .9 + rng() * .45); }
}
function tBuildBamboo(g, rng) {
  const clump = (x, z) => {
    const n = 8 + (rng() * 6 | 0);
    for (let i = 0; i < n; i++) {
      const a = rng() * TAU, d = rng() * .9, h = 7 + rng() * 4, tilt = .06 + rng() * .14, c = rng() < .5 ? hexc('#7c9a4a') : hexc('#6a8a3e');
      g.push(x + Math.cos(a) * d, 0, z + Math.sin(a) * d, Math.sin(a) * tilt, 0, -Math.cos(a) * tilt);
      g.cyl(0, 0, 0, .13, .1, h, 5, c, null, true); for (let k = 1; k < h / 1.2; k++) g.cyl(0, k * 1.2, 0, .145, .145, .07, 5, shade(c, .75), null, true);
      for (let k = 0; k < 4; k++) { const b = rng() * TAU; g.cone(0, h * (.6 + k * .1), 0, Math.cos(b), .35, Math.sin(b), .05, 1.3, 3, hexc('#5a7a36')); }
      g.pop();
    }
    Col.addCircle(x, z, 1.3, 'bamboo');
  };
  for (let i = 0; i < 16; i++) { const x = TX - 70 + rng() * 36, z = -70 + rng() * 30; if (Math.hypot(x - (TX - 60), z + 30) < 8 || Math.hypot(x - (TX - 48), z + 52) < 6) continue; clump(x, z); }
  for (let i = 0; i < 6; i++) TB.deadTree(g, TX - 66 + rng() * 30, -36 - rng() * 30, .9 + rng() * .5, rng);
  // salt lick: mound + bones
  g.ell(TX - 60, .1, -30, 3.2, .5, 2.6, hexc('#7a6448'), 10, 4);
  for (let i = 0; i < 4; i++) { g.push(TX - 58 + rng() * 3, .1, -28 + rng() * 2, 0, rng() * TAU, Math.PI / 2); g.cyl(0, -.4, 0, .06, .06, .8, 4, TPAL.bone); g.pop(); }
}
function tBuildKuti(g, gw, rng) {
  const kuti = (x, z, ry, ruined) => {
    g.push(x, 0, z, 0, ry, 0);
    for (const s of [-1, 1]) for (const t of [-1, 0, 1]) g.box(s * 2.2, .7, t * 1.9, .25, 1.4, .25, TPAL.woodD);
    g.box(0, 1.5, 0, 5.0, .2, 4.4, TPAL.wood2); g.box(0, 2.9, 0, 4.4, 2.6, 3.8, TPAL.wood, TPAL.wood2);
    for (let i = -2; i <= 2; i++) g.box(i * .9, 2.9, 1.92, .06, 2.6, .06, TPAL.woodD);
    g.box(0, 2.6, 1.93, 1.0, 1.9, .06, TPAL.woodD); g.box(-1.5, 3.1, 1.93, .8, .7, .06, hexc('#1e1612'));
    for (let i = 0; i < 4; i++) g.box(0, .2 + i * .36, 2.6 + i * .35, 1.0, .1, .4, TPAL.wood2);
    if (!ruined) TB.roof(g, 0, 4.2, 0, 5.4, 5.0, 2.6, 0, { tile: hexc('#5a3a2a'), edge: hexc('#4a3024'), gable: TPAL.wood2, plain: true });
    else { g.push(.6, 4.4, 0, 0, 0, .45); g.box(0, 0, 0, 3.4, .14, 4.8, hexc('#5a3a2a')); g.pop(); for (let i = 0; i < 5; i++) g.rock((rng() - .5) * 4, 0, 2.8 + rng(), .3, hexc('#5a3a2a')); }
    g.pop(); Col.addCircle(x, z, 2.9, 'kuti');
  };
  kuti(TX + 37, 10, -Math.PI / 2, false); kuti(TX + 44, 17, -Math.PI / 2 + .1, true); kuti(TX + 51, 9, -Math.PI / 2, false);
  gw.box(TX + 34.6, 3.1, 10.7, .1, .5, .5, hexc('#ffc36a'));
  // kitchen shed
  const KX = TX + 36, KZ = 37;
  for (const s of [-1, 1]) for (const t of [-1, 1]) g.box(KX + s * 2.6, 1.5, KZ + t * 2, .25, 3, .25, TPAL.woodD);
  TB.roof(g, KX, 3.0, KZ, 6.4, 5.4, 1.8, 0, { tile: hexc('#6a5a44'), edge: hexc('#5a4a38'), gable: TPAL.wood2, plain: true });
  g.box(KX - 1, .5, KZ, 1.6, 1.0, 1.0, hexc('#8a5a3a')); g.cyl(KX - 1, 1.0, KZ, .45, .5, .5, 8, hexc('#3a2a24'));
  for (let i = 0; i < 4; i++) g.ell(KX + 1 + (i % 2) * .8, .35, KZ - .8 + (i >> 1) * 1.2, .38, .38, .38, hexc('#9a5a3a'), 7, 5);
  for (let i = 0; i < 6; i++) { g.push(KX + 2.2, .15 + (i % 3) * .2, KZ + 1.4, 0, 0, Math.PI / 2); g.cyl(0, -.7, (i / 3 | 0) * .2, .08, .08, 1.4, 4, TPAL.wood); g.pop(); }
  gw.sphere(KX - 1, 1.15, KZ, .2, hexc('#ff7a2a'), 5, 3);
  Col.addBox(KX - 2.8, KZ - 2.2, KX + 2.8, KZ + 2.2, 'kitchen');
  // rice barn (walls flare outward)
  const BX = TX + 50, BZ = 34;
  for (const s of [-1, 1]) for (const t of [-1, 1]) g.box(BX + s * 1.8, .7, BZ + t * 1.6, .3, 1.4, .3, TPAL.woodD);
  g.cyl(BX, 1.4, BZ, 2.7, 3.2, 2.6, 4, TPAL.wood, TPAL.wood2);
  TB.roof(g, BX, 4.0, BZ, 5.8, 5.6, 2.6, Math.PI / 4, { tile: hexc('#6a5236'), edge: hexc('#5a4430'), gable: TPAL.wood2, plain: true });
  for (let i = 0; i < 5; i++) g.ell(BX - 3 + (i % 3) * .7, .3, BZ - 2.6 + (i >> 1) * .5, .35, .3, .28, hexc('#c8b48a'), 6, 4);
  Col.addCircle(BX, BZ, 3.0, 'barn');
}
function tBuildMeru(g, gw, rng) {
  const X = TX + 28, Z = -50;
  g.box(X, .4, Z, 9, .8, 8, TPAL.wallW2, TPAL.stone); for (let i = 0; i < 3; i++) g.box(X, .14 + i * .2, Z + 4.5 + (2 - i) * .4, 3, .2, .4, TPAL.stone);
  for (const s of [-1, 1]) for (const t of [-1, 1]) g.box(X + s * 3, 3.0, Z + t * 2.6, .7, 4.6, .7, TPAL.wallW, TPAL.wallW2);
  g.box(X, 2.4, Z - 1, 4.6, 3.2, 3.4, TPAL.wallW2); g.box(X, 2.0, Z + .72, 1.6, 2.0, .1, hexc('#2a2420'));
  TB.skirt(g, X, Z, 3.4, 3.2, 7.4, 6.6, 6.6, 5.2, TPAL.tile2);
  for (let i = 0; i < 4; i++) g.box(X, 6.8 + i * .7, Z, 3.4 - i * .7, .7, 3.2 - i * .7, i % 2 ? TPAL.wallW2 : TPAL.wallW);
  g.cone(X, 9.6, Z, 0, 1, 0, .5, 3.6, 6, TPAL.gold2);
  g.box(X, 6.5, Z - 6.8, 1.4, 13, 1.4, TPAL.wallW2, hexc('#2a2420')); g.box(X, 13.1, Z - 6.8, 1.6, .3, 1.6, hexc('#2a2420'));
  Col.addBox(X - 4.6, Z - 4.2, X + 4.6, Z + 4.2, 'meru'); Col.addCircle(X, Z - 6.8, 1.1, 'chimney');
  // bone stupas
  for (let i = 0; i < 9; i++) {
    const x = TX + 12 + (i % 5) * 6 + rng() * 2, z = -40 - (i / 5 | 0) * 14 - rng() * 3; if (Math.hypot(x - X, z - Z) < 7) continue;
    const s = .7 + rng() * .5; g.box(x, .35 * s, z, 1.4 * s, .7 * s, 1.4 * s, TPAL.wallW2); g.box(x, .9 * s, z, 1.0 * s, .5 * s, 1.0 * s, TPAL.wallW); g.ell(x, 1.5 * s, z, .5 * s, .6 * s, .5 * s, TPAL.wallW, 8, 5); g.cone(x, 1.9 * s, z, 0, 1, 0, .16 * s, .9 * s, 5, TPAL.gold2);
    g.box(x, .9 * s, z + .51 * s, .3 * s, .36 * s, .02, hexc('#3a3632'));
    Col.addCircle(x, z, .8 * s, 'stupa');
  }
  // ossuary wall with niches
  for (let i = 0; i < 6; i++) { const x = TX + 12 + i * 5; g.box(x + 2.5, 1.1, -65, 5, 2.2, .8, TPAL.wallW2, TPAL.wallW); for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) g.box(x + .55 + c * .78, .45 + r * .6, -64.58, .48, .4, .05, rng() < .15 ? TPAL.gold2 : hexc('#3a3632')); }
  Col.addBox(TX + 12, -65.5, TX + 42, -64.5, 'ossuary');
  for (let i = 0; i < 4; i++) TB.deadTree(g, TX + 14 + rng() * 26, -44 - rng() * 16, .8 + rng() * .4, rng);
}
function tBuildChineseGraves(g, gw, rng) {
  const grave = (x, z, ry) => {
    g.push(x, 0, z, 0, ry, 0);
    for (let i = 0; i < 9; i++) { const a = -Math.PI * .1 - i / 8 * Math.PI * .8; g.push(Math.cos(a) * 2.0, 0, Math.sin(a) * 2.0 - .3, 0, -a, 0); g.box(0, .35, 0, .3, .7, .78, hexc('#8a7a6a')); g.pop(); }
    g.ell(0, 0, -.9, 1.3, .9, 1.1, hexc('#5a4e3a'), 10, 5);
    g.box(0, .75, .1, 1.1, 1.5, .25, hexc('#6e6a64')); g.box(0, .8, .24, .7, 1.0, .04, hexc('#9a2a22'));
    g.cyl(0, 0, 1.2, .3, .26, .4, 8, hexc('#7a6a5a')); g.pop();
    Col.addCircle(x, z, 1.8, 'grave');
  };
  grave(TX + 44, -56, .2); grave(TX + 52, -54, -.3); grave(TX + 48, -64, 0); grave(TX + 57, -62, -.2); grave(TX + 40, -64, .4);
  for (let i = 0; i < 3; i++) TB.deadTree(g, TX + 38 + rng() * 20, -46 - rng() * 8, 1, rng);
}
function tBuildPond(g, w, rng) {
  const X = TX + TPOND.x, Z = TPOND.z, R = TPOND.r;
  for (let i = 0; i < 26; i++) { const a = i / 26 * TAU; g.rock(X + Math.cos(a) * (R + .3), -.1, Z + Math.sin(a) * (R + .3), .45 + rng() * .3, TPAL.stone); }
  w.cyl(X, -.35, Z, R + .4, R + .4, .02, 24, TPAL.water, TPAL.water, true);
  for (let i = 0; i < 14; i++) { const a = rng() * TAU, d = rng() * (R - 1.5); g.cyl(X + Math.cos(a) * d, -.3, Z + Math.sin(a) * d, .5 + rng() * .3, .5, .04, 7, hexc('#3d6a3a')); if (i % 3 === 0) { g.cone(X + Math.cos(a) * d, -.26, Z + Math.sin(a) * d, 0, 1, 0, .18, .4, 6, hexc('#e8a0c0')); } }
  Col.addCircle(X, Z, R - .2, 'pond');
  for (let i = 0; i < 10; i++) { const a = rng() * TAU; g.cone(X + Math.cos(a) * (R + 1.2), 0, Z + Math.sin(a) * (R + 1.2), 0, 1, 0, .06, 1.1 + rng() * .6, 3, hexc('#5a7a3a')); }
}
function tBuildCanal(g, w, gw, rng) {
  w.quad([TX + 60, -.55, 90], [TX + 120, -.55, 90], [TX + 120, -.55, -90], [TX + 60, -.55, -90], TPAL.water);
  Col.addBox(TX + 60.6, -90, TX + 120, -9.6, 'canal'); Col.addBox(TX + 60.6, -3.4, TX + 120, 90, 'canal'); Col.addBox(TX + 67.6, -9.6, TX + 120, -3.4, 'canal');
  for (let i = 0; i < 40; i++) { const z = -70 + rng() * 140; if (Math.abs(z + 6) < 5 || Math.abs(z + 34) < 6) continue; g.cone(TX + 59.5 + rng() * 1.5, -.3, z, (rng() - .5) * .3, 1, (rng() - .5) * .3, .05, 1.2 + rng() * .8, 3, hexc('#5a7a3a')); }
  // pier + sala
  const PX = TX + 63.5, PZ = -6.5;
  g.box(PX, -.02, PZ, 8, .16, 6, TPAL.wood); for (let i = 0; i < 8; i++) g.box(PX - 3.8 + i * 1.1, .07, PZ, .06, .02, 6, TPAL.woodD);
  for (const s of [-1, 1]) for (const t of [-1, 1]) { g.box(PX + s * 3.6, -.6, PZ + t * 2.8, .3, 1.2, .3, TPAL.woodD); g.box(PX + s * 3.6, 1.4, PZ + t * 2.8, .25, 2.9, .25, TPAL.wood2); }
  TB.roof(g, PX, 2.85, PZ, 8.6, 6.6, 2.2, 0, { tile: hexc('#8a3a24'), edge: TPAL.tileG, plain: false });
  for (let i = 0; i < 4; i++) g.box(PX + 4.2 + i * .35, -.15 - i * .12, PZ, .35, .1, 2.2, TPAL.wood2);
  // moored boat
  g.push(TX + 66, -.45, -14, 0, .15, 0); g.ell(0, 0, 0, .7, .32, 3.4, hexc('#5a3a24'), 10, 5); g.box(0, .2, 0, .9, .05, 5.4, TPAL.woodD); g.pop();
  // Mae Nak's Thai house on stilts over the water
  const HX = TX + 66.5, HZ = -34;
  for (const s of [-1, 0, 1]) for (const t of [-1, 1]) g.cyl(HX + s * 3.2, -1.2, HZ + t * 2.6, .2, .2, 3.6, 6, TPAL.woodD);
  g.box(HX, 2.3, HZ, 8.4, .25, 6.4, TPAL.wood2); g.box(HX - 4.4, 2.3, HZ, 1.6, .2, 6.6, TPAL.wood);
  g.box(HX + .6, 3.8, HZ, 6.4, 2.8, 5.0, TPAL.wood, TPAL.wood2);
  for (let i = -3; i <= 3; i++) { g.box(HX + .6 + i * .9, 3.8, HZ + 2.52, .08, 2.8, .05, TPAL.woodD); g.box(HX + .6 + i * .9, 3.8, HZ - 2.52, .08, 2.8, .05, TPAL.woodD); }
  g.box(HX + .6, 3.8, HZ + 2.53, 6.4, .08, .05, TPAL.woodD); g.box(HX - 2.62, 3.6, HZ, .05, 2.0, 1.2, hexc('#1a1410'));
  TB.roof(g, HX + .6, 5.2, HZ, 7.6, 6.6, 3.8, Math.PI / 2, { tile: hexc('#4a3426'), edge: hexc('#3a281e'), gable: TPAL.wood, plain: true });
  for (const s of [-1, 1]) for (const t of [-1, 1]) { g.push(HX + .6 + s * 3.3, 5.2, HZ + t * 3.3, 0, 0, 0); g.cone(0, 0, 0, s * .1, 1, -t * .85, .1, 4.9, 4, TPAL.wood2); g.pop(); }
  for (let i = 0; i < 7; i++) g.box(HX - 5.4 - i * .45, 2.1 - i * .33, HZ + 2.2, .5, .1, 1.4, TPAL.wood2);
  g.cyl(HX - 3.2, 1.0, HZ - 1.2, .02, .02, 1.3, 3, TPAL.woodD); g.push(HX - 3.2, 1.0, HZ - 1.2, 0, 0, 0); g.ell(0, 0, 0, .55, .22, .35, hexc('#c8b48a'), 8, 4); g.pop();
  gw.box(HX - 3.6, 3.4, HZ + 2.7, .3, .45, .3, hexc('#ffcf7a'));
  Col.addBox(HX - 4.8, HZ - 3.3, HX + 4.4, HZ + 3.3, 'nakhouse');
}
function tBuildSmall(g, gw, rng) {
  // gate arch
  for (const s of [-1, 1]) { g.box(TX + s * 3.6, 3.0, 56, 1.4, 6, 1.4, TPAL.wallW, TPAL.wallW2); g.box(TX + s * 3.6, 6.15, 56, 1.7, .3, 1.7, TPAL.gold2); Col.addBox(TX + s * 3.6 - .8, 55.2, TX + s * 3.6 + .8, 56.8, 'gate'); }
  g.box(TX, 6.6, 56, 9, .7, 1.6, TPAL.wallW2); g.box(TX, 6.6, 56.82, 3.2, .55, .05, hexc('#2a2018')); g.box(TX, 6.6, 56.85, 3.0, .08, .04, TPAL.gold);
  TB.roof(g, TX, 7.0, 56, 3.2, 9.8, 2.6, Math.PI / 2, {});
  for (const s of [-1, 1]) { const x = TX + s * 6.2; g.box(x, .5, 58, 1.2, 1.0, 1.4, TPAL.stone); g.ell(x, 1.5, 58, .55, .7, .7, TPAL.wallW2, 7, 5); g.sphere(x, 2.4, 58.25, .45, TPAL.wallW2, 7, 5); g.box(x, 2.3, 58.68, .4, .2, .1, hexc('#3a3632')); Col.addCircle(x, 58, .9, 'lion'); }
  // outer brick wall with gaps
  const seg = (x0, z0, x1, z1) => {
    const len = Math.hypot(x1 - x0, z1 - z0), mx = (x0 + x1) / 2, mz = (z0 + z1) / 2, ry = Math.atan2(x1 - x0, z1 - z0), h = 1.6 + rng() * 1.2;
    g.push(mx, 0, mz, 0, ry, 0); g.box(0, h / 2, 0, .8, h, len + .05, TPAL.ruin, TPAL.ruin2); if (rng() < .4) g.box(0, h * .5, .02, .84, h * .4, len * .5, TPAL.plaster); g.pop();
    Col.addBox(Math.min(x0, x1) - .4, Math.min(z0, z1) - .4, Math.max(x0, x1) + .4, Math.max(z0, z1) + .4, 'owall');
  };
  for (let x = -70; x < 59; x += 4) { if (x > -8 && x < 6) continue; if (rng() < .12) continue; seg(TX + x, 56, TX + Math.min(59, x + 4), 56); }
  for (let z = -70; z < 56; z += 4) { if (rng() < .1) continue; seg(TX - 70, z, TX - 70, Math.min(56, z + 4)); }
  for (let x = -70; x < 59; x += 4) { if (rng() < .1) continue; seg(TX + x, -70, TX + Math.min(59, x + 4), -70); }
  // spirit house
  const SX = TX + 9, SZ = 51;
  g.box(SX, .2, SZ, 2.2, .4, 2.2, TPAL.stone); g.cyl(SX, .4, SZ, .22, .2, 1.4, 8, TPAL.wallW);
  g.box(SX, 1.9, SZ, 1.6, .12, 1.6, TPAL.gold2); g.box(SX, 2.35, SZ, 1.0, .8, .9, TPAL.wallW); g.box(SX, 2.3, SZ + .46, .4, .5, .05, TPAL.gold);
  TB.roof(g, SX, 2.75, SZ, 1.3, 1.3, .9, 0, {}); g.cone(SX, 3.55, SZ, 0, 1, 0, .16, .9, 5, TPAL.gold);
  for (let i = 0; i < 4; i++) { const x = SX - .6 + i * .4; g.box(x, 2.05, SZ + .6, .12, .16, .22, i % 2 ? hexc('#e8e0d0') : hexc('#6a5a4a')); }
  for (let i = 0; i < 3; i++) { g.cyl(SX - .3 + i * .3, 2.0, SZ - .6, .05, .05, .26, 5, hexc('#c8202a')); g.cyl(SX - .3 + i * .3 + .02, 2.26, SZ - .6, .008, .008, .2, 3, [1, 1, 1]); }
  TB.garland(g, SX, 2.9, SZ + .5, .25, hexc('#f4d23a')); TB.incense(g, gw, SX + .5, 1.96, SZ + .5); TB.candles(gw, SX - 1.2, SZ + 1.1, 3, .18);
  Col.addCircle(SX, SZ, 1.3, 'spirit');
  // monk's sala + klot umbrella
  const LX = TX - 14, LZ = 44.5;
  g.box(LX, .15, LZ, 7, .3, 5, TPAL.wood2);
  for (const s of [-1, 1]) for (const t of [-1, 1]) g.box(LX + s * 3.2, 1.7, LZ + t * 2.2, .3, 3.1, .3, TPAL.wood);
  TB.roof(g, LX, 3.2, LZ, 7.8, 6.0, 2.4, 0, {});
  g.cyl(LX + 1.6, .3, LZ - .6, .03, .03, 2.6, 4, TPAL.woodD); g.cyl(LX + 1.6, 2.5, LZ - .6, 1.5, .1, .5, 10, hexc('#e8d6a6')); g.cyl(LX + 1.6, .3, LZ - .6, 1.45, 1.45, 2.2, 10, hexc('#ece8dc'), null, true);
  g.box(LX - 1.5, .5, LZ - 1.4, .6, .4, .4, hexc('#8a5a2a')); g.cyl(LX - 2.3, .3, LZ - 1.4, .25, .2, .45, 8, hexc('#3a2a24'));
  Col.addBox(LX - 3.5, LZ - 2.5, LX + 3.5, LZ + 2.5, 'sala');
  // undertaker shed + coffin
  const UX = TX + 15, UZ = 41;
  for (const s of [-1, 1]) for (const t of [-1, 1]) g.box(UX + s * 2, 1.2, UZ + t * 1.5, .22, 2.4, .22, TPAL.woodD);
  TB.roof(g, UX, 2.4, UZ, 4.8, 3.8, 1.3, 0, { tile: hexc('#5a4a38'), edge: hexc('#4a3c2e'), gable: TPAL.woodD, plain: true });
  for (const s of [-1, 1]) { g.box(UX + s * .9, .35, UZ, .1, .7, .9, TPAL.woodD); } g.box(UX, .9, UZ, 2.4, .5, .8, hexc('#d8cfc0')); g.box(UX, 1.18, UZ, 2.5, .08, .9, TPAL.gold2);
  g.push(UX + 1.9, 0, UZ - .9, 0, 0, .25); g.cyl(0, 0, 0, .04, .04, 1.6, 4, TPAL.wood); g.box(0, .05, 0, .3, .4, .04, hexc('#6a6a6a')); g.pop();
  Col.addBox(UX - 2.2, UZ - 1.7, UX + 2.2, UZ + 1.7, 'shed');
  // bell tower
  const BX = TX + 18, BZ = 9;
  for (const s of [-1, 1]) for (const t of [-1, 1]) g.box(BX + s * 1.3, 2.6, BZ + t * 1.3, .3, 5.2, .3, TPAL.wallW2);
  g.box(BX, 2.6, BZ, 3.0, .2, 3.0, TPAL.wood2); TB.roof(g, BX, 5.2, BZ, 3.4, 3.4, 1.4, 0, {}); g.cone(BX, 6.5, BZ, 0, 1, 0, .2, 1.4, 5, TPAL.gold);
  g.cyl(BX, 3.6, BZ, .55, .38, 1.1, 10, hexc('#7a5a2e')); g.cyl(BX, 4.7, BZ, .04, .04, .5, 3, TPAL.woodD);
  Col.addBox(BX - 1.5, BZ - 1.5, BX + 1.5, BZ + 1.5, 'bell');
  // abandoned dance stage + instruments
  const DX2 = TX - 35, DZ = 8;
  g.box(DX2, .45, DZ, 8, .9, 6, TPAL.wood2, TPAL.wood);
  for (const s of [-1, 1]) for (const t of [-1, 1]) g.box(DX2 + s * 3.8, 2.6, DZ + t * 2.8, .25, 3.4, .25, TPAL.wood);
  g.box(DX2, 3.0, DZ - 2.9, 7.8, 3.4, .12, hexc('#6a1e1a')); for (let i = 0; i < 5; i++) g.box(DX2 - 3 + i * 1.5, 3.0, DZ - 2.82, .5, .5, .04, TPAL.gold2);
  g.push(DX2, 4.4, DZ, 0, 0, .06); g.box(0, 0, 0, 8.4, .16, 6.4, hexc('#5a3a2a')); g.pop();
  for (let i = 0; i < 12; i++) g.box(DX2 - 3.9 + i * .7, 4.05, DZ + 3.05, .5, .5, .03, i % 2 ? hexc('#c83a3a') : hexc('#d9a845'));
  g.push(DX2 + 5, 0, DZ + 2, 0, .3, 0); g.box(0, .35, 0, 1.8, .4, .5, TPAL.wood2); for (let i = 0; i < 9; i++) g.box(-.75 + i * .19, .58, 0, .14, .04, .42 - Math.abs(i - 4) * .02, hexc('#c8a050')); g.pop();
  for (let i = 0; i < 9; i++) { const a = Math.PI * .15 + i / 8 * Math.PI * 1.7; g.cyl(DX2 - 5 + Math.cos(a) * .9, .45, DZ + 1.6 + Math.sin(a) * .9, .14, .12, .1, 7, hexc('#c8a050')); } g.cyl(DX2 - 5, 0, DZ + 1.6, 1.05, 1.0, .45, 12, TPAL.wood2, null, true);
  Col.addBox(DX2 - 4.1, DZ - 3.1, DX2 + 4.1, DZ + 3.1, 'stage'); Col.addCircle(DX2 + 5, DZ + 2, .9, 'ranad'); Col.addCircle(DX2 - 5, DZ + 1.6, 1.1, 'gong');
}

/* ---------- overworld side: west forest gate ---------- */
function buildWestGate(g) {
  const X = -142.5, Z = 70;
  for (const s of [-1, 1]) { g.cyl(X, 0, Z + s * 3.4, .32, .26, 4.4, 6, PAL.wood2); Col.addCircle(X, Z + s * 3.4, .5, 'wgate'); }
  g.box(X, 4.3, Z, .4, .4, 8.2, PAL.wood2); g.box(X, 3.8, Z, .3, .25, 7.4, PAL.wood);
  g.box(X + .3, 3.2, Z, .08, .7, 3, hexc('#3a2a1e')); g.box(X + .36, 3.2, Z, .04, .5, 2.6, hexc('#d9c08a'));
  for (let i = 0; i < 6; i++) g.box(X + .2, 3.95, Z - 2.5 + i, .05, .3, .05, hexc('#f4f0e2'));
  g.cyl(X - 3, 0, Z + 5.5, .1, .08, 1.6, 4, PAL.wood2); g.push(X - 3, 1.45, Z + 5.5, 0, .3, 0); g.box(0, 0, 0, .1, .45, 1.6, PAL.wood); g.pop();
  for (let i = 0; i < 9; i++) { const z = Z - 9 + i * 2.2; if (Math.abs(z - Z) < 4.4) continue; g.cyl(X - 1.5 - Math.random() * 3, 0, z, .45, .3, 3, 5, hexc('#3a3a32')); g.sphere(X - 2.5, 4, z, 2.2, hexc('#2a3a2a'), 6, 4); }
}

/* ---------- main build ---------- */
function buildTempleZone(R) {
  const rng = mulberry32(4242);
  const g = new Geo(77), gw = new Geo(78), w = new Geo(79);
  // ground
  const S = 4, X0 = -112, X1 = 112, Z0 = -112, Z1 = 112, nx = (X1 - X0) / S, nz = (Z1 - Z0) / S, H = [], C = [];
  for (let i = 0; i <= nx; i++) { H[i] = []; C[i] = []; for (let j = 0; j <= nz; j++) { const lx = X0 + i * S, z = Z0 + j * S; const h = templeHeight(lx, z); H[i][j] = h; C[i][j] = templeColor(lx, z, h); } }
  const gg = new Geo(76); gg.jit = .02; gg.uvs = .5;
  const tTex = (lx, z, h) => { if (Math.abs(lx) < 13.5 && z < 17.5 && z > -21.5) return 'cobble'; if (tPathDist(lx, z) < 1.4) return 'brick'; if (h < -.4) return 'rough'; if (z > 14 && z < 55 && Math.abs(lx) < 37) return 'sand'; return 'grass'; };
  for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) {
    const x0 = TX + X0 + i * S, z0 = Z0 + j * S, x1 = x0 + S, z1 = z0 + S;
    const a = [x0, H[i][j], z0], b = [x1, H[i + 1][j], z0], c = [x1, H[i + 1][j + 1], z1], d = [x0, H[i][j + 1], z1];
    const st = v => [v[0], v[1], v[2]]; gg.tex = tTex(X0 + i * S + S / 2, z0 + S / 2, (H[i][j] + H[i + 1][j + 1]) / 2);
    gg.triC(d, c, b, st(C[i][j + 1]), st(C[i + 1][j + 1]), st(C[i + 1][j])); gg.triC(d, b, a, st(C[i][j + 1]), st(C[i + 1][j]), st(C[i][j]));
  }
  gg.smoothNormals(80); for (let k = 0; k < gg.d.length; k++) g.d.push(gg.d[k]);
  g.jit = .05;
  tBuildUbosot(g, gw); tBuildChedi(g, gw, rng); tBuildViharn(g, rng); tBuildTakhian(g, gw, rng); tBuildBodhi(g, rng); tBuildBanana(g, rng); tBuildBamboo(g, rng);
  tBuildKuti(g, gw, rng); tBuildMeru(g, gw, rng); tBuildChineseGraves(g, gw, rng); tBuildPond(g, w, rng); tBuildCanal(g, w, gw, rng); tBuildSmall(g, gw, rng);
  WARPS.forEach(wp => { if (wp.zone === 'temple') buildWarpBase(g, wp.x, wp.z); });
  // lanterns along paths
  for (const [lx, z] of TLANTERNS) TB.lantern(g, gw, TX + lx, z);
  // trees outside & around
  const clear = (x, z) => { const lx = x - TX; if (Math.abs(lx) < 12 && z > 40) return false; if (tPathDist(lx, z) < 4) return false; if (Col.blocked(x, z, 2.2)) return false; return true; };
  for (let i = 0; i < 260; i++) { const lx = -110 + rng() * 170, z = -110 + rng() * 220; const inside = lx > -69 && lx < 59 && z > -69 && z < 55; if (inside && rng() > .12) continue; if (lx > 58 && z > -80) continue; if (lx > -6 && lx < 6 && z > 55) continue; if (!clear(TX + lx, z)) continue; TB.darkTree(g, TX + lx, z, .9 + rng() * .7, rng); }
  for (let i = 0; i < 14; i++) { const lx = -60 + rng() * 110, z = -60 + rng() * 110; if (!clear(TX + lx, z) || Math.hypot(lx - 0, z + 2) < 22) continue; TB.deadTree(g, TX + lx, z, .8 + rng() * .5, rng); }
  // grass tufts & fallen leaves
  for (let i = 0; i < 1400; i++) { const lx = -72 + rng() * 132, z = -72 + rng() * 146; if (tPathDist(lx, z) < 2.2 || (Math.abs(lx) < 13.5 && z < 17.5 && z > -21.5) || lx > 58) continue; if (z > 14 && z < 55 && Math.abs(lx) < 36 && rng() < .8) continue; const c = rng() < .5 ? hexc('#3f5a33') : hexc('#4a6638'); for (let k = 0; k < 3; k++) g.cyl(TX + lx + (rng() - .5) * .6, 0, z + (rng() - .5) * .6, .1, 0, .4 + rng() * .4, 3, c, null, true); }
  for (let i = 0; i < 260; i++) { const lx = -70 + rng() * 128, z = -70 + rng() * 140; g.box(TX + lx, .02, z, .3, .02, .2, pick([hexc('#7a5a2a'), hexc('#8a6a3a'), hexc('#5a4a2a')])); }
  World.meshes.temple = R.mesh(g); World.meshes.tglow = R.mesh(gw); World.meshes.twater = R.mesh(w);
  const wg = new Geo(80); buildWestGate(wg); World.meshes.westgate = R.mesh(wg);
  // lights (zone temple)
  const warm = [1.25, .72, .32];
  for (const [lx, z] of TLANTERNS) World.lights.push({ x: TX + lx, y: 3, z, r: 11, c: warm, zone: 'temple' });
  World.lights.push({ x: TX, y: 1.4, z: 14.4, r: 9, c: [1.2, .7, .3], zone: 'temple' }, { x: TX + 9, y: 2.4, z: 52, r: 8, c: [1.3, .8, .35], zone: 'temple' },
    { x: TX - 44, y: 1.8, z: -5, r: 10, c: [1.1, .55, .4], zone: 'temple' }, { x: TX + 28, y: 2, z: -46, r: 14, c: [.25, .9, .55], zone: 'temple' },
    { x: TX + 46, y: 3, z: -58, r: 12, c: [.6, .85, .3], zone: 'temple' }, { x: TX, y: 2, z: -34, r: 12, c: [1.2, .9, .3], zone: 'temple' },
    { x: TX + 63, y: 3.4, z: -31.5, r: 12, c: [1.2, .75, .35], zone: 'temple' }, { x: TX + 22, y: 1, z: -14, r: 11, c: [.3, .75, .9], zone: 'temple' },
    { x: TX - 35, y: 3, z: 9, r: 10, c: [.8, .45, 1.0], zone: 'temple' }, { x: TX - 14, y: 2.5, z: 44.5, r: 9, c: [1.25, .8, .4], zone: 'temple' }, { x: TX + 15, y: 2.2, z: 41, r: 8, c: [1.2, .7, .3], zone: 'temple' });
  World.fires.push({ x: TX + 35, z: 37, zone: 'temple', s: .5 });
  World.incense = [[TX, 1.6, 14.2], [TX + 9.5, 2.6, 51.5], [TX - 43.8, 1.1, -5.8]];
}

/* ---------- World patches ---------- */
{
  const ob = World.build;
  World.build = function (R) { ob.call(this, R); buildTempleZone(R); };
}
World.zoneOf = function (x) { return x > 1500 ? 'temple' : x > 500 ? 'dungeon' : 'world'; };
const TEMPLE_AREAS = [
  [0, 64, 10, 'ซุ้มประตูวัดร้าง'], [9, 50, 4, 'ศาลพระภูมิเจ้าที่'], [0, -2, 16, 'อุโบสถร้าง'], [0, -42, 11, 'เจดีย์ร้าง'], [-20, -30, 10, 'ซากวิหารร้าง'],
  [-48, -8, 10, 'ต้นตะเคียนยักษ์'], [-50, 32, 11, 'ดงกล้วยตานี'], [-35, 8, 8, 'เวทีรำร้าง'], [-26, 22, 6, 'ต้นโพธิ์ใหญ่'], [-60, -30, 8, 'โป่งดินกลางป่า'],
  [28, -50, 9, 'เมรุเก่า'], [48, -58, 11, 'ฮวงซุ้ยเก่า'], [44, 12, 11, 'กุฏิร้าง'], [42, 36, 13, 'โรงครัวและยุ้งข้าว'], [22, -14, 10, 'สระบัวร้าง'],
  [62, -6, 7, 'ท่าน้ำริมคลอง'], [47, -34, 15, 'เรือนไทยริมคลอง'], [18, 9, 4, 'หอระฆัง']
];
{
  const op = World.placeName.bind(World);
  World.placeName = function (x, z) {
    if (x > 1500) { const lx = x - TX; for (const [ax, az, r, n] of TEMPLE_AREAS) if (Math.hypot(lx - ax, z - az) < r) return n; if (lx < -30 && z < -36) return 'ป่าไผ่หลังวัด'; if (z > 14) return 'ลานหน้าวัด'; if (z < -40) return 'ป่าช้าวัด'; return 'วัดร้างกลางป่า'; }
    if (x < -128 && Math.abs(z - 70) < 16) return 'ทางไปวัดร้าง';
    return op(x, z);
  };
}
SPAWNS.push(
  ['takhon', TX - 30, 46, 8, 4], ['pret', TX + 2, 27, 9, 5], ['pret', TX + 22, 33, 5, 2], ['khamot', TX + 22, -14, 9, 3], ['tani', TX - 50, 32, 8, 3],
  ['kongkoi', TX - 48, -52, 10, 3], ['krasue', TX + 26, -52, 12, 4], ['phrai', TX + 54, 4, 7, 3], ['pongkhang', TX - 58, -30, 7, 3], ['takhian', TX - 46, -8, 9, 4],
  ['nangram', TX - 34, 14, 7, 3], ['phong', TX + 30, -24, 6, 2], ['krahang', TX + 44, 28, 10, 3], ['phidip', TX + 50, -58, 8, 3], ['pop', TX + 44, 14, 8, 3],
  ['huakhat', TX - 20, -30, 8, 3], ['tabo', TX + 26, 4, 5, 2], ['chakla', TX + 40, 45, 5, 3], ['saming', TX - 32, -56, 7, 2], ['pusom', TX, -29, 3, 1], ['maenak', TX + 47, -34, 2, 1]
);

