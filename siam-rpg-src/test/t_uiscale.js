const { boot } = require('./lib');
(async () => {
  const { page, errors, close } = await boot({ viewport: { width: 844, height: 390 }, touch: true, mobile: true, dpr: 2 });
  await page.screenshot({ path: __dirname + '/out/uis_1.png' });
  const r = await page.evaluate(() => {
    const box = id => { const b = document.getElementById(id).getBoundingClientRect(); return [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)]; };
    const before = { st: box('status'), sk: box('bottomc'), joy: box('joy') };
    for (const [k] of UIScale.defs) UIScale.set(k, 1.4);
    UI.openPanel('uiscale');
    const after = { st: box('status'), sk: box('bottomc'), joy: box('joy') };
    const w = document.querySelector('.uwin .pwin').getBoundingClientRect();
    return { before, after, win: [w.x, w.y, w.width, w.height].map(Math.round), vw: innerWidth, vh: innerHeight };
  });
  console.log(JSON.stringify(r));
  await page.waitForTimeout(400);
  await page.screenshot({ path: __dirname + '/out/uis_2.png' });
  await page.evaluate(() => { UI.closePanel(); for (const [k] of UIScale.defs) UIScale.set(k, .8); });
  await page.waitForTimeout(300);
  await page.screenshot({ path: __dirname + '/out/uis_3.png' });
  await page.evaluate(() => { UI.openPanel('settings'); });
  await page.waitForTimeout(300);
  await page.screenshot({ path: __dirname + '/out/uis_4.png' });
  console.log('errors', errors);
  await close();
})();
