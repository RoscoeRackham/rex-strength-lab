// shots.js's mid-search check, with a choice of Rex tab: does the two-player search still finish?
const { wrap, launch, S } = require('./h.js');
const path = require('path');
const src = process.argv[2], tab = process.argv[3] || 'jump';
const DUO_FNS = ['armWrestle', 'pushMatch', 'shove', 'shoveBoth', 'liftPartner', 'throwPartner', 'catchGame', 'catchLeg', 'tossPartner', 'catchIt', 'collide', 'headOn', 'standoff'];
const countDuoCalls = ({ names, delay }) => {
  window.__duoCalls = 0; let v;
  Object.defineProperty(window, 'DinoPhys', { configurable: true, get: () => v, set: (x) => {
    for (const k of names) { const f = x[k]; if (typeof f === 'function') x[k] = function () { window.__duoCalls++; if (delay) { const t = performance.now(); while (performance.now() - t < delay) { /* slow */ } } return f.apply(this, arguments); }; }
    v = x; } });
};
(async () => {
  const b = await launch();
  const pg = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await pg.addInitScript(countDuoCalls, { names: DUO_FNS, delay: 60 });
  await pg.addInitScript((t) => {
    const iv = setInterval(() => { const bb = document.getElementById('duo-bay'); if (bb && /Effort: working it out/i.test(bb.textContent)) { clearInterval(iv); window.__busyAt = window.__duoCalls; document.getElementById('tab-' + t).click(); } }, 5);
  }, tab);
  await pg.goto(wrap(path.resolve(src), 'p5-' + path.basename(path.dirname(path.dirname(path.resolve(src))))));
  await pg.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, duoAction: 'arm' })));
  await pg.reload(); await pg.waitForTimeout(6000);
  console.log(src.split('/').slice(-3, -2)[0], 'Rex tab', tab, JSON.stringify(await pg.evaluate(() => ({ busyAt: window.__busyAt, calls: window.__duoCalls, working: /working it out/i.test(document.getElementById('duo-bay').textContent), effort: (document.querySelector('#duo-bay .effort-read b') || {}).textContent }))));
  await b.close();
})();
