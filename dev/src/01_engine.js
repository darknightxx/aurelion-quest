/* ============================================================
   Mini WebGL engine: math, geometry builder, renderer
   ============================================================ */
const TAU = Math.PI * 2;
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;
const rand = (a, b) => a + Math.random() * (b - a);
const randi = (a, b) => Math.floor(rand(a, b + 1));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const dist2 = (ax, az, bx, bz) => { const dx = ax - bx, dz = az - bz; return dx * dx + dz * dz; };
const angWrap = a => { while (a > Math.PI) a -= TAU; while (a < -Math.PI) a += TAU; return a; };
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function hexc(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; }
function shade(c, k) { const o = [c[0] * k, c[1] * k, c[2] * k]; if (c.tex) o.tex = c.tex; return o; }
function mixc(a, b, t) { const o = [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]; const tx = a.tex || b.tex; if (tx) o.tex = tx; return o; }
const TEXIDX = {}; // texture name -> index (filled by TexGen)
// cheap value noise
function hash2(x, z) { const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453; return s - Math.floor(s); }
function vnoise(x, z) {
  const xi = Math.floor(x), zi = Math.floor(z), xf = x - xi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf), v = zf * zf * (3 - 2 * zf);
  return lerp(lerp(hash2(xi, zi), hash2(xi + 1, zi), u), lerp(hash2(xi, zi + 1), hash2(xi + 1, zi + 1), u), v);
}

const M4 = {
  ident() { const m = new Float32Array(16); m[0] = m[5] = m[10] = m[15] = 1; return m; },
  persp(o, fy, asp, n, f) { const t = 1 / Math.tan(fy / 2); o.fill(0); o[0] = t / asp; o[5] = t; o[10] = (f + n) / (n - f); o[11] = -1; o[14] = 2 * f * n / (n - f); return o; },
  lookAt(o, e, c, u) {
    let zx = e[0] - c[0], zy = e[1] - c[1], zz = e[2] - c[2]; let l = Math.hypot(zx, zy, zz); zx /= l; zy /= l; zz /= l;
    let xx = u[1] * zz - u[2] * zy, xy = u[2] * zx - u[0] * zz, xz = u[0] * zy - u[1] * zx; l = Math.hypot(xx, xy, xz); xx /= l; xy /= l; xz /= l;
    const yx = zy * xz - zz * xy, yy = zz * xx - zx * xz, yz = zx * xy - zy * xx;
    o[0] = xx; o[1] = yx; o[2] = zx; o[3] = 0; o[4] = xy; o[5] = yy; o[6] = zy; o[7] = 0; o[8] = xz; o[9] = yz; o[10] = zz; o[11] = 0;
    o[12] = -(xx * e[0] + xy * e[1] + xz * e[2]); o[13] = -(yx * e[0] + yy * e[1] + yz * e[2]); o[14] = -(zx * e[0] + zy * e[1] + zz * e[2]); o[15] = 1; return o;
  },
  mul(o, a, b) {
    const r = new Float32Array(16);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
      r[j * 4 + i] = a[i] * b[j * 4] + a[4 + i] * b[j * 4 + 1] + a[8 + i] * b[j * 4 + 2] + a[12 + i] * b[j * 4 + 3];
    }
    o.set(r); return o;
  },
  invert(o, a) {
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    const b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12, b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32;
    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06; if (!det) return null; det = 1 / det;
    o[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det; o[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det; o[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det; o[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    o[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det; o[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det; o[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det; o[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    o[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det; o[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det; o[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det; o[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    o[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det; o[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det; o[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det; o[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    return o;
  },
  // T * Ry * Rx * Rz * S
  compose(o, x, y, z, rx, ry, rz, sx, sy, sz) {
    const cx = Math.cos(rx), sxn = Math.sin(rx), cy = Math.cos(ry), syn = Math.sin(ry), cz = Math.cos(rz), szn = Math.sin(rz);
    // R = Ry*Rx*Rz
    const m00 = cy * cz + syn * sxn * szn, m01 = -cy * szn + syn * sxn * cz, m02 = syn * cx;
    const m10 = cx * szn, m11 = cx * cz, m12 = -sxn;
    const m20 = -syn * cz + cy * sxn * szn, m21 = syn * szn + cy * sxn * cz, m22 = cy * cx;
    o[0] = m00 * sx; o[1] = m10 * sx; o[2] = m20 * sx; o[3] = 0;
    o[4] = m01 * sy; o[5] = m11 * sy; o[6] = m21 * sy; o[7] = 0;
    o[8] = m02 * sz; o[9] = m12 * sz; o[10] = m22 * sz; o[11] = 0;
    o[12] = x; o[13] = y; o[14] = z; o[15] = 1; return o;
  },
  xform(m, x, y, z) { return [m[0] * x + m[4] * y + m[8] * z + m[12], m[1] * x + m[5] * y + m[9] * z + m[13], m[2] * x + m[6] * y + m[10] * z + m[14]]; }
};

/* ---------- Geometry builder (flat-shaded, vertex coloured) ---------- */
class Geo {
  constructor(seed) { this.d = []; this.m = M4.ident(); this.jit = 0.05; this.rng = mulberry32(seed || 7); this.emit = 0; this.tex = null; this.uvs = 1; this.noTex = false; }
  at(x, y, z, ry = 0, sx = 1, sy = 1, sz = 1, rx = 0, rz = 0) { M4.compose(this.m, x, y, z, rx, ry, rz, sx, sy, sz); return this; }
  reset() { this.m = M4.ident(); return this; }
  tri(a, b, c, col) {
    const m = this.m;
    const A = M4.xform(m, a[0], a[1], a[2]), B = M4.xform(m, b[0], b[1], b[2]), C = M4.xform(m, c[0], c[1], c[2]);
    const ux = B[0] - A[0], uy = B[1] - A[1], uz = B[2] - A[2], vx = C[0] - A[0], vy = C[1] - A[1], vz = C[2] - A[2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx; const l = Math.hypot(nx, ny, nz) || 1; nx /= l; ny /= l; nz /= l;
    const k = 1 + (this.rng() - 0.5) * 2 * this.jit;
    const r = col[0] * k, g = col[1] * k, bb = col[2] * k;
    const tn = this.noTex ? null : (col.tex || this.tex); const ti = tn && TEXIDX[tn] !== undefined ? TEXIDX[tn] : -1;
    // triplanar uv from the dominant normal axis (world units * uvs)
    const ax = Math.abs(nx), ay = Math.abs(ny), az = Math.abs(nz); const s = this.uvs; const d = this.d;
    const uv = ay >= ax && ay >= az ? (P => [P[0] * s, P[2] * s]) : ax >= az ? (P => [P[2] * s, P[1] * s]) : (P => [P[0] * s, P[1] * s]);
    const ua = uv(A), ub = uv(B), uc = uv(C);
    d.push(A[0], A[1], A[2], nx, ny, nz, r, g, bb, ua[0], ua[1], ti, B[0], B[1], B[2], nx, ny, nz, r, g, bb, ub[0], ub[1], ti, C[0], C[1], C[2], nx, ny, nz, r, g, bb, uc[0], uc[1], ti);
  }
  // quad with explicit uv rectangle (for cutout sprites such as grass tufts)
  quadUV(a, b, c, dd, col, tex, u0 = 0, v0 = 0, u1 = 1, v1 = 1) {
    const keep = this.tex, kn = this.noTex; this.tex = tex; this.noTex = false; const n0 = this.d.length;
    this.tri(a, b, c, col); this.tri(a, c, dd, col); const d = this.d; const U = [[u0, v0], [u1, v0], [u1, v1], [u0, v0], [u1, v1], [u0, v1]];
    for (let i = 0; i < 6; i++) { d[n0 + i * 12 + 9] = U[i][0]; d[n0 + i * 12 + 10] = U[i][1]; }
    this.tex = keep; this.noTex = kn;
  }
  // weld coincident vertices and average their normals when faces meet at less than maxDeg
  smoothNormals(maxDeg = 60) {
    const d = this.d, n = d.length / 12, map = new Map(), cosT = Math.cos(maxDeg * Math.PI / 180);
    const key = i => (Math.round(d[i * 12] * 200) + ',' + Math.round(d[i * 12 + 1] * 200) + ',' + Math.round(d[i * 12 + 2] * 200));
    for (let i = 0; i < n; i++) { const k = key(i); let l = map.get(k); if (!l) { l = []; map.set(k, l); } l.push(i); }
    const out = new Float32Array(n * 3);
    for (const l of map.values()) {
      for (const i of l) {
        let sx = 0, sy = 0, sz = 0; const nx = d[i * 12 + 3], ny = d[i * 12 + 4], nz = d[i * 12 + 5];
        for (const j of l) { const mx = d[j * 12 + 3], my = d[j * 12 + 4], mz = d[j * 12 + 5]; if (nx * mx + ny * my + nz * mz >= cosT) { sx += mx; sy += my; sz += mz; } }
        const L = Math.hypot(sx, sy, sz) || 1; out[i * 3] = sx / L; out[i * 3 + 1] = sy / L; out[i * 3 + 2] = sz / L;
      }
    }
    for (let i = 0; i < n; i++) { d[i * 12 + 3] = out[i * 3]; d[i * 12 + 4] = out[i * 3 + 1]; d[i * 12 + 5] = out[i * 3 + 2]; }
    return this;
  }
  quad(a, b, c, d, col) { this.tri(a, b, c, col); this.tri(a, c, d, col); }
  // triangle with a colour per vertex (smooth ground blending)
  triC(a, b, c, ca, cb, cc) { const n0 = this.d.length; this.tri(a, b, c, ca); const d = this.d; const k = 1 + (this.rng() - .5) * 2 * this.jit; for (let v = 0; v < 3; v++) { const col = [ca, cb, cc][v]; d[n0 + v * 12 + 6] = col[0] * k; d[n0 + v * 12 + 7] = col[1] * k; d[n0 + v * 12 + 8] = col[2] * k; } }
  box(cx, cy, cz, w, h, d, col, top) {
    const x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy - h / 2, y1 = cy + h / 2, z0 = cz - d / 2, z1 = cz + d / 2;
    const t = top || col, s = shade(col, 0.92);
    this.quad([x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0], t); // top
    this.quad([x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], shade(col, 0.6)); // bottom
    this.quad([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], col); // front +z
    this.quad([x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0], col); // back
    this.quad([x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], s); // +x
    this.quad([x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0], s); // -x
  }
  // cylinder / cone / frustum standing on y=cy
  cyl(cx, cy, cz, rb, rt, h, seg, col, capCol, noBottom) {
    const top = capCol || col;
    for (let i = 0; i < seg; i++) {
      const a0 = i / seg * TAU, a1 = (i + 1) / seg * TAU;
      const c0 = Math.cos(a0), s0 = Math.sin(a0), c1 = Math.cos(a1), s1 = Math.sin(a1);
      const b0 = [cx + c0 * rb, cy, cz + s0 * rb], b1 = [cx + c1 * rb, cy, cz + s1 * rb];
      const t0 = [cx + c0 * rt, cy + h, cz + s0 * rt], t1 = [cx + c1 * rt, cy + h, cz + s1 * rt];
      if (rt > 0.0001) { this.quad(b1, b0, t0, t1, col); this.tri([cx, cy + h, cz], t1, t0, top); }
      else this.tri(b1, b0, [cx, cy + h, cz], col);
      if (!noBottom) this.tri([cx, cy, cz], b0, b1, shade(col, 0.6));
    }
  }
  sphere(cx, cy, cz, r, col, ws = 8, hs = 6, sy = 1) {
    for (let j = 0; j < hs; j++) {
      const p0 = j / hs * Math.PI, p1 = (j + 1) / hs * Math.PI;
      for (let i = 0; i < ws; i++) {
        const a0 = i / ws * TAU, a1 = (i + 1) / ws * TAU;
        const P = (p, a) => [cx + Math.sin(p) * Math.cos(a) * r, cy + Math.cos(p) * r * sy, cz + Math.sin(p) * Math.sin(a) * r];
        const A = P(p0, a0), B = P(p0, a1), C = P(p1, a1), D = P(p1, a0);
        if (j === 0) this.tri(A, C, D, col); else if (j === hs - 1) this.tri(A, B, D, col); else this.quad(A, B, C, D, col);
      }
    }
  }
  // gable roof prism along x, base at cy
  roof(cx, cy, cz, w, h, d, col, gable) {
    const x0 = cx - w / 2, x1 = cx + w / 2, z0 = cz - d / 2, z1 = cz + d / 2, yt = cy + h;
    this.quad([x0, cy, z1], [x1, cy, z1], [x1, yt, cz], [x0, yt, cz], col);
    this.quad([x1, cy, z0], [x0, cy, z0], [x0, yt, cz], [x1, yt, cz], shade(col, 0.85));
    const g = gable || shade(col, 0.75);
    this.tri([x1, cy, z1], [x1, cy, z0], [x1, yt, cz], g);
    this.tri([x0, cy, z0], [x0, cy, z1], [x0, yt, cz], g);
  }
  // flat ring on ground (torus-ish lowpoly)
  rock(cx, cy, cz, r, col) {
    const seg = 6, h = r * 0.9;
    const pts = [];
    for (let i = 0; i < seg; i++) { const a = i / seg * TAU + this.rng(); const rr = r * (0.75 + this.rng() * 0.4); pts.push([cx + Math.cos(a) * rr, cy, cz + Math.sin(a) * rr]); }
    const mid = []; for (let i = 0; i < seg; i++) { const a = (i + 0.5) / seg * TAU; const rr = r * (0.5 + this.rng() * 0.25); mid.push([cx + Math.cos(a) * rr, cy + h * (0.55 + this.rng() * 0.2), cz + Math.sin(a) * rr]); }
    const top = [cx + (this.rng() - .5) * r * .3, cy + h, cz + (this.rng() - .5) * r * .3];
    for (let i = 0; i < seg; i++) {
      const j = (i + 1) % seg;
      this.tri(pts[j], pts[i], mid[i], col);
      this.tri(pts[j], mid[i], mid[j], shade(col, 0.95));
      this.tri(mid[j], mid[i], top, shade(col, 1.08));
    }
  }
  get floats() { return this.d.length; }
}

/* ---------- Renderer ---------- */
const SH = {
  litV: `attribute vec3 aP;attribute vec3 aN;attribute vec3 aC;attribute vec2 aUV;uniform mat4 uVP;uniform mat4 uM;uniform float uOut;varying vec3 vC;varying vec3 vN;varying vec3 vW;varying vec2 vUV;
void main(){vec4 w=uM*vec4(aP+aN*uOut,1.);vW=w.xyz;vN=(uM*vec4(aN,0.)).xyz;vC=aC;vUV=aUV;gl_Position=uVP*w;}`,
  litF: `precision highp float;varying vec3 vC;varying vec3 vN;varying vec3 vW;varying vec2 vUV;
uniform vec3 uSun,uSunC,uSky,uGnd,uFogC,uCam,uEmis,uOutC;uniform vec2 uFog;uniform vec4 uTint;uniform float uFlash,uAlpha,uTime,uWave,uHasTex,uOut,uToon;uniform sampler2D uTex;
uniform vec4 uPL[6];uniform vec3 uPC[6];
void main(){if(uOut>0.){gl_FragColor=vec4(uOutC,uAlpha);return;}
vec4 t=uHasTex>.5?texture2D(uTex,vUV):vec4(.8,.8,.8,1.);if(t.a<.4)discard;
vec3 n=normalize(vN);float d=max(dot(n,uSun),0.);d=mix(d,smoothstep(.05,.55,d)*.85+d*.15,uToon);vec3 l=mix(uGnd,uSky,n.y*.5+.5)+uSunC*d;
for(int i=0;i<6;i++){vec3 L=uPL[i].xyz-vW;float ds=length(L);float at=max(0.,1.-ds/max(uPL[i].w,.001));at*=at;l+=uPC[i]*at*(.35+.65*max(dot(n,L/max(ds,.001)),0.));}
vec3 c=vC*uTint.rgb*t.rgb*1.15;
if(uWave>0.){float w=sin(vW.x*.7+uTime*1.6)*sin(vW.z*.9-uTime*1.1);c+=vec3(.08,.12,.14)*w+vec3(.15)*smoothstep(.75,1.,w);}
c=c*l+uEmis;float lum=dot(c,vec3(.299,.587,.114));c=mix(vec3(lum),c,1.06);c=mix(c,vec3(1.,1.,.95),uFlash);
float f=clamp((length(vW-uCam)-uFog.x)/(uFog.y-uFog.x),0.,1.);c=mix(c,uFogC,f);gl_FragColor=vec4(c,uAlpha*t.a);}`,
  sprV: `attribute vec2 aC;uniform mat4 uVP;uniform vec3 uPos,uRight,uUp;uniform vec2 uSize;uniform vec4 uUV;uniform float uFlip;uniform vec4 uAnim;uniform vec2 uAnim2;varying vec2 vUV;varying vec3 vW;
void main(){
 float ph=uAnim.x,amp=uAnim.y,lean=uAnim.z,br=uAnim.w,stride=uAnim2.x,sq=uAnim2.y;
 vec2 p=aC;
 float legTop=.31;float wl=clamp((legTop-p.y)/legTop,0.,1.);wl=wl*wl*(3.-2.*wl);
 float side=clamp(p.x*9.,-1.,1.);
 float lift=max(0.,-side*sin(ph));
 p.y+=amp*.07*wl*lift;
 p.x+=amp*wl*(.05*stride*(-side)*cos(ph)+.012*side*lift);
 float up=smoothstep(legTop*.6,1.,p.y);
 p.x+=amp*.014*sin(ph)*up+lean*p.y*p.y;
 p.y*=1.+br*.018*up-amp*.012*abs(cos(ph));
 p.x*=sq;
 vec3 w=uPos+uRight*(p.x*uSize.x)+uUp*(p.y*uSize.y);vW=w;
 float u=uFlip>.5?(.5-aC.x):(aC.x+.5);vUV=vec2(mix(uUV.x,uUV.z,u),mix(uUV.w,uUV.y,aC.y));gl_Position=uVP*vec4(w,1.);}`,
  sprF: `precision highp float;varying vec2 vUV;varying vec3 vW;uniform sampler2D uTex;uniform vec4 uTint;uniform float uFlash,uLight,uAlpha;uniform vec3 uFogC,uCam;uniform vec2 uFog;
void main(){vec4 t=texture2D(uTex,vUV);if(t.a<.5)discard;vec3 c=t.rgb*uTint.rgb*uLight;c=mix(c,vec3(1.,.95,.9),uFlash);
float f=clamp((length(vW-uCam)-uFog.x)/(uFog.y-uFog.x),0.,1.);c=mix(c,uFogC,f);gl_FragColor=vec4(c,uAlpha);}`,
  decV: `attribute vec2 aC;uniform mat4 uVP;uniform vec3 uPos;uniform vec2 uRad;uniform float uRot;varying vec2 vL;
void main(){vL=aC;float c=cos(uRot),s=sin(uRot);vec2 p=vec2(aC.x*uRad.x,aC.y*uRad.y);vec2 r=vec2(p.x*c+p.y*s,-p.x*s+p.y*c);gl_Position=uVP*vec4(uPos.x+r.x,uPos.y,uPos.z+r.y,1.);}`,
  decF: `precision highp float;varying vec2 vL;uniform vec4 uCol;uniform float uType,uP,uAng,uTime;
void main(){float r=length(vL);float a=0.;
if(uType<.5){a=(1.-smoothstep(.2,1.,r));}
else if(uType<1.5){if(r>1.)discard;float edge=smoothstep(.9,.97,r)*(1.-smoothstep(.97,1.,r));a=.22+edge*.8+step(r,uP)*.28;}
else if(uType<2.5){float w=.12;a=(1.-smoothstep(0.,w,abs(r-uP)))*(1.-uP*.6);}
else if(uType<3.5){if(r>1.)discard;float ang=abs(atan(vL.x,vL.y));if(ang>uAng)discard;float edge=smoothstep(.92,.98,r)+smoothstep(uAng-.06,uAng,ang);a=.22+min(edge,1.)*.7+step(r,uP)*.28;}
else if(uType<4.5){if(r>1.)discard;float ang=atan(vL.y,vL.x)+uTime*2.;float dash=step(.5,fract(ang*3./3.14159));a=smoothstep(.78,.85,r)*(1.-smoothstep(.95,1.,r))*(.45+.55*dash);}
else{float e=max(smoothstep(.86,.97,abs(vL.x)),smoothstep(.93,.99,abs(vL.y)));a=.2+min(e,1.)*.7+step(vL.y*.5+.5,uP)*.3;}
gl_FragColor=vec4(uCol.rgb,uCol.a*a);}`,
  ptV: `attribute vec3 aP;attribute float aS;attribute vec4 aCol;uniform mat4 uVP;uniform float uScale;varying vec4 vCol;
void main(){vec4 p=uVP*vec4(aP,1.);gl_Position=p;gl_PointSize=clamp(aS*uScale/max(p.w,.1),1.,96.);vCol=aCol;}`,
  ptF: `precision mediump float;varying vec4 vCol;void main(){vec2 d=gl_PointCoord-.5;float r=length(d)*2.;if(r>1.)discard;float a=(1.-r);a*=a;gl_FragColor=vec4(vCol.rgb*vCol.a*a,0.);}`,
  skyV: `attribute vec2 aC;varying vec2 vP;uniform vec3 uF,uRt,uUp;uniform vec2 uTan;varying vec3 vDir;void main(){vP=aC;vDir=uF+uRt*aC.x*uTan.x+uUp*aC.y*uTan.y;gl_Position=vec4(aC,.9999,1.);}`,
  skyF: `precision highp float;varying vec2 vP;varying vec3 vDir;uniform vec3 uTop,uBot,uSun;uniform float uTime,uCloud;
float h2(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h2(i),h2(i+vec2(1.,0.)),f.x),mix(h2(i+vec2(0.,1.)),h2(i+vec2(1.,1.)),f.x),f.y);}
void main(){vec3 d=normalize(vDir);float y=clamp(d.y,-.1,1.);vec3 c=mix(uBot,uTop,smoothstep(-.05,.5,y));
float sd=max(dot(d,uSun),0.);c+=vec3(1.,.9,.7)*pow(sd,180.)*1.2+vec3(1.,.8,.5)*pow(sd,8.)*.18;
if(uCloud>0.&&d.y>.02){vec2 uv=d.xz/(d.y+.12)*1.6+vec2(uTime*.012,uTime*.004);float n=vn(uv)*.55+vn(uv*2.3+3.)*.3+vn(uv*5.1+9.)*.15;float cl=smoothstep(.5,.68,n)*uCloud*smoothstep(.02,.18,d.y);vec3 cc=mix(vec3(.85,.87,.92),vec3(1.,1.,1.),smoothstep(.6,.9,n));c=mix(c,cc,cl*.9);}
gl_FragColor=vec4(c,1.);}`
};

class Renderer {
  constructor(canvas) {
    this.cv = canvas;
    const opts = { antialias: true, alpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: false };
    let gl = canvas.getContext('webgl2', opts);
    this.gl2 = !!gl;
    if (!gl) gl = canvas.getContext('webgl', opts) || canvas.getContext('experimental-webgl', opts);
    if (!gl) throw new Error('webgl');
    this.gl = gl;
    this.P = {
      lit: this.prog(SH.litV, SH.litF), spr: this.prog(SH.sprV, SH.sprF), dec: this.prog(SH.decV, SH.decF),
      pt: this.prog(SH.ptV, SH.ptF), sky: this.prog(SH.skyV, SH.skyF)
    };
    { const gx = 12, gy = 20, q = []; for (let j = 0; j < gy; j++) for (let i = 0; i < gx; i++) { const x0 = -.5 + i / gx, x1 = -.5 + (i + 1) / gx, y0 = j / gy, y1 = (j + 1) / gy; q.push(x0, y0, x1, y0, x1, y1, x0, y0, x1, y1, x0, y1); } this.quadN = q.length / 2; this.quadBuf = this.buf(new Float32Array(q)); }
    this.decBuf = this.buf(new Float32Array([-1, -1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1]));
    this.skyBuf = this.buf(new Float32Array([-1, -1, 3, -1, -1, 3]));
    this.ptMax = 3000; this.ptData = new Float32Array(this.ptMax * 8); this.ptBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.ptBuf); gl.bufferData(gl.ARRAY_BUFFER, this.ptData.byteLength, gl.DYNAMIC_DRAW);
    this.VP = M4.ident(); this.V = M4.ident(); this.Pm = M4.ident(); this.iVP = M4.ident();
    this.cam = [0, 10, 10]; this.camRight = [1, 0, 0]; this.camUp = [0, 1, 0]; this.camFwd = [0, 0, -1];
    this.env = { sun: [0.4, 0.8, 0.3], sunC: [0.85, 0.8, 0.7], sky: [0.55, 0.62, 0.7], gnd: [0.32, 0.3, 0.26], fogC: [0.75, 0.85, 0.92], fog: [60, 170], top: [0.36, 0.6, 0.9], bot: [0.8, 0.9, 0.97], sprLight: 1 };
    this.pl = new Float32Array(24); this.pc = new Float32Array(18);
    this.time = 0; this.dpr = 1;
    gl.enable(gl.DEPTH_TEST); gl.enable(gl.CULL_FACE); gl.cullFace(gl.BACK);
  }
  prog(vs, fs) {
    const gl = this.gl;
    const mk = (t, s) => { const sh = gl.createShader(t); gl.shaderSource(sh, s); gl.compileShader(sh); if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh)); return sh; };
    const p = gl.createProgram(); gl.attachShader(p, mk(gl.VERTEX_SHADER, vs)); gl.attachShader(p, mk(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    const u = {}, a = {};
    const nu = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS); for (let i = 0; i < nu; i++) { const inf = gl.getActiveUniform(p, i); const nm = inf.name.replace('[0]', ''); u[nm] = gl.getUniformLocation(p, inf.name); }
    const na = gl.getProgramParameter(p, gl.ACTIVE_ATTRIBUTES); for (let i = 0; i < na; i++) { const inf = gl.getActiveAttrib(p, i); a[inf.name] = gl.getAttribLocation(p, inf.name); }
    return { p, u, a };
  }
  buf(data) { const gl = this.gl, b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW); return b; }
  mesh(geo) {
    const d = geo.d, nt = d.length / 36; let mixed = false; const t0 = d[11];
    for (let i = 0; i < nt && !mixed; i++) if (d[i * 36 + 11] !== t0) mixed = true;
    if (!mixed) return { b: this.buf(new Float32Array(d)), n: nt * 3, parts: [{ t: t0 === undefined ? -1 : t0, s: 0, n: nt * 3 }] };
    // group triangles by texture so each range binds one texture
    const groups = new Map(); for (let i = 0; i < nt; i++) { const t = d[i * 36 + 11]; let l = groups.get(t); if (!l) { l = []; groups.set(t, l); } l.push(i); }
    const out = new Float32Array(d.length); const parts = []; let o = 0;
    for (const [t, l] of groups) { parts.push({ t, s: o / 12, n: l.length * 3 }); for (const i of l) { out.set(d.slice(i * 36, i * 36 + 36), o); o += 36; } }
    return { b: this.buf(out), n: nt * 3, parts };
  }
  texRepeat(img) {
    const gl = this.gl, t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img); gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    const ext = gl.getExtension('EXT_texture_filter_anisotropic'); if (ext) gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, 4);
    return t;
  }
  texture(img) {
    const gl = this.gl, t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const ext = gl.getExtension('EXT_texture_filter_anisotropic'); if (ext) gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, 4);
    return t;
  }
  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2); this.dpr = dpr;
    const w = Math.max(1, Math.floor(this.cv.clientWidth * dpr)), h = Math.max(1, Math.floor(this.cv.clientHeight * dpr));
    if (this.cv.width !== w || this.cv.height !== h) { this.cv.width = w; this.cv.height = h; }
    this.gl.viewport(0, 0, w, h);
  }
  setCamera(eye, target, fov = 0.85) {
    this.cam = eye; const asp = this.cv.width / this.cv.height;
    M4.persp(this.Pm, fov, asp, 0.3, 400); M4.lookAt(this.V, eye, target, [0, 1, 0]); M4.mul(this.VP, this.Pm, this.V); M4.invert(this.iVP, this.VP);
    const V = this.V; this.camRight = [V[0], V[4], V[8]]; this.camUp = [V[1], V[5], V[9]]; this.camFwd = [-V[2], -V[6], -V[10]];
    this.fov = fov;
  }
  setLights(list) { // list of {x,y,z,r,c:[r,g,b]}
    this.pl.fill(0); this.pc.fill(0);
    for (let i = 0; i < Math.min(6, list.length); i++) { const L = list[i]; this.pl.set([L.x, L.y, L.z, L.r], i * 4); this.pc.set(L.c, i * 3); }
  }
  begin() {
    const gl = this.gl; this.resize();
    gl.clearColor(...this.env.fogC, 1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if (this.env.noSky) return;
    // sky
    const S = this.P.sky; gl.useProgram(S.p); gl.disable(gl.DEPTH_TEST);
    gl.uniform3fv(S.u.uTop, this.env.top); gl.uniform3fv(S.u.uBot, this.env.bot); { const ty = Math.tan((this.fov || .85) / 2), tx = ty * this.cv.width / this.cv.height; gl.uniform3fv(S.u.uF, this.camFwd); gl.uniform3fv(S.u.uRt, this.camRight); gl.uniform3fv(S.u.uUp, this.camUp); gl.uniform2f(S.u.uTan, tx, ty); } gl.uniform3fv(S.u.uSun, this.env.sun); gl.uniform1f(S.u.uTime, this.time); gl.uniform1f(S.u.uCloud, this.env.cloud === undefined ? 1 : this.env.cloud);
    this.attr(S.a.aC, this.skyBuf, 2, 0, 0); gl.drawArrays(gl.TRIANGLES, 0, 3); this.off(S.a.aC);
    gl.enable(gl.DEPTH_TEST);
  }
  attr(loc, b, size, stride, offset) { const gl = this.gl; gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, size, gl.FLOAT, false, stride, offset); }
  off(loc) { this.gl.disableVertexAttribArray(loc); }
  useLit() {
    const gl = this.gl, L = this.P.lit, e = this.env; gl.useProgram(L.p);
    gl.uniformMatrix4fv(L.u.uVP, false, this.VP);
    gl.uniform3fv(L.u.uSun, e.sun); gl.uniform3fv(L.u.uSunC, e.sunC); gl.uniform3fv(L.u.uSky, e.sky); gl.uniform3fv(L.u.uGnd, e.gnd);
    gl.uniform3fv(L.u.uFogC, e.fogC); gl.uniform2fv(L.u.uFog, e.fog); gl.uniform3fv(L.u.uCam, this.cam);
    gl.uniform4fv(L.u.uPL, this.pl); gl.uniform3fv(L.u.uPC, this.pc); gl.uniform1f(L.u.uTime, this.time);
    gl.uniform1f(L.u.uOut, 0); gl.uniform1f(L.u.uToon, this.toon === undefined ? .6 : this.toon); gl.activeTexture(gl.TEXTURE0); gl.uniform1i(L.u.uTex, 0); this.curLitTex = null;
    this.litState = L;
  }
  bindTex(i) {
    const gl = this.gl, L = this.litState; const t = i >= 0 && this.texs ? this.texs[i] : null;
    if (t !== this.curLitTex) { this.curLitTex = t; if (t) gl.bindTexture(gl.TEXTURE_2D, t); gl.uniform1f(L.u.uHasTex, t ? 1 : 0); }
  }
  drawMesh(mesh, M, tint, emis, flash = 0, alpha = 1, wave = 0) {
    const gl = this.gl, L = this.litState;
    gl.uniformMatrix4fv(L.u.uM, false, M || IDM);
    gl.uniform4f(L.u.uTint, tint ? tint[0] : 1, tint ? tint[1] : 1, tint ? tint[2] : 1, 1);
    gl.uniform3fv(L.u.uEmis, emis || ZERO3); gl.uniform1f(L.u.uFlash, flash); gl.uniform1f(L.u.uAlpha, alpha); gl.uniform1f(L.u.uWave, wave);
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.b);
    gl.enableVertexAttribArray(L.a.aP); gl.vertexAttribPointer(L.a.aP, 3, gl.FLOAT, false, 48, 0);
    gl.enableVertexAttribArray(L.a.aN); gl.vertexAttribPointer(L.a.aN, 3, gl.FLOAT, false, 48, 12);
    gl.enableVertexAttribArray(L.a.aC); gl.vertexAttribPointer(L.a.aC, 3, gl.FLOAT, false, 48, 24);
    gl.enableVertexAttribArray(L.a.aUV); gl.vertexAttribPointer(L.a.aUV, 2, gl.FLOAT, false, 48, 36);
    const parts = mesh.parts; if (!parts || parts.length === 1) { this.bindTex(parts ? parts[0].t : -1); gl.drawArrays(gl.TRIANGLES, 0, mesh.n); return; }
    for (const p of parts) { this.bindTex(p.t); gl.drawArrays(gl.TRIANGLES, p.s, p.n); }
  }
  // toon outline: inverted hull pushed along normals
  drawOutline(mesh, M, w = .022, col = OUTLINE_COL, alpha = 1) {
    const gl = this.gl, L = this.litState; if (this.noOutline) return;
    gl.uniformMatrix4fv(L.u.uM, false, M || IDM); gl.uniform1f(L.u.uOut, w); gl.uniform3fv(L.u.uOutC, col); gl.uniform1f(L.u.uAlpha, alpha); gl.cullFace(gl.FRONT);
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.b);
    gl.enableVertexAttribArray(L.a.aP); gl.vertexAttribPointer(L.a.aP, 3, gl.FLOAT, false, 48, 0);
    gl.enableVertexAttribArray(L.a.aN); gl.vertexAttribPointer(L.a.aN, 3, gl.FLOAT, false, 48, 12);
    gl.enableVertexAttribArray(L.a.aC); gl.vertexAttribPointer(L.a.aC, 3, gl.FLOAT, false, 48, 24);
    gl.enableVertexAttribArray(L.a.aUV); gl.vertexAttribPointer(L.a.aUV, 2, gl.FLOAT, false, 48, 36);
    gl.drawArrays(gl.TRIANGLES, 0, mesh.n); gl.cullFace(gl.BACK); gl.uniform1f(L.u.uOut, 0);
  }
  useSprite() {
    const gl = this.gl, S = this.P.spr, e = this.env; gl.useProgram(S.p);
    gl.uniformMatrix4fv(S.u.uVP, false, this.VP); gl.uniform3fv(S.u.uFogC, e.fogC); gl.uniform2fv(S.u.uFog, e.fog); gl.uniform3fv(S.u.uCam, this.cam);
    // billboard axes: horizontal right, up blended toward camera up
    const r = this.camRight; const rl = Math.hypot(r[0], r[2]) || 1; this.sprRight = [r[0] / rl, 0, r[2] / rl];
    const u = this.camUp; const ux = u[0] * 0.75, uy = 0.25 + u[1] * 0.75, uz = u[2] * 0.75; const ul = Math.hypot(ux, uy, uz); this.sprUp = [ux / ul, uy / ul, uz / ul];
    gl.uniform3fv(S.u.uRight, this.sprRight); gl.uniform3fv(S.u.uUp, this.sprUp);
    this.attr(S.a.aC, this.quadBuf, 2, 0, 0); gl.activeTexture(gl.TEXTURE0); gl.uniform1i(S.u.uTex, 0);
    gl.disable(gl.CULL_FACE); this.curTex = null;
  }
  drawSprite(tex, x, y, z, w, h, uv, flip, tint, flash = 0, light = 1, alpha = 1, an) {
    const gl = this.gl, S = this.P.spr;
    if (an) { gl.uniform4f(S.u.uAnim, an.ph || 0, an.amp || 0, an.lean || 0, an.br || 0); gl.uniform2f(S.u.uAnim2, an.stride || 0, an.sq || 1); }
    else { gl.uniform4f(S.u.uAnim, 0, 0, 0, 0); gl.uniform2f(S.u.uAnim2, 0, 1); }
    if (this.curTex !== tex) { gl.bindTexture(gl.TEXTURE_2D, tex); this.curTex = tex; }
    gl.uniform3f(S.u.uPos, x, y, z); gl.uniform2f(S.u.uSize, w, h); gl.uniform4fv(S.u.uUV, uv); gl.uniform1f(S.u.uFlip, flip ? 1 : 0);
    gl.uniform4f(S.u.uTint, tint ? tint[0] : 1, tint ? tint[1] : 1, tint ? tint[2] : 1, 1); gl.uniform1f(S.u.uFlash, flash); gl.uniform1f(S.u.uLight, light * this.env.sprLight); gl.uniform1f(S.u.uAlpha, alpha);
    gl.drawArrays(gl.TRIANGLES, 0, this.quadN);
  }
  endSprite() { this.off(this.P.spr.a.aC); this.gl.enable(this.gl.CULL_FACE); }
  useDecal() {
    const gl = this.gl, D = this.P.dec; gl.useProgram(D.p); gl.uniformMatrix4fv(D.u.uVP, false, this.VP); gl.uniform1f(D.u.uTime, this.time);
    this.attr(D.a.aC, this.decBuf, 2, 0, 0); gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); gl.depthMask(false); gl.disable(gl.CULL_FACE);
    gl.enable(gl.POLYGON_OFFSET_FILL); gl.polygonOffset(-2, -2);
  }
  drawDecal(x, y, z, rx, rz, rot, type, col, p = 0, ang = 0.6) {
    const gl = this.gl, D = this.P.dec;
    gl.uniform3f(D.u.uPos, x, y, z); gl.uniform2f(D.u.uRad, rx, rz); gl.uniform1f(D.u.uRot, rot); gl.uniform1f(D.u.uType, type); gl.uniform4fv(D.u.uCol, col); gl.uniform1f(D.u.uP, p); gl.uniform1f(D.u.uAng, ang);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  endDecal() { const gl = this.gl; this.off(this.P.dec.a.aC); gl.depthMask(true); gl.disable(gl.BLEND); gl.enable(gl.CULL_FACE); gl.disable(gl.POLYGON_OFFSET_FILL); }
  drawParticles(parts) {
    const gl = this.gl, P = this.P.pt; let n = 0; const d = this.ptData;
    for (let i = 0; i < parts.length && n < this.ptMax; i++) { const p = parts[i]; const o = n * 8; d[o] = p.x; d[o + 1] = p.y; d[o + 2] = p.z; d[o + 3] = p.s; d[o + 4] = p.r; d[o + 5] = p.g; d[o + 6] = p.b; d[o + 7] = p.a; n++; }
    if (!n) return;
    gl.useProgram(P.p); gl.uniformMatrix4fv(P.u.uVP, false, this.VP); gl.uniform1f(P.u.uScale, this.cv.height / (2 * Math.tan(this.fov / 2)));
    gl.bindBuffer(gl.ARRAY_BUFFER, this.ptBuf); gl.bufferSubData(gl.ARRAY_BUFFER, 0, d.subarray(0, n * 8));
    gl.enableVertexAttribArray(P.a.aP); gl.vertexAttribPointer(P.a.aP, 3, gl.FLOAT, false, 32, 0);
    gl.enableVertexAttribArray(P.a.aS); gl.vertexAttribPointer(P.a.aS, 1, gl.FLOAT, false, 32, 12);
    gl.enableVertexAttribArray(P.a.aCol); gl.vertexAttribPointer(P.a.aCol, 4, gl.FLOAT, false, 32, 16);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE); gl.depthMask(false);
    gl.drawArrays(gl.POINTS, 0, n);
    gl.depthMask(true); gl.disable(gl.BLEND);
    this.off(P.a.aP); this.off(P.a.aS); this.off(P.a.aCol);
  }
  // screen (css px) -> world ray
  ray(sx, sy) {
    const w = this.cv.clientWidth, h = this.cv.clientHeight; const nx = sx / w * 2 - 1, ny = 1 - sy / h * 2;
    const un = (z) => { const m = this.iVP; const x = m[0] * nx + m[4] * ny + m[8] * z + m[12], y = m[1] * nx + m[5] * ny + m[9] * z + m[13], zz = m[2] * nx + m[6] * ny + m[10] * z + m[14], ww = m[3] * nx + m[7] * ny + m[11] * z + m[15]; return [x / ww, y / ww, zz / ww]; };
    const a = un(-1), b = un(1); const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]; const l = Math.hypot(...d); return { o: a, d: [d[0] / l, d[1] / l, d[2] / l] };
  }
  // world -> screen css px; returns null if behind
  project(x, y, z) {
    const m = this.VP; const cx = m[0] * x + m[4] * y + m[8] * z + m[12], cy = m[1] * x + m[5] * y + m[9] * z + m[13], cw = m[3] * x + m[7] * y + m[11] * z + m[15];
    if (cw <= 0.1) return null; return { x: (cx / cw * 0.5 + 0.5) * this.cv.clientWidth, y: (1 - (cy / cw * 0.5 + 0.5)) * this.cv.clientHeight, w: cw };
  }
}
const IDM = M4.ident(); const ZERO3 = new Float32Array(3); const OUTLINE_COL = new Float32Array([.1, .07, .08]);

