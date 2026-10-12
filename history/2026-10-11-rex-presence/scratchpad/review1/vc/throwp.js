const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const eff of ['least', 'ceiling']) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.addInitScript((s) => localStorage.setItem('rex-lab-v1', s), JSON.stringify({ action: 'throw', obj: 'person' }));
    await page.goto(pathToFileURL(__dirname + '/head-preview.html').href);
    await page.waitForTimeout(2500);
    if (eff !== 'least') { await page.selectOption('#effort', eff); await page.waitForTimeout(2500); }
    const t = await page.evaluate(() => { const b = document.querySelector('#bay'); const c = b.querySelector('.bay-controls'); return b.innerText.replace(c ? c.innerText : '', ''); });
    console.log('=== effort ' + eff); console.log(t.split('\n').filter((l) => /g,|g for|Effort|ceiling|ride|injury|harm/i.test(l)).slice(0, 8).join('\n'));
    await page.close();
  }
  await browser.close();
})();
