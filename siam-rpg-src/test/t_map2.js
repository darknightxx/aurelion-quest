const { boot } = require('./lib');
(async () => {
  const { page, close } = await boot({});
  const s = await page.evaluate(() => {
    let out = ''; for (let z = 20; z <= 120; z += 3) { let row = (z + '').padStart(4) + ' '; for (let x = 90; x <= 148; x += 1.5) { const r = Col.resolve(x, z, .6); const free = Math.abs(r[0] - x) < .01 && Math.abs(r[1] - z) < .01; row += free ? '.' : '#'; } out += row + '\n'; }
    out += 'path to (140,70): ' + !!Nav.find('world', 9, 66, 140, 70) + '\n'; out += 'place ' + World.placeName(140, 70); return out;
  });
  console.log(s); await close();
})();
