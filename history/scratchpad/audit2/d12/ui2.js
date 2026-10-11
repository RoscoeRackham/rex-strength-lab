const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage();
  await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await p.waitForTimeout(1500);
  const rows = await p.$$eval('#src-table tbody tr', trs => trs.filter(t => /Air heating/.test(t.textContent)).map(t => [...t.cells].map(c => c.textContent).join(' | ')));
  console.log(rows.join('\n'));
  // Also look for any user-visible stagnation-temp output at ~11 km/s: punch comic logKg such that fist ~11 km/s
  await b.close();
})();
