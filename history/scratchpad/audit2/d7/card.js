const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage();
  await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await p.waitForTimeout(1500);
  const r = await p.evaluate(() => [...document.querySelectorAll('article.feat')].filter(a => /Saitama/.test(a.textContent)).map(a => ({ text: a.innerText, href: (a.querySelector('a') || {}).href })));
  console.log(JSON.stringify(r, null, 1));
  await b.close();
})();
