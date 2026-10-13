// usage: node page.js '<json state>' [effortPick] [duoEffortPick] [bayId] [grepRegex]
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { readResult, settle } = require('/home/user/rex-strength-lab/rex-strength-lab/test/make-page-fixture.js');
(async () => {
  const st = JSON.parse(process.argv[2]); const pick = process.argv[3] || ''; const dpick = process.argv[4] || ''; const bay = process.argv[5] || 'bay'; const re = process.argv[6] ? new RegExp(process.argv[6], 'i') : null;
  const body = fs.readFileSync('/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewB5/verify-code/fix3/dist/index.html', 'utf8');
  const prev = path.join(__dirname, 'p.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(prev).href);
  await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
  await page.reload(); await page.waitForTimeout(1500);
  await settle(page, bay);
  if (pick) { await page.selectOption('#effort', pick); await page.waitForTimeout(500); await settle(page, bay); }
  if (dpick) { await page.selectOption('#duo-effort', dpick); await page.waitForTimeout(500); await settle(page, bay); }
  const r = await readResult(page, bay);
  if (re) {
    const all = await page.evaluate((id) => document.getElementById(id).innerText, bay);
    for (const line of all.split(/\n+/)) if (re.test(line)) console.log('> ' + line);
  } else console.log(JSON.stringify(r, null, 1));
  if (errs.length) console.log('ERRORS', errs);
  await browser.close();
})();
