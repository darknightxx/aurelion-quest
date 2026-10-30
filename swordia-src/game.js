
const RARITY = {
  Common:   { color:'#9aa6b2', bg:'rgba(154,166,178,.12)' },
  Uncommon: { color:'#6ec98a', bg:'rgba(110,201,138,.12)' },
  Rare:     { color:'#5fa8e8', bg:'rgba(95,168,232,.12)' },
  Epic:     { color:'#b07ae8', bg:'rgba(176,122,232,.12)' },
  Legendary:{ color:'#f2c14e', bg:'rgba(242,193,78,.14)' },
  Mythic:   { color:'#f0604e', bg:'rgba(240,96,78,.14)' },
};

const ITEMS = {
  potion_hp: { name:'ยาเลือดเล็ก', glyph:'藥', type:'potion', rarity:'Common', heal:70, price:30, stack:99, desc:'ฟื้นพลังชีวิต 70' },
  potion_mp: { name:'ยาพลังเล็ก', glyph:'氣', type:'potion', rarity:'Common', mana:50, price:35, stack:99, desc:'ฟื้นพลังภายใน 50' },
  sword_bamboo:{ name:'กระบี่ไม้ไผ่', glyph:'竹', type:'equip', slot:'weapon', rarity:'Common', stats:{atk:8}, price:60, desc:'ATK +8' },
  sword_steel:{ name:'กระบี่เหล็กกล้า', glyph:'劍', type:'equip', slot:'weapon', rarity:'Uncommon', stats:{atk:22,agi:2}, price:240, desc:'ATK +22 · AGI +2' },
  sword_cloud:{ name:'กระบี่เมฆา', glyph:'雲', type:'equip', slot:'weapon', rarity:'Rare', stats:{atk:48,agi:8,crit:5}, price:900, desc:'ATK +48 · AGI +8 · คริ +5%' },
  robe_cotton:{ name:'เสื้อผ้าฝ้าย', glyph:'衣', type:'equip', slot:'body', rarity:'Common', stats:{def:5,hp:20}, price:70, desc:'DEF +5 · HP +20' },
  armor_leather:{ name:'เกราะหนังหมาป่า', glyph:'甲', type:'equip', slot:'body', rarity:'Uncommon', stats:{def:14,hp:60,vit:2}, price:320, desc:'DEF +14 · HP +60' },
  boots_cloud:{ name:'รองเท้าย่างเมฆ', glyph:'靴', type:'equip', slot:'boots', rarity:'Uncommon', stats:{spd:22,agi:3}, price:280, desc:'ความเร็ว +22 · AGI +3' },
  band_jade: { name:'กำไลหยก', glyph:'鐲', type:'equip', slot:'bracelet', rarity:'Rare', stats:{mp:40,int:4}, price:420, desc:'MP +40 · INT +4' },
  hat_straw: { name:'หมวกสานยอดเขา', glyph:'笠', type:'equip', slot:'head', rarity:'Common', stats:{def:4}, price:50, desc:'DEF +4' },
  mat_jade:  { name:'หยกดิบ', glyph:'玉', type:'material', rarity:'Uncommon', price:45, stack:99, desc:'วัตถุดิบตีอาวุธ' },
  mat_pelt:  { name:'หนังหมาป่า', glyph:'皮', type:'material', rarity:'Common', price:18, stack:99, desc:'วัตถุดิบเครื่องหนัง' },
  mat_shroom:{ name:'เห็ดวิญญาณแห้ง', glyph:'菇', type:'material', rarity:'Common', price:14, stack:99, desc:'ใช้ปรุงยา' },
  book_light:{ name:'คัมภีร์วิชาตัวเบา', glyph:'書', type:'book', codex:'light', rarity:'Rare', price:500, desc:'เรียนรู้วิชาตัวเบา' },
  book_bell: { name:'คัมภีร์เกราะระฆังทอง', glyph:'書', type:'book', codex:'bell', rarity:'Epic', price:800, desc:'เรียนรู้เกราะระฆังทอง' },
  book_flame:{ name:'คัมภีร์ฝ่ามือเพลิง', glyph:'書', type:'book', codex:'flame', rarity:'Epic', price:900, desc:'เรียนรู้ฝ่ามือเพลิง' },
};

const CODEX = [
  { id:'light', name:'วิชาตัวเบา', glyph:'輕', tier:'ชั้นดี', desc:'ย่างก้าวเบาดั่งขนนก · ความเร็วเคลื่อนที่ +18%', bonus:{spdPct:18} },
  { id:'bell',  name:'เกราะระฆังทอง', glyph:'鐘', tier:'หายาก', desc:'ลมปราณห่อหุ้มกาย · ป้องกัน +12 และ HP สูงสุด +80', bonus:{def:12,hp:80} },
  { id:'flame', name:'ฝ่ามือเพลิง', glyph:'炎', tier:'หายาก', desc:'ลมปราณร้อนแรง · ความเสียหาย +12%', bonus:{dmgPct:12} },
  { id:'cloud', name:'วิชากระบี่เมฆา', glyph:'雲', tier:'ลับ', desc:'กระบี่ไร้รูป · คริติคอล +8% และ ATK +15', bonus:{crit:8,atk:15} },
  { id:'poison',name:'วิชาพิษ', glyph:'毒', tier:'สามัญ', desc:'พิษกัดกร่อน · ความเสียหาย +6%', bonus:{dmgPct:6} },
  { id:'flower',name:'เพลงกระบี่บุปผา', glyph:'花', tier:'ตำนาน', desc:'กระบี่ร่ายดั่งบุปผาบาน · ความเสียหาย +25%', bonus:{dmgPct:25} },
];

const SKILLS = [
  { id:'moon',   name:'ฟันจันทร์เสี้ยว', glyph:'月', key:'1', mp:8,  cd:2.5, req:1, kind:'arc',  range:96, mult:1.9, desc:'ฟาดกระบี่เป็นเสี้ยวจันทร์ใส่ศัตรูด้านหน้า' },
  { id:'wind',   name:'กระบี่สายลม', glyph:'風', key:'2', mp:10, cd:5,   req:3, kind:'dash', range:190, mult:1.3, desc:'พุ่งทะยานไปข้างหน้า ทำความเสียหายระหว่างทาง' },
  { id:'shadow', name:'เงากระบี่', glyph:'影', key:'3', mp:14, cd:7,   req:5, kind:'multi',range:110, mult:0.8, hits:3, desc:'แทงสามครั้งรวดเร็วใส่เป้าหมายเดียว' },
  { id:'flower', name:'เพลงกระบี่บุปผา', glyph:'花', key:'4', mp:22, cd:11, req:7, kind:'aoe', range:130, mult:2.3, desc:'กระบี่หมุนรอบตัว ฟาดศัตรูรอบด้าน' },
  { id:'myriad', name:'หมื่นกระบี่', glyph:'萬', key:'5', mp:38, cd:24, req:9, kind:'aoe', range:180, mult:4.2, desc:'อัญเชิญกระบี่หมื่นเล่มถล่มพื้นที่กว้าง' },
];

const MONSTERS = {
  rabbit: { name:'กระต่ายใบไม้', lv:1, hp:60,  atk:8,  def:2,  spd:52, exp:16, gold:[3,9],   r:13, color:'#e8e2d2', aggro:150, arange:26, rspd:1.6, drops:[['potion_hp',.22],['mat_shroom',.18],['sword_bamboo',.05],['hat_straw',.04]] },
  fowl:   { name:'ไก่ป่า',      lv:2, hp:85,  atk:12, def:3,  spd:66, exp:24, gold:[5,12],  r:14, color:'#d59a56', aggro:180, arange:28, rspd:1.3, drops:[['potion_hp',.2],['mat_pelt',.2],['robe_cotton',.05]] },
  boarlet:{ name:'หมูป่าเด็ก',   lv:4, hp:150, atk:19, def:7,  spd:58, exp:44, gold:[9,20],  r:17, color:'#9a7460', aggro:200, arange:30, rspd:1.5, drops:[['potion_hp',.24],['mat_pelt',.28],['sword_steel',.05],['boots_cloud',.04],['book_light',.02]] },
  shroom: { name:'เห็ดวิญญาณ',  lv:6, hp:220, atk:26, def:12, spd:34, exp:70, gold:[14,28], r:16, color:'#9a86c4', aggro:160, arange:30, rspd:2.0, drops:[['potion_mp',.3],['mat_shroom',.35],['mat_jade',.16],['band_jade',.04],['book_flame',.02]] },
  wolf:   { name:'หมาป่าป่าไผ่', lv:8, hp:300, atk:36, def:15, spd:88, exp:105,gold:[20,38], r:18, color:'#7d8b98', aggro:260, arange:32, rspd:1.1, drops:[['potion_hp',.3],['mat_pelt',.45],['mat_jade',.2],['armor_leather',.07],['book_bell',.03]] },
  boar:   { name:'ราชาหมูป่า',  lv:10,hp:1400,atk:58, def:24, spd:62, exp:600,gold:[180,320],r:34,color:'#7a4f3e', aggro:340, arange:48, rspd:1.6, boss:true, drops:[['sword_cloud',1],['potion_hp',1],['mat_jade',1]] },
};

const QUESTS = [
  { id:'q1', name:'ปราบกระต่ายใบไม้', desc:'ทุ่งสายลมมีกระต่ายใบไม้ชุกชุม กำจัดเสีย 5 ตัวเพื่อฝึกมือ', type:'kill', target:'rabbit', need:5, main:true, reward:{exp:140, gold:80, item:'potion_hp', n:3}, rewardText:'140 EXP · 80 Zeny · ยาเลือด 3' },
  { id:'q2', name:'หยกจากป่าลึก',   desc:'ช่างตีเหล็กต้องการหยกดิบ 3 ก้อนจากป่าหยก', type:'collect', target:'mat_jade', need:3, main:false, reward:{exp:300, gold:200, item:'sword_steel', n:1}, rewardText:'300 EXP · 200 Zeny · กระบี่เหล็กกล้า' },
  { id:'q3', name:'ราชาหมูป่า',     desc:'ราชาหมูป่าคุกคามป่าหยก จงปราบมันให้สิ้น', type:'kill', target:'boar', need:1, main:true, reward:{exp:900, gold:600, item:'book_bell', n:1}, rewardText:'900 EXP · 600 Zeny · คัมภีร์เกราะระฆังทอง' },
];

const EXP_TABLE = [0,100,260,500,840,1300,1900,2700,3700,5000,999999];

const MAPS = {
  village: {
    name:'หมู่บ้านสายหมอก', w:1500, h:1100, ground:'#3f5237', safe:true,
    paths:[[220,430,1060,110],[620,120,120,880]],
    water:[[80,840,340,190]],
    props:'village',
    colliders:[[240,250,180,130],[520,240,190,140],[980,280,200,150],[300,660,200,140],[980,700,210,150]],
    npcs:[
      { id:'elder', name:'ผู้เฒ่าหลิน', glyph:'翁', x:660, y:360, role:'quest' },
      { id:'herb',  name:'แม่ฮวา ร้านยา', glyph:'藥', x:430, y:560, role:'shop', shop:['potion_hp','potion_mp','hat_straw','robe_cotton'] },
      { id:'smith', name:'เถียนกัง ช่างตีเหล็ก', glyph:'鍛', x:900, y:560, role:'shop', shop:['sword_bamboo','sword_steel','boots_cloud','armor_leather'] },
    ],
    spawns:[], portals:[{ x:1420, y:520, w:70, h:200, to:'wind', tx:110, ty:620, label:'ทุ่งสายลม' }],
    start:{ x:660, y:520 },
  },
  wind: {
    name:'ทุ่งสายลม', w:1800, h:1300, ground:'#4b5f36',
    paths:[[60,580,1700,90]], water:[[1150,180,420,170]], props:'field',
    colliders:[], npcs:[],
    spawns:[ {type:'rabbit', n:6, area:[180,180,1400,900]}, {type:'fowl', n:4, area:[500,140,1100,950]}, {type:'boarlet', n:3, area:[900,600,800,600]} ],
    portals:[{ x:0, y:520, w:60, h:220, to:'village', tx:1360, ty:620, label:'หมู่บ้านสายหมอก' },
             { x:860, y:0, w:220, h:60, to:'jade', tx:960, ty:1160, label:'ป่าหยก' }],
    start:{ x:200, y:620 },
  },
  jade: {
    name:'ป่าหมอกหยก', w:1900, h:1300, ground:'#35502f',
    paths:[[900,80,110,1150]], water:[[200,240,340,220]], props:'bamboo',
    colliders:[], npcs:[],
    spawns:[ {type:'shroom', n:5, area:[200,200,1500,900]}, {type:'wolf', n:5, area:[300,150,1400,1000]}, {type:'boar', n:1, area:[820,180,200,160]} ],
    portals:[{ x:860, y:1240, w:220, h:60, to:'wind', tx:960, ty:110, label:'ทุ่งสายลม' }],
    start:{ x:960, y:1160 },
  },
};

const PARTY = [
  { name:'บัวลี่', lv:27, glyph:'蓮', avatar:'radial-gradient(circle at 50% 30%, #6d4a5c, #241a22)' },
  { name:'หลงฟาง', lv:26, glyph:'霜', avatar:'radial-gradient(circle at 50% 30%, #4a5a6d, #1a2028)' },
  { name:'เสี่ยวเม่ย', lv:28, glyph:'梅', avatar:'radial-gradient(circle at 50% 30%, #6d5a4a, #241f1a)' },
];

function rngSeeded(seed) { let s = seed; return () => (s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296; }

class Component extends DCLogic {
  state = { tick:0, started:false, panel:null, shop:null, dialogue:null, levelUp:0, loot:null, touch:false, auto:false, chatTab:'ทั้งหมด', questTab:'เควสหลัก', zoom:1 };

  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.miniRef = React.createRef();
    this.stickRef = React.createRef();
    this.knobRef = React.createRef();
    this.keys = {};
    this.stick = { x:0, y:0, active:false };
    this.g = this.newGame();
  }

  newGame() {
    return {
      map:'village', cam:{x:0,y:0},
      p:{ x:660, y:520, vx:0, vy:0, face:1, hp:200, mp:100, r:14, atkT:0, anim:0, dashT:0, hitFx:0, dead:false, deadT:0 },
      level:1, exp:0, gold:120, statPoints:5, skillPoints:1,
      stats:{ STR:5, AGI:5, VIT:5, INT:5, DEX:5, LUK:5 },
      skillLv:{ moon:1, wind:0, shadow:0, flower:0, myriad:0 },
      cds:{}, codex:{}, kills:{},
      inv:[ {id:'potion_hp',n:5}, {id:'potion_mp',n:3}, {id:'sword_bamboo',n:1} ],
      equip:{ weapon:null, head:null, body:null, boots:null, necklace:null, ring:null, bracelet:null, accessory:null },
      quests:{}, mobs:[], drops:[], floats:[], fx:[], log:[], moveTo:null, target:null,
    };
  }

  componentDidMount() {
    this.onKeyDown = (e) => {
      const k = e.key.toLowerCase();
      if ([' ','w','a','s','d','1','2','3','4','5','i','k','q','c','b','e','f','escape'].includes(k)) e.preventDefault();
      if (this.keys[k]) return;
      this.keys[k] = true;
      if (!this.state.started) return;
      if (k === 'escape') this.setState({ panel:null, shop:null, dialogue:null });
      else if (k === 'i') this.togglePanel('inventory');
      else if (k === 'c') this.togglePanel('character');
      else if (k === 'k') this.togglePanel('skills');
      else if (k === 'b') this.togglePanel('codex');
      else if (k === 'q') this.togglePanel('quests');
      else if (k === 'f') this.toggleAuto();
      else if (k === 'e') this.interact();
      else if (k === ' ') this.basicAttack();
      else if ('12345'.includes(k)) this.useSkill(SKILLS[+k - 1].id);
    };
    this.onKeyUp = (e) => { this.keys[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);

    const cv = this.canvasRef.current;
    if (cv) {
      cv.addEventListener('pointerdown', (e) => this.onWorldClick(e));
      this.resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        cv.width = cv.clientWidth * dpr; cv.height = cv.clientHeight * dpr;
        this.dpr = dpr;
      };
      this.resize(); window.addEventListener('resize', this.resize);
    }
    if (window.matchMedia('(pointer: coarse)').matches) this.setState({ touch:true });
    this.setupStick();

    this.last = performance.now();
    this.raf = requestAnimationFrame(this.loop);
    this.hudTimer = setInterval(() => { if (this.state.started) this.setState(s => ({ tick:s.tick + 1 })); }, 80);
    this.push('ยินดีต้อนรับสู่ยุทธจักร กด E เพื่อพูดคุยกับ NPC', '#f2c14e');
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.raf); clearInterval(this.hudTimer);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    if (this.resize) window.removeEventListener('resize', this.resize);
  }

  setupStick() {
    setTimeout(() => {
      const base = this.stickRef.current, knob = this.knobRef.current;
      if (!base || !knob || base.__wired) return;
      base.__wired = true;
      const set = (e) => {
        const r = base.getBoundingClientRect();
        let dx = e.clientX - (r.left + r.width/2), dy = e.clientY - (r.top + r.height/2);
        const d = Math.hypot(dx,dy) || 1, m = Math.min(d, 44);
        dx = dx/d*m; dy = dy/d*m;
        knob.style.transform = `translate(${dx}px,${dy}px)`;
        this.stick = { x:dx/44, y:dy/44, active:true };
      };
      base.addEventListener('pointerdown', (e)=>{ base.setPointerCapture(e.pointerId); set(e); });
      base.addEventListener('pointermove', (e)=>{ if (this.stick.active) set(e); });
      const end = () => { this.stick = {x:0,y:0,active:false}; knob.style.transform='translate(0,0)'; };
      base.addEventListener('pointerup', end); base.addEventListener('pointercancel', end);
    }, 400);
  }

  derived() {
    const g = this.g, st = { ...g.stats };
    let atk = 10, def = 2, hpMax = 160, mpMax = 80, spd = 148, crit = 3, aspd = 1, dmgPct = 0;
    for (const s of Object.keys(g.equip)) {
      const id = g.equip[s]; if (!id) continue;
      const e = ITEMS[id].stats || {};
      atk += e.atk||0; def += e.def||0; hpMax += e.hp||0; mpMax += e.mp||0; spd += e.spd||0; crit += e.crit||0;
      for (const k of ['str','agi','vit','int','dex','luk']) if (e[k]) st[k.toUpperCase()] += e[k];
    }
    for (const c of CODEX) {
      if (!g.codex[c.id]) continue; const b = c.bonus;
      atk += b.atk||0; def += b.def||0; hpMax += b.hp||0; crit += b.crit||0; dmgPct += b.dmgPct||0;
      if (b.spdPct) spd *= 1 + b.spdPct/100;
    }
    atk += st.STR * 2.4; def += st.VIT * 0.9; hpMax += st.VIT * 22 + (g.level-1) * 40;
    mpMax += st.INT * 12 + (g.level-1) * 14; crit += st.LUK * 0.6; aspd = 1 + st.AGI * 0.03;
    spd += st.AGI * 1.6;
    return { atk, def, hpMax, mpMax, spd, crit, aspd, dmgPct, st };
  }

  mapDef() { return MAPS[this.g.map]; }

  enterMap(id, tx, ty) {
    const g = this.g; g.map = id; g.p.x = tx; g.p.y = ty; g.moveTo = null; g.target = null;
    g.mobs = []; g.drops = []; g.floats = [];
    const m = MAPS[id]; const rnd = rngSeeded(id.length * 7919 + 13);
    for (const sp of (m.spawns || [])) {
      for (let i = 0; i < Math.round(sp.n * (this.props.monsterDensity ?? 1)); i++) {
        const [ax,ay,aw,ah] = sp.area;
        g.mobs.push(this.makeMob(sp.type, ax + rnd()*aw, ay + rnd()*ah));
      }
    }
    this.push('เข้าสู่ ' + m.name, '#5fd0e8');
    this.setState({ tick:this.state.tick+1 });
  }

  makeMob(type, x, y) {
    const d = MONSTERS[type];
    return { type, x, y, hx:x, hy:y, hp:d.hp, max:d.hp, state:'idle', t:Math.random()*2, atkT:0, hurt:0, dead:false, respawn:0, tx:x, ty:y, r:d.r };
  }

  push(text, color) {
    const g = this.g; g.log.unshift({ text, color: color || '#dfe7ef', id: Math.random() });
    if (g.log.length > 9) g.log.pop();
  }

  toggleAuto() {
    const on = !this.state.auto;
    this.setState({ auto:on });
    this.push(on ? 'เปิดโหมด AUTO' : 'ปิดโหมด AUTO', '#5fd0e8');
  }

  loop = (now) => {
    const dt = Math.min((now - this.last) / 1000, 0.05); this.last = now;
    if (this.state.started) this.update(dt);
    this.draw();
    this.raf = requestAnimationFrame(this.loop);
  };

  blocked(x, y, r) {
    const m = this.mapDef();
    if (x < r || y < r || x > m.w - r || y > m.h - r) return true;
    for (const c of (m.colliders||[])) if (x > c[0]-r && x < c[0]+c[2]+r && y > c[1]-r && y < c[1]+c[3]+r) return true;
    for (const w of (m.water||[])) if (x > w[0]-r && x < w[0]+w[2]+r && y > w[1]-r && y < w[1]+w[3]+r) return true;
    return false;
  }

  update(dt) {
    const g = this.g, p = g.p, D = this.derived();
    if (p.hp > D.hpMax) p.hp = D.hpMax;
    if (p.mp > D.mpMax) p.mp = D.mpMax;
    p.mp = Math.min(D.mpMax, p.mp + dt * (2 + D.st.INT * 0.25));
    if (this.mapDef().safe) p.hp = Math.min(D.hpMax, p.hp + dt * D.hpMax * 0.12);
    for (const k in g.cds) g.cds[k] = Math.max(0, g.cds[k] - dt);
    p.atkT = Math.max(0, p.atkT - dt);
    p.hitFx = Math.max(0, p.hitFx - dt);

    if (this.state.auto && !p.dead) this.autoStep();

    let dx = 0, dy = 0;
    if (this.keys['w']) dy -= 1; if (this.keys['s']) dy += 1;
    if (this.keys['a']) dx -= 1; if (this.keys['d']) dx += 1;
    if (this.stick.active) { dx += this.stick.x; dy += this.stick.y; }
    if (dx || dy) g.moveTo = null;
    else if (g.moveTo) {
      const ddx = g.moveTo.x - p.x, ddy = g.moveTo.y - p.y, d = Math.hypot(ddx, ddy);
      if (d < 6) g.moveTo = null; else { dx = ddx/d; dy = ddy/d; }
    }
    const mag = Math.hypot(dx, dy);
    if (mag > 0.05) {
      dx /= mag; dy /= mag;
      const sp = D.spd * (p.dashT > 0 ? 3.4 : 1);
      const nx = p.x + dx * sp * dt, ny = p.y + dy * sp * dt;
      if (!this.blocked(nx, p.y, p.r)) p.x = nx;
      if (!this.blocked(p.x, ny, p.r)) p.y = ny;
      if (dx) p.face = dx > 0 ? 1 : -1;
      p.anim += dt * 9;
    } else p.anim = 0;
    p.dashT = Math.max(0, p.dashT - dt);

    for (const pt of (this.mapDef().portals||[])) {
      if (p.x > pt.x - 10 && p.x < pt.x + pt.w + 10 && p.y > pt.y - 10 && p.y < pt.y + pt.h + 10) { this.enterMap(pt.to, pt.tx, pt.ty); return; }
    }

    for (const m of g.mobs) {
      const d = MONSTERS[m.type];
      m.hurt = Math.max(0, m.hurt - dt);
      if (m.dead) { m.respawn -= dt; if (m.respawn <= 0) { m.dead = false; m.hp = d.hp; m.x = m.hx; m.y = m.hy; m.state = 'idle'; } continue; }
      const pd = Math.hypot(p.x - m.x, p.y - m.y);
      m.atkT = Math.max(0, m.atkT - dt); m.t -= dt;
      if (!p.dead && pd < d.aggro) m.state = 'chase';
      else if (m.state === 'chase') m.state = 'return';
      if (m.state === 'idle' && m.t <= 0) { m.state = 'wander'; m.tx = m.hx + (Math.random()-.5)*220; m.ty = m.hy + (Math.random()-.5)*220; m.t = 2 + Math.random()*3; }
      let tgt = null, spd = d.spd;
      if (m.state === 'chase') { tgt = { x:p.x, y:p.y }; if (pd < d.arange) { tgt = null; if (m.atkT <= 0) { m.atkT = d.rspd; this.mobHit(m); } } }
      else if (m.state === 'wander') { tgt = { x:m.tx, y:m.ty }; spd *= .45; if (Math.hypot(m.tx-m.x, m.ty-m.y) < 8) { m.state='idle'; m.t = 1 + Math.random()*2; } }
      else if (m.state === 'return') { tgt = { x:m.hx, y:m.hy }; if (Math.hypot(m.hx-m.x, m.hy-m.y) < 10) { m.state='idle'; m.hp = Math.min(d.hp, m.hp + d.hp*0.5); } }
      if (tgt) {
        const ddx = tgt.x - m.x, ddy = tgt.y - m.y, dd = Math.hypot(ddx,ddy) || 1;
        const nx = m.x + ddx/dd*spd*dt, ny = m.y + ddy/dd*spd*dt;
        if (!this.blocked(nx, m.y, m.r)) m.x = nx;
        if (!this.blocked(m.x, ny, m.r)) m.y = ny;
      }
    }

    for (const f of g.floats) { f.y -= 40*dt; f.t -= dt; }
    g.floats = g.floats.filter(f => f.t > 0);
    for (const f of g.fx) f.t -= dt;
    g.fx = g.fx.filter(f => f.t > 0);
    for (const dr of g.drops) {
      dr.t += dt;
      if (Math.hypot(p.x-dr.x, p.y-dr.y) < 36 && (this.props.autoPickup ?? true)) this.pickup(dr);
    }
    g.drops = g.drops.filter(d => !d.taken);

    if (p.dead) { p.deadT -= dt; if (p.deadT <= 0) this.revive(); }
  }

  autoStep() {
    const g = this.g, p = g.p, D = this.derived();
    if (p.hp < D.hpMax * 0.35) { const i = g.inv.findIndex(x => x.id === 'potion_hp'); if (i >= 0) this.useItem(i); }
    const m = this.nearestMob(560);
    if (!m) { g.moveTo = null; return; }
    const d = Math.hypot(p.x - m.x, p.y - m.y);
    if (d > 52) g.moveTo = { x:m.x, y:m.y };
    else {
      g.moveTo = null;
      p.face = m.x >= p.x ? 1 : -1;
      for (const sk of SKILLS) if (g.skillLv[sk.id] && (g.cds[sk.id]||0) <= 0 && p.mp >= sk.mp) { this.useSkill(sk.id); return; }
      this.basicAttack();
    }
  }

  mobHit(m) {
    const g = this.g, p = g.p, D = this.derived(), d = MONSTERS[m.type];
    if (p.dead) return;
    if (Math.random() < Math.min(0.3, D.st.AGI * 0.008)) { this.float(p.x, p.y - 26, 'Miss', '#e4e9ef', false, true); return; }
    const dmg = Math.max(1, Math.round((d.atk * (0.9 + Math.random()*0.2)) * (1 - Math.min(0.6, D.def / (D.def + 90)))));
    p.hp -= dmg; p.hitFx = 0.22;
    if (this.props.damageNumbers ?? true) this.float(p.x, p.y - 26, '-' + dmg, '#f0604e');
    if (p.hp <= 0) { p.hp = 0; p.dead = true; p.deadT = 2.6; this.push('คุณพ่ายแพ้... ฟื้นตัวที่จุดเกิด', '#f0604e'); }
  }

  revive() {
    const g = this.g, D = this.derived();
    g.p.dead = false; g.p.hp = D.hpMax * 0.5; g.p.mp = D.mpMax * 0.4;
    const s = MAPS[g.map].start; g.p.x = s.x; g.p.y = s.y;
  }

  float(x, y, text, color, big, miss) { this.g.floats.push({ x, y, text, color, t:1.0, big, miss }); }

  nearestMob(range, x, y) {
    const g = this.g; let best = null, bd = range;
    for (const m of g.mobs) { if (m.dead) continue; const d = Math.hypot((x??g.p.x)-m.x, (y??g.p.y)-m.y) - m.r; if (d < bd) { bd = d; best = m; } }
    return best;
  }

  basicAttack() {
    const g = this.g, p = g.p, D = this.derived();
    if (p.dead || p.atkT > 0) return;
    p.atkT = 0.62 / D.aspd;
    g.fx.push({ kind:'slash', x:p.x + p.face*22, y:p.y, t:0.18, r:44, face:p.face });
    const m = this.nearestMob(58);
    if (m) this.damage(m, D.atk, false);
  }

  useSkill(id) {
    const g = this.g, p = g.p, D = this.derived();
    const s = SKILLS.find(x => x.id === id); if (!s || p.dead) return;
    if (!g.skillLv[id]) { this.push('ยังไม่ได้เรียน ' + s.name + ' (กด K)', '#d8b878'); return; }
    if ((g.cds[id]||0) > 0) return;
    if (p.mp < s.mp) { this.push('พลังภายในไม่พอ', '#5fa8e8'); return; }
    p.mp -= s.mp; g.cds[id] = s.cd;
    const dmg = D.atk * s.mult * (1 + (g.skillLv[id]-1) * 0.28);
    if (s.kind === 'dash') {
      p.dashT = 0.22;
      g.fx.push({ kind:'ring', x:p.x, y:p.y, t:0.3, r:s.range*0.4, color:'#9fd8ff' });
      for (const m of g.mobs) if (!m.dead && Math.hypot(p.x-m.x, p.y-m.y) < 90) this.damage(m, dmg, true);
    } else if (s.kind === 'multi') {
      const m = this.nearestMob(s.range);
      if (m) for (let i = 0; i < s.hits; i++) setTimeout(() => { if (!m.dead) this.damage(m, dmg, true); }, i * 130);
      g.fx.push({ kind:'slash', x:p.x + p.face*26, y:p.y, t:0.3, r:52, face:p.face });
    } else {
      const r = s.range;
      g.fx.push({ kind:'ring', x:p.x, y:p.y, t:0.38, r, color: s.id==='myriad' ? '#f2c14e' : '#8fe0c0' });
      for (const m of g.mobs) {
        if (m.dead) continue;
        const d = Math.hypot(p.x-m.x, p.y-m.y);
        if (d > r) continue;
        if (s.kind === 'arc' && Math.sign(m.x - p.x) !== p.face && d > 40) continue;
        this.damage(m, dmg, true);
      }
    }
  }

  damage(m, base, isSkill) {
    const g = this.g, D = this.derived(), d = MONSTERS[m.type];
    if (Math.random() > Math.min(0.98, 0.82 + D.st.DEX * 0.012)) { this.float(m.x, m.y - m.r - 8, 'Miss', '#e4e9ef', false, true); return; }
    const crit = Math.random() * 100 < D.crit;
    let dmg = base * (0.92 + Math.random()*0.16) * (1 + D.dmgPct/100);
    if (crit) dmg *= 1.9;
    dmg = Math.max(1, Math.round(dmg - d.def * 0.8));
    m.hp -= dmg; m.hurt = 0.18; m.state = 'chase';
    if (this.props.damageNumbers ?? true) this.float(m.x + (Math.random()-.5)*14, m.y - m.r - 12, String(dmg), crit ? '#ffd76a' : '#f7a93b', crit);
    if (m.hp <= 0) this.kill(m);
  }

  kill(m) {
    const g = this.g, d = MONSTERS[m.type];
    m.dead = true; m.hp = 0; m.respawn = d.boss ? 60 : 9;
    g.kills[m.type] = (g.kills[m.type]||0) + 1;
    const gold = Math.round(d.gold[0] + Math.random()*(d.gold[1]-d.gold[0]));
    g.gold += gold;
    this.gainExp(d.exp);
    g.fx.push({ kind:'ring', x:m.x, y:m.y, t:0.4, r:m.r*2, color:'#f2c14e' });
    for (const [id, chance] of d.drops) if (Math.random() < chance) g.drops.push({ id, x:m.x + (Math.random()-.5)*46, y:m.y + (Math.random()-.5)*34, t:0, taken:false });
    this.push('ได้รับ  Zeny x ' + gold, '#f2c14e');
    this.push('ได้รับ  EXP x ' + d.exp, '#7fe07a');
    this.checkQuests();
  }

  gainExp(n) {
    const g = this.g; g.exp += n;
    while (g.level < 10 && g.exp >= EXP_TABLE[g.level]) {
      g.exp -= EXP_TABLE[g.level]; g.level++;
      g.statPoints += 5; g.skillPoints += 1;
      const D = this.derived(); g.p.hp = D.hpMax; g.p.mp = D.mpMax;
      this.push('เลื่อนขั้นเป็น Lv.' + g.level, '#f2c14e');
      this.setState({ levelUp: Date.now() });
      clearTimeout(this._lu); this._lu = setTimeout(() => this.setState({ levelUp:0 }), 2200);
    }
  }

  pickup(dr) {
    const it = ITEMS[dr.id];
    dr.taken = true;
    this.addItem(dr.id, 1);
    this.setState({ loot:{ id:dr.id, at:Date.now() } });
    clearTimeout(this._loot); this._loot = setTimeout(() => this.setState({ loot:null }), 1800);
    this.push('ได้รับ  ' + it.name + ' x 1', RARITY[it.rarity].color);
    this.checkQuests();
  }

  addItem(id, n) {
    const g = this.g, it = ITEMS[id];
    if (it.stack) { const s = g.inv.find(x => x.id === id); if (s) { s.n += n; return; } }
    for (let i = 0; i < n; i++) { if (g.inv.length >= 24) { this.push('กระเป๋าเต็ม', '#f0604e'); return; } g.inv.push({ id, n:1 }); }
  }

  countItem(id) { return this.g.inv.filter(x => x.id === id).reduce((a,b) => a + b.n, 0); }

  removeItem(id, n) {
    const g = this.g; let left = n;
    for (let i = g.inv.length - 1; i >= 0 && left > 0; i--) {
      if (g.inv[i].id !== id) continue;
      const take = Math.min(left, g.inv[i].n); g.inv[i].n -= take; left -= take;
      if (g.inv[i].n <= 0) g.inv.splice(i, 1);
    }
  }

  useItem(idx) {
    const g = this.g, slot = g.inv[idx]; if (!slot) return;
    const it = ITEMS[slot.id], D = this.derived();
    if (it.type === 'potion') {
      if (it.heal) { g.p.hp = Math.min(D.hpMax, g.p.hp + it.heal); this.float(g.p.x, g.p.y - 30, '+' + it.heal, '#7fe07a'); }
      if (it.mana) { g.p.mp = Math.min(D.mpMax, g.p.mp + it.mana); this.float(g.p.x, g.p.y - 30, '+' + it.mana, '#5fa8e8'); }
      this.removeItem(slot.id, 1);
    } else if (it.type === 'equip') {
      const prev = g.equip[it.slot];
      g.equip[it.slot] = slot.id; this.removeItem(slot.id, 1);
      if (prev) this.addItem(prev, 1);
      this.push('สวมใส่ ' + it.name, RARITY[it.rarity].color);
    } else if (it.type === 'book') {
      if (g.codex[it.codex]) { this.push('เรียนรู้คัมภีร์นี้แล้ว', '#d8b878'); return; }
      g.codex[it.codex] = true; this.removeItem(slot.id, 1);
      this.push('สำเร็จวิชา ' + CODEX.find(x => x.id === it.codex).name, '#f2c14e');
    } else this.push(it.name + ' — ' + it.desc, '#8b97a5');
    this.setState({ tick:this.state.tick + 1 });
  }

  unequip(slot) {
    const g = this.g; if (!g.equip[slot]) return;
    this.addItem(g.equip[slot], 1); g.equip[slot] = null;
    this.setState({ tick:this.state.tick + 1 });
  }

  interact() {
    const g = this.g, m = this.mapDef();
    let near = null, bd = 90;
    for (const n of (m.npcs||[])) { const d = Math.hypot(g.p.x-n.x, g.p.y-n.y); if (d < bd) { bd = d; near = n; } }
    if (!near) { const dr = g.drops.find(d => Math.hypot(g.p.x-d.x, g.p.y-d.y) < 50); if (dr) this.pickup(dr); return; }
    if (near.role === 'shop') this.setState({ shop:near.id });
    else this.setState({ dialogue:near.id });
  }

  acceptQuest(id) {
    const g = this.g; if (g.quests[id]) return;
    g.quests[id] = { state:'active', n:0 };
    this.push('รับเควส ' + QUESTS.find(x => x.id === id).name, '#f2c14e');
    this.setState({ dialogue:null });
  }

  checkQuests() {
    const g = this.g;
    for (const q of QUESTS) {
      const st = g.quests[q.id]; if (!st || st.state !== 'active') continue;
      st.n = q.type === 'kill' ? (g.kills[q.target]||0) : this.countItem(q.target);
      if (st.n >= q.need) { st.state = 'ready'; this.push('เควสพร้อมส่ง: ' + q.name, '#f2c14e'); }
    }
  }

  turnIn(id) {
    const g = this.g, q = QUESTS.find(x => x.id === id), st = g.quests[id];
    if (!st || st.state !== 'ready') return;
    if (q.type === 'collect') this.removeItem(q.target, q.need);
    st.state = 'done';
    g.gold += q.reward.gold; this.gainExp(q.reward.exp);
    if (q.reward.item) this.addItem(q.reward.item, q.reward.n || 1);
    this.push('สำเร็จเควส ' + q.name, '#f2c14e');
    this.setState({ dialogue:null });
  }

  buy(id) {
    const g = this.g, it = ITEMS[id];
    if (g.gold < it.price) { this.push('Zeny ไม่พอ', '#f0604e'); return; }
    g.gold -= it.price; this.addItem(id, 1);
    this.push('ซื้อ ' + it.name, '#6ec98a');
    this.checkQuests();
    this.setState({ tick:this.state.tick + 1 });
  }

  togglePanel(p) { this.setState(s => ({ panel: s.panel === p ? null : p, shop:null, dialogue:null })); }

  onWorldClick(e) {
    if (!this.state.started || this.state.panel || this.state.shop) return;
    const cv = this.canvasRef.current, r = cv.getBoundingClientRect(), g = this.g;
    const wx = e.clientX - r.left + g.cam.x, wy = e.clientY - r.top + g.cam.y;
    const m = this.nearestMob(46, wx, wy);
    if (m) { g.target = m; g.moveTo = { x:m.x - Math.sign(m.x-g.p.x)*30, y:m.y }; this.basicAttack(); return; }
    const npc = (this.mapDef().npcs||[]).find(n => Math.hypot(n.x-wx, n.y-wy) < 40);
    if (npc) { g.moveTo = { x:npc.x, y:npc.y + 40 }; if (Math.hypot(g.p.x-npc.x, g.p.y-npc.y) < 120) this.interact(); return; }
    const dr = g.drops.find(d => Math.hypot(d.x-wx, d.y-wy) < 30);
    if (dr) { g.moveTo = { x:dr.x, y:dr.y }; return; }
    g.moveTo = { x:wx, y:wy };
  }

  draw() {
    const cv = this.canvasRef.current; if (!cv) return;
    const ctx = cv.getContext('2d'), dpr = this.dpr || 1;
    const W = cv.width / dpr, H = cv.height / dpr;
    ctx.save(); ctx.scale(dpr, dpr); ctx.clearRect(0,0,W,H);
    const g = this.g, m = this.mapDef();
    g.cam.x = Math.max(0, Math.min(m.w - W, g.p.x - W/2));
    g.cam.y = Math.max(0, Math.min(m.h - H, g.p.y - H/2));
    if (m.w < W) g.cam.x = (m.w - W) / 2;
    if (m.h < H) g.cam.y = (m.h - H) / 2;
    ctx.translate(-g.cam.x, -g.cam.y);

    ctx.fillStyle = m.ground; ctx.fillRect(0, 0, m.w, m.h);
    const rnd = rngSeeded(m.w + m.h);
    ctx.globalAlpha = .08; ctx.fillStyle = '#000';
    for (let i = 0; i < 300; i++) ctx.fillRect(rnd()*m.w, rnd()*m.h, 28, 9);
    ctx.globalAlpha = 1;

    for (const p of (m.paths||[])) { ctx.fillStyle = '#8b7c5b'; ctx.fillRect(p[0],p[1],p[2],p[3]); ctx.globalAlpha=.3; ctx.fillStyle='#5f5339'; ctx.fillRect(p[0],p[1],p[2],4); ctx.globalAlpha=1; }
    for (const w of (m.water||[])) {
      const grd = ctx.createLinearGradient(w[0],w[1],w[0],w[1]+w[3]);
      grd.addColorStop(0,'#3f7f97'); grd.addColorStop(1,'#245a75');
      ctx.fillStyle = grd; ctx.fillRect(w[0],w[1],w[2],w[3]);
      ctx.strokeStyle = 'rgba(255,255,255,.2)'; ctx.lineWidth = 2;
      const t = performance.now()/900;
      for (let i = 1; i < 5; i++) { ctx.beginPath(); const y = w[1] + w[3]*i/5 + Math.sin(t+i)*3; ctx.moveTo(w[0]+10,y); ctx.lineTo(w[0]+w[2]-10,y); ctx.stroke(); }
    }

    for (const pt of (m.portals||[])) {
      ctx.fillStyle = 'rgba(95,208,232,.16)'; ctx.fillRect(pt.x, pt.y, pt.w, pt.h);
      ctx.strokeStyle = '#5fd0e8'; ctx.setLineDash([8,6]); ctx.lineWidth = 2; ctx.strokeRect(pt.x, pt.y, pt.w, pt.h); ctx.setLineDash([]);
      ctx.fillStyle = '#e9eef4'; ctx.font = "600 14px 'IBM Plex Sans Thai', sans-serif"; ctx.textAlign = 'center';
      ctx.fillText('→ ' + pt.label, pt.x + pt.w/2, pt.y - 8);
    }

    this.drawProps(ctx, m);
    for (const c of (m.colliders||[])) this.drawBuilding(ctx, c);

    for (const d of g.drops) this.drawDrop(ctx, d);
    for (const n of (m.npcs||[])) this.drawNpc(ctx, n);
    const order = [...g.mobs.filter(x => !x.dead), { isPlayer:true, y:g.p.y }].sort((a,b) => a.y - b.y);
    for (const o of order) o.isPlayer ? this.drawPlayer(ctx) : this.drawMob(ctx, o);

    for (const f of g.fx) {
      if (f.kind === 'ring') {
        const k = 1 - f.t / 0.4;
        ctx.strokeStyle = f.color; ctx.globalAlpha = Math.max(0, f.t*2.4); ctx.lineWidth = 4;
        ctx.beginPath(); ctx.ellipse(f.x, f.y, f.r*k, f.r*k*0.6, 0, 0, 7); ctx.stroke(); ctx.globalAlpha = 1;
      } else if (f.kind === 'slash') {
        ctx.strokeStyle = '#dff2ff'; ctx.globalAlpha = Math.max(0, f.t*5); ctx.lineWidth = 6; ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, f.face > 0 ? -0.9 : 2.2, f.face > 0 ? 0.9 : 4.1); ctx.stroke(); ctx.globalAlpha = 1;
      }
    }

    ctx.textAlign = 'center';
    for (const f of g.floats) {
      ctx.globalAlpha = Math.min(1, f.t * 1.6);
      if (f.miss) {
        ctx.font = "italic 700 22px 'IBM Plex Sans Thai', sans-serif";
        ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(10,14,18,.9)'; ctx.strokeText(f.text, f.x, f.y);
        ctx.fillStyle = f.color; ctx.fillText(f.text, f.x, f.y);
      } else {
        ctx.font = (f.big ? "800 34px " : "800 26px ") + "'IBM Plex Sans Thai', sans-serif";
        ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(10,14,18,.92)'; ctx.strokeText(f.text, f.x, f.y);
        const grd = ctx.createLinearGradient(f.x, f.y - 22, f.x, f.y + 4);
        grd.addColorStop(0, '#ffe9a8'); grd.addColorStop(1, f.color);
        ctx.fillStyle = grd; ctx.fillText(f.text, f.x, f.y);
      }
      ctx.globalAlpha = 1;
    }

    ctx.restore();

    if (g.p.dead) {
      ctx.save(); ctx.scale(dpr,dpr);
      ctx.fillStyle = 'rgba(80,12,8,.35)'; ctx.fillRect(0,0,W,H);
      ctx.fillStyle = '#f5e7c8'; ctx.textAlign = 'center';
      ctx.font = "800 32px 'Noto Serif Thai', serif"; ctx.fillText('พ่ายแพ้', W/2, H/2);
      ctx.restore();
    }
    this.drawMini();
  }

  drawDrop(ctx, d) {
    const it = ITEMS[d.id], rc = RARITY[it.rarity];
    const bob = Math.sin(d.t*4)*3;
    if (it.rarity !== 'Common' && it.rarity !== 'Uncommon') {
      const bg = ctx.createLinearGradient(d.x, d.y-130, d.x, d.y);
      bg.addColorStop(0,'rgba(0,0,0,0)'); bg.addColorStop(1, rc.color);
      ctx.globalAlpha = .32; ctx.fillStyle = bg; ctx.fillRect(d.x-10, d.y-130, 20, 130); ctx.globalAlpha = 1;
    }
    ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.beginPath(); ctx.ellipse(d.x, d.y+8, 11, 5, 0, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(28,36,46,.95)'; ctx.strokeStyle = rc.color; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(d.x-11, d.y-11+bob, 22, 22, 5); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#e9eef4'; ctx.font = "14px 'Noto Serif SC', serif"; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(it.glyph, d.x, d.y+1+bob); ctx.textBaseline = 'alphabetic';
    const label = it.name + ' x 1';
    ctx.font = "600 12px 'IBM Plex Sans Thai', sans-serif";
    const w = ctx.measureText(label).width + 20;
    ctx.fillStyle = 'rgba(12,16,22,.88)'; ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(d.x - w/2, d.y - 42 + bob, w, 21, 5); ctx.fill(); ctx.stroke();
    ctx.fillStyle = rc.color; ctx.fillText(it.glyph, d.x - w/2 + 9, d.y - 27 + bob);
    ctx.fillStyle = '#e9eef4'; ctx.fillText(label, d.x + 6, d.y - 27 + bob);
  }

  drawBuilding(ctx, c) {
    const [x,y,w,h] = c;
    ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(x+8, y+h-6, w, 14);
    ctx.fillStyle = '#b9a67f'; ctx.fillRect(x, y+24, w, h-24);
    ctx.fillStyle = '#6b4526'; ctx.fillRect(x-12, y, w+24, 30);
    ctx.fillStyle = '#4d2f16'; ctx.fillRect(x-12, y+26, w+24, 6);
    ctx.fillStyle = '#54432a'; ctx.fillRect(x + w/2 - 16, y + h - 40, 32, 40);
    ctx.fillStyle = '#b33c2c'; ctx.fillRect(x + 14, y + 44, 22, 26); ctx.fillRect(x + w - 36, y + 44, 22, 26);
  }

  drawProps(ctx, m) {
    const rnd = rngSeeded(m.w * 31 + 7);
    const kind = m.props, n = kind === 'village' ? 26 : 70;
    for (let i = 0; i < n; i++) {
      const x = rnd() * m.w, y = rnd() * m.h;
      if (this.blocked(x, y, 30)) continue;
      ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(x, y+4, 16, 6, 0, 0, 7); ctx.fill();
      if (kind === 'bamboo') {
        ctx.fillStyle = '#5e7f3f'; ctx.fillRect(x-3, y-70, 6, 70);
        ctx.fillStyle = '#7ba055';
        for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.ellipse(x + (k-1)*13, y-66+k*9, 14, 5, (k-1)*0.5, 0, 7); ctx.fill(); }
      } else if (kind === 'field') {
        ctx.fillStyle = '#5c4d31'; ctx.fillRect(x-4, y-28, 8, 28);
        ctx.fillStyle = '#456d37'; ctx.beginPath(); ctx.ellipse(x, y-40, 26, 20, 0, 0, 7); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,.07)'; ctx.beginPath(); ctx.ellipse(x-8, y-46, 12, 8, 0, 0, 7); ctx.fill();
      } else {
        ctx.fillStyle = '#6b4526'; ctx.fillRect(x-3, y-46, 6, 46);
        ctx.fillStyle = '#b33c2c'; ctx.beginPath(); ctx.ellipse(x, y-52, 11, 13, 0, 0, 7); ctx.fill();
        ctx.fillStyle = '#f2c14e'; ctx.beginPath(); ctx.ellipse(x, y-52, 5, 6, 0, 0, 7); ctx.fill();
      }
    }
  }

  drawNpc(ctx, n) {
    ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.beginPath(); ctx.ellipse(n.x, n.y+14, 15, 6, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#cfc7b2'; ctx.beginPath(); ctx.roundRect(n.x-13, n.y-12, 26, 28, 7); ctx.fill();
    ctx.fillStyle = '#f0dcc0'; ctx.beginPath(); ctx.arc(n.x, n.y-22, 13, 0, 7); ctx.fill();
    ctx.fillStyle = '#2b1d12'; ctx.beginPath(); ctx.arc(n.x-5, n.y-24, 2, 0, 7); ctx.arc(n.x+5, n.y-24, 2, 0, 7); ctx.fill();
    ctx.fillStyle = '#2b1d12'; ctx.font = "16px 'Noto Serif SC', serif"; ctx.textAlign = 'center'; ctx.fillText(n.glyph, n.x, n.y+8);
    ctx.font = "600 12px 'IBM Plex Sans Thai', sans-serif"; ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(10,14,18,.85)';
    ctx.strokeText(n.name, n.x, n.y-42); ctx.fillStyle = '#f2c14e'; ctx.fillText(n.name, n.x, n.y-42);
    ctx.globalAlpha = 0.5 + 0.5*Math.sin(performance.now()/350);
    ctx.fillStyle = '#f2c14e'; ctx.font = "800 16px 'IBM Plex Sans Thai', sans-serif"; ctx.fillText('!', n.x, n.y-58); ctx.globalAlpha = 1;
  }

  drawPlayer(ctx) {
    const p = this.g.p, bob = Math.abs(Math.sin(p.anim)) * 3;
    ctx.fillStyle = 'rgba(0,0,0,.32)'; ctx.beginPath(); ctx.ellipse(p.x, p.y+14, 15, 6, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#a8322b'; ctx.beginPath(); ctx.moveTo(p.x-10, p.y-12-bob); ctx.lineTo(p.x-18-p.face*4, p.y+10-bob); ctx.lineTo(p.x+6, p.y+8-bob); ctx.fill();
    ctx.fillStyle = p.hitFx > 0 ? '#f0b0a8' : '#e9e2d0';
    ctx.beginPath(); ctx.roundRect(p.x-12, p.y-12-bob, 24, 26, 7); ctx.fill();
    ctx.fillStyle = '#2f5f88'; ctx.fillRect(p.x-12, p.y-2-bob, 24, 6);
    ctx.fillStyle = '#f0dcc0'; ctx.beginPath(); ctx.arc(p.x, p.y-24-bob, 13, 0, 7); ctx.fill();
    ctx.fillStyle = '#26201a'; ctx.beginPath(); ctx.arc(p.x, p.y-27-bob, 13, Math.PI, 0); ctx.fill(); ctx.fillRect(p.x-13, p.y-30-bob, 26, 5);
    ctx.fillStyle = '#26201a'; ctx.beginPath(); ctx.arc(p.x-5*p.face, p.y-23-bob, 2, 0, 7); ctx.arc(p.x+5*p.face, p.y-23-bob, 2, 0, 7); ctx.fill();
    ctx.save(); ctx.translate(p.x + p.face*15, p.y-6-bob); ctx.rotate(p.face * (p.atkT > 0 ? -0.9 : -0.35));
    ctx.fillStyle = '#d5dde5'; ctx.fillRect(-2, -30, 4, 32);
    ctx.fillStyle = '#6b4526'; ctx.fillRect(-4, 0, 8, 7); ctx.restore();
  }

  drawMob(ctx, m) {
    const d = MONSTERS[m.type];
    const hop = d.spd > 60 ? Math.abs(Math.sin(performance.now()/160 + m.x)) * 3 : 0;
    ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.beginPath(); ctx.ellipse(m.x, m.y + m.r*0.8, m.r*0.9, m.r*0.35, 0, 0, 7); ctx.fill();
    ctx.fillStyle = m.hurt > 0 ? '#ffd9d2' : d.color;
    ctx.beginPath(); ctx.ellipse(m.x, m.y - hop, m.r, m.r*0.92, 0, 0, 7); ctx.fill();
    if (m.type === 'rabbit') { ctx.beginPath(); ctx.ellipse(m.x-5, m.y-m.r-6-hop, 3.5, 9, -.2, 0, 7); ctx.ellipse(m.x+5, m.y-m.r-6-hop, 3.5, 9, .2, 0, 7); ctx.fill(); ctx.fillStyle='#8fb46a'; ctx.beginPath(); ctx.ellipse(m.x+m.r*0.6, m.y-m.r*0.6-hop, 7, 4, .5, 0, 7); ctx.fill(); }
    if (m.type === 'fowl') { ctx.fillStyle = '#c8502f'; ctx.beginPath(); ctx.ellipse(m.x, m.y-m.r-3-hop, 5, 5, 0, 0, 7); ctx.fill(); }
    if (m.type === 'shroom') { ctx.fillStyle = '#b3a0dd'; ctx.beginPath(); ctx.ellipse(m.x, m.y-m.r*0.7-hop, m.r*1.25, m.r*0.7, 0, Math.PI, 0); ctx.fill(); }
    if (d.boss) { ctx.fillStyle = '#e8dcc0'; ctx.beginPath(); ctx.moveTo(m.x-m.r*0.7, m.y-hop); ctx.lineTo(m.x-m.r*1.1, m.y-m.r*0.8-hop); ctx.lineTo(m.x-m.r*0.4, m.y-m.r*0.3-hop); ctx.fill(); ctx.beginPath(); ctx.moveTo(m.x+m.r*0.7, m.y-hop); ctx.lineTo(m.x+m.r*1.1, m.y-m.r*0.8-hop); ctx.lineTo(m.x+m.r*0.4, m.y-m.r*0.3-hop); ctx.fill(); }
    ctx.fillStyle = '#26201a'; ctx.beginPath(); ctx.arc(m.x-m.r*0.35, m.y-m.r*0.25-hop, 2, 0, 7); ctx.arc(m.x+m.r*0.35, m.y-m.r*0.25-hop, 2, 0, 7); ctx.fill();

    ctx.textAlign = 'center';
    const nameY = m.y - m.r - 30;
    ctx.font = (d.boss ? "700 14px " : "600 12px ") + "'IBM Plex Sans Thai', sans-serif";
    ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(10,14,18,.9)';
    ctx.strokeText(d.name, m.x, nameY); ctx.fillStyle = d.boss ? '#f2c14e' : '#e9eef4'; ctx.fillText(d.name, m.x, nameY);
    const lvl = 'Lv. ' + d.lv;
    ctx.font = "600 11px 'IBM Plex Sans Thai', sans-serif";
    const lw = ctx.measureText(lvl).width + 14;
    ctx.fillStyle = 'rgba(12,16,22,.85)'; ctx.strokeStyle = 'rgba(255,255,255,.2)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(m.x - lw/2, nameY + 4, lw, 17, 4); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#cdd7e2'; ctx.fillText(lvl, m.x, nameY + 16);
    if (m.hp < m.max) {
      const w = d.boss ? 96 : 50, hpy = nameY + 25;
      ctx.fillStyle = 'rgba(10,14,18,.8)'; ctx.fillRect(m.x-w/2, hpy, w, 5);
      ctx.fillStyle = d.boss ? '#f0604e' : '#7fe07a'; ctx.fillRect(m.x-w/2, hpy, w * Math.max(0, m.hp/m.max), 5);
    }
  }

  drawMini() {
    const cv = this.miniRef.current; if (!cv) return;
    const ctx = cv.getContext('2d'), m = this.mapDef(), g = this.g, z = this.state.zoom;
    ctx.fillStyle = '#161d24'; ctx.fillRect(0,0,cv.width,cv.height);
    ctx.save();
    const sx = cv.width / m.w * z, sy = cv.height / m.h * z;
    if (z > 1) ctx.translate(cv.width/2 - g.p.x*sx, cv.height/2 - g.p.y*sy);
    ctx.fillStyle = '#6d6044'; for (const p of (m.paths||[])) ctx.fillRect(p[0]*sx, p[1]*sy, p[2]*sx, p[3]*sy);
    ctx.fillStyle = '#2f5f7a'; for (const w of (m.water||[])) ctx.fillRect(w[0]*sx, w[1]*sy, w[2]*sx, w[3]*sy);
    ctx.fillStyle = '#7a6244'; for (const c of (m.colliders||[])) ctx.fillRect(c[0]*sx, c[1]*sy, c[2]*sx, c[3]*sy);
    ctx.fillStyle = '#5fd0e8'; for (const p of (m.portals||[])) ctx.fillRect(p.x*sx, p.y*sy, Math.max(3,p.w*sx), Math.max(3,p.h*sy));
    ctx.fillStyle = '#f0604e'; for (const mo of g.mobs) if (!mo.dead) ctx.fillRect(mo.x*sx-1.5, mo.y*sy-1.5, 3, 3);
    ctx.fillStyle = '#f2c14e'; for (const n of (m.npcs||[])) ctx.fillRect(n.x*sx-2, n.y*sy-2, 4, 4);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(g.p.x*sx-2.5, g.p.y*sy-2.5, 5, 5);
    ctx.restore();
  }

  renderVals() {
    const g = this.g, D = this.derived(), s = this.state;
    const need = EXP_TABLE[g.level] || 1;
    const panel = s.panel;
    const shopNpc = s.shop ? (this.mapDef().npcs||[]).find(n => n.id === s.shop) : null;
    const dlgNpc = s.dialogue ? (this.mapDef().npcs||[]).find(n => n.id === s.dialogue) : null;
    const lootItem = s.loot ? ITEMS[s.loot.id] : null;
    const titles = { inventory:['囊','กระเป๋า'], character:['身','ตัวละคร'], skills:['技','วิชากระบี่'], codex:['書','คัมภีร์ยุทธ์'], quests:['令','สมุดเควส'] };
    const now = new Date();

    let npcLine = '', dlgOptions = [];
    if (dlgNpc && dlgNpc.role === 'quest') {
      const avail = QUESTS.find(q => !g.quests[q.id] && (q.id !== 'q3' || g.level >= 8));
      const ready = QUESTS.find(q => g.quests[q.id] && g.quests[q.id].state === 'ready');
      if (ready) { npcLine = 'ทำได้ดีมาก เจ้าเหมาะจะเป็นจอมยุทธ์แท้จริง รับรางวัลไปเถิด'; dlgOptions = [{ label:'ส่งเควส ' + ready.name, bg:'linear-gradient(#e8a83c,#c07a18)', color:'#221703', onClick:() => this.turnIn(ready.id) }]; }
      else if (avail) { npcLine = avail.desc; dlgOptions = [{ label:'รับเควส', bg:'linear-gradient(#e8a83c,#c07a18)', color:'#221703', onClick:() => this.acceptQuest(avail.id) }, { label:'ไว้ก่อน', bg:'rgba(255,255,255,.1)', color:'#cdd7e2', onClick:() => this.setState({ dialogue:null }) }]; }
      else { npcLine = 'ยุทธจักรกว้างใหญ่ จงฝึกฝนต่อไป แล้วกลับมาหาข้าเมื่อแกร่งพอ'; dlgOptions = [{ label:'ลาก่อน', bg:'rgba(255,255,255,.1)', color:'#cdd7e2', onClick:() => this.setState({ dialogue:null }) }]; }
    }

    const mainTab = s.questTab === 'เควสหลัก';
    const tracked = QUESTS.filter(q => g.quests[q.id] && g.quests[q.id].state !== 'done' && q.main === mainTab);

    return {
      canvasRef:this.canvasRef, miniRef:this.miniRef, stickRef:this.stickRef, knobRef:this.knobRef,
      charName:'AIUNLOCK', level:g.level,
      hpPct: Math.max(0, g.p.hp / D.hpMax * 100) + '%', hpText: Math.ceil(g.p.hp) + ' / ' + Math.round(D.hpMax),
      mpPct: Math.max(0, g.p.mp / D.mpMax * 100) + '%', mpText: Math.ceil(g.p.mp) + ' / ' + Math.round(D.mpMax),
      expPct: Math.min(100, g.exp / need * 100) + '%', expPercent: (g.exp / need * 100).toFixed(2) + '%',
      mapName: this.mapDef().name, coords: Math.round(g.p.x/10) + ', ' + Math.round(g.p.y/10),
      clock: now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0'),
      ping: '33ms', gold: g.gold, statPoints: g.statPoints, skillPoints: g.skillPoints,
      touchMode: s.touch, onAttackBtn: () => this.basicAttack(),
      toggleAuto: () => this.toggleAuto(),
      autoBg: s.auto ? 'radial-gradient(circle at 50% 35%, #f2c14e, #a8760f)' : 'radial-gradient(circle at 50% 35%, #2f3a48, #151c24)',
      autoBorder: s.auto ? '#f7dd9a' : 'rgba(255,255,255,.28)',
      autoColor: s.auto ? '#221703' : '#dfe7ef',
      zoomIn: () => this.setState(st => ({ zoom: Math.min(3, st.zoom + 0.5) })),
      zoomOut: () => this.setState(st => ({ zoom: Math.max(1, st.zoom - 0.5) })),

      buffSlots: [
        ...CODEX.filter(c => g.codex[c.id]).map(c => ({ name:c.name, glyph:c.glyph, border:'rgba(242,193,78,.5)', bg:'rgba(242,193,78,.14)', color:'#f2c14e' })),
        ...Array.from({ length: Math.max(0, 7 - CODEX.filter(c => g.codex[c.id]).length) }, () => ({ name:'ว่าง', glyph:'·', border:'rgba(255,255,255,.14)', bg:'rgba(255,255,255,.05)', color:'#5b6774' })),
      ].slice(0, 7),

      party: PARTY.map(m => ({ ...m, hp:'100%', mp:'100%' })),

      topMenu: [
        { glyph:'礼', label:'กิจกรรม', panel:null },
        { glyph:'店', label:'ร้านค้า', panel:'shopVillage' },
        { glyph:'鍛', label:'ตีบวก', panel:null },
        { glyph:'藥', label:'ยา', panel:null },
        { glyph:'門', label:'สำนัก', panel:null },
        { glyph:'令', label:'เควส', panel:'quests' },
        { glyph:'囊', label:'กระเป๋า', panel:'inventory' },
        { glyph:'☰', label:'เมนู', panel:'character' },
      ].map(t => ({
        glyph:t.glyph, label:t.label,
        border: panel && panel === t.panel ? '#f2c14e' : 'rgba(255,255,255,.18)',
        bg: panel && panel === t.panel ? 'rgba(242,193,78,.2)' : 'rgba(18,24,32,.82)',
        onClick: () => { if (t.panel === 'shopVillage') this.setState({ shop:'herb', panel:null }); else if (t.panel) this.togglePanel(t.panel); else this.push('ระบบ ' + t.label + ' ยังไม่เปิดใน Vertical Slice', '#8b97a5'); },
      })),

      questTabs: ['เควสหลัก','เควสรอง'].map(label => ({
        label, onClick: () => this.setState({ questTab:label }),
        color: s.questTab === label ? '#f5e7c8' : '#8b97a5',
        bg: s.questTab === label ? 'rgba(255,255,255,.1)' : 'transparent',
      })),
      trackedQuests: tracked.map(q => ({
        name:q.name, color: q.main ? '#f2c14e' : '#5fd0e8', dot: q.main ? '#f2c14e' : '#5fd0e8',
        progress: g.quests[q.id].state === 'ready' ? 'พร้อมส่ง — กลับไปหาผู้เฒ่าหลิน'
          : (q.type==='kill' ? 'กำจัด ' + MONSTERS[q.target].name + '  ' : 'เก็บ ' + ITEMS[q.target].name + '  ') + (g.quests[q.id].n||0) + '/' + q.need,
      })),
      noQuests: tracked.length === 0,

      chatTabs: ['ทั้งหมด','ปาร์ตี้','กิลด์','ระบบ'].map(label => ({
        label, onClick: () => this.setState({ chatTab:label }),
        color: s.chatTab === label ? '#f5e7c8' : '#8b97a5',
        bg: s.chatTab === label ? 'rgba(255,255,255,.1)' : 'transparent',
      })),
      log: g.log.map(l => ({ text:l.text, color:l.color })),

      skillPads: SKILLS.slice(0,4).map((sk, i) => {
        const pos = [ { right:'122px', bottom:'12px', size:'58px' }, { right:'52px', bottom:'88px', size:'62px' },
                      { right:'128px', bottom:'88px', size:'52px' }, { right:'62px', bottom:'160px', size:'52px' } ][i];
        const known = !!g.skillLv[sk.id];
        return { ...pos, glyph:sk.glyph, key:sk.key,
          border: known ? 'rgba(255,255,255,.3)' : 'rgba(255,255,255,.12)',
          bg: known ? 'radial-gradient(circle at 50% 35%, #3a4a68, #171f2c)' : 'radial-gradient(circle at 50% 35%, #232a33, #12171d)',
          fg: known ? '#cfe4ff' : '#5b6774',
          cdPct: ((g.cds[sk.id]||0) / sk.cd * 100) + '%',
          onUse: () => this.useSkill(sk.id) };
      }),

      potionPads: ['potion_hp','potion_mp'].map(id => ({
        glyph: ITEMS[id].glyph, color: id === 'potion_hp' ? '#f0604e' : '#5fa8e8', count: String(this.countItem(id)),
        onUse: () => { const i = g.inv.findIndex(x => x.id === id); if (i >= 0) this.useItem(i); },
      })),

      panelOpen: !!panel, panelGlyph: panel ? titles[panel][0] : '', panelTitle: panel ? titles[panel][1] : '',
      closePanel: () => this.setState({ panel:null, shop:null }),
      isInventory: panel === 'inventory', isCharacter: panel === 'character', isSkills: panel === 'skills',
      isCodex: panel === 'codex', isQuests: panel === 'quests',

      invSlots: Array.from({ length:24 }, (_, i) => {
        const slot = g.inv[i];
        if (!slot) return { glyph:'', count:'', tip:'', border:'rgba(255,255,255,.1)', bg:'rgba(255,255,255,.03)', onClick:()=>{} };
        const it = ITEMS[slot.id], rc = RARITY[it.rarity];
        return { glyph: it.glyph, count: slot.n > 1 ? String(slot.n) : '', tip: it.name + ' — ' + it.desc, border: rc.color, bg: rc.bg, onClick: () => this.useItem(i) };
      }),
      equipSlots: [['weapon','อาวุธ'],['head','ศีรษะ'],['body','ลำตัว'],['boots','รองเท้า'],['necklace','สร้อยคอ'],['ring','แหวน'],['bracelet','กำไล'],['accessory','เครื่องประดับ']].map(([k, label]) => {
        const id = g.equip[k], it = id ? ITEMS[id] : null;
        return { slotName: label, name: it ? it.name : 'ว่าง', glyph: it ? it.glyph : '·', color: it ? RARITY[it.rarity].color : '#7f8b98', bg: it ? RARITY[it.rarity].bg : 'rgba(255,255,255,.04)', onClick: () => this.unequip(k) };
      }),

      statRows: [['STR','พละกำลัง','ความเสียหายกายภาพ'],['AGI','ความว่องไว','ความเร็วโจมตี / หลบ'],['VIT','พลังกาย','HP และป้องกัน'],['INT','ปัญญา','พลังวิชา / MP'],['DEX','ความแม่นยำ','โอกาสเข้าเป้า'],['LUK','โชคชะตา','คริติคอล']].map(([key,label,desc]) => ({
        key, label, desc, value: g.stats[key],
        addBg: g.statPoints > 0 ? 'linear-gradient(#e8a83c,#c07a18)' : 'rgba(255,255,255,.08)',
        onAdd: () => { if (g.statPoints > 0) { g.stats[key]++; g.statPoints--; this.setState({ tick:this.state.tick+1 }); } },
      })),
      derivedRows: [
        { label:'พลังโจมตี', value: Math.round(D.atk) }, { label:'ป้องกัน', value: Math.round(D.def) },
        { label:'พลังชีวิตสูงสุด', value: Math.round(D.hpMax) }, { label:'พลังภายในสูงสุด', value: Math.round(D.mpMax) },
        { label:'คริติคอล', value: D.crit.toFixed(1) + '%' }, { label:'ความเร็วโจมตี', value: D.aspd.toFixed(2) + 'x' },
        { label:'ความเร็วเคลื่อนที่', value: Math.round(D.spd) }, { label:'โบนัสความเสียหาย', value: '+' + Math.round(D.dmgPct) + '%' },
      ],

      skillRows: SKILLS.map(sk => {
        const lv = g.skillLv[sk.id], can = g.skillPoints > 0 && g.level >= sk.req && lv < 5;
        return {
          glyph: sk.glyph, name: sk.name, desc: sk.desc, mp: sk.mp, cd: sk.cd + ' วิ',
          rank: lv ? 'ขั้น ' + lv + '/5' : 'ยังไม่เรียน',
          border: lv ? 'rgba(95,208,232,.35)' : 'rgba(255,255,255,.1)',
          bg: lv ? 'rgba(95,208,232,.06)' : 'rgba(255,255,255,.03)',
          btnLabel: lv >= 5 ? 'สูงสุด' : (g.level < sk.req ? 'ต้อง Lv.' + sk.req : (lv ? 'เพิ่มขั้น' : 'เรียนรู้')),
          btnBg: can ? 'linear-gradient(#e8a83c,#c07a18)' : 'rgba(255,255,255,.08)',
          btnColor: can ? '#221703' : '#7f8b98',
          onLevel: () => { if (can) { g.skillLv[sk.id]++; g.skillPoints--; this.push('ฝึก ' + sk.name + ' สำเร็จ', '#f2c14e'); this.setState({ tick:this.state.tick+1 }); } },
        };
      }),

      codexRows: CODEX.map(c => {
        const known = !!g.codex[c.id];
        return { name: known ? c.name : '???', glyph: known ? c.glyph : '秘', tier: c.tier,
          desc: known ? c.desc : 'ยังไม่ค้นพบ — ล่ามอนสเตอร์ บอส หรือเควสลับเพื่อค้นหา',
          status: known ? 'สำเร็จวิชาแล้ว' : 'ยังไม่ค้นพบ',
          statusColor: known ? '#6ec98a' : '#7f8b98',
          border: known ? 'rgba(242,193,78,.4)' : 'rgba(255,255,255,.1)',
          bg: known ? 'rgba(242,193,78,.07)' : 'rgba(255,255,255,.03)',
          tierColor: known ? '#f2c14e' : '#7f8b98',
          nameColor: known ? '#f5e7c8' : '#7f8b98' };
      }),

      questRows: QUESTS.map(q => {
        const st = g.quests[q.id];
        const state = !st ? 'ยังไม่รับ' : st.state === 'done' ? 'สำเร็จ' : st.state === 'ready' ? 'พร้อมส่ง' : 'กำลังทำ';
        return { name:q.name, desc:q.desc, state, reward:q.rewardText,
          progress: (q.type==='kill'?'กำจัด ':'เก็บ ') + (st ? st.n : 0) + ' / ' + q.need,
          stateColor: state==='สำเร็จ' ? '#6ec98a' : state==='พร้อมส่ง' ? '#f2c14e' : '#8b97a5',
          border: state==='สำเร็จ' ? 'rgba(110,201,138,.35)' : state==='พร้อมส่ง' ? 'rgba(242,193,78,.4)' : 'rgba(255,255,255,.1)',
          bg: st ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.02)' };
      }),

      shopOpen: !!shopNpc, shopTitle: shopNpc ? shopNpc.name : '',
      shopRows: shopNpc ? shopNpc.shop.map(id => {
        const it = ITEMS[id];
        return { glyph:it.glyph, name:it.name, desc:it.desc, color:RARITY[it.rarity].color, price: it.price + ' Zeny',
          btnBg: g.gold >= it.price ? 'linear-gradient(#e8a83c,#c07a18)' : 'rgba(255,255,255,.08)',
          btnColor: g.gold >= it.price ? '#221703' : '#7f8b98', onBuy: () => this.buy(id) };
      }) : [],

      dialogueOpen: !!dlgNpc, npcName: dlgNpc ? dlgNpc.name : '', npcGlyph: dlgNpc ? dlgNpc.glyph : '', npcLine,
      dialogueOptions: dlgOptions,

      levelUpOpen: !!s.levelUp,
      lootOpen: !!lootItem, lootName: lootItem ? lootItem.name : '', lootGlyph: lootItem ? lootItem.glyph : '',
      lootRarity: lootItem ? lootItem.rarity : '', lootColor: lootItem ? RARITY[lootItem.rarity].color : '#f2c14e',
      lootGlow: lootItem ? RARITY[lootItem.rarity].bg : 'transparent',

      titleOpen: !s.started, startLabel: 'เข้าสู่หมู่บ้านสายหมอก',
      charCards: [
        { glyph:'劍', name:'จอมยุทธ์ฝึกหัด', sub:'สายกระบี่ · Lv.1', border:'#f2c14e', cursor:'pointer', opacity:'1', onClick:()=>{} },
        { glyph:'刀', name:'สายดาบ', sub:'ยังไม่เปิดให้เล่น', border:'rgba(255,255,255,.14)', cursor:'not-allowed', opacity:'.45', onClick:()=>{} },
        { glyph:'弓', name:'สายธนู', sub:'ยังไม่เปิดให้เล่น', border:'rgba(255,255,255,.14)', cursor:'not-allowed', opacity:'.45', onClick:()=>{} },
      ],
      onStart: () => { this.g = this.newGame(); this.enterMap('village', 660, 520); this.setState({ started:true, panel:null }); },
    };
  }
}
