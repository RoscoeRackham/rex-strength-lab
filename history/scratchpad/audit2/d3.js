const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await p.waitForTimeout(1200);
  const intro = await p.$eval('#feats .intro', e => e.textContent);
  console.log('INTRO:', intro);
  const cards = await p.$$eval('#feat-groups article.feat', as => as.map(a => ({ t: a.querySelector('.t').textContent, w: a.querySelector('.w').textContent, c: a.querySelector('.c').textContent, badge: a.querySelector('.badge').textContent, src: (a.querySelector('a')||{}).href })));
  for (const c of cards) if (c.badge === 'Canon') console.log(JSON.stringify(c));
  const rows = await p.$$eval('#src-table tbody tr', trs => trs.map(tr => [...tr.children].map(td => td.textContent)));
  for (const r of rows) if (/Mountain|mountain|All-Star|benches|Secret Wars/.test(r[0])) console.log('ROW', JSON.stringify(r));
  const sec = await p.$('#feats'); await sec.scrollIntoViewIfNeeded();
  await sec.screenshot({ path: '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/d3-feats.png' });
  await b.close();
})();
