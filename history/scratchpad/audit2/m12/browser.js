const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const scenarios = [
    { name: 'Kaiju + Hulk default', st: { H: 50, m: 180 * Math.pow(25, 3), logKg: Math.log10(90718.474), inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', obj: 'car', angle: 45 } },
    { name: 'Kaiju + 1e6 kg, tank 30', st: { H: 50, m: 180 * Math.pow(25, 3), logKg: 6, inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', obj: 'tank', angle: 30 } },
    { name: 'Dino 2m, 100 kg, shot', st: { H: 2, m: 180, logKg: 2, inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', obj: 'shot', angle: 45 } },
    { name: 'Dino 2m, 100 kg, car', st: { H: 2, m: 180, logKg: 2, inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', obj: 'car', angle: 45 } },
    { name: 'Dino 2m, 150 kg real, shot', st: { H: 2, m: 180, logKg: Math.log10(150), inf: false, mode: 'real', surface: 'concrete', groundHolds: false, anchor: 'friction', obj: 'shot', angle: 45 } },
  ];
  for (const sc of scenarios) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.addInitScript((s) => { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, sc.st);
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.waitForTimeout(600);
    console.log('=== ' + sc.name + ' | dial: ' + await page.textContent('#dial-big') + ' | ' + await page.textContent('#dial-force'));
    for (const tab of ['lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull']) {
      await page.click('#tab-' + tab);
      await page.waitForTimeout(150);
      const v = await page.$eval('#bay', (b) => { const vd = b.querySelector('.verdict'); const chips = [...b.querySelectorAll('.status')].map(s => s.textContent).join(' | '); const hap = [...b.querySelectorAll('.happens li')].map(l => l.textContent).join(' // '); return (vd ? vd.textContent : '(no verdict)') + '\n      chips: ' + chips + '\n      happens: ' + hap.slice(0, 400); });
      console.log('  ' + tab + ': ' + v);
    }
    await page.close();
  }
  await browser.close();
})();
