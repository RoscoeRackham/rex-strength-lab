const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const cases = [
    { label: '2m granite braced 1e34 punch', s: { logKg: 34, inf: false, mode: 'real', surface: 'granite', groundHolds: false, anchor: 'braced', H: 2, m: 180, action: 'punch', obj: 'baseball', angle: 45 } },
    { label: '2m granite braced 1e34 jump', s: { logKg: 34, inf: false, mode: 'real', surface: 'granite', groundHolds: false, anchor: 'braced', H: 2, m: 180, action: 'jump', obj: 'baseball', angle: 45 } },
    { label: '2m granite standing 1e20 jump', s: { logKg: 20, inf: false, mode: 'real', surface: 'granite', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'jump', obj: 'baseball', angle: 45 } },
    { label: '2m granite braced inf throw baseball', s: { logKg: 34, inf: true, mode: 'real', surface: 'granite', groundHolds: false, anchor: 'braced', H: 2, m: 180, action: 'throw', obj: 'baseball', angle: 45 } },
    { label: '0.4m granite braced 1e34 jump', s: { logKg: 34, inf: false, mode: 'real', surface: 'granite', groundHolds: false, anchor: 'braced', H: 0.4, m: 1.44, action: 'jump', obj: 'baseball', angle: 45 } },
    { label: '0.4m granite braced 1e14 punch', s: { logKg: 14, inf: false, mode: 'real', surface: 'granite', groundHolds: false, anchor: 'braced', H: 0.4, m: 1.44, action: 'punch', obj: 'baseball', angle: 45 } },
    { label: '2m granite braced inf jump', s: { logKg: 34, inf: true, mode: 'real', surface: 'granite', groundHolds: false, anchor: 'braced', H: 2, m: 180, action: 'jump', obj: 'baseball', angle: 45 } },
  ];
  for (const c of cases) {
    const ctx = await browser.newContext();
    await ctx.addInitScript((st) => { try { localStorage.setItem('rex-lab-v1', JSON.stringify(st)); } catch (e) {} }, c.s);
    const page = await ctx.newPage();
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.waitForTimeout(800);
    const txt = await page.evaluate(() => document.querySelector('#bay').innerText);
    const setup = await page.evaluate(() => (document.querySelector('#setup-sum') || {}).textContent);
    console.log('=====', c.label, '|', setup);
    console.log(txt.split('\n').filter(l => /m\/s|high|tops out|caps|reaches|leaves|Takeoff|Peak|Fist|speed/i.test(l)).slice(0, 14).join('\n'));
    await ctx.close();
  }
  await browser.close();
})();
