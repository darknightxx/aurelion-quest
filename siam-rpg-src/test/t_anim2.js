const { boot } = require('./lib');
(async () => {
  const { page, errors, close } = await boot({ cls: 'knight' });
  await page.waitForTimeout(800);
  for (const [n, a] of [['atkF', 0], ['atkR', Math.PI / 2], ['atkL', -Math.PI / 2]]) {
    await page.evaluate(a => { Monsters.list.length = 0; Player.x = 14; Player.z = 72; Player.moveTo = null; Player.face = a; Cam.yaw = 0; Cam.dist = 8; }, a);
    await page.waitForTimeout(500);
    await page.evaluate(() => Player.rig.play('slash', .22));
    for (let k = 0; k < 6; k++) {
      const s = await page.evaluate(() => { const r = Player.rig; const o = CharArt.pose(r, { face: Player.face, x: Player.x, z: Player.z }); return { anim: o.anim, clip: r.clipName, u: +(r.clipT || 0).toFixed(2) }; });
      console.log(n, k, JSON.stringify(s));
      await page.screenshot({ path: `${__dirname}/out/an_${n}_${k}.png`, clip: { x: 500, y: 170, width: 280, height: 330 } });
      await page.waitForTimeout(260);
    }
  }
  console.log('ERR', errors.filter(e => !e.includes('TUNNEL')));
  await close();
  require('child_process').execSync(`python3 -c "
from PIL import Image
d=Image.new('RGB',(168*6,198*3))
for j,n in enumerate(['atkF','atkR','atkL']):
  for k in range(6): d.paste(Image.open('out/an_%s_%d.png'%(n,k)).resize((168,198)),(k*168,j*198))
d.save('out/an_atk.png')"`, { cwd: __dirname });
})();
