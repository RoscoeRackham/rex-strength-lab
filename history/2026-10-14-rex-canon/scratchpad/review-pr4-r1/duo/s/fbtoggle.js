const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  const settle = () => page.evaluate(() => new Promise((resolve) => { const t0 = performance.now(); const poll = () => { const b = document.getElementById('duo-bay'); const busy = !b || !b.querySelector('.verdict, .callout') || /working it out|Working out/i.test(b.textContent); if (!busy || performance.now() - t0 > 30000) resolve(); else setTimeout(poll, 30); }; poll(); }));
  const read = () => page.evaluate(() => { const b = document.getElementById('duo-bay'); const t = (s) => Array.from(b.querySelectorAll(s)).map((n) => n.textContent.replace(/\s+/g, ' ').trim()).join(' / '); return { v: t('.verdict'), e: t('.effort-read'), tiles: t('.tiles') }; });
  const FB = { duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', logKg: 14, keepForm: false, airAbsorb: 0.5 };
  const url = pathToFileURL(__dirname + '/' + (process.argv[2] || 'pr35') + '.html').href;
  const fresh = async (x, eff) => { await page.goto(url); await page.evaluate((s) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, x); await page.reload(); await settle(); if (eff) { await page.selectOption('#duo-effort', eff); await page.waitForTimeout(300); await settle(); } return read(); };
  for (const eff of ['allout', 'windows', 'least']) {
    const a = await fresh(FB, eff);
    await page.evaluate(() => { document.getElementById('powers').open = true; });
    await page.click('#nkb-ollie'); await page.waitForTimeout(500); await settle();
    const b = await read();
    const c = await fresh(Object.assign({}, FB, { oNoKnockback: false }), eff);
    console.log(eff, 'toggled == fresh:', JSON.stringify(b) === JSON.stringify(c), '| changed from on:', JSON.stringify(a) !== JSON.stringify(b));
    if (JSON.stringify(b) !== JSON.stringify(c)) console.log('  toggled:', JSON.stringify(b).slice(0, 600), '\n  fresh:  ', JSON.stringify(c).slice(0, 600));
    console.log('  on  e:', a.e.slice(0, 400));
    console.log('  off e:', c.e.slice(0, 400));
  }
  console.log('errors', errs);
  await browser.close();
})();
