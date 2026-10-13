const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
  await p.goto('file://' + path.join(__dirname, 'page.html'));
  for (const anchor of ['friction', 'bolted']) {
    await p.evaluate((a) => localStorage.setItem('rex-lab-v1', JSON.stringify({ anchor: a, action: 'walk' })), anchor);
    await p.reload(); await p.waitForTimeout(1200);
    const t = await p.evaluate(() => { const v = document.querySelector('#bay .verdict') || document.querySelector('.verdict'); return v ? v.innerText : ''; });
    const bolt = await p.evaluate(() => document.querySelector('#bay').innerText.split('\n').filter((l) => /bolt/i.test(l)));
    console.log(anchor, '|', t.slice(0, 200), '| bolt lines:', JSON.stringify(bolt));
  }
  await b.close();
})();
