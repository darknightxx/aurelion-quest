
/* ============================================================
   Pets (RO style): 20 companions hatched from eggs. Each one
   follows you, has hunger and intimacy (ห่างเหิน → ภักดี) and a
   passive ability that grows with intimacy. Pets also collect
   items that monsters drop on the ground.
   Ground loot: monster drops fall on the floor as item bags and
   are picked up by walking over them or by your pet.
   ============================================================ */
const PETS = {
  dog: { name: 'ชิบะน้อย', kind: 'quad', c: ['#e39445', '#fbefdd', '#3a2a22'], ear: 'tri', tail: 'curl', sz: 1, loot: [7, 7.5], ab: { k: 'loot', v: 1, d: 'ตาไวจมูกไว เก็บของได้ไกลและเร็วเป็นสองเท่า' }, price: 1200, story: 'ลูกหมาขนส้มร่าเริง ชอบวิ่งไปคาบของมาให้เจ้านาย' },
  cat: { name: 'เหมียวส้ม', kind: 'quad', c: ['#f29b4b', '#fff3e2', '#c2602a'], ear: 'tri', tail: 'long', sz: .9, stripe: '#c2602a', loot: [5, 6], ab: { k: 'crit', v: .06, d: 'โอกาสคริติคอล +6%' }, price: 1200, story: 'แมวลายส้มขี้เกียจ แต่ตะปบแม่นทุกครั้ง' },
  parrot: { name: 'นกแก้วพูดเก่ง', kind: 'bird', c: ['#36b54a', '#f6d33c', '#e2452f'], ear: 'crest', sz: .85, beak: '#f2b33a', loot: [6, 7], ab: { k: 'xp', v: .08, d: 'ได้รับ EXP +8%' }, price: 1500, story: 'นกแก้วสีรุ้งที่ท่องคำศัพท์ได้ร้อยคำ' },
  rabbit: { name: 'กระต่ายขนปุย', kind: 'hop', c: ['#f7f1ea', '#ffd7de', '#e88aa0'], ear: 'long', tail: 'puff', sz: .85, loot: [5, 6.5], ab: { k: 'spd', v: .08, d: 'ความเร็วเคลื่อนที่ +8%' }, price: 1000, story: 'กระต่ายขาวกระโดดไวยิ่งกว่าลม' },
  hamster: { name: 'แฮมสเตอร์แก้มตุ่ย', kind: 'hop', c: ['#e9b878', '#fff6e8', '#d98a8a'], ear: 'round', tail: 'none', sz: .7, cheek: 1, loot: [4, 5.5], ab: { k: 'coin', v: .1, d: 'ได้รับเหรียญ +10%' }, price: 900, story: 'ชอบตุนเหรียญไว้ในแก้มจนตุ่ย' },
  fox: { name: 'จิ้งจอกแดง', kind: 'quad', c: ['#ea6b2a', '#fff4e6', '#3a2420'], ear: 'tri', tail: 'fluffy', sz: .95, loot: [6, 7], ab: { k: 'luck', v: .08, d: 'โอกาสดรอปไอเทมเพิ่มอีก 1 ชิ้น 8%' }, price: 1800, story: 'จิ้งจอกเจ้าเล่ห์ ดมกลิ่นสมบัติได้แม่นยำ' },
  owl: { name: 'นกฮูกนักปราชญ์', kind: 'bird', c: ['#8a6a4a', '#e8d6b8', '#f2c24a'], ear: 'tuft', sz: .9, beak: '#e6a23a', bigEye: 1, loot: [5, 6], ab: { k: 'mp', v: .012, d: 'ฟื้น MP 1.2% ต่อวินาที' }, price: 1600, story: 'นกฮูกใส่แว่นที่อ่านหนังสือทั้งคืน' },
  penguin: { name: 'เพนกวินจิ๋ว', kind: 'bird', c: ['#2a2f44', '#f6f6f8', '#f2a23a'], ear: 'none', sz: .85, beak: '#f2a23a', flipper: 1, loot: [4, 5], ab: { k: 'def', v: .06, d: 'พลังป้องกัน +6%' }, price: 1200, story: 'เพนกวินเตาะแตะที่ไม่เคยกลัวความหนาว' },
  turtle: { name: 'เต่าน้อยกระดองทอง', kind: 'quad', c: ['#6fbf6a', '#e9f2c8', '#c79a3a'], ear: 'none', tail: 'stub', sz: .85, shell: '#b9862e', slow: 1, loot: [4, 4.5], ab: { k: 'hpmax', v: .08, d: 'HP สูงสุด +8%' }, price: 1100, story: 'เต่าใจเย็น เดินช้าแต่ไม่เคยทิ้งเจ้านาย' },
  frog: { name: 'กบเขียวลายจุด', kind: 'hop', c: ['#5cc25a', '#e6f6c8', '#2e7a32'], ear: 'frog', tail: 'none', sz: .8, spots: '#2e7a32', loot: [5, 6], ab: { k: 'heal', v: .006, d: 'ฟื้น HP 0.6% ต่อวินาที' }, price: 900, story: 'กบตัวน้อยที่ร้องเพลงเรียกฝน' },
  piglet: { name: 'หมูน้อยออมสิน', kind: 'quad', c: ['#f6b3c2', '#ffe2ea', '#d8728a'], ear: 'floppy', tail: 'curl', sz: .85, snout: 1, loot: [4, 5], ab: { k: 'coin', v: .15, d: 'ได้รับเหรียญ +15%' }, price: 1400, story: 'หมูชมพูที่ชอบเก็บเหรียญใส่หลัง' },
  monkey: { name: 'ลิงจ๋อซุกซน', kind: 'biped', c: ['#9a6a42', '#f2d6b0', '#6a4428'], ear: 'round', tail: 'long', sz: .85, loot: [7, 8], ab: { k: 'steal', v: .12, d: 'โจมตีมีโอกาส 12% ขโมยเหรียญจากมอนสเตอร์' }, price: 1500, story: 'ลิงน้อยมือไว แอบล้วงกระเป๋ามอนสเตอร์' },
  chick: { name: 'ลูกเจี๊ยบ', kind: 'bird', c: ['#ffd84a', '#fff2a8', '#f29a2a'], ear: 'sprout', sz: .6, beak: '#f29a2a', loot: [4, 5], ab: { k: 'xp', v: .05, d: 'ได้รับ EXP +5%' }, price: 600, story: 'ลูกเจี๊ยบเหลืองเดินตามต้อยๆ' },
  duck: { name: 'เป็ดยางนักผจญภัย', kind: 'bird', c: ['#f9f9f2', '#ffe9a8', '#f29a2a'], ear: 'none', sz: .8, beak: '#f29a2a', flat: 1, loot: [5, 6], ab: { k: 'spd', v: .06, d: 'ความเร็วเคลื่อนที่ +6%' }, price: 800, story: 'เป็ดขาวใส่หมวกนักสำรวจ' },
  panda: { name: 'แพนด้ากลมกลิ้ง', kind: 'quad', c: ['#f7f7f4', '#f7f7f4', '#2a2a30'], ear: 'round', tail: 'stub', sz: .95, mask: 1, darkLegs: 1, loot: [5, 5.5], ab: { k: 'shield', v: .08, d: 'รับความเสียหายลดลง 8%' }, gems: 280, story: 'แพนด้ากินไผ่วันละสิบมื้อ กอดแล้วนุ่มมาก' },
  bat: { name: 'ค้างคาวรัตติกาล', kind: 'fly', c: ['#5a4a7a', '#8a7aa8', '#2a2038'], ear: 'tri', sz: .75, bat: 1, loot: [6, 8], ab: { k: 'leech', v: .03, d: 'ดูดเลือด 3% ของความเสียหายที่ทำได้' }, price: 2000, story: 'ค้างคาวตัวน้อยที่ตื่นตอนกลางคืน' },
  dragon: { name: 'มังกรน้อยเพลิง', kind: 'fly', c: ['#e2452f', '#ffd27a', '#7a1a14'], ear: 'horn', tail: 'long', sz: .95, wings: '#f28a3a', loot: [7, 8], ab: { k: 'fire', v: .55, d: 'พ่นไฟใส่ศัตรูทุก 2.5 วิ (ATK ×0.55 + กระจาย)' }, gems: 520, story: 'ลูกมังกรที่เพิ่งพ่นไฟเป็นครั้งแรก' },
  fairy: { name: 'ภูตพรายแสงดาว', kind: 'fairy', c: ['#ffd6ef', '#fff7c8', '#9ad8ff'], ear: 'none', sz: .6, loot: [6, 8], ab: { k: 'heal', v: .012, d: 'ฟื้น HP 1.2% และ MP 0.6% ต่อวินาที' }, gems: 420, story: 'ภูตตัวจิ๋วที่โปรยละอองแสงรักษาบาดแผล' },
  unicornp: { name: 'ยูนิคอร์นจิ๋ว', kind: 'quad', c: ['#fbf7ff', '#fff', '#c9a3ff'], ear: 'tri', tail: 'mane', sz: .95, horn: '#ffd24a', mane: ['#ff9ac8', '#ffd86a', '#8ad8ff'], loot: [6, 7], ab: { k: 'all', v: .04, d: 'ATK DEF และ HP สูงสุด +4%' }, gems: 600, story: 'ลูกม้าเขาทองที่เกิดจากสายรุ้ง' },
  slimep: { name: 'วุ้นใบเตยใจดี', kind: 'blob', c: ['#6ad0ff', '#c8f0ff', '#2a7ab0'], ear: 'none', sz: .8, loot: [5, 6], ab: { k: 'bite', v: .4, d: 'กระโดดชนศัตรูทุก 1.6 วิ (ATK ×0.4)' }, price: 700, story: 'วุ้นใบเตยที่ไม่ชอบสู้กับใคร ยกเว้นคนที่รังแกเจ้านาย' }
};
const PET_ORDER = Object.keys(PETS);
const PET_TIERS = [[0, 'ห่างเหิน', 0], [100, 'เขินอาย', .25], [250, 'ปกติ', .5], [750, 'สนิทสนม', .8], [910, 'ภักดี', 1]];
const petTier = i => { let t = PET_TIERS[0]; for (const x of PET_TIERS) if (i >= x[0]) t = x; return t; };
const PET_HUNGER = [[0, 'หิวมาก'], [11, 'หิว'], [26, 'ปกติ'], [76, 'อิ่ม'], [91, 'อิ่มแปล้']];
const petHunger = h => { let t = PET_HUNGER[0]; for (const x of PET_HUNGER) if (h >= x[0]) t = x; return t[1]; };

/* ---- items: eggs and food ---- */
ITEMS.pet_food = { name: 'อาหารสัตว์เลี้ยง', kind: 'use', price: 15, desc: 'ให้อาหารสัตว์เลี้ยงที่เรียกออกมา (ความหิว +25) ป้อนตอนหิวจะสนิทกันมากขึ้น', icon: 'bone' };
ITEMS.pet_treat = { name: 'ขนมสัตว์เลี้ยงพรีเมียม', kind: 'use', price: 120, desc: 'ขนมแสนอร่อย ความสนิทสนม +40 ทันที (ความหิว +10)', icon: 'heart', rare: true };
for (const k of PET_ORDER) { const D = PETS[k]; ITEMS['egg_' + k] = { name: 'ไข่' + D.name, kind: 'use', egg: k, price: D.price || 0, sell: D.price ? Math.floor(D.price / 4) : 0, desc: `ฟักออกมาเป็น ${D.name} · ${D.ab.d}`, icon: 'egg', rare: !!D.gems }; }
const PET_SHOP = ['pet_food', 'pet_treat', ...PET_ORDER.filter(k => PETS[k].price).map(k => 'egg_' + k)];
GEM_CATS.splice(2, 0, { id: 'pet', name: 'สัตว์เลี้ยง', desc: 'ไข่สัตว์เลี้ยงหายาก · ความสามารถพิเศษ' });
PET_ORDER.filter(k => PETS[k].gems).forEach(k => GEM_ITEMS.push({ id: 'gpet_' + k, cat: 'pet', gems: PETS[k].gems, give: [['egg_' + k, 1]], pet: k, name: 'ไข่' + PETS[k].name, desc: PETS[k].ab.d, hot: k === 'dragon' }));

/* ---- 3D models ---- */
function buildPetMesh(R, key) {
  const D = PETS[key], C = hexc, [c1, c2, c3] = D.c.map(C), dk = C('#1a1410');
  const mk = fn => { const g = new Geo(41); g.jit = .012; g.uvs = 2; fn(g); g.smoothNormals(58); return R.mesh(g); };
  const eye = (g, x, y, z, r = .06) => { g.sphere(x, y, z, r, dk, 6, 4); g.sphere(x + Math.sign(x || 1) * r * .25, y + r * .35, z + r * .6, r * .38, [1, 1, 1], 4, 3); };
  const out = { parts: [] }; const k = D.kind;
  const ears = (g, hx, hy, hz, hr) => {
    const e = D.ear;
    if (e === 'tri') for (const s of [1, -1]) { g.cone(s * hr * .55, hy + hr * .62, hz - .02, s * .35, 1, -.05, hr * .32, hr * .62, 4, c1); g.cone(s * hr * .55, hy + hr * .66, hz + .01, s * .35, 1, -.05, hr * .16, hr * .4, 4, D.bat ? c3 : C('#f4b8b8')); }
    else if (e === 'long') for (const s of [1, -1]) { g.ell(s * hr * .38, hy + hr * 1.25, hz - .04, hr * .2, hr * .7, hr * .12, c1, 6, 5); g.ell(s * hr * .38, hy + hr * 1.25, hz + .02, hr * .11, hr * .55, hr * .06, c2, 5, 4); }
    else if (e === 'round') for (const s of [1, -1]) { g.ell(s * hr * .72, hy + hr * .72, hz - .04, hr * .3, hr * .3, hr * .12, D.mask ? c3 : c1, 6, 5); if (!D.mask) g.ell(s * hr * .72, hy + hr * .72, hz + .02, hr * .16, hr * .16, hr * .05, c3, 5, 4); }
    else if (e === 'floppy') for (const s of [1, -1]) g.ell(s * hr * .72, hy + hr * .55, hz + .02, hr * .3, hr * .2, hr * .1, c3, 6, 4, -.5, 0);
    else if (e === 'horn') for (const s of [1, -1]) g.cone(s * hr * .4, hy + hr * .7, hz - .05, s * .2, 1, -.4, hr * .12, hr * .55, 5, C('#fff3d8'));
    else if (e === 'crest') { for (let i = 0; i < 3; i++) g.cone(0, hy + hr * .8, hz - .05 - i * .05, 0, 1, -.5 - i * .4, hr * .1, hr * (.6 - i * .1), 4, c3); }
    else if (e === 'tuft') for (const s of [1, -1]) g.cone(s * hr * .6, hy + hr * .75, hz, s * .4, 1, 0, hr * .16, hr * .4, 4, c1);
    else if (e === 'sprout') { g.cyl(0, hy + hr * .9, hz, .012, .012, .1, 4, C('#5a9a3a')); g.ell(.04, hy + hr * .9 + .1, hz, .05, .025, .03, C('#7ad04a'), 5, 3); }
    else if (e === 'frog') for (const s of [1, -1]) { g.sphere(s * hr * .5, hy + hr * .75, hz + hr * .1, hr * .3, c1, 7, 5); }
  };
  const face = (g, hx, hy, hz, hr) => {
    const ez = hz + hr * .82;
    if (D.ear === 'frog') { for (const s of [1, -1]) eye(g, s * hr * .5, hy + hr * .82, hz + hr * .32, hr * .2); g.ell(0, hy - hr * .15, ez - .02, hr * .55, hr * .06, hr * .1, c3, 6, 3); return; }
    const er = (D.bigEye ? .26 : .17) * hr;
    if (D.mask) for (const s of [1, -1]) g.ell(s * hr * .36, hy + hr * .08, ez - .05, hr * .22, hr * .28, hr * .1, c3, 6, 4, 0, s * .3);
    if (D.bigEye) for (const s of [1, -1]) g.sphere(s * hr * .36, hy + hr * .1, ez - .07, er * 1.5, C('#fff6dc'), 7, 5);
    for (const s of [1, -1]) eye(g, s * hr * .36, hy + hr * .1, ez - (D.bigEye ? .02 : .04), er);
    if (D.beak) { if (D.flat) g.ell(0, hy - hr * .2, ez + .02, hr * .3, hr * .08, hr * .25, C(D.beak), 6, 3); else g.cone(0, hy - hr * .12, ez - .04, 0, -.3, 1, hr * .17, hr * .35, 5, C(D.beak)); }
    else if (D.snout) { g.ell(0, hy - hr * .2, ez, hr * .26, hr * .18, hr * .12, c3, 7, 4); for (const s of [1, -1]) g.sphere(s * hr * .09, hy - hr * .2, ez + hr * .1, hr * .05, C('#8a3a4a'), 4, 3); }
    else if (k !== 'blob' && k !== 'fairy') { g.ell(0, hy - hr * .22, ez - .04, hr * .34, hr * .24, hr * .2, c2, 7, 5); g.sphere(0, hy - hr * .12, ez + hr * .14, hr * .09, dk, 5, 4); }
    if (D.cheek) for (const s of [1, -1]) g.sphere(s * hr * .55, hy - hr * .22, hz + hr * .55, hr * .3, c2, 6, 4);
    if (k !== 'blob') for (const s of [1, -1]) g.ell(s * hr * .6, hy - hr * .18, ez - .1, hr * .12, hr * .07, hr * .03, C('#ff9aa8'), 5, 3);
  };
  const tail = (p, col) => {
    const t = D.tail; if (!t || t === 'none') return;
    const m = mk(g => {
      if (t === 'curl') { g.cone(0, 0, 0, 0, .8, -.6, .07, .2, 5, col); g.sphere(0, .16, -.12, .08, col, 5, 4); }
      else if (t === 'long') { g.cone(0, 0, 0, 0, .25, -1, .06, .42, 5, col); g.cone(0, .1, -.4, 0, .6, -.5, .04, .16, 5, D.stripe ? C(D.stripe) : col); }
      else if (t === 'fluffy') { g.ell(0, .1, -.22, .12, .12, .26, col, 7, 5); g.ell(0, .14, -.44, .08, .08, .1, c2, 6, 4); }
      else if (t === 'puff') g.sphere(0, 0, -.03, .09, c2, 6, 4);
      else if (t === 'stub') g.cone(0, 0, 0, 0, -.2, -1, .06, .12, 5, col);
      else if (t === 'mane') D.mane.forEach((mc, i) => g.cone(0, .02 * i, 0, (i - 1) * .3, -.4, -1, .06, .4, 5, C(mc)));
    });
    out.parts.push({ mesh: m, p, a: 'tail' });
  };
  if (k === 'quad' || k === 'biped') {
    const hr = .3, hy = k === 'biped' ? .82 : .74, hz = k === 'biped' ? .05 : .3;
    out.body = mk(g => {
      if (k === 'biped') { g.ell(0, .44, 0, .22, .26, .2, c1, 9, 7); g.ell(0, .42, .1, .15, .18, .1, c2, 7, 5); }
      else {
        g.ell(0, .4, 0, .25, .23, .34, c1, 10, 7); g.ell(0, .34, .06, .19, .17, .26, c2, 8, 5);
        if (D.stripe) for (let i = 0; i < 3; i++) g.ell(0, .6, -.15 + i * .13, .2, .04, .035, C(D.stripe), 6, 3);
        if (D.shell) { g.ell(0, .5, -.02, .3, .2, .36, C(D.shell), 10, 6); for (let i = 0; i < 5; i++) { const a = i / 5 * TAU; g.ell(Math.sin(a) * .14, .66, -.02 + Math.cos(a) * .17, .07, .03, .07, C('#e2b85a'), 5, 3); } }
      }
      g.sphere(0, hy, hz, hr, c1, 11, 9); if (D.mask) g.ell(0, hy - .05, hz + .1, hr * .8, hr * .7, hr * .7, c1, 9, 7);
      ears(g, 0, hy, hz, hr); face(g, 0, hy, hz, hr);
      if (D.horn) { g.cone(0, hy + hr * .8, hz + hr * .35, 0, 1, .35, .045, .3, 6, C(D.horn)); D.mane.forEach((mc, i) => g.ell(0, hy + hr * .55 - i * .1, hz - hr * .75, .07, .1, .1, C(mc), 5, 4)); }
    });
    const legC = D.darkLegs ? c3 : c1, lr = .075;
    const leg = (x, z, off) => out.parts.push({ mesh: mk(g => { g.cyl(0, -.24, 0, lr * .85, lr, .24, 6, legC); g.ell(0, -.23, .02, lr * 1.1, .05, lr * 1.3, D.darkLegs ? c3 : c2, 6, 3); }), p: [x, .26, z], a: 'leg', off });
    if (k === 'biped') { leg(.1, 0, 0); leg(-.1, 0, Math.PI); for (const s of [1, -1]) out.parts.push({ mesh: mk(g => { g.cyl(0, -.22, 0, .05, .06, .22, 6, c1); g.sphere(0, -.24, 0, .06, c2, 5, 4); }), p: [s * .24, .6, .02], a: 'arm', off: s > 0 ? 0 : Math.PI }); tail([0, .36, -.18], c1); }
    else { leg(.14, .18, 0); leg(-.14, .18, Math.PI); leg(.14, -.18, Math.PI); leg(-.14, -.18, 0); tail([0, .48, -.32], D.tail === 'fluffy' ? c1 : c1); }
    out.h = 1.05;
  } else if (k === 'hop') {
    const hr = .3, hy = .58, hz = .1;
    out.body = mk(g => {
      g.ell(0, .3, -.04, .3, .28, .32, c1, 10, 8); g.ell(0, .27, .1, .22, .2, .2, c2, 8, 6);
      if (D.spots) for (let i = 0; i < 5; i++) g.sphere(Math.sin(i * 2.4) * .2, .42 + Math.cos(i * 1.7) * .08, -.1 + Math.cos(i * 2.4) * .2, .045, C(D.spots), 5, 3);
      g.sphere(0, hy, hz, hr, c1, 11, 9); ears(g, 0, hy, hz, hr); face(g, 0, hy, hz, hr);
      for (const s of [1, -1]) { g.ell(s * .18, .07, .12, .08, .06, .13, c2, 6, 4); g.ell(s * .2, .1, -.12, .1, .09, .16, c1, 6, 4); }
    });
    tail([0, .3, -.34], c2); out.h = D.ear === 'long' ? 1.15 : .9;
  } else if (k === 'bird') {
    const hr = .26, hy = .78, hz = .04;
    const bodyC = D.flipper ? c1 : c1;
    out.body = mk(g => {
      g.ell(0, .4, 0, .27, .32, .26, bodyC, 10, 8); g.ell(0, .38, .1, .2, .25, .16, c2, 8, 6);
      g.sphere(0, hy, hz, hr, D.flipper ? c1 : c1, 11, 9); if (D.flipper) g.ell(0, hy - .03, hz + .1, hr * .78, hr * .72, hr * .7, c2, 9, 7);
      ears(g, 0, hy, hz, hr); face(g, 0, hy, hz, hr);
      for (const s of [1, -1]) { g.cyl(s * .1, .02, .02, .025, .025, .12, 4, C(D.beak || '#f2a23a')); g.ell(s * .1, .02, .07, .06, .02, .07, C(D.beak || '#f2a23a'), 5, 3); }
      g.cone(0, .3, -.22, 0, .1, -1, .12, .2, 5, D.ear === 'crest' ? c3 : c1);
    });
    for (const s of [1, -1]) out.parts.push({ mesh: mk(g => D.flipper ? g.ell(s * .04, -.14, 0, .05, .18, .1, c1, 6, 4) : g.ell(s * .06, -.1, -.02, .06, .2, .15, D.ear === 'crest' ? C('#2e8ad8') : c1, 6, 5)), p: [s * .26, .5, 0], a: D.flipper ? 'flipper' : 'wing', off: s > 0 ? 0 : 1 });
    out.h = .98;
  } else if (k === 'fly') {
    const hr = .28, hy = .42, hz = .12;
    out.body = mk(g => {
      g.ell(0, .1, -.05, .2, .22, .24, c1, 9, 7); g.ell(0, .08, .05, .14, .16, .14, c2, 7, 5);
      g.sphere(0, hy, hz, hr, c1, 11, 9); ears(g, 0, hy, hz, hr); face(g, 0, hy, hz, hr);
      if (!D.bat) for (const s of [1, -1]) g.ell(s * .1, -.12, .04, .05, .06, .08, c1, 5, 4);
    });
    const wc = D.wings ? C(D.wings) : c3;
    for (const s of [1, -1]) out.parts.push({ mesh: mk(g => { g.ell(s * .28, .02, -.04, .3, .04, .2, wc, 8, 3); g.ell(s * .48, .04, -.12, .12, .03, .14, wc, 6, 3); g.cone(s * .05, .04, 0, s, .25, -.1, .025, .6, 4, c1); }), p: [s * .14, .2, -.06], a: 'wing', off: s > 0 ? 0 : 1 });
    if (D.tail) tail([0, .02, -.26], c1);
    out.h = 1.4; out.fly = .75;
  } else if (k === 'fairy') {
    out.body = mk(g => {
      g.cone(0, -.05, 0, 0, 1, 0, .18, .38, 9, C('#ff9ad0'), .05); g.sphere(0, .2, 0, .1, C('#ffe6d6'), 6, 5);
      g.sphere(0, .45, 0, .2, C('#ffe6d6'), 10, 8); g.ell(0, .53, -.04, .23, .2, .22, C('#ffd86a'), 9, 7); g.ell(0, .38, -.15, .14, .22, .1, C('#ffd86a'), 7, 5);
      for (const s of [1, -1]) eye(g, s * .075, .45, .17, .035); g.sphere(0, .7, 0, .04, C('#fff7a8'), 5, 4);
      for (const s of [1, -1]) g.cyl(s * .16, .18, 0, .025, .03, .12, 4, C('#ffe6d6'));
    });
    for (const s of [1, -1]) out.parts.push({ mesh: mk(g => { g.ell(s * .2, .12, -.02, .2, .26, .02, C('#bfe8ff'), 8, 5); g.ell(s * .16, -.14, -.02, .13, .15, .02, C('#d8c8ff'), 7, 4); }), p: [0, .3, -.1], a: 'wing', off: s > 0 ? 0 : 1, glow: 1 });
    out.h = 1.2; out.fly = .9;
  } else { // blob
    out.body = mk(g => {
      g.ell(0, .3, 0, .36, .32, .36, c1, 12, 9); g.ell(0, .38, .1, .22, .16, .22, c2, 8, 6); g.sphere(-.12, .48, .2, .06, [1, 1, 1], 5, 3);
      for (const s of [1, -1]) eye(g, s * .12, .34, .32, .06); g.ell(0, .22, .34, .08, .03, .03, C('#2a5a8a'), 5, 3);
      for (const s of [1, -1]) g.ell(s * .22, .25, .28, .06, .035, .02, C('#ff9aa8'), 5, 3);
      g.cone(0, .58, 0, .2, 1, 0, .05, .14, 5, c1);
    });
    out.h = .85;
  }
  return out;
}
const PetMesh = { by: new Map(), get(R, k) { let m = this.by.get(R); if (!m) this.by.set(R, m = {}); return m[k] || (m[k] = buildPetMesh(R, k)); } };
const _pB = M4.ident(), _pL = M4.ident(), _pO = M4.ident();
// draws a pet; st = {ph, amp, t, act}
function drawPet(R, k, x, y, z, face, st, flash = 0) {
  const D = PETS[k], m = PetMesh.get(R, k), s = D.sz, a = st.amp || 0, t = st.t || 0, ph = st.ph || 0;
  let bob = 0, pitch = 0, roll = 0, sx = 1, sy = 1;
  if (D.kind === 'hop') { const h = Math.max(0, Math.sin(ph * .5)); bob = a * .32 * h + Math.sin(t * 2.6) * .01; pitch = -a * .2 * Math.cos(ph * .5) * h; }
  else if (D.kind === 'bird') { bob = a * .05 * Math.abs(Math.sin(ph)) + Math.sin(t * 2.2) * .01; roll = Math.sin(ph) * .12 * a; }
  else if (D.kind === 'biped') { bob = a * .06 * Math.abs(Math.cos(ph)); roll = Math.sin(ph) * .06 * a; }
  else if (D.kind === 'fly' || D.kind === 'fairy') { bob = (m.fly || .7) + Math.sin(t * 3) * .12; pitch = a * .2; }
  else if (D.kind === 'blob') { const q = Math.sin(t * 3 + ph); sy = 1 + q * .08 + a * .06 * Math.sin(ph * .5); sx = 1 - q * .05; bob = a * .18 * Math.max(0, Math.sin(ph * .5)); }
  else { bob = a * .05 * Math.cos(ph * 2) + Math.sin(t * 2) * .01; pitch = a * .04 * Math.sin(ph * 2); }
  if (st.act === 'jump') bob += Math.abs(Math.sin(t * 9)) * .35; if (st.act === 'spin') face += t * 12;
  M4.compose(_pB, x, y + bob * s, z, pitch, face, roll, s * sx, s * sy, s * sx);
  R.drawMesh(m.body, _pB, null, RIG_FILL, flash);
  for (const p of m.parts) {
    let rx = 0, ry = 0, rz = 0;
    if (p.a === 'leg') rx = a * .7 * Math.sin(ph + p.off);
    else if (p.a === 'arm') rx = -a * .6 * Math.sin(ph + p.off) + (st.act === 'jump' ? -2.4 : 0);
    else if (p.a === 'tail') { ry = Math.sin(t * (4 + a * 5)) * (.35 + a * .2); }
    else if (p.a === 'wing') rz = (p.off ? -1 : 1) * ((D.kind === 'bird' ? .1 : .3) + Math.sin(t * (D.kind === 'bird' ? 2 + a * 10 : 14)) * (D.kind === 'bird' ? .15 + a * .4 : .55));
    else if (p.a === 'flipper') rz = (p.off ? -1 : 1) * (.15 + Math.sin(t * 6 + ph) * (.1 + a * .35));
    M4.compose(_pL, p.p[0], p.p[1], p.p[2], rx, ry, rz, 1, 1, 1); M4.mul(_pO, _pB, _pL);
    R.drawMesh(p.mesh, _pO, null, p.glow ? [.6, .6, .7] : RIG_FILL, flash, p.glow ? .8 : 1); if (!p.glow) R.drawOutline(p.mesh, _pO, .016);
  }
  R.drawOutline(m.body, _pB, .018);
}

/* ---- ground loot ---- */
const LOOT_LIFE = 60;
const Loot = {
  list: [], seq: 0, _killing: null, _picking: false,
  on() { return Settings.d.groundLoot !== 0; },
  drop(m, id, n) {
    const a = Math.random() * TAU, r = .6 + Math.random() * 1.1; const x0 = m.x, z0 = m.z;
    const c = Col.resolve(x0 + Math.sin(a) * r, z0 + Math.cos(a) * r, .2);
    this.list.push({ uid: ++this.seq, id, n, x: c[0], z: c[1], x0, z0, zone: m.zone, t: 0, rare: !!(ITEMS[id] && ITEMS[id].rare) });
    if (this.list.length > 80) this.list.shift();
  },
  pick(l, by) {
    const i = this.list.indexOf(l); if (i < 0) return; this.list.splice(i, 1);
    this._picking = true; try { Game.addItem(l.id, l.n, true); } finally { this._picking = false; }
    const it = ITEMS[l.id]; UI.toast(`${by ? by + ' เก็บ' : 'เก็บ'} ${it.name}${l.n > 1 ? ' ×' + l.n : ''}`, it.rare ? 'rare' : 'item');
    if (it.rare || ['w_gob', 'w_crys', 'r_heart', 'c_crown'].includes(l.id)) Game.run.drops.push(l.id);
    Audio.sfx('coin'); Particles.burst(l.x, .4, l.z, 8, l.rare ? [1, .85, .3] : [1, 1, .8], 2.5, .3, .25, 2);
  },
  near(x, z, r, zone) { let best = null, bd = r * r; for (const l of this.list) { if (l.zone !== zone || l.t < .55 || l.claim) continue; const d = dist2(l.x, l.z, x, z); if (d < bd) { bd = d; best = l; } } return best; },
  pickAround(r = 4.5) { const P = Player; let n = 0; for (const l of [...this.list]) if (l.zone === P.zone && l.t > .3 && dist2(l.x, l.z, P.x, P.z) < r * r) { this.pick(l); n++; } if (!n) UI.toast('ไม่มีของตกอยู่ใกล้ๆ', 'info'); },
  update(dt) {
    const P = Player;
    for (let i = this.list.length - 1; i >= 0; i--) {
      const l = this.list[i]; l.t += dt;
      if (l.t > LOOT_LIFE) { this.list.splice(i, 1); continue; }
      if (!P.dead && l.zone === P.zone && l.t > .55 && !l.claim && dist2(l.x, l.z, P.x, P.z) < 1.5 * 1.5) this.pick(l);
    }
  },
  mesh: null,
  meshes(R) {
    if (this.mesh && this.mesh.R === R) return this.mesh; const C = hexc;
    const bag = (c1, c2) => { const g = new Geo(5); g.jit = .02; g.ell(0, .2, 0, .2, .2, .2, C(c1), 8, 6); g.cyl(0, .34, 0, .07, .1, .1, 6, C(c1)); g.cyl(0, .4, 0, .11, .11, .04, 6, C(c2)); g.ell(0, .2, .17, .07, .07, .03, C(c2), 5, 3); g.smoothNormals(60); return R.mesh(g); };
    return this.mesh = { R, n: bag('#c89a5a', '#7a4a2a'), r: bag('#9a6bff', '#ffd24a') };
  },
  draw(R) {
    if (!this.list.length) return; const M = this.meshes(R), P = Player, T = Game.time, mm = M4.ident();
    for (const l of this.list) {
      if (l.zone !== P.zone || dist2(l.x, l.z, P.x, P.z) > 45 * 45) continue;
      if (l.t > LOOT_LIFE - 8 && Math.floor(l.t * 6) % 2) continue;
      const u = Math.min(1, l.t / .55); const x = lerp(l.x0, l.x, u), z = lerp(l.z0, l.z, u), y = Math.sin(u * Math.PI) * 1.4 + (u >= 1 ? Math.abs(Math.sin(T * 2.2 + l.uid)) * .05 : 0);
      M4.compose(mm, x, y, z, 0, T * .8 + l.uid, 0, 1, 1, 1); R.drawMesh(l.rare ? M.r : M.n, mm, null, l.rare ? [.35, .25, .1] : RIG_FILL, 0); R.drawOutline(l.rare ? M.r : M.n, mm, .02);
      if (l.rare && Math.random() < .2) Particles.add(x + rand(-.2, .2), y + .5, z + rand(-.2, .2), { c: [1, .85, .4], s: .25, life: .6, vy: 1 });
    }
  }
};

/* ---- pet system ---- */
const Pets = {
  st: { ph: 0, amp: 0, t: 0, act: null }, x: 0, z: 0, face: 0, zone: null, actT: 0, tickT: 0, regenT: 0, atkT: 0, task: null, bubble: null, bubT: 0, hungerT: 0,
  data() { const S = Save.d; if (!S.pets) S.pets = { own: {}, cur: null, loot: 1 }; return S.pets; },
  cur() { const d = this.data(); return d.cur && d.own[d.cur] ? d.cur : null; },
  info(k) { return this.data().own[k]; },
  mult() { const k = this.cur(); if (!k) return 0; return petTier(this.info(k).int)[2]; },
  // ability value (0 when the pet is not out or the ability doesn't match)
  v(key) { const k = this.cur(); if (!k || !Game.started) return 0; const ab = PETS[k].ab; const m = this.mult(); if (ab.k === key) return ab.v * m; if (ab.k === 'all' && (key === 'atk' || key === 'def' || key === 'hpmax')) return ab.v * m; return 0; },
  hatch(k) {
    const d = this.data(); if (d.own[k]) { UI.toast(`มี ${PETS[k].name} อยู่แล้ว`, 'warn'); return false; }
    d.own[k] = { name: PETS[k].name, int: 250, hun: 80, born: Date.now() }; Save.d.stats.pets = Object.keys(d.own).length;
    UI.banner('ฟักไข่สำเร็จ! ' + PETS[k].name, 'level'); Audio.sfx('level'); this.summon(k); return true;
  },
  summon(k) {
    const d = this.data(); if (!d.own[k]) return; d.cur = k; const P = Player; this.x = P.x - Math.sin(P.face) * 1.5; this.z = P.z - Math.cos(P.face) * 1.5; this.zone = P.zone; this.face = P.face; this.task = null;
    Particles.ring(this.x, .4, this.z, .8, 24, [1, .9, .6], .8, .4); Player.recalc(); this.say(['ไปด้วยกันนะ!', 'เย้! ได้ออกมาแล้ว', 'พร้อมลุย!'][randi(0, 2)]); Save.write();
  },
  recall() { const d = this.data(); if (!d.cur) return; Particles.ring(this.x, .4, this.z, .8, 20, [1, .9, .6], .8, .4); d.cur = null; this.task = null; Player.recalc(); Save.write(); },
  feed(item = 'pet_food') {
    const k = this.cur(), S = Save.d; if (!k) { UI.toast('เรียกสัตว์เลี้ยงออกมาก่อน', 'warn'); return false; }
    if (!S.inv[item]) { UI.toast('ไม่มี' + ITEMS[item].name + ' ซื้อได้ที่ร้านสัตว์เลี้ยงของปุยฝ้าย', 'warn'); return false; }
    const p = this.info(k); Game.addItem(item, -1, true); let msg;
    if (item === 'pet_treat') { p.int = Math.min(1000, p.int + 40); p.hun = Math.min(100, p.hun + 10); msg = 'อร่อยที่สุดในโลก!'; }
    else if (p.hun <= 25) { p.int = Math.min(1000, p.int + 20); msg = 'ขอบคุณนะ หิวมากเลย!'; }
    else if (p.hun <= 75) { p.int = Math.min(1000, p.int + 10); msg = 'อร่อยจัง'; }
    else if (p.hun <= 90) { p.int = Math.max(0, p.int - 10); msg = 'อิ่มแล้วนะ…'; }
    else { p.int = Math.max(0, p.int - 30); msg = 'กินไม่ไหวแล้ว! (ความสนิทลดลง)'; }
    if (item !== 'pet_treat') p.hun = Math.min(100, p.hun + 25);
    this.say(msg); this.act('jump', 1); Audio.sfx('ui'); Particles.burst(this.x, .9, this.z, 10, [1, .6, .7], 2, .4, .3, 1); Player.recalc(); return true;
  },
  perform() { const k = this.cur(); if (!k) return; const p = this.info(k); this.act(Math.random() < .5 ? 'spin' : 'jump', 1.6); const d = today(); if (p.perfDay !== d) { p.perfDay = d; p.int = Math.min(1000, p.int + 5); } this.say(['ดูนี่สิ!', 'ทาด้า~', 'เก่งไหม?'][randi(0, 2)]); },
  rename(name) { const k = this.cur(); if (!k) return; const n = ChatFilter.name(String(name || '').trim()).slice(0, 14); if (n) this.info(k).name = n; },
  act(a, t) { this.st.act = a; this.actT = t; },
  say(text, t = 3.2) { this.bubble = text; this.bubT = t; },
  update(dt) {
    const k = this.cur(); const P = Player; this.st.t += dt;
    if (!k) return;
    const D = PETS[k], p = this.info(k);
    if (this.actT > 0) { this.actT -= dt; if (this.actT <= 0) this.st.act = null; }
    if (this.bubT > 0) { this.bubT -= dt; if (this.bubT <= 0) this.bubble = null; }
    // hunger & intimacy tick every 40 s (RO style)
    this.hungerT += dt;
    if (this.hungerT >= 40) {
      this.hungerT = 0; p.hun = Math.max(0, p.hun - 2);
      if (p.hun === 0) { p.int = Math.max(0, p.int - 20); this.say('หิวจะแย่แล้ว…'); if (p.int <= 0) { p.int = 100; p.hun = 50; this.recall(); UI.toast(`${p.name} หิวจนงอนกลับเข้าไข่ไปแล้ว! ให้อาหารสม่ำเสมอนะ`, 'warn'); return; } }
      else if (p.hun <= 25) { this.say(['หิวแล้ว…', 'ขออาหารหน่อย', 'ท้องร้องจ๊อกๆ'][randi(0, 2)]); }
      else p.int = Math.min(1000, p.int + 1);
    }
    // follow / teleport
    if (this.zone !== P.zone || dist2(this.x, this.z, P.x, P.z) > 22 * 22) { this.zone = P.zone; this.x = P.x - Math.sin(P.face) * 1.4; this.z = P.z - Math.cos(P.face) * 1.4; this.task = null; }
    let tx, tz, spd = (P.stats.spd || 5) * (D.slow ? .95 : 1.15), stop = .25;
    // tasks: collect loot / attack
    if (this.task && this.task.loot && !Loot.list.includes(this.task.loot)) this.task = null;
    if (this.task && this.task.mon && (this.task.mon.dead || this.task.mon.zone !== P.zone || dist2(this.task.mon.x, this.task.mon.z, P.x, P.z) > 14 * 14)) this.task = null;
    if (!this.task && this.data().loot !== 0 && !P.dead) { const rng = D.loot[0] * (D.ab.k === 'loot' ? 1.6 : 1); const l = Loot.near(P.x, P.z, rng, P.zone); if (l) { l.claim = 1; this.task = { loot: l }; } }
    const atkK = D.ab.k === 'bite' || D.ab.k === 'fire';
    if (!this.task && atkK && this.mult() > 0 && !P.dead) { const tg = P.target && P.target.kind === 'mon' && !P.target.ref.dead ? P.target.ref : null; const m = tg || Monsters.list.find(m => !m.dead && m.zone === P.zone && m.aggro && dist2(m.x, m.z, P.x, P.z) < 8 * 8); if (m && P.combatT > 0) this.task = { mon: m }; }
    if (this.task && this.task.loot) { const l = this.task.loot; tx = l.x; tz = l.z; spd = D.loot[1] * (D.ab.k === 'loot' ? 1.7 : 1); stop = .1; if (dist2(l.x, l.z, this.x, this.z) < .5 * .5) { Loot.pick(l, p.name); this.task = null; this.act('jump', .5); } }
    else if (this.task && this.task.mon) {
      const m = this.task.mon, rr = D.ab.k === 'fire' ? 5 : (m.d.r || .6) + .6; tx = m.x; tz = m.z; stop = rr; this.atkT -= dt;
      if (dist2(m.x, m.z, this.x, this.z) < (rr + .3) ** 2 && this.atkT <= 0) {
        this.atkT = D.ab.k === 'fire' ? 2.5 : 1.6; const dmg = (P.stats.atk || 10) * D.ab.v * this.mult(); this.face = Math.atan2(m.x - this.x, m.z - this.z);
        if (D.ab.k === 'fire') { for (let i = 1; i <= 8; i++) { const u = i / 8; Particles.add(lerp(this.x, m.x, u), .9 + (m.d.h || 1) * .3 * u, lerp(this.z, m.z, u), { c: [1, .45 + u * .3, .1], s: .45, life: .35 + u * .2, vy: .6 }); } Particles.burst(m.x, 1, m.z, 16, [1, .55, .2], 4, .5, .5, 3); Combat.damageMonster(m, dmg, {}); for (const o of Monsters.list) if (o !== m && !o.dead && o.zone === m.zone && dist2(o.x, o.z, m.x, m.z) < 6.25) Combat.damageMonster(o, dmg * .5, {}); Audio.sfx('shoot'); }
        else { this.act('jump', .35); Particles.burst(m.x, .8, m.z, 8, [.6, .9, 1], 3, .3, .3, 2); Combat.damageMonster(m, dmg, {}); }
      }
    } else { const side = .9, back = 1.35; tx = P.x - Math.sin(P.face) * back + Math.cos(P.face) * side; tz = P.z - Math.cos(P.face) * back - Math.sin(P.face) * side; if (dist2(tx, tz, this.x, this.z) < 1.2 * 1.2 && !P.moving) { tx = this.x; tz = this.z; } }
    const dx = tx - this.x, dz = tz - this.z, d = Math.hypot(dx, dz); let mv = 0;
    if (d > stop) { const far = d > 6 ? 1.6 : 1; const s = Math.min(d - stop, spd * far * dt); const c = Col.resolve(this.x + dx / d * s, this.z + dz / d * s, .25); this.x = c[0]; this.z = c[1]; mv = s / dt; this.face = Math.atan2(dx, dz); }
    else if (!this.task || this.task.loot) this.face += angWrap(P.face - this.face) * Math.min(1, dt * 3);
    const ampT = Math.min(1, mv / 4); this.st.amp += (ampT - this.st.amp) * Math.min(1, dt * 8); this.st.ph += dt * (4 + mv * 1.6);
    // passive regen
    this.regenT += dt;
    if (this.regenT >= 1) { this.regenT = 0; const S = Save.d, st = P.stats; if (P.dead) return; const h = this.v('heal'); if (h) { S.hp = Math.min(st.maxhp, S.hp + st.maxhp * h); if (k === 'fairy') S.mp = Math.min(st.maxmp, S.mp + st.maxmp * h * .5); } const m = this.v('mp'); if (m) S.mp = Math.min(st.maxmp, S.mp + st.maxmp * m); }
  },
  draw(R) {
    const k = this.cur(); if (!k || this.zone !== Player.zone) return; const D = PETS[k], m = PetMesh.get(R, k);
    const h = (m.h || 1) * D.sz + (m.fly || 0) * D.sz + .5, w = Math.max(1.4, h * 1.05);
    const f0 = this.face; Sprites.capture(R, this.x, h / 2 - .2, this.z, w, h + .3, () => drawPet(R, k, this.x, 0, this.z, Sprites.snapFace(f0), this.st));
  }
};
