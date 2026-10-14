// usage: node pg.js '<json array of {name, state, effort}>'
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const DIR = __dirname;
const html = fs.readFileSync(path.join(DIR, 'lab/rex-strength-lab/dist/index.html'), 'utf8');
const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>';
const file = path.join(DIR, 'page.html'); fs.writeFileSync(file, wrapped);
const cases = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); }); page.on('pageerror', (e) => errs.push(String(e)));
  await page.goto(pathToFileURL(file).href);
  const settle = async () => { for (let i = 0; i < 240; i++) { const busy = await page.evaluate(() => /working it out|Working out/i.test(document.getElementById('duo-bay').textContent + document.getElementById('bay').textContent)); if (!busy) return; await page.waitForTimeout(250); } throw new Error('busy'); };
  for (const c of cases) {
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), c.state);
    await page.reload(); await page.waitForTimeout(900); await settle();
    if (c.effort) { await page.selectOption('#duo-effort', c.effort); await page.waitForTimeout(500); await settle(); }
    const t = await page.evaluate(() => { const b = document.getElementById('duo-bay'); return Array.from(b.querySelectorAll('.verdict, .status-row, .tiles, .effort-read, .happens li, .callout, details.math .eq, p')).map((n) => n.textContent.replace(/\s+/g, ' ').trim()).filter(Boolean).join('\n'); });
    fs.writeFileSync(path.join(DIR, 'out', c.name + '.txt'), t);
    console.log('=== ' + c.name + (errs.length ? ' ERRORS ' + errs.join(' | ') : ''));
    errs.length = 0;
  }
  await browser.close();
})();
