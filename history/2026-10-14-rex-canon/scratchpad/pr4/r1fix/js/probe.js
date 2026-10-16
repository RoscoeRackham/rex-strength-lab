// node probe.js <dist dir root> <states.json> [out.txt]
// states.json: [[label, state, effort ('allout'|'least'|preset|null), ollieLogKg|null], ...]
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const ROOT = process.argv[2], STATES = JSON.parse(fs.readFileSync(process.argv[3], 'utf8')), OUT = process.argv[4];
const { settle } = require(path.join(ROOT, 'test', 'make-page-fixture.js'));
const body = fs.readFileSync(path.join(ROOT, 'dist', 'index.html'), 'utf8');
const prev = path.join(__dirname, '..', 'view', 'probe-' + path.basename(path.dirname(ROOT)) + '-' + process.pid + '.html');
fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(prev).href);
  let out = '';
  for (const [lab, st, eff, oKg] of STATES) {
    errs.length = 0;
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), Object.assign({ duoOpen: true }, st));
    await page.reload(); await page.waitForTimeout(600); await settle(page, 'bay'); await page.waitForTimeout(300); await settle(page, 'duo-bay');
    if (oKg != null) { await page.evaluate(() => { document.getElementById('ollie-setup').open = true; }); await page.click('#o-own'); await page.waitForTimeout(300);
      await page.evaluate((v) => { const s = document.getElementById('o-strength'); s.value = String(v); s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); }, oKg); await page.waitForTimeout(800); await settle(page, 'duo-bay'); }
    if (eff) { await page.selectOption('#duo-effort', eff); await page.waitForTimeout(300); await settle(page, 'duo-bay'); }
    const t = await page.evaluate(() => { const b = document.getElementById('duo-bay'); const q = (s) => Array.from(b.querySelectorAll(s)).map((n) => n.textContent.replace(/\s+/g, ' ').trim());
      return { verdict: q('.verdict'), chips: q('.status-row .status'), tiles: q('.tile'), effort: q('.effort-read p, .effort-read .status'), callout: q('.callout'), happens: q('.happens li'), bars: q('svg text'), math: q('details.math .eq'), grid: q('.case-grid, table') }; });
    const flat = JSON.stringify(t);
    const bad = /NaN|undefined|Infinity|∞ N/.test(flat) ? ' !!BAD TOKENS' : '';
    out += '\n================ ' + lab + ' ' + JSON.stringify(st) + ' eff=' + eff + (oKg != null ? ' oKg=' + oKg : '') + bad + (errs.length ? ' !!ERRORS ' + errs.join(' | ') : '') + '\n';
    for (const [k, arr] of Object.entries(t)) if (arr.length) out += '--' + k + ':\n' + arr.map((x) => '   ' + x).join('\n') + '\n';
  }
  if (OUT) fs.writeFileSync(OUT, out); else console.log(out);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
