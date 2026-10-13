const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { settle } = require('/home/user/rex-strength-lab/rex-strength-lab/test/make-page-fixture.js');
const DIR = process.argv[2];
(async () => {
  const prev = path.join(DIR, 'probe.html');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(prev).href);
  const load = async (st) => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(600); await settle(page, 'bay'); };
  for (const g of ['krakatoa', 'chicxulub']) for (const absorb of ['gradual', 'instant']) {
    await load({ action: 'weight' });
    await page.evaluate((a) => { const s = document.getElementById('absorb'); s.value = a; s.dispatchEvent(new Event('change')); }, absorb); await page.waitForTimeout(300); await settle(page, 'bay');
    await page.click('#grow-what-' + g); await page.waitForTimeout(400); await settle(page, 'bay');
    const t = await page.evaluate(() => { const b = document.querySelector('#bay .growth-whatif'); return b ? b.innerText : '(none)'; });
    const i = t.indexOf('GROWTH FORM');
    console.log('\n=== growth', g, absorb, '\n' + t.slice(i, i + 1800));
  }
  console.log('errs', errs);
  await browser.close();
})();
