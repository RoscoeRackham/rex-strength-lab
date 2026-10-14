// mutant A (probes outside a render run without two-player mode): what the page shows when the search finishes in the background
const { launch, open, settle, readResult } = require('./lib.js');
const STATES = [{ duoAction: 'arm' }, { duoAction: 'collide', colMode: 'charge', colSrc: 'sprint' }, { duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'both' }];
(async () => {
  const b = await launch();
  for (const st of STATES) for (const [file, delay] of [['branch.html', 0], ['mutA.html', 0], ['mutA.html', 40]]) {
    const page = await open(b, file, { count: true, delay, state: Object.assign({ duoOpen: true }, st), wait: 600 });
    await settle(page, 'duo-bay'); await page.waitForTimeout(300);
    const r = await readResult(page, 'duo-bay');
    console.log(JSON.stringify(st), file + '@' + delay, '|', r.effort.join(' ').slice(0, 170), '|', (r.verdict || '').slice(0, 90));
    await page.close();
  }
  await b.close();
})();
