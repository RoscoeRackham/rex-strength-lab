const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage();
  for (const [logKg, anchor] of [[Math.log10(90718.474), 'bolted'], [9, 'bolted'], [Math.log10(90718.474), 'friction']]) {
    await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await p.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), { logKg, inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor, H: 2, m: 180, action: 'stomp', obj: 'car', angle: 45 });
    await p.reload();
    await p.waitForTimeout(500);
    const txt = await p.evaluate(() => document.querySelector('#bay').innerText);
    const sum = await p.evaluate(() => document.querySelector('#setup-sum') && document.querySelector('#setup-sum').textContent);
    console.log('=====', logKg.toFixed(3), anchor, '|', sum);
    console.log(txt.split('\n').filter(l => /launch|weight holds|stays put|into the air|Recoil/i.test(l)).join('\n'));
  }
  await b.close();
})();
