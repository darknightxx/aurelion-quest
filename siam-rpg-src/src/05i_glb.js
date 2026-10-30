/* ============================================================
   GLB (glTF 2.0 binary) models: loader, textured skinned draw,
   humanoid retargeting of the game's procedural animation
   ============================================================
   A sheet (class / job / costume key) can be backed by a .glb file:
   - models/index.json on the web host lists shared models
   - players can import a .glb for their own character (IndexedDB)
   Rig(sheet) transparently becomes a GlbRig when a model is registered.
*/
const GLBModels = {};               // sheet -> loaded model
const MODEL_BASE = (typeof location !== 'undefined' && /darknightxx\.github\.io/.test(location.host)) ? './models/' : 'https://darknightxx.github.io/aurelion-quest/models/';

/* ---------- small quaternion helpers ---------- */
const Q = {
  m(out, q, t, s) { // TRS -> mat4 (column major)
    const x = q[0], y = q[1], z = q[2], w = q[3], x2 = x + x, y2 = y + y, z2 = z + z;
    const xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2;
    const sx = s ? s[0] : 1, sy = s ? s[1] : 1, sz = s ? s[2] : 1;
    out[0] = (1 - (yy + zz)) * sx; out[1] = (xy + wz) * sx; out[2] = (xz - wy) * sx; out[3] = 0;
    out[4] = (xy - wz) * sy; out[5] = (1 - (xx + zz)) * sy; out[6] = (yz + wx) * sy; out[7] = 0;
    out[8] = (xz + wy) * sz; out[9] = (yz - wx) * sz; out[10] = (1 - (xx + yy)) * sz; out[11] = 0;
    out[12] = t ? t[0] : 0; out[13] = t ? t[1] : 0; out[14] = t ? t[2] : 0; out[15] = 1; return out;
  },
  slerp(out, a, b, t) {
    let ax = a[0], ay = a[1], az = a[2], aw = a[3], bx = b[0], by = b[1], bz = b[2], bw = b[3];
    let cos = ax * bx + ay * by + az * bz + aw * bw; if (cos < 0) { cos = -cos; bx = -bx; by = -by; bz = -bz; bw = -bw; }
    let s0, s1; if (1 - cos > 1e-5) { const om = Math.acos(cos), so = Math.sin(om); s0 = Math.sin((1 - t) * om) / so; s1 = Math.sin(t * om) / so; } else { s0 = 1 - t; s1 = t; }
    out[0] = s0 * ax + s1 * bx; out[1] = s0 * ay + s1 * by; out[2] = s0 * az + s1 * bz; out[3] = s0 * aw + s1 * bw; return out;
  },
  // rotation part of a mat4 -> mat4 (no translation / scale)
  rot(out, m) { const sx = Math.hypot(m[0], m[1], m[2]) || 1, sy = Math.hypot(m[4], m[5], m[6]) || 1, sz = Math.hypot(m[8], m[9], m[10]) || 1; out.fill(0); out[0] = m[0] / sx; out[1] = m[1] / sx; out[2] = m[2] / sx; out[4] = m[4] / sy; out[5] = m[5] / sy; out[6] = m[6] / sy; out[8] = m[8] / sz; out[9] = m[9] / sz; out[10] = m[10] / sz; out[15] = 1; return out; },
  transpose(out, m) { const r = new Float32Array(16); for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) r[i * 4 + j] = m[j * 4 + i]; out.set(r); return out; },
  // rotation taking unit vector a to unit vector b (mat4)
  fromTo(out, a, b) {
    const cx = a[1] * b[2] - a[2] * b[1], cy = a[2] * b[0] - a[0] * b[2], cz = a[0] * b[1] - a[1] * b[0]; const d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    const l = Math.hypot(cx, cy, cz); if (l < 1e-6) { out.fill(0); out[0] = out[5] = out[10] = out[15] = d < 0 ? -1 : 1; if (d < 0) out[15] = 1; return out; }
    const ang = Math.atan2(l, d), x = cx / l, y = cy / l, z = cz / l, c = Math.cos(ang), s = Math.sin(ang), t = 1 - c;
    out[0] = t * x * x + c; out[1] = t * x * y + s * z; out[2] = t * x * z - s * y; out[3] = 0;
    out[4] = t * x * y - s * z; out[5] = t * y * y + c; out[6] = t * y * z + s * x; out[7] = 0;
    out[8] = t * x * z + s * y; out[9] = t * y * z - s * x; out[10] = t * z * z + c; out[11] = 0; out[12] = out[13] = out[14] = 0; out[15] = 1; return out;
  }
};

/* ---------- parsing ---------- */
const GLB = {
  CT: { 5120: Int8Array, 5121: Uint8Array, 5122: Int16Array, 5123: Uint16Array, 5125: Uint32Array, 5126: Float32Array },
  NT: { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT2: 4, MAT3: 9, MAT4: 16 },
  parse(buf) {
    const dv = new DataView(buf);
    if (dv.getUint32(0, true) !== 0x46546C67) { // not binary: maybe .gltf json with embedded data
      const json = JSON.parse(new TextDecoder().decode(new Uint8Array(buf))); return { json, bin: null };
    }
    const len = dv.getUint32(8, true); let off = 12, json = null, bin = null;
    while (off < len) {
      const cl = dv.getUint32(off, true), ct = dv.getUint32(off + 4, true); off += 8;
      if (ct === 0x4E4F534A) json = JSON.parse(new TextDecoder().decode(new Uint8Array(buf, off, cl)));
      else if (ct === 0x004E4942) bin = buf.slice(off, off + cl);
      off += cl;
    }
    return { json, bin };
  },
  buffer(g, i) {
    if (g._bufs[i]) return g._bufs[i];
    const b = g.json.buffers[i]; let out;
    if (b.uri && b.uri.startsWith('data:')) { const s = atob(b.uri.slice(b.uri.indexOf(',') + 1)); const u = new Uint8Array(s.length); for (let k = 0; k < s.length; k++) u[k] = s.charCodeAt(k); out = u.buffer; }
    else if (!b.uri) out = g.bin;
    else throw new Error('ไฟล์ .gltf อ้างอิงไฟล์ภายนอก (' + b.uri + ') กรุณาส่งออกเป็น .glb ไฟล์เดียว');
    return g._bufs[i] = out;
  },
  view(g, i) { const v = g.json.bufferViews[i]; const buf = this.buffer(g, v.buffer); return { buf, off: v.byteOffset || 0, len: v.byteLength, stride: v.byteStride || 0 }; },
  // returns Float32Array (de-interleaved, normalized when flagged) or integer typed array for joints/indices
  accessor(g, i, keepInt) {
    const a = g.json.accessors[i]; if (a.sparse) throw new Error('sparse accessor ไม่รองรับ');
    const n = a.count, sz = this.NT[a.type], T = this.CT[a.componentType]; const bpe = T.BYTES_PER_ELEMENT;
    const out = keepInt && T !== Float32Array ? new (T === Uint8Array ? Uint16Array : T === Int8Array ? Int16Array : T === Int16Array ? Uint16Array : T)(n * sz) : new Float32Array(n * sz);
    if (a.bufferView === undefined) return out;
    const v = this.view(g, a.bufferView); const base = v.off + (a.byteOffset || 0); const stride = v.stride || sz * bpe;
    const dv = new DataView(v.buf);
    const rd = T === Float32Array ? o => dv.getFloat32(o, true) : T === Uint8Array ? o => dv.getUint8(o) : T === Int8Array ? o => dv.getInt8(o) : T === Uint16Array ? o => dv.getUint16(o, true) : T === Int16Array ? o => dv.getInt16(o, true) : o => dv.getUint32(o, true);
    const norm = a.normalized && !keepInt; const k = norm ? (T === Uint8Array ? 1 / 255 : T === Uint16Array ? 1 / 65535 : T === Int8Array ? 1 / 127 : T === Int16Array ? 1 / 32767 : 1) : 1;
    for (let e = 0; e < n; e++) { const o = base + e * stride; for (let c = 0; c < sz; c++) { let val = rd(o + c * bpe); if (norm) val = Math.max(-1, val * k); out[e * sz + c] = val; } }
    return out;
  },
  async image(g, i) {
    const im = g.json.images[i]; let blob;
    if (im.bufferView !== undefined) { const v = this.view(g, im.bufferView); blob = new Blob([new Uint8Array(v.buf, v.off, v.len)], { type: im.mimeType || 'image/png' }); }
    else if (im.uri && im.uri.startsWith('data:')) { const r = await fetch(im.uri); blob = await r.blob(); }
    else return null;
    if (typeof createImageBitmap === 'function') { try { return await createImageBitmap(blob, { premultiplyAlpha: 'none', colorSpaceConversion: 'none' }); } catch (e) { } }
    return await new Promise((res, rej) => { const img = new Image(); img.onload = () => res(img); img.onerror = rej; img.src = URL.createObjectURL(blob); });
  },
  /* decode into a renderer-independent model */
  async decode(buf, opts = {}) {
    const p = this.parse(buf); if (!p.json) throw new Error('ไม่ใช่ไฟล์ glTF/GLB');
    const g = { json: p.json, bin: p.bin, _bufs: [] }; const J = g.json;
    if ((J.extensionsRequired || []).some(e => /draco/i.test(e))) throw new Error('โมเดลบีบอัดด้วย Draco กรุณาส่งออกแบบไม่บีบอัด (uncompressed)');
    const nodes = (J.nodes || []).map((n, idx) => ({ idx, name: n.name || ('node' + idx), children: n.children || [], parent: -1, t: n.translation ? n.translation.slice() : [0, 0, 0], r: n.rotation ? n.rotation.slice() : [0, 0, 0, 1], s: n.scale ? n.scale.slice() : [1, 1, 1], mat: n.matrix ? Float32Array.from(n.matrix) : null, mesh: n.mesh, skin: n.skin }));
    nodes.forEach(n => n.children.forEach(c => { nodes[c].parent = n.idx; }));
    const scene = J.scenes && J.scenes[J.scene || 0] ? J.scenes[J.scene || 0].nodes : nodes.filter(n => n.parent < 0).map(n => n.idx);
    // rest world matrices
    const loc = nodes.map(n => n.mat ? n.mat : Q.m(M4.ident(), n.r, n.t, n.s));
    const world = nodes.map(() => M4.ident());
    const walk = (i, pm) => { M4.mul(world[i], pm, loc[i]); nodes[i].children.forEach(c => walk(c, world[i])); };
    scene.forEach(i => walk(i, M4.ident()));
    // materials + images
    const imgs = {}; const mats = [];
    for (const m of (J.materials || [])) {
      const pbr = m.pbrMetallicRoughness || {}; const col = pbr.baseColorFactor || [1, 1, 1, 1]; let img = null;
      const ti = pbr.baseColorTexture ? pbr.baseColorTexture.index : (m.extensions && m.extensions.KHR_materials_pbrSpecularGlossiness && m.extensions.KHR_materials_pbrSpecularGlossiness.diffuseTexture ? m.extensions.KHR_materials_pbrSpecularGlossiness.diffuseTexture.index : undefined);
      if (ti !== undefined && J.textures && J.textures[ti] && J.textures[ti].source !== undefined) { const src = J.textures[ti].source; if (!(src in imgs)) imgs[src] = await this.image(g, src).catch(() => null); img = imgs[src]; }
      mats.push({ col: [col[0], col[1], col[2], col[3]], img, emis: m.emissiveFactor || [0, 0, 0], mask: m.alphaMode === 'MASK' || m.alphaMode === 'BLEND', cutoff: m.alphaCutoff !== undefined ? m.alphaCutoff : .5 });
    }
    const defMat = { col: [1, 1, 1, 1], img: null, emis: [0, 0, 0], mask: false, cutoff: .5 };
    // primitives
    const prims = []; let tris = 0;
    for (const n of nodes) {
      if (n.mesh === undefined || !J.meshes[n.mesh]) continue;
      for (const pr of J.meshes[n.mesh].primitives) {
        if (pr.mode !== undefined && pr.mode !== 4) continue; const A = pr.attributes; if (A.POSITION === undefined) continue;
        if (pr.extensions && pr.extensions.KHR_draco_mesh_compression) throw new Error('โมเดลบีบอัดด้วย Draco กรุณาส่งออกแบบไม่บีบอัด');
        const pos = this.accessor(g, A.POSITION); const nv = pos.length / 3;
        let nrm = A.NORMAL !== undefined ? this.accessor(g, A.NORMAL) : null;
        const uv = A.TEXCOORD_0 !== undefined ? this.accessor(g, A.TEXCOORD_0) : null;
        let col = null; if (A.COLOR_0 !== undefined) { const c = this.accessor(g, A.COLOR_0); const cs = J.accessors[A.COLOR_0].type === 'VEC4' ? 4 : 3; col = new Float32Array(nv * 3); for (let i = 0; i < nv; i++) { col[i * 3] = c[i * cs]; col[i * 3 + 1] = c[i * cs + 1]; col[i * 3 + 2] = c[i * cs + 2]; } }
        const idx = pr.indices !== undefined ? this.accessor(g, pr.indices, true) : null;
        const joints = A.JOINTS_0 !== undefined && n.skin !== undefined ? this.accessor(g, A.JOINTS_0, true) : null;
        const weights = A.WEIGHTS_0 !== undefined && n.skin !== undefined ? this.accessor(g, A.WEIGHTS_0) : null;
        if (!nrm) { // flat-ish normals from faces
          nrm = new Float32Array(nv * 3); const ni = idx ? idx.length / 3 : nv / 3;
          for (let f = 0; f < ni; f++) { const a = idx ? idx[f * 3] : f * 3, b = idx ? idx[f * 3 + 1] : f * 3 + 1, c = idx ? idx[f * 3 + 2] : f * 3 + 2; const ux = pos[b * 3] - pos[a * 3], uy = pos[b * 3 + 1] - pos[a * 3 + 1], uz = pos[b * 3 + 2] - pos[a * 3 + 2], vx = pos[c * 3] - pos[a * 3], vy = pos[c * 3 + 1] - pos[a * 3 + 1], vz = pos[c * 3 + 2] - pos[a * 3 + 2]; const x = uy * vz - uz * vy, y = uz * vx - ux * vz, z = ux * vy - uy * vx; for (const v of [a, b, c]) { nrm[v * 3] += x; nrm[v * 3 + 1] += y; nrm[v * 3 + 2] += z; } }
          for (let i = 0; i < nv; i++) { const l = Math.hypot(nrm[i * 3], nrm[i * 3 + 1], nrm[i * 3 + 2]) || 1; nrm[i * 3] /= l; nrm[i * 3 + 1] /= l; nrm[i * 3 + 2] /= l; }
        }
        tris += idx ? idx.length / 3 : nv / 3;
        prims.push({ node: n.idx, skin: n.skin !== undefined ? n.skin : -1, pos, nrm, uv, col, idx, joints, weights, mat: pr.material !== undefined ? mats[pr.material] || defMat : defMat, nv });
      }
    }
    if (!prims.length) throw new Error('ไม่พบ mesh ในไฟล์');
    // skins
    const skins = (J.skins || []).map(s => ({ joints: s.joints.slice(), ibm: s.inverseBindMatrices !== undefined ? this.accessor(g, s.inverseBindMatrices) : null, skeleton: s.skeleton }));
    // animations
    const anims = (J.animations || []).map((a, ai) => {
      const ch = []; let dur = 0;
      for (const c of a.channels) { if (!c.target || c.target.node === undefined) continue; const sm = a.samplers[c.sampler]; const times = this.accessor(g, sm.input), vals = this.accessor(g, sm.output); const interp = sm.interpolation || 'LINEAR'; const path = c.target.path; if (path === 'weights') continue; const sz = path === 'rotation' ? 4 : 3; ch.push({ node: c.target.node, path, times, vals, interp, sz }); dur = Math.max(dur, times[times.length - 1] || 0); }
      return { name: a.name || ('anim' + ai), dur: dur || 1, ch };
    });
    // bounds in rest pose (skinned verts: assume bind pose == rest pose)
    let minY = 1e9, maxY = -1e9, minX = 1e9, maxX = -1e9, minZ = 1e9, maxZ = -1e9;
    for (const p of prims) { const W = p.skin >= 0 ? null : world[p.node]; for (let i = 0; i < p.nv; i++) { let x = p.pos[i * 3], y = p.pos[i * 3 + 1], z = p.pos[i * 3 + 2]; if (W) { const v = M4.xform(W, x, y, z); x = v[0]; y = v[1]; z = v[2]; } if (y < minY) minY = y; if (y > maxY) maxY = y; if (x < minX) minX = x; if (x > maxX) maxX = x; if (z < minZ) minZ = z; if (z > maxZ) maxZ = z; } }
    const h = Math.max(1e-3, maxY - minY);
    const fit = { s: 2.15 / h * (opts.scale || 1), s0: 2.15 / h * (opts.scale || 1), minY, cx: (minX + maxX) / 2, cz: (minZ + maxZ) / 2, yaw: opts.yaw || 0, y: opts.y || 0 };
    const model = { nodes, loc, world, scene, prims, skins, anims, fit, tris, name: opts.name || '', gl: new Map(), opts };
    this.humanoid(model);
    return model;
  },
  /* map the game's bones onto the model's joints by name */
  humanoid(model) {
    const map = {};
    const norm = s => String(s).toLowerCase().replace(/^.*[|:]/, '').replace(/^(mixamorig|j_bip_|bip01_|bip_|cc_base_|def-|def_|bone_|b_)/, '').replace(/^c_/, '');
    const side = s => /(^|[^a-z])l(eft)?([^a-z]|$)|[._-]l$|^l[._-]|left/.test(s) ? 'L' : /(^|[^a-z])r(ight)?([^a-z]|$)|[._-]r$|^r[._-]|right/.test(s) ? 'R' : '';
    const cands = { hips: [], chest: [], head: [], shL: [], shR: [], elL: [], elR: [], thL: [], thR: [], knL: [], knR: [] };
    for (const n of model.nodes) {
      const s = norm(n.name); const sd = side(s);
      const base = s.replace(/left|right/g, '').replace(/(^|[^a-z])[lr](?=[^a-z]|$)/g, '$1').replace(/[^a-z]/g, '');
      if (/^(hips|pelvis|hip|root)$/.test(base)) cands.hips.push(n.idx);
      else if (/^(spine|chest|torso|upperchest)$/.test(base)) cands.chest.push(n.idx);
      else if (/^(head|headtop)$/.test(base)) cands.head.push(n.idx);
      else if (sd && /^(upperarm|arm|uparm|shoulderarm|humerus)$/.test(base)) cands['sh' + sd].push(n.idx);
      else if (sd && /^(forearm|lowerarm|lowarm|elbow|ulna)$/.test(base)) cands['el' + sd].push(n.idx);
      else if (sd && /^(upleg|upperleg|thigh|uppleg|femur)$/.test(base)) cands['th' + sd].push(n.idx);
      else if (sd && /^(leg|lowerleg|shin|calf|knee|lowleg|tibia)$/.test(base)) cands['kn' + sd].push(n.idx);
    }
    for (const k in cands) if (cands[k].length) map[k] = cands[k][0];
    // chest: prefer the first spine joint (whole upper body bends); head: the one farthest from hips in hierarchy
    model.bones = map; model.skinned = model.skins.length > 0 && Object.keys(map).length >= 4;
    // arm-down correction for T/A-pose rest
    model.fix = {};
    if (map.shL !== undefined && map.elL !== undefined) model.fix.shL = this.armFix(model, map.shL, map.elL);
    if (map.shR !== undefined && map.elR !== undefined) model.fix.shR = this.armFix(model, map.shR, map.elR);
    // reference positions (character space, after fit) for cosmetics
    const W = model.world, f = model.fit; const posOf = i => { const m = W[i]; return [(m[12] - f.cx) * f.s, (m[13] - f.minY) * f.s, (m[14] - f.cz) * f.s]; };
    model.ref = {};
    if (map.head !== undefined) { const hp = posOf(map.head); model.ref.head = { p: hp, k: Math.max(.3, (2.15 - hp[1]) / .9) }; }
    if (map.chest !== undefined) { const cp = posOf(map.chest); const top = map.head !== undefined ? posOf(map.head)[1] : cp[1] + .9; model.ref.chest = { p: cp, k: Math.max(.3, (top - cp[1]) / .44) }; }
    for (const b of ['elL', 'elR', 'shL', 'shR', 'hips', 'knL', 'knR', 'thL', 'thR']) if (map[b] !== undefined) model.ref[b] = { p: posOf(map[b]), k: model.ref.chest ? model.ref.chest.k : 1 };
  },
  armFix(model, sh, el) {
    const a = model.world[sh], b = model.world[el]; let dx = b[12] - a[12], dy = b[13] - a[13], dz = b[14] - a[14]; const l = Math.hypot(dx, dy, dz) || 1; dx /= l; dy /= l; dz /= l;
    if (dy < -.8) return null; // already hanging down
    return Q.fromTo(M4.ident(), [dx, dy, dz], [0, -1, 0]);
  },
  async load(src, opts = {}) {
    let buf;
    if (src instanceof ArrayBuffer) buf = src;
    else if (typeof Blob !== 'undefined' && src instanceof Blob) buf = await src.arrayBuffer();
    else { const r = await fetch(src); if (!r.ok) throw new Error('โหลดไม่สำเร็จ ' + r.status); buf = await r.arrayBuffer(); }
    return this.decode(buf, opts);
  }
};

/* ---------- renderer support: textured lit program ---------- */
SH.glbV = `attribute vec3 aP;attribute vec3 aN;attribute vec2 aUV;attribute vec3 aC;uniform mat4 uVP;uniform mat4 uM;varying vec3 vC;varying vec3 vN;varying vec3 vW;varying vec2 vUV;
void main(){vec4 w=uM*vec4(aP,1.);vW=w.xyz;vN=(uM*vec4(aN,0.)).xyz;vC=aC;vUV=aUV;gl_Position=uVP*w;}`;
SH.glbF = `precision highp float;varying vec3 vC;varying vec3 vN;varying vec3 vW;varying vec2 vUV;
uniform vec3 uSun,uSunC,uSky,uGnd,uFogC,uCam,uEmis;uniform vec2 uFog;uniform vec4 uTint;uniform float uFlash,uAlpha,uHasTex,uCut;uniform sampler2D uTex;
uniform vec4 uPL[6];uniform vec3 uPC[6];
void main(){vec4 t=uHasTex>.5?texture2D(uTex,vUV):vec4(1.);if(t.a<uCut)discard;vec3 n=normalize(vN);float d=max(dot(n,uSun),0.);
d=smoothstep(.0,.6,d)*.85+d*.15;vec3 l=mix(uGnd,uSky,n.y*.5+.5)*1.15+uSunC*d;
for(int i=0;i<6;i++){vec3 L=uPL[i].xyz-vW;float ds=length(L);float at=max(0.,1.-ds/max(uPL[i].w,.001));at*=at;l+=uPC[i]*at*(.35+.65*max(dot(n,L/max(ds,.001)),0.));}
vec3 c=vC*t.rgb*uTint.rgb;c=c*l+uEmis;c=mix(c,vec3(1.,1.,.95),uFlash);
float f=clamp((length(vW-uCam)-uFog.x)/(uFog.y-uFog.x),0.,1.);c=mix(c,uFogC,f);gl_FragColor=vec4(c,uAlpha*t.a);}`;
Renderer.prototype.useGlb = function () {
  const gl = this.gl, e = this.env; if (!this.P.glb) this.P.glb = this.prog(SH.glbV, SH.glbF); const L = this.P.glb; gl.useProgram(L.p);
  gl.uniformMatrix4fv(L.u.uVP, false, this.VP);
  gl.uniform3fv(L.u.uSun, e.sun); gl.uniform3fv(L.u.uSunC, e.sunC); gl.uniform3fv(L.u.uSky, e.sky); gl.uniform3fv(L.u.uGnd, e.gnd);
  gl.uniform3fv(L.u.uFogC, e.fogC); gl.uniform2fv(L.u.uFog, e.fog); gl.uniform3fv(L.u.uCam, this.cam);
  gl.uniform4fv(L.u.uPL, this.pl); gl.uniform3fv(L.u.uPC, this.pc); gl.activeTexture(gl.TEXTURE0); gl.uniform1i(L.u.uTex, 0);
  return L;
};
Renderer.prototype.textureAny = function (img) { // NPOT-safe
  const gl = this.gl, t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  const w = img.width || img.naturalWidth, h = img.height || img.naturalHeight; const pot = (w & (w - 1)) === 0 && (h & (h - 1)) === 0;
  if (pot || this.gl2) { gl.generateMipmap(gl.TEXTURE_2D); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); } else gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  const wrap = (pot || this.gl2) ? gl.REPEAT : gl.CLAMP_TO_EDGE; gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
  return t;
};
// per-renderer GPU resources of a model (textures, index buffers)
function glbRes(R, model) {
  let res = model.gl.get(R); if (res) return res;
  const gl = R.gl; res = { tex: new Map(), idx: [] };
  for (const p of model.prims) {
    if (p.mat.img && !res.tex.has(p.mat.img)) res.tex.set(p.mat.img, R.textureAny(p.mat.img));
    if (p.idx) { const b = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, b); const arr = p.idx instanceof Uint32Array && !R.gl2 && !gl.getExtension('OES_element_index_uint') ? Uint16Array.from(p.idx) : p.idx; gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, arr, gl.STATIC_DRAW); res.idx.push({ b, n: p.idx.length, type: arr instanceof Uint32Array ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT }); } else res.idx.push(null);
  }
  model.gl.set(R, res); return res;
}

/* ---------- animated instance (drop-in for Rig) ---------- */
const _gm1 = M4.ident(), _gm2 = M4.ident(), _gm3 = M4.ident();
class GlbRig {
  constructor(cls, model) {
    this.cls = cls; this.model = model; this.isGlb = true;
    const like = (OUTFITS[cls] && OUTFITS[cls].like) || (CLASSES[cls] ? cls : 'adventurer');
    this.base = new Rig(like, true); // procedural animation source
    const N = model.nodes.length; this.loc = model.nodes.map((n, i) => Float32Array.from(model.loc[i])); this.world = model.nodes.map(() => M4.ident());
    this.jm = model.skins.map(s => s.joints.map(() => M4.ident()));
    this.rootM = M4.ident(); this.fitM = M4.ident(); this.t = Math.random() * 10; this.anim = null; this.animT = 0; this.animSpd = 1; this.animLoop = true; this.animWgt = 0;
    this.buf = new Map(); // renderer -> [{b, data}]
    this.dirty = true; this.tr = model.nodes.map(n => ({ t: n.t.slice(), r: n.r.slice(), s: n.s.slice() }));
    this.locoAnim = { idle: this.find(/idle|stand|breath/i), walk: this.find(/walk/i), run: this.find(/run|sprint|jog/i) };
    this.glbClip = null;
  }
  find(re) { const a = this.model.anims.find(x => re.test(x.name)); return a || null; }
  get busy() { return this.base.busy; }
  get clip() { return this.base.clip; } set clip(v) { this.base.clip = v; if (!v) this.glbClip = null; }
  get clipName() { return this.base.clipName; }
  get ang() { return this.base.ang; }
  get rootZcarry() { return this.base.rootZcarry; } set rootZcarry(v) { this.base.rootZcarry = v; }
  get walkAmp() { return this.base.walkAmp; }
  play(name, speed = 1, onHit) {
    this.base.play(name, speed, onHit);
    // a clip of the same name inside the glb replaces the procedural pose for its duration
    const alias = { slash: /slash|attack|strike|swing/i, throw: /throw|cast|punch/i, bow: /shoot|bow|aim/i, cast: /cast|spell|magic/i, slam: /slam|smash|cast/i, dash: /dash|roll|dodge/i, hurt: /hit|hurt|damage/i, cheer: /cheer|victory|win|celebrat/i, dance: /dance/i, sit: /sit/i, bow_emote: /bow/i, laugh: /laugh/i, sad: /sad|cry/i, angry: /angry/i, flex: /flex|pose/i, victory: /victory|win/i, kneel: /kneel/i };
    const re = name === 'bow' && CLIPS.bow ? alias.bow : alias[name];
    const a = re ? this.model.anims.find(x => re.test(x.name) && !/idle|walk|run/i.test(x.name)) : null;
    this.glbClip = a ? { a, t: 0, dur: CLIPS[name] ? CLIPS[name].dur / (speed || 1) : a.dur } : null;
  }
  update(dt, st) {
    this.t += dt; this.base.update(dt, st); this.dirty = true;
    const w = st.walk || 0, run = clamp((st.speed || 0) / 7, 0, 1.2);
    // pick a glb locomotion clip when the file has one
    const L = this.locoAnim; const want = this.glbClip ? null : (w > .3 ? (run > .6 && L.run ? L.run : L.walk || L.run) : L.idle);
    if (this.glbClip) { this.glbClip.t += dt; this.anim = this.glbClip.a; this.animT = this.glbClip.t / this.glbClip.dur * this.glbClip.a.dur; this.animWgt = Math.min(1, this.animWgt + dt * 8); if (this.glbClip.t >= this.glbClip.dur) this.glbClip = null; }
    else if (want) { if (this.anim !== want) { this.anim = want; this.animT = 0; } this.animT += dt * (want === L.walk ? .6 + run : 1); this.animWgt = Math.min(1, this.animWgt + dt * 6); }
    else this.animWgt = Math.max(0, this.animWgt - dt * 6);
  }
  sampleAnim() {
    const a = this.anim; if (!a || this.animWgt <= 0) { for (let i = 0; i < this.tr.length; i++) { const n = this.model.nodes[i], o = this.tr[i]; o.t[0] = n.t[0]; o.t[1] = n.t[1]; o.t[2] = n.t[2]; o.r[0] = n.r[0]; o.r[1] = n.r[1]; o.r[2] = n.r[2]; o.r[3] = n.r[3]; o.s[0] = n.s[0]; o.s[1] = n.s[1]; o.s[2] = n.s[2]; } return; }
    const t = a.dur > 0 ? (this.animT % a.dur) : 0; const wg = this.animWgt;
    for (let i = 0; i < this.tr.length; i++) { const n = this.model.nodes[i], o = this.tr[i]; o.t[0] = n.t[0]; o.t[1] = n.t[1]; o.t[2] = n.t[2]; o.r[0] = n.r[0]; o.r[1] = n.r[1]; o.r[2] = n.r[2]; o.r[3] = n.r[3]; o.s[0] = n.s[0]; o.s[1] = n.s[1]; o.s[2] = n.s[2]; }
    const tmpq = [0, 0, 0, 1];
    for (const c of a.ch) {
      const T = c.times, n = T.length; if (!n) continue; let k = 0; while (k < n - 1 && t >= T[k + 1]) k++;
      const k1 = Math.min(n - 1, k + 1); const u = c.interp === 'STEP' ? 0 : clamp((t - T[k]) / Math.max(1e-6, T[k1] - T[k]), 0, 1);
      const sz = c.sz, st = c.interp === 'CUBICSPLINE' ? 3 : 1, off = c.interp === 'CUBICSPLINE' ? sz : 0;
      const o = this.tr[c.node]; const V = c.vals; const i0 = (k * st * sz) + off, i1 = (k1 * st * sz) + off;
      if (c.path === 'rotation') { const qa = [V[i0], V[i0 + 1], V[i0 + 2], V[i0 + 3]], qb = [V[i1], V[i1 + 1], V[i1 + 2], V[i1 + 3]]; Q.slerp(tmpq, qa, qb, u); Q.slerp(o.r, o.r, tmpq, wg); }
      else { const dst = c.path === 'translation' ? o.t : o.s; for (let j = 0; j < 3; j++) dst[j] = lerp(dst[j], lerp(V[i0 + j], V[i1 + j], u), wg); }
    }
  }
  // compute node matrices: glb animation (if any) + the game's procedural bone rotations retargeted on top
  solve() {
    const M = this.model, B = M.bones, base = this.base; this.sampleAnim();
    const rotFor = (bone) => { const a = base.ang[BONE_IDX[bone]]; return M4.compose(_gm1, 0, 0, 0, a[0], a[1], a[2], 1, 1, 1); };
    const tmp = M4.ident(), fix = M4.ident(), rrest = M4.ident(), rrestT = M4.ident();
    const walkN = (i, pm) => {
      const n = M.nodes[i], o = this.tr[i]; const L = n.mat ? n.mat : Q.m(this.loc[i], o.r, o.t, o.s);
      // retarget: find our bone mapped to this node
      let bone = null; for (const k in B) if (B[k] === i) { bone = k; break; }
      if (bone && M.skinned && bone !== 'hips') {
        Q.rot(rrest, M.world[i]); Q.transpose(rrestT, rrest);
        const R = rotFor(bone); // character-space rotation
        if (M.fix[bone]) M4.mul(R, R, M.fix[bone]);
        M4.mul(fix, rrestT, R); M4.mul(fix, fix, rrest); // local = inv(rest) * R * rest
        M4.mul(tmp, L, fix); M4.mul(this.world[i], pm, tmp);
      } else if (bone === 'hips' && M.skinned) {
        Q.rot(rrest, M.world[i]); Q.transpose(rrestT, rrest); const R = rotFor('hips'); M4.mul(fix, rrestT, R); M4.mul(fix, fix, rrest); M4.mul(tmp, L, fix); M4.mul(this.world[i], pm, tmp);
      } else M4.mul(this.world[i], pm, L);
      for (const c of n.children) walkN(c, this.world[i]);
    };
    for (const i of M.scene) walkN(i, this.fitM);
    // joint matrices
    for (let s = 0; s < M.skins.length; s++) { const sk = M.skins[s]; for (let j = 0; j < sk.joints.length; j++) { const jm = this.jm[s][j]; if (sk.ibm) { M4.mul(jm, this.world[sk.joints[j]], sk.ibm.subarray(j * 16, j * 16 + 16)); } else jm.set(this.world[sk.joints[j]]); } }
  }
  pose(x, y, z, face, s, fall = 0) {
    const b = this.base; b.pose(x, y, z, face, s, fall); // root motion (lunge, hop, spin, fall)
    const f = this.model.fit; M4.compose(_gm2, -f.cx * f.s, -f.minY * f.s + f.y, -f.cz * f.s, 0, f.yaw, 0, f.s, f.s, f.s);
    M4.mul(this.fitM, b.rootM, _gm2); this.solve(); this.dirty = true;
  }
  // skin on CPU into a per-renderer dynamic buffer; layout pos3 nrm3 uv2 col3 (11 floats)
  skin(R) {
    const M = this.model; let arr = this.buf.get(R);
    if (!arr) { arr = M.prims.map(p => ({ b: R.gl.createBuffer(), d: new Float32Array(p.nv * 11) })); this.buf.set(R, arr); }
    const gl = R.gl;
    for (let pi = 0; pi < M.prims.length; pi++) {
      const p = M.prims[pi], d = arr[pi].d; const col = p.col, uv = p.uv;
      const Wn = this.world[p.node]; const J = p.skin >= 0 ? this.jm[p.skin] : null;
      for (let i = 0; i < p.nv; i++) {
        const px = p.pos[i * 3], py = p.pos[i * 3 + 1], pz = p.pos[i * 3 + 2], nx = p.nrm[i * 3], ny = p.nrm[i * 3 + 1], nz = p.nrm[i * 3 + 2];
        let x = 0, y = 0, z = 0, a = 0, b = 0, c = 0;
        if (J && p.joints) {
          for (let k = 0; k < 4; k++) {
            const w = p.weights[i * 4 + k]; if (w <= 0) continue; const m = J[p.joints[i * 4 + k]]; if (!m) continue;
            x += w * (m[0] * px + m[4] * py + m[8] * pz + m[12]); y += w * (m[1] * px + m[5] * py + m[9] * pz + m[13]); z += w * (m[2] * px + m[6] * py + m[10] * pz + m[14]);
            a += w * (m[0] * nx + m[4] * ny + m[8] * nz); b += w * (m[1] * nx + m[5] * ny + m[9] * nz); c += w * (m[2] * nx + m[6] * ny + m[10] * nz);
          }
        } else { const m = Wn; x = m[0] * px + m[4] * py + m[8] * pz + m[12]; y = m[1] * px + m[5] * py + m[9] * pz + m[13]; z = m[2] * px + m[6] * py + m[10] * pz + m[14]; a = m[0] * nx + m[4] * ny + m[8] * nz; b = m[1] * nx + m[5] * ny + m[9] * nz; c = m[2] * nx + m[6] * ny + m[10] * nz; }
        const l = Math.hypot(a, b, c) || 1; const o = i * 11;
        d[o] = x; d[o + 1] = y; d[o + 2] = z; d[o + 3] = a / l; d[o + 4] = b / l; d[o + 5] = c / l; d[o + 6] = uv ? uv[i * 2] : 0; d[o + 7] = uv ? uv[i * 2 + 1] : 0;
        if (col) { d[o + 8] = col[i * 3]; d[o + 9] = col[i * 3 + 1]; d[o + 10] = col[i * 3 + 2]; } else { d[o + 8] = d[o + 9] = d[o + 10] = 1; }
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, arr[pi].b); gl.bufferData(gl.ARRAY_BUFFER, d, gl.DYNAMIC_DRAW);
    }
    this.dirty = false; return arr;
  }
  draw(R, parts, opts = {}) {
    const M = this.model, gl = R.gl; const res = glbRes(R, M); const arr = this.dirty || !this.buf.get(R) ? this.skin(R) : this.buf.get(R);
    const L = R.useGlb();
    gl.uniformMatrix4fv(L.u.uM, false, IDM);
    gl.uniform4f(L.u.uTint, opts.tint ? opts.tint[0] : 1, opts.tint ? opts.tint[1] : 1, opts.tint ? opts.tint[2] : 1, 1);
    gl.uniform1f(L.u.uFlash, opts.flash || 0); gl.uniform1f(L.u.uAlpha, opts.alpha || 1);
    const emis = opts.emis && opts.emis !== RIG_FILL ? opts.emis : ZERO3;
    if (opts.alpha && opts.alpha < 1) { gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); }
    gl.disable(gl.CULL_FACE);
    for (let pi = 0; pi < M.prims.length; pi++) {
      const p = M.prims[pi]; const mat = p.mat; const tex = mat.img ? res.tex.get(mat.img) : null;
      gl.uniform1f(L.u.uHasTex, tex ? 1 : 0); gl.uniform1f(L.u.uCut, mat.mask ? mat.cutoff : .02); if (tex) gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform3f(L.u.uEmis, emis[0] + mat.emis[0] * .3, emis[1] + mat.emis[1] * .3, emis[2] + mat.emis[2] * .3);
      gl.uniform4f(L.u.uTint, (opts.tint ? opts.tint[0] : 1) * mat.col[0], (opts.tint ? opts.tint[1] : 1) * mat.col[1], (opts.tint ? opts.tint[2] : 1) * mat.col[2], 1);
      gl.bindBuffer(gl.ARRAY_BUFFER, arr[pi].b);
      gl.enableVertexAttribArray(L.a.aP); gl.vertexAttribPointer(L.a.aP, 3, gl.FLOAT, false, 44, 0);
      gl.enableVertexAttribArray(L.a.aN); gl.vertexAttribPointer(L.a.aN, 3, gl.FLOAT, false, 44, 12);
      if (L.a.aUV !== undefined && L.a.aUV >= 0) { gl.enableVertexAttribArray(L.a.aUV); gl.vertexAttribPointer(L.a.aUV, 2, gl.FLOAT, false, 44, 24); }
      gl.enableVertexAttribArray(L.a.aC); gl.vertexAttribPointer(L.a.aC, 3, gl.FLOAT, false, 44, 32);
      const ix = res.idx[pi];
      if (ix) { gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ix.b); gl.drawElements(gl.TRIANGLES, ix.n, ix.type, 0); } else gl.drawArrays(gl.TRIANGLES, 0, p.nv);
    }
    if (L.a.aUV !== undefined && L.a.aUV >= 0) gl.disableVertexAttribArray(L.a.aUV);
    gl.enable(gl.CULL_FACE); if (opts.alpha && opts.alpha < 1) gl.disable(gl.BLEND);
    R.useLit(); // restore the flat-shaded program for whatever draws next
  }
  // approximate frames of the game's bones for cosmetics / fx
  boneM(name) {
    const M = this.model, B = M.bones, ref = M.ref[name === 'eyes' ? 'head' : name];
    const bn = name === 'eyes' ? 'head' : name; const out = M4.ident();
    if (ref && B[bn] !== undefined) {
      // frame = animatedWorld * inv(restWorld) * T(restPos) * S(k): a frame at the joint with identity rest rotation
      const f = M.fit; M4.compose(_gm3, -f.cx * f.s, -f.minY * f.s + f.y, -f.cz * f.s, 0, f.yaw, 0, f.s, f.s, f.s);
      const rest = M4.mul(M4.ident(), _gm3, M.world[B[bn]]); const inv = M4.invert(M4.ident(), rest) || M4.ident();
      const k = ref.k * f.s / (f.s0 || f.s); const fr = M4.compose(M4.ident(), rest[12], rest[13], rest[14], 0, 0, 0, k, k, k);
      M4.mul(out, this.world[B[bn]], inv); M4.mul(out, out, fr); return out;
    }
    return this.base.boneM(name);
  }
  bonePos(name, lx = 0, ly = 0, lz = 0) { return M4.xform(this.boneM(name), lx, ly, lz); }
}
// Rig(sheet) returns a GlbRig when a model is registered for that sheet
// (a constructor may return another object, so every `new Rig(...)` in the game picks the glb automatically)
Object.defineProperty(Rig.prototype, 'isGlb', { value: false, writable: true });
{
  const proto = Rig.prototype;
  const orig = Rig;
  // eslint-disable-next-line no-global-assign
  Rig = function Rig(cls, raw) {
    const r = new orig(cls);
    if (!raw && GLBModels[cls]) return new GlbRig(cls, GLBModels[cls]);
    return r;
  };
  Rig.prototype = proto; proto.constructor = Rig;
}

/* ---------- registry: shared models (web host) + personal imports ---------- */
const GLBSys = {
  list: [],          // entries from index.json
  loading: {}, errors: {}, local: {},
  async init() {
    try { await this.loadLocal(); } catch (e) { }
    try {
      const r = await fetch(MODEL_BASE + 'index.json', { cache: 'no-cache' }); if (!r.ok) return;
      const list = await r.json(); if (!Array.isArray(list)) return; this.list = list;
      for (const e of list) if (e && e.sheet && e.file && !GLBModels[e.sheet]) this.loadUrl(e.sheet, MODEL_BASE + e.file, e);
    } catch (e) { }
  },
  async loadUrl(sheet, url, opts) {
    if (this.loading[sheet]) return; this.loading[sheet] = true;
    try { const m = await GLB.load(url, Object.assign({ name: sheet }, opts || {})); this.register(sheet, m, 'shared'); }
    catch (e) { this.errors[sheet] = e.message || String(e); console.warn('glb', sheet, e); }
    this.loading[sheet] = false;
  },
  register(sheet, model, src) { model.src = src; GLBModels[sheet] = model; this.invalidate(sheet); },
  unregister(sheet) { delete GLBModels[sheet]; this.invalidate(sheet); },
  invalidate(sheet) {
    if (typeof Player !== 'undefined' && Player.rig && Player.rig.cls === sheet) Player.rig = null;
    if (typeof NPCList !== 'undefined') for (const n of NPCList) if (n.sheet === sheet) n.rig = null;
    if (typeof Remote !== 'undefined' && Remote.map) for (const p of Remote.map.values()) if (p.rig && p.rig.cls === sheet) p.rig = null;
    if (typeof UI !== 'undefined') { if (UI.bodies) delete UI.bodies[sheet]; if (UI.portraits) delete UI.portraits[sheet]; }
    if (typeof ThumbR !== 'undefined' && ThumbR.cache) for (const k of ['cb_', 'cp_', 'n_']) delete ThumbR.cache[k + sheet];
    if (typeof UI !== 'undefined' && UI.panelOpen === 'models' && UI.renderPanel) UI.renderPanel();
  },
  /* personal models in IndexedDB */
  db() {
    if (this._db) return this._db;
    return this._db = new Promise((res, rej) => { if (typeof indexedDB === 'undefined') return rej(new Error('no idb')); const q = indexedDB.open('siam_models', 1); q.onupgradeneeded = () => { q.result.createObjectStore('m'); }; q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); });
  },
  async put(sheet, buf, opts) { const db = await this.db(); await new Promise((res, rej) => { const tx = db.transaction('m', 'readwrite'); tx.objectStore('m').put({ buf, opts: opts || {}, t: Date.now() }, sheet); tx.oncomplete = res; tx.onerror = () => rej(tx.error); }); },
  async del(sheet) { const db = await this.db(); await new Promise((res, rej) => { const tx = db.transaction('m', 'readwrite'); tx.objectStore('m').delete(sheet); tx.oncomplete = res; tx.onerror = () => rej(tx.error); }); },
  async all() { const db = await this.db(); return new Promise((res, rej) => { const tx = db.transaction('m', 'readonly'); const st = tx.objectStore('m'); const keys = st.getAllKeys(), vals = st.getAll(); tx.oncomplete = () => res(keys.result.map((k, i) => ({ sheet: k, rec: vals.result[i] }))); tx.onerror = () => rej(tx.error); }); },
  async loadLocal() {
    const rows = await this.all();
    for (const r of rows) { try { const m = await GLB.decode(r.rec.buf, Object.assign({ name: r.sheet }, r.rec.opts || {})); this.local[r.sheet] = { opts: r.rec.opts || {}, tris: m.tris, t: r.rec.t }; this.register(r.sheet, m, 'local'); } catch (e) { this.errors[r.sheet] = e.message; } }
  },
  async importFile(sheet, file, opts) {
    const buf = await file.arrayBuffer(); if (buf.byteLength > 24 * 1024 * 1024) throw new Error('ไฟล์ใหญ่เกิน 24 MB');
    const m = await GLB.decode(buf, Object.assign({ name: sheet }, opts || {}));
    await this.put(sheet, buf, opts); this.local[sheet] = { opts: opts || {}, tris: m.tris, t: Date.now() }; this.register(sheet, m, 'local'); return m;
  },
  async removeLocal(sheet) { await this.del(sheet); delete this.local[sheet]; this.unregister(sheet); const e = this.list.find(x => x.sheet === sheet); if (e) this.loadUrl(sheet, MODEL_BASE + e.file, e); },
  async retune(sheet, opts) { const m = GLBModels[sheet]; if (!m) return; const buf = this.local[sheet] ? (await this.all()).find(r => r.sheet === sheet) : null; if (buf) { await this.put(sheet, buf.rec.buf, opts); this.local[sheet].opts = opts; } const f = m.fit; f.s = f.s / (m.opts.scale || 1) * (opts.scale || 1); f.yaw = opts.yaw || 0; f.y = opts.y || 0; m.opts = opts; this.invalidate(sheet); }
};

