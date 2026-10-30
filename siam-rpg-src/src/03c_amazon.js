
/* ============================================================
   Amazon zone world build: dense rainforest, river + piranha
   lake, anaconda swamp, man-eating plant grove, ancient ruins,
   ogre tribe village, explorers' base camp, east gate in สยาม.
   ============================================================ */
BOUNDS.amazon = { x0: AX - 100, x1: AX + 100, z0: -102, z1: 108 };
{ const oz = World.zoneOf; World.zoneOf = function (x) { return x > 2500 ? 'amazon' : oz.call(this, x); }; }
const ALAKE = { x: 46, z: 30, r: 13 }, ASWAMP = { x: -58, z: -64, r: 19 }, AGROVE = { x: 52, z: -52, r: 15 }, ARUIN = { x: -58, z: -10, r: 15 }, AVILL = { x: -14, z: -84, r: 21 }, ACAMP = { x: 0, z: 90, r: 15 };
const ABRIDGE = [{ z: -40, w: 3 }, { z: 66, w: 3 }];
const riverX = z => 22 + 14 * Math.sin(z / 26) + 6 * Math.sin(z / 11);
function aRiverDist(lx, z) {
  if (z <= 30) return Math.abs(lx - riverX(z));
  if (z > 30 && z < 44) { const d1 = Math.hypot(lx - riverX(z), z - 30); return Math.min(d1, 99); }
  return 99;
}
function aOutflowDist(lx, z) { return segDist(lx, z, ALAKE.x + 10, ALAKE.z + 4, 112, 46); }
const APATHS = [[[0, 112], [0, 90], [-6, 64], [-12, 40], [-20, 20], [-30, 2], [-44, -8]], [[-12, 40], [-4, 20], [2, -10], [0, -40], [11, -40], [22, -40], [36, -46], [48, -52]], [[2, -10], [-6, -40], [-12, -62], [-14, -84]], [[-30, 2], [-46, -30], [-58, -60]], [[0, 90], [20, 70], [34, 44]]];
function aPathDist(lx, z) { let m = 1e9; for (const p of APATHS) for (let i = 0; i < p.length - 1; i++) m = Math.min(m, segDist(lx, z, p[i][0], p[i][1], p[i + 1][0], p[i + 1][1])); return m; }
const inC = (lx, z, c, k = 1) => Math.hypot(lx - c.x, z - c.z) < c.r * k;
function amazonHeight(lx, z) {
  let h = 0;
  const rd = aRiverDist(lx, z), od = aOutflowDist(lx, z); const rw = Math.min(rd, od);
  if (rw < 5.5) h -= 1.5 * (1 - smooth(2.5, 5.5, rw));
  const dl = Math.hypot(lx - ALAKE.x, z - ALAKE.z); if (dl < ALAKE.r + 3) h -= .7 * (1 - smooth(ALAKE.r - 3, ALAKE.r + 3, dl));
  const ds = Math.hypot(lx - ASWAMP.x, z - ASWAMP.z); if (ds < ASWAMP.r + 2) h -= .32 * (1 - smooth(ASWAMP.r - 4, ASWAMP.r + 2, ds)) * (.7 + vnoise(lx * .2, z * .2) * .6);
  const ex = Math.max(Math.abs(lx) - 98, z - 106, -z - 100); if (ex > 0 && !(Math.abs(lx) < 6 && z > 100)) h += ex * .9 + vnoise(lx * .08, z * .08) * ex * .5;
  if (inC(lx, z, AVILL, .35)) h += .05;
  return h;
}
const APAL = {
  floor: hexc('#2f4a26'), floor2: hexc('#253d1f'), moss: hexc('#3f6a2c'), mud: hexc('#4a3a26'), mud2: hexc('#3a2c1c'), dirt: hexc('#6a5034'), sand: hexc('#9a8a62'),
  stone: hexc('#7a7a6a'), stone2: hexc('#5e6256'), stoneM: hexc('#56704a'), bark: hexc('#4a3626'), bark2: hexc('#3a2a1c'), leaf: hexc('#1f4a22'), leaf2: hexc('#2a5c26'), leaf3: hexc('#3a7a2c'), leaf4: hexc('#16361a'),
  palm: hexc('#3a8a3a'), thatch: hexc('#9a7a44'), hut: hexc('#7a5a36'), bone: hexc('#e6dcc4'), red: hexc('#c8323a'), purple: hexc('#8a3aa8'), yellow: hexc('#f2c43a'), canvas: hexc('#c8b88a'), canvas2: hexc('#8a7a4a'), crate: hexc('#8a6438'), water: hexc('#2a5a4a')
};
{ const T = { grass: ['floor', 'floor2'], moss: ['moss', 'stoneM'], rough: ['mud', 'mud2', 'dirt', 'stone2'], sand: ['sand'], brick: ['stone', 'stone2'], bark: ['bark', 'bark2'], leaves: ['leaf', 'leaf2', 'leaf3', 'leaf4', 'palm'], thatch: ['thatch'], planks: ['hut', 'crate'], cloth: ['canvas', 'canvas2'], water: ['water'] }; for (const t in T) for (const k of T[t]) tagTex(APAL[k], t); }
function amazonColor(lx, z, h) {
  const n = vnoise(lx * .08 + 11, z * .08), n2 = vnoise(lx * .27, z * .27 + 3);
  let c = mixc(APAL.floor, APAL.floor2, n); c = mixc(c, APAL.moss, n2 * .35);
  const pd = aPathDist(lx, z); if (pd < 2.4) c = mixc(c, mixc(APAL.dirt, APAL.mud, n2), 1 - smooth(1.2, 2.4, pd));
  if (inC(lx, z, ACAMP)) c = mixc(c, APAL.dirt, (1 - smooth(ACAMP.r * .6, ACAMP.r, Math.hypot(lx - ACAMP.x, z - ACAMP.z))) * .85);
  if (inC(lx, z, AVILL, 1.1)) c = mixc(c, mixc(APAL.dirt, APAL.mud2, n), (1 - smooth(AVILL.r * .7, AVILL.r * 1.1, Math.hypot(lx - AVILL.x, z - AVILL.z))) * .9);
  if (inC(lx, z, ARUIN)) c = mixc(c, mixc(APAL.stone2, APAL.stoneM, n2), (1 - smooth(ARUIN.r * .5, ARUIN.r, Math.hypot(lx - ARUIN.x, z - ARUIN.z))) * .8);
  if (inC(lx, z, ASWAMP, 1.15)) c = mixc(c, mixc(hexc('#3a4a26'), APAL.mud2, n), .7);
  if (inC(lx, z, AGROVE, 1.1)) c = mixc(c, hexc('#4a2e3a'), .45 * (1 - smooth(AGROVE.r * .6, AGROVE.r * 1.1, Math.hypot(lx - AGROVE.x, z - AGROVE.z))));
  if (h < -.25) c = mixc(c, APAL.mud, clamp(-h, 0, 1));
  if (Math.hypot(lx - ALAKE.x, z - ALAKE.z) < ALAKE.r + 4 && h > -.6) c = mixc(c, APAL.sand, .4);
  return c;
}
const AB = {
  tree(g, x, z, s, rng) {
    const H = (6.5 + rng() * 3) * s, r = .45 * s;
    g.tex = 'bark'; g.cyl(x, 0, z, r, r * .7, H, 7, rng() < .5 ? APAL.bark : APAL.bark2);
    for (let i = 0; i < 4; i++) { const a = i / 4 * TAU + rng(); g.cone(x + Math.sin(a) * r * .6, 1.2 * s, z + Math.cos(a) * r * .6, Math.sin(a), -1.1, Math.cos(a), r * .55, 1.6 * s, 4, APAL.bark2); }
    g.tex = 'leaves'; const n = 4 + (rng() * 3 | 0);
    for (let i = 0; i < n; i++) { const a = rng() * TAU, d = rng() * 2.2 * s; g.ell(x + Math.sin(a) * d * .7, H + (rng() - .3) * 1.2 * s, z + Math.cos(a) * d * .7, (1.35 + rng() * .9) * s, (.8 + rng() * .4) * s, (1.35 + rng() * .9) * s, pick([APAL.leaf, APAL.leaf2, APAL.leaf4]), 7, 5); }
    if (rng() < .7) for (let i = 0; i < 3; i++) { const a = rng() * TAU, d = 1 + rng() * 1.6 * s, len = 2 + rng() * 4; g.cyl(x + Math.sin(a) * d, H - len, z + Math.cos(a) * d, .05, .05, len, 3, APAL.leaf3); }
    g.tex = null; Col.addCircle(x, z, Math.max(.6, r * 1.3), 'atree');
  },
  palm(g, x, z, s, rng) {
    const H = (4.5 + rng() * 2) * s, lean = (rng() - .5) * .5; g.tex = 'bark';
    for (let i = 0; i < 5; i++) { const t = i / 5, t2 = (i + 1) / 5; g.cyl(x + lean * t * H * .3, t * H, z, .22 * s * (1 - t * .3), .2 * s * (1 - t2 * .3), H / 5 + .05, 6, APAL.bark); }
    const tx = x + lean * H * .3; g.tex = 'leaves';
    for (let i = 0; i < 7; i++) { const a = i / 7 * TAU + rng() * .3; g.cone(tx, H, z, Math.sin(a), -.25, Math.cos(a), .28 * s, 2.8 * s, 3, APAL.palm); }
    g.sphere(tx, H - .1, z, .3 * s, APAL.bark2, 5, 4); g.tex = null; Col.addCircle(x, z, .4 * s, 'apalm');
  },
  fern(g, x, z, s, rng) { for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + rng(); g.cone(x, .05, z, Math.sin(a), .55, Math.cos(a), .16 * s, 1.3 * s, 3, rng() < .5 ? APAL.leaf3 : APAL.leaf2); } },
  bigLeaf(g, x, z, s, rng) { for (let i = 0; i < 3; i++) { const a = rng() * TAU; g.cyl(x, 0, z, .04, .04, .8 * s, 3, APAL.leaf3); g.ell(x + Math.sin(a) * .5 * s, .9 * s, z + Math.cos(a) * .5 * s, .5 * s, .05, .8 * s, APAL.leaf2, 6, 3, .4, a); } },
  flower(g, x, z, s, col) { g.cyl(x, 0, z, .06 * s, .08 * s, 1.4 * s, 5, APAL.leaf3); for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; g.ell(x + Math.sin(a) * .45 * s, 1.45 * s, z + Math.cos(a) * .45 * s, .4 * s, .08 * s, .25 * s, col, 6, 3, 0, a); } g.sphere(x, 1.5 * s, z, .2 * s, APAL.yellow, 6, 4); },
  rock(g, x, z, r) { g.tex = 'moss'; g.rock(x, r * .3, z, r, mixc(APAL.stone2, APAL.stoneM, .5)); g.tex = null; Col.addCircle(x, z, r * .8, 'arock'); },
  hut(g, x, z, r, rot) {
    g.tex = 'planks'; g.cyl(x, 0, z, r, r, 2.2, 10, APAL.hut); g.tex = 'thatch'; g.cone(x, 2.1, z, 0, 1, 0, r * 1.35, 2.4, 10, APAL.thatch);
    g.tex = null; const a = rot; g.box(x + Math.sin(a) * r, .9, z + Math.cos(a) * r, .9, 1.8, .2, hexc('#1a120c'), null);
    for (let i = 0; i < 3; i++) g.sphere(x + Math.sin(a + .5 + i * .2) * (r + .05), 1.9 + i * .1, z + Math.cos(a + .5 + i * .2) * (r + .05), .16, APAL.bone, 5, 4);
    Col.addCircle(x, z, r + .2, 'ahut');
  },
  totem(g, x, z, h) { g.tex = 'bark'; g.cyl(x, 0, z, .28, .25, h, 6, APAL.bark2); g.tex = null; for (let i = 0; i < 3; i++) { const y = h * (.35 + i * .25); g.box(x, y, z + .22, .5, .35, .1, [APAL.red, APAL.yellow, hexc('#2a8a6a')][i]); g.box(x - .12, y + .05, z + .28, .1, .08, .03, hexc('#111')); g.box(x + .12, y + .05, z + .28, .1, .08, .03, hexc('#111')); } g.sphere(x, h + .15, z, .3, APAL.bone, 6, 5); Col.addCircle(x, z, .45, 'atotem'); },
  skullPole(g, x, z) { g.cyl(x, 0, z, .08, .07, 2.4, 4, APAL.bark2); g.sphere(x, 2.5, z, .22, APAL.bone, 6, 5); g.box(x - .07, 2.5, z + .18, .06, .06, .04, hexc('#111')); g.box(x + .07, 2.5, z + .18, .06, .06, .04, hexc('#111')); },
  tent(g, x, z, rot, col) { g.push(x, 0, z, 0, rot, 0); g.tex = 'cloth'; g.roof(0, 0, 0, 3.6, 2.2, 3.2, col, true); g.tex = null; g.box(0, .6, 1.62, .9, 1.2, .05, hexc('#2a1e14')); g.box(0, .6, -1.62, 3.0, 1.1, .05, col); g.cyl(0, 0, 1.75, .05, .05, 2.4, 4, APAL.bark2); g.pop(); Col.addCircle(x, z, 1.9, 'atent'); },
  crate(g, x, z, s = 1) { g.tex = 'planks'; g.box(x, .4 * s, z, .8 * s, .8 * s, .8 * s, APAL.crate); g.tex = null; Col.addCircle(x, z, .5 * s, 'acrate'); }
};
function buildAmazonZone(R) {
  const rng = mulberry32(9191), g = new Geo(311), gw = new Geo(312), w = new Geo(313);
  // ground
  const S = 4, X0 = -112, X1 = 112, Z0 = -112, Z1 = 116, nx = (X1 - X0) / S, nz = (Z1 - Z0) / S, H = [], C = [];
  for (let i = 0; i <= nx; i++) { H[i] = []; C[i] = []; for (let j = 0; j <= nz; j++) { const lx = X0 + i * S, z = Z0 + j * S; const h = amazonHeight(lx, z); H[i][j] = h; C[i][j] = amazonColor(lx, z, h); } }
  const gg = new Geo(310); gg.jit = .02; gg.uvs = .5;
  const tTex = (lx, z, h) => { if (aPathDist(lx, z) < 1.6 || inC(lx, z, ACAMP, .7) || inC(lx, z, AVILL, .8)) return 'rough'; if (inC(lx, z, ARUIN, .7)) return 'brick'; if (h < -.3) return 'rough'; return 'grass'; };
  for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) {
    const x0 = AX + X0 + i * S, z0 = Z0 + j * S, x1 = x0 + S, z1 = z0 + S;
    const a = [x0, H[i][j], z0], b = [x1, H[i + 1][j], z0], c = [x1, H[i + 1][j + 1], z1], d = [x0, H[i][j + 1], z1];
    gg.tex = tTex(X0 + i * S + S / 2, Z0 + j * S + S / 2, (H[i][j] + H[i + 1][j + 1]) / 2);
    gg.triC(d, c, b, C[i][j + 1], C[i + 1][j + 1], C[i + 1][j]); gg.triC(d, b, a, C[i][j + 1], C[i + 1][j], C[i][j]);
  }
  gg.smoothNormals(80); for (let k = 0; k < gg.d.length; k++) g.d.push(gg.d[k]);
  g.jit = .05;
  // water: river, outflow, lake, swamp (one plane per cell where the ground dips)
  w.tex = 'water';
  for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) { const lx = X0 + i * S + S / 2, z = Z0 + j * S + S / 2; const hh = Math.min(H[i][j], H[i + 1][j], H[i][j + 1], H[i + 1][j + 1]); if (hh > -.18) continue; const x0 = AX + X0 + i * S, z0 = Z0 + j * S, y = inC(lx, z, ASWAMP, 1.2) ? -.08 : -.14; const col = inC(lx, z, ASWAMP, 1.2) ? hexc('#3a4a2a') : hexc('#2a5a52'); w.quadUV([x0, y, z0 + S], [x0 + S, y, z0 + S], [x0 + S, y, z0], [x0, y, z0], col, 'water'); }
  // river collision (except bridges)
  for (let z = -104; z <= 34; z += 1.6) { if (ABRIDGE.some(b => Math.abs(z - b.z) < b.w + .4)) continue; Col.addCircle(AX + riverX(z), z, 3.1, 'ariver'); }
  for (let t = 0; t <= 1; t += .02) { const lx = lerp(ALAKE.x + 10, 112, t), z = lerp(ALAKE.z + 4, 46, t); if (Math.abs(lx - 20 - (ABRIDGE[1].z - 66)) < 0 ) continue; Col.addCircle(AX + lx, z, 3.0, 'ariver'); }
  // bridges
  for (const b of ABRIDGE) {
    const cx = b.z === -40 ? riverX(-40) : riverX(30), cz = b.z === -40 ? -40 : 66;
    if (b.z === 66) continue;
    g.tex = 'planks'; for (let i = -5; i <= 5; i++) g.box(AX + cx + i * .9, .25, cz, .8, .12, b.w * 2, i % 2 ? APAL.hut : APAL.crate);
    for (const s of [-1, 1]) { g.box(AX + cx, .9, cz + s * b.w, 10, .12, .12, APAL.bark2); for (let i = -5; i <= 5; i += 2) g.cyl(AX + cx + i * .9, 0, cz + s * b.w, .1, .1, 1, 4, APAL.bark2); }
    g.tex = null;
  }
  // camp
  { const cx = AX + ACAMP.x, cz = ACAMP.z; AB.tent(g, cx - 9, cz - 2, .4, APAL.canvas); AB.tent(g, cx + 10, cz + 2, -.5, APAL.canvas2); AB.tent(g, cx - 4, cz + 9, 3.2, APAL.canvas);
    for (let i = 0; i < 6; i++) AB.crate(g, cx + 12 + (i % 3) * .9, cz - 6 + Math.floor(i / 3) * .9, .9 + rng() * .2);
    g.tex = 'rough'; for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; g.rock(cx + Math.cos(a) * 1.3, .15, cz + 4 + Math.sin(a) * 1.3, .32, APAL.stone2); } g.tex = null;
    g.cyl(cx, 0, cz + 4, .9, .9, .15, 8, hexc('#2a1a10')); Col.addCircle(cx, cz + 4, 1.3, 'afire');
    for (const [lx, lz] of [[-14, -8], [14, -8], [-14, 10], [14, 10]]) { g.cyl(cx + lx, 0, cz + lz, .12, .1, 3, 5, APAL.bark2); g.box(cx + lx, 3.05, cz + lz, .35, .45, .35, hexc('#3a2a1a')); gw.box(cx + lx, 3.05, cz + lz, .22, .3, .22, [1, .8, .4]); }
    g.box(cx - 16, 1.2, cz + 2, .2, 2.4, .2, APAL.bark2); g.box(cx - 16, 2.2, cz + 2, .1, .9, 1.4, APAL.red);
  }
  // ogre village: palisade, huts, totems, bonfire, skull poles
  { const vx = AX + AVILL.x, vz = AVILL.z, R0 = AVILL.r;
    for (let i = 0; i < 60; i++) { const a = i / 60 * TAU; if (Math.abs(angWrap(a - Math.PI / 2)) < .22) continue; const x = vx + Math.cos(a) * R0, z = vz + Math.sin(a) * R0, hh = 3.2 + rng() * .8; g.tex = 'bark'; g.cyl(x, 0, z, .32, .25, hh, 5, APAL.bark2); g.cone(x, hh, z, 0, 1, 0, .25, .5, 5, APAL.bark2); g.tex = null; Col.addCircle(x, z, .5, 'apal'); }
    for (let i = 0; i < 7; i++) { const a = i / 7 * TAU + .3, r = 13 + (i % 2) * 2.5; AB.hut(g, vx + Math.cos(a) * r, vz + Math.sin(a) * r, 2.2 + rng() * .5, a + Math.PI); }
    for (const [dx, dz] of [[-5, 6], [5, 6], [-7, -3], [7, -3]]) AB.totem(g, vx + dx, vz + dz, 3.6);
    for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; AB.skullPole(g, vx + Math.cos(a) * 9, vz + Math.sin(a) * 9); }
    for (const s of [-1, 1]) AB.totem(g, vx + s * 3.2, vz + R0 + 1, 4.6);
    g.tex = 'rough'; for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; g.rock(vx + Math.cos(a) * 2, .2, vz + Math.sin(a) * 2, .42, APAL.stone2); } g.tex = null; Col.addCircle(vx, vz, 2.2, 'afire');
    g.cyl(vx, 0, vz, 1.6, 1.6, .2, 10, hexc('#1a100a')); g.box(vx - 1, 1.6, vz, .15, 3.2, .15, APAL.bark2); g.box(vx + 1, 1.6, vz, .15, 3.2, .15, APAL.bark2); g.box(vx, 3.2, vz, 2.4, .15, .15, APAL.bark2);
  }
  // ancient ruins: stepped pyramid, pillars, stone heads
  { const rx = AX + ARUIN.x - 10, rz = ARUIN.z - 6;
    g.tex = 'brick'; for (let i = 0; i < 5; i++) { const s = 12 - i * 2.2; g.box(rx, i * 1.4 + .7, rz, s, 1.4, s, i % 2 ? APAL.stone : APAL.stone2); }
    g.box(rx, 1.6, rz + 6.2, 3, .3, 2.6, APAL.stone2); g.box(rx, 7.6, rz, 2.4, 1.6, 2.4, APAL.stoneM); g.tex = null; Col.addBox(rx - 6.2, rz - 6.2, rx + 6.2, rz + 6.2, 'apyr');
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU, x = AX + ARUIN.x + Math.cos(a) * 10, z = ARUIN.z + Math.sin(a) * 10; if (Math.hypot(x - rx, z - rz) < 9) continue; const hh = 2 + rng() * 3; g.tex = 'brick'; g.box(x, hh / 2, z, 1, hh, 1, rng() < .5 ? APAL.stone : APAL.stoneM); g.tex = null; Col.addCircle(x, z, .8, 'apil'); if (rng() < .4) g.box(x + 1.2, .3, z + .6, 1.6, .6, .8, APAL.stone2); }
    for (const [dx, dz] of [[6, 10], [-6, 12]]) { const x = AX + ARUIN.x + dx, z = ARUIN.z + dz; g.tex = 'moss'; g.box(x, 1.2, z, 2, 2.4, 1.8, APAL.stoneM); g.tex = null; g.box(x - .45, 1.6, z + .92, .4, .25, .06, hexc('#1a1a14')); g.box(x + .45, 1.6, z + .92, .4, .25, .06, hexc('#1a1a14')); g.box(x, .9, z + .92, .9, .2, .06, hexc('#1a1a14')); Col.addCircle(x, z, 1.3, 'ahead'); }
  }
  // man-eating plant grove: giant flowers
  for (let i = 0; i < 16; i++) { const a = rng() * TAU, d = 4 + rng() * AGROVE.r; const x = AX + AGROVE.x + Math.cos(a) * d, z = AGROVE.z + Math.sin(a) * d; if (Col.blocked(x, z, 1.5)) continue; AB.flower(g, x, z, 1.4 + rng() * 1.4, pick([APAL.red, APAL.purple, hexc('#e85a9a')])); }
  // swamp: reeds and dead trees
  for (let i = 0; i < 120; i++) { const a = rng() * TAU, d = rng() * ASWAMP.r * 1.1; const x = AX + ASWAMP.x + Math.cos(a) * d, z = ASWAMP.z + Math.sin(a) * d; g.cyl(x, -.3, z, .03, .02, 1.2 + rng(), 3, hexc('#6a7a3a')); }
  for (let i = 0; i < 9; i++) { const a = rng() * TAU, d = 6 + rng() * ASWAMP.r; const x = AX + ASWAMP.x + Math.cos(a) * d, z = ASWAMP.z + Math.sin(a) * d; if (Col.blocked(x, z, 2)) continue; g.tex = 'bark'; g.cyl(x, -.3, z, .4, .25, 5, 5, hexc('#3a3226')); for (let k = 0; k < 3; k++) { const b = rng() * TAU; g.cone(x, 3 + k * .6, z, Math.sin(b), .6, Math.cos(b), .14, 2, 4, hexc('#3a3226')); } g.tex = null; Col.addCircle(x, z, .6, 'adead'); }
  WARPS.forEach(wp => { if (wp.zone === 'amazon') buildWarpBase(g, wp.x, wp.z); });
  // forest
  const clear = (x, z, r = 2.2) => { const lx = x - AX; if (aPathDist(lx, z) < 5) return false; if (inC(lx, z, ACAMP, 1.05) || inC(lx, z, AVILL, 1.12) || inC(lx, z, ARUIN, 1) || inC(lx, z, AGROVE, .9) || Math.hypot(lx - ALAKE.x, z - ALAKE.z) < ALAKE.r + 4) return false; if (aRiverDist(lx, z) < 6 || aOutflowDist(lx, z) < 6) return false; if (inC(lx, z, ASWAMP, .85)) return false; if (Col.blocked(x, z, r)) return false; return true; };
  for (let i = 0; i < 420; i++) { const lx = -108 + rng() * 216, z = -108 + rng() * 222; const edge = Math.abs(lx) > 92 || z < -94 || z > 100; if (!edge && rng() < .3) continue; if (!clear(AX + lx, z, 3)) continue; AB.tree(g, AX + lx, z, .85 + rng() * .6, rng); }
  for (let i = 0; i < 160; i++) { const lx = -96 + rng() * 192, z = -96 + rng() * 196; if (!clear(AX + lx, z, 1.6)) continue; AB.palm(g, AX + lx, z, .8 + rng() * .5, rng); }
  for (let i = 0; i < 700; i++) { const lx = -100 + rng() * 200, z = -100 + rng() * 205; if (aPathDist(lx, z) < 2 || inC(lx, z, ACAMP, .8) || inC(lx, z, AVILL, .9) || amazonHeight(lx, z) < -.2) continue; if (rng() < .55) AB.fern(g, AX + lx, z, .7 + rng() * .8, rng); else AB.bigLeaf(g, AX + lx, z, .8 + rng() * .6, rng); }
  for (let i = 0; i < 60; i++) { const lx = -96 + rng() * 192, z = -96 + rng() * 196; if (!clear(AX + lx, z, 1.4)) continue; AB.rock(g, AX + lx, z, .6 + rng() * 1.2); }
  for (let i = 0; i < 90; i++) { const lx = -96 + rng() * 192, z = -96 + rng() * 196; if (amazonHeight(lx, z) < -.2 || aPathDist(lx, z) < 1.8) continue; AB.flower(g, AX + lx, z, .35 + rng() * .3, pick([APAL.red, APAL.yellow, APAL.purple, hexc('#ff8a3a')])); }
  // glowing mushrooms
  for (let i = 0; i < 70; i++) { const lx = -96 + rng() * 192, z = -96 + rng() * 196; if (amazonHeight(lx, z) < -.2) continue; const x = AX + lx; g.cyl(x, 0, z, .05, .06, .3, 4, hexc('#d8d0b0')); gw.sphere(x, .34, z, .14, pick([[.3, 1, .8], [.6, .9, 1], [1, .6, .9]]), 5, 3); }
  World.meshes.amazon = R.mesh(g); World.meshes.aglow = R.mesh(gw); World.meshes.awater = R.mesh(w);
  // lights
  World.lights.push({ x: AX, y: 1.6, z: ACAMP.z + 4, r: 14, c: [1.3, .75, .35], zone: 'amazon' }, { x: AX + AVILL.x, y: 2, z: AVILL.z, r: 16, c: [1.4, .6, .25], zone: 'amazon' },
    { x: AX + ARUIN.x - 10, y: 9, z: ARUIN.z - 6, r: 14, c: [.4, 1, .6], zone: 'amazon' }, { x: AX + AGROVE.x, y: 2, z: AGROVE.z, r: 14, c: [1, .4, .8], zone: 'amazon' },
    { x: AX + ASWAMP.x, y: 2, z: ASWAMP.z, r: 16, c: [.5, .9, .3], zone: 'amazon' }, { x: AX + ALAKE.x, y: 2, z: ALAKE.z, r: 16, c: [.4, .8, 1], zone: 'amazon' });
  for (const [lx, lz] of [[-14, -8], [14, -8], [-14, 10], [14, 10]]) World.lights.push({ x: AX + lx, y: 3, z: ACAMP.z + lz, r: 9, c: [1.2, .8, .4], zone: 'amazon' });
  World.fires.push({ x: AX, z: ACAMP.z + 4, zone: 'amazon', s: .6 }, { x: AX + AVILL.x, z: AVILL.z, zone: 'amazon', s: 1 });
}
function buildEastGate(g) {
  const X = 142.5, Z = 70;
  for (const s of [-1, 1]) { g.cyl(X, 0, Z + s * 3.4, .4, .34, 5, 6, hexc('#4a3626')); Col.addCircle(X, Z + s * 3.4, .55, 'egate'); g.sphere(X, 5.1, Z + s * 3.4, .7, hexc('#2a5c26'), 7, 5); }
  g.box(X, 4.6, Z, .5, .5, 7.6, hexc('#4a3626')); for (let i = 0; i < 9; i++) g.cyl(X + .2, 4.4 - (i % 3) * .6 - 1, Z - 3 + i * .75, .05, .05, 1 + (i % 3) * .6, 3, hexc('#3a7a2c'));
  g.box(X - .3, 3.6, Z, .1, .8, 3.2, hexc('#3a2a1e')); g.box(X - .36, 3.6, Z, .04, .6, 2.8, hexc('#e6c86a'));
  for (let i = 0; i < 10; i++) { const z = Z - 10 + i * 2.2; if (Math.abs(z - Z) < 4.5) continue; g.cyl(X + 1.5 + Math.random() * 3, 0, z, .45, .35, 4, 5, hexc('#3a2e22')); g.sphere(X + 2.5, 4.4, z, 2.4, hexc('#1f4a22'), 7, 5); }
}
{
  const ob = World.build;
  World.build = function (R) { ob.call(this, R); buildAmazonZone(R); const eg = new Geo(314); buildEastGate(eg); World.meshes.eastgate = R.mesh(eg); };
  const op = World.placeName.bind(World);
  World.placeName = function (x, z) {
    if (x > 2500) { const lx = x - AX; for (const [ax, az, r, n] of AMAZON_AREAS) if (Math.hypot(lx - ax, z - az) < r) return n; if (aRiverDist(lx, z) < 8) return 'แม่น้ำอเมซอน'; return 'ป่าดิบชื้นอเมซอน'; }
    if (x > 128 && Math.abs(z - 70) < 16) return 'ทางไปป่าอเมซอน';
    return op(x, z);
  };
}
SPAWNS.push(
  ['piranha', AX + 46, 30, 9, 6], ['piranha', AX + 30, 58, 4, 2], ['dartfrog', AX - 8, 52, 12, 5], ['dartfrog', AX - 26, 24, 8, 3],
  ['jaguar', AX - 52, 8, 14, 4], ['jaguar', AX - 30, 40, 10, 3], ['spider', AX - 64, -26, 10, 4], ['spider', AX - 20, 20, 8, 3],
  ['ana', AX - 58, -64, 13, 5], ['plant', AX + 52, -52, 12, 5], ['caiman', AX + 6, -24, 6, 2], ['caiman', AX + 32, -70, 6, 2],
  ['ogre', AX - 14, -80, 12, 6], ['ogresham', AX - 14, -90, 8, 3]
);
