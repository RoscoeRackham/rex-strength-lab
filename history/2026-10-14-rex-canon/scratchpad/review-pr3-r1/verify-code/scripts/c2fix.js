// the proposed shots.js assertion, run standalone on a page
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const REPO = process.argv[2];
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { settle } = require(REPO + '/rex-strength-lab/test/make-page-fixture.js');
(async () => {
  const body = fs.readFileSync(REPO + '/rex-strength-lab/dist/index.html', 'utf8');
  const prev = path.join(__dirname, 'page-c2fix-' + path.basename(REPO) + '.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(pathToFileURL(prev).href);
  await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ saveV: 3, action: 'throw', obj: 'person', airAbsorb: 0 })));
  await page.reload(); await page.waitForTimeout(800); await settle(page, 'bay');
  await page.selectOption('#effort', 'allout'); await page.waitForTimeout(300); await settle(page, 'bay');
  const sel = (s) => page.evaluate((x) => Array.from(document.querySelectorAll('#bay ' + x)).map((n) => n.textContent.replace(/\s+/g, ' ')).join(' / '), s);
  const all = await page.evaluate(() => document.getElementById('bay').textContent.replace(/\s+/g, ' ')), h = await sel('.happens');
  const bad = !/Safe passenger: a manageable push, spread through them/.test(all) || /Safe passenger, but air drag/.test(all) || !/Safe passenger spreads that through them too, so it stays a manageable push/.test(h) || /covers only his push/.test(h);
  console.log(path.basename(REPO), bad ? 'FAIL' : 'PASS');
  await browser.close();
})();
