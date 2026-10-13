// Scan window heights: in each state after a strength chip / slider change, is the cue's state wrong?
// wrong = (real content below the edge, cue hidden) or (cue shown, nothing real below)
const { wrap, launch, D } = require('./common');
const extra = process.argv[2] || '';
const closeSetup = process.argv[3] === 'closed';
const url = wrap(process.env.SRC || '/home/user/rex-strength-lab/rex-strength-lab/dist/index.html', D + '/page-scan' + (extra ? '-fix' : '') + '.html', extra);
const st = p => p.evaluate(() => {
  const a = document.querySelector('.panel-controls'), cue = document.querySelector('#more-below');
  const cs = getComputedStyle(cue);
  const own = cue.hidden ? 0 : cue.offsetHeight + parseFloat(cs.marginTop) + parseFloat(cs.marginBottom);
  const realBelow = a.scrollHeight - own - a.clientHeight - a.scrollTop;
  return { hidden: cue.hidden, realBelow: Math.round(realBelow) };
});
(async () => {
  const b = await launch();
  const lo = +process.argv[4] || 900, hi = +process.argv[5] || 1400, step = +process.argv[6] || 20;
  for (let h = lo; h <= hi; h += step) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: h } }); const p = await ctx.newPage();
    await p.goto(url); await p.waitForTimeout(600); await p.evaluate(() => scrollTo(0, 400)); await p.waitForTimeout(200);
    if (closeSetup) { await p.click('#setup > summary'); await p.waitForTimeout(200); }
    const n = await p.$$eval('#tier-chips button', bs => bs.length);
    const bad = [];
    const s0 = await st(p);
    if ((s0.hidden && s0.realBelow > 4) || (!s0.hidden && s0.realBelow <= 0)) bad.push('load:' + JSON.stringify(s0));
    for (let i = 0; i < n; i++) {
      const name = await p.$eval(`#tier-chips button:nth-child(${i + 1})`, b => b.textContent);
      await p.click(`#tier-chips button:nth-child(${i + 1})`); await p.waitForTimeout(250);
      const s = await st(p);
      if ((s.hidden && s.realBelow > 4) || (!s.hidden && s.realBelow <= 0)) bad.push(name + ':' + JSON.stringify(s));
    }
    console.log('1280x' + h, closeSetup ? '(S&D closed)' : '(S&D open)', bad.length ? bad.join(' | ') : 'ok');
    await ctx.close();
  }
  await b.close();
})();
