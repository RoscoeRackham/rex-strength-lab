// node probe-page.js <dist/index.html> '<state json>' <effort> [selectors...]: loads a state, picks an effort, prints the duo bay's parts
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const [file, stJ, eff] = process.argv.slice(2), sels = process.argv.slice(5);
  const body = fs.readFileSync(file, 'utf8'), prev = path.join(path.dirname(file), 'probe-preview.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(prev).href);
  const settled = (id) => page.waitForFunction((i) => { const b = document.getElementById(i); return !!b && b.children.length > 0 && !/working it out|Working out/i.test(b.textContent); }, id, { polling: 30, timeout: 60000 });
  await page.evaluate((x) => localStorage.setItem('rex-lab-v1', x), stJ); await page.reload(); await settled('bay'); await settled('duo-bay');
  if (process.env.OLOG) { await page.evaluate(() => { for (const n of document.getElementById('duo-bay').children) n.r3old = true; document.getElementById('ollie-setup').open = true; document.getElementById('o-own').click(); }); await page.waitForFunction(() => Array.from(document.getElementById('duo-bay').children).some((n) => !n.r3old));
    await page.evaluate((v) => { for (const n of document.getElementById('duo-bay').children) n.r3old = true; const s = document.getElementById('o-strength'); s.value = v; s.dispatchEvent(new Event('input', { bubbles: true })); }, process.env.OLOG); await page.waitForFunction(() => Array.from(document.getElementById('duo-bay').children).some((n) => !n.r3old)); await settled('duo-bay'); }
  if (eff && eff !== 'least') { await page.evaluate((v) => { for (const n of document.getElementById('duo-bay').children) n.r3old = true; const x = document.getElementById('duo-effort'); x.value = v; x.dispatchEvent(new Event('change', { bubbles: true })); }, eff);
    await page.waitForFunction(() => Array.from(document.getElementById('duo-bay').children).some((n) => !n.r3old)); await settled('duo-bay'); }
  for (const s of (sels.length ? sels : ['.verdict', '.status-row', '.effort-read'])) console.log(s + ': ' + await page.evaluate((q) => Array.from(document.querySelectorAll('#duo-bay ' + q)).map((n) => n.textContent.replace(/\s+/g, ' ')).join(' / '), s));
  await browser.close(); fs.unlinkSync(prev);
})();
