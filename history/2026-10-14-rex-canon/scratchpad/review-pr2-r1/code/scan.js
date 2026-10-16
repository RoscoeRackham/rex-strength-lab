// node scan.js <dist> : page text for NaN/undefined/bare Infinity and page errors across states with their powers on
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { settle } = require(path.join(__dirname, 'repo/rex-strength-lab/test/make-page-fixture.js'));
const dist = process.argv[2];
(async () => {
  const body = fs.readFileSync(dist, 'utf8');
  const prev = path.join(path.dirname(dist), 'sc-preview.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(prev).href);
  const bad = (t) => (t.match(/NaN|undefined|(?<![∞\w])Infinity/g) || []);
  const found = [];
  const states = [];
  for (const lk of [20, 'inf']) for (const anchor of ['friction', 'bolted']) { const logKg = lk === 'inf' ? 9 : lk, inf = lk === 'inf';
    for (const action of ['throw', 'stomp', 'punch', 'pull']) states.push({ action, logKg, inf, anchor });
    states.push({ action: 'throw', logKg, inf, anchor, obj: 'bus', angle: 0 });
    states.push({ action: 'throw', logKg, inf, anchor, obj: 'baseball', angle: 90 });
    for (const duoAction of ['arm', 'catch']) states.push({ duoOpen: true, duoAction, logKg, inf, anchor, oAnchor: anchor });
    states.push({ duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', logKg, inf, anchor });
    states.push({ duoOpen: true, duoAction: 'catch', cObj: 'partner', cStyle: 'hard', logKg, inf, anchor });
    states.push({ duoOpen: true, duoAction: 'wrestle', wrestleMove: 'shove', logKg, inf, anchor });
    states.push({ duoOpen: true, duoAction: 'wrestle', wrestleMove: 'throw', logKg, inf, anchor });
  }
  // unlimited strength: the strength dial's unlimited setting is logKg past its top? use 'inf' key if the page has one
  for (const st of states) {
    try {
      await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(500);
      await settle(page, 'bay'); if (st.duoOpen) await settle(page, 'duo-bay');
      for (const e of ['least', 'allout']) {
        const sel = st.duoOpen ? '#duo-effort' : '#effort';
        if (e !== 'least') { if (!(await page.$(sel))) continue; try { await page.selectOption(sel, e); } catch (x) { continue; } await page.waitForTimeout(200); await settle(page, st.duoOpen ? 'duo-bay' : 'bay'); }
        const t = await page.evaluate((id) => document.getElementById(id).textContent.replace(/\s+/g, ' '), st.duoOpen ? 'duo-bay' : 'bay');
        const b = bad(t);
        if (b.length) found.push(JSON.stringify(st) + ' ' + e + ': ' + b.slice(0, 3).join(',') + ' :: ' + (t.match(/[^.]*(NaN|undefined|(?<![∞\w])Infinity)[^.]*/) || [''])[0].slice(0, 200));
      }
    } catch (x) { found.push(JSON.stringify(st) + ' threw ' + x.message); }
  }
  console.log(JSON.stringify({ states: states.length, found, errs: Array.from(new Set(errs)).slice(0, 10) }, null, 1));
  await browser.close();
})();
