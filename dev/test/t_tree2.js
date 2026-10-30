const { boot } = require('./lib');
(async () => {
  const { page, errors, close } = await boot({ cls: 'knight' });
  await page.evaluate(() => { const S = Save.d; S.level = 15; S.skillPts = 14; S.job = 'paladin'; Player.rig = null; Player.recalc(); SkillLv.up('p_kn1'); SkillLv.up('p_kn1'); SkillLv.up('p_kn1'); SkillLv.up('p_kn2'); document.querySelectorAll('.achpop,#achpop').forEach(e => e.remove()); UI.openPanel('tree', { sel: 'p_kn2' }); });
  await page.waitForTimeout(1500); await page.evaluate(() => document.querySelectorAll('[class*=ach]').forEach(e => { if (!e.closest('.uwin')) e.remove(); }));
  await page.screenshot({ path: __dirname + '/out/tree.png' });
  console.log(errors.filter(e => !e.includes('TUNNEL')));
  await close();
})();
