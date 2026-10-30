const { boot } = require('./lib');
(async () => {
  const { page, errors, close } = await boot({ cls: 'knight' });
  const r = await page.evaluate(() => {
    const S = Save.d; S.level = 20; S.flags.bridge = true; S.flags.gate = true; Game.applyUnlocks(); Player.recalc();
    const mons = Monsters.list.filter(m => m.zone === 'amazon'); const byType = {}; for (const m of mons) byType[m.type] = (byType[m.type] || 0) + 1;
    const out = { n: mons.length, byType, zone: World.zoneOf(AX), cards: ['card_ana', 'card_ogre', 'card_mvp_anaking'].map(k => !!CARDS[k]) };
    out.navCampVillage = !!Nav.find('amazon', AX, 100, AX - 14, -70); out.navGrove = !!Nav.find('amazon', AX, 100, AX + 46, -52); out.navRuin = !!Nav.find('amazon', AX, 100, AX - 50, -10); out.navSwamp = !!Nav.find('amazon', AX, 100, AX - 58, -55); out.navLake = !!Nav.find('amazon', AX, 100, AX + 40, 30);
    out.stuck = mons.filter(m => Col.blocked(m.x, m.z, .3)).map(m => m.type);
    return out;
  });
  console.log(JSON.stringify(r));
  const shots = [['camp', 0, 98, .6], ['village', -14, -64, 2.6], ['lake', 30, 30, 1.2], ['grove', 40, -44, 0.5], ['ruins', -46, 0, 2.2], ['swamp', -48, -56, 1.8]];
  for (const [n, lx, z, yaw] of shots) {
    await page.evaluate(([lx, z, yaw]) => { Player.x = AX + lx; Player.z = z; Player.zone = 'amazon'; Game.setEnv('amazon'); Cam.yaw = yaw; Cam.dist = 26; Cam.update(0, true); Game.safeT = 99; }, [lx, z, yaw]);
    await page.waitForTimeout(2500); await page.screenshot({ path: `${__dirname}/out/amz_${n}.png` });
  }
  await page.evaluate(() => UI.openPanel('map', { tab: 'amazon' })); await page.waitForTimeout(800); await page.screenshot({ path: `${__dirname}/out/amz_map.png` });
  console.log(errors.filter(e => !e.includes('TUNNEL')).slice(0, 8));
  await close();
})();
