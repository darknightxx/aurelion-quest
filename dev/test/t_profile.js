const { boot } = require('./lib');
(async () => {
  const { page, errors, close } = await boot({ cls: 'mage' });
  await page.evaluate(() => { const S = Save.d; S.level = 21; S.stats.mvpKills = 1; S.quests.m1 = { s: 'done', k: {} }; S.frame = 'mvp'; Game.addItem('w_iron', 1, true); Game.equip('w_iron'); Game.addItem('egg_cat', 1, true); Game.useItem('egg_cat'); WM.closeAll(); Profile.apply(); });
  await page.click('#portrait'); await page.waitForTimeout(800);
  await page.screenshot({ path: __dirname + '/out/pf_eq.png' });
  await page.evaluate(() => { UI.panelOpt.tab = 'fr'; UI.renderPanel(); }); await page.waitForTimeout(500);
  await page.screenshot({ path: __dirname + '/out/pf_fr.png' });
  console.log(errors.filter(e => !e.includes('TUNNEL')));
  await close();
})();
