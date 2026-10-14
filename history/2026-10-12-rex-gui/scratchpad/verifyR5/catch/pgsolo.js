const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const DIR = __dirname, file = path.join(DIR, 'page.html');
const cases = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(file).href);
  const settle = async () => { for (let i = 0; i < 240; i++) { const busy = await page.evaluate(() => /working it out|Working out/i.test(document.getElementById('bay').textContent)); if (!busy) return; await page.waitForTimeout(250); } };
  for (const c of cases) {
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), c.state);
    await page.reload(); await page.waitForTimeout(900); await settle();
    if (c.effort) { await page.selectOption('#effort', c.effort); await page.waitForTimeout(500); await settle(); }
    const t = await page.evaluate(() => { const b = document.getElementById('bay'); return Array.from(b.querySelectorAll('.verdict, .status-row, .tiles, .happens li, .callout, details.math .eq')).map((n) => n.textContent.replace(/\s+/g, ' ').trim()).filter(Boolean).join('\n'); });
    fs.writeFileSync(path.join(DIR, 'out', c.name + '.txt'), t); console.log('=== ' + c.name);
  }
  await browser.close();
})();
