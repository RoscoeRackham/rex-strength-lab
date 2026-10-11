const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await p.waitForTimeout(1500);
  const svg = await p.$('#ladder-viz svg');
  const bb = await svg.boundingBox();
  await p.screenshot({ path: 'd15-ladder.png', fullPage: true, clip: { x: bb.x, y: bb.y + bb.height * 0.72, width: bb.width, height: bb.height * 0.28 } });
  // check whether any visible text anywhere on ladder says press/deadlift
  console.log(await p.$eval('#ladder', n => /press|deadlift/i.test(n.innerText)));
  await b.close();
})();
