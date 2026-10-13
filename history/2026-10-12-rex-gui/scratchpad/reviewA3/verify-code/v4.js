const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { settle } = require('/home/user/rex-strength-lab/rex-strength-lab/test/make-page-fixture.js');
const S = __dirname;
const wrap = (src, name) => { const f = path.join(S, name + '.wrapped.html'); fs.writeFileSync(f, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + fs.readFileSync(src, 'utf8') + '</body></html>'); return pathToFileURL(f).href; };
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const runs = [
    ['base', S + '/base/dist/index.html', { action: 'stomp' }, '#bay', '#near'],
    ['base', S + '/base/dist/index.html', { action: 'throw' }, '#bay', '#near'],
    ['base', S + '/base/dist/index.html', { action: 'throw', duoOpen: true, duoAction: 'catch' }, '#duo-bay', '#duo-near'],
    ['main', S + '/main-index.html', { group: 'solo', action: 'stomp' }, '#bay', '#near'],
    ['main', S + '/main-index.html', { group: 'duo', duoAction: 'catch' }, '#bay', '#near'],
  ];
  for (const [name, f, st, bay, inp] of runs) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage(); const errs = []; page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
    await page.goto(wrap(f, name));
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
    await page.reload(); await page.waitForTimeout(1200); await settle(page, bay.slice(1));
    await page.evaluate((b) => { const d = document.querySelector(b + ' details.effort-adjust'); if (d) d.open = true; }, bay);
    await page.focus(inp); await page.keyboard.press('Control+A'); await page.keyboard.type('50');
    await page.setViewportSize({ width: 1000, height: 900 }); await page.waitForTimeout(1000); await settle(page, bay.slice(1));
    const after = await page.evaluate(([b, i]) => ({ near: JSON.parse(localStorage.getItem('rex-lab-v1')).near, verdicts: document.querySelectorAll(b + ' .verdict').length, input: (document.querySelector(i) || {}).value, active: document.activeElement && (document.activeElement.id || document.activeElement.tagName) }), [bay, inp]);
    console.log(name, JSON.stringify(st), inp, '->', JSON.stringify(after), '\n   errors:', JSON.stringify(errs));
    await ctx.close();
  }
  await browser.close();
})();
