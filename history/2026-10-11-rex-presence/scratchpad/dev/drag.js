// node drag.js '<json state>' tab : drag the strength dial over 12 steps, time each frame's work
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
(async () => {
  const over = JSON.parse(process.argv[2] || '{}'), tab = process.argv[3] || 'throw';
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const prev = pathToFileURL('/home/user/rex-strength-lab/rex-strength-lab/dist/preview.html').href;
  await page.goto(prev);
  await page.evaluate((o) => { localStorage.setItem('rex-lab-v1', JSON.stringify(Object.assign(JSON.parse(localStorage.getItem('rex-lab-v1') || '{}'), o))); }, over);
  await page.goto(prev); await page.waitForTimeout(1500);
  await page.click('#grp-solo'); await page.click('#tab-' + tab); await page.waitForTimeout(1500);
  const times = await page.evaluate(async () => {
    const out = [], el = document.querySelector('#strength');
    const lo = Number(el.min), hi = Number(el.max);
    for (let i = 0; i < 12; i++) {
      el.value = String(lo + (hi - lo) * (0.3 + 0.6 * i / 11));
      const t0 = performance.now();
      el.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      out.push(Math.round(performance.now() - t0));
    }
    return out;
  });
  console.log(tab, JSON.stringify(over), 'frame ms', JSON.stringify(times));
  await browser.close();
})();
