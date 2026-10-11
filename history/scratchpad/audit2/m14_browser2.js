const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage();
  await page.addInitScript(() => {
    localStorage.setItem('rex-lab-v1', JSON.stringify({ logKg: 34, inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'throw', obj: 'moon', angle: 45 }));
  });
  await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await page.waitForTimeout(800);
  const t = await page.evaluate(() => [...document.querySelectorAll('li')].map(e => e.innerText).filter(t => /crater/i.test(t)));
  console.log(t);
  // stomp at 10^34 screenshot
  await page.evaluate(() => { localStorage.setItem('rex-lab-v1', JSON.stringify({ logKg: 34, inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'stomp', obj: 'car', angle: 45 })); });
  await page.reload(); await page.waitForTimeout(800);
  const v = await page.evaluate(() => (document.querySelector('.verdict') || {}).innerText);
  console.log('verdict:', v);
  await page.screenshot({ path: 'm14_stomp34.png', fullPage: false });
  await browser.close();
})();
