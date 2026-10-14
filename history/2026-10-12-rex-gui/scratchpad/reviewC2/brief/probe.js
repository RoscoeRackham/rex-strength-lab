// usage: node probe.js <dist/index.html> <json list of [state, clickSel?, allout?]>
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const fs = require('fs');
(async () => {
  const file = process.argv[2], cases = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));
  const width = Number(process.argv[4] || 1280);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(file).href);
  for (const c of cases) {
    const [st, clicks, allout, sel] = c;
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
    await page.reload(); await page.waitForTimeout(1200);
    if (allout) { await page.selectOption('#effort', 'allout'); await page.waitForTimeout(1200); }
    for (const cl of clicks || []) { if (Array.isArray(cl)) { await page.evaluate(() => { const p = document.getElementById("powers"); if (p) p.open = true; }); await page.selectOption(cl[1], cl[2]); } else await page.click(cl); await page.waitForTimeout(1500); }
    const t = await page.evaluate((sel) => { const n = document.querySelector(sel || '#bay'); return n ? n.innerText.replace(/ /g, ' ') : 'NO ' + sel; }, sel);
    console.log('=== ' + JSON.stringify(c));
    console.log(t);
  }
  const sw = await page.evaluate(() => document.documentElement.scrollWidth);
  console.log('scrollWidth', sw, 'errors', JSON.stringify(errs));
  await browser.close();
})();
