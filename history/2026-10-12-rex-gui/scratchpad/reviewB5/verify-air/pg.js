// node pg.js '<json {state, duo, effort, duoEffort}>' outfile
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const SRC = '/home/user/rex-strength-lab/rex-strength-lab/dist/index.html';
const wrap = path.join(__dirname, 'wrapped.html');
(async () => {
  const cfg = JSON.parse(process.argv[2]);
  if (!fs.existsSync(wrap)) fs.writeFileSync(wrap, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + fs.readFileSync(SRC, 'utf8') + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(wrap).href);
  await page.evaluate((s) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, cfg.state || {});
  await page.reload();
  const bay = cfg.duo ? 'duo-bay' : 'bay';
  const settle = async () => { for (let i = 0; i < 600; i++) { const busy = await page.evaluate((id) => { const b = document.getElementById(id); return !b || /working it out|Working out/i.test(b.textContent); }, bay); if (!busy) return; await page.waitForTimeout(250); } console.log('STILL WORKING'); };
  await page.waitForTimeout(1500); await settle();
  if (cfg.effort) { await page.selectOption('#effort', cfg.effort); await page.waitForTimeout(800); await settle(); }
  if (cfg.duoEffort) { await page.selectOption('#duo-effort', cfg.duoEffort); await page.waitForTimeout(800); await settle(); }
  const text = await page.evaluate((id) => { const b = document.getElementById(id); b.querySelectorAll('details').forEach((d) => (d.open = true)); return b.innerText; }, bay);
  fs.writeFileSync(process.argv[3], (errs.length ? 'ERRORS: ' + errs.join(' | ') + '\n' : '') + text);
  await browser.close();
})();
