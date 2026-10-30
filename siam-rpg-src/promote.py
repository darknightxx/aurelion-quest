"""Promote the tested build to the live game: ../siam-rpg-test/index.html -> ../siam-rpg/index.html
Run only after the test build has been played and approved."""
import os, shutil, sys
D = os.path.dirname(os.path.abspath(__file__))
src = os.path.join(D, '..', 'siam-rpg-test', 'index.html')
dst = os.path.join(D, '..', 'siam-rpg', 'index.html')
if not os.path.exists(src): sys.exit('no test build — run build.py first')
os.makedirs(os.path.dirname(dst), exist_ok=True)
shutil.copyfile(src, dst)
print('live build updated:', os.path.relpath(dst, os.path.join(D, '..')))
