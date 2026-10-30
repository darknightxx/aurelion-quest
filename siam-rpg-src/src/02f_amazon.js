
/* ============================================================
   Amazon jungle zone "ป่าหิมพานต์มรณะ" — data: monsters (Lv.15–26,
   higher than the abandoned temple), drops, gear, NPCs, quests.
   local coords: lx = x - AX, z. Base camp at the south (z≈90),
   river running north→south-east, piranha lake, anaconda swamp,
   man-eating plant grove, ancient ruins, and an ogre tribe village.
   ============================================================ */
const AX = 3000, AMAZON_LV = 15;
Object.assign(MONSTERS, {
  piranha: { name: 'ปลาช่อนผี', lvl: 15, hp: 240, atk: 30, def: 8, spd: 5.6, aggro: 7, range: 1.8, rate: .9, xp: 150, coin: [22, 34], r: .55, h: .7, jungle: true, swim: true, drops: [['m_tooth', .55], ['hp_l', .06]] },
  dartfrog: { name: 'อึ่งพิษลายทอง', lvl: 16, hp: 230, atk: 28, def: 7, spd: 4.2, aggro: 9, range: 8, rate: 1.6, xp: 160, coin: [22, 36], r: .5, h: .7, jungle: true, ranged: true, shot: 'poison', drops: [['m_venom', .5], ['mp_s', .1]] },
  jaguar: { name: 'เสือดาวป่าลึก', lvl: 17, hp: 430, atk: 34, def: 11, spd: 6.4, aggro: 11, range: 2.2, rate: 1.0, xp: 190, coin: [26, 40], r: .9, h: 1.3, jungle: true, sp: [{ k: 'pounce', cd: 7, rng: 8, r: 3.2 }], drops: [['m_jfur', .5], ['a_jaguar', .012], ['hp_l', .07]] },
  spider: { name: 'บึ้งยักษ์', lvl: 18, hp: 470, atk: 33, def: 12, spd: 4.6, aggro: 9, range: 2.2, rate: 1.1, xp: 205, coin: [28, 42], r: 1.0, h: 1.0, jungle: true, sp: [{ k: 'hands', cd: 9, rng: 9, r: 2.6 }], drops: [['m_silk', .5], ['hp_l', .07]] },
  ana: { name: 'งูเหลือมยักษ์', lvl: 19, hp: 560, atk: 36, def: 13, spd: 3.6, aggro: 9, range: 2.8, rate: 1.3, xp: 230, coin: [30, 46], r: 1.0, h: 1.0, jungle: true, sp: [{ k: 'devour', cd: 9, rng: 6, r: 3.6 }], drops: [['m_scale', .5], ['w_fang', .01], ['hp_l', .08]] },
  plant: { name: 'ต้นไทรผีสิง', lvl: 20, hp: 680, atk: 38, def: 15, spd: .05, aggro: 7, range: 3.4, rate: 1.4, xp: 250, coin: [32, 48], r: 1.2, h: 2.6, jungle: true, rooted: true, sp: [{ k: 'hair', cd: 8, rng: 7, r: 6.5 }], drops: [['m_seed', .5], ['mp_s', .12]] },
  caiman: { name: 'จระเข้บึง', lvl: 21, hp: 760, atk: 40, def: 17, spd: 3.8, aggro: 8, range: 2.6, rate: 1.3, xp: 270, coin: [34, 52], r: 1.1, h: .8, jungle: true, sp: [{ k: 'pound', cd: 9, rng: 7, r: 3.2 }], drops: [['m_hide', .5], ['hp_l', .08]] },
  ogre: { name: 'ยักษ์ป่าหิมพานต์', lvl: 22, hp: 860, atk: 43, def: 16, spd: 4.2, aggro: 10, range: 2.6, rate: 1.25, xp: 300, coin: [38, 58], r: 1.0, h: 2.4, jungle: true, sp: [{ k: 'leap', cd: 8, rng: 9, r: 2.8 }], drops: [['m_mask', .5], ['r_totem', .01], ['hp_l', .09]] },
  ogresham: { name: 'ยักษ์หมอผี', lvl: 23, hp: 640, atk: 42, def: 13, spd: 3.6, aggro: 10, range: 9, rate: 1.7, xp: 320, coin: [40, 60], r: .9, h: 2.3, jungle: true, ranged: true, shot: 'curse', sp: [{ k: 'scream', cd: 11, rng: 6, r: 5.5 }], drops: [['m_feather', .5], ['r_totem', .015], ['mp_s', .12]] }
});
Object.assign(ITEMS, {
  m_tooth: { name: 'ฟันปลาช่อนผี', kind: 'mat', price: 0, sell: 30, desc: 'ฟันแหลมคมเรียงเป็นแถว', icon: 'fang' },
  m_venom: { name: 'ต่อมพิษอึ่งลายทอง', kind: 'mat', price: 0, sell: 32, desc: 'พิษร้ายแรง ใช้ทำยาได้ถ้ารู้วิธี', icon: 'potion' },
  m_jfur: { name: 'หนังเสือดาวป่าลึก', kind: 'mat', price: 0, sell: 40, desc: 'หนังลายจุดนุ่มมือ', icon: 'cloak' },
  m_silk: { name: 'ใยบึ้งยักษ์', kind: 'mat', price: 0, sell: 38, desc: 'เหนียวยิ่งกว่าเชือกเหล็ก', icon: 'scroll' },
  m_scale: { name: 'เกล็ดงูเหลือมยักษ์', kind: 'mat', price: 0, sell: 45, desc: 'เกล็ดเขียวเข้มแข็งดั่งเกราะ', icon: 'shield' },
  m_seed: { name: 'เมล็ดไทรผีสิง', kind: 'mat', price: 0, sell: 42, desc: 'เมล็ดที่เต้นตุบๆ เหมือนหัวใจ', icon: 'jelly' },
  m_hide: { name: 'หนังจระเข้บึง', kind: 'mat', price: 0, sell: 50, desc: 'หนังหนาแข็งแรงมาก', icon: 'armor' },
  m_mask: { name: 'หน้ากากกระดูกยักษ์ป่า', kind: 'mat', price: 0, sell: 55, desc: 'หน้ากากที่ยักษ์ป่าสวมเวลาออกล่า', icon: 'bone' },
  m_feather: { name: 'ขนนกหมอผียักษ์ป่า', kind: 'mat', price: 0, sell: 58, desc: 'ขนนกสีสดที่เต็มไปด้วยพลังลึกลับ', icon: 'wing' },
  w_fang: { name: 'ดาบเขี้ยวงูเหลือมยักษ์', kind: 'gear', slot: 'weapon', atk: 34, spd: .2, lvl: 18, price: 0, sell: 1200, desc: 'ATK +34 · SPD +0.2 (Lv.18) ดรอปหายากจากงูเหลือมยักษ์', icon: 'sword3', rare: true },
  a_jaguar: { name: 'เสื้อหนังเสือดาวป่าลึก', kind: 'gear', slot: 'armor', def: 22, hp: 120, spd: .4, lvl: 17, price: 0, sell: 1000, desc: 'DEF +22 · HP +120 · SPD +0.4 (Lv.17)', icon: 'cloak', rare: true },
  r_totem: { name: 'สร้อยโทเท็มหมอผี', kind: 'gear', slot: 'acc', atk: 14, hp: 90, mp: 50, lvl: 20, price: 0, sell: 1100, desc: 'ATK +14 · HP +90 · MP +50 (Lv.20)', icon: 'totem', rare: true },
  jg_antidote: { name: 'ยาแก้พิษป่าหิมพานต์', kind: 'use', holy: true, heal: 260, price: 90, desc: 'ล้างพิษและสถานะผิดปกติทั้งหมด ฟื้น HP 260', icon: 'potB' },
  jg_spear: { name: 'หอกพรานป่า', kind: 'gear', slot: 'weapon', atk: 26, lvl: 15, price: 2600, desc: 'ATK +26 (Lv.15)', icon: 'sword2' },
  jg_vest: { name: 'เสื้อกั๊กนักสำรวจ', kind: 'gear', slot: 'armor', def: 17, hp: 80, lvl: 15, price: 2400, desc: 'DEF +17 · HP +80 (Lv.15)', icon: 'armor2' }
});
WARPS.push({ id: 'w_amazon', name: 'ค่ายนักสำรวจหิมพานต์', zone: 'amazon', x: AX + 8, z: 86 });
Object.assign(NPCS, {
  marco: { name: 'ดร.มานพ', role: 'หัวหน้าคณะสำรวจหิมพานต์', sheet: 'knight', zone: 'amazon', x: AX - 3, z: 88, face: 3.1, voice: [.8, .95], hair: 30, pose: 9, lines: ['ป่านี้ยังมีความลับอีกมาก', 'ระวังตัวด้วย ทุกอย่างที่นี่อยากกินเรา', 'เผ่ายักษ์ป่าอยู่ทางเหนือ อย่าเข้าไปคนเดียว'] },
  emma: { name: 'นักชีววิทยาเอื้อมพร', role: 'ผู้เชี่ยวชาญสัตว์ป่า', sheet: 'priest', zone: 'amazon', x: AX + 4, z: 94, face: 3.4, voice: [1.3, 1.05], hair: 15, pose: 11, lines: ['ไทรผีสิงพวกนี้น่าสนใจที่สุด!', 'กบสีสดแปลว่าพิษร้าย จำไว้นะ', 'ฉันต้องการตัวอย่างเพิ่มอีก'] },
  jose: { name: 'พรานป่าโชติ', role: 'ร้านเสบียงป่า', sheet: 'archer', zone: 'amazon', x: AX - 10, z: 92, face: 2.4, shop: 'jungle', voice: [.9, 1.05], hair: 'black', pose: 13, lines: ['ยาแก้พิษ! อย่าออกไปโดยไม่มีมัน', 'เสือดาวป่าลึกล่าตอนเงียบที่สุด', 'แม่น้ำนี้มีปลาช่อนผีเป็นพันตัว'] }
});
const JUNGLE_SHOP = ['jg_antidote', 'hp_l', 'mp_s', 'jg_spear', 'jg_vest', 'rf_stone', 'pet_food'];
const Q_AMAZON = {
  a1: { type: 'main', giver: 'marco', minLv: AMAZON_LV, title: 'ยินดีต้อนรับสู่ป่ามรณะ', obj: [{ k: 'kill', mon: 'piranha', n: 6 }, { k: 'collect', item: 'm_tooth', n: 4 }],
    text: 'นักผจญภัยจากสยาม! ดีใจที่มาถึง เรือของคณะสำรวจถูกปลาช่อนผีรุมจนข้ามแม่น้ำไม่ได้ ช่วยปราบพวกมันในทะเลสาบทางตะวันออก 6 ตัว แล้วเก็บฟันมา 4 ซี่เป็นหลักฐาน',
    done: 'ยอดเยี่ยม! ตอนนี้เราข้ามแม่น้ำได้แล้ว ป่าข้างหน้ายังมีอะไรรออยู่อีกเยอะ', rew: { xp: 2400, coin: 600, items: [['jg_antidote', 3], ['hp_l', 3]] }, take: true, award: 'ผู้พิชิตป่าหิมพานต์' },
  a2: { type: 'main', giver: 'marco', req: 'a1', title: 'ร่องรอยของคณะสำรวจที่หายไป', obj: [{ k: 'reach', zone: 'amazon', x: AX - 58, z: -10, r: 9, label: 'สำรวจซากวิหารโบราณทางตะวันตก' }, { k: 'kill', mon: 'jaguar', n: 5 }],
    text: 'เมื่อเดือนก่อนคณะสำรวจชุดแรกหายไปใกล้ซากวิหารโบราณทางตะวันตก ไปดูให้หน่อย และระวังเสือดาวป่าลึกที่เฝ้าอยู่แถวนั้นด้วย',
    done: 'บันทึกการเดินทาง… พวกเขาเขียนว่า "อย่าเข้าใกล้หมู่บ้านยักษ์ป่า" แย่แล้ว…', rew: { xp: 3200, coin: 800, items: [['hp_l', 4], ['rf_stone', 2]] } },
  a3: { type: 'main', giver: 'marco', req: 'a2', minLv: 20, title: 'หมู่บ้านยักษ์ป่า', obj: [{ k: 'kill', mon: 'ogre', n: 8 }, { k: 'kill', mon: 'ogresham', n: 4 }],
    text: 'ยักษ์ป่าจับตัวนักสำรวจไปที่หมู่บ้านทางเหนือ ปราบนักรบยักษ์ป่า 8 ตัวและยักษ์หมอผี 4 ตัวเพื่อให้พวกเขาหนีออกมาได้ ระวังหัวหน้าเผ่าที่ตัวใหญ่ยักษ์!',
    done: 'คณะสำรวจกลับมาครบทุกคน! เจ้าคือวีรบุรุษของป่าหิมพานต์', rew: { xp: 5200, coin: 1500, items: [['rf_stone2', 1], ['hp_l', 5]] }, gems: 40, award: 'ผู้ปลดปล่อยแห่งหิมพานต์' },
  a4: { type: 'side', giver: 'emma', req: 'a1', title: 'ตัวอย่างไทรผีสิง', obj: [{ k: 'collect', item: 'm_seed', n: 5 }, { k: 'collect', item: 'm_venom', n: 4 }],
    text: 'ฉันกำลังศึกษาไทรผีสิงในดงไม้ทางตะวันออกเฉียงเหนือ กับอึ่งพิษลายทองริมลำธาร ช่วยเก็บเมล็ดไทรผีสิง 5 เมล็ดและต่อมพิษ 4 ชิ้นได้ไหม?',
    done: 'ตัวอย่างสมบูรณ์มาก! ฉันทำยาแก้พิษสูตรพิเศษให้ด้วยนะ', rew: { xp: 2600, coin: 700, items: [['jg_antidote', 5], ['mp_s', 5]] }, take: true },
  a5: { type: 'side', giver: 'emma', req: 'a4', title: 'งูยักษ์แห่งหนองน้ำ', obj: [{ k: 'kill', mon: 'ana', n: 6 }, { k: 'collect', item: 'm_scale', n: 4 }],
    text: 'หนองน้ำทางตะวันตกเฉียงเหนือมีงูเหลือมยักษ์ยาวกว่า 10 เมตร! ฉันอยากได้เกล็ดมาศึกษา ระวังมันรัดนะ',
    done: 'เกล็ดสวยงามมาก! ได้ข่าวว่าในหนองน้ำมีพญางูเหลือมตัวใหญ่กว่านี้อีก…', rew: { xp: 3000, coin: 800, items: [['rf_stone', 3], ['pet_treat', 2]] }, take: true },
  a6: { type: 'side', giver: 'jose', req: 'a1', title: 'หนังสัตว์สำหรับฤดูฝน', obj: [{ k: 'collect', item: 'm_jfur', n: 4 }, { k: 'collect', item: 'm_hide', n: 3 }],
    text: 'ฤดูฝนใกล้มาแล้ว ข้าต้องการหนังเสือดาวป่าลึก 4 ผืนกับหนังจระเข้บึง 3 ผืนทำเต็นท์กันฝน จระเข้บึงนอนอาบแดดริมแม่น้ำนะ',
    done: 'หนังชั้นดีทั้งนั้น! รับเสื้อกั๊กนักสำรวจไปใส่เลย', rew: { xp: 2800, coin: 600, items: [['jg_vest', 1]] }, take: true },
  ad1: { type: 'daily', giver: 'jose', req: 'a1', title: 'ล่าประจำวันในป่ามรณะ', obj: [{ k: 'kill', mon: 'dartfrog', n: 8 }, { k: 'kill', mon: 'spider', n: 5 }],
    text: 'ภารกิจประจำวัน: อึ่งพิษกับบึ้งยักษ์มาใกล้ค่ายทุกวัน ช่วยปราบอึ่งพิษลายทอง 8 ตัวและบึ้งยักษ์ 5 ตัว',
    done: 'ค่ายปลอดภัยไปอีกวัน ขอบใจ!', rew: { xp: 2000, coin: 500, items: [['jg_antidote', 2]] } }
};
Object.assign(QUESTS, Q_AMAZON); QUEST_ORDER.push('a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'ad1');
const AMAZON_AREAS = [[0, 90, 14, 'ค่ายนักสำรวจหิมพานต์'], [46, 30, 13, 'ทะเลสาบปลาช่อนผี'], [-58, -64, 16, 'หนองน้ำงูเหลือมยักษ์'], [52, -52, 15, 'ดงไทรผีสิง'], [-58, -10, 15, 'ซากวิหารโบราณ'], [0, -84, 18, 'หมู่บ้านยักษ์ป่า'], [-8, 52, 12, 'ลำธารอึ่งพิษ'], [-30, 40, 10, 'ป่าทึบเสือดาว']];
