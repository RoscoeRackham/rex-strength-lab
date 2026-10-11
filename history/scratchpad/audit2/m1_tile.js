const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1600 } });
  await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ inf: true, logKg: 34, mode: 'real', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'jump', obj: 'car', angle: 45 })));
  await page.reload(); await page.waitForTimeout(1500);
  const t = await page.evaluate(() => [...document.querySelectorAll('.tile')].map(e => e.innerText.replace(/\n/g,' | ')));
  console.log(t);
  await page.screenshot({ path: 'm1_real_inf_jump.png', fullPage: false });
  await browser.close();
})();
