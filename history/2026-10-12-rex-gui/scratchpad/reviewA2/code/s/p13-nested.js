// A full redraw of the Rex + Ollie element while its distance box holds a typed, uncommitted value: Chromium fires
// 'change' as the box is removed, inside renderDuo (duoMode still true), and the handler's update() redraws Rex's bay.
const { wrap, launch, settle, readResult, S } = require('./h.js');
const path = require('path');
(async () => {
  const b = await launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto(wrap(path.join(S, process.argv[2] || 'lab/dist/index.html'), 'p13'));
  await p.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, duoAction: 'catch', action: 'throw' })));
  await p.reload(); await p.waitForTimeout(800); await settle(p, 'bay'); await settle(p, 'duo-bay');
  const rex = async () => { const r = await readResult(p, 'bay'); return r.verdict + ' | ' + ((r.effort[0] || '(no effort box)').slice(0, 60)); };
  console.log('before        Rex:', await rex());
  await p.click('#duo-bay details.effort-adjust > summary');
  await p.fill('#duo-near', '');
  await p.focus('#duo-near'); await p.keyboard.type('50');   // typed, not committed (no Enter, no Tab)
  // the phone turns (or the window is resized): a width change redraws both bays
  await p.setViewportSize({ width: 1000, height: 900 });
  await p.waitForTimeout(1500); await settle(p, 'duo-bay');
  console.log('after resize  Rex:', await rex());
  console.log('saved near:', await p.evaluate(() => JSON.parse(localStorage.getItem('rex-lab-v1')).near));
  // what a fresh load of the same state shows in Rex's bay
  const st = await p.evaluate(() => localStorage.getItem('rex-lab-v1'));
  const q = await b.newPage({ viewport: { width: 1000, height: 900 } });
  await q.goto(wrap(path.join(S, process.argv[2] || 'lab/dist/index.html'), 'p13'));
  await q.evaluate((s) => localStorage.setItem('rex-lab-v1', s), st); await q.reload(); await q.waitForTimeout(800); await settle(q, 'bay');
  const r2 = await readResult(q, 'bay');
  console.log('fresh load    Rex:', r2.verdict + ' | ' + ((r2.effort[0] || '(no effort box)').slice(0, 60)));
  console.log('errors:', JSON.stringify(errs));
  await b.close();
})();
