const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = path.join(__dirname, '..');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const w of [1280, 1000, 920, 700, 390, 320]) {
    const out = [];
    for (const [v, st] of [['main', { group: 'duo', duoAction: 'catch' }], ['branch', { duoOpen: true, duoAction: 'catch' }]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
      await ctx.addInitScript((s) => { localStorage.setItem('rex-lab-v1', s); }, JSON.stringify(st));
      const page = await ctx.newPage();
      await page.goto('file://' + path.join(S, v + '.html'));
      await page.waitForTimeout(1500);
      out.push(v + ': ' + await page.evaluate((v) => { const b = document.querySelector('#bay'), d = document.querySelector('#duo-bay'); return 'bay ' + b.clientWidth + (d ? ' duo-bay ' + d.clientWidth : ''); }, v));
      await ctx.close();
    }
    console.log(w, out.join(' | '));
  }
  await browser.close();
})();
