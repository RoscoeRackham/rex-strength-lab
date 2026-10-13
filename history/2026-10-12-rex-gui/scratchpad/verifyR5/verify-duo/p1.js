const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const cases = JSON.parse(process.argv[2]);
  for (const c of cases) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errs = []; page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); page.on('pageerror', e => errs.push(String(e)));
    await page.addInitScript((st) => { try { localStorage.setItem('rex-lab-v1', JSON.stringify(st)); } catch (e) {} }, c.state);
    await page.goto('file://' + path.resolve('page.html'));
    await page.waitForTimeout(1500);
    if (c.effort) { await page.selectOption('#duo-effort', c.effort); }
    for (let i = 0; i < 120; i++) { const t = await page.evaluate(() => document.body.innerText); if (!/working it out/i.test(t)) break; await page.waitForTimeout(500); }
    const txt = await page.evaluate(() => document.body.innerText);
    const lines = txt.split('\n').filter(l => /lands|landing|Landing|throws Ollie|Effort|plaster|courtesy|Courtesy/i.test(l));
    console.log('=== ', JSON.stringify(c.state), c.effort || '', 'errors:', errs.length);
    console.log(lines.slice(0, 40).join('\n'));
    await page.close();
  }
  await browser.close();
})();
