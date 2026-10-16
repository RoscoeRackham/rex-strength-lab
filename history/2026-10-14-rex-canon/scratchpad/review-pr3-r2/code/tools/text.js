const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const lab = path.resolve(process.argv[2]), states = JSON.parse(process.argv[3]), sel = process.argv[4] || '#bay';
const { settle } = require(path.join(lab, 'test', 'make-page-fixture.js'));
(async () => {
  const body = fs.readFileSync(path.join(lab, 'dist', 'index.html'), 'utf8');
  const prev = path.join(__dirname, 't-' + process.pid + '.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(prev).href);
  for (const st of states) {
    const pickV = st.__pick; delete st.__pick;
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(600); await settle(page, 'bay'); if (st.duoOpen) await settle(page, 'duo-bay');
    if (pickV) { await page.selectOption(st.duoOpen ? '#duo-effort' : '#effort', pickV); await page.waitForTimeout(300); await settle(page, st.duoOpen ? 'duo-bay' : 'bay'); }
    const t = await page.evaluate((s) => Array.from(document.querySelectorAll(s)).map((n) => n.textContent.replace(/\s+/g, ' ')).join('\n'), sel);
    console.log('=== ' + JSON.stringify(st) + (pickV ? ' ' + pickV : '') + '\n' + t);
  }
  await browser.close(); fs.unlinkSync(prev);
})().catch((e) => { console.error(e); process.exit(1); });
