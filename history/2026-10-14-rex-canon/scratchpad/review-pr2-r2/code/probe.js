// node probe.js <dist html> '<json array of {state, effort?, duo?}>' : prints the bay's text parts for each state
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const REPO = path.join(__dirname, 'repo/rex-strength-lab');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { settle } = require(path.join(REPO, 'test/make-page-fixture.js'));
(async () => {
  const file = process.argv[2], cases = JSON.parse(process.argv[3]);
  const body = fs.readFileSync(file, 'utf8');
  const prev = path.join(__dirname, 'pages', 'probe-' + path.basename(file) + '.html');
  fs.mkdirSync(path.dirname(prev), { recursive: true });
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(prev).href);
  for (const c of cases) {
    const duo = !!c.state.duoOpen, bay = duo ? 'duo-bay' : 'bay';
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), c.state);
    await page.reload(); await page.waitForTimeout(800); await settle(page, 'bay'); if (duo) await settle(page, 'duo-bay');
    if (c.effort) { await page.selectOption(duo ? '#duo-effort' : '#effort', c.effort); await page.waitForTimeout(300); await settle(page, bay); }
    const r = await page.evaluate((id) => { const b = document.getElementById(id), t = (n) => (n ? n.textContent.replace(/\s+/g, ' ').trim() : null);
      const all = (s) => Array.from(b.querySelectorAll(s)).map(t);
      return { verdict: t(b.querySelector('.verdict')), chips: all('.status-row'), tiles: all('.tiles'), effort: all('.effort-read'), happens: all('.happens'), math: all('details.math'), whole: (() => { const c = document.body.cloneNode(true); c.querySelectorAll('script, style').forEach((x) => x.remove()); return c.textContent; })() }; }, bay);
    const bad = (r.whole.match(/NaN|undefined|(?<![∞\w])Infinity/g) || []);
    delete r.whole;
    console.log('=== ' + JSON.stringify(c) + (bad.length ? ' BAD: ' + bad.join(',') : ''));
    for (const k of (c.show || ['verdict', 'chips', 'tiles', 'effort', 'happens'])) console.log('-- ' + k + ': ' + JSON.stringify(r[k]));
  }
  if (errs.length) console.log('ERRS', errs);
  await browser.close();
})();
