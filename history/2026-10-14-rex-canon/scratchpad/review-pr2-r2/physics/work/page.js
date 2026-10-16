// node page.js cases.json [branch|main]: each case { id, state, effort?, duoEffort?, bay: 'bay'|'duo-bay' }
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const which = process.argv[3] || 'branch';
const base = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r2/physics/' + (which === 'main' ? 'main-wt' : 'repo') + '/rex-strength-lab';
const html = fs.readFileSync(base + '/dist/index.html', 'utf8');
const file = path.join(__dirname, 'page-' + which + '.html');
fs.writeFileSync(file, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
const cases = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(pathToFileURL(file).href);
  const settle = async (id) => { for (let i = 0; i < 160; i++) { const busy = await page.evaluate((id) => { const n = document.getElementById(id); return !n || /working it out|Working out/i.test(n.textContent); }, id); if (!busy) return; await page.waitForTimeout(250); } };
  for (const c of cases) {
    await page.evaluate((s) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, c.state);
    await page.reload(); await page.waitForTimeout(700);
    const bay = c.bay || (c.state.duoOpen ? 'duo-bay' : 'bay');
    await settle(bay);
    if (c.effort) { await page.selectOption('#effort', c.effort); await page.waitForTimeout(400); await settle(bay); }
    if (c.duoEffort) { await page.selectOption('#duo-effort', c.duoEffort); await page.waitForTimeout(400); await settle(bay); }
    if (c.click) for (const s of c.click) { await page.click(s); await page.waitForTimeout(300); }
    await page.evaluate(() => document.querySelectorAll('details').forEach((d) => { d.open = true; }));
    await settle(bay);
    const t = await page.evaluate((id) => { const n = document.getElementById(id); return n ? n.innerText.replace(/\n+/g, '\n') : '(no ' + id + ')'; }, bay);
    console.log('===== ' + c.id + '\n' + t);
  }
  if (errs.length) console.log('PAGE ERRORS', errs);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
