const { launch, open, R } = require('./lib');
(async () => {
  const b = await launch();
  for (const [w, h, sch] of [[360, 740, 'light'], [390, 844, 'dark'], [768, 1024, 'dark'], [1024, 768, 'light'], [1280, 900, 'dark']]) {
    const { ctx, p } = await open(b, w, h, sch);
    for (const mode of [['#hSame', '#vFront'], ['#hReal', '#vFront'], ['#hSame', '#vSide']]) {
      await p.click(mode[0]); await p.click(mode[1]);
      const tag = mode.map((m) => m.slice(2)).join('');
      for (const id of ['top', 'empty', 'giants', 'rex-and-ollie']) {
        await p.locator('#' + id).screenshot({ path: `${R}/stop-${w}-${sch}-${tag}-${id}.png` });
      }
    }
    await p.click('#hSame'); await p.click('#vFront');
    await p.screenshot({ path: `${R}/full-${w}-${sch}.png`, fullPage: true });
    await ctx.close();
  }
  await b.close();
})();
