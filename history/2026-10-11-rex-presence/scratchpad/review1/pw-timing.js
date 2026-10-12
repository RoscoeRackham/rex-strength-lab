const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const URL = pathToFileURL('/home/user/rex-strength-lab/rex-strength-lab/dist/preview.html').href;
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const cases = [
    { name: 'jump real inf', st: { inf: true, mode: 'real', action: 'jump', group: 'solo' } },
    { name: 'throw car real inf', st: { inf: true, mode: 'real', action: 'throw', obj: 'car', group: 'solo' } },
    { name: 'jump comic inf sand', st: { inf: true, mode: 'comic', action: 'jump', surface: 'sand', group: 'solo' } },
    { name: 'throw car comic inf sand', st: { inf: true, mode: 'comic', action: 'throw', obj: 'car', surface: 'sand', group: 'solo' } },
    { name: 'jump real inf sand', st: { inf: true, mode: 'real', action: 'jump', surface: 'sand', group: 'solo' } },
  ];
  for (const cs of cases) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errs = [];
    page.on('pageerror', (e) => errs.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await page.addInitScript((st) => {
      if (!sessionStorage.getItem('seeded')) { localStorage.setItem('rex-lab-v1', JSON.stringify(st)); sessionStorage.setItem('seeded', '1'); }
      window.__long = [];
      new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__long.push(Math.round(e.duration)); }).observe({ type: 'longtask', buffered: true });
    }, cs.st);
    const t0 = Date.now();
    await page.goto(URL);
    await page.waitForFunction(() => !document.querySelector('#bay') || !/Working out the courtesy ceiling/.test(document.querySelector('#bay').innerText), null, { timeout: 120000 });
    const tLoad = Date.now() - t0;
    const longLoad = await page.evaluate(() => { const l = window.__long.slice(); window.__long.length = 0; return l; });
    // choose ceiling preset, measure the synchronous handler time
    const tSel = await page.evaluate(() => { const s = document.querySelector('#effort'); const a = performance.now(); s.value = 'ceiling'; s.dispatchEvent(new Event('change')); return Math.round(performance.now() - a); });
    await page.waitForFunction(() => !/Working out the courtesy ceiling/.test(document.querySelector('#bay').innerText), null, { timeout: 120000 });
    const longSel = await page.evaluate(() => window.__long.slice());
    const read = await page.evaluate(() => (document.querySelector('.effort-read') || {}).innerText);
    console.log(cs.name, '| load+plan', tLoad, 'ms; long tasks on load', JSON.stringify(longLoad), '| ceiling handler sync', tSel, 'ms; long tasks after', JSON.stringify(longSel), errs.length ? 'ERR ' + errs.join(';') : '');
    console.log('   ', (read || '').split('\n').slice(0, 3).join(' / ').slice(0, 300));
    await page.close();
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
