const path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const prev = path.join(__dirname, '..', 'spy-page.html');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(prev).href);
  const settle = () => page.waitForFunction(() => { const e = document.getElementById('duo-bay'); return e && e.children.length > 0 && !/working it out|Working out/i.test(e.textContent); }, null, { timeout: 120000 });
  for (const ub of [true, false]) {
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), { saveV: 3, duoOpen: true, duoAction: 'arm', logKg: 9, unbreakable: ub });
    await page.reload(); await settle();
    await page.evaluate(() => document.getElementById('o-own').click()); await page.waitForTimeout(300); await settle();
    await page.evaluate(() => { const s = document.getElementById('o-strength'); s.value = '8'; s.dispatchEvent(new Event('input', { bubbles: true })); });
    await page.waitForTimeout(500); await settle();
    await page.selectOption('#duo-effort', 'allout'); await page.waitForTimeout(500); await settle(); await page.waitForTimeout(500);
    const t = await page.evaluate(() => document.getElementById('duo-bay').innerText);
    const keep = t.split('\n').filter((l) => /pin|slam|crater|ground|Shimmer|taken|ocean|Ollie|Rex/i.test(l) && l.length > 3);
    console.log('==== unbreakable', ub, '\n' + keep.join('\n').slice(0, 3500));
  }
  await browser.close();
})();
