// Full audit: every class/job/skill, gear, items, cosmetics, mounts, pets, panels, zones, save/load
const { boot } = require('./lib');
(async () => {
  const { page, errors, close } = await boot({ cls: 'knight' });
  const ev = (fn, arg) => page.evaluate(fn, arg);
  const bad = [];
  const checkStats = async (tag) => { const r = await ev(() => { const st = Player.stats, S = Save.d; const nf = Object.entries(st).filter(([k, v]) => typeof v === 'number' && !isFinite(v)).map(([k]) => k); if (!isFinite(S.hp) || !isFinite(S.mp)) nf.push('hp/mp'); return nf; }); if (r.length) bad.push(tag + ' non-finite: ' + r); };
  const classes = await ev(() => CLASS_ORDER);
  for (const cls of classes) {
    const jobs = await ev(c => Object.keys(JOBS).filter(j => JOBS[j].base === c), cls);
    for (const job of [null, ...jobs, 'awk']) {
      const res = await ev(([cls, job]) => {
        try {
          if (job !== 'awk') { const d = Save.fresh('A', cls); d.seenIntro = 1; d.level = 30; d.coins = 1e7; Save.d = d; Game.start(d); WM.closeAll(); if (job) { JobSys.change(job); } }
          else { const S = Save.d; if (!S.job) return 'nojob'; S.level = 30; JobSys.awaken(); }
          const S = Save.d; SkillLv.ensure(S); S.skillPts = 99; for (const [id] of Tree.layout(S)) for (let k = 0; k < 3; k++) SkillLv.up(id);
          Player.x = 40; Player.z = 100; Player.zone = 'world';
          const m = Monsters.list.find(m => m.zone === 'world' && !m.d.boss && !m.mvpId); Monsters.revive(m); m.x = 42; m.z = 100; m.hp = m.max = 1e7; Player.target = { kind: 'mon', ref: m };
          const ids = [...new Set([...Cls.of(S).skills, ...(TREE_SK[cls].a.map(a => a[0]))])];
          for (const id of ids) { const sk = SKILLS[id]; S.mp = 9999; Skills.cd = [0, 0, 0, 0, 0]; Player.getRig().busy = false; Player.dashT = 0; try { Skills.exec(0, sk, m, 1, id); } catch (e) { return 'exec ' + id + ': ' + e.message; } for (let i = 0; i < 12; i++) Game.update(.05); }
          return 'ok ' + ids.length;
        } catch (e) { return 'ERR ' + e.message; }
      }, [cls, job]);
      if (!String(res).startsWith('ok') && res !== 'nojob') bad.push(`${cls}/${job}: ${res}`);
      await page.waitForTimeout(700); await checkStats(cls + '/' + job);
    }
  }
  console.log('skills done', errors.length);
  // gear, items, cosmetics
  const g = await ev(() => {
    const S = Save.d, out = []; S.level = 40; S.coins = 1e8;
    for (const id in ITEMS) { const it = ITEMS[id]; try { if (it.kind === 'gear' && (!it.cls || it.cls === S.cls)) { Game.addItem(id, 1, true); Game.equip(id); Player.recalc(); if (!isFinite(Player.stats.atk)) out.push('gear ' + id); } } catch (e) { out.push(id + ': ' + e.message); } }
    return out;
  }); bad.push(...g);
  await page.waitForTimeout(800);
  const cos = await ev(() => Object.keys(ITEMS).filter(id => ITEMS[id].kind === 'cos'));
  for (let i = 0; i < cos.length; i += 6) { await ev(ids => { for (const id of ids) { Game.addItem(id, 1, true); Game.equip(id); } Player.rig = null; }, cos.slice(i, i + 6)); await page.waitForTimeout(250); }
  console.log('cosmetics', cos.length, errors.length);
  const u = await ev(() => { const S = Save.d, out = []; for (const id in ITEMS) { const it = ITEMS[id]; if (it.kind !== 'use' || it.egg || it.ret || it.box) continue; try { Game.addItem(id, 2, true); S.hp = 10; Skills.potCD = 0; Game.useItem(id); WM.closeAll(); } catch (e) { out.push('use ' + id + ': ' + e.message); } } return out; }); bad.push(...u);
  // mounts
  const ms = await ev(() => MOUNT_ORDER.concat(Object.keys(MOUNTS).filter(k => !MOUNT_ORDER.includes(k))));
  for (const id of ms) { const r = await ev(id => { try { Mounts.grant(id, true); Mounts.select(id); if (!Mounts.riding()) Mounts.ride(); Mounts.cd = 0; Mounts.useSkill(); return 'ok'; } catch (e) { return id + ': ' + e.message; } }, id); if (r !== 'ok') bad.push('mount ' + r); await page.waitForTimeout(300); }
  await ev(() => { if (Mounts.riding()) Mounts.ride(); });
  console.log('mounts', ms.length, errors.length);
  // pets
  for (const k of await ev(() => PET_ORDER)) { await ev(k => { Game.addItem('egg_' + k, 1, true); Game.useItem('egg_' + k); WM.closeAll(); }, k); await page.waitForTimeout(150); }
  // panels
  const panels = await ev(() => { const fnKeys = ['models', 'wardrobe', 'jobs', 'ghost', 'gm', 'chat', 'channels', 'skills', 'stable', 'season', 'gemshop', 'topup', 'inv', 'char', 'quest', 'map', 'ach', 'settings', 'help', 'menu']; return fnKeys.concat(Object.keys(UI.extraPanels || {})); });
  for (const p of panels) { const r = await ev(p => { try { UI.openPanel(p, p === 'evcab' ? { ev: 'halloween' } : {}); const w = WM.wins.get(p); const ok = w && w.body.innerHTML.length > 20; WM.closeAll(); return ok ? 'ok' : 'empty'; } catch (e) { return e.message; } }, p); if (r !== 'ok') bad.push('panel ' + p + ': ' + r); await page.waitForTimeout(120); }
  for (const shop of await ev(() => Object.keys(SHOPS))) { const r = await ev(s => { try { UI.openPanel('shop', { shop: s, tab: 'buy' }); UI.panelOpt.tab = 'sell'; UI.renderPanel(); WM.closeAll(); return 'ok'; } catch (e) { return e.message; } }, shop); if (r !== 'ok') bad.push('shop ' + shop + ': ' + r); }
  for (const n of await ev(() => NPCList.map(n => n.id))) { const r = await ev(id => { try { UI.dialog(NPCList.find(x => x.id === id)); WM.closeAll(); return 'ok'; } catch (e) { return e.message; } }, n); if (r !== 'ok') bad.push('npc ' + n + ': ' + r); }
  console.log('panels', panels.length, errors.length);
  // zones: fight each monster type
  for (const [zone, x, z] of await ev(() => [['dungeon', DX, -40], ['temple', TX, 30], ['amazon', AX, 80], ['world', 9, 66]])) {
    await ev(([zone, x, z]) => { Player.x = x; Player.z = z; Player.zone = zone; Game.setEnv(zone); Cam.update(0, true); }, [zone, x, z]);
    await page.waitForTimeout(1500);
    const r = await ev(zone => { const out = []; const types = {}; for (const m of Monsters.list) if (m.zone === zone && !m.dead && !types[m.type]) types[m.type] = m;
      for (const t in types) { const m = types[t]; try { Player.x = m.x + 2; Player.z = m.z; m.aggro = true; Game.safeT = 0; for (let i = 0; i < 30; i++) Game.update(.05); if (!m.d.boss && !m.d.wboss) Combat.damageMonster(m, 1e9, {}); } catch (e) { out.push(t + ': ' + e.message); } }
      Save.d.hp = Player.stats.maxhp; Player.dead = false; return { n: Object.keys(types).length, out }; }, zone);
    bad.push(...r.out); console.log('zone', zone, r.n, errors.length);
    await page.waitForTimeout(1200);
  }
  // save / load roundtrip
  const sl = await ev(() => { try { Save.write(); const s0 = JSON.stringify(Save.d).length; Save.load(); Game.start(Save.d); return 'ok ' + s0; } catch (e) { return e.message; } }); if (!sl.startsWith('ok')) bad.push('saveload ' + sl);
  await page.waitForTimeout(1000);
  console.log('BAD', JSON.stringify(bad, null, 1));
  console.log('ERRORS', JSON.stringify([...new Set(errors.filter(e => !e.includes('TUNNEL')))].slice(0, 30), null, 1));
  await close();
})();
