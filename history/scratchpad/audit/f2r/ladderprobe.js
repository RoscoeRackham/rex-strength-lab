const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }).catch(() => chromium.launch());
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('file://' + path.join(__dirname, 'ui.html'));
  for (const surface of ['concrete', 'sand']) {
    await page.evaluate((s) => localStorage.setItem('dino-lab-v1', JSON.stringify({ surface: s })), surface);
    await page.reload(); await page.waitForTimeout(600);
    const t = await page.evaluate(() => Array.from(document.querySelectorAll('#ladder-viz g.mk')).map(g => g.getAttribute('aria-label')).filter(s => /Statue/.test(s)));
    const never = await page.evaluate(() => document.querySelector('#ladder-never').textContent);
    console.log(surface, t, '| never:', never);
  }
  await browser.close();
})();
