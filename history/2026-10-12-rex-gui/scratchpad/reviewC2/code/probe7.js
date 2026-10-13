const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const DIR = process.argv[2];
(async () => {
  const prev = path.join(DIR, 'probe.html');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const scheme of ['light', 'dark']) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, colorScheme: scheme });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(prev).href); await page.evaluate(() => localStorage.clear()); await page.reload(); await page.waitForTimeout(2500);
  await page.evaluate(() => document.querySelectorAll('details').forEach((d) => { d.open = true; d.dispatchEvent(new Event('toggle')); }));
  await page.waitForTimeout(1500);
  const o = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  const wide = await page.evaluate(() => Array.from(document.querySelectorAll('#src-table, #src-table *, .assumptions *')).filter((n) => n.getBoundingClientRect().right > document.documentElement.clientWidth + 1).slice(0, 5).map((n) => n.tagName + ' ' + (n.textContent || '').slice(0, 60)));
  const card = await page.evaluate(() => { const n = Array.from(document.querySelectorAll('*')).find((x) => x.children.length === 0 && /^Energy comparisons$/.test(x.textContent.trim())); return n ? n.parentElement.textContent.slice(0, 200) : null; });
  const rows = await page.evaluate(() => Array.from(document.querySelectorAll('#src-table tbody tr')).filter((tr) => /^Energy: /.test(tr.cells[0].textContent)).length);
  await page.screenshot({ path: path.join(DIR, 'src-table-390-' + scheme + '.png'), fullPage: false });
  console.log(scheme, 'overflow', o, 'wide nodes', wide, 'energy rows', rows, 'card', card && card.slice(0, 120), 'errs', errs);
  await page.close();
  }
  await browser.close();
})();
