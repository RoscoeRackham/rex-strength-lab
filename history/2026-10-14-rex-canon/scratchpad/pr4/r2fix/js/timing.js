// node timing.js <rootBefore> <rootAfter> <runs>: two-player search time (reload to settled) per test, before vs after
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const [RB, RA, N] = [process.argv[2], process.argv[3], Number(process.argv[4] || 3)];
const { settle } = require(path.join(RA, 'test', 'make-page-fixture.js'));
const STATES = [['arm', { duoAction: 'arm' }], ['push', { duoAction: 'wrestle', wrestleMove: 'push' }], ['both', { duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'both' }],
  ['catch', { duoAction: 'catch' }], ['toss', { duoAction: 'catch', cObj: 'partner' }], ['charge', { duoAction: 'collide' }], ['jump 1e9', { duoAction: 'collide', colSrc: 'jump', logKg: 9 }], ['steady push', { duoAction: 'collide', colMode: 'push' }]];
const page0 = (root, tag) => { const p = path.join(__dirname, 'timing-' + tag + '.html'); fs.writeFileSync(p, '<!doctype html><html><head><meta charset="utf-8"></head><body>' + fs.readFileSync(path.join(root, 'dist', 'index.html'), 'utf8') + '</body></html>'); return p; };
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const pages = { before: page0(RB, 'before'), after: page0(RA, 'after') }, res = {};
  for (const [lab, st] of STATES) for (let i = 0; i < N; i++) for (const tag of ['before', 'after']) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(pathToFileURL(pages[tag]).href);
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), Object.assign({ duoOpen: true }, st));
    const t0 = Date.now(); await page.reload(); await settle(page, 'bay'); await settle(page, 'duo-bay');
    const dt = (Date.now() - t0) / 1000; await page.close();
    ((res[lab] = res[lab] || {})[tag] = res[lab][tag] || []).push(dt);
  }
  for (const [lab, r] of Object.entries(res)) console.log(lab.padEnd(12), 'before', r.before.map((x) => x.toFixed(1)).join(' '), '| after', r.after.map((x) => x.toFixed(1)).join(' '));
  await browser.close();
})();
