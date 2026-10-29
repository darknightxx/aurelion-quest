const { boot } = require('./lib');
(async () => {
  const { page, errors, close } = await boot({});
  const f = () => page.evaluate(() => new Promise(r => { const t0 = performance.now(); let n = 0; const k = () => { if (++n >= 5) r((performance.now() - t0) / 5); else requestAnimationFrame(k); }; requestAnimationFrame(k); }));
  console.log('base ms/frame', await f(), await page.evaluate(() => [Game.paused, UI.panelOpen]));
  await page.evaluate(() => { Game.addItem('egg_dog', 1, true); Game.useItem('egg_dog'); UI.closePanel(); });
  console.log('pet ms/frame', await f());
  await page.evaluate(() => { const m = Monsters.list.find(m => m.zone === 'world' && !m.d.boss); Loot.drop(m, 'hp_s', 1); Loot.drop(m, 'hp_s', 1); });
  console.log('loot ms/frame', await f());
  console.log(errors.filter(e => !e.includes('TUNNEL')).slice(0, 5));
  await close();
})();
