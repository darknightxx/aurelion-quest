const { boot } = require('./lib');
(async () => {
  const { page, errors, close } = await boot({ cls: 'mage' });
  const r = await page.evaluate(async () => {
    const out = {};
    for (const cls of CLASS_ORDER) {
      const d = Save.fresh('T', cls); d.seenIntro = 1; d.level = 12; d.skillPts = 60; Save.d = d; Game.start(d); WM.closeAll();
      const L = Tree.layout(d); const res = [];
      for (let pass = 0; pass < 3; pass++) for (const [id] of L) for (let k = 0; k < 4; k++) SkillLv.up(id);
      const T = TREE_SK[cls]; const a0 = Player.stats.atk;
      d.bar = [T.a[0][0], T.a[1][0], null, null]; UI.buildSkillbar(); Player.recalc();
      const bar = Cls.of(d).skills; d.mp = 999; Player.stats.maxmp = 999;
      // fire extra skills at a nearby monster
      const m = Monsters.list.find(m => m.zone === 'world' && !m.dead && !m.d.boss); Player.x = m.x + 2; Player.z = m.z; Player.target = { kind: 'mon', ref: m };
      Skills.cd = [0, 0, 0, 0, 0]; Skills.use(0); for (let i = 0; i < 40; i++) Game.update(.05); Skills.cd = [0, 0, 0, 0, 0]; Skills.use(1); for (let i = 0; i < 40; i++) Game.update(.05);
      out[cls] = { learned: L.filter(([id]) => SkillLv.get(id) > 0).length + '/' + L.length, bar: bar.join(','), pts: d.skillPts, atk: Player.stats.atk, crit: RoleSys.critBonus().toFixed(3) };
    }
    return out;
  });
  console.log(JSON.stringify(r, null, 1));
  await page.evaluate(() => { document.getElementById('toasts').innerHTML = ''; UI.openPanel('tree', { sel: TREE_SK.priest.a[0][0] }); document.getElementById('toasts').hidden = true; });
  await page.waitForTimeout(700); await page.screenshot({ path: __dirname + '/out/tree.png' });
  console.log(errors.filter(e => !e.includes('TUNNEL')));
  await close();
})();
