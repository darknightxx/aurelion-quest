/* ============================================================
   3D model manager panel: import personal .glb files, tune fit,
   list shared models from the web host
   ============================================================ */
UI.pModels = function (o) {
  const S = Save.d || {}; const cur = S.job || S.cls; const tune = (o && o.tune) || null;
  const groups = [
    ['ตัวละครของฉัน', [S.cls, S.job].filter(Boolean)],
    ['อาชีพพื้นฐาน', CLASS_ORDER.slice()],
    ['อาชีพขั้นสอง', Object.keys(JOBS)],
    ['ชุดแฟชั่น', (typeof FASHION_SHEETS !== 'undefined' ? FASHION_SHEETS : [])]
  ];
  const nameOf = k => JOBS[k] ? JOBS[k].name : CLASSES[k] ? CLASSES[k].name : (typeof FASHION !== 'undefined' && FASHION.sheetName) ? FASHION.sheetName(k) : k;
  const row = k => {
    const m = GLBModels[k]; const err = GLBSys.errors[k]; const ld = GLBSys.loading[k];
    const st = m ? (m.src === 'local' ? `<i class="tag ok">โมเดลของฉัน (เครื่องนี้)</i>` : `<i class="tag">โมเดลกลาง</i>`) : ld ? '<i class="tag">กำลังโหลด…</i>' : '<i class="tag dim">โมเดลโค้ด</i>';
    const info = m ? `${m.tris.toLocaleString()} สามเหลี่ยม · ${m.skinned ? 'มีกระดูก ' + Object.keys(m.bones).length + ' ชิ้น' : 'ไม่มีกระดูก (ไม่ขยับแขนขา)'}${m.anims.length ? ' · อนิเมชัน ' + m.anims.length : ''}` : err ? `<span class="warn">${esc(err)}</span>` : '';
    const t = (m && m.opts) || {};
    const tuneBox = tune === k ? `<div class="mdltune"><label>ขนาด <b id="mt-s">${(t.scale || 1).toFixed(2)}</b><input type="range" id="mts" min=".5" max="2" step=".02" value="${t.scale || 1}"></label><label>หันหน้า <b id="mt-y">${Math.round((t.yaw || 0) * 180 / Math.PI)}°</b><input type="range" id="mty" min="-180" max="180" step="5" value="${Math.round((t.yaw || 0) * 180 / Math.PI)}"></label><label>ยกขึ้น/ลง <b id="mt-h">${(t.y || 0).toFixed(2)}</b><input type="range" id="mth" min="-.6" max=".6" step=".02" value="${t.y || 0}"></label><div class="row"><button class="btn sm" data-mapply="${k}">ใช้ค่านี้</button><button class="btn sm ghost" data-mtune="">ปิด</button></div></div>` : '';
    return `<li class="mdlrow ${k === cur ? 'cur' : ''}"><img src="${UI.bodies[k] || ''}" alt=""><div class="mdlin"><b>${esc(nameOf(k))} ${st}</b><small>${info}</small>${tuneBox}</div><div class="mdlact"><label class="btn sm">นำเข้า .glb<input type="file" accept=".glb,.gltf,model/gltf-binary,model/gltf+json" data-mimp="${k}" hidden></label>${m ? `<button class="btn sm ghost" data-mtune="${k}">ปรับ</button>` : ''}${m && m.src === 'local' ? `<button class="btn sm ghost danger" data-mdel="${k}">ลบ</button>` : ''}</div></li>`;
  };
  this.setPanel(`${icon('person')} โมเดล 3 มิติ`, `
    <p class="muted">นำโมเดล .glb ที่ทำเอง (เช่น จาก Tripo / Meshy แล้วปรับใน Blender) มาใช้แทนตัวละครในเกม โมเดลที่นำเข้าที่นี่จะเห็นเฉพาะเครื่องนี้ ถ้าอยากให้ทุกคนเห็น ส่งไฟล์ให้ผู้ดูแลใส่ไว้ในโฟลเดอร์ <code>models/</code> ของเกม</p>
    <details class="howto"><summary>ข้อกำหนดของไฟล์และวิธีทำ</summary>
      <ol>
        <li>เตรียมรูปอ้างอิงหน้าตรง ตัดพื้นหลัง (PNG โปร่ง) แล้วสร้างด้วย AI Image-to-3D: <em>low-poly stylized game character, simple mesh, flat texture</em></li>
        <li>ใน Blender ลดโพลีให้เหลือ 1,500–5,000 สามเหลี่ยม ใส่สีแบบ cel/flat และ <b>Rig กระดูกแบบมนุษย์</b> (ชื่อกระดูกมาตรฐาน Mixamo / VRM / Rigify เช่น Hips, Spine, Head, LeftArm, LeftForeArm, LeftUpLeg, LeftLeg)</li>
        <li>หันหน้าไปทาง +Z, แกน Y ขึ้น, ยืนบนพื้น y=0 (เกมจะย่อ/ขยายให้พอดีอัตโนมัติ)</li>
        <li>ส่งออก <b>glTF Binary (.glb)</b> ฝังเท็กซ์เจอร์ในไฟล์ ไม่บีบอัด Draco ขนาดไม่เกิน 24 MB</li>
        <li>อนิเมชันไม่บังคับ ถ้ามีคลิปชื่อ Idle / Walk / Run / Attack / Dance เกมจะใช้ให้ ถ้าไม่มีเกมจะขยับกระดูกให้เองตามท่าทางทั้งหมดในเกม (เดิน โจมตี สกิล อีโมต)</li>
      </ol></details>
    ${groups.map(([t, ks]) => ks.length ? `<h3 class="sub">${t}</h3><ul class="mdllist">${ks.map(row).join('')}</ul>` : '').join('')}
    <p class="muted">${GLBSys.list.length ? 'โมเดลกลางที่ติดตั้ง: ' + GLBSys.list.map(e => esc(e.sheet)).join(', ') : 'ยังไม่มีโมเดลกลางในโฟลเดอร์ models/'}</p>`);
  const body = this.el.pbody;
  body.querySelectorAll('[data-mimp]').forEach(inp => inp.onchange = async () => {
    const f = inp.files[0]; if (!f) return; const k = inp.dataset.mimp; UI.toast('กำลังอ่านโมเดล…');
    try { const m = await GLBSys.importFile(k, f, {}); UI.toast(`ใส่โมเดล ${nameOf(k)} แล้ว (${m.tris.toLocaleString()} สามเหลี่ยม${m.skinned ? '' : ' · ไม่พบกระดูกแบบมนุษย์'})`, 'quest'); if (!m.skinned) UI.toast('โมเดลไม่มีกระดูกชื่อมาตรฐาน จะยืนนิ่งขยับไม่ได้', 'warn'); }
    catch (e) { UI.toast('นำเข้าไม่สำเร็จ: ' + (e.message || e), 'warn'); }
    UI.renderPanel();
  });
  body.querySelectorAll('[data-mdel]').forEach(b => b.onclick = async () => { if (!b.dataset.c) { b.dataset.c = 1; b.textContent = 'ยืนยันลบ?'; return; } await GLBSys.removeLocal(b.dataset.mdel); UI.toast('ลบโมเดลแล้ว กลับไปใช้โมเดลเดิม'); UI.renderPanel(); });
  body.querySelectorAll('[data-mtune]').forEach(b => b.onclick = () => { this.panelOpt.tune = b.dataset.mtune || null; UI.renderPanel(); });
  const live = () => { const k = tune; if (!k) return; const s = $('#mts'), y = $('#mty'), h = $('#mth'); if (!s) return; $('#mt-s').textContent = (+s.value).toFixed(2); $('#mt-y').textContent = y.value + '°'; $('#mt-h').textContent = (+h.value).toFixed(2); };
  ['#mts', '#mty', '#mth'].forEach(id => { const e = $(id); if (e) e.oninput = live; });
  body.querySelectorAll('[data-mapply]').forEach(b => b.onclick = async () => { const k = b.dataset.mapply; const opts = { scale: +$('#mts').value, yaw: +$('#mty').value * Math.PI / 180, y: +$('#mth').value }; await GLBSys.retune(k, opts); UI.toast('ปรับโมเดลแล้ว', 'quest'); UI.renderPanel(); });
};

