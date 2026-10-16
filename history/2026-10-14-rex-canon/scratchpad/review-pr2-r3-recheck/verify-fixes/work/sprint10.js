const REPO = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r3-recheck/verify-fixes/repo/rex-strength-lab';
global.window = {}; const P = require(REPO + '/src/engine.js'); require(REPO + '/src/data.js');
const D = window.DINO_DATA, g = P.K.g, body = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex));
const ctx = { F: 90718.474 * g, mode: 'comic', body, surface: D.surfaces.find((s) => s.id === 'concrete'), anchor: 'bolted', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const sp = P.sprint(ctx), k = 0.5 * P.K.rho0 * body.Cd * body.frontArea;
let x = 0, v = 0, t = 0; const dt = 1e-6;
while (x < 10) { const a = v >= sp.vTop ? 0 : (sp.thrust - k * v * v) / body.m; v = Math.min(sp.vTop, v + a * dt); x += v * dt; t += dt; }
console.log('Sprint tab, bolted, default dial: thrust', (sp.thrust/1e3).toFixed(1), 'kN, vTop', sp.vTop.toFixed(1), 'm/s (' + sp.topLimit + '), t100', sp.t100.toFixed(3), 's; 10 m from rest with drag and its leg-speed cap:', t.toFixed(3), 's');
const car = D.objects.find((o) => o.id === 'car'), r = P.pull(ctx, car);
console.log('Pull car bolted all-out: t10m', r.t10m.toFixed(4), 's; body speed at 10 m', (r.walkPush.J / body.m).toFixed(1), 'm/s; legs', (r.walkPush.J/r.walkPush.T/1e3).toFixed(1), 'kN');
const a1 = sp.thrust / body.m; console.log('with a 1.0x leg cap: a', a1.toFixed(1), 't10m', Math.sqrt(20 / a1).toFixed(4), 's, v at 10 m', Math.sqrt(2 * a1 * 10).toFixed(1));
