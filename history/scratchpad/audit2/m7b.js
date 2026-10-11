const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage();
  const url = 'file:///home/user/dino-strength-sim/dist/preview.html';
  for (const st of [
    { action: 'throw', obj: 'car', inf: true, mode: 'comic' },
    { action: 'jump', inf: true, mode: 'comic' },
    { action: 'jump', inf: true, mode: 'real' },
  ]) {
    await p.goto(url);
    await p.evaluate((s) => { const d = { logKg: Math.log10(100 * 907.18474), inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'throw', obj: 'car', angle: 45 }; localStorage.setItem('rex-lab-v1', JSON.stringify(Object.assign(d, s))); }, st);
    await p.goto(url);
    await p.waitForTimeout(800);
    const txt = await p.evaluate(() => { const bay = document.querySelector('#bay') || document.querySelector('main'); return bay.innerText; });
    console.log('=====', JSON.stringify(st));
    console.log(txt.slice(0, 3500));
  }
  await b.close();
})();
