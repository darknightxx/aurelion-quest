/* ============================================================
   Skill art (SVG illustrations), skill detail popup, skills panel,
   5-slot skill bar with long-press info
   ============================================================ */
const SkillArt = (() => {
  let uid = 0;
  const OL = '#2b1a0b';
  const hex = c => '#' + c.map(v => Math.round(clamp(v, 0, 1) * 255).toString(16).padStart(2, '0')).join('');
  const mix = (c, t, k) => c.map((v, i) => v + (t[i] - v) * k);
  const P = (pts) => pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('') + 'Z';
  const star = (cx, cy, R, r, n, rot = -Math.PI / 2) => { const a = []; for (let i = 0; i < n * 2; i++) { const t = rot + i * Math.PI / n, rr = i % 2 ? r : R; a.push([cx + Math.cos(t) * rr, cy + Math.sin(t) * rr]); } return P(a); };
  const sh = (d, fill, w = 2.2, extra = '') => `<path d="${d}" fill="${fill}" stroke="${OL}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round" ${extra}/>`;
  const line = (d, col, w, extra = '') => `<path d="${d}" fill="none" stroke="${OL}" stroke-width="${w + 2.4}" stroke-linecap="round" stroke-linejoin="round" ${extra}/><path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
  const blob = (circles, fill) => circles.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${OL}" stroke="${OL}" stroke-width="4.4"/>`).join('') + circles.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`).join('');
  const W = '#fff6e0', GOLD = '#f2c94c', STEEL = '#dfe6f0';
  function blade(hx, hy, tx, ty, w = 5, col = STEEL, guard = GOLD) {
    const dx = tx - hx, dy = ty - hy, l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l, nx = -uy, ny = ux;
    const gx = hx + ux * 8, gy = hy + uy * 8, h = w / 2;
    const bl = P([[gx + nx * h, gy + ny * h], [tx - ux * w * 1.3 + nx * h, ty - uy * w * 1.3 + ny * h], [tx, ty], [tx - ux * w * 1.3 - nx * h, ty - uy * w * 1.3 - ny * h], [gx - nx * h, gy - ny * h]]);
    return sh(bl, col) + `<path d="M${gx + ux * 1} ${gy + uy * 1}L${tx - ux * w * 1.5} ${ty - uy * w * 1.5}" stroke="#ffffff" stroke-width="1.2" opacity=".7"/>`
      + line(`M${hx} ${hy}L${gx} ${gy}`, '#8a5a32', 3.2) + line(`M${gx + nx * w * 1.5} ${gy + ny * w * 1.5}L${gx - nx * w * 1.5} ${gy - ny * w * 1.5}`, guard, 3.2)
      + `<circle cx="${hx}" cy="${hy}" r="2.6" fill="${guard}" stroke="${OL}" stroke-width="1.6"/>`;
  }
  function arrow(x1, y1, x2, y2, col = W, head = '#e6e9f0', fl = '#e05b5b') {
    const dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l, nx = -uy, ny = ux;
    const hb = [x2 - ux * 8, y2 - uy * 8];
    return line(`M${x1} ${y1}L${hb[0]} ${hb[1]}`, col, 2.4)
      + sh(P([[x2, y2], [hb[0] + nx * 4.5, hb[1] + ny * 4.5], [hb[0] + ux * 1.5, hb[1] + uy * 1.5], [hb[0] - nx * 4.5, hb[1] - ny * 4.5]]), head, 1.8)
      + sh(P([[x1 + ux * 6, y1 + uy * 6], [x1 + nx * 3.5, y1 + ny * 3.5], [x1 - ux * 1, y1 - uy * 1], [x1 - nx * 3.5, y1 - ny * 3.5]]), fl, 1.6);
  }
  const slash = (x1, y1, x2, y2, w, col) => { const dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy), nx = -dy / l, ny = dx / l, mx = (x1 + x2) / 2 + nx * w * .6, my = (y1 + y2) / 2 + ny * w * .6; return sh(`M${x1} ${y1}Q${mx + nx * w} ${my + ny * w} ${x2} ${y2}Q${mx - nx * w * .2} ${my - ny * w * .2} ${x1} ${y1}Z`, col, 1.8); };
  const shield = (cx, cy, s, col = '#9fb4d8', trim = GOLD) => sh(`M${cx - 11 * s} ${cy - 13 * s}H${cx + 11 * s}V${cy - 1 * s}C${cx + 11 * s} ${cy + 8 * s} ${cx + 5 * s} ${cy + 14 * s} ${cx} ${cy + 17 * s}C${cx - 5 * s} ${cy + 14 * s} ${cx - 11 * s} ${cy + 8 * s} ${cx - 11 * s} ${cy - 1 * s}Z`, col) + line(`M${cx} ${cy - 9 * s}V${cy + 11 * s}M${cx - 7 * s} ${cy - 2 * s}H${cx + 7 * s}`, trim, 2.6 * s);
  const spark = (x, y, r, col = '#fffbe0') => `<path d="${star(x, y, r, r * .3, 4)}" fill="${col}"/>`;

  const G = {
    bash: a => sh(star(44, 22, 13, 5.5, 8), '#ffe27a') + shield(26, 32, 1.05) + line('M6 20h6M4 30h7M6 40h6', '#fff', 2),
    taunt: a => line('M16 20q-7 12 0 24M9 15q-11 17 0 34', a, 3) + line('M48 20q7 12 0 24M55 15q11 17 0 34', a, 3) + sh('M27 9h10l-2 30h-6z', W) + sh(star(32, 47, 6, 6, 8), W),
    guard: a => sh('M14 15h6v-6h6v6h12v-6h6v6h6v15c0 11-9 18-18 23-9-5-18-12-18-23z', '#a9bbe0') + line('M32 22v20M23 32h18', a, 4) + spark(50, 50, 6) + spark(12, 50, 4),
    charge: a => line('M5 20h17M3 32h20M5 44h17', '#e8f0ff', 3) + shield(40, 30, 1.15) + sh(star(56, 30, 7, 3, 6), '#ffe27a', 1.6),
    cleave: a => sh('M8 50C14 22 34 8 58 10C38 16 22 30 16 54Z', hexA(a, .9)) + blade(18, 48, 52, 12, 6),
    combo: a => slash(10, 50, 30, 10, 6, W) + slash(22, 54, 42, 12, 6, W) + slash(34, 56, 54, 16, 6, a) + spark(52, 50, 5),
    whirl: a => line('M14 40A19 19 0 0 1 42 13', a, 3.4) + sh('M40 7l9 6-10 5z', a, 1.6) + line('M50 24A19 19 0 0 1 22 51', a, 3.4) + sh('M24 57l-9-6 10-5z', a, 1.6) + blade(24, 42, 42, 22, 5),
    rush: a => sh('M10 14l16 18-16 18h9l16-18-16-18z', W) + sh('M28 14l16 18-16 18h9l16-18-16-18z', a) + line('M4 32h4', '#fff', 2),
    focus: a => sh('M32 6c4 9 15 14 15 29a15 15 0 0 1-30 0c0-7 4-11 7-16 2 5 5 7 7 9 0-8-1-14 1-22z', a) + sh('M20 37q12-11 24 0q-12 11-24 0z', W, 2) + `<circle cx="32" cy="37" r="4.2" fill="${OL}"/><circle cx="33.3" cy="35.6" r="1.3" fill="#fff"/>`,
    hero: a => sh(star(32, 50, 15, 6, 10), '#ffe27a') + blade(32, 6, 32, 46, 7) + spark(12, 14, 5) + spark(52, 18, 4),
    crescent: a => sh('M42 8a24 24 0 1 0 14 40A19 19 0 1 1 42 8z', '#e8e4ff') + slash(30, 46, 50, 22, 4, a) + spark(48, 12, 4),
    smoke: a => blob([[24, 26, 11], [38, 22, 12], [46, 34, 10], [30, 38, 12], [16, 38, 8]], '#a9c48a') + `<circle cx="27" cy="30" r="2.6" fill="${OL}"/><circle cx="37" cy="29" r="2.6" fill="${OL}"/>` + line('M28 37q4 3 8 0', OL, .1) + sh('M22 50a5 5 0 1 0 0.1 0z', '#4a4a52', 1.6) + line('M24 46q4-4 3-8', '#e8b84a', 1.6) + sh('M44 46c2 3 4 5 4 7a4 4 0 0 1-8 0c0-2 2-4 4-7z', a, 1.6),
    shadow: a => `<g opacity=".35">${blade(8, 48, 30, 26, 5, '#b9a8f0')}</g><g opacity=".6">${blade(16, 50, 40, 26, 5, '#c9b8ff')}</g>` + blade(26, 52, 54, 24, 6, '#efe8ff', a),
    assassin: a => sh('M8 26c8-6 18-6 24 2 6-8 16-8 24-2-2 10-8 15-14 14-5-1-8-4-10-6-2 2-5 5-10 6-6 1-12-4-14-14z', a) + sh('M15 28q6-4 11 2q-6 3-11-2z', '#fff6e0', 1.4) + sh('M49 28q-6-4-11 2q6 3 11-2z', '#fff6e0', 1.4) + blade(22, 58, 46, 40, 4) + sh(star(52, 12, 7, 2.6, 4), '#ffe27a', 1.4),
    blades: a => line('M32 4A28 28 0 0 1 60 32', a, 2, 'opacity=".8"') + line('M32 60A28 28 0 0 1 4 32', a, 2, 'opacity=".8"') + sh(star(32, 32, 22, 6, 4, -Math.PI / 4), STEEL) + sh(star(32, 32, 14, 4, 4), '#c9d4e8', 1.6) + `<circle cx="32" cy="32" r="4" fill="${a}" stroke="${OL}" stroke-width="1.6"/>`,
    power: a => `<circle cx="42" cy="32" r="16" fill="#fff6e0" stroke="${OL}" stroke-width="2.2"/><circle cx="42" cy="32" r="10.5" fill="${a}" stroke="${OL}" stroke-width="2"/><circle cx="42" cy="32" r="5" fill="#fff6e0" stroke="${OL}" stroke-width="1.8"/>` + arrow(4, 32, 60, 32) + line('M8 22h8M6 42h8', '#fff', 1.6),
    multi: a => [-28, -14, 0, 14, 28].map(d => { const t = (d - 45) * Math.PI / 180; return arrow(10, 54, 10 + Math.cos(t) * 46, 54 + Math.sin(t) * 46, W, '#e6e9f0', a); }).join(''),
    venom: a => arrow(8, 56, 50, 14, W, '#bff08a', '#6fbf3a') + sh('M48 28c4 6 7 10 7 14a7 7 0 0 1-14 0c0-4 3-8 7-14z', a) + spark(46, 40, 2.4, '#e9ffd0') + sh('M18 30c2 3 3 5 3 6a3 3 0 0 1-6 0c0-1 1-3 3-6z', a, 1.4),
    leap: a => line('M50 48C50 14 16 8 12 34', a, 4) + sh('M6 30l7 10 7-9z', a, 1.8) + sh('M44 50h12l-2 6h-8z', '#8a5a32', 1.6) + line('M40 58h20', '#e8f0e0', 1.6) + `<path d="M36 52l-4 4M44 54l-3 5M52 54l1 5" stroke="#cfe8c0" stroke-width="2" stroke-linecap="round"/>`,
    rain: a => [[12, 8, 30], [24, 4, 36], [36, 10, 40], [48, 6, 34], [30, 18, 52]].map(([x, y1, y2]) => arrow(x, y1, x, y2 + 10, W, '#e6e9f0', a)).join('') + line('M6 58h52', '#cdb88a', 2),
    fire: a => sh('M54 8c-6 8-14 10-20 12 6 0 10 2 12 6-8-2-14 0-20 4a14 14 0 1 0 18 18c4-6 4-12 2-18 4 2 6 6 6 10 4-8 4-20 2-32z', '#ffb84a') + `<circle cx="27" cy="39" r="9" fill="#fff2b0" stroke="${OL}" stroke-width="2"/>` + `<circle cx="27" cy="39" r="4.5" fill="#fffbe8"/>`,
    storm: a => sh('M10 12h44c-2 6-10 8-18 9 8 1 13 3 14 7-6 4-14 4-20 4 6 2 10 4 10 8-4 4-10 4-14 5 2 3 2 6 0 10-2-4-6-6-10-8 4-2 6-4 6-6-6-1-12-3-14-7 4-2 10-3 14-4-8-1-14-4-16-10z', a) + spark(52, 44, 4, '#ffe27a') + spark(14, 46, 3, '#ffe27a'),
    frost: a => [0, 60, 120].map(d => `<g transform="rotate(${d} 32 32)">${line('M32 6V58M32 14l-6-6M32 14l6-6M32 50l-6 6M32 50l6 6M32 22l-8-4M32 22l8-4M32 42l-8 4M32 42l8 4', '#eaf6ff', 3)}</g>`).join('') + `<circle cx="32" cy="32" r="6" fill="${a}" stroke="${OL}" stroke-width="2"/>`,
    blink: a => `<ellipse cx="22" cy="40" rx="14" ry="6" fill="${a}" stroke="${OL}" stroke-width="2.2"/><ellipse cx="22" cy="40" rx="8" ry="3" fill="#2a1840"/><ellipse cx="44" cy="20" rx="14" ry="6" fill="${a}" stroke="${OL}" stroke-width="2.2"/><ellipse cx="44" cy="20" rx="8" ry="3" fill="#2a1840"/>` + line('M24 34Q30 22 40 24', '#fff', 2, 'stroke-dasharray="3 4"') + sh(star(32, 30, 8, 2.5, 4), '#fffbe0', 1.6),
    meteor: a => sh('M60 4L30 26 38 30 22 40 28 44 8 56 34 46 30 40 44 34 38 30z', '#ffcf6a') + sh('M18 34l10-4 8 6-2 10-10 4-8-6z', '#7a5a4a') + `<circle cx="25" cy="40" r="2.4" fill="#5a3a2a"/><circle cx="30" cy="45" r="1.6" fill="#5a3a2a"/>`,
    heal: a => sh('M32 54S10 40 10 24a11 11 0 0 1 22-5 11 11 0 0 1 22 5c0 16-22 30-22 30z', '#ff8a9a') + sh('M28 22h8v7h7v8h-7v7h-8v-7h-7v-8h7z', W, 1.8) + spark(52, 12, 5) + spark(12, 12, 3),
    cleanse: a => line('M10 34A22 22 0 0 1 50 18', a, 2.6) + sh('M44 12l8 4-7 6z', a, 1.4) + sh('M32 12c7 10 13 17 13 25a13 13 0 0 1-26 0c0-8 6-15 13-25z', '#9fd8ff') + `<path d="M26 38a6 6 0 0 0 6 6" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round"/>` + spark(50, 46, 5) + spark(14, 50, 4),
    bless: a => Array.from({ length: 12 }, (_, i) => { const t = i / 12 * TAU, r1 = 15, r2 = i % 2 ? 24 : 28; return sh(P([[32 + Math.cos(t - .14) * r1, 32 + Math.sin(t - .14) * r1], [32 + Math.cos(t) * r2, 32 + Math.sin(t) * r2], [32 + Math.cos(t + .14) * r1, 32 + Math.sin(t + .14) * r1]]), '#ffe27a', 1.4); }).join('') + `<circle cx="32" cy="32" r="14" fill="#fff2b0" stroke="${OL}" stroke-width="2.2"/>` + sh('M29 24h6v5h5v6h-5v5h-6v-5h-5v-6h5z', a, 1.6),
    angel: a => `<ellipse cx="32" cy="12" rx="12" ry="4" fill="none" stroke="${OL}" stroke-width="5"/><ellipse cx="32" cy="12" rx="12" ry="4" fill="none" stroke="${GOLD}" stroke-width="2.6"/>` + sh('M30 26C22 18 8 18 4 24c4 2 6 4 6 6-3 1-4 3-4 5 4 0 6 1 7 3-2 1-3 3-3 5 6 0 12-2 16-6 3-3 4-7 4-11z', W) + sh('M34 26c8-8 22-8 26-2-4 2-6 4-6 6 3 1 4 3 4 5-4 0-6 1-7 3 2 1 3 3 3 5-6 0-12-2-16-6-3-3-4-7-4-11z', W) + sh('M32 24c4 0 5 4 5 10s-2 16-5 22c-3-6-5-16-5-22s1-10 5-10z', '#ffe9a8', 1.8),
    judge: a => `<rect x="24" y="2" width="16" height="60" fill="#fff8cc" opacity=".45"/>` + line('M32 12V54M22 56h20M12 20h40', '#e8d6a0', 3) + line('M12 20l-6 14M12 20l6 14M52 20l-6 14M52 20l6 14', '#e8d6a0', 1.6) + sh('M4 34h16a8 5 0 0 1-16 0z', GOLD, 1.8) + sh('M44 34h16a8 5 0 0 1-16 0z', GOLD, 1.8) + `<circle cx="32" cy="12" r="4" fill="${a}" stroke="${OL}" stroke-width="1.8"/>`,
    power2: a => ''
  };
  function hexA(col, k) { return col; }
  function art(id, opts = {}) {
    const sk = SKILLS[id]; if (!sk) return '';
    const n = ++uid, c = sk.col || [1, 1, 1];
    const rk = SKILL_ROLE[id]; const rc = rk ? ROLES[rk].col : '#d9a845';
    const light = hex(mix(c, [1, 1, 1], .35)), mid = hex(mix(c, [0, 0, 0], .25)), dark = hex(mix(c, [.05, .03, .08], .78)), acc = hex(mix(c, [1, 1, 1], .1));
    const g = (G[sk.glyph] || G[id] || G.hero)(acc);
    const ult = sk.quiz;
    const rays = Array.from({ length: 12 }, (_, i) => { const t = i / 12 * TAU; return `<path d="M32 32L${32 + Math.cos(t - .12) * 46} ${32 + Math.sin(t - .12) * 46}L${32 + Math.cos(t + .12) * 46} ${32 + Math.sin(t + .12) * 46}Z" fill="#fff" opacity=".07"/>`; }).join('');
    return `<svg class="skart ${opts.cls || ''}" viewBox="0 0 64 64" aria-hidden="true"><defs><radialGradient id="sg${n}" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="${light}"/><stop offset=".5" stop-color="${mid}"/><stop offset="1" stop-color="${dark}"/></radialGradient><clipPath id="sc${n}"><rect x="2" y="2" width="60" height="60" rx="11"/></clipPath></defs>`
      + `<rect x="2" y="2" width="60" height="60" rx="11" fill="url(#sg${n})"/><g clip-path="url(#sc${n})">${rays}<g transform="translate(32 32) scale(.86) translate(-32 -32)">${g}</g><rect x="2" y="2" width="60" height="22" fill="#fff" opacity=".08"/></g>`
      + `<rect x="2" y="2" width="60" height="60" rx="11" fill="none" stroke="${ult ? GOLD : rc}" stroke-width="${ult ? 3.4 : 2.6}"/>${ult ? `<rect x="5.5" y="5.5" width="53" height="53" rx="8.5" fill="none" stroke="#fff3b8" stroke-width="1" opacity=".8"/>` : ''}</svg>`;
  }
  return { art };
})();

const SKILL_ROLE = {}; for (const k of CLASS_ORDER) for (const id of CLASSES[k].skills) SKILL_ROLE[id] = CLASSES[k].role; for (const k in JOBS) for (const id of JOBS[k].skills) SKILL_ROLE[id] = SKILL_ROLE[id] || JOBS[k].role;
addEventListener('keydown', e => { if (e.key === 'Escape' && SkillInfo.active) { e.stopPropagation(); SkillInfo.close(); } }, true);
/* ---- per-skill tips (how to play it) ---- */
const SKILL_TIPS = {
  bash: 'ใช้ตอนศัตรูกำลังง้างโจมตีเพื่อตัดจังหวะ แล้วตามด้วยการโจมตีแรงๆ ระหว่างมึนงง',
  taunt: 'เปิดศึกด้วยสกิลนี้เพื่อลากศัตรูเข้าหาตัวและลดดาเมจที่พวกมันทำ เหมาะกับการรวมกลุ่มก่อนใช้สกิลหมู่',
  guard: 'เปิดก่อนรับการโจมตีหนัก เช่น วงแดงของบอส ค่าป้องกันและเลือดจะสูงขึ้นทันที',
  charge: 'พุ่งเข้าใจกลางกลุ่มศัตรูแล้วดึงพวกมันมารวมกัน จากนั้นใช้ดาบศักดิ์สิทธิ์กวาดทีเดียว',
  cleave: 'ยิ่งศัตรูอยู่หน้าเป็นแนวกว้าง ยิ่งคุ้ม ตอบคำถามให้ถูกเพื่อพลัง ×2',
  combo: 'ใช้กับเป้าหมายเดียวที่ HP สูง ตีครบ 3 ครั้งเพื่อให้ครั้งสุดท้ายแรงที่สุด',
  whirl: 'ใช้เมื่อโดนล้อมตั้งแต่ 3 ตัวขึ้นไป',
  rush: 'ใช้ไล่ตามศัตรูที่หนี หรือพุ่งทะลุออกจากวงล้อม',
  focus: 'เปิดก่อนคอมโบสามจังหวะหรือฮีโร่สไตรก์ เพื่อให้คริติคอลบ่อยขึ้น',
  hero: 'กระโดดลงกลางกลุ่มศัตรู ตอบถูกได้พลัง ×2',
  crescent: 'ดาเมจเดี่ยวสูงที่สุดของนินจา ใช้ปิดงานศัตรูตัวใหญ่',
  smoke: 'ศัตรูที่ติดพิษจะเสียเลือดต่อเนื่องแม้หนีไปแล้ว',
  shadow: 'ทะลุผ่านศัตรูเพื่อไปอยู่ด้านหลังแล้วโจมตีต่อ',
  assassin: 'เปิดคู่กับฟันจันทร์เสี้ยว ทุกครั้งมีโอกาสคริติคอลสูงมาก',
  blades: 'สกิลหมู่รอบตัว เหมาะตอนศัตรูล้อมหลายตัว',
  power: 'ยืนเป็นแนวตรงกับศัตรูหลายตัวเพื่อยิงทะลุทีเดียวหลายตัว',
  multi: 'เข้าใกล้กลุ่มศัตรูพอประมาณให้ลูกศรทั้งห้าดอกโดน',
  venom: 'ยิงใส่ศัตรูที่วิ่งเร็วเพื่อให้ช้าลง แล้วถอยยิงต่อ',
  leap: 'ใช้ตอนศัตรูประชิดตัว แล้วยิงต่อจากระยะปลอดภัย',
  rain: 'ปล่อยใส่จุดที่ศัตรูรวมกันมากที่สุด',
  fire: 'สกิลหลักที่คูลดาวน์สั้น ยิงได้บ่อย',
  storm: 'ปล่อยใส่กลุ่มศัตรูที่ถูกวงแหวนน้ำแข็งหยุดไว้ จะโดนครบทุกจังหวะ',
  frost: 'หยุดศัตรูที่ประชิดตัวก่อนแล้วใช้เคลื่อนย้ายมิติถอยออกมา',
  blink: 'วาร์ปทะลุสิ่งกีดขวางไม่ได้ เลือกทิศที่โล่งก่อนกด',
  meteor: 'ดาเมจหมู่สูงที่สุดในเกม ตอบถูกได้ ×2',
  heal: 'ใช้ตอน HP ต่ำกว่าครึ่ง ฟื้นต่อเนื่องอีก 6 วินาที',
  cleanse: 'ใช้ทันทีเมื่อติดพิษ ช้าลง หรือโดนคำสาปของบอส',
  bless: 'เปิดก่อนสู้บอส เพิ่มทั้งพลังโจมตีและป้องกัน',
  angel: 'เปิดก่อนเข้าดันเจี้ยนหรือก่อนบอสใช้ท่าแรง ถ้าพลาดจะฟื้นทันที',
  judge: 'ทั้งโจมตีหมู่และฟื้นฟู ตอบถูกได้ ×2'
};
const TARGET_TH = { proj: 'ศัตรู (ระยะไกล)', nova: 'รอบตัว', cone: 'ด้านหน้า (รูปพัด)', dash: 'แนวพุ่ง', heal: 'ตัวเอง', buff: 'ตัวเอง', rain: 'พื้นที่', taunt: 'รอบตัว', combo: 'เป้าหมายเดียว', escape: 'ตัวเอง', storm: 'พื้นที่ที่เป้าหมาย', cleanse: 'ตัวเอง + รอบตัว' };

/* ---- detail popup (reuses #itempop) ---- */
const SkillInfo = {
  id: null,
  open(id) {
    const sk = SKILLS[id]; if (!sk || !Save.d) return; this.id = id; Audio.sfx('ui');
    const S = Save.d, cls = Cls.of(S), role = ROLES[cls.role], lv = SkillLv.get(id), L = SkillLv.f(id), slot = cls.skills.indexOf(id);
    const atk = Player.stats ? Player.stats.atk : cls.atk, maxhp = Player.stats ? Player.stats.maxhp : cls.hp;
    const rows = [['บทบาท', `${role.name} <small>(${role.en})</small>`], ['ประเภท', sk.cat + (Cls.isAwkSkill(S, id) ? ' · <b style="color:#ffcf5a">ปลุกพลังแล้ว +30%</b>' : '')], ['เป้าหมาย', TARGET_TH[sk.type] || '-'], ['ใช้ MP', SkillLv.mp(id)], ['คูลดาวน์', SkillLv.cd(id) + ' วินาที']];
    if (sk.r) rows.push(['รัศมี / ระยะ', sk.r + ' เมตร']); if (sk.dist) rows.push(['ระยะเคลื่อนที่', sk.dist + ' เมตร']);
    if (sk.mult) rows.push(['ความเสียหายต่อครั้ง', `ATK ${atk} × ${(sk.mult * L.dmg).toFixed(2)} ≈ <b>${Math.round(atk * sk.mult * L.dmg)}</b>${sk.hits ? ` × ${sk.hits} ครั้ง` : sk.n > 1 ? ` × ${sk.n} ดอก` : ''}`]);
    if (sk.heal) rows.push(['ฟื้นฟู', `${Math.round(sk.heal * L.heal * 100)}% ≈ <b>${Math.round(maxhp * sk.heal * L.heal)}</b> HP`]);
    if (sk.stun) rows.push(['มึนงง', (sk.stun * L.dur).toFixed(1) + ' วินาที']); if (sk.slow) rows.push(['ทำให้ช้า', (sk.slow * L.dur).toFixed(1) + ' วินาที']);
    if (sk.dot) rows.push(['ดาเมจต่อเนื่อง', `≈ ${Math.round(atk * sk.dot.k * L.dmg)}/วินาที นาน ${(sk.dot.t * L.dur).toFixed(1)} วินาที`]);
    if (sk.buffs) rows.push(['ระยะเวลาบัฟ', sk.buffs.map(([k, t]) => `${BUFFS[k].name} ${(t * L.dur).toFixed(0)} วิ`).join(' · ')]);
    rows.push(['ปุ่มลัด', `<kbd>${SKILL_KEYS[slot] || '-'}</kbd> หรือแตะปุ่มสกิล`]);
    const nx = lv < SkillLv.max() ? SkillLv.f(id, lv + 1) : null;
    const nextTxt = nx ? [sk.mult ? `ดาเมจ ×${(sk.mult * nx.dmg).toFixed(2)}` : '', sk.heal ? `ฟื้นฟู ${Math.round(sk.heal * nx.heal * 100)}%` : '', (sk.stun || sk.slow || sk.buffs || sk.dot) ? `ระยะเวลา +${Math.round((nx.dur - 1) * 100)}%` : '', `คูลดาวน์ ${SkillLv.cd(id, lv + 1)} วิ`, `MP ${SkillLv.mp(id, lv + 1)}`].filter(Boolean).join(' · ') : 'เลเวลสูงสุดแล้ว';
    const pips = Array.from({ length: SkillLv.max() }, (_, i) => `<i class="${i < lv ? 'on' : ''}"></i>`).join('');
    const el = $('#itempop');
    el.innerHTML = `<div class="iibox skbox" role="dialog" aria-modal="true" aria-labelledby="skname">
      <div class="iihead"><span class="lbdia"></span><h3>รายละเอียดสกิล</h3><span class="lbdia"></span><button class="iiclose" data-sact="close" aria-label="ปิด">${icon('close')}</button></div>
      <div class="iiscroll"><div class="iil">
        <div class="iitop"><div class="skbig">${SkillArt.art(id)}</div><div><h2 id="skname">${sk.name}</h2><div class="skchips"><span class="chip role" style="--rc:${role.col}">${role.name}</span><span class="chip">${sk.cat}</span>${sk.quiz ? '<span class="chip ult">ตอบคำถาม ×2</span>' : ''}</div><div class="sklv"><b>Lv.${lv}</b><span class="pips">${pips}</span><small>${lv}/${SkillLv.max()}</small></div></div></div>
        <p class="iilore skdesc">${sk.desc}</p>
        <h4 class="iisec">${icon('star')} ผลของสกิล</h4>
        <ul class="skfx">${(sk.fx || []).map(f => `<li>${f}</li>`).join('')}</ul>
        <h4 class="iisec">${icon('help')} เคล็ดลับ</h4><p class="sktip">${SKILL_TIPS[id] || ''}</p>
      </div><div class="iir">
        <h4 class="iisec">${icon('book')} ข้อมูลสกิล (เลเวลปัจจุบัน)</h4>
        <dl class="iiprops">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>
        <div class="sknext"><small>เลเวลถัดไป</small><p>${nextTxt}</p></div>
      </div></div>
      <div class="iifoot"><span class="skpts">แต้มสกิล <b>${S.skillPts || 0}</b></span><button class="btn" data-sact="up" ${SkillLv.canUp(id) ? '' : 'disabled'}>${lv >= SkillLv.max() ? 'เลเวลสูงสุด' : 'อัปเลเวลสกิล'}</button></div>
    </div>`;
    el.hidden = false; this.active = true; Game.pause(true, 'skinfo');
    const f = el.querySelector('.iiclose'); if (f) f.focus({ preventScroll: true });
    el.onclick = e => {
      if (e.target === el) return this.close();
      const a = e.target.closest('[data-sact]'); if (!a) return;
      if (a.dataset.sact === 'close') return this.close();
      if (a.dataset.sact === 'up') { if (SkillLv.up(id)) { this.open(id); if (UI.panelOpen) UI.renderPanel(); } }
    };
  },
  close() { const el = $('#itempop'); el.hidden = true; el.innerHTML = ''; el.onclick = null; this.active = false; this.id = null; Game.pause(false, 'skinfo'); }
};

Object.assign(UI, {
  skillDot() { const b = document.querySelector('#menubtns [data-p="skills"]'); if (b && Save.d) b.classList.toggle('dot', (Save.d.skillPts || 0) > 0); },
  buildSkillbar() {
    const S = Save.d; const sk = (S ? Cls.of(S) : CLASSES.adventurer).skills;
    const b = this.el.skills;
    b.innerHTML = `<button class="sk atk" data-a="atk" aria-label="โจมตี">${icon('sword')}<kbd>Space</kbd></button>` +
      sk.map((id, i) => { const s = SKILLS[id]; return `<button class="sk art ${s.quiz ? 'ult' : ''}" data-a="s${i}" data-sid="${id}" aria-label="${s.name}">${SkillArt.art(id)}<kbd>${SKILL_KEYS[i]}</kbd><span class="mpc">${SkillLv.mp(id)}</span><i class="cd"></i>${s.quiz ? '<span class="qbadge">?</span>' : ''}<span class="tip">${s.name}${s.quiz ? ' · ตอบถูก ×2' : ''}<br><small>กดค้าง/คลิกขวา = ดูรายละเอียด</small></span></button>`; }).join('') +
      `<button class="sk pot" data-a="hp" aria-label="ยา HP">${icon('potR')}<kbd>1</kbd><span class="cnt" id="cnt-hp"></span></button><button class="sk pot" data-a="mp" aria-label="ยา MP">${icon('potB')}<kbd>2</kbd><span class="cnt" id="cnt-mp"></span></button>`;
    let hold = null, held = false;
    const clear = () => { if (hold) clearTimeout(hold); hold = null; };
    b.onpointerdown = e => { const t = e.target.closest('[data-sid]'); held = false; clear(); if (!t) return; const sx = e.clientX, sy = e.clientY; hold = setTimeout(() => { held = true; SkillInfo.open(t.dataset.sid); }, 480); b._hs = [sx, sy]; };
    b.onpointermove = e => { if (hold && b._hs && Math.hypot(e.clientX - b._hs[0], e.clientY - b._hs[1]) > 12) clear(); };
    b.onpointerup = b.onpointercancel = b.onpointerleave = clear;
    b.oncontextmenu = e => { const t = e.target.closest('[data-sid]'); if (t) { e.preventDefault(); clear(); held = true; SkillInfo.open(t.dataset.sid); } };
    b.onclick = e => { const t = e.target.closest('.sk'); if (!t) return; if (held) { held = false; return; } Audio.init(); const a = t.dataset.a; if (a === 'atk') Game.attackNearest(); else if (a === 'hp') Game.useItem(S.inv.hp_l && !S.inv.hp_s ? 'hp_l' : 'hp_s', true); else if (a === 'mp') Game.useItem('mp_s', true); else Skills.use(+a[1]); };
    this.skillDot();
  },
  pSkills() {
    const S = Save.d, cls = Cls.of(S), rk = cls.role, role = ROLES[rk];
    const card = (id, i) => { const s = SKILLS[id], lv = SkillLv.get(id); return `<li class="skrow ${s.quiz ? 'ult' : ''}" data-skinfo="${id}"><div class="skico">${SkillArt.art(id)}<kbd>${SKILL_KEYS[i]}</kbd></div><div class="skmid"><b>${s.name}</b><span class="chip">${s.cat}</span><small>MP ${SkillLv.mp(id)} · คูลดาวน์ ${SkillLv.cd(id)} วิ${s.mult ? ` · ดาเมจ ×${(s.mult * SkillLv.f(id).dmg).toFixed(2)}` : ''}</small></div><div class="skright"><span class="pips">${Array.from({ length: SkillLv.max() }, (_, k) => `<i class="${k < lv ? 'on' : ''}"></i>`).join('')}</span><button class="btn sm" data-skup="${id}" ${SkillLv.canUp(id) ? '' : 'disabled'} aria-label="อัปเลเวล ${s.name}">+</button></div></li>`; };
    const roles = Object.entries(ROLES).map(([k, r]) => `<div class="rolecard ${k === rk ? 'me' : ''}" style="--rc:${r.col}"><div class="rh">${icon(r.icon)}<b>${r.name}</b><small>${r.en}</small></div><p>${r.desc}</p><ul>${r.cats.map(c => `<li>${c}</li>`).join('')}</ul><small class="rcls">อาชีพ: ${CLASS_ORDER.filter(c => CLASSES[c].role === k).map(c => CLASSES[c].name).join(', ')}</small></div>`).join('');
    this.setPanel(`${icon('book')} สกิล <span class="coin">แต้มสกิล <b>${S.skillPts || 0}</b></span>`, `
      <div class="skhead" style="--rc:${role.col}"><div class="skrole">${icon(role.icon)}</div><div><h3>${cls.name} · ${role.name} <small>${role.en}</small></h3><p>${role.desc}</p><p class="skpass"><b>ความสามารถติดตัว: ${role.passive.name}</b> ${role.passive.desc}</p></div></div>
      <ul class="sklist">${cls.skills.map(card).join('')}</ul>
      <p class="muted skhint">แตะสกิลเพื่อดูรายละเอียดเต็ม · ได้แต้มสกิล 1 แต้มทุกเลเวล · สกิลอัปได้สูงสุดเลเวล ${SkillLv.max()} (ดาเมจ +15% ฟื้นฟู +12% ระยะเวลา +10% คูลดาวน์ −4% ต่อเลเวล)</p>
      <h4 class="sksec">4 สายบทบาทในเกม</h4><div class="rolegrid">${roles}</div>`, true);
    this.el.pbody.onclick = e => {
      const u = e.target.closest('[data-skup]'); if (u) { SkillLv.up(u.dataset.skup); this.buildSkillbar(); return this.renderPanel(); }
      const r = e.target.closest('[data-skinfo]'); if (r) SkillInfo.open(r.dataset.skinfo);
    };
  }
});

