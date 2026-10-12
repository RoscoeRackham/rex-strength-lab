// Worst main-thread blocking: pick an effort preset, then change a setting that starts a new plan (the infinite chip,
// the muscle mode), and record every long task until the page settles.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const url = pathToFileURL(__dirname + '/preview.html').href;
const moves = (process.argv[2] || 'jump,throw').split(',');
const efforts = (process.argv[3] || 'ceiling').split(',');
const extra = JSON.parse(process.argv[4] || '{}');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const action of moves) for (const effort of efforts) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errs = [];
    page.on('pageerror', (e) => errs.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await page.addInitScript((st) => {
      if (!sessionStorage.getItem('seeded')) { localStorage.setItem('rex-lab-v1', JSON.stringify(st)); sessionStorage.setItem('seeded', '1'); }
      window.__long = [];
      new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__long.push(Math.round(e.duration)); }).observe({ type: 'longtask', buffered: true });
    }, Object.assign({ mode: 'comic', action, group: 'solo' }, extra));
    await page.goto(url);
    const settle = async () => {
      const t0 = Date.now();
      for (let i = 0; i < 1200; i++) {
        const pend = await page.evaluate(() => /Working out|working it out/.test(document.querySelector('#bay').textContent));
        if (!pend) return Date.now() - t0;
        await page.waitForTimeout(100);
      }
      return 'timeout';
    };
    await settle();
    await page.selectOption('#effort', effort);
    await settle();
    const steps = [['click infinite chip', () => page.click('#tier-chips .chip[data-id="inf"]')], ['click real muscle', () => page.click('#mode-real')], ['click comic', () => page.click('#mode-comic')]];
    for (const [label, fn] of steps) {
      await page.evaluate(() => { window.__long = []; });
      const t0 = Date.now();
      await fn();
      const ms = await settle();
      await page.waitForTimeout(200);
      const long = await page.evaluate(() => window.__long.slice());
      const bad = await page.evaluate(() => { const b = document.body.cloneNode(true); b.querySelectorAll('script, style').forEach((x) => x.remove()); return (b.textContent.match(/NaN|undefined|(?<![∞\w])Infinity/g) || []).join(','); });
      const txt = await page.evaluate(() => (document.querySelector('.effort-read') || { textContent: '(none)' }).textContent.slice(0, 220));
      console.log(JSON.stringify({ action, effort, step: label, settleMs: ms, wallMs: Date.now() - t0, maxTask: Math.max(0, ...long), nLong: long.length, sumLong: long.reduce((a, b) => a + b, 0), bad, errs: errs.slice(0, 3), txt }));
    }
    await page.close();
  }
  await browser.close();
})();
