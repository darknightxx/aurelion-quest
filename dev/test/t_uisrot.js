const { boot } = require('./lib');
(async () => {
  const { page, errors, close } = await boot({ viewport: { width: 412, height: 860 }, touch: true, mobile: true, dpr: 2 });
  await page.evaluate(() => { Rot.want = true; Rot.check(); for (const [k] of UIScale.defs) UIScale.set(k, 1.3); });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: __dirname + '/out/uisrot.png' });
  // drag a window: open inventory, drag head by 100px along screen y (= app x in rot)
  await page.evaluate(() => UI.openPanel('inv'));
  await page.waitForTimeout(300);
  const before = await page.evaluate(() => [...WM.wins.values()][0].x);
  const hb = await page.locator('.uwin .phead').boundingBox();
  await page.mouse.move(hb.x + hb.width / 2, hb.y + hb.height / 2); await page.mouse.down(); await page.mouse.move(hb.x + hb.width / 2, hb.y + hb.height / 2 + 100, { steps: 5 }); await page.mouse.up();
  const after = await page.evaluate(() => [...WM.wins.values()][0].x);
  console.log('drag dx', after - before);
  await page.screenshot({ path: __dirname + '/out/uisrot2.png' });
  console.log(errors.filter(e => !e.includes('TUNNEL')));
  await close();
})();
