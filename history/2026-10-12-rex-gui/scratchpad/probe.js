// probe: load states into the built page, pick a duo or solo effort, print the effort box
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const ROOT = '/home/user/rex-strength-lab/rex-strength-lab';
const body = fs.readFileSync(path.join(ROOT, 'dist/index.html'), 'utf8');
const prev = path.join(ROOT, 'dist', 'probe.html');
fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
const cases = JSON.parse(process.argv[2]);
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(prev).href);
  const settle = async (id) => { for (let i = 0; i < 240; i++) { const b = await page.evaluate((x) => /working it out|Working out/i.test(document.getElementById(x).textContent), id); if (!b) return; await page.waitForTimeout(250); } };
  for (const c of cases) {
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), c.state); await page.reload(); await page.waitForTimeout(800);
    const bay = c.state.duoOpen ? 'duo-bay' : 'bay'; await settle('bay'); if (c.state.duoOpen) await settle('duo-bay');
    if (c.pick) { await page.selectOption(c.state.duoOpen ? '#duo-effort' : '#effort', c.pick); await page.waitForTimeout(400); await settle(bay); }
    const sel = c.sel || ('#' + bay + ' .effort-read');
    const t = await page.evaluate((s) => Array.from(document.querySelectorAll(s)).map((n) => n.textContent.replace(/\s+/g, ' ')).join(' || '), sel);
    console.log('== ' + JSON.stringify(c.state) + ' ' + (c.pick || '') + '\n' + t.slice(0, c.n || 900));
  }
  if (errs.length) console.log('ERRORS', errs.slice(0, 5));
  await browser.close(); fs.unlinkSync(prev);
})();
