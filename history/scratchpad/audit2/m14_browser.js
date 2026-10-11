const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const lg of [30, 31, 32, 33, 34]) {
    const page = await browser.newPage();
    await page.addInitScript((lg) => {
      localStorage.setItem('rex-lab-v1', JSON.stringify({ logKg: lg, inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'stomp', obj: 'car', angle: 45 }));
    }, lg);
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.waitForTimeout(800);
    const txt = await page.evaluate(() => {
      const chips = [...document.querySelectorAll('.status-row')].map(e => e.innerText.replace(/\n/g, ' | '));
      const tiles = [...document.querySelectorAll('.tile')].map(e => e.innerText.replace(/\n/g, ' | ')).filter(t => /Crater|Hole/.test(t));
      const items = [...document.querySelectorAll('li')].map(e => e.innerText).filter(t => /Earth apart|crater|quake/i.test(t));
      return { chips, tiles, items };
    });
    console.log('=== 10^' + lg, JSON.stringify(txt, null, 1));
    await page.close();
  }
  await browser.close();
})();
