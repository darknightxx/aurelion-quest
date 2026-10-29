const { boot } = require('./lib');
(async () => {
  const { page, errors, close } = await boot({ cls: 'knight' });
  const list = await page.evaluate(() => CLASS_ORDER);
  console.log(list);
  for (const c of list) {
    await page.evaluate(c => { Save.d.cls = c; Player.rig = null; Player.x = 30; Player.z = 80; Cam.dist = 8; Cam.yaw = 0; Player.face = 0; Player.recalc(); }, c);
    await page.waitForTimeout(1500);
    await page.evaluate(() => { Player.face = 0; });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${__dirname}/out/cls_${c}.png`, clip: { x: 490, y: 180, width: 300, height: 360 } });
  }
  const { execSync } = require('child_process');
  execSync(`python3 -c "
from PIL import Image
L=${JSON.stringify(list)}
c=Image.new('RGB',(300*len(L),360))
for i,k in enumerate(L): c.paste(Image.open('out/cls_'+k+'.png'),(300*i,0))
c.save('out/cls_all.png')"`, { cwd: __dirname });
  console.log(errors.filter(e => !e.includes('TUNNEL')).slice(0, 5));
  await close();
})();
