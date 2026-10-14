const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { readResult, settle } = require('/home/user/rex-strength-lab/rex-strength-lab/test/make-page-fixture.js');
const DIR = process.argv[2];
(async () => {
  const prev = path.join(DIR, 'probe.html');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(prev).href);
  const load = async (st) => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(600); await settle(page, 'bay'); };
  for (const st of [{ action: 'weight', H: 10, m: 1e27 }, {action:'weight', H: 500, m: 1e30}, {action:'weight', H: 3.048, m: 1e31}, {action:'weight', m: 1e18}, {action:'weight', m: 1e12}]) {
    await load(st);
    const tiles = await page.evaluate(() => Array.from(document.querySelectorAll('#bay .tile')).map((t) => t.textContent.replace(/\s+/g, ' ')));
    console.log('\n=== ', JSON.stringify(st)); for (const t of tiles) if (/Energy/.test(t)) console.log('  tile:', t);
  }
  // growth what-if
  for (const g of ['krakatoa', 'chicxulub', 'sun']) for (const absorb of ['gradual', 'instant']) {
    await load({ action: 'weight', absorb });
    // absorb resets on load; set via the select
    await page.selectOption('#absorb', absorb).catch(()=>{}); await page.waitForTimeout(300); await settle(page, 'bay');
    await page.click('#grow-what-' + g); await page.waitForTimeout(400); await settle(page, 'bay');
    const t = await page.evaluate(() => { const b = document.querySelector('#bay .growth-whatif'); return b ? b.innerText : '(none)'; });
    console.log('\n=== growth', g, absorb, '\n' + t.slice(0, 2500));
  }
  console.log('errs', errs);
  await browser.close();
})();
