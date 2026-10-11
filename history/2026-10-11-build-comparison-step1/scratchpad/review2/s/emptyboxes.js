// What the target area shows from the moment the tool starts until the first outline is drawn.
const { launch, open, R } = require('./lib');
(async () => {
  const b = await launch();
  const { ctx, p } = await open(b, 1280, 900, 'light');
  await p.evaluate(() => {
    const orig = Figure.solveTarget;
    Figure.solveTarget = function () {
      window.__atSolve = { t: performance.now(), status: document.getElementById('targetStatus').textContent, src: document.getElementById('tgtFront').getAttribute('src'), broken: document.getElementById('tgtFront').naturalWidth === 0,
        inView: (function () { const r = document.getElementById('tgtFront').getBoundingClientRect(); return r.top < window.innerHeight && r.bottom > 0; })() };
      return orig.apply(this, arguments);
    };
  });
  await p.evaluate(() => { window.__t0 = performance.now(); document.querySelector('.jumps a[href="#measure"]').click(); });
  await p.waitForFunction(() => /measures/.test(document.getElementById('targetStatus').textContent), null, { timeout: 60000 });
  const r = await p.evaluate(() => ({ atSolve: Object.assign({}, window.__atSolve, { t: Math.round(window.__atSolve.t - window.__t0) }), drawnAt: Math.round(performance.now() - window.__t0) }));
  console.log(JSON.stringify(r));
  await ctx.close(); await b.close();
})();
