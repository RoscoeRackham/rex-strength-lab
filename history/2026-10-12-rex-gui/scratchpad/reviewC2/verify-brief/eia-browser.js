const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', proxy: { server: process.env.HTTPS_PROXY }, args: ['--ignore-certificate-errors'] });
  const page = await browser.newPage();
  await page.goto('https://www.eia.gov/electricity/data/browser/#/plant/154', { timeout: 60000 });
  await page.waitForTimeout(12000);
  const t = await page.evaluate(() => document.body.innerText);
  console.log(t.slice(0, 2500));
  await browser.close();
})().catch((e) => { console.log('ERR', e.message); process.exit(0); });
