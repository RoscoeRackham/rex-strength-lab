// close, change settings while closed (no two-player calls may run), reopen: the element shows the new settings' result
const { wrap, launch, settle, readResult, S } = require('./h.js');
const path = require('path');
const DUO_FNS = ['armWrestle', 'pushMatch', 'shove', 'shoveBoth', 'liftPartner', 'throwPartner', 'catchGame', 'catchLeg', 'tossPartner', 'catchIt', 'collide', 'headOn', 'standoff', 'catchMinD', 'catchRoundTrip', 'flyTo', 'holdOf', 'rockLoad', 'contactForces', 'chargeSpeed', 'partnerAsObject'];
const countDuoCalls = ({ names }) => { window.__duoCalls = 0; let v; Object.defineProperty(window, 'DinoPhys', { configurable: true, get: () => v, set: (x) => { for (const k of names) { const f = x[k]; if (typeof f === 'function') x[k] = function () { window.__duoCalls++; return f.apply(this, arguments); }; } v = x; } }); };
(async () => {
  const b = await launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  await p.addInitScript(countDuoCalls, { names: DUO_FNS });
  const URL = wrap(path.join(S, 'lab/dist/index.html'), 'new');
  await p.goto(URL);
  await p.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, duoAction: 'collide', action: 'walk' })));
  await p.reload(); await p.waitForTimeout(800); await settle(p, 'duo-bay');
  const v0 = (await readResult(p, 'duo-bay')).verdict;
  await p.click('#duo > summary'); await p.waitForTimeout(300);
  const c0 = await p.evaluate(() => window.__duoCalls);
  // while closed: a strength chip, the ground, Rex's Bolted switch, Ollie's height via state (his panel is inside the element)
  await p.click('#tier-chips .chip:nth-child(4)'); await p.waitForTimeout(300);
  await p.selectOption('#surface', 'sand'); await p.waitForTimeout(300);
  await p.evaluate(() => { document.getElementById('powers').open = true; }); await p.setChecked('#bolt-rex', true); await p.waitForTimeout(300);
  await p.setViewportSize({ width: 1280, height: 900 }); await p.waitForTimeout(800);
  const c1 = await p.evaluate(() => window.__duoCalls);
  console.log('two-player calls while closed:', c1 - c0, '| placeholder while closed:', JSON.stringify(await p.evaluate(() => document.getElementById('duo-bay').textContent.slice(0, 40))));
  await p.click('#duo > summary'); await p.waitForTimeout(600); await settle(p, 'duo-bay');
  const a = await readResult(p, 'duo-bay');
  const st = await p.evaluate(() => localStorage.getItem('rex-lab-v1'));
  const q = await b.newPage({ viewport: { width: 1280, height: 900 } }); await q.goto(URL); await q.evaluate((s) => localStorage.setItem('rex-lab-v1', s), st); await q.reload(); await q.waitForTimeout(800); await settle(q, 'duo-bay');
  const z = await readResult(q, 'duo-bay');
  console.log('before closing :', v0.slice(0, 110));
  console.log('after reopening:', a.verdict.slice(0, 110));
  console.log('fresh load     :', z.verdict.slice(0, 110));
  console.log('same as fresh load:', JSON.stringify(a) === JSON.stringify(z));
  await b.close();
})();
