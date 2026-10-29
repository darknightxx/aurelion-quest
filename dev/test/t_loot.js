const { boot } = require('./lib');
(async () => {
  const { page, errors, close } = await boot({});
  const r = await page.evaluate(async () => {
    const S = Save.d; Game.addItem('egg_dog', 1, true); Game.useItem('egg_dog'); WM.closeAll();
    const m = Monsters.list.find(m => m.zone === 'world' && !m.d.boss && !m.dead && m.d.drops.length);
    Player.x = m.x + 3; Player.z = m.z; Pets.x = Player.x; Pets.z = Player.z;
    m.d.drops = m.d.drops.map(d => [d[0], 1, null]);
    Combat.damageMonster(m, 1e6, {});
    const log = [];
    for (let i = 0; i < 12; i++) { await new Promise(r => setTimeout(r, 400)); log.push([Game.paused, Loot.list.length, Loot.list.map(l => [l.t.toFixed(1), Math.hypot(l.x - Player.x, l.z - Player.z).toFixed(1)]).join('|'), Pets.task ? 'T' : '-', Math.hypot(Pets.x - Player.x, Pets.z - Player.z).toFixed(1)]); }
    return { log, inv: S.inv };
  });
  console.log(JSON.stringify(r, null, 0));
  console.log(errors.filter(e => !e.includes('TUNNEL')).slice(0, 5));
  await close();
})();
