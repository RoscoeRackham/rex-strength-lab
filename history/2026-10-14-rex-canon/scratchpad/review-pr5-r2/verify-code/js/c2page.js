const { open } = require('./page.js');
(async () => {
  const { browser, page, load, tile } = await open();
  const runs = [
    ['fastball 10 m, 1e14', { cObj: 'baseball', cStyle: 'hard', cLogD: 1, logKg: 14 }],
    ['fastball 1 km, 1e13', { cObj: 'baseball', cStyle: 'hard', cLogD: 3, logKg: 13 }],
    ['person 31.6 km, 1e12', { cObj: 'person', cStyle: 'hard', cLogD: 4.5, logKg: 12 }],
    ['fastball 300 m, 1e8 (control)', { cObj: 'baseball', cStyle: 'hard', cLogD: Math.log10(300), logKg: 8 }],
  ];
  for (const [lab, st] of runs) {
    await load(Object.assign({ duoOpen: true, duoAction: 'catch' }, st), 'allout');
    console.log('---', lab, '|', await tile('duo-bay'));
  }
  console.log('errs', page.errs);
  await browser.close();
})();
