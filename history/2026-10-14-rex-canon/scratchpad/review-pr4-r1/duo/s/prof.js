const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const D = __dirname;
const st = JSON.parse(process.argv[2] || '{"duoAction":"catch","cObj":"partner"}');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.addInitScript(() => {
    window.__prof = {};
    let v;
    Object.defineProperty(window, 'DinoPhys', { configurable: true, get: () => v, set: (x) => {
      for (const k of Object.keys(x)) { const f = x[k]; if (typeof f === 'function' && !/^[A-Z]/.test(k)) x[k] = function () { const t = performance.now(); try { return f.apply(this, arguments); } finally { const p = window.__prof[k] || (window.__prof[k] = { n: 0, ms: 0 }); p.n++; p.ms += performance.now() - t; } }; }
      v = x;
    } });
  });
  for (let rep = 0; rep < 2; rep++) for (const pg of ['pr34', 'pr35']) {
    await page.goto(pathToFileURL(D + '/' + pg + '.html').href);
    await page.evaluate((x) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(Object.assign({ duoOpen: true }, x))); }, st);
    await page.reload();
    const r = await page.evaluate(() => new Promise((resolve) => {
      const t0 = performance.now();
      const poll = () => { const b = document.getElementById('duo-bay'); const busy = !b || !b.querySelector('.verdict, .callout') || /working it out|Working out/i.test(b.textContent); if (!busy) resolve({ t: performance.now(), prof: window.__prof }); else setTimeout(poll, 20); };
      poll();
    }));
    const top = Object.entries(r.prof).filter(([k, p]) => p.ms > 20).sort((a, b) => b[1].ms - a[1].ms).map(([k, p]) => k + ' n' + p.n + ' ' + Math.round(p.ms) + 'ms');
    console.log(pg, Math.round(r.t), top.join('; '));
  }
  await browser.close();
})();
