/* ============================================================
   World building: terrain, town, forest, dungeon, colliders
   ============================================================ */
const DX = 1000; // dungeon x offset
const TOWN = { x: 0, z: 62, r: 34 };
const RIVER = { z0: -2, z1: 10 };
const BOUNDS = { world: { x0: -148, x1: 148, z0: -146, z1: 146 }, dungeon: { x0: 960, x1: 1040, z0: -130, z1: 16 } };

const Col = {
  circles: [], boxes: [], grid: new Map(), cell: 8,
  key(cx, cz) { return cx * 73856093 ^ cz * 19349663; },
  addCircle(x, z, r, tag) { const c = { x, z, r, tag, on: true }; this.circles.push(c); this._ins(c, x - r, z - r, x + r, z + r); return c; },
  addBox(x0, z0, x1, z1, tag) { const b = { x0: Math.min(x0, x1), z0: Math.min(z0, z1), x1: Math.max(x0, x1), z1: Math.max(z0, z1), tag, on: true, box: true }; this.boxes.push(b); this._ins(b, b.x0, b.z0, b.x1, b.z1); return b; },
  _ins(o, x0, z0, x1, z1) {
    const c = this.cell;
    for (let cx = Math.floor(x0 / c); cx <= Math.floor(x1 / c); cx++) for (let cz = Math.floor(z0 / c); cz <= Math.floor(z1 / c); cz++) {
      const k = this.key(cx, cz); let a = this.grid.get(k); if (!a) { a = []; this.grid.set(k, a); } a.push(o);
    }
  },
  near(x, z) { return this.grid.get(this.key(Math.floor(x / this.cell), Math.floor(z / this.cell))) || []; },
  // push a circle (radius r) out of colliders. returns [x,z]
  resolve(x, z, r) {
    for (let it = 0; it < 3; it++) {
      let moved = false;
      const seen = new Set();
      for (let ox = -1; ox <= 1; ox++) for (let oz = -1; oz <= 1; oz++) {
        const list = this.grid.get(this.key(Math.floor(x / this.cell) + ox, Math.floor(z / this.cell) + oz)); if (!list) continue;
        for (const o of list) {
          if (!o.on || seen.has(o)) continue; seen.add(o);
          if (o.box) {
            const cx = clamp(x, o.x0, o.x1), cz = clamp(z, o.z0, o.z1); const dx = x - cx, dz = z - cz; const d2 = dx * dx + dz * dz;
            if (d2 < r * r) {
              if (d2 > 1e-6) { const d = Math.sqrt(d2); x = cx + dx / d * r; z = cz + dz / d * r; }
              else { // inside box: push to nearest edge
                const l = x - o.x0, rr = o.x1 - x, t = z - o.z0, b = o.z1 - z; const m = Math.min(l, rr, t, b);
                if (m === l) x = o.x0 - r; else if (m === rr) x = o.x1 + r; else if (m === t) z = o.z0 - r; else z = o.z1 + r;
              }
              moved = true;
            }
          } else {
            const dx = x - o.x, dz = z - o.z; const rr = o.r + r; const d2 = dx * dx + dz * dz;
            if (d2 < rr * rr) { if (d2 < 1e-8) { x = o.x + rr; } else { const d = Math.sqrt(d2); x = o.x + dx / d * rr; z = o.z + dz / d * rr; } moved = true; }
          }
        }
      }
      if (!moved) break;
    }
    return [x, z];
  },
  blocked(x, z, r) { const p = this.resolve(x, z, r); return Math.abs(p[0] - x) > 0.01 || Math.abs(p[1] - z) > 0.01; }
};

function segDist(px, pz, ax, az, bx, bz) {
  const vx = bx - ax, vz = bz - az; const t = clamp(((px - ax) * vx + (pz - az) * vz) / (vx * vx + vz * vz), 0, 1);
  const dx = px - (ax + vx * t), dz = pz - (az + vz * t); return Math.sqrt(dx * dx + dz * dz);
}
const PATHS = [
  [[0, 30], [0, 12], [0, -4], [0, -40], [-2, -80], [0, -128]],
  [[0, -40], [36, -58], [74, -88]],
  [[0, -40], [-30, -70], [-48, -96]],
  [[0, 94], [2, 120], [0, 146]],
  [[34, 62], [90, 60], [148, 64]],
  [[-34, 62], [-60, 80], [-72, 112]],
  [[-60, 80], [-148, 70]],
  [[0, -128], [34, -122]]
];
function pathDist(x, z) { let m = 1e9; for (const p of PATHS) for (let i = 0; i < p.length - 1; i++) m = Math.min(m, segDist(x, z, p[i][0], p[i][1], p[i + 1][0], p[i + 1][1])); return m; }

function worldHeight(x, z) {
  let h = 0;
  const dr = Math.abs(z - (RIVER.z0 + RIVER.z1) / 2);
  if (dr < 8) h -= 1.4 * (1 - smooth(4.5, 8, dr));
  const ex = Math.max(Math.abs(x) - 152, z - 150, -z - 150);
  if (ex > 0) h += ex * 0.55 + vnoise(x * .05, z * .05) * ex * 0.5;
  if (z < -138) {
    const inGate = Math.abs(x) < 7;
    if (!inGate) h += Math.min(26, (-138 - z) * 2.6) + vnoise(x * .08, z * .08) * 4;
  }
  return h;
}
function smooth(a, b, x) { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }

const PAL = {
  grass: hexc('#7db457'), grass2: hexc('#5e9442'), forest: hexc('#4a8239'), forest2: hexc('#386a30'), dirt: hexc('#c49a62'), path: hexc('#d1ab73'),
  sand: hexc('#dccb92'), stone: hexc('#b3a385'), stone2: hexc('#9e8e70'), plaza: hexc('#c4b799'), rock: hexc('#8c8a80'), snow: hexc('#eef2f4'),
  trunk: hexc('#7a5536'), leaf: hexc('#4f9a3f'), leaf2: hexc('#3e8236'), pine: hexc('#2f6e45'), pine2: hexc('#3a7d4e'), wall: hexc('#b9b0a2'), wallTop: hexc('#9d9488'),
  roofR: hexc('#b5563f'), roofB: hexc('#3f6f8f'), roofT: hexc('#3f8f7f'), roofP: hexc('#8a4f86'), plaster: hexc('#efe4cf'), plaster2: hexc('#f3d9b6'), plaster3: hexc('#dfe6e2'),
  wood: hexc('#8a6240'), wood2: hexc('#6d4a2f'), dark: hexc('#3a3029'), water: hexc('#3c8fc4'), cloth1: hexc('#d4483b'), cloth2: hexc('#f2e6c8'), cloth3: hexc('#3e7cc0'), gold: hexc('#e2b54a'),
  dstone: hexc('#4a4558'), dstone2: hexc('#3b3748'), dfloor: hexc('#57526a'), cry1: hexc('#6fe0f0'), cry2: hexc('#b07cf0')
};
{ const T = { bark: ['trunk'], leaves: ['leaf', 'leaf2', 'pine', 'pine2'], plaster: ['wall', 'wallTop', 'plaster', 'plaster2', 'plaster3'], tiles: ['roofR', 'roofB', 'roofT', 'roofP'], planks: ['wood', 'wood2'], cobble: ['stone', 'stone2', 'plaza'], rough: ['rock', 'dstone', 'dstone2', 'dfloor', 'dirt', 'path', 'snow'], sand: ['sand'], cloth: ['cloth1', 'cloth2', 'cloth3'], grass: ['grass', 'grass2', 'forest', 'forest2'], water: ['water'] }; for (const t in T) for (const k of T[t]) tagTex(PAL[k], t); }

function groundColor(x, z, h) {
  const n = vnoise(x * .08, z * .08), n2 = vnoise(x * .31 + 9, z * .31);
  let c;
  if (z < -12) c = mixc(PAL.forest, PAL.forest2, n);
  else c = mixc(PAL.grass, PAL.grass2, n);
  if (z < -12 && z > -20) c = mixc(c, PAL.grass2, (z + 20) / 8);
  if (z < -112) c = mixc(c, hexc('#7d8a6a'), clamp((-112 - z) / 20, 0, .8));
  const n3 = vnoise(x * .022 + 40, z * .022 - 7);
  c = mixc(c, z < -12 ? hexc('#2f5a2c') : hexc('#9cc25e'), clamp((n3 - .45) * 1.2, 0, .45));
  if (n2 > .78) c = mixc(c, z < -12 ? hexc('#6b5a3a') : hexc('#b3c867'), .45);
  const dr = Math.abs(z - 4);
  if (dr < 9) c = mixc(c, PAL.sand, 1 - smooth(6, 9, dr));
  if (h < -0.5) c = mixc(PAL.sand, hexc('#6f8a7a'), clamp(-h - .5, 0, 1));
  const pd = pathDist(x, z); if (pd < 3.2) c = mixc(c, PAL.path, (1 - smooth(1.8, 3.2, pd)) * .9);
  const td = Math.hypot(x - TOWN.x, z - TOWN.z);
  if (td < TOWN.r + 1) { const cb = ((Math.floor(x / 2) + Math.floor(z / 2)) & 1) ? PAL.stone : PAL.stone2; c = mixc(cb, PAL.plaza, td < 13 ? .7 : 0); }
  if (h > 1) { c = mixc(c, PAL.rock, clamp(h / 6, 0, 1)); if (h > 16) c = mixc(c, PAL.snow, clamp((h - 16) / 6, 0, 1)); }
  return c;
}

function groundTex(x, z, h) {
  if (Math.hypot(x - TOWN.x, z - TOWN.z) < TOWN.r + 1) return 'cobble';
  if (h > 2.5) return 'rough'; if (h < -0.5 || Math.abs(z - 4) < 7) return 'sand';
  if (pathDist(x, z) < 2.4) return 'rough';
  return 'grass';
}
function buildGround(g) {
  const S = 4, X0 = -224, X1 = 224, Z0 = -224, Z1 = 224;
  const nx = (X1 - X0) / S, nz = (Z1 - Z0) / S;
  const H = [], C = [];
  for (let i = 0; i <= nx; i++) { H[i] = []; C[i] = []; for (let j = 0; j <= nz; j++) { const x = X0 + i * S, z = Z0 + j * S; const h = worldHeight(x, z); H[i][j] = h; const c = groundColor(x, z, h); C[i][j] = [c[0], c[1], c[2]]; } }
  g.jit = 0.02; g.uvs = .5; const keepTex = g.tex;
  const gg = new Geo(5); gg.jit = .02; gg.uvs = .5;
  for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) {
    const x0 = X0 + i * S, z0 = Z0 + j * S, x1 = x0 + S, z1 = z0 + S;
    const a = [x0, H[i][j], z0], b = [x1, H[i + 1][j], z0], c = [x1, H[i + 1][j + 1], z1], d = [x0, H[i][j + 1], z1];
    const ca = C[i][j], cb = C[i + 1][j], cc = C[i + 1][j + 1], cd = C[i][j + 1];
    gg.tex = groundTex(x0 + S / 2, z0 + S / 2, (H[i][j] + H[i + 1][j + 1]) / 2);
    gg.triC(d, c, b, cd, cc, cb); gg.triC(d, b, a, cd, cb, ca);
  }
  gg.smoothNormals(80); for (let k = 0; k < gg.d.length; k++) g.d.push(gg.d[k]);
  g.jit = 0.05; g.uvs = 1; g.tex = keepTex;
}

function addTree(g, x, z, kind, s, rng) {
  if (kind === 'pine') {
    g.cyl(x, 0, z, .32 * s, .24 * s, 1.4 * s, 5, PAL.trunk);
    const c = rng() < .5 ? PAL.pine : PAL.pine2;
    g.cyl(x, 1.0 * s, z, 1.9 * s, 0, 2.6 * s, 7, c); g.cyl(x, 2.4 * s, z, 1.5 * s, 0, 2.2 * s, 7, shade(c, 1.08)); g.cyl(x, 3.6 * s, z, 1.0 * s, 0, 1.8 * s, 6, shade(c, 1.15));
  } else {
    g.cyl(x, 0, z, .35 * s, .25 * s, 2.0 * s, 5, PAL.trunk);
    const c = rng() < .5 ? PAL.leaf : PAL.leaf2;
    g.sphere(x, 2.9 * s, z, 1.6 * s, c, 7, 5, .9); g.sphere(x + .7 * s, 2.5 * s, z + .4 * s, 1.0 * s, shade(c, 1.1), 6, 4); g.sphere(x - .6 * s, 2.6 * s, z - .5 * s, 1.1 * s, shade(c, .92), 6, 4);
  }
  Col.addCircle(x, z, .55 * s + .2, 'tree');
}

function addHouse(g, x, z, ry, w, d, wallC, roofC, rng) {
  const h = 3.2 + rng() * 1.2;
  g.at(x, 0, z, ry);
  g.box(0, .2, 0, w + .4, .4, d + .4, PAL.stone2);
  g.box(0, h / 2 + .3, 0, w, h, d, wallC);
  // timber beams
  g.box(0, h + .3, d / 2 + .02, w + .1, .25, .12, PAL.wood2); g.box(-w / 2, h / 2 + .3, d / 2 + .02, .25, h, .12, PAL.wood2); g.box(w / 2, h / 2 + .3, d / 2 + .02, .25, h, .12, PAL.wood2);
  g.roof(0, h + .3, 0, w + 1.0, 2.2 + rng() * .6, d + 1.2, roofC, shade(wallC, .9));
  g.box(0, 1.1, d / 2 + .05, 1.2, 1.9, .15, PAL.wood); // door
  g.box(0, 1.1, d / 2 + .1, .15, .15, .1, PAL.gold);
  for (const sx of [-1, 1]) { g.box(sx * w * .3, h * .6 + .3, d / 2 + .05, .9, .8, .1, hexc('#5a7fa0')); g.box(sx * w * .3, h * .6 - .15, d / 2 + .15, 1.1, .2, .3, PAL.wood2); g.box(sx * w * .3, h * .6 - .02, d / 2 + .2, .9, .2, .2, rng() < .5 ? hexc('#e86a8a') : hexc('#f2c84b')); }
  g.box(w * .28, h + 2.0, -d * .15, .6, 1.8, .6, PAL.stone2); // chimney
  g.reset();
  Col.addCircle(x, z, Math.max(w, d) * .55, 'house');
}

function buildTown(g, rng) {
  const cx = TOWN.x, cz = TOWN.z, R = TOWN.r;
  // walls with 4 gates (angles where gaps are)
  const gates = [-Math.PI / 2, 0, Math.PI / 2, Math.PI]; // angle measured atan2(dz,dx)
  const gapA = 0.13;
  const segs = 72;
  for (let i = 0; i < segs; i++) {
    const a0 = i / segs * TAU, a1 = (i + 1) / segs * TAU, am = (a0 + a1) / 2;
    if (gates.some(gA => Math.abs(angWrap(am - gA)) < gapA)) continue;
    const x = cx + Math.cos(am) * R, z = cz + Math.sin(am) * R; const len = TAU * R / segs + .15;
    g.at(x, 0, z, -am + Math.PI / 2); g.box(0, 2.2, 0, len, 4.4, 1.4, PAL.wall, PAL.wallTop);
    if (i % 2 === 0) g.box(0, 4.8, 0, len * .5, .8, 1.5, PAL.wallTop);
    g.reset();
    Col.addCircle(x, z, 1.5, 'wall');
  }
  // gate towers
  for (const gA of gates) for (const s of [-1, 1]) {
    const a = gA + s * (gapA + .03); const x = cx + Math.cos(a) * R, z = cz + Math.sin(a) * R;
    g.cyl(x, 0, z, 2.0, 1.8, 6.5, 8, PAL.wall, PAL.wallTop); g.cyl(x, 6.5, z, 2.5, 0, 3.2, 8, PAL.roofB);
    g.cyl(x, 9.5, z, .08, .08, 2.2, 4, PAL.wood2); g.at(x + .5, 11, z, 0); g.box(0, 0, 0, 1.0, .6, .05, PAL.cloth1); g.reset();
    Col.addCircle(x, z, 2.1, 'wall');
  }
  // plaza fountain
  g.cyl(cx, 0, cz, 4.4, 4.4, .7, 14, PAL.stone2, PAL.stone); g.cyl(cx, .7, cz, 1.0, .8, 1.8, 8, PAL.stone); g.cyl(cx, 2.5, cz, 1.9, 1.9, .3, 10, PAL.stone2);
  g.cyl(cx, 2.8, cz, .35, .25, 1.4, 6, PAL.stone); g.sphere(cx, 4.5, cz, .5, PAL.gold, 6, 4);
  Col.addCircle(cx, cz, 4.4, 'fountain');
  // houses around plaza
  const roofs = [PAL.roofR, PAL.roofB, PAL.roofT, PAL.roofP, PAL.roofR, PAL.roofT];
  const walls = [PAL.plaster, PAL.plaster2, PAL.plaster3];
  const angs = [30, 58, 122, 150, 212, 238, 302, 328];
  angs.forEach((deg, i) => {
    const a = deg * Math.PI / 180; const rr = 23 + (i % 2) * 2;
    const x = cx + Math.cos(a) * rr, z = cz + Math.sin(a) * rr;
    const ry = Math.atan2(cx - x, cz - z);
    if (deg === 150) { // clock tower landmark
      g.cyl(x, 0, z, 3.4, 3.0, 15, 8, PAL.plaster3, PAL.wallTop); g.cyl(x, 15, z, 3.6, 3.6, .6, 8, PAL.wallTop); g.cyl(x, 15.6, z, 3.3, 0, 6, 8, PAL.roofB);
      g.at(x, 11.5, z, ry); g.box(0, 0, 3.1, 2.6, 2.6, .2, hexc('#f4efe2')); g.box(0, .45, 3.25, .16, .9, .06, PAL.dark); g.box(.3, 0, 3.25, .6, .14, .06, PAL.dark); g.box(0, 0, 3.0, 3.0, 3.0, .15, PAL.gold); g.reset();
      Col.addCircle(x, z, 3.6, 'house'); return;
    }
    addHouse(g, x, z, ry, 6 + rng() * 1.5, 5 + rng(), walls[i % 3], roofs[i % roofs.length], rng);
  });
  // market stalls near shops
  const stall = (x, z, ry, c) => {
    g.at(x, 0, z, ry);
    g.box(0, .6, 0, 3.2, 1.2, 1.4, PAL.wood); g.box(0, 1.25, 0, 3.0, .1, 1.2, PAL.wood2);
    for (const sx of [-1.45, 1.45]) g.box(sx, 1.4, -.6, .15, 2.8, .15, PAL.wood2);
    for (let k = 0; k < 6; k++) g.box(-1.5 + k * .55 + .27, 2.7, -.1, .55, .12, 1.8, k % 2 ? PAL.cloth2 : c);
    g.box(-.8, 1.45, 0, .5, .35, .5, PAL.gold); g.box(.2, 1.45, .1, .4, .4, .4, hexc('#7fae4e')); g.box(.9, 1.45, -.1, .5, .3, .5, hexc('#d86040'));
    g.reset(); Col.addCircle(x, z, 1.7, 'stall');
  };
  stall(17.5, 66.5, -Math.PI / 2 + .1, PAL.cloth1); stall(-17.5, 68.5, Math.PI / 2 - .1, PAL.cloth3);
  // barrels & crates, lamp posts
  const props = [[20, 60], [-20, 63], [9, 44], [-9, 82], [24, 72], [-24, 56]];
  props.forEach(([x, z], i) => { if (i % 2) { g.cyl(x, 0, z, .55, .55, 1.1, 8, PAL.wood); g.cyl(x, 1.1, z, .5, .5, .05, 8, PAL.wood2); } else g.box(x, .5, z, 1, 1, 1, PAL.wood2); Col.addCircle(x, z, .7, 'prop'); });
  for (let i = 0; i < 8; i++) {
    const a = i / 8 * TAU + .2; const x = cx + Math.cos(a) * 9, z = cz + Math.sin(a) * 9;
    g.cyl(x, 0, z, .14, .1, 3.2, 5, PAL.dark); g.box(x, 3.35, z, .5, .5, .5, hexc('#f6d27a')); g.cyl(x, 3.6, z, .4, 0, .4, 4, PAL.dark);
    Col.addCircle(x, z, .3, 'lamp');
  }
  // few trees and flower beds inside town
  [[-26, 44], [26, 44], [-28, 80], [28, 82]].forEach(([x, z]) => addTree(g, x, z, 'round', .9, rng));
  for (let i = 0; i < 14; i++) { const a = i / 14 * TAU; g.box(cx + Math.cos(a) * 5.2, .25, cz + Math.sin(a) * 5.2, .9, .5, .9, i % 2 ? hexc('#e86a8a') : hexc('#f2c84b')); }
  // banners at north gate
  for (const s of [-1, 1]) { g.cyl(s * 6, 0, 26, .12, .12, 6, 5, PAL.wood2); g.box(s * 6, 4.6, 26.2, 1.4, 2.4, .08, PAL.cloth3); g.box(s * 6, 4.6, 26.25, .5, .5, .05, PAL.gold); }
}

function buildBridge(g) {
  g.box(0, -.18, 4, 8.2, .36, 18, PAL.wood);
  for (let i = 0; i < 18; i++) g.box(0, .01, -4.5 + i, 8, .04, .12, PAL.wood2);
  for (const s of [-1, 1]) {
    g.box(s * 4, .9, 4, .25, .2, 18, PAL.wood2);
    for (let i = 0; i < 7; i++) g.box(s * 4, .45, -4.5 + i * 3, .3, .9, .3, PAL.wood2);
    g.box(s * 4, -1.2, 0, .6, 2.2, .6, PAL.wood2); g.box(s * 4, -1.2, 8, .6, 2.2, .6, PAL.wood2);
  }
  Col.addBox(-150, -1.2, -4.4, 9.2, 'river'); Col.addBox(4.4, -1.2, 150, 9.2, 'river');
  Col.addBox(-4.6, -5, -3.9, 13, 'rail'); Col.addBox(3.9, -5, 4.6, 13, 'rail');
}

function buildCamp(g, x, z) {
  g.at(x + 4, 0, z - 4, .5); g.cyl(0, 0, 0, 2.6, 0, 3.0, 6, hexc('#c9a36b')); g.box(0, .9, 2.0, .9, 1.6, .2, PAL.dark); g.reset();
  Col.addCircle(x + 4, z - 4, 2.4, 'tent');
  for (let i = 0; i < 5; i++) { const a = i / 5 * TAU; g.at(x, .15, z, a, 1, 1, 1, Math.PI / 2); g.cyl(0, -0.6, 0, .15, .15, 1.2, 5, PAL.trunk); g.reset(); }
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; g.rock(x + Math.cos(a) * 1.1, 0, z + Math.sin(a) * 1.1, .3, PAL.rock); }
  g.box(x - 3, .45, z + 2, .9, .9, .9, PAL.wood2); g.cyl(x - 4.2, 0, z + 2.6, .45, .45, 1, 7, PAL.wood);
  Col.addCircle(x, z, 1.3, 'fire');
}

function buildGoblinCamp(g, x, z, rng) {
  for (let i = 0; i < 30; i++) {
    const a = i / 30 * TAU; if (Math.abs(angWrap(a - Math.PI)) < .35) continue;
    const px = x + Math.cos(a) * 15, pz = z + Math.sin(a) * 15; g.cyl(px, 0, pz, .45, .4, 3 + rng() * .8, 5, PAL.wood2); g.cyl(px, 3.5, pz, .4, 0, .8, 5, PAL.wood);
    Col.addCircle(px, pz, .6, 'pal');
  }
  const tents = [[-6, -6], [6, -5], [5, 7], [-5, 6]];
  tents.forEach(([dx, dz], i) => { g.cyl(x + dx, 0, z + dz, 2.4, 0, 3.4, 5, i % 2 ? hexc('#6e5a3c') : hexc('#5a6b3c')); g.cyl(x + dx, 3.2, z + dz, .1, .1, 1.2, 4, PAL.wood2); Col.addCircle(x + dx, z + dz, 2.2, 'tent'); });
  for (const [dx, dz] of [[-9, 0], [9, 1], [0, -10]]) {
    g.cyl(x + dx, 0, z + dz, .35, .3, 3.2, 5, PAL.wood); g.sphere(x + dx, 3.4, z + dz, .6, hexc('#c4b38a'), 5, 4); g.box(x + dx, 2.6, z + dz, 1.4, .2, .2, PAL.cloth1);
    Col.addCircle(x + dx, z + dz, .5, 'totem');
  }
}

function buildShrineBase(g, x, z, col) {
  g.cyl(x, 0, z, 3.4, 3.4, .35, 8, PAL.stone2, PAL.stone); g.cyl(x, .35, z, 2.6, 2.6, .35, 8, PAL.stone, PAL.plaza);
  for (let i = 0; i < 4; i++) { const a = i / 4 * TAU + Math.PI / 4; const px = x + Math.cos(a) * 2.2, pz = z + Math.sin(a) * 2.2; g.box(px, 1.9, pz, .5, 3.2, .5, PAL.plaster3); g.box(px, 3.6, pz, .8, .3, .8, col); }
  Col.addCircle(x, z, 1.2, 'shrine');
}
function buildWarpBase(g, x, z) {
  g.cyl(x, 0, z, 2.2, 2.2, .25, 10, hexc('#8fa7b8'), hexc('#c9d8e2'));
  for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; g.box(x + Math.cos(a) * 2.0, .45, z + Math.sin(a) * 2.0, .35, .5, .35, hexc('#6c8ca8')); }
  Col.addCircle(x, z, .9, 'warp');
}

function buildDungeonGate(g) {
  // cliff wall boxes
  Col.addBox(-152, -150, -5.2, -136.5, 'cliff'); Col.addBox(5.2, -150, 152, -136.5, 'cliff');
  for (const s of [-1, 1]) {
    g.box(s * 6.2, 4.5, -137, 2.4, 9, 2.4, PAL.rock); g.box(s * 6.2, 9.2, -137, 3, .8, 3, hexc('#76746c'));
    g.cyl(s * 6.2, 9.6, -137, 1.2, .3, 1.5, 5, PAL.cry1);
  }
  g.box(0, 9.6, -137, 15.5, 1.6, 2.6, hexc('#76746c'));
  g.box(0, 5, -140.5, 9, 10, .5, hexc('#1a1622'));
  for (let i = 0; i < 18; i++) g.rock(-24 + rand(0, 48), 0, -134 - rand(0, 4), rand(.6, 1.6), PAL.rock);
}

/* ---------- Dungeon ---------- */
function roomWalls(g, x0, x1, z0, z1, gaps) {
  const T = 2.4, H = 4.2;
  const wallC = PAL.dstone, top = PAL.dstone2;
  const side = (ax, az, bx, bz, gp) => {
    // horizontal (along x) if az===bz
    const horiz = az === bz; const a = horiz ? ax : az, b = horiz ? bx : bz; const segs = [];
    let cur = a; for (const [ga, gb] of (gp || []).sort((p, q) => p[0] - q[0])) { if (ga > cur) segs.push([cur, ga]); cur = gb; } if (cur < b) segs.push([cur, b]);
    for (const [s0, s1] of segs) {
      if (horiz) { g.box((s0 + s1) / 2, H / 2, az, s1 - s0 + T, H, T, wallC, top); Col.addBox(s0 - T / 2, az - T / 2, s1 + T / 2, az + T / 2, 'dwall'); }
      else { g.box(ax, H / 2, (s0 + s1) / 2, T, H, s1 - s0 + T, wallC, top); Col.addBox(ax - T / 2, s0 - T / 2, ax + T / 2, s1 + T / 2, 'dwall'); }
    }
  };
  side(x0, z0, x1, z0, gaps.n); side(x0, z1, x1, z1, gaps.s); side(x0, z0, x0, z1, gaps.w); side(x1, z0, x1, z1, gaps.e);
}

function buildDungeon(g, glowA, glowB, rng) {
  // floor
  g.jit = .08;
  for (let x = 960; x < 1040; x += 4) for (let z = -132; z < 18; z += 4) {
    const c = ((x / 4 + z / 4) & 1) ? PAL.dfloor : shade(PAL.dfloor, .9);
    g.quad([x, 0, z + 4], [x + 4, 0, z + 4], [x + 4, 0, z], [x, 0, z], mixc(c, PAL.dstone2, vnoise(x * .1, z * .1) * .5));
  }
  g.jit = .05;
  roomWalls(g, DX - 12, DX + 12, -8, 12, { n: [[DX - 4, DX + 4]] });
  roomWalls(g, DX - 4, DX + 4, -24, -8, { n: [[DX - 4, DX + 4]], s: [[DX - 4, DX + 4]] });
  roomWalls(g, DX - 24, DX + 24, -62, -24, { s: [[DX - 4, DX + 4]], n: [[DX - 4, DX + 4]] });
  roomWalls(g, DX - 4, DX + 4, -77, -62, { n: [[DX - 4, DX + 4]], s: [[DX - 4, DX + 4]] });
  // boss arena ring
  const AC = { x: DX, z: -100, r: 24 }; const segs = 40;
  for (let i = 0; i < segs; i++) {
    const a = (i + .5) / segs * TAU; if (Math.abs(angWrap(a - Math.PI / 2)) < .17) continue; // opening to south (toward +z)
    const x = AC.x + Math.cos(a) * (AC.r + 1.2), z = AC.z + Math.sin(a) * (AC.r + 1.2);
    g.at(x, 0, z, -a + Math.PI / 2); g.box(0, 2.1, 0, TAU * AC.r / segs + .6, 4.2, 2.4, PAL.dstone, PAL.dstone2); g.reset();
    Col.addCircle(x, z, 2.0, 'dwall');
  }
  // fill outside arena between corridor and ring
  Col.addBox(DX - 30, -78.5, DX - 4.8, -76, 'dwall'); Col.addBox(DX + 4.8, -78.5, DX + 30, -76, 'dwall');
  // arena dais and crystal pillars
  g.cyl(AC.x, 0, AC.z, 9, 9, .3, 16, PAL.dstone2, hexc('#62607a'));
  for (let i = 0; i < 8; i++) {
    const a = i / 8 * TAU + .2; const x = AC.x + Math.cos(a) * 18, z = AC.z + Math.sin(a) * 18;
    g.cyl(x, 0, z, 1.2, 1.0, 1.2, 6, PAL.dstone2);
    (i % 2 ? glowA : glowB).cyl(x, 1.2, z, .9, 0, 4.5 + rng() * 2, 5, i % 2 ? PAL.cry1 : PAL.cry2);
    Col.addCircle(x, z, 1.3, 'pillar');
  }
  // hall pillars
  for (const [px, pz] of [[-12, -34], [12, -34], [-12, -52], [12, -52]]) {
    g.cyl(DX + px, 0, pz, 1.3, 1.1, 5, 8, hexc('#5c566c'), PAL.dstone2); g.cyl(DX + px, 0, pz, 1.7, 1.7, .5, 8, PAL.dstone2);
    Col.addCircle(DX + px, pz, 1.5, 'pillar');
  }
  // crystal clusters along walls
  const cluster = (x, z, n, gg, col) => { for (let i = 0; i < n; i++) { const a = rng() * TAU, r = rng() * 1.2; gg.at(x + Math.cos(a) * r, 0, z + Math.sin(a) * r, rng() * TAU, 1, 1, 1, (rng() - .5) * .6, (rng() - .5) * .6); gg.cyl(0, 0, 0, .35 + rng() * .3, 0, 1.4 + rng() * 2.2, 5, col); gg.reset(); } };
  [[-9, 8], [9, -5], [-21, -28], [21, -58], [-21, -58], [21, -30], [-15, -118], [15, -118], [-20, -90], [20, -88]].forEach(([dx, z], i) => cluster(DX + dx, z, 5, i % 2 ? glowA : glowB, i % 2 ? PAL.cry1 : PAL.cry2));
  // rubble & bones
  for (let i = 0; i < 30; i++) { const x = DX + rand(-22, 22), z = rand(-60, -26); if (Math.abs(x - DX) < 5) continue; g.rock(x, 0, z, rand(.3, .8), hexc('#5a566a')); }
  // entry portal frame
  g.box(DX - 3.2, 3, 11, .9, 6, .9, hexc('#5c566c')); g.box(DX + 3.2, 3, 11, .9, 6, .9, hexc('#5c566c')); g.box(DX, 6.2, 11, 7.4, .9, .9, hexc('#5c566c'));
}

const World = {
  meshes: {}, objs: [], spawns: [], lights: [], fires: [],
  build(R) {
    const rng = mulberry32(1337);
    const g = new Geo(11);
    buildGround(g);
    buildTown(g, rng);
    buildBridge(g);
    buildCamp(g, 0, -40);
    buildGoblinCamp(g, 74, -88, rng);
    buildDungeonGate(g);
    SHRINES.forEach(s => { if (s.zone === 'world') buildShrineBase(g, s.x, s.z, hexc(BUFFS[s.buff].col)); });
    WARPS.forEach(w => buildWarpBase(g, w.x, w.z));
    // forest & meadow trees
    const tryTree = (x, z, kind, s) => {
      if (Math.abs(x) > 150 || z > 146 || z < -134) return false;
      if (Math.abs(z - 4) < 10) return false;
      if (Math.hypot(x - TOWN.x, z - TOWN.z) < TOWN.r + 5) return false;
      if (pathDist(x, z) < 4.5) return false;
      if (Math.hypot(x - 74, z + 88) < 18) return false;
      if (Math.hypot(x, z + 40) < 12) return false;
      for (const s2 of SHRINES) if (Math.hypot(x - s2.x, z - s2.z) < 7) return false;
      for (const w of WARPS) if (Math.hypot(x - w.x, z - w.z) < 6) return false;
      if (Col.blocked(x, z, 1.6)) return false;
      addTree(g, x, z, kind, s, rng); return true;
    };
    let placed = 0;
    for (let i = 0; i < 2600 && placed < 520; i++) { const x = rng() * 300 - 150, z = -14 - rng() * 120; const n = vnoise(x * .05, z * .05); if (n < .3) continue; if (tryTree(x, z, rng() < .6 ? 'pine' : 'round', .85 + rng() * .6)) placed++; }
    placed = 0;
    for (let i = 0; i < 1500 && placed < 90; i++) { const x = rng() * 300 - 150, z = 14 + rng() * 132; const n = vnoise(x * .04 + 3, z * .04); if (n < .62) continue; if (tryTree(x, z, rng() < .3 ? 'pine' : 'round', .8 + rng() * .5)) placed++; }
    // meadow rocks & flowers
    for (let i = 0; i < 160; i++) { const x = rng() * 296 - 148, z = rng() * 280 - 135; if (Math.abs(z - 4) < 9 || Math.hypot(x, z - 62) < 40 || pathDist(x, z) < 3) continue; if (i % 3 === 0) { if (!Col.blocked(x, z, 1.2)) { g.rock(x, 0, z, .5 + rng() * .9, PAL.rock); Col.addCircle(x, z, .7, 'rock'); } } else { const c = pick([hexc('#f2d34b'), hexc('#ffffff'), hexc('#e86a8a'), hexc('#9b7be0')]); for (let k = 0; k < 4; k++) g.box(x + rng() * 2, .15, z + rng() * 2, .22, .3, .22, c); } }
    // grass tufts and bushes
    const tuftC = [hexc('#5f9a42'), hexc('#6aa64a'), hexc('#4e8a3a')];
    for (let i = 0; i < 2200; i++) {
      const x = rng() * 296 - 148, z = rng() * 280 - 134; if (Math.abs(z - 4) < 9 || Math.hypot(x - TOWN.x, z - TOWN.z) < TOWN.r + 2 || pathDist(x, z) < 2.6) continue;
      const c = z < -12 ? shade(tuftC[i % 3], .8) : tuftC[i % 3]; const s0 = .5 + rng() * .5;
      for (let k = 0; k < 3; k++) g.cyl(x + (rng() - .5) * .6, 0, z + (rng() - .5) * .6, .12 * s0, 0, (.5 + rng() * .4) * s0, 3, c, null, true);
    }
    for (let i = 0; i < 180; i++) {
      const x = rng() * 296 - 148, z = rng() * 280 - 134; if (Math.abs(z - 4) < 10 || Math.hypot(x - TOWN.x, z - TOWN.z) < TOWN.r + 4 || pathDist(x, z) < 4) continue;
      if (Col.blocked(x, z, 1.4)) continue; const c = z < -12 ? hexc('#3d7a3a') : hexc('#5c9a44'); const r = .7 + rng() * .5;
      g.sphere(x, r * .55, z, r, c, 6, 4, .75); g.sphere(x + r * .6, r * .4, z + .2, r * .6, shade(c, 1.1), 5, 3, .75);
      Col.addCircle(x, z, r * .8, 'bush');
    }
    // Halloween pumpkins around town
    if (typeof eventOn === 'function' && eventOn()) {
      const pk = (x, z, s) => { g.sphere(x, .42 * s, z, .5 * s, hexc('#e8742a'), 9, 6, .8); g.cyl(x, .78 * s, z, .06 * s, .05 * s, .22 * s, 5, hexc('#4a6a2a')); g.push(x, .45 * s, z, 0, Math.atan2(TOWN.x - x, TOWN.z - z), 0); g.box(-.14 * s, .05 * s, .46 * s, .1 * s, .1 * s, .06, hexc('#ffd36b')); g.box(.14 * s, .05 * s, .46 * s, .1 * s, .1 * s, .06, hexc('#ffd36b')); g.box(0, -.13 * s, .46 * s, .3 * s, .06 * s, .06, hexc('#ffd36b')); g.pop(); Col.addCircle(x, z, .5 * s, 'pumpkin'); };
      for (let i = 0; i < 10; i++) { const a = i / 10 * TAU + .3; pk(TOWN.x + Math.cos(a) * 7.2, TOWN.z + Math.sin(a) * 7.2, .8 + (i % 3) * .2); }
      [[-5, 27], [5, 27], [-4, 97], [4, 97], [10, 46], [-10, 78], [16, 70], [-16, 64]].forEach(([x, z], i) => pk(x, z, 1 + (i % 2) * .4));
    }
    // mountains beyond the border
    const mt = (x, z, r, h) => { g.cyl(x, -1, z, r, 0, h, 7, mixc(PAL.rock, PAL.forest2, .35)); g.cyl(x, -1 + h * .62, z, r * .38, 0, h * .38, 7, PAL.snow); };
    for (let i = 0; i < 64; i++) { const a = i / 64 * TAU; const rr = 205 + rng() * 10; mt(Math.cos(a) * rr, Math.sin(a) * rr, 24 + rng() * 14, 26 + rng() * 26); }
    for (let i = 0; i < 26; i++) { const x = -150 + i * 12 + rng() * 4; if (Math.abs(x) < 12) continue; mt(x, -152 - rng() * 8, 10 + rng() * 6, 16 + rng() * 12); }
    // dungeon
    const ga = new Geo(21), gb = new Geo(22);
    buildDungeon(g, ga, gb, rng);
    this.meshes.static = R.mesh(g); this.meshes.glowA = R.mesh(ga); this.meshes.glowB = R.mesh(gb);
    // water
    const w = new Geo(3); w.jit = 0; w.quad([-224, -.45, RIVER.z1 + 1.5], [224, -.45, RIVER.z1 + 1.5], [224, -.45, RIVER.z0 - 1.5], [-224, -.45, RIVER.z0 - 1.5], PAL.water);
    w.cyl(TOWN.x, .45, TOWN.z, 4.0, 4.0, .1, 14, PAL.water, PAL.water, true); w.cyl(TOWN.x, 2.65, TOWN.z, 1.7, 1.7, .1, 10, PAL.water, PAL.water, true);
    this.meshes.water = R.mesh(w);
    this.buildDynamic(R);
    // lights
    this.lights = [
      { x: 0, y: 1.5, z: -40, r: 10, c: [1.2, .7, .3], zone: 'world' }, { x: 74, y: 1.5, z: -88, r: 12, c: [1.2, .6, .3], zone: 'world' },
      { x: DX - 10, y: 2.8, z: 0, r: 14, c: [1.1, .65, .3] }, { x: DX + 10, y: 2.8, z: 0, r: 14, c: [1.1, .65, .3] }, { x: DX, y: 2.8, z: -16, r: 12, c: [1.1, .65, .3] },
      { x: DX - 21, y: 2.8, z: -32, r: 16, c: [1.1, .65, .3] }, { x: DX + 21, y: 2.8, z: -32, r: 16, c: [1.1, .65, .3] }, { x: DX - 21, y: 2.8, z: -54, r: 16, c: [1.1, .65, .3] }, { x: DX + 21, y: 2.8, z: -54, r: 16, c: [1.1, .65, .3] },
      { x: DX, y: 2.8, z: -70, r: 12, c: [1.1, .65, .3] }, { x: DX - 16, y: 5, z: -112, r: 20, c: [.4, .8, 1.2] }, { x: DX + 16, y: 5, z: -112, r: 20, c: [.8, .5, 1.3] },
      { x: DX - 18, y: 5, z: -88, r: 20, c: [.8, .5, 1.3] }, { x: DX + 18, y: 5, z: -88, r: 20, c: [.4, .8, 1.2] }, { x: DX, y: 6, z: -100, r: 18, c: [.6, .6, 1.0] }
    ];
    this.lights.forEach(l => { if (!l.zone) l.zone = 'dungeon'; });
    this.fires = [{ x: 0, z: -40, zone: 'world', s: 1 }, { x: 74, z: -88, zone: 'world', s: 1.2 }];
    this.torches = this.lights.filter(l => l.zone === 'dungeon' && l.c[0] > 1).map(l => ({ x: l.x, y: l.y, z: l.z }));
    // dungeon torch geometry is dynamic-free: add to static via separate mesh
    const tg = new Geo(5);
    this.torches.forEach(t => { tg.cyl(t.x, 0, t.z, .45, .35, .3, 6, PAL.dstone2); tg.cyl(t.x, .3, t.z, .12, .16, t.y - .3, 5, PAL.wood2); tg.cyl(t.x, t.y - .1, t.z, .38, .24, .3, 6, PAL.dark); Col.addCircle(t.x, t.z, .45, 'torch'); });
    this.meshes.torches = R.mesh(tg);
  },
  buildDynamic(R) {
    // crystal for warp
    const cr = new Geo(9); cr.jit = .1; cr.cyl(0, 0, 0, .7, 0, 1.6, 6, hexc('#7fe6ff')); cr.at(0, 0, 0, 0, 1, 1, 1, Math.PI); cr.cyl(0, 0, 0, .7, 0, 1.2, 6, hexc('#5cc8ee')); cr.reset();
    this.meshes.crystal = R.mesh(cr);
    const orb = new Geo(4); orb.sphere(0, 0, 0, .7, [1, 1, 1], 8, 6); this.meshes.orb = R.mesh(orb);
    // barricade
    const b = new Geo(6);
    for (const s of [-1, 1]) { b.at(s * 1.8, 0, 0, 0, 1, 1, 1, 0, s * .5); b.box(0, 1.2, 0, .3, 2.8, .3, PAL.wood2); b.reset(); b.at(s * 1.8 + .3, 0, 0, 0, 1, 1, 1, 0, -s * .5); b.box(0, 1.2, 0, .3, 2.8, .3, PAL.wood2); b.reset(); }
    b.box(0, 1.5, 0, 8.6, .35, .3, PAL.wood); b.box(0, .8, 0, 8.6, .35, .3, PAL.wood);
    for (let i = 0; i < 4; i++) b.box(-3.2 + i * 2.13, 1.15, .17, .9, .3, .05, i % 2 ? PAL.cloth1 : PAL.cloth2);
    this.meshes.barricade = R.mesh(b);
    // portcullis
    const p = new Geo(7); for (let i = 0; i < 7; i++) p.box(-3.6 + i * 1.2, 4.5, 0, .25, 9, .25, hexc('#4a4a52')); for (let j = 0; j < 4; j++) p.box(0, 1.5 + j * 2.2, 0, 8.4, .25, .25, hexc('#4a4a52'));
    this.meshes.portcullis = R.mesh(p);
    // portal disc
    const pd = new Geo(8); pd.jit = 0; pd.at(0, 0, 0, 0, 1, 1, 1, Math.PI / 2); pd.cyl(0, -.05, 0, 3.1, 3.1, .1, 20, [1, 1, 1], [1, 1, 1]); pd.reset(); this.meshes.portal = R.mesh(pd);
    this.objs = [];
    WARPS.forEach(w => this.objs.push({ type: 'warp', ...w, mesh: this.meshes.crystal, emis: [.25, .55, .7] }));
    SHRINES.forEach(s => this.objs.push({ type: 'shrine', ...s, mesh: this.meshes.orb, col: hexc(BUFFS[s.buff].col) }));
    this.barricade = { type: 'barricade', zone: 'world', x: 0, z: 12.5, mesh: this.meshes.barricade, col: Col.addBox(-4.6, 11.8, 4.6, 13.2, 'barricade') };
    this.gate = { type: 'gate', zone: 'world', x: 0, z: -137.2, mesh: this.meshes.portcullis, lift: 0, col: Col.addBox(-5.2, -138.5, 5.2, -136, 'gate') };
    this.portalIn = { type: 'portal', zone: 'world', x: 0, z: -140.2, open: false };
    this.portalOut = { type: 'portal', zone: 'dungeon', x: DX, z: 11.2, open: true };
    this.objs.push(this.barricade, this.gate, this.portalIn, this.portalOut);
  },
  setUnlocks(bridgeOpen, gateOpen) {
    this.barricade.col.on = !bridgeOpen; this.barricade.hidden = bridgeOpen;
    this.gate.col.on = !gateOpen; this.gate.open = gateOpen; this.portalIn.open = gateOpen;
  },
  zoneOf(x) { return x > 500 ? 'dungeon' : 'world'; },
  clampBounds(e) {
    const b = BOUNDS[this.zoneOf(e.x)];
    e.x = clamp(e.x, b.x0, b.x1); e.z = clamp(e.z, b.z0, b.z1);
  },
  placeName(x, z) {
    if (x > 500) return z < -76 ? 'ลานผู้พิทักษ์ผลึก' : 'ถ้ำผลึกใต้พิภพ';
    if (Math.hypot(x - TOWN.x, z - TOWN.z) < TOWN.r) return 'เมืองหลวง Aurelion';
    if (z > 12) return 'ทุ่งหญ้าใบเขียว';
    if (z > -12) return 'แม่น้ำเงินยวง';
    if (Math.hypot(x - 74, z + 88) < 20) return 'ค่ายก็อบลิน';
    if (z < -112) return 'หุบผาผลึก';
    return 'ป่ากระซิบ';
  }
};

// Monster spawn groups
const SPAWNS = [
  ['slime', 42, 82, 22, 6], ['slime', -46, 92, 22, 6], ['slime', 2, 124, 20, 6], ['slime', 70, 34, 18, 4], ['slime', -30, 22, 12, 3],
  ['shroom', -78, 44, 18, 5], ['shroom', 60, 118, 18, 4], ['shroom', -92, 124, 18, 4], ['shroom', 96, 92, 16, 3], ['shroom', 30, 22, 10, 3],
  ['wolf', -60, -52, 20, 5], ['wolf', 40, -34, 16, 4], ['wolf', -28, -100, 16, 4], ['wolf', 100, -40, 16, 3], ['wolf', -105, -90, 16, 3],
  ['shroom', -100, -22, 16, 4], ['goblin', 74, -88, 10, 6], ['goblin', 112, -112, 12, 3],
  ['bat', DX, -38, 16, 3], ['skel', DX, -52, 14, 3], ['bat', DX, -16, 3, 1], ['skel', DX - 6, 2, 3, 1]
];

