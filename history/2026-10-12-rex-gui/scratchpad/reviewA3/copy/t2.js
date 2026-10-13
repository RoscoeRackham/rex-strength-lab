const L = require('./lib.js');
const states = [
  {},
  { anchor: 'bolted' },
  { oAnchor: 'bolted' },
  { anchor: 'bolted', oAnchor: 'bolted', groundHolds: true },
  { mode: 'real', groundHolds: true, gentleHold: true, coolFlight: true },
  { gentleHold: true, safePassenger: true, silentStrike: true, softLanding: true, coolFlight: true, anchor: 'bolted' },
  { build: 'human', H: 2, m: 180 },
  { H: 50, m: 3007 * Math.pow(50/3.048,3) },
  { m: 30000 },
  { oSame: false, oLogKg: 6, oH: 5, oM: 20000 },
  { oInf: true, oSame: false },
  { anchor: 'braced', oAnchor: 'braced', group: 'duo', duoAction: 'collide' },
];
(async () => {
  const b = await L.chromium.launch({ executablePath: L.CHROME });
  const url = L.NEW();
  for (const s of states) {
    const p = await L.open(b, url, s);
    const sums = await p.evaluate(() => ({ setup: document.querySelector('#setup-sum').textContent, powers: document.querySelector('#powers-sum').textContent, duo: document.querySelector('#duo-sum').textContent, ollie: document.querySelector('#ollie-sum').textContent, duoOpen: document.querySelector('#duo').open, br: document.querySelector('#bolt-rex').checked, bo: document.querySelector('#bolt-ollie').checked }));
    console.log(JSON.stringify(s), '\n   ', JSON.stringify(sums), p.errs.join(';'));
    await p.close();
  }
  // growth modes: set via UI
  const p = await L.open(b, url, null);
  for (const v of ['gradual', 'instant', 'runaway']) {
    await p.evaluate(() => { document.querySelector('#powers').open = true; });
    await p.selectOption('#absorb', v).catch(async () => { await p.click('#absorb-' + v).catch(() => {}); });
    await p.waitForTimeout(500);
    console.log(v, await p.evaluate(() => document.querySelector('#powers-sum').textContent));
  }
  await b.close();
})();
