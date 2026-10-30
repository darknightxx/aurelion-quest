const { boot } = require('./lib');
(async () => {
  const { page, errors, close } = await boot({ cls: 'archer' });
  const r = await page.evaluate(async () => {
    const out = { bad: [] }; const S = Save.d; S.level = 12; S.quests.m1 = { s: 'done', k: {}, day: '' }; S.quests.m2 = { s: 'done', k: {}, day: '' }; S.flags.bridge = true; S.flags.gate = true; Game.applyUnlocks();
    // NPC spots walkable?
    for (const id of ['boonma', 'boran', 'tonkhao', 'sompong', 'lisa', 'pipo', 'borg', 'tang', 'savin', 'mira', 'puifai']) { const n = NPCS[id]; const c = Col.resolve(n.x, n.z, .6); const p = Nav.find('world', 9, 66, n.x, n.z + 2); out[id] = [Math.hypot(c[0] - n.x, c[1] - n.z).toFixed(2), !!p]; }
    for (const g of Gather.nodes) { const p = Nav.find('world', 9, 66, g.x + 1.4, g.z); if (!p) out.bad.push('node ' + g.item + ' ' + g.x.toFixed(0) + ',' + g.z.toFixed(0)); }
    for (const id of Object.keys(Q2)) for (const o of QUESTS[id].obj) if (o.k === 'reach') { const p = Nav.find('world', 9, 66, o.x, o.z); if (!p) out.bad.push('reach ' + id + ' ' + o.x + ',' + o.z); }
    // run every new quest
    const res = {};
    for (const id of Object.keys(Q2)) {
      const q = QUESTS[id]; if (q.req && !(S.quests[q.req] && S.quests[q.req].s === 'done')) { res[id] = 'req-missing'; continue; }
      if (!Quests.available(id)) { res[id] = 'unavail'; continue; }
      Quests.accept(id); const s = S.quests[id];
      q.obj.forEach((o, i) => {
        if (o.k === 'kill') s.k[o.mon] = o.n; if (o.k === 'collect') { if (GATHER[o.item]) { const nd = Gather.nodes.find(n => n.item === o.item); for (let k = 0; k < o.n; k++) { nd.cd = 0; Gather.pick(nd); } } else if (!S.inv[o.item]) Game.addItem(o.item, o.n, true); }
        if (o.k === 'reach') { Player.zone = o.zone; Player.x = o.x; Player.z = o.z; Quests.tickReach(); Player.x = 9; Player.z = 66; }
        if (o.k === 'emote') { const n = NPCList.find(x => x.id === o.npc); Player.x = n.x + 1; Player.z = n.z + 1; Net.emote(o.id); }
        if (o.k === 'pet') { Game.addItem('egg_dog', 1, true); Game.useItem('egg_dog'); WM.closeAll(); }
        if (o.k === 'feed') { Game.addItem('pet_food', 3, true); for (let k = 0; k < o.n; k++) { Pets.info(Pets.cur()).hun = 10; Pets.feed(); } }
      });
      const ok = Quests.complete(id); const prog = Quests.progress(id).map(p => p.have + '/' + p.n).join(' ');
      if (ok) { Quests.turnIn(id); } res[id] = (ok ? 'OK ' : 'FAIL ') + prog;
    }
    out.res = res; out.titles = S.extraTitles; out.markers = ['boonma', 'lisa', 'pipo'].map(id => Quests.marker(id));
    WM.closeAll();
    return out;
  });
  console.log(JSON.stringify(r, null, 1));
  // dialog screenshots
  for (const id of ['boonma', 'tonkhao', 'boran']) {
    await page.evaluate(id => { const S = Save.d; if (id === 'tonkhao') delete S.quests.n_cat; const n = NPCList.find(x => x.id === id); Player.x = n.x; Player.z = n.z + 3; UI.dialog(n); }, id);
    await page.waitForTimeout(2500);
    await page.screenshot({ path: `${__dirname}/out/dlg_${id}.png` });
    await page.evaluate(() => WM.closeAll());
  }
  console.log(errors.filter(e => !e.includes('TUNNEL')));
  await close();
})();
