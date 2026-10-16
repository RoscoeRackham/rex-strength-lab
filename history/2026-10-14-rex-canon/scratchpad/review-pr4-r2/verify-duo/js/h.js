// usage: node h.js <dist/index.html> '<json array of [state, pick]>'
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const file = process.argv[2], cases = JSON.parse(process.argv[3]);
  const body = fs.readFileSync(file, 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>';
  const tmp = path.join(path.dirname(__filename), 'page-' + process.pid + '.html'); fs.writeFileSync(tmp, wrapped);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(pathToFileURL(tmp).href);
  const settle = async (id) => { for (let i = 0; i < 240; i++) { const b = await page.evaluate((x) => { const n = document.getElementById(x); return n && /working it out|Working out/i.test(n.textContent); }, id); if (!b) return; await page.waitForTimeout(250); } console.log('TIMEOUT'); };
  for (const [st, pick] of cases) {
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), Object.assign({ duoOpen: true }, st));
    await page.reload(); await page.waitForTimeout(800); await settle('bay'); await page.waitForTimeout(300); await settle('duo-bay');
    if (pick) { await page.selectOption('#duo-effort', pick); await page.waitForTimeout(400); await settle('duo-bay'); }
    const r = await page.evaluate(() => { const b = document.getElementById('duo-bay'); const t = (n) => n ? n.textContent.replace(/\s+/g, ' ').trim() : null;
      return { verdict: t(b.querySelector('.verdict')), status: Array.from(b.querySelectorAll('.status-row')).map(t).join(' / '), tiles: Array.from(b.querySelectorAll('.tiles')).map(t).join(' / '), effort: Array.from(b.querySelectorAll('.effort-read')).map(t).join(' / ') }; });
    console.log('=== ' + JSON.stringify(st) + ' pick=' + pick);
    console.log('VERDICT: ' + r.verdict); console.log('STATUS: ' + r.status); console.log('TILES: ' + r.tiles); console.log('EFFORT: ' + r.effort);
  }
  if (errs.length) console.log('ERRS', errs);
  await browser.close(); fs.unlinkSync(tmp);
})();
