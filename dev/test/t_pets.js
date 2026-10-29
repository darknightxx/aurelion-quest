const { boot } = require('./lib');
(async () => {
  const { page, errors, close } = await boot({});
  const r = await page.evaluate(async () => {
    const out = {}; const S = Save.d; S.coins = 99999;
    // buy + hatch dog via shop item
    Game.addItem('egg_dog', 1, true); Game.useItem('egg_dog'); out.hatched = Pets.cur();
    UI.closePanel();
    Game.addItem('pet_food', 5, true);
    // spawn a kill in front: find a monster in world
    const m = Monsters.list.find(m => m.zone === 'world' && !m.d.boss && !m.dead && m.d.drops.length);
    Player.x = m.x + 3; Player.z = m.z; Pets.x = Player.x; Pets.z = Player.z;
    const inv0 = JSON.stringify(S.inv);
    m.d.drops = m.d.drops.map(d => [d[0], 1, null]);
    Combat.damageMonster(m, 1e6, {});
    out.lootOnGround = Loot.list.length; out.invSame = JSON.stringify(S.inv) === inv0;
    for (let i = 0; i < 120; i++) Game.update(.05);
    out.lootAfter = Loot.list.length; out.invChanged = JSON.stringify(S.inv) !== inv0;
    // feeding rules
    const p = Pets.info('dog'); p.hun = 10; const i0 = p.int; Pets.feed(); out.feedHungry = p.int - i0;
    p.hun = 95; const i1 = p.int; Pets.feed(); out.feedFull = p.int - i1;
    // all 20 abilities
    const res = {};
    for (const k of PET_ORDER) { if (!Pets.data().own[k]) { Game.addItem('egg_' + k, 1, true); Game.useItem('egg_' + k); } Pets.info(k).int = 1000; Pets.summon(k); const ab = PETS[k].ab; res[k] = [ab.k, Pets.v(ab.k === 'all' ? 'atk' : ab.k)]; }
    out.abil = res; UI.closePanel();
    return out;
  });
  console.log(JSON.stringify(r));
  // screenshot several pets lined up: draw each by switching
  const shots = ['dog', 'cat', 'parrot', 'rabbit', 'dragon', 'fairy', 'penguin', 'panda', 'slimep', 'bat'];
  await page.evaluate(() => { Player.x = 9; Player.z = 66; Cam.dist = 12; Pets.summon('dragon'); Pets.x = 11; Pets.z = 67; Pets.say('สวัสดี!'); const m = Monsters.list[0]; for (let i = 0; i < 4; i++) Loot.drop({ x: 7 + i, z: 64, zone: 'world' }, i % 2 ? 'egg_cat' : 'hp_s', 1); });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${__dirname}/out/pet_world.png` });
  await page.evaluate(() => UI.openPanel('pets'));
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${__dirname}/out/pet_ui.png` });
  console.log(errors.filter(e => !e.includes('TUNNEL')));
  await close();
})();
