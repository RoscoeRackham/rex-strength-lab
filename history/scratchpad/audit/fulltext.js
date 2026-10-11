const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const st = JSON.parse(process.argv[2]);
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
  await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
  await page.reload(); await page.waitForTimeout(700);
  await page.evaluate(() => document.querySelectorAll('details').forEach((d) => (d.open = true)));
  const t = await page.evaluate(() => document.body.innerText);
  console.log(t);
  await browser.close();
})();
