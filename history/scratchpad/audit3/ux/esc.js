const { open, close } = require('./h.js');
(async () => {
  for (const [name, st] of [['loco-18.7-80', { action: 'throw', obj: 'loco', logKg: 18.7, angle: 80 }], ['car-12-45', { action: 'throw', obj: 'car', logKg: 12, angle: 45 }], ['car-11-45', { action: 'throw', obj: 'car', logKg: 11, angle: 45 }], ['car-10-60', { action: 'throw', obj: 'car', logKg: 10, angle: 60 }]]) {
    const { page, ctx } = await open({ w: 1280, h: 900, state: st });
    const s = await page.evaluate(() => window.__snap());
    console.log('== ' + name); console.log(JSON.stringify({ dial: s.dial[0], verdict: s.verdict, tiles: s.tiles, svg: s.svg.filter(x => x.length > 5) }, null, 0));
    const v = await page.$('#bay .viz svg[aria-label^="Flight"]');
    if (v) await (await v.$('xpath=..')).screenshot({ path: `esc-${name}.png` });
    await ctx.close();
  }
  await close();
})();
