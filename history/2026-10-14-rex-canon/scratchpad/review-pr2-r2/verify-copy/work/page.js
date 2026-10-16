// usage: node page.js <branch|main> '<json state>' [effortPreset] [duo]  -> prints the bay's text parts
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const ROOT = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r2/verify-copy';
const { readResult, settle } = require(ROOT + '/repo/rex-strength-lab/test/make-page-fixture.js');
async function open(which) {
  const html = fs.readFileSync(ROOT + '/' + (which === 'main' ? 'main/repo' : 'repo') + '/rex-strength-lab/dist/index.html', 'utf8');
  const f = ROOT + '/work/page-' + which + '.html';
  fs.writeFileSync(f, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(pathToFileURL(f).href);
  return { browser, page, errs };
}
async function show(page, st, pick, duo) {
  const bay = duo ? 'duo-bay' : 'bay';
  await page.evaluate((s) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, st);
  await page.reload(); await page.waitForTimeout(800);
  await settle(page, bay);
  if (pick) { await page.selectOption(duo ? '#duo-effort' : '#effort', pick); await page.waitForTimeout(500); await settle(page, bay); }
  // open math
  return readResult(page, bay);
}
module.exports = { open, show };
if (require.main === module) (async () => {
  const [which, st, pick, duo] = process.argv.slice(2);
  const { browser, page, errs } = await open(which);
  const r = await show(page, JSON.parse(st), pick || null, duo === 'duo');
  console.log(JSON.stringify(r, null, 1));
  if (errs.length) console.log('ERRORS', errs);
  await browser.close();
})();
