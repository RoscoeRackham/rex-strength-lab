const R = process.argv[2] || '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r3/code/repo/rex-strength-lab';
global.window = {}; const P = require(R + '/src/engine.js'); require(R + '/src/data.js'); const D = window.DINO_DATA, g = P.K.g;
const body = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex));
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const ctx = (F, x) => Object.assign({ F, mode: 'comic', body, surface: surf('concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true }, x || {});
const M = P.RESTRAINT.MOVES.pull;
for (const [lab, F, x] of [['default friction', 100 * 907.18474 * g, {}], ['default bolted', 100 * 907.18474 * g, { anchor: 'bolted' }], ['inf bolted', Infinity, { anchor: 'bolted' }], ['inf friction', Infinity, {}], ['1e34 bolted', 1e34 * g, { anchor: 'bolted' }], ['1e20 bolted', 1e20 * g, { anchor: 'bolted' }], ['1e20 bolted real', 1e20 * g, { anchor: 'bolted', mode: 'real' }]]) {
  const c = ctx(F, x), o = obj('car'), r = P.pull(c, o);
  const opts = { obj: o, surface: c.surface, body, near: 5, ownRecoil: true, unbreakable: true, anchor: c.anchor };
  const s = M.shake(r, opts);
  let reach = null; try { reach = P.RESTRAINT.reach('pull', r, opts); } catch (e) { reach = 'ERR ' + e.message; }
  console.log(lab, JSON.stringify({ t: r.t10m, vEnd: r.vEnd, accel: r.accel, rope: r.ropeT, J: r.recoilAbsorbed && r.recoilAbsorbed.J, walk: r.walkPush, ppv5: s ? P.ppvAt(s, 5) : null, plasterReach: s ? P.plasterReach(s) : null, reach }));
}
