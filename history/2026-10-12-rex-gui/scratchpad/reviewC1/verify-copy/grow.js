const fs = require('fs'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const [dist, tag] = process.argv.slice(2);
(async () => {
  const prev = __dirname + '/grow-' + tag + '.html';
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + fs.readFileSync(dist, 'utf8') + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const w of [390, 1280]) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    const errs = []; page.on('pageerror', (e) => errs.push(e.message));
    await page.goto(pathToFileURL(prev).href);
    await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'weight' }))); await page.reload(); await page.waitForTimeout(1000);
    for (const id of ['krakatoa', 'chicxulub', 'sun']) {
      await page.click('#grow-what-' + id); await page.waitForTimeout(500);
      const t = await page.evaluate(() => { const b = document.querySelector('.growth-whatif'); return Array.from(b.querySelectorAll('p')).map((p) => p.textContent).slice(1, 3).join(' /// ') + ' ||| ' + Array.from(b.querySelectorAll('tbody tr')).map((r) => r.textContent).join(' ; '); });
      console.log(w, id, '::', t);
    }
    if (w === 390) await page.screenshot({ path: __dirname + '/grow-' + tag + '-390.png', fullPage: false });
    console.log('errs', errs);
    await page.close();
  }
  await browser.close();
})();
