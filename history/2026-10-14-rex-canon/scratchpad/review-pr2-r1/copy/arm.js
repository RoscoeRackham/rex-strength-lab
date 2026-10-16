const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [name, st, oLog] of [['def_pin', {}, 4.5], ['def_pin_d9', { logKg: 9 }, 8.5], ['off_pin_d9', { logKg: 9, airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false }, 8.5], ['nokeep_pin', { keepForm: false }, 4.5], ['noown_pin_d9', { logKg: 9, ownRecoil: false }, 8.5]]) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(pathToFileURL(path.resolve('out/br/page.html')).href);
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(Object.assign({ saveV: 2, duoOpen: true, duoAction: 'arm' }, s))), st);
    await page.reload(); await page.waitForTimeout(1500);
    await page.evaluate(() => document.getElementById('o-own').click()); await page.waitForTimeout(300);
    await page.evaluate((v) => { const s = document.getElementById('o-strength'); s.value = String(v); s.dispatchEvent(new Event('input', { bubbles: true })); }, oLog);
    await page.waitForTimeout(1500);
    await page.selectOption('#duo-effort', 'allout');
    for (let i = 0; i < 120; i++) { const b = await page.evaluate(() => /working it out|Working out/i.test(document.getElementById('duo-bay').textContent)); if (!b) break; await page.waitForTimeout(500); }
    const t = await page.evaluate(() => Array.from(document.querySelectorAll('#duo-bay .verdict, #duo-bay li, #duo-bay .effort-read p, #duo-bay .status')).map((n) => n.textContent).join('\n'));
    console.log('=== ' + name + '\n' + t);
    await page.close();
  }
  await browser.close();
})();
