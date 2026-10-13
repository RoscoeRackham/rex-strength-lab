const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('file://' + path.join(__dirname, 'pages', 'branch.html'));
  for (const st of [{ colSrc: 'set', colInf: true }, { colSrc: 'set', colGB: 0 }, { colSrc: 'set', colGB: -2 }]) {
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(Object.assign({ anchor: 'bolted', oAnchor: 'friction', duoOpen: true, duoAction: 'collide', colWho: 'ollie', inf: true }, s))), st);
    await page.reload(); await page.waitForTimeout(1500);
    for (let i = 0; i < 100; i++) { if (!/working it out/i.test(await page.evaluate(() => document.getElementById('duo-bay').textContent))) break; await page.waitForTimeout(250); }
    console.log(JSON.stringify(st), '=>', await page.evaluate(() => (document.querySelector('#duo-bay .verdict') || {}).textContent), '|', await page.evaluate(() => Array.from(document.querySelectorAll('#duo-bay .status-row')).map((n) => n.textContent).join(' / ')));
  }
  await browser.close();
})();
