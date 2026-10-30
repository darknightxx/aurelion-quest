/* ============================================================
   Thai ghosts: 3D models (rigged chibi + custom creatures),
   temple NPC models, draw functions
   ============================================================ */
const GHC = {
  pale: hexc('#e6e4dc'), pale2: hexc('#d6dde0'), blue: hexc('#c4d2da'), green: hexc('#cfe0c4'), gray: hexc('#a8a49c'), dark: hexc('#7a5a44'), gold: hexc('#e2b54a'), gold2: hexc('#b8862e'),
  black: hexc('#16141a'), hair: hexc('#1c1a20'), white: hexc('#f4f0e6'), red: hexc('#b8282a'), lip: hexc('#c0283a'), blood: hexc('#7a1018'), tan: hexc('#c89a74'), bark: hexc('#54463a')
};
/* parameterized chibi humanoid on the shared BONES skeleton */
function buildGChar(R, o) {
  const parts = {}; let seed = 900;
  const mk = (bone, fn) => { const g = new Geo(seed++); g.jit = .02; fn(g); if (g.d.length) { g.smoothNormals(58); parts[bone] = R.mesh(g); } };
  const skin = o.skin || GHC.pale, hair = o.hair || GHC.hair;
  // hips: skirt / pants / loincloth / robe
  mk('hips', g => {
    if (o.pants) g.box(0, -.04, 0, .36, .2, .25, o.pants);
    if (o.belt) { g.cyl(0, 0, 0, .2, .2, .07, 10, o.belt); }
    if (o.skirt) {
      const L = o.skirtLen || .82; g.cyl(0, -L, 0, o.skirtW || .34, .21, L, 12, o.skirt, null, true);
      if (o.trim) g.cyl(0, -L, 0, (o.skirtW || .34) + .01, (o.skirtW || .34) - .02, .07, 12, o.trim, null, true);
      g.box(0, -L * .5, .2, .12, L * .9, .03, shade(o.skirt, .8));
      if (o.tatter) for (let i = 0; i < 9; i++) { const a = i / 9 * TAU; g.cone(Math.cos(a) * (o.skirtW || .34) * .9, -L, Math.sin(a) * (o.skirtW || .34) * .9, Math.cos(a) * .3, -1, Math.sin(a) * .3, .07, .3 + (i % 3) * .12, 3, o.skirt); }
    }
    if (o.loin) { g.box(0, -.06, 0, .38, .2, .27, o.loin); g.box(0, -.26, .14, .16, .34, .04, o.loin); g.box(0, -.22, -.14, .2, .3, .04, shade(o.loin, .85)); }
    if (o.pakao) for (let i = 0; i < 6; i++) g.box(-.15 + i * .06, .02, .14, .055, .09, .04, i % 2 ? hexc('#c83a3a') : hexc('#f4ead2'));
    if (o.pestle) { g.push(0, -.1, -.15, -1.2, 0, 0); g.cyl(0, 0, 0, .06, .08, 1.5, 6, hexc('#7a5a3a')); g.cyl(0, 1.45, 0, .09, .09, .15, 6, hexc('#5a3a24')); g.pop(); }
    if (o.bells) for (let i = 0; i < 5; i++) { const a = -.6 + i * .3; g.sphere(Math.sin(a) * .22, -.1, Math.cos(a) * .22, .06, GHC.gold, 5, 3); }
    if (o.robe) { g.cyl(0, -.62, 0, .32, .22, .62, 12, o.robe, null, true); g.box(-.08, -.32, .2, .1, .6, .03, shade(o.robe, .85)); }
  });
  mk('chest', g => {
    g.cyl(0, 0, 0, .2, .17, .42, 10, o.top || skin);
    g.cyl(0, .4, 0, .07, .07, o.headless ? .02 : .08, 6, skin);
    if (o.ribs) for (let i = 0; i < 3; i++) g.cyl(0, .1 + i * .08, .01, .205 - i * .01, .2 - i * .01, .02, 10, shade(skin, .82), null, true);
    if (o.sabai) { g.push(0, .2, 0, 0, 0, .62); g.box(0, 0, .02, .12, .62, .44, o.sabai); g.pop(); g.cyl(0, .02, 0, .212, .19, .2, 10, o.sabai); if (o.trim) g.cyl(0, .2, 0, .214, .212, .03, 10, o.trim, null, true); }
    if (o.necklace) g.cyl(0, .36, 0, .14, .14, .03, 10, o.necklace, null, true);
    if (o.qing) { g.cyl(0, -.02, 0, .23, .2, .46, 10, o.qing); g.box(0, .18, .2, .22, .22, .03, GHC.gold2); g.box(0, .18, .215, .14, .14, .02, hexc('#3a6ad2')); }
    if (o.monk) { g.push(0, .12, 0, 0, 0, -.5); g.box(0, 0, 0, .46, .5, .43, o.monk); g.pop(); g.cyl(0, -.02, 0, .21, .18, .32, 10, o.monk); g.ell(.12, .34, -.02, .14, .08, .17, o.monk, 6, 4); }
    if (o.patch) for (let i = 0; i < 5; i++) g.cyl(0, i * .085, 0, .205, .2, .085, 10, o.patch[i % o.patch.length], null, true);
    if (o.shirt) { g.cyl(0, .02, 0, .21, .18, .36, 10, o.shirt); }
    if (o.vest) { g.cyl(0, .02, 0, .212, .19, .36, 10, o.vest); g.box(0, .18, .19, .05, .34, .03, shade(o.vest, .7)); }
    if (o.headless) { g.cyl(0, .41, 0, .075, .075, .03, 8, GHC.blood); g.cyl(0, .43, 0, .05, .05, .02, 8, hexc('#e8b0a0')); }
    if (o.band) { g.push(0, .2, 0, 0, 0, .6); g.box(0, 0, .2, .06, .55, .03, o.band); g.pop(); }
    if (o.floatHair) { g.push(0, .3, -.24, .1, 0, 0); g.box(0, -.4, 0, .5, .9, .12, hair); g.pop(); }
  });
  if (!o.headless) mk('head', g => {
    g.jit = 0; g.ell(0, .42, 0, .5, .48, .49, skin, 18, 12); g.jit = .03;
    if (o.mouth === 'lips') g.ell(0, .2, .455, .07, .028, .02, o.lip || GHC.lip, 6, 3);
    else if (o.mouth === 'needle') g.ell(0, .18, .47, .018, .018, .02, GHC.black, 4, 3);
    else if (o.mouth === 'grin') { g.ell(0, .18, .45, .16, .05, .03, GHC.black, 8, 3); for (let i = 0; i < 5; i++) g.box(-.1 + i * .05, .2, .47, .025, .04, .01, GHC.white); }
    else if (o.mouth === 'tongue') { g.ell(0, .18, .45, .1, .05, .03, GHC.black, 8, 3); g.push(0, .16, .47, .25, 0, 0); g.box(0, -.18, 0, .07, .38, .02, GHC.red); g.pop(); }
    else if (o.mouth !== 'none') g.ell(0, .2, .455, .04, .018, .02, hexc('#5a2a2a'), 5, 3);
    for (const s of [-1, 1]) g.ell(s * .49, .4, 0, .05, .09, .07, skin, 5, 4);
    if (o.beard) { g.cone(0, .2, .32, 0, -1, .25, .26, .9, 7, GHC.white); g.ell(0, .2, .38, .3, .14, .1, GHC.white, 8, 4); for (const s of [-1, 1]) g.ell(s * .19, .6, .43, .11, .04, .03, GHC.white, 5, 3); }
    // hair styles
    const H = o.hairStyle || 'long';
    if (H === 'long' || H === 'mid' || H === 'front' || H === 'wild') {
      g.sphereSkip(0, .47, -.03, .53, hair, 14, 10, c => (c[2] > .12 && c[1] < .2 && H !== 'front') || c[1] < -.32);
      for (let i = 0; i < 7; i++) { const x = -.36 + i * .12; g.cone(x, .72 - Math.abs(x) * .25, .3 + (.36 - Math.abs(x)) * .15, x * .3, -1, .3, .09, .26, 4, hair); }
      g.box(0, .05, -.36, .92, (H === 'mid' ? .9 : 1.25), .16, hair);
      for (const s of [-1, 1]) g.box(s * .44, .1, -.06, .12, .9, .32, hair);
      if (H === 'front') for (let i = 0; i < 9; i++) { const x = -.36 + i * .09; g.box(x, .05, .47 + (i % 2) * .02, .08, 1.05 - Math.abs(x) * .4, .04, shade(hair, .9 + (i % 3) * .1)); }
      if (H === 'wild') for (let i = 0; i < 26; i++) { const a = i / 26 * TAU, e = (i % 3) * .35; g.cone(Math.cos(a) * .4, .55 + e * .3, Math.sin(a) * .4 - .05, Math.cos(a), .5 + e, Math.sin(a), .1, .5, 4, hair); }
    }
    if (H === 'bald') { /* nothing */ }
    if (H === 'ring') { g.sphereSkip(0, .42, -.02, .51, hair, 14, 10, c => c[1] > .1 || c[2] > .05 || c[1] < -.3); }
    if (H === 'short') g.sphereSkip(0, .47, -.03, .52, hair, 14, 10, c => (c[2] > .15 && c[1] < .25) || c[1] < -.18);
    if (H === 'topknot') { g.sphereSkip(0, .47, -.03, .51, hair, 14, 10, c => c[1] < .32); g.sphere(0, .98, 0, .14, hair, 8, 6); g.cyl(0, .9, 0, .1, .1, .05, 8, GHC.gold, null, true); }
    if (o.head === 'chada') {
      g.cyl(0, .74, 0, .52, .5, .12, 14, GHC.gold, null, true);
      for (let i = 0; i < 4; i++) g.cyl(0, .86 + i * .22, 0, .42 - i * .09, .34 - i * .09, .22, 10, i % 2 ? GHC.gold : GHC.gold2);
      g.cone(0, 1.72, 0, 0, 1, 0, .1, .7, 6, GHC.gold); for (const s of [-1, 1]) { g.push(s * .5, .55, -.05, 0, 0, s * -.3); g.box(0, .1, 0, .06, .5, .3, GHC.gold2); g.pop(); }
      g.box(0, .86, .43, .2, .14, .04, hexc('#c8323a'));
    }
    if (o.head === 'qinghat') {
      g.cyl(0, .78, 0, .58, .58, .07, 14, hexc('#2a2430')); g.ell(0, .86, 0, .42, .2, .42, hexc('#3a3040'), 12, 6); g.sphere(0, 1.08, 0, .09, GHC.red, 6, 4);
      g.cone(0, .98, -.1, 0, .4, -1, .05, .8, 4, hexc('#3a6a5a'));
      g.box(0, .48, .58, .26, .5, .02, hexc('#f0d040')); for (let i = 0; i < 4; i++) g.box(0, .66 - i * .1, .592, .18 - (i % 2) * .06, .02, .01, GHC.red);
    }
    if (o.head === 'band') g.cyl(0, .64, 0, .535, .53, .1, 14, o.bandCol || GHC.red, null, true);
    if (o.head === 'takhon') {
      g.ell(0, .42, .1, .64, .74, .5, hexc('#e8d24a'), 14, 10);
      for (let i = 0; i < 6; i++) g.ell(-.4 + i * .16, .78, .3 + (i % 2) * .05, .1, .14, .05, i % 2 ? hexc('#d8323a') : hexc('#2a8a4a'), 6, 4);
      for (const s of [-1, 1]) { g.ell(s * .25, .52, .52, .16, .14, .08, GHC.white, 8, 5); g.ell(s * .25, .52, .58, .07, .07, .04, GHC.black, 6, 4); g.ell(s * .25, .7, .5, .2, .05, .05, hexc('#d8323a'), 6, 3); }
      g.cone(0, .45, .58, 0, -.25, 1, .14, .55, 6, hexc('#d8323a')); g.cone(0, .32, 1.08, 0, 1, .35, .07, .34, 5, hexc('#d8323a'));
      g.ell(0, .12, .5, .26, .08, .06, GHC.black, 8, 3); for (let i = 0; i < 6; i++) g.box(-.15 + i * .06, .15, .55, .035, .07, .02, GHC.white);
      g.cyl(0, .9, 0, .38, .62, .68, 12, hexc('#c8a86a')); for (let i = 0; i < 4; i++) g.cyl(0, .96 + i * .15, 0, .45 + i * .045, .47 + i * .045, .05, 12, hexc('#8a6a3a'), null, true);
      for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; g.box(Math.cos(a) * .62, 1.55, Math.sin(a) * .62, .08, .2, .02, i % 3 === 0 ? hexc('#d8323a') : i % 3 === 1 ? hexc('#2a6ad2') : hexc('#2a8a4a')); }
    }
  });
  // eyes (separate so they can glow): centred at bone origin
  if (!o.headless && o.head !== 'takhon') mk('eyes', g => {
    const E = o.eyes || 'normal';
    for (const s of [-1, 1]) {
      if (E === 'hollow') { g.ell(s * .185, 0, .43, .11, .13, .05, GHC.black, 8, 6); g.ell(s * .185, -.01, .47, .03, .03, .01, o.eyeCol || [1, 1, 1], 5, 3); }
      else if (E === 'glow') { g.ell(s * .185, 0, .44, .1, .11, .05, o.eyeCol || [1, .2, .1], 8, 6); }
      else if (E === 'closed') g.box(s * .18, -.02, .47, .14, .025, .02, hexc('#3a2a24'));
      else if (E === 'big') { g.ell(s * .2, .02, .42, .14, .16, .06, GHC.white, 8, 6); g.ell(s * .2, .0, .47, .04, .04, .02, GHC.black, 5, 3); }
      else { g.ell(s * .185, 0, .43, .1, .14, .05, hexc('#3a1a10'), 8, 6); g.ell(s * .185, -.05, .47, .075, .075, .02, o.eyeCol || hexc('#7a3a2a'), 7, 4); g.ell(s * .155, .045, .478, .03, .035, .012, [1, 1, 1], 5, 3); }
      if (o.brow) { g.push(s * .18, .13, .44, 0, 0, s * o.brow); g.box(0, 0, 0, .15, .025, .03, hexc('#2a2020')); g.pop(); }
    }
    if (o.nose) g.ell(0, -.12, .5, .07, .06, .05, o.nose, 6, 4);
  });
  const sleeve = o.sleeve || skin;
  const armU = g => { g.cyl(0, -.24, 0, .062, .072, .24, 7, sleeve); g.sphere(0, 0, 0, .075, sleeve, 6, 4); if (o.armlet) g.cyl(0, -.12, 0, .075, .075, .04, 7, o.armlet, null, true); };
  const armL = (g, side) => {
    g.cyl(0, -.2, 0, .052, .062, .2, 7, o.fore || skin); g.sphere(0, -.25, 0, .07, o.hand || skin, 6, 5);
    if (o.nails) for (let i = 0; i < 4; i++) g.cone(-.04 + i * .027, -.3, .03, 0, -1, .3, .012, .26, 3, o.nails);
    if (o.claws) for (let i = 0; i < 4; i++) g.cone(-.04 + i * .027, -.3, .03, 0, -1, .5, .015, .16, 3, hexc('#2a2420'));
  };
  mk('shL', armU); mk('shR', armU);
  mk('elL', g => {
    armL(g, 1);
    // held head is drawn separately (it can be thrown)
    if (o.baby) { g.push(.04, -.3, .12, 0, 0, 0); g.ell(0, 0, 0, .2, .17, .28, hexc('#e8e0d0'), 10, 6); g.ell(0, .05, .2, .09, .09, .07, hexc('#d8c8c0'), 7, 5); g.pop(); }
    if (o.fan) { g.push(0, -.28, .05, 0, 0, 0); g.cyl(0, -.05, 0, .015, .015, .5, 4, hexc('#8a5a2a')); g.push(0, .5, 0, Math.PI / 2, 0, 0); g.ell(0, 0, 0, .22, .3, .02, o.fan, 10, 4); g.pop(); g.pop(); }
  });
  mk('elR', g => {
    armL(g, -1);
    if (o.sword) { g.push(0, -.26, 0, Math.PI / 2); g.box(0, .45, 0, .07, .7, .025, hexc('#8a8478')); g.box(0, .45, .016, .02, .66, .01, hexc('#5a5248')); g.box(0, .08, 0, .22, .04, .08, GHC.gold2); g.cyl(0, -.1, 0, .03, .03, .18, 5, hexc('#3a2a24')); g.pop(); }
    if (o.cane) g.cyl(0, -.95, 0, .035, .04, 1.4, 6, hexc('#8a6a3a'));
    if (o.shovel) { g.cyl(0, -.9, 0, .03, .03, 1.5, 5, hexc('#8a6a3a')); g.box(0, -.98, 0, .2, .26, .02, hexc('#6a6a6a')); }
  });
  if (o.legs !== false) {
    const legU = g => { g.cyl(0, -.3, 0, .085, .095, .3, 8, o.pants || o.legCol || skin); };
    const legL = g => { g.cyl(0, -.28, 0, .072, .082, .28, 8, o.shin || o.legCol || skin); g.box(0, -.335, .045, .15, .11, .25, o.feet || o.shin || o.legCol || skin); };
    if (o.oneLeg) { mk('thR', legU); mk('knR', legL); } else { mk('thL', legU); mk('thR', legU); mk('knL', legL); mk('knR', legL); }
  }
  mk('cape', g => {
    if (o.hairLen) { g.box(0, -o.hairLen / 2, -.06, .78, o.hairLen, .1, hair); g.cone(0, -o.hairLen, -.06, 0, -1, 0, .3, .4, 5, hair); }
    if (o.shawl) { g.box(0, -.35, -.02, .5, .7, .03, o.shawl); }
  });
  return parts;
}

/* rig parts specs: ghosts + temple NPCs */
const GCHAR_SPECS = {
  takhian: { skin: GHC.pale, sabai: hexc('#7a1e2a'), trim: GHC.gold, skirt: hexc('#2a4a3a'), skirtLen: .95, tatter: 1, legs: false, mouth: 'lips', eyes: 'hollow', eyeCol: [1, .3, .3], hairStyle: 'long', hairLen: 1.7, necklace: GHC.gold, armlet: GHC.gold, nails: GHC.gold },
  tani: { skin: GHC.green, sabai: hexc('#4a9a4a'), trim: hexc('#c8e070'), skirt: hexc('#2e6a36'), skirtLen: .95, tatter: 1, legs: false, mouth: 'lips', lip: hexc('#d0203a'), eyes: 'normal', eyeCol: hexc('#2a5a2a'), hairStyle: 'long', hairLen: 1.4, necklace: GHC.gold, armlet: GHC.gold, fan: hexc('#5aa040') },
  nangram: { skin: hexc('#f2efe8'), sabai: hexc('#c8a03a'), trim: hexc('#e8323a'), top: hexc('#a8282a'), skirt: hexc('#7a1a2a'), trim2: GHC.gold, skirtLen: .62, legCol: hexc('#f2efe8'), feet: hexc('#f2efe8'), pants: hexc('#7a1a2a'), mouth: 'lips', eyes: 'hollow', eyeCol: [1, .85, .4], hairStyle: 'short', head: 'chada', nails: GHC.gold, necklace: GHC.gold, armlet: GHC.gold },
  maenak: { skin: GHC.blue, sabai: hexc('#3a2a44'), trim: hexc('#6a5a7a'), skirt: hexc('#1e1a26'), skirtLen: .9, tatter: 1, legs: false, mouth: 'dark', eyes: 'hollow', eyeCol: [.6, .9, 1], hairStyle: 'long', hairLen: 1.9, baby: 1, nails: hexc('#c8d8e0') },
  phrai: { skin: hexc('#b8c8cc'), top: hexc('#d8dcd8'), skirt: hexc('#c8ccc8'), skirtLen: .9, tatter: 1, legs: false, mouth: 'none', eyes: 'hollow', eyeCol: [.6, 1, 1], hairStyle: 'front', hair: hexc('#141820'), hairLen: 1.2 },
  pop: { skin: hexc('#9a9a8a'), top: hexc('#4a3a30'), skirt: hexc('#3a2e26'), skirtLen: .5, tatter: 1, legCol: hexc('#8a8a7a'), mouth: 'tongue', eyes: 'glow', eyeCol: [1, .15, .1], hairStyle: 'wild', hair: hexc('#d8d4c8'), claws: 1 },
  huakhat: { skin: hexc('#c8a888'), headless: 1, holdHead: 1, top: hexc('#8a2a22'), vest: hexc('#6a1e1a'), band: hexc('#d8c070'), pants: hexc('#2a2420'), shin: hexc('#c8a888'), feet: hexc('#b89878'), sword: 1, belt: GHC.gold2 },
  pusom: { skin: hexc('#e0c8a8'), top: GHC.white, shirt: GHC.white, robe: GHC.white, pants: GHC.white, shin: hexc('#e0c8a8'), feet: hexc('#d8b898'), mouth: 'dark', eyes: 'glow', eyeCol: [1, .85, .3], hairStyle: 'ring', hair: GHC.white, beard: 1, brow: .3, cane: 1 },
  phidip: { skin: hexc('#9ab89a'), qing: hexc('#1e2a44'), sleeve: hexc('#1e2a44'), fore: hexc('#1e2a44'), skirt: hexc('#1e2a44'), skirtLen: .62, pants: hexc('#1e2a44'), legCol: hexc('#1a1a20'), feet: hexc('#141418'), mouth: 'dark', eyes: 'glow', eyeCol: [.7, 1, .7], hairStyle: 'short', head: 'qinghat', nails: hexc('#2a3a2a') },
  takhon: { skin: hexc('#c89a74'), patch: [hexc('#d8323a'), hexc('#2a6ad2'), hexc('#e8c53a'), hexc('#2a8a4a')], sleeve: hexc('#e8c53a'), pants: hexc('#2a6ad2'), legCol: hexc('#d8323a'), feet: hexc('#5a3a24'), head: 'takhon', hairStyle: 'none', bells: 1, mouth: 'none' },
  phong: { skin: hexc('#7a5a44'), loin: hexc('#9a2a22'), legCol: hexc('#7a5a44'), feet: hexc('#6a4a34'), mouth: 'grin', eyes: 'glow', eyeCol: [1, .4, .1], nose: [1, .3, .1], hairStyle: 'short', hair: hexc('#1a1410'), ribs: 1 },
  krahang: { skin: hexc('#9a7a5a'), loin: hexc('#a83a22'), legCol: hexc('#9a7a5a'), feet: hexc('#8a6a4a'), mouth: 'grin', eyes: 'glow', eyeCol: [1, .5, .1], hairStyle: 'short', hair: hexc('#1a1410'), pestle: 1 },
  tabo: { skin: hexc('#d8d4cc'), top: hexc('#e4e0d6'), skirt: hexc('#d4d0c6'), skirtLen: .82, tatter: 1, legCol: hexc('#d8d4cc'), feet: hexc('#c8c4bc'), mouth: 'dark', eyes: 'hollow', eyeCol: [.9, .9, 1], hairStyle: 'long', hair: hexc('#ece8e0'), hairLen: .9, cane: 1 },
  monk: { skin: hexc('#e8c4a0'), monk: hexc('#d8822a'), robe: hexc('#d8822a'), sleeve: hexc('#e8c4a0'), legCol: hexc('#e8c4a0'), feet: hexc('#e0b890'), mouth: 'dark', eyes: 'closed', hairStyle: 'bald', fan: hexc('#c8a050') },
  undertaker: { skin: hexc('#c8a080'), top: hexc('#ecebe4'), shirt: hexc('#ecebe4'), pants: hexc('#3a3632'), pakao: 1, legCol: hexc('#3a3632'), feet: hexc('#5a4a3a'), mouth: 'dark', eyes: 'normal', eyeCol: hexc('#3a2a20'), hairStyle: 'short', hair: hexc('#9a9690'), brow: .2, shovel: 1 },
  kuman: { skin: hexc('#f0c050'), loin: hexc('#c8282a'), pakao: 0, legCol: hexc('#f0c050'), feet: hexc('#e8b040'), mouth: 'lips', lip: hexc('#c84030'), eyes: 'normal', eyeCol: hexc('#5a3a10'), hairStyle: 'topknot', hair: hexc('#1a1410'), necklace: GHC.gold, armlet: GHC.gold }
};

/* ---------- custom creature models ---------- */
const GM = {};
function buildGhostModels(R) {
  const out = {}; const mk = fn => { const g = new Geo(910); g.jit = .03; fn(g); return R.mesh(g); };
  for (const k in GCHAR_SPECS) out['rig_' + k] = buildGChar(R, GCHAR_SPECS[k]);
  // krahang wings: winnowing baskets on the arms
  out.basket = mk(g => { g.cyl(0, 0, 0, .95, .95, .07, 16, hexc('#c8a466')); for (let i = 0; i < 4; i++) g.cyl(0, .07, 0, .9 - i * .22, .9 - i * .22, .015, 16, hexc('#9a7a44'), null, true); g.cyl(0, 0, 0, .97, .97, .1, 16, hexc('#8a6a3a'), null, true); });
  // pret: tall, thin, needle mouth
  const ps = hexc('#6e5e56'), ps2 = hexc('#5a4a44');
  out.pretBody = mk(g => {
    g.cyl(0, 2.3, 0, .32, .36, 1.1, 8, ps); for (let i = 0; i < 5; i++) g.cyl(0, 2.55 + i * .16, .02, .36 - i * .005, .35, .03, 8, shade(ps, .75), null, true);
    g.ell(0, 2.35, .12, .38, .34, .34, ps2, 8, 6); g.cyl(0, 1.95, 0, .3, .32, .4, 8, hexc('#3a2e28'));
    g.cyl(0, 3.4, 0, .1, .08, 1.2, 6, ps); g.ell(0, 4.85, .05, .34, .4, .34, ps, 10, 7);
    for (const s of [-1, 1]) { g.ell(s * .14, 4.92, .3, .12, .14, .06, GHC.black, 6, 4); }
    g.ell(0, 4.66, .33, .015, .015, .02, GHC.black, 4, 3);
    for (let i = 0; i < 9; i++) { const a = rand(0, TAU); g.cone(Math.cos(a) * .22, 5.1, Math.sin(a) * .22 - .05, Math.cos(a) * .3, -1, Math.sin(a) * .3 - .4, .02, 1.2 + Math.random() * .8, 3, GHC.hair); }
    g.cyl(0, 2.95, 0, .42, .3, .08, 8, hexc('#d8d0c0'), null, true);
  });
  out.pretEye = mk(g => { for (const s of [-1, 1]) g.sphere(s * .14, 4.92, .35, .045, [1, 1, 1], 5, 3); });
  out.pretLeg = mk(g => { g.cyl(0, -1.9, 0, .13, .17, 1.9, 6, ps); g.box(0, -1.95, .14, .22, .1, .42, ps2); g.sphere(0, -.95, 0, .14, ps, 6, 4); });
  out.pretArm = mk(g => { g.cyl(0, -1.0, 0, .09, .13, 1.0, 6, ps); g.sphere(0, -1.0, 0, .12, ps, 6, 4); g.cyl(0, -2.0, 0, .08, .09, 1.0, 6, ps); g.ell(0, -2.1, .05, .14, .2, .08, ps2, 6, 4); for (let i = 0; i < 4; i++) g.cone(-.06 + i * .04, -2.25, .06, 0, -1, .1, .025, .3, 3, ps2); });
  // krasue: head with dangling glowing organs
  out.krasueHead = mk(g => {
    g.ell(0, 0, 0, .42, .46, .42, hexc('#e8e0d8'), 14, 10); g.ell(0, -.18, .38, .06, .025, .02, GHC.lip, 5, 3);
    g.sphereSkip(0, .06, -.03, .45, GHC.hair, 14, 10, c => (c[2] > .12 && c[1] < .15) || c[1] < -.28); g.box(0, -.3, -.3, .8, .9, .12, GHC.hair);
    for (const s of [-1, 1]) g.box(s * .38, -.2, -.05, .1, .7, .3, GHC.hair);
    g.cyl(0, -.5, 0, .1, .12, .18, 8, hexc('#c8a0a0'));
  });
  out.krasueEye = mk(g => { for (const s of [-1, 1]) g.ell(s * .15, .02, .37, .08, .06, .04, [1, .3, .25], 6, 4); });
  out.krasueOrg = mk(g => { g.ell(0, -.75, .05, .17, .2, .15, hexc('#c8323a'), 8, 6); g.ell(.14, -.68, -.06, .13, .22, .1, hexc('#d86a7a'), 6, 5); g.ell(-.14, -.68, -.06, .13, .22, .1, hexc('#d86a7a'), 6, 5); g.ell(0, -1.02, -.02, .2, .14, .16, hexc('#a84a4a'), 7, 5); });
  out.krasueGut = mk(g => { g.ell(0, 0, 0, .085, .17, .085, hexc('#e08a90'), 6, 4); });
  // kong koi: one-legged hairy forest ghost with a proboscis
  const kk = hexc('#2a2622'), kk2 = hexc('#3a342e');
  out.kongBody = mk(g => {
    g.ell(0, 1.15, 0, .55, .6, .5, kk, 10, 8); for (let i = 0; i < 22; i++) { const a = i / 22 * TAU, e = (i % 3) * .3 - .2; g.cone(Math.cos(a) * .45, 1.15 + e, Math.sin(a) * .42, Math.cos(a), e, Math.sin(a), .1, .28, 3, kk2); }
    g.ell(0, 1.75, .1, .38, .36, .36, kk2, 10, 7); for (const s of [-1, 1]) { g.ell(s * .38, 1.95, 0, .08, .24, .16, kk, 6, 4); }
    g.cone(0, 1.7, .4, 0, -.35, 1, .07, .7, 5, hexc('#5a3a3a')); g.cone(0, 1.46, 1.06, 0, -1, .2, .04, .25, 4, hexc('#7a2a2a'));
    for (const s of [-1, 1]) { g.cyl(s * .48, 1.2, .1, .06, .05, .5, 5, kk2); g.push(s * .5, 1.25, .1, 0, 0, s * 2.2); g.cyl(0, 0, 0, .05, .04, .55, 5, kk2); g.pop(); }
  });
  out.kongEye = mk(g => { for (const s of [-1, 1]) g.sphere(s * .14, 1.83, .4, .07, [1, .2, .1], 5, 4); });
  out.kongLeg = mk(g => { g.cyl(0, -.65, 0, .13, .17, .65, 7, kk2); g.ell(0, -.68, .12, .2, .1, .32, kk, 7, 4); });
  // pong khang: langur-like ghost
  const pk = hexc('#1e1c20'), pkf = hexc('#d8d4cc');
  out.pongBody = mk(g => {
    g.ell(0, 1.1, 0, .5, .55, .7, pk, 10, 7); g.ell(0, 1.55, .58, .4, .4, .38, pk, 10, 7); g.ell(0, 1.5, .88, .27, .27, .14, pkf, 8, 5);
    g.ell(0, 1.42, .98, .14, .09, .06, hexc('#3a3236'), 6, 4); for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; g.cone(Math.cos(a) * .3, 1.62 + Math.sin(a) * .3, .74, Math.cos(a), Math.sin(a), -.2, .07, .22, 3, pk); }
  });
  out.pongEye = mk(g => { for (const s of [-1, 1]) g.sphere(s * .1, 1.58, .98, .055, [1, .1, .08], 5, 4); });
  out.pongArm = mk(g => { g.cyl(0, -.55, 0, .09, .12, .55, 6, pk); g.cyl(0, -1.1, 0, .08, .09, .55, 6, pk); g.ell(0, -1.12, .06, .1, .08, .14, hexc('#3a3236'), 6, 4); });
  out.pongLeg = mk(g => { g.cyl(0, -.7, 0, .11, .14, .7, 6, pk); g.ell(0, -.72, .1, .12, .08, .2, hexc('#3a3236'), 6, 4); });
  out.pongTail = mk(g => { g.cone(0, 0, 0, 0, .5, -1, .07, 1.6, 5, pk); g.cone(0, .7, -1.5, 0, 1, -.3, .05, .7, 4, pk); });
  // khamot: spirit flame
  out.khamot = mk(g => { g.sphere(0, 0, 0, .34, hexc('#9ff0d8'), 10, 7); for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; g.cone(Math.cos(a) * .2, .1, Math.sin(a) * .2, Math.cos(a) * .3, 1, Math.sin(a) * .3, .14, .55, 4, hexc('#6ad8c0')); } g.cone(0, .2, 0, 0, 1, 0, .2, .8, 5, hexc('#c8fff0')); for (const s of [-1, 1]) g.ell(s * .1, .02, .3, .05, .07, .02, hexc('#1a3a34'), 5, 3); });
  // phi chakla: black ghost cat
  const ck = hexc('#141218'), ck2 = hexc('#26222c');
  out.catBody = mk(g => {
    g.ell(0, .62, 0, .32, .3, .62, ck, 10, 7); for (let i = 0; i < 9; i++) g.cone(0, .86, .45 - i * .12, (i % 2 ? .3 : -.3), 1, -.2, .07, .22, 3, ck2);
    g.sphere(0, .92, .62, .3, ck, 10, 8); for (const s of [-1, 1]) { g.cone(s * .16, 1.12, .58, s * .3, 1, -.1, .1, .26, 4, ck); g.cone(s * .16, 1.14, .6, s * .3, 1, -.1, .05, .18, 4, hexc('#5a2a3a')); }
    g.ell(0, .84, .86, .12, .08, .08, ck2, 6, 4); for (const s of [-1, 1]) for (let i = 0; i < 3; i++) g.cone(s * .1, .85, .9, s, (i - 1) * .15, .1, .008, .32, 3, hexc('#c8c8d0'));
  });
  out.catEye = mk(g => { for (const s of [-1, 1]) g.ell(s * .12, .97, .87, .06, .07, .03, [.4, 1, .3], 6, 4); });
  out.catLeg = mk(g => { g.cyl(0, -.5, 0, .06, .08, .5, 5, ck); g.ell(0, -.5, .04, .07, .04, .09, ck2, 5, 3); });
  out.catTail = mk(g => { g.cone(0, 0, 0, 0, .6, -1, .06, .7, 5, ck); g.cone(0, .42, -.65, 0, 1, .2, .05, .5, 4, ck); });
  // suea saming: weretiger
  const to = hexc('#c8742a'), tw = hexc('#efe6d4'), tk = hexc('#1a1410');
  out.tigerBody = mk(g => {
    g.ell(0, 1.2, 0, .62, .58, 1.25, to, 12, 8); g.ell(0, 1.0, .2, .48, .4, .95, tw, 10, 6);
    for (let i = 0; i < 8; i++) { const z = -.95 + i * .27; for (const s of [-1, 1]) { g.push(s * .55, 1.35, z, 0, 0, s * .35); g.box(0, 0, 0, .07, .5, .1, tk); g.pop(); } g.box(0, 1.76, z, .5, .06, .08, tk); }
    g.sphere(0, 1.55, 1.25, .52, to, 12, 9); g.ell(0, 1.4, 1.65, .3, .22, .22, tw, 8, 5); g.ell(0, 1.47, 1.86, .1, .07, .05, hexc('#3a2420'), 6, 4);
    for (const s of [-1, 1]) { g.sphere(s * .36, 1.98, 1.15, .14, to, 6, 4); g.sphere(s * .36, 1.98, 1.2, .08, tk, 5, 3); g.push(s * .3, 1.75, 1.6, 0, 0, s * .4); g.box(0, 0, 0, .05, .2, .04, tk); g.pop(); }
    g.box(0, 1.92, 1.62, .06, .22, .04, tk); for (const s of [-1, 1]) g.cone(s * .1, 1.3, 1.82, 0, -1, .2, .04, .16, 3, tw);
  });
  out.tigerEye = mk(g => { for (const s of [-1, 1]) g.ell(s * .19, 1.68, 1.67, .08, .07, .04, [1, .85, .2], 6, 4); });
  out.tigerLeg = mk(g => { g.cyl(0, -.95, 0, .15, .19, .95, 7, to); g.ell(0, -.97, .1, .19, .1, .26, tw, 7, 4); for (let i = 0; i < 3; i++) g.box(0, -.3 - i * .22, .16, .3, .05, .05, tk); });
  out.tigerTail = mk(g => { g.cone(0, 0, 0, 0, .3, -1, .1, 1.3, 6, to); for (let i = 0; i < 4; i++) g.cyl(0, .08 + i * .1, -.3 - i * .25, .09, .09, .06, 6, tk, null, true); g.cone(0, .4, -1.25, 0, .6, -.6, .07, .4, 5, tk); });
  // cobra summon
  const sn = hexc('#5a6a2a'), sn2 = hexc('#d8c870');
  out.ngu = mk(g => {
    for (let i = 0; i < 14; i++) { const a = i / 14 * TAU * 1.2; g.sphere(Math.cos(a) * (.55 - i * .015), .16, Math.sin(a) * (.55 - i * .015), .17, i % 2 ? sn : shade(sn, .85), 6, 4); }
    for (let i = 0; i < 6; i++) g.sphere(0, .3 + i * .17, .15 + Math.sin(i * .5) * .05, .14 - i * .006, sn, 6, 4);
    g.ell(0, 1.3, .2, .32, .36, .07, sn, 10, 5); g.ell(0, 1.3, .24, .2, .26, .04, sn2, 8, 4); g.ell(0, 1.5, .32, .14, .1, .2, sn, 8, 5); g.cone(0, 1.47, .5, 0, -.3, 1, .02, .18, 3, GHC.red);
  });
  out.nguEye = mk(g => { for (const s of [-1, 1]) g.sphere(s * .08, 1.55, .44, .03, [1, .8, .1], 4, 3); });
  // flying head (huakhat throw), spirit hand (phrai), soul wisp
  out.hand = mk(g => { g.cyl(0, 0, 0, .14, .12, .8, 6, hexc('#b8c8cc')); g.ell(0, .9, 0, .18, .2, .1, hexc('#b8c8cc'), 7, 5); for (let i = 0; i < 4; i++) g.cone(-.12 + i * .08, 1.05, 0, (i - 1.5) * .15, 1, .2, .04, .35, 3, hexc('#b8c8cc')); g.cone(.18, .9, 0, 1, .6, 0, .045, .25, 3, hexc('#b8c8cc')); });
  out.flyHead = mk(g => { g.ell(0, 0, 0, .34, .33, .34, hexc('#c8a888'), 12, 8); g.cyl(0, .14, 0, .35, .34, .08, 12, GHC.red, null, true); g.sphereSkip(0, .03, -.02, .35, GHC.hair, 10, 7, c => c[2] > .05 || c[1] < -.1); g.cyl(0, -.32, 0, .07, .07, .05, 6, GHC.blood); g.box(-.11, .02, .32, .09, .02, .02, hexc('#3a2a24')); g.box(.11, .02, .32, .09, .02, .02, hexc('#3a2a24')); });
  out.armExt = mk(g => { g.cyl(0, 0, 0, .1, .1, 1, 7, GHC.blue, null, true); });
  out.post = mk(g => { g.cyl(0, 0, 0, .14, .12, 2.4, 7, hexc('#8a6a44')); for (let i = 0; i < 6; i++) g.cyl(0, 1.2 + i * .1, 0, .15, .15, .03, 7, GHC.white, null, true); g.cone(0, 2.4, 0, 0, 1, 0, .25, .5, 6, hexc('#5aa040')); g.ell(0, 2.1, 0, .3, .12, .3, hexc('#4a9a3a'), 8, 4); g.cyl(0, 0, 0, .4, .4, .12, 8, hexc('#6a5a44')); });
  return out;
}

/* ---------- temple NPCs use the same rig ---------- */
{
  const ob = buildCharModels;
  buildCharModels = function (R) { ob(R); for (const k of ['monk', 'undertaker', 'kuman']) CharModels[k] = buildGChar(R, GCHAR_SPECS[k]); };
}

/* ---------- draw helpers ---------- */
const _gm = M4.ident(), _gl = M4.ident();
const GHOST_EMIS = { tabo: [.12, .12, .14], takhian: [.12, .05, .06], tani: [.05, .12, .06], nangram: [.12, .09, .03], maenak: [.08, .12, .16], phrai: [.06, .12, .14], pop: [.05, .03, .03], huakhat: [.06, .03, .02], pusom: [.18, .14, .06], phidip: [.04, .08, .05], takhon: [.06, .05, .03], phong: [.06, .03, .02], krahang: [.06, .04, .02] };
const GhostDraw = {
  glowQ: [],
  glow(x, y, z, r, col) { if (this.glowQ.length < 120) this.glowQ.push({ x, y, z, r, col }); },
  // update the rig of a monster from its movement and pose it
  rig(m, dt) {
    if (!m.rig) { m.rig = new Rig('g_' + m.type); m.lx = m.x; m.lz = m.z; m.wph = 0; m.wamp = 0; }
    const d = Math.hypot(m.x - m.lx, m.z - m.lz); m.lx = m.x; m.lz = m.z;
    m.wph += d * TAU / 1.9; m.wamp = lerp(m.wamp, m.moving ? 1 : 0, Math.min(1, dt * 8));
    const fl = m.d.float || m.d.fly;
    m.rig.update(dt, { walk: fl ? 0 : m.wamp, ph: m.wph, speed: fl ? 0 : m.moving ? m.d.spd : 0, dead: false });
    return m.rig;
  },
  // draw rig parts with eye glow
  drawRig(R, m, parts, s, y, emis, eyeE, tint, fl, alpha = 1) {
    const rig = m.rig; rig.pose(m.x, y, m.z, m.face, s);
    for (let i = 0; i < BONES.length; i++) { const nm = BONES[i][0], mesh = parts[nm]; if (mesh) R.drawMesh(mesh, rig.world[i], tint, nm === 'eyes' ? eyeE : emis, fl, alpha); }
  },
  part(R, mesh, parentM, x, y, z, rx, ry, rz, s, tint, emis, fl) { M4.compose(_gl, x, y, z, rx, ry, rz, s, s, s); M4.mul(_gm, parentM, _gl); R.drawMesh(mesh, _gm, tint, emis, fl); }
};
// pose tweaks applied after rig.update for each humanoid ghost (a = rig angles)
const set = (rig, n, x, y, z) => { const a = rig.ang[BONE_IDX[n]]; a[0] = x; a[1] = y; a[2] = z; };
const GPOSE = {
  float(rig, m, t) { set(rig, 'shL', -.2 + Math.sin(t * 1.3) * .08, 0, .35); set(rig, 'shR', -.2 + Math.sin(t * 1.3 + 1) * .08, 0, -.35); set(rig, 'elL', -.4, 0, 0); set(rig, 'elR', -.4, 0, 0); },
  reach(rig, m, t) { set(rig, 'shL', -1.3, 0, .2); set(rig, 'shR', -1.3, 0, -.2); set(rig, 'elL', -.2, 0, 0); set(rig, 'elR', -.2, 0, 0); set(rig, 'head', .25, 0, Math.sin(t * .7) * .15); },
  jiangshi(rig, m, t) { set(rig, 'shL', -1.55, 0, .05); set(rig, 'shR', -1.55, 0, -.05); set(rig, 'elL', 0, 0, 0); set(rig, 'elR', 0, 0, 0); for (const n of ['thL', 'thR', 'knL', 'knR']) set(rig, n, 0, 0, 0); set(rig, 'head', 0, 0, 0); },
  hunched(rig, m, t) { const a = rig.ang[BONE_IDX.chest]; a[0] += .45; rig.ang[BONE_IDX.head][0] -= .35; set(rig, 'elL', -.9, 0, 0); set(rig, 'elR', -.9, 0, 0); },
  dance(rig, m, t) { const p = Math.sin(t * 2.2); set(rig, 'shL', -1.2 + p * .3, .4, 1.0); set(rig, 'elL', -1.7, .5, 0); set(rig, 'shR', -.6 - p * .3, -.4, -1.3); set(rig, 'elR', -1.4, -.4, 0); set(rig, 'head', 0, p * .2, p * .15); set(rig, 'chest', 0, -p * .15, p * .06); },
  holdHead(rig, m, t) { set(rig, 'shL', -.5, .2, .25); set(rig, 'elL', -1.4, 0, 0); },
  oldman(rig, m, t) { rig.ang[BONE_IDX.chest][0] += .18; set(rig, 'elR', -.5, 0, 0); },
  fly(rig, m, t) { const f = Math.sin(t * 9); set(rig, 'shL', -.2, 0, 1.2 + f * .5); set(rig, 'shR', -.2, 0, -1.2 - f * .5); set(rig, 'elL', -.2, 0, 0); set(rig, 'elR', -.2, 0, 0); set(rig, 'thL', .9, 0, .1); set(rig, 'thR', .9, 0, -.1); set(rig, 'knL', 1.0, 0, 0); set(rig, 'knR', 1.0, 0, 0); rig.ang[BONE_IDX.chest][0] += .4; },
  festive(rig, m, t) { if (!m.moving) { const p = Math.sin(t * 4); set(rig, 'shL', -2.2, 0, .5 + p * .3); set(rig, 'shR', -2.2, 0, -.5 + p * .3); } }
};
/* per-type draw functions (called from Monsters.draw) */
const GDRAW = {};
{
  const humanoid = (key, o) => (R, m, sc, tint, fl, t) => {
    const dt = Math.min(.05, Math.max(0, t - (m._lt || t))); m._lt = t;
    const rig = GhostDraw.rig(m, dt); if (!rig.clip) { if (o.pose) GPOSE[o.pose](rig, m, t); if (o.pose2) GPOSE[o.pose2](rig, m, t); }
    let y = o.y || 0; if (m.d.float) y += .35 + Math.sin(t * 2 + m.id) * .15; if (o.hop && m.moving) y += Math.abs(Math.sin(t * 6 + m.id)) * .55;
    if (m.jump) y += m.jump.y;
    const s = (o.s || 1.15) * sc; const emis = GHOST_EMIS[key] || null;
    GhostDraw.drawRig(R, m, GM['rig_' + key], s, y, emis, o.eye || [1, .3, .2], tint, fl);
    if (o.extra) o.extra(R, m, rig, s, t, tint, fl);
    if (o.wisp && Math.random() < .08) Particles.add(m.x + rand(-.5, .5), y + rand(.4, 2.4) * s, m.z + rand(-.5, .5), { c: o.wisp, s: .35, life: 1.2, vy: .6 });
  };
  GDRAW.takhian = humanoid('takhian', { pose: 'float', s: 1.3, eye: [1, .25, .2], wisp: [.5, .15, .15] });
  GDRAW.tani = humanoid('tani', { pose: 'float', s: 1.25, eye: [.3, 1, .4], wisp: [.2, .5, .25] });
  GDRAW.nangram = humanoid('nangram', { pose: 'dance', s: 1.2, eye: [1, .8, .4], wisp: [.5, .4, .15] });
  GDRAW.phrai = humanoid('phrai', { pose: 'reach', s: 1.2, eye: [.5, 1, 1], extra: (R, m, rig, s, t) => { if (Math.random() < .25) Particles.add(m.x + rand(-.4, .4), rand(.6, 2.2), m.z + rand(-.4, .4), { c: [.35, .6, .75], s: .22, life: .6, vy: -2.5 }); } });
  GDRAW.pop = humanoid('pop', { pose: 'hunched', s: 1.2, eye: [1, .15, .1] });
  GDRAW.huakhat = humanoid('huakhat', { pose: 'holdHead', s: 1.25, extra: (R, m, rig, s, t, tint, fl) => { if (!m.headOut) GhostDraw.part(R, GM.flyHead, rig.boneM('elL'), .02, -.4, .1, 0, 0, 0, .9, tint, [.08, .03, .02], fl); } });
  GDRAW.pusom = humanoid('pusom', { pose: 'oldman', s: 1.6, eye: [1, .85, .3], extra: (R, m, rig, s, t) => { GhostDraw.glow(m.x, 1.6 * s, m.z, 1.8 * s, [.22, .17, .05]); if (Math.random() < .2) Particles.add(m.x + rand(-1, 1), rand(.2, 3), m.z + rand(-1, 1), { c: [1, .8, .3], s: .3, life: 1, vy: .8 }); } });
  GDRAW.phidip = humanoid('phidip', { pose: 'jiangshi', s: 1.2, hop: 1, eye: [.6, 1, .6] });
  GDRAW.takhon = humanoid('takhon', { pose2: 'festive', s: 1.1 });
  GDRAW.tabo = humanoid('tabo', { pose: 'reach', s: 1.2, eye: [.7, .7, .9], wisp: [.4, .4, .45] });
  const quad = (body, eye, leg, tail, sz, eyeC, legs, tailP) => (R, m, sc, tint, fl, t) => {
    const M = Game.tmpM, ph = t * (m.moving ? 10 : 2) + m.id, y = (m.jump ? m.jump.y : 0) + (m.moving ? Math.abs(Math.sin(ph)) * .12 : 0), s = sc * sz, w = m.wind > 0 ? 1 - m.wind / .45 : 0, roar = m.cast && m.cast.k === 'roar' ? 1 : 0;
    M4.compose(M, m.x, y, m.z, -w * .25 - roar * .3, m.face, 0, s, s, s); R.drawMesh(GM[body], M, tint, [.02, .02, .03], fl); R.drawMesh(GM[eye], M, null, eyeC, 0);
    for (let i = 0; i < 4; i++) { const [lx, ly, lz] = legs[i]; const a = m.moving ? Math.sin(ph + (i === 0 || i === 3 ? 0 : Math.PI)) * .6 : 0; GhostDraw.part(R, GM[leg], M, lx, ly, lz, a - (i < 2 ? w * 1.2 : 0), 0, 0, 1, tint, null, fl); }
    GhostDraw.part(R, GM[tail], M, tailP[0], tailP[1], tailP[2], Math.sin(t * 2.4 + m.id) * .25 + .2, Math.sin(t * 1.7) * .4, 0, 1, tint, null, fl);
  };
  GDRAW.chakla = quad('catBody', 'catEye', 'catLeg', 'catTail', 1.15, [.4, 1, .3], [[.17, .55, .4], [-.17, .55, .4], [.17, .55, -.4], [-.17, .55, -.4]], [0, .72, -.6]);
  GDRAW.saming = quad('tigerBody', 'tigerEye', 'tigerLeg', 'tigerTail', 1.2, [1, .85, .2], [[.34, 1.0, .75], [-.34, 1.0, .75], [.34, 1.0, -.75], [-.34, 1.0, -.75]], [0, 1.3, -1.2]);
  GDRAW.phong = humanoid('phong', { s: 1.15, eye: [1, .4, .1], extra: (R, m, rig, s, t) => { const n = rig.bonePos('eyes', 0, -.12, .5); GhostDraw.glow(n[0], n[1], n[2], .22, [.3, .08, .02]); if (Math.random() < .15) Particles.add(m.x + rand(-.8, .8), rand(.2, 1.4), m.z + rand(-.8, .8), { c: [.35, .55, .15], s: .6, life: 1.4, vy: .3 }); } });
  GDRAW.krahang = humanoid('krahang', { pose: 'fly', s: 1.15, y: 2.2, eye: [1, .5, .1], extra: (R, m, rig, s, t, tint, fl) => {
    for (const [b, sd] of [['shL', 1], ['shR', -1]]) GhostDraw.part(R, GM.basket, rig.boneM(b), 0, -.5, -.15, 0, 0, Math.PI / 2, 1, tint, [.04, .03, .01], fl);
  } });
  GDRAW.maenak = humanoid('maenak', { pose: 'float', s: 1.7, eye: [.6, .95, 1], wisp: [.25, .4, .5], extra: (R, m, rig, s, t, tint, fl) => NakBoss.drawExtra(R, m, rig, s, t, tint, fl) });
  // pret
  GDRAW.pret = (R, m, sc, tint, fl, t) => {
    const M = Game.tmpM, sw = Math.sin(t * (m.moving ? 3 : 1.2) + m.id), scr = m.cast && m.cast.k === 'scream' ? 1 : 0, s = sc;
    M4.compose(M, m.x, 0, m.z, sw * .03 - scr * .15, m.face, sw * .04, s, s, s); R.drawMesh(GM.pretBody, M, tint, [.05, .04, .04], fl);
    R.drawMesh(GM.pretEye, M, null, [.9, .9, .8], 0);
    for (const sd of [-1, 1]) {
      const lg = m.moving ? Math.sin(t * 3 + (sd > 0 ? 0 : Math.PI)) * .35 : 0;
      GhostDraw.part(R, GM.pretLeg, M, sd * .2, 1.95, 0, lg, 0, 0, 1, tint, [.05, .04, .04], fl);
      const arm = scr ? -2.4 : m.wind > 0 ? -1.6 * (1 - m.wind / .45) - .4 : -.15 + Math.sin(t * 1.5 + sd) * .1;
      GhostDraw.part(R, GM.pretArm, M, sd * .42, 3.1, 0, arm, 0, sd * .12, 1, tint, [.05, .04, .04], fl);
    }
  };
  // krasue
  GDRAW.krasue = (R, m, sc, tint, fl, t) => {
    const M = Game.tmpM, y = (m.jump ? m.jump.y : 0) + 1.9 + Math.sin(t * 2.5 + m.id) * .25, s = sc;
    M4.compose(M, m.x, y, m.z, -(m.wind > 0 ? .4 : 0), m.face, Math.sin(t * 1.7) * .1, s, s, s); R.drawMesh(GM.krasueHead, M, tint, [.08, .1, .08], fl);
    R.drawMesh(GM.krasueEye, M, null, [1, .3, .2], 0); R.drawMesh(GM.krasueOrg, M, tint, [.35, .08, .1], fl);
    for (let i = 0; i < 7; i++) { const sw = Math.sin(t * 3 + i * .7) * (.1 + i * .03); GhostDraw.part(R, GM.krasueGut, M, sw, -1.1 - i * .26, -.02 + Math.cos(t * 2 + i) * .05, sw, 0, 0, 1 - i * .05, tint, [.3, .1, .12], fl); }
    GhostDraw.glow(m.x, y - .6, m.z, 1.1, [.06, .2, .1]);
    if (Math.random() < .3) Particles.add(m.x + rand(-.2, .2), y - 1.2 - Math.random(), m.z + rand(-.2, .2), { c: [.3, 1, .45], s: .3, life: .8, vy: -.6 });
  };
  // kong koi
  GDRAW.kongkoi = (R, m, sc, tint, fl, t) => {
    const M = Game.tmpM, hop = m.moving ? Math.abs(Math.sin(t * 7 + m.id)) : 0, y = (m.jump ? m.jump.y : 0) + hop * .6, s = sc * 1.05;
    M4.compose(M, m.x, y, m.z, -(m.wind > 0 ? .3 : 0) + hop * .1, m.face, 0, s, s * (1 - hop * .05), s); R.drawMesh(GM.kongBody, M, tint, [.03, .02, .02], fl); R.drawMesh(GM.kongEye, M, null, [1, .25, .15], 0);
    GhostDraw.part(R, GM.kongLeg, M, 0, .75, 0, hop * -.3, 0, 0, 1, tint, null, fl);
  };
  // pong khang
  GDRAW.pongkhang = (R, m, sc, tint, fl, t) => {
    const M = Game.tmpM, ph = t * (m.moving ? 9 : 2) + m.id, y = (m.jump ? m.jump.y : 0) + (m.moving ? Math.abs(Math.sin(ph)) * .2 : 0), s = sc * 1.1, w = m.wind > 0 ? 1 - m.wind / .45 : 0;
    M4.compose(M, m.x, y, m.z, (m.moving ? .25 : .05) - w * .3, m.face, 0, s, s, s); R.drawMesh(GM.pongBody, M, tint, [.02, .02, .03], fl); R.drawMesh(GM.pongEye, M, null, [1, .2, .1], 0);
    for (const sd of [-1, 1]) {
      const a = m.moving ? Math.sin(ph + (sd > 0 ? 0 : Math.PI)) * .7 : -.2;
      GhostDraw.part(R, GM.pongArm, M, sd * .38, 1.45, .5, a - w * 1.8, 0, sd * .15, 1, tint, null, fl);
      GhostDraw.part(R, GM.pongLeg, M, sd * .3, .95, -.4, -a * .8, 0, 0, 1, tint, null, fl);
    }
    GhostDraw.part(R, GM.pongTail, M, 0, 1.1, -.65, Math.sin(t * 2) * .2, Math.sin(t * 1.4) * .3, 0, 1, tint, null, fl);
  };
  // khamot
  GDRAW.khamot = (R, m, sc, tint, fl, t) => {
    const M = Game.tmpM, y = 1.6 + Math.sin(t * 2.3 + m.id) * .35, f = 1 + Math.sin(t * 13 + m.id) * .08;
    M4.compose(M, m.x, y, m.z, 0, t * 1.5, 0, sc * f, sc * f * 1.1, sc * f); R.drawMesh(GM.khamot, M, [.4, .6, .55], [.25, .7, .6], fl);
    GhostDraw.glow(m.x, y + .1, m.z, 1.4 * sc, [.05, .22, .18]);
    if (Math.random() < .5) Particles.add(m.x + rand(-.25, .25), y + .3, m.z + rand(-.25, .25), { c: [.4, 1, .85], s: .35, life: .5, vy: 1.4 });
  };
  // cobra
  GDRAW.ngu = (R, m, sc, tint, fl, t) => { const M = Game.tmpM; M4.compose(M, m.x, 0, m.z, -(m.wind > 0 ? .35 : 0), m.face, Math.sin(t * 3 + m.id) * .12, sc * 1.1, sc * 1.1, sc * 1.1); R.drawMesh(GM.ngu, M, tint, [.04, .05, .02], fl); R.drawMesh(GM.nguEye, M, null, [1, .8, .1], 0); };
}

