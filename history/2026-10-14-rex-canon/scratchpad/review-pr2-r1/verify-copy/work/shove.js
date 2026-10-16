const R = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r1/verify-copy/repo/rex-strength-lab';
const P = require(R + '/src/engine.js'); global.window = {}; require(R + '/src/data.js'); const D = window.DINO_DATA;
const rex = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex }), ollie = P.makeBody({ build: 'ollie', ...P.DEFAULT_BODIES.ollie });
const surface = D.surfaces.find(s => s.id === 'concrete');
const mk = (body, kg, o = {}) => Object.assign({ F: kg * P.K.g, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, use: kg * P.K.g }, o);
for (const kg of [8740, 2570, 25700]) {
  const r = P.shove(mk(rex, kg), mk(ollie, kg));
  const pO = r.vB * ollie.m;
  const fB = P.footingOf ? P.footingOf(mk(ollie, kg)) : null;
  console.log(kg, 'kgf: basis', r.basis, 'vB', r.vB.toFixed(3), 'Ollie p', pO.toFixed(0), 'recoilAbsorbed.J', r.recoilAbsorbed && r.recoilAbsorbed.J.toFixed(0), 'T', r.push.t.toFixed(3), 'Ollie feet during push', fB ? (fB.R * r.push.t).toFixed(0) : '?', 'fB.R', fB && fB.R.toFixed(0), 'diff', (r.recoilAbsorbed.J - pO).toFixed(0), 'share Ollie', (pO / r.recoilAbsorbed.J).toFixed(2), 'vA', r.vA);
}
