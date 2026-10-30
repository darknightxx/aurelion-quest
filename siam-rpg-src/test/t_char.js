const { boot } = require('./lib');
(async () => {
  const { page, errors, close } = await boot({ cls: process.argv[2] || 'knight' });
  await page.evaluate(() => { Player.x = 30; Player.z = 80; Cam.dist = 9; Cam.yaw = 0; });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${__dirname}/out/char_spr.png`, clip: { x: 440, y: 160, width: 400, height: 400 } });
  await page.evaluate(() => { Settings.d.sprites = 0; });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${__dirname}/out/char_3d.png`, clip: { x: 440, y: 160, width: 400, height: 400 } });
  console.log(await page.evaluate(() => [Player.sheet, Save.d.cos, typeof GLBModels !== 'undefined' && Object.keys(GLBModels)]));
  await close();
})();
