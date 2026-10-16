const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const D = __dirname;
const STATES = [];
for (const [an, ext] of [['inf', { inf: true }], ['1e9', { logKg: 9 }]]) for (const [b, bx] of [['ff', {}], ['bf', { anchor: 'bolted' }]]) {
  for (const [n, st] of [['arm', { duoAction: 'arm', keepForm: false }], ['push', { duoAction: 'wrestle', wrestleMove: 'push' }], ['both', { duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'both' }], ['charge', { duoAction: 'collide' }], ['cpush', { duoAction: 'collide', colMode: 'push' }], ['catch', { duoAction: 'catch' }]])
    STATES.push([n + '-' + an + '-' + b, Object.assign({}, st, ext, bx)]);
}
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  const res = {};
  for (let rep = 0; rep < 2; rep++) for (const [name, st] of STATES) for (const pg of ['pr34', 'pr35']) {
    await page.goto(pathToFileURL(D + '/' + pg + '.html').href);
    await page.evaluate((x) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(Object.assign({ duoOpen: true }, x))); }, st);
    await page.reload();
    const t = await page.evaluate(() => new Promise((resolve) => {
      const t0 = performance.now();
      const poll = () => { const b = document.getElementById('duo-bay'); const busy = !b || !b.querySelector('.verdict, .callout') || /working it out|Working out/i.test(b.textContent); if (!busy) resolve(performance.now()); else if (performance.now() - t0 > 60000) resolve(-1); else setTimeout(poll, 20); };
      poll();
    }));
    (res[name] = res[name] || { pr34: [], pr35: [] })[pg].push(Math.round(t));
  }
  for (const [k, v] of Object.entries(res)) console.log(k.padEnd(18), 'pr34', v.pr34.join(','), ' pr35', v.pr35.join(','));
  if (errs.length) console.log('errors', errs.slice(0, 5));
  await browser.close();
})();
