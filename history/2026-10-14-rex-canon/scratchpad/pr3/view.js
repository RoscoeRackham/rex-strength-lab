// dump the page text for a few saved states. node view.js <rex-strength-lab dir> '<json array of states>' [selector]
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const ROOT = process.argv[2], states = JSON.parse(process.argv[3]), sel = process.argv[4] || '#bay';
(async () => {
  const body = fs.readFileSync(path.join(ROOT, 'dist', 'index.html'), 'utf8');
  const prev = path.join(__dirname, 'view', 'p.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"></head><body>' + body + '</body></html>');
  const { settle } = require(path.join(ROOT, 'test', 'make-page-fixture.js'));
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(pathToFileURL(prev).href);
  for (const st of states) {
    await page.evaluate((x) => { if (x) localStorage.setItem('rex-lab-v1', JSON.stringify(x)); else localStorage.clear(); }, st);
    await page.reload(); await page.waitForTimeout(800); await settle(page, 'bay');
    if (st && st.duoOpen) { await page.waitForTimeout(500); await settle(page, 'duo-bay'); }
    if (st && st.__effort) { await page.selectOption(st.duoOpen ? '#duo-effort' : '#effort', st.__effort); await page.waitForTimeout(400); await settle(page, st.duoOpen ? 'duo-bay' : 'bay'); }
    const t = await page.evaluate((s) => Array.from(document.querySelectorAll(s)).map((n) => n.innerText).join('\n---\n'), sel);
    const sum = await page.evaluate(() => [document.getElementById('powers-sum').textContent, document.getElementById('sw-passenger').checked, localStorage.getItem('rex-lab-v1') && JSON.parse(localStorage.getItem('rex-lab-v1')).saveV]);
    console.log('=== ' + JSON.stringify(st) + ' | ' + JSON.stringify(sum) + '\n' + t);
  }
  if (errs.length) console.log('ERRORS', errs);
  await browser.close();
})();
