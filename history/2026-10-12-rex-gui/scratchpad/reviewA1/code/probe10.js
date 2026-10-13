// a close that lands while the search is running: does the search stop?
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
  for (const f of ['branch.html', 'B2.html', 'B9.html']) {
    const slow = await br.newPage({ viewport: { width: 1280, height: 900 } });
    await slow.addInitScript(countDuoCalls, { names: DUO_FNS, delay: 60 });
    await slow.goto(url(f));
    await slow.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, duoAction: 'arm' })));
    await slow.reload();
    // close from inside the page as soon as the search is in the background, and note the call count then
    const c0 = await slow.evaluate(() => new Promise((res) => { const poll = () => { if (/working it out/i.test(document.getElementById('duo-bay').textContent) && window.__duoCalls > 2) { document.querySelector('#duo > summary').click(); setTimeout(() => res(window.__duoCalls), 0); } else setTimeout(poll, 0); }; poll(); }));
    await slow.waitForTimeout(3000);
    const c1 = await slow.evaluate(() => window.__duoCalls);
    const kids = await slow.evaluate(() => document.getElementById('duo-bay').textContent.slice(0, 60));
    console.log(f, 'calls at close', c0, 'calls 3 s later', c1, c1 > c0 + 1 ? 'SEARCH KEPT RUNNING' : 'stopped', '| duo-bay:', kids);
    await slow.close();
  }
  await br.close();
})();
