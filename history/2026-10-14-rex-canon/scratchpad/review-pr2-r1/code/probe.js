// node probe.js <dist> '<json state>' [effort] [regex] : load a state on the page and print the bay's text (or matching sentences)
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { settle } = require(path.join(__dirname, 'repo/rex-strength-lab/test/make-page-fixture.js'));
(async () => {
  const [dist, stJ, eff, re] = process.argv.slice(2), st = JSON.parse(stJ);
  const prev = path.join(path.dirname(dist), 'pr-preview.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + fs.readFileSync(dist, 'utf8') + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  await page.goto(pathToFileURL(prev).href);
  await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(800);
  const bay = st.duoOpen ? 'duo-bay' : 'bay';
  await settle(page, 'bay'); if (st.duoOpen) await settle(page, 'duo-bay');
  if (eff) { await page.selectOption(st.duoOpen ? '#duo-effort' : '#effort', eff); await page.waitForTimeout(300); await settle(page, bay); }
  const t = await page.evaluate((id) => { const b = document.getElementById(id); b.querySelectorAll('details').forEach((d) => { d.open = true; }); return b.textContent.replace(/\s+/g, ' '); }, bay);
  if (re) { const rx = new RegExp('[^.]*(' + re + ')[^.]*\\.', 'g'); console.log((t.match(rx) || ['(no match)']).join('\n')); } else console.log(t);
  if (errs.length) console.log(errs.join('\n'));
  await browser.close();
})();
