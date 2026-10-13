// (b) the cue is hidden (box at its end); a strength chip makes the dial taller; does the cue come back?
const { wrap, launch, D } = require('./common');
const extra = process.argv[2] || '';
const url = wrap(process.env.SRC || '/home/user/rex-strength-lab/rex-strength-lab/dist/index.html', D + '/page-st' + (process.env.SRC ? '-fix' : '') + '.html', extra);
const st = p => p.evaluate(() => {
  const a = document.querySelector('.panel-controls'), cue = document.querySelector('#more-below');
  const pw = document.querySelector('#powers > summary').getBoundingClientRect();
  return { cue: cue.hidden ? 'hidden' : cue.textContent, overflowBelow: Math.round(a.scrollHeight - a.clientHeight - a.scrollTop), powersSummary: Math.round(pw.top) + '-' + Math.round(pw.bottom), boxBottom: Math.round(a.getBoundingClientRect().bottom), dial: document.querySelector('.dial-read .who') ? document.querySelector('.dial-read .who').textContent.slice(0, 60) : '' };
});
(async () => {
  const b = await launch();
  for (const [w, h] of [[1280, 680], [1280, 690]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h } }); const p = await ctx.newPage();
    await p.goto(url); await p.waitForTimeout(800); await p.evaluate(() => scrollTo(0, 400)); await p.waitForTimeout(300);
    await p.click('#setup > summary'); await p.waitForTimeout(300);
    await p.evaluate(() => { const a = document.querySelector('.panel-controls'); a.scrollTop = a.scrollHeight; }); await p.waitForTimeout(400);
    console.log(w + 'x' + h, 'at end    ', JSON.stringify(await st(p)));
    const chips = await p.$$eval('#tier-chips button', bs => bs.map(b => b.textContent));
    const name = chips.find(c => /Superman/.test(c));
    await p.click(`#tier-chips button:has-text("${name}")`); await p.waitForTimeout(600);
    console.log(w + 'x' + h, 'chip ' + name, JSON.stringify(await st(p)));
    await p.screenshot({ path: `${D}/stale-${w}x${h}${process.env.SRC ? '-fix' : ''}.png`, clip: { x: 0, y: h - 150, width: 420, height: 150 } });
    await ctx.close();
  }
  await b.close();
})();
