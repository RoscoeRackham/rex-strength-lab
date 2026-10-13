const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { readResult, settle } = require('/home/user/rex-strength-lab/rex-strength-lab/test/make-page-fixture.js');
const S = __dirname;
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const name of ['base', 'fix4', 'main']) {
    const url = pathToFileURL(path.join(S, name + '.wrapped.html')).href;
    for (const mode of ['resize', 'enter', 'fresh']) {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
      const page = await ctx.newPage(); const errs = []; page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message.slice(0, 40)));
      await page.goto(url);
      await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), mode === 'fresh' ? { group: 'solo', action: 'throw', gThrow: 80 } : { group: 'solo', action: 'throw' });
      await page.reload(); await page.waitForTimeout(1200); await settle(page, 'bay');
      if (mode !== 'fresh') {
        await page.evaluate(() => { const d = document.querySelector('#bay details.effort-adjust'); if (d) d.open = true; });
        await page.focus('#goal'); await page.keyboard.press('Control+A'); await page.keyboard.type('80');
        if (mode === 'resize') await page.setViewportSize({ width: 1000, height: 900 }); else await page.keyboard.press('Enter');
        await page.waitForTimeout(1500); await settle(page, 'bay');
      }
      const r = await readResult(page, 'bay');
      const live = await page.evaluate(() => { const l = document.querySelector('[aria-live]#bay-live, #bay-live'); return l ? l.textContent : null; });
      const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('rex-lab-v1')).gThrow);
      console.log(name, mode, '| saved gThrow', saved, '| verdict:', r.verdict, '| effort:', (r.effort[0] || '').slice(0, 70), '| live:', live, errs.length ? '| ' + errs : '');
      await ctx.close();
    }
  }
  await browser.close();
})();
