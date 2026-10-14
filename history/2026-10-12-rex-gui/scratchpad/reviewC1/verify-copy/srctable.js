const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const [dist, outFile, re] = process.argv.slice(2);
(async () => {
  const body = fs.readFileSync(dist, 'utf8');
  const prev = outFile + '-preview.html';
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(pathToFileURL(prev).href); await page.waitForTimeout(1500);
  const rows = await page.evaluate(() => Array.from(document.querySelectorAll('#src-table tbody tr')).map((tr) => Array.from(tr.cells).slice(0, 3).map((c) => c.textContent.trim())));
  const hit = rows.filter((r) => new RegExp(re).test(r.join(' | ')));
  fs.writeFileSync(outFile, JSON.stringify(hit, null, 1));
  hit.slice(0, 80).forEach((r) => console.log(r.join(' | ')));
  await browser.close();
})();
