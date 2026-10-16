// probe.js <html file> <cases.json | inline JSON> [out.json]
// Each case: { id, state, pick?: effort preset for the duo box, solo?: true (read #bay), shot?: 'name', w?: 1280, dark?: bool,
//   powersOpen?: bool, eval?: 'js expression run before reading' }
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const { readResult, settle } = require('/home/user/rex-strength-lab/rex-strength-lab/test/make-page-fixture.js');
(async () => {
  const file = process.argv[2];
  let cases = process.argv[3];
  cases = fs.existsSync(cases) ? JSON.parse(fs.readFileSync(cases, 'utf8')) : JSON.parse(cases);
  const body = fs.readFileSync(file, 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}</style></head><body>' + body + '</body></html>';
  const prev = path.join(path.dirname(path.resolve(file)), path.basename(file, '.html') + '.preview.html');
  fs.writeFileSync(prev, wrapped);
  const browser = await chromium.launch({ executablePath: CHROME });
  const results = {};
  const pages = {};
  for (const c of cases) {
    const w = c.w || 1280, scheme = c.dark ? 'dark' : 'light', key = w + scheme;
    if (!pages[key]) {
      const page = await browser.newPage({ viewport: { width: w, height: w > 500 ? 900 : 844 }, colorScheme: scheme });
      page.__errs = [];
      page.on('pageerror', (e) => page.__errs.push('PAGEERROR ' + e.message));
      page.on('console', (m) => { if (m.type() === 'error') page.__errs.push(m.text()); });
      await page.goto(pathToFileURL(prev).href);
      pages[key] = page;
    }
    const page = pages[key];
    page.__errs.length = 0;
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), c.state);
    await page.reload(); await page.waitForTimeout(700);
    const bay = c.solo ? 'bay' : 'duo-bay';
    try {
      if (!c.solo) { await page.waitForTimeout(300); await settle(page, bay); }
      if (c.pick) { await page.selectOption(c.solo ? '#effort' : '#duo-effort', c.pick); await page.waitForTimeout(400); await settle(page, bay); }
      if (c.eval) { await page.evaluate(c.eval); await page.waitForTimeout(600); await settle(page, bay); }
      const t0 = Date.now();
      const r = await readResult(page, bay);
      r.all = await page.evaluate((id) => document.getElementById(id).textContent.replace(/\s+/g, ' '), bay);
      if (c.powers) r.powers = await page.evaluate(() => ({ sum: document.getElementById('powers-sum').textContent, txt: document.getElementById('powers').textContent.replace(/\s+/g, ' ') }));
      if (c.cards) r.cards = await page.evaluate(() => document.body.textContent.replace(/\s+/g, ' '));
      r.errs = page.__errs.slice();
      if (c.shot) {
        if (c.powersOpen) { await page.evaluate(() => { document.getElementById('powers').open = true; const a = document.querySelector('.panel-controls'); a.style.position = 'static'; a.style.maxHeight = 'none'; a.style.overflow = 'visible'; }); await page.waitForTimeout(300); }
        const el = await page.$(c.powersOpen ? '#powers' : c.solo ? 'main.panel' : '#duo');
        await el.screenshot({ path: path.join(path.dirname(path.resolve(file)), 'shots', c.shot + '-' + w + '-' + scheme + '.png') });
        r.overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      }
      results[c.id] = r;
    } catch (e) { results[c.id] = { error: String(e), errs: page.__errs.slice() }; }
  }
  await browser.close();
  const out = process.argv[4];
  if (out) fs.writeFileSync(out, JSON.stringify(results, null, 1)); else console.log(JSON.stringify(results, null, 1));
})().catch((e) => { console.error(e); process.exit(1); });
