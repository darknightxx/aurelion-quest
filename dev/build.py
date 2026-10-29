"""Build: concatenate dev/src/*.js (filename order) into dev/template.html -> ../index.html"""
import glob, os, sys
D=os.path.dirname(os.path.abspath(__file__))
R=lambda p: open(os.path.join(D,p),encoding='utf-8').read()
code=''.join(open(f,encoding='utf-8').read() for f in sorted(glob.glob(os.path.join(D,'src','*.js'))))
assert '</script' not in code.lower(), 'closing script tag in code'
html=R('head.html')+R('template.html').replace('/*__CODE__*/',code)+R('tail.html')
os.makedirs(os.path.join(D,'dist'),exist_ok=True)
open(os.path.join(D,'dist','code.js'),'w',encoding='utf-8').write(code)
open(os.path.join(D,'..','index.html'),'w',encoding='utf-8').write(html)
print('built', len(html), 'bytes')
