// node dump.js <ROOT> <states.json> [sections]: prints each state's duo-bay text by section (1280 px, light)
// states: [[label, state, effortPick, ollieLogKg]]
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const ROOT = process.argv[2], STATES = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));
const SECS = (process.argv[4] || 'verdict,status-row,tiles,effort-read,happens,math,callout,viz').split(',');
const { settle } = require(path.join(ROOT, 'test', 'make-page-fixture.js'));
const body = fs.readFileSync(path.join(ROOT, 'dist', 'index.html'), 'utf8'), prev = path.join(path.dirname(process.argv[3]), 'dump-page-' + process.pid + '.html');
fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>body{margin:0;font:14px system-ui}</style></head><body>' + body + '</body></html>');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(prev).href);
  for (const [lab, st, eff, oKg] of STATES) {
    errs.length = 0;
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), Object.assign({ duoOpen: true }, st));
    await page.reload(); await page.waitForTimeout(500); await settle(page, 'bay'); await page.waitForTimeout(200); await settle(page, 'duo-bay');
    if (oKg != null) { await page.evaluate(() => { document.getElementById('ollie-setup').open = true; }); await page.evaluate(() => document.getElementById('o-own').click()); await page.waitForTimeout(300);
      await page.evaluate((v) => { const s = document.getElementById('o-strength'); s.value = String(v); s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); }, oKg); await page.waitForTimeout(800); await settle(page, 'duo-bay'); }
    if (eff) { await page.selectOption('#duo-effort', eff); await page.waitForTimeout(300); await settle(page, 'duo-bay'); }
    const r = await page.evaluate((secs) => {
      const b = document.getElementById('duo-bay'), o = {};
      for (const s of secs) o[s] = Array.from(b.querySelectorAll(s === 'viz' ? '.viz svg' : '.' + s)).map((n) => s === 'viz' ? n.getAttribute('aria-label') : n.textContent.replace(/\s+/g, ' ').trim());
      o.bad = (b.textContent.match(/NaN|undefined|(?<![∞\w])Infinity|∞ N|about unlimited/g) || []);
      return o;
    }, SECS);
    console.log('\n=== ' + lab + (errs.length ? ' ERRORS ' + errs.join(' | ') : ''));
    for (const s of SECS) for (const t of r[s]) console.log('[' + s + '] ' + t);
    if (r.bad.length) console.log('[BAD] ' + r.bad.join(', '));
  }
  await browser.close();
  fs.unlinkSync(prev);
})().catch((e) => { console.error(e); process.exit(1); });
