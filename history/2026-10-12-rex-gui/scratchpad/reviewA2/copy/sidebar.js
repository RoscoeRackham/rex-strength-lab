// Read the sidebar text and summaries in many states.
const H = require('./harness');
(async () => {
  const b = await H.launch();
  const states = [
    ['default', null],
    ['real+bothBolted', { mode: 'real', anchor: 'bolted', oAnchor: 'bolted' }],
    ['rexBolted', { anchor: 'bolted' }],
    ['ollieBolted', { oAnchor: 'bolted' }],
    ['comicground+gentle', { groundHolds: true, gentleHold: true }],
    ['all switches', { groundHolds: true, gentleHold: true, safePassenger: true, silentStrike: true, softLanding: true, coolFlight: true, anchor: 'bolted' }],
    ['braced', { anchor: 'braced', oAnchor: 'braced' }],
    ['calib', { build: 'human', H: 2, m: 180 }],
    ['dense', { m: 30000 }],
    ['ollie what-if', { oSame: false, oLogKg: 7, oH: 5, oM: 20000, duoAction: 'collide' }],
    ['group duo', { group: 'duo', duoAction: 'catch' }],
  ];
  for (const [name, s] of states) {
    const p = await H.open(b, H.NEW, s);
    const r = await p.evaluate(() => ({
      setup: document.querySelector('#setup > summary').textContent.trim(),
      powers: document.querySelector('#powers > summary').textContent.trim(),
      duo: document.querySelector('#duo > summary').textContent.trim(),
      ollie: document.querySelector('#ollie-setup > summary').textContent.trim(),
      ground: document.querySelector('#ground-sec').textContent.trim().replace(/\s+/g, ' ').slice(0, 200),
      boltR: document.querySelector('#bolt-rex').checked, boltO: document.querySelector('#bolt-ollie').checked,
      duoOpen: document.querySelector('#duo').open,
    }));
    console.log('==', name, JSON.stringify(r), p.errs.length ? 'ERRS ' + p.errs.join(' | ') : '');
    if (name === 'default') {
      const t = await p.evaluate(() => document.querySelector('#powers').innerText);
      console.log('--- POWERS PANEL TEXT ---\n' + t + '\n---');
      const o = await p.evaluate(() => document.querySelector('#ollie-setup').innerText);
      console.log('--- OLLIE PANEL TEXT ---\n' + o + '\n---');
      const sd = await p.evaluate(() => document.querySelector('#setup').innerText);
      console.log('--- SETUP TEXT ---\n' + sd + '\n---');
      const hero = await p.evaluate(() => { const h = document.querySelector('header') || document.querySelector('.wrap'); return h.innerText.slice(0, 2000); });
      console.log('--- TOP ---\n' + hero + '\n---');
    }
    await p.context().close();
  }
  await b.close();
})();
