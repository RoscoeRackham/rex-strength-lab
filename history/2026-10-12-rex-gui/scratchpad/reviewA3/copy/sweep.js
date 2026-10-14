const L = require('./lib.js');
const SOLO = ['walk', 'lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight'], DUO = ['arm', 'wrestle', 'catch', 'collide'];
const STATES = [
  {}, { anchor: 'bolted', oAnchor: 'bolted' }, { anchor: 'bolted', surface: 'sand' }, { groundHolds: true, anchor: 'bolted' }, { mode: 'real', surface: 'ice' }, { oAnchor: 'bolted', surface: 'softclay' },
  { inf: true, anchor: 'bolted', oAnchor: 'bolted' }, { inf: true }, { logKg: 1.5 }, { m: 3e7 },
];
const RE = /Settings|comic switch|dug|claw|boot|sidebar|Rex alone|Ollie panel|Ollie’s panel|Ollie settings|braced|shear|kick|foothold|NaN|undefined/gi;
(async () => {
  const b = await L.chromium.launch({ executablePath: L.CHROME });
  const url = L.NEW();
  const seen = new Map();
  for (const s of STATES) {
    for (const t of SOLO) {
      const p = await L.open(b, url, Object.assign({}, s, { action: t }), { wait: 300 });
      await L.waitSettled(p, '#bay', 20000);
      await p.evaluate(() => { for (const d of document.querySelectorAll('#bay details')) d.open = true; });
      const txt = await p.evaluate(() => document.querySelector('#bay').innerText);
      for (const l of txt.split('\n')) { RE.lastIndex = 0; if (RE.test(l)) { const k = l.slice(0, 300); if (!seen.has(k)) { seen.set(k, JSON.stringify(s) + ' ' + t); } } }
      if (p.errs.length) console.log('ERR', JSON.stringify(s), t, p.errs);
      await p.close();
    }
    for (const t of DUO) {
      const p = await L.open(b, url, Object.assign({}, s, { duoOpen: true, duoAction: t }), { wait: 300 });
      await L.waitSettled(p, '#duo-bay', 30000);
      await p.evaluate(() => { for (const d of document.querySelectorAll('#duo-bay details')) d.open = true; });
      const txt = await p.evaluate(() => document.querySelector('#duo-bay').innerText);
      for (const l of txt.split('\n')) { RE.lastIndex = 0; if (RE.test(l)) { const k = l.slice(0, 300); if (!seen.has(k)) { seen.set(k, JSON.stringify(s) + ' ' + t); } } }
      if (p.errs.length) console.log('ERR', JSON.stringify(s), t, p.errs);
      await p.close();
    }
  }
  for (const [k, v] of seen) console.log('[' + v + '] ' + k);
  await b.close();
})();
