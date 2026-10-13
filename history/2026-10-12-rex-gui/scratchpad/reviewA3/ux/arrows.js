const { launch, open, S } = require('./lib.js');
(async () => {
  const b = await launch();
  const page = await open(b, { w: 1280, h: 900, state: { duoOpen: true, duoAction: 'arm', action: 'throw' }, wait: 3500 });
  const st = () => page.evaluate(() => { const s = JSON.parse(localStorage.getItem('rex-lab-v1')); const a = document.activeElement; return a.id + ' action=' + s.action + ' duo=' + s.duoAction + ' focusVisible=' + a.matches(':focus-visible') + ' selRex=' + document.querySelector('#tabs [aria-selected=true]').id + ' selDuo=' + document.querySelector('#duo-tabs [aria-selected=true]').id; });
  await page.focus('#tab-throw');
  const log = [];
  for (const k of ['ArrowRight', 'ArrowRight', 'End', 'ArrowRight', 'ArrowLeft', 'Home', 'ArrowLeft']) { await page.keyboard.press(k); await page.waitForTimeout(200); log.push(k + ': ' + await st()); }
  // duo list
  await page.focus('#tab-arm');
  for (const k of ['ArrowRight', 'ArrowRight', 'ArrowRight', 'ArrowRight', 'ArrowLeft', 'End', 'Home', 'ArrowLeft']) { await page.keyboard.press(k); await page.waitForTimeout(1500); log.push('duo ' + k + ': ' + await st()); }
  // up/down keys?
  await page.focus('#tab-arm'); await page.keyboard.press('ArrowDown'); await page.waitForTimeout(500); log.push('duo ArrowDown: ' + await st());
  console.log(log.join('\n'));
  console.log(page.errs);
  await b.close();
})();
