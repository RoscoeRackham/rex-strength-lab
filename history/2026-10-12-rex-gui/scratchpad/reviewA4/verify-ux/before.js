const { wrap, launch, D } = require('./common');
const url = wrap('/home/user/rex-strength-lab/rex-strength-lab/dist/index.html', D + '/page-b.html');
(async () => {
  const b = await launch();
  for (const [w, h, s] of [[1280, 900, 500], [1366, 768, 400]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h } }); const p = await ctx.newPage();
    await p.goto(url); await p.waitForTimeout(800); await p.evaluate(s => scrollTo(0, s), s); await p.waitForTimeout(300);
    await p.screenshot({ path: `${D}/before-${w}x${h}.png`, clip: { x: 0, y: h - 170, width: 420, height: 170 } });
    await ctx.close();
  }
  await b.close();
})();
