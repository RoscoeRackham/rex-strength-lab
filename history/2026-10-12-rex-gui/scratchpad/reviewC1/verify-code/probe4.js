const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const ROOT = process.argv[2];
const { settle } = require(path.join(ROOT, 'test/make-page-fixture.js'));
(async () => {
  const body = fs.readFileSync(path.join(ROOT, 'dist/index.html'), 'utf8');
  const prev = path.join(__dirname, 'probe4-preview.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(prev).href);
  const tiles = (bay) => page.evaluate((bay) => Array.from(document.querySelectorAll('#' + bay + ' .tile')).filter((t) => /Energy/.test(t.textContent)).map((t) => t.textContent.replace(/\s+/g, ' ').trim()), bay);
  const chips = (bay) => page.evaluate((bay) => Array.from(document.querySelectorAll('#' + bay + ' .status-row')).map((t) => t.textContent.replace(/\s+/g, ' ').trim()).join(' | '), bay);
  const cases = [];
  for (const m of [2e26, 4e26, 5.5e26, 5.8e26, 6e26, 1e28, 1e40]) cases.push({ action: 'weight', H: 3.048, m, mode: 'comic' });
  for (const m of [1e28, 5e28, 9e28, 9.6e28, 1e29, 1e31]) cases.push({ action: 'weight', H: 500, m, mode: 'comic' });
  for (const st of cases) {
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st);
    await page.reload(); await page.waitForTimeout(700); await settle(page, 'bay');
    const saved = await page.evaluate(() => { const s = JSON.parse(localStorage.getItem('rex-lab-v1')); return { H: s.H, m: s.m, action: s.action }; });
    console.log(JSON.stringify(st), '-> saved', JSON.stringify(saved), '|', (await chips('bay')).slice(0, 120), '|', (await tiles('bay')).join(' ; ') || '(no energy tile)');
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
