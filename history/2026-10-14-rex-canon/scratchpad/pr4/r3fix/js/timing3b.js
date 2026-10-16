// node timing3.js <rootBefore> <rootAfter> <runs>: two-player search time (reload to settled, polled every 30 ms), before vs after
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const [RB, RA, N] = [process.argv[2], process.argv[3], Number(process.argv[4] || 3)];
const STATES = [['charge', { duoAction: 'collide' }], ['bounce', { duoAction: 'collide', colBounce: 'bounce' }]];
const page0 = (root, tag) => { const p = path.join(__dirname, 'timing3-' + tag + '.html'); fs.writeFileSync(p, '<!doctype html><html><head><meta charset="utf-8"></head><body>' + fs.readFileSync(path.join(root, 'dist', 'index.html'), 'utf8') + '</body></html>'); return p; };
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const pages = { before: page0(RB, 'before'), after: page0(RA, 'after') }, res = {};
  for (const [lab, st] of STATES) for (let i = 0; i < N; i++) for (const tag of ['before', 'after']) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(pathToFileURL(pages[tag]).href);
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), Object.assign({ duoOpen: true }, st));
    const settled = (id) => page.waitForFunction((x) => { const b = document.getElementById(x); return !!b && b.children.length > 0 && !/working it out|Working out/i.test(b.textContent); }, id, { polling: 30, timeout: 60000 });
    const t0 = Date.now(); await page.reload(); await settled('bay'); await settled('duo-bay');
    const dt = (Date.now() - t0) / 1000; await page.close();
    ((res[lab] = res[lab] || {})[tag] = res[lab][tag] || []).push(dt);
  }
  for (const [lab, r] of Object.entries(res)) console.log(lab.padEnd(20), 'before', r.before.map((x) => x.toFixed(2)).join(' '), '| after', r.after.map((x) => x.toFixed(2)).join(' '));
  for (const f of Object.values(pages)) fs.unlinkSync(f);
  await browser.close();
})();
