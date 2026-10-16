const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const repo = process.argv[2] || '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r2/verify-code/repo';
const scratch = path.dirname(__filename);
(async () => {
  const body = fs.readFileSync(path.join(repo, 'rex-strength-lab/dist/index.html'), 'utf8');
  const f = path.join(scratch, 'page-' + path.basename(repo) + '.html');
  fs.writeFileSync(f, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(pathToFileURL(f).href);
  const settle = async (id) => { for (let i = 0; i < 160; i++) { const b = await page.evaluate((x) => /working it out|Working out/i.test(document.getElementById(x).textContent), id); if (!b) return; await page.waitForTimeout(250); } throw new Error('busy'); };
  const load = async (st) => { await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st); await page.reload(); await page.waitForTimeout(800); await settle('bay'); };
  const pick = async (sel, v) => { await page.selectOption(sel, v); await page.waitForTimeout(300); await settle('bay'); };
  const txt = (sel) => page.evaluate((s) => Array.from(document.querySelectorAll('#bay ' + s)).map((n) => n.textContent.replace(/\s+/g, ' ')).join(' / '), sel);
  const grab = (t, re) => (t.match(re) || ['(none)'])[0];
  for (const surface of ['ice', 'steel', 'concrete']) {
    for (const sp of [true, false]) {
      await load({ saveV: 3, action: 'throw', obj: 'person', surface, safePassenger: sp });
      const e = await txt('.effort-read');
      console.log('== ' + surface + ' SP=' + sp + ' least');
      console.log('  person para: ' + grab(e, /For a person[^]*?\)?\.(?= |$)/).slice(0, 400));
      console.log('  shaking line: ' + grab(e, /Ground shaking[^.]*\./));
      console.log('  box mentions no model: ' + /no ground-wave model/.test(e));
    }
    await load({ saveV: 3, action: 'throw', obj: 'person', surface, logKg: 9.15 }); await pick('#effort', 'allout');
    const h = await txt('.happens'), e2 = await txt('.effort-read');
    console.log('== ' + surface + ' 10^9.15 all-out');
    console.log('  Impact: ' + grab(h, /Impact:[^/]*/));
    console.log('  box shaking: ' + grab(e2, /Ground shaking[^.]*\.[^.]*\./));
    console.log('  box person: ' + grab(e2, /For a person[^]*?counts\.|For a person[^.]*\./));
  }
  console.log('errors', errs);
  await browser.close();
})();
