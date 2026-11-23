// Character sheet for the Roblox-avatar style hero (R6 proportions) with a face-decal expression set. Not a reel: a design preview.
export default async function build({ lib, tl, hud }) {
  const { THREE, RoundedBoxGeometry, makeStage, mat, clamp } = lib;
  const st = makeStage({ shadowExtent: 30, fogNear: 200, fogFar: 600, clouds: false, sunDir: [-.4, .8, .6], sunI: 2.4, hemi: 1.3, exposure: 1.05 });
  const S = st.scene; document.body.style.background = '#8fb8e8';
  // backdrop: soft pastel gradient wall + floor
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(80, 60), new THREE.MeshBasicMaterial({ color: 0xcfe4f7 })); wall.position.set(0, 10, -6); S.add(wall);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 40), mat(0x9fcb7a, { roughness: 1 })); floor.rotation.x = -Math.PI / 2; floor.position.y = -.01; floor.receiveShadow = true; S.add(floor);
  const cv = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); f(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
  const INK = '#15181d', MOUTH = '#c8242b', TONGUE = '#f08a8a';
  // face decals: tiny dot eyes (or ^^ squints), big open 'D' mouth, thin brows
  const arc = (g, x, y, r, w = 9) => { g.strokeStyle = INK; g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); g.arc(x, y + r * .7, r, Math.PI * 1.12, Math.PI * 1.88); g.stroke(); };
  const dot = (g, x, y, r = 12) => { g.fillStyle = INK; g.beginPath(); g.ellipse(x, y, r, r * 1.25, 0, 0, 7); g.fill(); };
  const brow = (g, x, y, rot, w = 34) => { g.strokeStyle = INK; g.lineWidth = 6; g.lineCap = 'round'; g.save(); g.translate(x, y); g.rotate(rot); g.beginPath(); g.moveTo(-w / 2, 0); g.lineTo(w / 2, 0); g.stroke(); g.restore(); };
  const dmouth = (g, cx, cy, w, h) => { g.fillStyle = MOUTH; g.beginPath(); g.moveTo(cx - w / 2, cy - h * .35); g.lineTo(cx + w / 2, cy - h * .35); g.quadraticCurveTo(cx + w / 2, cy + h * .75, cx, cy + h * .75); g.quadraticCurveTo(cx - w / 2, cy + h * .75, cx - w / 2, cy - h * .35); g.fill(); g.fillStyle = TONGUE; g.beginPath(); g.ellipse(cx, cy + h * .45, w * .26, h * .2, 0, 0, 7); g.fill(); };
  const smile = (g, cx, cy, w, up = true) => { g.strokeStyle = INK; g.lineWidth = 8; g.lineCap = 'round'; g.beginPath(); g.moveTo(cx - w / 2, cy); g.quadraticCurveTo(cx, cy + (up ? 20 : -20), cx + w / 2, cy); g.stroke(); };
  const FACES = {
    'grin (laugh)': (g) => { arc(g, 78, 80, 20); arc(g, 178, 80, 20); dmouth(g, 128, 138, 96, 62); },
    'talk': (g) => { dot(g, 78, 86); dot(g, 178, 86); dmouth(g, 128, 142, 70, 44); },
    'neutral': (g) => { dot(g, 78, 86); dot(g, 178, 86); smile(g, 128, 142, 52); },
    'shock': (g) => { dot(g, 78, 82, 13); dot(g, 178, 82, 13); brow(g, 78, 50, -.15, 40); brow(g, 178, 50, .15, 40); g.fillStyle = MOUTH; g.beginPath(); g.ellipse(128, 150, 20, 26, 0, 0, 7); g.fill(); },
    'wink': (g) => { dot(g, 78, 86); arc(g, 178, 84, 20); smile(g, 128, 140, 64); brow(g, 78, 56, -.1); },
    'deadpan': (g) => { dot(g, 78, 88, 7); dot(g, 178, 88, 7); brow(g, 78, 66, 0, 40); brow(g, 178, 66, 0, 40); g.strokeStyle = INK; g.lineWidth = 8; g.lineCap = 'round'; g.beginPath(); g.moveTo(100, 150); g.lineTo(156, 150); g.stroke(); },
    'sad': (g) => { dot(g, 78, 90); dot(g, 178, 90); brow(g, 78, 62, -.4, 36); brow(g, 178, 62, .4, 36); smile(g, 128, 156, 52, false); g.fillStyle = '#7fc8ff'; g.beginPath(); g.ellipse(210, 120, 7, 11, 0, 0, 7); g.fill(); },
    'smug': (g) => { dot(g, 78, 92, 8); dot(g, 178, 92, 8); g.fillStyle = 'rgba(224,168,130,.9)'; g.fillRect(52, 70, 52, 12); g.fillRect(152, 70, 52, 12); brow(g, 178, 56, .3); g.strokeStyle = INK; g.lineWidth = 8; g.lineCap = 'round'; g.beginPath(); g.moveTo(96, 150); g.quadraticCurveTo(150, 160, 170, 136); g.stroke(); },
  };
  const rb = (w, h, d, c, r = .12, o = {}) => { const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 4, r), mat(c, Object.assign({ roughness: .55 }, o))); m.castShadow = true; m.receiveShadow = true; return m; };
  const HOODIE = 0x3fa05a, SKIN = 0xf2b98a, PANTS = 0x394a6b, BEANIE = 0xf08a24;
  const mkHero = (faceKey) => {
    const g = new THREE.Group();
    const legL = rb(.9, 1.9, .9, PANTS, .1); legL.position.set(-.5, .95, 0); g.add(legL);
    const legR = rb(.9, 1.9, .9, PANTS, .1); legR.position.set(.5, .95, 0); g.add(legR);
    const torso = rb(2.0, 2.0, 1.0, HOODIE, .16); torso.position.y = 2.9; g.add(torso);
    const armL = rb(.9, 2.0, .9, HOODIE, .14); armL.position.set(-1.45, 2.9, 0); armL.rotation.z = .08; g.add(armL);
    const armR = rb(.9, 2.0, .9, HOODIE, .14); armR.position.set(1.45, 2.9, 0); armR.rotation.z = -.08; g.add(armR);
    for (const s of [-1, 1]) { const h = rb(.9, .55, .9, SKIN, .14); h.position.set(s * 1.5, 1.72, 0); g.add(h); }
    // hoodie print + pocket + drawstrings
    const pr = cv(256, 256, (c) => { c.fillStyle = '#ffe14a'; c.font = '900 64px Liberation Sans, Arial'; c.textAlign = 'center'; c.fillText('ON', 128, 126); c.fillText('TIME', 128, 190); c.fillStyle = 'rgba(255,255,255,.9)'; for (let i = 0; i < 9; i++) c.fillRect(24 + ((i * 53) % 210), 190 + ((i * 29) % 50), 7, 7); });
    const print = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.6), new THREE.MeshBasicMaterial({ map: pr, transparent: true })); print.position.set(0, 2.85, .52); g.add(print);
    const pocket = rb(1.2, .4, .06, 0x358f4e, .03); pocket.position.set(0, 2.25, .53); g.add(pocket);
    for (const s of [-1, 1]) { const dr = rb(.07, .5, .05, 0xffffff, .02); dr.position.set(s * .3, 3.5, .53); g.add(dr); }
    const neck = rb(.7, .3, .7, SKIN, .08); neck.position.y = 4.05; g.add(neck);
    // head: slightly tall rounded box, wide; face decal in front
    const head = rb(2.7, 2.5, 2.3, SKIN, 1.0); head.position.y = 5.35; g.add(head);
    const ft = cv(256, 192, (c) => FACES[faceKey](c));
    const face = new THREE.Mesh(new THREE.PlaneGeometry(2.25, 1.69), new THREE.MeshBasicMaterial({ map: ft, transparent: true })); face.position.set(0, 5.25, 1.18); g.add(face);
    // beanie with folded cuff and patch
    const beanie = rb(2.85, 1.35, 2.5, BEANIE, .6); beanie.position.set(0, 6.55, -.02); g.add(beanie);
    const cuff = rb(2.92, .55, 2.58, 0xd8741a, .22); cuff.position.set(0, 6.1, -.02); g.add(cuff);
    const patch = new THREE.Mesh(new THREE.CircleGeometry(.32, 24), new THREE.MeshBasicMaterial({ map: cv(64, 64, (c) => { c.fillStyle = '#fff6df'; c.beginPath(); c.arc(32, 32, 30, 0, 7); c.fill(); c.strokeStyle = '#333'; c.lineWidth = 5; c.beginPath(); c.arc(32, 32, 24, 0, 7); c.stroke(); c.beginPath(); c.moveTo(32, 32); c.lineTo(32, 16); c.moveTo(32, 32); c.lineTo(44, 36); c.stroke(); }) })); patch.position.set(0, 6.1, 1.32); g.add(patch);
    return g;
  };
  const keys = Object.keys(FACES); const heroes = keys.map((k, i) => { const h = mkHero(k); const col = i % 2, row = Math.floor(i / 2); h.position.set((col - .5) * 7.2, 0, 0); h.position.y = (3 - row) * 9.2; S.add(h); return h; });
  const cams = []; // static design preview
  return { frame({ t, hud }) {
    try { globalThis.__post.pm.uniforms.amt.value = 0; } catch (e) {}
    if (t >= 10) { const i = Math.floor(t - 10) % 8, h = heroes[i]; st.cam(h.position.x + .4, h.position.y + 5.3, 11.5, h.position.x, h.position.y + 4.6, 0, 34); }
    else st.cam(0, 17.5, 62, 0, 17.5, 0, 40);
    heroes.forEach((h, i) => { h.rotation.y = Math.sin(t * .8 + i) * .12;  });
    st.render(); if (hud) { hud.style && hud.style('C'); hud.question('', 0); hud.counter('', '', ''); hud.pop('', 0); hud.caption('', 0); }
  } };
}
