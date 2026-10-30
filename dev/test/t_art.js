const { boot } = require('./lib');
(async () => {
  const { page, errors, close } = await boot({ cls: 'knight' });
  console.log('emotes', await page.evaluate(() => EMOTES.length));
  // 8 facings
  for (let i = 0; i < 8; i++) {
    await page.evaluate(i => { Player.x = 30; Player.z = 80; Cam.dist = 9; Cam.yaw = 0; Player.face = i * Math.PI / 4; Player.moveTo = null; }, i);
    await page.waitForTimeout(700); await page.evaluate(i => { Player.face = i * Math.PI / 4; }, i); await page.waitForTimeout(500);
    await page.screenshot({ path: `${__dirname}/out/art_f${i}.png`, clip: { x: 540, y: 220, width: 200, height: 260 } });
  }
  // NPCs in town
  await page.evaluate(() => { Player.x = 4; Player.z = 64; Cam.dist = 22; Cam.yaw = .3; });
  await page.waitForTimeout(2500); await page.screenshot({ path: `${__dirname}/out/art_town.png` });
  // emotes sample
  const ems = ['jump', 'sleep', 'pushup', 'backflip', 'meditate', 'thaidance', 'swim', 'headstand'];
  for (const e of ems) { await page.evaluate(e => { Player.x = 30; Player.z = 80; Cam.dist = 9; Cam.yaw = 0; Player.face = 0; Net.emote(e); }, e); await page.waitForTimeout(900); await page.screenshot({ path: `${__dirname}/out/art_e_${e}.png`, clip: { x: 520, y: 200, width: 240, height: 300 } }); }
  console.log(errors.filter(e => !e.includes('TUNNEL')));
  await close();
  const { execSync } = require('child_process');
  execSync(`python3 -c "
from PIL import Image
a=[Image.open('out/art_f%d.png'%i) for i in range(8)]
e=[Image.open('out/art_e_'+k+'.png').resize((200,250)) for k in ${JSON.stringify(ems).replace(/"/g, "'")}]
c=Image.new('RGB',(1600,520))
for i,im in enumerate(a): c.paste(im,(i*200,0))
for i,im in enumerate(e): c.paste(im,(i*200,265))
c.save('out/art_sheet.png')"`, { cwd: __dirname });
})();
