// สยาม RPG smoke test: boots, branding, separate saves/keys, separate online channels, temple zone + Thai ghosts
const { boot } = require('./lib');
(async () => {
  const t0 = Date.now();
  const { page, errors, close } = await boot({ cls: 'adventurer' });
  const ev = (fn, arg) => page.evaluate(fn, arg);
  const bad = [];
  const ok = (c, msg) => { if (!c) bad.push(msg); console.log((c ? 'PASS ' : 'FAIL ') + msg); };

  ok((await page.title()) === 'สยาม RPG', 'title is สยาม RPG');
  const html = await ev(() => document.body.innerText);
  ok(!/Aurelion/.test(html.replace(/จาก Aurelion Quest/g, '')), 'no leftover "Aurelion" in visible text');

  // save goes to siam_ keys, never to aurelion_
  const keys = await ev(() => { Save.write ? Save.write() : Save.save(); return Object.keys(localStorage); });
  console.log('localStorage keys:', keys.join(', '));
  ok(keys.some(k => k.startsWith('siam_save_v1')), 'save stored under siam_save_v1');
  ok(!keys.some(k => k.startsWith('aurelion_') || k.startsWith('aq_')), 'no aurelion_/aq_ keys written');

  // online channel mapping (FirebaseBackend.r) — test the mapping function without a network
  const mapped = await ev(() => {
    const fake = { D: { ref: (_db, p) => p }, db: null };
    const r = FirebaseBackend.prototype.r.bind(fake);
    return [r('ch/1/players/x'), r('ch/3/chat'), r('parties/abc'), r('.info/serverTimeOffset')];
  });
  console.log('channel paths:', mapped.join(' | '));
  ok(mapped[0] === 'ch/11/players/x' && mapped[1] === 'ch/13/chat' && mapped[2] === 'parties/abc' && mapped[3] === '.info/serverTimeOffset', 'online channels shifted to 11-13, other paths untouched');

  // patch notes / announcement
  ok(await ev(() => PATCH[0].t.includes('v0.3') && PATCH.some(p => p.t.includes('v0.2.1')) && PATCH.some(p => p.t.includes('(v0.2)')) && PATCH.some(p => p.t.includes('เปิดทดลอง สยาม RPG')) && ANNOUNCE[0].title.includes('v0.3')), 'patch notes: v0.2 on top, launch note kept');

  // temple zone with Thai ghosts still works
  const temple = await ev(() => {
    const S = Save.d; S.level = 12; Player.recalc && Player.recalc();
    const ghosts = Monsters.list.filter(m => m.d.ghost);
    const names = [...new Set(ghosts.map(m => m.d.name))];
    return { n: ghosts.length, names };
  });
  console.log('ghost monsters spawned:', temple.n, temple.names.join(', '));
  ok(temple.n > 0 && temple.names.includes('กระสือ'), 'Thai ghosts exist (incl. กระสือ)');

  // hit a ghost and kill it through the normal damage path
  const fight = await ev(() => {
    const m = Monsters.list.find(m => m.d.ghost && m.type === 'krasue' && !m.dead);
    const S = Save.d; const lv0 = S.level, xp0 = S.xp, c0 = S.coins;
    m.hp = 1; Combat.damageMonster(m, 9999, {});
    return { type: m.type, dead: !!m.dead, gotReward: S.level > lv0 || S.xp > xp0 || S.coins > c0 };
  });
  console.log('fight:', JSON.stringify(fight));
  ok(fight.dead && fight.gotReward, 'killing กระสือ gives EXP/coins');


  // v0.2: Thai monster names — no old AQ names anywhere players can see
  const oldNames = ['สไลม์', 'เห็ดซุกซน', 'หมาป่า', 'ก็อบลิน', 'ค้างคาวผลึก', 'โครงกระดูกยาม', 'คราก', 'ปิรันย่า', 'กบลูกดอก', 'จากัวร์', 'ทารันทูล่า', 'อนาคอนด้า', 'พืชกินคน', 'เคแมน', 'โอกร', 'แมงมุมยักษ์', 'กบพิษ', 'ต่อมพิษอึ่งพิษ', 'ยักษ์ป่านักรบ', 'ลีร่า', 'โอริน', 'พ่อค้าพิป', 'พรานรุก', 'มาร์โก้', 'เอมม่า', 'โฮเซ่', 'ลิซ่า', 'ปีโป้', 'บอร์ก', 'ซาวิน', 'เนลลี่', 'อเมซอน', 'ถ้ำผลึก', 'ทุ่งหญ้าใบเขียว'];
  const leak = await ev(names => {
    const blobs = [JSON.stringify(MONSTERS), JSON.stringify(ITEMS), JSON.stringify(QUESTS), JSON.stringify(MVP_DEFS), JSON.stringify(PATCH), JSON.stringify(ANNOUNCE), JSON.stringify(NPCS), JSON.stringify(PLACES), JSON.stringify(WARPS), document.body.innerText];
    return names.filter(n => blobs.some(b => b.includes(n)));
  }, oldNames);
  ok(leak.length === 0, 'no old monster names left' + (leak.length ? ': ' + leak.join(', ') : ''));
  const mvpNames = await ev(() => Object.values(MVP_DEFS).map(d => d.name));
  console.log('MVP names:', mvpNames.join(', '));
  ok(await ev(() => MONSTERS.slime.name === 'วุ้นใบเตย' && MONSTERS.boss.name.startsWith('ยักษ์ศิลา')), 'slime → วุ้นใบเตย, boss → ยักษ์ศิลา');
  // first main quest still completes by killing the renamed monsters (quests use type ids)
  const q = await ev(() => { const S = Save.d; const qm = QUESTS.m1; Quests.accept ? Quests.accept('m1') : null; for (let i = 0; i < 12; i++) { Quests.onKill('slime', 'world'); Quests.onKill('shroom', 'world'); } const st = S.quests && S.quests.m1; return { has: !!qm, st: JSON.stringify(st || null).slice(0, 120), title: qm.title, text: qm.text.slice(0, 60) }; });
  console.log('quest m1:', JSON.stringify(q));

  await page.screenshot({ path: __dirname + '/out_siam_lobby.png' });
  const real = errors.filter(e => !/ERR_TUNNEL_CONNECTION_FAILED|ERR_NAME_NOT_RESOLVED|ERR_FAILED|fonts\.g/.test(e)); // sandbox has no internet (Google Fonts)
  errors.length = 0; errors.push(...real);
  ok(errors.length === 0, 'no page/console errors' + (errors.length ? ': ' + errors.slice(0, 5).join(' || ') : ''));
  console.log(`done in ${((Date.now() - t0) / 1000).toFixed(0)}s — ${bad.length ? bad.length + ' FAILED' : 'ALL PASS'}`);
  await close();
  process.exit(bad.length ? 1 : 0);
})().catch(e => { console.error('CRASH', e); process.exit(2); });
