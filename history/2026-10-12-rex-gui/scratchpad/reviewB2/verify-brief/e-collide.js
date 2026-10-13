// Collide (Ollie charges, Rex bolted) at shared efforts, real ground vs Unbreakable footing
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const surface = D.surfaces.find((s) => s.id === 'concrete');
const base = { mode: 'comic', surface, airAbsorb: 1, keepForm: true, ownRecoil: true };
const mk = (kg, build, anchor, unb) => Object.assign({}, base, { F: kg * g, body: P.makeBody(build === 'rex' ? { build: 'rex', H: 3.048, m: 3007 } : { build: 'ollie', H: 3.06, m: 3007 }), anchor, unbreakable: unb });
for (const kg of [3000, 3690, 5000, 7860, 9000, 20000, 90718]) {
  for (const unb of [true, false]) {
    const cA = mk(kg, 'ollie', 'friction', unb), cB = mk(kg, 'rex', 'bolted', unb);
    const r = P.collide(cA, cB, { source: 'sprint', gb: 1e-6, bounce: false });
    const h = r.h || {};
    const tg = r.toGround;
    const src = tg ? P.impulseSource(surface, tg.J, tg.T) : null;
    const srcReal = h.inel ? P.impulseSource(surface, h.inel.pT, r.contact.soft.t) : null;
    console.log(kg, 'unbreakable=' + unb, 'v0', r.v0 && r.v0.toFixed(2), 'outcome', r.outcome, 'rock.rT', r.rock && (r.rock.comic ? 'comic' : r.rock.rT && r.rock.rT.toFixed(3)),
      'pT', h.inel && h.inel.pT.toExponential(3), 'toGround', tg ? tg.J.toExponential(3) + '/' + tg.T.toFixed(3) : 'undefined',
      'plaster@5m', src ? P.plasterOver(src, 5) : '-', 'samePushPlaster@5m', srcReal ? P.plasterOver(srcReal, 5) : '-');
  }
}
