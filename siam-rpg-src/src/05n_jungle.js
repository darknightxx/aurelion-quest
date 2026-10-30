
/* ============================================================
   Amazon monster models + animated drawers (GDRAW entries):
   piranha, poison dart frog, jaguar, giant spider, anaconda,
   man-eating plant, caiman, ogre warrior and ogre shaman.
   ============================================================ */
const JM = {};
function buildJungleModels(R) {
  const C = hexc, dk = C('#141010');
  const mk = fn => { const g = new Geo(61); g.jit = .015; g.uvs = 1.6; fn(g); g.smoothNormals(58); return R.mesh(g); };
  const eye = (g, x, y, z, r, col = [1, .9, .2]) => { g.sphere(x, y, z, r, col, 6, 4); g.sphere(x + Math.sign(x || 1) * r * .1, y, z + r * .55, r * .5, dk, 5, 3); };
  // piranha
  { const b = C('#6a7a8a'), red = C('#d8402a'), wh = C('#f4f0e6');
    JM.piranha = { body: mk(g => { g.ell(0, .45, 0, .26, .34, .45, b, 10, 7); g.ell(0, .3, .08, .22, .22, .34, red, 8, 6); g.ell(0, .48, .42, .2, .24, .14, b, 8, 6); for (const s of [-1, 1]) eye(g, s * .16, .58, .42, .06); for (let i = 0; i < 6; i++) { g.cone(-.12 + i * .05, .34, .52, 0, -1, .2, .025, .1, 3, wh); } g.cone(0, .8, -.05, 0, 1, -.4, .1, .22, 4, b); }),
      parts: [{ mesh: mk(g => g.cone(0, 0, 0, 0, 0, -1, .2, .34, 4, b)), p: [0, .45, -.42], a: 'tail' }, { mesh: mk(g => { g.ell(.08, 0, 0, .14, .03, .1, red, 5, 3); }), p: [.22, .36, .05], a: 'fin', off: 0 }, { mesh: mk(g => { g.ell(-.08, 0, 0, .14, .03, .1, red, 5, 3); }), p: [-.22, .36, .05], a: 'fin', off: 1 }] };
  }
  // poison dart frog (bright blue with black spots)
  { const bl = C('#2a8aff'), bk = C('#101420'), y = C('#ffd22a');
    JM.dartfrog = { body: mk(g => { g.ell(0, .3, 0, .34, .26, .38, bl, 10, 7); g.ell(0, .36, .3, .3, .2, .24, bl, 8, 6); for (const s of [-1, 1]) { g.sphere(s * .17, .52, .3, .11, bl, 6, 5); eye(g, s * .19, .55, .36, .07, bk); } for (let i = 0; i < 7; i++) g.sphere(Math.sin(i * 2.1) * .22, .45 + Math.cos(i * 1.3) * .05, -.15 + Math.cos(i * 2.1) * .2, .06, bk, 5, 3); g.ell(0, .2, .45, .2, .03, .06, y, 5, 3); }),
      parts: [{ mesh: mk(g => { g.ell(0, -.08, -.1, .1, .1, .22, bl, 6, 4); g.ell(0, -.18, .05, .08, .04, .16, bk, 5, 3); }), p: [.3, .25, -.12], a: 'leg', off: 0 }, { mesh: mk(g => { g.ell(0, -.08, -.1, .1, .1, .22, bl, 6, 4); g.ell(0, -.18, .05, .08, .04, .16, bk, 5, 3); }), p: [-.3, .25, -.12], a: 'leg', off: 0 }] };
  }
  // jaguar
  { const o = C('#d8a43a'), w = C('#f6ead0'), sp = C('#2a1a10');
    const leg = () => mk(g => { g.cyl(0, -.55, 0, .09, .12, .55, 6, o); g.ell(0, -.55, .05, .12, .07, .16, o, 6, 3); });
    JM.jaguar = { body: mk(g => { g.ell(0, .82, 0, .36, .34, .78, o, 10, 7); g.ell(0, .72, .1, .28, .24, .6, w, 8, 6); for (let i = 0; i < 18; i++) { const a = i * 2.4, zz = -.6 + (i / 18) * 1.2; g.sphere(Math.sin(a) * .3, .95 + Math.cos(a) * .12, zz, .07, sp, 4, 3); }
        g.sphere(0, 1.08, .82, .3, o, 9, 7); g.ell(0, .98, 1.06, .18, .14, .14, w, 6, 4); g.sphere(0, 1.02, 1.18, .05, sp, 4, 3); for (const s of [-1, 1]) { eye(g, s * .13, 1.16, 1.02, .05, [.9, .95, .3]); g.cone(s * .2, 1.32, .76, s * .3, 1, -.2, .08, .16, 4, o); } }),
      parts: [{ mesh: leg(), p: [.22, .62, .5], a: 'leg', off: 0 }, { mesh: leg(), p: [-.22, .62, .5], a: 'leg', off: Math.PI }, { mesh: leg(), p: [.22, .62, -.5], a: 'leg', off: Math.PI }, { mesh: leg(), p: [-.22, .62, -.5], a: 'leg', off: 0 },
        { mesh: mk(g => { g.cone(0, 0, 0, 0, .2, -1, .08, .9, 5, o); g.sphere(0, .18, -.9, .07, sp, 4, 3); }), p: [0, .95, -.75], a: 'tail' },
        { mesh: mk(g => { g.ell(0, -.04, .12, .14, .05, .12, w, 6, 3); for (let i = 0; i < 2; i++) g.cone((i ? .07 : -.07), -.02, .18, 0, -1, 0, .02, .1, 3, C('#fff')); }), p: [0, .94, 1.0], a: 'jaw' }] };
  }
  // giant spider
  { const b = C('#3a2a22'), h = C('#8a3a22'), r = C('#e0402a');
    const leg = s => mk(g => { g.cone(0, 0, 0, s * 1, .6, 0, .07, .7, 4, b); g.cone(s * .55, .42, 0, s * .5, -1, 0, .05, 1.0, 4, b); });
    const parts = []; for (let i = 0; i < 4; i++) for (const s of [-1, 1]) parts.push({ mesh: leg(s), p: [s * .3, .55, .35 - i * .25], a: 'sleg', off: i * 1.2 + (s > 0 ? 0 : Math.PI), rot: s * (.5 - i * .32) });
    JM.spider = { body: mk(g => { g.ell(0, .65, -.45, .55, .45, .6, b, 10, 7); for (let i = 0; i < 6; i++) g.ell(Math.sin(i) * .2, .95, -.45 + Math.cos(i * 1.7) * .3, .08, .03, .08, h, 4, 3); g.ell(0, .6, .25, .34, .28, .34, h, 8, 6); for (let i = 0; i < 4; i++) g.sphere(-.12 + i * .08, .74, .55, .045, r, 4, 3); for (const s of [-1, 1]) g.cone(s * .1, .48, .55, 0, -1, .3, .05, .2, 3, dk); }), parts };
  }
  // anaconda: head + body segments (drawn along a wave)
  { const gr = C('#3a6a2a'), y = C('#c8b84a'), sp = C('#1a2a14');
    JM.anaHead = mk(g => { g.ell(0, .35, .1, .3, .22, .42, gr, 9, 6); g.ell(0, .25, .2, .24, .1, .34, y, 7, 4); for (const s of [-1, 1]) eye(g, s * .2, .45, .25, .06, [1, .8, .1]); g.cone(0, .3, .5, 0, -.1, 1, .03, .3, 3, C('#d8323a')); for (let i = 0; i < 4; i++) g.sphere(Math.sin(i * 2) * .15, .5, -.1 + i * .08, .05, sp, 4, 3); });
    JM.anaSeg = mk(g => { g.ell(0, .3, 0, .3, .28, .4, gr, 8, 6); g.ell(0, .12, 0, .22, .1, .34, y, 6, 3); for (let i = 0; i < 3; i++) g.ell(Math.sin(i * 2.1) * .22, .45, -.2 + i * .2, .08, .04, .1, sp, 4, 3); });
  }
  // man-eating plant
  { const st = C('#3a7a2a'), lf = C('#2a5a22'), hd = C('#a8323a'), hd2 = C('#e8c84a'), tooth = C('#f6f0e0');
    JM.plant = { body: mk(g => { g.cyl(0, 0, 0, .3, .22, 1.8, 7, st); for (let i = 0; i < 7; i++) { const a = i / 7 * TAU; g.ell(Math.sin(a) * .8, .12, Math.cos(a) * .8, .7, .06, .3, lf, 6, 3, 0, a); } g.ell(0, 1.9, 0, .5, .4, .5, hd2, 8, 6); }),
      parts: [{ mesh: mk(g => { g.ell(0, .18, .35, .72, .38, .62, hd, 10, 6, 0, 0); for (let i = 0; i < 9; i++) { const a = -1.2 + i * .3; g.cone(Math.sin(a) * .6, .02, .35 + Math.cos(a) * .5, 0, -1, 0, .05, .22, 3, tooth); } for (let i = 0; i < 5; i++) g.sphere(-.4 + i * .2, .42, .5, .07, hd2, 4, 3); }), p: [0, 2.05, .1], a: 'jawU' },
        { mesh: mk(g => { g.ell(0, -.1, .35, .66, .3, .58, hd, 10, 6); for (let i = 0; i < 8; i++) { const a = -1.1 + i * .3; g.cone(Math.sin(a) * .55, .05, .35 + Math.cos(a) * .46, 0, 1, 0, .05, .2, 3, tooth); } }), p: [0, 2.0, .1], a: 'jawL' },
        { mesh: mk(g => { g.cone(0, 0, 0, .8, .4, .2, .08, 1.6, 4, st); g.ell(1.3, .7, .3, .2, .1, .2, lf, 5, 3); }), p: [.2, 1, 0], a: 'vine', off: 0 }, { mesh: mk(g => { g.cone(0, 0, 0, -.8, .5, .1, .08, 1.6, 4, st); g.ell(-1.3, .8, .15, .2, .1, .2, lf, 5, 3); }), p: [-.2, 1.1, 0], a: 'vine', off: 2 }] };
  }
  // caiman
  { const gr = C('#4a5a34'), bel = C('#b8b088'), sp = C('#2a3420');
    const leg = () => mk(g => { g.cyl(0, -.3, 0, .1, .12, .3, 5, gr); g.ell(0, -.3, .06, .14, .05, .16, gr, 5, 3); });
    JM.caiman = { body: mk(g => { g.ell(0, .38, 0, .45, .3, 1.0, gr, 10, 6); g.ell(0, .25, 0, .38, .12, .9, bel, 8, 4); for (let i = 0; i < 9; i++) g.cone(0, .62, -.7 + i * .17, 0, 1, 0, .07, .15, 3, sp); g.ell(0, .38, 1.05, .32, .2, .4, gr, 8, 5); for (const s of [-1, 1]) eye(g, s * .18, .58, 1.0, .06, [1, .85, .3]); }),
      parts: [{ mesh: leg(), p: [.4, .32, .55], a: 'leg', off: 0 }, { mesh: leg(), p: [-.4, .32, .55], a: 'leg', off: Math.PI }, { mesh: leg(), p: [.4, .32, -.5], a: 'leg', off: Math.PI }, { mesh: leg(), p: [-.4, .32, -.5], a: 'leg', off: 0 },
        { mesh: mk(g => { g.ell(0, 0, .4, .22, .08, .55, gr, 8, 4); for (let i = 0; i < 6; i++) g.cone(-.12 + (i % 2) * .24, -.04, .1 + i * .13, 0, -1, 0, .02, .07, 3, C('#f6f0e0')); }), p: [0, .3, 1.3], a: 'jaw' },
        { mesh: mk(g => { g.cone(0, 0, 0, 0, 0, -1, .3, 1.6, 6, gr); for (let i = 0; i < 6; i++) g.cone(0, .18 - i * .02, -.2 - i * .22, 0, 1, 0, .05, .12, 3, sp); }), p: [0, .38, -.95], a: 'tail' }] };
  }
  // ogres (warrior / shaman)
  const ogre = (shaman) => {
    const sk = C(shaman ? '#7a8a6a' : '#6a7a52'), sk2 = C(shaman ? '#5a6a4e' : '#4e5a3c'), cloth = C(shaman ? '#5a2a6a' : '#7a3a22'), bone = C('#e6dcc4'), red = C('#c8323a');
    const leg = () => mk(g => { g.cyl(0, -.95, 0, .2, .26, .95, 7, sk); g.ell(0, -.95, .1, .26, .12, .34, sk2, 6, 3); });
    const armR = mk(g => { g.cyl(0, -.9, 0, .17, .22, .9, 7, sk); g.sphere(0, -.95, 0, .22, sk2, 6, 5);
      if (shaman) { g.cyl(0, -1.9, .12, .05, .05, 2.4, 5, C('#5a3a22')); g.sphere(0, .5, .12, .2, bone, 7, 5); g.ell(0, .65, .12, .1, .2, .03, C('#3ac8ff'), 5, 3); }
      else { g.cyl(0, -1.05, .2, .08, .1, .5, 5, C('#4a3020')); g.cone(0, -.6, .2, 0, 1, .15, .26, 1.1, 7, C('#5a3a24'), .1); for (let i = 0; i < 5; i++) g.cone(Math.sin(i * 1.3) * .2, -.1 + i * .1, .2 + Math.cos(i * 1.3) * .2, Math.sin(i * 1.3), .2, Math.cos(i * 1.3), .04, .16, 3, bone); } });
    const armL = mk(g => { g.cyl(0, -.9, 0, .17, .22, .9, 7, sk); g.sphere(0, -.95, 0, .22, sk2, 6, 5); });
    return { body: mk(g => {
        g.ell(0, 1.55, 0, .6, .62, .5, sk, 10, 8); g.ell(0, 1.35, .22, .5, .44, .34, sk2, 8, 6); g.cyl(0, .9, 0, .55, .62, .45, 9, cloth); for (let i = 0; i < 6; i++) g.box(-.45 + i * .18, .72, .5, .12, .3, .04, cloth);
        g.sphere(0, 2.3, .05, .38, sk, 9, 7); g.ell(0, 2.3, .3, .32, .36, .14, bone, 8, 5); for (const s of [-1, 1]) { g.ell(s * .13, 2.38, .42, .08, .07, .03, dk, 5, 3); g.sphere(s * .13, 2.38, .43, .03, red, 4, 3); g.cone(s * .14, 2.05, .3, s * .2, 1, .3, .05, .22, 3, bone); g.ell(s * .38, 2.35, 0, .1, .16, .06, sk, 5, 4); }
        if (shaman) { for (let i = 0; i < 7; i++) { const a = -1.2 + i * .4; g.cone(Math.sin(a) * .3, 2.6, Math.cos(a) * .1 - .1, Math.sin(a) * .5, 1, -.3, .06, .8, 3, [C('#3ac8ff'), C('#ffd22a'), C('#d8323a')][i % 3]); } g.ell(0, 1.7, .5, .12, .12, .04, C('#ffd22a'), 5, 3); }
        else { for (let i = 0; i < 3; i++) g.cone(-.2 + i * .2, 2.62, 0, 0, 1, 0, .06, .3, 3, bone); for (let i = 0; i < 5; i++) g.sphere(-.36 + i * .18, 1.95, .38, .07, bone, 4, 3); }
      }), parts: [{ mesh: leg(), p: [.28, .95, 0], a: 'leg', off: 0 }, { mesh: leg(), p: [-.28, .95, 0], a: 'leg', off: Math.PI }, { mesh: armR, p: [.66, 1.95, 0], a: 'armR', off: 0 }, { mesh: armL, p: [-.66, 1.95, 0], a: 'arm', off: Math.PI }] };
  };
  JM.ogre = ogre(false); JM.ogresham = ogre(true);
}
{
  const ob = buildModels; buildModels = function (R) { ob(R); buildJungleModels(R); };
  const _B = M4.ident(), _L = M4.ident(), _O = M4.ident();
  const draw = (R, mm, m, sc, tint, fl, t, o = {}) => {
    const mv = m.moving ? 1 : 0, ph = m.anim * (o.spd || 9), wind = m.wind > 0 ? 1 - m.wind / .45 : 0, s = (o.s || 1) * sc;
    let y = o.y || 0, pitch = 0, roll = 0; if (o.hop && mv) { y += Math.abs(Math.sin(ph * .5)) * .5; pitch = -Math.cos(ph * .5) * .2; } if (m.jump) y += m.jump.y; if (o.bob) y += Math.sin(t * 2 + m.id) * o.bob;
    if (o.swim) { const k = Math.max(0, Math.sin(t * 1.6 + m.id * 1.7)); y += k * k * 1.1 - .25; pitch = Math.cos(t * 1.6 + m.id * 1.7) * -.6 * (k > .05 ? 1 : 0); }
    M4.compose(_B, m.x, y, m.z, pitch - wind * (o.lunge || .15), m.face, roll, s, s, s); R.drawMesh(mm.body, _B, tint, RIG_FILL, fl); R.drawOutline(mm.body, _B, .02);
    for (const p of mm.parts || []) {
      let rx = 0, ry = p.rot || 0, rz = 0;
      if (p.a === 'leg') rx = Math.sin(ph + p.off) * .6 * mv; else if (p.a === 'sleg') { ry += Math.sin(ph * 1.4 + p.off) * .3 * mv; rz = Math.cos(ph * 1.4 + p.off) * .15 * mv; }
      else if (p.a === 'tail') ry = Math.sin(t * (3 + mv * 4) + m.id) * .4; else if (p.a === 'fin') rz = (p.off ? -1 : 1) * Math.sin(t * 9) * .4;
      else if (p.a === 'jaw') rx = .1 + Math.max(0, Math.sin(t * 2)) * .15 + wind * .6; else if (p.a === 'jawU') rx = -.2 - wind * .7 - Math.max(0, Math.sin(t * 1.5)) * .25; else if (p.a === 'jawL') rx = .15 + wind * .5;
      else if (p.a === 'vine') { ry = Math.sin(t * 1.6 + p.off) * .5; rz = Math.cos(t * 1.3 + p.off) * .3 + wind * .5; }
      else if (p.a === 'armR') rx = -wind * 2.2 + Math.sin(ph + p.off) * .4 * mv; else if (p.a === 'arm') rx = Math.sin(ph + p.off) * .45 * mv;
      M4.compose(_L, p.p[0], p.p[1], p.p[2], rx, ry, rz, 1, 1, 1); M4.mul(_O, _B, _L); R.drawMesh(p.mesh, _O, tint, RIG_FILL, fl); R.drawOutline(p.mesh, _O, .018);
    }
  };
  GDRAW.piranha = (R, m, sc, tint, fl, t) => draw(R, JM.piranha, m, sc, tint, fl, t, { swim: 1, s: 1.2 });
  GDRAW.dartfrog = (R, m, sc, tint, fl, t) => draw(R, JM.dartfrog, m, sc, tint, fl, t, { hop: 1, s: 1.15 });
  GDRAW.jaguar = (R, m, sc, tint, fl, t) => draw(R, JM.jaguar, m, sc, tint, fl, t, { spd: 11, lunge: .35 });
  GDRAW.spider = (R, m, sc, tint, fl, t) => draw(R, JM.spider, m, sc, tint, fl, t, { s: 1.15, bob: .03 });
  GDRAW.plant = (R, m, sc, tint, fl, t) => draw(R, JM.plant, m, sc, tint, fl, t, { lunge: .25 });
  GDRAW.caiman = (R, m, sc, tint, fl, t) => draw(R, JM.caiman, m, sc, tint, fl, t, { spd: 6, lunge: .1 });
  GDRAW.ogre = (R, m, sc, tint, fl, t) => draw(R, JM.ogre, m, sc, tint, fl, t, { spd: 7, lunge: .1 });
  GDRAW.ogresham = (R, m, sc, tint, fl, t) => draw(R, JM.ogresham, m, sc, tint, fl, t, { spd: 6, lunge: .1 });
  GDRAW.ana = (R, m, sc, tint, fl, t) => {
    const n = 11, mv = m.moving ? 1 : .35, wind = m.wind > 0 ? 1 - m.wind / .45 : 0, f = m.face, sf = Math.sin(f), cf = Math.cos(f), s = sc * 1.1;
    let lx = 0, lz = .45 + wind * .6; const pts = [];
    for (let i = 0; i <= n; i++) { const zz = -i * .5, xx = Math.sin(m.anim * 5 * mv + i * .7) * .38 * (i / n + .25) + (m.jump ? 0 : 0); pts.push([xx, zz]); }
    for (let i = n; i >= 0; i--) { const [xx, zz] = pts[i]; const tap = 1 - i / n * .55; const wx = m.x + (xx * cf + zz * sf) * s, wz = m.z + (-xx * sf + zz * cf) * s; const nx = pts[Math.max(0, i - 1)]; const ang = f + Math.atan2(nx[0] - xx, .5);
      M4.compose(_B, wx, (m.jump ? m.jump.y : 0), wz, 0, ang, 0, s * tap, s * tap, s * tap); R.drawMesh(JM.anaSeg, _B, tint, RIG_FILL, fl); R.drawOutline(JM.anaSeg, _B, .02); }
    M4.compose(_B, m.x + lz * sf * s, (m.jump ? m.jump.y : 0) + wind * .5, m.z + lz * cf * s, -wind * .4, f, 0, s * 1.15, s * 1.15, s * 1.15); R.drawMesh(JM.anaHead, _B, tint, RIG_FILL, fl); R.drawOutline(JM.anaHead, _B, .02);
  };
}
