/* ============================================================
   RO-style sprite rendering: every character / NPC / monster is
   rendered each frame into a low-resolution cell of an offscreen
   atlas (orthographic, toon-lit, facing snapped to 8 directions)
   and then drawn back into the world as a pixel-art billboard with
   a 1-pixel ink outline. Keeps all 3D animation, fashion, GLB and
   mounts — only the look changes.
   ============================================================ */
SH.bbV = `attribute vec2 aC;uniform mat4 uVP;uniform vec3 uPos,uRt,uUp,uFwd;uniform vec2 uSize;uniform vec4 uUV;uniform float uBias;varying vec2 vUV;varying vec3 vW;
void main(){vec3 w=uPos+uRt*(aC.x*uSize.x)+uUp*(aC.y*uSize.y)-uFwd*uBias;vW=w;vUV=vec2(mix(uUV.x,uUV.z,aC.x+.5),mix(uUV.y,uUV.w,aC.y+.5));gl_Position=uVP*vec4(w,1.);}`;
SH.bbF = `precision highp float;varying vec2 vUV;varying vec3 vW;uniform sampler2D uTex;uniform vec2 uTx;uniform vec4 uUV;uniform vec3 uFogC,uCam,uInk;uniform vec2 uFog;uniform float uInkA;
vec4 S(vec2 o){vec2 u=clamp(vUV+o*uTx,uUV.xy,uUV.zw);return texture2D(uTex,u);}
void main(){vec4 t=S(vec2(0.));vec3 c;float a;
if(t.a<.3){float n=max(max(S(vec2(1.,0.)).a,S(vec2(-1.,0.)).a),max(S(vec2(0.,1.)).a,S(vec2(0.,-1.)).a));if(n<.5||uInkA<=0.)discard;c=uInk;a=uInkA;}
else{c=t.rgb/max(t.a,.001);a=t.a;}
float f=clamp((length(vW-uCam)-uFog.x)/(uFog.y-uFog.x),0.,1.);c=mix(c,uFogC,f);gl_FragColor=vec4(c*a,a);}`;
const Sprites = {
  on: true, pix: .6, ink: .9, size: 2048, R: null, fb: null, tex: null, depth: null, quad: null, prog: null,
  active: false, capturing: false, jobs: [], shelfX: 0, shelfY: 0, shelfH: 0,
  sv: { VP: M4.ident(), cam: [0, 0, 0], fog: [0, 0], toon: .6 }, _V: M4.ident(), _P: M4.ident(),
  init(R) {
    if (this.R === R) return !!this.fb;
    this.R = R; const gl = R.gl;
    try {
      this.tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, this.tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.size, this.size, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      this.depth = gl.createRenderbuffer(); gl.bindRenderbuffer(gl.RENDERBUFFER, this.depth); gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.size, this.size);
      this.fb = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.tex, 0); gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.depth);
      const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE; gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      if (!ok) { this.fb = null; return false; }
      this.prog = R.prog(SH.bbV, SH.bbF); this.quad = R.buf(new Float32Array([-.5, -.5, .5, -.5, .5, .5, -.5, -.5, .5, .5, -.5, .5]));
      return true;
    } catch (e) { console.warn('sprites off', e); this.fb = null; return false; }
  },
  enabled(R) { return this.on && (typeof Settings === 'undefined' || Settings.d.sprites !== 0) && R === Game.R && this.init(R); },
  begin(R) {
    this.active = this.enabled(R); this.jobs.length = 0; this.shelfX = this.shelfY = this.shelfH = 0; if (!this.active) return;
    const gl = R.gl; gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb); gl.viewport(0, 0, this.size, this.size);
    gl.disable(gl.SCISSOR_TEST); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    const sv = this.sv; sv.VP.set(R.VP); sv.cam = R.cam; sv.fog = R.env.fog; sv.toon = R.toon; sv.w = R.cv.width; sv.h = R.cv.height;
  },
  alloc(w, h) {
    const P = 2; if (this.shelfX + w + P > this.size) { this.shelfX = 0; this.shelfY += this.shelfH + P; this.shelfH = 0; }
    if (this.shelfY + h + P > this.size) return null;
    const c = { x: this.shelfX + 1, y: this.shelfY + 1, w, h }; this.shelfX += w + P; this.shelfH = Math.max(this.shelfH, h); return c;
  },
  // screen height (device px) of a vertical segment at world point
  screenH(x, y0, y1, z) { const m = this.sv.VP; const pr = y => { const cy = m[1] * x + m[5] * y + m[9] * z + m[13], cw = m[3] * x + m[7] * y + m[11] * z + m[15]; return cw > .1 ? cy / cw : null; }; const a = pr(y0), b = pr(y1); return a === null || b === null ? 0 : Math.abs(b - a) * .5 * this.sv.h; },
  snapFace(face) { const R = this.R; if (!this.capturing || !R) return face; const f = R.camFwd; const va = Math.atan2(-f[0], -f[2]); const st = Math.PI / 4; return va + Math.round(angWrap(face - va) / st) * st; },
  // draw fn into a sprite cell centred on (x, cy, z) of world size w x h
  capture(R, x, cy, z, w, h, fn) {
    if (!this.active) { fn(); return; }
    { const m = this.sv.VP; const cw = m[3] * x + m[7] * cy + m[11] * z + m[15]; if (cw < .1) return; const nx = (m[0] * x + m[4] * cy + m[8] * z + m[12]) / cw, ny = (m[1] * x + m[5] * cy + m[9] * z + m[13]) / cw; const mw = (w / 2) / (cw * .45) + .05, mh = (h / 2) / (cw * .45) + .05; if (nx < -1 - mw || nx > 1 + mw || ny < -1 - mh || ny > 1 + mh) return; }
    const hp = this.screenH(x, cy - h / 2, cy + h / 2, z); if (hp < 2) return;
    const ph = clamp(Math.round(hp * this.pix), 12, 420), pw = clamp(Math.round(ph * w / h), 8, 420);
    const c = this.alloc(pw, ph); if (!c) { fn(); return; }
    const gl = R.gl; const f = R.camFwd, u = R.camUp;
    const eye = [x - f[0] * 60, cy - f[1] * 60, z - f[2] * 60]; M4.lookAt(this._V, eye, [x, cy, z], u);
    const P = this._P; P.fill(0); P[0] = 2 / w; P[5] = 2 / h; P[10] = -2 / 119; P[14] = -121 / 119; P[15] = 1; // ortho near 1 far 120
    M4.mul(R.VP, P, this._V); R.cam = eye; R.env.fog = [1e5, 1e5 + 1]; R.toon = 1;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb); gl.viewport(c.x, c.y, c.w, c.h); gl.enable(gl.SCISSOR_TEST); gl.scissor(c.x, c.y, c.w, c.h);
    this.capturing = true; R.useLit();
    try { fn(); } catch (e) { console.error(e); }
    this.capturing = false; gl.disable(gl.SCISSOR_TEST); gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    R.VP.set(this.sv.VP); R.cam = this.sv.cam; R.env.fog = this.sv.fog; R.toon = this.sv.toon; gl.viewport(0, 0, this.sv.w, this.sv.h); R.useLit();
    const S = this.size; this.jobs.push({ x, y: cy, z, w, h, uv: [c.x / S, c.y / S, (c.x + c.w) / S, (c.y + c.h) / S], d: dist2(x, z, R.cam[0], R.cam[2]) + (cy - R.cam[1]) ** 2 });
  },
  end(R) {
    if (!this.active) return; this.active = false; if (!this.jobs.length) return;
    const gl = R.gl, B = this.prog, e = R.env; gl.useProgram(B.p);
    gl.uniformMatrix4fv(B.u.uVP, false, R.VP); gl.uniform3fv(B.u.uRt, R.camRight); gl.uniform3fv(B.u.uUp, R.camUp); gl.uniform3fv(B.u.uFwd, R.camFwd);
    gl.uniform3fv(B.u.uFogC, e.fogC); gl.uniform2fv(B.u.uFog, e.fog); gl.uniform3fv(B.u.uCam, R.cam); gl.uniform3f(B.u.uInk, .08, .05, .06); gl.uniform1f(B.u.uInkA, this.ink);
    gl.uniform2f(B.u.uTx, 1 / this.size, 1 / this.size);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.tex); gl.uniform1i(B.u.uTex, 0);
    R.attr(B.a.aC, this.quad, 2, 0, 0); gl.disable(gl.CULL_FACE); gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    this.jobs.sort((a, b) => b.d - a.d);
    for (const j of this.jobs) {
      gl.uniform3f(B.u.uPos, j.x, j.y, j.z); gl.uniform2f(B.u.uSize, j.w, j.h); gl.uniform4fv(B.u.uUV, j.uv); gl.uniform1f(B.u.uBias, Math.min(1.2, j.w * .35));
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    R.off(B.a.aC); gl.disable(gl.BLEND); gl.enable(gl.CULL_FACE); R.curLitTex = null; R.useLit();
  }
};
// characters face one of 8 directions while being captured (classic sprite look)
{ const op = Rig.prototype.pose; Rig.prototype.pose = function (x, y, z, face, s, fall) { return op.call(this, x, y, z, Sprites.snapFace(face), s, fall); }; }
{ const op = GlbRig.prototype.pose; GlbRig.prototype.pose = function (x, y, z, face, s, fall) { return op.call(this, x, y, z, Sprites.snapFace(face), s, fall); }; }
// monsters: each one captured into its own cell
Monsters._drawRaw = Monsters.draw;
{
  const od = Monsters.draw;
  Monsters.draw = function (R, t) {
    if (!Sprites.active) return od.call(this, R, t);
    const all = this.list, P = Player;
    try {
      for (const m of all) {
        if (m.zone !== P.zone || (m.dead && m.deathT === undefined)) continue;
        const h = Math.max(1.4, (m.d.h || 1.5) * (m.d.boss || m.d.wboss ? 1.5 : 1.7)) + (m.d.fly ? 2.4 : 0) + (m.jump ? 3 : 0), w = Math.max(h * .95, (m.d.r || .6) * 4.5 + 1);
        const f0 = m.face; Sprites.capture(R, m.x, h / 2 - .2, m.z, w, h + .4, () => { m.face = Sprites.snapFace(f0); this.list = [m]; od.call(this, R, t); });
        m.face = f0;
      }
    } finally { this.list = all; }
  };
}
const SPR_CHAR = { w: 2.8, h: 3.3 };

