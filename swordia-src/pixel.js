
/* ==========================================================================
   Pixel-art renderer (2.5D wuxia look): the world is drawn at 1/3 resolution
   on a low-res canvas and scaled up with nearest-neighbour, sprites are built
   procedurally with a dark outline, terrain is pre-rendered once per map.
   Names, HP bars, damage numbers and glow effects are drawn crisp on top.
   ========================================================================== */
const PX = {
  S: (typeof innerWidth !== 'undefined' && Math.min(innerWidth, innerHeight * 1.6) < 900) ? 2 : 3,
  cache: new Map(),
  hex(c) { const n = parseInt(c.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; },
  canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); x.imageSmoothingEnabled = false; return c; },
  // harden alpha, then add a 1px dark outline around opaque pixels
  finish(c, outline) {
    const x = c.getContext('2d'), w = c.width, h = c.height, im = x.getImageData(0, 0, w, h), d = im.data;
    for (let i = 3; i < d.length; i += 4) d[i] = d[i] >= 110 ? 255 : 0;
    if (outline) {
      const o = new Uint8ClampedArray(d), [r, g, b] = PX.hex(outline);
      for (let y = 0; y < h; y++) for (let xx = 0; xx < w; xx++) {
        const i = (y * w + xx) * 4; if (d[i + 3]) continue;
        const n = (xx > 0 && d[i - 1]) || (xx < w - 1 && d[i + 7]) || (y > 0 && d[i - w * 4 + 3]) || (y < h - 1 && d[i + w * 4 + 3]);
        if (n) { o[i] = r; o[i + 1] = g; o[i + 2] = b; o[i + 3] = 255; }
      }
      im.data.set(o);
    }
    x.putImageData(im, 0, 0); return c;
  },
  mk(key, w, h, fn, outline = '#2a1c1e') {
    let c = PX.cache.get(key); if (c) return c;
    c = PX.canvas(w, h); fn(c.getContext('2d'), w, h); PX.finish(c, outline); PX.cache.set(key, c); return c;
  },
  r(x, col, a, b, w, h) { x.fillStyle = col; x.fillRect(a, b, w, h); },
  e(x, col, cx, cy, rx, ry) { x.fillStyle = col; for (let yy = -ry; yy <= ry; yy++) { const k = rx * Math.sqrt(Math.max(0, 1 - (yy * yy) / (ry * ry + .25))); x.fillRect(Math.round(cx - k), Math.round(cy + yy), Math.max(1, Math.round(2 * k)), 1); } },
  poly(x, col, pts) { x.fillStyle = col; x.beginPath(); x.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length; i += 2) x.lineTo(pts[i], pts[i + 1]); x.closePath(); x.fill(); },
  line(x, col, x0, y0, x1, y1, w = 1) { x.fillStyle = col; const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1; for (let i = 0; i <= n; i++) { const t = i / n; x.fillRect(Math.round(x0 + (x1 - x0) * t - (w - 1) / 2), Math.round(y0 + (y1 - y0) * t - (w - 1) / 2), w, w); } },
  extraProps: {},
  rnd(seed) { let s = seed >>> 0 || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; },

  /* ---------------- characters ---------------- */
  // swordsman, facing right. kind: idle|walk|atk|hurt  f: frame
  hero(kind, f) {
    return PX.mk('hero_' + kind + f, 58, 52, (x) => {
      const R = PX.r, E = PX.e, ox = 2;
      const step = kind === 'walk' ? [-2, 0, 2, 0][f] : 0, lift = kind === 'walk' ? [0, 1, 0, 1][f] : 0, bob = kind === 'idle' ? f : lift;
      const wave = [0, 1, 2, 1][(f + (kind === 'walk' ? 0 : 1)) % 4];
      // scarf trailing behind
      PX.poly(x, '#c4303c', [ox + 20, 23 + bob, ox + 9, 22 + wave + bob, ox + 2, 17 + wave * 2 + bob, ox + 5, 26 + wave + bob, ox + 12, 28 + bob, ox + 20, 27 + bob]);
      PX.poly(x, '#8e1c2a', [ox + 9, 25 + wave + bob, ox + 3, 21 + wave * 2 + bob, ox + 6, 26 + wave + bob]);
      // legs
      R(x, '#24212a', ox + 18 - step, 37, 4, 7 - (step < 0 ? lift : 0)); R(x, '#3b2a24', ox + 17 - step, 43 - (step < 0 ? lift : 0), 6, 3);
      R(x, '#2c2934', ox + 23 + step, 37, 4, 7 - (step > 0 ? lift : 0)); R(x, '#46322a', ox + 23 + step, 43 - (step > 0 ? lift : 0), 6, 3);
      // coat skirt
      PX.poly(x, '#34323e', [ox + 15, 31 + bob, ox + 30, 31 + bob, ox + 32, 39 + bob, ox + 13, 39 + bob]);
      R(x, '#ebe5da', ox + 21, 32 + bob, 4, 6); R(x, '#d4cdbf', ox + 21, 37 + bob, 4, 1);
      // back arm
      R(x, '#2b2933', ox + 15, 23 + bob, 3, 8); R(x, '#f2cfb0', ox + 15, 30 + bob, 3, 2);
      // torso
      R(x, '#3a3846', ox + 16, 21 + bob, 13, 11); R(x, '#4a4858', ox + 17, 21 + bob, 3, 10);
      PX.poly(x, '#efe9de', [ox + 20, 21 + bob, ox + 27, 21 + bob, ox + 23, 28 + bob]);
      R(x, '#c4303c', ox + 15, 30 + bob, 15, 3); R(x, '#e8c25a', ox + 24, 30 + bob, 2, 3);
      // scarf around neck
      R(x, '#d23a46', ox + 17, 19 + bob, 12, 3); R(x, '#a62634', ox + 17, 21 + bob, 12, 1);
      // head
      const hy = 11 + bob;
      E(x, '#1d1a22', ox + 21, hy - 1, 10, 9);                     // hair mass
      E(x, '#f6d8bd', ox + 24, hy + 3, 7, 6);                      // face
      R(x, '#f6d8bd', ox + 18, hy + 2, 6, 6);
      PX.poly(x, '#1d1a22', [ox + 15, hy - 5, ox + 31, hy - 4, ox + 31, hy, ox + 28, hy - 1, ox + 26, hy + 2, ox + 24, hy - 1, ox + 21, hy + 1, ox + 19, hy - 2, ox + 15, hy + 2]);
      R(x, '#3a3442', ox + 19, hy - 7, 6, 2);                      // hair shine
      // topknot + ponytail
      E(x, '#1d1a22', ox + 15, hy - 8, 4, 3); R(x, '#c4303c', ox + 13, hy - 6, 4, 2);
      PX.poly(x, '#1d1a22', [ox + 12, hy - 7, ox + 15, hy - 5, ox + 9, hy + 6 + wave, ox + 6, hy + 9 + wave, ox + 7, hy + 3]);
      // ear, eye, mouth
      R(x, '#e9bea0', ox + 19, hy + 3, 2, 3);
      R(x, '#2a1c18', ox + 26, hy + 2, 2, 4); R(x, '#ffffff', ox + 26, hy + 2, 1, 1); R(x, '#6b3a2a', ox + 26, hy + 5, 2, 1);
      R(x, '#1d1a22', ox + 25, hy, 4, 1);
      R(x, kind === 'hurt' ? '#7a2a22' : '#c96a5a', ox + 28, hy + 7, 2, 1);
      // front arm + sword
      const arm = (hx, hy2) => { PX.line(x, '#3a3846', ox + 25, 23 + bob, hx, hy2, 3); R(x, '#f2cfb0', hx - 1, hy2 - 1, 3, 3); };
      const sword = (hx, hy2, tx, ty) => {
        PX.line(x, '#9fb2c4', hx, hy2, tx, ty, 3); PX.line(x, '#eef4f8', hx, hy2 - 1, tx, ty - 1, 1);
        const dx = tx - hx, dy = ty - hy2, l = Math.hypot(dx, dy) || 1, px2 = -dy / l, py2 = dx / l;
        PX.line(x, '#e0b04a', Math.round(hx + px2 * 3), Math.round(hy2 + py2 * 3), Math.round(hx - px2 * 3), Math.round(hy2 - py2 * 3), 2);
        PX.line(x, '#6b3a22', hx, hy2, Math.round(hx - dx / l * 4), Math.round(hy2 - dy / l * 4), 2);
      };
      if (kind === 'atk') {
        if (f === 0) { arm(ox + 20, 15 + bob); sword(ox + 20, 15, ox + 9, 2); }
        else if (f === 1) { arm(ox + 33, 24); sword(ox + 33, 24, ox + 55, 21); }
        else { arm(ox + 31, 32); sword(ox + 31, 32, ox + 46, 46); }
      } else if (kind === 'hurt') { arm(ox + 27, 30); sword(ox + 27, 30, ox + 36, 44); }
      else { arm(ox + 30, 30 + bob); sword(ox + 30, 30 + bob, ox + 45, 39 + bob); }
    });
  },
  heroFrame(p, now) {
    if (p.atkT > 0) { const u = 1 - p.atkT / (p.atkMax || .45); return PX.hero('atk', u < .22 ? 0 : u < .6 ? 1 : 2); }
    if (p.hitFx > .15) return PX.hero('hurt', 0);
    if (p.anim > 0) return PX.hero('walk', Math.floor(p.anim / 1.6) % 4);
    return PX.hero('idle', Math.floor(now / 520) % 2);
  },
  // townsfolk
  npc(id) {
    const look = { elder: { robe: '#5d6f86', robe2: '#46566b', hair: '#ecebe6', beard: true, staff: true },
      herb: { robe: '#4f8f5e', robe2: '#3b7049', hair: '#2a1e1c', bun: true, basket: true },
      smith: { robe: '#7c5a3c', robe2: '#5c4028', hair: '#3a2a20', band: true, hammer: true } }[id] || { robe: '#7a6a8a', robe2: '#5a4c6a', hair: '#2a1e1c' };
    return PX.mk('npc_' + id, 40, 48, (x) => {
      const R = PX.r, E = PX.e;
      PX.poly(x, look.robe, [12, 22, 28, 22, 31, 45, 9, 45]); R(x, look.robe2, 19, 23, 2, 22); R(x, '#d9c28a', 11, 31, 18, 2);
      R(x, look.robe2, 9, 24, 3, 10); R(x, look.robe2, 28, 24, 3, 10); R(x, '#f2cfb0', 9, 33, 3, 2); R(x, '#f2cfb0', 28, 33, 3, 2);
      E(x, look.hair, 20, 11, 9, 8); E(x, '#f6d8bd', 20, 14, 7, 6);
      R(x, look.hair, 13, 7, 14, 3);
      R(x, '#2a1c18', 17, 14, 2, 2); R(x, '#2a1c18', 22, 14, 2, 2);
      if (look.beard) { PX.poly(x, '#f4f2ec', [15, 17, 25, 17, 22, 27, 20, 29, 18, 27]); R(x, '#ecebe6', 16, 11, 9, 2); }
      if (look.bun) { E(x, look.hair, 20, 3, 4, 3); R(x, '#e8c25a', 23, 1, 6, 1); }
      if (look.band) R(x, '#c4303c', 12, 9, 17, 2);
      if (look.staff) { PX.line(x, '#7a5233', 32, 12, 33, 46, 2); E(x, '#9a6a3a', 32, 11, 2, 2); }
      if (look.basket) { R(x, '#b08a4a', 27, 31, 8, 6); R(x, '#5ea84a', 28, 29, 6, 2); }
      if (look.hammer) { PX.line(x, '#6b4a2a', 31, 24, 34, 38, 2); R(x, '#8a8f98', 29, 21, 7, 4); }
    });
  },
  mob(type, f) {
    const draws = {
      rabbit: [30, 26, (x) => {
        const R = PX.r, E = PX.e, j = f ? -2 : 0;
        E(x, '#f6f3ee', 13, 17 + j, 8, f ? 5 : 6); E(x, '#e2dbcf', 12, 20 + j, 6, 2);
        E(x, '#f6f3ee', 20, 11 + j, 6, 5); E(x, '#fbfaf7', 6, 15 + j, 2, 2);
        E(x, '#f6f3ee', 18, 3 + j, 2, 5); E(x, '#f6f3ee', 22, 3 + j, 2, 5); R(x, '#f4a6b8', 18, 1 + j, 1, 6); R(x, '#f4a6b8', 22, 1 + j, 1, 6);
        R(x, '#3a1f22', 22, 10 + j, 2, 2); R(x, '#ffffff', 22, 10 + j, 1, 1); R(x, '#f08aa0', 25, 12 + j, 2, 1);
        PX.poly(x, '#6cbd47', [8, 12 + j, 13, 9 + j, 14, 12 + j]); PX.poly(x, '#4f9a37', [11, 13 + j, 16, 8 + j, 17, 12 + j]); R(x, '#8fd45f', 12, 10 + j, 2, 1);
        R(x, '#e2dbcf', 9, 22 + (f ? 0 : 0), 4, 2); R(x, '#e2dbcf', 17, 22, 4, 2);
      }],
      fowl: [30, 28, (x) => {
        const R = PX.r, E = PX.e, j = f ? -1 : 0;
        PX.poly(x, '#2e4a3a', [3, 10 + j, 9, 14 + j, 5, 19 + j]); PX.poly(x, '#3d6a4a', [5, 7 + j, 11, 14 + j, 6, 13 + j]);
        E(x, '#c98a4a', 14, 17 + j, 8, 6); E(x, '#a86a34', 12, 17 + j, 5, 3); E(x, '#d89a5a', 20, 10 + j, 4, 4);
        R(x, '#d8342a', 19, 4 + j, 4, 3); R(x, '#e8b030', 24, 10 + j, 3, 2); R(x, '#d8342a', 22, 13 + j, 2, 2); R(x, '#2a1c18', 21, 9 + j, 1, 1);
        R(x, '#e8a030', 12, 23, 1, 3); R(x, '#e8a030', 16, 23, 1, 3);
      }],
      boarlet: [34, 26, (x) => {
        const R = PX.r, E = PX.e, j = f ? -1 : 0;
        E(x, '#8a5f45', 15, 15 + j, 11, 7); for (let i = 0; i < 4; i++) R(x, '#b48a62', 8 + i * 5, 10 + j, 2, 9);
        E(x, '#8a5f45', 26, 14 + j, 5, 5); R(x, '#e7a99a', 30, 14 + j, 3, 3); R(x, '#2a1c18', 27, 11 + j, 1, 1); PX.poly(x, '#6c4532', [23, 9 + j, 25, 5 + j, 27, 9 + j]);
        R(x, '#4a3226', 9, 20, 3, 4); R(x, '#4a3226', 20, 20, 3, 4);
      }],
      shroom: [30, 30, (x) => {
        const R = PX.r, E = PX.e, j = f ? 1 : 0;
        R(x, '#efe2c6', 10, 14 + j, 10, 12 - j); E(x, '#efe2c6', 15, 25, 6, 2);
        R(x, '#2a1c18', 12, 18 + j, 2, 2); R(x, '#2a1c18', 17, 18 + j, 2, 2); R(x, '#e88a9a', 11, 21 + j, 2, 1); R(x, '#e88a9a', 18, 21 + j, 2, 1);
        E(x, '#8e6cc8', 15, 11 + j, 13, 7); R(x, '#6b4aa6', 3, 13 + j, 25, 2);
        E(x, '#ffffff', 10, 8 + j, 2, 1); E(x, '#ffffff', 19, 7 + j, 2, 2); E(x, '#f0e6ff', 15, 11 + j, 1, 1); E(x, '#ffffff', 23, 11 + j, 1, 1);
      }],
      wolf: [40, 30, (x) => {
        const R = PX.r, E = PX.e, j = f ? -1 : 0;
        PX.poly(x, '#6b7682', [2, 10 + j, 8, 13 + j, 6, 17 + j]);
        E(x, '#7f8b98', 17, 16 + j, 12, 6); E(x, '#5f6a76', 16, 12 + j, 9, 2); E(x, '#c9d0d8', 20, 19 + j, 6, 2);
        E(x, '#7f8b98', 30, 11 + j, 6, 5); PX.poly(x, '#7f8b98', [33, 12 + j, 39, 13 + j, 34, 16 + j]); R(x, '#2a1c18', 38, 12 + j, 1, 1);
        PX.poly(x, '#5f6a76', [26, 8 + j, 27, 2 + j, 30, 7 + j]); PX.poly(x, '#5f6a76', [30, 7 + j, 32, 1 + j, 33, 7 + j]); R(x, '#e8c25a', 31, 10 + j, 2, 1);
        R(x, '#5f6a76', 9, 21, 3, 6 + (f ? 1 : 0)); R(x, '#5f6a76', 14, 21, 3, 6); R(x, '#5f6a76', 22, 21, 3, 6); R(x, '#5f6a76', 27, 21, 3, 6 - (f ? 1 : 0));
      }],
      boar: [76, 56, (x) => {
        const R = PX.r, E = PX.e, j = f ? -1 : 0;
        E(x, '#5d3b2c', 34, 32 + j, 26, 15); E(x, '#734a37', 30, 28 + j, 18, 7);
        for (let i = 0; i < 9; i++) PX.poly(x, '#3a2418', [16 + i * 4, 20 + j, 18 + i * 4, 12 + j - (i % 2) * 3, 21 + i * 4, 20 + j]);
        E(x, '#5d3b2c', 58, 30 + j, 11, 10); E(x, '#d79a8a', 67, 33 + j, 4, 4); R(x, '#2a1c18', 66, 32 + j, 1, 2); R(x, '#2a1c18', 68, 32 + j, 1, 2);
        PX.poly(x, '#f4efe4', [62, 37 + j, 70, 30 + j, 66, 40 + j]); R(x, '#ff4a3a', 60, 26 + j, 3, 2);
        PX.poly(x, '#e8c25a', [52, 18 + j, 54, 12 + j, 57, 16 + j, 60, 11 + j, 63, 16 + j, 66, 12 + j, 67, 19 + j]);
        for (const lx of [16, 26, 42, 52]) R(x, '#3a2418', lx, 44, 5, 9);
      }],
    };
    const d = draws[type] || draws.rabbit;
    return PX.mk('mob_' + type + f, d[0], d[1], d[2]);
  },

  /* ---------------- props ---------------- */
  cherry(v) {
    return PX.mk('cherry' + v, 78, 82, (x) => {
      const rnd = PX.rnd(v * 97 + 5), E = PX.e;
      PX.poly(x, '#6b4430', [36, 81, 42, 81, 41, 58, 46, 44, 43, 42, 38, 54, 33, 40, 30, 42, 36, 58]);
      PX.line(x, '#5a3828', 40, 50, 52, 38, 2); PX.line(x, '#5a3828', 36, 52, 24, 40, 2);
      const blobs = [];
      for (let i = 0; i < 16; i++) { const a = rnd() * Math.PI * 2, d = rnd() * 22; blobs.push([39 + Math.cos(a) * d * 1.25, 30 + Math.sin(a) * d * .8, 7 + rnd() * 7]); }
      for (const [bx, by, br] of blobs) E(x, '#d8638f', Math.round(bx), Math.round(by + 3), Math.round(br), Math.round(br * .8));
      for (const [bx, by, br] of blobs) E(x, '#f396bf', Math.round(bx), Math.round(by), Math.round(br * .9), Math.round(br * .72));
      for (const [bx, by, br] of blobs) E(x, '#ffbcd8', Math.round(bx - br * .25), Math.round(by - br * .3), Math.round(br * .45), Math.round(br * .3));
      for (let i = 0; i < 40; i++) PX.r(x, rnd() < .5 ? '#fff0f6' : '#e45a8a', Math.round(14 + rnd() * 50), Math.round(10 + rnd() * 36), 1, 1);
    }, '#7a2a4a');
  },
  pine(v) {
    return PX.mk('pine' + v, 56, 74, (x) => {
      PX.r(x, '#5a3828', 25, 56, 6, 18);
      const lay = [[28, 50, 24, 9], [28, 40, 20, 9], [28, 30, 16, 8], [28, 20, 11, 7], [28, 11, 7, 6]];
      for (const [cx, cy, rx, ry] of lay) { PX.e(x, '#2f6a3a', cx, cy + 2, rx, ry); PX.e(x, '#3f8a46', cx - 2, cy, rx - 3, ry - 2); PX.e(x, '#5aa858', cx - 5, cy - 2, Math.max(2, rx - 12), 2); }
    }, '#1d3a24');
  },
  bamboo(v) {
    return PX.mk('bamboo' + v, 40, 92, (x) => {
      const rnd = PX.rnd(v * 31 + 7);
      for (let i = 0; i < 5; i++) {
        const bx = 6 + i * 6 + Math.round(rnd() * 3), top = 4 + Math.round(rnd() * 22), lean = Math.round((rnd() - .5) * 6);
        PX.line(x, '#5f9a36', bx, 90, bx + lean, top, 3); PX.line(x, '#86c24f', bx - 1, 90, bx - 1 + lean, top, 1);
        for (let y = top + 8; y < 88; y += 11) PX.r(x, '#3f7428', bx - 1 + Math.round(lean * (90 - y) / (90 - top)), y, 3, 1);
        for (let k = 0; k < 3; k++) { const ly = top + 4 + k * 9, lx = bx + lean * (90 - ly) / (90 - top); PX.poly(x, k % 2 ? '#79b84a' : '#5fa03a', [lx, ly, lx + (k % 2 ? 9 : -9), ly - 3, lx + (k % 2 ? 7 : -7), ly + 1]); }
      }
    }, '#24451c');
  },
  rock(v) {
    return PX.mk('rock' + v, 26, 18, (x) => {
      PX.e(x, '#7e8187', 13, 11, 11, 6); PX.e(x, '#9c9fa5', 11, 9, 8, 4); PX.e(x, '#b9bcc1', 9, 7, 3, 2);
      if (v % 2) { PX.e(x, '#5f9a3a', 15, 6, 5, 2); }
    }, '#3a3c42');
  },
  bush(v) {
    return PX.mk('bush' + v, 28, 18, (x) => {
      PX.e(x, '#3f8a36', 14, 11, 12, 6); PX.e(x, '#5aa84a', 11, 9, 8, 4); PX.e(x, '#7cc45c', 9, 7, 4, 2);
      const c = ['#ff8fb8', '#ffffff', '#ffd84a'][v % 3]; for (const [a, b] of [[6, 10], [12, 7], [18, 9], [21, 12], [9, 13]]) PX.r(x, c, a, b, 2, 2);
    }, '#1f4a1c');
  },
  stoneLantern() {
    return PX.mk('slant', 22, 40, (x) => {
      const R = PX.r;
      R(x, '#7e8187', 5, 34, 12, 5); R(x, '#8f9298', 8, 22, 6, 12); R(x, '#9c9fa5', 4, 17, 14, 5);
      R(x, '#ffd75a', 7, 18, 8, 3); R(x, '#fff1a8', 9, 18, 4, 2);
      PX.poly(x, '#6e7177', [1, 17, 21, 17, 17, 11, 5, 11]); R(x, '#9c9fa5', 9, 7, 4, 4); R(x, '#b9bcc1', 6, 12, 8, 1);
    }, '#34363c');
  },
  lampPost() {
    return PX.mk('lamp', 26, 56, (x) => {
      const R = PX.r;
      R(x, '#6b4430', 4, 6, 4, 50); R(x, '#8a5a3a', 4, 6, 1, 50); R(x, '#6b4430', 4, 6, 18, 3); R(x, '#5a3828', 18, 9, 1, 4);
      R(x, '#c4303c', 14, 13, 10, 12); R(x, '#ffcf5a', 16, 15, 6, 8); R(x, '#fff1a8', 18, 16, 2, 5); R(x, '#3a2418', 14, 12, 10, 2); R(x, '#3a2418', 14, 25, 10, 2);
    }, '#2a1a14');
  },
  fence(len) {
    return PX.mk('fence' + len, len + 2, 16, (x) => {
      for (let i = 0; i <= len; i += 10) { PX.r(x, '#7a5233', i, 1, 3, 15); PX.r(x, '#9a6a42', i, 1, 1, 15); }
      PX.r(x, '#8a5e3a', 0, 4, len + 2, 2); PX.r(x, '#8a5e3a', 0, 9, len + 2, 2); PX.r(x, '#a87a50', 0, 4, len + 2, 1);
    }, '#3a2418');
  },
  house(w, h) {
    // w,h: footprint in art pixels; sprite is taller (roof)
    const W = w + 18, H = h + 30;
    return PX.mk('house' + w + 'x' + h, W, H, (x) => {
      const R = PX.r, wy = 22, wh = H - wy - 2;
      R(x, '#8c8f94', 9, H - 6, w, 5);                                    // stone base
      R(x, '#a06e44', 9, wy, w, wh - 4); R(x, '#87582f', 9, wy, w, 3);       // wooden wall
      for (let i = 9; i < 9 + w; i += 14) R(x, '#6b4226', i, wy, 2, wh - 4);
      R(x, '#b33a2e', 9, wy, 3, wh - 2); R(x, '#b33a2e', 6 + w, wy, 3, wh - 2); // red pillars
      const win = (wx) => { R(x, '#f3e6c4', wx, wy + 8, 12, 10); for (let k = 0; k < 12; k += 4) R(x, '#8a5a32', wx + k, wy + 8, 1, 10); R(x, '#8a5a32', wx, wy + 12, 12, 1); };
      win(15); if (w > 46) win(w - 9);
      const dx = 9 + Math.round(w / 2) - 6; R(x, '#4a2c1a', dx, H - 22, 12, 16); R(x, '#c4303c', dx - 1, H - 25, 14, 3); R(x, '#e8c25a', dx + 9, H - 14, 2, 2);
      // roof
      PX.poly(x, '#3f4554', [0, 26, W, 26, W - 8, 8, 8, 8]);
      for (let y = 10; y < 26; y += 3) R(x, '#5a6172', 3 + Math.round((26 - y) * .5), y, W - 6 - Math.round((26 - y)), 1);
      for (let i = 6; i < W - 6; i += 5) R(x, '#2f3440', i, 10, 1, 15);
      PX.poly(x, '#2e323d', [0, 26, 5, 20, 7, 26]); PX.poly(x, '#2e323d', [W, 26, W - 5, 20, W - 7, 26]);
      PX.poly(x, '#3f4554', [-1, 27, 0, 22, 3, 26]); PX.poly(x, '#3f4554', [W + 1, 27, W, 22, W - 3, 26]);
      R(x, '#2a2e38', 6, 5, W - 12, 4); R(x, '#5a6172', 6, 5, W - 12, 1);
      PX.poly(x, '#2a2e38', [2, 2, 8, 5, 6, 9]); PX.poly(x, '#2a2e38', [W - 2, 2, W - 8, 5, W - 6, 9]);
      R(x, '#c4303c', 9, 26, w, 2);
    }, '#1d1a20');
  },

  themes: {
    meadow: { base: '#78b944', tones: ['#66a63a', '#8bc950', '#71b03f'], tuft: '#5a9a34', tuftHi: '#a3dc62', flowers: ['#ff9cc4', '#ffffff', '#ffe066', '#ff7fae'], path: ['#c99a5a', '#d8ab6a', '#b88a4c', '#a8804a', '#e2bd82'] },
    forest: { dark: 1, base: '#5f9d3c', tones: ['#4f8a33', '#6aab45', '#578f37'], tuft: '#467d2e', tuftHi: '#7cbc52', flowers: ['#ffffff', '#c8b6ff', '#ffe066'], path: ['#c99a5a', '#d8ab6a', '#b88a4c', '#a8804a', '#e2bd82'] },
    cave: { dark: 1, base: '#3b3f4c', tones: ['#33363f', '#474b5a', '#3f4352'], tuft: '#2c2f37', tuftHi: '#5a5f72', flowers: ['#7ae8ff', '#c89aff'], path: ['#5e5448', '#6e6252', '#4e463c', '#3e3830', '#7e7262'] },
    temple: { dark: 1, base: '#56693e', tones: ['#4a5c36', '#61744a', '#53653c'], tuft: '#3e4e2e', tuftHi: '#7a8c5a', flowers: ['#e8e2d2', '#ffd06a'], path: ['#9a948a', '#aaa498', '#86807a', '#6e6a64', '#bab4a8'] },
    jungle: { dark: 1, base: '#3f7a2e', tones: ['#356a26', '#4a8a36', '#2f5e22'], tuft: '#2a5420', tuftHi: '#6aa848', flowers: ['#ff5a7a', '#ffd84a', '#ff8a3a'], path: ['#7a5a3a', '#8a6a46', '#664a30', '#563c26', '#9a7a52'] },
  },
  /* ---------------- map art: layout + terrain ---------------- */
  art: {
    village: {
      cliffs: [[1180, 0, 320, 175]], falls: [[1300, 30, 90, 150]],
      rivers: [[1300, 170, 90, 930]], bridges: [[1278, 470, 134, 92]],
      extraPaths: [[1280, 470, 220, 90]], ponds: [[80, 840, 340, 190]],
      wheel: [1282, 330], lamps: [[420, 425], [880, 425], [1150, 425], [420, 556], [1150, 556], [602, 250], [760, 250], [602, 800], [760, 800]],
      stoneLanterns: [[560, 330], [800, 330]], cherry: 14, bamboo: 4, pine: 0, rocks: 10, bushes: 16,
      fences: [[1240, 300, 50, 'v'], [1240, 600, 140, 'v'], [1410, 600, 120, 'v']], bambooZone: [0, 0, 260, 240],
    },
    wind: {
      cliffs: [[1100, 0, 520, 175]], falls: [[1310, 25, 110, 150]],
      rivers: [[1150, 170, 420, 180], [1320, 350, 80, 950]], bridges: [[1298, 556, 124, 128]],
      ponds: [], wheel: [1140, 260], lamps: [[1270, 560], [1450, 560]], stoneLanterns: [[1240, 700]],
      cherry: 22, bamboo: 3, pine: 4, rocks: 18, bushes: 26, fences: [[1250, 690, 120, 'v'], [1430, 690, 130, 'v'], [1250, 380, 160, 'v']], bambooZone: [0, 900, 400, 400],
    },
    jade: {
      cliffs: [[0, 0, 1900, 70]], falls: [[1500, 0, 90, 70]], rivers: [], bridges: [], ponds: [[200, 240, 340, 220]],
      wheel: null, lamps: [], stoneLanterns: [[860, 300], [1060, 300], [860, 700], [1060, 700], [860, 1050], [1060, 1050]],
      cherry: 8, bamboo: 46, pine: 18, rocks: 22, bushes: 20, fences: [], fog: true, bambooZone: [0, 0, 1900, 1300],
    },
  },
  prep(m, id) {
    const a = PX.art[id]; if (!a || m.__px) return; m.__px = true;
    m.paths = (m.paths || []).concat(a.extraPaths || []);
    // river/falls block movement except across bridges; cliffs are solid
    const water = [];
    for (const rv of a.rivers || []) {
      let segs = [rv];
      for (const b of a.bridges || []) segs = segs.flatMap(s => {
        if (b[0] >= s[0] + s[2] || b[0] + b[2] <= s[0] || b[1] >= s[1] + s[3] || b[1] + b[3] <= s[1]) return [s];
        const out = []; if (b[1] > s[1]) out.push([s[0], s[1], s[2], b[1] - s[1]]); if (b[1] + b[3] < s[1] + s[3]) out.push([s[0], b[1] + b[3], s[2], s[1] + s[3] - b[1] - b[3]]); return out;
      });
      water.push(...segs);
    }
    m.water = water.concat(a.ponds || []).concat(a.falls || []);
    m.colliders = (m.colliders || []).concat(a.cliffs || []);
  },
  inRect(x, y, r, pad = 0) { return x > r[0] - pad && x < r[0] + r[2] + pad && y > r[1] - pad && y < r[1] + r[3] + pad; },
  layout(game, m, id) {
    if (m.__props) return m.__props;
    const a = PX.art[id] || {}, S = PX.S, rnd = PX.rnd(id.length * 977 + 31), props = [];
    const busy = (x, y, pad) => (m.paths || []).some(r => PX.inRect(x, y, r, pad)) || (m.water || []).some(r => PX.inRect(x, y, r, pad)) || (m.colliders || []).some(r => PX.inRect(x, y, r, pad))
      || (a.bridges || []).some(r => PX.inRect(x, y, r, pad)) || (m.portals || []).some(p => PX.inRect(x, y, [p.x, p.y, p.w, p.h], pad))
      || (m.npcs || []).some(n => Math.hypot(n.x - x, n.y - y) < 150) || Math.hypot(m.start.x - x, m.start.y - y) < 90
      || props.some(p => Math.hypot(p.x - x, p.y - y) < (p.kind === 'cherry' || p.kind === 'pine' ? 70 : 34));
    const place = (kind, n, pad, zone) => {
      for (let i = 0, tries = 0; i < n && tries < n * 60; tries++) {
        const z = zone || [20, 20, m.w - 40, m.h - 40], x = z[0] + rnd() * z[2], y = z[1] + rnd() * z[3];
        if (x < 30 || y < 60 || x > m.w - 30 || y > m.h - 10 || busy(x, y, pad)) continue;
        props.push({ kind, x, y, v: Math.floor(rnd() * 4) }); i++;
      }
    };
    for (const c of m.colliders || []) if (!(a.cliffs || []).includes(c)) props.push({ kind: 'house', x: c[0] + c[2] / 2, y: c[1] + c[3], c });
    for (const [lx, ly] of a.lamps || []) if (!(m.npcs || []).some(n => Math.hypot(n.x - lx, n.y - ly) < 130)) props.push({ kind: 'lamp', x: lx, y: ly });
    for (const [lx, ly] of a.stoneLanterns || []) props.push({ kind: 'slant', x: lx, y: ly });
    for (const [fx, fy, len, dir] of a.fences || []) {
      if (dir === 'v') for (let k = 0; k < len; k += 40) props.push({ kind: 'post', x: fx, y: fy + k, last: k + 40 >= len });
      else props.push({ kind: 'fence', x: fx, y: fy, len });
    }
    for (const b of a.bridges || []) props.push({ kind: 'railing', x: b[0], y: b[1] + b[3] - 2, b });
    if (a.wheel) props.push({ kind: 'wheel', x: a.wheel[0], y: a.wheel[1] + 50 });
    place('bamboo', a.bamboo || 0, 30, a.bambooZone);
    place('cherry', a.cherry || 0, 50);
    place('pine', a.pine || 0, 50);
    for (const k in a.extra || {}) place(k, a.extra[k], PX.extraProps[k] ? PX.extraProps[k].pad : 30, a.extraZone && a.extraZone[k]);
    place('rock', a.rocks || 0, 18);
    place('bush', a.bushes || 0, 18);
    return m.__props = props;
  },
  terrain(m, id) {
    if (m.__terrain) return m.__terrain;
    const S = PX.S, W = Math.ceil(m.w / S), H = Math.ceil(m.h / S), c = PX.canvas(W, H), x = c.getContext('2d'), a = PX.art[id] || {}, rnd = PX.rnd(id.length * 4111 + 7), R = PX.r;
    const L = (r) => [Math.round(r[0] / S), Math.round(r[1] / S), Math.round(r[2] / S), Math.round(r[3] / S)];
    const TH = PX.themes[a.theme || (id === 'jade' ? 'forest' : 'meadow')], forest = !!TH.dark;
    // ground
    R(x, TH.base, 0, 0, W, H);
    const tones = TH.tones;
    for (let i = 0; i < W * H / 40; i++) { const bx = rnd() * W | 0, by = rnd() * H | 0, s = 1 + rnd() * 4 | 0; PX.e(x, tones[i % 3], bx, by, s + 1, Math.max(1, s >> 1)); }
    for (let i = 0; i < W * H / 22; i++) { const bx = rnd() * W | 0, by = rnd() * H | 0; R(x, TH.tuft, bx, by, 1, 2); R(x, TH.tuftHi, bx, by - 1, 1, 1); }
    const fl = TH.flowers;
    for (let i = 0; i < (fl.length ? W * H / 900 : 0); i++) { const cx = rnd() * W, cy = rnd() * H, col = fl[i % fl.length]; for (let k = 0; k < 5; k++) { const fx = cx + (rnd() - .5) * 12 | 0, fy = cy + (rnd() - .5) * 8 | 0; R(x, col, fx, fy, 1, 1); R(x, '#f6d04a', fx, fy + 1, 1, 1); } }
    // paths with ragged edges and cobbles
    for (const p of m.paths || []) {
      const [px, py, pw, ph] = L(p);
      const PC = TH.path; R(x, PC[0], px, py, pw, ph);
      for (let i = 0; i < pw * ph / 6; i++) R(x, rnd() < .5 ? PC[1] : PC[2], px + rnd() * pw | 0, py + rnd() * ph | 0, 1 + (rnd() * 2 | 0), 1);
      for (let i = 0; i < pw * ph / 55; i++) { const sx = px + 2 + rnd() * (pw - 6) | 0, sy = py + 2 + rnd() * (ph - 5) | 0; R(x, PC[3], sx, sy, 4, 3); R(x, PC[4], sx, sy, 3, 2); }
      const edge = (horiz) => {
        if (horiz) for (let i = px; i < px + pw; i++) { const t1 = rnd() * 3 | 0, t2 = rnd() * 3 | 0; R(x, tones[1], i, py, 1, t1); R(x, PC[3], i, py + t1, 1, 1); R(x, tones[0], i, py + ph - t2, 1, t2); }
        else for (let j = py; j < py + ph; j++) { const t1 = rnd() * 3 | 0, t2 = rnd() * 3 | 0; R(x, tones[1], px, j, t1, 1); R(x, tones[0], px + pw - t2, j, t2, 1); }
      };
      edge(pw >= ph); edge(pw < ph);
    }
    // cliffs: stacked stone blocks with moss
    for (const cl of a.cliffs || []) {
      const [cx, cy, cw, ch] = L(cl);
      R(x, '#5d6066', cx, cy, cw, ch);
      for (let yy = cy; yy < cy + ch; yy += 6) for (let xx = cx - (yy % 12 ? 0 : 5); xx < cx + cw; xx += 10 + (rnd() * 4 | 0)) {
        const bw = 8 + (rnd() * 4 | 0); R(x, '#7b7e85', xx, yy, bw, 5); R(x, '#959aa1', xx, yy, bw, 1); R(x, '#4a4c52', xx, yy + 5, bw, 1);
      }
      for (let xx = cx; xx < cx + cw; xx += 2) { const mh = 2 + (rnd() * 4 | 0); R(x, '#5aa040', xx, cy + ch - 3 - mh, 2, 1); }
      R(x, '#3b3d42', cx, cy + ch - 2, cw, 2);
      for (let i = 0; i < cw / 3; i++) { const vx = cx + rnd() * cw | 0, vl = 3 + rnd() * 10 | 0; R(x, '#4f9a3a', vx, cy + ch - vl - 2, 1, vl); }
    }
    // water: rivers, ponds and the basin under the falls
    const water = (r, pond) => {
      const [wx, wy, ww, wh] = L(r);
      R(x, '#3a95d4', wx, wy, ww, wh); R(x, '#2e7fc0', wx + 3, wy + 3, Math.max(1, ww - 6), Math.max(1, wh - 6));
      R(x, '#8ad2f4', wx, wy, ww, 1); R(x, '#8ad2f4', wx, wy, 1, wh); R(x, '#8ad2f4', wx + ww - 1, wy, 1, wh);
      for (let i = 0; i < (ww + wh) * 2 / 6; i++) { const t = rnd(), side = rnd() * 4 | 0; let sx, sy; if (side === 0) { sx = wx + t * ww; sy = wy - 1; } else if (side === 1) { sx = wx + t * ww; sy = wy + wh - 1; } else if (side === 2) { sx = wx - 1; sy = wy + t * wh; } else { sx = wx + ww - 2; sy = wy + t * wh; } PX.e(x, rnd() < .5 ? '#8f9298' : '#a9acb2', sx | 0, sy | 0, 2, 1); }
      if (pond) for (let i = 0; i < ww * wh / 220; i++) { const lx = wx + 4 + rnd() * (ww - 8) | 0, ly = wy + 4 + rnd() * (wh - 8) | 0; PX.e(x, '#4f9a3a', lx, ly, 3, 2); R(x, '#6cbd47', lx - 1, ly - 1, 2, 1); if (rnd() < .4) R(x, '#ff9cc4', lx + 1, ly - 1, 2, 2); }
    };
    for (const r of a.rivers || []) water(r);
    for (const r of a.ponds || []) water(r, true);
    if (!a.ponds && !a.rivers) for (const r of m.water || []) water(r, true);
    // bridges: plank deck with a back railing
    for (const b of a.bridges || []) {
      const [bx, by, bw, bh] = L(b);
      R(x, '#3a2418', bx, by + 2, bw, bh - 2);
      for (let i = bx; i < bx + bw; i += 4) { R(x, '#9a6a42', i, by + 3, 3, bh - 5); R(x, '#b8865a', i, by + 3, 3, 1); R(x, '#6b4428', i + 3, by + 3, 1, bh - 5); }
      for (let i = bx; i <= bx + bw - 2; i += 10) R(x, '#6b4428', i, by - 6, 3, 9);
      R(x, '#8a5e3a', bx, by - 5, bw, 2); R(x, '#a87a50', bx, by - 5, bw, 1);
    }
    return m.__terrain = c;
  },
  // animated water shimmer, waterfall streaks, foam
  waterAnim(x, m, id, ox, oy, t) {
    const a = PX.art[id] || {}, S = PX.S, R = PX.r, LW = x.canvas.width, LH = x.canvas.height;
    const rects = (a.rivers || []).concat(a.ponds || []), br = (a.bridges || []).map(b => [b[0] / S - ox, b[1] / S - oy - 3, b[2] / S, b[3] / S + 3]);
    const onBridge = (px, py) => br.some(b => px >= b[0] && px < b[0] + b[2] && py >= b[1] && py < b[1] + b[3]);
    for (const r of rects) {
      const wx = r[0] / S - ox, wy = r[1] / S - oy, ww = r[2] / S, wh = r[3] / S;
      if (wx > LW || wy > LH || wx + ww < 0 || wy + wh < 0) continue;
      const rnd = PX.rnd(r[0] * 7 + r[1]), vert = wh > ww, n = (ww * wh) / 40 | 0;
      for (let i = 0; i < n; i++) {
        let sx = rnd() * ww, sy = rnd() * wh; const ph = rnd() * 6;
        if (vert) sy = (sy + t * 14) % wh; else sx = (sx + t * 6) % ww;
        const al = .5 + .5 * Math.sin(t * 3 + ph); if (al < .35) continue;
        const qx = Math.round(wx + sx), qy = Math.round(wy + sy); if (onBridge(qx, qy) || onBridge(qx, qy + 3)) continue;
        R(x, al > .8 ? '#d8f2ff' : '#7cc4ee', qx, qy, vert ? 1 : 3, vert ? 3 : 1);
      }
    }
    for (const f of a.falls || []) {
      const fx = Math.round(f[0] / S - ox), fy = Math.round(f[1] / S - oy), fw = Math.round(f[2] / S), fh = Math.round(f[3] / S);
      R(x, '#7cc8f0', fx, fy, fw, fh);
      for (let i = 0; i < fw; i++) {
        const sp = 18 + (i * 7) % 11, off = (t * sp * 2 + i * 13) % fh;
        R(x, i % 3 ? '#a8def8' : '#e8f8ff', fx + i, fy, 1, fh);
        R(x, '#5aaee2', fx + i, Math.round(fy + off), 1, 3 + (i % 4));
        R(x, '#ffffff', fx + i, Math.round(fy + (off + fh / 2) % fh), 1, 2);
      }
      for (let i = 0; i < fw + 10; i += 3) { const k = .5 + .5 * Math.sin(t * 6 + i); PX.e(x, k > .5 ? '#ffffff' : '#d6f1ff', fx - 5 + i, fy + fh + 1, 2 + Math.round(k * 2), 1 + Math.round(k)); }
    }
  },
  wheelDraw(x, cx, cy, t) {
    const R = PX.r, rad = 17;
    R(x, '#5a3828', cx - 2, cy - 2, 4, 26);
    for (let i = 0; i < 8; i++) { const ang = t * 1.4 + i * Math.PI / 4; PX.line(x, '#6b4430', cx, cy, Math.round(cx + Math.cos(ang) * rad), Math.round(cy + Math.sin(ang) * rad), 2); }
    for (let i = 0; i < 48; i++) { const ang = i / 48 * Math.PI * 2; R(x, i % 6 < 3 ? '#8a5a36' : '#7a4e2e', Math.round(cx + Math.cos(ang) * rad), Math.round(cy + Math.sin(ang) * rad), 2, 2); }
    for (let i = 0; i < 12; i++) { const ang = t * 1.4 + i * Math.PI / 6; const px = Math.round(cx + Math.cos(ang) * (rad + 2)), py = Math.round(cy + Math.sin(ang) * (rad + 2)); R(x, '#a06e44', px - 1, py - 1, 3, 3); R(x, '#3a2418', px - 1, py + 2, 3, 1); }
    PX.e(x, '#3a2418', cx, cy, 2, 2); PX.e(x, '#c89a5a', cx, cy, 1, 1);
    for (let i = 0; i < 6; i++) { const k = (t * 3 + i) % 1; R(x, '#e8f8ff', cx + 8 + i * 2, cy + 14 + Math.round(k * 6), 1, 2); }
  },
  icon(kind) {
    return PX.mk('icon_' + kind, 20, 20, (x) => {
      const R = PX.r, E = PX.e;
      if (kind === 'gift') { R(x, '#d8342a', 3, 8, 14, 10); R(x, '#f04a3a', 2, 6, 16, 4); R(x, '#ffd84a', 9, 6, 2, 12); R(x, '#ffd84a', 2, 8, 16, 1); E(x, '#ffd84a', 7, 4, 3, 2); E(x, '#ffd84a', 13, 4, 3, 2); }
      else if (kind === 'lantern') { R(x, '#3a2418', 9, 1, 2, 3); E(x, '#e03a2e', 10, 10, 7, 6); R(x, '#ffd84a', 4, 9, 12, 1); R(x, '#ffd84a', 4, 12, 12, 1); R(x, '#3a2418', 6, 4, 8, 2); R(x, '#3a2418', 6, 16, 8, 2); R(x, '#ffd84a', 9, 18, 2, 2); }
      else if (kind === 'tools') { PX.line(x, '#9a6a3a', 3, 17, 15, 5, 2); PX.line(x, '#9a6a3a', 17, 17, 5, 5, 2); R(x, '#c8ccd2', 12, 2, 6, 4); R(x, '#c8ccd2', 2, 2, 6, 4); }
      else if (kind === 'gourd') { E(x, '#e8c27a', 10, 6, 4, 4); E(x, '#e8c27a', 10, 14, 6, 5); R(x, '#c4303c', 6, 9, 8, 2); R(x, '#7a5233', 9, 0, 2, 3); E(x, '#fff0c8', 8, 13, 1, 2); }
      else if (kind === 'gate') { R(x, '#d8342a', 4, 6, 3, 13); R(x, '#d8342a', 13, 6, 3, 13); R(x, '#3a2418', 1, 3, 18, 3); R(x, '#d8342a', 2, 8, 16, 2); R(x, '#e8c25a', 9, 6, 2, 4); }
      else if (kind === 'scroll') { R(x, '#f0dca8', 4, 4, 12, 13); R(x, '#a87a50', 3, 3, 14, 2); R(x, '#a87a50', 3, 16, 14, 2); for (let i = 7; i < 15; i += 3) R(x, '#8a6a4a', 6, i, 8, 1); }
      else if (kind === 'bag') { E(x, '#e88aa8', 10, 12, 7, 6); R(x, '#c45a7a', 7, 4, 6, 4); R(x, '#ffd84a', 6, 7, 8, 2); E(x, '#ffc8d8', 7, 10, 2, 2); }
      else if (kind === 'menu') { R(x, '#e8e2d2', 3, 4, 14, 3); R(x, '#e8e2d2', 3, 9, 14, 3); R(x, '#e8e2d2', 3, 14, 14, 3); }
      else if (kind === 'sword') { PX.line(x, '#e6eef4', 4, 16, 16, 3, 2); PX.line(x, '#e0b04a', 3, 12, 8, 17, 2); PX.line(x, '#6b3a22', 2, 18, 5, 15, 2); }
      else if (kind === 'star') { PX.poly(x, '#d8c8ff', [10, 1, 12, 8, 19, 10, 12, 12, 10, 19, 8, 12, 1, 10, 8, 8]); E(x, '#ffffff', 10, 10, 2, 2); }
    }, '#1a1418');
  },
  url(c, scale) { const o = PX.canvas(c.width * scale, c.height * scale); o.getContext('2d').drawImage(c, 0, 0, o.width, o.height); return o.toDataURL(); },
  avatar() {
    if (PX._avatar) return PX._avatar;
    const h = PX.hero('idle', 0), c = PX.canvas(34, 30); c.getContext('2d').drawImage(h, -6, -1);
    return PX._avatar = PX.url(c, 3);
  },
};

/* bigger world so the camera travels like a real field (sprites are 3x pixels now) */
PX.K = 1.6;
PX.scaleMap = function (id) {
  const K = PX.K, sc = (r) => r.map(v => typeof v === 'number' ? Math.round(v * K) : v);
  {
    const m = MAPS[id]; if (m.__scaled) return; m.__scaled = true; m.w = Math.round(m.w * K); m.h = Math.round(m.h * K);
    for (const k of ['paths', 'water', 'colliders']) m[k] = (m[k] || []).map(sc);
    for (const n of m.npcs || []) { n.x = Math.round(n.x * K); n.y = Math.round(n.y * K); }
    for (const sp of m.spawns || []) sp.area = sc(sp.area);
    for (const pt of m.portals || []) { pt.x = Math.round(pt.x * K); pt.y = Math.round(pt.y * K); pt.w = Math.round(pt.w * K); pt.h = Math.round(pt.h * K); pt.tx = Math.round(pt.tx * K); pt.ty = Math.round(pt.ty * K); }
    m.start = { x: Math.round(m.start.x * K), y: Math.round(m.start.y * K) };
    const a = PX.art[id]; if (!a) return;
    for (const k of ['cliffs', 'falls', 'rivers', 'bridges', 'extraPaths', 'ponds', 'lamps', 'stoneLanterns', 'fences']) if (a[k]) a[k] = a[k].map(sc);
    if (a.wheel) a.wheel = sc(a.wheel); if (a.bambooZone) a.bambooZone = sc(a.bambooZone);
    if (a.extraZone) for (const k in a.extraZone) a.extraZone[k] = sc(a.extraZone[k]);
  }
};
{
  if (typeof NEW_ART !== 'undefined') Object.assign(PX.art, NEW_ART);
  for (const id in MAPS) PX.scaleMap(id);
  MAPS.village.npcs.find(n => n.id === 'elder').y = Math.round(405 * PX.K);
}

/* ---------------- renderer hooked into the game component ---------------- */
{
  const CP = Component.prototype;
  const mapId = (self) => self.g.map;
  CP.draw = function () {
    const cv = this.canvasRef.current; if (!cv) return;
    const ctx = cv.getContext('2d'), dpr = this.dpr || 1, S = PX.S;
    const W = cv.width / dpr, H = cv.height / dpr, g = this.g, m = this.mapDef(), id = mapId(this), now = performance.now(), t = now / 1000;
    PX.prep(m, id);
    g.cam.x = Math.max(0, Math.min(m.w - W, g.p.x - W / 2)); g.cam.y = Math.max(0, Math.min(m.h - H, g.p.y - H / 2));
    if (m.w < W) g.cam.x = (m.w - W) / 2; if (m.h < H) g.cam.y = (m.h - H) / 2;
    const cx = Math.round(g.cam.x / S) * S, cy = Math.round(g.cam.y / S) * S, ox = cx / S, oy = cy / S;
    const LW = Math.ceil(W / S) + 1, LH = Math.ceil(H / S) + 1;
    if (!this.low || this.low.width !== LW || this.low.height !== LH) this.low = PX.canvas(LW, LH);
    const x = this.low.getContext('2d'); x.imageSmoothingEnabled = false;
    x.fillStyle = '#1b2a1c'; x.fillRect(0, 0, LW, LH);
    x.drawImage(PX.terrain(m, id), -ox, -oy);
    PX.waterAnim(x, m, id, ox, oy, t);
    // drawables sorted by their ground y
    const art = PX.art[id] || {}, list = [];
    for (const p of PX.layout(this, m, id)) list.push(p);
    for (const n of m.npcs || []) list.push({ kind: 'npc', x: n.x, y: n.y + 14, n });
    for (const mo of g.mobs) if (!mo.dead) list.push({ kind: 'mob', x: mo.x, y: mo.y + mo.r * .6, mo });
    list.push({ kind: 'hero', x: g.p.x, y: g.p.y + 14 });
    if (this.moreDrawables) this.moreDrawables(list, now);
    list.sort((a, b) => a.y - b.y);
    const sx = (wx) => Math.round(wx / S - ox), sy = (wy) => Math.round(wy / S - oy);
    const shadow = (wx, wy, rx, ry) => { x.globalAlpha = .28; PX.e(x, '#13240f', sx(wx), sy(wy), rx, ry); x.globalAlpha = 1; };
    const blit = (img, wx, wy, ax, ay, flip) => {
      const px = sx(wx) - (flip ? img.width - ax : ax), py = sy(wy) - ay;
      if (px > LW || py > LH || px + img.width < 0 || py + img.height < 0) return;
      if (flip) { x.save(); x.translate(px + img.width, py); x.scale(-1, 1); x.drawImage(img, 0, 0); x.restore(); } else x.drawImage(img, px, py);
    };
    this._labels = [];
    for (const o of list) {
      if (o.kind === 'house') { const fw = Math.round(o.c[2] / S), fh = Math.round(o.c[3] / S), img = PX.house(fw, fh); shadow(o.x + 18, o.y + 4, fw / 2 + 6, 4); blit(img, o.x, o.y, img.width / 2, img.height - 1); }
      else if (o.kind === 'cherry') { shadow(o.x + 6, o.y + 2, 20, 6); blit(PX.cherry(o.v), o.x, o.y, 39, 80); }
      else if (o.kind === 'pine') { shadow(o.x + 4, o.y + 2, 14, 5); blit(PX.pine(o.v), o.x, o.y, 28, 72); }
      else if (o.kind === 'bamboo') { shadow(o.x, o.y + 1, 12, 4); blit(PX.bamboo(o.v), o.x, o.y, 20, 90); }
      else if (o.kind === 'rock') blit(PX.rock(o.v), o.x, o.y, 13, 15);
      else if (o.kind === 'bush') blit(PX.bush(o.v), o.x, o.y, 14, 15);
      else if (o.kind === 'slant') { shadow(o.x, o.y + 1, 7, 2); blit(PX.stoneLantern(), o.x, o.y, 11, 39); this._labels.push({ glow: true, x: o.x, y: o.y - 60, r: 34 }); }
      else if (o.kind === 'lamp') { shadow(o.x, o.y + 1, 5, 2); blit(PX.lampPost(), o.x, o.y, 6, 55); this._labels.push({ glow: true, x: o.x + 33, y: o.y - 110, r: 46 }); }
      else if (o.kind === 'post') { PX.r(x, '#3a2418', sx(o.x) - 2, sy(o.y) - 15, 4, 16); PX.r(x, '#7a5233', sx(o.x) - 1, sy(o.y) - 14, 2, 14); if (!o.last) { PX.r(x, '#3a2418', sx(o.x) - 1, sy(o.y) - 12, 3, 15); PX.r(x, '#9a6a42', sx(o.x), sy(o.y) - 11, 1, 13); } }
      else if (o.kind === 'fence') blit(PX.fence(Math.round(o.len / S)), o.x, o.y, 0, 15);
      else if (o.kind === 'railing') { const b = o.b, bx = sx(b[0]), by = sy(b[1] + b[3]), bw = Math.round(b[2] / S); for (let i = 0; i <= bw - 2; i += 10) { PX.r(x, '#3a2418', bx + i - 1, by - 11, 5, 12); PX.r(x, '#7a5233', bx + i, by - 10, 3, 10); } PX.r(x, '#3a2418', bx, by - 9, bw, 4); PX.r(x, '#9a6a42', bx, by - 8, bw, 2); }
      else if (o.kind === 'wheel') PX.wheelDraw(x, sx(o.x), sy(o.y - 50), t);
      else if (o.draw) o.draw(x, sx, sy, shadow, blit);
      else if (PX.extraProps[o.kind]) { const ep = PX.extraProps[o.kind], img = ep.img(o.v); if (ep.sh) shadow(o.x + ep.sh[2], o.y + 1, ep.sh[0], ep.sh[1]); blit(img, o.x, o.y, ep.ax(img), ep.ay(img)); if (ep.glow) this._labels.push({ glow: true, x: o.x, y: o.y - ep.glow[0], r: ep.glow[1], col: ep.glow[2] }); }
      else if (o.kind === 'npc') { shadow(o.x, o.y, 7, 2); blit(PX.npc(o.n.id), o.x, o.y, 20, 46); this._labels.push({ npc: o.n }); }
      else if (o.kind === 'mob') {
        const mo = o.mo, d = MONSTERS[mo.type], moving = mo.state === 'chase' || mo.state === 'wander' || mo.state === 'return';
        const fr = moving ? Math.floor(now / 140 + mo.hx) % 2 : Math.floor(now / 600 + mo.hx) % 2, img = PX.mob(mo.type, fr);
        const flip = (mo.state === 'chase' ? g.p.x : (mo.tx ?? mo.x)) < mo.x;
        shadow(mo.x, o.y, Math.round(img.width / 3), 2);
        if (mo.hurt > 0) x.globalAlpha = .55 + .45 * Math.sin(now / 30);
        blit(img, mo.x, o.y, Math.round(img.width / 2), img.height - 2, flip); x.globalAlpha = 1;
        this._labels.push({ mob: mo, top: sy(o.y) - img.height });
      }
      else if (o.kind === 'hero') {
        const p = g.p; if (p.dead) x.globalAlpha = .45;
        shadow(p.x, o.y, 8, 2);
        const img = PX.heroFrame(p, now, g); blit(img, p.x, o.y, 24, 47, p.face < 0); x.globalAlpha = 1;
      }
    }
    // drifting petals / leaves
    const petals = art.petals ?? (id === 'jade' ? 18 : 34), pr = PX.rnd(99);
    for (let i = 0; i < petals; i++) {
      const bx = pr() * LW, by = pr() * LH, sp = 6 + pr() * 10;
      const px = ((bx + t * sp * .7 + Math.sin(t + i) * 6) % LW + LW) % LW, py = ((by + t * sp) % LH + LH) % LH;
      PX.r(x, art.petalCol ? art.petalCol[i % art.petalCol.length] : id === 'jade' ? (i % 2 ? '#9fd45c' : '#d8f0a8') : (i % 3 ? '#ffb3cf' : '#ffe1ec'), px | 0, py | 0, 2, 1);
    }
    // blit pixel layer
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.imageSmoothingEnabled = false;
    ctx.drawImage(this.low, 0, 0, LW, LH, 0, 0, LW * S * dpr, LH * S * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.translate(-cx, -cy);
    // soft layers: fog, lantern glow, portals, drops, fx, labels, floats
    if (art.fog) { const fg = ctx.createLinearGradient(cx, cy, cx, cy + H); fg.addColorStop(0, 'rgba(220,240,230,.22)'); fg.addColorStop(.5, 'rgba(220,240,230,.04)'); fg.addColorStop(1, 'rgba(220,240,230,.16)'); ctx.fillStyle = fg; ctx.fillRect(cx, cy, W, H); }
    if (art.night) { ctx.fillStyle = art.night; ctx.fillRect(cx, cy, W, H); const hx = g.p.x, hy = g.p.y - 40, gr0 = ctx.createRadialGradient(hx, hy, 40, hx, hy, 420); gr0.addColorStop(0, 'rgba(0,0,0,0)'); gr0.addColorStop(1, 'rgba(4,6,14,.45)'); ctx.fillStyle = gr0; ctx.fillRect(cx, cy, W, H); }
    ctx.globalCompositeOperation = 'lighter';
    for (const l of this._labels) if (l.glow) { const k = .8 + .2 * Math.sin(t * 3 + l.x); const gr = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.r); gr.addColorStop(0, l.col ? l.col.replace('A', .4 * k) : `rgba(255,200,90,${.35 * k})`); gr.addColorStop(1, 'rgba(255,160,60,0)'); ctx.fillStyle = gr; ctx.fillRect(l.x - l.r, l.y - l.r, l.r * 2, l.r * 2); }
    for (const pt of m.portals || []) {
      const px = pt.x + pt.w / 2, py = pt.y + pt.h / 2, rr = Math.max(pt.w, pt.h) * .55, k = .7 + .3 * Math.sin(t * 2.5);
      const gr = ctx.createRadialGradient(px, py, 0, px, py, rr); gr.addColorStop(0, `rgba(120,230,255,${.42 * k})`); gr.addColorStop(1, 'rgba(60,160,255,0)');
      ctx.fillStyle = gr; ctx.beginPath(); ctx.ellipse(px, py, rr, rr * .7, 0, 0, 7); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    for (const pt of m.portals || []) {
      const px = pt.x + pt.w / 2, py = pt.y + pt.h / 2;
      ctx.strokeStyle = 'rgba(190,245,255,.75)'; ctx.lineWidth = 2; ctx.setLineDash([6, 8]); ctx.lineDashOffset = -t * 20;
      ctx.beginPath(); ctx.ellipse(px, py, pt.w * .45 + 10, Math.min(pt.h, pt.w) * .3 + 8, 0, 0, 7); ctx.stroke(); ctx.setLineDash([]);
      this.label(ctx, '➜ ' + pt.label, px, pt.y - 6, '#e6fbff', 14);
    }
    if (this.softHook) this.softHook(ctx, t);
    for (const d of g.drops) this.drawDrop(ctx, d);
    for (const f of g.fx) {
      if (f.kind === 'slash') {
        const k = Math.max(0, f.t / .3), a0 = f.face > 0 ? -1.1 : Math.PI - .9 + .2, a1 = f.face > 0 ? 1.1 : Math.PI + 1.1;
        ctx.save(); ctx.globalAlpha = Math.min(1, k * 2.2); ctx.shadowColor = '#5fd8ff'; ctx.shadowBlur = 18;
        ctx.strokeStyle = 'rgba(120,220,255,.9)'; ctx.lineWidth = 16; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.ellipse(f.x + f.face * 10, f.y - 34, f.r * 1.15, f.r * 1.35, 0, a0, a1); ctx.stroke();
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(f.x + f.face * 10, f.y - 34, f.r * 1.15, f.r * 1.35, 0, a0 + .15, a1 - .15); ctx.stroke(); ctx.restore();
      } else if (f.kind === 'ring') {
        const k = 1 - f.t / .4; ctx.save(); ctx.strokeStyle = f.color; ctx.shadowColor = f.color; ctx.shadowBlur = 14; ctx.globalAlpha = Math.max(0, f.t * 2.4); ctx.lineWidth = 5;
        ctx.beginPath(); ctx.ellipse(f.x, f.y, f.r * k, f.r * k * .6, 0, 0, 7); ctx.stroke(); ctx.restore();
      }
    }
    for (const l of this._labels) {
      if (l.npc) { const n = l.npc; this.label(ctx, n.name, n.x, n.y - 130, '#ffd56a', 13); const k = .6 + .4 * Math.sin(now / 300); ctx.globalAlpha = k; this.bubble(ctx, n.x, n.y - 156); ctx.globalAlpha = 1; }
      if (l.mob) {
        const mo = l.mob, d = MONSTERS[mo.type], topY = (l.top + oy) * S - 8;
        this.label(ctx, d.name, mo.x, topY - 20, d.boss ? '#ffd56a' : '#ffffff', d.boss ? 15 : 13);
        const bw = d.boss ? 96 : 60, bx = mo.x - bw / 2, by = topY - 14;
        ctx.fillStyle = 'rgba(16,14,18,.85)'; ctx.beginPath(); ctx.roundRect(bx - 2, by - 2, bw + 4, 14, 4); ctx.fill();
        ctx.fillStyle = '#5a1a1a'; ctx.fillRect(bx, by, bw, 10); ctx.fillStyle = d.boss ? '#ff6a4a' : '#e8463a'; ctx.fillRect(bx, by, bw * Math.max(0, mo.hp / mo.max), 10);
        ctx.font = "700 9px 'IBM Plex Sans Thai',sans-serif"; ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; ctx.fillText('Lv.' + d.lv, mo.x, by + 8.5);
      }
    }
    ctx.textAlign = 'center';
    for (const f of g.floats) {
      ctx.globalAlpha = Math.min(1, f.t * 1.6);
      ctx.font = f.miss ? "italic 800 22px 'IBM Plex Sans Thai', sans-serif" : (f.big ? "900 36px " : "900 28px ") + "'IBM Plex Sans Thai', sans-serif";
      ctx.lineWidth = 6; ctx.lineJoin = 'round'; ctx.strokeStyle = '#2a140c'; ctx.strokeText(f.text, f.x, f.y - 40);
      if (f.miss) ctx.fillStyle = f.color; else { const gr = ctx.createLinearGradient(f.x, f.y - 66, f.x, f.y - 40); gr.addColorStop(0, '#fff3a8'); gr.addColorStop(1, f.color === '#f0604e' ? '#f0604e' : '#f7b02b'); ctx.fillStyle = gr; }
      ctx.fillText(f.text, f.x, f.y - 40); ctx.globalAlpha = 1;
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (g.p.dead) { ctx.save(); ctx.scale(dpr, dpr); ctx.fillStyle = 'rgba(80,12,8,.35)'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = '#f5e7c8'; ctx.textAlign = 'center'; ctx.font = "800 32px 'Noto Serif Thai', serif"; ctx.fillText('พ่ายแพ้', W / 2, H / 2); ctx.restore(); }
    this.drawMini();
  };
  CP.label = function (ctx, text, x, y, color, size) {
    ctx.font = `700 ${Math.round(size * (PX.S === 2 ? .8 : 1))}px 'IBM Plex Sans Thai',sans-serif`; ctx.textAlign = 'center'; ctx.lineJoin = 'round';
    ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(20,14,12,.95)'; ctx.strokeText(text, x, y); ctx.fillStyle = color; ctx.fillText(text, x, y);
  };
  CP.bubble = function (ctx, x, y) {
    ctx.fillStyle = '#ffd24a'; ctx.strokeStyle = '#3a2408'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 9, 0, 7); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#3a2408'; ctx.font = "900 13px 'IBM Plex Sans Thai',sans-serif"; ctx.textAlign = 'center'; ctx.fillText('!', x, y + 5);
  };
  CP.drawMini = function () {
    const cv = this.miniRef.current; if (!cv) return;
    const ctx = cv.getContext('2d'), m = this.mapDef(), g = this.g, z = this.state.zoom, id = mapId(this);
    PX.prep(m, id); const T = PX.terrain(m, id);
    ctx.imageSmoothingEnabled = false; ctx.fillStyle = '#16202a'; ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.save();
    const sx = cv.width / m.w * z, sy = cv.height / m.h * z;
    if (z > 1) ctx.translate(cv.width / 2 - g.p.x * sx, cv.height / 2 - g.p.y * sy);
    ctx.drawImage(T, 0, 0, m.w * sx, m.h * sy);
    ctx.fillStyle = '#4a4f5c'; for (const c of (m.colliders || [])) if (!(PX.art[id].cliffs || []).includes(c)) ctx.fillRect(c[0] * sx, c[1] * sy, c[2] * sx, c[3] * sy);
    ctx.fillStyle = '#5fe0ff'; for (const p of (m.portals || [])) { ctx.beginPath(); ctx.arc((p.x + p.w / 2) * sx, (p.y + p.h / 2) * sy, 4, 0, 7); ctx.fill(); }
    ctx.fillStyle = '#ff5a4a'; for (const mo of g.mobs) if (!mo.dead) ctx.fillRect(mo.x * sx - 1.5, mo.y * sy - 1.5, 3, 3);
    ctx.fillStyle = '#ffd24a'; for (const n of (m.npcs || [])) ctx.fillRect(n.x * sx - 2, n.y * sy - 2, 4, 4);
    ctx.save(); ctx.translate(g.p.x * sx, g.p.y * sy); ctx.rotate(Math.PI / 4); ctx.fillStyle = '#5fd8ff'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.fillRect(-4, -4, 8, 8); ctx.strokeRect(-4, -4, 8, 8); ctx.restore();
    ctx.restore();
  };
  // attack pose timing for basic attacks and skills
  const oba = CP.basicAttack;
  CP.basicAttack = function () { const g = this.g, p = g.p, a0 = p.atkT, n0 = g.fx.length; oba.call(this); if (p.atkT > 0 && !a0) { p.atkMax = p.atkT; if (g.fx.length > n0) g.fx[g.fx.length - 1].t = .3; } };
  const oem = CP.enterMap;
  CP.enterMap = function (id, tx, ty) {
    PX.prep(MAPS[id], id); oem.call(this, id, tx, ty);
    const rnd = PX.rnd(id.length * 13 + 5);
    for (const mo of this.g.mobs) for (let k = 0; k < 40 && this.blocked(mo.x, mo.y, mo.r + 6); k++) { mo.x = mo.hx + (rnd() - .5) * 300; mo.y = mo.hy + (rnd() - .5) * 300; if (!this.blocked(mo.x, mo.y, mo.r + 6)) { mo.hx = mo.x; mo.hy = mo.y; } }
  };
  const ous = CP.useSkill;
  CP.useSkill = function (id) { const p = this.g.p, mp0 = p.mp; ous.call(this, id); if (p.mp < mp0 && !(p.atkT > 0)) { p.atkT = p.atkMax = .36; } };
  // HUD extras: avatar, menu icons, intro chat lines
  const orv = CP.renderVals;
  CP.renderVals = function () {
    const v = orv.call(this);
    const icons = ['gift', 'lantern', 'tools', 'gourd', 'gate', 'scroll', 'bag', 'menu'];
    v.topMenu = v.topMenu.map((t, i) => ({ ...t, icon: PX.url(PX.icon(icons[i]), 2) }));
    if (v.topMenu[3]) { v.topMenu[3].label = 'วิชา'; const sk = () => this.togglePanel('skills'); v.topMenu[3].onClick = sk; }
    v.avatarUrl = PX.avatar();
    v.swordIcon = PX.url(PX.icon('sword'), 3); v.starIcon = PX.url(PX.icon('star'), 2); v.bagIcon = PX.url(PX.icon('gourd'), 2);
    const g = this.g, need = EXP_TABLE[g.level] || 1;
    v.expText = 'EXP ' + Math.floor(g.exp) + ' / ' + need;
    v.skillTiles = [{ glyph: '⚔', on: true }, ...SKILLS.slice(0, 4).map(s => ({ glyph: s.glyph, on: !!g.skillLv[s.id] }))].map(s => ({ glyph: s.glyph, color: s.on ? '#ffe6a8' : '#8a7a62', bg: s.on ? 'linear-gradient(#3a2c1c,#1e160e)' : 'linear-gradient(#262019,#14100c)' }));
    const os = v.onStart;
    v.onStart = () => {
      os(); const g = this.g, st = MAPS.village.start; g.p.x = st.x; g.p.y = st.y; g.log = [];
      this.push('ยินดีต้อนรับสู่ Swordia', '#ffd56a');
      this.push('คุณเดินทางมาถึง' + MAPS.village.name, '#e9eef4');
      this.push('WASD หรือคลิกเพื่อเคลื่อนที่', '#e9eef4');
      this.push('คลิกมอนสเตอร์เพื่อโจมตีเป้าหมาย', '#e9eef4');
      this.push('Space โจมตี · 1 ใช้วิชากระบี่ · E คุยกับ NPC', '#e9eef4');
    };
    return v;
  };
  const om = CP.componentDidMount;
  CP.componentDidMount = function () {
    om.call(this); window.__swordia = this;
    // shrink the HUD (not the world canvas) on small screens so panels do not overlap
    const fit = () => {
      const cv = this.canvasRef.current, root = cv && cv.parentElement; if (!root) return;
      const k = Math.max(.38, Math.min(1, innerWidth / 1280, innerHeight / 820));
      for (const el of root.children) if (el !== cv) el.style.zoom = k;
    };
    this.hudFit = fit; fit(); addEventListener('resize', fit);
    this.hudObs = new MutationObserver(fit); const cv = this.canvasRef.current; if (cv) this.hudObs.observe(cv.parentElement, { childList: true });
  };
  const od = CP.derived;
  CP.derived = function () { const D = od.call(this); D.spd *= 1.35; return D; };
}
