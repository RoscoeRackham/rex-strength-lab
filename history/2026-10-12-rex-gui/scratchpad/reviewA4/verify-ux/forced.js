const { wrap, launch, D } = require('./common');
const tag = process.env.SRC ? 'fix' : 'branch';
const url = wrap(process.env.SRC || '/home/user/rex-strength-lab/rex-strength-lab/dist/index.html', D + '/page-fc-' + tag + '.html');
(async () => {
  const b = await launch();
  for (const fc of ['none', 'active']) {
    for (const scheme of ['light', 'dark']) {
      const ctx = await b.newContext({ viewport: { width: 1366, height: 768 }, forcedColors: fc, colorScheme: scheme }); const p = await ctx.newPage();
      await p.goto(url); await p.waitForTimeout(800); await p.evaluate(() => scrollTo(0, 400)); await p.waitForTimeout(300);
      const r = await p.evaluate(() => { const c = document.querySelector('#more-below'), cs = getComputedStyle(c); return { fcMatch: matchMedia('(forced-colors: active)').matches, hidden: c.hidden, bgImage: cs.backgroundImage, bgColor: cs.backgroundColor, color: cs.color, text: c.textContent, rect: [Math.round(c.getBoundingClientRect().top), Math.round(c.getBoundingClientRect().bottom)], density: (() => { const r = document.querySelector('#density').getBoundingClientRect(); return [Math.round(r.top), Math.round(r.bottom)]; })() }; });
      console.log(`${tag} forced=${fc} ${scheme}`, JSON.stringify(r));
      await p.screenshot({ path: `${D}/fc-${tag}-${fc}-${scheme}.png`, clip: { x: 0, y: 600, width: 420, height: 168 } });
      await ctx.close();
    }
  }
  await b.close();
})();
