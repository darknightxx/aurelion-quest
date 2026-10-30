// shared Playwright helpers: static server + game boot
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
function serve(port) {
  return new Promise(res => {
    const srv = http.createServer((q, r) => {
      let p = decodeURIComponent(q.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
      const f = path.join(ROOT, p); if (!f.startsWith(ROOT) || !fs.existsSync(f)) { r.writeHead(404); r.end(); return; }
      const ext = path.extname(f); r.writeHead(200, { 'content-type': { '.html': 'text/html; charset=utf-8', '.json': 'application/json', '.glb': 'model/gltf-binary' }[ext] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r);
    }).listen(port, () => res(srv));
  });
}
async function boot(opt = {}) {
  const port = opt.port || 8800 + Math.floor(Math.random() * 100);
  const srv = await serve(port);
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const ctx = await browser.newContext({ viewport: opt.viewport || { width: 1280, height: 720 }, hasTouch: !!opt.touch, isMobile: !!opt.mobile, deviceScaleFactor: opt.dpr || 1 });
  const page = await ctx.newPage(); const errors = [];
  page.setDefaultTimeout(120000);
  // OFFLINE=1: sandbox without internet — skip web fonts so screenshots don't wait for them
  if (process.env.OFFLINE) await ctx.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  await page.goto(`http://localhost:${port}/${opt.live ? 'siam-rpg' : 'siam-rpg-test'}/index.html?net=local${opt.q || ''}`);
  await page.waitForFunction(() => document.getElementById('loading').hidden, null, { timeout: 120000 });
  if (opt.start !== false) {
    await page.evaluate(([cls, name]) => { const d = Save.fresh(name, cls); Save.slot = 0; Save.d = d; d.seenIntro = 1; Game.start(d); }, [opt.cls || 'knight', opt.name || 'ทดสอบ']);
    await page.waitForTimeout(800);
  }
  return { browser, page, errors, close: async () => { await browser.close(); srv.close(); } };
}
module.exports = { boot, serve, ROOT };
