const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { settle } = require(path.resolve(__dirname, '../repo/rex-strength-lab/test/make-page-fixture.js'));
(async () => {
  const html = process.argv[2], st = JSON.parse(process.argv[3]);
  const prev = path.join(__dirname, 'prev-c-' + Date.now() + '.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + fs.readFileSync(html, 'utf8') + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(prev).href);
  await page.evaluate((x) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(x)); }, st);
  await page.reload(); await page.waitForTimeout(1000); await settle(page, 'duo-bay');
  await page.selectOption('#duo-effort', 'allout'); await page.waitForTimeout(500); await settle(page, 'duo-bay');
  // whole bay text including closed details
  console.log(await page.evaluate(() => { const b = document.getElementById('duo-bay').cloneNode(true); b.querySelectorAll('script,style,select,option').forEach(x=>x.remove()); b.querySelectorAll('li,p,div,.tile,.verdict').forEach(n => n.append('\n')); return b.textContent.replace(/[ \t]+/g,' ').replace(/\n\s*\n+/g,'\n'); }));
  await browser.close(); fs.unlinkSync(prev);
})();
