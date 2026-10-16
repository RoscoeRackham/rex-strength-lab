// usage: node page.js <dist/index.html> '<json list of cases: {state, effort, ollieLog, label}>'
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const SCR = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr4-r3/verify-copy';
(async () => {
  const html = fs.readFileSync(process.argv[2], 'utf8');
  const file = path.join(SCR, 'page-' + path.basename(path.dirname(path.dirname(process.argv[2]))) + '-' + Date.now() + '.html');
  fs.writeFileSync(file, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
  const cases = JSON.parse(process.argv[3]);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(pathToFileURL(file).href);
  const settle = async (id) => { for (let i = 0; i < 160; i++) { const busy = await page.evaluate((x) => { const n = document.getElementById(x); return n && /working it out|Working out/i.test(n.textContent); }, id); if (!busy) return; await page.waitForTimeout(250); } };
  for (const c of cases) {
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), c.state);
    await page.reload(); await page.waitForTimeout(900); await settle('bay'); await page.waitForTimeout(300); await settle('duo-bay');
    if (c.ollieLog != null) {
      await page.evaluate(() => { document.getElementById('ollie-setup').open = true; }); await page.click('#o-own'); await page.waitForTimeout(300);
      await page.evaluate((v) => { const s = document.getElementById('o-strength'); s.value = String(v); s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); }, c.ollieLog);
      await page.waitForTimeout(900); await settle('duo-bay');
    }
    if (c.effort) { await page.selectOption('#duo-effort', c.effort); await page.waitForTimeout(400); await settle('duo-bay'); }
    const r = await page.evaluate(() => { const bay = document.getElementById('duo-bay'); const txt = (n) => n.textContent.replace(/\s+/g, ' ').trim(); const all = (s) => Array.from(bay.querySelectorAll(s)).map(txt);
      return { verdict: all('.verdict'), chips: all('.status-row'), tiles: all('.tiles'), effort: all('.effort-read'), happens: all('.happens'), callouts: all('.callout'), math: all('details.math .eq') }; });
    console.log('=== ' + (c.label || JSON.stringify(c.state)));
    for (const k of (c.show || Object.keys(r))) console.log('-- ' + k + ': ' + r[k].join(' | '));
  }
  if (errs.length) console.log('PAGE ERRORS', errs);
  await browser.close(); fs.unlinkSync(file);
})();
