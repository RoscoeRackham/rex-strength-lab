// usage: node pg.js '<state json>' <effort> <outfile>
const fs = require('fs');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = __dirname;
(async () => {
  const st = JSON.parse(process.argv[2]); const effort = process.argv[3]; const out = process.argv[4];
  const html = fs.readFileSync(S + '/fixlab/rex-strength-lab/dist/index.html', 'utf8');
  const f = S + '/pagefix.html';
  if (!fs.existsSync(f)) fs.writeFileSync(f, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); }); p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('file://' + f);
  await p.evaluate((s) => { const cur = JSON.parse(localStorage.getItem('rex-lab-v1') || '{}'); localStorage.setItem('rex-lab-v1', JSON.stringify(Object.assign(cur, s))); }, st);
  await p.reload();
  await p.waitForTimeout(500);
  if (effort && effort !== '-') { await p.selectOption('#effort', effort); }
  for (let i = 0; i < 600; i++) { const t = await p.evaluate(() => document.body.innerText); if (!/working it out/i.test(t)) break; await p.waitForTimeout(300); }
  await p.waitForTimeout(500);
  await p.evaluate(() => document.querySelectorAll('details').forEach((d) => d.open = true));
  await p.waitForTimeout(300);
  const t = await p.evaluate(() => document.body.innerText);
  fs.writeFileSync(out, t + '\n\nERRS: ' + JSON.stringify(errs));
  await b.close();
})();
