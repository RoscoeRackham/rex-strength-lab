const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { settle } = require(path.resolve(__dirname, '../repo/rex-strength-lab/test/make-page-fixture.js'));
(async () => {
  const html = process.argv[2], st = JSON.parse(process.argv[3]), w = Number(process.argv[4] || 390), scheme = process.argv[5] || 'light';
  const prev = path.join(__dirname, 'prev-clip-' + Date.now() + '.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + fs.readFileSync(html, 'utf8') + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: w, height: 844 }, colorScheme: scheme });
  await page.goto(pathToFileURL(prev).href);
  await page.evaluate((x) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(x)); }, st);
  await page.reload(); await page.waitForTimeout(1200); await settle(page, 'duo-bay');
  const res = await page.evaluate(() => Array.from(document.querySelectorAll('#duo-bay svg text')).map((t) => { const svg = t.ownerSVGElement, sr = svg.getBoundingClientRect(), tr = t.getBoundingClientRect(); return { txt: t.textContent, right: Math.round(tr.right), svgRight: Math.round(sr.right), over: Math.round(tr.right - sr.right), left: Math.round(tr.left - sr.left), ov: getComputedStyle(svg).overflow }; }).filter((x) => x.over > 0 || x.left < 0));
  console.log(JSON.stringify(res, null, 1));
  const els = await page.$$('#duo-bay svg'); for (const [i, el] of els.entries()) { const has = await el.evaluate((s) => /footing/.test(s.textContent)); if (has) await el.screenshot({ path: path.join(__dirname, 'clip-' + w + '-' + scheme + '-' + process.argv[6] + '.png') }); }
  console.log('scrollW', await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth));
  await browser.close(); fs.unlinkSync(prev);
})();
