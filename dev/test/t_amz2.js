const { boot } = require('./lib');
(async () => {
  const { page, errors, close } = await boot({ cls: 'archer' });
  const r = await page.evaluate(async () => {
    const S = Save.d; S.level = 16; Player.recalc(); Player.x = 145; Player.z = 70; Game.msgT = 0; Game.checkTriggers(.1);
    await new Promise(r => setTimeout(r, 1500)); const out = { zone: Player.zone, pos: [Math.round(Player.x - AX), Math.round(Player.z)], warp: S.warps.w_amazon };
    const n = NPCList.find(x => x.id === 'marco'); out.marco = !!n; out.avail = Quests.available('a1'); Quests.accept('a1');
    Nav.goQuest('a1'); out.nav = !!Nav.active; Nav.stop();
    Quests.accept('a4'); out.a4 = Quests.active('a4');
    // exit
    Player.x = AX; Player.z = 108; Game.checkTriggers(.1); await new Promise(r => setTimeout(r, 1500)); out.back = [Player.zone, Math.round(Player.x)];
    return out;
  });
  console.log(JSON.stringify(r)); console.log(errors.filter(e => !e.includes('TUNNEL')).slice(0, 5)); await close();
})();
