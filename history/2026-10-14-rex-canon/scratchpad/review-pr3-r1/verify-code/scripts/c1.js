const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const REPO = process.argv[2];
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { settle } = require(REPO + '/rex-strength-lab/test/make-page-fixture.js');
(async () => {
  const body = fs.readFileSync(REPO + '/rex-strength-lab/dist/index.html', 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>';
  const prev = path.join(__dirname, 'page-' + path.basename(path.dirname(REPO)) + '.html'); fs.writeFileSync(prev, wrapped);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto(pathToFileURL(prev).href);
  const load = async (st) => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(800); await settle(page, 'bay'); await settle(page, 'duo-bay'); };
  const pick = async (sel, v) => { await page.selectOption(sel, v); await page.waitForTimeout(300); await settle(page, 'duo-bay'); };
  for (const [kg, d] of [[8, 1], [9, 2]]) {
    await load({ saveV: 3, duoOpen: true, duoAction: 'catch', cObj: 'person', cStyle: 'hard', cMiss: true, cLogD: d, logKg: kg, airAbsorb: 0, keepForm: false });
    await pick('#duo-effort', 'allout');
    const t = await page.evaluate(() => document.getElementById('duo-bay').textContent.replace(/\s+/g, ' '));
    console.log('=== logKg', kg, 'cLogD', d, 'safePassenger checked:', await page.$eval('#sw-passenger', n => n.checked));
    for (const re of [/Safe passenger: [^.·]*/g, /Nose air[^·]{0,40}/g, /[^.]*Air (?:at its nose|heating)[^.]*\.[^.]*\./g, /If Ollie misses[^]*?shakes it\./g, /[^.]*no harm[^.]*/g, /[^.]*unharmed[^.]*\./g])
      console.log(' ', re.source.slice(0, 20), '->', JSON.stringify(t.match(re)));
  }
  console.log('errors', errs);
  await browser.close();
})();
