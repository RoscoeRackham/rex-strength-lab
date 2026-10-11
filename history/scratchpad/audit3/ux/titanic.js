const { open, close } = require('./h.js');
(async () => {
  for (const [name, st] of [['titanic-20-45', { action: 'throw', obj: 'titanic', logKg: 20, angle: 45 }], ['titanic-19-45', { action: 'throw', obj: 'titanic', logKg: 19, angle: 45 }], ['nimitz-21-60', { action: 'throw', obj: 'nimitz', logKg: 21, angle: 60 }]]) {
    const { page, ctx } = await open({ w: 1280, h: 900, state: st });
    const s = await page.evaluate(() => window.__snap());
    console.log('== ' + name); console.log(JSON.stringify({ verdict: s.verdict, dist: s.tiles.find(t => /Distance|Height/.test(t[0])), svg: s.svg.filter(x => x.length > 5) }));
    const v = await page.$('#bay .viz svg[aria-label^="Flight"]');
    if (v) await (await v.$('xpath=..')).screenshot({ path: `traj-${name}.png` });
    await ctx.close();
  }
  await close();
})();
