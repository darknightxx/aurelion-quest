const { boot } = require('./lib');
(async () => {
  const { page, close } = await boot({});
  const s = await page.evaluate(() => {
    let out = ''; for (let z = 30; z <= 100; z += 2) { let row = (z + '').padStart(4) + ' '; for (let x = -40; x <= 40; x += 1.5) { const r = Col.resolve(x, z, .6); const free = Math.abs(r[0] - x) < .01 && Math.abs(r[1] - z) < .01; const n = NPCList.find(n => n.zone === 'world' && Math.abs(n.x - x) < .8 && Math.abs(n.z - z) < 1); row += n ? n.id[0].toUpperCase() : free ? '.' : '#'; } out += row + '\n'; } return out;
  });
  console.log(s); await close();
})();
