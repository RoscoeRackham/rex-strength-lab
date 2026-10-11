const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const PREV = 'file://' + __dirname + '/preview.html';
const DEF = { logKg: Math.log10(100 * 907.18474), inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'throw', obj: 'car', angle: 45 };
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  for (const st of [{}, { mode: 'real' }, { mode: 'real', surface: 'gravel' }, { mode: 'comic', surface: 'sand' }, { mode: 'real', H: 50, m: 2812500 }]) {
    await page.goto(PREV);
    await page.evaluate((s) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, Object.assign({}, DEF, st));
    const t0 = Date.now();
    await page.goto(PREV);
    await page.waitForTimeout(300); await page.waitForFunction(() => (document.querySelectorAll('#ladder-viz g.mk[data-key^="R:"]').length > 0 || /Never happens/.test(document.querySelector('#ladder-never').textContent)) && !/Working out/.test(document.querySelector('#ladder-never').textContent), null, { timeout: 180000, polling: 200 });
    const t = Date.now() - t0;
    const info = await page.evaluate(() => ({ never: document.querySelector('#ladder-never').textContent, marks: [...document.querySelectorAll('#ladder-viz g.mk')].filter((g) => g.dataset.key.startsWith('R:')).map((g) => g.getAttribute('aria-label')) }));
    console.log(JSON.stringify(st), 'ladder ms', t, '\n  never:', info.never, '\n  marks:', info.marks.join(' | '));
  }
  await browser.close();
})();
