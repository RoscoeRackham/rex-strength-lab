global.window = {};
const A = require('/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/pr4/base/engine.js');
delete require.cache[require.resolve('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js')];
const B = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = 9.80665, surf = (id) => D.surfaces.find((x) => x.id === id), obj = (id) => D.objects.find((x) => x.id === id);
let n = 0, diff = 0, bounceDiff = 0; const firsts = [];
for (const st of [{ airAbsorb: 1, keepForm: true, unbreakable: true }, { unbreakable: true }, { keepForm: true }, { airAbsorb: 0.5, keepForm: false, unbreakable: true }])
for (const lg of [3.5, 5, 9, 14]) for (const sid of ['concrete', 'sand']) for (const aR of ['friction', 'bolted']) for (const aO of ['friction', 'bolted']) for (const nk of [undefined, false]) {
  const mk = (P, b, an, x) => Object.assign({ F: Math.pow(10, lg) * g, mode: 'comic', body: P.makeBody({ build: b, ...P.DEFAULT_BODIES[b] }), surface: surf(sid), anchor: an }, st, nk === undefined ? {} : { noKnockback: nk }, x || {});
  const calls = [['arm', (P) => P.armWrestle(mk(P, 'rex', aR), mk(P, 'ollie', aO))], ['push', (P) => P.pushMatch(mk(P, 'rex', aR), mk(P, 'ollie', aO))], ['shove', (P) => P.shove(mk(P, 'rex', aR), mk(P, 'ollie', aO))], ['both', (P) => P.shoveBoth(mk(P, 'rex', aR), mk(P, 'ollie', aO))],
    ['lift', (P) => P.liftPartner(mk(P, 'rex', aR), mk(P, 'ollie', aO))], ['throwP', (P) => P.throwPartner(mk(P, 'rex', aR), mk(P, 'ollie', aO), 30)], ['standoff', (P) => P.standoff(mk(P, 'ollie', aO), mk(P, 'rex', aR))]];
  for (const src of ['sprint', 'jump', 'stomp']) for (const bounce of [false, true]) calls.push(['collide ' + src + (bounce ? ' bounce' : ''), (P) => P.collide(mk(P, 'ollie', aO), mk(P, 'rex', aR), { source: src, bounce })]);
  for (const gb of [0.001, 0.5, Infinity]) for (const bounce of [false, true]) calls.push(['set ' + gb + (bounce ? ' bounce' : ''), (P) => P.collide(mk(P, 'ollie', aO), mk(P, 'rex', aR), { source: 'set', gb, bounce })]);
  if (aO === 'friction' && lg >= 9) calls.push(['catch', (P) => { const L = P.catchLeg(mk(P, 'rex', aR), mk(P, 'ollie', aO), obj('baseball'), 10, 'hard'); if (L && L.flight) L.flight.path = 0; return L; }]);
  for (const [nm, f] of calls) {
    n++; const a = JSON.stringify(f(A)), b = JSON.stringify(f(B));
    if (a !== b) {
      const ra = f(A), rb = f(B);
      // the bounce fix: a knocked-back bounce no longer books the footing's share
      const fixOnly = /bounce/.test(nm) && ra.outcome === 'moved' && ra.toGround && !rb.toGround && JSON.stringify(Object.assign({}, ra, { toGround: undefined })) === JSON.stringify(Object.assign({}, rb, { toGround: undefined }));
      if (fixOnly) bounceDiff++; else { diff++; if (firsts.length < 5) firsts.push([JSON.stringify(st), lg, sid, aR, aO, nm].join(' ')); }
    }
  }
}
console.log('compared', n, 'two-player results with They take their own recoil off; differ:', diff, '; the bounce fix only:', bounceDiff, firsts);
