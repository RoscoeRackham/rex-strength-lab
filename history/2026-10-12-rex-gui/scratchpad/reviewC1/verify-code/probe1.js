const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const ROOT = process.argv[2];
const { settle } = require(path.join(ROOT, 'test/make-page-fixture.js'));
(async () => {
  const body = fs.readFileSync(path.join(ROOT, 'dist/index.html'), 'utf8');
  const prev = path.join(__dirname, 'probe-preview.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(prev).href);
  const tile = (k) => page.evaluate((k) => Array.from(document.querySelectorAll('#bay .tile')).filter((t) => t.querySelector('.k') && new RegExp(k).test(t.querySelector('.k').textContent)).map((t) => t.querySelector('.k').textContent + ' = ' + t.querySelector('.v').textContent), k);
  const mode = process.argv[3] || 'least';
  const seen = new Set();
  for (const action of ['punch', 'clap', 'stomp']) for (const logKg of [1, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 34]) {
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), { action, logKg, mode: 'comic' });
    await page.reload(); await page.waitForTimeout(600); await settle(page, 'bay');
    if (mode === 'allout') { await page.selectOption('#effort', 'allout'); await page.waitForTimeout(500); await settle(page, 'bay'); }
    const eff = await page.evaluate(() => document.getElementById('effort') && document.getElementById('effort').value);
    const e = await tile('^Energy'), c = await tile('^Compared with');
    for (const t of c) seen.add(t.replace(/[\d.]+/g, '#'));
    console.log(action, logKg, eff, '|', e.join(' ; '), '|', c.join(' ; '));
  }
  console.log('distinct wordings (shots.js normalisation):', seen.size);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
