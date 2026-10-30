// สยาม RPG v0.4: zone table matches the live game + map filters work on every map tab
const { boot } = require('./lib');
const fs = require('fs');
(async () => {
  const { page, errors, close } = await boot({ cls: 'knight' });
  const ev = (fn, arg) => page.evaluate(fn, arg);
  const bad = []; const ok = (c, m) => { if (!c) bad.push(m); console.log((c ? 'PASS ' : 'FAIL ') + m); };

  const z = await ev(() => {
    const used = new Set([...Monsters.list.map(m => m.zone), ...NPCList.map(n => n.zone), ...WARPS.map(w => w.zone), ...MVPSys.list.map(m => m.zone)]);
    const rows = ZONE_ORDER.map(id => { const Z = ZONES[id], r = Zones.levelRange(id), mv = Zones.mvps(id); return { id, name: Z.name, lv: Z.lv, minLv: Z.minLv, range: r, mvpLv: mv.map(m => m.lvl), mons: Zones.monsters(id).length, npcs: Zones.npcs(id).length, warps: Zones.warps(id).length, links: Z.links, npcNamed: Zones.npcs(id).every(n => n.name) }; });
    return { used: [...used], rows, temple: TEMPLE_LV, amazon: AMAZON_LV };
  });
  console.table(z.rows.map(r => ({ id: r.id, name: r.name, lv: r.lv.join('–'), monLv: r.range ? r.range.join('–') : '-', mvpLv: r.mvpLv.join(','), mons: r.mons, npcs: r.npcs, warps: r.warps })));
  ok(z.used.every(id => z.rows.some(r => r.id === id)), 'every zone used in game is in ZONES: ' + z.used.join(','));
  for (const r of z.rows) {
    ok(r.mons > 0, `${r.id}: has monsters`);
    ok(!r.range || (r.range[0] >= r.lv[0] && r.range[1] <= r.lv[1]), `${r.id}: monster levels ${r.range} inside ${r.lv}`);
    ok(r.mvpLv.every(l => l >= r.lv[0] && l <= r.lv[1]), `${r.id}: MVP levels inside ${r.lv}`);
    ok(r.links.every(l => z.rows.some(o => o.id === l && o.links.includes(r.id))), `${r.id}: links exist both ways`);
    ok(r.npcNamed, `${r.id}: every NPC has a name`);
  }
  ok(z.rows.find(r => r.id === 'temple').minLv === z.temple && z.rows.find(r => r.id === 'amazon').minLv === z.amazon, 'minLv matches TEMPLE_LV / AMAZON_LV');

  // map filters on each tab
  await ev(() => { const S = Save.d; S.level = 30; WM.closeAll(); SiamMap.save(SiamMap.OPT_KEY, { labels: true, timers: false, found: false }); });
  for (const tab of ['world', 'temple', 'amazon']) {
    const r = await ev(tab => {
      UI.openPanel('map', { tab }); const body = UI.el.pbody, bar = body.querySelector('.smap'), cv = body.querySelector('#bigmap');
      const px = () => { const d = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data; let h = 0; for (let i = 0; i < d.length; i += 97) h = (h * 31 + d[i]) >>> 0; return h; };
      const all = px(); const n = bar ? bar.querySelectorAll('[data-mf]').length : 0;
      return { shown: SiamMap.zoneOfPanel(UI.panelOpt.tab), n, all, title: body.closest('.win, #panel, body').querySelector('h2, .ptitle, .whead')?.textContent || '' };
    }, tab);
    ok(r.shown === tab && r.n >= 3, `${tab}: map shows its filter list (${r.shown}, ${r.n} kinds)`);
    await page.waitForTimeout(300);
    const cvs = await page.$('#bigmap'); if (cvs) await cvs.screenshot({ path: `${__dirname}/out/map_${tab}_all.png` });
    // turn every layer off → picture changes; turn back on → same as before
    const t = await ev(() => { const cv = () => UI.el.pbody.querySelector('#bigmap'); const px = () => { const c = cv(); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let h = 0; for (let i = 0; i < d.length; i += 97) h = (h * 31 + d[i]) >>> 0; return h; };
      const click = k => UI.el.pbody.querySelector(`[data-mf="${k}"]`).click();
      const keys = [...UI.el.pbody.querySelectorAll('[data-mf]')].map(b => b.dataset.mf); const a = px(); keys.forEach(click); const b = px(); const offState = keys.filter(k => !SiamMap.filters()[k]).join(','); keys.forEach(click); const c = px(); return { changed: a !== b, restored: a === c, offState }; });
    ok(t.changed && t.restored, `${tab}: filters hide markers and bring them back (off: ${t.offState})`);
  }

  // search → pick a result → map switches zone and shows the popup
  const sr = await ev(() => {
    UI.openPanel('map', { tab: 'world' }); const q = UI.el.pbody.querySelector('#smq'); q.value = 'กระสือ'; q.dispatchEvent(new Event('input'));
    const hits = [...UI.el.pbody.querySelectorAll('[data-smr]')].map(b => b.textContent); UI.el.pbody.querySelector('[data-smr]').click();
    const pop = UI.el.pbody.querySelector('#smpop'); return { hits, tab: UI.panelOpt.tab, pop: pop && !pop.hidden ? pop.textContent.replace(/\s+/g, ' ').trim() : '' };
  });
  console.log('search:', JSON.stringify(sr));
  ok(sr.hits.some(h => h.includes('กระสือ')) && sr.tab === 'temple' && sr.pop.includes('กระสือ') && sr.pop.includes('นำทาง'), 'search "กระสือ" opens the temple map with its popup');
  const zr = await ev(() => { const q = UI.el.pbody.querySelector('#smq'); q.value = 'หิมพานต์'; q.dispatchEvent(new Event('input')); return [...UI.el.pbody.querySelectorAll('[data-smr]')].map(b => b.textContent)[0] || ''; });
  ok(zr.includes('ป่าหิมพานต์'), 'search finds maps by name: ' + zr);
  const go = await ev(() => { UI.openPanel('map', { tab: 'world' }); const it = SiamMap.items('world').find(i => i.cat === 'npc'); SiamMap.popup(it); UI.el.pbody.querySelector('[data-smgo]').click(); return it.name; });
  await page.waitForTimeout(400);
  const nav = await ev(() => ({ open: UI.panelOpen || null, goal: Nav.active ? Nav.active.label : null }));
  console.log('navigate to', go, JSON.stringify(nav));
  ok(!nav.open && nav.goal && nav.goal.includes(go), 'นำทาง closes the map and starts auto-walk to ' + go);
  await ev(() => WM.closeAll());
  const real = errors.filter(e => !/ERR_TUNNEL_CONNECTION_FAILED|ERR_NAME_NOT_RESOLVED|ERR_FAILED|fonts\.g/.test(e));
  ok(real.length === 0, 'no page errors' + (real.length ? ': ' + real.slice(0, 3).join(' | ') : ''));
  console.log(bad.length ? `${bad.length} FAILED` : 'ALL PASS');
  await close(); process.exit(bad.length ? 1 : 0);
})().catch(e => { console.error('CRASH', e); process.exit(2); });
