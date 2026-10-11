const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await p.waitForTimeout(1200);
  const n = await p.locator('#ladder-viz g.mk').count();
  for (let i = 0; i < n; i++) {
    const g = p.locator('#ladder-viz g.mk').nth(i);
    await g.focus();
    const t = await p.evaluate(() => { const tip = [...document.querySelectorAll('#ladder-viz *')].find(e => !e.hidden && e.tagName === 'DIV' && e.querySelector('b')); return tip ? tip.textContent : null; });
    if (t && /231|474|2007/.test(t)) console.log(i, t);
  }
  await b.close();
})();
