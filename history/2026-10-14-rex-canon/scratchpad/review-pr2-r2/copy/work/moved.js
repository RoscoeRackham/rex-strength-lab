const which = process.argv[2];
const dir = which === 'main' ? __dirname + '/mainsrc' : __dirname + '/../repo/rex-strength-lab/src';
const P = require(dir + '/engine.js'); global.window = {}; require(dir + '/data.js'); const D = window.DINO_DATA;
const g = P.K.g, kg = Number(process.argv[3] || 90718.474);
const body = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex));
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const out = {};
const objs = D.objects.filter((o) => !o.noThrow).map((o) => o.id);
const surfs = D.surfaces.map((s) => s.id);
const angles = (process.argv[4] || '0').split(',').map(Number);
for (const s of surfs) for (const id of objs) for (const a of angles) {
  const c = Object.assign({ F: kg * g, mode: 'comic', body, surface: D.surfaces.find((x) => x.id === s), anchor: 'friction' }, ON);
  let p; try { p = P.RESTRAINT.planNow('throw', c, { obj: D.objects.find((o) => o.id === id), angle: a, target: 30, near: 5 }); } catch (e) { out[s + '|' + id + '|' + a] = 'ERR ' + e.message; continue; }
  const ce = p.ceiling();
  const pr = {}; for (const x of p.presets()) pr[x.id] = x.never ? 'never' : +x.use.toPrecision(4);
  out[s + '|' + id + '|' + a] = { ceil: ce.by ? +ce.use.toPrecision(4) + ':' + ce.by : 'none', pr };
}
require('fs').writeFileSync(__dirname + '/moved-' + which + '-' + kg + '-' + angles.join('_') + '.json', JSON.stringify(out));
console.log(Object.keys(out).length);
