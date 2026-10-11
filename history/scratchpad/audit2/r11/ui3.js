const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage();
  await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await p.click('#src-summary'); await p.waitForTimeout(300);
  console.log(await p.evaluate(() => { const tr=[...document.querySelectorAll('#src-table tbody tr')].find(r=>/Air heating/.test(r.textContent)); return { anchors: document.querySelectorAll('#src-table a').length, cellHTML: tr.lastElementChild.innerHTML.slice(0,400) }; }));
  await b.close();
})();
