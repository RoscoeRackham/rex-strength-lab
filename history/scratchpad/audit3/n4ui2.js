const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  for (const k of [2.65, 2.7, 3]) {
    await page.evaluate((k) => localStorage.setItem('rex-lab-v1', JSON.stringify({logKg:Math.log10(511*k),inf:false,mode:'comic',surface:'concrete',groundHolds:false,anchor:'friction',H:2,m:180,action:'throw',obj:'car',angle:45})), k);
    await page.reload(); await page.waitForTimeout(1500);
    const txt = await page.evaluate(() => document.querySelector('main.panel').innerText);
    const i = txt.indexOf('LAUNCH ANGLE');
    console.log('--- comic x' + k + ' dial=' + await page.textContent('#dial-big') + '\n' + txt.slice(i, i + 700));
  }
  await browser.close();
})();
