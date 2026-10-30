
/* ==========================================================================
   Content brought over from Aurelion Quest, retold for the wuxia world:
   monsters (field, crystal cave, Thai temple ghosts, Amazon jungle),
   NPCs, quests, items, fashion (cosmetics) and 20 pets. Level cap 30.
   Coordinates here are in the original map units (scaled x1.6 later).
   ========================================================================== */
EXP_TABLE.length = 0;
for (let L = 0; L <= 30; L++) EXP_TABLE.push(L === 0 ? 0 : L >= 30 ? 9999999 : L <= 9 ? [0, 100, 260, 500, 840, 1300, 1900, 2700, 3700, 5000][L] : Math.round(5000 * Math.pow(1.24, L - 9) / 50) * 50);
const LV_CAP = 30;

Object.assign(ITEMS, {
  potion_hp2: { name: 'ยาเลือดใหญ่', glyph: '藥', type: 'potion', rarity: 'Uncommon', heal: 260, price: 110, stack: 99, desc: 'ฟื้นพลังชีวิต 260' },
  potion_mp2: { name: 'ยาพลังใหญ่', glyph: '氣', type: 'potion', rarity: 'Uncommon', mana: 160, price: 120, stack: 99, desc: 'ฟื้นพลังภายใน 160' },
  m_jelly: { name: 'เยลลี่สไลม์', glyph: '凝', type: 'material', rarity: 'Common', price: 8, stack: 99, desc: 'เยลลี่หนึบ ๆ จากสไลม์' },
  m_totem: { name: 'โทเท็มก็อบลิน', glyph: '圖', type: 'material', rarity: 'Common', price: 22, stack: 99, desc: 'เครื่องรางไม้แกะสลักของเผ่าก็อบลิน' },
  m_shard: { name: 'ผลึกเรืองแสง', glyph: '晶', type: 'material', rarity: 'Rare', price: 60, stack: 99, desc: 'ผลึกจากถ้ำใต้พิภพ เปล่งแสงสีฟ้า' },
  m_bone: { name: 'กระดูกโบราณ', glyph: '骨', type: 'material', rarity: 'Common', price: 20, stack: 99, desc: 'กระดูกของยามเฝ้าถ้ำ' },
  m_yant: { name: 'ผ้ายันต์อาถรรพ์', glyph: '符', type: 'material', rarity: 'Uncommon', price: 40, stack: 99, desc: 'ผ้ายันต์เก่าจากวัดร้าง' },
  m_incense: { name: 'ธูปวิญญาณ', glyph: '香', type: 'material', rarity: 'Uncommon', price: 36, stack: 99, desc: 'ธูปที่ยังไม่มอดแม้ผ่านไปร้อยปี' },
  m_venom: { name: 'ต่อมพิษป่าดิบ', glyph: '毒', type: 'material', rarity: 'Uncommon', price: 48, stack: 99, desc: 'พิษเข้มข้นจากสัตว์ป่าอเมซอน' },
  m_hide: { name: 'หนังเสือลายจุด', glyph: '皮', type: 'material', rarity: 'Rare', price: 70, stack: 99, desc: 'หนังเสือจากัวร์เนื้อนุ่ม' },
  sword_crystal: { name: 'กระบี่ผลึกคราม', glyph: '晶', type: 'equip', slot: 'weapon', rarity: 'Rare', stats: { atk: 72, dex: 6, crit: 4 }, price: 1600, desc: 'ATK +72 · DEX +6 · คริ +4%' },
  armor_bone: { name: 'เกราะกระดูกยาม', glyph: '甲', type: 'equip', slot: 'body', rarity: 'Rare', stats: { def: 26, hp: 140, vit: 3 }, price: 1200, desc: 'DEF +26 · HP +140' },
  sword_yant: { name: 'กระบี่ยันต์ทองคำ', glyph: '符', type: 'equip', slot: 'weapon', rarity: 'Epic', stats: { atk: 112, str: 6, crit: 6 }, price: 3200, desc: 'ATK +112 · STR +6 · คริ +6%' },
  robe_yant: { name: 'เสื้อยันต์มหาอุด', glyph: '衣', type: 'equip', slot: 'body', rarity: 'Epic', stats: { def: 40, hp: 260, vit: 5 }, price: 2800, desc: 'DEF +40 · HP +260 · VIT +5' },
  amulet_monk: { name: 'ตะกรุดหลวงตา', glyph: '護', type: 'equip', slot: 'necklace', rarity: 'Epic', stats: { def: 12, hp: 120, luk: 6 }, price: 2400, desc: 'DEF +12 · HP +120 · LUK +6' },
  sword_jaguar: { name: 'กระบี่เขี้ยวจากัวร์', glyph: '牙', type: 'equip', slot: 'weapon', rarity: 'Epic', stats: { atk: 150, agi: 10, crit: 8 }, price: 4800, desc: 'ATK +150 · AGI +10 · คริ +8%' },
  boots_jungle: { name: 'รองเท้าพรานป่าดิบ', glyph: '靴', type: 'equip', slot: 'boots', rarity: 'Epic', stats: { spd: 40, agi: 6, def: 8 }, price: 2600, desc: 'ความเร็ว +40 · AGI +6' },
  ring_ogre: { name: 'แหวนหัวหน้าเผ่า', glyph: '戒', type: 'equip', slot: 'ring', rarity: 'Legendary', stats: { atk: 36, hp: 320, str: 8 }, price: 6000, desc: 'ATK +36 · HP +320 · STR +8' },
});

const mkMon = (name, lv, o = {}) => ({
  name, lv, hp: Math.round((40 + lv * 30) * (o.hpK || 1)), atk: Math.round((7 + lv * 3.7) * (o.atkK || 1)), def: Math.round(lv * 1.5 * (o.defK || 1)),
  spd: o.spd || 60, exp: Math.round(13 * Math.pow(lv, 1.15) * (o.xpK || 1)), gold: [Math.round(3 * lv * (o.gK || 1)), Math.round(6 * lv * (o.gK || 1))],
  r: o.r || 15, color: o.color || '#aaa', aggro: o.aggro ?? 190, arange: o.ar || 30, rspd: o.rspd || 1.4, drops: o.drops || [], boss: !!o.boss,
});
const BOSS = { hpK: 8, atkK: 1.35, defK: 1.4, xpK: 7, gK: 6, r: 34, aggro: 340, ar: 50, rspd: 1.6, boss: true };
Object.assign(MONSTERS, {
  slime: mkMon('สไลม์', 2, { spd: 42, r: 13, drops: [['m_jelly', .5], ['potion_hp', .1]] }),
  goblin: mkMon('ก็อบลินป่า', 7, { spd: 70, r: 15, drops: [['m_totem', .45], ['potion_hp', .12], ['sword_steel', .03]] }),
  bat: mkMon('ค้างคาวผลึก', 9, { spd: 96, r: 14, hpK: .8, drops: [['m_shard', .14], ['potion_mp', .2]] }),
  skel: mkMon('โครงกระดูกยาม', 11, { spd: 58, r: 15, defK: 1.4, drops: [['m_bone', .5], ['m_shard', .08], ['potion_hp2', .08], ['armor_bone', .02]] }),
  krak: mkMon('คราก ผู้พิทักษ์ผลึก', 13, { ...BOSS, spd: 52, drops: [['sword_crystal', 1], ['m_shard', 1], ['potion_hp2', 1]] }),
  takhon: mkMon('ผีตาโขน', 12, { spd: 66, drops: [['m_yant', .3], ['potion_hp2', .08]] }),
  pret: mkMon('เปรต', 13, { spd: 46, r: 18, hpK: 1.3, drops: [['m_incense', .35], ['potion_mp2', .08]] }),
  krasue: mkMon('กระสือ', 13, { spd: 84, r: 13, hpK: .85, drops: [['m_incense', .3], ['m_yant', .15]] }),
  kongkoi: mkMon('ผีกองกอย', 14, { spd: 90, r: 13, drops: [['m_yant', .3], ['potion_hp2', .1]] }),
  phrai: mkMon('ผีพรายน้ำ', 14, { spd: 56, drops: [['m_incense', .3], ['potion_mp2', .1]] }),
  nangram: mkMon('ผีนางรำ', 15, { spd: 62, drops: [['m_yant', .3], ['amulet_monk', .01]] }),
  phidip: mkMon('ผีดิบจีน', 15, { spd: 50, defK: 1.4, drops: [['m_yant', .35], ['potion_hp2', .1]] }),
  pop: mkMon('ผีปอบ', 16, { spd: 70, drops: [['m_incense', .35], ['robe_yant', .01]] }),
  saming: mkMon('เสือสมิง', 17, { spd: 92, r: 18, hpK: 1.4, drops: [['m_hide', .25], ['potion_hp2', .12]] }),
  pusom: mkMon('ปู่โสมเฝ้าทรัพย์', 18, { ...BOSS, spd: 46, drops: [['sword_yant', 1], ['robe_yant', .5], ['amulet_monk', .5]] }),
  dartfrog: mkMon('กบลูกดอกพิษ', 18, { spd: 64, r: 12, hpK: .8, drops: [['m_venom', .35], ['potion_mp2', .12]] }),
  jaguar: mkMon('เสือจากัวร์', 19, { spd: 100, r: 17, drops: [['m_hide', .3], ['potion_hp2', .12], ['sword_jaguar', .01]] }),
  spider: mkMon('แมงมุมยักษ์ทารันทูล่า', 20, { spd: 70, r: 17, drops: [['m_venom', .4], ['potion_hp2', .1]] }),
  ana: mkMon('งูอนาคอนด้า', 21, { spd: 54, r: 18, hpK: 1.3, drops: [['m_hide', .2], ['m_venom', .3]] }),
  plant: mkMon('ต้นไม้กินคน', 22, { spd: 4, r: 20, hpK: 1.5, aggro: 140, drops: [['m_venom', .4], ['potion_mp2', .15]] }),
  caiman: mkMon('จระเข้เคแมน', 22, { spd: 58, r: 20, defK: 1.5, drops: [['m_hide', .3], ['boots_jungle', .01]] }),
  ogre: mkMon('โอกรนักรบเผ่ากินคน', 23, { spd: 64, r: 20, hpK: 1.3, drops: [['m_totem', .4], ['potion_hp2', .15]] }),
  ogrechief: mkMon('หัวหน้าเผ่าโอกร', 25, { ...BOSS, spd: 58, drops: [['ring_ogre', 1], ['sword_jaguar', .5], ['boots_jungle', .5]] }),
});

/* ---------------- maps ---------------- */
MAPS.wind.spawns.push({ type: 'slime', n: 5, area: [180, 760, 900, 450] });
MAPS.jade.spawns.push({ type: 'goblin', n: 4, area: [1100, 500, 700, 600] });
MAPS.jade.portals.push({ x: 0, y: 600, w: 60, h: 200, to: 'cave', tx: 130, ty: 550, label: 'ถ้ำผลึกใต้พิภพ' });
MAPS.cave = {
  name: 'ถ้ำผลึกใต้พิภพ', w: 1500, h: 1100, ground: '#3b3f4c',
  paths: [[60, 500, 1380, 100], [700, 120, 100, 880]], water: [], props: 'cave', colliders: [], npcs: [],
  spawns: [{ type: 'bat', n: 7, area: [150, 160, 1200, 760] }, { type: 'skel', n: 6, area: [200, 200, 1100, 760] }, { type: 'krak', n: 1, area: [650, 150, 200, 110] }],
  portals: [{ x: 0, y: 450, w: 60, h: 200, to: 'jade', tx: 120, ty: 700, label: 'ป่าหมอกหยก' }, { x: 1440, y: 450, w: 60, h: 200, to: 'temple', tx: 130, ty: 615, label: 'วัดร้างอาถรรพ์' }],
  start: { x: 130, y: 550 },
};
MAPS.temple = {
  name: 'วัดร้างอาถรรพ์', w: 1700, h: 1200, ground: '#56693e',
  paths: [[60, 560, 1580, 110], [790, 100, 120, 1020]], water: [], props: 'temple', colliders: [], npcs: [],
  spawns: [{ type: 'takhon', n: 3, area: [150, 150, 600, 380] }, { type: 'pret', n: 2, area: [950, 700, 600, 400] }, { type: 'krasue', n: 3, area: [950, 150, 600, 380] },
    { type: 'kongkoi', n: 3, area: [150, 700, 600, 400] }, { type: 'phrai', n: 2, area: [1100, 380, 400, 160] }, { type: 'nangram', n: 2, area: [300, 380, 400, 160] },
    { type: 'phidip', n: 2, area: [950, 700, 500, 400] }, { type: 'pop', n: 2, area: [150, 700, 500, 400] }, { type: 'saming', n: 1, area: [1300, 900, 300, 220] }, { type: 'pusom', n: 1, area: [760, 120, 180, 100] }],
  portals: [{ x: 0, y: 510, w: 60, h: 210, to: 'cave', tx: 1380, ty: 550, label: 'ถ้ำผลึกใต้พิภพ' }, { x: 1640, y: 510, w: 60, h: 210, to: 'jungle', tx: 130, ty: 650, label: 'ป่าดิบอเมซอน' }],
  start: { x: 130, y: 615 },
};
MAPS.jungle = {
  name: 'ป่าดิบอเมซอน', w: 1900, h: 1300, ground: '#3f7a2e',
  paths: [[60, 600, 1780, 100]], water: [], props: 'jungle', colliders: [], npcs: [],
  spawns: [{ type: 'dartfrog', n: 4, area: [200, 150, 700, 400] }, { type: 'jaguar', n: 3, area: [200, 760, 700, 450] }, { type: 'spider', n: 3, area: [1150, 760, 600, 450] },
    { type: 'ana', n: 2, area: [250, 800, 500, 300] }, { type: 'plant', n: 3, area: [1200, 200, 500, 300] }, { type: 'caiman', n: 2, area: [1150, 300, 400, 200] },
    { type: 'ogre', n: 3, area: [1250, 760, 550, 450] }, { type: 'ogrechief', n: 1, area: [1550, 150, 220, 160] }],
  portals: [{ x: 0, y: 550, w: 60, h: 200, to: 'temple', tx: 1570, ty: 615, label: 'วัดร้างอาถรรพ์' }],
  start: { x: 130, y: 650 },
};
const NEW_ART = {
  cave: { theme: 'cave', cliffs: [[0, 0, 1500, 100]], falls: [], rivers: [], bridges: [], ponds: [[1060, 770, 320, 190]], lamps: [], stoneLanterns: [[640, 470], [860, 470], [640, 640], [860, 640]],
    cherry: 0, bamboo: 0, pine: 0, rocks: 26, bushes: 0, fences: [], extra: { crystal: 34, stalag: 18 }, night: 'rgba(16,20,52,.30)', petals: 22, petalCol: ['#7ae8ff', '#c89aff', '#ffffff'] },
  temple: { theme: 'temple', cliffs: [], falls: [], rivers: [], bridges: [], ponds: [[1180, 180, 300, 170]], lamps: [], stoneLanterns: [[740, 300], [960, 300], [740, 820], [960, 820], [420, 520], [1280, 520], [420, 700], [1280, 700]],
    cherry: 2, bamboo: 6, pine: 4, rocks: 14, bushes: 8, fences: [], extra: { chedi: 8, deadtree: 16, buddha: 2 }, night: 'rgba(36,14,48,.22)', petals: 24, petalCol: ['#c8b6ff', '#9ae8ff', '#fff0b0'] },
  jungle: { theme: 'jungle', cliffs: [], falls: [], rivers: [[1000, 0, 120, 1300]], bridges: [[978, 586, 164, 128]], ponds: [[200, 960, 360, 200]], lamps: [], stoneLanterns: [],
    cherry: 0, bamboo: 8, pine: 0, rocks: 14, bushes: 18, fences: [], extra: { jtree: 30, fern: 36, totem: 5 }, petals: 18, petalCol: ['#ffd84a', '#ff8a3a', '#b8f070'] },
};

/* ---------------- NPCs in the village ---------------- */
MAPS.village.npcs.push(
  { id: 'lyra', name: 'กัปตันลีร่า', glyph: '將', x: 560, y: 620, role: 'warp' },
  { id: 'orin', name: 'ปราชญ์โอริน', glyph: '賢', x: 840, y: 395, role: 'talk' },
  { id: 'kaze', name: 'คาเสะ นินจาพ่อครัว', glyph: '忍', x: 470, y: 400, role: 'talk' },
  { id: 'rook', name: 'นายพรานรุก', glyph: '獵', x: 830, y: 640, role: 'quest2' },
  { id: 'mina', name: 'ช่างตัดเสื้อมีนา', glyph: '縫', x: 250, y: 580, role: 'shop', shop: [] },
  { id: 'ming', name: 'ลุงหมิง คนเลี้ยงสัตว์', glyph: '寵', x: 1130, y: 615, role: 'shop', shop: [] },
);
MAPS.village.npcs.find(n => n.id === 'herb').shop.push('potion_hp2', 'potion_mp2');
const NPC_LINES = {
  orin: ['ยุทธจักรนี้กว้างกว่าที่เจ้าคิด เลยป่าหยกไปยังมีถ้ำผลึกใต้พิภพ', 'ผีในวัดร้างกลัวแสงยันต์ จงเก็บผ้ายันต์ไว้ให้ดี', 'เพลงกระบี่ที่แท้ไม่ได้อยู่ที่ความเร็ว แต่อยู่ที่ใจ'],
  kaze: ['ข้าเป็นนินจา... แต่วันนี้ขอทำบะหมี่ก่อนนะ', 'กินให้อิ่มก่อนออกล่า ท้องว่างกระบี่ก็ไม่คม!', 'เคยได้ยินไหม เนื้อเสือจากัวร์ย่างอร่อยที่สุดในป่าดิบ'],
  lyra: ['ข้าดูแลเส้นทางทั้งหมดของแคว้นนี้ จะไปที่ใด ข้าส่งให้ได้', 'ระวังตัวด้วย ยิ่งไกลจากหมู่บ้าน มอนสเตอร์ยิ่งแกร่ง'],
  rook: ['ป่าทุกแห่งมีเรื่องเล่า และมีค่าหัวรออยู่เสมอ'],
};
const WARP_LIST = [['village', 'หมู่บ้านสายหมอก', 1], ['wind', 'ทุ่งสายลม', 1], ['jade', 'ป่าหมอกหยก', 5], ['cave', 'ถ้ำผลึกใต้พิภพ', 9], ['temple', 'วัดร้างอาถรรพ์', 12], ['jungle', 'ป่าดิบอเมซอน', 18]];

/* ---------------- hunter's bounty quests ---------------- */
QUESTS.push(
  { id: 'r1', giver: 'rook', req: 1, name: 'สไลม์ซุกซน', desc: 'สไลม์ในทุ่งสายลมกินผักชาวบ้านจนเกลี้ยง ไปจัดการ 6 ตัว', type: 'kill', target: 'slime', need: 6, main: false, reward: { exp: 160, gold: 90, item: 'potion_hp', n: 4 }, rewardText: '160 EXP · 90 Zeny · ยาเลือด 4' },
  { id: 'r2', giver: 'rook', req: 6, name: 'โทเท็มเผ่าก็อบลิน', desc: 'ก็อบลินบุกป่าหยก เอาโทเท็มของพวกมันมา 5 ชิ้น', type: 'collect', target: 'm_totem', need: 5, main: false, reward: { exp: 600, gold: 300, item: 'potion_hp2', n: 3 }, rewardText: '600 EXP · 300 Zeny · ยาเลือดใหญ่ 3' },
  { id: 'r3', giver: 'rook', req: 9, name: 'เสียงปีกในถ้ำผลึก', desc: 'ค้างคาวผลึกฝูงใหญ่บินออกมาตอนกลางคืน กำจัด 8 ตัว', type: 'kill', target: 'bat', need: 8, main: false, reward: { exp: 1400, gold: 500, item: 'potion_mp2', n: 3 }, rewardText: '1400 EXP · 500 Zeny · ยาพลังใหญ่ 3' },
  { id: 'r4', giver: 'rook', req: 11, name: 'ผู้พิทักษ์ผลึก', desc: 'คราก ผู้พิทักษ์ผลึกตื่นขึ้นในถ้ำ จงสยบมันให้ได้', type: 'kill', target: 'krak', need: 1, main: true, reward: { exp: 3000, gold: 1200, item: 'book_flame', n: 1 }, rewardText: '3000 EXP · 1200 Zeny · คัมภีร์ฝ่ามือเพลิง' },
  { id: 'r5', giver: 'rook', req: 12, name: 'ล้างอาถรรพ์วัดร้าง', desc: 'กระสือลอยออกจากวัดร้างทุกคืน กำจัด 6 ตน', type: 'kill', target: 'krasue', need: 6, main: false, reward: { exp: 3600, gold: 900, item: 'potion_hp2', n: 5 }, rewardText: '3600 EXP · 900 Zeny · ยาเลือดใหญ่ 5' },
  { id: 'r6', giver: 'rook', req: 15, name: 'ปู่โสมเฝ้าทรัพย์', desc: 'สมบัติใต้วัดร้างมีวิญญาณเฝ้าอยู่ ปราบปู่โสมให้ได้', type: 'kill', target: 'pusom', need: 1, main: true, reward: { exp: 8000, gold: 2500, item: 'book_light', n: 1 }, rewardText: '8000 EXP · 2500 Zeny · คัมภีร์วิชาตัวเบา' },
  { id: 'r7', giver: 'rook', req: 18, name: 'เงาเสือแห่งป่าดิบ', desc: 'เสือจากัวร์ซุ่มโจมตีนักเดินทาง ล่ามา 6 ตัว', type: 'kill', target: 'jaguar', need: 6, main: false, reward: { exp: 9000, gold: 2000, item: 'potion_hp2', n: 6 }, rewardText: '9000 EXP · 2000 Zeny · ยาเลือดใหญ่ 6' },
  { id: 'r8', giver: 'rook', req: 22, name: 'หัวหน้าเผ่ากินคน', desc: 'หัวหน้าเผ่าโอกรรวมพลจะบุกยุทธจักร จงโค่นมันให้ได้', type: 'kill', target: 'ogrechief', need: 1, main: true, reward: { exp: 20000, gold: 6000, item: 'ring_ogre', n: 1 }, rewardText: '20000 EXP · 6000 Zeny · แหวนหัวหน้าเผ่า' },
);

/* ---------------- fashion (from Aurelion's tailor) ---------------- */
const COSMETICS = [
  ['cos_straw', 'หมวกฟางชาวนา', 'head', 'Common', 120, 'หมวกฟางปีกกว้าง กันแดดได้ดี'],
  ['cos_bamboo', 'งอบไผ่จอมยุทธ์', 'head', 'Uncommon', 260, 'งอบไผ่สานแบบนักดาบพเนจร'],
  ['cos_cat', 'หูแมวดำ', 'head', 'Uncommon', 300, 'หูแมวดำขนนุ่ม ขยับได้'],
  ['cos_bunny', 'หูกระต่ายขาว', 'head', 'Uncommon', 300, 'หูกระต่ายยาวสีขาวชมพู'],
  ['cos_fox', 'หูจิ้งจอกส้ม', 'head', 'Uncommon', 320, 'หูจิ้งจอกเจ้าเล่ห์'],
  ['cos_panda', 'หูแพนด้า', 'head', 'Uncommon', 320, 'หูกลม ๆ สีดำของแพนด้า'],
  ['cos_sheep', 'หมวกแกะขนฟู', 'head', 'Rare', 600, 'หมวกขนแกะนุ่มฟูพร้อมเขาม้วน'],
  ['cos_flower', 'มงกุฎซากุระ', 'head', 'Rare', 700, 'มาลัยดอกซากุระบานสะพรั่ง'],
  ['cos_witch', 'หมวกแม่มดราตรี', 'head', 'Rare', 760, 'หมวกปลายแหลมของแม่มดพเนจร'],
  ['cos_crown', 'มงกุฎผลึก', 'head', 'Epic', 1500, 'มงกุฎประดับผลึกฟ้าและชมพู'],
  ['cos_kcrown', 'มงกุฎราชา', 'head', 'Legendary', 3000, 'มงกุฎทองของราชาแห่งยุทธจักร'],
  ['cos_halo', 'วงแหวนเทวดา', 'head', 'Legendary', 3200, 'วงแสงศักดิ์สิทธิ์ลอยเหนือศีรษะ'],
  ['cos_angel', 'ปีกนางฟ้า', 'back', 'Epic', 1800, 'ปีกขนนกสีขาวบริสุทธิ์'],
  ['cos_batw', 'ปีกค้างคาวรัตติกาล', 'back', 'Epic', 1800, 'ปีกค้างคาวสีม่วงรัตติกาล'],
  ['cos_fairyw', 'ปีกภูตพราย', 'back', 'Epic', 1900, 'ปีกใสแวววาวของภูตพราย'],
  ['cos_dragon', 'ปีกมังกรเพลิง', 'back', 'Legendary', 3500, 'ปีกมังกรสีแดงเพลิง'],
  ['cos_crystalw', 'ปีกผลึกน้ำแข็ง', 'back', 'Legendary', 3500, 'ปีกผลึกน้ำแข็งเรืองแสง'],
  ['cos_o_white', 'ชุดจอมยุทธ์ขาว', 'outfit', 'Uncommon', 400, 'ชุดคลุมสีขาวสะอาดตา'],
  ['cos_o_red', 'ชุดเพลิงพยัคฆ์', 'outfit', 'Rare', 800, 'ชุดคลุมสีแดงเพลิง'],
  ['cos_o_blue', 'ชุดวารีคราม', 'outfit', 'Rare', 800, 'ชุดคลุมสีครามดั่งสายน้ำ'],
  ['cos_o_green', 'ชุดหยกมรกต', 'outfit', 'Rare', 800, 'ชุดคลุมสีเขียวหยก'],
  ['cos_o_pink', 'ชุดซากุระ', 'outfit', 'Epic', 1400, 'ชุดคลุมสีชมพูซากุระ'],
  ['cos_o_gold', 'ชุดจักรพรรดิทอง', 'outfit', 'Legendary', 3000, 'ชุดคลุมทองของจักรพรรดิ'],
  ['cos_a_fairy', 'ออร่าภูตพราย', 'aura', 'Epic', 2000, 'ประกายดาวลอยวนรอบตัว'],
  ['cos_a_ember', 'ออร่าเปลวไฟ', 'aura', 'Epic', 2000, 'ประกายไฟลุกโชนรอบตัว'],
  ['cos_a_petal', 'ออร่ากลีบซากุระ', 'aura', 'Legendary', 2600, 'กลีบซากุระโปรยปรายตามตัว'],
];
const COS_GLYPH = { head: '帽', back: '翼', outfit: '衣', aura: '光' };
for (const [id, name, slot, rarity, price, desc] of COSMETICS) ITEMS[id] = { name, glyph: COS_GLYPH[slot], type: 'cos', cslot: slot, rarity, price, desc: desc + ' (ชุดแต่งตัว ไม่มีผลต่อค่าพลัง)' };
MAPS.village.npcs.find(n => n.id === 'mina').shop = COSMETICS.map(c => c[0]);

/* ---------------- pets (Aurelion's 20 companions) ---------------- */
const PET_DEFS = {
  dog: { name: 'ชิบะน้อย', kind: 'quad', c: ['#e39445', '#fbefdd', '#3a2a22'], ear: 'tri', tail: 'curl', ab: ['loot', 0, 'เก็บของที่ตกให้อัตโนมัติจากระยะไกล'], price: 400 },
  cat: { name: 'เหมียวส้ม', kind: 'quad', c: ['#f29b4b', '#fff3e2', '#c2602a'], ear: 'tri', tail: 'long', stripe: 1, ab: ['crit', 6, 'คริติคอล +6%'], price: 500 },
  parrot: { name: 'นกแก้วพูดเก่ง', kind: 'bird', c: ['#36b54a', '#f6d33c', '#e2452f'], ab: ['xp', 8, 'EXP +8%'], price: 600 },
  rabbit: { name: 'กระต่ายขนปุย', kind: 'hop', c: ['#f7f1ea', '#ffd7de', '#e88aa0'], ear: 'long', ab: ['spd', 8, 'ความเร็วเคลื่อนที่ +8%'], price: 450 },
  hamster: { name: 'แฮมสเตอร์แก้มตุ่ย', kind: 'hop', c: ['#e9b878', '#fff6e8', '#d98a8a'], ear: 'round', ab: ['gold', 10, 'Zeny +10%'], price: 450 },
  fox: { name: 'จิ้งจอกแดง', kind: 'quad', c: ['#ea6b2a', '#fff4e6', '#3a2420'], ear: 'tri', tail: 'fluffy', ab: ['drop', 8, 'โอกาสได้ของ +8%'], price: 700 },
  owl: { name: 'นกฮูกนักปราชญ์', kind: 'bird', c: ['#8a6a4a', '#e8d6b8', '#f2c24a'], bigEye: 1, ab: ['mp', 3, 'ฟื้นพลังภายในเพิ่ม 3/วิ'], price: 650 },
  penguin: { name: 'เพนกวินจิ๋ว', kind: 'bird', c: ['#2a2f44', '#f6f6f8', '#f2a23a'], ab: ['def', 8, 'ป้องกัน +8'], price: 600 },
  turtle: { name: 'เต่าน้อยกระดองทอง', kind: 'quad', c: ['#6fbf6a', '#e9f2c8', '#c79a3a'], shell: 1, ab: ['hp', 120, 'HP สูงสุด +120'], price: 600 },
  frog: { name: 'กบเขียวลายจุด', kind: 'hop', c: ['#5cc25a', '#e6f6c8', '#2e7a32'], ear: 'frog', ab: ['heal', 1, 'ฟื้น HP 1% ทุกวินาที'], price: 700 },
  piglet: { name: 'หมูน้อยออมสิน', kind: 'quad', c: ['#f6b3c2', '#ffe2ea', '#d8728a'], ear: 'floppy', tail: 'curl', ab: ['gold', 15, 'Zeny +15%'], price: 750 },
  monkey: { name: 'ลิงจ๋อซุกซน', kind: 'quad', c: ['#9a6a42', '#f2d6b0', '#6a4428'], ear: 'round', tail: 'long', ab: ['bite', 25, 'ช่วยโจมตีศัตรู 25% ของพลังโจมตี'], price: 900 },
  chick: { name: 'ลูกเจี๊ยบ', kind: 'bird', c: ['#ffd84a', '#fff2a8', '#f29a2a'], ab: ['xp', 5, 'EXP +5%'], price: 300 },
  duck: { name: 'เป็ดยางนักผจญภัย', kind: 'bird', c: ['#f9f9f2', '#ffe9a8', '#f29a2a'], ab: ['spd', 6, 'ความเร็วเคลื่อนที่ +6%'], price: 400 },
  panda: { name: 'แพนด้ากลมกลิ้ง', kind: 'quad', c: ['#f7f7f4', '#f7f7f4', '#2a2a30'], ear: 'round', panda: 1, ab: ['hp', 200, 'HP สูงสุด +200'], price: 1200 },
  bat: { name: 'ค้างคาวรัตติกาล', kind: 'fly', c: ['#5a4a7a', '#8a7aa8', '#2a2038'], ab: ['leech', 3, 'ดูดเลือด 3% ของความเสียหาย'], price: 1100 },
  dragon: { name: 'มังกรน้อยเพลิง', kind: 'fly', c: ['#e2452f', '#ffd27a', '#7a1a14'], horn: 1, ab: ['bite', 45, 'พ่นไฟช่วยโจมตี 45% ของพลังโจมตี'], price: 2600 },
  fairy: { name: 'ภูตพรายแสงดาว', kind: 'fairy', c: ['#ffd6ef', '#fff7c8', '#9ad8ff'], ab: ['heal', 1.5, 'ฟื้น HP 1.5% ทุกวินาที'], price: 2200 },
  unicorn: { name: 'ยูนิคอร์นจิ๋ว', kind: 'quad', c: ['#fbf7ff', '#ffffff', '#c9a3ff'], ear: 'tri', tail: 'mane', horn: 1, ab: ['crit', 10, 'คริติคอล +10%'], price: 3000 },
  slime: { name: 'สไลม์ใจดี', kind: 'blob', c: ['#6ad0ff', '#c8f0ff', '#2a7ab0'], ab: ['bite', 30, 'กระโดดชนศัตรู 30% ของพลังโจมตี'], price: 800 },
};
for (const id in PET_DEFS) { const p = PET_DEFS[id]; ITEMS['egg_' + id] = { name: 'ไข่' + p.name, glyph: '蛋', type: 'egg', pet: id, rarity: p.price >= 2000 ? 'Legendary' : p.price >= 900 ? 'Epic' : p.price >= 600 ? 'Rare' : 'Uncommon', price: p.price, desc: 'ฟักเป็น' + p.name + ' · ' + p.ab[2] }; }
MAPS.village.npcs.find(n => n.id === 'ming').shop = Object.keys(PET_DEFS).map(k => 'egg_' + k);

/* ---------------- painted start area: หมู่บ้านสายหยก (matches the reference art 1:1) ---------------- */
MONSTERS.jrabbit = mkMon('กระต่ายป่าหยก', 1, { spd: 50, r: 13, hpK: .8, aggro: 70, drops: [['potion_hp', .25], ['mat_shroom', .15], ['sword_bamboo', .05], ['hat_straw', .04]] });
MAPS.jadev = {
  name: 'หมู่บ้านสายหยก', w: 1536, h: 1024, ground: '#7a9a3a', bg: 'jadev', __scaled: true,
  walk: [[[300, 318], [420, 300], [560, 282], [650, 262], [700, 225], [745, 190], [835, 212], [850, 262], [860, 300], [915, 355], [985, 420], [1110, 470], [1230, 520], [1300, 560], [1345, 640], [1370, 720], [1420, 790], [1536, 850], [1536, 990], [1060, 990], [990, 880], [880, 830], [760, 805], [640, 790], [600, 740], [505, 690], [470, 630], [380, 600], [275, 560], [215, 470], [240, 380]], [[740, 150], [790, 138], [1290, 272], [1295, 322], [1240, 322], [760, 198]]],
  paths: [], water: [], colliders: [], npcs: [],
  spawns: [{ type: 'jrabbit', n: 7, area: [300, 330, 1000, 420] }],
  portals: [{ x: 1236, y: 268, w: 60, h: 58, to: 'village', tx: 1300 * 1.6, ty: 515 * 1.6, label: 'หมู่บ้านสายหมอก' }, { x: 1470, y: 860, w: 66, h: 128, to: 'wind', tx: 200 * 1.6, ty: 620 * 1.6, label: 'ทุ่งสายลม' }],
  start: { x: 720, y: 560 },
  spots: [[612, 335], [400, 405], [305, 488], [527, 600], [825, 690], [1140, 685], [960, 560]],
  glows: [[395, 205, 40], [628, 700, 46]], falls: [[1032, 96, 70, 60], [1142, 86, 92, 130], [1345, 395, 170, 260]],
};
MAPS.village.portals.push({ x: 1440, y: 300, w: 60, h: 150, to: 'jadev', tx: 1200, ty: 330, label: 'หมู่บ้านสายหยก' });
QUESTS.unshift(
  { id: 'j1', name: 'ก้าวแรกในป่าหยก', desc: 'กระต่ายป่าหยกแห่กันมากัดกินแปลงผักของหมู่บ้าน ช่วยกำจัด 5 ตัว', type: 'kill', target: 'jrabbit', need: 5, main: true, reward: { exp: 120, gold: 60, item: 'potion_hp', n: 3 }, rewardText: '120 EXP · 60 Zeny · ยาเลือด 3' },
  { id: 'j2', name: 'ออกสำรวจอาณาจักร', desc: 'ข้ามสะพานไม้ไปยังหมู่บ้านสายหมอก แล้วพบผู้เฒ่าหลิน', type: 'reach', target: 'village', need: 1, main: false, reward: { exp: 80, gold: 50, item: 'potion_mp', n: 2 }, rewardText: '80 EXP · 50 Zeny · ยาพลัง 2' },
);
