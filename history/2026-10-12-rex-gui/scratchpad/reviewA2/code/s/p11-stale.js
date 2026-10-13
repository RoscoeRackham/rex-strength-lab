// shots.js s3 step: after a Bolted switch, it waits 400 ms, then reads the element unless it says 'working it out'.
// Does the element still show the previous result at that moment (the deferred redraw not yet run)?
const { wrap, launch, settle, readResult, S } = require('./h.js');
const path = require('path');
const rate = Number(process.argv[2] || 1);
(async () => {
  const b = await launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const cdp = await p.context().newCDPSession(p);
  await p.goto(wrap(path.join(S, 'lab/dist/index.html'), 'new'));
  await p.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ anchor: 'friction', oAnchor: 'friction', duoOpen: true, duoAction: 'collide' })));
  await p.reload(); await p.waitForTimeout(800); await settle(p, 'duo-bay');
  await p.evaluate(() => { document.getElementById('powers').open = true;
    window.__duoRenders = 0; const bay = document.getElementById('duo-bay'); new MutationObserver(() => { window.__duoRenders++; }).observe(bay, { childList: true }); });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate });
  let stale = 0;
  for (const [a, bb] of [['bolted', 'friction'], ['bolted', 'bolted'], ['friction', 'bolted'], ['friction', 'friction'], ['bolted', 'friction']]) {
    const before = (await readResult(p, 'duo-bay')).verdict, r0 = await p.evaluate(() => window.__duoRenders);
    await p.setChecked('#bolt-rex', a === 'bolted'); await p.setChecked('#bolt-ollie', bb === 'bolted');
    await p.waitForTimeout(400);
    const busy = await p.evaluate(() => /working it out|Working out/i.test(document.getElementById('duo-bay').textContent));
    const r1 = await p.evaluate(() => window.__duoRenders);
    console.log('rate', rate, a, bb, '| redraws of the element since the click:', r1 - r0, '| busy text:', busy, busy || r1 > r0 ? '' : '<- the test would read the old result now');
    if (!busy && r1 === r0) stale++;
    await settle(p, 'duo-bay'); await p.waitForTimeout(1500);
  }
  console.log('stale reads', stale, 'of 5');
  await b.close();
})();
