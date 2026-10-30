# Swordia prototype — pixel-art build

`pixel.js` is the new pixel-art renderer (terrain, sprites, props, HUD extras) layered on the original prototype logic in `game.js`.
`pre.html`/`post.html` are the HUD template around the game script; `orig.html` is the original standalone bundle used as the packing shell.

Build: copy these files into `src/` next to `build.py` and `orig.html`, run `python3 build.py`, output `dist/index.html`.
Test build: `/swordia-test/` (always tested first). Live build: `/swordia/`.
