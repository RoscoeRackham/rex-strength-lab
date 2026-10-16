// usage: node probe.js <dist html> <states.json>  ; states: [{name, state, effort?, duoEffort?, eval?}]
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const R = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r3/physics/repo/rex-strength-lab';
const { readResult, settle } = require(R + '/test/make-page-fixture.js');
(async () => {
  const html = fs.readFileSync(process.argv[2], 'utf8');
  const states = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));
  const prev = path.join(__dirname, 'prev-' + path.basename(process.argv[2]));
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(pathToFileURL(prev).href);
  for (const s of states) {
    await page.evaluate((x) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(x)); }, s.state);
    await page.reload(); await page.waitForTimeout(800);
    const bay = s.state.duoOpen ? 'duo-bay' : 'bay';
    await settle(page, bay);
    if (s.actions) for (const a of s.actions) { await page.evaluate(a); await page.waitForTimeout(500); await settle(page, bay); }
    if (s.effort) { await page.selectOption('#effort', s.effort); await page.waitForTimeout(300); await settle(page, bay); }
    if (s.duoEffort) { await page.selectOption('#duo-effort', s.duoEffort); await page.waitForTimeout(300); await settle(page, bay); }
    const r = await readResult(page, bay);
    console.log('=== ' + s.name);
    for (const k of (s.keys || Object.keys(r))) { const v = r[k]; if (v == null || (Array.isArray(v) && !v.length)) continue; console.log('[' + k + '] ' + (Array.isArray(v) ? v.join(' || ') : v)); }
  }
  if (errs.length) console.log('PAGE ERRORS', errs);
  await browser.close();
})();
