const path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const scheme of ['light', 'dark']) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, colorScheme: scheme });
    await page.goto(pathToFileURL('/home/user/rex-strength-lab/rex-strength-lab/dist/preview.html').href);
    await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true })));
    await page.reload(); await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollTo(0, 700)); await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(__dirname, 'cue-' + scheme + '.png') });
    await page.close();
  }
  await browser.close();
})();
