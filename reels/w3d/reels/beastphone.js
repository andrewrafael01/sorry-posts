// MrBeast-style dumb competition: 100 people, one rule (don't touch your phone), last one wins $100,000.
// Own staging: giant arena, phones on tables, giant bubbles, cash-briefcase podium. Non-explicit.
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, Crowd, Particles, R, clamp, smooth, lerp, attach, dropBounce } = lib;
  const rnd = R(654);
  const NB = tl.beats.length, BS = tl.beats.map((b) => b.start);
  const $ = (id) => document.getElementById(id);

  // ------------------------------------------------------------------ stage
  const st = makeStage({ shadowExtent: 48, shadowRes: 2048, fog: 0x0a1030, fogNear: 110, fogFar: 340, clouds: false, skyTop: 0x04061a, skyMid: 0x0d1440, skyBot: 0x1c2670, sunColor: 0xdfe6ff, sunI: 2.3, hemi: 1.15, hemiSky: 0xa5b8ff, hemiGround: 0x3a3f70, sunDir: [-.3, 1, .6], exposure: 1.15 });
  const S = st.scene; const cam = st.camera;
  const basic = (o) => new THREE.MeshBasicMaterial(Object.assign({ fog: false, toneMapped: false }, o));
  const cvs = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  const rr = (g, x, y, w, h, r) => { g.beginPath(); g.roundRect(x, y, w, h, r); };
  const FONT = '"Liberation Sans", Arial, sans-serif';
  const tex = (c) => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; };

  // floor: dark glossy checker + lit platform for the contestants
  { const c = cvs(256, 256), g = c.getContext('2d'); g.fillStyle = '#16225a'; g.fillRect(0, 0, 256, 256); g.fillStyle = '#1f2f80'; g.fillRect(0, 0, 128, 128); g.fillRect(128, 128, 128, 128);
    const ft = tex(c); ft.wrapS = ft.wrapT = THREE.RepeatWrapping; ft.repeat.set(40, 40);
    const fl = new THREE.Mesh(new THREE.CircleGeometry(150, 64), new THREE.MeshStandardMaterial({ map: ft, roughness: .35, metalness: .15 })); fl.rotation.x = -Math.PI / 2; fl.receiveShadow = true; S.add(fl);
    const pl = new THREE.Mesh(new THREE.CylinderGeometry(27, 27.4, .12, 64), new THREE.MeshStandardMaterial({ color: 0xe8ecf8, roughness: .5 })); pl.position.y = .02; pl.receiveShadow = true; S.add(pl);
    for (const [rad, col] of [[27.8, 0xff2f4a], [29.2, 0xffd23f]]) { const tr = new THREE.Mesh(new THREE.TorusGeometry(rad, .14, 8, 120), basic({ color: col })); tr.rotation.x = Math.PI / 2; tr.position.y = .1; S.add(tr); } }
  // arena wall with glowing light strips + light-dot ring (bokeh)
  { const c = cvs(1024, 256), g = c.getContext('2d'); const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, '#0a0e2a'); gr.addColorStop(1, '#1b2466'); g.fillStyle = gr; g.fillRect(0, 0, 1024, 256);
    const cols = ['#ff2f4a', '#3bd1ff', '#ffd23f', '#a259ff']; for (let i = 0; i < 64; i++) { g.fillStyle = cols[i % 4]; g.globalAlpha = .85; g.fillRect(i * 16 + 5, 190, 6, 66); g.globalAlpha = .35; g.fillRect(i * 16 + 3, 60 + (i * 37) % 90, 10, 14); } g.globalAlpha = 1;
    const wt = tex(c); wt.wrapS = THREE.RepeatWrapping; wt.repeat.set(3, 1);
    const wall = new THREE.Mesh(new THREE.CylinderGeometry(135, 135, 70, 64, 1, true), new THREE.MeshBasicMaterial({ map: wt, side: THREE.BackSide, fog: true })); wall.position.y = 34; S.add(wall);
    const dots = new THREE.InstancedMesh(new THREE.SphereGeometry(.9, 8, 6), basic({ color: 0xffffff }), 90); const Dm = new THREE.Object3D(); const dc = new THREE.Color();
    for (let i = 0; i < 90; i++) { const a = i / 90 * 6.283, rd = 110 + (i % 3) * 6; Dm.position.set(Math.cos(a) * rd, 38 + (i % 5) * 4, Math.sin(a) * rd); Dm.updateMatrix(); dots.setMatrixAt(i, Dm.matrix); dc.set(cols[i % 4]); dots.setColorAt(i, dc); } S.add(dots); }
  // giant banner
  { const c = cvs(2048, 700), g = c.getContext('2d'); const gr = g.createLinearGradient(0, 0, 0, 700); gr.addColorStop(0, '#d8222c'); gr.addColorStop(1, '#6a070c'); g.fillStyle = gr; g.fillRect(0, 0, 2048, 700);
    g.strokeStyle = '#ffd23f'; g.lineWidth = 22; g.setLineDash([60, 36]); g.strokeRect(22, 22, 2004, 656); g.setLineDash([]);
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
    const T = (s, y, px, fill) => { g.font = `900 ${px}px ${FONT}`; g.lineWidth = px * .16; g.strokeStyle = '#000'; g.strokeText(s, 1024, y); g.fillStyle = fill; g.fillText(s, 1024, y); };
    T("DON'T TOUCH YOUR PHONE", 215, 205, '#ffffff'); T('LAST ONE WINS  $100,000', 485, 175, '#ffe23a');
    const bt = tex(c); const bn = new THREE.Mesh(new THREE.PlaneGeometry(52, 17.8), basic({ map: bt })); bn.position.set(0, 24, -45.4); S.add(bn);
    const fr = new THREE.Mesh(new THREE.BoxGeometry(54.4, 20.2, 1.6), new THREE.MeshStandardMaterial({ color: 0x15151c, roughness: .6, metalness: .5 })); fr.position.set(0, 24, -46.4); S.add(fr);
    for (const sx of [-1, 1]) { const pil = new THREE.Mesh(new THREE.BoxGeometry(2, 40, 2), new THREE.MeshStandardMaterial({ color: 0x20202a, roughness: .5, metalness: .6 })); pil.position.set(sx * 28, 20, -46); S.add(pil); const sl = new THREE.Mesh(new THREE.BoxGeometry(.6, 38, .6), basic({ color: sx < 0 ? 0xff2f4a : 0x3bd1ff })); sl.position.set(sx * 28, 20, -44.9); S.add(sl); } }

  // ------------------------------------------------------------------ briefcase builders
  const CASE_DARK = new THREE.MeshStandardMaterial({ color: 0x24242c, roughness: .55, metalness: .25 }), GOLD = new THREE.MeshStandardMaterial({ color: 0xf2c230, roughness: .3, metalness: .85, emissive: 0x3a2800 });
  const dollarTex = (() => { const c = cvs(256, 256), g = c.getContext('2d'); g.clearRect(0, 0, 256, 256); g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = `900 220px ${FONT}`; g.lineWidth = 24; g.strokeStyle = '#7a5200'; g.strokeText('$', 128, 138); g.fillStyle = '#ffd84a'; g.fillText('$', 128, 138); return tex(c); })();
  const mkClosedCase = (w, h, d) => { const gp = new THREE.Group(); const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), CASE_DARK); b.castShadow = true; gp.add(b);
    const hd = new THREE.Mesh(new THREE.TorusGeometry(w * .14, w * .028, 8, 16, Math.PI), GOLD); hd.position.y = h / 2; gp.add(hd);
    for (const sx of [-1, 1]) { const cl = new THREE.Mesh(new THREE.BoxGeometry(w * .1, h * .12, d * 1.1), GOLD); cl.position.set(sx * w * .3, h * .3, 0); gp.add(cl); }
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) { const cn = new THREE.Mesh(new THREE.BoxGeometry(w * .09, w * .09, d * 1.06), GOLD); cn.position.set(sx * (w / 2 - w * .03), sy * (h / 2 - w * .03), 0); gp.add(cn); }
    const dl = new THREE.Mesh(new THREE.PlaneGeometry(h * .62, h * .62), new THREE.MeshBasicMaterial({ map: dollarTex, transparent: true, toneMapped: false })); dl.position.z = d / 2 + .01; gp.add(dl); return gp; };
  // giant open case on a podium
  const PODZ = -30; const podium = new THREE.Group(); podium.position.set(0, 0, PODZ); S.add(podium);
  { const pd = new THREE.Mesh(new THREE.CylinderGeometry(7.5, 8, 2.6, 40), new THREE.MeshStandardMaterial({ color: 0xf6f6fb, roughness: .4 })); pd.position.y = 1.3; pd.castShadow = true; pd.receiveShadow = true; podium.add(pd);
    const rg = new THREE.Mesh(new THREE.TorusGeometry(7.6, .28, 8, 64), GOLD); rg.rotation.x = Math.PI / 2; rg.position.y = 2.6; podium.add(rg);
    const base = new THREE.Mesh(new THREE.BoxGeometry(9, 1.5, 4.6), CASE_DARK); base.position.y = 2.6 + .75; base.castShadow = true; podium.add(base);
    const cashM = new THREE.MeshStandardMaterial({ color: 0x3aa655, roughness: .7 }), bandM = new THREE.MeshStandardMaterial({ color: 0xe8e2c0, roughness: .8 });
    for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) { const k = new THREE.Mesh(new THREE.BoxGeometry(1.3, .7, 1.1), cashM); k.position.set(-3.75 + c * 1.5, 4.35 + (c % 2) * .05, -1.4 + r * 1.35); k.castShadow = true; podium.add(k); const bd = new THREE.Mesh(new THREE.BoxGeometry(.3, .74, 1.14), bandM); bd.position.copy(k.position); podium.add(bd); }
    const lid = new THREE.Group(); lid.position.set(0, 3.35, -2.3); lid.rotation.x = -.38; podium.add(lid);
    const lb = new THREE.Mesh(new THREE.BoxGeometry(9, 5.4, .5), CASE_DARK); lb.position.set(0, 2.7, 0); lb.castShadow = true; lid.add(lb);
    const ld = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 4.2), new THREE.MeshBasicMaterial({ map: dollarTex, transparent: true, toneMapped: false })); ld.position.set(0, 2.9, .27); lid.add(ld);
    for (const sx of [-1, 1]) { const tr = new THREE.Mesh(new THREE.BoxGeometry(.5, 5.5, .6), GOLD); tr.position.set(sx * 4.4, 2.7, 0); lid.add(tr); }
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(5.5, 8.5, 56, 28, 1, true), new THREE.MeshBasicMaterial({ color: 0xffd23f, transparent: true, opacity: .16, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false })); beam.position.set(0, 28, 0); podium.add(beam); podium.userData.beam = beam; }
  const podGlow = new THREE.PointLight(0xffd070, 70, 46); podGlow.position.set(0, 7, PODZ + 5); S.add(podGlow);
  const sparks = new Particles(S, 50, 0xffe27a, .16, { rough: .3, emissive: 0xffc830 });

  // sweeping spotlights
  const cones = []; { const cc = [0xff3b5c, 0x3bd1ff, 0xffd23f, 0xa259ff, 0x59ff9a, 0xff7a3b]; for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283, gr = new THREE.Group(); gr.position.set(Math.cos(a) * 50, 60, Math.sin(a) * 40 + 4); const cn = new THREE.Mesh(new THREE.CylinderGeometry(.5, 8.5, 62, 20, 1, true), new THREE.MeshBasicMaterial({ color: cc[i % 6], transparent: true, opacity: .1, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false })); cn.position.y = -31; gr.add(cn); S.add(gr); cones.push({ gr, a }); } }
  const garyBeam = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 4.2, 40, 24, 1, true), new THREE.MeshBasicMaterial({ color: 0xfff1c0, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false })); S.add(garyBeam);
  const garySpot = new THREE.SpotLight(0xfff0d0, 0, 60, .22, .7, 1); garySpot.position.set(0, 22, 24); S.add(garySpot); S.add(garySpot.target);

  // ------------------------------------------------------------------ people, tables, phones
  const crowd = new Crowd(S, 100, 21);
  const COLS = 10, G = 94; const px = [], pz = [];
  for (let i = 0; i < 100; i++) { const r = Math.floor(i / 10), c = i % 10; px.push((r % 2 ? -13.6 : -15.3) + c * 3.4 + (rnd() - .5) * .3); pz.push(-16.4 + r * 3.6 + (rnd() - .5) * .3); }
  px[G] = 0; pz[G] = 16.4;
  const yawJ = Array.from({ length: 100 }, () => (rnd() - .5) * .22);
  const TZ = 1.0; // table offset in front of each person
  const tables = new THREE.InstancedMesh(new THREE.BoxGeometry(1.5, .8, .8), new THREE.MeshStandardMaterial({ color: 0xf4f4f8, roughness: .6 }), 100); tables.castShadow = true; tables.receiveShadow = true; tables.frustumCulled = false; S.add(tables);
  const phoneBody = new THREE.InstancedMesh(new THREE.BoxGeometry(.62, 1.02, .07), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .35, metalness: .4 }), 100); phoneBody.castShadow = true; phoneBody.frustumCulled = false; S.add(phoneBody);
  const phoneScr = new THREE.InstancedMesh(new THREE.PlaneGeometry(.54, .94), basic({ color: 0xffffff }), 100); phoneScr.frustumCulled = false; S.add(phoneScr);
  const glow = new THREE.InstancedMesh(new THREE.CircleGeometry(1, 24), basic({ color: 0xffffff, transparent: true, opacity: .55, blending: THREE.AdditiveBlending, depthWrite: false }), 100); glow.frustumCulled = false; S.add(glow);
  const notifTex = (() => { const c = cvs(256, 128), g = c.getContext('2d'); g.fillStyle = '#fff'; rr(g, 8, 8, 240, 96, 30); g.fill(); g.beginPath(); g.moveTo(40, 100); g.lineTo(26, 124); g.lineTo(70, 102); g.fill(); g.fillStyle = '#e8252b'; g.beginPath(); g.arc(214, 24, 26, 0, 6.283); g.fill(); g.fillStyle = '#fff'; g.font = `900 34px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('1', 214, 26); g.fillStyle = '#222'; g.font = `900 40px ${FONT}`; g.fillText('NEW MSG', 108, 58); return tex(c); })();
  const notif = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, .5), basic({ map: notifTex, transparent: true }), 100); notif.frustumCulled = false; S.add(notif);
  const PHCOL = [0x15151a, 0x15151a, 0x15151a, 0xb3202a, 0x2a6fd0, 0x2aa05a, 0xe8e8ee]; const tc = new THREE.Color();
  for (let i = 0; i < 100; i++) { tc.set(PHCOL[i % PHCOL.length]); phoneBody.setColorAt(i, tc); }
  const TILT = 1.1, PY = 1.06, DM = new THREE.Object3D(); DM.rotation.order = 'YXZ'; const Mtmp = new THREE.Matrix4(), Mz = new THREE.Matrix4().makeTranslation(0, 0, .04);
  // hero phone for Gary (dynamic screen)
  const hc = cvs(512, 880), hg = hc.getContext('2d'); const heroTex = tex(hc); let heroKey = '';
  const hero = new THREE.Group(); { const b = new THREE.Mesh(new THREE.BoxGeometry(.62, 1.02, .07), new THREE.MeshStandardMaterial({ color: 0x15151a, roughness: .35, metalness: .4 })); b.castShadow = true; hero.add(b); const sc = new THREE.Mesh(new THREE.PlaneGeometry(.54, .94), basic({ map: heroTex })); sc.position.z = .04; hero.add(sc); S.add(hero); }
  const heroGlow = new THREE.Mesh(new THREE.CircleGeometry(1, 24), basic({ color: 0xffffff, transparent: true, opacity: .5, blending: THREE.AdditiveBlending, depthWrite: false })); heroGlow.rotation.x = -Math.PI / 2; S.add(heroGlow);
  const drawHero = (key) => { if (key === heroKey) return; heroKey = key; const g = hg; g.clearRect(0, 0, 512, 880);
    if (key === 'nomsg') { g.fillStyle = '#1b1b22'; g.fillRect(0, 0, 512, 880); g.fillStyle = '#9a9aa8'; rr(g, 156, 200, 200, 140, 18); g.fill(); g.strokeStyle = '#1b1b22'; g.lineWidth = 12; g.beginPath(); g.moveTo(166, 215); g.lineTo(256, 290); g.lineTo(346, 215); g.stroke(); g.strokeStyle = '#e8252b'; g.lineWidth = 18; g.beginPath(); g.moveTo(130, 180); g.lineTo(382, 360); g.stroke(); g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = `900 92px ${FONT}`; g.fillText('NO', 256, 500); g.fillText('MESSAGES', 256, 600); g.fillStyle = '#8a8a98'; g.font = `700 44px ${FONT}`; g.fillText('0 new  ·  0 missed', 256, 700); g.font = `900 80px ${FONT}`; g.fillStyle = '#7a7a88'; g.fillText(':(', 256, 800); return; }
    const gr = g.createLinearGradient(0, 0, 0, 880); gr.addColorStop(0, '#3a56d8'); gr.addColorStop(1, '#8a3fd0'); g.fillStyle = gr; g.fillRect(0, 0, 512, 880); g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = `700 190px ${FONT}`; g.fillText('9:41', 256, 330); g.font = `700 44px ${FONT}`; g.fillText('Sunday, November 8', 256, 450);
    g.fillStyle = 'rgba(255,255,255,.22)'; rr(g, 40, 580, 432, 110, 26); g.fill(); g.fillStyle = '#fff'; g.font = `700 40px ${FONT}`; g.fillText('swipe up to check me', 256, 635); };

  // bubbles
  const bub = (draw, w, h) => { const c = cvs(1100, Math.round(1100 * h / w)), g = c.getContext('2d'); draw(g, c.width, c.height); const gp = new THREE.Group(); const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), basic({ map: tex(c), transparent: true, depthWrite: false })); gp.add(m); S.add(gp); gp.visible = false; return gp; };
  const bubMom = bub((g, W, H) => { g.fillStyle = '#e5e5ea'; rr(g, 20, 20, W - 40, H - 100, 120); g.fill(); g.beginPath(); g.moveTo(130, H - 90); g.lineTo(70, H - 12); g.lineTo(250, H - 86); g.fill(); g.strokeStyle = '#000'; g.lineWidth = 14; rr(g, 20, 20, W - 40, H - 100, 120); g.stroke(); g.fillStyle = '#e8252b'; g.beginPath(); g.arc(W - 70, 40, 62, 0, 6.28); g.fill(); g.strokeStyle = '#fff'; g.lineWidth = 8; g.stroke(); g.fillStyle = '#fff'; g.font = `900 78px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('1', W - 70, 46); g.fillStyle = '#7a7a86'; g.textAlign = 'left'; g.font = `900 92px ${FONT}`; g.fillText('MOM:', 90, 118); g.fillStyle = '#111'; g.font = `900 148px ${FONT}`; g.fillText('where are you??', 76, 262); }, 12, 4.5);
  const bubCrush = bub((g, W, H) => { g.fillStyle = '#1f8bff'; rr(g, 20, 20, W - 40, H - 100, 120); g.fill(); g.beginPath(); g.moveTo(W - 130, H - 90); g.lineTo(W - 70, H - 12); g.lineTo(W - 250, H - 86); g.fill(); g.strokeStyle = '#000'; g.lineWidth = 14; rr(g, 20, 20, W - 40, H - 100, 120); g.stroke(); g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.strokeStyle = '#0a3d80'; g.lineWidth = 16; g.font = `900 138px ${FONT}`; g.strokeText('YOUR CRUSH', W / 2, 135); g.fillText('YOUR CRUSH', W / 2, 135); g.font = `900 138px ${FONT}`; g.strokeText('IS TYPING...', W / 2, 290); g.fillText('IS TYPING...', W / 2, 290); }, 12, 5.0);
  const typeDots = [0, 1, 2].map((k) => { const d = new THREE.Mesh(new THREE.CircleGeometry(.5, 16), basic({ color: 0xffffff })); d.position.set(-1.0 + k * 1.0, -4.5, .05); bubCrush.add(d); return d; });

  // sweat, poof, stars
  const sweat = new Particles(S, 24, 0x8fdcff, .055, { rough: .1, emissive: 0x1c4a66 });
  const puffs = new Particles(S, 330, 0xffffff, .5, { rough: 1, emissive: 0x333344 }), stars = new Particles(S, 220, 0xffe03a, .13, { rough: .4, emissive: 0xb08a00 });
  // Gary's winning case
  const winCase = mkClosedCase(1.05, .7, .3); S.add(winCase); winCase.visible = false; winCase.traverse((m) => { if (m.isMesh) m.castShadow = true; });

  // ------------------------------------------------------------------ elimination schedule
  const order = []; for (let i = 0; i < 100; i++) if (i !== G) order.push(i); for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
  const deathT = new Array(100).fill(1e9); let kk = 0; const WAVES = [[1, 40, 1.55, 2.9], [2, 20, 1.0, 2.2], [3, 39, 3.3, 4.3]]; const waveIdx = [];
  for (const [bi, n, a, b] of WAVES) { const idx = []; for (let j = 0; j < n; j++) { const u = (j + .5) / n; deathT[order[kk]] = BS[bi] + a + (b - a) * clamp(u + (rnd() - .5) / n * .7); idx.push(order[kk]); kk++; } waveIdx.push(idx); }
  const BUZZ0 = BS[1] + .1; const lightT = Array.from({ length: 100 }, (_, i) => BUZZ0 + (9 - Math.floor(i / 10)) * .06 + (i % 10) * .012);
  const sortedD = deathT.filter((d) => d < 1e8).sort((a, b) => a - b);
  const aliveAt = (t) => { let n = 100; for (const d of sortedD) if (d <= t) n--; return n; };
  const lastDeathBefore = (t) => { let L = -9; for (const d of sortedD) if (d <= t) L = d; return L; };
  // kill feed
  const NAMES = ['DAVE', 'KEVIN', 'BRAD', 'CHAD', 'TODD', 'DEREK', 'STEVE', 'KYLE', 'DEAN', 'BRIAN', 'TYLER', 'SHANE', 'MARCUS', 'JEFF', 'DOUG', 'LARRY', 'ROGER', 'TREVOR', 'WAYNE', 'RANDY', 'GREG', 'CARL'];
  const CAUSE1 = ['touched his phone', 'was eliminated by A TIKTOK', 'just checked the time', 'opened an AMAZON ALERT', 'said "hello?"', 'was eliminated by THE WEATHER APP', 'lunged. no regrets', 'was eliminated by A DOG VIDEO'];
  const CAUSE2 = ['was eliminated by MOM', 'texted back "hi mom"', 'was eliminated by A VOICEMAIL', 'called MOM back'];
  const CAUSE3 = ['was eliminated by HIS CRUSH', 'dove for the phone', 'was eliminated by TYPING DOTS', 'said "wait what"', 'forgot the rules', 'replied in 0.2 seconds'];
  const feedAll = []; { let ni = 0; const add = (idx, picks, C) => picks.forEach((k, m) => feedAll.push([deathT[idx[k]], `<b>${NAMES[ni++ % NAMES.length]}</b> ${C[m % C.length]}`])); add(waveIdx[0], [0, 5, 11, 18, 26, 36], CAUSE1); add(waveIdx[1], [0, 6, 13, 19], CAUSE2); add(waveIdx[2], [0, 7, 15, 23, 31, 38], CAUSE3); feedAll.push([BS[4] + .2, '<b>GARY</b> is the LAST ONE STANDING']); }

  // ------------------------------------------------------------------ camera shots [t0, t1, from, to, ease, shake]  (cam = px,py,pz,tx,ty,tz,fov,roll)
  const FX = px[92], FZ = pz[92], F2X = px[96], F2Z = pz[96], F3X = px[91], F3Z = pz[91];
  const SH = [
    [ // beat 0 : giant reveal
      [0, 2.45, [-12, 42, 78, 0, 5, -18, 52, .0], [7, 24, 50, 0.5, 4, -10, 55, .03], 'smooth', .03],
      [2.45, 3.6, [FX + 2.2, 2.35, FZ + 8.5, FX - .1, 1.6, FZ + .3, 44, .11], [FX + .35, 2.0, FZ + 4.1, FX - .05, 1.55, FZ + .3, 40, .13], 'lin', .04],
      [3.6, 4.4, [-9, 1.7, 29, 6, 2.2, 8, 62, -.12], [-2, 1.9, 26, 8, 2.2, 6, 60, -.2], 'lin', .06],
      [4.4, 7.5, [0, 5.5, 33, 0, 5.2, -30, 56, 0], [0, 9.5, -4, 0, 5, -30, 54, 0], 'smooth', .03]],
    [ // beat 1 : phones buzz, 40 lunge
      [0, 1.45, [-36, 17, 44, 1, 1.4, 6, 54, .08], [-25, 12, 36, 1, 1.4, 6, 54, .04], 'smooth', .05],
      [1.45, 2.7, [-1, 4.8, 37, .85, 2.2, 8, 52, .12], [2, 4.2, 29, .85, 2.2, 8, 50, -.1], 'lin', .08],
      [2.7, 4.1, [32, 21, 32, 0, 2, 2, 55, -.07], [19, 13, 25, 0, 2, 2, 54, -.03], 'smooth', .06]],
    [ // beat 2 : MOM
      [0, 1.0, [0, 1.4, 33, 0, 10.5, 4, 62, .08], [.5, 1.9, 28, 0, 10.5, 4, 60, .05], 'lin', .05],
      [1.0, 2.73, [-19, 6, 31, 3, 2, 4, 56, -.1], [-8, 4, 27, 3, 2, 4, 54, .1], 'lin', .09]],
    [ // beat 3 : crush typing, everyone dives
      [0, 1.35, [0, 6, 42, 0, 9.5, 4, 58, -.05], [0, 8, 25, 0, 9.5, 4, 56, .03], 'smooth', .04],
      [1.35, 2.35, [F2X + 2.2, 2.45, F2Z + 7.2, F2X - .05, 1.8, F2Z + .3, 42, .1], [F2X + .3, 2.05, F2Z + 3.3, F2X - .05, 1.8, F2Z + .3, 38, .12], 'lin', .04],
      [2.35, 3.3, [F3X - 1.6, 1.9, F3Z + 3.2, F3X, 1.95, F3Z + .2, 36, -.14], [F3X - .3, 2.0, F3Z + 2.0, F3X, 1.97, F3Z + .2, 32, -.16], 'lin', .04],
      [3.3, 4.77, [2, 23, 46, .8, 0, 6, 55, .05], [-1, 40, 58, .8, 0, 8, 55, .0], 'smooth', .05]],
    [ // beat 4 : lone sweaty finalist
      [0, 1.15, [0, 31, 64, 0, 1.2, 14, 50, 0], [0, 15, 42, 0, 1.6, 16, 48, 0], 'smooth', .03],
      [1.15, 2.3, [1.8, 2.4, 22.5, 0, 1.9, 16.4, 40, .09], [.4, 2.2, 19.8, 0, 1.95, 16.4, 38, .1], 'lin', .04],
      [2.3, 3.41, [.35, 2.25, 19.3, 0, 2.1, 16.4, 32, -.08], [.06, 2.2, 18.5, 0, 2.1, 16.4, 30, -.1], 'lin', .05]],
    [ // beat 5 : win, phone, no messages
      [0, 1.4, [0, .9, 25, 0, 3.0, 16.4, 54, -.05], [0, 2.3, 21.5, 0, 3.0, 16.4, 52, .05], 'lin', .03],
      [1.4, 2.8, [3.4, 2.7, 22.5, 0, 1.5, 17, 46, .08], [1.6, 2.4, 20.2, 0, 1.5, 17, 44, .04], 'lin', .04],
      [2.8, 4.77, [0, 3.2, 18.5, 0, .95, 17.45, 40, 0], [0, 3.6, 19.6, 0, 1.2, 17.3, 42, 0], 'smooth', .015]],
  ];
  const ease = (k, u) => k === 'lin' ? u : k === 'out' ? 1 - Math.pow(1 - u, 3) : smooth(u);
  const camAt = (bi, lt) => { const L = SH[Math.min(bi, 5)]; let s = L[L.length - 1]; for (const x of L) if (lt >= x[0] && lt < x[1]) { s = x; break; } const u = clamp((lt - s[0]) / (s[1] - s[0])), e = ease(s[4], u); const a = s[2], b = s[3]; const o = a.map((v, i) => lerp(v, b[i], e)); const sh = s[5], q = lt * 9; o[0] += Math.sin(q * 1.3) * sh; o[1] += Math.sin(q * 1.9 + 1) * sh * .7; o[2] += Math.sin(q * 1.1 + 2) * sh * .5; o[7] += Math.sin(q * .8) * sh * .05; return o; };

  // ------------------------------------------------------------------ labels, hud style
  { const s = document.createElement('style'); s.textContent = '#alive{right:auto!important;left:36px!important;top:150px!important;width:auto!important;padding:6px 26px 10px 18px!important;border-left-width:12px!important;transform-origin:0 0;background:rgba(14,14,24,.88)!important}#alive small{font-size:36px!important;letter-spacing:6px!important}#alive b{font-size:176px!important;line-height:.95!important}#mm,#day{display:none!important}#feed{width:640px!important}#feed div{font-size:31px!important;padding:8px 16px!important}'; document.head.appendChild(s); }
  const LAB = [[[.15, 1.7, '100 PEOPLE'], [1.75, 2.6, 'ONE RULE'], [2.65, 4.3, "DON'T TOUCH!"], [4.4, 5.8, 'LAST ONE WINS'], [5.9, 7.5, '$100,000']], [[.1, 1.4, 'PHONES BUZZING!'], [1.45, 4.1, '40 OUT!']], [[.05, 1.0, 'TEXT FROM MOM'], [1.0, 2.8, '20 OUT!']], [[.2, 3.2, 'CRUSH IS TYPING'], [3.25, 4.8, 'EVERYONE OUT!']], [[.1, 1.2, '1 LEFT.'], [1.3, 3.5, 'SWEATING...']], [[.1, 1.4, 'GARY WINS!'], [1.5, 2.9, 'CHECKS PHONE'], [3.0, 4.8, 'NO MESSAGES']]];
  const backOut = (u) => { const c = 2.2; u = clamp(u); return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); };

  const D = new THREE.Object3D(); const zero = new THREE.Matrix4().makeScale(0, 0, 0);
  const SCR = [0xffffff, 0x59d1ff, 0xffe14a, 0x62ff9a, 0xff6bd6]; const col = new THREE.Color();
  let lastShock = null;

  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, NB - 1);
    const alive = aliveAt(t); const lastD = lastDeathBefore(t);
    // ---- camera
    const C = camAt(bi, lt); st.cam(...C); st.follow(0, -6);
    const shock = t > BS[0] + 4.3; if (shock !== lastShock) { crowd.setFace(shock ? 'shock' : 'calm'); lastShock = shock; }
    // ---- people
    for (let i = 0; i < 100; i++) { const o = crowd.p[i]; const d = deathT[i], dead = t >= d;
      o.vis = !dead || i === G; o.anim = 'idle'; o.speed = 1; o.arms = null; o.extra = 0; o.pitch = 0; o.y = 0; o.scale = 1; o.lie = 0; o.x = px[i]; o.z = pz[i]; o.yaw = yawJ[i];
      if (i === G) continue;
      if (bi >= 1 && !dead) { const sh = Math.sin(t * 34 + i * 1.7); o.extra = .035;
        if (i % 2) o.arms = { lx: -2.75 + .14 * sh, rx: -2.75 - .14 * sh, lz: .12, rz: -.12 }; else o.arms = { lx: .25 * sh, rx: -.25 * sh };
        const u = clamp((t - (d - .42)) / .42); if (u > 0) { o.anim = 'bend'; o.speed = 1.7; o.z += .38 * smooth(u); o.arms = { lx: -1.45, rx: -1.45 }; } } }
    // Gary
    { const o = crowd.p[G]; o.vis = true; const gl = bi >= 5 ? lt : -1;
      if (bi >= 1 && bi <= 3) { const sh = Math.sin(t * 36); o.extra = .04; o.arms = { lx: -2.75 + .14 * sh, rx: -2.75 - .14 * sh, lz: .12, rz: -.12 }; }
      if (bi === 3 && lt > 2.9) { o.anim = 'bend'; o.speed = 1.2; o.z += .3 * smooth((lt - 2.9) / .35) * 0; o.arms = { lx: -1.2, rx: -1.2 }; o.anim = 'idle'; o.pitch = .55 * smooth((lt - 2.9) / .4); }
      if (bi === 4) { const sh = Math.sin(t * 50); o.extra = .06; o.pitch = .22 + .05 * Math.sin(t * 3); o.arms = { lx: -1.0 + .1 * sh, rx: -1.0 - .1 * sh, lz: .03, rz: -.03 }; }
      if (bi === 5) {
        if (gl < 1.4) { o.anim = 'jump'; o.speed = 1.0; o.arms = { lx: -2.9, rx: -2.9, lz: .03, rz: -.03 }; }
        else { const u = smooth((gl - 1.4) / .5); o.anim = 'idle'; o.pitch = .1 + .3 * u + (gl > 3.0 ? .0 * smooth((gl - 3.1) / 1.0) : 0); o.arms = { lx: lerp(-2.9, -1.0, u), rx: lerp(-2.9, -1.0, u) }; if (gl > 3.0) { o.arms.lx = -.35; o.arms.rx = -.35; } } } }
    crowd.update(t);
    // ---- winning case
    { const o = crowd.p[G]; if (bi === 5 && lt < 1.6) { winCase.visible = true; attach(winCase, o, 'handL', [.4, -.5, 0], [2.9, 0, 0]); winCase.visible = true; }
      else if (bi === 5) { const dt = lt - 1.5; const db = dropBounce(3.3, 2, dt, .3); winCase.visible = true; winCase.matrixAutoUpdate = true; winCase.position.set(1.15, .35 + db.y, 16.7); winCase.rotation.set(0, .5, 0); winCase.updateMatrix(); }
      else winCase.visible = false; }
    // ---- tables / phones / glow / notif
    const camQ = cam.quaternion;
    for (let i = 0; i < 100; i++) { const x = px[i], z = pz[i] + TZ, d = deathT[i]; const dead = t >= d; const tzs = z;
      D.position.set(x, .4, z); D.rotation.set(0, 0, 0); D.scale.set(1, 1, 1); D.updateMatrix(); tables.setMatrixAt(i, D.matrix);
      const lit = t >= lightT[i] && !dead, flicker = lit ? Math.floor(t * 13 + i * .7) : 0;
      const deadFlash = dead && t - d < .5;
      let jx = 0, jz = 0, jy = 0, jr = 0; if (lit) { jx = Math.sin(t * 75 + i) * .03; jz = Math.sin(t * 61 + i * 2) * .03; jr = Math.sin(t * 66 + i) * .09; }
      const hid = i === G; D.position.set(x + jx, PY, z + jz); D.rotation.set(-TILT, jr * .2, jr); D.scale.set(1, 1, 1); D.updateMatrix();
      if (hid) { phoneBody.setMatrixAt(i, zero); phoneScr.setMatrixAt(i, zero); } else { phoneBody.setMatrixAt(i, D.matrix); Mtmp.multiplyMatrices(D.matrix, Mz); phoneScr.setMatrixAt(i, Mtmp); }
      let sc; if (lit) { sc = SCR[flicker % 5]; col.set(sc); } else if (deadFlash) col.set(0xff2b2b); else if (dead) col.set(0x070d1a); else col.set(t < BUZZ0 ? 0x2a58c8 : 0x2a58c8);
      phoneScr.setColorAt(i, col);
      // glow disc
      const gs = lit ? 1.55 + .35 * Math.sin(t * 22 + i) : deadFlash ? 1.4 : dead ? 0 : .8 + .08 * Math.sin(t * 2 + i); D.position.set(x, .815, z); D.rotation.set(-Math.PI / 2, 0, 0); D.scale.set(gs, gs, gs); D.updateMatrix(); glow.setMatrixAt(i, hid ? zero : D.matrix); if (lit) col.set(SCR[flicker % 5]); else if (deadFlash) col.set(0xff2b2b); else col.set(0x2f62ff); glow.setColorAt(i, col);
      // notification bubble (billboard)
      const nu = (t - lightT[i] - .1) / .25; const nvis = lit && !hid && nu > 0; const ns = nvis ? backOut(nu) * (.85 + .1 * Math.sin(t * 12 + i)) : 0;
      D.position.set(x + .95, 1.7 + .08 * Math.sin(t * 9 + i), z); D.quaternion.copy(camQ); D.scale.set(ns, ns, ns); D.updateMatrix(); notif.setMatrixAt(i, ns > 0 ? D.matrix : zero); D.quaternion.identity(); }
    for (const m of [tables, phoneBody, phoneScr, glow, notif]) m.instanceMatrix.needsUpdate = true; phoneScr.instanceColor.needsUpdate = true; glow.instanceColor.needsUpdate = true;
    // hero phone
    { const x = px[G], z = pz[G] + TZ; const buzz = bi >= 1 && bi <= 3, tremble = bi === 4;
      const jx = buzz ? Math.sin(t * 75) * .03 : tremble ? Math.sin(t * 60) * .012 : 0, jr = buzz ? Math.sin(t * 66) * .09 : tremble ? Math.sin(t * 58) * .03 : 0;
      hero.position.set(x + jx, PY, z); hero.rotation.set(-TILT, jr * .2, jr, 'YXZ'); hero.updateMatrix();
      const key = bi === 5 && lt >= 3.0 ? 'nomsg' : 'lock'; drawHero(key); heroTex.needsUpdate = true;
      const gs = key === 'nomsg' ? .9 : bi >= 4 ? 1.4 + .25 * Math.sin(t * 6) : buzz ? 1.55 + .35 * Math.sin(t * 22) : .8; heroGlow.position.set(x, .816, z); heroGlow.scale.set(gs, gs, gs); heroGlow.material.color.set(key === 'nomsg' ? 0x7a7a98 : bi >= 4 || buzz ? 0xb8c8ff : 0x2f62ff); }
    // ---- bubbles
    const faceCam = (g) => g.quaternion.copy(camQ);
    { const mv = bi === 2 && lt < 2.73; bubMom.visible = mv; if (mv) { const s = backOut(lt / .35) * 1.0 * (1 + .04 * Math.sin(lt * 10)) * (lt > 2.2 ? Math.max(0, 1 - (lt - 2.2) / .5) : 1); bubMom.position.set(0, 11.5 + .3 * Math.sin(lt * 5), 5); bubMom.scale.setScalar(Math.max(.001, s)); faceCam(bubMom); bubMom.rotateZ(.04 * Math.sin(lt * 14)); }
      const cv = bi === 3; bubCrush.visible = cv; if (cv) { const s = backOut((lt - .3) / .4) * (lt > 3.3 ? Math.max(0, 1 - (lt - 3.3) / .45) : 1); bubCrush.position.set(0, 11.5 + .3 * Math.sin(lt * 4), 5); bubCrush.scale.setScalar(Math.max(.001, s)); faceCam(bubCrush); typeDots.forEach((dd, k) => { const q = .75 + .5 * Math.max(0, Math.sin(lt * 9 - k * 1.1)); dd.scale.setScalar(q * 1.2); }); } }
    // ---- poof + stars + sweat + sparks
    puffs.clear(); stars.clear(); let pi = 0, si = 0;
    for (let i = 0; i < 100; i++) { const dt = t - deathT[i]; if (dt < 0 || dt > .75 || i === G) continue; const u = dt / .75, x = px[i], z = pz[i] + .35;
      for (let k = 0; k < 6 && pi < puffs.n; k++) { const a = k / 6 * 6.283 + i, rd = .3 + u * 1.5, y = 1.0 + (k % 3) * .45 + u * 1.2; puffs.set(pi++, x + Math.cos(a) * rd, y, z + Math.sin(a) * rd * .8, (1 - u) * (1.0 + .3 * (k % 2)) * Math.min(1, u * 8 + .3)); }
      for (let k = 0; k < 4 && si < stars.n; k++) { const a = k / 4 * 6.283 + i * 2, rd = u * 2.8; stars.set(si++, x + Math.cos(a) * rd, 1.6 + u * 2.6 + k * .2, z + Math.sin(a) * rd, (1 - u) * 1.3); } }
    puffs.done(); stars.done();
    for (let k = 0; k < 24; k++) { const u = ((t * 1.3 + k * .0417) % 1); const on = bi === 4 || (bi === 3 && lt > 3.0) ? 1 : 0; sweat.set(k, px[G] + Math.sin(k * 2.7) * .28, 2.35 - u * 1.3, pz[G] + .24 + Math.cos(k * 1.9) * .08, on ? (1 - u * .3) * .6 : 0); } sweat.done();
    for (let k = 0; k < 50; k++) { const u = ((t * .35 + k * .02) % 1); sparks.set(k, Math.cos(k * 2.3) * 6, 6.5 + u * 9, PODZ + Math.sin(k * 3.1) * 2.5, bi === 0 || bi === 5 ? 1 : 0); } sparks.done();
    // ---- props anim
    cones.forEach((c, i) => { c.gr.rotation.z = Math.sin(t * .8 + i * 1.3) * .35 + Math.cos(c.a) * .45; c.gr.rotation.x = Math.cos(t * .7 + i) * .3 - Math.sin(c.a) * .45; });
    podium.userData.beam.material.opacity = .13 + .05 * Math.sin(t * 4); podGlow.intensity = 70 + 20 * Math.sin(t * 5);
    const lone = alive <= 1 ? 1 : 0; const ramp = lone * clamp((t - (deathT[order[98]] ?? 0)) / 1.2); garySpot.intensity = ramp * 450; garySpot.position.set(0, 22, 26); garySpot.target.position.set(px[G], 1.5, pz[G]); garyBeam.position.set(px[G], 20, pz[G]); garyBeam.material.opacity = ramp * .07;
    globalThis.__post.pm.uniforms.amt.value = 4;
    st.render();
    // ---- HUD
    const feed = []; for (const f of feedAll) { const a = t - f[0]; if (a >= 0 && a < 2.8) feed.push([f[1], 0, a > 2.4 ? 1 - (a - 2.4) / .4 : 1]); } const fd = feed.slice(-4);
    hud.royale(true, alive, '', fd, null); hud.counter('', '', '');
    const al = $('alive'); const pu = 1 + .3 * Math.max(0, 1 - (t - lastD) / .22) * (lastD > -1 ? 1 : 0); al.style.transform = `scale(${pu})`; $('aliveN').style.color = alive <= 1 ? '#ffd92a' : (t - lastD < .25 ? '#ff4b4b' : '#ffffff'); al.style.display = bi >= 0 ? 'block' : 'none';
    let lab = '', lt0 = 0; for (const l of LAB[bi]) if (lt >= l[0] && lt < l[1]) { lab = l[2]; lt0 = l[0]; } hud.pop(lab, 1);
    const pe = $('pop'); const k = backOut((lt - lt0) / .22); pe.style.transform = `scale(${lab ? .6 + .4 * k : 1}) rotate(${lab ? (((lt0 * 7) % 3) - 1.5) * 1.4 : 0}deg)`;
  } };
}
