// README 'What moved', first bullet: all-out plaster reach for level throws on sand, main vs branch (powers on)
global.window = global;
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
for (const [lab, eng] of [['main', __dirname + '/engine-main.js'], ['branch', '/home/user/rex-strength-lab/rex-strength-lab/src/engine.js']]) {
  delete require.cache[require.resolve(eng)];
  const P = require(eng), g = P.K.g;
  const body = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex));
  const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
  for (const sid of ['sand', 'concrete']) for (const oid of ['car', 'pickup']) for (const lg of [7, 8, 9]) for (const th of [0, 45]) {
    const surface = D.surfaces.find((x) => x.id === sid), obj = D.objects.find((x) => x.id === oid);
    const c = Object.assign({ F: Math.pow(10, lg) * g, mode: 'comic', body, surface, anchor: 'friction' }, ON);
    const r = P.throwObject(c, obj, th);
    const o = Object.assign({ obj, angle: th, surface, body, anchor: 'friction', near: 5 }, ON);
    const re = P.RESTRAINT.reach('throw', r, o);
    const p = P.RESTRAINT.planNow('throw', c, { obj, angle: th, target: 30, near: 5 });
    const pr = (k) => { const x = k === 'ceiling' ? p.ceiling() : p.result(k); return x.by === null || x.never ? 'never' : (x.use / g).toPrecision(4); };
    console.log(lab, sid, oid, '1e' + lg, th, 'plaster reach', re.plaster.toPrecision(4), 'ceiling', pr('ceiling'), 'rattle', pr('preset:rattle'), 'plaster', pr('preset:plaster'), 'ground', pr('preset:ground'));
  }
}
