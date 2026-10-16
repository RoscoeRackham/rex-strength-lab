// branch: does any friction pull (power on) have a courtesy ceiling? every pull object, surface and dial 1e3.5..1e15
global.window = {}; const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js'); require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g, body = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex));
const objs = D.objects.filter((o) => !o.noPull), hits = [];
let n = 0;
for (const anchor of process.argv[2] ? [process.argv[2]] : ['friction']) for (const s of D.surfaces) for (let lg = 3.5; lg <= 15; lg += 0.5) for (const o of objs) {
  const c = { F: Math.pow(10, lg) * g, mode: 'comic', body, surface: s, anchor, airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
  const p = P.RESTRAINT.planNow('pull', c, { near: 5, target: 10, obj: o, silentStrike: false, softLanding: false, safePassenger: true });
  const ce = p.ceiling(); n++;
  if (ce.by) hits.push(anchor + ' ' + s.id + ' 1e' + lg + ' ' + o.id + ' ' + ce.by + ' ' + Math.round(ce.below / g));
}
console.log(n + ' plans; with a ceiling: ' + hits.length); console.log(hits.slice(0, 40).join('\n'));
console.log('pull objects: ' + objs.map((o) => o.id).join(','));
