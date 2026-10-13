// node pg.js <tree> '<stateJSON>' <effort> <outfile> [duo]
const fs = require('fs');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const [tree, stateJ, effort, outF, duo] = process.argv.slice(2);
  const html = fs.readFileSync(__dirname + '/' + tree + '/rex-strength-lab/dist/index.html', 'utf8');
  const wrap = __dirname + '/out/page-' + tree + '.html';
  if (!fs.existsSync(wrap)) fs.writeFileSync(wrap, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push(String(e)));
  await page.addInitScript((s) => { try { localStorage.setItem('rex-lab-v1', s); } catch (e) {} }, stateJ);
  await page.goto('file://' + wrap);
  await page.waitForTimeout(500);
  const sel = duo ? '#duo-effort' : '#effort';
  if (effort && effort !== 'least') { await page.selectOption(sel, effort); }
  const t0 = Date.now();
  for (let i = 0; i < 600; i++) {
    const txt = await page.evaluate(() => document.body.innerText);
    if (!/working it out|Working out/i.test(txt)) break;
    await page.waitForTimeout(250);
  }
  const ms = Date.now() - t0;
  await page.evaluate(() => document.querySelectorAll('details').forEach((d) => { d.open = true; }));
  await page.waitForTimeout(300);
  const txt = await page.evaluate(() => document.body.innerText);
  fs.writeFileSync(outF, txt + '\n\n[errors] ' + JSON.stringify(errs) + '\n[settle ms] ' + ms + '\n');
  await browser.close();
})();
