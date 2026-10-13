const path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [W, scheme] of [[390, 'dark'], [1280, 'light']]) {
    const page = await browser.newPage({ viewport: { width: W, height: 844 }, colorScheme: scheme });
    await page.goto(pathToFileURL(path.join(process.argv[2], 'preview.html')).href);
    await page.waitForTimeout(1500);
    await page.evaluate(() => { document.querySelectorAll('details').forEach((d) => { if (d.querySelector('#src-table')) d.open = true; }); });
    await page.waitForTimeout(300);
    const info = await page.evaluate(() => { const w = document.querySelector('#src-table').closest('.table-wrap'); return { sw: w.scrollWidth, cw: w.clientWidth, page: document.documentElement.scrollWidth - document.documentElement.clientWidth }; });
    console.log(W, scheme, JSON.stringify(info));
    const rows = await page.$$('#src-table tbody tr');
    for (const r of rows) { const t = await r.evaluate((n) => n.cells[0].textContent); if (/SN 1998bw|Lifting a 100 g apple/.test(t)) await r.screenshot({ path: path.join(process.argv[2], 'row-' + (t.includes('SN') ? 'sn' : 'apple') + '-' + W + '-' + scheme + '.png') }); }
    await page.close();
  }
  await browser.close();
})();
