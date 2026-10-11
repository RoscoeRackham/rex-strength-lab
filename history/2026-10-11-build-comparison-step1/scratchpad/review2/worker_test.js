// Is the Web Worker actually used, and does it give the same numbers as the main thread?
const { open } = require('./harness.js');
const init = () => {
  window.__workers = []; const W = window.Worker;
  window.Worker = function (url, o) { const w = new W(url, o); const rec = { url: String(url), msgs: 0, errs: 0 }; window.__workers.push(rec); w.addEventListener('message', () => rec.msgs++); w.addEventListener('error', (e) => { rec.errs++; rec.err = e.message; }); return w; };
  window.Worker.prototype = W.prototype;
  const C = URL.createObjectURL, R = URL.revokeObjectURL; window.__urls = { made: 0, revoked: 0 };
  URL.createObjectURL = function (b) { window.__urls.made++; return C.call(URL, b); };
  URL.revokeObjectURL = function (u) { window.__urls.revoked++; return R.call(URL, u); };
};
(async () => {
  for (const mode of [{ http: false }, { http: true }]) {
    const h = await open(Object.assign({ init }, mode));
    const { p } = h;
    await p.evaluate(() => document.getElementById('tool').scrollIntoView());
    await p.waitForFunction(() => document.querySelectorAll('#results tr').length > 5 && !/Measuring/.test(document.getElementById('toolStatus').textContent), null, { timeout: 60000 });
    const info = await p.evaluate(() => ({ workers: window.__workers, urls: window.__urls, status: document.getElementById('toolStatus').textContent.slice(0, 80), vol: document.querySelector('#results tbody tr:nth-child(2) td.n').textContent }));
    console.log(mode.http ? 'http' : 'file', JSON.stringify(info));
    // Compare the worker's result (as shown) with the main thread on the same example image.
    const cmp = await p.evaluate(async () => {
      const fig = document.getElementById('sheetCanvas');
      // Re-measure via main thread with the same options as measure() uses for the example.
      const tH = 1.8;
      return null;
    });
    console.log(h.logs.filter((l) => /error/i.test(l)).join('\n'));
    await h.close();
  }
})().catch((e) => { console.error(e); process.exit(1); });
