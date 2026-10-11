const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const S = __dirname;
(async () => {
  const page0 = fs.readFileSync(S + '/head/build-comparison/dist/index.html', 'utf8');
  fs.writeFileSync(S + '/wrapped.html', '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + page0 + '</body></html>');
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); p.on('pageerror', e => errs.push(String(e)));
  await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await p.goto('file://' + S + '/wrapped.html');
  await p.waitForTimeout(2500);
  const info = await p.evaluate(() => {
    const bc = window.__bc;
    return { HUMAN_TOP: bc.HUMAN_TOP, MEAT: bc.MEAT, GAPS: bc.GAPS.map(g => ({ from: g.from, to: g.to, below: g.below, above: g.above })),
      gapItems: bc.SEQ.filter(s => s.kind === 'gap').map(s => ({ id: s.id, tag: s.tag, title: s.title, lims: s.limits.map(L => L.id) })),
      top: bc.LIST.filter(e => e.score.value > 30).map(e => e.id + ' ' + e.score.value.toFixed(2) + ' [' + (e.score.lo||0).toFixed(1) + '-' + (e.score.hi||0).toFixed(1) + '] cmp=' + e.comparable),
      shapes: Array.from(document.querySelectorAll('#tShape option')).map(o => o.value) };
  });
  console.log(JSON.stringify(info, null, 1));
  // gap section text
  for (const g of info.gapItems) {
    const t = await p.evaluate((id) => { const el = document.getElementById(id); return el ? el.innerText.replace(/\s+/g, ' ').slice(0, 900) : null; }, g.id);
    console.log('\n== ' + g.id + ': ' + t);
  }
  console.log('errors', errs);
  await b.close();
})();
