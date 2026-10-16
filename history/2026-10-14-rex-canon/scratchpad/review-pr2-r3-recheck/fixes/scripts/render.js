// Dump the Pull bay's text for given states. node render.js <dir> '<json array of [state, effort]>'
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { settle } = require('/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r3-recheck/fixes/repo/rex-strength-lab/test/make-page-fixture.js');
const dir = process.argv[2], states = JSON.parse(process.argv[3]), sels = (process.argv[4] || '.verdict,.status-row,.happens,.effort-read,details.math,.bars,.haz-list').split(',');
(async () => {
  const body = fs.readFileSync(path.join(dir, 'dist', 'index.html'), 'utf8');
  const prev = path.join(dir, 'dist', 'preview-render.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(pathToFileURL(prev).href);
  for (const [st, eff, bay] of states) {
    const b = bay || 'bay';
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(800); await settle(page, b);
    if (eff) { await page.selectOption(b === 'bay' ? '#effort' : '#duo-effort', eff); await page.waitForTimeout(300); await settle(page, b); }
    console.log('##### ' + JSON.stringify(st) + ' ' + (eff || 'least'));
    for (const s of sels) { const t = await page.evaluate(([bb, ss]) => Array.from(document.querySelectorAll('#' + bb + ' ' + ss)).map((n) => n.textContent.replace(/\s+/g, ' ').trim()).join(' / '), [b, s]); if (t) console.log('[' + s + '] ' + t); }
  }
  if (errs.length) console.log('PAGE ERRORS ' + errs.join(' | '));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(2); });
