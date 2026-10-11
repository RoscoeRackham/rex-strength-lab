const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const url = process.argv[2] || 'file:///home/user/dino-strength-sim/dist/preview.html';
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const cases = [
    { anchor: 'friction', surface: 'softclay', H: 50, m: 180*Math.pow(25,3), obj: 'car' },
    { anchor: 'braced', surface: 'softclay', H: 50, m: 180*Math.pow(25,3), obj: 'car' },
    { anchor: 'friction', surface: 'concrete', H: 2, m: 180, obj: 'car' },
    { anchor: 'braced', surface: 'concrete', H: 2, m: 180, obj: 'car' },
    { anchor: 'bolted', surface: 'concrete', H: 2, m: 180, obj: 'car' },
  ];
  for (const cs of cases) {
    const p = await b.newPage();
    p.on('pageerror', e => console.log('ERR', e.message));
    const st = Object.assign({ logKg: Math.log10(90718), inf: false, mode: 'comic', groundHolds: false, action: 'pull', angle: 45 }, cs);
    await p.addInitScript((s) => { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, st);
    await p.goto(url);
    await p.waitForTimeout(800);
    const info = await p.evaluate(() => {
      const bay = document.querySelector('#bay');
      const eq = bay.querySelector('details.math .eq');
      const bars = [...bay.querySelectorAll('svg text')].map(t => t.textContent).slice(-6).join(' | ');
      return { eq: eq && eq.textContent, bars, verdict: bay.querySelector('.verdict') && bay.querySelector('.verdict').textContent };
    });
    console.log(cs.anchor, cs.surface, cs.H, '\n', JSON.stringify(info, null, 1));
    await p.close();
  }
  await b.close();
})();
