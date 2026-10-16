// usage: node page.js '<json state>' [pick] [extra js to run before reading]
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = process.env.REPO || '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr4-r1/verify-duo/repo';
const { settle } = require(REPO + '/rex-strength-lab/test/make-page-fixture.js');
(async () => {
  const body = fs.readFileSync(path.join(REPO, 'rex-strength-lab/dist/index.html'), 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>';
  const f = path.join(__dirname, 'prev-' + (process.env.TAG || 'x') + '.html'); fs.writeFileSync(f, wrapped);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(f).href);
  const st = JSON.parse(process.argv[2]);
  await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(1200);
  await settle(page, 'bay'); await page.waitForTimeout(300); await settle(page, 'duo-bay');
  if (process.argv[3]) { await page.selectOption('#duo-effort', process.argv[3]); await page.waitForTimeout(400); await settle(page, 'duo-bay'); }
  if (process.argv[4]) { await page.evaluate(process.argv[4]); await page.waitForTimeout(1200); await settle(page, 'duo-bay'); }
  const r = await page.evaluate(() => { const bay = document.getElementById('duo-bay'); const txt = (n) => (n ? n.textContent.replace(/\s+/g, ' ').trim() : null); const all = (s) => Array.from(bay.querySelectorAll(s)).map(txt);
    return { verdict: txt(bay.querySelector('.verdict')), status: all('.status-row'), tiles: all('.tiles'), effort: all('.effort-read'), happens: all('.happens'), callouts: all('.callout') }; });
  console.log(JSON.stringify(r, null, 1));
  if (errs.length) console.log('ERRS', errs);
  await browser.close();
})();
