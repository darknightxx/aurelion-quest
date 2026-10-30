const { boot } = require('./lib');
(async () => {
  const { page, errors, close } = await boot({ viewport: { width: 844, height: 390 }, touch: true, mobile: true, dpr: 2 });
  const out = [];
  for (const p of ['tree', 'refine', 'profile', 'mvp', 'pets', 'friends', 'cards', 'events', 'uiscale', 'storage']) {
    const r = await page.evaluate(p => { UI.openPanel(p); const w = WM.wins.get(p); const b = w.el.firstElementChild.getBoundingClientRect(); const res = [p, Math.round(b.left), Math.round(b.top), Math.round(b.right), Math.round(b.bottom), innerWidth, innerHeight, w.body.scrollWidth > w.body.clientWidth + 4 ? 'HSCROLL' : '']; return res; }, p);
    out.push(r.join(' ')); await page.waitForTimeout(400); await page.screenshot({ path: `${__dirname}/out/mw_${p}.png` }); await page.evaluate(() => WM.closeAll());
  }
  console.log(out.join('\n')); console.log(errors.filter(e => !e.includes('TUNNEL')));
  await close();
})();
