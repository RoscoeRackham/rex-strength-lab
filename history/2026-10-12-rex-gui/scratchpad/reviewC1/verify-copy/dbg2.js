const fs = require('fs'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { settle } = require(process.argv[2] + '/test/make-page-fixture.js');
(async () => {
  const prev = process.argv[2] + '/dist/preview.html';
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(prev).href);
  await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), { action: 'punch', logKg: 3, mode: 'comic' }); await page.reload(); await page.waitForTimeout(600); await settle(page, 'bay');
  await page.selectOption('#effort', 'allout'); await page.waitForTimeout(400); await settle(page, 'bay');
  const t = await page.evaluate(() => Array.from(document.querySelectorAll('#bay .tile')).map((t, i, all) => ({ k: (t.querySelector('.k') || {}).textContent, v: (t.querySelector('.v') || {}).textContent, prev: i ? (all[i - 1].querySelector('.v') || {}).textContent : '' })));
  for (const x of t) console.log(JSON.stringify(x), [...(x.v || '')].map((c) => c.charCodeAt(0) > 127 ? 'U+' + c.charCodeAt(0).toString(16) : '').filter(Boolean).join(','));
  await browser.close();
})();
