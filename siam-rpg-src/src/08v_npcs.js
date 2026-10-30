
/* ============================================================
   NPCs & quests round 2: 10 new townsfolk with their own
   quest lines (gathering, exploring, deliveries, emotes, pets,
   patrols), MMO-style dialog with a large illustrated cut-in
   portrait, typewriter text and spoken NPC voices (Thai TTS,
   falling back to a chirpy "talk blip" voice), idle chatter
   bubbles over NPCs in town.
   ============================================================ */
ICONS.flower = '<g fill="currentColor"><circle cx="12" cy="7" r="3"/><circle cx="7.5" cy="10.5" r="3"/><circle cx="16.5" cy="10.5" r="3"/><circle cx="9.5" cy="15" r="3"/><circle cx="14.5" cy="15" r="3"/></g><circle cx="12" cy="11.5" r="2.2" fill="#fff6b0"/>';
ICONS.ore = '<path d="M4 17l3-8 5-3 6 2 2 7-5 4H8z" fill="currentColor"/><path d="M8 10l3 2 4-3M11 12l1 5" stroke="#fff" stroke-width="1.2" fill="none" opacity=".5"/>';
ICONS.letter = '<rect x="3" y="6" width="18" height="12" rx="2" fill="currentColor"/><path d="M3.5 7l8.5 6 8.5-6" stroke="#fff" stroke-width="1.5" fill="none" opacity=".7"/>';
ICONS.fruit = '<path d="M12 7c4 0 7 3 7 7s-3 7-7 7-7-3-7-7 3-7 7-7z" fill="currentColor"/><path d="M12 7c0-2 1-4 3-4" stroke="#5a9a3a" stroke-width="2" fill="none"/>';
ICONS.music = '<path d="M9 18V6l10-2v12" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="7" cy="18" r="2.5" fill="currentColor"/><circle cx="17" cy="16" r="2.5" fill="currentColor"/>';

/* ---- new quest items ---- */
Object.assign(ITEMS, {
  n_moonflower: { name: 'ดอกจันทร์เรืองแสง', kind: 'mat', quest: true, price: 0, desc: 'ดอกไม้ที่เรืองแสงอ่อนๆ ในทุ่งหญ้าทางใต้ของเมือง', icon: 'flower' },
  n_ore: { name: 'แร่เหล็กดำ', kind: 'mat', quest: true, price: 0, desc: 'แร่หนักสีดำจากเนินหินใกล้ค่ายยักษ์น้อย', icon: 'ore' },
  n_papaya: { name: 'มะละกอป่า', kind: 'mat', quest: true, price: 0, desc: 'มะละกอดิบลูกโตจากดงไม้ทางตะวันตก', icon: 'fruit' },
  n_letter1: { name: 'จดหมายถึงนายพรานรุก', kind: 'mat', quest: true, price: 0, desc: 'จดหมายผนึกครั่งจากที่ทำการไปรษณีย์', icon: 'letter' },
  n_letter2: { name: 'พัสดุถึงพ่อมดซาวิน', kind: 'mat', quest: true, price: 0, desc: 'กล่องเล็กๆ ที่สั่นได้เอง… อย่าเปิดดูนะ', icon: 'letter' },
  n_somtam: { name: 'ส้มตำป้าแตง (กล่อง)', kind: 'mat', quest: true, price: 0, desc: 'ส้มตำรสแซ่บสำหรับทหารยามที่หน้าประตูเมือง', icon: 'fruit' }
});

/* ---- new NPCs ---- (voice: [pitch, rate], hair: hue° or keyword, pose: sheet frame) */
Object.assign(NPCS, {
  boonma: { name: 'ยายบุญมา', role: 'หมอยาสมุนไพร', sheet: 'priest', zone: 'world', x: -22, z: 60, face: 1.6, voice: [.75, .9], hair: 'white', pose: 0, lines: ['สมุนไพรดีๆ ต้องเก็บตอนน้ำค้างยังไม่แห้งนะหลาน', 'เจ็บตรงไหนบอกยายได้เลย', 'ดอกจันทร์เรืองแสงบานแค่ทุ่งหญ้าทางใต้เท่านั้นแหละ'] },
  boran: { name: 'ช่างโบรัน', role: 'ช่างตีเหล็กประจำเมือง', sheet: 'knight', zone: 'world', x: 24, z: 63, face: -1.6, voice: [.6, .95], hair: 'brown', pose: 9, lines: ['เหล็กดีต้องตีตอนร้อน!', 'อาวุธทื่อแล้วเอามาให้ข้าลับได้นะ', 'ได้ยินว่าเนินหินใกล้ค่ายยักษ์น้อยมีแร่เหล็กดำ'] },
  tonkhao: { name: 'น้องต้นข้าว', role: 'เด็กน้อยผู้ตามหาแมว', sheet: 'adventurer', zone: 'world', x: -6, z: 57, face: 0, voice: [1.55, 1.05], hair: 30, pose: 10, lines: ['ส้มจี๊ดหายไปไหนนะ…', 'ฮือๆ คิดถึงส้มจี๊ด', 'พี่เห็นแมวสีส้มบ้างไหม?'] },
  sompong: { name: 'บุรุษไปรษณีย์สมปอง', role: 'ไปรษณีย์ส่งด่วน', sheet: 'ninja', zone: 'world', x: 6, z: 82, face: 3.1, voice: [1.1, 1.25], hair: 210, pose: 13, lines: ['ส่งไว ส่งชัวร์ ส่งถึงมือ!', 'วันนี้จดหมายเยอะเหลือเกิน', 'มีใครอยากช่วยส่งของบ้างไหม?'] },
  lisa: { name: 'นักสำรวจลิซ่า', role: 'นักทำแผนที่', sheet: 'archer', zone: 'world', x: -20, z: 80, face: 1.2, voice: [1.3, 1.1], hair: 330, pose: 11, lines: ['แผนที่ทวีปนี้ยังมีที่ว่างอีกเยอะ!', 'เคยไปถึงประตูมิติทางเหนือสุดไหม?', 'สำรวจให้ทั่วแล้วกลับมาเล่าให้ฟังนะ'] },
  pipo: { name: 'นักดนตรีปีโป้', role: 'นักดนตรีเร่', sheet: 'mage', zone: 'world', x: -1, z: 71, face: 3.1, voice: [1.2, 1.15], hair: 275, pose: 10, lines: ['♪ ลา ลา ลั้น ลา ~', 'เพลงนี้แต่งให้เมืองสยาม นะ', 'เต้นด้วยกันไหม? (อีโมต: เต้น)'] },
  borg: { name: 'ทหารยามบอร์ก', role: 'ยามเฝ้าประตูเหนือ', sheet: 'knight', zone: 'world', x: 5, z: 24, face: 3.1, voice: [.7, 1], hair: 'black', pose: 0, lines: ['หยุด! อ๋อ… นักผจญภัยนี่เอง ผ่านไปได้', 'หิวจัง อยากกินส้มตำป้าแตง', 'หมาในช่วงนี้กล้าเข้ามาใกล้ประตูเมืองมาก'] },
  tang: { name: 'ป้าแตง', role: 'แม่ค้าส้มตำ', sheet: 'adventurer', zone: 'world', x: -24, z: 68, face: 1.5, voice: [1.15, 1.15], hair: 15, pose: 15, lines: ['ส้มตำจ้า ส้มตำ แซ่บๆ!', 'มะละกอหมดอีกแล้ว ทำไงดีน้า', 'เผ็ดแค่ไหนบอกป้าได้เลย'] },
  savin: { name: 'พ่อมดเฒ่าซาวิน', role: 'ผู้รอบรู้เรื่องสัตว์อสูร', sheet: 'mage', zone: 'world', x: -14, z: 88, face: .4, voice: [.65, .85], hair: 'white', pose: 11, lines: ['อืม… พลังมานาในอากาศวันนี้แปรปรวน', 'สัตว์เลี้ยงที่ผูกพันกับเจ้าของจะแข็งแกร่งขึ้น', 'ค้างคาวแม่ไก่ในถ้ำนั่น… น่าศึกษายิ่งนัก'] },
  mira: { name: 'นักวิจัยมิรา', role: 'นักพฤกษศาสตร์แห่งป่ากระซิบ', sheet: 'priest', zone: 'world', x: -18, z: -30, face: 0, voice: [1.25, 1.05], hair: 185, pose: 11, lines: ['เห็ดที่นี่เรืองแสงได้ น่าสนใจมาก!', 'ระวังหมาในนะ พวกมันล่าเป็นฝูง', 'ฉันกำลังเขียนตำราพืชพรรณแห่งป่ากระซิบ'] }
});
// voices/looks for the original NPCs too
Object.assign(NPCS.lyra, { voice: [1.05, 1.05], hair: 0, pose: 9, lines: ['ทหารทุกนายเตรียมพร้อม!', 'เมืองนี้ต้องปลอดภัย', 'นักผจญภัยหน้าใหม่ มาลงทะเบียนกับฉันได้'] });
Object.assign(NPCS.orin, { voice: [.8, .9], hair: 'white', pose: 11, lines: ['ความรู้คืออาวุธที่ไม่มีวันทื่อ', 'วันนี้อยากทดสอบปัญญาไหม?', 'อ่านหนังสือวันละนิด จิตแจ่มใส'] });
Object.assign(NPCS.pip, { voice: [1.1, 1.2], hair: 40, pose: 15, lines: ['ยาฟื้นพลังลดราคาวันนี้!', 'ของดี ราคาถูก มีที่ร้านพิปเท่านั้น', 'ก่อนออกไปผจญภัยอย่าลืมซื้อยานะ'] });
Object.assign(NPCS.mina, { voice: [1.35, 1.05], hair: 320, pose: 15, lines: ['ชุดใหม่มาแล้วจ้า!', 'ใส่หมวกแกะแล้วน่ารักมากเลยนะ', 'แฟชั่นก็สำคัญพอๆ กับอาวุธ'] });
Object.assign(NPCS.kaze, { voice: [1, 1.15], hair: 'black', pose: 13, lines: ['หอมกลิ่นซุปเห็ด…', 'นินจาก็ต้องกินให้อิ่ม', 'วันนี้จะทำเมนูอะไรดีนะ'] });
Object.assign(NPCS.rook, { voice: [.75, .95], hair: 25, pose: 11, lines: ['ป่ากระซิบไม่เคยหลับ', 'รอยเท้าหมาในสดๆ อยู่แถวนี้', 'ธนูของข้าไม่เคยพลาดเป้า'] });
Object.assign(NPCS.puifai || {}, { voice: [1.45, 1.1], hair: 350, pose: 15, lines: ['น้องหมาน้องแมวรอเจ้าของอยู่นะ!', 'อาหารสัตว์เลี้ยงมาใหม่จ้า', 'ให้อาหารตอนหิวน้องจะรักเรามากขึ้น'] });
Object.assign(NPC_IDLE, {
  boonma: 'ยายรักษาคนในเมืองนี้มาห้าสิบปีแล้ว ถ้าหลานบาดเจ็บก็มาหายายได้เสมอนะ',
  boran: 'ค้อนของข้าตีเหล็กมาแล้วนับพันเล่ม ถ้ามีวัตถุดิบดีๆ ข้าจะตีอาวุธชั้นยอดให้',
  tonkhao: 'ขอบคุณพี่มากเลยที่ช่วยตามหาส้มจี๊ด! ตอนนี้ส้มจี๊ดนอนหลับอยู่บ้านแล้ว',
  sompong: 'วันนี้ส่งของครบแล้ว ขอบใจที่ช่วยนะ! พรุ่งนี้อาจมีพัสดุใหม่',
  lisa: 'โลกนี้กว้างใหญ่กว่าที่คิดนะ ฉันจะวาดแผนที่ให้ครบทุกมุมเลย',
  pipo: '♪ ขอบใจที่มาฟังเพลงนะ ♪ ถ้าชอบก็เต้นด้วยกันได้เลย',
  borg: 'ประตูเหนือปลอดภัยดี ขอบใจที่ช่วยลาดตระเวน',
  tang: 'ส้มตำป้าแตงอร่อยที่สุดในเมือง! ใครไม่เชื่อมาลองสิ',
  savin: 'สรรพสัตว์ล้วนมีจิตวิญญาณ… ทั้งสัตว์อสูรและสัตว์เลี้ยงของเจ้า',
  mira: 'ป่ากระซิบเต็มไปด้วยพืชที่ยังไม่มีใครรู้จัก ตื่นเต้นจัง!'
});

/* ---- quests ---- */
const Q2 = {
  n_herb: { type: 'side', giver: 'boonma', title: 'ดอกจันทร์ใต้แสงเช้า', obj: [{ k: 'collect', item: 'n_moonflower', n: 6 }],
    text: 'หลานจ๋า ยาของยายใกล้หมดแล้ว ช่วยไปเก็บ "ดอกจันทร์เรืองแสง" ที่ทุ่งหญ้าทางใต้ของเมืองมาให้ยาย 6 ดอกได้ไหม? ดอกมันเรืองแสงสีฟ้า เห็นง่ายจ้ะ เดินเข้าไปใกล้แล้วกด F เพื่อเก็บนะ',
    done: 'โอ้ สวยงามจริงๆ ขอบใจมากนะหลาน นี่ยาฟื้นพลังของยาย เอาไว้ใช้ตอนเจ็บนะ', rew: { xp: 140, coin: 90, items: [['hp_l', 3]] }, take: true },
  n_herb2: { type: 'side', giver: 'boonma', req: 'n_herb', title: 'ยาหม้อสูตรลับของยาย', obj: [{ k: 'collect', item: 'm_jelly', n: 4 }, { k: 'collect', item: 'm_cap', n: 4 }],
    text: 'ยาหม้อสูตรลับต้องใช้เมือกวุ้นใบเตย 4 ชิ้นกับหมวกเห็ดอีก 4 ชิ้น ฟังดูแปลกใช่ไหมล่ะ แต่ได้ผลดีนักแล',
    done: 'เคี่ยวเสร็จแล้ว! ดื่มแล้วมานาเต็มเปี่ยม เอาไปหลายๆ ขวดเลย', rew: { xp: 180, coin: 120, items: [['mp_s', 5]] }, take: true },
  n_smith: { type: 'side', giver: 'boran', req: 'm1', title: 'เขี้ยวกับกระดูกสำหรับเตาหลอม', obj: [{ k: 'collect', item: 'm_fang', n: 5 }],
    text: 'เตาหลอมของข้าต้องใช้เขี้ยวหมาในบดผสมเหล็กถึงจะได้เหล็กที่เหนียวที่สุด หามาให้ข้า 5 ชิ้น แล้วข้าจะตีอาวุธเหล็กกล้าให้เจ้าหนึ่งเล่ม!',
    done: 'ฮ่าๆ! เหล็กชุดนี้ดีเยี่ยม รับอาวุธไปเลย คมกริบ!', rew: { xp: 220, coin: 120, items: [['w_iron', 1]] }, take: true },
  n_ore: { type: 'side', giver: 'boran', req: 'n_smith', minLv: 4, title: 'แร่เหล็กดำแห่งเนินยักษ์น้อย', obj: [{ k: 'collect', item: 'n_ore', n: 5 }],
    text: 'ข้าอยากตีเกราะชั้นยอดให้เจ้า แต่ต้องใช้ "แร่เหล็กดำ" จากเนินหินใกล้ค่ายยักษ์น้อยทางตะวันออกเฉียงเหนือ ระวังพวกยักษ์น้อยด้วยล่ะ!',
    done: 'แร่แท้! เกราะเงินจันทราเล่มนี้ข้าตีสุดฝีมือ ใส่แล้วศัตรูทำอะไรไม่ได้แน่', rew: { xp: 420, coin: 200, items: [['a_moon', 1]] }, take: true },
  n_cat: { type: 'side', giver: 'tonkhao', req: 'm1', title: 'ส้มจี๊ดหายไปไหน?', obj: [{ k: 'reach', zone: 'world', x: -62, z: -28, r: 4.5, label: 'ตามหาส้มจี๊ดในป่ากระซิบ' }],
    text: 'พี่… ส้มจี๊ดแมวของหนูวิ่งตามผีเสื้อเข้าไปในป่ากระซิบทางตะวันตกตั้งแต่เมื่อวานแล้ว ฮือๆ พี่ช่วยไปตามหาให้หนูหน่อยได้ไหม?',
    done: 'ส้มจี๊ด! ขอบคุณพี่มากๆ เลย! นี่… หนูให้ไข่แมวที่ส้มจี๊ดเพิ่งออก… เอ๊ะ แมวไม่ออกไข่นี่นา ช่างเถอะ! ไข่ใบนี้พี่เอาไปฟักเลยนะ', rew: { xp: 200, coin: 60, items: [['egg_cat', 1], ['pet_food', 5]] } },
  n_mail: { type: 'side', giver: 'sompong', req: 'm1', turnTo: 'rook', title: 'จดหมายด่วนถึงป่ากระซิบ', give: [['n_letter1', 1]], obj: [{ k: 'collect', item: 'n_letter1', n: 1 }],
    text: 'แย่แล้ว! จดหมายด่วนฉบับนี้ต้องส่งถึง "นายพรานรุก" ในป่ากระซิบวันนี้ แต่ขาฉันเคล็ด ช่วยเอาไปส่งแทนหน่อยนะ!',
    done: 'จดหมายจากบ้านเกิดข้า… ขอบใจมากนักผจญภัย นี่ค่าเหนื่อย', rew: { xp: 120, coin: 120, items: [['hp_s', 2]] }, take: true },
  n_mail2: { type: 'side', giver: 'sompong', req: 'n_mail', turnTo: 'savin', title: 'พัสดุสั่นได้', give: [['n_letter2', 1]], obj: [{ k: 'collect', item: 'n_letter2', n: 1 }],
    text: 'ฝีมือส่งของของเธอเยี่ยมมาก! มีพัสดุถึง "พ่อมดเฒ่าซาวิน" ที่บ้านทางใต้ของเมือง แต่… กล่องมันสั่นได้เองแฮะ ฉันไม่กล้าถือ ฝากด้วยนะ!',
    done: 'อ้า ไข่มังกรจำลองของข้ามาถึงแล้ว! อย่ากังวลไป มันไม่กัดหรอก… ส่วนใหญ่น่ะ รับรางวัลไปเถอะ', rew: { xp: 150, coin: 150, items: [['pet_treat', 1]] }, take: true },
  n_explore: { type: 'side', giver: 'lisa', req: 'm1', title: 'สามมุมโลกของนักทำแผนที่', obj: [
      { k: 'reach', zone: 'world', x: -92, z: 120, r: 7, label: 'สำรวจทุ่งเห็ดตะวันตกเฉียงใต้' },
      { k: 'reach', zone: 'world', x: 70, z: -80, r: 8, label: 'สำรวจค่ายยักษ์น้อย' },
      { k: 'reach', zone: 'world', x: 0, z: -128, r: 8, label: 'สำรวจประตูมิติทางเหนือสุด' }],
    text: 'ฉันกำลังวาดแผนที่แดนสยาม แต่ยังขาดข้อมูลอีกสามจุด: ทุ่งเห็ดทางตะวันตกเฉียงใต้, ค่ายยักษ์น้อยทางตะวันออกเฉียงเหนือ และประตูมิติทางเหนือสุด ไปสำรวจให้หน่อยนะ!',
    done: 'ครบทั้งสามจุด! แผนที่ของฉันสมบูรณ์แล้ว รับรองเท้าสายลมคู่นี้ไป จะได้สำรวจได้ไวขึ้น', rew: { xp: 360, coin: 200, items: [['r_wind', 1]] }, award: 'นักสำรวจแห่งสยาม' },
  n_level: { type: 'side', giver: 'lisa', req: 'n_explore', title: 'นักผจญภัยตัวจริง', obj: [{ k: 'level', n: 10 }],
    text: 'นักสำรวจที่ดีต้องแข็งแกร่งด้วย ฝึกฝนจนถึงเลเวล 10 แล้วกลับมาหาฉัน ฉันมีของขวัญพิเศษให้!', gems: 30,
    done: 'เลเวล 10 แล้ว! สุดยอดเลย นี่เพชรสำหรับนักผจญภัยตัวจริง', rew: { xp: 300, coin: 300, items: [['hp_l', 3]] } },
  n_song: { type: 'side', giver: 'pipo', title: 'เต้นรำกลางจัตุรัส', obj: [{ k: 'emote', id: 'dance', npc: 'pipo', label: 'เต้น (อีโมต 💃) ใกล้ปีโป้' }, { k: 'emote', id: 'cheer', npc: 'pipo', label: 'ส่งเสียงเฮ (อีโมต 🎉) ใกล้ปีโป้' }],
    text: '♪ เพลงใหม่ของฉันต้องมีคนเต้นด้วยถึงจะสนุก! กดปุ่มอีโมต 😊 ข้างแชทแล้วเลือก "เต้น" กับ "เฮ!" ใกล้ๆ ฉันหน่อยนะ ♪',
    done: '♪ เยี่ยมไปเลย! ทั้งจัตุรัสครึกครื้น! ♪ นี่ค่าขนมจากหมวกนักดนตรีของฉัน', rew: { xp: 90, coin: 150, items: [['pet_treat', 1]] } },
  n_patrol: { type: 'daily', giver: 'borg', req: 'm1', title: 'ลาดตระเวนประตูเหนือ', obj: [{ k: 'kill', mon: 'wolf', n: 6 }, { k: 'kill', mon: 'goblin', n: 3 }],
    text: 'ภารกิจประจำวัน: หมาในกับยักษ์น้อยเข้ามาใกล้ประตูเหนือทุกวัน ช่วยปราบหมาใน 6 ตัว และยักษ์น้อย 3 ตัว ให้ถนนปลอดภัยที',
    done: 'ขอบใจมาก! คืนนี้ข้าคงได้นอนหลับสบาย', rew: { xp: 260, coin: 160, items: [['hp_s', 2]] } },
  n_somtam: { type: 'side', giver: 'tang', title: 'มะละกอป่าสำหรับส้มตำ', obj: [{ k: 'collect', item: 'n_papaya', n: 5 }],
    text: 'ตายแล้ว มะละกอหมด! ดงไม้ทางตะวันตกนอกกำแพงเมืองมีมะละกอป่าลูกโตๆ ช่วยเก็บมาให้ป้า 5 ลูกนะจ๊ะ (เดินไปใกล้แล้วกด F)',
    done: 'ลูกโตสวยเชียว! เดี๋ยวป้าตำให้เลย', rew: { xp: 110, coin: 80, items: [['hp_s', 3]] }, take: true },
  n_somtam2: { type: 'side', giver: 'tang', req: 'n_somtam', turnTo: 'borg', title: 'ส้มตำส่งด่วนถึงประตูเหนือ', give: [['n_somtam', 1]], obj: [{ k: 'collect', item: 'n_somtam', n: 1 }],
    text: 'ส้มตำกล่องนี้ป้าตั้งใจทำให้ "ทหารยามบอร์ก" ที่ประตูเหนือ เขาบ่นอยากกินมาหลายวันแล้ว ช่วยเอาไปส่งให้หน่อยนะ',
    done: 'ส้มตำป้าแตง!? เผ็ด… แต่อร่อยมาก! ขอบใจนะ นี่ยาของกองทหาร เอาไปเลย', rew: { xp: 120, coin: 100, items: [['hp_l', 2]] }, take: true },
  n_petfriend: { type: 'side', giver: 'savin', title: 'เพื่อนคู่ใจ', obj: [{ k: 'pet', label: 'เรียกสัตว์เลี้ยงออกมา' }, { k: 'feed', n: 2, label: 'ให้อาหารสัตว์เลี้ยง' }],
    text: 'เจ้ามีสัตว์เลี้ยงหรือยัง? สัตว์ที่ผูกพันกับเจ้าของจะแข็งแกร่งขึ้นตามความสนิทสนม ไปซื้อไข่ที่ร้านปุยฝ้าย ฟักออกมา แล้วให้อาหารน้อง 2 ครั้ง ข้าจะสอนเคล็ดลับให้',
    done: 'ดูสิ น้องมีความสุขมาก เคล็ดลับคือ ป้อนตอนหิว อย่าป้อนตอนอิ่ม! รับขนมพรีเมียมนี่ไป', rew: { xp: 120, coin: 80, items: [['pet_treat', 2], ['pet_food', 5]] } },
  n_bat: { type: 'side', giver: 'savin', req: 'm2', minLv: 6, title: 'ปีกค้างคาวแม่ไก่', obj: [{ k: 'kill', mon: 'bat', n: 6 }, { k: 'kill', mon: 'skel', n: 3 }],
    text: 'ค้างคาวแม่ไก่กับทหารโครงกระดูกกรุงเก่าในถ้ำผลึกดูดพลังมานาจากผลึก ข้าต้องการศึกษามัน ปราบค้างคาว 6 ตัว กับโครงกระดูก 3 ตัว แล้วข้าจะมอบแหวนมานาให้',
    done: 'น่าทึ่ง! พลังผลึกพวกนี้… รับแหวนมานาไป มันจะช่วยเรื่องเวทมนตร์ของเจ้า', rew: { xp: 520, coin: 260, items: [['r_mana', 1]] } },
  n_shroom: { type: 'side', giver: 'mira', req: 'm1', title: 'ตำราพืชพรรณป่ากระซิบ', obj: [{ k: 'kill', mon: 'shroom', n: 8 }, { k: 'reach', zone: 'world', x: -100, z: -22, r: 8, label: 'สำรวจดงเห็ดตะวันตก' }],
    text: 'เห็ดโคนซุกซนที่ดงเห็ดตะวันตกของป่าเป็นพันธุ์ใหม่! ช่วยไปสำรวจดงเห็ดนั้นและปราบเห็ด 8 ตัว ฉันจะได้บันทึกลงตำรา',
    done: 'ข้อมูลครบแล้ว! ตำราของฉันต้องโด่งดังแน่ๆ ขอบคุณนะ', rew: { xp: 260, coin: 140, items: [['mp_s', 3], ['hp_s', 3]] } }
};
Object.assign(QUESTS, Q2);
QUEST_ORDER.push(...Object.keys(Q2));

/* ---- gather nodes ---- */
const GATHER = {
  n_moonflower: { name: 'ดอกจันทร์เรืองแสง', type: 'flower', col: [.55, .85, 1], pts: [[-18, 108], [-8, 114], [6, 110], [16, 118], [-2, 126], [24, 106], [-26, 120], [10, 130], [30, 124]] },
  n_ore: { name: 'แร่เหล็กดำ', type: 'ore', col: [.6, .6, .7], pts: [[58, -72], [64, -98], [76, -70], [92, -100], [52, -90], [80, -60], [100, -86]] },
  n_papaya: { name: 'ต้นมะละกอป่า', type: 'bush', col: [1, .7, .3], pts: [[-58, 40], [-66, 52], [-72, 36], [-84, 56], [-62, 66], [-90, 40], [-76, 62]] }
};
const Gather = {
  nodes: [], meshR: null, mesh: {},
  init() {
    this.nodes = [];
    for (const item in GATHER) for (const [x0, z0] of GATHER[item].pts) { const c = Col.resolve(x0, z0, .8); this.nodes.push({ item, x: c[0], z: c[1], zone: 'world', cd: 0, ph: Math.random() * 6 }); }
  },
  wanted(item) { const S = Save.d; if (!S) return false; for (const id in S.quests) { const s = S.quests[id]; if (s.s !== 'active') continue; for (const o of QUESTS[id].obj) if (o.k === 'collect' && o.item === item && (S.inv[item] || 0) < o.n && GATHER[item]) return true; } return false; },
  active(n) { return n.cd <= 0 && this.wanted(n.item); },
  update(dt) { for (const n of this.nodes) if (n.cd > 0) n.cd -= dt; },
  pick(n) {
    const G = GATHER[n.item]; n.cd = 25; const P = Player; P.face = Math.atan2(n.x - P.x, n.z - P.z); const rg = P.getRig(); if (!rg.busy) rg.play('pray');
    Game.addItem(n.item, 1); Audio.sfx('coin'); Particles.burst(n.x, .7, n.z, 16, G.col, 3, .6, .35, 2.5);
  },
  meshes(R) {
    if (this.meshR === R) return this.mesh; this.meshR = R; const C = hexc;
    const mk = fn => { const g = new Geo(9); g.jit = .03; fn(g); g.smoothNormals(55); return R.mesh(g); };
    this.mesh = {
      flower: mk(g => { g.cyl(0, 0, 0, .03, .04, .5, 5, C('#3a8a3a')); for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; g.ell(Math.sin(a) * .14, .55, Math.cos(a) * .14, .1, .04, .07, C('#9ad8ff'), 6, 3, 0, a); } g.sphere(0, .57, 0, .07, C('#fff6a8'), 6, 4); g.ell(.12, .2, 0, .12, .03, .05, C('#4aa04a'), 5, 3); g.ell(-.12, .3, 0, .12, .03, .05, C('#4aa04a'), 5, 3); }),
      ore: mk(g => { g.rock(0, .3, 0, .55, C('#4a4a58')); g.rock(.35, .2, .2, .3, C('#3a3a48')); for (let i = 0; i < 4; i++) g.box(Math.sin(i * 1.7) * .3, .45 + i * .06, Math.cos(i * 1.7) * .3, .1, .14, .1, C('#9aa8d8')); }),
      bush: mk(g => { g.cyl(0, 0, 0, .08, .1, 1.6, 6, C('#8a7a5a')); for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; g.cone(0, 1.6, 0, Math.sin(a), .35, Math.cos(a), .14, .7, 4, C('#4aa04a')); } for (let i = 0; i < 3; i++) { const a = i / 3 * TAU + .4; g.ell(Math.sin(a) * .16, 1.35, Math.cos(a) * .16, .11, .16, .11, C('#e8a83a'), 6, 5); } })
    };
    return this.mesh;
  },
  draw(R) {
    const P = Player; if (!Save.d) return; const M = this.meshes(R), m = M4.ident(), T = Game.time;
    for (const n of this.nodes) {
      if (n.zone !== P.zone || dist2(n.x, n.z, P.x, P.z) > 60 * 60 || !this.active(n)) continue; const G = GATHER[n.item];
      M4.compose(m, n.x, 0, n.z, 0, n.ph, 0, 1, 1 + Math.sin(T * 2 + n.ph) * .03, 1); R.drawMesh(M[G.type], m, null, G.type === 'flower' ? [.25, .4, .5] : RIG_FILL, 0); R.drawOutline(M[G.type], m, .02);
      if (Math.random() < .25) Particles.add(n.x + rand(-.4, .4), rand(.3, 1.2), n.z + rand(-.4, .4), { c: G.col, s: .25, life: .9, vy: .6 });
    }
  },
  near(r = 2.6) { const P = Player; let b = null, bd = r * r; for (const n of this.nodes) { if (n.zone !== P.zone || !this.active(n)) continue; const d = dist2(n.x, n.z, P.x, P.z); if (d < bd) { bd = d; b = n; } } return b; }
};

/* ---- quest objective extensions ---- */
{
  const op = Quests.progress.bind(Quests);
  Quests.progress = function (id) {
    const q = QUESTS[id], s = this.st(id), S = Save.d; if (!s) return [];
    if (!q.obj.some(o => ['reach', 'emote', 'pet', 'feed', 'level'].includes(o.k))) return op(id);
    const base = op(id);
    return q.obj.map((o, i) => {
      if (o.k === 'reach') return { have: s.k['r' + i] ? 1 : 0, n: 1, label: o.label };
      if (o.k === 'emote') return { have: s.k['e_' + o.id] ? 1 : 0, n: 1, label: o.label };
      if (o.k === 'pet') return { have: (typeof Pets !== 'undefined' && Pets.cur()) || s.k.pet ? 1 : 0, n: 1, label: o.label };
      if (o.k === 'feed') return { have: Math.min(o.n, s.k.feed || 0), n: o.n, label: o.label };
      if (o.k === 'level') return { have: Math.min(o.n, S.level), n: o.n, label: 'ฝึกฝนจนถึงเลเวล ' + o.n };
      return base[i];
    });
  };
  const oacc = Quests.accept.bind(Quests);
  Quests.accept = function (id) { oacc(id); const q = QUESTS[id]; if (q.give) for (const [it, n] of q.give) if (!(Save.d.inv[it] > 0)) Game.addItem(it, n, true); if (q.give) UI.toast('ได้รับ ' + q.give.map(([i]) => ITEMS[i].name).join(', '), 'item'); };
  const mark = (fn) => { const S = Save.d; let any = false; for (const id in S.quests) { const s = S.quests[id]; if (s.s !== 'active') continue; QUESTS[id].obj.forEach((o, i) => { if (fn(o, i, s)) any = true; }); } if (any) Quests.onItem(); };
  Quests.tickReach = function () { const P = Player; mark((o, i, s) => { if (o.k === 'reach' && !s.k['r' + i] && P.zone === o.zone && dist2(o.x, o.z, P.x, P.z) < o.r * o.r) { s.k['r' + i] = 1; UI.toast('สำรวจแล้ว: ' + o.label, 'quest'); Audio.sfx('quest'); return true; } }); };
  const oem = Net.emote.bind(Net);
  Net.emote = function (id) { oem(id); const P = Player; mark((o, i, s) => { if (o.k !== 'emote' || o.id !== id || s.k['e_' + id]) return; const n = NPCList.find(x => x.id === o.npc); if (n && dist2(n.x, n.z, P.x, P.z) < 9 * 9) { s.k['e_' + id] = 1; n.waveT = 1.6; NpcTalk.bubble(n.id, ['♪ เยี่ยมมาก!', 'สุดยอด!', 'เต้นเก่งจัง!'][randi(0, 2)]); return true; } }); };
  if (typeof Pets !== 'undefined') { const ofd = Pets.feed.bind(Pets); Pets.feed = function (item) { const ok = ofd(item); if (ok) mark((o, i, s) => { if (o.k === 'feed') { s.k.feed = (s.k.feed || 0) + 1; return true; } if (o.k === 'pet') { s.k.pet = 1; } }); return ok; }; const osm = Pets.summon.bind(Pets); Pets.summon = function (k) { osm(k); mark((o, i, s) => { if (o.k === 'pet' && !s.k.pet) { s.k.pet = 1; return true; } }); }; }
  const ogx = Game.gainXP.bind(Game); Game.gainXP = function (n) { const lv = Save.d.level; ogx(n); if (Save.d.level !== lv) Quests.onItem(); };
  // navigation for the new objective kinds
  const ogq = Nav.goQuest.bind(Nav);
  Nav.goQuest = function (id) {
    const q = QUESTS[id]; if (!Quests.active(id) || Quests.complete(id)) return ogq(id);
    const pr = Quests.progress(id), k = pr.findIndex(o => o.have < o.n), o = q.obj[k]; if (!o) return ogq(id);
    if (o.k === 'reach') return this.go({ zone: o.zone, x: o.x, z: o.z, r: Math.max(2, o.r - 1.5), label: o.label, arrive: () => Quests.tickReach() });
    if (o.k === 'collect' && GATHER[o.item]) { const P = Player; let b = null, bd = 1e9; for (const n of Gather.nodes) if (n.item === o.item && n.cd <= 0) { const d = dist2(n.x, n.z, P.x, P.z); if (d < bd) { bd = d; b = n; } } if (b) return this.go({ zone: b.zone, x: b.x + 1.4, z: b.z, r: 1.6, label: 'เก็บ' + GATHER[o.item].name, arrive: () => UI.toast('กด F เพื่อเก็บ' + GATHER[o.item].name, 'info') }); }
    if (o.k === 'emote') { const n = NPCList.find(x => x.id === o.npc); return this.go({ zone: n.zone, x: n.x, z: n.z + 2.5, r: 2.2, label: 'ไปหา ' + n.name, arrive: () => UI.toast('กดปุ่มอีโมต 😊 แล้วเลือกท่าที่ภารกิจบอก', 'info') }); }
    if (o.k === 'pet' || o.k === 'feed') { if (Pets.cur()) { UI.openPanel('pets'); return true; } const n = NPCList.find(x => x.id === 'puifai'); return this.go({ zone: n.zone, x: n.x, z: n.z + 2, r: 2, label: 'ไปร้านสัตว์เลี้ยง', arrive: () => UI.dialog(n) }); }
    if (o.k === 'level') { UI.toast('ล่ามอนสเตอร์และทำเควสเพื่อเก็บ EXP', 'info'); return false; }
    return ogq(id);
  };
  // interaction: gather nodes join the F / prompt system
  const oni = Game.nearestInteract.bind(Game);
  Game.nearestInteract = function () { const b = oni(); if (b && b.kind === 'npc') return b; const n = Gather.near(); if (n) return { kind: 'gather', ref: n, label: 'เก็บ' + GATHER[n.item].name }; return b; };
  const oit = Game.interact.bind(Game); Game.interact = function (T) { if (T.kind === 'gather') { Player.moveTo = null; Gather.pick(T.ref); return; } return oit(T); };
  const oup = Game.update.bind(Game);
  Game.update = function (dt) { oup(dt); if (!this.started || this.paused || !Save.d) return; Gather.update(dt); this._reachT = (this._reachT || 0) + dt; if (this._reachT > .4) { this._reachT = 0; Quests.tickReach(); } NpcTalk.update(dt); };
  const omd = Monsters.draw; Monsters.draw = function (R, t) { omd.call(this, R, t); if (Game.started) { try { Gather.draw(R); NpcTalk.drawLostCat(R); } catch (e) { console.error(e); } } };
  const owb = World.build.bind(World); World.build = function (R) { owb(R); Gather.init(); };
}

/* ---- big NPC illustrations (cut-in portraits) ---- */
const NpcArt = {
  cache: {},
  hairRGB: { white: [.93, .93, .9], black: [.16, .15, .2], brown: [.42, .26, .14] },
  frame(img, f) { const c = document.createElement('canvas'); c.width = 224; c.height = 320; c.getContext('2d').drawImage(img, (f % 8) * 224, Math.floor(f / 8) * 320, 224, 320, 0, 0, 224, 320); return c; },
  get(id) {
    if (this.cache[id]) return this.cache[id]; const n = NPCS[id]; if (!n) return '';
    const img = Game.images && Game.images[n.sheet]; if (!img) return (UI.bodies && UI.bodies[n.sheet]) || '';
    const c = this.frame(img, n.pose || 0), x = c.getContext('2d');
    if (n.hair !== undefined) {
      try {
        const im = x.getImageData(0, 0, 224, 320), d = im.data; const kw = typeof n.hair === 'string' ? this.hairRGB[n.hair] : null;
        for (let i = 0; i < d.length; i += 4) {
          if (d[i + 3] < 20) continue; const r = d[i] / 255, g = d[i + 1] / 255, b = d[i + 2] / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, s = mx === mn ? 0 : (mx - mn) / (1 - Math.abs(2 * l - 1));
          let h = 0; if (mx !== mn) { if (mx === r) h = ((g - b) / (mx - mn)) % 6; else if (mx === g) h = (b - r) / (mx - mn) + 2; else h = (r - g) / (mx - mn) + 4; h *= 60; if (h < 0) h += 360; }
          if (h < 52 || h > 165 || s < .14 || (h < 70 && g < r * .95)) continue; // the green hair of the base sheet
          let rr, gg, bb;
          if (kw) { const t = l * 1.25; rr = kw[0] * t; gg = kw[1] * t; bb = kw[2] * t; if (n.hair === 'white') { rr = gg = bb = .55 + l * .5; } }
          else { const H = n.hair / 60, C2 = (1 - Math.abs(2 * l - 1)) * Math.min(1, s * 1.05), X = C2 * (1 - Math.abs(H % 2 - 1)), m0 = l - C2 / 2; const k = Math.floor(H) % 6; [rr, gg, bb] = [[C2, X, 0], [X, C2, 0], [0, C2, X], [0, X, C2], [X, 0, C2], [C2, 0, X]][k]; rr += m0; gg += m0; bb += m0; }
          d[i] = clamp(rr, 0, 1) * 255; d[i + 1] = clamp(gg, 0, 1) * 255; d[i + 2] = clamp(bb, 0, 1) * 255;
        }
        x.putImageData(im, 0, 0);
      } catch (e) { }
    }
    return this.cache[id] = c.toDataURL('image/png');
  }
};

/* ---- NPC voices ---- */
const NpcVoice = {
  th: null, ready: false, blipT: null,
  on() { return Settings.d.sound && Settings.d.npcVoice !== 0; },
  voice() { if (!('speechSynthesis' in window)) return null; if (!this.th) { const vs = speechSynthesis.getVoices(); this.th = vs.find(v => /^th/i.test(v.lang)) || null; } return this.th; },
  clean(t) { return String(t).replace(/<[^>]+>/g, '').replace(/[♪★「」()（）]/g, ' ').replace(/\s+/g, ' ').trim(); },
  speak(id, text) {
    this.stop(); if (!this.on()) return; const n = NPCS[id] || {}, [p, r] = n.voice || [1, 1]; const t = this.clean(text); if (!t) return;
    const v = this.voice();
    if (v) { try { const u = new SpeechSynthesisUtterance(t.slice(0, 220)); u.voice = v; u.lang = v.lang; u.pitch = clamp(p, .1, 2); u.rate = clamp(r * 1.05, .5, 1.6); u.volume = .95; speechSynthesis.speak(u); return; } catch (e) { } }
    this.blips(p, t.length);
  },
  // Animal-Crossing-style talk blips when no Thai voice is installed
  blips(p, len) {
    const A = Audio; if (!A.ctx) return; const c = A.ctx; let t = c.currentTime + .02; const n = Math.min(26, Math.ceil(len / 3)), f0 = 260 * p + 120;
    for (let i = 0; i < n; i++) { const o = c.createOscillator(), g = c.createGain(); o.type = 'triangle'; o.frequency.value = f0 * (1 + Math.sin(i * 2.3) * .18 + (Math.random() - .5) * .1); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.08, t + .012); g.gain.exponentialRampToValueAtTime(.001, t + .07); o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + .08); t += .075 + Math.random() * .03; }
  },
  stop() { try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch (e) { } }
};
if ('speechSynthesis' in window) { try { speechSynthesis.onvoiceschanged = () => { NpcVoice.th = null; }; } catch (e) { } }

/* ---- idle chatter bubbles + lost cat ---- */
const NpcTalk = {
  bubs: {}, t: 4,
  bubble(id, text, dur = 4.5) { this.bubs[id] = { text, until: Game.time + dur }; },
  update(dt) {
    this.t -= dt; if (this.t > 0) return; this.t = 5 + Math.random() * 6; const P = Player;
    const near = NPCList.filter(n => n.zone === P.zone && NPCS[n.id] && NPCS[n.id].lines && dist2(n.x, n.z, P.x, P.z) < 22 * 22 && !(this.bubs[n.id] && this.bubs[n.id].until > Game.time));
    if (!near.length || WM.isOpen('dialog')) return; const n = near[randi(0, near.length - 1)], L = NPCS[n.id].lines; this.bubble(n.id, L[randi(0, L.length - 1)]);
  },
  catSpot() { const S = Save.d; return S && S.quests.n_cat && S.quests.n_cat.s === 'active'; },
  drawLostCat(R) { if (!this.catSpot() || Player.zone !== 'world' || typeof drawPet === 'undefined') return; const o = QUESTS.n_cat.obj[0]; if (dist2(o.x, o.z, Player.x, Player.z) > 50 * 50) return; Sprites.capture(R, o.x, .5, o.z, 1.4, 1.5, () => drawPet(R, 'cat', o.x, 0, o.z, Game.time * .3, { t: Game.time, amp: 0, ph: 0 })); }
};
{
  const onp = UI.netPlates.bind(UI);
  UI.netPlates = function (want) {
    onp(want); const T = Game.time;
    for (const w of want) { if (w.key[0] !== 'n' || w.key === 'npc') continue; const id = w.key.slice(1), b = NpcTalk.bubs[id]; if (!b || b.until < T) continue; const h0 = w.html; w.html = () => `<span class="mbub">${esc(b.text)}</span>` + h0(); }
    if (NpcTalk.catSpot() && Player.zone === 'world') { const o = QUESTS.n_cat.obj[0]; want.push({ key: 'lostcat', x: o.x, y: 1.4, fy: 0, z: o.z, cls: 'pet', html: () => `<span class="mbub">เมี้ยว~</span><span class="nm petn">ส้มจี๊ด</span>` }); }
  };
}

/* ---- MMO-style dialog: big cut-in, typewriter, voice ---- */
{
  const od = UI.pDialog.bind(UI);
  UI.pDialog = function (o) {
    od(o); const n = NPCS[o.npc]; if (!n) return; this.el.ptitle.innerHTML = `${icon('book')} สนทนา`; const b = this.el.pbody, box = b.querySelector('.dlg'); if (!box) return;
    box.classList.add('dlg2'); const img = box.querySelector('img'); const art = NpcArt.get(o.npc); if (img && art) img.src = art;
    const p = box.querySelector('p'); const full = p ? p.innerHTML : '';
    if (p) {
      box.querySelector('div').insertAdjacentHTML('afterbegin', `<div class="dlgname"><b>${esc(n.name)}</b><small>${esc(n.role)}</small><button class="dlgvox" title="ฟังเสียงพูดอีกครั้ง" aria-label="ฟังเสียง">🔊</button></div>`);
      const plain = p.textContent; p.textContent = ''; p.classList.add('tw'); let i = 0; clearInterval(this._twI);
      const step = () => { i += 2; if (i >= plain.length) { p.innerHTML = full; clearInterval(this._twI); return; } p.textContent = plain.slice(0, i); };
      this._twI = setInterval(step, 22); p.onclick = () => { clearInterval(this._twI); p.innerHTML = full; };
      box.querySelector('.dlgvox').onclick = e => { e.stopPropagation(); NpcVoice.speak(o.npc, plain); };
      if (this._lastSpoken !== o.npc + '|' + plain) { this._lastSpoken = o.npc + '|' + plain; NpcVoice.speak(o.npc, plain); }
    }
    NpcCut.show(o.npc);
  };
  const oc = WM.close.bind(WM); WM.close = function (kind) { if (kind === 'dialog') { NpcVoice.stop(); NpcCut.hide(); UI._lastSpoken = null; clearInterval(UI._twI); } return oc(kind); };
}
const NpcCut = {
  el: null,
  show(id) {
    if (!this.el) { this.el = document.createElement('div'); this.el.id = 'npccut'; document.getElementById('app').appendChild(this.el); }
    const src = NpcArt.get(id); if (!src) return; if (this.el.dataset.id !== id) { this.el.innerHTML = `<img src="${src}" alt="">`; this.el.dataset.id = id; this.el.classList.remove('in'); void this.el.offsetWidth; }
    this.el.hidden = false; this.el.classList.add('in');
  },
  hide() { if (this.el) { this.el.classList.remove('in'); this.el.dataset.id = ''; this.el.hidden = true; } }
};
{
  // prompt label for gather nodes
  const os = UI.pSettings.bind(UI);
  UI.pSettings = function () {
    os(); const b = this.el.pbody, fs = document.createElement('fieldset');
    fs.innerHTML = `<legend>เสียงพูด NPC</legend><label class="chk"><input type="checkbox" id="npcvox" ${Settings.d.npcVoice !== 0 ? 'checked' : ''}> NPC พูดออกเสียงตอนคุย (ใช้เสียงภาษาไทยของเครื่อง ถ้าไม่มีจะเป็นเสียงจิ๊บๆ แทน)</label>`;
    const ref = b.querySelector('.row'); b.insertBefore(fs, ref || null);
    fs.querySelector('#npcvox').onchange = e => { Settings.d.npcVoice = e.target.checked ? 1 : 0; Settings.save(); if (!e.target.checked) NpcVoice.stop(); };
  };
}
