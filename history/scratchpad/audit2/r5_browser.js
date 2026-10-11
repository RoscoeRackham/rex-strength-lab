const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await b.newPage({ viewport: { width: 1200, height: 900 } });
  const url = 'file:///home/user/dino-strength-sim/dist/preview.html';
  const cases = [
    ['gravel', 3.8, 2, 180], ['gravel', Math.log10(90718.474), 2, 180], ['gravel', 14, 2, 180],
    ['concrete', 7.1, 50, 180*Math.pow(25,3)], ['concrete', 7.5, 50, 180*Math.pow(25,3)],
  ];
  for (const [surface, logKg, H, m] of cases) {
    await page.goto(url);
    await page.evaluate((st) => localStorage.setItem('rex-lab-v1', JSON.stringify(st)),
      { logKg, inf: false, mode: 'real', surface, groundHolds: false, anchor: 'friction', H, m, action: 'jump', obj: 'car', angle: 45 });
    await page.reload();
    await page.waitForTimeout(800);
    const txt = await page.evaluate(() => {
      const v = document.querySelector('.verdict');
      const chips = [...document.querySelectorAll('.status-row')].map(e => e.innerText).join(' | ');
      const happens = [...document.querySelectorAll('li')].map(e=>e.innerText).filter(t=>/ground|holds back|feet/i.test(t)).slice(0,3).join(' || ');
      return (v ? v.innerText : '(no verdict)') + ' :: ' + chips + ' :: ' + happens;
    });
    console.log(surface, logKg.toFixed(3), H, '=>', txt.replace(/\s+/g,' ').slice(0,700));
  }
  await b.close();
})();
