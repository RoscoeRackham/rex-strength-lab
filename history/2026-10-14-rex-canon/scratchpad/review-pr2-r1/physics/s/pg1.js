const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const R = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r1/physics/repo/rex-strength-lab';
(async () => {
  const html = fs.readFileSync(R + '/dist/index.html', 'utf8');
  const f = path.join(__dirname, 'page.html');
  fs.writeFileSync(f, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(pathToFileURL(f).href);
  const wait = async () => { for (let i = 0; i < 120; i++) { await page.waitForTimeout(250); const t = await page.evaluate(() => document.body.innerText); if (!/working it out|Working out/.test(t)) return; } };
  const run = async (st, sel, label, setup) => {
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
    await page.reload(); await page.waitForTimeout(800);
    if (setup) await setup(page);
    await wait();
    const t = await page.evaluate((s) => (document.querySelector(s) || document.body).innerText, sel);
    console.log('==== ' + label + '\n' + t.split('\n').filter((l) => /endless ocean|kg·m\/s|slams|chest|source|planted|carried|swing|pin|Rex’s feet|ground under/i.test(l)).join('\n').slice(0, 3500));
  };
  await run({ saveV: 2, duoOpen: true, duoAction: 'catch', cObj: 'bus', cLogD: 1, cStyle: 'hard' }, '#duo-bay', 'catch bus 10 m hard allout', async (p) => { await p.selectOption('#duo-effort', 'allout'); });
  await run({ saveV: 2, duoOpen: true, duoAction: 'arm' }, '#duo-bay', 'arm, Ollie own effort at half', async (p) => { await p.waitForTimeout(500); const has = await p.$('#o-own'); if (has) { await p.click('#o-own').catch(() => {}); } });
  console.log('errors', errs);
  await browser.close();
})();
