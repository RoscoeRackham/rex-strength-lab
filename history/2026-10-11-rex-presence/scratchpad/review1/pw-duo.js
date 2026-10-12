const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const URL = pathToFileURL(process.argv[2]).href;
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const base = { group: 'duo', inf: true };
  const cases = [
    { duoAction: 'arm', mode: 'real' }, { duoAction: 'arm', mode: 'comic' },
    { duoAction: 'wrestle', wrestleMove: 'throw', mode: 'real' }, { duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'both', mode: 'comic' },
    { duoAction: 'catch', cObj: 'car', cLogD: 3, mode: 'real' }, { duoAction: 'catch', cObj: 'baseball', cLogD: 6, mode: 'comic', cStyle: 'hard' }, { duoAction: 'catch', cObj: 'piano', cLogD: 7.31, mode: 'real', cStyle: 'hard' },
    { duoAction: 'collide', colSrc: 'sprint', mode: 'real' }, { duoAction: 'collide', colSrc: 'jump', mode: 'comic' }, { duoAction: 'collide', colSrc: 'stomp', mode: 'real', surface: 'sand' },
  ];
  for (const cs of cases) {
    const st = Object.assign({}, base, cs);
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.addInitScript((st) => {
      if (!sessionStorage.getItem('seeded')) { localStorage.setItem('rex-lab-v1', JSON.stringify(st)); sessionStorage.setItem('seeded', '1'); }
      window.__long = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__long.push(Math.round(e.duration)); }).observe({ type: 'longtask', buffered: true });
    }, st);
    const t0 = Date.now();
    await page.goto(URL, { timeout: 300000 }); await page.waitForTimeout(1500);
    const r = await page.evaluate(() => ({ long: window.__long.slice(), v: (document.querySelector('.verdict') || {}).innerText }));
    console.log(JSON.stringify(cs), '| load', Date.now() - t0, 'ms; long tasks', JSON.stringify(r.long), '|', (r.v || '').slice(0, 90));
    await page.close();
  }
  await browser.close();
})();
