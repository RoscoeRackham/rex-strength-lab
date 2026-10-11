const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const url = 'file:///home/user/dino-strength-sim/dist/preview.html';
  for (const st of [{logKg:14.3},{logKg:14.6},{logKg:20},{logKg:34},{inf:true},{logKg:20, mode:'real'}]) {
    const ctx = await br.newContext(); const pg = await ctx.newPage();
    await pg.addInitScript((s) => { localStorage.setItem('rex-lab-v1', JSON.stringify(Object.assign({ logKg: 5, inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'jump', obj: 'car', angle: 45 }, s))); }, st);
    await pg.goto(url); await pg.waitForTimeout(800);
    const txt = await pg.evaluate(() => document.body.innerText);
    const lines = txt.split('\n').filter(l => /feet punch|Rex leaves|Energy into the ground|Rex jumps|Takeoff/.test(l));
    console.log(JSON.stringify(st), '\n  ' + lines.slice(0,6).join('\n  '));
    await ctx.close();
  }
  await br.close();
})();
