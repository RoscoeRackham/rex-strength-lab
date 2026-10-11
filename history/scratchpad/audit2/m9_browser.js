const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 2400 } });
  const url = 'file:///home/user/dino-strength-sim/dist/preview.html';
  for (const [gh, lk] of [[true,6],[true,9],[true,12],[false,9]]) {
    await page.goto(url);
    await page.evaluate(([gh,lk]) => localStorage.setItem('rex-lab-v1', JSON.stringify({ logKg: lk, inf:false, mode:'comic', surface:'concrete', groundHolds: gh, anchor:'friction', H:2, m:180, action:'stomp', obj:'car', angle:45 })), [gh,lk]);
    await page.reload();
    await page.waitForTimeout(500);
    const txt = await page.evaluate(() => document.body.innerText);
    const checked = await page.evaluate(() => document.querySelector('#ground-holds').checked);
    const lines = txt.split('\n').filter(l => /crater|Crater|Hole under|comic|never breaks|dig a hole|wide|His stomp/i.test(l));
    console.log('=== groundHolds', gh, 'checkbox', checked, 'logKg', lk);
    console.log(lines.slice(0,20).join('\n'));
    if (gh && lk===9) await page.screenshot({ path: 'm9_comic_1e9.png', fullPage: false });
  }
  await browser.close();
})();
