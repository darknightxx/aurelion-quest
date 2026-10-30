/* ============================================================
   Mounts: 13 rideable animals with 3D models, passives and skills
   ============================================================ */
const MOUNTS = {
  shark: { name: 'ฉลามดุดัน', gems: 680, spd: 1.6, kind: 'float', seat: [1.62, -.15], sc: 1, stat: { atk: 9, def: 2, hp: 40 }, story: 'ฉลามน้ำเงินหน้าดุที่มีรอยแผลเป็นกากบาท ถ้าฝึกให้เชื่องได้จะพาว่ายฝ่าทุกคลื่น แม้แต่บนบก',
    pas: { k: 'steal', v: .06, name: 'เลือดฉลาม', desc: 'ดูดเลือด 6% ของความเสียหายที่ทำได้' },
    sk: { name: 'ฉลามงับทะลวง', desc: 'พุ่งไปข้างหน้า 7 เมตร งับทุกตัวที่ขวางทาง ATK ×2.4', cd: 9, col: [.45, .75, 1] } },
  cat: { name: 'แมวส้มซามูไร', gems: 380, spd: 1.55, kind: 'quad', seat: [1.38, -.1], sc: 1, stat: { atk: 7, def: 2, hp: 30 }, story: 'แมวส้มลายเสือที่ฝึกวิชาดาบมาจากเกาะทางตะวันออก เดินเงียบ ตะปบไว',
    pas: { k: 'crit', v: .12, name: 'สัญชาตญาณนักล่า', desc: 'โอกาสคริติคอล +12%' },
    sk: { name: 'กรงเล็บพายุ', desc: 'ตะปบรัว 5 ครั้งด้านหน้า ครั้งละ ATK ×0.75', cd: 8, col: [1, .7, .35] } },
  lion: { name: 'สิงโตทองคำ', gems: 760, spd: 1.6, kind: 'quad', seat: [1.6, -.25], sc: 1.12, stat: { atk: 10, def: 5, hp: 60 }, story: 'ราชสีห์แผงคอทองแห่งทุ่งหญ้า เสียงคำรามของมันทำให้มอนสเตอร์ทั้งทุ่งหยุดนิ่ง',
    pas: { k: 'atkp', v: .1, name: 'รัศมีราชสีห์', desc: 'พลังโจมตี +10% ขณะขี่' },
    sk: { name: 'คำรามราชสีห์', desc: 'คำรามรอบตัว 7 เมตร ATK ×1.6 มึนงง 2 วิ และพลังโจมตี +20% 8 วิ', cd: 14, col: [1, .82, .35] } },
  ostrich: { name: 'นกกระจอกเทศนักบิน', gems: 380, spd: 1.85, kind: 'biped', seat: [1.72, -.2], sc: 1, stat: { atk: 5, def: 2, hp: 30 }, story: 'นักบินขนเขียวใส่แว่นกันลม บินไม่ได้แต่วิ่งเร็วที่สุดในทวีป',
    pas: { k: 'dodge', v: .12, name: 'ฝีเท้าลมกรด', desc: 'หลบการโจมตี 12% และเร็วที่สุดในบรรดาสัตว์ขี่' },
    sk: { name: 'เตะพุ่งทะยาน', desc: 'วิ่งพุ่ง 8 เมตร เตะทุกตัวที่ขวาง ATK ×2.0 และผลักกระเด็น', cd: 7, col: [.6, 1, .6] } },
  bunny: { name: 'กระต่ายจันทรา', gems: 320, spd: 1.5, kind: 'hop', seat: [1.36, -.1], sc: 1, stat: { atk: 4, def: 3, hp: 50 }, story: 'กระต่ายขาวที่ลงมาจากดวงจันทร์ในคืนเพ็ญ กระโดดทีเดียวข้ามรั้วเมืองได้',
    pas: { k: 'regen', v: .012, name: 'พรจันทรา', desc: 'ฟื้น HP 1.2% ต่อวินาที แม้ระหว่างต่อสู้' },
    sk: { name: 'กระโดดดวงจันทร์', desc: 'กระโดดลงใส่ศัตรู รัศมี 4.5 เมตร ATK ×2.6 มึนงง 1 วิ', cd: 10, col: [.9, .9, 1] } },
  dragon: { name: 'มังกรน้อยเพลิง', gems: 980, spd: 1.65, kind: 'quad', seat: [1.5, -.2], sc: 1.05, wings: true, stat: { atk: 12, def: 4, hp: 50 }, story: 'ลูกมังกรที่ฟักจากไข่ในปล่องภูเขาไฟ ยังบินไม่ได้แต่พ่นไฟได้แล้ว',
    pas: { k: 'thorns', v: .25, name: 'เกล็ดเพลิง', desc: 'สะท้อนความเสียหาย 25% กลับใส่ผู้โจมตี' },
    sk: { name: 'ลมหายใจไฟ', desc: 'พ่นไฟเป็นรูปกรวย 7 เมตร 5 ครั้ง ครั้งละ ATK ×0.65', cd: 11, col: [1, .5, .15] } },
  panda: { name: 'แพนด้ากังฟู', gems: 420, spd: 1.4, kind: 'quad', seat: [1.42, -.15], sc: 1.05, stat: { atk: 5, def: 7, hp: 70 }, story: 'แพนด้าศิษย์วัดไผ่ ชอบกินมากกว่าซ้อม แต่ฝ่ามือไผ่ของมันไม่เคยพลาด',
    pas: { k: 'reduce', v: .15, name: 'ขนหนานุ่ม', desc: 'รับความเสียหายลดลง 15%' },
    sk: { name: 'ฝ่ามือไผ่', desc: 'ทุบพื้นรัศมี 4.5 เมตร ATK ×2.0 และพลังป้องกัน +70% 5 วิ', cd: 12, col: [.55, 1, .5] } },
  unicorn: { name: 'ยูนิคอร์นสายรุ้ง', gems: 880, spd: 1.75, kind: 'quad', seat: [1.7, -.25], sc: 1.05, stat: { atk: 6, def: 4, hp: 60 }, story: 'ม้าขาวเขาทองที่ปรากฏหลังฝนตก ทุกก้าวทิ้งประกายสีรุ้งไว้บนพื้น',
    pas: { k: 'mpregen', v: .02, name: 'พลังสายรุ้ง', desc: 'ฟื้น MP 2% ต่อวินาที' },
    sk: { name: 'รุ้งเยียวยา', desc: 'ฟื้น HP 30% และยิงแสงรุ้งรัศมี 5 เมตร ATK ×1.5', cd: 15, col: [1, .7, 1] } },
  turtle: { name: 'เต่ายักษ์โบราณ', gems: 420, spd: 1.3, kind: 'quad', seat: [1.55, -.1], sc: 1.1, stat: { atk: 3, def: 10, hp: 90 }, story: 'เต่าอายุพันปีที่เคยแบกห้องสมุดทั้งหลังไว้บนกระดอง ช้าแต่มั่นคงที่สุด',
    pas: { k: 'reduce', v: .25, name: 'กระดองเหล็ก', desc: 'รับความเสียหายลดลง 25%' },
    sk: { name: 'กระดองหมุนติ้ว', desc: 'หมุนรอบตัว 4 รอบ รัศมี 4 เมตร ครั้งละ ATK ×0.85', cd: 10, col: [.5, .9, .6] } },
  frog: { name: 'กบยักษ์ลิ้นยาว', gems: 280, spd: 1.45, kind: 'hop', seat: [1.3, -.15], sc: 1.05, stat: { atk: 5, def: 3, hp: 40 }, story: 'กบเขียวตัวเท่าเกวียนจากหนองน้ำป่ากระซิบ ลิ้นของมันยาวกว่าเชือกบ่อน้ำ',
    pas: { k: 'stun', v: .1, name: 'ลิ้นเหนียว', desc: 'โจมตีมีโอกาส 10% ทำให้ศัตรูมึนงง' },
    sk: { name: 'ลิ้นตวัด', desc: 'ตวัดดึงศัตรูได้ถึง 3 ตัวในระยะ 9 เมตรมาตรงหน้า ATK ×1.8 และทำให้ช้าลง', cd: 9, col: [1, .5, .6] } },
  penguin: { name: 'เพนกวินสไลเดอร์', gems: 280, spd: 1.7, kind: 'slide', seat: [1.22, -.2], sc: 1, stat: { atk: 4, def: 3, hp: 40 }, story: 'เพนกวินจักรพรรดิที่ชอบไถลพุงไปทั่ว ผ้าพันคอสีแดงคือของขวัญจากคุณยาย',
    pas: { k: 'chill', v: .25, name: 'ลมหนาว', desc: 'โจมตีมีโอกาส 25% ทำให้ศัตรูช้าลง' },
    sk: { name: 'สไลด์น้ำแข็ง', desc: 'ไถลพุ่ง 9 เมตร แล้วระเบิดน้ำแข็งรัศมี 4 เมตร ATK ×1.6 ทำให้ช้าลง', cd: 9, col: [.6, .9, 1] } },
  fox: { name: 'จิ้งจอกเก้าหาง', gems: 520, spd: 1.65, kind: 'quad', seat: [1.42, -.15], sc: 1, stat: { atk: 8, def: 2, hp: 35 }, story: 'จิ้งจอกเจ้าปัญญาที่ได้หางเพิ่มหนึ่งหางทุกครั้งที่ตอบปริศนาได้ ตอนนี้มีครบเก้าแล้ว',
    pas: { k: 'xp', v: .15, name: 'ปัญญาจิ้งจอก', desc: 'ได้รับ EXP +15% ขณะขี่' },
    sk: { name: 'ไฟจิ้งจอก', desc: 'ยิงลูกไฟวิญญาณ 6 ลูกตามล่าศัตรูใกล้ตัว ลูกละ ATK ×0.8', cd: 10, col: [.75, .5, 1] } },
  elephant: { name: 'ช้างน้อยพ่นน้ำ', gems: 520, spd: 1.35, kind: 'quad', seat: [1.85, -.2], sc: 1.15, stat: { atk: 6, def: 6, hp: 80 }, story: 'ช้างน้อยประดับผ้าทองที่ชอบเล่นน้ำ ใครขี่มันไปตลาดมักได้ของแถมเสมอ',
    pas: { k: 'coin', v: .2, name: 'งาช้างนำโชค', desc: 'ได้รับเหรียญ +20% ขณะขี่' },
    sk: { name: 'พ่นน้ำแรงดันสูง', desc: 'พ่นน้ำเป็นแนวยาว 9 เมตร ATK ×2.2 และทำให้ช้าลง', cd: 11, col: [.4, .75, 1] } }
};
const MOUNT_ORDER = ['shark', 'cat', 'lion', 'ostrich', 'bunny', 'dragon', 'panda', 'unicorn', 'turtle', 'frog', 'penguin', 'fox', 'elephant'];
const MOUNT_MAXLV = 10;
const mountLvCost = lv => 200 * lv;

/* ---- shop hooks ---- */
GEM_CATS.splice(1, 0, { id: 'mount', name: 'สัตว์ขี่', desc: '13 ชนิด · ขี่ได้จริง เร็วขึ้น มีความสามารถพิเศษและสกิลต่อสู้' });
MOUNT_ORDER.forEach(id => GEM_ITEMS.push({ id: 'gmt_' + id, cat: 'mount', gems: MOUNTS[id].gems, mount: id, hot: id === 'shark' || id === 'dragon' }));
SPECIAL_PACKS.push({ id: 'mshark', thb: 199, name: 'แพ็กฉลามดุดัน', desc: 'สัตว์ขี่ ฉลามดุดัน · เพชร 300 · ยาฟื้นพลัง (ใหญ่) ×5', gems: 300, mount: 'shark', items: [['hp_l', 5]], tag: 'สัตว์ขี่ + เพชร · ซื้อได้ครั้งเดียว' });

/* ---- 3D models ---- */
function buildMountMeshes(R) {
  const C = hexc, out = {};
  const mk = fn => { const g = new Geo(31); g.jit = .015; g.uvs = 1.5; fn(g); g.smoothNormals(58); return R.mesh(g); };
  const eye = (g, x, y, z, r = .09) => { g.sphere(x, y, z, r, C('#1a1410'), 6, 4); g.sphere(x + Math.sign(x || 1) * r * .25, y + r * .35, z + r * .55, r * .35, [1, 1, 1], 4, 3); };
  const legQ = (len, r, col, foot) => mk(g => { g.cyl(0, -len, 0, r * .85, r, len, 6, col); g.ell(0, -len + .06, .05, r * 1.1, .1, r * 1.35, foot || col, 6, 4); });
  const quadLegs = (fx, fz, bx, bz, y, len, r, col, foot) => [
    { mesh: legQ(len, r, col, foot), p: [fx, y, fz], a: 'leg', off: 0 }, { mesh: legQ(len, r, col, foot), p: [-fx, y, fz], a: 'leg', off: Math.PI },
    { mesh: legQ(len, r, col, foot), p: [bx, y, bz], a: 'leg', off: Math.PI * .5 }, { mesh: legQ(len, r, col, foot), p: [-bx, y, bz], a: 'leg', off: Math.PI * 1.5 }];
  const saddle = (g, y, z, col, w = .62, l = .7) => { g.box(0, y, z, w, .1, l, col); g.box(0, y - .2, z, w + .08, .38, l * .7, C('#c9302c')); g.box(0, y - .2, z, w + .1, .06, l * .72, C('#e6b84a')); g.box(0, y + .08, z - l * .42, w * .8, .16, .1, col); };

  // 1 shark
  { const b = C('#3f8fd8'), b2 = C('#2a6fb8'), w = C('#f2f6fa'), red = C('#c8323a'), gold = C('#d9a845');
    out.shark = { body: mk(g => {
      g.ell(0, 1.05, 0, .78, .72, 1.45, b, 12, 8); g.ell(0, .82, .25, .6, .45, 1.2, w, 10, 6);
      g.ell(0, 1.0, 1.3, .55, .45, .32, red, 8, 6); // open mouth
      for (let i = 0; i < 7; i++) { const a = (i / 6 - .5) * 2.2; g.cone(Math.sin(a) * .42, 1.32, 1.42 + Math.cos(a) * .05, 0, -1, .2, .06, .16, 4, w); g.cone(Math.sin(a) * .4, .7, 1.42 + Math.cos(a) * .05, 0, 1, .2, .06, .14, 4, w); }
      g.ell(0, 1.38, 1.0, .6, .25, .45, b, 8, 5); g.ell(0, .64, 1.0, .5, .16, .4, w, 8, 4);
      eye(g, .42, 1.42, .95, .1); eye(g, -.42, 1.42, .95, .1);
      g.push(.25, 1.62, .75, 0, 0, .7); g.box(0, 0, 0, .05, .4, .05, C('#e05b5b')); g.pop(); g.push(.25, 1.62, .75, 0, 0, -.7); g.box(0, 0, 0, .05, .4, .05, C('#e05b5b')); g.pop();
      g.cone(0, 1.6, -.2, 0, 1, -.45, .32, .75, 5, b2); g.cone(.6, .85, .3, 1, -.5, -.3, .22, .6, 4, b2); g.cone(-.6, .85, .3, -1, -.5, -.3, .22, .6, 4, b2);
      for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; g.sphere(Math.cos(a) * .74, 1.0 + Math.sin(a) * .66, .62, .085, gold, 5, 3); }
      g.box(.18, .45, .8, .12, .22, .08, gold); g.box(0, .32, .72, .22, .18, .18, C('#b07a2c'));
      g.box(-.5, 1.1, -.6, .02, .08, .5, C('#1a2a3a')); g.box(-.52, .95, -.7, .02, .08, .4, C('#1a2a3a'));
      saddle(g, 1.68, -.15, C('#6b4428'), .6, .7);
    }), parts: [{ mesh: mk(g => { g.cone(0, 1.0, 0, 0, 0, -1, .32, .5, 6, b); g.cone(0, 1.0, -.45, 0, 1, -.55, .2, .8, 4, b2); g.cone(0, 1.0, -.45, 0, -1, -.6, .16, .6, 4, b2); }), p: [0, 0, -1.3], a: 'fin' }] };
  }
  // 2 cat
  { const o = C('#f0a04a'), o2 = C('#c46a22'), w = C('#fbf1e2'), k = C('#2d2622');
    out.cat = { body: mk(g => {
      g.ell(0, 1.05, 0, .5, .48, .9, o, 10, 7); g.ell(0, .95, .45, .38, .4, .4, w, 8, 6);
      for (let i = 0; i < 4; i++) g.box(0, 1.38, -.45 + i * .26, .62, .08, .1, o2);
      g.sphere(0, 1.6, .9, .52, o, 10, 8); g.ell(0, 1.46, 1.25, .3, .22, .2, w, 8, 5); g.sphere(0, 1.53, 1.42, .06, C('#e07070'), 5, 4);
      eye(g, .2, 1.68, 1.3, .08); eye(g, -.2, 1.68, 1.3, .08);
      g.cone(.3, 2.0, .85, .3, 1, 0, .17, .35, 4, o); g.cone(-.3, 2.0, .85, -.3, 1, 0, .17, .35, 4, o); g.cone(.3, 2.02, .9, .3, 1, 0, .08, .25, 4, C('#f2a8a8')); g.cone(-.3, 2.02, .9, -.3, 1, 0, .08, .25, 4, C('#f2a8a8'));
      g.box(0, 1.2, .62, .6, .16, .12, C('#c9302c')); g.sphere(0, 1.1, .72, .09, C('#e6b84a'), 6, 4);
      g.push(.55, 1.15, -.1, 0, 0, -.2); g.box(0, 0, 0, .06, .08, 1.2, k); g.box(0, 0, .62, .1, .18, .06, C('#d9a845')); g.pop();
      saddle(g, 1.45, -.1, C('#3a2b1f'));
    }), parts: [...quadLegs(.26, .55, .26, -.55, .8, .78, .14, o, w), { mesh: mk(g => { g.cone(0, 0, 0, 0, .8, -.6, .1, 1.0, 5, o); g.sphere(0, .8, -.6, .1, o2, 5, 4); }), p: [0, 1.2, -.85], a: 'tail' }] };
  }
  // 3 lion
  { const y = C('#e2b14e'), y2 = C('#c48a2c'), m = C('#8a4a1c'), w = C('#f5e2b8');
    out.lion = { body: mk(g => {
      g.ell(0, 1.12, 0, .58, .55, 1.05, y, 10, 7); g.ell(0, .95, .3, .45, .4, .6, w, 8, 6);
      g.ell(0, 1.7, .95, .82, .82, .55, m, 10, 8); for (let i = 0; i < 14; i++) { const a = i / 14 * TAU; g.cone(Math.cos(a) * .55, 1.7 + Math.sin(a) * .55, .85, Math.cos(a), Math.sin(a), -.3, .2, .45, 4, i % 2 ? m : C('#6b3412')); }
      g.sphere(0, 1.68, 1.2, .48, y, 10, 8); g.ell(0, 1.52, 1.55, .26, .2, .2, w, 8, 5); g.sphere(0, 1.6, 1.7, .08, C('#4a2a1a'), 5, 4);
      eye(g, .2, 1.8, 1.55, .08); eye(g, -.2, 1.8, 1.55, .08);
      g.sphere(.36, 2.08, 1.15, .13, y, 6, 4); g.sphere(-.36, 2.08, 1.15, .13, y, 6, 4);
      g.cone(0, 2.15, 1.15, 0, 1, 0, .26, .25, 5, C('#e6b84a')); for (let i = 0; i < 5; i++) { const a = i / 5 * TAU; g.cone(Math.cos(a) * .2, 2.38, 1.15 + Math.sin(a) * .2, 0, 1, 0, .06, .16, 4, C('#e6b84a')); }
      saddle(g, 1.68, -.25, C('#7a1f2a'), .7, .8);
    }), parts: [...quadLegs(.3, .62, .3, -.62, .85, .82, .17, y, y2), { mesh: mk(g => { g.cone(0, 0, 0, 0, .4, -1, .08, 1.0, 5, y); g.sphere(0, .38, -.95, .15, m, 6, 4); }), p: [0, 1.25, -1.0], a: 'tail' }] };
  }
  // 4 ostrich
  { const gr = C('#3f8a4a'), or = C('#e89a3a'), br = C('#8a5a32'), legc = C('#e8a07a'), wh = C('#f4efe2');
    out.ostrich = { body: mk(g => {
      g.ell(0, 1.55, 0, .62, .52, .78, or, 10, 7); g.ell(0, 1.62, .1, .5, .44, .6, gr, 10, 6);
      g.cone(0, 1.75, .55, 0, 1, .35, .13, 1.05, 6, wh); g.ell(0, 2.75, .9, .24, .24, .3, wh, 8, 6); g.cone(0, 2.7, 1.12, 0, -.1, 1, .1, .32, 5, or);
      g.box(0, 2.82, .98, .5, .1, .12, C('#6b4428')); g.sphere(.14, 2.84, 1.05, .07, C('#9fd0e8'), 5, 4); g.sphere(-.14, 2.84, 1.05, .07, C('#9fd0e8'), 5, 4);
      g.ell(0, 2.88, .82, .26, .16, .28, br, 8, 5);
      for (let i = 0; i < 3; i++) g.cone(.05 * (i - 1), 2.98, .78, (i - 1) * .2, 1, -.4, .06, .5, 4, i === 1 ? C('#c9302c') : wh);
      g.box(0, 1.95, .55, .55, .12, .12, C('#c9302c'));
      g.ell(.55, 1.45, -.2, .2, .32, .5, br, 6, 5); g.ell(-.55, 1.45, -.2, .2, .32, .5, br, 6, 5);
      for (let i = 0; i < 6; i++) g.cone(0, 1.6, -.6, (i - 2.5) * .25, .3, -1, .1, .55, 4, i % 2 ? or : gr);
      saddle(g, 2.02, -.15, C('#6b4428'), .55, .6);
    }), parts: [{ mesh: legQ(1.15, .08, legc, legc), p: [.22, 1.2, 0], a: 'leg', off: 0, amp: 1.1 }, { mesh: legQ(1.15, .08, legc, legc), p: [-.22, 1.2, 0], a: 'leg', off: Math.PI, amp: 1.1 }] };
  }
  // 5 bunny
  { const w = C('#f6f4fb'), pk = C('#f4b6c8'), bl = C('#9fb8ff');
    out.bunny = { body: mk(g => {
      g.ell(0, .95, -.05, .6, .58, .82, w, 10, 8); g.sphere(0, 1.5, .72, .5, w, 10, 8);
      eye(g, .22, 1.58, 1.08, .085); eye(g, -.22, 1.58, 1.08, .085); g.sphere(0, 1.45, 1.2, .06, pk, 5, 4);
      g.sphere(.32, 1.4, 1.0, .1, pk, 5, 4); g.sphere(-.32, 1.4, 1.0, .1, pk, 5, 4);
      g.sphere(0, .95, -.88, .24, w, 6, 5);
      g.box(0, 1.25, .5, .7, .1, .1, bl); g.cone(0, 1.2, .58, 0, -1, .3, .12, .2, 4, C('#e6d36a'));
      g.push(0, 1.95, .7, 0, 0, 0); g.cone(.18, 0, 0, .08, 1, -.05, .07, .3, 3, C('#f0d36a')); g.pop();
      saddle(g, 1.48, -.1, C('#7a8acc'), .6, .66);
    }), parts: [{ mesh: mk(g => { g.ell(0, .45, 0, .13, .5, .07, w, 6, 5); g.ell(0, .45, .04, .08, .38, .03, pk, 6, 4); }), p: [.2, 1.85, .66], a: 'ear', off: 0 }, { mesh: mk(g => { g.ell(0, .45, 0, .13, .5, .07, w, 6, 5); g.ell(0, .45, .04, .08, .38, .03, pk, 6, 4); }), p: [-.2, 1.85, .66], a: 'ear', off: 1 },
      ...quadLegs(.26, .45, .3, -.4, .5, .42, .14, w, w)] };
  }
  // 6 dragon
  { const r = C('#d8443a'), r2 = C('#a82a24'), y = C('#f4c45a'), hn = C('#f4ead2');
    out.dragon = { body: mk(g => {
      g.ell(0, 1.05, 0, .58, .52, 1.0, r, 10, 7); g.ell(0, .9, .2, .42, .38, .8, y, 8, 6);
      for (let i = 0; i < 6; i++) g.cone(0, 1.5, .6 - i * .28, 0, 1, -.2, .1, .25, 4, y);
      g.cone(0, 1.25, .65, 0, .8, .6, .26, .55, 6, r); g.sphere(0, 1.75, 1.05, .45, r, 10, 8); g.ell(0, 1.6, 1.45, .3, .22, .3, r2, 8, 5);
      g.sphere(.1, 1.68, 1.72, .04, C('#3a1a10'), 4, 3); g.sphere(-.1, 1.68, 1.72, .04, C('#3a1a10'), 4, 3);
      eye(g, .22, 1.88, 1.35, .09); eye(g, -.22, 1.88, 1.35, .09);
      g.cone(.22, 2.05, .9, .25, 1, -.6, .08, .45, 4, hn); g.cone(-.22, 2.05, .9, -.25, 1, -.6, .08, .45, 4, hn);
      saddle(g, 1.55, -.2, C('#3a2b1f'), .62, .7);
    }), parts: [...quadLegs(.3, .55, .3, -.55, .75, .72, .16, r, r2),
      { mesh: mk(g => { g.cone(0, 0, 0, 0, .1, -1, .2, 1.1, 6, r); g.cone(0, .1, -1.05, 0, .2, -1, .16, .3, 4, y); }), p: [0, 1.0, -.9], a: 'tail' },
      { mesh: mk(g => { g.box(.5, 0, 0, 1.0, .05, .6, r2); g.box(.5, .02, -.05, .95, .03, .5, C('#f08a5a')); g.cone(1.0, 0, .25, 1, 0, 0, .05, .2, 3, hn); }), p: [.3, 1.45, .1], a: 'wing', off: 0 },
      { mesh: mk(g => { g.box(-.5, 0, 0, 1.0, .05, .6, r2); g.box(-.5, .02, -.05, .95, .03, .5, C('#f08a5a')); g.cone(-1.0, 0, .25, -1, 0, 0, .05, .2, 3, hn); }), p: [-.3, 1.45, .1], a: 'wing', off: 1 }] };
  }
  // 7 panda
  { const w = C('#f6f4ee'), k = C('#26221f'), gr = C('#6aaa4a');
    out.panda = { body: mk(g => {
      g.ell(0, 1.05, 0, .66, .62, .9, w, 10, 8); g.ell(0, 1.12, -.05, .68, .3, .5, k, 10, 6);
      g.sphere(0, 1.65, .82, .52, w, 10, 8); g.sphere(.36, 2.05, .78, .17, k, 6, 5); g.sphere(-.36, 2.05, .78, .17, k, 6, 5);
      g.ell(.2, 1.68, 1.2, .14, .17, .1, k, 6, 5); g.ell(-.2, 1.68, 1.2, .14, .17, .1, k, 6, 5); eye(g, .2, 1.7, 1.26, .06); eye(g, -.2, 1.7, 1.26, .06);
      g.ell(0, 1.5, 1.28, .2, .14, .12, w, 6, 4); g.sphere(0, 1.55, 1.38, .06, k, 5, 4);
      g.box(0, 1.3, .55, .8, .14, .14, C('#c9302c'));
      g.push(.5, 1.3, -.3, .5, 0, -.3); g.cyl(0, -.6, 0, .05, .05, 1.6, 5, gr); g.box(0, .2, 0, .12, .04, .12, C('#3a7a2a')); g.pop();
      saddle(g, 1.62, -.15, C('#3a7a2a'), .68, .68);
    }), parts: [...quadLegs(.32, .5, .32, -.5, .72, .7, .2, k, k)] };
  }
  // 8 unicorn
  { const w = C('#fbf8ff'), gd = C('#f2c94c'), rb = ['#ff6b6b', '#ffb84d', '#ffe66b', '#6bdc6b', '#6bb8ff', '#b07bff'].map(C);
    out.unicorn = { body: mk(g => {
      g.ell(0, 1.4, 0, .5, .5, 1.0, w, 10, 7);
      g.cone(0, 1.55, .7, 0, 1, .6, .26, .9, 6, w); g.ell(0, 2.3, 1.2, .26, .3, .48, w, 8, 6); g.ell(0, 2.2, 1.55, .2, .2, .2, C('#f4e2ee'), 6, 4);
      eye(g, .2, 2.4, 1.3, .07); eye(g, -.2, 2.4, 1.3, .07);
      g.cone(0, 2.6, 1.32, 0, 1, .45, .07, .65, 5, gd); g.cone(.14, 2.65, 1.05, .2, 1, -.4, .06, .25, 4, w); g.cone(-.14, 2.65, 1.05, -.2, 1, -.4, .06, .25, 4, w);
      rb.forEach((c, i) => g.box(0, 2.55 - i * .2, .98 - i * .12, .12, .18, .22, c));
      saddle(g, 1.95, -.25, C('#b07bff'), .55, .7);
    }), parts: [...quadLegs(.24, .62, .24, -.62, 1.08, 1.05, .1, w, gd),
      { mesh: mk(g => rb.forEach((c, i) => g.cone((i - 2.5) * .03, 0, 0, (i - 2.5) * .06, -.5, -1, .07, .9, 4, c))), p: [0, 1.6, -1.0], a: 'tail' }] };
  }
  // 9 turtle
  { const sh = C('#5a8a3a'), sh2 = C('#3f6a2a'), sk = C('#a8c87a'), gd = C('#d9a845');
    out.turtle = { body: mk(g => {
      g.sphere(0, .78, 0, 1.0, sh, 12, 8, .68); g.cyl(0, .55, 0, 1.08, 1.08, .18, 12, C('#c8a86a'));
      for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; g.cyl(Math.cos(a) * .55, 1.2, Math.sin(a) * .55, .22, .2, .14, 6, sh2); } g.cyl(0, 1.42, 0, .24, .22, .14, 6, sh2);
      g.cone(0, .7, .9, 0, .3, 1, .26, .45, 6, sk); g.sphere(0, .95, 1.4, .34, sk, 8, 6); eye(g, .17, 1.05, 1.62, .07); eye(g, -.17, 1.05, 1.62, .07);
      g.box(0, .88, 1.66, .2, .03, .05, C('#5a3a2a'));
      g.box(0, 1.55, -.1, .9, .2, .8, C('#8a5a32')); g.box(0, 1.68, -.1, .7, .16, .6, C('#c9302c')); g.box(0, 1.6, -.1, 1.0, .05, .9, gd);
    }), parts: [...quadLegs(.62, .55, .62, -.55, .55, .5, .2, sk, sk), { mesh: mk(g => g.cone(0, 0, 0, 0, -.1, -1, .12, .35, 4, sk)), p: [0, .6, -.95], a: 'tail' }] };
  }
  // 10 frog
  { const gn = C('#5fbf4a'), gn2 = C('#3f8f2a'), y = C('#e8f0a0'), pk = C('#f08a9a');
    out.frog = { body: mk(g => {
      g.ell(0, .9, 0, .82, .55, .9, gn, 12, 8); g.ell(0, .72, .3, .65, .35, .6, y, 10, 6);
      for (let i = 0; i < 5; i++) g.sphere((i % 2 ? .4 : -.35) * (i % 3 ? 1 : -.5), 1.32, -.4 + i * .2, .09, gn2, 5, 3);
      g.sphere(.38, 1.42, .55, .24, gn, 8, 6); g.sphere(-.38, 1.42, .55, .24, gn, 8, 6); eye(g, .42, 1.48, .72, .13); eye(g, -.42, 1.48, .72, .13);
      g.box(0, .92, .88, .9, .05, .12, pk); g.sphere(.5, 1.0, .8, .08, C('#f4a0a0'), 5, 3); g.sphere(-.5, 1.0, .8, .08, C('#f4a0a0'), 5, 3);
      g.cone(0, 1.62, .55, 0, 1, 0, .2, .18, 6, C('#e8c84a')); for (let i = 0; i < 4; i++) { const a = i / 4 * TAU; g.cone(Math.cos(a) * .15, 1.78, .55 + Math.sin(a) * .15, 0, 1, 0, .05, .12, 3, C('#e8c84a')); }
      saddle(g, 1.42, -.15, C('#7a4a26'), .62, .62);
    }), parts: [{ mesh: legQ(.42, .12, gn, gn2), p: [.45, .5, .55], a: 'leg', off: 0 }, { mesh: legQ(.42, .12, gn, gn2), p: [-.45, .5, .55], a: 'leg', off: 0 },
      { mesh: mk(g => { g.ell(0, -.15, -.15, .2, .3, .45, gn, 6, 5); g.ell(0, -.42, .1, .18, .06, .3, gn2, 6, 3); }), p: [.62, .6, -.45], a: 'leg', off: Math.PI },
      { mesh: mk(g => { g.ell(0, -.15, -.15, .2, .3, .45, gn, 6, 5); g.ell(0, -.42, .1, .18, .06, .3, gn2, 6, 3); }), p: [-.62, .6, -.45], a: 'leg', off: Math.PI }] };
  }
  // 11 penguin (belly slider)
  { const k = C('#23262e'), w = C('#f6f6f2'), or = C('#f0a03a'), rd = C('#d03a34');
    out.penguin = { body: mk(g => {
      g.ell(0, .62, 0, .62, .52, 1.15, k, 12, 8); g.ell(0, .42, .1, .5, .3, 1.0, w, 10, 6);
      g.sphere(0, .95, 1.05, .46, k, 10, 8); g.ell(0, .88, 1.32, .32, .28, .22, w, 8, 5); eye(g, .18, 1.05, 1.42, .07); eye(g, -.18, 1.05, 1.42, .07);
      g.cone(0, .88, 1.48, 0, -.15, 1, .1, .28, 5, or); g.ell(.22, .9, 1.4, .08, .06, .04, C('#f6a8a8'), 4, 3); g.ell(-.22, .9, 1.4, .08, .06, .04, C('#f6a8a8'), 4, 3);
      g.cyl(0, .82, .72, .5, .5, .2, 10, rd); g.push(.35, .7, .55, .2, 0, .4); g.box(0, -.2, 0, .14, .45, .08, rd); g.pop();
      g.ell(.2, .5, -1.2, .14, .08, .22, or, 6, 3); g.ell(-.2, .5, -1.2, .14, .08, .22, or, 6, 3);
      saddle(g, 1.18, -.2, C('#3a5aa0'), .6, .66);
    }), parts: [{ mesh: mk(g => g.ell(.3, 0, 0, .35, .06, .2, k, 6, 3)), p: [.55, .62, .2], a: 'flipper', off: 0 }, { mesh: mk(g => g.ell(-.3, 0, 0, .35, .06, .2, k, 6, 3)), p: [-.55, .62, .2], a: 'flipper', off: 1 }] };
  }
  // 12 fox
  { const o = C('#f07a2a'), w = C('#fbf1e2'), k = C('#3a2a22'), pu = C('#b07bff');
    out.fox = { body: mk(g => {
      g.ell(0, 1.05, 0, .46, .44, .9, o, 10, 7); g.ell(0, .95, .4, .34, .36, .45, w, 8, 6);
      g.sphere(0, 1.58, .88, .42, o, 10, 8); g.cone(0, 1.5, 1.15, 0, -.15, 1, .24, .42, 6, w); g.sphere(0, 1.47, 1.56, .06, k, 5, 4);
      eye(g, .18, 1.66, 1.2, .07); eye(g, -.18, 1.66, 1.2, .07);
      g.cone(.24, 1.9, .82, .25, 1, -.1, .15, .42, 4, o); g.cone(-.24, 1.9, .82, -.25, 1, -.1, .15, .42, 4, o); g.cone(.24, 2.18, .79, .25, 1, -.1, .06, .15, 4, k); g.cone(-.24, 2.18, .79, -.25, 1, -.1, .06, .15, 4, k);
      g.box(0, 1.28, .58, .5, .1, .1, pu); g.sphere(0, 1.18, .66, .1, C('#e6d6ff'), 6, 4);
      saddle(g, 1.42, -.15, C('#5a3a8a'), .55, .62);
    }), parts: [...quadLegs(.22, .52, .22, -.52, .8, .8, .11, o, k),
      { mesh: mk(g => { for (let i = 0; i < 9; i++) { const a = (i / 8 - .5) * 2.4, dx = Math.sin(a) * .8, dy = .55 + Math.cos(a) * .45, l = Math.hypot(dx, dy, .7); g.cone(0, 0, 0, dx, dy, -.7, .2, .62, 6, o); g.cone(dx / l * .62, dy / l * .62, -.7 / l * .62, dx, dy, -.7, .2, .32, 6, w); } }), p: [0, 1.2, -.85], a: 'tail' }] };
  }
  // 13 elephant
  { const gy = C('#9aa3b4'), gy2 = C('#7a8394'), gd = C('#e6b84a'), rd = C('#c9302c'), iv = C('#f6efe0');
    out.elephant = { body: mk(g => {
      g.ell(0, 1.4, 0, .82, .75, 1.1, gy, 12, 8); g.sphere(0, 1.9, 1.1, .6, gy, 10, 8);
      eye(g, .3, 2.05, 1.55, .08); eye(g, -.3, 2.05, 1.55, .08);
      g.cone(0, 1.75, 1.55, 0, -.45, 1, .22, .5, 6, gy); g.cone(0, 1.55, 1.95, 0, -1, .25, .15, .6, 6, gy); g.cone(0, 1.0, 2.05, 0, .3, 1, .1, .22, 5, gy2);
      g.cone(.25, 1.55, 1.5, .1, -.3, 1, .06, .45, 4, iv); g.cone(-.25, 1.55, 1.5, -.1, -.3, 1, .06, .45, 4, iv);
      g.box(0, 2.25, 1.35, .6, .12, .3, gd); g.cone(0, 2.3, 1.48, 0, 1, .3, .1, .3, 4, rd);
      g.box(0, 2.15, -.1, 1.25, .1, 1.2, rd); g.box(0, 2.1, -.1, 1.35, .06, 1.25, gd); g.box(.68, 1.8, -.1, .04, .6, 1.0, rd); g.box(-.68, 1.8, -.1, .04, .6, 1.0, rd);
    }), parts: [...quadLegs(.42, .6, .42, -.6, .95, .92, .26, gy, gy2),
      { mesh: mk(g => { g.ell(.3, -.12, 0, .34, .44, .07, gy, 8, 6); g.ell(.3, -.12, -.05, .24, .32, .03, C('#c7a3ad'), 6, 5); }), p: [.45, 2.05, .95], a: 'earR', off: 0 },
      { mesh: mk(g => { g.ell(-.3, -.12, 0, .34, .44, .07, gy, 8, 6); g.ell(-.3, -.12, -.05, .24, .32, .03, C('#c7a3ad'), 6, 5); }), p: [-.45, 2.05, .95], a: 'earL', off: 0 },
      { mesh: mk(g => { g.cone(0, 0, 0, 0, -1, -.3, .05, .5, 4, gy2); g.sphere(0, -.5, -.15, .07, k2(), 4, 3); }), p: [0, 1.5, -1.1], a: 'tail' }] };
    function k2() { return C('#3a3a44'); }
  }
  return out;
}
const MountMeshes = {};

/* ---- animation / drawing ---- */
const _mB = M4.ident(), _mL = M4.ident(), _mO = M4.ident();
function mountFrame(id, st) {
  // returns {bob, pitch} for the body given anim state {ph, amp, t}
  const D = MOUNTS[id], a = st.amp || 0, ph = st.ph || 0, t = st.t || 0;
  if (D.kind === 'float') return { bob: .25 + Math.sin(t * 2) * .1 + a * .05 * Math.sin(ph * 2), pitch: Math.sin(ph) * .05 * a, roll: Math.sin(t * 1.3) * .04 };
  if (D.kind === 'slide') return { bob: .02 + Math.abs(Math.sin(t * 3)) * .02 * (1 - a), pitch: 0, roll: Math.sin(ph * .5) * .1 * a };
  if (D.kind === 'hop') { const h = Math.max(0, Math.sin(ph * .5)); return { bob: a * .55 * h + Math.sin(t * 2.4) * .015, pitch: a * (-.25 * Math.cos(ph * .5)) * h, roll: 0 }; }
  if (D.kind === 'biped') return { bob: a * .1 * Math.abs(Math.cos(ph)) + Math.sin(t * 2) * .02, pitch: a * .06, roll: Math.sin(ph) * .05 * a };
  return { bob: a * .09 * Math.cos(ph * 2) + Math.sin(t * 2) * .015, pitch: a * .04 * Math.sin(ph * 2), roll: 0 };
}
function drawMount(R, meshes, id, x, y, z, face, st, s = 1, flash = 0) {
  const D = MOUNTS[id], m = meshes[id]; if (!m) return null;
  const f = mountFrame(id, st), sc = s * D.sc, a = st.amp || 0, t = st.t || 0, ph = st.ph || 0;
  M4.compose(_mB, x, y + f.bob * sc, z, f.pitch, face, f.roll, sc, sc, sc);
  R.drawMesh(m.body, _mB, null, RIG_FILL, flash);
  for (const p of m.parts) {
    let rx = 0, ry = 0, rz = 0;
    if (p.a === 'leg') { if (D.kind === 'hop') rx = -a * .9 * Math.max(0, Math.sin(ph * .5)) * (p.off ? -1 : 1); else rx = a * .62 * (p.amp || 1) * Math.sin(ph + p.off); }
    else if (p.a === 'tail') { ry = Math.sin(t * (2.5 + a * 4)) * (.25 + a * .2); rx = -a * .15; }
    else if (p.a === 'fin') ry = Math.sin(t * 3 + ph) * (.3 + a * .3);
    else if (p.a === 'wing') rz = (p.off ? -1 : 1) * (.25 + Math.sin(t * (3 + a * 6)) * (.25 + a * .2));
    else if (p.a === 'ear') rx = -.2 - a * .4 * Math.abs(Math.sin(ph * .5)) + Math.sin(t * 2 + p.off) * .06;
    else if (p.a === 'earR' || p.a === 'earL') ry = (p.a === 'earR' ? 1 : -1) * (Math.sin(t * 2.4) * .25 + .1);
    else if (p.a === 'flipper') rz = (p.off ? -1 : 1) * (Math.sin(t * 4 + ph) * (.2 + a * .4));
    else if (p.a === 'wheel') rx = ph * 1.4;
    else if (p.a === 'prop') rz = t * (8 + a * 40);
    M4.compose(_mL, p.p[0], p.p[1], p.p[2], rx, ry, rz, 1, 1, 1); M4.mul(_mO, _mB, _mL);
    R.drawMesh(p.mesh, _mO, null, RIG_FILL, flash); R.drawOutline(p.mesh, _mO, .02);
  }
  R.drawOutline(m.body, _mB, .022);
  return M4.xform(_mB, 0, D.seat[0], D.seat[1]);
}

/* ---- system ---- */
const Mounts = {
  st: { ph: 0, amp: 0, t: 0 }, cd: 0, dash: null, tick: 0,
  data() { const S = Save.d; if (!S.mounts) S.mounts = { own: {}, cur: null, ride: false, trial: null }; return S.mounts; },
  owned(id) { const M = this.data(); return !!M.own[id] || !!(M.trial && M.trial.id === id && M.trial.until > Date.now()); },
  lv(id) { return this.data().own[id] || 1; },
  cur() { const M = this.data(); return M.cur && this.owned(M.cur) ? M.cur : null; },
  riding() { return !!(Save.d && this.data().ride && this.cur()); },
  pas(k) { if (!this.riding()) return 0; const p = MOUNTS[this.cur()].pas; return p.k === k ? p.v : 0; },
  statOf(id, lv) { const b = MOUNTS[id].stat, f = 1 + .2 * ((lv || this.lv(id)) - 1); return { atk: Math.round(b.atk * f), def: Math.round(b.def * f), hp: Math.round(b.hp * f) }; },
  // stat bonus applies while a mount is equipped (riding or not), like the reference game
  applyStats(st) { const id = this.cur(); if (!id) return; const b = this.statOf(id); st.atk += b.atk; st.def += b.def; st.maxhp += b.hp; if (this.riding()) { st.spd *= MOUNTS[id].spd; if (MOUNTS[id].pas.k === 'atkp') st.atk *= 1 + MOUNTS[id].pas.v; } },
  grant(id, silent) { const M = this.data(); if (!M.own[id]) M.own[id] = 1; if (M.trial && M.trial.id === id) M.trial = null; M.cur = id; if (!silent) { UI.toast(`ได้รับสัตว์ขี่: ${MOUNTS[id].name}!`, 'rare'); Audio.sfx('level'); } Player.recalc(); Save.write(); },
  buy(id) { const S = Save.d, D = MOUNTS[id]; if (this.data().own[id]) return false; if (S.gems < D.gems) { UI.toast('เพชรไม่พอ เติมเพชรได้ที่ร้านค้า', 'warn'); return false; } S.gems -= D.gems; Gems.log('−' + D.gems, 'สัตว์ขี่ ' + D.name); this.grant(id); UI.gemPop(); return true; },
  trial(id) { const M = this.data(); if (M.own[id]) return; M.trial = { id, until: Date.now() + 60e3 }; M.cur = id; this.ride(true); UI.toast(`ทดลองขี่ ${MOUNTS[id].name} 60 วินาที`, 'quest'); },
  levelUp(id) { const S = Save.d, M = this.data(), lv = M.own[id]; if (!lv || lv >= MOUNT_MAXLV) return false; const c = mountLvCost(lv); if (S.coins < c) { UI.toast('เหรียญไม่พอ', 'warn'); return false; } S.coins -= c; M.own[id] = lv + 1; Audio.sfx('level'); UI.toast(`${MOUNTS[id].name} เลเวล ${lv + 1}!`, 'quest'); Player.recalc(); Save.write(); return true; },
  select(id) { const M = this.data(); if (!this.owned(id)) return; M.cur = id; Player.recalc(); Save.write(); },
  ride(on) {
    const M = this.data(); if (on === undefined) on = !M.ride;
    if (on && !this.cur()) { UI.toast('ยังไม่มีสัตว์ขี่ ดูได้ที่ร้านเพชร หมวดสัตว์ขี่', 'warn'); UI.openPanel('stable'); return; }
    if (Player.dead) return;
    M.ride = on; const P = Player; Audio.sfx(on ? 'warp' : 'ui');
    Particles.burst(P.x, 1, P.z, 26, on ? MOUNTS[this.cur()].sk.col : [1, 1, 1], 4, .6, .45, 2);
    Fx.shock(P.x, P.z, 1.8, [1, 1, 1], .35);
    if (on) UI.toast(`ขี่ ${MOUNTS[this.cur()].name}`, 'item');
    P.recalc(); UI.mountBtns(); Save.write();
  },
  update(dt) {
    const P = Player, M = this.data();
    if (M.trial && M.trial.until < Date.now()) { const was = M.trial.id; M.trial = null; if (!M.own[was]) { if (M.cur === was) { M.cur = Object.keys(M.own)[0] || null; if (!M.cur) M.ride = false; } UI.toast('หมดเวลาทดลองขี่ ซื้อได้ที่ร้านเพชร', 'info'); P.recalc(); UI.mountBtns(); } }
    this.cd = Math.max(0, this.cd - dt); this.st.t += dt;
    if (!this.riding()) return;
    if (P.dead) { M.ride = false; P.recalc(); UI.mountBtns(); return; }
    const sp = P.moving ? Math.hypot(P.vx, P.vz) : 0;
    this.st.amp = lerp(this.st.amp, P.moving || P.dashT > 0 ? 1 : 0, Math.min(1, dt * 8));
    const stride = MOUNTS[this.cur()].kind === 'hop' ? 1.6 : 2.6;
    this.st.ph += (P.dashT > 0 ? P.dashSpd : sp) * dt * TAU / stride;
    // passives over time
    this.tick += dt; if (this.tick >= 1) { this.tick = 0; const S = Save.d, st = P.stats; const r = this.pas('regen'); if (r) S.hp = Math.min(st.maxhp, S.hp + st.maxhp * r); const m = this.pas('mpregen'); if (m) S.mp = Math.min(st.maxmp, S.mp + st.maxmp * m); }
    // trail sparkle for unicorn / fire for dragon while moving
    const id = this.cur();
    if (P.moving && Math.random() < dt * 12) { if (id === 'unicorn') Particles.add(P.x + rand(-.4, .4), .15, P.z + rand(-.4, .4), { c: pick([[1, .5, .5], [1, .9, .4], [.5, 1, .6], [.5, .7, 1], [.8, .5, 1]]), s: .3, life: .9, vy: .5 }); else if (id === 'penguin') Particles.add(P.x + rand(-.4, .4), .1, P.z + rand(-.4, .4), { c: [.85, .95, 1], s: .25, life: .5, vy: .4 }); else if (id === 'shark') Particles.add(P.x + rand(-.5, .5), .3, P.z + rand(-.5, .5), { c: [.6, .85, 1], s: .28, life: .5, vy: 1.2 }); }
    // dash hits
    if (this.dash) {
      const d = this.dash; d.t -= dt;
      for (const mm of Monsters.list) if (!mm.dead && mm.zone === P.zone && !d.hit.has(mm) && dist2(mm.x, mm.z, P.x, P.z) < (d.r + mm.d.r) ** 2) { d.hit.add(mm); Combat.damageMonster(mm, d.dmg, d.o || {}); Particles.burst(mm.x, 1, mm.z, 10, d.col, 4, .4, .35, 2); if (d.knock && !mm.d.boss) { const a = Math.atan2(mm.x - P.x, mm.z - P.z); const r = Col.resolve(mm.x + Math.sin(a) * 2.2, mm.z + Math.cos(a) * 2.2, mm.d.r); mm.x = r[0]; mm.z = r[1]; } }
      if (d.t <= 0 || P.dashT <= 0) { const f = d.end; this.dash = null; f && f(); }
    }
  },
  /* passive hooks */
  onDealt(m, dmg) { const s = this.pas('steal'); if (s) { const S = Save.d; S.hp = Math.min(Player.stats.maxhp, S.hp + dmg * s); } if (!m.dead && !m.d.boss) { const k = this.pas('stun'); if (k && Math.random() < k) { m.stun = .8; UI.floatText(m.x, m.d.h + 1, m.z, 'มึนงง!', 'immune'); } const c = this.pas('chill'); if (c && Math.random() < c) m.slow = 2; } },
  onHurt(raw, src) { // returns modified dmg multiplier or -1 for dodge
    if (!this.riding()) return 1;
    const dg = this.pas('dodge'); if (dg && Math.random() < dg) { UI.floatText(Player.x, 2.6, Player.z, 'หลบ!', 'immune'); return -1; }
    const t = this.pas('thorns'); if (t && src && src.hp > 0 && !src.dead) { Combat.damageMonster(src, raw * t * 2, {}); }
    return 1 - this.pas('reduce');
  },
  /* mount skill */
  useSkill() {
    const P = Player, S = Save.d; if (!this.riding()) { this.ride(true); return; }
    if (P.dead || Game.paused) return; if (this.cd > 0) { UI.toast(`สกิลสัตว์ขี่พร้อมใน ${Math.ceil(this.cd)} วิ`, 'info'); return; }
    const id = this.cur(), D = MOUNTS[id], sk = D.sk, c = sk.col, st = P.stats, atk = st.atk;
    const tgt = Game.nearestMonster ? Game.nearestMonster(12) : null;
    if (tgt) P.face = Math.atan2(tgt.x - P.x, tgt.z - P.z);
    this.cd = sk.cd; P.combatT = 6; P.moveTo = null; Audio.sfx('skill'); VoiceFx.shout('ha', P.sheet, .22);
    UI.floatText(P.x, 3.4, P.z, sk.name, 'skillname');
    const inR = (m, x, z, r) => !m.dead && m.zone === P.zone && dist2(m.x, m.z, x, z) < (r + m.d.r) ** 2;
    const area = (x, z, r, mult, o) => { let n = 0; for (const m of Monsters.list) if (inR(m, x, z, r)) { Combat.damageMonster(m, atk * mult, o || {}); n++; } return n; };
    const cone = (r, half, mult, o) => { for (const m of Monsters.list) { if (!inR(m, P.x, P.z, r)) continue; const a = Math.atan2(m.x - P.x, m.z - P.z); if (Math.abs(angWrap(a - P.face)) < half) Combat.damageMonster(m, atk * mult, o || {}); } };
    const fwd = d => [P.x + Math.sin(P.face) * d, P.z + Math.cos(P.face) * d];
    const dash = (dist, spd, mult, o, end, knock) => { P.dashDir = P.face; P.dashSpd = spd; P.dashT = dist / spd; this.dash = { t: P.dashT + .05, r: 1.6, dmg: atk * mult, o, hit: new Set(), col: c, end, knock }; };
    switch (id) {
      case 'shark': dash(7, 26, 2.4, {}, () => { Fx.shock(P.x, P.z, 2.4, c, .4); Particles.burst(P.x, .6, P.z, 30, [.6, .85, 1], 6, .6, .4, 4); }); Fx.arc(P.x, 1.2, P.z, P.face, 0, 2.2, c, .3); break;
      case 'ostrich': dash(8, 30, 2.0, {}, () => Fx.shock(P.x, P.z, 2, c, .35), true); break;
      case 'penguin': dash(9, 24, .4, { slow: 2 }, () => { Fx.spikes(P.x, P.z, 4, 14); Fx.shock(P.x, P.z, 4, c, .5); area(P.x, P.z, 4, 1.6, { slow: 3 }); Game.shake(.25); Audio.sfx('slam'); }); break;
      case 'cat': for (let i = 0; i < 5; i++) setTimeout(() => { const [x, z] = fwd(1.6); Fx.arc(x, 1.2, z, P.face + (i % 2 ? .6 : -.6), i % 2 ? .4 : -.4, 2.2, c, .22); cone(4, .9, .75); Audio.sfx('hit'); }, i * 110); break;
      case 'lion': Fx.shock(P.x, P.z, 7, c, .6); Fx.shock(P.x, P.z, 4.5, [1, 1, .7], .45); Particles.ring(P.x, 1, P.z, 1.5, 50, c, .7, .55); area(P.x, P.z, 7, 1.6, { stun: 2 }); Game.addBuff('atk', Math.max(Save.d.buffs.atk || 0, 8)); Game.shake(.45); Audio.sfx('boss'); break;
      case 'bunny': { const [tx, tz] = tgt && Math.sqrt(dist2(tgt.x, tgt.z, P.x, P.z)) < 9 ? [tgt.x, tgt.z] : fwd(5); const sx = P.x, sz = P.z; this.jump = { t: 0, dur: .45, sx, sz, tx, tz }; setTimeout(() => { const r = Col.resolve(tx, tz, .55); P.x = r[0]; P.z = r[1]; World.clampBounds(P); Fx.shock(P.x, P.z, 4.5, c, .5); Fx.pillar(P.x, P.z, 1.2, 5, [.85, .9, 1], .5); Particles.burst(P.x, .4, P.z, 40, [1, 1, .9], 6, .6, .4, 3); area(P.x, P.z, 4.5, 2.6, { stun: 1 }); Game.shake(.4); Audio.sfx('slam'); }, 450); break; }
      case 'dragon': for (let i = 0; i < 5; i++) setTimeout(() => { for (let k = 0; k < 14; k++) { const a = P.face + rand(-.55, .55), v = rand(8, 14); Particles.add(P.x + Math.sin(P.face) * 1.6, 1.6, P.z + Math.cos(P.face) * 1.6, { c: pick([[1, .55, .15], [1, .8, .3], [1, .35, .1]]), s: .55, life: .55, vx: Math.sin(a) * v, vz: Math.cos(a) * v, vy: rand(-.5, 1), drag: 1.5 }); } cone(7, .62, .65); }, i * 200); Audio.sfx('shoot'); break;
      case 'panda': Fx.shock(P.x, P.z, 4.5, c, .5); Fx.spikes(P.x, P.z, 3.5, 10); area(P.x, P.z, 4.5, 2.0, {}); Game.addBuff('guard', Math.max(Save.d.buffs.guard || 0, 5)); Game.shake(.35); Audio.sfx('slam'); break;
      case 'unicorn': { const h = Math.round(st.maxhp * .3); S.hp = Math.min(st.maxhp, S.hp + h); UI.dmgNum(P.x, 2.6, P.z, h, 'heal'); Fx.pillar(P.x, P.z, 1.6, 6, [1, .75, 1], .7); const cols = [[1, .45, .45], [1, .8, .35], [1, 1, .45], [.45, 1, .5], [.45, .7, 1], [.75, .45, 1]]; cols.forEach((cc, i) => setTimeout(() => Fx.shock(P.x, P.z, 1.5 + i * .7, cc, .4), i * 60)); area(P.x, P.z, 5, 1.5, {}); Audio.sfx('correct'); break; }
      case 'turtle': for (let i = 0; i < 4; i++) setTimeout(() => { Fx.arc(P.x, .8, P.z, P.face + i * 1.6, 0, 3.6, c, .3); Particles.ring(P.x, .6, P.z, 3.5, 20, c, .35, .4); area(P.x, P.z, 4, .85, {}); Audio.sfx('hit'); }, i * 180); this.spin = .75; break;
      case 'frog': { const list = Monsters.list.filter(m => inR(m, P.x, P.z, 9) && Math.abs(angWrap(Math.atan2(m.x - P.x, m.z - P.z) - P.face)) < 1.0).sort((a, b) => dist2(a.x, a.z, P.x, P.z) - dist2(b.x, b.z, P.x, P.z)).slice(0, 3);
        for (const m of list) { Fx.beam && Fx.arc(P.x, 1.0, P.z, Math.atan2(m.x - P.x, m.z - P.z), 0, Math.sqrt(dist2(m.x, m.z, P.x, P.z)), [1, .5, .6], .25); if (!m.d.boss) { const a = Math.atan2(m.x - P.x, m.z - P.z); const r = Col.resolve(P.x + Math.sin(a) * 2, P.z + Math.cos(a) * 2, m.d.r); m.x = r[0]; m.z = r[1]; } Combat.damageMonster(m, atk * 1.8, { slow: 3 }); }
        if (!list.length) UI.toast('ไม่มีศัตรูในระยะลิ้น', 'info'); Audio.sfx('shoot'); break; }
      case 'fox': { const ms = Monsters.list.filter(m => inR(m, P.x, P.z, 14)).sort((a, b) => dist2(a.x, a.z, P.x, P.z) - dist2(b.x, b.z, P.x, P.z)); for (let i = 0; i < 6; i++) setTimeout(() => { const t = ms.length ? ms[i % ms.length] : null; Projectiles.fire({ x: P.x, z: P.z, y: 2.2, dir: P.face + (i - 2.5) * .5, speed: 18, dmg: atk * .8, kind: 'fire', col: c, target: t, life: 1.8 }); }, i * 70); Audio.sfx('shoot'); break; }
      case 'elephant': { for (let i = 1; i <= 9; i++) setTimeout(() => { const [x, z] = fwd(i); for (let k = 0; k < 5; k++) Particles.add(x + rand(-.4, .4), 1.4, z + rand(-.4, .4), { c: [.55, .8, 1], s: .45, life: .5, vy: rand(-1, 2), vx: Math.sin(P.face) * 3, vz: Math.cos(P.face) * 3 }); }, i * 25);
        for (const m of Monsters.list) { if (!inR(m, P.x, P.z, 9.5)) continue; const a = Math.atan2(m.x - P.x, m.z - P.z); const d = Math.sqrt(dist2(m.x, m.z, P.x, P.z)); if (Math.abs(Math.sin(angWrap(a - P.face)) * d) < 1.3 + m.d.r && Math.cos(angWrap(a - P.face)) > 0) Combat.damageMonster(m, atk * 2.2, { slow: 3 }); } Audio.sfx('slam'); break; }
    }
  },
  /* drawing in world */
  draw(R, P) {
    const id = this.cur(); if (!id || !this.riding()) return null;
    let x = P.x, z = P.z, extraY = 0, face = P.face;
    if (this.jump) { const j = this.jump; j.t += 1 / 60; const u = Math.min(1, j.t / j.dur); x = lerp(j.sx, j.tx, u); z = lerp(j.sz, j.tz, u); extraY = Math.sin(u * Math.PI) * 3; if (u >= 1) this.jump = null; }
    if (this.spin > 0) { this.spin -= 1 / 60; face += this.spin * 20; }
    return { seat: drawMount(R, MountMeshes, id, x, extraY, z, face, this.st, 1, P.hurtT > .2 ? .4 : 0), face };
  }
};

