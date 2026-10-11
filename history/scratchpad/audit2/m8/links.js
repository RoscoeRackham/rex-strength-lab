const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage();
  await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await p.waitForTimeout(800);
  console.log(await p.evaluate(() => ({ rows: document.querySelectorAll('#src-table tbody tr').length, anchors: document.querySelectorAll('#src-table a').length, sample: [...document.querySelectorAll('#src-table tbody tr')].slice(0,3).map(r => r.lastElementChild.innerHTML.slice(0,160)) })));
  await b.close();
})();
