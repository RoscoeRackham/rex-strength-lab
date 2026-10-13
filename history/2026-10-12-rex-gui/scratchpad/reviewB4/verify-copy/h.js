// usage: node h.js cases.json   -> prints bay text per case
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = __dirname;
const body = fs.readFileSync(path.join(S, 'repo/rex-strength-lab/dist/index.html'), 'utf8');
const prev = path.join(S, 'page.html');
fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
const cases = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
async function settle(page, id) { for (let i = 0; i < 240; i++) { const b = await page.evaluate((id) => /working it out|Working out/i.test(document.getElementById(id).textContent), id); if (!b) return; await page.waitForTimeout(250); } console.log('STILL WORKING'); }
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.on('pageerror', (e) => console.log('PAGEERROR ' + e.message));
  await page.goto(pathToFileURL(prev).href);
  for (const c of cases) {
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), c.state);
    await page.reload(); await page.waitForTimeout(800);
    const bay = c.state.duoOpen ? 'duo-bay' : 'bay';
    await settle(page, bay);
    if (c.pick) { await page.selectOption(bay === 'duo-bay' ? '#duo-effort' : '#effort', c.pick); await page.waitForTimeout(400); await settle(page, bay); }
    if (c.eval) { await page.evaluate(c.eval); await page.waitForTimeout(600); await settle(page, bay); }
    const t = await page.evaluate((id) => { const b = document.getElementById(id); const txt = (n) => n.textContent.replace(/\s+/g, ' ').trim();
      return Array.from(b.querySelectorAll('.verdict, .status-row, .tiles, .effort-read, .happens li, .callout, details.math .eq')).map((n) => '[' + n.className.split(' ')[0] + '] ' + txt(n)).join('\n'); }, bay);
    console.log('=== ' + c.id + '\n' + t + '\n');
  }
  await browser.close();
})();
