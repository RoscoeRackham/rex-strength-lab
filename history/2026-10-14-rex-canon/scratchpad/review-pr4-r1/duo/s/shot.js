const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [w, scheme] of [[390, 'dark'], [1280, 'light']]) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 }, colorScheme: scheme });
    await page.goto(pathToFileURL(__dirname + '/pr35.html').href);
    await page.evaluate(() => localStorage.clear()); await page.reload(); await page.waitForTimeout(1500);
    await page.evaluate(() => { const p = document.getElementById('powers'); p.open = true; document.getElementById('nkb-rex').scrollIntoView(); });
    await page.waitForTimeout(300);
    const el = await page.$('#powers');
    await el.screenshot({ path: __dirname + '/powers-' + w + '-' + scheme + '.png' });
    const ov = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    const box = await page.evaluate(() => ['nkb-rex', 'nkb-ollie'].map((id) => { const r = document.getElementById(id).getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; }));
    console.log(w, scheme, 'overflow', ov, 'checkbox sizes', JSON.stringify(box));
    await page.close();
  }
  await browser.close();
})();
