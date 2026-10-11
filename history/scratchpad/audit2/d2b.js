const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await p.waitForTimeout(1500);
  const g = p.locator('g.mk[aria-label^="Strongest human"]').first();
  console.log('count', await p.locator('g.mk[aria-label^="Strongest human"]').count());
  await g.focus();
  await p.waitForTimeout(200);
  const t = await p.evaluate(() => [...document.querySelectorAll('.tip')].filter(e=>!e.hidden).map(e=>e.innerText));
  console.log(t);
  await b.close();
})();
