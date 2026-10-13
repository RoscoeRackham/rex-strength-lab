// usage: node page.js <branch|main> '<json spec>'
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = __dirname;
(async () => {
  const which = process.argv[2];
  const spec = JSON.parse(process.argv[3]);
  const src = which === 'main' ? path.join(S, 'main/index.html') : path.join(S, 'repo/rex-strength-lab/dist/index.html');
  const body = fs.readFileSync(src, 'utf8');
  const file = path.join(S, 'pages', which + '.html');
  fs.writeFileSync(file, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(pathToFileURL(file).href);
  await page.evaluate((s) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, spec.state || {});
  await page.reload(); await page.waitForTimeout(1000);
  const bay = spec.bay || 'bay';
  const settle = async () => { for (let i = 0; i < 240; i++) { const busy = await page.evaluate((id) => /working it out|Working out/i.test(document.getElementById(id).textContent), bay); if (!busy) return; await page.waitForTimeout(250); } console.log('STILL WORKING'); };
  await settle();
  if (spec.effort) { await page.selectOption('#effort', spec.effort); await page.waitForTimeout(500); await settle(); }
  if (spec.duoEffort) { await page.selectOption('#duo-effort', spec.duoEffort); await page.waitForTimeout(500); await settle(); }
  if (spec.eval) { const r = await page.evaluate(spec.eval); console.log('EVAL', JSON.stringify(r)); }
  const t = await page.evaluate((id) => document.getElementById(id).innerText, bay);
  // also math eq
  const math = await page.evaluate((id) => Array.from(document.getElementById(id).querySelectorAll('details.math')).map(n => n.textContent.replace(/\s+/g, ' ')), bay);
  fs.writeFileSync(path.join(S, 'pages', (spec.out || 'out') + '.txt'), t + '\n\n=== MATH ===\n' + math.join('\n'));
  if (spec.grep) for (const g of spec.grep) { const re = new RegExp(g, 'i'); const lines = (t + '\n' + math.join('\n')).split('\n').filter((l) => re.test(l)); console.log('--- ' + g); lines.forEach((l) => console.log('  ' + l.slice(0, 700))); }
  if (errs.length) console.log('ERRS', errs);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
