const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage();
  await p.addInitScript(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ logKg: Math.log10(3e5), inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'lift', obj: 'b777', angle: 45 })));
  await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await p.waitForTimeout(800);
  const t = await p.evaluate(() => document.querySelector('.rig').innerText);
  const i = t.indexOf('Rex '); console.log(t.slice(t.indexOf('All-Star Superman’s load'), t.indexOf('Show the math')));
  await b.close();
})();
