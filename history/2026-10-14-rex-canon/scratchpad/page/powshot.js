const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const prev = path.join(__dirname, 'prev-pow.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + fs.readFileSync('/home/user/rex-strength-lab/rex-strength-lab/dist/index.html', 'utf8') + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [w, scheme] of [[390, 'dark'], [1280, 'light']]) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 }, colorScheme: scheme });
    await page.goto(pathToFileURL(prev).href); await page.evaluate(() => localStorage.clear()); await page.reload(); await page.waitForTimeout(1500);
    await page.evaluate(() => { document.getElementById('powers').open = true; });
    await page.waitForTimeout(300);
    const el = await page.$('#powers'); await el.screenshot({ path: path.join(__dirname, 'powers-' + w + '-' + scheme + '.png') });
    const hero = await page.$('header.hero'); await hero.screenshot({ path: path.join(__dirname, 'hero-' + w + '-' + scheme + '.png') });
    await page.close();
  }
  await browser.close();
})();
