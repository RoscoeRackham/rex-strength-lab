// usage: node pw.js <dist/index.html> <out.json> ; runs scenarios against a wrapped copy
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const [dist, outFile, width] = process.argv.slice(2);
(async () => {
  const body = fs.readFileSync(dist, 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}</style></head><body>' + body + '</body></html>';
  const prev = path.join(path.dirname(outFile), path.basename(outFile, '.json') + '-preview.html');
  fs.writeFileSync(prev, wrapped);
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: Number(width || 1280), height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(prev).href);
  const load = async (st, allout, grow) => {
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(900);
    if (allout) { await page.selectOption('#effort', 'allout'); await page.waitForTimeout(600); }
    if (grow) { await page.click(`[data-v="${grow}"], #grow-what [data-value="${grow}"]`).catch(async () => { const b = await page.$$('button'); for (const x of b) { if ((await x.textContent()).trim() === grow) { await x.click(); break; } } }); await page.waitForTimeout(600); }
  };
  const res = {};
  const scen = JSON.parse(fs.readFileSync(process.argv[5], 'utf8'));
  for (const s of scen) {
    await load(s.st, s.allout, s.grow);
    res[s.name] = await page.evaluate((sel) => {
      const tiles = Array.from(document.querySelectorAll('#bay .tile')).map((t) => ((t.querySelector('.k') || {}).textContent || '') + ' = ' + ((t.querySelector('.v') || {}).textContent || ''));
      const txt = document.getElementById('bay').textContent.replace(/\s+/g, ' ');
      return { tiles, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, txt };
    });
  }
  res.errs = errs;
  fs.writeFileSync(outFile, JSON.stringify(res, null, 1));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
