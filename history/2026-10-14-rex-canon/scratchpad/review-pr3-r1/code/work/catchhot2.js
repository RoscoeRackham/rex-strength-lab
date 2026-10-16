const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url'), path = require('path');
const { settle, readResult } = require('/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r1/code/repo/rex-strength-lab/test/make-page-fixture.js');
const U = (n) => pathToFileURL(path.join(__dirname, n + '.html')).href;
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(U(process.argv[2] || 'pr3'));
  const st = JSON.parse(process.argv[3]);
  await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(800); await settle(page, 'duo-bay');
  if (process.argv[4]) { await page.selectOption('#duo-effort', process.argv[4]); await page.waitForTimeout(400); await settle(page, 'duo-bay'); }
  const r = await readResult(page, 'duo-bay');
  console.log(JSON.stringify(r, null, 1).slice(0, 6000));
  await browser.close();
})();
