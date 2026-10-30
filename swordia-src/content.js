
/* ==========================================================================
   Aurelion content, part 2: pixel sprites (monsters, NPCs, pets, fashion,
   scenery) and behaviour (dialogue, teleport, wardrobe, pets, level 30).
   ========================================================================== */
{
  const R = PX.r, E = PX.e, P = PX.poly, Ln = PX.line;

  /* ---------- monster sprites ---------- */
  const quad = (x, f, o) => {
    const j = f ? -1 : 0, w = o.w, by = o.by;
    if (o.tail) Ln(x, o.c[0], 6, by - 6 + j, 1, by - 12 + j - (f ? 2 : 0), 2);
    E(x, o.c[0], Math.round(w * .42), by - 6 + j, Math.round(w * .3), o.bh || 6); E(x, o.c[1], Math.round(w * .42), by - 3 + j, Math.round(w * .22), 2);
    if (o.spots) for (let i = 0; i < 9; i++) R(x, o.spots, 7 + (i * 7) % Math.round(w * .55), by - 10 + (i * 3) % 7 + j, 2, 2);
    if (o.stripes) for (let i = 0; i < 5; i++) R(x, o.stripes, 9 + i * 5, by - 11 + j, 2, 7);
    const hx = Math.round(w * .75), hy = by - 10 + j; E(x, o.c[0], hx, hy, o.hr || 6, (o.hr || 6) - 1);
    P(x, o.c[0], [hx + 3, hy, hx + 10, hy + 2, hx + 4, hy + 4]); R(x, '#1a1418', hx + 9, hy + 1, 1, 1);
    R(x, o.eye || '#ffd84a', hx + 2, hy - 2, 2, 2);
    if (o.ears !== false) { P(x, o.c[2] || o.c[0], [hx - 4, hy - 4, hx - 2, hy - 10, hx, hy - 5]); P(x, o.c[2] || o.c[0], [hx, hy - 5, hx + 3, hy - 10, hx + 3, hy - 4]); }
    if (o.spots) { R(x, o.spots, hx - 2, hy - 3, 1, 1); R(x, o.spots, hx + 1, hy + 2, 1, 1); }
    if (o.stripes) { R(x, o.stripes, hx - 1, hy - 4, 1, 3); R(x, o.stripes, hx + 2, hy - 4, 1, 3); }
    const lg = o.c[2] || '#3a2a22';
    for (const [lx, k] of [[Math.round(w * .2), 0], [Math.round(w * .32), 1], [Math.round(w * .55), 0], [Math.round(w * .66), 1]]) R(x, lg, lx, by - 3, 3, 4 + ((k ^ f) ? 1 : 0));
  };
  const hum = (x, f, o) => {
    const H = o.h, cx = o.cx || 20, j = f ? -1 : 0, fl = o.float ? (f ? -2 : 0) : 0, by = H - 2 + fl;
    if (!o.float) { R(x, o.leg || '#2a2430', cx - 5, by - 8, 4, 8); if (!o.oneLeg) R(x, o.leg || '#2a2430', cx + 1, by - 8, 4, 8); }
    if (o.hairLong) { E(x, o.hairLong, cx, by - 32 + j, 9, 8); P(x, o.hairLong, [cx - 9, by - 32 + j, cx + 9, by - 32 + j, cx + 8, by - 12, cx - 8, by - 12]); }
    P(x, o.robe, [cx - 7, by - 27 + j, cx + 7, by - 27 + j, cx + 10, by - 7, cx - 10, by - 7]);
    if (o.float) P(x, o.robe, [cx - 9, by - 8, cx + 9, by - 8, cx + 3, by + 1, cx - 1, by - 2, cx - 4, by + 2]);
    if (o.robe2) { R(x, o.robe2, cx - 1, by - 26 + j, 3, 19); R(x, o.robe2, cx - 8, by - 16, 17, 2); }
    if (o.armsFwd) { R(x, o.robe, cx + 3, by - 24 + j, 13, 4); R(x, o.skin, cx + 15, by - 24 + j, 3, 4); }
    else { R(x, o.robe, cx - 10, by - 25 + j, 3, 11); R(x, o.robe, cx + 8, by - 25 + j, 3, 11); R(x, o.skin, cx - 10, by - 15 + j, 3, 3); R(x, o.skin, cx + 8, by - 15 + j, 3, 3); }
    if (o.club) { Ln(x, '#6b4428', cx + 10, by - 14, cx + 16, by - 30, 3); E(x, '#7a5233', cx + 16, by - 31, 3, 4); }
    if (o.sword) { Ln(x, '#c8ccd2', cx + 10, by - 14, cx + 18, by - 32, 2); R(x, '#8a6a3a', cx + 8, by - 15, 5, 2); }
    if (o.noHead) { E(x, o.skin, cx - 12, by - 14, 4, 4); R(x, '#8a1a1a', cx - 13, by - 11, 3, 2); R(x, '#8a1a1a', cx - 3, by - 28 + j, 7, 2); return; }
    const hy = by - 33 + j;
    E(x, o.skin, cx, hy, o.hr || 7, o.hr || 7);
    if (o.skull) { R(x, '#1a1418', cx - 4, hy - 1, 3, 3); R(x, '#1a1418', cx + 2, hy - 1, 3, 3); R(x, '#1a1418', cx - 2, hy + 4, 5, 1); }
    else if (!o.mask) { R(x, o.eyes || '#ff3a3a', cx - 4, hy - 1, 2, 2); R(x, o.eyes || '#ff3a3a', cx + 2, hy - 1, 2, 2); if (o.mouth) R(x, o.mouth, cx - 2, hy + 3, 4, 1); }
    if (o.hair) { E(x, o.hair, cx, hy - 5, 8, 4); R(x, o.hair, cx - 8, hy - 4, 3, 6); R(x, o.hair, cx + 6, hy - 4, 3, 6); }
    if (o.wild) for (let i = -8; i <= 8; i += 3) Ln(x, o.wild, cx + i, hy - 5, cx + i * 1.4, hy - 11 - (i & 3), 1);
    if (o.mask) { E(x, '#e83a3a', cx, hy, 9, 8); R(x, '#ffd84a', cx - 8, hy - 2, 17, 2); R(x, '#3aa84a', cx - 8, hy + 2, 17, 2); E(x, '#ffffff', cx - 4, hy - 1, 2, 2); E(x, '#ffffff', cx + 4, hy - 1, 2, 2); R(x, '#1a1418', cx - 4, hy - 1, 1, 1); R(x, '#1a1418', cx + 4, hy - 1, 1, 1); P(x, '#ffd84a', [cx - 7, hy - 7, cx - 4, hy - 16, cx - 1, hy - 7]); P(x, '#3a8ad8', [cx + 1, hy - 7, cx + 4, hy - 16, cx + 7, hy - 7]); }
    if (o.qing) { R(x, '#1e2a3a', cx - 8, hy - 9, 17, 4); R(x, '#2a3a52', cx - 6, hy - 12, 13, 4); E(x, '#e83a3a', cx, hy - 13, 2, 2); R(x, '#ffe066', cx - 1, hy - 6, 3, 9); R(x, '#c4303c', cx, hy - 4, 1, 5); }
    if (o.chada) { P(x, '#e8b030', [cx - 7, hy - 5, cx + 7, hy - 5, cx + 2, hy - 18, cx, hy - 22, cx - 2, hy - 18]); R(x, '#ff6a8a', cx - 1, hy - 12, 2, 2); }
    if (o.ears) { P(x, o.skin, [cx - 7, hy - 2, cx - 13, hy - 6, cx - 7, hy + 2]); P(x, o.skin, [cx + 7, hy - 2, cx + 13, hy - 6, cx + 7, hy + 2]); }
    if (o.tusk) { R(x, '#f4efe4', cx - 4, hy + 3, 2, 3); R(x, '#f4efe4', cx + 3, hy + 3, 2, 3); }
    if (o.beard) P(x, '#f4f2ec', [cx - 5, hy + 3, cx + 5, hy + 3, cx + 2, hy + 14, cx - 2, hy + 14]);
    if (o.feathers) for (let i = -6; i <= 6; i += 3) P(x, ['#e83a3a', '#ffd84a', '#3aa8d8'][(i + 6) % 3], [cx + i - 1, hy - 6, cx + i * 1.6, hy - 18, cx + i + 1, hy - 6]);
    if (o.necklace) for (let i = -6; i <= 6; i += 3) E(x, '#f4efe4', cx + i, by - 26 + j, 1, 1);
  };
  const MON_SPR = {
    slime: [30, 24, (x, f) => { const j = f ? 2 : 0; E(x, '#5ac8f0', 15, 15 + j / 2, 11 + j, 8 - j); E(x, '#8fe0ff', 11, 11 + j, 4, 2); R(x, '#ffffff', 9, 10 + j, 2, 1); R(x, '#1a2a3a', 12, 15, 2, 3); R(x, '#1a2a3a', 18, 15, 2, 3); R(x, '#2a7ab0', 14, 20, 4, 1); }],
    goblin: [44, 46, (x, f) => hum(x, f, { h: 46, robe: '#7a5a3a', robe2: '#5a3a22', skin: '#7ab84a', ears: 1, eyes: '#ffd84a', mouth: '#2a1a14', club: 1, hr: 7 })],
    bat: [40, 30, (x, f) => { const w = f ? 6 : 0; P(x, '#5a3f84', [20, 14, 2, 6 + w, 6, 16, 10, 12 + w / 2, 14, 18]); P(x, '#5a3f84', [20, 14, 38, 6 + w, 34, 16, 30, 12 + w / 2, 26, 18]); E(x, '#3a2a58', 20, 15, 6, 6); P(x, '#3a2a58', [15, 10, 16, 4, 19, 9]); P(x, '#3a2a58', [21, 9, 24, 4, 25, 10]); R(x, '#7ae8ff', 17, 14, 2, 2); R(x, '#7ae8ff', 22, 14, 2, 2); P(x, '#9ff2ff', [4, 6 + w, 2, 2 + w, 7, 5 + w]); P(x, '#9ff2ff', [36, 6 + w, 38, 2 + w, 33, 5 + w]); }],
    skel: [42, 50, (x, f) => hum(x, f, { h: 50, robe: '#cfc8b8', robe2: '#8a8478', skin: '#ece6d8', skull: 1, leg: '#cfc8b8', sword: 1 })],
    krak: [84, 84, (x, f) => { const j = f ? -1 : 0; R(x, '#4a4c58', 22, 64, 12, 18); R(x, '#4a4c58', 50, 64, 12, 18); E(x, '#5e6070', 42, 46 + j, 26, 22); E(x, '#7a7d8c', 36, 40 + j, 16, 12); R(x, '#5e6070', 8, 34 + j, 12, 30); R(x, '#5e6070', 64, 34 + j, 12, 30); E(x, '#6e7080', 14, 64 + j, 7, 6); E(x, '#6e7080', 70, 64 + j, 7, 6); E(x, '#6e7080', 42, 20 + j, 13, 11); R(x, '#7ae8ff', 36, 18 + j, 4, 3); R(x, '#7ae8ff', 45, 18 + j, 4, 3); for (const [cx, cy, h] of [[30, 30, 14], [42, 26, 18], [54, 32, 12], [16, 30, 10], [68, 30, 10], [36, 50, 8]]) { P(x, '#6fd8f5', [cx - 4, cy + j, cx, cy - h + j, cx + 4, cy + j]); R(x, '#d8fbff', cx - 1, cy - h + 4 + j, 1, h - 6); } }],
    takhon: [42, 52, (x, f) => hum(x, f, { h: 52, robe: '#c4303c', robe2: '#ffd84a', skin: '#f4e8d8', mask: 1, leg: '#3a5ad8' })],
    pret: [40, 72, (x, f) => { const j = f ? -1 : 0; R(x, '#7a7a86', 14, 52, 3, 18); R(x, '#7a7a86', 23, 52, 3, 18); P(x, '#8a8a96', [12, 30 + j, 28, 30 + j, 30, 54, 10, 54]); R(x, '#8a8a96', 8, 32 + j, 3, 20); R(x, '#8a8a96', 29, 32 + j, 3, 20); R(x, '#9a9aa6', 18, 16 + j, 4, 15); E(x, '#a8a8b4', 20, 10 + j, 6, 7); R(x, '#ff3a3a', 17, 9 + j, 2, 2); R(x, '#ff3a3a', 22, 9 + j, 2, 2); R(x, '#1a1418', 20, 14 + j, 1, 1); for (let i = 0; i < 5; i++) R(x, '#5a5a66', 12 + i * 4, 4 + j, 1, 4); }],
    krasue: [34, 50, (x, f) => { const j = f ? -2 : 0; for (let i = 0; i < 5; i++) Ln(x, i % 2 ? '#ff4a6a' : '#8a1a3a', 12 + i * 2, 20 + j, 10 + i * 3 + (f ? 1 : -1), 44 + (i % 3) * 2, 1); E(x, '#ff5a8a', 17, 24 + j, 4, 3); E(x, '#1d1a22', 17, 12 + j, 11, 11); E(x, '#f4e8e0', 17, 14 + j, 7, 7); R(x, '#ff3a3a', 14, 13 + j, 2, 2); R(x, '#ff3a3a', 19, 13 + j, 2, 2); R(x, '#8a1a1a', 15, 18 + j, 5, 1); for (let i = 0; i < 5; i++) R(x, '#1d1a22', 7 + i * 5, 16 + j, 2, 9 - (i % 2) * 3); }],
    kongkoi: [36, 40, (x, f) => hum(x, f, { h: 40, cx: 18, robe: '#3a2a22', robe2: '#5a4232', skin: '#5a4232', oneLeg: 1, leg: '#2a1e18', wild: '#2a1e18', eyes: '#ffd84a', hr: 6 })],
    phrai: [40, 54, (x, f) => hum(x, f, { h: 54, robe: '#4a8a9a', robe2: '#8ad8e0', skin: '#dceef0', hairLong: '#141a22', float: 1, eyes: '#1a1418', mouth: '#5a6a7a' })],
    nangram: [40, 56, (x, f) => hum(x, f, { h: 56, robe: '#c4303c', robe2: '#e8b030', skin: '#f4ece4', chada: 1, float: 1, eyes: '#1a1418', mouth: '#c4303c' })],
    phidip: [40, 54, (x, f) => hum(x, f, { h: 54, robe: '#2a4a7a', robe2: '#ffd84a', skin: '#b8d0c0', qing: 1, armsFwd: 1, leg: '#1e2a3a', eyes: '#1a1418' })],
    pop: [40, 52, (x, f) => hum(x, f, { h: 52, robe: '#5a5a62', robe2: '#3a3a42', skin: '#b8b0a4', wild: '#e8e4dc', hair: '#d8d4cc', mouth: '#8a1a1a' })],
    saming: [52, 34, (x, f) => quad(x, f, { w: 52, by: 32, c: ['#e8842a', '#fff0d8', '#3a2418'], stripes: '#2a1810', tail: 1, eye: '#7aff7a', hr: 7 })],
    pusom: [64, 76, (x, f) => { const j = f ? -1 : 0; x.save(); x.translate(12, 0); hum(x, f, { h: 70, robe: '#c89a3a', robe2: '#f0d070', skin: '#e8dcc8', beard: 1, hair: '#f4f2ec', eyes: '#7aff9a', float: 1, hr: 8 }); x.restore(); E(x, '#d8a840', 10, 64, 8, 5); R(x, '#ffd84a', 6, 60, 8, 2); R(x, '#8a5a1a', 9, 56, 3, 3); for (let i = 0; i < 4; i++) R(x, '#fff0a0', 4 + i * 3, 61 - j, 1, 1); }],
    dartfrog: [28, 20, (x, f) => { const j = f ? -3 : 0; E(x, '#2a7ae8', 14, 13 + j, 10, 6); E(x, '#4a9aff', 12, 11 + j, 6, 3); for (const [a, b] of [[8, 12], [14, 10], [19, 14], [11, 16]]) R(x, '#1a1418', a, b + j, 2, 2); E(x, '#2a7ae8', 9, 7 + j, 3, 3); E(x, '#2a7ae8', 19, 7 + j, 3, 3); R(x, '#ffd84a', 8, 6 + j, 2, 2); R(x, '#ffd84a', 18, 6 + j, 2, 2); R(x, '#1a5ab8', 3, 17, 5, 2); R(x, '#1a5ab8', 20, 17, 5, 2); }],
    jaguar: [50, 32, (x, f) => quad(x, f, { w: 50, by: 30, c: ['#e8b84a', '#fff4d8', '#5a3a1a'], spots: '#3a2210', tail: 1, eye: '#7aff7a', hr: 6 })],
    spider: [44, 30, (x, f) => { const j = f ? 1 : 0; for (let i = 0; i < 4; i++) { Ln(x, '#3a2418', 18, 16, 4 - i * 1 - j, 8 + i * 6, 2); Ln(x, '#3a2418', 26, 16, 40 + i + j, 8 + i * 6, 2); } E(x, '#5a3a22', 16, 16, 10, 8); E(x, '#e8842a', 14, 14, 4, 3); E(x, '#4a2e1a', 28, 17, 6, 5); R(x, '#ff3a3a', 30, 15, 1, 1); R(x, '#ff3a3a', 32, 15, 1, 1); R(x, '#ff3a3a', 31, 17, 1, 1); R(x, '#f4efe4', 33, 20, 1, 2); }],
    ana: [50, 32, (x, f) => { const j = f ? 1 : 0; for (let i = 0; i < 18; i++) { const t = i / 17, cx = 4 + t * 36, cy = 22 + Math.sin(t * 6 + j) * 5; E(x, '#4a7a2a', Math.round(cx), Math.round(cy), 4, 3); if (i % 3 === 0) R(x, '#1e3a14', Math.round(cx) - 1, Math.round(cy) - 2, 2, 2); } E(x, '#5a8a32', 42, 14 + j, 6, 4); R(x, '#ffd84a', 44, 12 + j, 2, 1); Ln(x, '#e83a3a', 48, 15 + j, 50, 16 + j, 1); }],
    plant: [46, 56, (x, f) => { const o = f ? 2 : 0; R(x, '#3a7a2a', 21, 26, 5, 28); P(x, '#4a9a36', [23, 44, 6, 36, 10, 46]); P(x, '#4a9a36', [24, 40, 42, 32, 38, 44]); E(x, '#d8342a', 23, 20, 15, 12); E(x, '#ff6a5a', 23, 18, 11, 8); E(x, '#3a0a0a', 23, 20 + o, 9, 5 + o); for (let i = 0; i < 6; i++) { R(x, '#f4efe4', 16 + i * 3, 15 + o, 1, 2); R(x, '#f4efe4', 16 + i * 3, 24 + o, 1, 2); } for (const [a, b] of [[12, 10], [32, 9], [23, 6]]) R(x, '#ffe066', a, b, 2, 2); }],
    caiman: [60, 24, (x, f) => { const j = f ? 1 : 0; P(x, '#3a5a2a', [2, 14, 14, 10, 14, 18]); E(x, '#4a6a32', 26, 15, 16, 6); for (let i = 0; i < 8; i++) R(x, '#2a4a1e', 14 + i * 3, 9, 2, 2); P(x, '#4a6a32', [38, 11, 58, 14 + j, 58, 17 + j, 38, 19]); R(x, '#ffd84a', 42, 11, 2, 2); for (let i = 0; i < 5; i++) R(x, '#f4efe4', 45 + i * 3, 16 + j, 1, 1); R(x, '#2a4a1e', 16, 19, 4, 4); R(x, '#2a4a1e', 32, 19, 4, 4); }],
    ogre: [56, 66, (x, f) => hum(x, f, { h: 66, cx: 26, robe: '#7a5a3a', robe2: '#a87a4a', skin: '#8aa858', leg: '#6a8a42', eyes: '#ff3a3a', tusk: 1, club: 1, hr: 10 })],
    ogrechief: [74, 86, (x, f) => { x.save(); x.translate(8, 0); hum(x, f, { h: 84, cx: 30, robe: '#5a3a22', robe2: '#c89a3a', skin: '#6a8a42', leg: '#4a6a32', eyes: '#ffd84a', tusk: 1, club: 1, feathers: 1, necklace: 1, hr: 12 }); x.restore(); }],
  };
  const baseMob = PX.mob;
  PX.mob = (type, f) => { const d = MON_SPR[type]; return d ? PX.mk('mob_' + type + f, d[0], d[1], (x) => d[2](x, f)) : baseMob(type, f); };

  /* ---------- NPC looks ---------- */
  const baseNpc = PX.npc;
  const NPC_LOOK = {
    lyra: { robe: '#9aa4b8', robe2: '#c4303c', hair: '#d8582a', armor: 1, sword: 1 },
    orin: { robe: '#5a3a8a', robe2: '#c8a8f0', hair: '#e8e4dc', beard: 1, staff: 1 },
    kaze: { robe: '#2a3048', robe2: '#c4303c', hair: '#1d1a22', band: 1, pan: 1 },
    rook: { robe: '#4a6a3a', robe2: '#8a6a3a', hair: '#5a3a22', hood: 1, bow: 1 },
    mina: { robe: '#e88aa8', robe2: '#ffd8e4', hair: '#5a2a3a', bun: 1, scissors: 1 },
    ming: { robe: '#8a6a42', robe2: '#c8a878', hair: '#3a2a20', strawhat: 1, pet: 1 },
  };
  PX.npc = (id) => {
    const L = NPC_LOOK[id]; if (!L) return baseNpc(id);
    return PX.mk('npc_' + id, 44, 50, (x) => {
      const o = 2;
      P(x, L.robe, [12 + o, 24, 28 + o, 24, 31 + o, 47, 9 + o, 47]); R(x, L.robe2, 19 + o, 25, 2, 22); R(x, L.robe2, 11 + o, 33, 18, 2);
      if (L.armor) { R(x, '#c8ccd8', 12 + o, 24, 16, 8); R(x, '#e8ecf4', 13 + o, 25, 6, 2); R(x, '#8a90a0', 9 + o, 24, 5, 4); R(x, '#8a90a0', 26 + o, 24, 5, 4); }
      R(x, L.robe, 9 + o, 26, 3, 10); R(x, L.robe, 28 + o, 26, 3, 10); R(x, '#f2cfb0', 9 + o, 35, 3, 2); R(x, '#f2cfb0', 28 + o, 35, 3, 2);
      E(x, L.hair, 20 + o, 13, 9, 8); E(x, '#f6d8bd', 20 + o, 16, 7, 6); R(x, L.hair, 13 + o, 9, 14, 3);
      R(x, '#2a1c18', 17 + o, 16, 2, 2); R(x, '#2a1c18', 22 + o, 16, 2, 2);
      if (L.hood) { E(x, L.robe, 20 + o, 11, 10, 8); E(x, '#f6d8bd', 20 + o, 16, 6, 5); R(x, '#2a1c18', 17 + o, 16, 2, 2); R(x, '#2a1c18', 22 + o, 16, 2, 2); }
      if (L.beard) { P(x, '#f4f2ec', [15 + o, 19, 25 + o, 19, 22 + o, 29, 20 + o, 31, 18 + o, 29]); R(x, '#e8e4dc', 16 + o, 13, 9, 2); }
      if (L.bun) { E(x, L.hair, 20 + o, 5, 4, 3); R(x, '#ffd84a', 23 + o, 3, 5, 1); }
      if (L.band) R(x, '#c4303c', 12 + o, 11, 17, 2);
      if (L.strawhat) { E(x, '#e3c37a', 20 + o, 9, 13, 3); E(x, '#ecd08e', 20 + o, 6, 6, 4); R(x, '#c4303c', 15 + o, 8, 11, 1); }
      if (L.staff) { Ln(x, '#7a5233', 33 + o, 12, 34 + o, 48, 2); E(x, '#b08aff', 33 + o, 10, 3, 3); }
      if (L.sword) { Ln(x, '#c8ccd2', 32 + o, 22, 36 + o, 44, 2); R(x, '#e0b04a', 30 + o, 30, 5, 2); }
      if (L.bow) { for (let i = 0; i < 18; i++) R(x, '#8a5a32', 33 + o + Math.round(Math.sin(i / 17 * Math.PI) * 4), 22 + i, 1, 1); Ln(x, '#e8e4dc', 33 + o, 22, 33 + o, 39, 1); }
      if (L.pan) { E(x, '#3a3a42', 35 + o, 34, 5, 2); Ln(x, '#6b4428', 30 + o, 34, 28 + o, 30, 2); }
      if (L.scissors) { R(x, '#c8ccd2', 31 + o, 30, 2, 7); R(x, '#c8ccd2', 34 + o, 30, 2, 7); E(x, '#e83a5a', 32 + o, 38, 3, 2); }
      if (L.pet) { E(x, '#e39445', 35 + o, 42, 5, 3); E(x, '#e39445', 39 + o, 39, 3, 3); R(x, '#1a1418', 40 + o, 38, 1, 1); }
    });
  };

  /* ---------- pets ---------- */
  PX.pet = (id, f) => {
    const d = PET_DEFS[id], [c0, c1, c2] = d.c;
    return PX.mk('pet_' + id + f, 26, 24, (x) => {
      const j = f ? -1 : 0;
      if (d.kind === 'quad') {
        if (d.tail) Ln(x, d.tail === 'mane' ? c2 : c0, 5, 15 + j, 2, 9 + j, d.tail === 'fluffy' ? 3 : 2);
        E(x, c0, 11, 16 + j, 7, 4); E(x, c1, 11, 18 + j, 5, 1);
        if (d.shell) { E(x, '#b9862e', 11, 14 + j, 7, 4); R(x, '#8a6020', 8, 13 + j, 6, 1); }
        if (d.stripe) { R(x, c2, 9, 12 + j, 1, 4); R(x, c2, 12, 12 + j, 1, 4); }
        E(x, d.panda ? '#f7f7f4' : c0, 19, 11 + j, 5, 5); E(x, c1, 21, 13 + j, 3, 2);
        if (d.panda) { E(x, '#2a2a30', 18, 11 + j, 2, 2); E(x, '#2a2a30', 21, 11 + j, 2, 2); }
        R(x, '#1a1418', 18, 10 + j, 1, 2); R(x, '#1a1418', 21, 10 + j, 1, 2); R(x, '#1a1418', 23, 13 + j, 1, 1);
        if (d.ear === 'tri') { P(x, c0, [15, 9 + j, 16, 4 + j, 18, 8 + j]); P(x, c0, [20, 8 + j, 22, 4 + j, 23, 9 + j]); }
        else if (d.ear === 'round') { E(x, d.panda ? '#2a2a30' : c2, 15, 7 + j, 2, 2); E(x, d.panda ? '#2a2a30' : c2, 23, 7 + j, 2, 2); }
        else if (d.ear === 'floppy') { E(x, c2, 15, 9 + j, 2, 3); E(x, c2, 23, 9 + j, 2, 3); }
        if (d.horn) P(x, '#ffd24a', [19, 6 + j, 21, 0 + j, 22, 6 + j]);
        if (d.tail === 'mane') for (let i = 0; i < 4; i++) R(x, ['#ff9ac8', '#ffd86a', '#8ad8ff', '#c9a3ff'][i], 14 + i, 6 + j + i, 2, 2);
        for (const [lx, k] of [[6, 0], [9, 1], [13, 0], [16, 1]]) R(x, d.panda ? '#2a2a30' : c2, lx, 19, 2, 3 + ((k ^ f) ? 1 : 0));
      } else if (d.kind === 'hop') {
        const h = f ? -3 : 0; E(x, c0, 13, 16 + h, 8, 6); E(x, c1, 13, 19 + h, 5, 2);
        if (d.ear === 'long') { E(x, c0, 10, 6 + h, 2, 5); E(x, c0, 16, 6 + h, 2, 5); R(x, c2, 10, 4 + h, 1, 5); R(x, c2, 16, 4 + h, 1, 5); }
        else if (d.ear === 'round') { E(x, c0, 8, 10 + h, 2, 2); E(x, c0, 18, 10 + h, 2, 2); E(x, c2, 7, 17 + h, 2, 1); E(x, c2, 19, 17 + h, 2, 1); }
        else if (d.ear === 'frog') { E(x, c0, 9, 10 + h, 3, 3); E(x, c0, 17, 10 + h, 3, 3); R(x, '#ffffff', 9, 9 + h, 2, 2); R(x, '#ffffff', 17, 9 + h, 2, 2); for (const [a, b] of [[8, 16], [16, 18], [12, 14]]) R(x, c2, a, b + h, 2, 2); }
        R(x, '#1a1418', 10, 13 + h, 1, 2); R(x, '#1a1418', 16, 13 + h, 1, 2); R(x, c2, 12, 16 + h, 2, 1);
      } else if (d.kind === 'bird') {
        E(x, c0, 13, 14 + j, 7, 7); E(x, c1, 14, 17 + j, 4, 4); R(x, d.c[2], 19, 13 + j, 4, 2);
        if (d.bigEye) { E(x, '#ffffff', 11, 11 + j, 2, 2); E(x, '#ffffff', 16, 11 + j, 2, 2); R(x, '#1a1418', 11, 11 + j, 1, 1); R(x, '#1a1418', 16, 11 + j, 1, 1); P(x, c0, [7, 9 + j, 8, 4 + j, 10, 8 + j]); P(x, c0, [16, 8 + j, 18, 4 + j, 19, 9 + j]); }
        else R(x, '#1a1418', 16, 11 + j, 2, 2);
        P(x, c1 === '#f6f6f8' ? c0 : d.c[2], [8, 14 + j, 3, 12 + j + (f ? 3 : 0), 8, 18 + j]); R(x, '#f29a2a', 11, 21, 2, 2); R(x, '#f29a2a', 15, 21, 2, 2);
      } else if (d.kind === 'fly') {
        const w = f ? 4 : 0; P(x, c0, [13, 12, 1, 4 + w, 5, 14, 9, 16]); P(x, c0, [13, 12, 25, 4 + w, 21, 14, 17, 16]); E(x, d.c[1], 13, 13, 5, 5);
        if (d.horn) { P(x, '#ffd27a', [10, 9, 11, 4, 13, 8]); P(x, '#ffd27a', [14, 8, 16, 4, 17, 9]); E(x, c0, 13, 13, 5, 5); E(x, '#ffd27a', 13, 15, 3, 2); }
        R(x, '#1a1418', 11, 12, 1, 2); R(x, '#1a1418', 15, 12, 1, 2);
      } else if (d.kind === 'fairy') {
        const w = f ? 2 : 0; E(x, '#d8f4ff', 7, 10, 5, 4 + w); E(x, '#d8f4ff', 19, 10, 5, 4 + w); E(x, c0, 13, 15, 3, 5); E(x, '#f6d8bd', 13, 9, 4, 4); E(x, '#ffd84a', 13, 6, 4, 2); R(x, '#1a1418', 12, 9, 1, 1); R(x, '#1a1418', 15, 9, 1, 1); R(x, '#ffffff', 4, 4 + w, 1, 1); R(x, '#ffffff', 22, 5 - w, 1, 1);
      } else {
        const h = f ? 2 : 0; E(x, c0, 13, 16 + h / 2, 10 + h, 7 - h); E(x, c1, 9, 12 + h, 3, 2); R(x, '#1a2a3a', 10, 15, 2, 2); R(x, '#1a2a3a', 15, 15, 2, 2); R(x, d.c[2], 12, 19, 3, 1);
      }
    }, '#2a1c1e');
  };

  /* ---------- fashion on the hero ---------- */
  const COS_DRAW = {
    cos_straw: (x, hx, hy) => { E(x, '#e3c37a', hx, hy - 3, 14, 3); E(x, '#ecd08e', hx, hy - 7, 7, 4); R(x, '#c4303c', hx - 7, hy - 5, 14, 2); },
    cos_bamboo: (x, hx, hy) => { P(x, '#c8a05a', [hx - 15, hy - 2, hx + 15, hy - 2, hx, hy - 12]); for (let i = -12; i <= 12; i += 4) Ln(x, '#9a7a3a', hx, hy - 11, hx + i, hy - 2, 1); },
    cos_cat: (x, hx, hy) => { P(x, '#1d1a22', [hx - 9, hy - 5, hx - 7, hy - 15, hx - 2, hy - 8]); P(x, '#1d1a22', [hx + 2, hy - 8, hx + 7, hy - 15, hx + 9, hy - 5]); P(x, '#f4a6b8', [hx - 7, hy - 7, hx - 6, hy - 12, hx - 4, hy - 8]); P(x, '#f4a6b8', [hx + 4, hy - 8, hx + 6, hy - 12, hx + 7, hy - 7]); },
    cos_bunny: (x, hx, hy) => { E(x, '#f6f3ee', hx - 4, hy - 15, 2, 8); E(x, '#f6f3ee', hx + 4, hy - 15, 2, 8); R(x, '#f4a6b8', hx - 4, hy - 20, 1, 9); R(x, '#f4a6b8', hx + 4, hy - 20, 1, 9); },
    cos_fox: (x, hx, hy) => { P(x, '#e8842a', [hx - 10, hy - 5, hx - 8, hy - 16, hx - 2, hy - 8]); P(x, '#e8842a', [hx + 2, hy - 8, hx + 8, hy - 16, hx + 10, hy - 5]); P(x, '#fff4e6', [hx - 8, hy - 7, hx - 7, hy - 12, hx - 4, hy - 8]); P(x, '#fff4e6', [hx + 4, hy - 8, hx + 7, hy - 12, hx + 8, hy - 7]); },
    cos_panda: (x, hx, hy) => { E(x, '#1d1a22', hx - 8, hy - 8, 4, 4); E(x, '#1d1a22', hx + 8, hy - 8, 4, 4); },
    cos_sheep: (x, hx, hy) => { for (let i = 0; i < 7; i++) E(x, '#f7f4ec', hx - 9 + i * 3, hy - 7 - (i % 2) * 2, 4, 4); E(x, '#b9a27c', hx - 11, hy - 2, 3, 3); E(x, '#b9a27c', hx + 11, hy - 2, 3, 3); },
    cos_flower: (x, hx, hy) => { for (let i = 0; i < 7; i++) { const a = Math.PI + i / 6 * Math.PI; E(x, i % 2 ? '#ffb3cf' : '#ff7fae', Math.round(hx + Math.cos(a) * 10), Math.round(hy - 2 + Math.sin(a) * 6), 2, 2); } R(x, '#5aa84a', hx - 10, hy - 2, 20, 1); },
    cos_witch: (x, hx, hy) => { E(x, '#3a2858', hx, hy - 4, 14, 3); P(x, '#3a2858', [hx - 7, hy - 5, hx + 7, hy - 5, hx + 6, hy - 22, hx + 10, hy - 26]); R(x, '#ffd84a', hx - 6, hy - 7, 12, 2); },
    cos_crown: (x, hx, hy) => { R(x, '#e2b54a', hx - 7, hy - 9, 14, 4); for (let i = 0; i < 4; i++) P(x, '#e2b54a', [hx - 7 + i * 4, hy - 9, hx - 5 + i * 4, hy - 14, hx - 3 + i * 4, hy - 9]); R(x, '#8fd3ff', hx - 4, hy - 8, 2, 2); R(x, '#d65aa0', hx + 2, hy - 8, 2, 2); },
    cos_kcrown: (x, hx, hy) => { R(x, '#e2b54a', hx - 8, hy - 9, 16, 5); for (let i = 0; i < 5; i++) { P(x, '#f3d27a', [hx - 8 + i * 4, hy - 9, hx - 6 + i * 4, hy - 17 + (i % 2) * 3, hx - 4 + i * 4, hy - 9]); E(x, i % 2 ? '#d65aa0' : '#6fe0f0', hx - 6 + i * 4, hy - 17 + (i % 2) * 3, 1, 1); } R(x, '#c4303c', hx - 2, hy - 8, 4, 3); },
    cos_halo: (x, hx, hy) => { for (let i = 0; i < 28; i++) { const a = i / 28 * Math.PI * 2; R(x, '#ffe8a0', Math.round(hx + Math.cos(a) * 8), Math.round(hy - 15 + Math.sin(a) * 2.5), 2, 1); } },
  };
  const WINGS = {
    cos_angel: ['#ffffff', '#dfe8f6'], cos_batw: ['#5a3f84', '#2a1d3c'], cos_fairyw: ['#c8f0ff', '#ffd6ef'], cos_dragon: ['#d8452e', '#5a1a10'], cos_crystalw: ['#9ff2ff', '#4ab8e0'],
  };
  const OUTFIT = { cos_o_white: ['#e8e4dc', '#f6f2ea', '#d0cabe'], cos_o_red: ['#a8242e', '#c83a42', '#801a22'], cos_o_blue: ['#2a4a8a', '#3a62aa', '#1e3668'], cos_o_green: ['#2a7a4a', '#3a9a5e', '#1e5e38'], cos_o_pink: ['#e07aa0', '#f09abc', '#c45a82'], cos_o_gold: ['#c8902a', '#e8b84a', '#9a6a1a'] };
  const baseFrame = PX.heroFrame;
  PX.heroFrame = (p, now, g) => {
    const img = baseFrame(p, now), cos = (g && g.cos) || {};
    const key = [cos.head, cos.back, cos.outfit].join('|'); if (key === '||') return img;
    const ck = 'hc_' + PX.cache.size + '_'; // placeholder, replaced below
    const id = img.__id || (img.__id = 'f' + Math.random().toString(36).slice(2, 8));
    const k2 = 'herocos_' + id + key; let c = PX.cache.get(k2); if (c) return c;
    c = PX.canvas(img.width + 8, img.height + 12); const x = c.getContext('2d');
    // back items behind the body (sprite faces right, so the back is on the left)
    if (cos.back && WINGS[cos.back]) {
      const [w0, w1] = WINGS[cos.back], wy = 30 + 12; const flap = Math.sin(now / 160) > 0 ? 1 : 0;
      const wingc = PX.canvas(26, 26), wx = wingc.getContext('2d');
      P(wx, w1, [24, 10, 2, 2 + flap * 2, 6, 14, 2, 18, 12, 20, 24, 16]); P(wx, w0, [24, 10, 6, 5 + flap * 2, 9, 13, 6, 16, 14, 17, 24, 14]);
      if (cos.back === 'cos_batw' || cos.back === 'cos_dragon') for (let i = 6; i < 22; i += 5) Ln(wx, w1, 24, 11, i, 4 + flap * 2, 1);
      PX.finish(wingc, '#2a1c1e'); x.drawImage(wingc, 0, wy - 24);
    }
    x.drawImage(img, 4, 12);
    if (cos.outfit && OUTFIT[cos.outfit]) {
      const map = { '#3a3846': OUTFIT[cos.outfit][0], '#4a4858': OUTFIT[cos.outfit][1], '#34323e': OUTFIT[cos.outfit][0], '#2b2933': OUTFIT[cos.outfit][2] };
      const im = x.getImageData(0, 0, c.width, c.height), d = im.data, tbl = Object.entries(map).map(([a, b]) => [PX.hex(a), PX.hex(b)]);
      for (let i = 0; i < d.length; i += 4) for (const [a, b] of tbl) if (d[i] === a[0] && d[i + 1] === a[1] && d[i + 2] === a[2]) { d[i] = b[0]; d[i + 1] = b[1]; d[i + 2] = b[2]; break; }
      x.putImageData(im, 0, 0);
    }
    if (cos.head && COS_DRAW[cos.head]) {
      const hc = PX.canvas(40, 34), hx = hc.getContext('2d'); COS_DRAW[cos.head](hx, 20, 24); PX.finish(hc, '#2a1c1e');
      const bob = img.__bob || 0; x.drawImage(hc, 4 + 23 - 20, 12 + 10 + bob - 24 + 3);
    }
    c.__bob = img.__bob; PX.cache.set(k2, c); return c;
  };
  // remember each frame's head bob so hats sit on the head
  const baseHero = PX.hero;
  PX.hero = (kind, f) => { const c = baseHero(kind, f); if (c.__bob === undefined) c.__bob = kind === 'idle' ? f : kind === 'walk' ? [0, 1, 0, 1][f] : 0; return c; };

  /* ---------- scenery for the new maps ---------- */
  const reg = (k, w, h, fn, ol, opts) => { PX.extraProps[k] = Object.assign({ img: (v) => PX.mk(k + v, w, h, (x) => fn(x, v), ol), ax: (i) => Math.round(i.width / 2), ay: (i) => i.height - 2, pad: 30 }, opts || {}); };
  reg('crystal', 26, 30, (x, v) => { const cs = [['#6fd8f5', '#d8fbff'], ['#b08aff', '#ecdcff'], ['#7af0c0', '#dcfff2']][v % 3]; E(x, '#4a4c58', 13, 26, 10, 3); for (const [cx, h, w] of [[13, 24, 4], [7, 14, 3], [19, 17, 3]]) { P(x, cs[0], [cx - w, 26, cx, 26 - h, cx + w, 26]); R(x, cs[1], cx - 1, 28 - h, 1, h - 4); } }, '#1e2030', { sh: [9, 2, 0], glow: [40, 40, 'rgba(110,220,255,A)'] });
  reg('stalag', 22, 34, (x, v) => { P(x, '#6a6d7a', [3, 32, 11, 2 + v * 2, 19, 32]); P(x, '#8a8d9a', [7, 32, 11, 8 + v * 2, 13, 32]); }, '#2a2c36', { sh: [7, 2, 0] });
  reg('chedi', 34, 58, (x, v) => { const c = v % 2 ? ['#d8d2c4', '#bab4a6'] : ['#a8a294', '#8a8478']; R(x, c[1], 3, 48, 28, 8); R(x, c[0], 5, 42, 24, 7); E(x, c[0], 17, 36, 9, 7); R(x, c[1], 14, 26, 6, 4); P(x, c[0], [13, 26, 17, 3, 21, 26]); R(x, '#e8c25a', 16, 2, 2, 3); for (let i = 0; i < 6; i++) R(x, '#5a8a3a', 4 + i * 5, 47 - (i % 2) * 6, 2, 3); R(x, '#5a5048', 14, 49, 6, 7); }, '#3a3630', { sh: [14, 3, 2], pad: 50 });
  reg('deadtree', 40, 54, (x, v) => { Ln(x, '#4a3c34', 20, 53, 19, 20, 3); Ln(x, '#4a3c34', 19, 30, 8, 14 + v, 2); Ln(x, '#4a3c34', 20, 26, 32, 10, 2); Ln(x, '#4a3c34', 10, 18, 4, 12, 1); Ln(x, '#4a3c34', 30, 13, 36, 8, 1); Ln(x, '#4a3c34', 19, 22, 21, 6, 2); if (v % 2) { R(x, '#e8e4dc', 24, 22, 4, 8); R(x, '#c4303c', 24, 25, 4, 1); } }, '#1e1814', { sh: [10, 3, 2], pad: 40 });
  reg('buddha', 44, 52, (x) => { R(x, '#8a8478', 4, 44, 36, 7); E(x, '#a8a294', 22, 38, 16, 8); E(x, '#b8b2a4', 22, 26, 10, 10); E(x, '#c8c2b4', 22, 12, 7, 7); E(x, '#a8a294', 22, 5, 3, 3); R(x, '#5a5048', 18, 12, 2, 1); R(x, '#5a5048', 24, 12, 2, 1); for (let i = 0; i < 5; i++) R(x, '#6a9a4a', 6 + i * 7, 43, 3, 2); }, '#36322c', { sh: [16, 3, 2], pad: 60 });
  reg('jtree', 70, 84, (x, v) => { Ln(x, '#5a3a22', 35, 83, 33, 40, 5); Ln(x, '#5a3a22', 34, 60, 22, 44, 2); for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2, d = 10 + (i * 7) % 12; E(x, i % 3 ? '#2f6a26' : '#3f8a32', Math.round(35 + Math.cos(a) * d * 1.3), Math.round(30 + Math.sin(a) * d * .8), 10, 7); } for (let i = 0; i < 10; i++) E(x, '#5aa848', 25 + (i * 9) % 26, 20 + (i * 5) % 14, 3, 2); if (v % 2) for (let i = 0; i < 4; i++) E(x, '#ffd84a', 22 + i * 8, 40 + (i % 2) * 4, 2, 2); Ln(x, '#3a6a2a', 50, 38, 52, 70, 1); }, '#183a14', { sh: [22, 6, 4], pad: 55 });
  reg('fern', 30, 20, (x, v) => { for (let i = 0; i < 6; i++) { const a = Math.PI + i / 5 * Math.PI; P(x, i % 2 ? '#3f8a32' : '#5aa848', [15, 18, Math.round(15 + Math.cos(a) * 14), Math.round(18 + Math.sin(a) * 12), Math.round(15 + Math.cos(a + .25) * 10), Math.round(18 + Math.sin(a + .25) * 9)]); } if (v % 2) R(x, '#ff5a7a', 14, 6, 3, 3); }, '#1e3a18', { pad: 18 });
  reg('totem', 18, 44, (x) => { R(x, '#7a5233', 4, 4, 10, 38); for (const [y, c] of [[6, '#c4303c'], [18, '#e8b030'], [30, '#3a8ad8']]) { R(x, c, 3, y, 12, 9); R(x, '#1a1418', 6, y + 3, 2, 2); R(x, '#1a1418', 10, y + 3, 2, 2); R(x, '#f4efe4', 6, y + 6, 6, 1); } P(x, '#e8b030', [1, 4, 9, -2, 17, 4]); }, '#2a1a10', { sh: [6, 2, 0], pad: 40 });

  /* ---------- behaviour ---------- */
  const CP = Component.prototype;
  const ong = CP.newGame;
  CP.newGame = function () { const g = ong.call(this); g.cos = {}; g.wardrobe = []; g.pets = []; g.pet = null; g.petPos = null; g.petT = 0; return g; };
  CP.gainExp = function (n) {
    const g = this.g; g.exp += n;
    while (g.level < LV_CAP && g.exp >= EXP_TABLE[g.level]) {
      g.exp -= EXP_TABLE[g.level]; g.level++; g.statPoints += 5; g.skillPoints += 1;
      const D = this.derived(); g.p.hp = D.hpMax; g.p.mp = D.mpMax;
      this.push('เลื่อนขั้นเป็น Lv.' + g.level, '#f2c14e'); this.setState({ levelUp: Date.now() });
      clearTimeout(this._lu); this._lu = setTimeout(() => this.setState({ levelUp: 0 }), 2200);
    }
  };
  const ab = (g, k) => { const d = g.pet && PET_DEFS[g.pet]; return d && d.ab[0] === k ? d.ab[1] : 0; };
  const od = CP.derived;
  CP.derived = function () { const D = od.call(this), g = this.g; D.crit += ab(g, 'crit'); D.spd *= 1 + ab(g, 'spd') / 100; D.def += ab(g, 'def'); D.hpMax += ab(g, 'hp'); return D; };
  const okill = CP.kill;
  CP.kill = function (m) {
    const g = this.g, d = MONSTERS[m.type], gold0 = g.gold; okill.call(this, m);
    const gb = ab(g, 'gold'), xb = ab(g, 'xp'), db = ab(g, 'drop');
    if (gb) g.gold += Math.round((g.gold - gold0) * gb / 100);
    if (xb) this.gainExp(Math.round(d.exp * xb / 100));
    if (db) for (const [id, ch] of d.drops) if (Math.random() < ch * db / 100) g.drops.push({ id, x: m.x + (Math.random() - .5) * 46, y: m.y + (Math.random() - .5) * 34, t: 0, taken: false });
    if (d.boss) this.push('⚔ ปราบ ' + d.name + ' สำเร็จ!', '#ffd56a');
  };
  const odmg = CP.damage;
  CP.damage = function (m, base, isSkill) { const hp0 = m.hp; odmg.call(this, m, base, isSkill); const lb = ab(this.g, 'leech'); if (lb && m.hp < hp0) { const D = this.derived(); this.g.p.hp = Math.min(D.hpMax, this.g.p.hp + (hp0 - Math.max(0, m.hp)) * lb / 100); } };
  const oup = CP.update;
  CP.update = function (dt) {
    oup.call(this, dt);
    const g = this.g, p = g.p; if (!g.pet) return;
    if (!g.petPos || g.petMap !== g.map) { g.petPos = { x: p.x - 50, y: p.y + 10 }; g.petMap = g.map; }
    const tx = p.x - p.face * 72, ty = p.y + 34, dx = tx - g.petPos.x, dy = ty - g.petPos.y, dd = Math.hypot(dx, dy);
    if (dd > 400) { g.petPos.x = tx; g.petPos.y = ty; } else if (dd > 8) { const sp = Math.min(dd * 4, 420); g.petPos.x += dx / dd * sp * dt; g.petPos.y += dy / dd * sp * dt; g.petPos.mv = 1; } else g.petPos.mv = 0;
    g.petPos.face = dx > 2 ? 1 : dx < -2 ? -1 : (g.petPos.face || 1);
    const D = this.derived(), hb = ab(g, 'heal'), mb = ab(g, 'mp');
    if (hb && !p.dead) p.hp = Math.min(D.hpMax, p.hp + D.hpMax * hb / 100 * dt);
    if (mb) p.mp = Math.min(D.mpMax, p.mp + mb * dt);
    if (ab(g, 'loot')) for (const dr of g.drops) if (!dr.taken && Math.hypot(p.x - dr.x, p.y - dr.y) < 170) this.pickup(dr);
    g.drops = g.drops.filter(d => !d.taken);
    const bb = ab(g, 'bite'); g.petT -= dt;
    if (bb && g.petT <= 0) { const m = g.target && !g.target.dead ? g.target : this.nearestMob(140); if (m && !m.dead && Math.hypot(m.x - p.x, m.y - p.y) < 200) { g.petT = 2; const dmg = Math.max(1, Math.round(D.atk * bb / 100 - MONSTERS[m.type].def * .5)); m.hp -= dmg; m.hurt = .2; this.float(m.x, m.y - m.r - 12, String(dmg), '#9fe0ff'); if (m.hp <= 0) this.kill(m); g.fx.push({ kind: 'ring', x: m.x, y: m.y, t: .3, r: 30, color: '#9fe0ff' }); } }
  };
  CP.moreDrawables = function (list, now) {
    const g = this.g; if (!g.pet || !g.petPos) return; const pp = g.petPos, pet = g.pet;
    const fr = pp.mv ? Math.floor(now / 150) % 2 : Math.floor(now / 500) % 2, flyer = ['fly', 'fairy'].includes(PET_DEFS[pet].kind);
    list.push({ kind: 'petx', x: pp.x, y: pp.y, draw: (x, sx, sy, shadow, blit) => { shadow(pp.x, pp.y, 5, 1); blit(PX.pet(pet, fr), pp.x, pp.y - (flyer ? 30 + Math.sin(now / 300) * 6 : 0), 13, 22, pp.face < 0); } });
  };
  CP.softHook = function (ctx, t) {
    const g = this.g, a = g.cos && g.cos.aura; if (!a) return;
    const cols = { cos_a_fairy: ['#fff8b0', '#9ae8ff', '#ffd6ef'], cos_a_ember: ['#ffb040', '#ff6a2a', '#ffe080'], cos_a_petal: ['#ffb3cf', '#ffe1ec', '#ff7fae'] }[a];
    ctx.save(); ctx.globalCompositeOperation = a === 'cos_a_petal' ? 'source-over' : 'lighter';
    for (let i = 0; i < 14; i++) {
      const k = (t * (a === 'cos_a_ember' ? .9 : .5) + i / 14) % 1, ang = i * 2.4 + t * .8;
      const px = g.p.x + Math.cos(ang) * (28 + (i % 3) * 8), py = g.p.y - 10 - k * 90 + Math.sin(ang) * 6;
      ctx.globalAlpha = Math.sin(k * Math.PI) * .9; ctx.fillStyle = cols[i % 3];
      if (a === 'cos_a_petal') { ctx.fillRect(px, py, 5, 3); } else { ctx.beginPath(); ctx.arc(px, py, 2.5 + (i % 2), 0, 7); ctx.fill(); }
    }
    ctx.restore();
  };
  const ouse = CP.useItem;
  CP.useItem = function (idx) {
    const g = this.g, slot = g.inv[idx]; if (!slot) return; const it = ITEMS[slot.id];
    if (it.type === 'cos') { if (!g.wardrobe.includes(slot.id)) g.wardrobe.push(slot.id); g.cos[it.cslot] = slot.id; this.removeItem(slot.id, 1); this.push('สวมชุดแต่งตัว ' + it.name + ' (เก็บไว้ในตู้แฟชั่นแล้ว)', RARITY[it.rarity].color); this.setState({ tick: this.state.tick + 1 }); return; }
    if (it.type === 'egg') { if (!g.pets.includes(it.pet)) g.pets.push(it.pet); g.pet = it.pet; g.petPos = null; this.removeItem(slot.id, 1); this.push('ไข่ฟักแล้ว! ' + PET_DEFS[it.pet].name + ' มาเป็นเพื่อนคุณ', '#ffd56a'); this.setState({ tick: this.state.tick + 1 }); return; }
    return ouse.call(this, idx);
  };
  const obuy = CP.buy;
  CP.buy = function (id) { const it = ITEMS[id], g = this.g; if (it && it.type === 'cos' && (g.wardrobe.includes(id) || g.inv.some(s => s.id === id))) { this.push('มี ' + it.name + ' แล้ว', '#d8b878'); return; } if (it && it.type === 'egg' && g.pets.includes(it.pet)) { this.push('มี ' + PET_DEFS[it.pet].name + ' แล้ว', '#d8b878'); return; } obuy.call(this, id); };

  const EXTRA = { wardrobe: ['衣', 'ตู้แฟชั่น'], pets: ['寵', 'สัตว์เลี้ยง'] };
  const orv = CP.renderVals;
  CP.renderVals = function () {
    const s = this.state, extra = EXTRA[s.panel];
    if (extra) this.state = Object.assign({}, s, { panel: null });
    let v; try { v = orv.call(this); } finally { this.state = s; }
    const g = this.g, gold = (c) => ({ label: c[0], bg: c[2] ? 'linear-gradient(#e8a83c,#c07a18)' : 'rgba(255,255,255,.1)', color: c[2] ? '#221703' : '#cdd7e2', onClick: c[1] });
    // menu: fashion + pets
    v.topMenu[0] = { ...v.topMenu[0], label: 'แฟชั่น', icon: PX.url(PX.icon('bag'), 2), onClick: () => this.togglePanel('wardrobe') };
    v.topMenu[2] = { ...v.topMenu[2], label: 'สัตว์เลี้ยง', icon: PX.url(PX.pet('dog', 0), 2), onClick: () => this.togglePanel('pets') };
    v.topMenu[1] = { ...v.topMenu[1], onClick: () => { const n = this.mapDef().npcs || []; if (n.some(x => x.id === 'mina')) this.setState({ shop: 'herb', panel: null }); else this.push('ร้านค้าอยู่ในหมู่บ้านสายหมอก', '#8b97a5'); } };
    // NPC dialogue
    const dl = s.dialogue && (this.mapDef().npcs || []).find(n => n.id === s.dialogue);
    if (dl) {
      const bye = gold(['ลาก่อน', () => this.setState({ dialogue: null })]);
      const qd = (filter, doneLine) => {
        const ready = QUESTS.find(q => filter(q) && g.quests[q.id] && g.quests[q.id].state === 'ready');
        const avail = QUESTS.find(q => filter(q) && !g.quests[q.id] && g.level >= (q.req || (q.id === 'q3' ? 8 : 1)));
        const next = QUESTS.find(q => filter(q) && !g.quests[q.id]);
        if (ready) { v.npcLine = 'ยอดเยี่ยม! นี่คือรางวัลของเจ้า: ' + ready.rewardText; v.dialogueOptions = [gold(['ส่งเควส ' + ready.name, () => this.turnIn(ready.id), 1])]; }
        else if (avail) { v.npcLine = avail.name + ' — ' + avail.desc + ' (รางวัล: ' + avail.rewardText + ')'; v.dialogueOptions = [gold(['รับเควส', () => this.acceptQuest(avail.id), 1]), gold(['ไว้ก่อน', () => this.setState({ dialogue: null })])]; }
        else { v.npcLine = next ? 'งานต่อไปยังอันตรายเกินไปสำหรับเจ้า กลับมาเมื่อถึง Lv.' + (next.req || 8) : doneLine; v.dialogueOptions = [bye]; }
      };
      if (dl.id === 'elder') qd(q => !q.giver, 'ยุทธจักรกว้างใหญ่ จงฝึกฝนต่อไป แล้วกลับมาหาข้าเมื่อแกร่งพอ');
      else if (dl.role === 'quest2') qd(q => q.giver === dl.id, 'เจ้าล่าค่าหัวครบทุกงานแล้ว ยอดนักล่าแห่งยุทธจักร!');
      else if (dl.role === 'warp') {
        v.npcLine = NPC_LINES.lyra[0];
        v.dialogueOptions = WARP_LIST.filter(w => w[0] !== g.map).map(([id, nm, lv]) => gold([(g.level >= lv ? '➜ ' : '🔒 ') + nm + ' (Lv.' + lv + '+)', () => { if (g.level < lv) { this.push('ต้องถึง Lv.' + lv + ' ก่อนจึงไป ' + nm + ' ได้', '#f0604e'); return; } this.setState({ dialogue: null }); const st = MAPS[id].start; this.enterMap(id, st.x, st.y); }, g.level >= lv])).concat([bye]);
      } else if (dl.role === 'talk') { const L = NPC_LINES[dl.id] || ['...']; v.npcLine = L[Math.floor((s.dialogueAt || 0) / 7) % L.length] || L[0]; v.dialogueOptions = [gold(['คุยต่อ', () => this.setState({ dialogueAt: (s.dialogueAt || 0) + 7 })]), bye]; }
    }
    // extra panels
    v.isExtra = !!extra;
    if (extra) {
      v.panelOpen = true; v.panelGlyph = extra[0]; v.panelTitle = extra[1];
      v.isInventory = v.isCharacter = v.isSkills = v.isCodex = v.isQuests = false;
      if (s.panel === 'wardrobe') {
        v.extraHint = 'ชุดแต่งตัวจากช่างตัดเสื้อมีนาในหมู่บ้าน คลิกเพื่อสวม/ถอด (ไม่มีผลต่อค่าพลัง) · ซื้อเพิ่มได้ที่ร้านของมีนา';
        const owned = g.wardrobe;
        v.extraRows = owned.length ? owned.map(id => {
          const it = ITEMS[id], on = g.cos[it.cslot] === id;
          return { name: it.name, desc: it.desc.replace(' (ชุดแต่งตัว ไม่มีผลต่อค่าพลัง)', ''), state: on ? '✔ กำลังสวม' : 'คลิกเพื่อสวม', color: RARITY[it.rarity].color, border: on ? '#f2c14e' : 'rgba(255,255,255,.12)', bg: on ? 'rgba(242,193,78,.12)' : 'rgba(255,255,255,.03)', icon: PX.url(PX.icon('bag'), 2),
            onClick: () => { if (g.cos[it.cslot] === id) delete g.cos[it.cslot]; else g.cos[it.cslot] = id; this.setState({ tick: this.state.tick + 1 }); } };
        }) : [{ name: 'ยังไม่มีชุดแต่งตัว', desc: 'ไปที่ร้านช่างตัดเสื้อมีนาในหมู่บ้านสายหมอก', state: '', color: '#cdd7e2', border: 'rgba(255,255,255,.12)', bg: 'rgba(255,255,255,.03)', icon: PX.url(PX.icon('bag'), 2), onClick: () => {} }];
      } else {
        v.extraHint = 'สัตว์เลี้ยงเดินตามและช่วยเหลือคุณ เลือกได้ครั้งละ 1 ตัว · ซื้อไข่ได้ที่ลุงหมิง คนเลี้ยงสัตว์ในหมู่บ้าน';
        v.extraRows = Object.keys(PET_DEFS).map(id => {
          const d = PET_DEFS[id], own = g.pets.includes(id), on = g.pet === id;
          return { name: d.name, desc: d.ab[2], state: on ? '✔ กำลังพาไปด้วย' : own ? 'คลิกเพื่อเรียก' : '🔒 ไข่ราคา ' + d.price + ' Zeny', color: own ? '#f5e7c8' : '#7f8b98', border: on ? '#f2c14e' : 'rgba(255,255,255,.12)', bg: on ? 'rgba(242,193,78,.12)' : 'rgba(255,255,255,.03)', icon: PX.url(PX.pet(id, 0), 2),
            onClick: () => { if (!own) { this.push('ซื้อไข่' + d.name + ' ได้ที่ลุงหมิงในหมู่บ้าน', '#d8b878'); return; } g.pet = on ? null : id; g.petPos = null; this.setState({ tick: this.state.tick + 1 }); } };
        });
      }
    } else { v.extraRows = []; v.extraHint = ''; }
    // shop icons for cosmetics and eggs
    return v;
  };
}
window.__sw = { MAPS, MONSTERS, ITEMS, PET_DEFS, QUESTS };
