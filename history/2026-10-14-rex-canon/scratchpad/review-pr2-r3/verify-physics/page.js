const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { readResult, settle } = require(__dirname + '/repo/rex-strength-lab/test/make-page-fixture.js');
const which = process.argv[2]; const states = JSON.parse(process.argv[3]); const bayArg = process.argv[4] || 'bay';
const src = which === 'main' ? __dirname + '/main-index.html' : which === 'fix' ? __dirname + '/fix/repo/rex-strength-lab/dist/index.html' : __dirname + '/repo/rex-strength-lab/dist/index.html';
const html = fs.readFileSync(src, 'utf8');
const f = path.join(__dirname, 'wrap-' + which + '.html');
fs.writeFileSync(f, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(f).href);
  for (const st of states) {
    const { pick, ...s } = st;
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), s);
    await page.reload(); await page.waitForTimeout(1200);
    const bay = s.duoOpen ? 'duo-bay' : 'bay';
    await settle(page, bay);
    for (const p of (pick || ['least'])) {
      if (p !== 'least') { await page.selectOption(bay === 'duo-bay' ? '#duo-effort' : '#effort', p); await page.waitForTimeout(400); await settle(page, bay); }
      const r = await readResult(page, bay);
      console.log('=====', which, JSON.stringify(st), p);
      console.log(JSON.stringify(r, null, 1));
    }
  }
  await b.close();
})();
