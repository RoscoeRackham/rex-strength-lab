const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const cases = [
    { anchor: 'friction', surface: 'concrete', groundHolds: false },
    { anchor: 'braced', surface: 'concrete', groundHolds: false },
    { anchor: 'bolted', surface: 'concrete', groundHolds: false },
    { anchor: 'friction', surface: 'mud', groundHolds: false },
    { anchor: 'braced', surface: 'sand', groundHolds: false },
  ];
  for (const cs of cases) {
    const p = await b.newPage();
    const st = Object.assign({ logKg: Math.log10(90718), inf: false, mode: 'comic', H: 2, m: 180, action: 'pull', obj: 'car', angle: 45 }, cs);
    await p.addInitScript((s) => { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, st);
    await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await p.waitForTimeout(800);
    const info = await p.evaluate(() => {
      const bay = document.querySelector('#bay');
      const eq = bay.querySelector('details.math .eq');
      const bars = [...bay.querySelectorAll('svg text')].map(t => t.textContent).join(' | ');
      const status = [...bay.querySelectorAll('.status-row *')].map(t=>t.textContent).join(' / ');
      return { eq: eq && eq.textContent, bars, status, verdict: bay.querySelector('.verdict') && bay.querySelector('.verdict').textContent, surfaces: [...document.querySelectorAll('#surface option')].map(o=>o.value).join(',') };
    });
    console.log(JSON.stringify(cs), '\n', JSON.stringify(info, null, 1));
    await p.close();
  }
  await b.close();
})();
