// probe.js <index.html> <json list of [label, state, pickSel, pickVal, selectors...]>
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { settle } = require('/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r3/code/repo/rex-strength-lab/test/make-page-fixture.js');
(async () => {
  const html = process.argv[2], cases = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + fs.readFileSync(html, 'utf8') + '</body></html>';
  const prev = path.join(path.dirname(html), 'preview-probe-' + process.pid + '.html'); fs.writeFileSync(prev, wrapped);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(prev).href);
  for (const [label, st, sel, val, ...sels] of cases) {
    const duo = !!st.duoOpen, bay = duo ? 'duo-bay' : 'bay';
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(800); await settle(page, bay);
    if (sel) { await page.selectOption(sel, val); await page.waitForTimeout(300); await settle(page, bay); }
    console.log('=== ' + label);
    for (const s of (sels.length ? sels : ['.effort-read'])) {
      const t = await page.evaluate(([b, s]) => Array.from(document.querySelectorAll('#' + b + ' ' + s)).map((n) => n.textContent.replace(/\s+/g, ' ').trim().slice(0, 90)).join(' || '), [bay, s]);
      console.log('[' + s + '] ' + t);
    }
  }
  if (errs.length) console.log('ERRORS ' + errs.join(' | '));
  await browser.close(); fs.unlinkSync(prev);
})();
