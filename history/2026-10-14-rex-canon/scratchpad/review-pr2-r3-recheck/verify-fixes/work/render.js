// node render.js <dist/index.html> '<json array of [state, effort|null]>' -> prints verdict, status, happens, math, effort-read
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r3-recheck/verify-fixes/repo/rex-strength-lab';
const { settle } = require(REPO + '/test/make-page-fixture.js');
const [html, statesJson, grepRe] = process.argv.slice(2);
(async () => {
  const prev = path.join(__dirname, 'rd-' + process.pid + '.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + fs.readFileSync(html, 'utf8') + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  await page.goto(pathToFileURL(prev).href);
  const T = (s) => page.evaluate((sel) => Array.from(document.querySelectorAll('#bay ' + sel)).map((n) => n.textContent.replace(/\s+/g, ' ')).join(' / '), s);
  for (const [st, eff] of JSON.parse(statesJson)) {
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(800); await settle(page, 'bay');
    if (eff) { await page.selectOption('#effort', eff); await page.waitForTimeout(300); await settle(page, 'bay'); }
    const out = { verdict: await T('.verdict'), status: await T('.status-row'), happens: await T('.happens'), math: await T('details.math'), effort: await T('.effort-read') };
    console.log('### ' + JSON.stringify(st) + ' effort=' + eff);
    for (const [k, v] of Object.entries(out)) {
      if (grepRe) { const m = v.match(new RegExp(grepRe, 'g')); if (m) console.log('  ' + k + ': ' + m.join(' || ')); }
      else console.log('  ' + k + ': ' + v);
    }
  }
  if (errs.length) console.log('ERRS', errs);
  await browser.close(); fs.unlinkSync(prev);
})();
