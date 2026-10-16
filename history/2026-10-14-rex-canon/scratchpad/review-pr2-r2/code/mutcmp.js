// compare the pristine engine with one mutant on given cases
const fs = require('fs'), path = require('path');
global.window = {};
const src = fs.readFileSync(path.join(__dirname, 'repo/rex-strength-lab/src/engine.js'), 'utf8');
const all = require('./mutants.js').concat(require('./mutants2.js'));
const load = (s, tag) => { const f = path.join(__dirname, 'tmp-eng-' + tag + '.js'); fs.writeFileSync(f, s); delete require.cache[f]; return require(f); };
const P0 = load(src, 'base');
require('./repo/rex-strength-lab/src/data.js'); const D = window.DINO_DATA, g = P0.K.g;
const mk = (P, b) => P.makeBody(Object.assign({ build: b }, P.DEFAULT_BODIES[b]));
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((x) => x.id === id);
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const id = process.argv[2], m = all.find((x) => x.id === id); let s = src; for (const [f, r] of m.edits) s = s.replace(f, () => r);
const P1 = load(s, id);
const run = (P) => { const rex = mk(P, 'rex'), ol = mk(P, 'ollie'), c = (kg, x) => Object.assign({ F: kg * g, mode: 'comic', body: rex, surface: surf('concrete'), anchor: 'friction' }, ON, x || {}), co = (kg, x) => Object.assign(c(kg, x), { body: ol });
  const out = {};
  const L = P.catchLeg(c(1e6), co(1e6), obj('car'), 30, 'hard'); out.catchCar1e6 = { result: L.result, sinkRatio: L.catch.sinkRatio, sinkRatioRaw: L.catch.sinkRatioRaw };
  const Lb = P.catchLeg(c(1e9), co(1e9), obj('bus'), 30, 'hard'); out.catchBus1e9 = { result: Lb.result, sinkRatioRaw: Lb.catch && Lb.catch.sinkRatioRaw };
  const Lf = P.catchLeg(c(1e20), co(1e20), obj('baseball'), 10, 'hard'); out.catchFast1e20 = { result: Lf.result, rel: Lf.catch && Lf.catch.relativistic, angle: Lf.angleDeg, sinkRatioRaw: Lf.catch && Lf.catch.sinkRatioRaw };
  for (const lg of [6, 9]) { const t = P.tossPartner(c(Math.pow(10, lg)), ol, 'Ollie', 'hard', 10, 'friction'); out['toss1e' + lg] = { result: t.result, catchRaw: t.catch && t.catch.sinkRatioRaw, throwRaw: undefined }; }
  for (const lg of [6, 9]) { const tp = P.throwPartner(c(Math.pow(10, lg), { unbreakable: false }), co(Math.pow(10, lg), { unbreakable: false }), 45); out['wthrowReal1e' + lg] = { sinkRatio: tp.r.sinkRatio, groundHaz: P.RESTRAINT.MOVES.throw.ground(tp.r, { surface: surf('concrete') }) };
    const tu = P.throwPartner(c(Math.pow(10, lg)), co(Math.pow(10, lg)), 45); out['wthrowON1e' + lg] = { sinkRatioRaw: tu.r.sinkRatioRaw }; }
  const tt = P.throwObject(c(1e9), Object.assign({}, obj('car')), 90); out.throwCar90 = { sinkRatioRaw: tt.sinkRatioRaw };
  return out; };
const a = run(P0), b = run(P1);
for (const k of Object.keys(a)) console.log(k.padEnd(16), JSON.stringify(a[k]), JSON.stringify(a[k]) === JSON.stringify(b[k]) ? '(same)' : '  MUTANT: ' + JSON.stringify(b[k]));
