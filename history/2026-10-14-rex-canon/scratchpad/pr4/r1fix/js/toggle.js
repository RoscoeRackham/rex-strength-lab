const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const ROOT = process.argv[2] || '/home/user/rex-strength-lab/rex-strength-lab';
const { readResult, settle } = require(ROOT + '/test/make-page-fixture.js');
const body = fs.readFileSync(ROOT + '/dist/index.html', 'utf8'), prev = path.join(__dirname, '..', 'view', 'toggle.html');
fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"></head><body>' + body + '</body></html>');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(prev).href);
  const load = async (st) => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(800); await settle(page, 'bay'); if (st.duoOpen) { await page.waitForTimeout(300); await settle(page, 'duo-bay'); } };
  const pick = async (v) => { await page.selectOption('#duo-effort', v); await page.waitForTimeout(300); await settle(page, 'duo-bay'); };
  const FB2 = { duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', logKg: 14, keepForm: false, airAbsorb: 0.5 };
  for (const pre of (process.argv[3] || 'windows').split(',')) {
    await load(FB2); await pick(pre);
    const before = await readResult(page, 'duo-bay');
    await page.evaluate(() => { document.getElementById('nkb-ollie').click(); document.getElementById('nkb-rex').click(); }); await page.waitForTimeout(400); await settle(page, 'bay'); await page.waitForTimeout(300); await settle(page, 'duo-bay');
    const inPlace = await readResult(page, 'duo-bay');
    await load(Object.assign({ noKnockback: false, oNoKnockback: false }, FB2)); await pick(pre);
    const fresh = await readResult(page, 'duo-bay');
    console.log(pre, 'inPlace==fresh', JSON.stringify(inPlace) === JSON.stringify(fresh), 'before==fresh', JSON.stringify(before) === JSON.stringify(fresh));
    for (const k of Object.keys(fresh)) if (JSON.stringify(inPlace[k]) !== JSON.stringify(fresh[k])) console.log('  ', k, '\n    in place:', JSON.stringify(inPlace[k]).slice(0, 600), '\n    fresh:   ', JSON.stringify(fresh[k]).slice(0, 600));
    for (const k of Object.keys(fresh)) if (JSON.stringify(before[k]) !== JSON.stringify(fresh[k])) console.log('  before differs in', k);
  }
  await browser.close();
})();
