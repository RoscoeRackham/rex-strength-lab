const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = process.env.REPO || '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r1/physics/repo/rex-strength-lab';
const OUT = __dirname + '/' + (process.env.TAG || 'pr3') + '.html';
const body = fs.readFileSync(REPO + '/dist/index.html', 'utf8');
fs.writeFileSync(OUT, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
async function settle(page, id) { for (let i = 0; i < 240; i++) { const busy = await page.evaluate((id) => /working it out|Working out/i.test(document.getElementById(id).textContent), id); if (!busy) return; await page.waitForTimeout(250); } throw new Error('busy'); }
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(pathToFileURL(OUT).href);
  const cases = JSON.parse(process.argv[2]);
  for (const c of cases) {
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), c.st); await page.reload(); await page.waitForTimeout(800);
    const bay = c.st.duoOpen ? 'duo-bay' : 'bay';
    await settle(page, bay);
    if (c.effort) { await page.selectOption(c.st.duoOpen ? '#duo-effort' : '#effort', c.effort); await page.waitForTimeout(400); await settle(page, bay); }
    const t = await page.evaluate((id) => { const b = document.getElementById(id); const txt = (n) => n.textContent.replace(/\s+/g, ' ').trim(); const all = (s) => Array.from(b.querySelectorAll(s)).map(txt);
      return { verdict: all('.verdict'), status: all('.status-row'), tiles: all('.tiles'), effort: all('.effort-read'), happens: all('.happens'), callouts: all('.callout') }; }, bay);
    console.log('=== ' + c.name);
    for (const [k, v] of Object.entries(t)) if (!c.only || c.only.includes(k)) for (const x of v) console.log('[' + k + '] ' + x);
  }
  if (errs.length) console.log('ERRORS', errs);
  await browser.close();
})();
