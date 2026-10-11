// Worker blocked by CSP (worker-src 'none'), and a worker script that fails to load: does the tool fall back?
const { open } = require('../harness.js');
(async () => {
  for (const [name, opts] of [
    ['csp worker-src none', { http: true, headers: { 'content-security-policy': "worker-src 'none'" } }],
    ['Worker undefined', { init: () => { delete window.Worker; window.Worker = undefined; } }],
    ['worker throws on load', { init: () => { const W = window.Worker; window.Worker = function (u, o) { return new W(URL.createObjectURL(new Blob(['throw new Error("boom")'], { type: 'text/javascript' })), o); }; } }],
  ]) {
    const h = await open(opts);
    const { p } = h;
    await p.evaluate(() => document.getElementById('tool').scrollIntoView());
    const ok = await p.waitForFunction(() => document.querySelectorAll('#results tr').length > 5 && !/Measuring/.test(document.getElementById('toolStatus').textContent), null, { timeout: 60000 }).then(() => true, () => false);
    const st = await p.evaluate(() => ({ status: document.getElementById('toolStatus').textContent.slice(0, 90), score: Array.from(document.querySelectorAll('#results tr')).map((r) => r.textContent).filter((t) => /^Score\d/.test(t)).join('') }));
    console.log(name, '| finished:', ok, JSON.stringify(st), '| errors:', h.logs.filter((l) => /error/i.test(l) && !/ERR_FAILED/.test(l)).join(' || ').slice(0, 300));
    await h.close();
  }
})().catch((e) => { console.error(e); process.exit(1); });
