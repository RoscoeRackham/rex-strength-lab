// main's page vs the branch's page: same result text for many states and tabs (after the intended edits)
const { wrap, launch, readResult, settle, S } = require('./h.js');
const path = require('path'), fs = require('fs');
const MAIN = wrap(path.join(S, 'main.html'), 'main'), NEW = wrap(path.join(S, 'lab', 'dist', 'index.html'), 'new');
const SOLO = ['walk', 'lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight'];
const DUOT = [['arm', {}], ['wrestle', { wrestleMove: 'push' }], ['wrestle', { wrestleMove: 'shove' }], ['wrestle', { wrestleMove: 'lift' }], ['wrestle', { wrestleMove: 'throw' }], ['catch', {}], ['catch', { cObj: 'partner' }], ['collide', {}], ['collide', { colMode: 'push' }]];
const STATES = JSON.parse(process.argv[2] || '[{}]');
const which = process.argv[3] || 'all';
(async () => {
  const b = await launch();
  const pm = await b.newPage({ viewport: { width: 1280, height: 900 } }), pn = await b.newPage({ viewport: { width: 1280, height: 900 } });
  for (const p of [pm, pn]) p.on('pageerror', (e) => console.log('PAGEERROR', e.message));
  await pm.goto(MAIN); await pn.goto(NEW);
  const run = async (p, st, bay) => { await p.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st); await p.reload(); await p.waitForTimeout(700); const ok = await settle(p, bay); const r = await readResult(p, bay); r.settled = ok; return r; };
  let diffs = 0, n = 0;
  const out = [];
  for (const st of STATES) {
    const cases = [];
    if (which !== 'duo') for (const t of SOLO) cases.push({ id: t, m: Object.assign({}, st, { group: 'solo', action: t }), nw: Object.assign({}, st, { action: t }), bayM: 'bay', bayN: 'bay' });
    if (which !== 'solo') for (const [t, x] of DUOT) cases.push({ id: t + JSON.stringify(x), m: Object.assign({}, st, x, { group: 'duo', duoAction: t }), nw: Object.assign({}, st, x, { duoOpen: true, duoAction: t }), bayM: 'bay', bayN: 'duo-bay' });
    for (const c of cases) {
      const [a, z] = await Promise.all([run(pm, c.m, c.bayM), run(pn, c.nw, c.bayN)]);
      n++;
      const keys = Object.keys(a).filter((k) => JSON.stringify(a[k]) !== JSON.stringify(z[k]));
      if (keys.length) { diffs++; out.push({ st, id: c.id, keys, main: Object.fromEntries(keys.map((k) => [k, a[k]])), now: Object.fromEntries(keys.map((k) => [k, z[k]])) }); console.log('DIFF', JSON.stringify(st), c.id, keys.join(',')); }
      else console.log('same', JSON.stringify(st), c.id);
    }
  }
  fs.writeFileSync(path.join(S, 'equiv-' + (process.argv[4] || 'out') + '.json'), JSON.stringify(out, null, 1));
  console.log('cases', n, 'diffs', diffs);
  await b.close();
})();
