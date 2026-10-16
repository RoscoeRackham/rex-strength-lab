const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const lab = path.resolve(process.argv[2]);
const { settle } = require(path.join(lab, 'test', 'make-page-fixture.js'));
(async () => {
  const body = fs.readFileSync(path.join(lab, 'dist', 'index.html'), 'utf8');
  const prev = path.join(__dirname, 'c-' + process.pid + '.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(prev).href);
  const load = async (st) => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(500); await settle(page, 'bay'); };
  let max = 0;
  for (const d of [5, 6, 7, 8, 9, 9.15, 10, 11, 12, 13, 14, 15]) for (const s of [{ airAbsorb: 0, keepForm: false }, { airAbsorb: 0.5, keepForm: false }, { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false }, { airAbsorb: 0.9, keepForm: false, surface: 'sand' }, { airAbsorb: 0, keepForm: false, mode: 'real' }, { airAbsorb: 0, keepForm: false, angle: 10 }]) {
    await load(Object.assign({ saveV: 3, action: 'throw', obj: 'person', logKg: d }, s)); await page.selectOption('#effort', 'allout'); await page.waitForTimeout(200); await settle(page, 'bay');
    const r = await page.evaluate(() => { const li = Array.from(document.querySelectorAll('#bay ul.happens li')).map((x) => x.textContent); return { n: li.length, sp: li.some((t) => /Safe passenger/.test(t)), heat: li.some((t) => /air piling up at the front heats/.test(t)), impact: li.some((t) => /^Impact:/.test(t)), below: li.some((t) => /\(below\)/.test(t)), above: li.some((t) => /: above\)/.test(t)) }; });
    max = Math.max(max, r.n);
    if (r.n >= 9 || (r.below && !r.heat)) console.log(d, JSON.stringify(s), JSON.stringify(r));
  }
  console.log('max items', max);
  await browser.close(); fs.unlinkSync(prev);
})().catch((e) => { console.error(e); process.exit(1); });
