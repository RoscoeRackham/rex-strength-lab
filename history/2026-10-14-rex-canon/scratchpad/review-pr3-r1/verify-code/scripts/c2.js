const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const REPO = process.argv[2];
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { settle } = require(REPO + '/rex-strength-lab/test/make-page-fixture.js');
(async () => {
  const body = fs.readFileSync(REPO + '/rex-strength-lab/dist/index.html', 'utf8');
  const prev = path.join(__dirname, 'page-c2-' + path.basename(REPO) + '.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(prev).href);
  await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ saveV: 3, action: 'throw', obj: 'person', airAbsorb: 0 })));
  await page.reload(); await page.waitForTimeout(800); await settle(page, 'bay');
  await page.selectOption('#effort', 'allout'); await page.waitForTimeout(300); await settle(page, 'bay');
  const t = await page.evaluate(() => document.getElementById('bay').textContent.replace(/\s+/g, ' '));
  console.log(path.basename(REPO), 'chip:', JSON.stringify(t.match(/Safe passenger(?::|,)[^·.]{0,60}/g)));
  console.log(path.basename(REPO), 'drag:', JSON.stringify(t.match(/In flight, air drag.{0,200}/g)));
  await browser.close();
})();
