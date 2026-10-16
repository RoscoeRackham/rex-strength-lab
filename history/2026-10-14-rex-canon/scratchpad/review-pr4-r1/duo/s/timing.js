const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const D = __dirname;
const STATES = [
  ['arm', { duoAction: 'arm' }],
  ['push', { duoAction: 'wrestle', wrestleMove: 'push' }],
  ['shove', { duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'rex' }],
  ['both', { duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'both' }],
  ['throw', { duoAction: 'wrestle', wrestleMove: 'throw' }],
  ['lift', { duoAction: 'wrestle', wrestleMove: 'lift' }],
  ['catch', { duoAction: 'catch' }],
  ['toss', { duoAction: 'catch', cObj: 'partner' }],
  ['charge', { duoAction: 'collide' }],
  ['bounce', { duoAction: 'collide', colBounce: 'bounce' }],
  ['jump', { duoAction: 'collide', colSrc: 'jump' }],
  ['cpush', { duoAction: 'collide', colMode: 'push' }],
  ['charge-windows', { duoAction: 'collide', duoEffort: 'windows' }],
  ['charge-ground', { duoAction: 'collide', duoEffort: 'ground' }],
  ['charge-rattle', { duoAction: 'collide', duoEffort: 'rattle' }],
  ['push-ground', { duoAction: 'wrestle', wrestleMove: 'push', duoEffort: 'ground' }],
  ['catch-fb-windows', { duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', logKg: 14, keepForm: false, airAbsorb: 0.5, duoEffort: 'windows' }],
  ['catch-fb', { duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', logKg: 14, keepForm: false, airAbsorb: 0.5 }],
];
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  const res = {};
  const which = process.argv.slice(2);
  for (let rep = 0; rep < (Number(process.env.REPS) || 2); rep++) for (const [name, st] of STATES) for (const pg of ['pr34', 'pr35']) {
    if (which.length && !which.includes(name)) continue;
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
