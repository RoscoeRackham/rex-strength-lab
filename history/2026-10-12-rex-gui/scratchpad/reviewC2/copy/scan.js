const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const { settle } = require(process.argv[2] + '/test/make-page-fixture.js');
(async () => {
  const body = fs.readFileSync(process.argv[2] + '/dist/index.html', 'utf8');
  const prev = path.join(process.argv[3], 'preview.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}</style></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: CHROME });
  const W = Number(process.argv[4] || 390);
  const page = await browser.newPage({ viewport: { width: W, height: 844 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(prev).href);
  const out = [];
  const actions = (process.argv[5] || 'punch,clap,stomp').split(',');
  for (const action of actions) for (let logKg = 1; logKg <= 34; logKg++) for (const mode of ['comic', 'real']) for (const eff of ['least', 'allout']) {
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), { action, logKg, mode });
    await page.reload(); await page.waitForTimeout(300); await settle(page, 'bay');
    if (eff === 'allout') { await page.selectOption('#effort', 'allout'); await page.waitForTimeout(250); await settle(page, 'bay'); }
    const r = await page.evaluate(() => {
      const tiles = Array.from(document.querySelectorAll('#bay .tile'));
      const res = [];
      tiles.forEach((t, i) => {
        const k = (t.querySelector('.k') || {}).textContent;
        if (k === 'Compared with') {
          const v = t.querySelector('.v');
          res.push({ v: v.textContent.replace(/ /g, ' '), prevK: (tiles[i-1].querySelector('.k')||{}).textContent, prev: (tiles[i - 1].querySelector('.v') || {}).textContent, sub: (tiles[i-1].querySelector('.s, .sub, small')||{}).textContent, ovf: t.scrollWidth - t.clientWidth, vovf: v.scrollWidth - v.clientWidth });
        }
      });
      return { tiles: res, pageOvf: document.documentElement.scrollWidth - document.documentElement.clientWidth };
    });
    out.push({ action, logKg, mode, eff, ...r });
  }
  fs.writeFileSync(path.join(process.argv[3], 'scan-' + W + '-' + actions.join('_') + '.json'), JSON.stringify({ out, errs }, null, 1));
  console.log('done', out.length, 'errs', errs.length);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
