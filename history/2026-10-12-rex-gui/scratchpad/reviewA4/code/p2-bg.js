// the two-player effort found by a background search (every two-player call slowed) equals the one found in a render
const { launch, open, settle, readResult } = require('./lib.js');
const STATES = [
  { duoAction: 'arm' },
  { duoAction: 'catch', cObj: 'car', cLogD: 2 },
  { duoAction: 'wrestle', wrestleMove: 'throw', wAngle: 30 },
  { duoAction: 'collide', colMode: 'charge', colSrc: 'sprint' },
  { duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'both' },
];
(async () => {
  const b = await launch();
  for (const st of STATES) {
    const res = {};
    for (const [file, delay] of [['branch.html', 0], ['branch.html', 40], ['main.html', 0], ['main.html', 40]]) {
      const isMain = file === 'main.html';
      const s = Object.assign({}, st, isMain ? { group: 'duo' } : { duoOpen: true });
      const page = await open(b, file, { count: true, delay, state: s, wait: 600 });
      const bay = isMain ? 'bay' : 'duo-bay';
      const sawBusy = await page.evaluate(() => !!document.body.textContent.match(/Effort: working it out/));
      const ok = await settle(page, bay);
      await page.waitForTimeout(300);
      const r = await readResult(page, bay);
      res[file + '@' + delay] = { ok, sawBusy, effort: r.effort.join(' | ').slice(0, 220), verdict: (r.verdict || '').slice(0, 120), errs: page.errs };
      await page.close();
    }
    const keys = Object.keys(res);
    const same = keys.every((k) => res[k].effort === res[keys[0]].effort && res[k].verdict === res[keys[0]].verdict);
    console.log(JSON.stringify(st), same ? 'ALL SAME' : 'DIFFER');
    for (const k of keys) console.log('  ', k, JSON.stringify(res[k]));
  }
  await b.close();
})();
