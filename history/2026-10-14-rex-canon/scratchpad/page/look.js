// load the built page with saved states and print the bay text (scratch helper)
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const { settle } = require('/home/user/rex-strength-lab/rex-strength-lab/test/make-page-fixture.js');
const html = process.argv[2] || '/home/user/rex-strength-lab/rex-strength-lab/dist/index.html';
const states = JSON.parse(process.argv[3]);
(async () => {
  const body = fs.readFileSync(html, 'utf8');
  const prev = path.join(__dirname, 'prev-' + path.basename(path.dirname(path.dirname(html))) + '.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: fs.existsSync(CHROME) ? CHROME : undefined });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(prev).href);
  for (const st of states) {
    const { pick, duoPick, sel, ...s } = st;
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), s); await page.reload(); await page.waitForTimeout(800);
    const bay = s.duoOpen ? 'duo-bay' : 'bay';
    await settle(page, bay);
    if (pick) { await page.selectOption('#effort', pick); await page.waitForTimeout(300); await settle(page, 'bay'); }
    if (duoPick) { await page.selectOption('#duo-effort', duoPick); await page.waitForTimeout(300); await settle(page, 'duo-bay'); }
    const t = await page.evaluate(([b, q]) => { const n = q ? document.querySelectorAll(q) : [document.getElementById(b)]; return Array.from(n).map((x) => x.innerText).join('\n---\n'); }, [bay, sel]);
    console.log('=========== ' + JSON.stringify(st) + '\n' + t);
  }
  console.log('ERRORS', JSON.stringify(errs));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
