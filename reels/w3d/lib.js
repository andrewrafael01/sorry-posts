// w3d/lib.js: stylised low-poly "what if" world in three.js (soft shadows, PBR, gradient sky, instanced rounded-box people).
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
export const W = 1080, H = 1920;
export { THREE };
const rnd = (seed) => { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); };
export const R = rnd;
export const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const smooth = (u) => { u = clamp(u); return u * u * (3 - 2 * u); };
export const lerp = (a, b, t) => a + (b - a) * t;

export function makeStage(o = {}) {
  if (!globalThis.__r) { const canvas = document.getElementById('c'); const rr = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true }); rr.setSize(W, H, false); rr.setPixelRatio(1); rr.shadowMap.enabled = true; rr.shadowMap.type = THREE.PCFSoftShadowMap; rr.toneMapping = THREE.ACESFilmicToneMapping; rr.outputColorSpace = THREE.SRGBColorSpace; globalThis.__r = rr; }
  const renderer = globalThis.__r; renderer.toneMappingExposure = o.exposure ?? 1.05;
  if (!globalThis.__post) {
    const target = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: 4 }); const pc = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1); const ps = new THREE.Scene();
    const pm = new THREE.ShaderMaterial({ uniforms: { t: { value: target.texture }, px: { value: new THREE.Vector2(1 / W, 1 / H) }, focus: { value: .56 }, band: { value: .2 }, amt: { value: 11.0 } },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
      fragmentShader: 'uniform sampler2D t; uniform vec2 px; uniform float focus; uniform float band; uniform float amt; varying vec2 vUv; void main(){ float d = max(abs(vUv.y - focus) - band, 0.0); float r = clamp(d * 3.2, 0.0, 1.0); r = r * r * amt; vec3 c = texture2D(t, vUv).rgb; float w = 1.0; for (int i = 0; i < 20; i++) { float a = float(i) * 2.39996; float rr = sqrt((float(i) + 0.5) / 20.0) * r; c += texture2D(t, vUv + vec2(cos(a), sin(a)) * rr * px).rgb; w += 1.0; } c /= w; float l = dot(c, vec3(0.2126, 0.7152, 0.0722)); c = mix(vec3(l), c, 0.9); c *= vec3(1.03, 1.0, 0.96); gl_FragColor = vec4(c, 1.0);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}' });
    ps.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), pm)); const orig = renderer.render.bind(renderer);
    renderer.render = (scene, camera) => { if (scene === ps) { orig(scene, camera); return; } renderer.setRenderTarget(target); orig(scene, camera); renderer.setRenderTarget(null); orig(ps, pc); };
    globalThis.__post = { target, pm };
  }
  const scene = new THREE.Scene();
  const fogc = new THREE.Color(o.fog ?? 0xcfe3f6); scene.fog = new THREE.Fog(fogc, o.fogNear ?? 90, o.fogFar ?? 380);
  const camera = new THREE.PerspectiveCamera(60, W / H, .1, 2000);
  const hemi = new THREE.HemisphereLight(o.hemiSky ?? 0xcfe6ff, o.hemiGround ?? 0x7a9a64, o.hemi ?? 1.05); scene.add(hemi);
  const sun = new THREE.DirectionalLight(o.sunColor ?? 0xfff1d8, o.sunI ?? 2.7); sun.castShadow = true;
  sun.shadow.mapSize.set(o.shadowRes ?? 2048, o.shadowRes ?? 2048); const sc = sun.shadow.camera; const ex = o.shadowExtent ?? 40; sc.left = -ex; sc.right = ex; sc.top = ex; sc.bottom = -ex; sc.near = 1; sc.far = 220;
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = .03; sun.shadow.radius = 5; sun.target.position.set(0, 0, 0); scene.add(sun); scene.add(sun.target);
  sun.userData.dir = new THREE.Vector3(...(o.sunDir ?? [-.55, 1, -.35])).normalize().multiplyScalar(80);
  // gradient sky dome
  const sky = new THREE.Mesh(new THREE.SphereGeometry(1200, 32, 16), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { top: { value: new THREE.Color(o.skyTop ?? 0x4f95e6) }, mid: { value: new THREE.Color(o.skyMid ?? 0x9cc8f3) }, bot: { value: new THREE.Color(o.skyBot ?? 0xe3eefa) }, sunDir: { value: sun.userData.dir.clone().normalize() } },
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: 'uniform vec3 top; uniform vec3 mid; uniform vec3 bot; uniform vec3 sunDir; varying vec3 vP; void main(){ float h = clamp(vP.y, -0.1, 1.0); vec3 c = mix(bot, mid, smoothstep(0.0, 0.22, h)); c = mix(c, top, smoothstep(0.18, 0.9, h)); float s = max(dot(normalize(vP), sunDir), 0.0); c += vec3(1.0,0.85,0.6) * (pow(s, 40.0) * 0.5 + pow(s, 6.0) * 0.12); gl_FragColor = vec4(c, 1.0);\n#include <colorspace_fragment>\n}'
  }));
  scene.add(sky);
  // soft clouds
  const cv = document.createElement('canvas'); cv.width = cv.height = 128; const g = cv.getContext('2d'); const gr = g.createRadialGradient(64, 64, 4, 64, 64, 62); gr.addColorStop(0, 'rgba(255,255,255,.95)'); gr.addColorStop(.5, 'rgba(255,255,255,.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  const ctex = new THREE.CanvasTexture(cv); const rs = rnd(5);
  if (o.clouds !== false) for (let i = 0; i < 46; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: ctex, transparent: true, opacity: .55 + rs() * .35, fog: false, depthWrite: false })); const a = rs() * Math.PI * 2, d = 260 + rs() * 700; sp.position.set(Math.cos(a) * d, 110 + rs() * 160, Math.sin(a) * d); sp.scale.set(160 + rs() * 260, 50 + rs() * 70, 1); scene.add(sp); }
  const st = { renderer, scene, camera, sun, hemi, sky, fogc };
  st.follow = (x, z) => { sun.target.position.set(x, 0, z); sun.position.set(x, 0, z).add(sun.userData.dir); };
  st.render = () => { renderer.toneMappingExposure = o.exposure ?? 1.05; renderer.render(scene, camera); };
  st.cam = (px, py, pz, tx, ty, tz, fov = 60, roll = 0) => { camera.position.set(px, py, pz); camera.up.set(Math.sin(roll), Math.cos(roll), 0); camera.lookAt(tx, ty, tz); if (camera.fov !== fov) { camera.fov = fov; camera.updateProjectionMatrix(); } };
  return st;
}
export function mat(color, o = {}) { return new THREE.MeshStandardMaterial(Object.assign({ color, roughness: .85, metalness: 0 }, o)); }
export function addBox(scene, x, y, z, w, h, d, color, o = {}) {
  const m = new THREE.Mesh(o.round ? new RoundedBoxGeometry(w, h, d, 3, o.round) : new THREE.BoxGeometry(w, h, d), o.material || mat(color, o.mat)); m.position.set(x, y, z); if (o.ry) m.rotation.y = o.ry; m.castShadow = o.cast !== false; m.receiveShadow = o.receive !== false; scene.add(m); return m;
}
export function ground(scene, color = 0x86a672, size = 1200, o = {}) {
  const cv = document.createElement('canvas'); cv.width = cv.height = 256; const g = cv.getContext('2d'); const base = new THREE.Color(color); g.fillStyle = '#' + base.getHexString(); g.fillRect(0, 0, 256, 256); const r = rnd(2);
  for (let i = 0; i < 2600; i++) { const s = 1 + r() * 3; g.fillStyle = `rgba(${r() < .5 ? '255,255,255' : '0,40,0'},${.035 + r() * .05})`; g.fillRect(r() * 256, r() * 256, s, s); }
  const t = new THREE.CanvasTexture(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(size / 14, size / 14); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshStandardMaterial({ map: t, roughness: 1 })); m.rotation.x = -Math.PI / 2; m.receiveShadow = true; m.position.y = o.y ?? 0; scene.add(m); return m;
}
export function road(scene, x, z, w, len, o = {}) {
  const cv = document.createElement('canvas'); cv.width = 128; cv.height = 512; const g = cv.getContext('2d'); g.fillStyle = '#3d4048'; g.fillRect(0, 0, 128, 512); const r = rnd(9);
  for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(255,255,255,${.02 + r() * .04})`; g.fillRect(r() * 128, r() * 512, 2, 2); }
  g.fillStyle = '#f2cf4a'; for (let k = 0; k < 4; k++) g.fillRect(62, k * 128 + 16, 4, 64); g.fillStyle = 'rgba(255,255,255,.7)'; g.fillRect(6, 0, 3, 512); g.fillRect(119, 0, 3, 512);
  const t = new THREE.CanvasTexture(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1, len / 16); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, len), new THREE.MeshStandardMaterial({ map: t, roughness: .9 })); m.rotation.x = -Math.PI / 2; m.rotation.z = o.rot || 0; m.position.set(x, .02, z); m.receiveShadow = true; scene.add(m); return m;
}
export function building(scene, x, z, w, h, d, color, seed = 1, o = {}) {
  const cv = document.createElement('canvas'); cv.width = 128; cv.height = 256; const g = cv.getContext('2d'); const base = new THREE.Color(color); g.fillStyle = '#' + base.getHexString(); g.fillRect(0, 0, 128, 256); const r = rnd(seed);
  const cols = 4, rows = Math.max(2, Math.round(h / 3.4)), rr = 8; for (let j = 0; j < Math.min(rows, 16); j++) for (let i = 0; i < cols; i++) { const lit = r() < (globalThis.__night ? .9 : .18); g.fillStyle = lit ? '#f6e6a8' : (r() < .5 ? '#5d86b4' : '#4a6f9c'); g.fillRect(8 + i * 30, 10 + j * (236 / Math.min(rows, 16)), 20, Math.max(8, (236 / Math.min(rows, 16)) - 12)); }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(Math.max(1, Math.round(w / 12)), 1);
  const side = new THREE.MeshStandardMaterial(globalThis.__night ? { map: t, roughness: .8, emissiveMap: t, emissive: 0xffffff, emissiveIntensity: .75 } : { map: t, roughness: .8 }); const roof = new THREE.MeshStandardMaterial({ color: new THREE.Color(color).multiplyScalar(.7), roughness: .9 });
  const cv2 = document.createElement('canvas'); cv2.width = 128; cv2.height = 256; const g2 = cv2.getContext('2d'); g2.drawImage(cv, 0, 0); const rr2 = rnd(seed + 5); for (let j = 0; j < Math.min(rows, 16); j++) for (let i = 0; i < cols; i++) { g2.fillStyle = rr2() < .5 ? '#14181f' : '#1c222c'; g2.fillRect(8 + i * 30, 10 + j * (236 / Math.min(rows, 16)), 20, Math.max(8, (236 / Math.min(rows, 16)) - 12)); }
  const t2 = new THREE.CanvasTexture(cv2); t2.colorSpace = THREE.SRGBColorSpace; t2.wrapS = t2.wrapT = THREE.RepeatWrapping; t2.repeat.copy(t.repeat); const side2 = new THREE.MeshStandardMaterial({ map: t2, roughness: .8 });
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), [side, side, roof, roof, side, side]); m.userData.whole = [side, side, roof, roof, side, side]; m.userData.broken = [side2, side2, roof, roof, side2, side2]; m.position.set(x, h / 2, z); m.castShadow = true; m.receiveShadow = true; scene.add(m); return m;
}
export function tree(scene, x, z, s = 1, seed = 1) {
  const r = rnd(seed); const g = new THREE.Group(); const trunk = new THREE.Mesh(new THREE.CylinderGeometry(.18 * s, .26 * s, 2.0 * s, 8), mat(0x7a5634)); trunk.position.y = 1.0 * s; trunk.castShadow = true; g.add(trunk);
  const gm = mat(new THREE.Color().setHSL(.31 + r() * .04, .5, .34 + r() * .06), { flatShading: true });
  for (let i = 0; i < 3; i++) { const b = new THREE.Mesh(new THREE.IcosahedronGeometry((1.2 - i * .22) * s, 1), gm); b.position.set((r() - .5) * .5 * s, (2.3 + i * .85) * s, (r() - .5) * .5 * s); b.castShadow = true; b.receiveShadow = true; g.add(b); }
  g.position.set(x, 0, z); scene.add(g); return g;
}
export function car(scene, x, z, ry, color) {
  const g = new THREE.Group(); const body = new THREE.Mesh(new RoundedBoxGeometry(1.9, .75, 4.3, 3, .22), mat(color, { roughness: .35, metalness: .25 })); body.position.y = .72; body.castShadow = true; g.add(body);
  const cab = new THREE.Mesh(new RoundedBoxGeometry(1.65, .62, 2.2, 3, .2), mat(0x9ab8d8, { roughness: .15, metalness: .4 })); cab.position.set(0, 1.28, -.15); cab.castShadow = true; g.add(cab);
  for (const sx of [-.95, .95]) for (const sz of [-1.4, 1.4]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(.38, .38, .3, 16), mat(0x202226)); w.rotation.z = Math.PI / 2; w.position.set(sx, .38, sz); w.castShadow = true; g.add(w); }
  g.position.set(x, 0, z); g.rotation.y = ry; scene.add(g); return g;
}
// ---------------------------------------------------------------------------------------------- instanced people
const SKINS = [0xf1c9a5, 0xe0ac86, 0xc68642, 0x8d5524, 0xf6d7b8, 0xad7a52];
const SHIRTS = [0xe74c3c, 0xf1c40f, 0x2ecc71, 0x3498db, 0x9b59b6, 0xe67e22, 0x1abc9c, 0xff7aa2, 0xffffff, 0x34495e, 0xd35400, 0x7fd1ae];
const PANTS = [0x2c3e6b, 0x3a3f4b, 0x6b4f3a, 0x23395d, 0x4d5b73, 0x5b6b3a];
const HAIRS = [0x2b1d14, 0x5a3a22, 0xe0b04a, 0x101010, 0x8a8a8a, 0xb5532a];
export class Crowd {
  constructor(scene, n, seed = 1) {
    this.n = n; this.p = []; const r = rnd(seed); const bx = (w, h, d) => new THREE.BoxGeometry(w, h, d);
    const defs = { legL: bx(1, 1, 1), legR: bx(1, 1, 1), torso: bx(1, 1, 1), armL: bx(1, 1, 1), armR: bx(1, 1, 1), handL: bx(1, 1, 1), handR: bx(1, 1, 1), head: bx(1, 1, 1), hair: bx(1, 1, 1) };
    this.parts = {}; for (const k in defs) { const im = new THREE.InstancedMesh(defs[k], new THREE.MeshStandardMaterial({ roughness: .9, metalness: 0 }), n); im.castShadow = true; im.receiveShadow = true; im.frustumCulled = false; scene.add(im); this.parts[k] = im; }
    // faces: a transparent decal on the front of every head (eyes, brows, mouth)
    const cv = document.createElement('canvas'); cv.width = 128; cv.height = 96; const g = cv.getContext('2d'); g.fillStyle = '#1b1210'; g.fillRect(22, 40, 20, 14); g.fillRect(86, 40, 20, 14); g.fillRect(18, 28, 28, 7); g.fillRect(82, 28, 28, 7); g.fillStyle = '#5a2f26'; g.fillRect(48, 72, 32, 7);
    const ft = new THREE.CanvasTexture(cv); ft.colorSpace = THREE.SRGBColorSpace; ft.magFilter = THREE.NearestFilter; const face = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, .75), new THREE.MeshBasicMaterial({ map: ft, transparent: true, alphaTest: .3 }), n); face.frustumCulled = false; scene.add(face); this.parts.face = face;
    for (let i = 0; i < n; i++) {
      const o = { x: 0, z: 0, y: 0, yaw: 0, scale: 1, anim: 'idle', phase: r() * 6.28, speed: 1, pitch: 0, extra: 0, shirt: new THREE.Color(SHIRTS[(r() * SHIRTS.length) | 0]), pants: new THREE.Color(r() < .25 ? 0xf2f2f4 : PANTS[(r() * PANTS.length) | 0]), skin: new THREE.Color(SKINS[(r() * SKINS.length) | 0]), hair: new THREE.Color(HAIRS[(r() * HAIRS.length) | 0]), h: .92 + r() * .16, vis: true };
      this.p.push(o); const set = (k, c) => this.parts[k].setColorAt(i, c);
      set('legL', o.pants); set('legR', o.pants); set('torso', o.shirt); set('armL', o.shirt); set('armR', o.shirt); set('handL', o.skin); set('handR', o.skin); set('head', o.skin); set('hair', o.hair);
    }
    for (const k in this.parts) if (this.parts[k].instanceColor) this.parts[k].instanceColor.needsUpdate = true;
    this._m = new THREE.Matrix4(); this._a = new THREE.Matrix4(); this._b = new THREE.Matrix4(); this._root = new THREE.Matrix4(); this._up = new THREE.Matrix4();
  }
  _put(k, i, upper, px, py, pz, rotX, ox, oy, oz, sx, sy, sz) {
    const m = this._m; m.copy(this._root); if (upper) m.multiply(this._up);
    this._a.makeTranslation(px, py, pz); m.multiply(this._a);
    if (rotX) { this._a.makeRotationX(rotX); m.multiply(this._a); }
    this._a.makeTranslation(ox, oy, oz); m.multiply(this._a); this._a.makeScale(sx, sy, sz); m.multiply(this._a); this.parts[k].setMatrixAt(i, m);
  }
  update(t) {
    for (let i = 0; i < this.n; i++) {
      const o = this.p[i], s = o.scale * o.h;
      if (!o.vis) { this._m.makeScale(0, 0, 0); for (const k in this.parts) this.parts[k].setMatrixAt(i, this._m); continue; }
      let swing = 0, armUp = 0, bob = 0, hipDrop = 0, legFwd = 0, pitch = o.pitch, armSwing = 0, headNod = 0; const w = Math.sin(o.phase + t * 8.5 * o.speed);
      switch (o.anim) {
        case 'walk': swing = .62 * w; armSwing = .55 * w; bob = Math.abs(w) * .05; break;
        case 'run': swing = 1.0 * w; armSwing = .95 * w; bob = Math.abs(w) * .12; pitch += .18; break;
        case 'panic': swing = .9 * Math.sin(o.phase + t * 13); armUp = -2.7 + .3 * Math.sin(o.phase + t * 17); bob = Math.abs(Math.sin(o.phase + t * 13)) * .1; break;
        case 'squat': hipDrop = .42 + .03 * Math.sin(o.phase + t * 14); legFwd = -1.35; pitch = .45 + .12 * Math.sin(o.phase + t * 11); armSwing = .9 * Math.sin(o.phase + t * 10); bob = Math.abs(Math.sin(o.phase + t * 14)) * .03; headNod = .15 * Math.sin(o.phase + t * 9); break;
        case 'bend': pitch = 1.0 + .3 * Math.max(0, Math.sin(o.phase + t * 5)); armSwing = .5 * Math.sin(o.phase + t * 5); headNod = .3 * Math.sin(o.phase + t * 5); bob = Math.abs(Math.sin(o.phase + t * 5)) * .04; break;
        case 'punch': break;
        case 'jump': bob = Math.abs(Math.sin(o.phase + t * 5)) * .6; armUp = -2.6; break;
        case 'sprint': swing = 1.2 * w; armSwing = 1.1 * w; bob = Math.abs(w) * .2; pitch += .3; break;
        default: bob = Math.sin(o.phase + t * 2.2) * .012; armSwing = .22 * Math.sin(o.phase + t * 1.7); swing = .08 * Math.sin(o.phase * 1.3 + t * 1.1); headNod = .12 * Math.sin(o.phase + t * 1.3); pitch += .05 * Math.sin(o.phase + t * 1.9);
      }
      this._root.makeRotationY(o.yaw + (o.anim === 'idle' ? .18 * Math.sin(o.phase + t * 0.9) : 0)); this._root.setPosition(o.x, o.y + bob * s, o.z); this._a.makeScale(s, s, s); this._root.multiply(this._a);
      const hy = .8 - hipDrop; this._up.makeTranslation(0, hy, 0); this._b.makeRotationX(pitch); this._up.multiply(this._b); this._a.makeTranslation(0, -hy, 0); this._up.multiply(this._a);
      this._put('legL', i, false, -.13, hy, 0, swing + legFwd, 0, -.4 + (legFwd ? .12 : 0), 0, .24, .8, .26);
      this._put('legR', i, false, .13, hy, 0, -swing + legFwd, 0, -.4 + (legFwd ? .12 : 0), 0, .24, .8, .26);
      this._put('torso', i, true, 0, 0, 0, 0, 0, hy + .31, 0, .58, .64, .32);
      let aL = armUp ? armUp : armSwing, aR = armUp ? armUp : -armSwing; if (o.anim === 'punch') { aR = -1.5 + .3 * Math.sin(o.phase + t * 9); aL = .3; }
      this._put('armL', i, true, -.4, hy + .6, 0, aL, 0, -.28, 0, .17, .62, .19); this._put('armR', i, true, .4, hy + .6, 0, aR, 0, -.28, 0, .17, .62, .19);
      this._put('handL', i, true, -.4, hy + .6, 0, aL, 0, -.66, 0, .15, .14, .17); this._put('handR', i, true, .4, hy + .6, 0, aR, 0, -.66, 0, .15, .14, .17);
      this._put('head', i, true, 0, 0, 0, headNod, 0, hy + .93, 0, .44, .44, .44); this._put('hair', i, true, 0, 0, 0, headNod, 0, hy + 1.1, -.03, .47, .17, .48);
      this._put('face', i, true, 0, 0, 0, headNod, 0, hy + .9, .222, .4, .4, 1);
    }
    for (const k in this.parts) this.parts[k].instanceMatrix.needsUpdate = true;
  }
}
export const tri = (x, a, b) => { const L = b - a; let u = ((x - a) % (2 * L) + 2 * L) % (2 * L); return u < L ? a + u : b - (u - L); };
// wandering position that bounces inside a rectangle; returns [x, z, yaw]
export function wander(x0, z0, ang, sp, t, bx0, bx1, bz0, bz1) {
  const vx = Math.sin(ang) * sp, vz = Math.cos(ang) * sp; const x = tri(x0 + vx * t, bx0, bx1), z = tri(z0 + vz * t, bz0, bz1);
  const fx = (((x0 + vx * t - bx0) % (2 * (bx1 - bx0)) + 2 * (bx1 - bx0)) % (2 * (bx1 - bx0))) < (bx1 - bx0) ? 1 : -1, fz = (((z0 + vz * t - bz0) % (2 * (bz1 - bz0)) + 2 * (bz1 - bz0)) % (2 * (bz1 - bz0))) < (bz1 - bz0) ? 1 : -1;
  return [x, z, Math.atan2(vx * fx, vz * fz)];
}
// ---------------------------------------------------------------------------------------------- particles
export class Particles {
  constructor(scene, n, color = 0xbfe3ff, radius = .12, o = {}) { this.n = n; this.im = new THREE.InstancedMesh(new THREE.SphereGeometry(radius, 8, 6), new THREE.MeshStandardMaterial({ color, roughness: o.rough ?? .25, metalness: o.metal ?? 0, emissive: o.emissive ?? 0x000000 }), n); this.im.castShadow = o.cast ?? false; this.im.frustumCulled = false; scene.add(this.im); this.m = new THREE.Matrix4(); this.hide = new THREE.Matrix4().makeScale(0, 0, 0); for (let i = 0; i < n; i++) this.im.setMatrixAt(i, this.hide); }
  set(i, x, y, z, s = 1) { if (s <= 0) { this.im.setMatrixAt(i, this.hide); return; } this.m.makeScale(s, s, s); this.m.setPosition(x, y, z); this.im.setMatrixAt(i, this.m); }
  done() { this.im.instanceMatrix.needsUpdate = true; }
  clear() { for (let i = 0; i < this.n; i++) this.im.setMatrixAt(i, this.hide); }
}

// ---------------------------------------------------------------------------------------------- shared worlds
export function buildStreet(scene, o = {}) {
  const r = rnd(o.seed ?? 11); const out = { buildings: [], cars: [], manholes: [], crowd: null };
  ground(scene, o.grass ?? 0x86a672, 1600); road(scene, 0, 90, 14, 400);
  for (const s of [-1, 1]) { const w = new THREE.Mesh(new THREE.BoxGeometry(4.4, .2, 400), new THREE.MeshStandardMaterial({ color: 0xc9c4b8, roughness: 1 })); w.position.set(s * 9.2, .1, 90); w.receiveShadow = true; scene.add(w); }
  for (let z = -10; z < 220; z += 32) for (const s of [-1, 1]) { const w = 12 + r() * 6; out.buildings.push(building(scene, s * (19 + w / 2), z + (r() - .5) * 6, w, 16 + r() * 44, 15, [0xd9c7a8, 0xc9d3dc, 0xbdb2a0, 0xe0c6b0, 0xa9bccc, 0xcfa9a0][(r() * 6) | 0], (z * 17 + s * 5) | 0)); }
  for (let z = -4; z < 220; z += 12) for (const s of [-1, 1]) tree(scene, s * 11.4, z + 4, .85 + r() * .3, (z * 3 + s) | 0);
  for (let z = 4; z < 200; z += 22) for (const s of [-1, 1]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(.08, .1, 5.2, 8), mat(0x3b3f46)); p.position.set(s * 7.4, 2.6, z); p.castShadow = true; scene.add(p); }
  const cc = [0xe74c3c, 0xf1c40f, 0x2ecc71, 0x3498db, 0x9b59b6, 0xecf0f1, 0xe67e22, 0x34495e];
  for (let i = 0; i < 14; i++) { const x = [-4.4, -2.0, 2.2, 4.5][(r() * 4) | 0]; out.cars.push({ m: car(scene, x, 8 + r() * 150, x > 0 ? 0 : Math.PI, cc[(r() * cc.length) | 0]), x, z0: 0 }); out.cars[i].z0 = out.cars[i].m.position.z; }
  for (let z = 9; z < 130; z += 11) for (const x of [-3.6, 0, 3.6]) { const m = new THREE.Mesh(new THREE.CylinderGeometry(.55, .55, .08, 24), mat(0x2f3138, { roughness: .5, metalness: .4 })); m.position.set(x, .06, z); m.receiveShadow = true; m.castShadow = true; scene.add(m); out.manholes.push({ m, x, z }); }
  const crowd = new Crowd(scene, 150, 5); out.crowd = crowd; out.ppl = [];
  for (let i = 0; i < 150; i++) { const o2 = crowd.p[i]; const side = r() < .5 ? -1 : 1; out.ppl.push({ x: side * (8.2 + r() * 2), z0: r() * 140, dir: r() < .5 ? 1 : -1, sp: .8 + r() * .9 }); }
  out.updateCrowd = (t, panicT = null) => { for (let i = 0; i < 150; i++) { const q = out.ppl[i], o2 = crowd.p[i]; const panic = panicT !== null && t > panicT + (q.z0 % 3) * .2; const k = panic ? 3 : 1.7; o2.anim = panic ? 'panic' : 'walk'; o2.speed = panic ? 1.5 : .95; o2.x = q.x; o2.z = ((q.z0 + q.dir * q.sp * t * k) % 150 + 150) % 150; o2.yaw = q.dir > 0 ? 0 : Math.PI; } crowd.update(t); };
  return out;
}
export function buildEarth(scene, Rr = 6) {
  const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 512; const g = cv.getContext('2d'); g.fillStyle = '#1f5fbf'; g.fillRect(0, 0, 1024, 512); const r = rnd(4);
  for (let i = 0; i < 70; i++) { g.fillStyle = `rgba(${60 + r() * 40},${130 + r() * 50},${60 + r() * 30},.9)`; g.beginPath(); const x = r() * 1024, y = 80 + r() * 350, rad = 20 + r() * 70; g.ellipse(x, y, rad, rad * (.5 + r() * .6), r() * 3, 0, 7); g.fill(); }
  g.fillStyle = 'rgba(255,255,255,.35)'; for (let i = 0; i < 80; i++) { g.beginPath(); g.ellipse(r() * 1024, r() * 512, 20 + r() * 60, 6 + r() * 12, r() * 3, 0, 7); g.fill(); }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; const e = new THREE.Mesh(new THREE.SphereGeometry(Rr, 64, 48), new THREE.MeshStandardMaterial({ map: t, roughness: .85 })); e.castShadow = true; scene.add(e);
  const atm = new THREE.Mesh(new THREE.SphereGeometry(Rr * 1.06, 48, 32), new THREE.MeshBasicMaterial({ color: 0x66aaff, transparent: true, opacity: .16, side: THREE.BackSide, fog: false })); scene.add(atm);
  const pts = []; for (let i = 0; i < 700; i++) { const a = r() * 6.283, b = Math.acos(2 * r() - 1), d = 160 + r() * 200; pts.push(Math.cos(a) * Math.sin(b) * d, Math.cos(b) * d, Math.sin(a) * Math.sin(b) * d); }
  const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3)); const stars = new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffffff, size: 1.6, sizeAttenuation: false, fog: false })); scene.add(stars);
  return { earth: e, atm, stars };
}
