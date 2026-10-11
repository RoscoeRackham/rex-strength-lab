const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage();
  for (const lg of [9.49, 9.50, 17.95, 17.96, 18.0]) {
    await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await p.evaluate((lg) => localStorage.setItem('rex-lab-v1', JSON.stringify({ logKg: lg, inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'stomp', obj: 'car', angle: 45 })), lg);
    await p.reload();
    await p.waitForTimeout(800);
    const txt = await p.evaluate(() => document.body.innerText);
    const lines = txt.split('\n').filter(l => /rater|wide/i.test(l)).slice(0, 6);
    console.log('logKg', lg, '|', lines.join(' || '));
  }
  await b.close();
})();
