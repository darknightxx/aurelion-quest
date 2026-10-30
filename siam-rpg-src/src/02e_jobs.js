/* ============================================================
   Class advancement: 2nd jobs (Lv.10) and Awakening (Lv.20)
   ============================================================ */
const JOB_LV = 10, AWK_LV = 20, LV_CAP = 30, AWK_LV_CAP = 40;
const JOBS = {
  lordknight: { base: 'knight', name: 'ลอร์ดไนท์', en: 'Lord Knight', role: 'melee', color: '#c84a3a', weapon: 'greatsword', hp: 30, mp: 5, atk: 6, def: 2, spd: .2, range: 2.9, rate: .8, melee: true,
    desc: 'อัศวินผู้เลือกดาบใหญ่สองมือ ทิ้งโล่เพื่อพลังทำลายล้าง', skills: ['bash', 'taunt', 'bowling', 'brandish', 'dragonblade'], awk: ['bowling', 'brandish'] },
  paladin: { base: 'knight', name: 'พาลาดิน', en: 'Paladin', role: 'tank', color: '#e8d8a0', weapon: 'lance', hp: 50, mp: 15, atk: 2, def: 6, spd: 0, range: 2.8, rate: .85, melee: true,
    desc: 'อัศวินศักดิ์สิทธิ์ผู้ถือโล่และทวน ปกป้องเพื่อนด้วยพลังแห่งแสง', skills: ['bash', 'guard', 'grandcross', 'shieldchain', 'devotion'], awk: ['grandcross', 'shieldchain'] },
  whitesmith: { base: 'adventurer', name: 'ช่างตีเหล็ก', en: 'Whitesmith', role: 'melee', color: '#d9a845', weapon: 'hammer', hp: 35, mp: 5, atk: 7, def: 3, spd: 0, range: 2.6, rate: .85, melee: true,
    desc: 'นักผจญภัยผู้หลงใหลงานช่าง ถือค้อนยักษ์และทุบทุกอย่างให้แบน', skills: ['combo', 'whirl', 'hammerfall', 'thunderforge', 'mammonite'], awk: ['hammerfall', 'thunderforge'] },
  creator: { base: 'adventurer', name: 'นักปรุงยา', en: 'Creator', role: 'support', color: '#8ad06a', weapon: 'flask', hp: 20, mp: 30, atk: 3, def: 2, spd: .1, range: 9, rate: .9, melee: false, proj: 'orb',
    desc: 'นักผจญภัยผู้ค้นพบศาสตร์แห่งยา ปาขวดกรดและปรุงยาฟื้นฟูให้เพื่อน', skills: ['combo', 'focus', 'aciddemo', 'potionpitch', 'acidbomb'], awk: ['aciddemo', 'potionpitch'] },
  assassinx: { base: 'ninja', name: 'แอสซาซินครอส', en: 'Assassin Cross', role: 'melee', color: '#9a2a3a', weapon: 'katar', hp: 15, mp: 10, atk: 9, def: 1, spd: .4, range: 2.4, rate: .5, melee: true,
    desc: 'นินจาที่ก้าวสู่ความมืด ถือกรงเล็บคู่และพิษร้ายแรงที่สุด', skills: ['crescent', 'smoke', 'sonicblow', 'edp', 'meteorassault'], awk: ['sonicblow', 'edp'] },
  stalker: { base: 'ninja', name: 'สตอล์กเกอร์', en: 'Stalker', role: 'melee', color: '#5a4a7a', weapon: 'dualdagger', hp: 25, mp: 15, atk: 5, def: 3, spd: .5, range: 2.5, rate: .6, melee: true,
    desc: 'นินจาเงาผู้ไม่เคยถูกมองเห็น แทงข้างหลังแล้วหายไปในความมืด', skills: ['crescent', 'shadow', 'backstab', 'chasewalk', 'raid'], awk: ['backstab', 'chasewalk'] },
  sniper: { base: 'archer', name: 'สไนเปอร์', en: 'Sniper', role: 'ranged', color: '#5a8a3a', weapon: 'longbow', hp: 15, mp: 15, atk: 8, def: 1, spd: .2, range: 13, rate: .75, melee: false, proj: 'arrow',
    desc: 'นักธนูผู้แม่นยำที่สุด มีเหยี่ยวคู่ใจคอยโจมตีศัตรูจากฟ้า', skills: ['power', 'venom', 'blitz', 'truesight', 'sharpshoot'], awk: ['blitz', 'truesight'] },
  minstrel: { base: 'archer', name: 'นักดนตรี', en: 'Minstrel', role: 'support', color: '#e8a0c0', weapon: 'harp', hp: 25, mp: 30, atk: 4, def: 2, spd: .2, range: 10, rate: .85, melee: false, proj: 'holy',
    desc: 'นักธนูผู้เปลี่ยนคันธนูเป็นพิณ บทเพลงเสริมพลังให้ทั้งปาร์ตี้', skills: ['power', 'leap', 'bragi', 'idun', 'arrowvulcan'], awk: ['bragi', 'idun'] },
  highwizard: { base: 'mage', name: 'จอมเวทขั้นสูง', en: 'High Wizard', role: 'ranged', color: '#7a3ad0', weapon: 'bigstaff', hp: 10, mp: 40, atk: 9, def: 1, spd: 0, range: 11, rate: .95, melee: false, proj: 'orb',
    desc: 'จอมเวทผู้ควบคุมพลังทำลายล้างขั้นสูงสุด เวทของเขาถล่มทั้งสนามรบ', skills: ['fire', 'frost', 'napalm', 'gravity', 'stormgust'], awk: ['napalm', 'gravity'] },
  professor: { base: 'mage', name: 'ศาสตราจารย์', en: 'Professor', role: 'support', color: '#d06a3a', weapon: 'book', hp: 25, mp: 30, atk: 5, def: 3, spd: .1, range: 10, rate: 1.0, melee: false, proj: 'orb',
    desc: 'จอมเวทนักวิชาการ ใช้ตำราเวทควบคุมสนามรบและปกป้องเพื่อน', skills: ['fire', 'blink', 'heavensdrive', 'blindmist', 'soulburn'], awk: ['heavensdrive', 'blindmist'] },
  highpriest: { base: 'priest', name: 'นักบวชขั้นสูง', en: 'High Priest', role: 'support', color: '#f4e0a0', weapon: 'bigrod', hp: 20, mp: 40, atk: 3, def: 3, spd: 0, range: 10, rate: .9, melee: false, proj: 'holy',
    desc: 'นักบวชผู้บรรลุธรรมขั้นสูง ขับไล่วิญญาณร้ายและฟื้นฟูได้ไม่สิ้นสุด', skills: ['heal', 'cleanse', 'magnus', 'meditation', 'redemption'], awk: ['magnus', 'meditation'] },
  champion: { base: 'priest', name: 'แชมเปี้ยน', en: 'Champion', role: 'melee', color: '#e86a3a', weapon: 'knuckle', hp: 35, mp: 10, atk: 8, def: 3, spd: .3, range: 2.3, rate: .6, melee: true,
    desc: 'นักบวชผู้ฝึกหมัดจนถึงขีดสุด ปล่อยหมัดอสุราที่ทำลายได้แม้แต่ภูเขา', skills: ['heal', 'bless', 'ragingpalm', 'spheres', 'asura'], awk: ['ragingpalm', 'spheres'] }
};
const JOB_OF = {}; for (const k in JOBS) (JOB_OF[JOBS[k].base] = JOB_OF[JOBS[k].base] || []).push(k);
/* effective class definition for a save */
const Cls = {
  cache: {},
  of(S) {
    if (!S) return CLASSES.adventurer;
    const base = CLASSES[S.cls] || CLASSES.adventurer; const j = S.job && JOBS[S.job]; if (!j) return base;
    const key = S.job; if (this.cache[key]) return this.cache[key];
    return this.cache[key] = Object.assign({}, base, j, { hp: base.hp + j.hp, mp: base.mp + j.mp, atk: base.atk + j.atk, def: base.def + j.def, spd: base.spd + j.spd, id: key });
  },
  name(S) { const c = this.of(S); return (S.awk ? 'ผู้ตื่นรู้ ' : '') + c.name; },
  isAwkSkill(S, id) { const j = S && S.job && JOBS[S.job]; return !!(S && S.awk && j && j.awk.includes(id)); }
};

/* ---- job skills (R, T, X) ---- */
Object.assign(SKILLS, {
  bowling: { name: 'โบว์ลิ่งแบช', cat: 'โจมตีหมู่', type: 'nova', mp: 14, cd: 7, mult: 2.0, r: 5, stun: .6, col: [1, .6, .4], icon: 'burst', glyph: 'whirl', desc: 'เหวี่ยงดาบใหญ่กวาดรอบตัว ศัตรูกระเด็นชนกันและมึนงงชั่วครู่', fx: ['ดาเมจ ×2.0 รอบตัว 5 เมตร', 'มึนงง 0.6 วินาที'] },
  brandish: { name: 'แบรนดิชสเปียร์', cat: 'โจมตีด้านหน้า', type: 'cone', mp: 18, cd: 9, mult: 2.6, r: 7.5, ang: 1.0, col: [1, .75, .4], icon: 'sword', glyph: 'cleave', desc: 'ฟาดคลื่นพลังจากดาบใหญ่เป็นแนวกว้างด้านหน้า โจมตีศัตรูได้หลายตัวพร้อมกัน', fx: ['ดาเมจ ×2.6 ด้านหน้า 7.5 เมตร'] },
  dragonblade: { name: 'ดาบมังกรคำราม', cat: 'สกิลใหญ่ + ตอบคำถาม', type: 'rain', mp: 30, cd: 20, mult: 5.2, r: 5.5, quiz: true, col: [1, .45, .25], icon: 'fire', glyph: 'hero', desc: 'กระโดดฟาดดาบใหญ่ลงพื้นเป็นรูปมังกรเพลิง', fx: ['ดาเมจ ×5.2 ในพื้นที่', 'ตอบถูก: พลัง ×2'] },
  grandcross: { name: 'แกรนด์ครอส', cat: 'โจมตีหมู่ + ฟื้นฟู', type: 'nova', mp: 18, cd: 10, mult: 1.9, r: 6, heal: .06, col: [1, .95, .7], icon: 'sun', glyph: 'judge', desc: 'สร้างกางเขนแสงศักดิ์สิทธิ์รอบตัว ผีและอันเดดรับดาเมจเพิ่ม', fx: ['ดาเมจ ×1.9 รอบตัว 6 เมตร', 'ผี/อันเดด ×1.3', 'ฟื้น HP 6%'] },
  shieldchain: { name: 'โล่ลูกโซ่', cat: 'โจมตีระยะไกล', type: 'proj', mp: 16, cd: 8, mult: .85, n: 5, spread: .06, proj: 'star', col: [.8, .85, 1], icon: 'shield', glyph: 'charge', desc: 'ขว้างโล่ 5 ครั้งติดต่อกันใส่เป้าหมาย', fx: ['ดาเมจ ×0.85 × 5 ครั้ง'] },
  devotion: { name: 'ดีโวชั่น', cat: 'สกิลใหญ่ + ตอบคำถาม', type: 'buff', mp: 28, cd: 22, buffs: [['ward', 12], ['ironhp', 20], ['guard', 12]], heal: .3, quiz: true, col: [1, .95, .8], icon: 'guard', glyph: 'guard', desc: 'อุทิศตนปกป้อง รับดาเมจลดลงมหาศาลและฟื้น HP', fx: ['เกราะแสง 12 วิ', 'กายเหล็ก 20 วิ', 'ปราการเหล็ก 12 วิ', 'ฟื้น HP 30%'] },
  hammerfall: { name: 'ค้อนถล่ม', cat: 'โจมตีหมู่', type: 'nova', mp: 14, cd: 8, mult: 1.7, r: 4.5, stun: 1.5, col: [1, .8, .4], icon: 'burst', glyph: 'bash', desc: 'ทุบค้อนลงพื้นให้สะเทือน ศัตรูรอบตัวมึนงง', fx: ['ดาเมจ ×1.7 รอบตัว 4.5 เมตร', 'มึนงง 1.5 วินาที'] },
  thunderforge: { name: 'ค้อนสายฟ้า', cat: 'โจมตีด้านหน้า', type: 'cone', mp: 18, cd: 9, mult: 3.0, r: 5, ang: .7, stun: .8, col: [1, .9, .3], icon: 'meteor', glyph: 'storm', desc: 'ค้อนที่ชาร์จด้วยพลังสายฟ้า ฟาดใส่ศัตรูด้านหน้าอย่างรุนแรง', fx: ['ดาเมจ ×3.0 ด้านหน้า 5 เมตร', 'มึนงง 0.8 วินาที'] },
  mammonite: { name: 'แมมโมไนต์', cat: 'สกิลใหญ่ + ตอบคำถาม', type: 'combo', mp: 26, cd: 18, mult: 7.5, hits: 1, r: 3, quiz: true, col: [1, .85, .3], icon: 'coin', glyph: 'hero', desc: 'ทุ่มเหรียญทองทั้งหมดลงบนค้อนแล้วทุบ ดาเมจเดี่ยวสูงมาก', fx: ['ดาเมจ ×7.5 เป้าหมายเดียว', 'ตอบถูก: พลัง ×2'] },
  aciddemo: { name: 'ขวดกรดกัดกร่อน', cat: 'โจมตีระยะไกล', type: 'proj', mp: 14, cd: 6, mult: 1.6, n: 1, splash: 2.5, proj: 'fire', dot: { k: .25, t: 6 }, col: [.6, 1, .3], icon: 'potR', glyph: 'venom', desc: 'ปาขวดกรดที่แตกกระจายและกัดกร่อนศัตรูต่อเนื่อง', fx: ['ดาเมจ ×1.6 + กระจาย 2.5 เมตร', 'กรดกัดกร่อน 6 วิ'] },
  potionpitch: { name: 'ปาขวดยาฟื้นฟู', cat: 'ฟื้นฟู', type: 'heal', mp: 18, cd: 12, heal: .32, buffs: [['regen', 8], ['luck', 30]], col: [.5, 1, .6], icon: 'heart', glyph: 'heal', desc: 'โยนขวดยาที่ปรุงพิเศษ ฟื้น HP ทันทีและฟื้นต่อเนื่อง', fx: ['ฟื้น HP 32%', 'ฟื้นต่อเนื่อง 8 วิ', 'โชคดี 30 วิ'] },
  acidbomb: { name: 'ระเบิดกรดยักษ์', cat: 'สกิลใหญ่ + ตอบคำถาม', type: 'rain', mp: 28, cd: 20, mult: 4.6, r: 6.5, quiz: true, col: [.5, 1, .25], icon: 'meteor', glyph: 'meteor', desc: 'ขว้างระเบิดกรดลูกใหญ่ลงกลางกลุ่มศัตรู', fx: ['ดาเมจ ×4.6 ในพื้นที่', 'ตอบถูก: พลัง ×2'] },
  sonicblow: { name: 'โซนิคโบลว์', cat: 'โจมตีต่อเนื่อง', type: 'combo', mp: 16, cd: 8, mult: .8, hits: 6, r: 2.8, col: [1, .4, .5], icon: 'burst', glyph: 'combo', desc: 'ฟันด้วยกรงเล็บคู่ 6 ครั้งรวดเร็วจนมองไม่ทัน', fx: ['ดาเมจ ×0.8 × 6 ครั้ง', 'ครั้งสุดท้าย ×1.5'] },
  edp: { name: 'พิษมรณะ', cat: 'เสริมพลัง', type: 'buff', mp: 20, cd: 24, buffs: [['assassin', 15], ['frenzy', 15]], col: [.6, .2, .7], icon: 'star4', glyph: 'assassin', desc: 'ทาพิษร้ายแรงที่สุดลงบนอาวุธ', fx: ['จิตนักฆ่า 15 วิ', 'ใจนักสู้ 15 วิ'] },
  meteorassault: { name: 'มิทีออร์แอสซอลต์', cat: 'สกิลใหญ่ + ตอบคำถาม', type: 'nova', mp: 28, cd: 18, mult: 4.0, r: 6.5, stun: 1, quiz: true, col: [1, .3, .4], icon: 'burst', glyph: 'blades', desc: 'ระเบิดพลังรอบตัวทำลายทุกอย่างในรัศมี', fx: ['ดาเมจ ×4.0 รอบตัว 6.5 เมตร', 'มึนงง 1 วิ', 'ตอบถูก: พลัง ×2'] },
  backstab: { name: 'แทงข้างหลัง', cat: 'โจมตีเดี่ยว', type: 'dash', mp: 14, cd: 7, mult: 3.4, dist: 7, col: [.6, .4, .9], icon: 'dagger', glyph: 'shadow', desc: 'พุ่งทะลุไปด้านหลังเป้าหมายแล้วแทงจุดตาย', fx: ['ดาเมจ ×3.4 ตลอดแนวพุ่ง 7 เมตร'] },
  chasewalk: { name: 'เดินในเงา', cat: 'หลบหลีก', type: 'escape', mp: 16, cd: 14, blink: true, dist: 8, r: 4, slow: 3, col: [.4, .3, .6], icon: 'dash', glyph: 'blink', desc: 'หายตัวไปในเงาและโผล่ห่างจากศัตรู ศัตรูที่เหลือช้าลง', fx: ['วาร์ป 8 เมตร', 'เกราะแสง 2 วิ', 'ศัตรูช้าลง 3 วิ'] },
  raid: { name: 'เรด', cat: 'สกิลใหญ่ + ตอบคำถาม', type: 'nova', mp: 26, cd: 18, mult: 3.6, r: 5.5, stun: 2, quiz: true, col: [.7, .5, 1], icon: 'burst', glyph: 'smoke', desc: 'ปรากฏตัวจากเงาพร้อมระเบิดควัน ศัตรูรอบตัวมึนงงยาวนาน', fx: ['ดาเมจ ×3.6 รอบตัว', 'มึนงง 2 วิ', 'ตอบถูก: พลัง ×2'] },
  blitz: { name: 'บลิทซ์บีท', cat: 'โจมตีระยะไกล', type: 'proj', mp: 14, cd: 6, mult: .9, n: 4, spread: .14, proj: 'star', col: [.9, .8, .5], icon: 'fan', glyph: 'multi', desc: 'สั่งเหยี่ยวโฉบโจมตีเป้าหมาย 4 ครั้ง', fx: ['ดาเมจ ×0.9 × 4 ครั้ง'] },
  truesight: { name: 'ตาเหยี่ยว', cat: 'เสริมพลัง', type: 'buff', mp: 16, cd: 20, buffs: [['frenzy', 14], ['atk', 14]], col: [.7, 1, .5], icon: 'star', glyph: 'focus', desc: 'เพ่งสายตาจนเห็นจุดอ่อนทุกจุด', fx: ['ใจนักสู้ 14 วิ', 'พรแห่งพละกำลัง 14 วิ'] },
  sharpshoot: { name: 'ชาร์ปชูตติ้ง', cat: 'สกิลใหญ่ + ตอบคำถาม', type: 'proj', mp: 26, cd: 16, mult: 6.0, n: 1, pierce: true, proj: 'arrow', quiz: true, col: [1, .95, .6], icon: 'arrow', glyph: 'power', desc: 'ยิงลูกศรแสงทะลุทุกอย่างที่ขวาง', fx: ['ดาเมจ ×6.0 ทะลุ', 'ตอบถูก: พลัง ×2'] },
  bragi: { name: 'บทกวีแห่งบรากี', cat: 'เสริมพลัง', type: 'buff', mp: 18, cd: 20, buffs: [['haste', 15], ['regen', 10]], col: [1, .7, .9], icon: 'star', glyph: 'bless', desc: 'ดีดพิณขับกล่อม ตัวเองและเพื่อนเร็วขึ้นและฟื้นต่อเนื่อง', fx: ['ความเร็ว +30% 15 วิ', 'ฟื้นต่อเนื่อง 10 วิ'] },
  idun: { name: 'แอปเปิลแห่งอิดุน', cat: 'ฟื้นฟู', type: 'heal', mp: 20, cd: 14, heal: .3, buffs: [['ironhp', 20]], col: [1, .5, .5], icon: 'heart', glyph: 'heal', desc: 'บทเพลงแห่งผลไม้เทพ เพิ่ม HP สูงสุดและฟื้นฟู', fx: ['ฟื้น HP 30%', 'กายเหล็ก 20 วิ'] },
  arrowvulcan: { name: 'แอร์โรว์วัลแคน', cat: 'สกิลใหญ่ + ตอบคำถาม', type: 'proj', mp: 26, cd: 16, mult: .95, n: 9, spread: .1, proj: 'arrow', quiz: true, col: [1, .8, .9], icon: 'rain', glyph: 'multi', desc: 'ยิงลูกศร 9 ดอกรัวใส่เป้าหมายเดียว', fx: ['ดาเมจ ×0.95 × 9 ดอก', 'ตอบถูก: พลัง ×2'] },
  napalm: { name: 'นาปาล์มวัลแคน', cat: 'โจมตีระยะไกล', type: 'proj', mp: 16, cd: 6, mult: .8, n: 5, spread: .12, proj: 'orb', dot: { k: .2, t: 4 }, col: [.75, .4, 1], icon: 'burst', glyph: 'storm', desc: 'ยิงลูกไฟวิญญาณ 5 ลูกต่อเนื่อง ศัตรูติดคำสาปไหม้', fx: ['ดาเมจ ×0.8 × 5 ลูก', 'ไหม้ต่อเนื่อง 4 วิ'] },
  gravity: { name: 'สนามแรงโน้มถ่วง', cat: 'พื้นที่', type: 'storm', mp: 22, cd: 12, mult: 1.3, r: 5, dot: { k: .3, t: 5 }, col: [.5, .4, 1], icon: 'meteor', glyph: 'frost', desc: 'เพิ่มแรงโน้มถ่วงในพื้นที่ ศัตรูถูกกดทับหลายครั้ง', fx: ['ดาเมจ ×1.3 + 2 ระลอก', 'กดทับต่อเนื่อง 5 วิ'] },
  stormgust: { name: 'สตอร์มกัสต์', cat: 'สกิลใหญ่ + ตอบคำถาม', type: 'rain', mp: 30, cd: 20, mult: 4.4, r: 7.5, quiz: true, col: [.6, .9, 1], icon: 'snow', glyph: 'frost', desc: 'พายุหิมะยักษ์ถล่มพื้นที่กว้าง', fx: ['ดาเมจ ×4.4 รัศมี 7.5 เมตร', 'ตอบถูก: พลัง ×2'] },
  heavensdrive: { name: 'เฮฟเวนส์ไดรฟ์', cat: 'โจมตีหมู่', type: 'nova', mp: 16, cd: 8, mult: 1.8, r: 6, col: [.8, .6, .3], icon: 'meteor', glyph: 'meteor', desc: 'เรียกหอกหินทะลุพื้นขึ้นมาแทงศัตรูรอบตัว', fx: ['ดาเมจ ×1.8 รอบตัว 6 เมตร'] },
  blindmist: { name: 'หมอกมืดบอด', cat: 'ควบคุม', type: 'nova', mp: 18, cd: 12, mult: .6, r: 6, slow: 4, buffs: [['ward', 6]], col: [.4, .35, .5], icon: 'snow', glyph: 'smoke', desc: 'ปล่อยหมอกพิษ ศัตรูช้าลงและโจมตีพลาด ตัวเองได้เกราะแสง', fx: ['ศัตรูช้าลง 4 วิ', 'เกราะแสง 6 วิ'] },
  soulburn: { name: 'โซลเบิร์น', cat: 'สกิลใหญ่ + ตอบคำถาม', type: 'rain', mp: 28, cd: 18, mult: 4.2, r: 5.5, heal: .12, quiz: true, col: [1, .5, .3], icon: 'fire', glyph: 'fire', desc: 'เผาวิญญาณศัตรูและดูดพลังกลับมาฟื้นฟูตัวเอง', fx: ['ดาเมจ ×4.2 ในพื้นที่', 'ฟื้น HP 12%', 'ตอบถูก: พลัง ×2'] },
  magnus: { name: 'แมกนัสเอ็กซอร์ซิสมัส', cat: 'โจมตีพื้นที่', type: 'rain', mp: 20, cd: 10, mult: 2.4, r: 6, col: [1, .95, .7], icon: 'sun', glyph: 'judge', desc: 'สร้างกางเขนศักดิ์สิทธิ์ขนาดใหญ่ ขับไล่ผีและอันเดด', fx: ['ดาเมจ ×2.4 ในพื้นที่', 'ผี/อันเดด ×1.5'] },
  meditation: { name: 'สมาธิภาวนา', cat: 'ฟื้นฟู', type: 'cleanse', mp: 14, cd: 14, heal: .25, r: 4, mult: .5, buffs: [['regen', 12], ['ward', 6]], col: [.8, .9, 1], icon: 'heart', glyph: 'cleanse', desc: 'นั่งสมาธิล้างสิ่งชั่วร้าย ฟื้น MP และ HP ต่อเนื่อง', fx: ['ล้างสถานะผิดปกติ', 'ฟื้น HP 25%', 'ฟื้นต่อเนื่อง 12 วิ', 'เกราะแสง 6 วิ'] },
  redemption: { name: 'การไถ่บาป', cat: 'สกิลใหญ่ + ตอบคำถาม', type: 'rain', mp: 28, cd: 20, mult: 3.4, r: 6.5, heal: .35, quiz: true, col: [1, 1, .85], icon: 'sun', glyph: 'angel', desc: 'แสงจากสวรรค์ชำระทั้งศัตรูและตัวเอง', fx: ['ดาเมจ ×3.4', 'ฟื้น HP 35%', 'ตอบถูก: พลัง ×2'] },
  ragingpalm: { name: 'ฝ่ามือพิโรธ', cat: 'โจมตีด้านหน้า', type: 'cone', mp: 14, cd: 7, mult: 2.4, r: 4, ang: .6, stun: .8, col: [1, .6, .3], icon: 'hand', glyph: 'bash', desc: 'ผลักฝ่ามือด้วยพลังลมปราณใส่ศัตรูตรงหน้า', fx: ['ดาเมจ ×2.4 ด้านหน้า 4 เมตร', 'มึนงง 0.8 วิ'] },
  spheres: { name: 'ลูกแก้ววิญญาณ', cat: 'เสริมพลัง', type: 'buff', mp: 16, cd: 18, buffs: [['frenzy', 14], ['ironhp', 14]], col: [1, .8, .5], icon: 'star4', glyph: 'focus', desc: 'เรียกลูกแก้ววิญญาณ 5 ลูกลอยรอบตัว', fx: ['ใจนักสู้ 14 วิ', 'กายเหล็ก 14 วิ'] },
  asura: { name: 'หมัดอสุรา', cat: 'สกิลใหญ่ + ตอบคำถาม', type: 'combo', mp: 34, cd: 24, mult: 10, hits: 1, r: 2.8, quiz: true, col: [1, .5, .2], icon: 'burst', glyph: 'hero', desc: 'รวบรวมพลังทั้งหมดในหมัดเดียว ดาเมจเดี่ยวสูงที่สุดในเกม', fx: ['ดาเมจ ×10 เป้าหมายเดียว', 'ตอบถูก: พลัง ×2 (×20!)'] }
});
const STONES = { st_light: 'ยักษ์ศิลา ผู้พิทักษ์ผลึก', st_dark: 'แม่นาก', st_wisdom: 'บททดสอบนักปราชญ์ (ตอบถูกครบ 5 ข้อ)', st_spirit: 'ปู่โสมเฝ้าทรัพย์' };
Object.assign(ITEMS, {
  st_light: { name: 'ศิลาแห่งแสง', kind: 'mat', quest: true, rare: true, sell: 0, desc: 'ศิลาเรืองแสงสีขาวจากแกนผลึกของยักษ์ศิลา', icon: 'gem' },
  st_dark: { name: 'ศิลาแห่งความมืด', kind: 'mat', quest: true, rare: true, sell: 0, desc: 'ศิลาสีดำที่แม่นากทิ้งไว้เมื่อไปสู่สุคติ', icon: 'gem' },
  st_wisdom: { name: 'ศิลาแห่งปัญญา', kind: 'mat', quest: true, rare: true, sell: 0, desc: 'ศิลาสีฟ้าที่ปราชญ์พรหมมอบให้ผู้ตอบถูกครบทุกข้อ', icon: 'gem' },
  st_spirit: { name: 'ศิลาแห่งวิญญาณ', kind: 'mat', quest: true, rare: true, sell: 0, desc: 'ศิลาสีทองจากไหทรัพย์ของปู่โสม', icon: 'gem' },
  awk_amulet: { name: 'เครื่องรางผู้ตื่นรู้', kind: 'cos', slot: 'aura', price: 0, desc: 'สัญลักษณ์ของผู้ที่ปลดผนึกแห่งพลังแล้ว ออร่าเปลวไฟทองลุกรอบตัว', icon: 'fire' }
});
Object.assign(NPCS, { zen: { name: 'อาจารย์เซน', role: 'ปรมาจารย์แห่งอาชีพ', sheet: 'zen', zone: 'world', x: -5, z: 44, face: .6 } });
Object.assign(QUESTS, {
  awk: { type: 'main', giver: 'zen', minLv: AWK_LV, title: 'ปลดผนึกแห่งพลัง', obj: [{ k: 'collect', item: 'st_light', n: 1 }, { k: 'collect', item: 'st_dark', n: 1 }, { k: 'collect', item: 'st_wisdom', n: 1 }, { k: 'collect', item: 'st_spirit', n: 1 }],
    text: 'เจ้าแข็งแกร่งพอแล้วที่จะรู้ความลับของพลังที่ถูกผนึกไว้ จงนำศิลาทั้ง 4 มาให้ข้า: ศิลาแห่งแสงจากยักษ์ศิลา ศิลาแห่งความมืดจากแม่นาก ศิลาแห่งปัญญาจากบททดสอบของปราชญ์พรหม (ต้องตอบถูกครบ 5 ข้อ) และศิลาแห่งวิญญาณจากปู่โสมเฝ้าทรัพย์ แล้วเตรียมเหรียญ 5,000 เหรียญสำหรับพิธีกรรมปลุกพลัง',
    done: 'ศิลาทั้งสี่สั่นสะเทือนในมือเจ้า... ถึงเวลาแล้ว จงเข้าพิธีกรรมปลุกพลัง ตอบคำถามให้ถูกติดต่อกัน 3 ข้อเพื่อปลดผนึก', rew: { xp: 500, coin: 0, items: [] }, take: true, needJob: true }
});
QUEST_ORDER.push('awk');
ACHIEVEMENTS.push({ id: 'job', name: 'ก้าวสู่อาชีพขั้นสอง', desc: 'เปลี่ยนอาชีพขั้นสองสำเร็จ', stat: 'jobs', n: 1, coin: 300, title: 'ผู้เลือกเส้นทาง' }, { id: 'awk', name: 'ผู้ตื่นรู้', desc: 'ปลดผนึกแห่งพลังและปลุกพลังสำเร็จ', stat: 'awakened', n: 1, coin: 1000, title: 'ผู้ตื่นรู้' });

/* ---- titles from quests / top-up ---- */
const Titles = {
  grant(t, why) { const S = Save.d; if (!S) return; S.extraTitles = S.extraTitles || []; if (S.extraTitles.includes(t)) return; S.extraTitles.push(t); if (!S.title) S.title = t; UI.toast(`ได้รับฉายาใหม่ "${t}" (${why}) · เปลี่ยนได้ที่หน้าความสำเร็จ`, 'rare'); UI.refreshHUD(); },
  all(S) { return ACHIEVEMENTS.filter(a => S.ach[a.id]).map(a => a.title).concat(S.extraTitles || []); }
};

