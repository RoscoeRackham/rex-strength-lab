const pw = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await pw.chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const cases = [
    { logKg: 34, action: 'jump' }, { logKg: 34, action: 'stomp' },
    { logKg: 33.9, action: 'jump' }, { logKg: 33.85, action: 'jump' },
    { logKg: 15, action: 'jump' }, { logKg: 14, action: 'jump' }, { logKg: 20, action: 'jump' },
    { logKg: 34, inf: true, action: 'jump' },
    { logKg: 34, action: 'jump', surface: 'sand' }, { logKg: 23.2587, action: 'jump' }, { logKg: 34, inf: true, action: 'stomp' },
  ];
  for (const cs of cases) {
    const p = await b.newPage();
    const st = Object.assign({ inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, obj: 'car', angle: 45 }, cs);
    await p.addInitScript((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
    await p.goto('file:///tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/preview_fix.html');
    await p.waitForTimeout(800);
    const t = await p.$eval('#bay', (e) => e.innerText);
    console.log('=====', JSON.stringify(cs));
    console.log(t.split('\n').filter((l) => /ground|quake|Earth|light|Energy|J\b|magnitude|blown|feet/i.test(l)).join('\n'));
    await p.close();
  }
  await b.close();
})();
