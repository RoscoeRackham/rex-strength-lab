const fs = require('fs'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = __dirname, prev = S + '/preview.html';
const settle = async (page) => { for (let i = 0; i < 240; i++) { const t = await page.evaluate(() => document.body.innerText); if (!/working it out|Working out/i.test(t)) return; await page.waitForTimeout(500); } };
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const unb of [true, false]) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(pathToFileURL(prev).href);
    await page.evaluate((s) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, { logKg: 9, action: 'throw', obj: 'bus', angle: 45, surface: 'granite', airAbsorb: 0, keepForm: false, ownRecoil: false, unbreakable: unb });
    await page.reload(); await page.waitForTimeout(1500); await settle(page);
    await page.selectOption('#effort', 'rattle'); await page.waitForTimeout(500); await settle(page);
    const t = await page.evaluate(() => document.querySelector('#bay').innerText);
    console.log('unbreakable', unb, t.split('\n').filter((l) => /^Effort:/.test(l)).join(' | '));
    await page.close();
  }
  await browser.close();
})();
