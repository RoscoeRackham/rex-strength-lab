const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const cases = [
    { logKg: 24, anchor: 'bolted', obj: 'pyramid' },
    { logKg: 24, anchor: 'bolted', obj: 'esb' },
    { logKg: 24, anchor: 'bolted', obj: 'titanic' },
    { logKg: 20, anchor: 'bolted', obj: 'baseball' },
    { logKg: 24, anchor: 'friction', obj: 'pyramid' },
    { logKg: 0, inf: true, anchor: 'friction', obj: 'pyramid' },
  ];
  for (const cs of cases) {
    const p = await b.newPage();
    await p.addInitScript((st) => { localStorage.setItem('rex-lab-v1', JSON.stringify(st)); }, Object.assign({ inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, H: 2, m: 180, action: 'throw', angle: 45 }, cs));
    await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await p.waitForTimeout(800);
    const txt = await p.evaluate(() => document.body.innerText);
    const lines = txt.split('\n').filter(l => /fireball|leaves at|light speed|TNT/.test(l));
    console.log('==', JSON.stringify(cs)); console.log(lines.slice(0,8).join('\n'));
    await p.close();
  }
  await b.close();
})();
