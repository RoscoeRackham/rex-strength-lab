const { wrap, launch, D } = require('./common');
const url = wrap(process.env.SRC || '/home/user/rex-strength-lab/rex-strength-lab/dist/index.html', D + '/page-l.html');
(async () => {
  const b = await launch();
  for (const h of [1240, 1250, 1260]) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: h } }); const p = await ctx.newPage();
    await p.goto(url); await p.waitForTimeout(1500);
    const r = await p.evaluate(() => {
      const a = document.querySelector('.panel-controls'), cue = document.querySelector('#more-below'), cs = getComputedStyle(cue);
      const own = cue.hidden ? 0 : cue.offsetHeight + parseFloat(cs.marginTop) + parseFloat(cs.marginBottom);
      const last = [...a.children].filter(c => c !== cue).pop().getBoundingClientRect();
      return { cue: cue.hidden ? 'hidden' : cue.textContent, cueTop: Math.round(cue.getBoundingClientRect().top), overflow: a.scrollHeight - a.clientHeight, realBelow: a.scrollHeight - own - a.clientHeight - a.scrollTop, lastContentBottom: Math.round(last.bottom), boxBottom: Math.round(a.getBoundingClientRect().bottom), winY: scrollY };
    });
    console.log('1280x' + h, 'no page scroll', JSON.stringify(r));
    await p.screenshot({ path: `${D}/load-1280x${h}.png`, clip: { x: 0, y: h - 130, width: 420, height: 130 } });
    await ctx.close();
  }
  await b.close();
})();
