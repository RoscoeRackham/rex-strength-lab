const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'); const { pathToFileURL } = require('url');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 900 } });
  await page.goto(pathToFileURL(path.join(__dirname, 'preview.html')).href);
  await page.waitForTimeout(1500);
  const cards = await page.evaluate(() => Array.from(document.querySelectorAll('#assume > div')).map((d) => d.textContent.replace(/ /g, ' ')));
  for (const c of cards) if (/shimmer|Shimmer/.test(c)) console.log('----\n' + c);
  const all = await page.evaluate(() => document.body.innerText);
  const m = all.match(/[^.\n]*(draw yet|drawn yet|not drawn|doesn’t draw|does not draw)[^.\n]*/g); console.log('DRAW-YET:', m);
  await browser.close();
})();
