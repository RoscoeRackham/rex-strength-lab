const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const f of ['/home/user/dino-strength-sim/dist/index.html', process.cwd()+'/fixed.html']) {
    const p = await b.newPage();
    await p.goto('file://'+f); await p.waitForTimeout(2000);
    console.log(await p.evaluate(() => [...document.querySelectorAll('#src-table tbody tr')].filter(r => /heating/i.test(r.cells[0].textContent)).map(r => r.cells[0].textContent.slice(0,40)+' | '+r.cells[3].textContent).join('\n')));
  }
  await b.close();
})();
