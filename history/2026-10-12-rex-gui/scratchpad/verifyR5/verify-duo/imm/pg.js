const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const cases = JSON.parse(require('fs').readFileSync(process.argv[2], 'utf8'));
  const re = new RegExp(process.argv[3] || 'ground|plaster|Effort|Courtesy|take-off|immovable|rattle', 'i');
  for (const c of cases) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errs = []; page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); page.on('pageerror', e => errs.push(String(e)));
    await page.addInitScript((st) => { try { localStorage.setItem('rex-lab-v1', JSON.stringify(st)); } catch (e) {} }, c.state);
    await page.goto('file://' + path.resolve(__dirname, 'page.html'));
    await page.waitForTimeout(1000);
    if (c.effort) { await page.selectOption('#duo-effort', c.effort); }
    for (let i = 0; i < 240; i++) { const t = await page.evaluate(() => document.body.innerText); if (!/working it out/i.test(t)) break; await page.waitForTimeout(500); }
    await page.waitForTimeout(300);
    const txt = await page.evaluate(() => { const b = document.querySelector('#duo-bay'); return b ? b.innerText : document.body.innerText; });
    const lines = txt.split('\n').filter(l => re.test(l));
    console.log('=== ', JSON.stringify(c.state), c.effort || '', 'errors:', errs.length, errs.slice(0,3));
    console.log(lines.join('\n'));
    await page.close();
  }
  await browser.close();
})();
