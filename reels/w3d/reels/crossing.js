import { drakeLook, makeBubble } from './_drake.js';
// What if Drake became your school crossing guard? Parody caricature. Gags: apologizes to sign/traffic, minivan, 1 kid in 40 min, cop hug, 2031, school moves.
export default async function build({ lib, tl, hud }) {
  const { THREE, makeStage, buildStreet, addBox, mat, Crowd, clamp, smooth, lerp, attach } = lib;
  const st = makeStage({ shadowExtent: 50, fogNear: 120, fogFar: 520, sunDir: [-.5, .8, -.3], sunI: 2.9 }); const S = st.scene; const city = buildStreet(S, { seed: 4 }); city.cars.forEach((c) => (c.m.visible = false)); 
  // zebra crossing
  for (let i = -6; i <= 6; i++) { const z = new THREE.Mesh(new THREE.PlaneGeometry(.7, 3), mat(0xf4f4f0)); z.rotation.x = -Math.PI / 2; z.position.set(i * 1.0, .035, 20); z.receiveShadow = true; S.add(z); }
  const NC = 14; const cars = city.cars.slice(0, NC); // reuse street cars as the waiting queue
  const school = addBox(S, 14, 4, 22, 9, 8, 14, 0xc9b08a); addBox(S, 14, 8.6, 22, 9.6, 1.2, 14.6, 0x8a3b2a); const flagT = addBox(S, 9.2, 5, 14, .12, 10, .12, 0xdddddd);
  const crowd = new Crowd(S, 10, 12); const P = crowd.p; const H = P[0], KID = P[1], COP = P[2]; const look = drakeLook(lib, S, crowd, 0, { jersey: 0x1f5a3a });
  const col = (i, k, c) => { crowd.parts[k].setColorAt(i, new THREE.Color(c)); crowd.parts[k].instanceColor.needsUpdate = true; };
  ['torso', 'armL', 'armR'].forEach((k) => col(1, k, 0xf2762e)); ['legL', 'legR'].forEach((k) => col(1, k, 0x2a2f3c)); ['torso', 'armL', 'armR'].forEach((k) => col(2, k, 0x2a4f9a)); ['legL', 'legR'].forEach((k) => col(2, k, 0x1b2238)); for (let i = 3; i < 10; i++) { ['torso', 'armL', 'armR'].forEach((k) => col(i, k, [0xe84a8a, 0x3c8fe8, 0xf2d03c, 0x2ea84f][i % 4])); ['legL', 'legR'].forEach((k) => col(i, k, 0x2a2f3c)); }
  const vest = addBox(S, 0, 0, 0, .64, .62, .36, 0xd6ff2e, { cast: false }); const sign = new THREE.Group(); { const pole = new THREE.Mesh(new THREE.CylinderGeometry(.02, .02, 1.3, 6), mat(0x555555)); pole.position.y = -.2; const oct = new THREE.Mesh(new THREE.CylinderGeometry(.3, .3, .03, 8), mat(0xd22b2b)); oct.rotation.x = Math.PI / 2; oct.rotation.z = Math.PI / 8; oct.position.y = .5; const cv = document.createElement('canvas'); cv.width = cv.height = 128; const g = cv.getContext('2d'); g.fillStyle = '#d22b2b'; g.fillRect(0, 0, 128, 128); g.fillStyle = '#fff'; g.font = '900 44px Liberation Sans, Arial'; g.textAlign = 'center'; g.fillText('STOP', 64, 78); const tx = new THREE.CanvasTexture(cv); const face = new THREE.Mesh(new THREE.PlaneGeometry(.52, .52), new THREE.MeshBasicMaterial({ map: tx })); face.position.set(0, .5, .02); sign.add(pole, oct, face); sign.traverse((m) => (m.castShadow = true)); S.add(sign); }
  const bHero = makeBubble(lib, S, 1.0, .4), bMom = makeBubble(lib, S, .9, .36), bKid = makeBubble(lib, S, .8, .32);
  const dayT = (() => { const c = document.createElement('canvas'); c.width = 512; c.height = 160; const g = c.getContext('2d'); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return { c, g, t }; })(); const dayboard = new THREE.Mesh(new THREE.PlaneGeometry(5, 1.5), new THREE.MeshBasicMaterial({ map: dayT.t })); dayboard.visible = false; S.add(dayboard); const drawD = (txt) => { dayT.g.fillStyle = '#1b3a8a'; dayT.g.fillRect(0, 0, 512, 160); dayT.g.fillStyle = '#fff'; dayT.g.font = '900 96px Liberation Sans, Arial'; dayT.g.textAlign = 'center'; dayT.g.fillText(txt, 256, 118); dayT.t.needsUpdate = true; }; drawD('DAYTON 212 mi');
  const place = (o, x, z, yaw, anim = 'idle', sp = .4, sc = 1.25) => { o.x = x; o.z = z; o.yaw = yaw; o.anim = anim; o.y = 0; o.speed = sp; o.vis = true; o.scale = sc; };
  const HZ = 20, HX = -2.2; const POP = ['', 'SORRY TO THE SIGN', 'LATE. SAME.', 'DAYTON', "WHO'S IN CHARGE", '2031', 'STILL SORRY'];
  const NOTE = ['', 'sorry to the concept of traffic', 'she said late. he said same', 'one kid. 40 minutes.', 'nobody knows who is in charge', 'take your time', 'the school moved'];
  return { frame({ t, bi, lt, p }) {
    bi = Math.min(bi, 6); for (let i = 0; i < 10; i++) { P[i].vis = false; P[i].arms = null; P[i].pitch = 0; P[i].extra = 0; } [bHero, bMom, bKid].forEach((b) => b.hide()); dayboard.visible = false;
    place(H, HX, HZ, Math.PI, 'idle'); const holdUp = { lx: -.2, lz: -.1, rx: -2.9, rz: .1 }; H.arms = holdUp;
    // queue of cars waiting behind him: grows through the beats
    const qn = bi < 2 ? 2 : bi === 2 ? 3 : bi === 3 ? 14 : 14; cars.forEach((c, i) => { c.m.visible = i < qn; c.m.position.set(HX, 0, 12.5 - i * 6.2); c.m.rotation.y = 0; });
    let cam = [3.6, 1.8, 14.5, HX, 1.7, HZ, 46];
    if (bi === 0) { H.arms = { lx: -.2, lz: -.1, rx: -2.9, rz: .1 }; }
    else if (bi === 1) { const k = Math.floor(lt / 2.4) % 3; H.pitch = .25 * Math.sin(lt * 3); H.arms = { lx: -.2, lz: -.1, rx: -2.9, rz: .1 }; bHero.show(['sorry', 'sorry', 'TRAFFIC'][k], HX + .6, 3.3, HZ); if (k === 0) H.yaw = Math.PI + .0; cam = [3.4, 1.9, 14.0, HX, 1.8, HZ, 44]; }
    else if (bi === 2) { H.pitch = .5; H.arms = { lx: -.4, lz: -.1, rx: -2.9, rz: .1 }; place(H, HX + .8, 14.8, Math.PI + .5, 'idle'); H.pitch = .5; bMom.show(lt > 2.2 ? 'late' : '...', HX - .6, 2.4, 12.5); if (lt > 3.6) bHero.show('same', HX + .8, 3.2, 14.8); cam = [4.4, 1.7, 10.5, HX, 1.4, 13.5, 46]; }
    else if (bi === 3) { place(KID, lerp(-6.5, -2.9, smooth(clamp(lt / 14))), HZ - .6, Math.PI / 2, 'walk', .12, 1.1); KID.speed = .12; H.arms = holdUp; const u = clamp(lt / 12); cam = [3.2 + 5 * u, 1.7 + 3 * u, 13.5 - 2 * u, -2.5, 1.4, HZ, 52]; dayboard.visible = true; dayboard.position.set(HX + 4, 6, 12.5 - 12 * 6.2 * clamp(lt / 6)); dayboard.rotation.y = Math.PI; }
    else if (bi === 4) { const u = smooth(clamp(lt / 4)); place(COP, lerp(-6.5, HX - .6, u), HZ, Math.PI / 2, u < 1 ? 'walk' : 'idle'); if (u >= 1) { COP.yaw = Math.PI - .8; H.x = HX + .3; H.yaw = Math.PI + .8; H.arms = { lx: -1.5, lz: .3, rx: -1.5, rz: -.3 }; COP.arms = { lx: -1.5, lz: .3, rx: -1.5, rz: -.3 }; } cam = [1.6, 1.8, 14.5, HX, 1.5, HZ, 44]; }
    else if (bi === 5) { for (let i = 3; i < 8; i++) place(P[i], -5.5 + (i - 3) * .5, HZ + 1.0 + (i % 2) * .5, Math.PI / 2, 'idle', .4, 1.0 + clamp(lt / 6) * .55); P[3].vis = true; cam = [-3.6, 1.9, 15.5, -4.2, 1.5, HZ, 50]; if (lt > 4.5) bHero.show('take your time', HX + .6, 3.3, HZ); }
    else { place(H, HX, HZ, Math.PI, 'idle'); H.arms = holdUp; H.pitch = .25 * Math.sin(lt * 3); bHero.show('sorry', HX + .6, 3.3, HZ); cam = [3.6, 1.8, 14.5, HX, 1.7, HZ, 46]; school.position.set(lerp(14, 10.5, smooth(clamp(lt / 3))), 4, 24); }
    if (bi < 6) school.position.set(14, 4, 24);
    crowd.update(t); city.updateCrowd(t, null); look.update(); attach(vest, H, 'torso', [0, 0, 0]); vest.visible = true; attach(sign, H, 'handR', [0, -.05, .05], [Math.PI / 2 - .2, 0, 0]);
    st.cam(...cam); st.follow(HX, HZ); st.render();
    const kids = Math.floor(bi >= 3 ? (bi === 3 ? lt / 14 : 1) : 0), cw = qn * 3 + Math.floor(bi >= 3 ? lt * 2 : 0), mins = bi >= 3 ? Math.round(lerp(0, 40, bi === 3 ? clamp(lt / 12) : 1)) : 0, yr = bi === 5 ? Math.floor(lerp(2024, 2031, clamp(lt / 7))) : bi === 6 ? 2031 : 2024;
    hud.style('C'); hud.question(bi === 0 ? 'What if *Drake* became your school crossing guard?' : '', bi === 0 ? 1 : 0);
    if (bi === 0) hud.counter('', '', ''); else hud.counter(bi >= 5 ? 'Year' : bi >= 3 ? 'Minutes · kids crossed ' + Math.min(1, kids) : 'Apologies', bi >= 5 ? String(yr) : bi >= 3 ? String(mins) : bi === 1 ? String(Math.floor(lt / 1.2) + 1) : String(3 + Math.floor(lt)), NOTE[bi], 'PARODY', bi >= 3); hud.tm('');
    hud.pop(POP[bi] && lt > .5 ? POP[bi] : '', Math.min(1, (lt - .5) * 6));
  } };
}
