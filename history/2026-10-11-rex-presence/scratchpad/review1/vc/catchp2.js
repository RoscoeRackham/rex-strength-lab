const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const texts = [];
  for (const sp of [false, true]) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.addInitScript((s) => localStorage.setItem('rex-lab-v1', s), JSON.stringify({ group: 'duo', duoAction: 'catch', cObj: 'person', cStyle: 'hard', safePassenger: sp }));
    await page.goto(pathToFileURL(__dirname + '/head-preview.html').href, { timeout: 300000 });
    await page.waitForTimeout(3000);
    const t = await page.evaluate(() => { const b = document.querySelector('#bay'); const c = b.querySelector('.bay-controls'); return b.innerText.replace(c ? c.innerText : '', ''); });
    texts.push(t);
    console.log('==== safePassenger=' + sp + ' checkbox=' + await page.evaluate(() => document.querySelector('#sw-passenger').checked));
    console.log(t.split('\n').filter((l) => /g |g-force|harm|ceiling|All-out|ride|Eiband|passenger|squash|first contact/i.test(l)).join('\n'));
    await page.close();
  }
  console.log('IDENTICAL (excluding controls):', texts[0] === texts[1]);
  await browser.close();
})();
