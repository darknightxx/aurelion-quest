/* ============================================================
   Role-based skill kits: Tank / Melee DPS / Ranged & Mage / Support
   Each class: 4 role skills (Q E R T) + 1 quiz ultimate (X)
   ============================================================ */
const ROLES = {
  tank: { name: 'แทงค์', en: 'Tanker', desc: 'ผู้รับความเสียหายและปกป้องทีม', col: '#7fa8e8', icon: 'shield', cats: ['ยั่วยุ (Taunt)', 'เพิ่มพลังป้องกัน', 'ควบคุม (CC)', 'เคลื่อนที่ / ดึงศัตรู'],
    passive: { name: 'ร่างกายเหล็กกล้า', desc: 'พลังป้องกัน +10% และเมื่อ HP ต่ำกว่า 30% รับดาเมจลดลงอีก 15%' } },
  melee: { name: 'โจมตีประชิด', en: 'Melee DPS', desc: 'ทำความเสียหายสูงในระยะใกล้', col: '#e8875a', icon: 'sword', cats: ['โจมตีเดี่ยว', 'โจมตีหมู่ (AoE)', 'พุ่งประชิด (Gap Closer)', 'บัฟตัวเอง'],
    passive: { name: 'สัญชาตญาณนักรบ', desc: 'โอกาสคริติคอล +5% และการโจมตีปกติทุกครั้งที่ 4 แรงขึ้น ×1.5' } },
  ranged: { name: 'ระยะไกล / นักเวท', en: 'Ranged & Mage', desc: 'โจมตีไกลและสร้างดาเมจมหาศาล', col: '#b27bff', icon: 'arrow', cats: ['โจมตีระยะไกล', 'โจมตีหมู่ / ร่ายเวทหมู่ (AoE)', 'ร่ายสถานะ (Debuff)', 'หนีภัย (Escape)'],
    passive: { name: 'สายตาเหยี่ยว', desc: 'ทำดาเมจ +12% ใส่ศัตรูที่อยู่ไกลเกิน 6 เมตร' } },
  support: { name: 'สนับสนุน / ฮีลเลอร์', en: 'Healer & Support', desc: 'ฟื้นฟูและบัฟทีม', col: '#8fe08a', icon: 'heart', cats: ['ฟื้นฟูเลือด (Heal)', 'ล้างสถานะ (Cleanse)', 'เพิ่มพลังทีม (Buff)', 'คืนชีพ (Resurrection)'],
    passive: { name: 'ใจศรัทธา', desc: 'การฟื้นฟูแรงขึ้น 20% และการโจมตีปกติฟื้น HP 1.5%' } }
};
const SKILL_KEYS = ['Q', 'E', 'R', 'T', 'X'];
Object.assign(CLASSES.knight, { role: 'tank', skills: ['bash', 'taunt', 'guard', 'charge', 'cleave'] });
Object.assign(CLASSES.adventurer, { role: 'melee', skills: ['combo', 'whirl', 'rush', 'focus', 'hero'] });
Object.assign(CLASSES.ninja, { role: 'melee', skills: ['crescent', 'smoke', 'shadow', 'assassin', 'blades'] });
Object.assign(CLASSES.archer, { role: 'ranged', skills: ['power', 'multi', 'venom', 'leap', 'rain'] });
Object.assign(CLASSES.mage, { role: 'ranged', skills: ['fire', 'storm', 'frost', 'blink', 'meteor'] });
Object.assign(CLASSES.priest, { role: 'support', skills: ['heal', 'cleanse', 'bless', 'angel', 'judge'] });

/* cat = role category shown on the skill card; desc = full explanation; dmg skills use ATK × mult */
Object.assign(SKILLS, {
  // ---- Tank: knight ----
  bash: { name: 'โล่กระแทก', cat: 'ควบคุม (CC)', type: 'cone', mp: 8, cd: 5, mult: 1.6, r: 3.6, ang: .8, stun: 1.8, col: [.8, .85, 1], icon: 'shield', glyph: 'bash',
    desc: 'กระแทกโล่ไปข้างหน้าเป็นรูปพัด ศัตรูที่โดนจะมึนงงขยับไม่ได้ ใช้หยุดศัตรูที่กำลังจะโจมตี', fx: ['มึนงง 1.8 วินาที', 'โจมตีศัตรูที่มึนงงแรงขึ้น ×1.5'] },
  taunt: { name: 'คำรามท้าทาย', cat: 'ยั่วยุ (Taunt)', type: 'taunt', mp: 10, cd: 12, r: 9, t: 6, weak: .3, col: [1, .55, .35], icon: 'taunt', glyph: 'taunt',
    desc: 'ตะโกนท้าทายศัตรูรอบตัว ทุกตัวในระยะจะหันมาโจมตีอัศวินแทน และอ่อนแรงลงเพราะความกลัว', fx: ['ดึงความสนใจศัตรูทั้งหมดในรัศมี 9 เมตร', 'ศัตรูทำดาเมจลดลง 30% นาน 6 วินาที', 'ปลุกมอนสเตอร์ที่สงบให้เข้ามาหา'] },
  guard: { name: 'ปราการเหล็ก', cat: 'เพิ่มพลังป้องกัน', type: 'buff', mp: 12, cd: 16, buffs: [['guard', 8], ['ironhp', 8]], heal: .1, col: [.7, .8, 1], icon: 'guard', glyph: 'guard',
    desc: 'ตั้งโล่และรวบรวมพลังป้องกัน ร่างกายแข็งแกร่งดั่งกำแพงเหล็ก', fx: ['พลังป้องกัน +70% นาน 8 วินาที', 'HP สูงสุด +20% นาน 8 วินาที', 'ฟื้น HP ทันที 10%'] },
  charge: { name: 'พุ่งชนโล่', cat: 'เคลื่อนที่ / ดึงศัตรู', type: 'dash', mp: 12, cd: 9, mult: 1.4, dist: 8, pull: 4.5, stun: .8, col: [.75, .85, 1], icon: 'dash', glyph: 'charge',
    desc: 'พุ่งเข้าหาเป้าหมายพร้อมโล่ ชนทุกตัวที่ขวาง แล้วกระชากศัตรูรอบจุดที่ไปถึงเข้ามารวมกันตรงหน้า', fx: ['พุ่ง 8 เมตร', 'ดึงศัตรูรัศมี 4.5 เมตรเข้ามาหา', 'มึนงง 0.8 วินาที'] },
  cleave: { name: 'ดาบศักดิ์สิทธิ์', cat: 'สกิลใหญ่ + ตอบคำถาม', type: 'cone', mp: 25, cd: 18, mult: 3.8, r: 7.5, ang: 1.25, quiz: true, col: [1, .95, .6], icon: 'sword', glyph: 'cleave',
    desc: 'ฟันดาบแสงศักดิ์สิทธิ์ครึ่งวงกลมขนาดใหญ่ ต้องตอบคำถามก่อนปล่อยสกิล', fx: ['ตอบถูก: พลัง ×2 (คริติคอล)', 'ตอบผิด: สกิลฟาวล์ เสีย MP ครึ่งหนึ่ง'] },
  // ---- Melee: adventurer ----
  combo: { name: 'คอมโบสามจังหวะ', cat: 'โจมตีเดี่ยว', type: 'combo', mp: 7, cd: 4, mult: .95, hits: 3, r: 4.2, col: [1, .85, .5], icon: 'slash', glyph: 'combo',
    desc: 'ฟันต่อเนื่องสามครั้งใส่เป้าหมายเดียว ครั้งสุดท้ายแรงที่สุด', fx: ['3 ครั้ง ครั้งละ ATK ×0.95', 'ครั้งที่ 3 แรงขึ้น ×1.5', 'ต้องอยู่ใกล้เป้าหมาย (4 เมตร)'] },
  whirl: { name: 'พายุดาบหมุน', cat: 'โจมตีหมู่ (AoE)', type: 'nova', mp: 12, cd: 7, mult: 1.5, r: 4.5, col: [1, .8, .45], icon: 'burst', glyph: 'whirl',
    desc: 'หมุนตัวฟันรอบทิศ กวาดศัตรูทุกตัวที่ล้อมอยู่', fx: ['รัศมี 4.5 เมตรรอบตัว'] },
  rush: { name: 'ก้าวพุ่งโจมตี', cat: 'พุ่งประชิด (Gap Closer)', type: 'dash', mp: 9, cd: 6, mult: 1.6, dist: 8, col: [1, .9, .6], icon: 'dash', glyph: 'rush',
    desc: 'พุ่งเข้าหาเป้าหมายอย่างรวดเร็ว ฟันทุกตัวที่ขวางทาง ใช้หนีออกจากวงล้อมได้ด้วย', fx: ['พุ่ง 8 เมตร'] },
  focus: { name: 'ใจนักสู้', cat: 'บัฟตัวเอง', type: 'buff', mp: 14, cd: 18, buffs: [['frenzy', 8]], col: [1, .6, .3], icon: 'fire', glyph: 'focus',
    desc: 'รวบรวมสมาธิ ร่างกายร้อนแรง โจมตีเร็วและแม่นยำขึ้น', fx: ['ความเร็วโจมตี +40% นาน 8 วินาที', 'โอกาสคริติคอล +20%'] },
  hero: { name: 'ฮีโร่สไตรก์', cat: 'สกิลใหญ่ + ตอบคำถาม', type: 'rain', mp: 24, cd: 18, mult: 4.4, r: 3.6, quiz: true, col: [1, .8, .3], icon: 'star', glyph: 'hero',
    desc: 'กระโดดสูงแล้วทิ้งดาบลงมาเป็นแสงระเบิด ต้องตอบคำถามก่อนปล่อยสกิล', fx: ['ตอบถูก: พลัง ×2 (คริติคอล)', 'ตอบผิด: สกิลฟาวล์ เสีย MP ครึ่งหนึ่ง'] },
  // ---- Melee: ninja ----
  crescent: { name: 'ฟันจันทร์เสี้ยว', cat: 'โจมตีเดี่ยว', type: 'combo', mp: 8, cd: 4, mult: .6, hits: 5, r: 4, col: [.85, .8, 1], icon: 'slash', glyph: 'crescent',
    desc: 'ฟันรัวห้าครั้งราวกับแสงจันทร์ ใส่เป้าหมายเดียวอย่างรวดเร็ว', fx: ['5 ครั้ง ครั้งละ ATK ×0.6', 'ครั้งสุดท้ายแรงขึ้น ×1.5'] },
  smoke: { name: 'ระเบิดควันพิษ', cat: 'โจมตีหมู่ (AoE)', type: 'nova', mp: 13, cd: 8, mult: 1.1, r: 4.5, dot: { k: .3, t: 5 }, col: [.6, .85, .4], icon: 'burst', glyph: 'smoke',
    desc: 'ขว้างระเบิดควันพิษลงพื้น ศัตรูรอบตัวโดนดาเมจและติดพิษต่อเนื่อง', fx: ['รัศมี 4.5 เมตร', 'ติดพิษ ATK ×0.3 ต่อวินาที นาน 5 วินาที'] },
  shadow: { name: 'ก้าวเงา', cat: 'พุ่งประชิด (Gap Closer)', type: 'dash', mp: 10, cd: 6, mult: 1.7, dist: 8, col: [.5, .4, .8], icon: 'dash', glyph: 'shadow',
    desc: 'หายตัวเป็นเงาแล้วไปโผล่ข้างหน้า ฟันทุกตัวที่อยู่บนเส้นทาง', fx: ['พุ่ง 8 เมตร'] },
  assassin: { name: 'จิตนักฆ่า', cat: 'บัฟตัวเอง', type: 'buff', mp: 14, cd: 18, buffs: [['assassin', 8]], col: [.9, .35, .4], icon: 'star4', glyph: 'assassin',
    desc: 'ปลุกสัญชาตญาณนักฆ่า เคลื่อนไหวรวดเร็วและหาจุดอ่อนได้ทุกครั้ง', fx: ['โอกาสคริติคอล +35% นาน 8 วินาที', 'ความเร็วเคลื่อนที่ +30%'] },
  blades: { name: 'พันใบมีด', cat: 'สกิลใหญ่ + ตอบคำถาม', type: 'nova', mp: 26, cd: 18, mult: 3.6, r: 6.5, quiz: true, col: [.9, .5, .5], icon: 'burst', glyph: 'blades',
    desc: 'ใบมีดนับพันหมุนเป็นพายุรอบตัว ต้องตอบคำถามก่อนปล่อยสกิล', fx: ['ตอบถูก: พลัง ×2 (คริติคอล)', 'ตอบผิด: สกิลฟาวล์ เสีย MP ครึ่งหนึ่ง'] },
  // ---- Ranged: archer ----
  power: { name: 'ยิงทะลวง', cat: 'โจมตีระยะไกล', type: 'proj', mp: 8, cd: 3.2, mult: 2.3, n: 1, pierce: true, proj: 'arrow', col: [1, .9, .6], icon: 'arrow', glyph: 'power',
    desc: 'ง้างธนูสุดแรงยิงลูกศรทะลุศัตรูทุกตัวในแนวเส้นตรง', fx: ['ทะลุศัตรูหลายตัว', 'ระยะไกลมาก'] },
  multi: { name: 'ศรห้าดอก', cat: 'โจมตีหมู่ (AoE)', type: 'proj', mp: 13, cd: 7, mult: 1.15, n: 5, spread: .2, proj: 'arrow', col: [1, .9, .6], icon: 'fan', glyph: 'multi',
    desc: 'ยิงลูกศรห้าดอกพร้อมกันเป็นรูปพัด ครอบคลุมศัตรูหลายตัว', fx: ['5 ดอก ดอกละ ATK ×1.15'] },
  venom: { name: 'ศรอาบพิษ', cat: 'ร่ายสถานะ (Debuff)', type: 'proj', mp: 10, cd: 8, mult: 1.0, n: 1, proj: 'arrow', dot: { k: .35, t: 6 }, slow: 3, col: [.55, .9, .35], icon: 'arrow', glyph: 'venom',
    desc: 'ลูกศรชุบพิษงูเขียว ศัตรูที่โดนจะติดพิษและเคลื่อนที่ช้าลง', fx: ['ติดพิษ ATK ×0.35 ต่อวินาที นาน 6 วินาที', 'ช้าลง 3 วินาที'] },
  leap: { name: 'กระโดดถอยหลัง', cat: 'หนีภัย (Escape)', type: 'escape', mp: 8, cd: 9, dist: 7, slow: 3, r: 4, col: [.7, 1, .7], icon: 'dash', glyph: 'leap',
    desc: 'ตีลังกาถอยหลังออกจากวงล้อม ทิ้งกับดักตาข่ายไว้ที่เดิม ศัตรูที่อยู่ใกล้จะช้าลง', fx: ['ถอยหลัง 7 เมตร', 'ศัตรูรัศมี 4 เมตรช้าลง 3 วินาที', 'ลดดาเมจที่ได้รับ 40% นาน 2 วินาที'] },
  rain: { name: 'ฝนลูกศร', cat: 'สกิลใหญ่ + ตอบคำถาม', type: 'rain', mp: 25, cd: 18, mult: 3.3, r: 6, quiz: true, col: [1, .85, .5], icon: 'rain', glyph: 'rain',
    desc: 'ยิงลูกศรขึ้นฟ้าแล้วโปรยลงมาเป็นฝนทั่วบริเวณ ต้องตอบคำถามก่อนปล่อยสกิล', fx: ['ตอบถูก: พลัง ×2 (คริติคอล)', 'ตอบผิด: สกิลฟาวล์ เสีย MP ครึ่งหนึ่ง'] },
  // ---- Ranged: mage ----
  fire: { name: 'ลูกไฟ', cat: 'โจมตีระยะไกล', type: 'proj', mp: 9, cd: 2.4, mult: 2.3, n: 1, splash: 2.2, proj: 'fire', col: [1, .5, .15], icon: 'fire', glyph: 'fire',
    desc: 'ยิงลูกไฟพุ่งตรงไปหาเป้าหมาย ระเบิดโดนศัตรูรอบข้างเล็กน้อย', fx: ['ระเบิดรัศมี 2.2 เมตร'] },
  storm: { name: 'พายุเพลิง', cat: 'ร่ายเวทหมู่ (AoE)', type: 'storm', mp: 16, cd: 9, mult: 1.7, r: 4.5, dot: { k: .3, t: 4 }, col: [1, .45, .15], icon: 'fire', glyph: 'storm',
    desc: 'เรียกพายุเพลิงหมุนวนลงที่ตำแหน่งเป้าหมาย เผาศัตรูทั้งหมดในบริเวณ', fx: ['รัศมี 4.5 เมตร', 'ติดไฟ ATK ×0.3 ต่อวินาที นาน 4 วินาที'] },
  frost: { name: 'วงแหวนน้ำแข็ง', cat: 'ร่ายสถานะ (Debuff)', type: 'nova', mp: 14, cd: 9, mult: 1.0, r: 6, slow: 4, stun: 1.2, col: [.5, .85, 1], icon: 'snow', glyph: 'frost',
    desc: 'ปล่อยความเย็นยะเยือกรอบตัว แช่แข็งศัตรูชั่วครู่แล้วทำให้เคลื่อนที่ช้าลง', fx: ['แช่แข็ง 1.2 วินาที', 'ช้าลง 4 วินาที', 'รัศมี 6 เมตร'] },
  blink: { name: 'เคลื่อนย้ายมิติ', cat: 'หนีภัย (Escape)', type: 'escape', mp: 10, cd: 10, dist: 8, slow: 2, r: 3.5, blink: true, col: [.75, .55, 1], icon: 'star4', glyph: 'blink',
    desc: 'ฉีกมิติวาร์ปถอยหลังทันที ทิ้งเศษเวทน้ำแข็งไว้ที่เดิมให้ศัตรูช้าลง', fx: ['วาร์ปถอยหลัง 8 เมตร (ทะลุสิ่งกีดขวางไม่ได้)', 'ศัตรูรัศมี 3.5 เมตรช้าลง', 'ลดดาเมจที่ได้รับ 40% นาน 2 วินาที'] },
  meteor: { name: 'อุกกาบาต', cat: 'สกิลใหญ่ + ตอบคำถาม', type: 'rain', mp: 28, cd: 18, mult: 4.1, r: 7, quiz: true, col: [1, .45, .2], icon: 'meteor', glyph: 'meteor',
    desc: 'เรียกอุกกาบาตจากฟ้าลงมาถล่มพื้นที่กว้าง ต้องตอบคำถามก่อนปล่อยสกิล', fx: ['ตอบถูก: พลัง ×2 (คริติคอล)', 'ตอบผิด: สกิลฟาวล์ เสีย MP ครึ่งหนึ่ง'] },
  // ---- Support: priest ----
  heal: { name: 'แสงฟื้นฟู', cat: 'ฟื้นฟูเลือด (Heal)', type: 'heal', mp: 14, cd: 8, heal: .35, buffs: [['regen', 6]], col: [.6, 1, .6], icon: 'heart', glyph: 'heal',
    desc: 'อธิษฐานเรียกแสงอบอุ่นโอบล้อมตัว ฟื้นฟู HP ทันทีและต่อเนื่องอีกระยะ', fx: ['ฟื้น HP 35% ทันที', 'ฟื้นต่อเนื่อง 6 วินาที'] },
  cleanse: { name: 'ชำระล้าง', cat: 'ล้างสถานะ (Cleanse)', type: 'cleanse', mp: 10, cd: 12, heal: .1, mult: 1.2, r: 4, buffs: [['ward', 5]], col: [.6, .9, 1], icon: 'sun', glyph: 'cleanse',
    desc: 'น้ำศักดิ์สิทธิ์ชำระล้างสถานะผิดปกติทั้งหมด พร้อมคลื่นแสงผลักดันความชั่วร้ายรอบตัว', fx: ['ลบพิษ ช้าลง และคำสาปทั้งหมด', 'ลดดาเมจที่ได้รับ 40% นาน 5 วินาที', 'ฟื้น HP 10% และโจมตีศัตรูรอบตัว ATK ×1.2'] },
  bless: { name: 'พรแห่งแสง', cat: 'เพิ่มพลังทีม (Buff)', type: 'buff', mp: 18, cd: 20, buffs: [['atk', 12], ['def', 12], ['regen', 12]], col: [1, .95, .6], icon: 'sun', glyph: 'bless',
    desc: 'มอบพรแห่งแสงให้ทั้งทีม เพิ่มพลังโจมตี พลังป้องกัน และฟื้นฟูต่อเนื่อง', fx: ['พลังโจมตี +20% นาน 12 วินาที', 'พลังป้องกัน +25%', 'ฟื้น HP ต่อเนื่อง'] },
  angel: { name: 'ปีกเทวทูต', cat: 'คืนชีพ (Resurrection)', type: 'buff', mp: 22, cd: 60, buffs: [['angel', 30]], col: [1, 1, .85], icon: 'wing', glyph: 'angel',
    desc: 'เทวทูตเฝ้าคุ้มครอง ถ้าพ่ายแพ้ภายในเวลาที่กำหนดจะฟื้นคืนชีพทันทีที่เดิม', fx: ['คุ้มครอง 30 วินาที', 'ฟื้นคืนชีพพร้อม HP 50% และ MP 30%'] },
  judge: { name: 'พิพากษา', cat: 'สกิลใหญ่ + ตอบคำถาม', type: 'rain', mp: 26, cd: 18, mult: 3.5, r: 6.2, heal: .15, quiz: true, col: [1, .95, .7], icon: 'sun', glyph: 'judge',
    desc: 'ลำแสงพิพากษาฟาดลงจากฟ้า ทำลายศัตรูและฟื้นฟูผู้ร่าย ต้องตอบคำถามก่อนปล่อยสกิล', fx: ['ฟื้น HP 15%', 'ตอบถูก: พลัง ×2 (คริติคอล)', 'ตอบผิด: สกิลฟาวล์ เสีย MP ครึ่งหนึ่ง'] }
});
Object.assign(BUFFS, {
  frenzy: { name: 'ใจนักสู้', desc: 'ความเร็วโจมตี +40% · คริติคอล +20%', col: '#ff9a5a' },
  assassin: { name: 'จิตนักฆ่า', desc: 'คริติคอล +35% · ความเร็ว +30%', col: '#e8607a' },
  ironhp: { name: 'กายเหล็ก', desc: 'HP สูงสุด +20%', col: '#a9b8d8' },
  ward: { name: 'เกราะแสง', desc: 'รับดาเมจลดลง 40%', col: '#9fd8ff' },
  angel: { name: 'ปีกเทวทูต', desc: 'ฟื้นคืนชีพเมื่อพ่ายแพ้', col: '#fff3b0' },
  // debuffs (removed by cleanse)
  poison: { name: 'ติดพิษ', desc: 'เสีย HP ทุกวินาที', col: '#8fdc5a', bad: true },
  slowed: { name: 'เคลื่อนที่ช้า', desc: 'ความเร็ว -35%', col: '#8fb8ff', bad: true },
  curse: { name: 'คำสาป', desc: 'พลังโจมตี -20%', col: '#c88aff', bad: true }
});

