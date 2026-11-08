// Lively shared world for the short shock reels: beach, sea, gulls, boats, a crowd of onlookers who gather, gasp, point, jump and film on phones.
export function beachWorld(lib, o = {}) {
  const { THREE, makeStage, beach, Crowd, R, clamp, smooth, lerp, attach } = lib;
  const st = makeStage({ shadowExtent: 26, fogNear: 60, fogFar: 520, skyTop: 0x5f9fd8, skyMid: 0xb7d6ea, skyBot: 0xf2ece0, fog: 0xdfe8ec, sunDir: [-.7, .55, -.4], sunI: 3.0, clouds: false, exposure: 1.05 }); const S = st.scene;
  const bch = beach(S, { shoreZ: o.shoreZ ?? 26, dress: 2, boats: 3, gulls: 12, seed: 5 });
  const NS = o.n ?? 26; const crowd = new Crowd(S, NS, 91); const P = crowd.p; const r = R(17); const spots = [];
  for (let i = 0; i < NS; i++) { const a = -1.5 + (i / NS) * 3.0 + (r() - .5) * .1, rad = 3.2 + (i % 3) * 1.5 + r() * .5; spots.push({ a, rad, ph: r() * 6.28, kind: i % 4 }); }
  const phones = []; for (let i = 0; i < NS; i++) { const m = new THREE.Mesh(new THREE.BoxGeometry(.07, .13, .015), new THREE.MeshStandardMaterial({ color: 0x15161a, roughness: .2 })); m.visible = false; S.add(m); phones.push(m); }
  const col = (i, k, c) => { crowd.parts[k].setColorAt(i, new THREE.Color(c)); crowd.parts[k].instanceColor.needsUpdate = true; };
  const SH = [0xe74c3c, 0xf1c40f, 0x2ecc71, 0x3498db, 0x9b59b6, 0xff7aa2, 0xffffff, 0x1abc9c]; for (let i = 0; i < NS; i++) { ['torso', 'armL', 'armR'].forEach((k) => col(i, k, SH[i % SH.length])); }
  // reaction: 0 idle chatting, 1 gather+stare, 2 gasp (shock face, hands up), 3 cheer/jump, 4 film on phone
  return { st, S, bch, crowd, P, update(t, react, center = [0, 0], flip = 1) {
    bch.update(t); crowd.setFace(react === 2 ? 'shock' : 'calm');
    for (let i = 0; i < NS; i++) { const o2 = P[i], sp = spots[i]; const gather = smooth(clamp(react >= 1 ? 1 : 0)); const rad = lerp(sp.rad * 1.9 + 3, sp.rad, gather); const a = sp.a + Math.sin(t * .3 + sp.ph) * .02 * (1 - gather);
      o2.x = center[0] + Math.sin(a) * rad * 1.5; o2.z = center[1] + flip * Math.cos(a) * rad; o2.yaw = Math.atan2(center[0] - o2.x, center[1] - o2.z); o2.vis = true; o2.y = 0; o2.scale = 1.2; o2.speed = .6; o2.extra = 0; o2.pitch = 0; o2.arms = null; o2.anim = 'idle';
      if (react === 0) { o2.anim = sp.kind === 0 ? 'walk' : 'idle'; if (sp.kind === 0) { o2.x += Math.sin(t * .5 + sp.ph) * 2; } }
      else if (react === 2) { o2.arms = { lx: -2.4 + Math.sin(t * 9 + sp.ph) * .1, rx: -2.4 + Math.sin(t * 9 + sp.ph + 1) * .1, lz: .3, rz: -.3 }; o2.pitch = -.15; o2.y = Math.max(0, Math.sin(t * 7 + sp.ph)) * .08; }
      else if (react === 3) { o2.anim = 'jump'; o2.speed = 1.1; o2.arms = { lx: -2.9, rx: -2.9, lz: .2, rz: -.2 }; }
      else if (react === 4) { o2.arms = sp.kind % 2 ? { lx: -1.6, rx: -1.6, lz: .1, rz: -.1 } : { lx: -.3, rx: -.3, lz: 0, rz: 0 }; }
    }
    crowd.update(t);
    for (let i = 0; i < NS; i++) { const m = phones[i]; m.visible = react === 4 && spots[i].kind % 2 === 1; if (m.visible) attach(m, P[i], 'handR', [0, -.04, .08], [-1.4, 0, 0]); }
  } };
}
