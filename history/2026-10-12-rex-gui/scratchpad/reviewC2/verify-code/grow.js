const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
(async () => {
  const body = fs.readFileSync(path.join(__dirname, 'page-body.html'), 'utf8');
  const prev = path.join(__dirname, 'preview.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(pathToFileURL(prev).href);
  for (const absorb of ['ocean', 'gradual', 'instant']) for (const g of ['krakatoa', 'chicxulub']) {
    await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'weight' })));
    await page.reload(); await page.waitForTimeout(1500);
    await page.evaluate(() => { document.getElementById('powers').open = true; });
    await page.selectOption('#absorb', absorb); await page.waitForTimeout(500);
    await page.click('#grow-what-' + g); await page.waitForTimeout(800);
    const t = await page.evaluate(() => { const b = document.querySelector('#bay .growth-whatif'); return b ? b.innerText.replace(/ /g, ' ') : 'NO BOX'; });
    console.log('==== absorb=' + absorb + ' grow=' + g + '\n' + t.split('\n').filter((l) => /which becomes|It becomes|MIX|PURE|Mix|Pure|t \(|kg \(/.test(l)).join('\n'));
  }
  console.log('errors', errs);
  await browser.close();
})();
