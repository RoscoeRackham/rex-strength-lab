// harness: node h.js scenarios.json  -> prints bay text per scenario
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = __dirname;
const html = fs.readFileSync(path.join(S, '../lab/dist/index.html'), 'utf8');
const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>';
fs.writeFileSync(path.join(S, 'page-claims.html'), wrapped);
const scen = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const sc of scen) {
    const page = await browser.newPage({ viewport: { width: sc.w || 1280, height: sc.h || 900 }, colorScheme: sc.scheme || 'light' });
    const errs = [];
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
    await page.goto(pathToFileURL(path.join(S, 'page-claims.html')).href);
    await page.evaluate((st) => { localStorage.clear(); if (st) localStorage.setItem('rex-lab-v1', JSON.stringify(st)); }, sc.state || null);
    await page.reload();
    await page.waitForTimeout(800);
    if (sc.effort) { await page.selectOption('#effort', sc.effort); }
    if (sc.duoEffort) { await page.selectOption('#duo-effort', sc.duoEffort); }
    if (sc.js) await page.evaluate(sc.js);
    // wait for searches
    for (let i = 0; i < 120; i++) {
      const t = await page.evaluate(() => document.body.innerText);
      if (!/working it out|Working out/i.test(t)) break;
      await page.waitForTimeout(500);
    }
    await page.waitForTimeout(300);
    if (sc.post) { await page.evaluate(sc.post); await page.waitForTimeout(400); }
    const sel = sc.sel || (sc.duo ? '#duo-bay' : '#bay');
    const txt = await page.evaluate((s) => s.split(',').map((q) => { const n = document.querySelector(q); return n ? n.innerText : '(missing ' + q + ')'; }).join('\n----\n'), sel);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    console.log('==== ' + sc.name + (overflow > 0 ? ' OVERFLOW ' + overflow : '') + (errs.length ? ' ERRS ' + errs.join(' | ') : ''));
    console.log(txt);
    if (sc.post) console.log('TITLE: ' + await page.title());
    if (sc.shot) await page.screenshot({ path: path.join(S, 'out', sc.shot), fullPage: !!sc.full });
    await page.close();
  }
  await browser.close();
})();
