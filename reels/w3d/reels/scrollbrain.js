import { bedroom2 } from './_bed.js';
// What if every time you scrolled, you lost one IQ point? Guy in bed with a glowing phone; head shrinks, brainrot words orbit, he becomes a houseplant.
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, mat, Particles, R, clamp, smooth, lerp, attach } = lib; const fmt = (v) => Math.round(v).toLocaleString('en-US');
  const A = makeStage({ fog: 0x1a1d2c, fogNear: 14, fogFar: 44, clouds: false, skyTop: 0x1a1d2c, skyMid: 0x1a1d2c, skyBot: 0x1a1d2c, shadowExtent: 12, hemi: .8, sunI: .9, sunDir: [-.5, .8, .6], exposure: 1.25 }); const bd = bedroom2(lib, A, A.scene); bd.lamp.intensity = 1.2;
  const S = A.scene; const P = bd.person; bd.person.shirt.set(0x6e7fd0);
  // phone with an animated scrolling screen
  const cv = document.createElement('canvas'); cv.width = 128; cv.height = 512; const g = cv.getContext('2d'); const rr = R(2); for (let i = 0; i < 18; i++) { g.fillStyle = `hsl(${rr() * 360},70%,${45 + rr() * 20}%)`; g.fillRect(6, i * 28 + 4, 116, 22); g.fillStyle = 'rgba(255,255,255,.7)'; g.fillRect(14, i * 28 + 10, 50 + rr() * 40, 5); } const stex = new THREE.CanvasTexture(cv); stex.wrapT = THREE.RepeatWrapping; stex.repeat.set(1, .5); stex.colorSpace = THREE.SRGBColorSpace;
  const phone = new THREE.Group(); { const body = new THREE.Mesh(new THREE.BoxGeometry(.16, .3, .035), mat(0x15161a, { roughness: .2 })); const scr = new THREE.Mesh(new THREE.BoxGeometry(.14, .27, .005), new THREE.MeshBasicMaterial({ map: stex })); scr.position.z = .02; phone.add(body, scr); } phone.scale.setScalar(1.7); S.add(phone); const glow = new THREE.PointLight(0x7fb0ff, 3, 6); S.add(glow);
  // brainrot words orbiting
  const WORDS = ['NO CAP', 'SIGMA', 'OHIO', 'RIZZ', 'SKIBIDI', 'BRO', 'FR FR', 'SIX SEVEN', 'MEWING', 'NPC', 'CRASHOUT', 'AURA']; const spr = WORDS.map((w, i) => { const c = document.createElement('canvas'); c.width = 256; c.height = 96; const x = c.getContext('2d'); x.fillStyle = ['#ff3fa4', '#2de2a6', '#ffd23f', '#3fb8ff', '#9b5cff'][i % 5]; x.fillRect(0, 0, 256, 96); x.fillStyle = '#111'; x.font = '900 52px Liberation Sans, Arial'; x.textAlign = 'center'; x.fillText(w, 128, 66); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true })); s.scale.set(.62, .23, 1); s.visible = false; S.add(s); return s; });
  // houseplant leaves on the head
  const leaves = []; for (let i = 0; i < 6; i++) { const l = new THREE.Mesh(new THREE.ConeGeometry(.12, .5, 6), mat(0x3aa84a)); l.castShadow = true; l.visible = false; S.add(l); leaves.push(l); }
  const SC = [0, 0, 30, 50, 80, 110, 120, 120], NOTE = ['', 'smart. mom tells everyone', 'no cap, in an email', 'teacher is 54, sir', 'six seven at a funeral', 'now a houseplant', 'skibidi', 'touch grass'];
  const POP = ['', 'IQ 120', 'NO CAP. IN AN EMAIL.', 'SHE IS 54, SIR', 'SIX SEVEN??', 'A VERY ONLINE PLANT', 'SKIBIDI', 'TOUCH GRASS'];
  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 7); const s = lerp(SC[Math.max(0, bi - 1)], SC[bi], smooth(p)); const iq = Math.max(0, Math.round(120 - s)); const hs = lerp(1, .5, clamp(s / 120));
    P.anim = 'sit'; P.x = 0; P.z = 3.5; P.y = .06; P.yaw = 0; P.hs = hs; P.extra = 0; P.vis = true; P.arms = { lx: -.35, lz: -.12, rx: -1.85, rz: .05 };
    bd.crowd.setFace(bi >= 3 ? 'shock' : 'calm'); bd.crowd.update(t); bd.blanket.userData.update(t, .02, 0, 0);
    attach(phone, P, 'handR', [0, .04, .1], [1.85, Math.PI, 0]); phone.visible = true; const pp = new THREE.Vector3().setFromMatrixPosition(phone.matrix); glow.position.copy(pp).add(new THREE.Vector3(0, 0, -.3)); glow.intensity = 3 + Math.sin(t * 9) * .4; stex.offset.y = (t * (.3 + s / 60)) % 1;
    const hd = new THREE.Vector3().setFromMatrixPosition(P.M.head);
    const nv = bi < 2 ? 0 : Math.min(12, Math.floor(s / 10) + 1); for (let i = 0; i < 12; i++) { const sp = spr[i]; sp.visible = i < nv; const a = t * .9 + i * 0.5236, rad = 1.1 + (i % 3) * .3; sp.position.set(hd.x + Math.cos(a) * rad * .8, hd.y + .55 + Math.sin(a * 1.3 + i) * .25 + (i % 4) * .15, hd.z - Math.abs(Math.sin(a)) * rad * .6); }
    for (let i = 0; i < 6; i++) { const l = leaves[i]; l.visible = bi >= 5; const a = i / 6 * 6.28; l.position.set(hd.x + Math.cos(a) * .12 * hs, hd.y + .36 * hs + .15, hd.z + Math.sin(a) * .12 * hs); l.rotation.set(Math.sin(a) * .5 + Math.sin(t * 2 + i) * .1, 0, -Math.cos(a) * .5); l.scale.setScalar(1.2); }
    const cams = [[4.8, 2.1, 6.6, .3, 1.6, 4.0, 52], [4.6, 2.0, 6.3, .2, 1.6, 4.0, 50], [3.6, 2.2, 5.4, .2, 1.7, 3.8, 48], [4.4, 2.4, 5.6, .1, 1.9, 3.8, 46], [.6, 2.4, 5.9, 0, 2.15, 3.5, 36], [3.2, 2.5, 6.4, .1, 2.0, 3.6, 46], [.6, 2.4, 5.9, 0, 2.1, 3.5, 34], [4.8, 2.6, 7.0, .3, 1.7, 4.0, 54]];
    A.cam(...cams[bi]); A.follow(0, 4); A.render();
    hud.style('C'); hud.question('What if every scroll cost you one *IQ* point?', 1, bi > 0);
    if (bi === 0 && lt < 1.0) hud.counter('', '', ''); else hud.counter('IQ · Scroll ' + Math.round(s), String(iq), NOTE[bi], '−1 per scroll', iq < 50); hud.tm('');
    hud.pop(POP[bi] && lt > .5 ? POP[bi] : '', Math.min(1, (lt - .5) * 6));
  } };
}
