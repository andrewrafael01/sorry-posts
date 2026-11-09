// 663 invention chain: mosquito bites -> net -> (inside) -> zapper -> bigger zapper + 100 friends -> Antarctica (mosquito in pocket) -> tiny jacket.
import { bedroom2 } from './_bed.js';
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, addBox, mat, Crowd, clamp, smooth, lerp, attach, RoundedBoxGeometry } = lib;
  const A = makeStage({ fog: 0x2a2d42, fogNear: 40, fogFar: 160, clouds: true, skyTop: 0x5a6fb5, skyMid: 0xf4a97c, skyBot: 0xffd9a0, shadowExtent: 24, shadowRes: 2048, hemi: 1.2, sunI: 2.2, sunColor: 0xffb878, sunDir: [-.8, .5, .35], exposure: 1.1 }); const S = A.scene;
  const FONT = 'Liberation Sans, Arial';
  const cvs = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); f && f(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return { c, g, t }; };
  const txt = (g, s, x, y, size, color = '#fff', o = {}) => { g.font = `${o.w || 900} ${size}px ${FONT}`; g.textAlign = o.al || 'center'; g.textBaseline = 'middle'; if (o.stroke) { g.lineWidth = o.sw || size * .14; g.strokeStyle = o.stroke; g.lineJoin = 'round'; g.strokeText(s, x, y); } g.fillStyle = color; g.fillText(s, x, y); };
  const cr = (i, k) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
  const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
  const hp = (o, key) => new THREE.Vector3().setFromMatrixPosition(o.M[key]);
  const OX = 400;
  const bas = (c, o = {}) => new THREE.MeshBasicMaterial(Object.assign({ color: c, toneMapped: false }, o));

  // ============================================================ geometry helpers
  const mergeParts = (parts) => { const pos = [], nor = [], col = []; const c = new THREE.Color(); for (const [geo, m, hex] of parts) { const g = geo.index ? geo.toNonIndexed() : geo.clone(); g.applyMatrix4(m); const p = g.attributes.position.array, n = g.attributes.normal.array; c.set(hex); for (let i = 0; i < p.length; i += 3) { pos.push(p[i], p[i + 1], p[i + 2]); nor.push(n[i], n[i + 1], n[i + 2]); col.push(c.r, c.g, c.b); } } const G = new THREE.BufferGeometry(); G.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); G.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); G.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); return G; };
  const TR = (x, y, z, sx = 1, sy = 1, sz = 1, rx = 0, ry = 0, rz = 0) => new THREE.Matrix4().compose(V3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz)), V3(sx, sy, sz));
  const sph = new THREE.SphereGeometry(1, 12, 9), bxg = new THREE.BoxGeometry(1, 1, 1);
  const DARK = 0x2c2a30, THX = 0x3d3440, BAND = 0xe9e4da, EYE = 0xe02a24;
  const bodyParts = () => [[sph, TR(0, -.01, -.2, .085, .08, .2), DARK], [sph, TR(0, -.01, -.12, .09, .085, .03), BAND], [sph, TR(0, -.01, -.2, .09, .085, .03), BAND], [sph, TR(0, -.01, -.28, .082, .078, .03), BAND], [sph, TR(0, .01, 0, .11, .1, .12), THX], [sph, TR(0, 0, .15, .075, .07, .075), DARK], [sph, TR(.05, .02, .17, .03, .03, .03), EYE], [sph, TR(-.05, .02, .17, .03, .03, .03), EYE], [bxg, TR(.03, .08, .22, .008, .008, .16, -.5), 0xcccccc], [bxg, TR(-.03, .08, .22, .008, .008, .16, -.5), 0xcccccc]];
  const swarmBodyGeo = (() => { const p = bodyParts(); p.push([bxg, TR(0, -.02, .34, .012, .012, .34), 0xe4d8c8]); for (const sd of [-1, 1]) for (const [z, a] of [[.07, .5], [0, 0], [-.07, -.5]]) p.push([bxg, TR(sd * .12, -.12, z, .012, .26, .012, a * .4, 0, sd * .5), 0x1d1b20]); return mergeParts(p); })();
  const heroBodyGeo = mergeParts(bodyParts());
  const wingGeo = (sd) => { const g = new THREE.PlaneGeometry(.42, .14); g.rotateX(-Math.PI / 2); g.translate(sd * .21, 0, 0); return g; };
  const wingMat = new THREE.MeshBasicMaterial({ color: 0xdff0ff, transparent: true, opacity: .55, side: THREE.DoubleSide, depthWrite: false, toneMapped: false });
  const ghostMat = new THREE.MeshBasicMaterial({ color: 0xdff0ff, transparent: true, opacity: .16, side: THREE.DoubleSide, depthWrite: false, toneMapped: false });
  const bodyMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .55, metalness: .05 });

  // ------------------------------------------------------------ hero mosquito (articulated)
  const makeMosq = () => {
    const g = new THREE.Group(); const body = new THREE.Mesh(heroBodyGeo, bodyMat); body.castShadow = true; g.add(body);
    const prob = new THREE.Group(); prob.position.set(0, -.02, .2); const pm = new THREE.Mesh(new THREE.CylinderGeometry(.006, .014, .42, 6), mat(0xe4d8c8, { roughness: .4 })); pm.rotation.x = Math.PI / 2; pm.position.z = .21; prob.add(pm); g.add(prob);
    const legs = []; for (const sd of [-1, 1]) for (let k = 0; k < 3; k++) { const p = new THREE.Group(); p.position.set(sd * .07, -.05, .07 - k * .07); const m1 = new THREE.Mesh(bxg, mat(0x1d1b20)); m1.scale.set(.014, .3, .014); m1.position.y = -.15; p.add(m1); g.add(p); legs.push({ p, sd, k }); }
    const wings = []; for (const sd of [-1, 1]) { const w = new THREE.Group(); w.position.set(sd * .04, .09, -.02); const main = new THREE.Mesh(wingGeo(sd), wingMat); w.add(main); for (const a of [-.55, .1, .75]) { const gh = new THREE.Mesh(wingGeo(sd), ghostMat); gh.rotation.z = sd * a; w.add(gh); } g.add(w); wings.push({ w, sd }); }
    // parka for the tiny-jacket beat
    const parka = new THREE.Group(); const OR = mat(0xf05a1e, { roughness: .8 }), WH = mat(0xf6f8ff, { roughness: 1 }), BK = mat(0x1a1a20);
    const pb = (m, w, h, d, x, y, z) => { const b = new THREE.Mesh(bxg, m); b.scale.set(w, h, d); b.position.set(x, y, z); b.castShadow = true; parka.add(b); return b; };
    pb(OR, .27, .25, .25, 0, 0, -.01); pb(WH, .03, .26, .255, 0, 0, -.01); pb(BK, .285, .035, .26, 0, -.02, -.01); pb(WH, .28, .05, .26, 0, .12, -.01); pb(WH, .28, .05, .26, 0, -.12, -.01);
    pb(OR, .2, .1, .08, 0, .105, .08); pb(OR, .2, .2, .08, 0, .02, .07);
    pb(OR, .2, .05, .16, 0, .115, .15); pb(OR, .045, .2, .12, .105, .02, .14); pb(OR, .045, .2, .12, -.105, .02, .14);
    pb(WH, .22, .045, .05, 0, .115, .225); pb(WH, .22, .045, .05, 0, -.085, .225); pb(WH, .045, .2, .05, .11, .015, .225); pb(WH, .045, .2, .05, -.11, .015, .225);
    parka.visible = false; g.add(parka);
    g.userData = { prob, legs, wings, parka, body };
    return g;
  };
  // pose: p world pos, look = forward direction (world), s scale, f flap on, dip = proboscis tilt down (rad), sit = legs down, wave 0..1, t time
  const _tgt = new THREE.Vector3();
  const poseM = (g, p, fwd, s, o, t) => { const d = g.userData; g.visible = true; g.position.copy(p); g.scale.setScalar(s); _tgt.copy(p).add(fwd); g.lookAt(_tgt); if (o.roll) g.rotateZ(o.roll);
    const fl = o.flap ?? 1; const ang = fl ? (.1 + .9 * (Math.sin(t * 62) * .5 + .5)) * .9 - .1 : .15 + (o.fold ? -.1 : 0); d.wings.forEach(({ w, sd }) => { w.rotation.z = sd * (fl ? ang : (o.fold ? .02 : .45)); w.rotation.y = sd * (fl ? .3 : (o.fold ? 1.4 : 0)); w.children.slice(1).forEach((gh) => { gh.visible = !!fl; }); });
    d.prob.rotation.x = (o.dip || 0); d.legs.forEach(({ p: lp, sd, k }) => { const air = o.sit ? 0 : 1; lp.rotation.set(air ? .9 + .15 * Math.sin(t * 7 + k) : (k - 1) * .28, 0, sd * (air ? .35 + .1 * Math.sin(t * 9 + k) : .62)); if (o.wave && k === 0 && sd === 1) { lp.rotation.set(-.2, 0, sd * (2.0 + .55 * Math.sin(t * 13))); lp.rotation.z = sd * (2.0 + o.wave * .5 * Math.sin(t * 13)); } if (o.wave2 && k === 0 && sd === -1) { lp.rotation.set(-.2, 0, sd * (2.0 + .5 * Math.sin(t * 13 + 1.5))); } }); };

  // ------------------------------------------------------------ trail
  const trailN = 16; const trail = []; for (let i = 0; i < trailN; i++) { const m = new THREE.Mesh(sph, new THREE.MeshBasicMaterial({ color: 0xcfe6ff, transparent: true, opacity: .3, depthWrite: false, toneMapped: false })); m.visible = false; S.add(m); trail.push(m); }
  const drawTrail = (on, fn, t, s = 1, spacing = .03) => { trail.forEach((m, i) => { m.visible = on; if (!on) return; const q = fn(t - (i + 1) * spacing); m.position.copy(q); const k = 1 - i / trailN; m.scale.setScalar(.055 * s * k); m.material.opacity = .34 * k; }); };

  // ============================================================ bedroom
  const roomG = new THREE.Group(); S.add(roomG);
  const bed = bedroom2(lib, A, roomG); bed.cones.count = 0; bed.slabs.count = 0; bed.embers.count = 0; bed.bolt.count = 0; bed.strings.forEach((s) => { s.visible = false; });
  roomG.children.forEach((m) => { if (m.isMesh && Math.abs(m.position.x + 2.2) < .01 && m.position.y > 1.0 && m.position.y < 2) m.visible = false; });
  const RP = bed.person; const rcrowd = bed.crowd; Object.values(rcrowd.parts).forEach((m) => S.add(m));
  const heroR = makeMosq(); S.add(heroR);
  // bites on the arm
  const bumps = [0, 1, 2, 3, 4].map(() => { const b = new THREE.Mesh(sph, mat(0xe0564a, { roughness: .5 })); b.visible = false; S.add(b); return b; });
  // ---- mosquito net (translucent grid canopy)
  const netTex = cvs(256, 256, (g, w, h) => { g.clearRect(0, 0, w, h); g.strokeStyle = 'rgba(255,255,255,.95)'; g.lineWidth = 4; for (let i = 0; i <= 8; i++) { g.beginPath(); g.moveTo(i * 32, 0); g.lineTo(i * 32, h); g.stroke(); g.beginPath(); g.moveTo(0, i * 32); g.lineTo(w, i * 32); g.stroke(); } }); netTex.t.wrapS = netTex.t.wrapT = THREE.RepeatWrapping;
  const netG = new THREE.Group(); { const NW = 3.7, NH = 3.2, NZ0 = 2.85, NZ1 = 6.55; const nm = (rx, ry) => { const t2 = netTex.t.clone(); t2.needsUpdate = true; t2.repeat.set(rx, ry); return new THREE.MeshBasicMaterial({ map: t2, transparent: true, opacity: .75, side: THREE.DoubleSide, depthWrite: false, alphaTest: .05, color: 0xf2f6ff }); };
    const fillm = new THREE.MeshBasicMaterial({ color: 0xdfe8ff, transparent: true, opacity: .12, side: THREE.DoubleSide, depthWrite: false });
    const mk = (w, h, mm, x, y, z, ry, rx = 0) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mm); m.position.set(x, y, z); m.rotation.set(rx, ry, 0); netG.add(m); const f = new THREE.Mesh(new THREE.PlaneGeometry(w, h), fillm); f.position.copy(m.position); f.rotation.copy(m.rotation); netG.add(f); };
    mk(NW, NH, nm(NW * 2.2, NH * 2.2), 0, NH / 2 + .1, NZ1, 0); mk(NW, NH, nm(NW * 2.2, NH * 2.2), 0, NH / 2 + .1, NZ0, 0); mk(NZ1 - NZ0, NH, nm((NZ1 - NZ0) * 2.2, NH * 2.2), -NW / 2, NH / 2 + .1, (NZ0 + NZ1) / 2, Math.PI / 2); mk(NZ1 - NZ0, NH, nm((NZ1 - NZ0) * 2.2, NH * 2.2), NW / 2, NH / 2 + .1, (NZ0 + NZ1) / 2, Math.PI / 2); mk(NW, NZ1 - NZ0, nm(NW * 2.2, (NZ1 - NZ0) * 2.2), 0, NH + .1, (NZ0 + NZ1) / 2, 0, Math.PI / 2);
    for (const x of [-NW / 2, NW / 2]) for (const z of [NZ0, NZ1]) { const po = new THREE.Mesh(new THREE.CylinderGeometry(.045, .045, NH + .1, 8), mat(0xd8d2c4, { roughness: .5, metalness: .3 })); po.position.set(x, (NH + .1) / 2, z); po.castShadow = true; netG.add(po); const kb = new THREE.Mesh(sph, mat(0xe8c050, { metalness: .6, roughness: .3 })); kb.scale.setScalar(.08); kb.position.set(x, NH + .14, z); netG.add(kb); }
    for (const z of [NZ0, NZ1]) { const rod = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, NW, 8), mat(0xd8d2c4, { metalness: .3 })); rod.rotation.z = Math.PI / 2; rod.position.set(0, NH + .1, z); netG.add(rod); } }
  netG.visible = false; S.add(netG);
  // ---- small zapper (hangs on the headboard)
  const ZP = V3(.95, 2.25, 3.02);
  const makeZapper = (sc, tag) => { const g = new THREE.Group(); const gl = new THREE.MeshStandardMaterial({ color: 0x59b8ff, emissive: 0x2a8dff, emissiveIntensity: 2.2, roughness: .3 });
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(.09, .09, .62, 12), gl); g.add(tube); const bk = mat(0x2a2f3a, { roughness: .5, metalness: .5 });
    for (const y of [-.38, .38]) { const c = new THREE.Mesh(new THREE.CylinderGeometry(.27, .27, .09, 16), bk); c.position.y = y; c.castShadow = true; g.add(c); }
    for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; const b = new THREE.Mesh(bxg, bk); b.scale.set(.025, .72, .025); b.position.set(Math.cos(a) * .24, 0, Math.sin(a) * .24); g.add(b); }
    const hook = new THREE.Mesh(new THREE.CylinderGeometry(.015, .015, .55, 5), bk); hook.position.y = .66; g.add(hook);
    g.scale.setScalar(sc); g.userData.glow = gl; g.visible = false; S.add(g); return g; };
  const zapS = makeZapper(1);
  const zapLight = new THREE.PointLight(0x5aa8ff, 0, 7, 1.5); S.add(zapLight);
  // ---- big arcade-sized zapper
  const BZP = V3(3.5, 0, 4.4);
  const bigZ = new THREE.Group(); { const body = mat(0x2a1f45, { roughness: .5, metalness: .3 }), trim = new THREE.MeshStandardMaterial({ color: 0xff3df0, emissive: 0xff2ae0, emissiveIntensity: 1.8 }), blu = new THREE.MeshStandardMaterial({ color: 0x59b8ff, emissive: 0x2a8dff, emissiveIntensity: 2.4 });
    const bb = (m, w, h, d, x, y, z) => { const b = new THREE.Mesh(bxg, m); b.scale.set(w, h, d); b.position.set(x, y, z); b.castShadow = true; b.receiveShadow = true; bigZ.add(b); return b; };
    bb(body, 1.9, 3.5, 1.3, 0, 1.75, 0); bb(body, 1.7, .9, 1.5, 0, 1.0, .25); bb(body, 2.0, .3, 1.5, 0, 3.52, .0);
    const mq = cvs(512, 160, (g, w, h) => { g.fillStyle = '#1a1030'; g.fillRect(0, 0, w, h); txt(g, 'MEGA ZAP', w / 2, 60, 92, '#ffe23a', { stroke: '#ff3df0', sw: 10 }); txt(g, '3000', w / 2, 128, 64, '#7dfcff'); }); const sg = new THREE.Mesh(new THREE.PlaneGeometry(1.8, .56), new THREE.MeshBasicMaterial({ map: mq.t, toneMapped: false })); sg.position.set(0, 3.2, .76); bigZ.add(sg);
    bb(trim, 1.95, .06, .06, 0, 3.4, .72); bb(trim, .06, 2.2, .06, -.95, 2.0, .72); bb(trim, .06, 2.2, .06, .95, 2.0, .72);
    bb(blu, .2, 1.7, .2, 0, 2.15, .3); for (let i = 0; i < 9; i++) { const a = i / 9 * 6.283; const rr = bb(mat(0x151826, { metalness: .6, roughness: .4 }), .05, 1.9, .05, Math.cos(a) * .6, 2.15, .3 + Math.sin(a) * .35); }
    for (const [x, c] of [[-.45, 0xff3b3b], [.0, 0xffe23a], [.45, 0x3bff6b]]) { const b = new THREE.Mesh(new THREE.CylinderGeometry(.11, .11, .1, 14), mat(c, { emissive: c, emissiveIntensity: .6 })); b.position.set(x, 1.47, 1.0); bigZ.add(b); }
    const st = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, .35, 8), mat(0x999999)); st.position.set(-.7, 1.62, 1.0); bigZ.add(st); const bl = new THREE.Mesh(sph, mat(0xff3b3b)); bl.scale.setScalar(.12); bl.position.set(-.7, 1.82, 1.0); bigZ.add(bl);
    bigZ.userData.blu = blu; bigZ.userData.trim = trim; }
  bigZ.position.copy(BZP); bigZ.rotation.y = -Math.PI / 2; bigZ.visible = false; S.add(bigZ);
  const bigLight = new THREE.PointLight(0x5aa8ff, 0, 11, 1.4); S.add(bigLight);
  const BZC = V3(BZP.x - .75, 2.15, BZP.z); // cage center (front of cabinet faces -x)
  // ---- zap bolts + sparks + hair spikes
  const bolts = []; for (let i = 0; i < 12; i++) { const m = new THREE.Mesh(bxg, bas(0xcfeaff)); m.visible = false; S.add(m); bolts.push(m); }
  const setBolt = (on, a, b, seed, w = .035) => { const n = bolts.length; const d = V3().subVectors(b, a); const len = d.length(); const up = V3(0, 1, 0); let prev = a.clone(); for (let i = 0; i < n; i++) { const m = bolts[i]; m.visible = on; if (!on) continue; const u = (i + 1) / n; const nx = V3().copy(a).addScaledVector(d, u); if (i < n - 1) { nx.x += (cr(i + seed, 1) - .5) * .35; nx.y += (cr(i + seed, 2) - .5) * .35; nx.z += (cr(i + seed, 3) - .5) * .35; } const seg = V3().subVectors(nx, prev); const sl = seg.length(); m.position.copy(prev).addScaledVector(seg, .5); m.scale.set(w, w, sl + .02); m.lookAt(nx); prev = nx; } };
  const sparks = new THREE.InstancedMesh(bxg, bas(0xdff6ff), 48); sparks.frustumCulled = false; S.add(sparks); const sparkCol = new THREE.Color(); for (let i = 0; i < 48; i++) { sparkCol.set(i % 3 ? 0x9fd8ff : 0xffffff); sparks.setColorAt(i, sparkCol); } sparks.instanceColor.needsUpdate = true;
  const _d = new THREE.Object3D(); const hideM = new THREE.Matrix4().makeScale(0, 0, 0);
  const setSparks = (on, c, tau, seed) => { for (let i = 0; i < 48; i++) { if (!on || tau < 0 || tau > .6) { sparks.setMatrixAt(i, hideM); continue; } const th = cr(i + seed, 4) * 6.283, ph = cr(i + seed, 5) * 3.1, v = 1.5 + cr(i + seed, 6) * 3; _d.position.set(c.x + Math.sin(ph) * Math.cos(th) * v * tau, c.y + Math.cos(ph) * v * tau - 4 * tau * tau, c.z + Math.sin(ph) * Math.sin(th) * v * tau); _d.scale.setScalar(.045 * (1 - tau / .6)); _d.rotation.set(tau * 20 + i, tau * 15, 0); _d.updateMatrix(); sparks.setMatrixAt(i, _d.matrix); } sparks.instanceMatrix.needsUpdate = true; };
  const spikes = []; for (let i = 0; i < 9; i++) { const m = new THREE.Mesh(bxg, mat(0x3a2a1c)); m.visible = false; S.add(m); spikes.push(m); }
  // ---- sprites
  const mkLabel = (text, c1, c2, w = 512, fs = 110) => { const l = cvs(w, 160, (g, ww, h) => { txt(g, text, ww / 2, 84, text.length > 9 ? 84 : fs, c1, { stroke: c2, sw: 20 }); }); const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: l.t, transparent: true, depthWrite: false, depthTest: false })); s.visible = false; s.renderOrder = 10; S.add(s); return s; };
  const lbClever = mkLabel('CLEVER!', '#ffe23a', '#111'), lbBetter = mkLabel('MUCH BETTER!', '#7dff6a', '#111'), lbZap = mkLabel('ZAP!', '#9fe8ff', '#111', 384, 130), lbBite = mkLabel('BITE!', '#ff5a4a', '#111', 384, 120), lbZ = mkLabel('Z', '#dfe6ff', '#223', 256, 120), lbBz = mkLabel('bzzz', '#ffffff', '#222', 384, 120);
  const zzz = [0, 1, 2].map(() => { const s = lbZ.clone(); s.material = lbZ.material.clone(); S.add(s); return s; });
  const bzz = [0, 1, 2].map(() => { const s = lbBz.clone(); s.material = lbBz.material.clone(); S.add(s); return s; });
  const labelAt = (s, on, pos, w, k = 1) => { s.visible = on; if (!on) return; s.position.copy(pos); const a = clamp(k); s.scale.set(w * a, w * a * 160 / s.material.map.image.width, 1); };
  // ---- swarm (100 mosquitoes, instanced)
  const NSW = 100; const swBody = new THREE.InstancedMesh(swarmBodyGeo, bodyMat, NSW); swBody.frustumCulled = false; swBody.castShadow = true; S.add(swBody);
  const swWingR = new THREE.InstancedMesh(wingGeo(1), wingMat, NSW), swWingL = new THREE.InstancedMesh(wingGeo(-1), wingMat, NSW); swWingR.frustumCulled = swWingL.frustumCulled = false; S.add(swWingR); S.add(swWingL);
  const WIN = V3(3.6, 2.2, 8.0); const SWC = V3(.2, 2.7, 5.0);
  const swInfo = []; for (let i = 0; i < NSW; i++) swInfo.push({ te: 1.2 + 3.7 * Math.pow(i / NSW, 1.15), r: .9 + cr(i, 20) * 1.9, th0: cr(i, 21) * 6.283, om: (1.4 + cr(i, 22) * 1.5) * (cr(i, 23) < .5 ? -1 : 1), ph: cr(i, 24) * 6.283, ex: cr(i, 25) - .5, ey: cr(i, 26) - .5, hy: cr(i, 27) * 1.2 });
  const swPos = (i, tt) => { const f = swInfo[i]; const tau = tt - f.te; const entry = V3(WIN.x + f.ex * 1.1, WIN.y + f.ey * .9, WIN.z); const th = f.th0 + f.om * tau; const orb = V3(SWC.x + f.r * Math.cos(th) * 1.15, SWC.y + f.hy - .3 + .45 * Math.sin(2 * th + f.ph), SWC.z + f.r * Math.sin(th) * .9 - .4); const u = smooth(tau / 1.3); return V3(lerp(entry.x, orb.x, u) + Math.sin(tau * 9 + f.ph) * .08 * (1 - u), lerp(entry.y, orb.y, u) + Math.sin(tau * 11 + f.ph) * .08, lerp(entry.z, orb.z, u)); };
  const _w = new THREE.Matrix4(), _wr = new THREE.Matrix4();
  const updateSwarm = (t, on, lt, ex = 0) => { let vis = 0; for (let i = 0; i < NSW; i++) { const f = swInfo[i]; const tau = lt - f.te; if (!on || tau < 0) { swBody.setMatrixAt(i, hideM); swWingR.setMatrixAt(i, hideM); swWingL.setMatrixAt(i, hideM); continue; } vis++; const p = swPos(i, lt), q = swPos(i, lt + .04); const fw = V3().subVectors(q, p); if (fw.lengthSq() < 1e-8) fw.set(0, 0, 1); _d.position.copy(p); _d.lookAt(q); _d.scale.setScalar(.6); _d.updateMatrix(); swBody.setMatrixAt(i, _d.matrix); const a = (Math.sin(t * 58 + i * 1.7) * .5 + .5) * .9 - .1; _wr.makeRotationZ(a); _w.multiplyMatrices(_d.matrix, TR(.04, .09, -.02)); swWingR.setMatrixAt(i, _w.clone().multiply(_wr)); _wr.makeRotationZ(-a); _w.multiplyMatrices(_d.matrix, TR(-.04, .09, -.02)); swWingL.setMatrixAt(i, _w.clone().multiply(_wr)); } swBody.instanceMatrix.needsUpdate = swWingR.instanceMatrix.needsUpdate = swWingL.instanceMatrix.needsUpdate = true; return vis; };

  // ============================================================ antarctica (offset by OX)
  const stG = new THREE.Group(); stG.position.set(OX, 0, 0); S.add(stG);
  { const snow = new THREE.Mesh(new THREE.CircleGeometry(160, 48), mat(0xf0f5fb, { roughness: .95 })); snow.rotation.x = -Math.PI / 2; snow.receiveShadow = true; stG.add(snow);
    for (let i = 0; i < 22; i++) { const m = new THREE.Mesh(sph, mat(0xe9f0f8, { roughness: 1 })); const a = cr(i, 30) * 6.283, d = 6 + cr(i, 31) * 40; m.position.set(Math.cos(a) * d, 0, -Math.abs(Math.sin(a)) * d - 4); m.scale.set(3 + cr(i, 32) * 6, .5 + cr(i, 33) * 1.4, 3 + cr(i, 34) * 6); m.receiveShadow = true; stG.add(m); }
    for (let i = 0; i < 9; i++) { const c = new THREE.Mesh(new THREE.ConeGeometry(5 + cr(i, 40) * 6, 12 + cr(i, 41) * 14, 5), mat(i % 2 ? 0xb8d4ee : 0xd6e6f5, { roughness: .8, flatShading: true })); c.position.set(-60 + i * 14 + cr(i, 42) * 6, 5, -48 - cr(i, 43) * 16); c.castShadow = true; stG.add(c); }
    // igloo
    const ig = new THREE.Group(); const brick = cvs(512, 256, (g, w, h) => { g.fillStyle = '#f4f9ff'; g.fillRect(0, 0, w, h); g.strokeStyle = '#a9c0d8'; g.lineWidth = 4; for (let r = 0; r < 8; r++) { const y = r * 32; g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); for (let c = 0; c < 12; c++) { const x = (c * 43 + (r % 2) * 21) % w; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 32); g.stroke(); } } });
    const dome = new THREE.Mesh(new THREE.SphereGeometry(2.6, 24, 14, 0, 6.283, 0, 1.5708), new THREE.MeshStandardMaterial({ map: brick.t, roughness: .9 })); dome.castShadow = true; dome.receiveShadow = true; ig.add(dome);
    const tun = new THREE.Mesh(new THREE.CylinderGeometry(.95, .95, 1.5, 16, 1, false, 0, 3.1416), new THREE.MeshStandardMaterial({ map: brick.t, roughness: .9 })); tun.rotation.set(Math.PI / 2, 0, Math.PI / 2); tun.rotation.order = 'YXZ'; tun.rotation.set(0, Math.PI / 2, 0); const tunG = new THREE.Group(); const tm2 = new THREE.Mesh(new THREE.CylinderGeometry(.95, .95, 1.6, 16, 1, false, -1.5708, 3.1416), new THREE.MeshStandardMaterial({ map: brick.t, roughness: .9 })); tm2.rotation.x = Math.PI / 2; tm2.scale.set(1, 1, 1); tunG.add(tm2); tunG.position.set(0, 0, 2.2); tunG.scale.y = 1; tm2.castShadow = true; ig.add(tunG);
    const door = new THREE.Mesh(new THREE.CircleGeometry(.75, 16, 0, 3.1416), mat(0x1c2433)); door.position.set(0, .01, 3.01); ig.add(door);
    ig.position.set(4.6, 0, -.5); ig.rotation.y = -.55; stG.add(ig);
    // penguin
    var peng = new THREE.Group(); const pbk = mat(0x15181f, { roughness: .6 }), pwh = mat(0xf5f6fa, { roughness: .8 }), por = mat(0xffa21a, { roughness: .6 });
    const pb2 = (m, x, y, z, sx, sy, sz, s2 = sph) => { const b = new THREE.Mesh(s2, m); b.position.set(x, y, z); b.scale.set(sx, sy, sz); b.castShadow = true; peng.add(b); return b; };
    pb2(pbk, 0, .62, 0, .36, .55, .3); pb2(pwh, 0, .58, .1, .27, .44, .22); pb2(pbk, 0, 1.2, .02, .24, .24, .24); pb2(pwh, 0, 1.18, .12, .16, .16, .12); pb2(por, 0, 1.17, .3, .06, .035, .1); pb2(por, -.14, .04, .14, .1, .03, .17, bxg); pb2(por, .14, .04, .14, .1, .03, .17, bxg);
    pb2(new THREE.MeshBasicMaterial({ color: 0xffffff }), -.08, 1.26, .2, .04, .05, .03); pb2(new THREE.MeshBasicMaterial({ color: 0xffffff }), .08, 1.26, .2, .04, .05, .03); pb2(new THREE.MeshBasicMaterial({ color: 0x000000 }), -.08, 1.26, .23, .02, .03, .02); pb2(new THREE.MeshBasicMaterial({ color: 0x000000 }), .08, 1.26, .23, .02, .03, .02);
    const fl = []; for (const sd of [-1, 1]) { const f = pb2(pbk, sd * .38, .7, 0, .07, .28, .17); fl.push(f); } peng.userData.fl = fl; peng.scale.setScalar(1.4); stG.add(peng); }
  const signG = new THREE.Group(); { const sg = cvs(512, 256, (g, w, h) => { g.fillStyle = '#7a4e28'; g.fillRect(0, 0, w, h); g.strokeStyle = '#4a2e14'; g.lineWidth = 12; g.strokeRect(6, 6, w - 12, h - 12); txt(g, 'ANTARCTICA', w / 2, 100, 82, '#fff4d8'); txt(g, 'POP. 0 MOSQUITOES', w / 2, 188, 40, '#ffd9a0', { w: 800 }); }); const bd = new THREE.Mesh(new THREE.BoxGeometry(1.8, .9, .08), new THREE.MeshStandardMaterial({ map: sg.t, roughness: .8 })); bd.position.set(0, 1.9, 0); bd.castShadow = true; signG.add(bd); const po = new THREE.Mesh(new THREE.BoxGeometry(.12, 1.9, .12), mat(0x4a2e14)); po.position.set(0, .95, -.05); signG.add(po); signG.position.set(OX - 2.4, 0, 3.6); signG.rotation.y = .35; S.add(signG); signG.visible = false; }
  // snowfall
  const flakes = new THREE.InstancedMesh(bxg, new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }), 160); flakes.frustumCulled = false; S.add(flakes);
  const heroA = makeMosq(); S.add(heroA); heroA.userData.parka.visible = false;

  // ---- you in a parka (uses the bedroom crowd's person: swap pose each beat)
  const parka = new THREE.Group(); { const OR = mat(0xf05a1e, { roughness: .85 }), WH = mat(0xf6f8ff, { roughness: 1 }), DK = mat(0x8e2c0e, { roughness: .9 });
    const pb = (m, w, h, d, key) => { const b = new THREE.Mesh(bxg, m); b.scale.set(w, h, d); b.castShadow = true; b.userData.key = key; parka.add(b); return b; };
    parka.userData.parts = [
      { m: pb(OR, .8, .84, .5, 'torso'), key: 'torso', off: [0, -.02, 0] }, { m: pb(OR, .3, .66, .32, 'armL'), key: 'armL', off: [0, -.28, 0] }, { m: pb(OR, .3, .66, .32, 'armR'), key: 'armR', off: [0, -.28, 0] },
      { m: pb(WH, .84, .14, .54, 'torso'), key: 'torso', off: [0, -.34, 0] }, { m: pb(WH, .32, .1, .34, 'armL'), key: 'armL', off: [0, -.6, 0] }, { m: pb(WH, .32, .1, .34, 'armR'), key: 'armR', off: [0, -.6, 0] },
      { m: pb(DK, .8, .08, .52, 'torso'), key: 'torso', off: [0, -.2, 0] },
      { m: pb(OR, .66, .2, .66, 'head'), key: 'head', off: [0, .31, -.03] }, { m: pb(OR, .1, .6, .64, 'head'), key: 'head', off: [.31, -.0, -.05] }, { m: pb(OR, .1, .6, .64, 'head'), key: 'head', off: [-.31, -.0, -.05] }, { m: pb(OR, .66, .62, .12, 'head'), key: 'head', off: [0, 0, -.32] },
      { m: pb(WH, .7, .09, .1, 'head'), key: 'head', off: [0, .26, .3] }, { m: pb(WH, .7, .09, .1, 'head'), key: 'head', off: [0, -.26, .3] }, { m: pb(WH, .09, .6, .1, 'head'), key: 'head', off: [.31, 0, .3] }, { m: pb(WH, .09, .6, .1, 'head'), key: 'head', off: [-.31, 0, .3] },
    ];
    // chest pocket (flap + opening) where the mosquito hides
    parka.userData.pocket = { m: pb(DK, .3, .26, .1, 'torso'), key: 'torso', off: [.17, -.04, .27] }; parka.userData.flap = { m: pb(OR, .32, .07, .12, 'torso'), key: 'torso', off: [.17, .1, .28] };
    parka.userData.parts.push(parka.userData.pocket, parka.userData.flap); }
  parka.visible = false; S.add(parka); const _sm = new THREE.Matrix4(); const parkaAttach = (o) => { for (const p of parka.userData.parts) { attach(p.m, o, p.key, p.off); p.m.matrix.multiply(_sm.makeScale(p.m.scale.x, p.m.scale.y, p.m.scale.z)); p.m.visible = o.vis; } };
  // thumbs-up fist not needed; mosquito pocket position helper
  const pocketTop = (o) => V3(.17, .1, .27).applyMatrix4(o.M.torso);

  // ============================================================ camera
  const E = new THREE.Vector3(), T2 = new THREE.Vector3(); let ox = 0;
  const rv = (v, an) => (typeof v === 'function' ? v(an) : v);
  const rig = (lt, shots, an, t, shake = 0) => { let i = 0; while (i < shots.length - 1 && lt >= shots[i + 1][0]) i++; const s = shots[i]; const t1 = i < shots.length - 1 ? shots[i + 1][0] : s[0] + 99; let u = clamp((lt - s[0]) / Math.max(.01, Math.min(t1 - s[0], 9))); u = lerp(u, smooth(u), .35);
    const e0 = rv(s[1], an), e1 = rv(s[2], an), g0 = rv(s[3], an), g1 = rv(s[4], an);
    E.set(lerp(e0[0], e1[0], u), lerp(e0[1], e1[1], u), lerp(e0[2], e1[2], u)); T2.set(lerp(g0[0], g1[0], u), lerp(g0[1], g1[1], u), lerp(g0[2], g1[2], u)); E.x += Math.sin(t * .9) * .015 + Math.sin(t * 61) * shake; E.y += Math.sin(t * 1.3 + 1) * .012 + Math.cos(t * 57) * shake; E.x += ox; T2.x += ox; A.cam(E.x, E.y, E.z, T2.x, T2.y, T2.z, lerp(s[5], s[6], u), Math.sin(t * .7) * .008); };
  const place = (o, x, y, z, yaw, anim, sp = 1) => { o.x = x; o.y = y; o.z = z; o.yaw = yaw; o.anim = anim; o.speed = sp; o.extra = 0; o.vis = true; o.scale = 1; o.arms = null; o.pitch = 0; o.lie = 0; o.roll = 0; };

  // hero flight paths (functions of time -> V3)
  const landPt = V3(0, 0, 0); // set per frame (arm top)
  const flyIn = (tt) => { // beat 0: window -> loops over the bed
    const u = clamp(tt / 1.0); const a = tt * 7; const base = V3(lerp(3.6, landPt.x, smooth(u)), lerp(2.3, landPt.y + .02, smooth(u)), lerp(7.9, landPt.z, smooth(u)));
    const w = 1 - smooth(u); base.x += Math.sin(a) * .5 * w; base.y += Math.cos(a * 1.3) * .35 * w + .6 * Math.sin(u * 3.14) * w; base.z += Math.cos(a) * .4 * w; return base; };
  const DUR = [4.09, 3.41, 6.14, 6.14, 6.14, 3.41];

  return { frame({ t, bi, lt }) {
    bi = Math.min(bi, 5); const inRoom = bi <= 3; roomG.visible = inRoom; stG.visible = !inRoom; ox = inRoom ? 0 : OX;
    A.scene.fog.color.set(inRoom ? 0x23263a : 0xcfdcee); A.scene.fog.near = inRoom ? 40 : 30; A.scene.fog.far = inRoom ? 160 : 140;
    A.sun.intensity = inRoom ? 0 : 2.6; A.sun.color.set(inRoom ? 0xffb878 : 0xfff0dc); A.hemi.intensity = inRoom ? .5 : 1.1; bed.lamp.intensity = inRoom ? 6 : 0; A.sun.castShadow = !inRoom || false;
    [lbClever, lbBetter, lbZap, lbBite, lbZ].forEach((s) => { s.visible = false; }); zzz.forEach((s) => { s.visible = false; }); bzz.forEach((s) => { s.visible = false; });
    signG.visible = false; heroR.visible = false; heroA.visible = false; netG.visible = false; zapS.visible = false; bigZ.visible = false; zapLight.intensity = 0; bigLight.intensity = 0; bumps.forEach((b) => { b.visible = false; });
    spikes.forEach((s) => { s.visible = false; }); setBolt(false, V3(), V3(), 0); setSparks(false, V3(), 0, 0); parka.visible = false; drawTrail(false, flyIn, t);
    let counter = ['BITES', '0'], note = '', hot = false, shake = 0, faceShock = false, an = {};
    const swVis = updateSwarm(t, bi === 3, lt);
    if (inRoom) {
      peng.visible = false; flakes.visible = false;
      bed.blanket.visible = true; const lying = bi <= 2; bed.blanket.position.y = lying ? .26 : 0;
      RP.vis = true; RP.h = 1; RP.scale = 1; RP.extra = 0; RP.roll = 0; RP.pitch = 0; RP.speed = .3; RP.arms = { lx: -.2, lz: -.1, rx: -.2, rz: .1 };
      if (lying) { RP.anim = 'lie'; RP.x = 0; RP.y = 1.0; RP.z = 5.3; RP.yaw = 0; RP.lie = Math.PI / 2; } else { RP.anim = 'sit'; RP.x = 0; RP.y = .06; RP.z = 3.5; RP.yaw = 0; RP.lie = 0; RP.arms = null; }
      const breathe = Math.sin(t * 2.0) * .5 + .5;
      if (bi === 0) {
        RP.arms = { lx: -.2, lz: -.1, rx: -1.4, rz: .1 }; rcrowd.update(t); const A0 = hp(RP, 'armR'), H0 = hp(RP, 'handR'); const axis = V3().subVectors(H0, A0); landPt.copy(A0).addScaledVector(axis, .15).add(V3(-.1, .02, .1));
        // sleeper zzz
        zzz.forEach((s, i) => { const l = ((lt * .5 + i / 3) % 1); s.visible = true; s.position.set(-.1 + l * .4 + i * .12, 2.0 + l * 1.0, 3.7); const a = Math.sin(l * Math.PI); s.scale.set(.5 * a + .05, .5 * a * .6 + .03, 1); s.material.opacity = a; });
        const bites = [1.15, 1.65, 2.15]; const nB = bites.filter((b) => lt >= b + .1).length;
        // hero: fly in, land, bite x3, take off
        const landed = lt > 1.0 && lt < 2.5; let dip = 0; const biteK = bites.findIndex((b) => lt >= b && lt < b + .4); if (biteK >= 0) dip = smooth(Math.sin((lt - bites[biteK]) / .4 * Math.PI)) * 1.1;
        let pos, fwd = V3(-1, -.1, -.4).normalize();
        if (lt < 1.0) { pos = flyIn(lt); fwd = V3().subVectors(flyIn(lt + .05), pos); } else if (lt < 2.5) { pos = landPt.clone(); pos.y += .1 + .02 * Math.sin(lt * 20); fwd = V3(-.4, -.25, .3); } else { const u = lt - 2.5; pos = landPt.clone().add(V3(u * 1.0, .8 * u + .6 * u * u, -u * 1.3)); fwd = V3(.4, .5, -.6); }
        heroR.visible = true; poseM(heroR, pos, fwd.normalize(), 1.35, { flap: landed ? 0 : 1, fold: landed, dip: landed ? -dip * .55 + .55 : 0, sit: landed }, t);
        drawTrail(lt < 1.1 || lt > 2.5, (tt) => (tt < 1.0 ? flyIn(Math.max(0, tt)) : tt < 2.5 ? landPt.clone() : landPt.clone().add(V3((tt - 2.5) * 1, .8 * (tt - 2.5) + .6 * (tt - 2.5) ** 2, -(tt - 2.5) * 1.3))), lt, 1.35, .035);
        bites.forEach((b, i) => { if (lt >= b + .1) { const k = clamp((lt - b - .1) / .3); bumps[i].visible = true; bumps[i].position.copy(A0).addScaledVector(axis, -.25 + i * .28).add(V3(-.085, 0, .06)); bumps[i].scale.setScalar(.055 * (.4 + .6 * smooth(k)) * 1.2); } });
        bites.forEach((b, i) => { if (lt >= b + .05 && lt < b + .65) { const l = lt - b - .05; labelAt(lbBite, true, V3(landPt.x - .6, landPt.y + .5 + l * .5, landPt.z + .3), .8, Math.min(1, l * 7)); } });
        // net drops (so you buy a net)
        const nd = clamp((lt - 2.55) / .8); const dropY = lerp(3.8, 0, smooth(nd)) + (nd >= 1 ? Math.abs(Math.sin((lt - 3.35) * 14)) * .06 * Math.exp(-(lt - 3.35) * 6) : 0); netG.visible = lt > 2.5; netG.position.set(0, dropY, 0); netG.rotation.z = (1 - smooth(nd)) * .08 * Math.sin(lt * 8);
        counter = ['BITES', String(nB)]; hot = nB > 0; note = nB ? 'one very small problem' : 'sleeping';
        RP.arms = { lx: -.2, lz: -.1, rx: -1.4, rz: .1 }; RP.extra = (lt >= bites[0] + .1 && lt < 2.6) ? .0 : 0;
        const hr = H0;
        an = { hr };
        rig(lt, [[0, [3.4, 3.0, 8.1], [2.4, 2.6, 7.5], [.2, 1.8, 4.6], [.2, 1.7, 4.6], 62, 58], [.95, [-2.2, 2.3, 7.5], [-1.7, 2.1, 7.0], (a) => [landPt.x, landPt.y - .1, landPt.z], (a) => [landPt.x, landPt.y - .1, landPt.z], 34, 28], [2.35, [-4.8, 3.6, 8.1], [-4.4, 3.4, 8.0], [0, 1.7, 4.7], [0, 1.7, 4.7], 56, 56]], an, t);
      } else if (bi === 1) {
        // net closed; mosquito inside waves at camera
        netG.visible = true; netG.position.set(0, 0, 0); netG.rotation.z = 0;
        zzz.forEach((s, i) => { const l = ((lt * .5 + i / 3) % 1); s.visible = lt > .0; s.position.set(-.1 + l * .4 + i * .12, 2.0 + l * 1.0, 3.7); const a = Math.sin(l * Math.PI); s.scale.set(.5 * a + .05, .5 * a * .6 + .03, 1); s.material.opacity = a; });
        const sitP = V3(.25, 1.18, 5.95); const hov = V3(.25 + .05 * Math.sin(lt * 3), 1.6 + .08 * Math.sin(lt * 4.3), 5.7);
        const lan = smooth((lt - .55) / .5); const pos = V3().lerpVectors(hov, sitP, lan); pos.y += (1 - lan) * 0; const sitting = lan >= 1;
        heroR.visible = true; poseM(heroR, pos, V3(.05, -.1 * (1 - lan), 1), 2.0, { flap: sitting ? 0 : 1, fold: sitting, sit: sitting, wave: sitting ? 1 : 0, wave2: sitting && lt > 2.3 }, t);
        const nB = 3 + (lt > 2.6 ? 1 : 0) + (lt > 3.2 ? 1 : 0); counter = ['BITES', String(nB)]; hot = true; note = 'inside the net';
        labelAt(lbClever, lt > .1 && lt < 1.1, V3(.3, 3.4, 5.0), 1.8, Math.min(1.1, (lt - .1) * 6));
        rig(lt, [[0, [3.6, 3.3, 8.1], [3.2, 3.2, 8.0], [0, 1.9, 4.9], [0, 1.9, 4.9], 58, 56], [.8, [.1, 1.55, 8.1], [.25, 1.45, 7.9], [.15, 1.45, 5.9], [.25, 1.3, 5.9], 40, 34]], an, t);
      } else if (bi === 2) {
        const zz = V3(ZP.x, ZP.y, ZP.z); const drop = clamp((lt - .1) / .5); const dy = Math.max(0, 3.6 * (1 - drop) * (1 - drop)) + (drop >= 1 && lt < 1.1 ? Math.abs(Math.sin((lt - .6) * 14)) * .12 * Math.exp(-(lt - .6) * 5) : 0);
        zapS.visible = lt > .1; zapS.position.set(zz.x, zz.y + dy + .0, zz.z); zapS.userData.glow.emissiveIntensity = 2.2 + .8 * Math.sin(t * 40); zapLight.intensity = lt > .6 ? 7 + 3 * Math.sin(t * 40) : 0; zapLight.position.set(zz.x, zz.y, zz.z + .6);
        // mosquito flits around and flees the light
        const mp = (tt) => V3(-.4 + 1.9 * Math.sin(tt * 2.3), 2.7 + .4 * Math.sin(tt * 3.1), 4.4 + 1.2 * Math.cos(tt * 1.9));
        heroR.visible = true; poseM(heroR, mp(lt), V3().subVectors(mp(lt + .05), mp(lt)), 1.0, { flap: 1 }, t); drawTrail(true, mp, lt, 1.0, .04);
        // thumbs-up then toss and turn into the zapper
        const ev = [3.55, 4.25, 4.95, 5.55]; let roll = 0, zapN = 0, lastZ = -9;
        ev.forEach((e, i) => { if (lt >= e) { zapN = i + 1; lastZ = e; } });
        const rollT = [[3.3, 3.65], [4.0, 4.35], [4.7, 5.05], [5.3, 5.65]]; let rAng = 0, hop = 0; rollT.forEach(([a, b], i) => { const u = smooth((lt - a) / (b - a)); rAng = Math.max(rAng, 0); if (lt >= a) { rAng = Math.PI * (i + u); if (lt < b) hop = Math.sin(u * Math.PI); } });
        RP.roll = rAng; RP.y = 1.0 + .22 * hop; RP.x = Math.sin(rAng / 2) * .0 + (rAng ? 0 : 0);
        faceShock = lt > 3.3; const better = lt > 1.95 && lt < 3.1; if (better) RP.arms = { lx: -.2, lz: -.1, rx: -2.9, rz: .3 }; else RP.arms = { lx: -.2, lz: -.1, rx: -.2, rz: .1 };
        // zap effect
        rcrowd.setFace(faceShock ? 'shock' : 'calm'); rcrowd.update(t); const tz = lt - lastZ; const zon = lastZ > 0 && tz < .5;
        const head = hp(RP, 'head'); const bolt = zon && Math.floor(tz * 30) % 2 === 0; setBolt(zon && tz < .4, V3(zz.x, zz.y - .25, zz.z + .1), head.clone(), Math.floor(tz * 25) * 7);
        if (zon) { RP.extra = .55 * (1 - tz / .5); zapLight.intensity += 40 * (1 - tz / .5); zapLight.position.copy(head); shake = .014 * (1 - tz / .5); }
        spikes.forEach((s, i) => { s.visible = zon; if (!zon) return; const a = (i / spikes.length) * 6.283; const k = 1 - tz / .5 * .3; s.position.set(head.x + Math.cos(a) * .12, head.y + .27, head.z + Math.sin(a) * .12); s.scale.set(.035, .3 * k, .035); s.rotation.set(Math.sin(a) * .5, 0, -Math.cos(a) * .5); });
        setSparks(zon, head, tz, Math.round(lastZ * 10));
        labelAt(lbZap, zon && tz < .45, V3(head.x - .3, head.y + .9 + tz * .8, head.z + .2), 1.0, Math.min(1.1, tz * 9));
        labelAt(lbBetter, lt > 1.95 && lt < 3.1, V3(0, 3.1, 3.9), 2.5, Math.min(1.1, (lt - 1.95) * 6));
        counter = ['ZAPS', String(zapN)]; hot = zapN > 0; note = zapN ? 'every time you roll over' : 'bug zapper: installed';
        an = { head };
        rig(lt, [[0, [-3.8, 3.4, 7.2], [-3.4, 3.1, 6.8], [0, 1.7, 4.2], [0, 1.7, 4.2], 56, 54], [1.4, [-4.4, 2.8, 5.6], [-4.0, 2.7, 5.9], [.45, 1.6, 3.9], [.45, 1.5, 4.0], 50, 46], [3.0, [-3.2, 2.8, 6.4], [-2.6, 2.6, 6.0], [0.3, 1.5, 3.9], [.3, 1.5, 3.9], 52, 48]], an, t, shake);
      } else {
        // bigger zapper + the swarm
        const zz = V3(ZP.x, ZP.y, ZP.z); zapS.visible = true; zapS.position.set(zz.x, zz.y, zz.z); zapS.userData.glow.emissiveIntensity = 2.2;
        const drop = clamp((lt - .1) / .55); const by = Math.max(0, 5.0 * (1 - drop) * (1 - drop)) + (drop >= 1 && lt < 1.2 ? Math.abs(Math.sin((lt - .65) * 12)) * .2 * Math.exp(-(lt - .65) * 4) : 0);
        bigZ.visible = lt > .1; bigZ.position.set(BZP.x, by, BZP.z); bigZ.userData.blu.emissiveIntensity = 2.2 + .9 * Math.sin(t * 30); bigLight.intensity = lt > .7 ? 22 + 6 * Math.sin(t * 30) : 0; bigLight.position.set(BZP.x - 1.6, 2.0, BZP.z);
        if (lt > .65 && lt < .85) shake = .02;
        // you sit up, shocked
        RP.anim = 'sit'; faceShock = lt > 1.0; RP.arms = lt > 1.0 ? { lx: -2.9, lz: -.3, rx: -2.9, rz: .3 } : null; RP.extra = lt > 3.2 ? .12 : 0;
        // hero flies to the window, waves in, friends stream through
        const hp0 = (tt) => V3(lerp(1.2, 3.4, smooth(clamp((tt - 1.0) / .9))) + Math.sin(tt * 8) * .1, lerp(2.6, 2.3, smooth(clamp((tt - 1.0) / .9))) + Math.sin(tt * 6) * .1, lerp(5.6, 7.8, smooth(clamp((tt - 1.0) / .9))));
        const heroPos = lt < 2.0 ? hp0(lt) : V3(3.55 + Math.sin(t * 5) * .05, 2.25 + Math.sin(t * 3) * .06, 7.7); poseM(heroR, heroPos, lt < 2.0 ? V3().subVectors(hp0(lt + .05), hp0(lt)) : V3(.3, .1, 1), 1.0, { flap: 1, wave: lt >= 2.0 ? 1 : 0 }, t); heroR.visible = true;
        drawTrail(lt < 2.0, hp0, lt, 1.5, .04);
        const cnt = Math.min(100, 1 + swVis); counter = ['MOSQUITOES', String(cnt)]; hot = true; note = cnt >= 100 ? 'it is a hundred' : lt < 2 ? 'zapper: bigger' : 'he invited his friends';
        labelAt(lbBetter, false, V3(), 1);
        rig(lt, [[0, [-4.6, 3.2, 3.4], [-4.2, 2.9, 3.6], [2.0, 1.7, 5.8], [2.0, 1.9, 5.5], 60, 56], [1.5, [-.2, 2.3, 5.9], [.3, 2.4, 6.1], [3.5, 2.3, 8.0], [3.6, 2.3, 8.0], 56, 52], [3.3, [-4.7, 3.5, 2.9], [-3.9, 3.8, 3.4], [1.6, 2.5, 5.4], [1.4, 2.6, 5.4], 72, 78]], an, t, shake);
      }
    } else {
      // ---------------- antarctica (person + parka live in world space at x=OX)
      peng.visible = true; flakes.visible = true;
      const U = RP; place(U, OX, 0, 3, 0, 'idle', .5); U.h = 1; U.vis = true; U.extra = .1; U.arms = { lx: -.9, lz: -.25, rx: -.9, rz: .25 }; U.pitch = .08;
      parka.visible = true; signG.visible = true;
      const fp = new THREE.Object3D(); for (let i = 0; i < 160; i++) { const ph = (t * (.5 + cr(i, 50) * .5) + cr(i, 51) * 10) % 1; fp.position.set(OX + (cr(i, 52) - .5) * 14 + Math.sin(t * .8 + i) * .3, 6 - ph * 6.2, 1 + (cr(i, 53) - .5) * 8); fp.scale.setScalar(.03 + cr(i, 54) * .03); fp.updateMatrix(); flakes.setMatrixAt(i, fp.matrix); } flakes.instanceMatrix.needsUpdate = true;
      const pu = (t * .06) % 1;
      if (bi === 4) { if (lt > 2.15 && lt < 3.2) U.arms = { lx: -.9, lz: -.25, rx: -2.9, rz: .3 }; if (lt > 3.2) { U.pitch = .12; U.arms = { lx: -.1, lz: -.35, rx: -.1, rz: .35 }; }
        peng.position.set(lerp(-7, 5, pu), 0, 1.3); peng.rotation.y = Math.PI / 2; }
      else { peng.position.set(-3.2, 0, 1.1); peng.rotation.y = .5; }
      peng.rotation.z = Math.sin(t * 9) * .16; peng.position.y = Math.abs(Math.sin(t * 9)) * .04; peng.userData.fl.forEach((f, i) => { f.rotation.z = (i ? 1 : -1) * (.3 + .35 * Math.sin(t * 9)); });
      rcrowd.setFace('calm'); rcrowd.update(t); parkaAttach(U);
      const pk = pocketTop(U); const pkc = pk.clone(); an = { pk };
      if (bi === 4) {
        const peek = smooth((lt - 3.6) / .45);
        const mp = pk.clone().add(V3(.0, -.08 + .24 * peek, -.03)); poseM(heroA, mp, V3(.0, 1, .15), 1.25, { flap: 0, fold: true, sit: true, wave: peek > .9 ? 1 : 0, wave2: peek > .9 && lt > 4.6 }, t); heroA.visible = peek > .001;
        counter = ['MILES FROM MOSQUITOES', Math.min(9000, Math.floor(lt / 3.2 * 9000)).toLocaleString('en-US')]; hot = true; note = lt > 3.8 ? 'mosquitoes in jacket: 1' : 'Antarctica';
        labelAt(lbBetter, lt > 2.2 && lt < 3.3, V3(OX + .1, 2.95, 3.4), 1.8, Math.min(1.1, (lt - 2.2) * 6));
        rig(lt, [[0, [3.6, 2.4, 9.6], [2.9, 2.1, 8.6], [-.4, 1.4, 2.2], [-.3, 1.4, 2.6], 58, 54], [2.0, [-1.9, 1.9, 7.2], [-1.2, 1.8, 6.4], [0, 1.4, 3.0], [0, 1.35, 3.0], 44, 40], [3.1, [.7, 1.8, 6.4], [.5, 1.6, 5.3], (a) => [a.pk.x - OX, a.pk.y + .12, a.pk.z], (a) => [a.pk.x - OX, a.pk.y + .12, a.pk.z], 36, 26]], an, t);
      } else {
        parka.visible = true; const g = heroA.userData.parka; g.visible = true;
        const up = smooth(lt / 1.0); const hover = V3(OX - 6 + .05 + .04 * Math.sin(t * 3), 2.0 + .05 * Math.sin(t * 4.1), 6.2); const pos = V3().lerpVectors(pk.clone().add(V3(0, .1, -.02)), hover, up); pos.y += Math.sin(up * Math.PI) * .25;
        const sc = lerp(.95, 1.3, up);
        heroA.visible = true; poseM(heroA, pos, V3(.55, .75, .35).normalize(), sc, { flap: 1, wave: up >= 1 ? 1 : 0, wave2: up >= 1 }, t);
        const bz = (i) => { const l = ((lt * 1.2 + i / 3) % 1); return l; };
        bzz.forEach((s, i) => { const l = bz(i); const ang = i * 2.1 + .4; labelAt(s, true, V3(hover.x + Math.cos(ang) * 1.0 * (.4 + up * .8), hover.y + .3 + Math.sin(ang) * .5 + l * .3, hover.z + .6), .6 * up + .001, 1); s.material.opacity = Math.sin(l * Math.PI); s.material.rotation = Math.sin(t * 20 + i) * .08; });
        counter = ['TINY JACKETS', String(lt > 1.3 ? 1 : 0)]; hot = true; note = lt > 1.3 ? 'it brought one' : 'one tiny buzz';
        labelAt(lbBetter, false, V3(), 1);
        rig(lt, [[0, [.7, 1.8, 6.4], [.5, 1.75, 6.0], (a) => [a.pk.x - OX, a.pk.y + .05, a.pk.z], (a) => [a.pk.x - OX + .1, a.pk.y + .3, a.pk.z], 34, 36], [.75, [-5.85, 2.1, 10.2], [-5.88, 2.05, 9.6], [-5.95, 2.0, 6.2], [-5.95, 2.0, 6.2], 34, 31]], an, t);
      }
    }
    if (inRoom) { bed.blanket.userData.update(t, 0, 0, .09 * (Math.sin(t * 2.0) * .5 + .5)); rcrowd.setFace(faceShock ? 'shock' : 'calm'); rcrowd.update(t); }
    A.follow(0, 0);
    A.render();
    hud.style('C'); hud.layout('B'); hud.question('', 0);
    hud.counter(counter[0], counter[1], note, '', hot); hud.tm(''); hud.pop('', 0);
  } };
}
