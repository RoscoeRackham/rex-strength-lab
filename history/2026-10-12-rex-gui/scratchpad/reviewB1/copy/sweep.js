const path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const SPECS = JSON.parse(process.argv[2]);
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const s of SPECS) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(pathToFileURL(path.join(__dirname, 'page-dbg.html')).href);
    await page.evaluate((st) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(st || {})); }, s.state);
    await page.reload(); await page.waitForTimeout(600);
    if (s.duo) { await page.click('#duo > summary'); await page.waitForTimeout(200); }
    await page.click('#tab-' + s.tab);
    const wait = async () => { for (let i = 0; i < 150; i++) { const b = await page.evaluate(() => /working it out|Working out/i.test(document.body.innerText)); if (!b) break; await page.waitForTimeout(300); } };
    await wait();
    if (s.effort) { await page.selectOption(s.duo ? '#duo-effort' : '#effort', s.effort); await wait(); }
    await page.evaluate(() => { window.__dropped = []; });
    // force a redraw
    await page.evaluate(() => { const n = document.getElementById('near') ; });
    if (s.effort) { await page.selectOption(s.duo ? '#duo-effort' : '#effort', s.effort === 'allout' ? 'custom' : 'allout'); await wait(); await page.evaluate(() => { window.__dropped = []; }); await page.selectOption(s.duo ? '#duo-effort' : '#effort', s.effort); await wait(); }
    else { await page.click('#tab-' + s.tab); await wait(); }
    const d = await page.evaluate(() => window.__dropped);
    console.log('== ' + (s.label || JSON.stringify(s)) + ': ' + (d.length ? JSON.stringify(d, null, 0) : 'none dropped'));
    await page.close();
  }
  await browser.close();
})();
