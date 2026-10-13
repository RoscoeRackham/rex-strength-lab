const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const d of ['arm', 'wrestle', 'catch', 'collide']) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await ctx.addInitScript((s) => { if (!sessionStorage.getItem('x')) { localStorage.setItem('rex-lab-v1', s); sessionStorage.setItem('x', 1); } }, JSON.stringify({ group: 'duo', duoAction: d, action: 'stomp' }));
    const page = await ctx.newPage();
    await page.goto('file://' + path.join(__dirname, '..', 'branch.html'));
    await page.waitForTimeout(2500);
    const r = await page.evaluate(() => ({ open: document.getElementById('duo').open, duoSel: (document.querySelector('#duo-tabs [aria-selected="true"]') || {}).id, rexSel: (document.querySelector('#tabs [aria-selected="true"]') || {}).id, verdict: (document.querySelector('#duo-bay .verdict') || {}).textContent }));
    await page.reload(); await page.waitForTimeout(1500);
    const r2 = await page.evaluate(() => ({ open: document.getElementById('duo').open, saved: JSON.parse(localStorage.getItem('rex-lab-v1')) }));
    console.log(d, JSON.stringify(r).slice(0, 220), '| after reload open:', r2.open, 'group' in r2.saved ? 'group kept' : 'group dropped');
    await ctx.close();
  }
  await browser.close();
})();
