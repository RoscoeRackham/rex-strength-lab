const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage();
  await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await p.waitForTimeout(1500);
  console.log(await p.$$eval('#src-table tbody tr', trs => { const t = trs.find(t => /Air heating/.test(t.textContent)); return t.cells[3].innerHTML; }));
  await b.close();
})();
