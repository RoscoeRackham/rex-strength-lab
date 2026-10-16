// usage: node probe.js <dist/index.html> <cases.json>
// cases: [{ name, state, pick?: [sel, value], read: [selectors] }]
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = '/home/user/rex-strength-lab/rex-strength-lab';
const { settle } = require(path.join(REPO, 'test', 'make-page-fixture.js'));
(async () => {
  const html = fs.readFileSync(process.argv[2], 'utf8');
  const cases = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>';
  const f = path.join(__dirname, 'page-' + process.pid + '.html'); fs.writeFileSync(f, wrapped);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(pathToFileURL(f).href);
  for (const c of cases) {
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), c.state);
    await page.reload(); await page.waitForTimeout(800);
    const bay = c.state.duoOpen ? 'duo-bay' : 'bay';
    await settle(page, bay);
    for (const [sel, v] of (c.picks || [])) { await page.selectOption(sel, v); await page.waitForTimeout(400); await settle(page, sel === '#duo-effort' ? 'duo-bay' : 'bay'); }
    if (c.click) for (const sel of c.click) { await page.click(sel); await page.waitForTimeout(500); await settle(page, bay); }
    console.log('##### ' + c.name);
    for (const sel of c.read) {
      const t = await page.evaluate((s) => Array.from(document.querySelectorAll(s)).map((n) => n.textContent.replace(/\s+/g, ' ')).join(' / '), sel);
      console.log('--- ' + sel + ': ' + t);
    }
  }
  if (errs.length) console.log('ERRORS', errs);
  await browser.close(); fs.unlinkSync(f);
})();
