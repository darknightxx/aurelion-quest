/* ============================================================
   Multi-seat mounts (2–4 riders): dinosaur, tuk-tuk, jeep,
   long-tail boat, war elephant, royal carriage + passenger system
   ============================================================ */
Object.assign(MOUNTS, {
  dino: { view: 1.9, name: 'ไดโนเสาร์เร็กซ์', gems: 1200, spd: 1.6, kind: 'biped', seat: [2.45, -.1], seats: [[0, 2.45, -.1], [0, 2.4, -1.0]], sc: 1.25, stat: { atk: 14, def: 6, hp: 80 }, story: 'ที-เร็กซ์เขียวจากหุบเขาที่เวลาหยุดเดิน ตัวใหญ่พอให้นั่งได้สองคน เสียงคำรามทำให้ป่าทั้งป่าเงียบกริบ',
    pas: { k: 'atkp', v: .08, name: 'พลังนักล่า', desc: 'ATK +8% ขณะขี่' }, sk: { name: 'คำรามสะท้านป่า', desc: 'คำรามใส่ศัตรูรอบตัว 7 เมตร มึนงง 2.5 วิ ATK ×1.8', cd: 12, col: [.6, .9, .4] } },
  tuktuk: { view: 1.15, name: 'รถตุ๊กๆ สามล้อ', gems: 900, spd: 1.8, kind: 'vehicle', seat: [1.22, .55], seats: [[0, 1.22, .55], [-.42, 1.28, -.62], [.42, 1.28, -.62]], sc: 1.1, stat: { atk: 6, def: 5, hp: 60 }, story: 'สามล้อเครื่องสีน้ำเงินเหลืองจากเมืองหลวง นั่งได้สามคน เสียงแตรของมันไล่มอนสเตอร์ได้ทั้งถนน',
    pas: { k: 'coin', v: .12, name: 'ค่าโดยสาร', desc: 'เหรียญที่ได้ +12%' }, sk: { name: 'บีบแตรไล่ที่', desc: 'แตรดังลั่น ศัตรูในกรวยหน้ารถกระเด็นถอยและช้าลง ATK ×1.3', cd: 9, col: [1, .85, .3] } },
  jeep: { view: 1.3, name: 'รถจี๊ปลุยป่า', gems: 1400, spd: 1.9, kind: 'vehicle', seat: [1.32, .5], seats: [[-.42, 1.32, .5], [.42, 1.32, .5], [-.42, 1.38, -.6], [.42, 1.38, -.6]], sc: 1.15, stat: { atk: 9, def: 8, hp: 80 }, story: 'รถขับเคลื่อนสี่ล้อสีเขียวทหาร ลุยได้ทุกภูมิประเทศ นั่งได้สี่คนพร้อมยางอะไหล่ท้ายรถ',
    pas: { k: 'dodge', v: .08, name: 'หลบหลีกบนล้อ', desc: 'หลบการโจมตี 8%' }, sk: { name: 'พุ่งชนลุยป่า', desc: 'เร่งเครื่องพุ่งชน 9 เมตร ศัตรูที่ขวางกระเด็น ATK ×2.2', cd: 10, col: [.6, .8, .45] } },
  longtail: { view: 1.45, name: 'เรือหางยาว', gems: 1100, spd: 1.7, kind: 'float', seat: [.95, -1.25], seats: [[0, .95, -1.25], [0, .95, -.35], [0, .95, .5], [0, .95, 1.3]], sc: 1.15, stat: { atk: 7, def: 6, hp: 70 }, story: 'เรือหางยาวสีส้มจากคลองริมเมือง ติดเครื่องยนต์หางยาว แล่นได้ทั้งบนน้ำและบนบก นั่งได้สี่คน ผู้ขับอยู่ท้ายเรือ',
    pas: { k: 'xp', v: .1, name: 'ลมพัดสบาย', desc: 'EXP ที่ได้ +10%' }, sk: { name: 'คลื่นน้ำซัด', desc: 'สะบัดหางยาวสร้างคลื่นรอบตัว 5 เมตร ATK ×1.6 ศัตรูช้าลง', cd: 10, col: [.45, .8, 1] } },
  warelephant: { view: 2.0, name: 'ช้างศึกบุษบก', gems: 1600, spd: 1.35, kind: 'quad', seat: [2.5, 1.0], seats: [[0, 2.5, 1.0], [-.48, 2.85, -.35], [.48, 2.85, -.35]], sc: 1.3, stat: { atk: 10, def: 12, hp: 140 }, story: 'ช้างศึกพร้อมบุษบกทองบนหลัง ควาญนั่งที่คอ ผู้โดยสารอีกสองคนนั่งในบุษบก เดินช้าแต่ไม่มีอะไรหยุดมันได้',
    pas: { k: 'reduce', v: .12, name: 'ผิวหนังช้างศึก', desc: 'รับความเสียหายลดลง 12%' }, sk: { name: 'กระทืบสะเทือน', desc: 'กระทืบเท้าสะเทือน 6 เมตร ATK ×2.4 มึนงง 1.5 วิ และได้เกราะ', cd: 13, col: [.9, .8, .5] } },
  carriage: { view: 1.8, name: 'รถม้าราชสำนัก', gems: 1500, spd: 1.75, kind: 'vehicle', seat: [1.55, 1.15], seats: [[0, 1.55, 1.15], [-.42, 1.45, -.15], [.42, 1.45, -.15], [0, 1.45, -1.0]], sc: 1.15, stat: { atk: 8, def: 7, hp: 90 }, story: 'รถม้าเปิดประทุนสีขาวทองเทียมม้าขาวสองตัว ที่นั่งกำมะหยี่แดงสำหรับผู้โดยสารสามคน',
    pas: { k: 'regen', v: .012, name: 'เดินทางสบาย', desc: 'ฟื้น HP 1.2% ทุกวินาทีขณะขี่' }, sk: { name: 'ควบม้าศึก', desc: 'ม้าควบพุ่ง 8 เมตร ชนศัตรูที่ขวาง ATK ×1.8', cd: 9, col: [1, .95, .8] } }
});
const MULTI_SEATS = ['dino', 'tuktuk', 'jeep', 'longtail', 'warelephant', 'carriage'];
MOUNT_ORDER.push(...MULTI_SEATS);
MULTI_SEATS.forEach(id => GEM_ITEMS.push({ id: 'gmt_' + id, cat: 'mount', gems: MOUNTS[id].gems, mount: id, hot: id === 'dino' || id === 'tuktuk' }));


/* ---- meshes ---- */
function buildMountMeshes2(R) {
  const C = hexc, out = {};
  const mk = fn => { const g = new Geo(37); g.jit = .015; g.uvs = 1.5; fn(g); g.smoothNormals(58); return R.mesh(g); };
  const eye = (g, x, y, z, r = .09) => { g.sphere(x, y, z, r, C('#1a1410'), 6, 4); g.sphere(x + Math.sign(x || 1) * r * .25, y + r * .35, z + r * .55, r * .35, [1, 1, 1], 4, 3); };
  const wheel = (r, w, col, rim) => mk(g => { g.push(0, 0, 0, 0, 0, Math.PI / 2); g.cyl(0, -w / 2, 0, r, r, w, 12, col, col); g.cyl(0, -w / 2 - .01, 0, r * .55, r * .55, w + .02, 8, rim || C('#c9ced8')); for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; g.box(Math.cos(a) * r * .3, 0, Math.sin(a) * r * .3, r * .12, w + .03, r * .5, rim || C('#c9ced8')); } g.pop(); });
  const legQ = (len, r, col, foot) => mk(g => { g.cyl(0, -len, 0, r * .85, r, len, 7, col); g.ell(0, -len + .06, .05, r * 1.1, .1, r * 1.35, foot || col, 6, 4); });
  const quadLegs = (fx, fz, bx, bz, y, len, r, col, foot) => [
    { mesh: legQ(len, r, col, foot), p: [fx, y, fz], a: 'leg', off: 0 }, { mesh: legQ(len, r, col, foot), p: [-fx, y, fz], a: 'leg', off: Math.PI },
    { mesh: legQ(len, r, col, foot), p: [bx, y, bz], a: 'leg', off: Math.PI * .5 }, { mesh: legQ(len, r, col, foot), p: [-bx, y, bz], a: 'leg', off: Math.PI * 1.5 }];
  const bench = (g, x, y, z, w, col) => { g.box(x, y, z, w, .12, .5, col); g.box(x, y + .25, z - .22, w, .5, .08, col); };
  // dinosaur (biped)
  { const gr = C('#4f9a3e'), gr2 = C('#3a7a2e'), belly = C('#cfe3a8'), tooth = C('#f4f4ec'), red = C('#b8302a'), gold = C('#d9a845');
    out.dino = { body: mk(g => {
      g.ell(0, 1.75, 0, .75, .8, 1.45, gr, 12, 8); g.ell(0, 1.5, .1, .55, .5, 1.2, belly, 10, 6);
      for (let i = 0; i < 6; i++) { const t = i / 5; g.ell(0, 1.9 - t * .9, -1.3 - t * 1.6, .42 - t * .32, .42 - t * .3, .5, i % 2 ? gr : gr2, 8, 5); }
      g.ell(0, 2.3, 1.2, .38, .4, .6, gr, 10, 6); // neck
      g.ell(0, 2.75, 1.8, .5, .45, .85, gr, 10, 7); g.ell(0, 2.55, 2.35, .36, .22, .55, gr2, 8, 5); // head + snout
      g.ell(0, 2.45, 2.25, .34, .12, .5, red, 8, 4); // mouth
      for (let i = 0; i < 6; i++) { const x = -.25 + i * .1; g.cone(x, 2.56, 2.5, 0, -1, .1, .035, .14, 4, tooth); g.cone(x, 2.4, 2.5, 0, 1, .1, .035, .12, 4, tooth); }
      eye(g, .3, 2.9, 2.1, .09); eye(g, -.3, 2.9, 2.1, .09);
      for (let i = 0; i < 9; i++) g.cone(0, 2.5 - i * .1 + Math.max(0, 4 - i) * .18, 1.0 - i * .42, 0, 1, -.2, .07, .22, 4, gr2); // back spikes
      for (const s of [-1, 1]) { g.push(s * .6, 2.0, .9, -.6); g.cyl(0, -.35, 0, .07, .09, .35, 6, gr); g.cone(0, -.38, 0, 0, -1, .3, .04, .12, 3, tooth); g.pop(); } // tiny arms
      g.box(0, 2.35, -.5, .8, .12, 1.6, C('#6b4428')); g.box(0, 2.25, -.5, .9, .1, 1.7, gold); // saddle for two
      g.box(0, 2.45, -.1, .6, .1, .5, red); g.box(0, 2.45, -1.0, .6, .1, .5, red); g.box(0, 2.6, -1.4, .6, .3, .08, red);
    }), parts: [
      { mesh: mk(g => { g.cyl(0, -.9, 0, .22, .3, .95, 8, gr); g.ell(0, -.9, .12, .3, .14, .45, gr2, 7, 4); for (let i = 0; i < 3; i++) g.cone(-.15 + i * .15, -.95, .4, 0, -.3, 1, .05, .18, 3, tooth); }), p: [.45, 1.15, -.2], a: 'leg', off: 0, amp: 1.1 },
      { mesh: mk(g => { g.cyl(0, -.9, 0, .22, .3, .95, 8, gr); g.ell(0, -.9, .12, .3, .14, .45, gr2, 7, 4); for (let i = 0; i < 3; i++) g.cone(-.15 + i * .15, -.95, .4, 0, -.3, 1, .05, .18, 3, tooth); }), p: [-.45, 1.15, -.2], a: 'leg', off: Math.PI, amp: 1.1 }] };
  }
  // tuk-tuk (3 wheels)
  { const blue = C('#2f5fb8'), yel = C('#f2c740'), dark = C('#2a2430'), chrome = C('#d8dde6'), red = C('#c8402a');
    out.tuktuk = { body: mk(g => {
      g.box(0, .75, -.2, 1.2, .5, 2.2, blue); g.box(0, .55, .9, .7, .4, .8, blue); g.box(0, 1.05, -.6, 1.2, .25, 1.3, yel);
      bench(g, 0, 1.1, -.6, 1.05, red); g.box(0, 1.0, .55, .6, .18, .5, dark); // seats
      for (const [x, z] of [[-.55, .95], [.55, .95], [-.55, -1.1], [.55, -1.1]]) g.cyl(x, 1.0, z, .035, .035, 1.0, 6, chrome);
      g.box(0, 2.02, -.1, 1.35, .08, 2.4, yel); g.box(0, 2.06, -.1, 1.3, .04, 2.3, blue);
      g.push(0, 1.3, .85, -.3); g.box(0, .3, 0, .9, .6, .03, C('#bfe3ff')); g.pop();
      g.box(0, 1.25, 1.0, .5, .05, .08, chrome); g.cyl(0, .9, 1.05, .04, .04, .4, 5, chrome); // handlebar
      g.sphere(.35, 1.0, 1.3, .1, yel, 6, 4); g.sphere(-.35, 1.0, 1.3, .1, yel, 6, 4);
      g.box(0, .6, -1.35, 1.1, .3, .15, chrome); g.box(.4, .75, -1.38, .14, .1, .04, red); g.box(-.4, .75, -1.38, .14, .1, .04, red);
      g.cyl(.55, .4, -.3, .05, .05, .6, 5, dark); g.push(.55, .6, -.6, 0, 0, 0); g.cyl(0, 0, 0, .09, .07, .5, 6, chrome); g.pop();
    }), parts: [{ mesh: wheel(.36, .18, dark), p: [0, .36, 1.0], a: 'wheel' }, { mesh: wheel(.4, .22, dark), p: [-.62, .4, -.75], a: 'wheel' }, { mesh: wheel(.4, .22, dark), p: [.62, .4, -.75], a: 'wheel' }] };
  }
  // jeep (4 wheels)
  { const ol = C('#5f6f3e'), ol2 = C('#4a5830'), dark = C('#2a2430'), chrome = C('#d8dde6'), tan = C('#c8b088');
    out.jeep = { body: mk(g => {
      g.box(0, .95, 0, 1.5, .55, 2.9, ol); g.box(0, 1.3, .9, 1.4, .25, .9, ol2); g.box(0, .75, 1.55, 1.5, .25, .2, chrome);
      for (const s of [-1, 1]) { g.box(s * .78, .8, 1.0, .12, .3, .5, ol2); g.box(s * .78, .8, -1.0, .12, .3, .6, ol2); g.sphere(s * .5, .95, 1.5, .11, C('#fff2c0'), 6, 4); }
      g.push(0, 1.55, .5, -.2); g.box(0, .3, 0, 1.3, .6, .04, C('#bfe3ff')); g.box(0, .3, 0, 1.36, .66, .03, dark); g.pop();
      bench(g, -.42, 1.3, .5, .6, tan); bench(g, .42, 1.3, .5, .6, tan); bench(g, -.42, 1.35, -.6, .6, tan); bench(g, .42, 1.35, -.6, .6, tan);
      g.push(-.42, 1.5, .85, .5); g.cyl(0, 0, 0, .18, .18, .04, 10, dark); g.pop(); // steering wheel
      g.push(0, 1.2, -1.55, 0, 0, Math.PI / 2); g.cyl(0, -.12, 0, .38, .38, .24, 12, dark); g.pop(); // spare tire
      g.box(0, 1.65, -1.0, 1.4, .06, .08, chrome); g.cyl(-.68, 1.3, -1.0, .03, .03, .7, 5, chrome); g.cyl(.68, 1.3, -1.0, .03, .03, .7, 5, chrome);
      g.box(0, .55, 1.65, 1.3, .35, .08, chrome); g.cyl(-.5, .55, 1.65, .04, .04, .5, 5, chrome); g.cyl(.5, .55, 1.65, .04, .04, .5, 5, chrome);
    }), parts: [[-.8, 1.0], [.8, 1.0], [-.8, -1.0], [.8, -1.0]].map(([x, z]) => ({ mesh: wheel(.42, .28, dark, C('#9aa1ae')), p: [x, .42, z], a: 'wheel' })) };
  }
  // long-tail boat (float)
  { const wood = C('#b8602a'), wood2 = C('#8a4a1e'), dark = C('#2a2430'), chrome = C('#d8dde6'), red = C('#c8402a'), gold = C('#d9a845');
    out.longtail = { body: mk(g => {
      g.jit = .01; g.ell(0, .55, 0, .62, .42, 2.6, wood, 12, 7); g.ell(0, .72, 0, .5, .25, 2.4, C('#d8a070'), 10, 5); g.ell(0, .9, 0, .64, .06, 2.65, wood2, 12, 4);
      g.cone(0, .7, 2.3, 0, .6, 1, .3, .9, 6, wood); g.cone(0, .75, -2.3, 0, .5, -1, .3, .7, 6, wood); // bow / stern
      for (const z of [-1.25, -.35, .5, 1.3]) g.box(0, .92, z, .95, .06, .32, wood2); // benches
      for (let i = 0; i < 7; i++) g.sphere(0, 1.3 + Math.sin(i * 1.2) * .08, 2.55 + i * .02, .07, [C('#f4f0e7'), gold, red][i % 3], 5, 4); // garland at bow
      g.box(0, 1.1, 2.6, .05, .5, .05, chrome); g.box(.14, 1.3, 2.6, .25, .17, .02, red); g.box(.14, 1.3, 2.6, .25, .05, .025, C('#f4f0e7'));
      g.box(0, 1.1, -1.9, .4, .35, .5, dark); g.cyl(0, 1.28, -1.9, .12, .12, .18, 8, chrome); // engine
    }), parts: [{ mesh: mk(g => { g.push(0, 0, 0, .35); g.cyl(0, 0, 0, .04, .04, 1.9, 6, chrome); g.pop(); }), p: [0, 1.15, -2.05], a: 'none' },
      { mesh: mk(g => { for (let i = 0; i < 3; i++) { g.push(0, 0, 0, 0, 0, i * 2.09); g.box(0, .14, 0, .06, .26, .04, chrome); g.pop(); } }), p: [0, .5, -3.85], a: 'prop' }] };
  }
  // war elephant with howdah
  { const gray = C('#8c8a94'), gray2 = C('#6f6d78'), gold = C('#d9a845'), red = C('#b8302a'), tusk = C('#f4f0e7'), wood = C('#6b4428');
    out.warelephant = { body: mk(g => {
      g.ell(0, 1.75, 0, 1.0, .95, 1.5, gray, 12, 8); g.ell(0, 2.15, 1.35, .72, .68, .72, gray, 10, 7); // body, head
      g.ell(0, 2.3, 1.5, .5, .4, .6, gray2, 8, 5);
      for (let i = 0; i < 6; i++) { const t = i / 5; g.ell(Math.sin(t * 1.2) * .1, 1.95 - t * .9 - t * t * .5, 1.9 + t * .45, .22 - t * .08, .22 - t * .08, .22, i % 2 ? gray : gray2, 7, 5); } // trunk
      for (const s of [-1, 1]) { g.cone(s * .3, 1.85, 1.75, s * .25, -.2, 1, .07, .7, 5, tusk); eye(g, s * .42, 2.35, 1.85, .08); }
      g.box(0, 2.45, 1.0, .9, .1, .6, red); g.box(0, 2.5, 1.0, .5, .08, .5, gold); // neck cloth / driver pad
      g.box(0, 2.3, -.3, 1.7, .12, 1.8, red); g.box(0, 2.3, -.3, 1.8, .06, 1.9, gold); // blanket
      g.box(0, 2.55, -.35, 1.3, .35, 1.3, wood); g.box(0, 2.75, -.35, 1.36, .08, 1.36, gold); // howdah base
      for (const [x, z] of [[-.6, .25], [.6, .25], [-.6, -.95], [.6, -.95]]) g.cyl(x, 2.75, z, .05, .05, 1.1, 6, gold);
      g.push(0, 3.85, -.35); g.cyl(0, 0, 0, .95, .15, .7, 8, red); g.cyl(0, .6, 0, .18, .02, .5, 6, gold); g.pop(); // spired roof
      bench(g, -.45, 2.85, -.35, .55, red); bench(g, .45, 2.85, -.35, .55, red);
      for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; g.sphere(Math.cos(a) * .2, 1.9, 2.5 + Math.sin(a) * .05, .04, gold, 4, 3); }
    }), parts: [...quadLegs(.55, .75, .55, -.75, 1.1, 1.05, .25, gray, gray2),
      { mesh: mk(g => { g.ell(0, 0, 0, .12, .5, .45, gray, 8, 5); g.ell(0, 0, .02, .08, .36, .32, C('#c8a0a8'), 7, 4); }), p: [.62, 2.3, 1.1], a: 'earR' },
      { mesh: mk(g => { g.ell(0, 0, 0, .12, .5, .45, gray, 8, 5); g.ell(0, 0, .02, .08, .36, .32, C('#c8a0a8'), 7, 4); }), p: [-.62, 2.3, 1.1], a: 'earL' },
      { mesh: mk(g => { g.cone(0, 0, 0, 0, -.6, -1, .06, .8, 5, gray); g.sphere(0, -.5, -.65, .1, gray2, 5, 4); }), p: [0, 2.0, -1.45], a: 'tail' }] };
  }
  // royal carriage with two horses
  { const white = C('#f4f0e7'), gold = C('#d9a845'), red = C('#b8302a'), dark = C('#2a2430'), horse = C('#f0ece4'), mane = C('#d8c8a0'), wood = C('#8a6240');
    const horseLeg = () => mk(g => { g.cyl(0, -.8, 0, .07, .09, .8, 6, horse); g.cyl(0, -.85, 0, .09, .08, .1, 6, dark); });
    const horseParts = (x) => [
      { mesh: horseLeg(), p: [x - .18, 1.0, 2.9], a: 'leg', off: 0 }, { mesh: horseLeg(), p: [x + .18, 1.0, 2.9], a: 'leg', off: Math.PI },
      { mesh: horseLeg(), p: [x - .18, 1.0, 1.9], a: 'leg', off: Math.PI * .5 }, { mesh: horseLeg(), p: [x + .18, 1.0, 1.9], a: 'leg', off: Math.PI * 1.5 }];
    out.carriage = { body: mk(g => {
      g.box(0, 1.1, -.4, 1.5, .6, 2.6, white); g.box(0, 1.1, -.4, 1.56, .12, 2.66, gold); g.box(0, 1.45, -.4, 1.5, .1, 2.6, red);
      bench(g, -.42, 1.5, -.15, .6, red); bench(g, .42, 1.5, -.15, .6, red); bench(g, 0, 1.5, -1.0, 1.3, red);
      g.box(0, 1.55, 1.15, 1.2, .14, .55, dark); g.box(0, 1.8, .85, 1.2, .5, .06, dark); // driver bench
      for (const s of [-1, 1]) { g.sphere(s * .78, 1.5, 1.0, .1, gold, 6, 4); g.cyl(s * .3, 1.85, .95, .05, .05, .2, 5, gold); }
      g.box(0, .6, .2, .3, .2, 2.0, wood); g.box(0, .6, -1.3, 1.5, .15, .15, wood); g.box(0, .6, 1.0, 1.5, .15, .15, wood);
      g.box(0, .9, 2.2, .12, .12, 2.6, wood); g.box(0, .9, 3.3, 1.9, .1, .1, wood); // shaft + yoke
      for (const x of [-.6, .6]) { // horses
        g.ell(x, 1.55, 2.4, .36, .4, .95, horse, 10, 7); g.ell(x, 2.0, 3.05, .22, .3, .45, horse, 8, 6); g.ell(x, 2.35, 3.45, .2, .22, .5, horse, 8, 6);
        for (let i = 0; i < 6; i++) g.cone(x, 2.1 + i * .08, 2.75 + i * .1, 0, 1, -.3, .07, .22, 4, mane);
        for (const s of [-1, 1]) g.cone(x + s * .1, 2.5, 3.3, s * .3, 1, 0, .04, .16, 4, horse);
        eye(g, x + .17, 2.4, 3.6, .05); eye(g, x - .17, 2.4, 3.6, .05);
        g.cone(x, 1.6, 1.5, 0, -.5, -1, .08, .7, 5, mane); g.box(x, 1.75, 2.4, .5, .06, .4, red); g.box(x, 1.75, 2.4, .54, .03, .45, gold);
      }
    }), parts: [[-.8, .5], [.8, .5], [-.8, -1.3], [.8, -1.3]].map(([x, z]) => ({ mesh: wheel(.5, .14, gold, red), p: [x, .5, z], a: 'wheel' })).concat(horseParts(-.6), horseParts(.6)) };
  }
  return out;
}
{ const ob = buildMountMeshes; buildMountMeshes = function (R) { const out = ob(R); Object.assign(out, buildMountMeshes2(R)); return out; }; }
/* vehicle motion + all seat positions */
{ const of = mountFrame; mountFrame = function (id, st) { const D = MOUNTS[id], a = st.amp || 0, ph = st.ph || 0, t = st.t || 0; if (D.kind === 'vehicle') return { bob: a * .03 * Math.sin(ph * 3) + Math.sin(t * 2.2) * .01, pitch: -a * .03, roll: Math.sin(ph * .8) * .025 * a }; return of(id, st); }; }
{ const od = drawMount; drawMount = function (R, meshes, id, x, y, z, face, st, s = 1, flash = 0) { const r = od(R, meshes, id, x, y, z, face, st, s, flash); if (r && MOUNTS[id].seats) r.all = MOUNTS[id].seats.map(q => M4.xform(_mB, q[0], q[1], q[2])); return r; }; }

/* ---- passenger system ---- */
const Seats = {
  driver: null, since: 0, cache: {},
  cap(id) { const D = MOUNTS[id]; return D && D.seats ? D.seats.length : 1; },
  passengers(uid) {
    const list = [];
    for (const p of Remote.map.values()) if (p.st && p.st.rp === uid && !p.st.d) list.push({ uid: p.uid, t: p.st.rt || 0 });
    if (this.driver === uid) list.push({ uid: Net.uid, t: this.since });
    list.sort((a, b) => a.t - b.t || (a.uid < b.uid ? -1 : 1)); return list;
  },
  seatIndex(driverUid, uid) { const i = this.passengers(driverUid).findIndex(x => x.uid === uid); return i < 0 ? -1 : i + 1; },
  canJoin(p) {
    const st = p.st; if (!st || !st.m || !MOUNTS[st.m] || st.d) return 'ผู้เล่นคนนี้ไม่ได้ขี่พาหนะอยู่';
    const cap = this.cap(st.m); if (cap < 2) return 'พาหนะนี้นั่งได้คนเดียว'; if (st.rp) return 'ผู้เล่นคนนี้เป็นผู้โดยสารอยู่';
    if (p.zone !== Player.zone || dist2(p.dx, p.dz, Player.x, Player.z) > 49) return 'ต้องอยู่ใกล้ผู้ขับไม่เกิน 7 เมตร';
    if (this.passengers(p.uid).length >= cap - 1) return 'ที่นั่งเต็มแล้ว'; if (Player.dead) return ''; return null;
  },
  join(p) {
    const why = this.canJoin(p); if (why !== null) { if (why) UI.toast(why, 'warn'); return false; }
    if (Mounts.riding()) Mounts.data().ride = false;
    this.driver = p.uid; this.since = Net.be && Net.be.now ? Net.be.now() : Date.now();
    Player.moveTo = null; Player.nav = null; Nav.stop(); AutoHunt.stop(); Player.moving = false; Player.target = null; Player.recalc();
    UI.toast(`ขึ้นนั่ง${MOUNTS[p.st.m].name}ของ ${p.name}`, 'item'); Audio.sfx('warp'); Fx.shock(Player.x, Player.z, 1.5, [1, 1, 1], .3);
    if (Net.joined) Net.send(true); UI.mountBtns(); return true;
  },
  leave(msg) { if (!this.driver) return; this.driver = null; this.since = 0; Player.recalc(); if (msg !== false) UI.toast(msg || 'ลงจากพาหนะแล้ว', 'info'); if (Net.joined) Net.send(true); UI.mountBtns(); },
  update(dt) {
    if (!this.driver) return; const p = Remote.map.get(this.driver);
    if (!p || !p.st || !p.st.m || p.st.d || p.zone !== Player.zone) return this.leave('ผู้ขับลงจากพาหนะแล้ว');
    const idx = this.seatIndex(this.driver, Net.uid); if (idx < 1 || idx >= this.cap(p.st.m)) return this.leave('ที่นั่งเต็ม ลงจากพาหนะ');
    if (Input.keys.KeyW || Input.keys.KeyA || Input.keys.KeyS || Input.keys.KeyD || Input.joy.x || Input.joy.z || Player.moveTo) return this.leave();
    const P = Player; P.x = p.dx; P.z = p.dz; P.face = p.face; P.moveTo = null; P.moving = false; P.vx = P.vz = 0; P.walkAmp = 0; World.clampBounds(P);
  },
  myPos() { const c = this.cache[this.driver]; const idx = this.seatIndex(this.driver, Net.uid); return c && c[idx] ? c[idx] : null; },
  // seat position for a passenger peer
  peerPos(p) { const drv = p.st.rp; const c = this.cache[drv === Net.uid ? 'me' : drv]; const idx = this.seatIndex(drv, p.uid); return c && c[idx] ? c[idx] : null; },
  driverFace(p) { const drv = p.st.rp; if (drv === Net.uid) return Player.face; const d = Remote.map.get(drv); return d ? d.face : p.face; },
  myPassengers() { return Mounts.riding() ? this.passengers(Net.uid).length : 0; }
};

