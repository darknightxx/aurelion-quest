/* ============================================================
   Procedural 3D models: monsters, boss, projectiles, cosmetics
   ============================================================ */
const Models = {};
function buildModels(R) {
  const m = {};
  // Slime
  let g = new Geo(31); g.jit = .04;
  g.sphere(0, .62, 0, .72, hexc('#79d65a'), 10, 7, .82);
  g.sphere(.22, .98, .2, .16, hexc('#c9f3a8'), 5, 4);
  g.box(-.2, .7, .62, .1, .2, .08, hexc('#1d2b16')); g.box(.2, .7, .62, .1, .2, .08, hexc('#1d2b16'));
  g.box(0, .5, .66, .22, .05, .05, hexc('#2f5a22'));
  m.slime = R.mesh(g);
  // Shroom
  g = new Geo(32);
  g.cyl(0, 0, 0, .45, .38, .9, 8, hexc('#f1e3c6'));
  g.sphere(0, 1.05, 0, .82, hexc('#d9483a'), 9, 6, .62);
  for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; g.sphere(Math.cos(a) * .55, 1.2, Math.sin(a) * .55, .13, [1, 1, 1], 5, 3); }
  g.sphere(0, 1.55, 0, .14, [1, 1, 1], 5, 3);
  g.box(-.15, .55, .4, .08, .16, .06, hexc('#2a1d14')); g.box(.15, .55, .4, .08, .16, .06, hexc('#2a1d14'));
  g.box(-.2, .05, .1, .25, .12, .35, hexc('#c9b48e')); g.box(.2, .05, .1, .25, .12, .35, hexc('#c9b48e'));
  m.shroom = R.mesh(g);
  // Wolf
  g = new Geo(33); const wc = hexc('#8a8f99'), wd = hexc('#5d626c');
  g.box(0, .95, 0, .8, .7, 1.6, wc, hexc('#a3a8b2'));
  g.box(0, 1.25, .95, .65, .6, .6, wc); g.box(0, 1.1, 1.35, .35, .3, .45, hexc('#b8bcc4')); g.box(0, 1.18, 1.58, .14, .12, .08, hexc('#1c1c22'));
  g.cyl(-.2, 1.5, .9, .14, 0, .38, 4, wd); g.cyl(.2, 1.5, .9, .14, 0, .38, 4, wd);
  g.box(-.17, 1.35, 1.26, .08, .08, .05, hexc('#f2d34b')); g.box(.17, 1.35, 1.26, .08, .08, .05, hexc('#f2d34b'));
  for (const [x, z] of [[-.28, .55], [.28, .55], [-.28, -.55], [.28, -.55]]) g.box(x, .35, z, .22, .7, .22, wd);
  g.at(0, 1.1, -.85, 0, 1, 1, 1, -1.0); g.cyl(0, 0, 0, .16, .05, .8, 5, wd); g.reset();
  m.wolf = R.mesh(g);
  // Goblin
  g = new Geo(34); const gs = hexc('#7cae4a');
  g.box(-.18, .35, 0, .22, .7, .26, hexc('#4f6a2a')); g.box(.18, .35, 0, .22, .7, .26, hexc('#4f6a2a'));
  g.box(0, .78, 0, .7, .32, .5, hexc('#7a5536'));
  g.sphere(0, 1.15, 0, .45, gs, 7, 5, .9);
  g.sphere(0, 1.75, .05, .42, gs, 8, 6);
  g.at(-.42, 1.8, 0, 0, 1, 1, 1, 0, 1.2); g.cyl(0, 0, 0, .14, 0, .55, 4, gs); g.reset();
  g.at(.42, 1.8, 0, 0, 1, 1, 1, 0, -1.2); g.cyl(0, 0, 0, .14, 0, .55, 4, gs); g.reset();
  g.box(-.15, 1.8, .38, .1, .1, .05, hexc('#ff4a2a')); g.box(.15, 1.8, .38, .1, .1, .05, hexc('#ff4a2a'));
  g.box(0, 1.6, .42, .2, .06, .05, hexc('#2f3a18'));
  g.box(-.55, 1.1, .1, .16, .55, .16, gs); g.box(.55, 1.1, .1, .16, .55, .16, gs);
  g.at(.6, .9, .35, 0, 1, 1, 1, 1.2); g.cyl(0, 0, 0, .08, .2, 1.1, 5, PAL.wood); g.reset();
  m.goblin = R.mesh(g);
  // Bat
  g = new Geo(35); const bc = hexc('#5b4a8a');
  g.sphere(0, 0, 0, .42, bc, 7, 5); g.cyl(-.2, .25, 0, .12, 0, .35, 4, bc); g.cyl(.2, .25, 0, .12, 0, .35, 4, bc);
  g.box(-.13, .05, .36, .09, .09, .05, hexc('#7ff0ff')); g.box(.13, .05, .36, .09, .09, .05, hexc('#7ff0ff'));
  m.batBody = R.mesh(g);
  g = new Geo(36); g.box(.65, 0, 0, 1.1, .06, .55, hexc('#3f3266')); g.box(1.15, -.1, 0, .5, .05, .4, hexc('#4a3b78')); m.batWing = R.mesh(g);
  // Skeleton
  g = new Geo(37); const bn = hexc('#e8e2cf'), bd = hexc('#b8b09a');
  g.box(-.18, .5, 0, .14, 1.0, .14, bn); g.box(.18, .5, 0, .14, 1.0, .14, bn);
  g.box(0, 1.05, 0, .55, .15, .3, bd);
  g.box(0, 1.3, 0, .12, .5, .12, bn);
  for (let i = 0; i < 4; i++) g.box(0, 1.25 + i * .14, .02, .6 - i * .04, .07, .38, bn);
  g.sphere(0, 2.05, .02, .33, bn, 7, 5);
  g.box(-.12, 2.05, .3, .1, .1, .05, hexc('#6ff2ff')); g.box(.12, 2.05, .3, .1, .1, .05, hexc('#6ff2ff'));
  g.box(-.45, 1.4, 0, .1, .7, .1, bn); g.box(.45, 1.4, 0, .1, .7, .1, bn);
  g.at(.5, 1.05, .25, 0, 1, 1, 1, 1.3); g.box(0, .6, 0, .1, 1.3, .04, hexc('#9aa3ad')); g.box(0, 0, 0, .35, .08, .08, PAL.gold); g.reset();
  g.box(-.55, 1.3, .15, .08, .7, .55, hexc('#6a5a44'));
  m.skel = R.mesh(g);
  // Boss: Kragor body + arms
  g = new Geo(38); const rk = hexc('#6d6780'), rk2 = hexc('#57526a');
  g.box(-1.0, 1.1, 0, 1.1, 2.2, 1.2, rk2); g.box(1.0, 1.1, 0, 1.1, 2.2, 1.2, rk2);
  g.rock(0, 2.0, 0, 2.4, rk); g.box(0, 3.2, 0, 3.4, 2.4, 2.4, rk);
  g.box(0, 4.8, .1, 2.2, 1.6, 1.8, rk2);
  g.box(-.45, 4.9, 1.0, .35, .25, .1, hexc('#7ff0ff')); g.box(.45, 4.9, 1.0, .35, .25, .1, hexc('#7ff0ff'));
  for (const s of [-1, 1]) { g.at(s * 1.6, 4.2, -.3, 0, 1, 1, 1, -.3, -s * .5); g.cyl(0, 0, 0, .5, 0, 2.2, 5, PAL.cry1); g.reset(); g.at(s * .9, 4.6, -.6, 0, 1, 1, 1, -.5, -s * .2); g.cyl(0, 0, 0, .4, 0, 1.6, 5, PAL.cry2); g.reset(); }
  g.at(0, 5.4, -.4, 0, 1, 1, 1, -.4); g.cyl(0, 0, 0, .5, 0, 1.8, 5, PAL.cry1); g.reset();
  g.box(0, 3.3, 1.22, 1.0, 1.0, .1, PAL.cry2);
  m.bossBody = R.mesh(g);
  g = new Geo(39); g.box(0, -.9, 0, 1.0, 2.0, 1.0, rk); g.box(0, -2.4, .1, 1.3, 1.3, 1.4, rk2); g.cyl(0, -2.2, .2, .35, 0, .9, 4, PAL.cry1);
  m.bossArm = R.mesh(g);
  // projectiles
  g = new Geo(40); g.box(0, 0, 0, .06, .06, 1.2, PAL.wood); g.at(0, 0, .6, 0, 1, 1, 1, Math.PI / 2); g.cyl(0, 0, 0, .1, 0, .3, 4, hexc('#c8ccd6')); g.reset(); g.box(0, 0, -.55, .02, .2, .2, [1, 1, 1]);
  m.arrow = R.mesh(g);
  g = new Geo(41); g.box(0, 0, 0, .7, .08, .18, hexc('#c8ccd6')); g.box(0, 0, 0, .18, .08, .7, hexc('#c8ccd6')); m.star = R.mesh(g);
  g = new Geo(42); g.sphere(0, 0, 0, .35, [1, 1, 1], 7, 5); m.orb = R.mesh(g);
  // barrier sphere
  g = new Geo(43); g.jit = .25; g.sphere(0, 0, 0, 1, hexc('#8ff0ff'), 12, 8); m.barrier = R.mesh(g);
  // cosmetics
  g = new Geo(44); g.cyl(0, 0, 0, .95, .95, .06, 14, hexc('#e3c37a'), hexc('#ecd08e')); g.cyl(0, .06, 0, .5, .46, .42, 12, hexc('#e3c37a'), hexc('#ecd08e')); g.cyl(0, .08, 0, .52, .52, .12, 12, hexc('#c8473a')); m.c_straw = R.mesh(g);
  g = new Geo(45); g.jit = .03;
  for (let i = 0; i < 9; i++) { const a = i / 9 * TAU; g.sphere(Math.cos(a) * .42, .18 + (i % 2) * .08, Math.sin(a) * .42, .26, hexc('#f7f4ec'), 6, 4); }
  g.sphere(0, .4, 0, .38, hexc('#fbf9f3'), 7, 5);
  for (const s of [-1, 1]) { g.sphere(s * .62, .15, .05, .2, hexc('#b9a27c'), 6, 4); g.sphere(s * .72, .02, .2, .14, hexc('#a68f6a'), 5, 3); g.at(s * .5, .25, .15, 0, 1, 1, 1, 0, s * 1.3); g.box(0, 0, 0, .32, .14, .2, hexc('#e8c9b5')); g.reset(); }
  m.c_sheep = R.mesh(g);
  g = new Geo(46); g.cyl(0, 0, 0, .55, .55, .18, 10, PAL.gold); for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; g.cyl(Math.cos(a) * .5, .15, Math.sin(a) * .5, .13, 0, .45, 4, i % 2 ? PAL.cry1 : PAL.cry2); } m.c_crown = R.mesh(g);
  g = new Geo(47); g.jit = .03;
  for (let i = 0; i < 5; i++) { const rz = .95 - i * .34, L = .95 - i * .1; g.at(.1, 0, 0, 0, 1, 1, 1, 0, rz); g.box(L / 2 + .05, 0, 0, L, .2, .05, hexc(i % 2 ? '#ffffff' : '#e9f0fb')); g.reset(); }
  g.sphere(.12, 0, 0, .16, hexc('#f4f7fc'), 5, 4); m.c_angel = R.mesh(g);
  g = new Geo(48); g.jit = .03;
  for (let i = 0; i < 4; i++) { const rz = .7 - i * .38, L = .9 - i * .12; g.at(.1, 0, 0, 0, 1, 1, 1, 0, rz); g.box(L / 2 + .05, 0, 0, L, .06, .06, hexc('#2a1d3c')); g.box(L / 2 + .05, -.11, 0, L * .92, .2, .03, hexc('#5a3f84')); g.reset(); }
  m.c_bat = R.mesh(g);
  Object.assign(Models, m);
}

