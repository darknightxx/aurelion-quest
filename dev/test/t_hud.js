const { boot } = require('./lib');
(async () => {
  for (const [name, vp, mob] of [['desk', { width: 1280, height: 720 }, false], ['phone', { width: 844, height: 390 }, true]]) {
    const { page, errors, close } = await boot({ viewport: vp, touch: mob, mobile: mob, dpr: mob ? 2 : 1 });
    await page.evaluate(() => { const S = Save.d; S.quests.m1 = { s: 'active', k: { slime: 2 }, day: '' }; UI.refreshTracker(); Player.x = 30; Player.z = 100; Game.addItem('egg_dog', 1, true); Game.useItem('egg_dog'); WM.closeAll(); AutoBattle.toggle(true); });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${__dirname}/out/hud_${name}.png` });
    console.log(name, await page.evaluate(() => [Player.target ? Player.target.ref.d.name : null, AutoBattle.on]), errors.filter(e => !e.includes('TUNNEL')));
    await close();
  }
})();
