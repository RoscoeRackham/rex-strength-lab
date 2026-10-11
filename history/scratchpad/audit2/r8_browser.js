const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 2000 } });
  const url = 'file:///home/user/dino-strength-sim/dist/preview.html';
  for (const [gh, lk] of [[true, 9], [true, 7], [false, 9], [true, 7.6]]) {
    await page.goto(url);
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), { logKg: lk, inf: false, mode: 'comic', surface: 'concrete', groundHolds: gh, anchor: 'friction', H: 2, m: 180, action: 'stomp', obj: 'car', angle: 45 });
    await page.reload();
    await page.waitForTimeout(800);
    const txt = await page.evaluate(() => document.body.innerText);
    const L = txt.split("\n"); const lines = []; L.forEach((l,i)=>{ if (/^(Crater|Hole under his foot)$/.test(l)) lines.push(l+" | "+L[i+1]+" | "+L[i+2]); });
    console.log('=== groundHolds', gh, 'logKg', lk);
    console.log(lines.join('\n'));
    const checked = await page.evaluate(() => document.getElementById('ground-holds').checked);
    console.log('checkbox checked:', checked);
    if (gh && lk === 9) await page.screenshot({ path: 'r8_gh9.png', fullPage: false });
  }
  await browser.close();
})();
