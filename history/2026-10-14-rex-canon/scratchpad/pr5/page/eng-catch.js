global.window = {};
const M = '/home/user/rex-strength-lab/rex-strength-lab';
const P = require(M + '/src/engine.js'); require(M + '/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const mk = (o) => Object.assign({ F: 100 * 907.18474 * g, mode: 'comic', body: P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), surface: D.surfaces.find((x) => x.id === 'concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true }, o || {});
const O = () => P.makeBody(Object.assign({ build: 'ollie' }, P.DEFAULT_BODIES.ollie)), obj = (id) => D.objects.find((x) => x.id === id);
try { const A = mk(), B = mk({ body: O() }), a = P.catchLeg(A, B, obj("car"), 10, "easy"); const t = P.RESTRAINT.takenBack("catch", { a, b: a }, { A, B, whoA: "rex", obj: obj("car") }); console.log(t.by.rex.E, t.by.ollie.E); } catch (e) { console.log('ERR', e.message); }
