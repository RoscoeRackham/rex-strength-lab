const open = require('./pw.js');
(async () => {
  const { browser, page, errs, load, settle } = await open(+process.argv[2] || 1280);
  const dump = async (label) => {
    await page.waitForTimeout(500);
    try { await settle(page, 'duo-bay'); } catch (e) {}
    await page.waitForTimeout(1500);
    const t = await page.evaluate(() => document.getElementById('duo-bay').innerText);
    const lines = t.split('\n').filter((l) => /J\b|ladder|×|% of|TNT|Energy/.test(l));
    console.log('=== ' + label + '\n' + lines.join('\n'));
  };
  const runs = [
    ['collide set gb=1e4 default bodies', { duoOpen: true, duoAction: 'collide', colSrc: 'set', colGB: 4, logKg: 10 }],
    ['collide set gb=1e4 heavy 1e24', { duoOpen: true, duoAction: 'collide', colSrc: 'set', colGB: 4, m: 1e24, oM: 1e24, logKg: 30 }],
    ['collide set gb=1e4 heavy 1e26', { duoOpen: true, duoAction: 'collide', colSrc: 'set', colGB: 4, m: 1e26, oM: 1e26, H: 500, oH: 500, logKg: 34 }],
    ['collide set gb=1 heavy 1e20', { duoOpen: true, duoAction: 'collide', colSrc: 'set', colGB: 0, m: 1e20, oM: 1e20, logKg: 30 }],
    ['collide sprint default', { duoOpen: true, duoAction: 'collide' }],
    ['catch fastball baseball 1e7 m strong', { duoOpen: true, duoAction: 'catch', cObj: 'baseball', cLogD: 7.31, cStyle: 'hard', logKg: 30 }],
    ['catch fastball car 1e7 m strong', { duoOpen: true, duoAction: 'catch', cObj: 'car', cLogD: 7.31, cStyle: 'hard', logKg: 34 }],
    ['catch fastball partner', { duoOpen: true, duoAction: 'catch', cObj: 'partner', cLogD: 7.31, cStyle: 'hard', logKg: 34 }],
  ];
  for (const [label, st] of runs) { await load(st, false); await dump(label); }
  console.log('ERRS', errs.slice(0, 5));
  await browser.close();
})();
