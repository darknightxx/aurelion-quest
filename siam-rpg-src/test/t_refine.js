const { boot } = require('./lib');
(async () => {
  const { page, errors, close } = await boot({});
  const r = await page.evaluate(() => {
    const S = Save.d, out = {}; S.coins = 1e8; Game.addItem('w_iron', 1, true); Game.equip('w_iron'); Game.addItem('rf_stone', 40, true); Game.addItem('rf_stone2', 60, true); Game.addItem('rf_guard', 60, true);
    const a0 = Player.stats.atk; let tries = 0, breaks = 0; Math.random0 = Math.random;
    while (Refine.lv('w_iron') < 12 && tries < 300) { const r = Refine.try('w_iron', true); tries++; if (r && r.broke) breaks++; if (!S.inv.w_iron) break; }
    out.lv = Refine.lv('w_iron'); out.tries = tries; out.breaks = breaks; out.atk = [a0, Player.stats.atk];
    // break test without guard
    Game.addItem('a_leather', 1, true); S.refine.a_leather = 12; let broke = false; for (let i = 0; i < 50 && !broke; i++) { const r = Refine.try('a_leather', false); if (r && r.broke) broke = true; if (Refine.lv('a_leather') < 10) S.refine.a_leather = 12; }
    out.brokeNoGuard = broke && !S.inv.a_leather;
    // cards
    out.ncards = Object.keys(CARDS).length; out.tiers = Object.values(CARDS).reduce((a, c) => (a[c.tier] = (a[c.tier] || 0) + 1, a), {});
    Game.addItem('card_wolf', 1, true); const a1 = Player.stats.atk; out.ins = Refine.insert('card_wolf', 'w_iron'); out.cardAtk = [a1, Player.stats.atk];
    Game.addItem('card_slime', 1, true); out.wrongSlot = Refine.insert('card_slime', 'w_iron');
    out.book = Object.keys(S.cardBook);
    return out;
  });
  console.log(JSON.stringify(r));
  await page.evaluate(() => { const n = NPCList.find(x => x.id === 'boran'); UI.dialog(n); });
  await page.waitForTimeout(600); await page.screenshot({ path: __dirname + '/out/rf_dlg.png' });
  await page.evaluate(() => { WM.closeAll(); UI.openPanel('refine', { sel: 'w_iron' }); });
  await page.waitForTimeout(600); await page.screenshot({ path: __dirname + '/out/rf_win.png' });
  await page.evaluate(() => { WM.closeAll(); for (const k of ['card_boss', 'card_maenak', 'card_goblin', 'card_kuman']) if (ITEMS[k]) Game.addItem(k, 1); UI.openPanel('cards'); });
  await page.waitForTimeout(600); await page.screenshot({ path: __dirname + '/out/rf_cards.png' });
  console.log(errors.filter(e => !e.includes('TUNNEL')));
  await close();
})();
