const { boot } = require('./lib');
(async () => {
  const { page, errors, close } = await boot({});
  const r = await page.evaluate(async () => {
    const S = Save.d; S.flags.bridge = true; S.flags.gate = true; Game.applyUnlocks(); S.level = 20;
    for (let i = 0; i < 3; i++) Game.update(.4); MVPSys.update(1);
    const out = { alive: MVPSys.list.map(m => [m.mvpId, !m.dead, m.zone]) };
    out.reach = MVPSys.list.map(m => !!Nav.find(m.zone, m.zone === 'world' ? 9 : DX, m.zone === 'world' ? 66 : 12.5, m.x + 6, m.z + 6));
    out.cards = ['card_mvp_warlord', 'card_mvp_slimeking'].map(k => CARDS[k] && CARDS[k].tier);
    const m = MVPSys.list.find(x => x.mvpId === 'mvp_warlord'); Player.x = m.x + 3; Player.z = m.z; m.d.drops = m.d.drops.map(d => [d[0], 1]);
    Combat.damageMonster(m, 1e7, {});
    out.dead = m.dead; out.kills = S.mvp.kills; out.ann = document.getElementById('annbar').textContent; out.titles = S.extraTitles;
    MVPSys.update(1); out.stillDead = m.dead;
    return out;
  });
  console.log(JSON.stringify(r));
  await page.evaluate(() => { const m = MVPSys.list.find(x => x.mvpId === 'mvp_slimeking'); Player.x = m.x + 7; Player.z = m.z + 4; Cam.dist = 20; });
  await page.waitForTimeout(2500); await page.screenshot({ path: __dirname + '/out/mvp_world.png' });
  await page.evaluate(() => UI.openPanel('mvp')); await page.waitForTimeout(500); await page.screenshot({ path: __dirname + '/out/mvp_ui.png' });
  console.log(errors.filter(e => !e.includes('TUNNEL')));
  await close();
})();
