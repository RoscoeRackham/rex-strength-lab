// the round-1 check 'a Never knocked back switch turned over in place gives what a fresh load gives', copied from test/shots.js
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { readResult, settle } = require(process.argv[3] + '/test/make-page-fixture.js');
(async () => {
  const body = fs.readFileSync(process.argv[2], 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>';
  const tmp = path.join(path.dirname(__filename), 'ip-' + process.pid + '.html'); fs.writeFileSync(tmp, wrapped);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(tmp).href);
  const load = async (st) => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(800); await settle(page, 'bay'); if (st.duoOpen) { await page.waitForTimeout(300); await settle(page, 'duo-bay'); } };
  const pick = async (v) => { await page.selectOption('#duo-effort', v); await page.waitForTimeout(300); await settle(page, 'duo-bay'); };
  const duoTxt = (sel) => page.evaluate((s) => Array.from(document.querySelectorAll('#duo-bay ' + s)).map((n) => n.textContent.replace(/\s+/g, ' ')).join(' / '), sel);
  const FB2 = { duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', logKg: 14, keepForm: false, airAbsorb: 0.5 };
  await load(FB2); await pick('windows');
  await page.evaluate(() => { document.getElementById('nkb-ollie').click(); document.getElementById('nkb-rex').click(); }); await page.waitForTimeout(400); await settle(page, 'bay'); await page.waitForTimeout(300); await settle(page, 'duo-bay');
  const inPlace = JSON.stringify(await readResult(page, 'duo-bay'));
  await pick('allout');
  const vIn = await duoTxt('.verdict');
  await load(Object.assign({ noKnockback: false, oNoKnockback: false }, FB2)); await pick('windows');
  const fresh = JSON.stringify(await readResult(page, 'duo-bay'));
  console.log('inPlace===fresh', inPlace === fresh, '343 regex', /It carries Ollie off at 343 m\/s/.test(vIn));
  console.log('check passes:', inPlace === fresh && /It carries Ollie off at 343 m\/s/.test(vIn));
  await browser.close(); fs.unlinkSync(tmp);
})();
