// Sweep every action across strengths, sizes, surfaces, modes and anchors; flag NaN/undefined/negative outputs.
global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
const bad = [];
const scan = (label, obj, path = '') => {
  if (obj == null) return;
  if (typeof obj === 'number') { if (Number.isNaN(obj)) bad.push(label + ' ' + path + ' = NaN'); else if (obj < 0 && !/quake/i.test(path)) bad.push(label + ' ' + path + ' = ' + obj); return; }
  if (Array.isArray(obj)) return;
  if (typeof obj === 'object') for (const [k, v] of Object.entries(obj)) if (k !== 'path' && k !== 'gLoad') scan(label, v, path + '.' + k);
};
let n = 0; const SW = process.argv[2] === 'on';
const t0 = Date.now();
for (const lg of [2.708, 12, 30, Infinity]) {
  for (const mode of ['comic', 'real']) for (const H of [2]) for (const surface of D.surfaces) for (const anchor of ['friction', 'braced', 'bolted']) for (const groundHolds of [false, true]) {
    const body = P.makeBody({ H });
    const ctx = { F: isFinite(lg) ? Math.pow(10, lg) * g : Infinity, mode, body, surface, groundHolds, anchor, gentleHold: SW, coolFlight: SW, softLanding: SW, silentStrike: SW, safePassenger: SW };
    const L = `lg=${lg} ${mode} H=${H} ${surface.id} ${anchor} holds=${groundHolds}`;
    for (const o of D.objects) {
      scan(L + ' lift ' + o.id, P.lift(ctx, o));
      if (!o.noPull) scan(L + ' pull ' + o.id, P.pull(ctx, o));
      if (!o.noThrow && H === 2 && anchor !== 'braced') for (const a of [0, 45, 90]) scan(L + ' throw ' + o.id + ' ' + a, P.throwObject(ctx, o, a));
    }
    scan(L + ' jump', P.jump(ctx)); scan(L + ' stomp', P.stomp(ctx)); scan(L + ' punch', P.punch(ctx)); scan(L + ' clap', P.clap(ctx)); scan(L + ' sprint', P.sprint(ctx));
    n++;
  }
}
// The page's default 10 ft Rex and Ollie (their own builds and canon mass), not just the calibration body.
for (const build of ['rex', 'ollie']) {
  const body = P.makeBody(Object.assign({ build }, P.DEFAULT_BODIES[build]));
  for (const lg of [3.5, 9, 24, Infinity]) for (const mode of ['comic', 'real']) for (const surface of D.surfaces) for (const anchor of ['friction', 'braced', 'bolted']) for (const groundHolds of [false, true]) {
    const ctx = { F: isFinite(lg) ? Math.pow(10, lg) * g : Infinity, mode, body, surface, groundHolds, anchor, gentleHold: SW, coolFlight: SW, softLanding: SW, silentStrike: SW, safePassenger: SW };
    const L = `${build} lg=${lg} ${mode} ${surface.id} ${anchor} holds=${groundHolds}`;
    for (const o of D.objects) {
      scan(L + ' lift ' + o.id, P.lift(ctx, o));
      if (!o.noPull) scan(L + ' pull ' + o.id, P.pull(ctx, o));
      if (!o.noThrow && anchor !== 'braced' && surface.id === 'concrete') for (const a of [0, 45, 90]) scan(L + ' throw ' + o.id + ' ' + a, P.throwObject(ctx, o, a));
    }
    scan(L + ' jump', P.jump(ctx)); scan(L + ' stomp', P.stomp(ctx)); scan(L + ' punch', P.punch(ctx)); scan(L + ' clap', P.clap(ctx)); scan(L + ' sprint', P.sprint(ctx));
    n++;
  }
}
console.log('contexts', n, 'ms', Date.now() - t0, 'problems', bad.length);
console.log(bad.slice(0, 40).join('\n'));
process.exit(bad.length ? 1 : 0);
