const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage();
  const url = 'file:///home/user/dino-strength-sim/dist/preview.html';
  await page.goto(url);
  await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ logKg: Math.log10(90718.474), inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'throw', obj: 'car', angle: 90 })));
  await page.goto(url); await page.waitForTimeout(1000);
  console.log(await page.evaluate(() => [...document.querySelectorAll("li, div, p")].map(d => d.textContent).filter(t => /footing absorbs/.test(t) && t.length < 300).join("\n")));
  await browser.close();
})();
