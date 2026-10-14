const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const DIR = __dirname;
const SRC = process.argv[2] || '/home/user/rex-strength-lab/rex-strength-lab/dist/index.html';
(async () => {
  const body = fs.readFileSync(SRC, 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>';
  const prev = path.join(DIR, 'page.html'); fs.writeFileSync(prev, wrapped);
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(prev).href);
  await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'weight' })));
  await page.reload(); await page.waitForTimeout(2500);
  for (const mode of ['ocean', 'gradual', 'instant']) {
    await page.evaluate((m) => { const s = document.getElementById('absorb'); s.value = m; s.dispatchEvent(new Event('change', { bubbles: true })); s.dispatchEvent(new Event('input', { bubbles: true })); }, mode);
    await page.waitForTimeout(800);
    for (const w of ['krakatoa', 'chicxulub']) {
      const ok = await page.evaluate((w) => { const b = document.getElementById('grow-what-' + w); if (!b) return false; b.click(); return true; }, w);
      await page.waitForTimeout(1500);
      const t = await page.evaluate(() => { const b = document.querySelector('.growth-whatif'); return b ? b.innerText : 'NO BOX'; });
      console.log('=== mode', mode, 'what', w, 'clicked', ok, '\n' + t + '\n');
    }
  }
  const rows = await page.evaluate(() => D_rows = (window.DINO_DATA || {}).sourceRows ? window.DINO_DATA.sourceRows.filter((r) => /Worked example: absorbing (Krakatoa|Chicxulub)/.test(JSON.stringify(r))) : 'no DINO_DATA');
  console.log('ROWS', JSON.stringify(rows, null, 1));
  const tbl = await page.evaluate(() => Array.from(document.querySelectorAll('*')).filter((n) => n.children.length < 6 && /Worked example: absorbing (Krakatoa|Chicxulub)/.test(n.textContent) && n.textContent.length < 800).map((n) => n.tagName + ': ' + n.textContent).slice(0, 6));
  console.log('TABLE', tbl.join('\n'));
  console.log('ERRS', errs);
  await browser.close();
})();
