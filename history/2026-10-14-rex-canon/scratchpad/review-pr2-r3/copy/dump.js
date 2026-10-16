// node dump.js <dist/index.html> <cases.json> <out.json> [width height scheme]
// cases: [{ id, state, effort?: 'allout'|..., duo?: bool, effortDuo?: ... }]
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const [, , htmlFile, casesFile, outFile, W = '1280', H = '900', scheme = 'light'] = process.argv;
const cases = JSON.parse(fs.readFileSync(casesFile, 'utf8'));
(async () => {
  const body = fs.readFileSync(htmlFile, 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>';
  const prev = path.join(path.dirname(outFile), 'page-' + path.basename(outFile, '.json') + '.html');
  fs.writeFileSync(prev, wrapped);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: +W, height: +H }, colorScheme: scheme });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(prev).href);
  const settle = async (id) => { for (let i = 0; i < 240; i++) { const busy = await page.evaluate((x) => { const n = document.getElementById(x); return !!n && /working it out|Working out/i.test(n.textContent); }, id); if (!busy) return; await page.waitForTimeout(250); } };
  const out = {};
  for (const cs of cases) {
    errs.length = 0;
    await page.evaluate(() => { window.__dropped = []; });
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), cs.state);
    await page.reload(); await page.waitForTimeout(700);
    const duo = !!cs.state.duoOpen;
    const bay = duo ? 'duo-bay' : 'bay';
    await settle(bay);
    if (cs.effort) { await page.selectOption(duo ? '#duo-effort' : '#effort', cs.effort); await page.waitForTimeout(300); await settle(bay); }
    if (cs.eval) { await page.evaluate(cs.eval); await page.waitForTimeout(800); await settle(bay); }
    const res = await page.evaluate((id) => {
      const b = document.getElementById(id), txt = (n) => n.textContent.replace(/\s+/g, ' ').trim();
      const all = (sel) => Array.from(b.querySelectorAll(sel)).map(txt);
      const hz = Array.from(b.querySelectorAll('details.haz-list')).map(txt);
      return { verdict: all('.verdict'), status: all('.status-row'), tiles: Array.from(b.querySelectorAll('.tiles > *')).map(txt), effort: all('.effort-read'), happens: Array.from(b.querySelectorAll('.happens li')).map(txt), happensRaw: all('.happens'), callouts: all('.callout'), math: Array.from(b.querySelectorAll('details.math .eq')).map((n) => n.textContent.split('\n')).flat(), dropped: (window.__dropped || []).slice(), haz: hz,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, outside: Array.from(b.querySelectorAll('*')).filter((n) => { const r = n.getBoundingClientRect(); return r.width > 0 && (r.right > innerWidth + 0.5 || r.left < -0.5) && !n.closest('.viz, .table-wrap, .cases-wrap, svg'); }).slice(0, 5).map((n) => n.className + ':' + n.textContent.slice(0, 60)), clipped: Array.from(b.querySelectorAll('.status, .tile, .tile .v, .tile .s, .tile .k, .verdict, .happens li, .effort-read p')).filter((n) => n.scrollWidth > n.clientWidth + 1).slice(0, 5).map((n) => n.className + ':' + n.textContent.slice(0, 60)) };
    }, bay);
    res.errs = errs.slice();
    out[cs.id] = res;
  }
  fs.writeFileSync(outFile, JSON.stringify(out, null, 1));
  await browser.close();
})();
