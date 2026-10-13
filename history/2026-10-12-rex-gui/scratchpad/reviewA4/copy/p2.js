const { open } = require('./lib');
const states = [
  {},
  { anchor: 'bolted' }, { oAnchor: 'bolted' }, { anchor: 'bolted', oAnchor: 'bolted' },
  { anchor: 'braced', oAnchor: 'braced' },
  { groundHolds: true }, { groundHolds: true, anchor: 'bolted' },
  { mode: 'real', gentleHold: true, safePassenger: true, silentStrike: true, softLanding: true, coolFlight: true, anchor: 'bolted', oAnchor: 'bolted', groundHolds: true },
  { absorb: 'gradual' },
  { oSame: false, oLogKg: 6, oH: 5, oM: 20000, duoAction: 'collide' },
  { oSame: false, oInf: true, duoAction: 'catch' },
  { H: 50, m: 3007 * Math.pow(50 / 3.048, 3) },
  { build: 'human', H: 2, m: 180 },
  { m: 30000 },
  { inf: true },
];
(async () => {
  for (const s of states) {
    const { browser, page, errs } = await open(s, { wait: 800 });
    const t = await page.evaluate(() => {
      const q = (s) => { const n = document.querySelector(s); return n ? n.textContent : null; };
      return [q('#setup-sum'), q('#powers-sum'), q('#duo-sum'), q('#ollie-sum'), ['bolt-rex','bolt-ollie','ground-holds'].map(i=>document.getElementById(i).checked).join(',')];
    });
    console.log(JSON.stringify(s), '\n   ', t.join('  |  '), errs.length ? errs : '');
    await browser.close();
  }
})();
