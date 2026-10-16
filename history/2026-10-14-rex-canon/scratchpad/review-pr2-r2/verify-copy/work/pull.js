const which = process.argv[2] || 'repo';
const ROOT = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r2/verify-copy/' + (which === 'main' ? 'main/repo' : 'repo') + '/rex-strength-lab/src/';
const P = require(ROOT + 'engine.js'); global.window = {}; require(ROOT + 'data.js'); const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex });
const surface = D.surfaces.find(s => s.id === 'concrete');
const car = D.objects.find(o => o.id === 'car');
for (const kg of [90718.474, 1e6]) for (const anchor of ['bolted', 'friction']) {
  const ctx = { F: kg * P.K.g, mode: 'comic', body, surface, anchor, airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
  const r = P.pull(ctx, car);
  const aBody = r.ownRecoil && anchor !== 'bolted' ? Math.min(r.accel, r.anchor.R / body.m) : r.accel;
  const Jbody = body.m * r.vEnd;
  const Fbody = body.m * r.accel;
  const ppv = P.ppvAt ? P.ppvAt(P.impulseSource(surface, Jbody, r.t10m), 5) : null;
  const ropeJ = r.recoilAbsorbed && r.recoilAbsorbed.J;
  const ppvRope = P.ppvAt ? P.ppvAt(P.impulseSource(surface, (car.m * r.vEnd + r.resist * r.t10m), r.t10m), 5) : null;
  console.log(kg, anchor, 't10m', r.t10m.toFixed(4), 'accel', r.accel.toFixed(1), 'vEnd', r.vEnd.toFixed(2), 'body J', Jbody.toFixed(0), 'body F (N)', Fbody.toFixed(0), 'anc.R', r.anchor.R, 'ppv body mm/s', ppv && (ppv*1000).toFixed(3), 'rope J', ropeJ && ropeJ.toFixed(0), 'ppv rope mm/s', ppvRope && (ppvRope*1000).toFixed(3));
}
