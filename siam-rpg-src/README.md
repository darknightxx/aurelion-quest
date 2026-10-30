# สยาม RPG

เกม 2.5D Action RPG ธีมไทย บนเบราว์เซอร์ (คอม + มือถือ) — แยกโค้ดมาจาก Aurelion Quest
โลกเป็น 3D ส่วนตัวละคร NPC และมอนสเตอร์วาดเป็นภาพพิกเซลแบบ Ragnarok Online (WebGL engine ของ AQ เอง)

- เวอร์ชันทดสอบ: https://darknightxx.github.io/aurelion-quest/siam-rpg-test/
- เวอร์ชันจริง: https://darknightxx.github.io/aurelion-quest/siam-rpg/ (ขึ้นหลังลองเล่นเวอร์ชันทดสอบแล้ว)

## โครงสร้างใน repo
```
siam-rpg-src/              ซอร์สโค้ดของสยาม (โฟลเดอร์นี้)
  src/*.js                 โค้ดเกม รวมตามลำดับชื่อไฟล์
  template.html            HTML/CSS ของหน้าเกม
  build.py                 รวมโค้ด → ../siam-rpg-test/index.html (เวอร์ชันทดสอบเท่านั้น)
  promote.py               คัดลอกเวอร์ชันทดสอบ → ../siam-rpg/index.html (เวอร์ชันจริง)
  siam_rebrand.py          แปลงโค้ด AQ เป็นสยาม (ชื่อเกม ชื่อมอนสเตอร์ไทย คีย์เซฟ ห้องออนไลน์)
  test/                    ทดสอบด้วย Playwright (t_siam.js = เฉพาะของสยาม, t_audit.js = ทั้งระบบ)
siam-rpg-test/index.html   เกมเวอร์ชันทดสอบ
siam-rpg/index.html        เกมเวอร์ชันจริง
```
build.py ไม่เขียนทับ `index.html` ของ Aurelion Quest ที่ root ของ repo

## ขั้นตอนทุกครั้งที่อัปเดต
1. แก้โค้ดใน `src/` และเพิ่มแพตช์โน้ตบนสุดของ `PATCH_NEW` ใน `src/08p_patchnotes.js`
2. `python3 build.py`
3. `node test/t_siam.js` และ `node test/t_audit.js` (ต้องมี playwright)
4. push → ลองเล่นที่ `/siam-rpg-test/`
5. ผ่านแล้ว: `python3 promote.py` → push → เวอร์ชันจริงที่ `/siam-rpg/`

เล่นในเครื่อง: `python -m http.server 8080` ที่ root ของ repo แล้วเปิด `http://localhost:8080/siam-rpg-test/` (เพิ่ม `?net=local` เพื่อเล่นออฟไลน์)

## ดึงอัปเดตใหม่จาก Aurelion Quest
1. คัดลอก `dev/src/*.js` และ `dev/template.html` ใหม่จาก AQ มาทับ (ระวังไฟล์ที่สยามแก้เอง: `08p_patchnotes.js`, `08d_lobby.js`)
2. `python3 siam_rebrand.py` แล้ว `python3 build.py`
3. รันทดสอบตามขั้นตอนด้านบน

## สิ่งที่แยกจาก AQ แล้ว
- เซฟ/ตั้งค่า/คลังเก็บโมเดล ใช้คีย์ `siam_*` (เล่นสองเกมบนเว็บเดียวกันได้ไม่ทับกัน)
- ห้องออนไลน์ CH1–CH3 ของสยาม = `ch/11–13` ในฐานข้อมูล ผู้เล่นสองเกมจะไม่เห็นกัน

## สิ่งที่ยังใช้ร่วมกับ AQ
- ฐานข้อมูล Firebase เดียวกัน: ตัวนับคนออนไลน์, ประกาศจาก GM, ปาร์ตี้/คำเชิญ, รายงานผู้เล่น
  → ถ้าต้องการแยกสมบูรณ์ ให้สร้าง Firebase project ใหม่ แล้วแก้ `FIREBASE_CONFIG` ใน `src/08h_online.js`
- โมเดล 3D (GLB) โหลดจาก `https://darknightxx.github.io/aurelion-quest/models/`
