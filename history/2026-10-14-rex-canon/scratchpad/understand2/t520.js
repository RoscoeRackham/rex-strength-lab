global.window = {};
const P = require('./engine-pr2.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const surf = (id) => D.surfaces.find((x) => x.id === id), obj = (id) => D.objects.find((x) => x.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const ctxOf = (F, extra) => Object.assign({ F, mode: 'comic', body: rex, surface: surf('concrete'), anchor: 'friction' }, extra || {});
const noNaN = (x) => x && Object.values(x).every((v) => typeof v !== 'number' || !Number.isNaN(v));
for (const ex of [{}, { ownRecoil: false }, { ownRecoil: false, anchor: 'bolted' }]) { const cc = ctxOf(Infinity, Object.assign({}, ON, ex)), t = P.throwPartner(cc, Object.assign({}, cc, { body: ollie, anchor: 'friction' }), 45), tg = P.throwObject(cc, obj('car'), 45).toGround;
  console.log(JSON.stringify(ex), 'throw tg', JSON.stringify(tg), 'partner toGround', JSON.stringify(t.r && t.r.toGround), 'recoilAbsorbed', JSON.stringify(t.r && t.r.recoilAbsorbed),
    'check', !!(tg && tg.J === Infinity && tg.supplied === Infinity && tg.suppliedDown === Infinity && tg.suppliedSide === 0 && noNaN(tg) && noNaN(t.r.toGround))); }
