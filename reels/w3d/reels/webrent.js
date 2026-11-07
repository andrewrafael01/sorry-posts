import { room } from './_rooms.js';
// What if Spider-Man paid his rent in webs? Parody: generic blocky red-and-blue masked hero, generic grumpy landlord "Mister Chen" (grey hair, cardigan, glasses, clipboard).
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, addBox, mat, Crowd, R, clamp, smooth, lerp, attach, dropBounce } = lib;
  const fmt = (v) => Math.round(v).toLocaleString('en-US');
  const A = makeStage({ fog: 0x3b4650, fogNear: 16, fogFar: 50, clouds: false, skyTop: 0x3b4650, skyMid: 0x3b4650, skyBot: 0x3b4650, shadowExtent: 12, hemi: 1.6, sunI: 1.9, sunDir: [-.35, .9, -.45], exposure: 1.1 }); const S = A.scene;
  const RW = 8; room(lib, S, { wall: 0x4f6f86, floor: 0xb88a5a, w: RW, d: 13 });
  const cvs = (w, h, f, rep) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); f(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); } return t; };
  const FONT = 'Liberation Sans, Arial';
  // ---- room dressing: window, door, picture, baseboard
  addBox(S, -1.9, 2.1, 8.32, 1.6, 1.3, .06, 0xbfd8ee, { mat: { emissive: 0x7fa6cc, emissiveIntensity: .7 } }); addBox(S, -1.9, 2.1, 8.26, 1.7, .07, .08, 0xf0f0f0); addBox(S, -1.9, 2.1, 8.26, .07, 1.4, .08, 0xf0f0f0);
  addBox(S, 2.9, 1.15, 8.3, 1.15, 2.3, .08, 0x7a4e2c); addBox(S, 2.65, 1.1, 8.24, .09, .09, .08, 0xe8c24a, { cast: false });
  addBox(S, 0, .12, 8.3, RW, .24, .1, 0xe6e6ea); addBox(S, -RW / 2 + .15, .12, 3, .1, .24, 13, 0xe6e6ea); addBox(S, RW / 2 - .15, .12, 3, .1, .24, 13, 0xe6e6ea);
  addBox(S, 0, 1.6, 8.31, 2.0, 1.2, .05, 0x2a3440, { cast: false }); // blank frame art
  const rug = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, .03, 40), mat(0xb4493f)); rug.position.set(0, .03, 3.6); rug.receiveShadow = true; S.add(rug);
  // ---- web: strands + wall veils
  class Tubes {
    constructor(n, r) { this.n = n; this.im = new THREE.InstancedMesh(new THREE.CylinderGeometry(1, 1, 1, 5), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .55, emissive: 0x8a8f99 }), n); this.im.frustumCulled = false; S.add(this.im); this.m = new THREE.Matrix4(); this.q = new THREE.Quaternion(); this.v = new THREE.Vector3(); this.s = new THREE.Vector3(); this.hide = new THREE.Matrix4().makeScale(0, 0, 0); this.r = r; this.clear(); }
    set(i, a, b, f = 1, r = this.r) { const d = this.v.copy(b).sub(a); const len = d.length() * f; if (len < .001 || f <= 0) { this.im.setMatrixAt(i, this.hide); return; } d.normalize(); this.q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d); const mid = a.clone().addScaledVector(d, len / 2); this.s.set(r, len, r); this.m.compose(mid, this.q, this.s); this.im.setMatrixAt(i, this.m); }
    clear() { for (let i = 0; i < this.n; i++) this.im.setMatrixAt(i, this.hide); }
    done() { this.im.instanceMatrix.needsUpdate = true; }
  }
  const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
  const rr = R(41); const CY = 3.43, BZ = 8.33, SX = RW / 2 - .16;
  const strands = []; const NST = 300;
  for (let i = 0; i < NST; i++) {
    const a = V3((rr() * 2 - 1) * SX, CY, 1 + rr() * 7.3); let b; const k = rr();
    if (k < .45) b = V3((rr() * 2 - 1) * SX, 2.95 + rr() * .45, BZ); else if (k < .75) b = V3(rr() < .5 ? -SX : SX, 2.95 + rr() * .45, 1 + rr() * 7.3); else b = V3((rr() * 2 - 1) * SX, CY, 1 + rr() * 7.3);
    const key = a.distanceTo(V3(.7, CY, 5.2)); strands.push({ a, b, key });
  }
  strands.sort((u, v) => u.key - v.key); const kmax = strands[NST - 1].key;
  // dense interior curtains (beat 3): vertical drips + criss-cross high in the room
  const drips = []; for (let i = 0; i < 160; i++) { const x = -SX + rr() * (SX + .6), z = 3.5 + rr() * 4.8; const top = V3(x, CY, z); drips.push({ a: top, b: V3(x + (rr() - .5) * .6, 2.95 + rr() * .3, z + (rr() - .5) * .6), k: rr() }); }
  const WEB = new Tubes(NST + 160, .011); const DYN = new Tubes(24, .022);
  const webTex = cvs(512, 512, (g, w, h) => { g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 3; const web = (cx, cy, R0, ph) => { const sp = 12; for (let i = 0; i < sp; i++) { const a = ph + i / sp * 6.283; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a) * R0, cy + Math.sin(a) * R0); g.stroke(); } for (let r = 1; r <= 6; r++) { g.beginPath(); for (let i = 0; i <= sp; i++) { const a = ph + i / sp * 6.283, rad = R0 * r / 6 * (1 - .07 * Math.sin(i * 2.1 + r)); const x = cx + Math.cos(a) * rad, y = cy + Math.sin(a) * rad; if (i === 0) g.moveTo(x, y); else { const am = ph + (i - .5) / sp * 6.283, rm = rad * .88; g.quadraticCurveTo(cx + Math.cos(am) * rm, cy + Math.sin(am) * rm, x, y); } } g.stroke(); } }; web(130, 120, 240, .3); web(400, 340, 210, 1.1); web(250, 470, 150, 0.7); });
  const veilMat = () => new THREE.MeshBasicMaterial({ map: webTex, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide, fog: false });
  const wallVeil = new THREE.Mesh(new THREE.PlaneGeometry(RW - .3, 3.4), veilMat()); wallVeil.material.map = webTex.clone(); wallVeil.material.map.repeat.set(3, 1.2); wallVeil.material.map.wrapS = wallVeil.material.map.wrapT = THREE.RepeatWrapping; wallVeil.material.map.needsUpdate = true; wallVeil.position.set(0, 1.75, BZ - .01); wallVeil.rotation.y = Math.PI; S.add(wallVeil);
  const sideVeils = [-1, 1].map((s) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(13, 3.4), veilMat()); m.material.map = webTex.clone(); m.material.map.repeat.set(5, 1.2); m.material.map.wrapS = m.material.map.wrapT = THREE.RepeatWrapping; m.material.map.needsUpdate = true; m.position.set(s * (SX + .01), 1.75, 3); m.rotation.y = -s * Math.PI / 2; S.add(m); return m; });
  const ceilVeil = new THREE.Mesh(new THREE.PlaneGeometry(RW - .3, 13), veilMat()); ceilVeil.material.map = webTex.clone(); ceilVeil.material.map.repeat.set(3, 4); ceilVeil.material.map.wrapS = ceilVeil.material.map.wrapT = THREE.RepeatWrapping; ceilVeil.material.map.needsUpdate = true; ceilVeil.rotation.x = Math.PI / 2; ceilVeil.position.set(0, 3.44, 3); S.add(ceilVeil);
  const chalkVeil = new THREE.Mesh(new THREE.PlaneGeometry(RW - .3, 3.4), new THREE.MeshBasicMaterial({ color: 0xe8ecf2, transparent: true, opacity: 0, depthWrite: false, fog: false })); chalkVeil.position.set(0, 1.75, BZ - .02); chalkVeil.rotation.y = Math.PI; S.add(chalkVeil);
  // ---- props
  const glass = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: .45, roughness: .08, metalness: 0 }); const goo = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .5, emissive: 0x9aa0aa }); const lidM = mat(0x2f6fd0);
  const mkJar = () => { const g = new THREE.Group(); const b = new THREE.Mesh(new THREE.CylinderGeometry(.09, .09, .2, 14), glass); const f = new THREE.Mesh(new THREE.CylinderGeometry(.075, .075, .16, 12), goo); f.position.y = -.01; const l = new THREE.Mesh(new THREE.CylinderGeometry(.095, .095, .045, 14), lidM); l.position.y = .12; g.add(b, f, l); g.traverse((m) => (m.castShadow = true)); g.visible = false; S.add(g); return g; };
  const jars = Array.from({ length: 12 }, mkJar);
  const crate = new THREE.Group(); { const wm = mat(0xa8793f); const b = new THREE.Mesh(new THREE.BoxGeometry(1.0, .09, .66), wm); b.position.y = -.1; const sd = [[0, .0, .31, 1.0, .26, .04], [0, .0, -.31, 1.0, .26, .04], [.48, .0, 0, .04, .26, .66], [-.48, .0, 0, .04, .26, .66]]; crate.add(b); for (const [x, y, z, w, h, d] of sd) { const s = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wm); s.position.set(x, y, z); crate.add(s); } crate.traverse((m) => (m.castShadow = true)); S.add(crate); }
  const tableG = new THREE.Group(); { const top = addBox(tableG, 0, .8, 0, 1.3, .08, 1.0, 0xc09a62); for (const [dx, dz] of [[-.55, -.4], [.55, -.4], [-.55, .4], [.55, .4]]) addBox(tableG, dx, .4, dz, .07, .8, .07, 0x6a4a2a); tableG.position.set(-.35, 0, 4.6); S.add(tableG); }
  const clip = new THREE.Group(); { const b = new THREE.Mesh(new THREE.BoxGeometry(.3, .42, .03), mat(0x8a5a2e)); const p = new THREE.Mesh(new THREE.BoxGeometry(.25, .35, .012), mat(0xf6f6f2)); p.position.z = .02; const c = new THREE.Mesh(new THREE.BoxGeometry(.12, .05, .04), new THREE.MeshStandardMaterial({ color: 0xc8ccd2, metalness: .8, roughness: .3 })); c.position.y = .2; clip.add(b, p, c); S.add(clip); }
  const ladder = new THREE.Group(); { const wm = mat(0xd9a548); for (const sx of [-.32, .32]) { const rl = new THREE.Mesh(new THREE.BoxGeometry(.07, 3.0, .07), wm); rl.position.set(sx, 1.5, 0); ladder.add(rl); } for (let i = 0; i < 9; i++) { const r = new THREE.Mesh(new THREE.BoxGeometry(.64, .05, .05), wm); r.position.set(0, .3 + i * .32, 0); ladder.add(r); } ladder.traverse((m) => (m.castShadow = true)); S.add(ladder); }
  const signPost = new THREE.Group(); { const brd = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.6, .08), new THREE.MeshStandardMaterial({ map: cvs(600, 400, (g, w, h) => { g.fillStyle = '#f6f2e6'; g.fillRect(0, 0, w, h); g.fillStyle = '#c8272d'; g.fillRect(0, 0, w, 96); g.fillStyle = '#fff'; g.font = `900 70px ${FONT}`; g.textAlign = 'center'; g.fillText('FOR RENT', w / 2, 72); g.fillStyle = '#111'; g.font = `900 78px ${FONT}`; g.fillText('4,000', w / 2, 200); g.fillText('DOLLARS', w / 2, 278); g.fillStyle = '#1f4fb0'; g.fillRect(24, 304, w - 48, 74); g.fillStyle = '#fff'; g.font = `900 52px ${FONT}`; g.fillText('PAYABLE IN WEB', w / 2, 360); }), roughness: .6 })); brd.position.y = 1.6; const pole = new THREE.Mesh(new THREE.BoxGeometry(.09, 1.0, .06), mat(0x6a4a2a)); pole.position.y = .5; signPost.add(brd, pole); signPost.traverse((m) => (m.castShadow = true)); S.add(signPost); }
  const bedG = new THREE.Group(); const duvet = (() => { addBox(bedG, 0, .3, 0, 2.2, .5, 3.0, 0x5a3f2a, { round: .05 }); addBox(bedG, 0, .95, 1.46, 2.3, 1.3, .14, 0x5a3f2a); addBox(bedG, -.5, .8, 1.0, .8, .22, .45, 0xf0f0f4, { round: .08 }); addBox(bedG, .5, .8, 1.0, .8, .22, .45, 0xf0f0f4, { round: .08 }); const d = new THREE.Mesh(new RoundedBoxGeometryShim(), mat(0xffffff, { roughness: .95, emissive: 0x555a64 })); return d; })();
  function RoundedBoxGeometryShim() { return new lib.RoundedBoxGeometry(2.3, .3, 2.0, 5, .13); }
  duvet.position.set(0, .68, -.45); duvet.castShadow = true; bedG.add(duvet); bedG.position.set(-.4, 0, 5.4); S.add(bedG);
  const tagG = new THREE.Group(); { const t = new THREE.Mesh(new THREE.BoxGeometry(.9, .55, .03), new THREE.MeshStandardMaterial({ map: cvs(360, 220, (g, w, h) => { g.fillStyle = '#ffe24a'; g.fillRect(0, 0, w, h); g.strokeStyle = '#111'; g.lineWidth = 8; g.strokeRect(5, 5, w - 10, h - 10); g.fillStyle = '#111'; g.textAlign = 'center'; g.font = `900 40px ${FONT}`; g.fillText('LUXURY DUVET', w / 2, 62); g.fillStyle = '#c8272d'; g.font = `900 78px ${FONT}`; g.fillText('800', w / 2, 150); g.font = `900 44px ${FONT}`; g.fillText('DOLLARS', w / 2, 200); }) })); t.position.y = -.28; const s = new THREE.Mesh(new THREE.BoxGeometry(.015, .3, .015), mat(0x111111)); s.position.y = .1; tagG.add(t, s); S.add(tagG); }
  const inv = new THREE.Mesh(new THREE.BoxGeometry(.8, 1.05, .02), new THREE.MeshStandardMaterial({ map: cvs(320, 420, (g, w, h) => { g.fillStyle = '#fbfaf4'; g.fillRect(0, 0, w, h); g.fillStyle = '#111'; g.textAlign = 'center'; g.font = `900 54px ${FONT}`; g.fillText('INVOICE', w / 2, 62); g.fillRect(24, 80, w - 48, 4); g.font = `800 38px ${FONT}`; g.fillText('NOVEMBER:', w / 2, 170); g.fillStyle = '#c8272d'; g.font = `900 62px ${FONT}`; g.fillText('UNPAID', w / 2, 250); g.save(); g.translate(w / 2, 340); g.rotate(-.18); g.strokeStyle = '#c8272d'; g.lineWidth = 8; g.strokeRect(-110, -34, 220, 68); g.font = `900 40px ${FONT}`; g.fillText('$4,000', 0, 14); g.restore(); }) })); S.add(inv);
  const notice = new THREE.Mesh(new THREE.BoxGeometry(.42, .55, .012), new THREE.MeshStandardMaterial({ map: cvs(210, 270, (g, w, h) => { g.fillStyle = '#f6f4ea'; g.fillRect(0, 0, w, h); g.fillStyle = '#c8272d'; g.textAlign = 'center'; g.font = `900 40px ${FONT}`; g.fillText('EVICTION', w / 2, 90); g.fillText('NOTICE', w / 2, 140); g.fillStyle = '#111'; for (let i = 0; i < 4; i++) g.fillRect(30, 170 + i * 20, w - 60, 6); }) })); S.add(notice);
  const axe = new THREE.Group(); { const h = new THREE.Mesh(new THREE.BoxGeometry(.05, .75, .05), mat(0x8a5a2e)); const bl = new THREE.Mesh(new THREE.BoxGeometry(.04, .2, .22), new THREE.MeshStandardMaterial({ color: 0xc8341f })); bl.position.set(0, .3, .1); axe.add(h, bl); S.add(axe); }
  const bundle = new THREE.Group(); { const wm = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .8, emissive: 0x777c86 }); const r2 = R(9); for (let i = 0; i < 9; i++) { const s = new THREE.Mesh(new THREE.IcosahedronGeometry(.13 + r2() * .1, 1), wm); s.position.set((r2() - .5) * .3, (r2() - .5) * .3, (r2() - .5) * .3); bundle.add(s); } bundle.traverse((m) => (m.castShadow = true)); S.add(bundle); }
  // ---- people
  const crowd = new Crowd(S, 5, 77); const P = crowd.p; const [H, L, F, Q1, Q2] = P; const col = (i, ks, c) => ks.forEach((k) => crowd.parts[k].setColorAt(i, new THREE.Color(c)));
  col(0, ['torso', 'armL', 'armR', 'legL', 'legR', 'head', 'neck', 'hair'], 0xc8202a); col(0, ['handL', 'handR'], 0x1f4fb0);
  col(1, ['torso', 'armL', 'armR'], 0x7a4e32); col(1, ['legL', 'legR'], 0x3a3a3f); col(1, ['head', 'neck', 'handL', 'handR'], 0xe6bd98); col(1, ['hair'], 0xb9bcc2);
  col(2, ['torso', 'armL', 'armR'], 0xe0b020); col(2, ['legL', 'legR'], 0x2a2f3a); col(2, ['head', 'neck', 'handL', 'handR'], 0xc68642); col(2, ['hair'], 0x2b1d14);
  col(3, ['torso', 'armL', 'armR'], 0x3a8f6a); col(4, ['torso', 'armL', 'armR'], 0xc86a3a);
  for (const k in crowd.parts) if (crowd.parts[k].instanceColor) crowd.parts[k].instanceColor.needsUpdate = true;
  // hero mask bits
  const white = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .3, emissive: 0x909090 }); const blue = mat(0x1f4fb0, { roughness: .6 }); const black = mat(0x14161c);
  const eyeL = new THREE.Mesh(new THREE.BoxGeometry(.15, .085, .02), white), eyeR = eyeL.clone(); const panL = new THREE.Mesh(new THREE.BoxGeometry(.13, .62, .015), blue), panR = panL.clone(); const belt = new THREE.Mesh(new THREE.BoxGeometry(.6, .1, .34), blue); const legPanL = new THREE.Mesh(new THREE.BoxGeometry(.03, .7, .27), blue), legPanR = legPanL.clone(); const spider = new THREE.Group(); { const b = new THREE.Mesh(new THREE.BoxGeometry(.07, .12, .012), black); const x1 = new THREE.Mesh(new THREE.BoxGeometry(.2, .025, .012), black); x1.rotation.z = .5; const x2 = x1.clone(); x2.rotation.z = -.5; spider.add(b, x1, x2); }
  const bootL = new THREE.Mesh(new THREE.BoxGeometry(.25, .2, .3), blue), bootR = bootL.clone(); S.add(eyeL, eyeR, panL, panR, belt, legPanL, legPanR, spider, bootL, bootR);
  // landlord bits
  const glasses = new THREE.Mesh(new THREE.PlaneGeometry(.4, .15), new THREE.MeshBasicMaterial({ map: cvs(256, 96, (g, w, h) => { g.strokeStyle = '#1a1a1e'; g.lineWidth = 8; g.strokeRect(40, 20, 76, 58); g.strokeRect(140, 20, 76, 58); g.beginPath(); g.moveTo(116, 38); g.lineTo(140, 38); g.moveTo(40, 38); g.lineTo(2, 30); g.moveTo(216, 38); g.lineTo(254, 30); g.stroke(); g.fillStyle = 'rgba(180,220,255,.2)'; g.fillRect(40, 20, 76, 58); g.fillRect(140, 20, 76, 58); }), transparent: true, alphaTest: .1 })); S.add(glasses);
  const shirtP = new THREE.Mesh(new THREE.BoxGeometry(.2, .62, .012), mat(0xf1e6cf)); S.add(shirtP); const btn = [0, 1, 2].map((i) => { const m = new THREE.Mesh(new THREE.BoxGeometry(.04, .04, .02), mat(0x2a1a10)); S.add(m); return m; });
  const brows = new THREE.Mesh(new THREE.BoxGeometry(.3, .035, .02), mat(0xd0d3d8)); S.add(brows);
  // fire bits
  const helmet = new THREE.Mesh(new lib.RoundedBoxGeometry(.54, .24, .56, 3, .1), mat(0xc0211f, { roughness: .4 })); const brim = new THREE.Mesh(new THREE.BoxGeometry(.56, .04, .22), mat(0xc0211f)); const stripe = new THREE.Mesh(new THREE.BoxGeometry(.6, .1, .34), new THREE.MeshStandardMaterial({ color: 0xdfe6ee, emissive: 0x555555 })); S.add(helmet, brim, stripe);
  // bubbles
  const mkB = (txt, w = 640, scale = 2.0) => { const c = document.createElement('canvas'); c.width = w; c.height = 170; const g = c.getContext('2d'); g.fillStyle = '#fff'; g.strokeStyle = '#111'; g.lineWidth = 8; g.beginPath(); g.roundRect(8, 8, w - 16, 112, 28); g.fill(); g.stroke(); g.beginPath(); g.moveTo(w / 2 - 24, 118); g.lineTo(w / 2, 164); g.lineTo(w / 2 + 24, 118); g.fillStyle = '#fff'; g.fill(); g.beginPath(); g.moveTo(w / 2 - 24, 119); g.lineTo(w / 2, 164); g.lineTo(w / 2 + 24, 119); g.stroke(); g.fillStyle = '#fff'; g.fillRect(w / 2 - 22, 114, 44, 10); g.fillStyle = '#111'; let fs = 58; g.font = `800 ${fs}px ${FONT}`; while (g.measureText(txt).width > w - 60) { fs -= 2; g.font = `800 ${fs}px ${FONT}`; } g.textAlign = 'center'; g.fillText(txt, w / 2, 82); const tex = new THREE.CanvasTexture(c); const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: false })); sp.scale.set(scale, scale * 170 / w, 1); sp.renderOrder = 10; sp.visible = false; S.add(sp); return sp; };
  const bubMort = mkB("I can't pay a mortgage with this.", 760, 2.5), bubSpider = mkB('spider problem.', 560, 1.9), bubQ1 = mkB('...', 200, .7), bubQ2 = mkB('...', 200, .7);
  const hp = (o, k) => new THREE.Vector3().setFromMatrixPosition(o.M[k]);
  const place = (o, x, z, yaw, anim, y = 0, sp = .5) => { o.x = x; o.z = z; o.yaw = yaw; o.anim = anim; o.y = y; o.speed = sp; o.extra = 0; o.vis = true; o.scale = 1.25; o.arms = null; o.pitch = 0; };
  const faceZero = new THREE.Matrix4().makeScale(0, 0, 0);
  const CAM = { fov: 58 };
  const LAB = ['', 'Jars paid', 'Webbed rooms', 'Webbed rooms', 'Rent owed', 'Rent owed', 'Rent owed'];
  const NOTE = ['', 'rent due: 1 month', 'one ceiling', 'whole building', 'dollars, payable in web', 'plus one eviction', 'november unpaid'];
  const POP = ['', "YOU'RE WELCOME", 'IT HOLDS', 'SPIDER PROBLEM', 'PAYABLE IN WEB', 'HE KEEPS THE WEB', 'STILL OWES NOVEMBER'];
  const POPT = [0, 8.35, 3.66, 6.3, 5.0, 6.5, 6.2];
  const SLOT = (i) => V3(-.35 + (i % 3 - 1) * .3, .84 + .1 + (i / 6 | 0) * .2, 4.6 + ((i / 3 | 0) % 2 - .5) * .36);
  const hang = (a, b, r) => { let k = 0; return (a2, b2, rr2 = r) => { DYN.set(k++, a2, b2, 1, rr2); }; };
  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 6);
    for (const o of P) { o.vis = false; o.arms = null; o.pitch = 0; o.extra = 0; o.lie = 0; } [bubMort, bubSpider, bubQ1, bubQ2].forEach((b) => (b.visible = false));
    DYN.clear(); let dk = 0; const line = (a, b, f = 1, r) => DYN.set(dk++, a, b, f, r);
    const ceilAt = (x, z) => V3(x, CY, z);
    // growth schedules
    let gr = 0, gr2 = 0, veil = 0, ceil = 0;
    if (bi === 1) gr = lt > 8.0 ? .04 * clamp((lt - 8) / .8) : 0;
    else if (bi === 2) { gr = .04 + .5 * smooth((lt - 1.8) / 2.0); ceil = .55 * smooth((lt - 2.2) / 2); }
    else if (bi === 3) { gr = .54 + .46 * smooth((lt - .3) / 1.6); gr2 = smooth((lt - 1.2) / 2.0); veil = smooth((lt - 1.5) / 2.2); ceil = .6; }
    else if (bi >= 4) { gr = 1; gr2 = 1; veil = bi === 4 ? .85 : .85; ceil = .6; }
    for (let i = 0; i < NST; i++) { const s = strands[i]; WEB.set(i, s.a, s.b, clamp(gr * 1.5 - (s.key / kmax) * .5)); }
    for (let i = 0; i < 160; i++) { const d = drips[i]; WEB.set(NST + i, d.a, d.b, clamp(gr2 * 1.4 - d.k * .4)); } WEB.done();
    wallVeil.material.opacity = veil * .72; sideVeils.forEach((m) => (m.material.opacity = veil * .62)); ceilVeil.material.opacity = ceil; chalkVeil.material.opacity = veil * .2;
    // -------- per-beat staging
    tableG.visible = bi <= 1; crate.visible = bi <= 1; ladder.visible = bi === 2; signPost.visible = bi === 4; bedG.visible = bi === 6; tagG.visible = bi === 6; inv.visible = bi === 6; notice.visible = bi === 5; axe.visible = bi === 3; bundle.visible = bi === 5 && lt > 5.6; clip.visible = bi <= 2 || bi === 4 || bi === 5;
    jars.forEach((j) => (j.visible = false));
    let cam = [0, 1.8, -2.2, 0, 2.15, 5.2, 56]; let face = 'calm'; const inv0 = false;
    let crateOn = false, hot = false; let val = '';
    if (bi === 0) {
      const u = clamp(lt / 1.5); place(H, lerp(-3.4, -1.55, u), 4.7, u < .85 ? -Math.PI / 2 : lerp(-Math.PI / 2, Math.PI, smooth((u - .85) / .15)), u < 1 ? 'walk' : 'idle', 0, .55); H.arms = { lx: -1.25, lz: -.12, rx: -1.25, rz: .12 }; crateOn = true;
      place(L, .95, 4.7, Math.PI, 'idle', 0, .4); L.arms = { lx: -1.25, lz: -.1, rx: -.35, rz: .1 };
      cam = [0, 1.8, -2.2 + lt * .06, -.3, 2.15, 5.2, 56];
    } else if (bi === 1) {
      place(H, -1.55, 4.7, Math.PI, 'idle', 0, .4); H.arms = { lx: -1.25, lz: -.12, rx: -1.25, rz: .12 }; crateOn = true;
      const lx0 = .95 - .3 * smooth((lt - 3.7) / .4) + .3 * smooth((lt - 8.0) / .6) * 0;
      place(L, lx0, 4.7, Math.PI, 'idle', 0, .4);
      const inspect = smooth((lt - 4.4) / .5);
      L.arms = { lx: -1.25, lz: -.1, rx: lerp(-.35, -1.9, inspect), rz: .1 };
      // hero welcome pose
      if (lt > 6.9) { const w = smooth((lt - 6.9) / .4); H.arms = { lx: lerp(-1.25, -.4, w), lz: lerp(-.12, -.95, w), rx: lerp(-1.25, -.4, w), rz: lerp(.12, .95, w) }; crateOn = false; H.y = Math.abs(Math.sin(t * 5)) * .03 * w; }
      cam = [lerp(.1, -.1, p), 1.8, lerp(-2.2, -1.7, p), 0, 2.15, 5.2, 56];
    } else if (bi === 2) {
      place(H, -1.7, 4.6, Math.PI, 'idle', 0, .5); const up = lt > 3.4; H.arms = { lx: -.2, lz: -.3, rx: -.2, rz: .3 }; if (lt > 5.7) { H.arms = { lx: -.3, lz: -.1, rx: -2.8 + Math.sin(t * 9) * .3, rz: .1 }; H.y = Math.abs(Math.sin(t * 8)) * .05; }
      // ladder base at x=.7 leaning to back
      const climb = smooth((lt - .3) / 1.1); const fall = clamp((lt - 3.2) / .7);
      let ly = lerp(0, .9, climb);
      ladder.position.set(.7, 0, 4.7); ladder.rotation.set(0, 0, 0); ladder.rotation.x = -.02;
      if (fall > 0) { ladder.rotation.z = -fall * fall * 1.4; ladder.position.y = 0; ladder.position.x = .7 + fall * .08; }
      place(L, .7, 4.5, Math.PI, climb < 1 ? 'walk' : 'idle', ly, .35 + 0 * climb); if (climb >= 1 || true) { }
      const glueT = lt > 1.5 && lt < 3.2; const hangT = lt >= 3.2;
      if (lt < 1.4) L.arms = { lx: -.3 + Math.sin(t * 8) * .5, lz: -.1, rx: -1.4 - Math.sin(t * 8) * .4, rz: .1 };
      else L.arms = { lx: -.6, lz: -.1, rx: -2.8, rz: .1 };
      if (hangT) { const sag = .25 * smooth((lt - 3.2) / .5) + .06 * Math.sin((lt - 3.2) * 6) * Math.exp(-(lt - 3.2) * .6); L.y = .9 - sag; L.arms = { lx: -2.85, lz: -.12, rx: -2.85, rz: .12 }; L.anim = 'walk'; L.speed = .3 + .2 * Math.sin(lt); if (lt > 5.7) { L.arms = { lx: -2.85, lz: -.12, rx: -1.35, rz: .1 }; } L.x = .7 + .05 * Math.sin((lt - 3.2) * 2.5) * Math.min(1, (lt - 3.2)); }
      face = lt > 3.3 ? 'shock' : 'calm';
      cam = [0, 1.8, -2.2, .35, 2.5, 5.2, 56];
    } else if (bi === 3) {
      place(H, .85, 4.4, Math.PI, 'idle', 0, .5); const sh = lt > .4 && lt < 3.4; H.arms = { lx: -.2, lz: -.2, rx: sh ? -2.1 : -.3, rz: .15 }; if (lt > 5.9) H.arms = { lx: -.3, lz: -.9, rx: -.3, rz: .9 }; else if (lt > 3.4) H.arms = { lx: -.9, lz: -.1, rx: -.9, rz: .1 };
      // firefighter walks in then backs away (facing the web, back to camera)
      const arrive = smooth((lt - 1.2) / 2.2), back = smooth((lt - 4.7) / 1.6);
      const fz = lerp(2.3, 3.8, arrive) - back * 1.3; const anim = (lt > 1.2 && lt < 3.4) || (lt > 4.7 && lt < 6.3) ? 'walk' : 'idle';
      place(F, -.8, fz, 0, anim, 0, anim === 'walk' ? .55 : .4);
      F.arms = lt > 3.9 ? { lx: -1.7 + Math.sin(t * 5) * .08, lz: -.3, rx: -1.5, rz: .5 } : { lx: -.4, lz: -.1, rx: -.9, rz: .1 };
      if (lt > 6.3) F.arms = { lx: -2.4, lz: -.2, rx: -2.3, rz: .2 };
      if (sh) { line(hp(H, 'handL'), V3(-3.0 + 2 * Math.sin(lt * 2.0), 3.0, BZ), 1); line(hp(H, 'handR'), V3(2.5, CY, 7.5 - 1.5 * Math.sin(lt * 1.7)), 1); line(hp(H, 'handR'), V3(.3, CY, 4.5), 1); }
      if (lt > 6.1) { bubSpider.visible = true; bubSpider.position.set(-.1, 3.1, 5); }
      cam = [.2, 1.8, -2.2, 0, 2.25, 5.5, 56];
    } else if (bi === 4) {
      // landlord with sign
      const raise = smooth((lt - .9) / .8), plant = lt > 2.6; const sd = plant ? dropBounce(.75, 0, lt - 2.6, .3).y : 0;
      place(L, 1.2, 4.6, Math.PI, 'idle', 0, .4); L.arms = plant ? { lx: -1.35, lz: -.1, rx: -.5 + (lt > 4.6 ? -1.4 * smooth((lt - 4.6) / .5) : 0), rz: .1 } : { lx: -.3, lz: -.1, rx: -.9, rz: .25 };
      signPost.rotation.y = Math.PI; signPost.visible = lt > .9; if (plant) signPost.position.set(-.35, sd, 5.2); else signPost.userData.held = true;
      if (lt > 6.2) { const a = smooth((lt - 6.2) / .3); place(Q1, -1.9 + .7 * a, 3.4, Math.PI * .85, 'idle', 0, .4); Q1.arms = { lx: -.3, lz: -.1, rx: -.9, rz: .1 }; place(Q2, 2.5 - .5 * a, 3.4, Math.PI * 1.1, 'idle', 0, .4); Q2.arms = { lx: -.5, lz: -.7, rx: -.5, rz: .7 }; bubQ1.visible = bubQ2.visible = lt > 6.6; bubQ1.position.set(Q1.x, 3.0, Q1.z); bubQ2.position.set(Q2.x, 3.0, Q2.z); }
      if (lt > 6.2) { Q1.vis = Q2.vis = true; }
      cam = [lerp(-.3, .3, p), 1.8, -2.2, .3, 2.25, 5.2, 56];
    } else if (bi === 5) {
      const give = smooth((lt - .7) / .6), take = smooth((lt - 1.6) / .5), sw = clamp((lt - 3.3) / 1.6);
      place(L, .55, 4.6, Math.PI, 'idle', 0, .4);
      const wave = lt > 4.1 && lt < 6.2; L.arms = lt < 2.6 ? { lx: -1.25, lz: -.1, rx: lerp(-.3, -1.6, give), rz: .1 } : wave ? { lx: -1.25, lz: -.1, rx: -2.5 + Math.sin(t * 11) * .4, rz: .3 } : { lx: -1.25, lz: -.1, rx: -.5, rz: .1 };
      if (lt >= 5.6) L.arms = { lx: -2.3, lz: -.15, rx: -2.3, rz: .15 };
      // hero
      const hxx = sw > 0 ? lerp(-1.0, -4.8, Math.pow(sw, 1.6)) : -1.0; const hyy = sw > 0 ? 1.4 * Math.sin(Math.PI * clamp(sw * 1.15)) + sw * 1.0 : 0;
      place(H, hxx, 4.6, Math.PI, 'idle', hyy, .3);
      if (sw > 0) { H.arms = { lx: -.7, lz: -.1, rx: -2.7, rz: -.15 }; line(hp(H, 'handR'), V3(hxx - 1.4, CY, 4.6), 1); }
      else H.arms = take > 0 ? { lx: -.3, lz: -.1, rx: -1.2, rz: .1 } : { lx: -.3, lz: -.1, rx: lerp(-.3, -1.3, give * .6), rz: .1 };
      if (H.x < -3.0) H.vis = false;
      // notice
      if (lt < 1.7) { const hL = hp(L, 'handR'); notice.position.copy(hL).add(V3(-.1, .1, -.1)); notice.rotation.set(0, Math.PI, 0); }
      else { const hH = hp(H, 'handL'); notice.position.copy(hH).add(V3(.05, .15, -.12)); notice.rotation.set(-.1, Math.PI, .1); }
      notice.visible = lt < 4.2;
      // bundle in left hand + pulled web
      if (lt > 5.6) { const hl = hp(L, 'handL'); bundle.position.copy(hl).add(V3(0, .15, -.1)); line(hl, V3(1.3, CY, 5.0), 1, .03); line(hl, V3(.2, CY, 4.2), 1, .02); line(hl, V3(2.3, CY, 6), 1, .02); }
      cam = [-.1, 1.8, -2.2, -.1, 2.25, 5.2, 56];
    } else {
      place(L, 1.05, 3.6, Math.PI * .95, 'idle', 0, .4);
      const pat = lt > 2.2 && lt < 3.5; const sell = smooth((lt - 1.4) / .5);
      L.arms = lt < 1.4 ? { lx: -.3, lz: -.1, rx: -.4, rz: .1 } : { lx: -1.2, lz: -.1, rx: pat ? -1.15 + Math.sin(t * 9) * .15 : lerp(-.4, -1.7, sell), rz: pat ? .1 : lerp(.1, .75, sell) };
      if (lt > 5.3) L.arms = { lx: -1.55 + Math.sin(t * 14) * .1, lz: -.15, rx: -1.55 - Math.sin(t * 14) * .1, rz: .15 };
      const bump = lt > 1.6 ? 1 + .14 * Math.exp(-(lt - 1.6) * 2) * Math.sin((lt - 1.6) * 10) : 1; duvet.scale.set(bump, bump * (1 + .25 * smooth((lt - 1.6) / .5)), bump);
      const tp = lt > 4.0 ? clamp((lt - 4.0) / .3) : 0; tagG.visible = tp > 0; tagG.position.set(-.3, 1.6, 3.7); tagG.scale.setScalar(Math.max(.01, 1.5 * tp * (1 + .15 * Math.exp(-(lt - 4.15) * 5)))); tagG.rotation.set(0, Math.PI, .12);
      if (lt > 5.2) { const ha = hp(L, 'handR'), hb = hp(L, 'handL'); const hh = ha.clone().add(hb).multiplyScalar(.5); inv.position.copy(hh).add(V3(-.62, .05, -.12)); inv.rotation.set(-.12, Math.PI, Math.sin(t * 14) * .06); inv.scale.setScalar(.9); inv.visible = true; } else inv.visible = false;
      // hero cameo, swings across the top
      if (lt > 5.9 && lt < 7.6) { const u = (lt - 5.9) / 1.7; place(H, lerp(2.6, -2.6, u), 6.2, Math.PI, 'idle', .25 + Math.sin(u * 3.14) * .5, .3); H.arms = { lx: -.3, lz: -.9, rx: -2.8, rz: .1 }; line(hp(H, 'handR'), V3(H.x - 1.0, CY, 5.6), 1); }
      face = lt > 5.3 ? 'shock' : 'calm'; face = 'calm';
      cam = [-.2, 1.8, -2.2, .2, 2.1, 5.4, 56]; H.y += 0;
      // keep bed behind-right; landlord left of it
    }
    // crate between hero hands (before update, positions from previous matrices are fine; use after update below)
    crowd.setFace(face);
    crowd.update(t);
    if (H.vis) crowd.parts.face.setMatrixAt(0, faceZero); crowd.parts.face.instanceMatrix.needsUpdate = true;
    // ---- attach props
    const hv = H.vis; [eyeL, eyeR, panL, panR, belt, legPanL, legPanR, spider, bootL, bootR].forEach((m) => (m.visible = hv));
    attach(eyeL, H, 'head', [-.1, -.0, .226], [0, 0, .28]); attach(eyeR, H, 'head', [.1, -.0, .226], [0, 0, -.28]); attach(panL, H, 'torso', [-.2, 0, .16]); attach(panR, H, 'torso', [.2, 0, .16]); attach(belt, H, 'torso', [0, -.3, 0]); attach(spider, H, 'torso', [0, .12, .165]);
    const legMat = (k, m, off) => { if (!H.vis) { m.visible = false; return; } };
    // leg panels: follow legs approx using torso frame (legs hang below)
    attach(legPanL, H, 'torso', [-.27, -.67, 0]); attach(legPanR, H, 'torso', [.27, -.67, 0]); attach(bootL, H, 'torso', [-.14, -1.1, .02]); attach(bootR, H, 'torso', [.14, -1.1, .02]);
    const lv = L.vis; [glasses, shirtP, brows, ...btn].forEach((m) => (m.visible = lv));
    attach(glasses, L, 'head', [0, -.011, .228]); attach(shirtP, L, 'torso', [0, 0, .163]); btn.forEach((b, i) => attach(b, L, 'torso', [0, .18 - i * .16, .172])); attach(brows, L, 'head', [0, .06, .226]);
    const fv = F.vis; [helmet, brim, stripe].forEach((m) => (m.visible = fv)); attach(helmet, F, 'head', [0, .24, 0]); attach(brim, F, 'head', [0, .13, F.yaw === 0 ? -.3 : .3]); attach(stripe, F, 'torso', [0, -.14, 0]);
    if (bi === 3) { attach(axe, F, 'handR', [0, -.1, .02], [1.57, 0, 0]); axe.visible = F.vis; }
    // crate + jars (b0/b1)
    if (bi <= 1) {
      const a = hp(H, 'handL'), b = hp(H, 'handR'); crate.position.copy(a).add(b).multiplyScalar(.5).add(V3(0, .0, 0)); crate.rotation.set(0, H.yaw, 0); crate.visible = H.vis && crateOn;
      if (bi === 1 && !crateOn) crate.visible = false;
      for (let i = 0; i < 12; i++) {
        const j = jars[i]; const loc = V3((i % 4 - 1.5) * .22, .16, ((i / 4 | 0) - 1) * .22).applyAxisAngle(V3(0, 1, 0), H.yaw); const src = crate.position.clone().add(loc);
        if (bi === 0) { j.visible = true; j.position.copy(src); j.scale.setScalar(1.15); continue; }
        const tl0 = 1.4 + i * .18, u = clamp((lt - tl0) / .4); const dst = SLOT(i);
        if (lt < tl0) { j.visible = true; j.position.copy(src); } else { j.visible = true; j.position.lerpVectors(src.clone().addScaledVector(V3(0, 0, 0), 1), dst, smooth(u)); j.position.y += Math.sin(u * Math.PI) * .7; j.rotation.set(0, 0, 0); }
        j.scale.setScalar(1.15);
        if (i === 0 && lt > 4.1) { const hk = smooth((lt - 4.1) / .4); const hr = hp(L, 'handR'); j.position.lerpVectors(dst, hr.clone().add(V3(0, .1, -.04)), hk); j.position.y += Math.sin(hk * Math.PI) * .3; }
      }
      if (bi === 1 && lt > 3.7) for (let i = 0; i < 12; i++) if (lt < 1.4 + i * .18 + .4 && lt >= 1.4 + i * .18) H.arms.lx += 0;
      val = bi === 1 ? String(Math.min(12, jars.reduce((n, _, i) => n + (lt > 1.4 + i * .18 + .38 ? 1 : 0), 0))) : '';
      if (bi === 1 && lt > 4.7) { bubMort.visible = lt < 6.9; bubMort.position.set(L.x - 1.0, 3.5, L.z); }
    }
    if (bi === 2) { const hr = hp(L, 'handR'); jars[0].visible = lt < 3.2; jars[0].scale.setScalar(1.15); jars[0].position.copy(hr).add(V3(0, .08, -.04)); jars[0].rotation.set(0, 0, 0);
      if (lt > 1.5 && lt < 3.4) { line(hr, ceilAt(.7, 4.6), clamp((lt - 1.5) / .5), .03); }
      if (lt >= 3.4) { const hl = hp(L, 'handL'), hr2 = hp(L, 'handR'); line(hl, ceilAt(.7, 4.6), 1, .035); line(hr2, ceilAt(.7, 4.6), 1, .035); }
      if (lt > 3.0) { line(hp(L, 'head'), ceilAt(.7, 4.6), 0, .01); } }
    if (bi === 2 && lt < 3.2) { clip.visible = false; }
    // clipboard on landlord left hand (when not otherwise used)
    if (clip.visible) { attach(clip, L, 'handL', [0, -.12, .12], [Math.PI / 2 + .2, 0, 0]); clip.visible = L.vis && (bi === 0 || bi === 1 || bi === 4 || bi === 5); }
    if (bi === 2) { clip.visible = false; }
    // landlord shake bubble position + sign hands
    if (bi === 4 && lt <= 2.6) { const b2 = hp(L, 'handR'); signPost.position.set(b2.x - .95, 0, L.z - .1); signPost.scale.setScalar(1); }
    DYN.done();
    A.cam(...cam); A.follow(0, 4); A.render();
    // ---- HUD
    hud.style('C'); hud.question(bi === 0 ? 'What if *Spider-Man* paid his rent in webs?' : '', bi === 0 ? 1 : 0);
    let value = '';
    if (bi === 0) { hud.counter('', '', ''); }
    else {
      if (bi === 1) value = val; else if (bi === 2) value = lt > 2.0 ? '1' : '0'; else if (bi === 3) value = String(Math.max(1, Math.round(1 + 23 * smooth((lt - .4) / 2.6)))); else if (bi === 4) value = '$' + fmt(lt > 3.17 ? 4000 * smooth((lt - 3.17) / .7) : 0); else if (bi === 5) value = '$' + fmt(4000 + 4000 * smooth((lt - 2.2) / 1.4)); else value = '$' + fmt(8000 + 4000 * smooth((lt - 5.2) / 1.2));
      hud.counter(LAB[bi], value, NOTE[bi], 'PARODY', (bi === 1 && val === '12') || bi >= 4);
    }
    hud.tm('');
    hud.pop(POP[bi] && lt > POPT[bi] ? POP[bi] : '', Math.min(1, (lt - POPT[bi]) * 6));
  } };
}
