// focus inside each bay while that bay's (or the other bay's) background search finishes
const { launch, open } = require('./lib.js');
const DUO_FNS = ['armWrestle', 'pushMatch', 'shove', 'shoveBoth', 'liftPartner', 'throwPartner', 'catchGame', 'catchLeg', 'tossPartner', 'catchIt', 'collide', 'headOn', 'standoff'];
const slow = ({ names, delay }) => { let v; Object.defineProperty(window, 'DinoPhys', { configurable: true, get: () => v, set: (x) => { for (const k of names) { const f = x[k]; if (typeof f === 'function') x[k] = function () { const t = performance.now(); while (performance.now() - t < delay) {} return f.apply(this, arguments); }; } v = x; } }); };
(async () => {
  const b = await launch();
  for (const [label, focusSel] of [['duo effort select', '#duo-effort'], ['duo Adjust summary', '#duo-bay details.effort-adjust > summary'], ['Rex effort select', '#effort'], ['Rex object select', '#obj']]) {
    const page = await open(b, { w: 1280, h: 900, state: { duoOpen: true, duoAction: 'arm', action: 'throw' }, wait: 50, init: { fn: slow, arg: { names: DUO_FNS, delay: 60 } } });
    // wait for 'working it out' in the duo bay
    await page.waitForFunction(() => /working it out/i.test(document.getElementById('duo-bay').textContent), null, { timeout: 15000 });
    await page.focus(focusSel);
    const before = await page.evaluate(() => { const a = document.activeElement; return (a.id || a.tagName) + ' in ' + (a.closest('#duo-bay') ? 'duo' : a.closest('#bay') ? 'bay' : 'other'); });
    await page.waitForFunction(() => !/working it out/i.test(document.getElementById('duo-bay').textContent), null, { timeout: 20000 });
    await page.waitForTimeout(500);
    const after = await page.evaluate(() => { const a = document.activeElement; return (a.id || a.tagName + ':' + a.textContent.slice(0, 20)) + ' in ' + (a.closest('#duo-bay') ? 'duo' : a.closest('#bay') ? 'bay' : 'other'); });
    console.log(label, '| before:', before, '| after search finished:', after, page.errs.length ? page.errs : '');
    await page.context().close();
  }
  await b.close();
})();
