const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const base = { inf: false, mode: 'real', groundHolds: false, H: 2, m: 180, obj: 'baseball', angle: 45 };
  const states = [
    { name: 'punch-steel-braced-16', logKg: 16, surface: 'steel', anchor: 'braced', action: 'punch' },
    { name: 'throw-ball-steel-braced-16', logKg: 16, surface: 'steel', anchor: 'braced', action: 'throw' },
    { name: 'punch-granite-braced-inf', logKg: 16, inf: true, surface: 'granite', anchor: 'braced', action: 'punch' },
    { name: 'jump-granite-17', logKg: 17, surface: 'granite', anchor: 'friction', action: 'jump' },
    { name: 'punch-plush-steel-braced-16', logKg: 16, surface: 'steel', anchor: 'braced', action: 'punch', H: 0.4, m: 1.44 },
  ];
  for (const s of states) {
    const st = Object.assign({}, base, s); delete st.name;
    const ctx = await browser.newContext({ viewport: { width: 1200, height: 1600 } });
    await ctx.addInitScript((v) => { localStorage.setItem('rex-lab-v1', v); }, JSON.stringify(st));
    const page = await ctx.newPage();
    const errs = []; page.on('pageerror', (e) => errs.push(e.message));
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.waitForTimeout(800);
    const txt = await page.evaluate(() => document.querySelector('#bay') ? document.querySelector('#bay').innerText : document.body.innerText.slice(0, 3000));
    const sum = await page.evaluate(() => (document.querySelector('#setup-sum') || {}).textContent);
    console.log('=====', s.name, '|', sum, errs.join(';'));
    console.log(txt.split('\n').filter((l) => /m\/s|caps|reaches|tops out|takeoff|Takeoff|range|lands|apex|height|ground|km\/h|Fist|Speed|speed/i.test(l)).slice(0, 18).join('\n'));
    await page.screenshot({ path: '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/r3v/' + s.name + '.png', fullPage: false });
    await ctx.close();
  }
  await browser.close();
})();
