const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('file://' + path.join(__dirname, 'branch.html'));
  await page.waitForTimeout(1500);
  for (const y of [0, 320, 600]) {
    await page.evaluate((y) => scrollTo(0, y), y);
    console.log(y, JSON.stringify(await page.evaluate(() => { const a = document.querySelector('.panel-controls').getBoundingClientRect(); const s = document.querySelector('#surface').getBoundingClientRect(); const p = document.querySelector('#powers > summary').getBoundingClientRect(); return { asideTop: Math.round(a.top), asideBottom: Math.round(a.bottom), surface: [Math.round(s.top), Math.round(s.bottom)], powersSummary: [Math.round(p.top), Math.round(p.bottom)] }; })));
  }
  await browser.close();
})();
