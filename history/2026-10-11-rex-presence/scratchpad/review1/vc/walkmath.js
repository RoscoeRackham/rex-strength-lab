const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const st of [{ action: 'walk', build: 'human', H: 2, m: 180 }, { action: 'walk' }, { action: 'walk', H: 6, m: 24056 }]) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.addInitScript((s) => localStorage.setItem('rex-lab-v1', s), JSON.stringify(st));
    await page.goto(pathToFileURL(__dirname + '/head-preview.html').href);
    await page.waitForTimeout(2000);
    const t = await page.evaluate(() => document.querySelector('#bay').textContent);
    const m = t.match(/Load: [^]*?Carden 2015\)\./);
    const hip = t.match(/hip height h = [^ ]+ m/);
    console.log(JSON.stringify(st), '\n  ', hip && hip[0], '\n  ', m ? m[0] : 'NOT FOUND');
    await page.close();
  }
  await browser.close();
})();
