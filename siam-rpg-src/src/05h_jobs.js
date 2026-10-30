/* ============================================================
   Jobs: 12 advanced-class models (+ refreshed base looks),
   job change, awakening ritual, awakened aura
   ============================================================ */
Object.assign(SKILL_ANIM, { bowling: 'spin', brandish: 'cleave', dragonblade: 'leap', grandcross: 'pray', shieldchain: 'throw', devotion: 'guard', hammerfall: 'slam', thunderforge: 'cleave', mammonite: 'cleave', aciddemo: 'throw', potionpitch: 'throw', acidbomb: 'throw', sonicblow: 'slash', edp: 'pray', meteorassault: 'spin', backstab: 'dash', chasewalk: 'dash', raid: 'spin', blitz: 'bow', truesight: 'guard', sharpshoot: 'bow', bragi: 'pray', idun: 'pray', arrowvulcan: 'bow', napalm: 'cast', gravity: 'slam', stormgust: 'slam', heavensdrive: 'slam', blindmist: 'cast', soulburn: 'slam', magnus: 'slam', meditation: 'pray', redemption: 'pray', ragingpalm: 'bash', spheres: 'pray', asura: 'leap' });
Object.assign(SKILL_SHOUT, { bowling: 'haiya', brandish: 'uooa', dragonblade: 'heiyaa', grandcross: 'aaa', shieldchain: 'ha', devotion: 'hoo', hammerfall: 'uoo', thunderforge: 'hya', mammonite: 'uooa', aciddemo: 'ha', potionpitch: 'hai', acidbomb: 'heiya', sonicblow: 'sha', edp: 'hoo', meteorassault: 'haiya', backstab: 'shu', chasewalk: 'shu', raid: 'haa', blitz: 'hya', truesight: 'hoo', sharpshoot: 'eiyaa', bragi: 'laa', idun: 'laa', arrowvulcan: 'hyaa', napalm: 'haa', gravity: 'eia', stormgust: 'oooaa', heavensdrive: 'eia', blindmist: 'haa', soulburn: 'oooaa', magnus: 'aaa', meditation: 'ooo', redemption: 'aaa', ragingpalm: 'ha', spheres: 'hoo', asura: 'uooaaa' });
Object.assign(BASIC_ANIM, { lordknight: 'slash', paladin: 'slash', whitesmith: 'slash', creator: 'throw', assassinx: 'slash', stalker: 'slash', sniper: 'bow', minstrel: 'cast', highwizard: 'cast', professor: 'cast', highpriest: 'cast', champion: 'slash' });
const AWK_EMIS = new Float32Array([.17, .11, .03]);
const hc = hexc;
/* hair colors per class line (refreshed base looks) */
const HAIR = {
  adventurer: { hair: hc('#8a5a32'), hair2: hc('#6a4224'), hair3: hc('#b07a48') }, knight: { hair: hc('#d8dce6'), hair2: hc('#a8b0c0'), hair3: hc('#f4f6fa') },
  ninja: { hair: hc('#c8c4c0'), hair2: hc('#9a9490'), hair3: hc('#ecebe8') }, archer: { hair: hc('#7a4a2a'), hair2: hc('#5a3418'), hair3: hc('#a0683a') },
  mage: { hair: hc('#c83a3a'), hair2: hc('#962626'), hair3: hc('#e86060') }, priest: { hair: hc('#e8c870'), hair2: hc('#c0a050'), hair3: hc('#f8e4a0') }
};
for (const k in HAIR) OUTFITS[k].col = HAIR[k];
const JC = { steel: hc('#c9ced8'), steel2: hc('#9aa1ae'), gold: hc('#d9a845'), gold2: hc('#b8862e'), dark: hc('#2a2430'), wood: hc('#8a6240'), leather: hc('#6b4428'), white: hc('#f4f0e7'), red: hc('#a32f25'), crimson: hc('#7a1a22') };
/* weapon / gear builders used through OUTFITS[job].add[bone] */
const JW = {
  greatsword: g => { g.push(0, -.26, 0, Math.PI / 2); g.box(0, .62, 0, .16, 1.25, .035, JC.steel); g.box(0, .62, .02, .04, 1.2, .012, hc('#eef1f6')); g.box(0, .02, 0, .42, .07, .1, JC.gold); g.cone(0, 1.24, 0, 0, 1, 0, .09, .18, 4, JC.steel); g.cyl(0, -.16, 0, .04, .04, .3, 5, JC.leather); g.sphere(0, -.18, 0, .06, JC.crimson, 5, 3); g.pop(); },
  lance: g => { g.push(0, -.26, 0, Math.PI / 2 + .12); g.cyl(0, -.3, 0, .035, .035, 1.6, 6, JC.wood); g.cone(0, 1.3, 0, 0, 1, 0, .07, .42, 4, JC.steel); g.cyl(0, 1.22, 0, .09, .09, .06, 6, JC.gold, null, true); g.pop(); },
  kite: g => { g.push(.1, -.15, .04, 0, 0, 0); g.box(0, .02, 0, .05, .62, .46, JC.white); g.box(.03, .02, 0, .02, .56, .4, hc('#e8e0c8')); g.box(.04, .02, 0, .02, .36, .08, JC.gold); g.box(.04, .08, 0, .02, .08, .26, JC.gold); g.cone(0, -.3, 0, 0, -1, 0, .22, .22, 4, JC.white); g.pop(); },
  hammer: g => { g.push(0, -.26, 0, Math.PI / 2); g.cyl(0, -.2, 0, .04, .04, 1.1, 6, JC.wood); g.box(0, .95, 0, .3, .3, .5, hc('#6a6a74'), hc('#8a8a94')); g.box(0, .95, 0, .34, .1, .1, JC.gold); g.pop(); },
  flask: g => { g.push(0, -.3, .05, 0, 0, 0); g.sphere(0, 0, 0, .1, hc('#8ad06a'), 7, 5); g.cyl(0, .08, 0, .035, .035, .1, 6, hc('#c8e8a0')); g.cyl(0, .17, 0, .03, .03, .03, 6, JC.leather); g.pop(); },
  katar: g => { g.push(0, -.25, 0, Math.PI / 2); g.box(0, .45, 0, .06, .7, .02, JC.steel); g.box(.06, .3, 0, .03, .4, .015, JC.steel); g.box(-.06, .3, 0, .03, .4, .015, JC.steel); g.box(0, .02, 0, .18, .05, .06, JC.crimson); g.pop(); },
  longbow: g => { g.push(0, -.26, .02, 0, 0, 0); for (let i = -6; i <= 6; i++) { const y = i * .1, z = .16 - Math.abs(i) * Math.abs(i) * .006; g.box(0, y, z, .045, .11, .045, i % 2 ? hc('#5a3a1e') : JC.leather); } g.box(0, 0, -.04, .006, 1.2, .006, [1, 1, 1]); g.box(0, 0, .17, .05, .2, .06, JC.gold); g.pop(); },
  falcon: g => { g.push(.1, .34, -.06, 0, 0, 0); g.ell(0, 0, 0, .09, .08, .14, hc('#6a4a2a'), 7, 5); g.sphere(0, .09, .1, .07, hc('#8a6a3a'), 6, 4); g.cone(0, .09, .16, 0, -.2, 1, .025, .07, 3, JC.gold); g.ell(.1, .02, -.02, .03, .05, .13, hc('#5a3a1e'), 5, 4); g.ell(-.1, .02, -.02, .03, .05, .13, hc('#5a3a1e'), 5, 4); g.pop(); },
  harp: g => { g.push(0, -.26, .03, 0, 0, 0); g.box(0, .25, 0, .04, .55, .05, JC.gold); g.box(.16, .25, 0, .04, .5, .05, JC.gold); g.box(.08, .52, 0, .22, .05, .05, JC.gold); g.box(.08, -.02, 0, .22, .05, .05, JC.gold2); for (let i = 1; i < 5; i++) g.box(.04 + i * .025, .25, 0, .004, .48, .004, [1, 1, 1]); g.pop(); },
  book: g => { g.push(0, -.3, .06, .4, 0, 0); g.box(0, 0, 0, .3, .05, .22, hc('#f4ead2')); g.box(0, -.03, 0, .32, .025, .24, hc('#6a2a2a')); g.box(0, .03, 0, .32, .025, .24, hc('#6a2a2a')); g.box(0, .045, 0, .1, .005, .1, JC.gold); g.pop(); },
  knuckle: g => { for (let i = 0; i < 3; i++) g.cone(-.03 + i * .03, -.27, .05, 0, -.3, 1, .018, .16, 3, JC.steel); g.box(0, -.26, .03, .14, .09, .1, hc('#8a4a2a')); },
  crystal: g => { g.push(0, .9, 0, 0, 0, 0); g.cyl(0, 0, 0, .14, 0, .3, 5, hc('#b08aff')); g.at(0, 0, 0, 0, 1, 1, 1, Math.PI); g.cyl(0, 0, 0, .14, 0, .22, 5, hc('#8a5aff')); g.reset(); g.pop(); },
  bigrod: g => { g.cyl(0, -.7, 0, .03, .035, 1.6, 6, JC.gold); g.push(0, 1.0, 0, 0, 0, 0); g.cyl(0, 0, 0, .22, .22, .04, 12, JC.gold, null, false); g.ell(0, 0, 0, .09, .12, .09, hc('#ffe9a8'), 6, 4); for (let i = 0; i < 4; i++) g.cone(0, 0, 0, Math.cos(i * 1.57), .4, Math.sin(i * 1.57), .025, .3, 3, JC.gold); g.pop(); },
  pauldrons: (g, col, trim) => { for (const s of [-1, 1]) { g.ell(s * .29, .38, 0, .15, .11, .15, col, 7, 5); g.cyl(s * .29, .33, 0, .155, .155, .03, 8, trim, null, true); } },
  cape: (g, col, w = .5, h = .96) => { g.box(0, -h / 2, -.02, w, h, .035, col); g.box(0, -h + .03, -.02, w + .02, .06, .04, shade(col, .8)); },
  hood: (g, col) => { g.sphereSkip(0, .5, -.04, .56, col, 14, 10, c => (c[2] > .18 && c[1] < .3) || c[1] < -.25); g.cone(0, .95, -.2, 0, .7, -1, .14, .3, 5, col); },
  crown: (g, col) => { g.cyl(0, .66, 0, .5, .48, .1, 12, col, null, true); for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; g.cone(Math.cos(a) * .46, .74, Math.sin(a) * .46, 0, 1, 0, .05, .18, 4, col); } },
  halo: g => { g.cyl(0, 1.08, 0, .32, .32, .03, 14, JC.gold, null, false); g.cyl(0, 1.1, 0, .26, .26, .02, 14, hc('#ffe9a8'), null, true); },
  horns: g => { for (const s of [-1, 1]) g.cone(s * .3, .7, .05, s * .5, 1, -.2, .07, .36, 5, JC.steel); },
  scarf: (g, col) => { g.cyl(0, .36, 0, .15, .13, .12, 8, col); g.push(-.1, .28, -.2, .3, 0, 0); g.box(0, -.25, 0, .12, .5, .03, col); g.pop(); }
};
/* ---- 12 job outfits + master NPC ---- */
Object.assign(OUTFITS, {
  lordknight: { like: 'knight', col: HAIR.knight, shirt: hc('#2a2430'), sleeve: hc('#4a3a30'), pants: hc('#2a2026'), boot: JC.steel, glove: hc('#3a2a24'), belt: JC.gold2, cape: JC.red, armor: true, pig: false, band: 'helm', weapon: null,
    add: { elR: g => JW.greatsword(g), chest: g => JW.pauldrons(g, JC.steel, JC.red), head: g => JW.horns(g), cape: g => JW.cape(g, JC.red, .56, 1.0) } },
  paladin: { like: 'knight', col: HAIR.knight, shirt: JC.white, sleeve: hc('#5a4a40'), pants: hc('#4a3a30'), boot: JC.gold, glove: hc('#6b4428'), belt: JC.gold2, cape: hc('#4a7ad0'), armor: true, pig: false, band: 'helm', weapon: null,
    add: { elR: g => JW.lance(g), elL: g => JW.kite(g), chest: g => JW.pauldrons(g, JC.white, JC.gold), head: g => JW.crown(g, JC.gold), cape: g => JW.cape(g, hc('#4a7ad0'), .5, .9) } },
  whitesmith: { like: 'adventurer', col: HAIR.adventurer, shirt: hc('#e8d8b0'), sleeve: hc('#e8d8b0'), pants: hc('#3a3a44'), boot: hc('#5a4a3a'), glove: hc('#8a6a4a'), belt: hc('#4a3a2a'), capelet: false, weapon: null, pig: false,
    add: { elR: g => JW.hammer(g), chest: g => { g.cyl(0, .02, 0, .215, .19, .3, 10, hc('#6a4a3a')); g.box(0, .18, .19, .18, .08, .03, JC.gold); JW.pauldrons(g, hc('#6a6a74'), JC.gold); }, head: g => { g.cyl(0, .6, 0, .53, .53, .1, 14, hc('#c8402a'), null, true); } } },
  creator: { like: 'adventurer', col: HAIR.adventurer, shirt: hc('#f4f0e7'), sleeve: hc('#f4f0e7'), pants: hc('#3a4a5a'), boot: hc('#5a4a3a'), glove: hc('#8a6a4a'), belt: hc('#4a3a2a'), capelet: true, cape: hc('#4a8a5a'), weapon: null, pig: false,
    add: { elL: g => JW.flask(g), chest: g => { g.push(0, .1, -.22, 0, 0, 0); g.box(0, 0, 0, .34, .4, .18, hc('#8a6a4a')); g.box(0, .18, 0, .36, .06, .2, hc('#5a4030')); g.pop(); g.box(.12, .2, .19, .08, .1, .03, hc('#8ad06a')); g.box(-.1, .2, .19, .08, .1, .03, hc('#d06a6a')); }, head: g => { g.cyl(0, .62, 0, .54, .54, .06, 14, hc('#8a6a4a'), null, true); g.box(0, .6, .5, .34, .1, .04, hc('#d0e8f0')); } } },
  assassinx: { like: 'ninja', col: HAIR.ninja, shirt: hc('#1a1418'), sleeve: hc('#f8d6b8'), pants: hc('#1a1418'), boot: hc('#2a2024'), glove: hc('#2b2422'), belt: JC.crimson, cape: JC.crimson, scarf: true, mask: true, weapon: null, pig: false, band: 'ninja', wraps: true,
    add: { elR: g => JW.katar(g), elL: g => JW.katar(g), chest: g => { g.box(0, .1, .19, .24, .22, .03, JC.crimson); g.box(0, .1, .2, .04, .22, .02, JC.gold); }, cape: g => { g.push(-.1, 0, 0, 0, 0, .15); g.box(0, -.4, -.02, .16, .8, .025, JC.crimson); g.pop(); g.push(.1, 0, 0, 0, 0, -.15); g.box(0, -.4, -.02, .16, .8, .025, JC.crimson); g.pop(); } } },
  stalker: { like: 'ninja', col: HAIR.ninja, shirt: hc('#2a2436'), sleeve: hc('#3a3048'), pants: hc('#1e1a26'), boot: hc('#2a2024'), glove: hc('#2b2422'), belt: hc('#6b4428'), cape: hc('#5a4a7a'), scarf: false, mask: false, weapon: 'kunai', pig: false, band: null, wraps: true,
    add: { head: g => JW.hood(g, hc('#4a3c66')), chest: g => { g.cyl(0, .02, 0, .212, .19, .36, 10, hc('#3a3048')); g.box(0, .3, .17, .3, .06, .06, hc('#5a4a7a')); }, cape: g => JW.cape(g, hc('#4a3c66'), .48, .9) } },
  sniper: { like: 'archer', col: HAIR.archer, shirt: hc('#4a6a3a'), sleeve: hc('#e8dcc0'), pants: hc('#3a2a1e'), boot: hc('#5a3a1e'), glove: hc('#6b4428'), belt: hc('#6a4428'), vest: hc('#2e4a2a'), weapon: null, quiver: true, pig: false,
    add: { elL: g => JW.longbow(g), chest: g => JW.falcon(g), head: g => { g.cyl(0, .64, 0, .535, .53, .08, 14, hc('#2e4a2a'), null, true); g.cone(.38, .68, .15, .6, .7, .2, .03, .4, 3, hc('#e8dcc0')); } } },
  minstrel: { like: 'archer', col: HAIR.archer, shirt: hc('#f4e0e8'), sleeve: hc('#f4e0e8'), pants: hc('#6a3a5a'), boot: hc('#4a2a3a'), glove: hc('#f4e0e8'), belt: JC.gold, vest: hc('#c86a9a'), weapon: null, quiver: false, pig: false,
    add: { elL: g => JW.harp(g), head: g => { g.cyl(0, .62, 0, .55, .5, .14, 12, hc('#c86a9a'), null, true); g.cone(.3, .72, -.1, .6, 1, -.3, .04, .5, 3, hc('#f4e0e8')); g.cone(.32, .72, -.12, .7, .8, -.3, .04, .45, 3, hc('#6ab0e8')); }, chest: g => { g.box(0, .18, .19, .1, .3, .03, JC.gold); } } },
  highwizard: { like: 'mage', col: HAIR.mage, shirt: hc('#2a1a44'), sleeve: hc('#2a1a44'), pants: hc('#1e1430'), boot: hc('#3a2a4a'), glove: hc('#2a1a44'), belt: JC.gold, cape: hc('#4a2a7a'), robe: hc('#3a2460'), weapon: 'staff', hat: false, pig: false, cloak: true,
    add: { elR: g => JW.crystal(g), head: g => { JW.crown(g, JC.gold); g.cone(0, .76, 0, 0, 1, 0, .1, .36, 4, hc('#b08aff')); }, chest: g => { g.cyl(0, .04, 0, .215, .19, .34, 10, hc('#2a1a44')); g.box(0, .2, .19, .18, .3, .03, JC.gold); JW.pauldrons(g, hc('#4a2a7a'), JC.gold); }, cape: g => JW.cape(g, hc('#4a2a7a'), .6, 1.0) } },
  professor: { like: 'mage', col: HAIR.mage, shirt: hc('#8a3a2a'), sleeve: hc('#f4e8d0'), pants: hc('#3a2a24'), boot: hc('#5a3a2a'), glove: hc('#f4e8d0'), belt: JC.gold2, cape: hc('#8a3a2a'), robe: hc('#f4e8d0'), weapon: 'staff', hat: false, pig: false, cloak: true,
    add: { elL: g => JW.book(g), head: g => { g.box(-.2, .22, .5, .16, .12, .02, hc('#f4e8d0')); g.box(.2, .22, .5, .16, .12, .02, hc('#f4e8d0')); g.box(0, .22, .5, .1, .02, .02, JC.gold); g.cyl(0, .62, 0, .54, .54, .08, 14, hc('#8a3a2a'), null, true); }, cape: g => JW.cape(g, hc('#8a3a2a'), .56, .96) } },
  highpriest: { like: 'priest', col: HAIR.priest, shirt: JC.white, sleeve: JC.white, pants: hc('#4a3324'), boot: hc('#7a4c2a'), glove: hc('#6b4428'), belt: JC.gold, robe: JC.white, weapon: null, capelet: true, capeletCol: hc('#b8302a'), pig: false,
    add: { elR: g => JW.bigrod(g), head: g => JW.halo(g), chest: g => { g.box(0, .2, .18, .12, .4, .03, JC.gold); g.box(0, .3, .19, .28, .06, .03, JC.gold); } } },
  champion: { like: 'priest', col: HAIR.priest, shirt: hc('#e8d0a0'), sleeve: hc('#f8d6b8'), pants: hc('#c8402a'), boot: hc('#4a3a2a'), glove: hc('#f8d6b8'), belt: JC.gold, robe: null, weapon: null, capelet: false, pig: false,
    add: { elR: g => JW.knuckle(g), elL: g => JW.knuckle(g), head: g => { g.cyl(0, .64, 0, .535, .53, .1, 14, hc('#c8402a'), null, true); g.push(-.3, .6, -.3, .3, 0, 0); g.box(0, -.3, 0, .1, .5, .02, hc('#c8402a')); g.pop(); }, chest: g => { g.push(0, .2, 0, 0, 0, .6); g.box(0, 0, .19, .12, .5, .03, hc('#c8402a')); g.pop(); for (let i = 0; i < 5; i++) { const a = i / 5 * TAU; g.sphere(Math.cos(a) * .42, .18 + Math.sin(a * 2) * .06, Math.sin(a) * .42, .05, hc('#ffd080'), 5, 3); } } } },
  zen: { like: 'priest', col: { hair: hc('#e8e4dc'), hair2: hc('#c0bcb4'), hair3: hc('#fbfaf6') }, shirt: hc('#3a3a4a'), sleeve: hc('#3a3a4a'), pants: hc('#2a2a34'), boot: hc('#4a3a2a'), glove: hc('#e8c4a0'), belt: JC.gold, robe: hc('#3a3a4a'), weapon: 'staff', capelet: false, pig: false,
    add: { head: g => { g.cone(0, .2, .32, 0, -1, .25, .2, .7, 7, hc('#f4f0e7')); for (const s of [-1, 1]) g.ell(s * .19, .6, .43, .11, .04, .03, hc('#f4f0e7'), 5, 3); }, chest: g => { g.box(0, .2, .19, .06, .36, .03, JC.gold); } } }
});
{ const ob = buildCharModels; buildCharModels = function (R) { ob(R); for (const k in JOBS) CharModels[k] = buildCharModel(R, k); CharModels.zen = buildCharModel(R, 'zen'); }; }

/* ---- job system ---- */
const JobSys = {
  cost: 500, ritualCost: 5000,
  canChange(S) { return !S.job && S.level >= JOB_LV; },
  change(id) {
    const S = Save.d, j = JOBS[id]; if (!j || j.base !== S.cls) return false;
    if (S.job) { UI.toast('เปลี่ยนอาชีพไปแล้ว', 'warn'); return false; }
    if (S.level < JOB_LV) { UI.toast(`ต้องมีเลเวล ${JOB_LV} ขึ้นไป`, 'warn'); return false; }
    if (S.coins < this.cost) { UI.toast(`ต้องใช้ ${this.cost} เหรียญ`, 'warn'); return false; }
    S.coins -= this.cost; S.job = id; S.stats.jobs = 1; Cls.cache = {}; Skills.cd = [0, 0, 0, 0, 0];
    Player.recalc(); S.hp = Player.stats.maxhp; S.mp = Player.stats.maxmp; Player.rig = null;
    const P = Player; Fx.pillar(P.x, P.z, 1.6, 9, hexc(j.color), 1.2); Fx.shock(P.x, P.z, 5, [1, .9, .6], .8); Particles.burst(P.x, 1, P.z, 80, [1, .9, .5], 6, 1.2, .5, 5); Audio.sfx('level'); Player.doAct('cheer', 1.4);
    UI.banner('เปลี่ยนอาชีพเป็น ' + j.name + '!', 'level'); UI.toast('ได้สกิลใหม่ 3 สกิล (R, T, X) เปิดหน้าสกิลเพื่อดูรายละเอียด', 'quest');
    UI.refreshAll(); UI.mountBtns(); Achievements.check(); Save.write(); if (Net.joined) Net.send(true); return true;
  },
  ritual() {
    const S = Save.d; if (S.awk || !S.job) return;
    if (S.level < AWK_LV) { UI.toast(`ต้องมีเลเวล ${AWK_LV} ขึ้นไป`, 'warn'); return; }
    if (S.coins < this.ritualCost) { UI.toast(`ต้องใช้ ${fmt(this.ritualCost)} เหรียญสำหรับพิธีกรรม`, 'warn'); return; }
    Quiz.run({
      title: 'พิธีกรรมปลุกพลัง', sub: 'ตอบถูกติดต่อกัน 3 ข้อเพื่อปลดผนึกแห่งพลัง ตอบผิดต้องเริ่มใหม่ (เหรียญไม่หาย)', count: 3, chain: true, time: Settings.d.qtime + 5, mode: 'chain',
      onEach: ok => { if (ok) { Fx.pillar(Player.x, Player.z, .8, 5, [1, .85, .4], .6); Audio.sfx('crystal'); } },
      onEnd: r => { if (r.correct >= 3) this.awaken(); else UI.toast('ผนึกยังไม่คลาย ลองเข้าพิธีกรรมอีกครั้ง', 'warn'); }
    });
  },
  awaken() {
    const S = Save.d, P = Player, j = JOBS[S.job]; S.coins -= this.ritualCost; S.awk = true; S.stats.awakened = 1; S.skillPts = (S.skillPts || 0) + 3;
    Game.addItem('awk_amulet', 1); S.cos.aura = 'awk_amulet'; Player.recalc(); S.hp = P.stats.maxhp; S.mp = P.stats.maxmp;
    Fx.pillar(P.x, P.z, 2.4, 14, [1, .8, .3], 2); Fx.shock(P.x, P.z, 8, [1, .85, .4], 1); Fx.shock(P.x, P.z, 4, [1, 1, .9], .7); for (let i = 0; i < 160; i++) Particles.add(P.x + rand(-1.5, 1.5), rand(0, 3), P.z + rand(-1.5, 1.5), { c: [1, .7 + Math.random() * .3, .3], s: .5, life: 2, vy: rand(2, 6) });
    Game.shake(.8); Audio.sfx('boss'); Audio.sfx('level'); Player.doAct('cheer', 2); VoiceFx.shout('uooaaa', P.sheet, .3);
    UI.banner('ปลุกพลังสำเร็จ! ' + Cls.name(S), 'crit'); UI.toast(`เลเวลสูงสุดขยายเป็น ${AWK_LV_CAP} · สกิลอัปได้ถึง Lv.10 · ${j.awk.map(k => SKILLS[k].name).join(' และ ')} แข็งแกร่งขึ้น 30%`, 'rare');
    S.extraTitles = S.extraTitles || []; if (!S.extraTitles.includes('ผู้ตื่นรู้')) S.extraTitles.push('ผู้ตื่นรู้');
    UI.refreshAll(); Achievements.check(); Save.write(); if (Net.joined) Net.send(true);
  },
  giveStone(id, why) { const S = Save.d; if (!S || !S.quests.awk || S.quests.awk.s !== 'active' || S.inv[id]) return; Game.addItem(id, 1); UI.toast(`${ITEMS[id].name}: ${why}`, 'rare'); },
  onDaily(correct) { if (correct >= 5) this.giveStone('st_wisdom', 'ปราชญ์โอรินมอบให้ผู้ตอบถูกครบทุกข้อ'); },
  awkFx(x, z, t) { for (let k = 0; k < 2; k++) if (Math.random() < .7) { const a = Math.random() * TAU, r = .5 + Math.random() * .4; Particles.add(x + Math.cos(a) * r, .05, z + Math.sin(a) * r, { c: Math.random() < .3 ? [1, .95, .6] : [1, .5 + Math.random() * .3, .15], s: .45, life: .7, vy: rand(1.5, 3), drag: 1 }); } },
  stoneProgress(S) { return ['st_light', 'st_dark', 'st_wisdom', 'st_spirit'].map(k => ({ id: k, have: !!(S.inv[k]) })); }
};

/* ---- hair styles for jobs ---- */
JW.longHair = (g, C) => { g.box(0, .05, -.36, .9, 1.3, .16, C.hair); for (const s of [-1, 1]) g.box(s * .44, .05, -.06, .12, 1.0, .3, C.hair); g.cone(0, -.6, -.38, 0, -1, 0, .3, .5, 5, C.hair2); };
JW.ponytail = (g, C) => { g.sphere(0, .45, -.5, .14, C.hair2, 6, 4); g.cone(0, .4, -.55, 0, -1, -.45, .14, 1.1, 5, C.hair); g.cone(0, .4, -.55, .2, -1, -.35, .1, .9, 4, C.hair3); };
JW.braid = (g, C) => { for (let i = 0; i < 6; i++) g.sphere(.38 - i * .02, .3 - i * .17, -.3 + i * .03, .11 - i * .005, i % 2 ? C.hair : C.hair2, 6, 4); };
JW.twintails = (g, C) => { for (const s of [-1, 1]) { g.sphere(s * .5, .5, -.1, .13, C.hair2, 6, 4); g.cone(s * .5, .45, -.1, s * .3, -1, -.1, .12, .95, 5, C.hair); } };
{ const H = { paladin: 'longHair', creator: 'twintails', stalker: 'ponytail', sniper: 'ponytail', minstrel: 'longHair', professor: 'longHair', highpriest: 'braid', highwizard: 'ponytail', whitesmith: 'braid', champion: null, lordknight: null, assassinx: null };
  for (const k in H) if (H[k]) { const o = OUTFITS[k], prev = o.add.head; o.add.head = (g, C, O) => { prev && prev(g, C, O); JW[H[k]](g, C); }; } }

/* ---- extra pose clips (emotes) ---- */
Object.assign(CLIPS, {
  bow: { dur: 1.4, hit: 1, keys: [[0, {}], [.3, { chest: [.9, 0, 0], head: [.3, 0, 0], shR: [.4, 0, -.3], shL: [.4, 0, .3] }], [.7, { chest: [.9, 0, 0], head: [.3, 0, 0], shR: [.4, 0, -.3], shL: [.4, 0, .3] }], [1, {}]] },
  laugh: { dur: 1.3, hit: 1, keys: [[0, {}], [.2, { chest: [-.25, 0, 0], head: [-.4, 0, .1], shR: [-.3, 0, -.5], elR: [-1.8, 0, 0], shL: [.3, 0, .4] }], [.45, { chest: [-.15, 0, 0], head: [-.3, 0, -.1], shR: [-.3, 0, -.5], elR: [-1.8, 0, 0], shL: [.3, 0, .4], root: { y: -.04 } }], [.7, { chest: [-.25, 0, 0], head: [-.4, 0, .1], shR: [-.3, 0, -.5], elR: [-1.8, 0, 0], shL: [.3, 0, .4] }], [1, {}]] },
  flex: { dur: 1.5, hit: 1, keys: [[0, {}], [.3, { shR: [-1.5, 0, -1.3], elR: [-2.2, 0, 0], shL: [-1.5, 0, 1.3], elL: [-2.2, 0, 0], chest: [-.1, 0, 0], head: [-.1, 0, 0], thL: [0, 0, .25], thR: [0, 0, -.25], root: { y: -.06 } }], [.8, { shR: [-1.5, 0, -1.3], elR: [-2.3, 0, 0], shL: [-1.5, 0, 1.3], elL: [-2.3, 0, 0], chest: [-.12, 0, 0], thL: [0, 0, .25], thR: [0, 0, -.25], root: { y: -.06 } }], [1, {}]] },
  sad: { dur: 1.8, hit: 1, keys: [[0, {}], [.3, { chest: [.4, 0, 0], head: [.5, 0, 0], shR: [.3, 0, -.1], shL: [.3, 0, .1], root: { y: -.05 } }], [.8, { chest: [.4, 0, 0], head: [.5, 0, .15], shR: [.3, 0, -.1], shL: [.3, 0, .1], root: { y: -.05 } }], [1, {}]] },
  angry: { dur: 1.4, hit: 1, keys: [[0, {}], [.25, { chest: [-.1, 0, 0], head: [.15, 0, 0], shR: [-2.6, 0, -.3], elR: [-.8, 0, 0], shL: [.3, 0, .3], thL: [-.3, 0, 0], root: { y: -.08 } }], [.4, { chest: [.25, 0, 0], head: [.2, 0, 0], shR: [-1.4, 0, -.2], elR: [-.3, 0, 0], shL: [.3, 0, .3], thL: [-.4, 0, 0], knL: [.5, 0, 0], root: { y: -.12 } }], [.6, { chest: [-.1, 0, 0], head: [.15, 0, 0], shR: [-2.6, 0, -.3], elR: [-.8, 0, 0], shL: [.3, 0, .3], root: { y: -.08 } }], [.75, { chest: [.25, 0, 0], shR: [-1.4, 0, -.2], shL: [.3, 0, .3], thL: [-.4, 0, 0], knL: [.5, 0, 0], root: { y: -.12 } }], [1, {}]] },
  love: { dur: 1.6, hit: 1, keys: [[0, {}], [.3, { shR: [-1.6, .4, -.3], elR: [-2.2, 0, 0], shL: [-1.6, -.4, .3], elL: [-2.2, 0, 0], head: [.1, 0, .2], chest: [.05, 0, .05], root: { y: -.03 } }], [.75, { shR: [-1.6, .4, -.3], elR: [-2.2, 0, 0], shL: [-1.6, -.4, .3], elL: [-2.2, 0, 0], head: [.1, 0, -.2], chest: [.05, 0, -.05], root: { y: -.03 } }], [1, {}]] },
  good: { dur: 1.3, hit: 1, keys: [[0, {}], [.3, { shR: [-1.9, 0, -.5], elR: [-1.2, 0, 0], head: [0, .3, -.1], chest: [0, .2, 0] }], [.75, { shR: [-1.9, 0, -.5], elR: [-1.2, 0, 0], head: [0, .3, -.1], chest: [0, .2, 0] }], [1, {}]] },
  thanks: { dur: 1.5, hit: 1, keys: [[0, {}], [.3, { shR: [-1.0, .55, -.1], elR: [-1.7, 0, 0], shL: [-1.0, -.55, .1], elL: [-1.7, 0, 0], head: [.35, 0, 0], chest: [.25, 0, 0] }], [.8, { shR: [-1.0, .55, -.1], elR: [-1.7, 0, 0], shL: [-1.0, -.55, .1], elL: [-1.7, 0, 0], head: [.35, 0, 0], chest: [.25, 0, 0] }], [1, {}]] },
  dance: { dur: 2.2, hit: 1, keys: [[0, {}], [.15, { shR: [-2.4, 0, -.6], shL: [.4, 0, .6], chest: [0, .4, .1], hips: [0, -.3, 0], thL: [-.3, 0, .3], root: { y: -.05 } }], [.35, { shR: [.4, 0, -.6], shL: [-2.4, 0, .6], chest: [0, -.4, -.1], hips: [0, .3, 0], thR: [-.3, 0, -.3], root: { y: -.05 } }], [.55, { shR: [-2.4, 0, -.6], shL: [.4, 0, .6], chest: [0, .4, .1], hips: [0, -.3, 0], thL: [-.3, 0, .3], root: { y: -.05 } }], [.75, { shR: [.4, 0, -.6], shL: [-2.4, 0, .6], chest: [0, -.4, -.1], hips: [0, .3, 0], thR: [-.3, 0, -.3], root: { y: -.05 } }], [.9, { shR: [-2.6, 0, -.3], shL: [-2.6, 0, .3], root: { y: .25, spin: TAU } }], [1, { root: { spin: TAU } }]] },
  sit: { dur: 3.0, hit: 1, keys: [[0, {}], [.15, { thL: [-1.5, 0, .35], thR: [-1.5, 0, -.35], knL: [1.5, 0, 0], knR: [1.5, 0, 0], shL: [-.3, 0, .3], shR: [-.3, 0, -.3], elL: [-.9, 0, 0], elR: [-.9, 0, 0], chest: [.1, 0, 0], root: { y: -.5 } }], [.85, { thL: [-1.5, 0, .35], thR: [-1.5, 0, -.35], knL: [1.5, 0, 0], knR: [1.5, 0, 0], shL: [-.3, 0, .3], shR: [-.3, 0, -.3], elL: [-.9, 0, 0], elR: [-.9, 0, 0], chest: [.1, 0, 0], root: { y: -.5 } }], [1, {}]] },
  point: { dur: 1.3, hit: 1, keys: [[0, {}], [.3, { shR: [-1.5, 0, -.1], elR: [0, 0, 0], chest: [0, -.2, 0], head: [0, -.2, 0] }], [.75, { shR: [-1.5, 0, -.1], elR: [0, 0, 0], chest: [0, -.2, 0], head: [0, -.2, 0] }], [1, {}]] },
  kneel: { dur: 2.0, hit: 1, keys: [[0, {}], [.2, { thL: [-1.4, 0, .1], knL: [1.5, 0, 0], thR: [.3, 0, -.1], knR: [1.5, 0, 0], chest: [.3, 0, 0], head: [.3, 0, 0], shR: [-.4, 0, -.2], elR: [-.9, 0, 0], shL: [.2, 0, .3], root: { y: -.42 } }], [.85, { thL: [-1.4, 0, .1], knL: [1.5, 0, 0], thR: [.3, 0, -.1], knR: [1.5, 0, 0], chest: [.3, 0, 0], head: [.3, 0, 0], shR: [-.4, 0, -.2], elR: [-.9, 0, 0], shL: [.2, 0, .3], root: { y: -.42 } }], [1, {}]] },
  victory: { dur: 1.6, hit: 1, keys: [[0, {}], [.2, { thL: [-.4, 0, 0], knL: [.8, 0, 0], thR: [-.4, 0, 0], knR: [.8, 0, 0], root: { y: -.18 } }], [.4, { shR: [-2.8, 0, -.2], elR: [-.2, 0, 0], shL: [-1.2, 0, .5], elL: [-1.6, 0, 0], head: [-.3, 0, 0], chest: [-.15, 0, 0], thL: [-.5, 0, 0], knL: [1.0, 0, 0], root: { y: .7, spin: TAU } }], [.65, { shR: [-2.8, 0, -.2], elR: [-.2, 0, 0], shL: [-1.2, 0, .5], elL: [-1.6, 0, 0], head: [-.3, 0, 0], thL: [-.5, 0, 0], knL: [1.0, 0, 0], root: { y: .2, spin: TAU } }], [.85, { shR: [-2.8, 0, -.2], shL: [-1.2, 0, .5], thL: [-.3, 0, .1], knL: [.5, 0, 0], thR: [-.3, 0, -.1], knR: [.5, 0, 0], root: { y: -.1, spin: TAU } }], [1, { root: { spin: TAU } }]] }
});
const EMOTE_CLIP = { wave: null, cheer: 'cheer', laugh: 'laugh', love: 'love', good: 'good', thanks: 'thanks', sad: 'sad', angry: 'angry', bow: 'bow', flex: 'flex', dance: 'dance', sit: 'sit', point: 'point', kneel: 'kneel', victory: 'victory' };

