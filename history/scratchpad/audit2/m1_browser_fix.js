const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1600 } });
  const url = 'file:///tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/preview_m1.html';
  for (const st of [
    { inf: true, logKg: 34, mode: 'real', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'jump', obj: 'car', angle: 45 },
    { inf: false, logKg: 34, mode: 'real', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'jump', obj: 'car', angle: 45 },
    { inf: true, logKg: 34, mode: 'real', surface: 'concrete', groundHolds: true, anchor: 'friction', H: 2, m: 180, action: 'jump', obj: 'car', angle: 45 },
  ]) {
    await page.goto(url);
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
    await page.reload();
    await page.waitForTimeout(1500);
    const txt = await page.evaluate(() => document.body.innerText);
    const i = txt.indexOf('Rex leaves'); 
    console.log('=== state', JSON.stringify({inf: st.inf, gh: st.groundHolds}));
    const lines = txt.split('\n').filter(l => /leaves|light speed|Energy into the ground|caps his leg|Takeoff|takeoff|apex|Apex|height|Height|plasma|m\/s/i.test(l));
    console.log(lines.slice(0,40).join('\n'));
  }
  await browser.close();
})();
