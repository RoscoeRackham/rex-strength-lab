// usage: node page.js '<json state>' [effort] [duoEffort] [selector]
const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = __dirname;
const html = fs.readFileSync(S + '/repo/rex-strength-lab/dist/index.html', 'utf8');
const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>';
fs.writeFileSync(S + '/wrapped.html', wrapped);
async function run(cases) {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const out = [];
  for (const cs of cases) {
    const ctxB = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctxB.newPage();
    const errs = [];
    page.on('pageerror', (e) => errs.push(String(e)));
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await page.addInitScript((st) => { localStorage.setItem('rex-lab-v1', JSON.stringify(st)); }, cs.state);
    await page.goto('file://' + S + '/wrapped.html');
    await page.waitForTimeout(500);
    if (cs.effort) { await page.selectOption('#effort', cs.effort); }
    if (cs.duoEffort) { await page.selectOption('#duo-effort', cs.duoEffort); }
    for (let i = 0; i < 400; i++) { const t = await page.evaluate(() => document.body.innerText); if (!/working it out|Working out/i.test(t)) break; await page.waitForTimeout(250); }
    await page.waitForTimeout(200);
    const text = await page.evaluate((sel) => { const e = document.querySelector(sel || '.bay-col'); return e ? e.innerText : document.body.innerText; }, cs.sel);
    out.push({ name: cs.name, text, errs });
    if (cs.shot) await page.screenshot({ path: S + '/' + cs.shot, fullPage: true });
    await ctxB.close();
  }
  await browser.close();
  return out;
}
module.exports = { run };
if (require.main === module) {
  const cases = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  run(cases).then((o) => { for (const r of o) { console.log('=== ' + r.name + (r.errs.length ? ' ERRORS: ' + r.errs.join(' | ') : '')); console.log(r.text); } });
}
