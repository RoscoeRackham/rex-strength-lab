const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage();
  await p.goto('file:///tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/d12/preview_fix.html');
  await p.waitForTimeout(1500);
  console.log(await p.$$eval('#src-table tbody tr', trs => { const t = trs.find(t => /Air heating/.test(t.textContent)); return t.cells[3].innerHTML; }));
  await b.close();
})();
