const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const prev = '/home/user/rex-strength-lab/rex-strength-lab/dist/preview.html';
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [w, scheme] of [[390, 'light'], [1280, 'dark']]) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 }, colorScheme: scheme });
    await page.goto(pathToFileURL(prev).href);
    await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, anchor: 'bolted' })));
    await page.reload(); await page.waitForTimeout(1500);
    await page.evaluate(() => { document.getElementById('powers').open = true; document.getElementById('ollie-setup').open = true; });
    await page.waitForTimeout(300);
    await (await page.$('#powers')).screenshot({ path: path.join(__dirname, 'powers-' + w + '.png') });
    await (await page.$('#duo')).screenshot({ path: path.join(__dirname, 'duo-' + w + '.png') });
    await page.close();
  }
  await browser.close();
})();
