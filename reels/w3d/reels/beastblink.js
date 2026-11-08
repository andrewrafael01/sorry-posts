// DON'T BLINK: MrBeast-style competition. 100 blocky people stare in a giant arena; eyes get huge; kill feed; lone winner.
// One shared scene (single Crowd, instanced eyes). Non-explicit; all jokes are in the words.
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, Crowd, Particles, R, clamp, smooth, lerp } = lib;
  const N = 100, SP = 2.4;
  const BRENDA = 84, GARY = 85, KEVIN = 6, DEREK = 27, GREG = 63;
  const st = makeStage({ shadowExtent: 34, fogNear: 110, fogFar: 300, clouds: false, skyTop: 0x1a1f5e, skyMid: 0x6a3aa8, skyBot: 0xf08a6a, fog: 0x3c3170, sunColor: 0xfff0e0, sunDir: [-.3, .85, -.45], sunI: 3.1, hemi: 1.1, exposure: 1.12 });
  const S = st.scene;
  const gx = (i) => ((i % 10) - 4.5) * SP, gz = (i) => (Math.floor(i / 10) - 4.5) * SP;
  const mk = (geo, color, o = {}) => { const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial(Object.assign({ color, roughness: .6, metalness: 0 }, o))); m.castShadow = true; m.receiveShadow = true; return m; };
  const tex = (w, h, draw) => { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const g = cv.getContext('2d'); draw(g, w, h); const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
  const bigText = (g, txt, x, y, size, fill, stroke, lw) => { g.font = `900 ${size}px "Liberation Sans", Arial, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round'; g.lineWidth = lw; g.strokeStyle = stroke; g.strokeText(txt, x, y); g.fillStyle = fill; g.fillText(txt, x, y); };

  // ---------------------------------------------------------------- arena
  const FR = 46;
  const floorTex = tex(2048, 2048, (g, w, h) => {
    g.fillStyle = '#26356b'; g.fillRect(0, 0, w, h);
    const c = 64; for (let y = 0; y < h; y += c) for (let x = 0; x < w; x += c) if (((x + y) / c) % 2 === 0) { g.fillStyle = '#2d3e7c'; g.fillRect(x, y, c, c); }
    const px = (x) => (x / FR + 1) / 2 * w, pz = (z) => (z / FR + 1) / 2 * h, pr = (r) => r / FR / 2 * w;
    g.lineWidth = 16; g.strokeStyle = '#e8252b'; g.beginPath(); g.arc(w / 2, h / 2, pr(31), 0, 7); g.stroke(); g.strokeStyle = '#ffd92a'; g.lineWidth = 8; g.beginPath(); g.arc(w / 2, h / 2, pr(33), 0, 7); g.stroke();
    for (let i = 0; i < N; i++) { g.fillStyle = '#ffd92a'; g.beginPath(); g.arc(px(gx(i)), pz(gz(i)), pr(.62), 0, 7); g.fill(); g.fillStyle = '#26356b'; g.beginPath(); g.arc(px(gx(i)), pz(gz(i)), pr(.46), 0, 7); g.fill(); }
  });
  floorTex.wrapS = floorTex.wrapT = THREE.ClampToEdgeWrapping;
  const floor = new THREE.Mesh(new THREE.CircleGeometry(FR, 96), new THREE.MeshStandardMaterial({ map: floorTex, roughness: .55, metalness: .05 })); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; S.add(floor);
  const wallTex = tex(2048, 256, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#12123a'); gr.addColorStop(1, '#3a2a7a'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    const r = R(9); const cols = ['#e8423a', '#ffd23f', '#3bb0ff', '#6dff8a', '#ff6bd6', '#ffffff', '#ff9a3c'];
    for (let row = 0; row < 7; row++) for (let x = 0; x < w; x += 22) { const y = 40 + row * 30; g.fillStyle = cols[(r() * cols.length) | 0]; g.fillRect(x + 2, y + 8, 16, 14); g.fillStyle = ['#f1c9a4', '#c88d62', '#8a5a3a'][(r() * 3) | 0]; g.beginPath(); g.arc(x + 10, y + 3, 6, 0, 7); g.fill(); }
    g.fillStyle = '#ffd92a'; g.fillRect(0, 0, w, 14); g.fillStyle = '#e8252b'; g.fillRect(0, 14, w, 8);
  });
  wallTex.wrapS = THREE.RepeatWrapping; wallTex.repeat.set(2, 1);
  const wall = new THREE.Mesh(new THREE.CylinderGeometry(FR, FR, 24, 80, 1, true), new THREE.MeshBasicMaterial({ map: wallTex, side: THREE.BackSide, fog: false })); wall.position.y = 12; S.add(wall);
  const beams = []; const BC = [0xff4a4a, 0x4ab0ff, 0xffe04a, 0xff6bd6, 0x6dff8a, 0xffffff, 0xff9a3c, 0x8a6bff];
  for (let k = 0; k < 8; k++) { const m = new THREE.Mesh(new THREE.CylinderGeometry(.5, 5.5, 44, 24, 1, true), new THREE.MeshBasicMaterial({ color: BC[k], transparent: true, opacity: .045, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false })); S.add(m); beams.push(m); }
  // DON'T BLINK sign (hangs over the front of the arena)
  const signTex = tex(2048, 700, (g, w, h) => {
    g.fillStyle = '#e8252b'; g.fillRect(0, 0, w, h); g.fillStyle = '#ffd92a'; g.fillRect(0, 0, w, 36); g.fillRect(0, h - 36, w, 36);
    for (let x = 0; x < w; x += 128) { g.fillStyle = '#111'; g.fillRect(x, 0, 64, 36); g.fillRect(x + 64, h - 36, 64, 36); }
    const eye = (cx) => { g.fillStyle = '#fff'; g.strokeStyle = '#111'; g.lineWidth = 12; g.beginPath(); g.ellipse(cx, h / 2, 150, 190, 0, 0, 7); g.fill(); g.stroke(); g.fillStyle = '#2a6fd8'; g.beginPath(); g.arc(cx, h / 2, 82, 0, 7); g.fill(); g.fillStyle = '#000'; g.beginPath(); g.arc(cx, h / 2, 38, 0, 7); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(cx - 26, h / 2 - 30, 18, 0, 7); g.fill(); };
    eye(190); eye(w - 190); bigText(g, "DON'T", w / 2, 230, 250, '#ffd92a', '#111', 26); bigText(g, 'BLINK', w / 2, 470, 250, '#ffffff', '#111', 26);
  });
  const sMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: .7 }); const sFace = new THREE.MeshStandardMaterial({ map: signTex, roughness: .5, emissive: 0xffffff, emissiveMap: signTex, emissiveIntensity: .25 });
  const sign = new THREE.Mesh(new THREE.BoxGeometry(17, 5.9, .5), [sMat, sMat, sMat, sMat, sFace, sFace]); sign.position.set(0, 10.5, -15); sign.castShadow = true; S.add(sign);
  for (const sx of [-7, 7]) { const c = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, 10, 6), sMat); c.position.set(sx, 18.5, -15); S.add(c); }
  // LAST ONE WINS banner + podium + case
  const banTex = tex(2048, 640, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#16205a'); gr.addColorStop(1, '#0b1033'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.strokeStyle = '#ffd92a'; g.lineWidth = 22; g.strokeRect(14, 14, w - 28, h - 28);
    bigText(g, 'LAST ONE WINS', w / 2, 190, 230, '#ffffff', '#000', 22); bigText(g, '$100,000', w / 2, 465, 260, '#ffd92a', '#000', 28);
  });
  const banner = new THREE.Mesh(new THREE.BoxGeometry(32, 10, .6), [sMat, sMat, sMat, sMat, sMat, new THREE.MeshStandardMaterial({ map: banTex, roughness: .5, emissive: 0xffffff, emissiveMap: banTex, emissiveIntensity: .5 })]); banner.rotation.y = Math.PI; banner.position.set(0, 13, 29); S.add(banner);
  const PZ = 21;
  const podium = mk(new THREE.CylinderGeometry(3.3, 3.7, 2.4, 48), 0xd8362f, { roughness: .4 }); podium.position.set(0, 1.2, PZ); S.add(podium);
  const pbase = mk(new THREE.CylinderGeometry(4.6, 4.8, .5, 48), 0xf2c230, { metalness: .6, roughness: .3 }); pbase.position.set(0, .25, PZ); S.add(pbase);
  const prim = mk(new THREE.TorusGeometry(3.35, .16, 10, 64), 0xf2c230, { metalness: .7, roughness: .25 }); prim.rotation.x = Math.PI / 2; prim.position.set(0, 2.4, PZ); S.add(prim);
  const BCASE = (open, k) => {
    const grp = new THREE.Group(); const lea = new THREE.MeshStandardMaterial({ color: 0x2b1d14, roughness: .45 }); const gold = new THREE.MeshStandardMaterial({ color: 0xf2c230, metalness: .8, roughness: .25 });
    const base = new THREE.Mesh(new THREE.BoxGeometry(2.4, .55, 1.6), lea); base.position.y = .275; base.castShadow = true; grp.add(base);
    if (open) {
      const gm = new THREE.MeshStandardMaterial({ color: 0x3f9a4a, roughness: .7 }), bm = new THREE.MeshStandardMaterial({ color: 0xefe9c8, roughness: .8 });
      const st1 = new THREE.InstancedMesh(new THREE.BoxGeometry(.37, .5, .72), gm, 12), st2 = new THREE.InstancedMesh(new THREE.BoxGeometry(.38, .13, .735), bm, 12); const m4 = new THREE.Matrix4();
      for (let i = 0; i < 12; i++) { const c = i % 6, r = (i / 6) | 0; m4.makeTranslation((c - 2.5) * .385, .5 + (c % 2) * .02, (r - .5) * .76); st1.setMatrixAt(i, m4); m4.makeTranslation((c - 2.5) * .385, .52 + (c % 2) * .02, (r - .5) * .76); st2.setMatrixAt(i, m4); }
      st1.castShadow = st2.castShadow = true; grp.add(st1, st2);
    }
    const pivot = new THREE.Group(); pivot.position.set(0, .55, .8); grp.add(pivot);
    const lid = new THREE.Mesh(new THREE.BoxGeometry(2.4, .14, 1.6), lea); lid.position.set(0, .07, -.8); lid.castShadow = true; pivot.add(lid);
    const lin = new THREE.Mesh(new THREE.BoxGeometry(2.3, .02, 1.5), new THREE.MeshStandardMaterial({ color: 0x9a1020, roughness: .9 })); lin.position.set(0, -.005, -.8); pivot.add(lin);
    if (!open) { const lab = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.0), new THREE.MeshStandardMaterial({ map: tex(512, 340, (g, w, h) => { g.fillStyle = '#f2c230'; g.fillRect(0, 0, w, h); g.strokeStyle = '#000'; g.lineWidth = 14; g.strokeRect(10, 10, w - 20, h - 20); bigText(g, '$', w / 2, 120, 190, '#1b6b2a', '#000', 10); bigText(g, '100,000', w / 2, 260, 90, '#000', '#000', 2); }), roughness: .5 })); lab.rotation.x = -Math.PI / 2; lab.scale.x = -1; lab.material.side = THREE.DoubleSide; lab.position.set(0, .145, -.8); pivot.add(lab); }
    for (const sx of [-.7, .7]) { const cl = new THREE.Mesh(new THREE.BoxGeometry(.28, .2, .1), gold); cl.position.set(sx, .5, -.82); grp.add(cl); }
    const hnd = new THREE.Mesh(new THREE.TorusGeometry(.34, .05, 8, 20, Math.PI), gold); hnd.rotation.z = 0; hnd.position.set(0, .6, -.8); hnd.rotation.x = Math.PI / 2; hnd.visible = !open; if (!open) pivot.add(hnd);
    pivot.rotation.x = open ? 1.78 : 0; grp.scale.setScalar(k); return grp;
  };
  const caseOpen = BCASE(true, 1.4); caseOpen.position.set(0, 2.45, PZ); S.add(caseOpen);
  const caseHeld = BCASE(false, .52); caseHeld.matrixAutoUpdate = true; S.add(caseHeld); caseHeld.visible = false;
  const gl = new THREE.PointLight(0xffd070, 60, 18); gl.position.set(0, 5.2, PZ - 2.2); S.add(gl);
  const rainL = new THREE.PointLight(0xffd070, 0, 16); rainL.position.set(0, 5, -3); S.add(rainL);

  // ---------------------------------------------------------------- crowd + giant eyes
  const crowd = new Crowd(S, N, 21); const RED = new THREE.Color(0xe8423a);
  crowd.p.forEach((p, i) => { p.shirt.copy(RED); ['torso', 'armL', 'armR'].forEach((k) => crowd.parts[k].setColorAt(i, RED)); });
  { const pink = new THREE.Color(0xe040b0); crowd.p[BRENDA].hair.copy(pink); crowd.parts.hair.setColorAt(BRENDA, pink); crowd.parts.hair.instanceColor.needsUpdate = true; ['torso', 'armL', 'armR'].forEach((k) => (crowd.parts[k].instanceColor.needsUpdate = true)); }
  const sph = new THREE.SphereGeometry(1, 20, 14), cap = new THREE.SphereGeometry(1, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2);
  const mkI = (geo, o = {}) => { const m = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial(Object.assign({ color: 0xffffff, roughness: .2 }, o)), N * 2); m.frustumCulled = false; scene_add(m); return m; };
  const scene_add = (m) => S.add(m);
  const eS = mkI(sph, { roughness: .12 }), eI = mkI(sph, { roughness: .35 }), eP = mkI(sph, { color: 0x0a0a0a, roughness: .2 }), eH = mkI(sph, { color: 0xffffff, emissive: 0xffffff, emissiveIntensity: .9, roughness: .1 }), eL = mkI(cap, { roughness: .8 });
  const IRIS = [0x3b78c8, 0x3a9a5b, 0x7a4a2a, 0x59b5d6]; const cc = new THREE.Color(), cs = new THREE.Color();
  for (let i = 0; i < N; i++) for (let s = 0; s < 2; s++) { cc.setHex(IRIS[i % 4]); eI.setColorAt(i * 2 + s, cc); cc.copy(crowd.p[i].skin).multiplyScalar(.93); eL.setColorAt(i * 2 + s, cc); eS.setColorAt(i * 2 + s, cs.set(0xffffff)); }
  const eyeCol = [0, .15, .4, .55, .75, .5];
  const A = new THREE.Matrix4(), B = new THREE.Matrix4(), Mx = new THREE.Matrix4(), Tm = new THREE.Matrix4(), Sm = new THREE.Matrix4(), Z = new THREE.Matrix4().makeScale(0, 0, 0);
  const eyeP = (e) => { const Rr = .1 * e; return { R: Rr, x: .11 * (1 + .8 * (e - 1)), y: .04, z: .2 + (Rr - .1) * .4 }; };
  const setM = (im, idx, base, ox, oy, oz, sx, sy, sz, rx = 0) => { Tm.makeTranslation(ox, oy, oz); Mx.copy(base).multiply(Tm); if (rx) { B.makeRotationX(rx); Mx.multiply(B); } Sm.makeScale(sx, sy, sz); Mx.multiply(Sm); im.setMatrixAt(idx, Mx); };
  function eyes(i, e, closed, pup, red) {
    const o = crowd.p[i], P = eyeP(e);
    for (let s = 0; s < 2; s++) { const idx = i * 2 + s;
      if (!o.vis) { for (const im of [eS, eI, eP, eH, eL]) im.setMatrixAt(idx, Z); continue; }
      const sx = s ? 1 : -1, base = o.M.head, Rr = P.R, ox = sx * P.x, ang = -Math.PI / 2 + Math.PI * clamp(closed) * 1.02;
      setM(eS, idx, base, ox, P.y, P.z, Rr, Rr, Rr * .95); setM(eI, idx, base, ox, P.y, P.z + Rr * .93, Rr * .62, Rr * .62, Rr * .24);
      setM(eP, idx, base, ox, P.y, P.z + Rr * 1.0, Rr * .62 * pup, Rr * .62 * pup, Rr * .3); setM(eH, idx, base, ox + sx * 0 + Rr * .2, P.y + Rr * .24, P.z + Rr * .98, Rr * .13, Rr * .13, Rr * .1);
      setM(eL, idx, base, ox, P.y, P.z, Rr * 1.09, Rr * 1.09, Rr * 1.09, ang);
      cs.setRGB(1, 1 - .45 * red, 1 - .5 * red); eS.setColorAt(idx, cs); }
  }
  // tears
  const tearsA = new Particles(S, N * 4, 0x3a9cff, .028, { rough: .05, emissive: 0x1060d0 }), tearsH = new Particles(S, 160, 0x3a9cff, .045, { rough: .05, emissive: 0x1060d0 });
  const VV = new THREE.Vector3();
  function tearsFor(pool, base, i, e, per, t, size, spd, vis) {
    const o = crowd.p[i], P = eyeP(e);
    for (let s = 0; s < 2; s++) for (let k = 0; k < per; k++) { const slot = base + (s * per + k);
      if (!vis || !o.vis) { pool.set(slot, 0, 0, 0, 0); continue; }
      const u = (t * spd + i * .137 + k / per + s * .31) % 1, sx = s ? 1 : -1; const sz = size * Math.min(1, u / .12) * (1 - .55 * u * u * u);
      VV.set(sx * P.x * (1 + u * .1), P.y - P.R * .8 - u * .6, P.z + P.R * .45 + .03).applyMatrix4(o.M.head); pool.set(slot, VV.x, VV.y, VV.z, sz); }
  }
  // poofs
  const poof = new Particles(S, N * 6, 0xffffff, .3, { rough: 1, emissive: 0x303030 }), sparks = new Particles(S, N * 4, 0xffd23f, .08, { rough: .5, emissive: 0xffb000 });
  // wind: fan + streaks
  const fan = new THREE.Group(); fan.position.set(0, 4.6, -22); S.add(fan);
  const steel = new THREE.MeshStandardMaterial({ color: 0x9aa3ad, metalness: .7, roughness: .35 }), yel = new THREE.MeshStandardMaterial({ color: 0xf2c230, roughness: .5, metalness: .2 });
  for (const z of [-.7, .7]) { const r = new THREE.Mesh(new THREE.TorusGeometry(4.7, .14, 8, 56), steel); r.position.z = z; r.castShadow = true; fan.add(r); }
  for (const rad of [1.6, 3.1]) { const r = new THREE.Mesh(new THREE.TorusGeometry(rad, .06, 6, 40), steel); r.position.z = .7; fan.add(r); }
  for (let k = 0; k < 10; k++) { const sp = new THREE.Mesh(new THREE.BoxGeometry(.07, 4.7, .07), steel); sp.geometry.translate(0, 2.35, 0); sp.rotation.z = k * Math.PI / 5; sp.position.z = .7; fan.add(sp); }
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(.95, 1.1, 1.7, 24), yel); hub.rotation.x = Math.PI / 2; hub.castShadow = true; fan.add(hub);
  const blades = new THREE.Group(); blades.position.z = .35; fan.add(blades);
  for (let k = 0; k < 5; k++) { const b = new THREE.Mesh(new THREE.BoxGeometry(1.15, 4.1, .1), yel); b.geometry.translate(0, 2.55, 0); b.rotation.z = k * Math.PI * 2 / 5; b.rotation.y = .35; b.castShadow = true; blades.add(b); }
  for (const sx of [-2.6, 2.6]) { const leg = new THREE.Mesh(new THREE.BoxGeometry(.5, 5.6, .5), steel); leg.position.set(sx, -2.3, 0); leg.rotation.z = -Math.sign(sx) * .28; leg.castShadow = true; fan.add(leg); const ft = new THREE.Mesh(new THREE.BoxGeometry(1.2, .3, 3.0), steel); ft.position.set(sx * 1.55, -4.55, 0); fan.add(ft); }
  const wl = tex(512, 160, (g, w, h) => { g.fillStyle = '#e8252b'; g.fillRect(0, 0, w, h); bigText(g, 'WIND', w / 2, 52, 84, '#fff', '#000', 8); bigText(g, 'MACHINE', w / 2, 120, 62, '#ffd92a', '#000', 7); });
  const wlab = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 1.0), new THREE.MeshBasicMaterial({ map: wl })); wlab.position.set(0, -3.4, .55); wlab.rotation.y = 0; fan.add(wlab);
  const streak = new THREE.InstancedMesh(new THREE.BoxGeometry(.03, .03, 2.2), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .55, depthWrite: false }), 180); streak.frustumCulled = false; S.add(streak);
  const money = new THREE.InstancedMesh(new THREE.BoxGeometry(.5, .012, .26), new THREE.MeshStandardMaterial({ color: 0x4fbf5a, roughness: .7 }), 160); money.frustumCulled = false; money.castShadow = false; S.add(money);
  const plate = new THREE.Group(); { const pw = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .2 }); const d1 = new THREE.Mesh(new THREE.CylinderGeometry(1, .8, .09, 40), pw); const d2 = new THREE.Mesh(new THREE.TorusGeometry(.62, .035, 8, 40), new THREE.MeshStandardMaterial({ color: 0x3b78c8, roughness: .3 })); d2.rotation.x = Math.PI / 2; d2.position.y = .05; plate.add(d1, d2); plate.rotation.x = Math.PI / 2; plate.visible = false; S.add(plate); }
  // fly
  const fly = new THREE.Group(); fly.matrixAutoUpdate = false; S.add(fly); const flyWings = [];
  { const dark = new THREE.MeshStandardMaterial({ color: 0x15171a, roughness: .25, metalness: .4 }), redm = new THREE.MeshStandardMaterial({ color: 0xc01818, roughness: .3 }), wm = new THREE.MeshStandardMaterial({ color: 0xcfe8ff, transparent: true, opacity: .5, roughness: .1, side: THREE.DoubleSide });
    const add = (g, m, x, y, z, sx, sy, sz) => { const me = new THREE.Mesh(g, m); me.position.set(x, y, z); me.scale.set(sx, sy, sz); me.castShadow = true; fly.add(me); return me; };
    add(sph, dark, 0, 0, .12, .3, .5, .28); add(sph, new THREE.MeshStandardMaterial({ color: 0x24262b, roughness: .3, metalness: .3 }), 0, -.62, .1, .32, .52, .27); add(sph, dark, 0, .55, .12, .22, .2, .2);
    add(sph, redm, -.17, .64, .2, .14, .16, .13); add(sph, redm, .17, .64, .2, .14, .16, .13);
    for (const sx of [-1, 1]) { const w = add(sph, wm, sx * .42, -.05, .34, .5, .17, .02); w.rotation.z = sx * .5; w.userData.sx = sx; flyWings.push(w); }
    for (let k = 0; k < 6; k++) { const sx = k % 2 ? 1 : -1, y = -.2 + ((k / 2) | 0) * .32; const l = add(new THREE.CylinderGeometry(.025, .02, .6, 5), dark, sx * .3, y, .0, 1, 1, 1); l.rotation.z = sx * 1.1; l.rotation.x = .2 * (((k / 2) | 0) - 1); } }
  // tags
  const tag = (txt, col) => { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex(512, 160, (g, w, h) => { bigText(g, txt, w / 2, h / 2, 110, col, '#000', 18); }), transparent: true })); sp.scale.set(1.9, .6, 1); sp.visible = false; S.add(sp); return sp; };
  const tagK = tag('KEVIN', '#ffd92a'), tagB = tag('BRENDA', '#ff7ad6'), tagG = tag('GARY', '#7ad2ff');

  // ---------------------------------------------------------------- schedule
  const NB = tl.beats.length; const bs = (b, lt) => tl.beats[b].start + lt;
  const rng = R(653); const dT = new Array(N).fill(1e9);
  dT[DEREK] = bs(2, .6); dT[GREG] = bs(2, 2.05); dT[KEVIN] = bs(3, 3.3); dT[GARY] = bs(5, .2);
  { const prot = new Set([BRENDA, GARY, KEVIN, DEREK, GREG]); const pool = []; for (let i = 0; i < N; i++) if (!prot.has(i)) pool.push(i); for (let i = pool.length - 1; i > 0; i--) { const j = (rng() * (i + 1)) | 0; [pool[i], pool[j]] = [pool[j], pool[i]]; }
    const G3 = pool.slice(0, 57).sort((a, b) => gz(a) + rng() * 5 - (gz(b) + rng() * 5)), G4 = pool.slice(57, 95);
    G3.forEach((id, k) => { dT[id] = bs(3, 2.0 + k * (1.4 / 56)); }); G4.forEach((id, k) => { dT[id] = bs(4, .15 + k * (1.1 / 37)); }); }
  const aliveAt = (t) => { let a = N; for (let i = 0; i < N; i++) if (t >= dT[i]) a--; return a; };
  const lastDeath = (t) => { let m = -1e9; for (let i = 0; i < N; i++) if (dT[i] <= t && dT[i] > m) m = dT[i]; return m; };
  const EV = [[1, 3.0, '<b>STEVE</b> almost eliminated by <b>A DUST SPECK</b>'], [2, .6, '<b>DEREK</b> was eliminated by <b>A SNEEZE</b>'], [2, 2.05, '<b>GREG</b> was eliminated by <b>WATCHING THE FLY</b>'],
    [3, 2.05, '<b>TODD</b> was eliminated by <b>A LEAF</b>'], [3, 2.45, '<b>LINDA</b> was eliminated by <b>HER OWN HAIR</b>'], [3, 2.8, '<b>BRYCE</b> was eliminated by <b>PURE WIND</b>'], [3, 3.3, '<b>KEVIN</b> was eliminated by <b>A FAN</b>'], [3, 3.45, '<b>57 PEOPLE</b> blinked at once'],
    [4, .2, '<b>DENNIS</b> was eliminated by <b>DRY EYES</b>'], [4, .5, '<b>TAMMY</b> was eliminated by <b>A YAWN</b>'], [4, .8, '<b>OLLIE</b> was eliminated by <b>A SAD SONG</b>'], [4, 1.1, '<b>HANK</b> was eliminated by <b>HIS OWN EYELID</b>'],
    [5, .25, '<b>GARY</b> was eliminated by <b>BLINKING</b>'], [5, 1.0, '<b>BRENDA</b> WINS <b>$100,000</b>'], [5, 2.1, '<b>BRENDA</b> blinked (it\'s allowed now)']].map(([b, l, h]) => [bs(b, l), h]);
  const POPS = [[0, .1, 1.0, '100 PEOPLE'], [0, 1.78, 2.4, 'ONE RULE'], [0, 2.5, 3.9, "DON'T BLINK"], [0, 4.2, 7.4, 'LAST ONE WINS'], [1, .95, 2.7, 'EYES OPEN'], [1, 2.85, 4.7, 'WATERING'], [2, .1, 1.3, 'HOUR 3'], [2, 1.5, 2.8, 'A FLY?!'], [2, 3.0, 4.7, "DON'T MOVE KEVIN"],
    [3, .1, 1.2, 'HOUR 5'], [3, 1.35, 2.1, 'WIND MACHINE'], [3, 2.1, 3.4, '60 OUT'], [3, 3.5, 4.05, '40 LEFT'], [4, .1, 1.1, 'HOUR 9'], [4, 1.15, 2.3, '2 LEFT'], [4, 3.9, 4.7, 'DINNER PLATES'], [5, .15, 1.6, 'BRENDA WINS'], [5, 4.9, 5.4, 'YOU BLINKED']].map(([b, a, c, x]) => [bs(b, a), bs(b, c), x]);
  const HRS = [0, 1, 3, 5, 9, 10];

  // ---------------------------------------------------------------- hud dom
  const dom = (css) => { const d = document.createElement('div'); d.style.cssText = 'position:absolute;pointer-events:none;' + css; document.body.appendChild(d); return d; };
  const FONT = "font-family:'Liberation Sans',Arial,sans-serif;";
  const feedEl = dom('right:30px;top:292px;width:620px;' + FONT);
  const clk = document.createElement('canvas'); clk.width = clk.height = 170; clk.style.cssText = 'position:absolute;left:48px;top:560px;width:170px;height:170px'; document.body.appendChild(clk); const cg = clk.getContext('2d');
  { const $ = (id) => document.getElementById(id); const sty = (id, css) => { $(id).style.cssText += css; };
    sty('lab', ";left:50px;top:228px;font-size:46px;letter-spacing:4px;color:#ffd92a;-webkit-text-stroke:8px #000;paint-order:stroke fill;opacity:1;font-weight:900;font-family:'Liberation Sans',Arial,sans-serif");
    sty('val', ";left:44px;top:262px;font-size:230px;font-weight:900;line-height:1;font-family:'Liberation Sans',Arial,sans-serif;color:#fff;-webkit-text-stroke:14px #000;paint-order:stroke fill;transform-origin:0 0;letter-spacing:-6px");
    sty('note', ";left:50px;top:510px;font-size:46px;font-style:normal;letter-spacing:3px;font-weight:900;color:#fff;-webkit-text-stroke:8px #000;paint-order:stroke fill;font-family:'Liberation Sans',Arial,sans-serif;text-transform:uppercase;opacity:1");
    sty('pop', ";top:1190px;font-size:104px"); sty('cap', ";top:1500px;font-size:56px"); }
  function clock(t, bi, lt) {
    const prev = HRS[Math.max(0, bi - 1)], h = lerp(prev, HRS[bi], smooth(lt / .6)); const g = cg; g.clearRect(0, 0, 170, 170);
    g.fillStyle = '#fff'; g.strokeStyle = '#000'; g.lineWidth = 10; g.beginPath(); g.arc(85, 85, 74, 0, 7); g.fill(); g.stroke(); g.strokeStyle = '#111'; g.lineWidth = 4;
    for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; g.beginPath(); g.moveTo(85 + Math.sin(a) * 60, 85 - Math.cos(a) * 60); g.lineTo(85 + Math.sin(a) * 70, 85 - Math.cos(a) * 70); g.stroke(); }
    const hand = (a, len, w, c) => { g.strokeStyle = c; g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); g.moveTo(85, 85); g.lineTo(85 + Math.sin(a) * len, 85 - Math.cos(a) * len); g.stroke(); };
    hand(h * Math.PI / 6 + Math.PI * 0, 38, 9, '#111'); hand(h * Math.PI * 2 + (h % 1 ? 0 : 0), 58, 5, '#e8252b'); g.fillStyle = '#111'; g.beginPath(); g.arc(85, 85, 7, 0, 7); g.fill();
  }

  // ---------------------------------------------------------------- camera helpers
  const hw = (i, x, y, z) => VV.set(x, y, z).applyMatrix4(crowd.p[i].M.head).toArray();
  const faceCam = (i, dx, dy, dz, tx = 0, ty = .0, tz = .2) => [...hw(i, dx * 1.6, dy * 1.6, dz * 1.6), ...hw(i, tx, ty, tz)];
  const evalSegs = (segs, lt) => { let k = 0; for (let i = 0; i < segs.length; i++) if (lt >= segs[i][0]) k = i; const s = segs[k]; const u = clamp((lt - s[0]) / (s[1] - s[0])); let c = s[2](u); if (k > 0 && s[3]) { const q = (lt - s[0]) / .16; if (q < 1) { const pc = segs[k - 1][2](1), e = smooth(q); c = c.map((v, j) => lerp(pc[j], v, e)); } } return c; };
  const FLYP = [[1.74, .30, -.12], [2.1, .30, -.12], [2.6, .13, -.17], [2.9, 0, -.06], [3.4, -.15, .12], [3.9, -.1, .2], [4.4, 0, .26], [9, 0, .26]];
  const flyAt = (lt) => { let k = 0; for (let i = 0; i < FLYP.length - 1; i++) if (lt >= FLYP[i][0]) k = i; const a = FLYP[k], b = FLYP[k + 1], u = smooth((lt - a[0]) / (b[0] - a[0] || 1) * 1.6); return [lerp(a[1], b[1], Math.min(1, u)) + Math.sin(lt * 37) * .004, lerp(a[2], b[2], Math.min(1, u)) + Math.cos(lt * 31) * .004]; };
  const QA = new THREE.Quaternion(), QB = new THREE.Quaternion(), V1 = new THREE.Vector3(), V2 = new THREE.Vector3(), Pm = new THREE.Matrix4(), Sc = new THREE.Vector3();
  function placeFly(lt, t, bi, e) {
    if (bi !== 2) { fly.visible = false; return; } fly.visible = true; const o = crowd.p[KEVIN]; const P = eyeP(e); const sFly = .24; let lx, ly, lz, q = QA, flying = lt < 1.74;
    if (flying) { const r = 3.4 * (1 - smooth((lt - .9) / .84)), th = lt * 9 + 1; const fx = (lt0) => { const rr = 3.4 * (1 - smooth((lt0 - .9) / .84)), tt = lt0 * 9 + 1; return [flyAt(1.74)[0] + rr * Math.cos(tt), flyAt(1.74)[1] + rr * Math.sin(tt) * .7, .3 + rr * (.5 + .5 * Math.sin(tt * .7)) + .02]; };
      const p0 = fx(lt), p1 = fx(lt + .02); lx = p0[0]; ly = p0[1]; lz = p0[2]; V1.set(p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]).normalize(); q.setFromUnitVectors(V2.set(0, 1, 0), V1); }
    else { const p = flyAt(lt), pn = flyAt(lt + .05); lx = p[0]; ly = p[1]; let dx = pn[0] - p[0], dy = pn[1] - p[1]; const mv = Math.hypot(dx, dy) > 1e-4; if (!mv) { dx = flyAt(lt - .3)[0] - p[0]; dy = flyAt(lt - .3)[1] - p[1]; dx = -dx; dy = -dy; if (Math.hypot(dx, dy) < 1e-5) { dx = 0; dy = 1; } }
      lz = .226; for (const sx of [-1, 1]) { const ex = sx * P.x, dxe = lx - ex, dye = ly - P.y, d2 = dxe * dxe + dye * dye; if (d2 < P.R * P.R) lz = Math.max(lz, P.z + Math.sqrt(P.R * P.R - d2) * .95 + .01 + sFly * .12); }
      V1.set(lx - 0, ly - P.y, lz - P.z); const nx = lz > .24 ? V1.clone().normalize() : new THREE.Vector3(0, 0, 1); QB.setFromUnitVectors(V2.set(0, 0, 1), nx); QA.setFromAxisAngle(V2.set(0, 0, 1), Math.atan2(dy, dx) - Math.PI / 2); q = QB.multiply(QA); lz += sFly * .1; }
    Pm.compose(V1.set(lx, ly, lz), q, Sc.set(sFly, sFly, sFly)); fly.matrix.copy(o.M.head).multiply(Pm); fly.matrixWorldNeedsUpdate = true;
    for (const w of flyWings) w.rotation.y = flying ? w.userData.sx * Math.sin(t * 160) * .9 : .05 * w.userData.sx;
  }

  const D = new THREE.Object3D(), HV = new THREE.Vector3();
  const blinkAmt = (lt, t0) => { const u = lt - t0; if (u < 0 || u > 1.05) return 0; if (u < .25) return smooth(u / .25); if (u < .38) return 1; return 1 - smooth((u - .38) / .67); };

  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, NB - 1); const wind = bi === 3 ? smooth((lt - .55) / .7) : 0;
    const alive = aliveAt(t);
    // ----- people
    for (let i = 0; i < N; i++) { const o = crowd.p[i]; o.vis = t < dT[i]; o.scale = 1; o.extra = 0; o.pitch = 0; o.arms = null; o.y = 0; o.anim = 'stand'; o.speed = 1; o.x = gx(i); o.z = gz(i); o.yaw = Math.PI; o.lie = 0;
      if (wind > 0) { o.pitch = -(.2 + .06 * Math.sin(t * 9 + o.phase)) * wind; o.extra = .045 * wind; }
      if (i === KEVIN && bi === 2 && lt > 2.6) o.extra = .05;
      if ((i === BRENDA || i === GARY) && bi === 4) { const u = clamp((lt - .6) / 1.4); o.x = lerp(gx(i), i === BRENDA ? -1.8 : 1.8, smooth(u)); o.z = lerp(gz(i), -2, smooth(u)); if (u > 0 && u < 1) { o.anim = 'walk'; o.speed = .9; } }
      if ((i === BRENDA || i === GARY) && bi === 5) { o.x = i === BRENDA ? lerp(-1.8, 0, smooth(lt / 1.0)) : 1.8; o.z = -2; if (i === BRENDA) { if (lt < 1.0) { o.anim = 'walk'; o.speed = .7; } const u = smooth((lt - .7) / .6); o.arms = { lx: -2.9 * u, rx: -2.9 * u, lz: -.14 * u, rz: .14 * u }; } }
      if (i === BRENDA && bi === 5 && lt < .02) o.anim = 'stand';
    }
    crowd.setFace(bi >= 3 ? 'shock' : 'calm'); crowd.update(t);
    // ----- eyes
    const base = [1.15, 1.25, 1.35, 1.45, 1.5, 1.7][bi], pupB = [.62, .55, .42, .32, .3, .5][bi] / .62;
    const eOf = (i) => { let e = base; if (i === KEVIN && bi === 2) e = 1.35 + .4 * smooth((lt - 1.7) / 1.2); if ((i === BRENDA || i === GARY) && bi === 4) e = 1.5 + .5 * smooth((lt - 1.3) / 2.6) + .1 * Math.sin(lt * 9) * smooth((lt - 2) / 1); if (bi === 5) e = i === BRENDA ? 2.4 : 2.2; return e; };
    const E = new Array(N); for (let i = 0; i < N; i++) { E[i] = eOf(i); let cl = 0; if (dT[i] < 1e8 && t > dT[i] - .22) cl = smooth((t - (dT[i] - .22)) / .14);
      if (i === BRENDA && bi === 5) cl = Math.max(blinkAmt(lt, 1.62), blinkAmt(lt, 4.05)); if (i === KEVIN && bi === 3 && lt > 2.9) cl = Math.max(cl, smooth((lt - 2.9) / .12));
      eyes(i, E[i], cl, pupB * (1 - .1 * Math.sin(t * 6 + i)), eyeCol[bi]); }
    for (const im of [eS, eI, eP, eH, eL]) im.instanceMatrix.needsUpdate = true; eS.instanceColor.needsUpdate = true;
    // tears (everyone small; heroes big)
    const tOn = bi >= 1 && !(bi === 5);
    for (let i = 0; i < N; i++) tearsFor(tearsA, i * 4, i, E[i], 2, t, 1, .8, tOn);
    tearsA.done();
    const heroes = bi === 1 ? [3, 5] : bi === 2 ? [KEVIN] : bi === 4 ? [BRENDA, GARY] : bi === 5 ? [BRENDA] : [];
    for (let s = 0; s < 160; s++) tearsH.set(s, 0, 0, 0, 0);
    heroes.forEach((h, k) => tearsFor(tearsH, k * 40, h, E[h], 10, t, 1.15, 1.1, true)); if (bi === 0 && lt > 2.6) tearsFor(tearsH, 0, 5, E[5], 8, t, 1.1, 1.0, true);
    if (bi === 5) { const g = smooth((lt - 2.4) / .5); tearsFor(tearsH, 40, BRENDA, E[BRENDA], 14, t, 1.4 * g, 1.8, g > 0); }
    tearsH.done();
    // poofs
    for (let i = 0; i < N; i++) { const d = t - dT[i], u = d / .6, on = d >= 0 && d < .6, o = crowd.p[i];
      for (let k = 0; k < 6; k++) { if (!on) { poof.set(i * 6 + k, 0, 0, 0, 0); continue; } const a = k * 1.047 + i, r = .3 + 1.1 * u; poof.set(i * 6 + k, o.x + Math.cos(a) * r, 1.0 + u * 1.3 + Math.sin(k * 2.3) * .25, o.z + Math.sin(a) * r, Math.pow(Math.sin(Math.PI * Math.min(1, u * 1.05)), .6) * 1.7); }
      for (let k = 0; k < 4; k++) { if (!on) { sparks.set(i * 4 + k, 0, 0, 0, 0); continue; } const a = k * 1.57 + i * 2, r = .3 + 2.6 * u; sparks.set(i * 4 + k, o.x + Math.cos(a) * r, 1.3 + Math.sin(u * 3 + k) * .8 + u * 1.2, o.z + Math.sin(a) * r, (1 - u) * 1.3); } }
    poof.done(); sparks.done();
    // fan, streaks, money, plate, case, fly, tags
    fan.visible = bi === 3 || (bi === 4 && lt < 1.5); sign.visible = bi === 0 && lt > 3.3; sign.position.y = bi === 0 ? lerp(30, 10.5, smooth((lt - 3.3) / .35)) : 10.5;
    blades.rotation.z = -(bi === 3 ? Math.pow(clamp((lt - .1) / 1.1), 1.5) * (t * 38) + lt * 6 : (bi === 4 ? 6 : 0) * t * 0 + t * 2);
    for (let i = 0; i < 180; i++) { const u = ((t * .8 + i * .0618) % 1), x = Math.sin(i * 12.9) * 15, y = .4 + (Math.cos(i * 7.7) * .5 + .5) * 4.6; D.position.set(x, y, -20 + u * 46); D.scale.setScalar(wind > .05 ? 1 : 0); D.rotation.set(0, 0, 0); D.updateMatrix(); streak.setMatrixAt(i, D.matrix); } streak.instanceMatrix.needsUpdate = true;
    for (let i = 0; i < 160; i++) { const on = bi === 5 && lt > .8; const u = ((t * .3 + i * .0913) % 1); D.position.set(Math.cos(i * 2.4) * 7, 15 - u * 15.5, -2 + Math.sin(i * 3.1) * 6); D.rotation.set(t * 2 + i, t * 1.3 + i * 2, t * 1.7); D.scale.setScalar(on ? 1.6 : 0); D.updateMatrix(); money.setMatrixAt(i, D.matrix); } money.instanceMatrix.needsUpdate = true; rainL.intensity = bi === 5 ? 40 : 0;
    plate.visible = bi === 4 && lt > 3.85; if (plate.visible) { const o = crowd.p[BRENDA], pu = smooth((lt - 3.85) / .25); HV.set(.1, .0, 1.5).applyMatrix4(o.M.head); plate.position.copy(HV); plate.scale.setScalar(.34 * pu * 1.0); plate.rotation.set(Math.PI / 2, 0, 0); plate.position.x += .5; }
    placeFly(lt, t, bi, E[KEVIN]);
    beams.forEach((m, k) => { const a = k * Math.PI / 4 + t * .15, top = V1.set(Math.cos(a) * 34, 40, Math.sin(a) * 34), tgt = V2.set(Math.cos(a * 2 + t * .4) * 9, 0, Math.sin(a * 2 + t * .3) * 9); const dir = HV.copy(top).sub(tgt); m.scale.y = 1; m.position.copy(tgt).addScaledVector(dir, .5); m.quaternion.setFromUnitVectors(D.up.set(0, 1, 0), dir.clone().normalize()); m.scale.y = dir.length() / 44; });
    caseOpen.visible = true; gl.intensity = 50 + 15 * Math.sin(t * 5);
    caseHeld.visible = bi === 5 && lt > .7;
    if (caseHeld.visible) { const o = crowd.p[BRENDA]; const hl = V1.setFromMatrixPosition(o.M.handL), hr = V2.setFromMatrixPosition(o.M.handR); const pop = smooth((lt - .7) / .2) * (1 + .12 * Math.sin(Math.min(1, (lt - .7) / .5) * Math.PI)); caseHeld.position.copy(hl).add(hr).multiplyScalar(.5); caseHeld.position.y += .6; caseHeld.rotation.set(-Math.PI / 2, 0, 0); caseHeld.scale.setScalar(.52 * pop); }
    const tg = (sp, i, on) => { sp.visible = on && crowd.p[i].vis; if (sp.visible) { HV.setFromMatrixPosition(crowd.p[i].M.head); sp.position.set(HV.x, HV.y + 1.0, HV.z); } };
    tg(tagK, KEVIN, bi === 2 && lt < 1.7); tg(tagB, BRENDA, bi === 4 && lt > 1.5 && lt < 2.5); tg(tagG, GARY, bi === 4 && lt > 1.5 && lt < 3.3);
    // ----- cameras
    const hh = (i) => crowd.p[i].M.head; const fx = gx, fz = gz;
    let segs;
    if (bi === 0) segs = [
      [0, 1.76, (u) => [0, lerp(27, 19, u), lerp(-41, -32, u), 0, 1, 4, 56, lerp(.04, -.03, u)]],
      [1.76, 2.5, (u) => faceCam(4, lerp(-.2, -.05, u), .02, lerp(2.4, 1.4, u), 0, .02, .2).concat([40, .06]), true],
      [2.5, 3.5, (u) => faceCam(5, lerp(.1, 0, u), .04, lerp(1.7, 1.15, u), 0, .04, .2).concat([36, lerp(.14, .1, u)]), true],
      [3.5, 4.18, (u) => [lerp(-3, 2, u), lerp(2.2, 5, u), -27, 0, 9.5, -15, 62, 0], true],
      [4.18, 5.5, (u) => [0, lerp(8, 5.5, u), lerp(-6, 8, u), 0, 3.2, 21, lerp(58, 50, u), lerp(.0, .05, u)], true],
      [5.5, 7.6, (u) => [lerp(-7, 7, u), lerp(1.8, 2.5, u), 13.2, 0, 3.6, 21, 56, lerp(.14, -.14, u)], true]];
    else if (bi === 1) segs = [
      [0, .9, (u) => [lerp(-24, -16, u), lerp(14, 11, u), lerp(-27, -23, u), 0, 1, -2, 55, .1]],
      [.9, 2.4, (u) => [lerp(-8, 8, u), 1.75, -13.4, lerp(-6.5, 9.5, u), 1.7, -10.8, 54, lerp(.06, -.06, u)], true],
      [2.4, 3.4, (u) => faceCam(3, lerp(-.06, .02, u), .02, lerp(1.0, .6, u), -.08, .0, .2).concat([30, .1]), true],
      [3.4, 4.8, (u) => [lerp(-3, 3, u), lerp(.7, 2.4, u), lerp(-14, -18, u), 0, 1.7, -10.8, 62, lerp(-.06, .06, u)], true]];
    else if (bi === 2) segs = [
      [0, 1.4, (u) => [lerp(9, 7, u), 2.5, -15, 2.4, 1.8, -10.8, 50, .05]],
      [1.4, 2.8, (u) => faceCam(KEVIN, lerp(.5, .1, u), .05, lerp(3.2, 1.7, u), 0, .02, .2).concat([lerp(40, 34, u), 0]), true],
      [2.8, 3.55, (u) => faceCam(KEVIN, lerp(.2, .1, u), .06, lerp(1.6, 1.3, u), .05, .0, .2).concat([36, .12]), true],
      [3.55, 4.0, (u) => [3.6, 2.0, -14.5, 3.6, 1.8, -10.8, 50, -.04], true],
      [4.0, 4.8, (u) => { const f = flyAt(lt); return faceCam(KEVIN, f[0] * .5, f[1] * .6 + .03, 1.1, f[0], f[1], .24).concat([34, -.1]); }, true]];
    else if (bi === 3) segs = [
      [0, 1.3, (u) => [lerp(-8.5, -5.5, u), lerp(2.2, 3.4, u), lerp(-14.2, -14.5, u), 0, lerp(3.6, 4, u), -22, lerp(58, 54, u), lerp(.1, -.05, u)]],
      [1.3, 2.0, (u) => [lerp(-17, -15, u), lerp(2.8, 3.4, u), lerp(-7, -4, u), 0, 1.8, -3, 55, 0], true],
      [2.0, 2.9, (u) => [0, lerp(24, 18, u), lerp(-22, -16, u), 0, 0, lerp(0, 2, u), 58, lerp(.12, .02, u)], true],
      [2.9, 3.34, (u) => faceCam(KEVIN, lerp(.15, .05, u), .04, lerp(1.9, 1.3, u), 0, .0, .2).concat([36, .06]), true],
      [3.34, 4.2, (u) => [0, 2.2, -15, 0, 2.2, -2, 62, 0], true]];
    else if (bi === 4) segs = [
      [0, 1.3, (u) => [lerp(-24, -20, u), lerp(15, 12, u), lerp(-18, -14, u), 0, 1, 2, 56, lerp(-.1, -.04, u)]],
      [1.3, 2.4, (u) => [0, lerp(1.2, 1.5, u), lerp(-10, -6.5, u), 0, 1.6, -2, 50, 0], true],
      [2.4, 3.4, (u) => faceCam(GARY, lerp(.1, 0, u), .04, lerp(2.4, 1.7, u), 0, .02, .2).concat([lerp(42, 38, u), lerp(.06, -.08, u)]), true],
      [3.4, 4.8, (u) => faceCam(BRENDA, lerp(-.1, .0, u), .04, lerp(2.2, 1.5, u), 0, .02, .2).concat([lerp(40, 34, u), lerp(-.04, .08, u)]), true]];
    else segs = [
      [0, 1.4, (u) => [lerp(1.2, 0, u), lerp(.9, 1.3, u), lerp(-7.2, -6, u), lerp(0, 0, u), 2.0, -2, 52, lerp(.1, 0, u)]],
      [1.4, 2.7, (u) => faceCam(BRENDA, lerp(.15, 0, u), .04, lerp(2.2, 1.4, u), 0, .02, .2).concat([lerp(40, 34, u), .04]), true],
      [2.7, 4.0, (u) => faceCam(BRENDA, lerp(.55, .3, u), -.1, lerp(1.7, 1.4, u), .08, -.1, .2).concat([34, lerp(.08, -.08, u)]), true],
      [4.0, 4.9, (u) => faceCam(BRENDA, 0, .04, lerp(1.6, 1.3, u), 0, .02, .2).concat([34, 0]), true],
      [4.9, 5.5, (u) => [0, lerp(.8, 1.4, u), lerp(-4, -8.5, u), 0, 2.3, -2, lerp(46, 58, u), 0], true]];
    const c = evalSegs(segs, lt); const shk = (bi === 2 && lt > 2.7) || bi === 3 && lt > 1.3 && lt < 3.6 ? .012 : .004; c[0] += Math.sin(t * 13.3) * shk; c[1] += Math.cos(t * 11.1) * shk;
    st.cam(...c); st.follow(clamp(c[3], -20, 20), clamp(c[5], -20, 20)); st.render();
    // ----- hud
    const a = alive, ld = lastDeath(t), since = t - ld; const bump = since >= 0 && since < .28 ? 1 + .22 * (1 - since / .28) : 1;
    hud.counter('ALIVE', String(a), 'HOUR ' + HRS[bi], '', since >= 0 && since < .3); document.getElementById('val').style.transform = `scale(${bump})`; document.getElementById('note').textContent = bi === 0 ? 'HOUR 0' : 'HOUR ' + HRS[bi];
    clk.style.top = '580px'; clock(t, bi, lt);
    hud.question('', 0); let pop = ''; for (const q of POPS) if (t >= q[0] && t < q[1]) pop = q[2]; hud.pop(pop, 1);
    const fe = EV.filter((e) => t >= e[0] && t < e[0] + 3.4).slice(-4); feedEl.innerHTML = fe.map((e) => { const age = t - e[0]; return `<div style="margin:8px 0 0 auto;width:max-content;max-width:620px;background:rgba(10,10,14,.84);border-left:9px solid #e8252b;padding:8px 18px;font-size:31px;font-weight:800;color:#fff;opacity:${Math.min(1, age / .12, (3.4 - age) / .3)};transform:translateX(${(1 - Math.min(1, age / .14)) * 80}px)">${e[1].replace(/<b>/g, '<b style="color:#ffd23f">')}</div>`; }).join('');
  } };
}
