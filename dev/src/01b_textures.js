/* ============================================================
   Procedural tileable detail textures (multiplied over vertex colours)
   ============================================================ */
const TEX_NAMES = ['grass', 'rough', 'cobble', 'planks', 'tiles', 'bark', 'leaves', 'plaster', 'water', 'cloth', 'metal', 'leather', 'brick', 'thatch', 'tuft', 'moss', 'sand', 'scales'];
TEX_NAMES.forEach((n, i) => TEXIDX[n] = i);
const TexGen = {
  size: 256, canv: {},
  // periodic value noise on a lattice of period P cells
  pn(x, y, P) {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi; const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const h = (a, b) => hash2(((a % P) + P) % P, ((b % P) + P) % P);
    return lerp(lerp(h(xi, yi), h(xi + 1, yi), u), lerp(h(xi, yi + 1), h(xi + 1, yi + 1), u), v);
  },
  fbm(x, y, P, oct = 4) { let a = 0, w = .5, s = 0, f = 1; for (let i = 0; i < oct; i++) { a += this.pn(x * f, y * f, P * f) * w; s += w; w *= .5; f *= 2; } return a / s; },
  make(name, fn) {
    const N = this.size; const cv = document.createElement('canvas'); cv.width = cv.height = N; const ctx = cv.getContext('2d'); const img = ctx.createImageData(N, N); const d = img.data;
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const o = (y * N + x) * 4; const c = fn(x / N, y / N, x, y); d[o] = clamp(c[0], 0, 1) * 255; d[o + 1] = clamp(c[1], 0, 1) * 255; d[o + 2] = clamp(c[2], 0, 1) * 255; d[o + 3] = (c[3] === undefined ? 1 : clamp(c[3], 0, 1)) * 255; }
    ctx.putImageData(img, 0, 0); this.canv[name] = cv; return cv;
  },
  gray(v, t) { return t ? [v * t[0], v * t[1], v * t[2]] : [v, v, v]; },
  build() {
    if (this._built) return; this._built = true; const T = this;
    // cells helper: jittered grid Voronoi (F1, F2, cell id)
    const vor = (u, v, n) => { const gx = u * n, gy = v * n; const ix = Math.floor(gx), iy = Math.floor(gy); let f1 = 9, f2 = 9, id = 0; for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) { const cx = ix + i, cy = iy + j; const wx = ((cx % n) + n) % n, wy = ((cy % n) + n) % n; const px = cx + .2 + hash2(wx, wy) * .6, py = cy + .2 + hash2(wy + 7, wx + 3) * .6; const d = Math.hypot(px - gx, py - gy); if (d < f1) { f2 = f1; f1 = d; id = wx * 31 + wy; } else if (d < f2) f2 = d; } return [f1, f2, id]; };
    T.make('grass', (u, v) => { const n = T.fbm(u * 6, v * 6, 6, 4); const blade = Math.pow(T.pn(u * 48, v * 9, 48), 2.5) * .35; const b2 = Math.pow(T.pn(u * 24 + 3, v * 40, 24), 3) * .25; const g = .72 + n * .3 + blade + b2; return [g * .97, g * 1.02, g * .9]; });
    T.make('rough', (u, v) => { const n = T.fbm(u * 5, v * 5, 5, 5); const sp = T.pn(u * 64, v * 64, 64) > .82 ? .12 : 0; const g = .7 + n * .35 + sp; return [g, g * .99, g * .96]; });
    T.make('sand', (u, v) => { const n = T.fbm(u * 8, v * 8, 8, 3); const rip = Math.sin((u * 10 + T.pn(u * 4, v * 4, 4) * 1.5) * TAU) * .04; const g = .8 + n * .18 + rip; return [g, g, g * .97]; });
    T.make('cobble', (u, v) => { const [f1, f2, id] = vor(u, v, 5); const edge = smoothstepF(0, .09, f2 - f1); const sh = .74 + hash2(id, 3) * .22 + T.fbm(u * 10, v * 10, 10, 3) * .14; const g = lerp(.42, sh, edge) * (1 - f1 * .18); return [g, g * .98, g * .95]; });
    T.make('planks', (u, v) => { const row = Math.floor(v * 4); const off = (row % 2) * .5; const px = (u + off) % 1; const seamV = Math.min(1, Math.abs(v * 4 - Math.round(v * 4)) * 22); const seamU = Math.min(1, Math.abs(px - Math.round(px)) * 24); const grain = T.pn(u * 3 + row * 7, v * 60, 60) * .25 + T.fbm(u * 2 + row, v * 12, 12, 2) * .2; const g = (.7 + grain) * Math.min(seamV, seamU) * .8 + .2; return [g, g * .95, g * .88]; });
    T.make('tiles', (u, v) => { const rows = 6; const r = Math.floor(v * rows); const off = (r % 2) * .5; const cx = (((u + off) * rows) % 1) - .5; const vy = (v * rows) % 1; const arc = Math.sqrt(Math.max(0, .25 - cx * cx)); const inTile = vy < .15 + arc * .7; const sh = inTile ? .75 + (vy * .6) + T.pn(u * 30, v * 30, 30) * .1 : .42; const edge = Math.abs(cx) > .47 ? .55 : 1; return [sh * edge, sh * edge * .97, sh * edge * .95]; });
    T.make('bark', (u, v) => { const n = T.fbm(u * 10, v * 2.5, 10, 4); const st = Math.pow(T.pn(u * 40, v * 3, 40), 1.6); const g = .55 + n * .35 + st * .25; return [g, g * .96, g * .9]; });
    T.make('leaves', (u, v) => { const [f1, f2, id] = vor(u, v, 7); const n = T.fbm(u * 8, v * 8, 8, 3); const blob = smoothstepF(.05, .25, f2 - f1); const g = .62 + hash2(id, 11) * .2 + n * .2 + blob * .12; return [g * .95, g * 1.04, g * .92]; });
    T.make('plaster', (u, v) => { const n = T.fbm(u * 12, v * 12, 12, 4); const g = .84 + n * .14; return [g, g, g * .98]; });
    T.make('water', (u, v) => { const w = Math.sin((u * 6 + v * 3) * TAU + T.pn(u * 5, v * 5, 5) * 3) * .5 + .5; const n = T.fbm(u * 6, v * 6, 6, 3); const g = .78 + w * .18 + n * .1; return [g * .95, g, g * 1.05]; });
    T.make('cloth', (u, v) => { const wv = (Math.sin(u * 128 * TAU) * .5 + .5) * .08 + (Math.sin(v * 128 * TAU) * .5 + .5) * .08; const n = T.fbm(u * 8, v * 8, 8, 2) * .08; return T.gray(.84 + wv + n); });
    T.make('metal', (u, v) => { const br = T.pn(u * 4, v * 200, 200) * .12; const sc = T.pn(u * 90, v * 90, 90) > .9 ? .1 : 0; const n = T.fbm(u * 3, v * 3, 3, 2) * .1; return T.gray(.8 + br + sc + n); });
    T.make('leather', (u, v) => { const [f1, f2] = vor(u, v, 14); const n = T.fbm(u * 10, v * 10, 10, 3); const g = .74 + n * .2 + smoothstepF(0, .25, f2 - f1) * .1; return [g, g * .97, g * .93]; });
    T.make('brick', (u, v) => { const rows = 8; const r = Math.floor(v * rows); const off = (r % 2) * .5; const bx = ((u + off) * 4) % 1; const by = (v * rows) % 1; const mortar = bx < .06 || by < .12; const n = T.fbm(u * 16, v * 16, 16, 3); const g = mortar ? .55 + n * .1 : .74 + n * .22 + hash2(Math.floor((u + off) * 4), r) * .1; return [g, g * .96, g * .92]; });
    T.make('thatch', (u, v) => { const s = Math.pow(T.pn(u * 70 + v * 20, v * 6, 70), 1.4); const n = T.fbm(u * 6, v * 6, 6, 3); const g = .6 + s * .4 + n * .12; return [g, g * .95, g * .8]; });
    T.make('moss', (u, v) => { const n = T.fbm(u * 7, v * 7, 7, 4); const m = smoothstepF(.45, .7, T.fbm(u * 3 + 5, v * 3, 3, 3)); const g = .72 + n * .3; return [g * lerp(1, .8, m), g * lerp(1, 1.06, m), g * lerp(.96, .72, m)]; });
    T.make('scales', (u, v) => { const rows = 10; const r = Math.floor(v * rows); const off = (r % 2) * .5; const cx = (((u + off) * rows) % 1) - .5; const vy = (v * rows) % 1; const d = Math.hypot(cx, vy - .55); const g = d < .5 ? .72 + (1 - d) * .25 : .5; return [g, g, g * .96]; });
    T.make('tuft', (u, v) => { // alpha cutout grass blades
      let a = 0, sh = 0; for (let i = 0; i < 7; i++) { const bx = .1 + i * .13 + hash2(i, 2) * .06; const w = .035 * (1 - v) + .004; const lean = (hash2(i, 5) - .5) * .25 * (1 - v); const h = .55 + hash2(i, 9) * .45; if (v > 1 - h && Math.abs(u - bx - lean * (1 - v) / h) < w) { a = 1; sh = Math.max(sh, .55 + hash2(i, 3) * .35 + (1 - v) * .2); } }
      return [sh * .95, sh * 1.05, sh * .8, a]; });
  },
  // GL textures for a renderer
  init(R) { this.build(); R.texs = TEX_NAMES.map(n => R.texRepeat(this.canv[n])); }
};
function smoothstepF(a, b, x) { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }
/* material tags on shared palettes */
function tagTex(col, tex) { if (col && !col.tex) col.tex = tex; return col; }

