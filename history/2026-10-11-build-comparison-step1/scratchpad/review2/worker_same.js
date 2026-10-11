// Worker result vs main-thread Measure.measureSheet on the same posted image and options.
const { open } = require('./harness.js');
const init = () => {
  window.__posted = []; window.__got = [];
  const W = window.Worker;
  window.Worker = function (url, o) {
    const w = new W(url, o);
    const pm = w.postMessage.bind(w);
    w.postMessage = function (m, tr) { window.__posted.push({ id: m.id, img: { width: m.img.width, height: m.img.height, data: new Uint8ClampedArray(m.img.data) }, opts: JSON.parse(JSON.stringify(m.opts)) }); return pm(m, tr); };
    w.addEventListener('message', (ev) => window.__got.push(ev.data));
    return w;
  };
  window.Worker.prototype = W.prototype;
};
(async () => {
  const h = await open({ init });
  const { p } = h;
  await p.evaluate(() => document.getElementById('tool').scrollIntoView());
  await p.waitForFunction(() => window.__got.length >= 1, null, { timeout: 60000 });
  const r = await p.evaluate(() => {
    const job = window.__posted[0], got = window.__got.find((g) => g.id === job.id).r;
    const main = Measure.measureSheet(job.img, job.opts); delete main.mask;
    const diffs = [];
    (function cmp(a, b, path) {
      if (typeof b === 'function') return;
      if (a === undefined && b === undefined) return;
      if (typeof a === 'number' && typeof b === 'number') { if (!(a === b || (a !== a && b !== b))) diffs.push(path + ': ' + a + ' vs ' + b); return; }
      if (a && b && typeof a === 'object') { const ks = new Set(Object.keys(a).concat(Object.keys(b).filter((k) => typeof b[k] !== 'function'))); ks.forEach((k) => cmp(a[k], b[k], path + '.' + k)); return; }
      if (a !== b) diffs.push(path + ': ' + JSON.stringify(a) + ' vs ' + JSON.stringify(b));
    })(got, main, 'r');
    return { opts: job.opts, size: [job.img.width, job.img.height], diffs: diffs.slice(0, 20), nd: diffs.length, score: [got.score.value, main.score.value] };
  });
  console.log(JSON.stringify(r, null, 1));
  await h.close();
})().catch((e) => { console.error(e); process.exit(1); });
