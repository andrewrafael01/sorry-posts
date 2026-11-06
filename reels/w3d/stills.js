// node stills.js <reel> <timeline.json> <outPrefix> t1 t2 ...   -> <outPrefix>_<n>.png (one quick look per time)
const { chromium } = require('playwright'); const http = require('http'); const fs = require('fs'); const path = require('path');
const [reel, tlPath, prefix, ...ts] = process.argv.slice(2);
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json' };
const srv = http.createServer((req, res) => { let u = decodeURIComponent(req.url.split('?')[0]); if (u === '/') u = '/page.html'; let f = u.startsWith('/tl/') ? path.join(path.dirname(tlPath), u.slice(4)) : path.join(__dirname, u); if (!fs.existsSync(f)) { res.writeHead(404); res.end(); return; } res.writeHead(200, { 'Content-Type': mime[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res); });
(async () => {
  await new Promise((r) => srv.listen(0, r)); const port = srv.address().port;
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); p.on('pageerror', (e) => console.log('pageerror', e.message)); p.on('console', (m) => { if (m.type() === 'error') console.log('console.error', m.text()); });
  await p.goto(`http://localhost:${port}/?reel=${reel}&tl=/tl/${path.basename(tlPath)}`); await p.waitForFunction('window.ready===true', null, { timeout: 120000 });
  for (let i = 0; i < ts.length; i++) { await p.evaluate((t) => window.drawFrame(t), +ts[i]); fs.writeFileSync(`${prefix}_${i}.png`, await p.screenshot({ type: 'png' })); }
  await b.close(); srv.close();
})();
