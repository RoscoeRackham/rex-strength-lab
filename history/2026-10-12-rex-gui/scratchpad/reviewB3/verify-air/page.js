// usage: node page.js '<json array of cases>'  each case: { id, state, duo: bool, pick }
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { readResult, settle } = require('/home/user/rex-strength-lab/rex-strength-lab/test/make-page-fixture.js');
const cases = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
(async () => {
  const body = fs.readFileSync('/home/user/rex-strength-lab/rex-strength-lab/dist/index.html', 'utf8');
  const prev = path.join(__dirname, 'preview.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.on('pageerror', (e) => console.log('PAGEERROR', e.message));
  await page.goto(pathToFileURL(prev).href);
  for (const c of cases) {
    await page.evaluate((s) => { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, c.state);
    await page.reload();
    await page.waitForTimeout(800);
    const bay = c.duo ? 'duo-bay' : 'bay';
    if (c.duo) { const open = await page.evaluate(() => document.getElementById('duo').open); if (!open) { await page.click('#duo > summary'); await page.waitForTimeout(400); } }
    await settle(page, bay);
    if (c.pick) { await page.selectOption(c.duo ? '#duo-effort' : '#effort', c.pick); await page.waitForTimeout(500); await settle(page, bay); }
    const txt = await page.evaluate((id) => document.getElementById(id).textContent.replace(/\s+/g, ' ').trim(), bay);
    fs.writeFileSync(path.join(__dirname, 'out-' + c.id + '.txt'), txt);
    console.log('=== ' + c.id + ' (' + txt.length + ' chars)');
    for (const g of c.grep || []) { const re = new RegExp(g, 'g'); let m; const seen = new Set(); while ((m = re.exec(txt))) { const s = txt.slice(Math.max(0, m.index - 150), m.index + 350); if (!seen.has(s)) { seen.add(s); console.log('  ...' + s + '...'); } if (seen.size > 2) break; } }
  }
  await browser.close();
})();
