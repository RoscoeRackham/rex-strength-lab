const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await browser.newContext({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true });
  await ctx.addInitScript(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'stomp', logKg: 12 })));
  const page = await ctx.newPage();
  await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await page.waitForTimeout(900);
  const m = () => page.evaluate(() => [...document.querySelectorAll('#bay svg')].map(s => { const vb = s.viewBox.baseVal.width, w = s.getBoundingClientRect().width; return { viewBoxW: vb, cssW: Math.round(w), textPx: +(11 * w / vb).toFixed(1) }; }));
  console.log('landscape 844:', JSON.stringify(await m()));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(600);
  console.log('rotated to portrait 390:', JSON.stringify(await m()));
  await page.locator('#bay svg').last().scrollIntoViewIfNeeded();
  await (await page.$('#bay')).screenshot({ path: __dirname + '/lay_rotate-stomp-390.png' });
  await browser.close();
})();
