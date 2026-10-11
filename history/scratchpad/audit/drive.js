// usage: node drive.js states.json out.json  (states: [[name, state], ...])
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const A = '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit/';
const cases = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
  const perrs = []; page.on('pageerror', (e) => perrs.push(e.message));
  await page.goto('file://' + A + 'page.html');
  await page.evaluate(() => localStorage.clear());
  await page.reload(); await page.waitForTimeout(500);
  const out = [];
  for (const [name, st] of cases) {
    let r;
    try { r = await page.evaluate((s) => window.__audit(s), st); }
    catch (e) { r = { dt: -1, errs: ['EVAL ' + e.message], text: '' }; }
    r.name = name; r.state = st; r.perrs = perrs.splice(0);
    out.push(r);
  }
  fs.writeFileSync(process.argv[3], JSON.stringify(out));
  await browser.close();
})();
