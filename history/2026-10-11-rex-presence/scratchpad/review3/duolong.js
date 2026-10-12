// Long tasks in the two-player tests: load a duo tab, then click the infinite chip and real muscle, until settled.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const url = pathToFileURL(__dirname + '/preview.html').href;
const configs = JSON.parse(process.argv[2]);
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const cfg of configs) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errs = [];
    page.on('pageerror', (e) => errs.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await page.addInitScript((st) => {
      if (!sessionStorage.getItem('seeded')) { localStorage.setItem('rex-lab-v1', JSON.stringify(st)); sessionStorage.setItem('seeded', '1'); }
      window.__long = [];
      new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__long.push(Math.round(e.duration)); }).observe({ type: 'longtask', buffered: true });
    }, Object.assign({ group: 'duo' }, cfg));
    const t00 = Date.now();
    await page.goto(url);
    const settle = async () => {
      const t0 = Date.now();
      for (let i = 0; i < 1800; i++) {
        const pend = await page.evaluate(() => /Working out|working it out/.test(document.querySelector('#bay').textContent));
        if (!pend) return Date.now() - t0;
        await page.waitForTimeout(100);
      }
      return 'timeout';
    };
    const report = async (label, t0) => {
      const ms = await settle();
      await page.waitForTimeout(300);
      const long = await page.evaluate(() => window.__long.slice());
      const bad = await page.evaluate(() => { const b = document.body.cloneNode(true); b.querySelectorAll('script, style').forEach((x) => x.remove()); return (b.textContent.match(/NaN|undefined|(?<![∞\w])Infinity/g) || []).join(','); });
      const txt = await page.evaluate(() => (document.querySelector('.effort-read') || { textContent: '(none)' }).textContent.slice(0, 300));
      console.log(JSON.stringify({ cfg, step: label, settleMs: ms, wallMs: Date.now() - t0, maxTask: Math.max(0, ...long), nLong: long.length, sumLong: long.reduce((a, b) => a + b, 0), bad, errs: errs.slice(0, 3), txt }));
      await page.evaluate(() => { window.__long = []; });
    };
    await report('load', t00);
    for (const [label, sel] of [['infinite chip', '#tier-chips .chip[data-id="inf"]'], ['real muscle', '#mode-real']]) {
      const t0 = Date.now();
      await page.click(sel);
      await report(label, t0);
    }
    await page.close();
  }
  await browser.close();
})();
