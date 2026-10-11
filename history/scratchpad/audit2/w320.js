const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 320, height: 700 } });
  await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await page.waitForTimeout(900);
  for (const a of ['lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull']) {
    await page.click('#tab-' + a); await page.waitForTimeout(100);
    const r = await page.evaluate(() => ({ ov: document.documentElement.scrollWidth - document.documentElement.clientWidth, chartW: [...document.querySelectorAll('#bay svg')].filter(s => s.viewBox.baseVal.width > 50).map(s => s.viewBox.baseVal.width + '/' + Math.round(s.getBoundingClientRect().width)) }));
    console.log(a, JSON.stringify(r));
  }
  await page.screenshot({ path: __dirname + '/lay_w320-pull.png', fullPage: false });
  await browser.close();
})();
