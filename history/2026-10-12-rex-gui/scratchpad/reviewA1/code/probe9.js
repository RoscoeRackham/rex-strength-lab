const { launch, url, settle, text, S } = require('./lib.js');
const DUO_FNS = ['armWrestle', 'pushMatch', 'shove', 'shoveBoth', 'liftPartner', 'throwPartner', 'catchGame', 'catchLeg', 'tossPartner', 'catchIt', 'collide', 'headOn', 'standoff'];
const countDuoCalls = ({ names, delay }) => {
  window.__duoCalls = 0; window.__t = [];
  let v;
  Object.defineProperty(window, 'DinoPhys', { configurable: true, get: () => v, set: (x) => {
    for (const k of names) { const f = x[k]; if (typeof f === 'function') x[k] = function () { window.__duoCalls++; window.__t.push(Math.round(performance.now())); if (delay) { const t = performance.now(); while (performance.now() - t < delay) {} } return f.apply(this, arguments); }; }
    v = x;
  } });
};
(async () => {
  const br = await launch();
  for (const f of [process.argv[2] || 'B2.html', 'branch.html']) {
    const slow = await br.newPage({ viewport: { width: 1280, height: 900 } });
    await slow.addInitScript(countDuoCalls, { names: DUO_FNS, delay: 60 });
    await slow.goto(url(f));
    await slow.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, duoAction: 'arm' })));
    await slow.reload(); await slow.waitForTimeout(600);
    const busy = await slow.evaluate(() => /working it out/i.test(document.getElementById('duo-bay').textContent));
    const tc = await slow.evaluate(() => performance.now());
    await slow.click('#duo > summary');
    const c0 = await slow.evaluate(() => window.__duoCalls);
    await slow.waitForTimeout(3000);
    const r = await slow.evaluate(() => ({ calls: window.__duoCalls, t: window.__t }));
    console.log(f, 'busy', busy, 'closed at ~', Math.round(tc), 'c0', c0, 'c1', r.calls, 'call times', JSON.stringify(r.t));
    await slow.close();
  }
  await br.close();
})();
