// (a) close Size and density while the cue shows; does the cue stay up only because of its own height?
const { wrap, launch, D } = require('./common');
const extra = process.argv[2] || '';
const url = wrap(process.env.SRC || '/home/user/rex-strength-lab/rex-strength-lab/dist/index.html', D + '/page-ss' + (process.env.SRC ? '-fix' : '') + '.html', extra);
const st = p => p.evaluate(() => {
  const a = document.querySelector('.panel-controls'), cue = document.querySelector('#more-below');
  const cs = getComputedStyle(cue);
  const own = cue.hidden ? 0 : cue.offsetHeight + parseFloat(cs.marginTop) + parseFloat(cs.marginBottom);
  const pw = document.querySelector('#powers > summary').getBoundingClientRect(), cr = cue.getBoundingClientRect();
  return { cue: cue.hidden ? 'hidden' : cue.textContent + ' @' + Math.round(cr.top) + '-' + Math.round(cr.bottom), overflow: a.scrollHeight - a.clientHeight, ownSpace: own, realOverflow: a.scrollHeight - own - a.clientHeight,
    scrollTop: Math.round(a.scrollTop), powersSummary: Math.round(pw.top) + '-' + Math.round(pw.bottom), powersOpen: document.querySelector('#powers').open, boxBottom: Math.round(a.getBoundingClientRect().bottom) };
});
(async () => {
  const b = await launch();
  for (const [w, h] of [[1280, 700], [1280, 720]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h } }); const p = await ctx.newPage();
    await p.goto(url); await p.waitForTimeout(800); await p.evaluate(() => scrollTo(0, 400)); await p.waitForTimeout(300);
    console.log(w + 'x' + h, 'load      ', JSON.stringify(await st(p)));
    await p.click('#setup > summary'); await p.waitForTimeout(400);
    const s = await st(p);
    console.log(w + 'x' + h, 'closed S&D', JSON.stringify(s));
    // click the middle of the Their powers summary
    const pt = await p.evaluate(() => { const r = document.querySelector('#powers > summary span').getBoundingClientRect(); const x = r.left + r.width / 2, y = r.top + r.height / 2; const at = document.elementFromPoint(x, y); return { x, y, at: at && (at.id || at.tagName + ':' + at.textContent.slice(0, 15)) }; });
    console.log('   click Their powers at', JSON.stringify(pt));
    await p.screenshot({ path: `${D}/ss-${w}x${h}${process.env.SRC ? '-fix' : ''}.png`, clip: { x: 0, y: h - 140, width: 420, height: 140 } });
    await p.mouse.click(pt.x, pt.y); await p.waitForTimeout(600);
    console.log('   after   ', JSON.stringify(await st(p)));
    await ctx.close();
  }
  await b.close();
})();
