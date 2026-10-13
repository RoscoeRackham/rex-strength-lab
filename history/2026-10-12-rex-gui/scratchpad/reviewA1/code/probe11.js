// a Rex's-bay redraw while the two-player search runs in the background: does the two-player search finish?
const { launch, url, settle, text, S } = require('./lib.js');
const DUO_FNS = ['armWrestle', 'pushMatch', 'shove', 'shoveBoth', 'liftPartner', 'throwPartner', 'catchGame', 'catchLeg', 'tossPartner', 'catchIt', 'collide', 'headOn', 'standoff'];
const countDuoCalls = ({ names, delay }) => {
  window.__duoCalls = 0;
  let v;
  Object.defineProperty(window, 'DinoPhys', { configurable: true, get: () => v, set: (x) => {
    for (const k of names) { const f = x[k]; if (typeof f === 'function') x[k] = function () { window.__duoCalls++; if (delay) { const t = performance.now(); while (performance.now() - t < delay) {} } return f.apply(this, arguments); }; }
    v = x;
  } });
};
(async () => {
  const br = await launch();
  for (const f of ['branch.html', 'B8.html']) {
    const slow = await br.newPage({ viewport: { width: 1280, height: 900 } });
    await slow.addInitScript(countDuoCalls, { names: DUO_FNS, delay: 60 });
    await slow.goto(url(f));
    await slow.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, duoAction: 'arm', action: 'throw' })));
    await slow.reload();
    // click Rex's Lift tab while the two-player search is in the background
    await slow.evaluate(() => new Promise((res) => { const poll = () => { if (/working it out/i.test(document.getElementById('duo-bay').textContent) && window.__duoCalls > 2) { document.getElementById('tab-lift').click(); res(); } else setTimeout(poll, 0); }; poll(); }));
    await slow.waitForTimeout(5000);
    const r = await slow.evaluate(() => ({ calls: window.__duoCalls, busy: /working it out/i.test(document.getElementById('duo-bay').textContent), read: (document.querySelector('#duo-bay .effort-read') || {}).textContent }));
    console.log(f, JSON.stringify(r).slice(0, 220));
    await slow.close();
  }
  await br.close();
})();
