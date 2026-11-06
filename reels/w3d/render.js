// node render.js <reel> <timeline.json> <out.mp4> [fps] [workers] [t0] [t1]
const { chromium } = require('playwright'); const http = require('http'); const fs = require('fs'); const path = require('path'); const { spawn } = require('child_process');
const [reel, tlPath, out, fps = '30', workers = '2', t0a, t1a] = process.argv.slice(2); const FPS = +fps, NW = +workers;
const tl = JSON.parse(fs.readFileSync(tlPath)); const wav = tlPath.replace(/\.json$/, '.wav');
const T0 = t0a ? +t0a : 0, T1 = t1a ? +t1a : tl.dur; const total = Math.round((T1 - T0) * FPS);
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.mjs': 'text/javascript' };
const srv = http.createServer((req, res) => { let u = decodeURIComponent(req.url.split('?')[0]); if (u === '/') u = '/page.html'; let f = u.startsWith('/tl/') ? path.join(path.dirname(tlPath), u.slice(4)) : path.join(__dirname, u); if (!fs.existsSync(f)) { res.writeHead(404); res.end(); return; } res.writeHead(200, { 'Content-Type': mime[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res); });
(async () => {
  await new Promise((r) => srv.listen(0, r)); const port = srv.address().port;
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const pages = []; for (let i = 0; i < NW; i++) { const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); p.on('pageerror', (e) => console.log('pageerror', e.message)); p.on('console', (m) => { if (m.type() === 'error') console.log('console.error', m.text()); }); await p.goto(`http://localhost:${port}/?reel=${reel}&tl=/tl/${path.basename(tlPath)}`); await p.waitForFunction('window.ready===true', null, { timeout: 120000 }); pages.push(p); }
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', ...(T0 ? ['-ss', String(T0), '-i', wav] : ['-i', wav]), '-t', String(T1 - T0), '-c:v', 'libx264', '-preset', 'fast', '-crf', '22', '-maxrate', String(Math.min(4400, Math.floor(14e6 * 8 / (T1 - T0) / 1000))) + 'k', '-bufsize', '9000k', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-af', 'volume=-6dB', '-c:a', 'aac', '-b:a', '128k', '-shortest', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const bufs = new Map(); let next = 0, written = 0;
  const flush = async () => { while (bufs.has(written)) { const bf = bufs.get(written); bufs.delete(written); if (!ff.stdin.write(bf)) await new Promise((r) => ff.stdin.once('drain', r)); written++; } };
  const t_start = Date.now();
  await Promise.all(pages.map(async (p, wi) => { for (;;) { const i = next++; if (i >= total) break; await p.evaluate((t) => window.drawFrame(t), T0 + i / FPS); const buf = await p.screenshot({ type: 'jpeg', quality: 93 }); bufs.set(i, buf); await flush(); if (i % 150 === 0) console.log('frame', i, '/', total, Math.round((Date.now() - t_start) / 1000) + 's'); } }));
  await flush(); ff.stdin.end(); await new Promise((r) => ff.on('close', r)); await b.close(); srv.close(); console.log('done', out);
})();
