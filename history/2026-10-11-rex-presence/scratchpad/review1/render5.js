const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto('file://' + __dirname + '/preview.html');
  await p.waitForTimeout(2500);
  const rows = await p.$$eval('tr', (trs) => trs.map((t) => t.textContent.replace(/\s+/g, ' ').trim()));
  for (const kw of ['footprint depth in sand like', 'start to notice rattling', 'rattle houses but do no damage', 'pushing speed borrowed', 'shimmers: value for the Walk', 'Load on one foot at each walking step', 'Heel strike of one of Rex']) {
    const r = rows.find((x) => x.toLowerCase().includes(kw.toLowerCase())); console.log('ROW:', r ? r.slice(0, 500) : 'NOT FOUND'); console.log();
  }
  const links = await p.$$eval('tr', (trs) => trs.filter((t) => /Walking:|Thresholds:|Growth:/.test(t.textContent)).length);
  console.log('presence-ish rows rendered', links);
  await b.close();
})();
