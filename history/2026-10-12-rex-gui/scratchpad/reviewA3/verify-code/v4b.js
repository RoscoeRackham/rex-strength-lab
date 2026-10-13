const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { settle } = require('/home/user/rex-strength-lab/rex-strength-lab/test/make-page-fixture.js');
const S = __dirname;
const url = pathToFileURL(path.join(S, (process.argv[2] || 'base') + '.wrapped.html')).href;
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [st, inp, val] of [[{ action: 'throw' }, '#goal', '80'], [{ action: 'walk' }, '#walk-d', '20'], [{ action: 'throw' }, '#near', '50']]) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage(); const errs = []; page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
    await page.goto(url);
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
    await page.reload(); await page.waitForTimeout(1200); await settle(page, 'bay');
    await page.evaluate(() => { const d = document.querySelector('#bay details.effort-adjust'); if (d) d.open = true; });
    await page.focus(inp); await page.keyboard.press('Control+A'); await page.keyboard.type(val);
    await page.setViewportSize({ width: 1000, height: 900 }); await page.waitForTimeout(1000); await settle(page, 'bay');
    const after = await page.evaluate((i) => ({ input: (document.querySelector(i) || {}).value, active: document.activeElement && (document.activeElement.id || document.activeElement.tagName), live: document.getElementById('bay-live') ? document.getElementById('bay-live').textContent.slice(0, 60) : null }), inp);
    console.log(process.argv[2] || 'base', JSON.stringify(st), inp, '->', JSON.stringify(after), 'errors:', JSON.stringify(errs));
    await ctx.close();
  }
  await browser.close();
})();
