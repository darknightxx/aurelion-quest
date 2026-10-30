"""Turn a fresh copy of Aurelion Quest dev/ into สยาม RPG.
Idempotent: safe to re-run after pulling new AQ code into src/.
Run:  python3 siam_rebrand.py && python3 build.py
"""
import glob, os, re

D = os.path.dirname(os.path.abspath(__file__))
THAI = '฀-๿'


# Thai monster/boss names (step 1). Longest names first; new names never contain an old one, so re-running is safe.
NAME_MAP = [
    ('คราก', 'ยักษ์ศิลา'),
    ('ราชาสไลม์', 'ราชาวุ้นใบเตย'), ('สไลม์', 'วุ้นใบเตย'),
    ('เห็ดยักษ์โบราณ', 'เห็ดโคนพันปี'), ('เห็ดซุกซน', 'เห็ดโคนซุกซน'),
    ('หมาป่าเขี้ยวเงิน', 'จ่าฝูงหมาในเขี้ยวเงิน'), ('หมาป่าสีเทา', 'หมาใน'), ('หมาป่า', 'หมาใน'),
    ('จอมทัพก็อบลิน', 'ท้าวยักษ์คุมทุ่ง'), ('ก็อบลินป่า', 'ยักษ์น้อยเฝ้าทุ่ง'), ('ก็อบลิน', 'ยักษ์น้อย'),
    ('ราชินีค้างคาวผลึก', 'นางพญาค้างคาว'), ('ค้างคาวผลึก', 'ค้างคาวแม่ไก่'),
    ('อัศวินกระดูกมรณะ', 'แม่ทัพกระดูกกรุงเก่า'), ('โครงกระดูกยาม', 'ทหารโครงกระดูกกรุงเก่า'),
    ('ปลาปิรันย่า', 'ปลาช่อนผี'), ('ปิรันย่า', 'ปลาช่อนผี'),
    ('กบลูกดอกพิษ', 'อึ่งพิษลายทอง'), ('กบลูกดอก', 'อึ่งพิษ'),
    ('เสือจากัวร์', 'เสือดาวป่าลึก'), ('จากัวร์', 'เสือดาวป่าลึก'),
    ('แมงมุมยักษ์ทารันทูล่า', 'บึ้งยักษ์'), ('ทารันทูล่า', 'บึ้ง'),
    ('ราชันย์อนาคอนด้า', 'พญางูเหลือม'), ('งูอนาคอนด้า', 'งูเหลือมยักษ์'), ('อนาคอนด้า', 'งูเหลือมยักษ์'),
    ('ราชินีพืชกินคน', 'นางไม้ไทรพันปี'), ('ต้นไม้กินคน', 'ต้นไทรผีสิง'), ('ดงไม้กินคน', 'ดงไทรผีสิง'), ('พืชกินคน', 'ไทรผีสิง'),
    ('จระเข้เคแมน', 'จระเข้บึง'), ('เคแมน', 'จระเข้บึง'),
    ('หัวหน้าเผ่าโอกรกินคน', 'ท้าวยักษ์หิมพานต์'), ('หมู่บ้านโอกรเผ่ากินคน', 'หมู่บ้านยักษ์ป่า'),
    ('โอกรนักรบเผ่ากินคน', 'ยักษ์ป่าหิมพานต์'), ('โอกรหมอผีเผ่ากินคน', 'ยักษ์หมอผี'),
    ('โอกรเผ่ากินคน', 'ยักษ์ป่า'), ('เผ่าโอกร', 'เผ่ายักษ์ป่า'), ('โอกร', 'ยักษ์ป่า'),
]
for _old, _new in NAME_MAP:
    for _o2, _ in NAME_MAP:
        assert _o2 not in _new, f'new name {_new} contains old name {_o2}'

def rebrand_text(s):
    # credit lines that must keep the original name
    s = s.replace('จาก Aurelion Quest', '\x00AQ\x00')
    # browser storage keys / IndexedDB / Firebase app name: keep separate from AQ on the same site
    s = re.sub(r"(['\"`])aurelion_", r"\1siam_", s)
    s = re.sub(r"(['\"`])aq_(gmevent|winpos|models)", r"\1siam_\2", s)
    s = s.replace("initializeApp(cfg, 'aurelion')", "initializeApp(cfg, 'siam')")
    # names shown to players
    s = s.replace('Aurelion Quest', 'สยาม RPG')
    s = s.replace('AURELION', 'SIAM')
    s = s.replace('ทวีป Aurelion', 'แดนสยาม')
    s = s.replace('ตำนานนักผจญภัยแห่งปัญญา', 'ตำนานนักผจญภัยแห่งแดนสยาม')
    s = re.sub(rf'([{THAI}]) Aurelion', r'\1สยาม', s)  # Thai has no spaces between words
    s = s.replace('Aurelion', 'สยาม')
    s = s.replace('เกม 3D Action RPG', 'เกม 2.5D Action RPG ธีมไทย')
    for old, new in NAME_MAP:
        s = s.replace(old, new)
    return s.replace('\x00AQ\x00', 'จาก Aurelion Quest')

# online: สยาม RPG players use their own channels (ch/11-13) so they never meet AQ players
NET_OLD = "  r(p) { return this.D.ref(this.db, p); }"
NET_NEW = ("  // สยาม RPG: shift channel ids so this game's players never share a room with the original AQ game\n"
           "  r(p) { return this.D.ref(this.db, typeof p === 'string' ? p.replace(/^ch\\/(\\d+)/, (m, n) => 'ch/' + (+n + SIAM_CH_BASE)) : p); }")

changed = []
files = sorted(glob.glob(os.path.join(D, 'src', '*.js'))) + [os.path.join(D, f) for f in ('head.html', 'template.html')]
for f in files:
    s = open(f, encoding='utf-8').read()
    t = rebrand_text(s)
    if f.endswith('08i_multi.js') and 'SIAM_CH_BASE' not in t:
        assert NET_OLD in t, 'FirebaseBackend.r() changed upstream — update siam_rebrand.py'
        t = t.replace(NET_OLD, NET_NEW)
        t = t.replace('const NET_CHANNELS = 3,', 'const SIAM_CH_BASE = 10;\nconst NET_CHANNELS = 3,', 1)
    if t != s:
        open(f, 'w', encoding='utf-8').write(t)
        changed.append(os.path.relpath(f, D))
print('changed:', ', '.join(changed) or 'nothing')
