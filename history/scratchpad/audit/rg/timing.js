const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const cases = JSON.parse(process.argv[2]);
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [name, st] of cases) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
    const t0 = Date.now();
    await page.reload({ waitUntil: 'load' });
    const tl = Date.now() - t0;
    const v = await page.evaluate(() => (document.querySelector('#bay .verdict') || document.querySelector('#bay')).innerText.slice(0, 160));
    console.log(name, 'load ms', tl, '|', v.replace(/\n/g, ' '));
    await page.close();
  }
  await browser.close();
})();
