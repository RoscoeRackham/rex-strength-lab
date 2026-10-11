const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage();
  for (const [logKg, anchor] of [[Math.log10(90718.474), 'bolted'], [9, 'bolted']]) {
    await p.goto('file:///tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/preview_m8.html');
    await p.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), { logKg, inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor, H: 2, m: 180, action: 'stomp', obj: 'car', angle: 45 });
    await p.reload();
    await p.waitForTimeout(500);
    const txt = await p.evaluate(() => document.querySelector('#bay').innerText);
    const sum = await p.evaluate(() => document.querySelector('#setup-sum') && document.querySelector('#setup-sum').textContent);
    console.log('=====', logKg.toFixed(3), anchor, '|', sum);
    console.log(txt.slice(0, 1400));
  }
  await b.close();
})();
