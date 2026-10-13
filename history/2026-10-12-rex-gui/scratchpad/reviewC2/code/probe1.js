const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { readResult, settle } = require('/home/user/rex-strength-lab/rex-strength-lab/test/make-page-fixture.js');
const DIR = process.argv[2];
(async () => {
  const body = fs.readFileSync('/home/user/rex-strength-lab/rex-strength-lab/dist/index.html', 'utf8');
  const prev = path.join(DIR, 'probe.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(prev).href);
  const load = async (st) => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(600); await settle(page, 'bay'); };
  const bayT = () => page.evaluate(() => document.getElementById('bay').textContent.replace(/ /g, ' ').replace(/\s+/g, ' '));
  for (const st of [{ action: 'weight', H: 10, m: 1e27 }, { action: 'weight', H: 0.1, m: 1.1e13 }, { action: 'weight', m: 1e21 }, { action: 'weight', m: 1e24 }, {action:'weight', H: 500, m: 1e30}, {action:'weight', m: 1e18}]) {
    await load(st);
    const t = await bayT();
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('rex-lab-v1')));
    console.log('\n=== ', JSON.stringify(st), 'saved H/m', saved.H, saved.m);
    for (const s of t.split(/(?<=[.)])\s+/)) if (/the same as|× the|% of the|beyond the ladder|blow the Earth|holds the Earth|Energy released/.test(s)) console.log('  >', s.slice(0, 400));
  }
  console.log('errs', errs);
  await browser.close();
})();
