const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = __dirname + '/';
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await page.goto('file://' + S + 'preview.html');
  await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), {"group":"duo","duoAction":"wrestle","wrestleMove":"push","inf":true,"anchor":"bolted","oAnchor":"bolted"});
  await page.reload(); await page.waitForTimeout(700);
  const h = await page.evaluateHandle(() => [...document.querySelectorAll('#bay svg')].find(s => (s.getAttribute('aria-label')||'').includes('strength')));
  await h.asElement().screenshot({ path: S + 'bars.png' });
  await browser.close();
})();
