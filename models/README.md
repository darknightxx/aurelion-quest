# โมเดล 3 มิติของตัวละคร (.glb)

วางไฟล์ `.glb` ไว้ในโฟลเดอร์นี้ แล้วเพิ่มรายการใน `index.json` เกมจะโหลดให้ผู้เล่นทุกคนอัตโนมัติ

```json
[
  { "sheet": "lordknight", "file": "lordknight.glb", "scale": 1, "yaw": 0, "y": 0 },
  { "sheet": "knight", "file": "knight.glb" }
]
```

- `sheet` = คีย์ของตัวละคร: อาชีพพื้นฐาน `adventurer knight ninja archer mage priest`
  อาชีพขั้นสอง `lordknight paladin whitesmith creator assassinx stalker sniper minstrel highwizard professor highpriest champion`
  หรือคีย์ของชุดแฟชั่น
- `scale` ขยาย/ย่อเพิ่มจากที่เกมปรับให้พอดีอัตโนมัติ (1 = พอดี), `yaw` หมุนหน้า (เรเดียน), `y` ยกขึ้น/ลง

## ข้อกำหนดไฟล์

1. glTF Binary (.glb) ไฟล์เดียว ฝังเท็กซ์เจอร์ ไม่บีบอัด Draco ขนาดไม่เกิน 24 MB
2. แนะนำ 1,500–5,000 สามเหลี่ยม สีแบบ cel/flat
3. กระดูกแบบมนุษย์ ชื่อมาตรฐาน (Mixamo / VRM / Rigify) เช่น Hips, Spine, Head, LeftArm, LeftForeArm, LeftUpLeg, LeftLeg
   เกมจะขยับกระดูกเหล่านี้ให้ตามท่าทางทั้งหมดในเกม (เดิน โจมตี สกิล อีโมต) แม้ไฟล์ไม่มีอนิเมชัน
4. หันหน้าไปทาง +Z แกน Y ขึ้น ยืนบนพื้น (T-pose หรือ A-pose ได้ เกมดึงแขนลงให้เอง)
5. ถ้ามีอนิเมชันชื่อ Idle / Walk / Run / Attack / Dance ฯลฯ เกมจะใช้คลิปเหล่านั้น

## ขั้นตอนทำโมเดล

1. เตรียมรูปอ้างอิงหน้าตรง ตัดพื้นหลัง (PNG โปร่ง)
2. สร้างด้วย AI Image-to-3D (Tripo / Meshy / Ludo): `low-poly stylized game character, simple mesh, flat texture` → ตรวจด้านหลัง → ส่งออก GLB/FBX
3. ใน Blender: ลดโพลี, ทำ rig (Auto-Rig / Rigify / Mixamo), ส่งออก `.glb` (เลือก Include → Skinning, Animation)
4. ทดลองในเกม: ตั้งค่า → โมเดล 3 มิติ → นำเข้า .glb (เห็นเฉพาะเครื่องตัวเอง) ปรับขนาด/ทิศ แล้วค่อยนำมาวางที่นี่
