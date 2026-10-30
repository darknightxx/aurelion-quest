/* ============================================================
   สยาม RPG — zone table (one entry per game zone id: Player.zone / m.zone)
   Static facts live here; monsters, MVPs, NPCs and warps are read from the
   live game data (Monsters.list, MVPSys.list, NPCList, WARPS) so nothing is
   listed twice. Used by the world map filters (08zz_siam_map.js) and tests.
   ============================================================ */
const ZONES = {
  world: {
    name: 'แดนสยาม', type: 'field', lv: [1, 15], minLv: 1,
    desc: 'เมืองหลวงสยาม ทุ่งนาสยาม ป่ากระซิบ และค่ายยักษ์น้อย',
    links: ['dungeon', 'temple', 'amazon'],
    // world → canvas transform used by the zone's map tab (canvas px = (w + off) * k)
    map: { offX: 150, offZ: 150, k: 2 }
  },
  dungeon: {
    name: 'ถ้ำนาคาใต้พิภพ', type: 'dungeon', lv: [6, 18], minLv: 5,
    desc: 'ถ้ำลึกใต้ประตูผนึกทางเหนือ ยักษ์ศิลาเฝ้าอยู่ชั้นในสุด',
    links: ['world'], map: null
  },
  temple: {
    name: 'วัดร้างกลางป่า', type: 'dungeon', lv: [6, 15], minLv: 6,
    desc: 'วัดร้างทางตะวันตก ผีไทย 20 ชนิด หลวงตาพุฒรอโปรดวิญญาณ',
    links: ['world'],
    map: { offX: 75 - 2000, offZ: 75, k: 4 }
  },
  amazon: {
    name: 'ป่าหิมพานต์มรณะ', type: 'field', lv: [15, 26], minLv: 15,
    desc: 'ป่าลึกทางตะวันออก สัตว์ป่า ยักษ์ป่า และพญางูเหลือม',
    links: ['world'],
    map: { offX: 110 - 3000, offZ: 110, k: 3 }
  }
};
const ZONE_ORDER = ['world', 'dungeon', 'temple', 'amazon'];

const Zones = {
  get(id) { return ZONES[id] || null; },
  // regular monster types in a zone (no MVP/mini-boss), one row per type
  monsters(id) {
    const out = {};
    for (const m of Monsters.list) {
      if (m.zone !== id || m.mvpId) continue;
      const r = out[m.type] || (out[m.type] = { type: m.type, name: m.d.name, lvl: m.d.lvl, n: 0, boss: !!(m.d.boss || m.d.wboss || m.d.elite), home: m.home || { x: m.x, z: m.z } });
      r.n++;
    }
    return Object.values(out).sort((a, b) => a.lvl - b.lvl);
  },
  mvps(id) {
    return MVPSys.list.filter(m => m.zone === id).map(m => { const D = MVP_DEFS[m.mvpId]; return { id: m.mvpId, name: D.name, lvl: D.lvl, tier: D.tier, alive: !m.dead, left: MVPSys.left(D), home: m.home || { x: D.x, z: D.z } }; });
  },
  npcs(id) { return NPCList.filter(n => n.zone === id).map(n => ({ id: n.id, name: n.name, role: n.role, x: n.x, z: n.z })); },
  warps(id) { return WARPS.filter(w => w.zone === id); },
  // level range of the zone's regular monsters (bosses excluded)
  levelRange(id) {
    const ls = this.monsters(id).filter(r => !r.boss).map(r => r.lvl);
    return ls.length ? [Math.min(...ls), Math.max(...ls)] : null;
  }
};
