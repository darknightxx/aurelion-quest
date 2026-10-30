const { boot } = require('./lib');
(async () => {
  const { page, errors, close } = await boot({ cls: 'ninja' });
  const r = await page.evaluate(() => {
    const S = Save.d, out = {}; out.active = EventSys.active(); out.npc = NPCList.filter(n => n.id.startsWith('ev_')).map(n => n.id);
    // kills drop tokens
    const m = Monsters.list.find(m => m.zone === 'world' && !m.d.boss); Settings.d.groundLoot = 0;
    Quests.accept('evq1_halloween');
    for (let i = 0; i < 60; i++) { Monsters.revive(m); m.zone = 'world'; Combat.damageMonster(m, 1e6, {}); }
    out.tokens = S.inv.ev_candy; out.qitem = S.inv.ev_pumpkin; out.qdone = Quests.complete('evq1_halloween');
    if (out.qdone) Quests.turnIn('evq1_halloween'); out.box = S.inv.ev_box_halloween;
    const tiers = [0, 0, 0, 0, 0, 0, 0, 0]; for (let i = 0; i < 20000; i++) tiers[rollTier()]++; out.tierDist = tiers;
    S.inv.ev_box_halloween = 5; const got = []; for (let i = 0; i < 5; i++) got.push(EventSys.openBox('halloween')); out.got = got.map(id => ITEMS[id].name);
    Game.addItem('tg_w_knight_7', 1, true); Game.equip('tg_w_knight_7'); out.wrongCls = S.equip.weapon;
    Game.addItem('tg_a_7', 1, true); Game.equip('tg_a_7'); out.armor = S.equip.armor; out.topTier = TierFx.top();
    EventSys.start('songkran', 2); out.active2 = EventSys.active(); out.npc2 = NPCList.filter(n => n.id.startsWith('ev_')).map(n => n.id);
    // GM gift path
    Net.onAnnounce.call(Object.assign(Object.create(Net), { be: { now: () => Date.now() } }), { m: '[[GIFT]]hp_l|3|abc', t: Date.now(), n: 'GM' }); out.gift = S.inv.hp_l;
    Settings.d.groundLoot = 1; return out;
  });
  console.log(JSON.stringify(r));
  await page.evaluate(() => { S = Save.d; S.inv.ev_candy = 200; const n = NPCList.find(x => x.id === 'ev_halloween'); Player.x = n.x; Player.z = n.z + 3; UI.dialog(n); });
  await page.waitForTimeout(1200); await page.screenshot({ path: __dirname + '/out/ev_dlg.png' });
  await page.evaluate(() => { WM.closeAll(); UI.openPanel('evcab', { ev: 'halloween' }); }); await page.waitForTimeout(600); await page.screenshot({ path: __dirname + '/out/ev_cab.png' });
  console.log(errors.filter(e => !e.includes('TUNNEL')));
  await close();
})();
