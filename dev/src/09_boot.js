/* ============================================================
   Boot
   ============================================================ */
window.addEventListener('beforeunload', () => { if (Game.started) Save.write(); });
document.addEventListener('visibilitychange', () => { if (document.hidden && Game.started) Save.write(); });
try { window.claude && window.claude.hot && window.claude.hot.snapshot && window.claude.hot.snapshot(() => { if (Game.started) Save.write(); return {}; }); } catch (e) { }
Game.init();

