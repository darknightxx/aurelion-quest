/* ============================================================
   Gems: top-up packs (demo mode), gem shop catalogue
   ============================================================ */
// extra items sold for gems
Object.assign(ITEMS, {
  c_halo: { name: 'วงแหวนเทวดา', kind: 'cos', slot: 'head', price: 0, desc: 'วงแหวนทองลอยเหนือศีรษะ เรืองแสงอ่อนๆ', icon: 'halo' },
  c_dragon: { name: 'ปีกมังกรเพลิง', kind: 'cos', slot: 'back', price: 0, desc: 'ปีกมังกรสีแดงเพลิง · SPD +2%', bonus: { spdPct: .02 }, icon: 'wingD' },
  c_rainbow: { name: 'ออร่ารุ้งเจ็ดสี', kind: 'cos', slot: 'aura', price: 0, desc: 'ประกายสีรุ้งหมุนรอบตัว', icon: 'rainbow' },
  feather: { name: 'ขนนกฟีนิกซ์', kind: 'use', price: 0, revive: true, desc: 'เมื่อพ่ายแพ้ ฟื้นขึ้นที่เดิมพร้อม HP เต็ม (ใช้ที่หน้าสรุปผล)', icon: 'feather' },
  statbook: { name: 'ตำราพลังแฝง', kind: 'use', price: 0, statpt: true, desc: 'ใช้แล้วได้แต้มสถานะ +1 ทันที', icon: 'book' }
});
const GEM_PACKS = [
  { id: 'g1', thb: 35, gems: 60, bonus: 0, art: 1 },
  { id: 'g2', thb: 99, gems: 170, bonus: 20, art: 2 },
  { id: 'g3', thb: 289, gems: 500, bonus: 90, art: 3 },
  { id: 'g4', thb: 499, gems: 880, bonus: 200, art: 4 },
  { id: 'g5', thb: 999, gems: 1780, bonus: 520, art: 5 },
  { id: 'g6', thb: 1990, gems: 3600, bonus: 1300, art: 6 }
];
const SPECIAL_PACKS = [
  { id: 'starter', thb: 49, title: 'ผู้สนับสนุนรุ่นแรก', name: 'แพ็กนักผจญภัยมือใหม่', desc: 'เพชร 300 · ปีกนางฟ้า · ยาฟื้นพลัง (ใหญ่) ×5 · ขนนกฟีนิกซ์ ×1', once: true, gems: 300, items: [['c_angel', 1], ['hp_l', 5], ['feather', 1]], tag: 'ซื้อได้ครั้งเดียว · คุ้มสุด' },
  { id: 'monthly', thb: 129, title: 'สมาชิกรายเดือน', name: 'บัตรนักผจญภัยรายเดือน', desc: 'รับเพชร 300 ทันที + รับเพิ่มวันละ 60 เพชร นาน 30 วัน (รวม 2,100)', monthly: true, gems: 300, daily: 60, days: 30, tag: 'คุ้มกว่า 7 เท่า' }
];
const TOPUP_MILESTONES = [
  { thb: 100, gems: 50, items: [['hp_l', 5]], label: 'เพชร 50 · ยาใหญ่ ×5' },
  { thb: 300, gems: 120, items: [['c_fairy', 1]], label: 'เพชร 120 · ออร่าภูตพราย · ฉายา "ผู้อุปถัมภ์"', title: 'ผู้อุปถัมภ์' },
  { thb: 600, gems: 250, items: [['statbook', 2]], label: 'เพชร 250 · ตำราพลังแฝง ×2' },
  { thb: 1000, gems: 400, items: [['c_halo', 1]], label: 'เพชร 400 · วงแหวนเทวดา · ฉายา "เศรษฐีแห่ง Aurelion"', title: 'เศรษฐีแห่ง Aurelion' },
  { thb: 2000, gems: 800, items: [['c_dragon', 1]], label: 'เพชร 800 · ปีกมังกรเพลิง · ฉายา "ราชันย์เพชร"', title: 'ราชันย์เพชร' }
];
const GEM_CATS = [
  { id: 'deal', name: 'ลดราคาสัปดาห์นี้', desc: 'ลด 20% · สุ่มใหม่ทุกวันจันทร์' },
  { id: 'fashion', name: 'แฟชั่น', desc: 'หมวก ปีก ออร่า และชุดทั้ง 6 แบบ · ลองใส่ฟรี 2 นาที' },
  { id: 'boost', name: 'บูสต์', desc: 'เร่ง EXP เหรียญ และโอกาสดรอป' },
  { id: 'potion', name: 'ยา & เสบียง', desc: 'ยาฟื้นพลังแบบแพ็กใหญ่' },
  { id: 'conv', name: 'สะดวกสบาย', desc: 'คัมภีร์กลับเมือง ขนนกฟีนิกซ์' },
  { id: 'perm', name: 'อัปเกรดถาวร', desc: 'เพิ่มพลังตัวละครแบบถาวร' }
];
// gem catalogue
const GEM_ITEMS = [
  { id: 'gc_halo', cat: 'fashion', gems: 220, item: 'c_halo', tryon: true, hot: true },
  { id: 'gc_dragon', cat: 'fashion', gems: 300, item: 'c_dragon', tryon: true, hot: true },
  { id: 'gc_rainbow', cat: 'fashion', gems: 260, item: 'c_rainbow', tryon: true },
  { id: 'gc_angel', cat: 'fashion', gems: 160, item: 'c_angel', tryon: true },
  { id: 'gc_bat', cat: 'fashion', gems: 140, item: 'c_bat', tryon: true },
  { id: 'gc_sheep', cat: 'fashion', gems: 90, item: 'c_sheep', tryon: true },
  { id: 'gc_straw', cat: 'fashion', gems: 60, item: 'c_straw', tryon: true },
  { id: 'gc_fairy', cat: 'fashion', gems: 120, item: 'c_fairy', tryon: true },
  { id: 'gc_ember', cat: 'fashion', gems: 140, item: 'c_ember', tryon: true },
  ...['adventurer', 'knight', 'ninja', 'archer', 'mage', 'priest'].map(k => ({ id: 'go_' + k, cat: 'fashion', gems: 150, item: 'o_' + k, tryon: true })),
  { id: 'gb_xp30', cat: 'boost', gems: 60, name: 'ใบคูณ EXP ×2 (30 นาที)', desc: 'ได้ EXP เป็น 2 เท่า นาน 30 นาที', buff: ['xp2', 1800], icon: 'scroll' },
  { id: 'gb_xp120', cat: 'boost', gems: 180, name: 'ใบคูณ EXP ×2 (2 ชั่วโมง)', desc: 'ได้ EXP เป็น 2 เท่า นาน 2 ชั่วโมง', buff: ['xp2', 7200], icon: 'scroll' },
  { id: 'gb_coin', cat: 'boost', gems: 50, name: 'ใบคูณเหรียญ ×2 (30 นาที)', desc: 'ได้เหรียญเป็น 2 เท่า นาน 30 นาที', buff: ['coin2', 1800], icon: 'coin' },
  { id: 'gb_luck', cat: 'boost', gems: 80, name: 'เครื่องรางนำโชค (1 ชั่วโมง)', desc: 'โอกาสดรอปไอเทม ×1.5 นาน 1 ชั่วโมง', buff: ['luck', 3600], icon: 'star' },
  { id: 'gp_hpl', cat: 'potion', gems: 40, name: 'ยาฟื้นพลัง (ใหญ่) ×5', give: [['hp_l', 5]], icon: 'potR2' },
  { id: 'gp_hps', cat: 'potion', gems: 35, name: 'ยาฟื้นพลัง (เล็ก) ×20', give: [['hp_s', 20]], icon: 'potR' },
  { id: 'gp_mp', cat: 'potion', gems: 40, name: 'ยาฟื้นมานา ×10', give: [['mp_s', 10]], icon: 'potB' },
  { id: 'gp_mix', cat: 'potion', gems: 90, name: 'เสบียงบุกถ้ำ', desc: 'ยาใหญ่ ×8 · ยามานา ×8 · ขนนกฟีนิกซ์ ×1', give: [['hp_l', 8], ['mp_s', 8], ['feather', 1]], icon: 'bag' },
  { id: 'gv_scroll', cat: 'conv', gems: 30, name: 'คัมภีร์กลับเมือง ×5', give: [['scroll', 5]], icon: 'scroll' },
  { id: 'gv_feather', cat: 'conv', gems: 90, name: 'ขนนกฟีนิกซ์ ×3', give: [['feather', 3]], icon: 'feather' },
  { id: 'gv_coins', cat: 'conv', gems: 100, name: 'ถุงเหรียญทอง 1,000', desc: 'แลกเพชรเป็นเหรียญ 1,000 เหรียญ', coins: 1000, icon: 'coin' },
  { id: 'gm_book', cat: 'perm', gems: 120, name: 'ตำราพลังแฝง', desc: 'แต้มสถานะ +1 ทันที · ซื้อได้สูงสุด 10 เล่ม', statpt: 1, limit: 10, icon: 'book' },
  { id: 'gm_bag', cat: 'perm', gems: 150, name: 'ผ้ารัดแขนนักรบ', desc: 'ATK +2 ถาวร · ซื้อได้สูงสุด 5 ครั้ง', perm: { atk: 2 }, limit: 5, icon: 'sword' },
  { id: 'gm_heart', cat: 'perm', gems: 150, name: 'ผลไม้แห่งชีวิต', desc: 'HP สูงสุด +25 ถาวร · ซื้อได้สูงสุด 5 ครั้ง', perm: { hp: 25 }, limit: 5, icon: 'heart' }
];
function weekKey(d = new Date()) { const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); const day = (t.getUTCDay() + 6) % 7; t.setUTCDate(t.getUTCDate() - day); return t.toISOString().slice(0, 10); }
function weeklyDeals() {
  const k = weekKey(); let seed = 0; for (const c of k) seed = seed * 31 + c.charCodeAt(0) | 0;
  const rng = mulberry32(seed); const pool = GEM_ITEMS.filter(g => g.cat === 'fashion' || g.cat === 'boost' || g.cat === 'potion');
  const out = []; while (out.length < 4) { const g = pool[Math.floor(rng() * pool.length)]; if (!out.includes(g)) out.push(g); }
  return out;
}
function nextMonday() { const d = new Date(); const day = (d.getDay() + 6) % 7; const n = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7 - day); return n - d; }
Object.assign(BUFFS, {
  xp2: { name: 'EXP ×2', desc: 'ได้ EXP เป็น 2 เท่า', col: '#c9a6ff' },
  coin2: { name: 'เหรียญ ×2', desc: 'ได้เหรียญเป็น 2 เท่า', col: '#f3d27a' },
  luck: { name: 'โชคดี', desc: 'โอกาสดรอป ×1.5', col: '#a8e04c' },
  tryon: { name: 'ลองใส่', desc: 'ของแต่งตัวทดลอง', col: '#f4b6e0' }
});

