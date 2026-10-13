const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const { settle } = require(__dirname + '/repo/rex-strength-lab/test/make-page-fixture.js');
const cases = JSON.parse(process.argv[2]);
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: Number(process.argv[3] || 1280), height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(pathToFileURL(__dirname + '/repo/rex-strength-lab/dist/index.html').href);
  for (const st of cases) {
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(800);
    await settle(page, 'duo-bay').catch(() => {});
    await page.selectOption('#duo-effort', 'allout'); await page.waitForTimeout(500); await settle(page, 'duo-bay').catch(() => {});
    const t = await page.evaluate(() => document.querySelector('#duo-bay').innerText);
    const hits = t.split(/\n/).filter((l) => /beyond the ladder|the same as| · |Energy freed|frees/.test(l));
    console.log('==', JSON.stringify(st)); for (const h of hits) console.log('  ', h.slice(0, 400));
    const ov = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth); console.log('  overflow', ov);
  }
  console.log('ERRS', errs);
  await browser.close();
})();
