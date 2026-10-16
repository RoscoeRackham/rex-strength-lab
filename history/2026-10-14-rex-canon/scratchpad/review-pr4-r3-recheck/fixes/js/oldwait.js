// on the R1 page (every two-player redraw 800 ms late), the old block's pick (selectOption, 300 ms, then settle) reads a stale bay
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { settle } = require(process.argv[2] + '/test/make-page-fixture.js');
(async () => {
  const lab = process.argv[2], html = fs.readFileSync(path.join(lab, 'dist/index.html'), 'utf8');
  const file = path.join(__dirname, 'probe-oldwait.html');
  fs.writeFileSync(file, '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(file).href);
  await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, duoAction: 'collide' })));
  await page.reload(); await page.waitForTimeout(800); await settle(page, 'bay'); await page.waitForTimeout(300); await settle(page, 'duo-bay');
  const v = () => page.evaluate(() => document.querySelector('#duo-bay .verdict').textContent.slice(0, 120));
  const before = await v();
  await page.selectOption('#duo-effort', 'allout'); await page.waitForTimeout(300); await settle(page, 'duo-bay');
  const oldRead = await v();
  await page.waitForTimeout(2000);
  const later = await v();
  console.log('before :', before); console.log('old 300ms read:', oldRead); console.log('2 s later    :', later); console.log(oldRead === later ? 'old wait read the redrawn bay' : 'old wait read a STALE bay');
  await browser.close();
})();
