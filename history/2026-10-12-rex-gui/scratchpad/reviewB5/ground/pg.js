// usage: node pg.js '<json array of cases>'  each case { state, effort?, duoEffort?, custom? (log kg), bay: 'bay'|'duo-bay', grep?: regex }
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const FILE = pathToFileURL(path.join(__dirname, 'page.html')).href;
async function settle(page, id) {
  for (let i = 0; i < 240; i++) {
    const busy = await page.evaluate((id) => /working it out|Working out/i.test(document.getElementById(id).textContent), id);
    if (!busy) return;
    await page.waitForTimeout(250);
  }
  throw new Error('still working');
}
(async () => {
  const cases = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(FILE);
  for (const c of cases) {
    await page.evaluate((s) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, c.state);
    await page.reload();
    await page.waitForTimeout(800);
    const bay = c.bay || 'bay';
    await settle(page, bay);
    if (c.effort) { await page.selectOption('#effort', c.effort); await page.waitForTimeout(300); await settle(page, bay); }
    if (c.duoEffort) { await page.selectOption('#duo-effort', c.duoEffort); await page.waitForTimeout(300); await settle(page, bay); }
    if (c.custom != null) {
      await page.evaluate(([v, id]) => { const r = document.getElementById(id); r.value = v; r.dispatchEvent(new Event('input', { bubbles: true })); r.dispatchEvent(new Event('change', { bubbles: true })); }, [c.custom, bay === 'bay' ? 'effort-use' : 'duo-effort-use']);
      await page.waitForTimeout(500); await settle(page, bay);
    }
    const txt = await page.evaluate((id) => document.getElementById(id).innerText, bay);
    console.log('=== CASE ' + (c.label || JSON.stringify(c.state)));
    if (c.grep) { const re = new RegExp(c.grep, 'i'); console.log(txt.split('\n').filter((l) => re.test(l)).join('\n')); }
    else console.log(txt);
    if (c.shot) await page.screenshot({ path: path.join(__dirname, c.shot), fullPage: true });
  }
  if (errs.length) console.log('ERRORS', errs);
  await browser.close();
})();
