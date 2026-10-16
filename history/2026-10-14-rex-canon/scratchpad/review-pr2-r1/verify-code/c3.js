global.window = {};
const dir = process.argv[2];
const P = require(dir + '/src/engine.js'); require(dir + '/src/data.js'); const D = window.DINO_DATA, g = P.K.g;
const rex = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex });
const obj = id => D.objects.find(x => x.id === id);
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const R = P.RESTRAINT, M = R.MOVES.throw, H = R.HAZARDS.find(h => h.id === 'plaster');
const credit = (surfId, objId, angle, lg) => {
  const surface = D.surfaces.find(s => s.id === surfId);
  const c = Object.assign({ F: Math.pow(10, lg) * g, mode: 'comic', body: rex, surface, anchor: 'friction' }, ON);
  const p = R.planNow('throw', c, { obj: obj(objId), angle });
  const never = p.result('hazard:plaster').never;
  if (!never) return { never };
  const c0 = Object.assign({}, c, { ownRecoil: false }); delete c0.use;
  const o0 = Object.assign({}, p.opt, { ownRecoil: false });
  const r0 = M.run(c0, o0);
  return { never, offTest: H.test(M, r0, o0), from: M.shakeFrom(r0, o0) };
};
console.log('semi concrete 30 1e6', JSON.stringify(credit('concrete', 'semi', 30, 6)));
console.log('semi asphalt 30 1e6', JSON.stringify(credit('asphalt', 'semi', 30, 6)));
const hits = []; let n = 0;
const surfs = D.surfaces.map(s => s.id);
for (const s of surfs) for (const o of ['semi', 'bus', 'locomotive', 'pickup', 'car']) for (const a of [0, 15, 30, 45]) for (const lg of [5, 6, 7, 8]) {
  if (!obj(o)) continue; n++;
  try { const x = credit(s, o, a, lg); if (x.never && x.offTest && x.from === 'him') hits.push([s, o, a, lg]); } catch (e) { }
}
console.log('surfaces', surfs.join(','), 'plans', n, 'hits', JSON.stringify(hits));
