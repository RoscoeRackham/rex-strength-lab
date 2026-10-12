const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const URL = pathToFileURL(process.argv[2]).href;
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const sp of [false, true]) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.addInitScript((st) => { if (!sessionStorage.getItem('seeded')) { localStorage.setItem('rex-lab-v1', JSON.stringify(st)); sessionStorage.setItem('seeded', '1'); } }, { group: 'duo', duoAction: 'catch', cObj: 'person', safePassenger: sp });
    await page.goto(URL); await page.waitForTimeout(3000);
    const t = await page.evaluate(() => document.querySelector('#bay').innerText);
    console.log('safePassenger', sp, '\n', t.split('\n').filter((l) => /person|g-force|passenger|Safe|injur|harm|breaks|Effort|ceiling|kN/i.test(l)).slice(0, 14).join('\n '));
    console.log('options include person:', await page.evaluate(() => [...document.querySelectorAll('#bay select option, #bay button')].some((o) => /person/i.test(o.textContent))));
    await page.close();
  }
  await browser.close();
})();
