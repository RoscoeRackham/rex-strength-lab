const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const cases = [
    { logKg: 4.1, mode: 'comic', obj: 'car', angle: 45 },
    { logKg: 4.2, mode: 'comic', obj: 'car', angle: 45 },
    { logKg: 5.38, mode: 'comic', obj: 'tank', angle: 45 },
    { logKg: 5.8, mode: 'comic', obj: 'tank', angle: 45 },
    { logKg: 3.83, mode: 'real', obj: 'car', angle: 45 },
    { logKg: Math.log10(90718.474), mode: 'real', obj: 'car', angle: 45 },
  ];
  for (const c of cases) {
    const page = await browser.newPage();
    const st = Object.assign({ inf: false, surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'throw' }, c);
    await page.addInitScript((s) => { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, st);
    await page.goto('file:///tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/preview_r6.html');
    await page.waitForTimeout(800);
    const txt = await page.evaluate(() => {
      const v = document.querySelector('.verdict'); const hp=[...document.querySelectorAll('li')].map(x=>x.textContent).filter(t=>/footing/i.test(t)).join(' / ');
      const chips = [...document.querySelectorAll('.status')].map(x => x.textContent).join(' | ');
      return (v ? v.textContent : 'NO VERDICT') + '\n   chips: ' + chips + '\n   li: ' + hp;
    });
    console.log(JSON.stringify(c), '\n  ', txt);
    await page.close();
  }
  await browser.close();
})();
