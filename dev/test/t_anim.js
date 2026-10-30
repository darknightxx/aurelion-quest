const { boot } = require('./lib');
(async () => {
  const { page, errors, close } = await boot({ cls: 'knight' });
  await page.waitForTimeout(800);
  const dirs = [['front', 0], ['f34R', Math.PI / 4], ['sideR', Math.PI / 2], ['b34R', 3 * Math.PI / 4], ['back', Math.PI], ['b34L', -3 * Math.PI / 4], ['sideL', -Math.PI / 2], ['f34L', -Math.PI / 4]];
  const info = [];
  for (const [n, a] of dirs) {
    // camera looks along -z with yaw 0; "front" = walking toward the camera (+z)
    for (let k = 0; k < 4; k++) {
      await page.evaluate(a => { Player.x = 30; Player.z = 105; Cam.dist = 8; Cam.yaw = 0; Player.moveTo = { x: 30 + Math.sin(a) * 40, z: 105 + Math.cos(a) * 40 }; }, a);
      await page.waitForTimeout(260 + k * 90);
      const s = await page.evaluate(() => { const r = Player.rig, it = { face: Player.face, x: Player.x, z: Player.z }; const o = CharArt.pose(r, it); return { anim: o.anim, flip: o.flip, f: o.f, face: +Player.face.toFixed(2) }; });
      info.push([n, k, JSON.stringify(s)]); console.log(n, k, JSON.stringify(s));
      await page.screenshot({ path: `${__dirname}/out/an_${n}_${k}.png`, clip: { x: 520, y: 190, width: 240, height: 300 } });
    }
  }
  await page.evaluate(() => { Player.moveTo = null; });
  await page.waitForTimeout(600);
  for (const [n, a] of [['atkF', 0], ['atkR', Math.PI / 2], ['atkL', -Math.PI / 2]]) {
    for (let k = 0; k < 5; k++) {
      await page.evaluate(a => { Player.x = 30; Player.z = 105; Player.moveTo = null; Player.face = a; Cam.yaw = 0; if (!Player.rig.clip || Player.rig.clipT >= 1) Player.rig.play('slash', .5); }, a);
      await page.waitForTimeout(110);
      const s = await page.evaluate(() => { const r = Player.rig; const o = CharArt.pose(r, { face: Player.face, x: Player.x, z: Player.z }); return { anim: o.anim, flip: o.flip, clip: r.clipName, u: +r.clipT.toFixed(2) }; });
      info.push([n, k, JSON.stringify(s)]); console.log(n, k, JSON.stringify(s));
      await page.screenshot({ path: `${__dirname}/out/an_${n}_${k}.png`, clip: { x: 520, y: 190, width: 240, height: 300 } });
    }
  }
  info.forEach(l => console.log(l.join(' ')));
  console.log('ERR', errors.filter(e => !e.includes('TUNNEL')));
  await close();
  require('child_process').execSync(`python3 -c "
from PIL import Image
rows=['front','f34R','sideR','b34R','back','b34L','sideL','f34L']
c=Image.new('RGB',(240*8,300*4+300*3//2*0+300*3))
for i,n in enumerate(rows):
  for k in range(4): c.paste(Image.open('out/an_%s_%d.png'%(n,k)).resize((240,300)),(i*240,k*300)) if False else None
c=Image.new('RGB',(160*8,200*4))
for i,n in enumerate(rows):
  for k in range(4): c.paste(Image.open('out/an_%s_%d.png'%(n,k)).resize((160,200)),(i*160,k*200))
c.save('out/an_walk.png')
d=Image.new('RGB',(160*5,200*3))
for j,n in enumerate(['atkF','atkR','atkL']):
  for k in range(5): d.paste(Image.open('out/an_%s_%d.png'%(n,k)).resize((160,200)),(k*160,j*200))
d.save('out/an_atk.png')"`, { cwd: __dirname });
})();
