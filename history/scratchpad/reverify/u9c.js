const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
  await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  for (const [obj, lk] of [['piano', 7], ['piano', 6], ['piano', 5]]) {
    const r = await page.evaluate(([obj, lk]) => {
      const P = window.RexPhysics || window.P || window.REX_ENGINE;
      return Object.keys(window).filter((k) => /phys|engine|rex|dino/i.test(k));
    }, [obj, lk]);
    console.log(r);
    break;
  }
  await browser.close();
})();
