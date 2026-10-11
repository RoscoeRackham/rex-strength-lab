const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage();
  await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await p.click('#src-summary'); await p.waitForTimeout(300);
  const row = await p.evaluate(() => [...document.querySelectorAll('#src-table tr')].map(r => r.innerText).find(t => /Air heating/.test(t)));
  console.log('SOURCES ROW:', row);
  console.log('Anderson in links?', await p.evaluate(() => [...document.querySelectorAll('#src-table a')].some(a => /anderson/i.test(a.textContent + a.href))));
  await b.close();
})();
