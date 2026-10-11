const { launch, open, R } = require('./lib');
(async () => {
  const b = await launch();
  const cases = {
    'Worker throws': () => { window.Worker = function () { throw new Error('blocked'); }; },
    'CSP worker-src none': () => { const add = () => { const m = document.createElement('meta'); m.httpEquiv = 'Content-Security-Policy'; m.content = "worker-src 'none'"; document.head.appendChild(m); }; if (document.head) add(); else document.addEventListener('readystatechange', function f() { if (document.head) { add(); document.removeEventListener('readystatechange', f); } }); },
    'normal': () => {},
  };
  for (const [name, init] of Object.entries(cases)) {
    const { ctx, p } = await open(b, 1280, 900, 'light', { init });
    await p.evaluate(() => { window.__w = 0; const W = window.Worker; });
    await p.evaluate(() => document.getElementById('tool').scrollIntoView());
    const ok = await p.waitForFunction(() => document.querySelectorAll('#results tr').length > 5, null, { timeout: 60000 }).then(() => true, () => false);
    const r = await p.evaluate(() => ({ status: document.getElementById('toolStatus').textContent.slice(0, 70), rows: document.querySelectorAll('#results tr').length }));
    console.log(name, ok, JSON.stringify(r), 'errors:', p._errs.slice(0, 3));
    await ctx.close();
  }
  await b.close();
})();
