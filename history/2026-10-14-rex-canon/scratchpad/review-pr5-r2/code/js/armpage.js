const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const prev = path.join(__dirname, '..', 'spy-page.html');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(prev).href);
  for (const ub of [true, false]) {
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), { saveV: 3, duoOpen: true, duoAction: 'arm', logKg: 9, oEffortOwn: true, oEffortLogKg: 8, duoEffort: 'allout', unbreakable: ub });
    await page.reload();
    await page.waitForFunction(() => { const e = document.getElementById('duo-bay'); return e && e.children.length > 0 && !/working it out|Working out/i.test(e.textContent); }, null, { timeout: 120000 });
    await page.waitForTimeout(300);
    const t = await page.evaluate(() => document.getElementById('duo-bay').innerText);
    console.log('==== unbreakable', ub, '\n' + t.slice(0, 4000));
  }
  await browser.close();
})();
