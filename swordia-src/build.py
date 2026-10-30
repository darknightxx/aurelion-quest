import json, re
src = 'src/'
pre = open(src + 'pre.html', encoding='utf-8').read()
post = open(src + 'post.html', encoding='utf-8').read()
props = open(src + 'props.txt', encoding='utf-8').read()
code = '\n'.join(open(src + f, encoding='utf-8').read() for f in ['game.js', 'content_data.js', 'pixel.js', 'content.js'])
tpl = pre + '<script type="text/x-dc"' + props + '>' + code + '</script>' + post
orig = open('orig.html', encoding='utf-8').read()
m = re.search(r'(<script type="__bundler/template">)(.*?)(</script>)', orig, re.S)
enc = json.dumps(tpl).replace('</', '<\\u002F')
out = orig[:m.start(2)] + enc + orig[m.end(2):]
out = out.replace('<title>Bundled Page</title>', '<title>Swordia — ตำนานยุทธจักร</title>', 1)
open('dist/index.html', 'w', encoding='utf-8').write(out)
open('dist/game.js', 'w', encoding='utf-8').write(code)
print('built', len(out))
