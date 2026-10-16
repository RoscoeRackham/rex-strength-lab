const { P, D, g, c, surf, obj, rex, ollie, ON, ctxOf, DEF, sig } = require('./hv.js');
const pOfE = (E, m) => (E > 0 ? (isFinite(E) ? Math.sqrt(E * E + 2 * E * m * c * c) / c : Infinity) : 0);
const STATES = { on: ON, off: {}, unbrOnly: { unbreakable: true }, ownOnly: { ownRecoil: true }, onBolted: Object.assign({ anchor: 'bolted' }, ON), offBolted: { anchor: 'bolted' } };
const M = P.RESTRAINT.MOVES;
for (const [F, dl] of [[DEF, 'def'], [1e9 * g, '1e9'], [1e20 * g, '1e20']]) for (const [sn, st] of Object.entries(STATES)) {
  if (process.env.VER === 'main' && !['on', 'off', 'onBolted', 'offBolted'].includes(sn)) continue;
  const cx = ctxOf(F, st), cO = Object.assign({}, cx, { body: ollie, anchor: 'friction' });
  const s = P.stomp(cx), pu = P.punch(cx), pl = P.pull(cx, obj('car')), sh = P.shove(cx, cO);
  const o = Object.assign({ surface: cx.surface, body: rex, near: 5 }, st);
  const blow = M.stomp.blow ? M.stomp.blow(s, o) : null;
  console.log(dl, sn, 'STOMP pB', sig(s.push.pB), 'pA', sig(s.push.pA), 'vBody', sig(s.vBody), 'RA', s.recoilAbsorbed ? sig(s.recoilAbsorbed.J) : '-', 'blow', blow ? sig(blow.J) + '/' + sig(blow.whole) : '-',
    '| PUNCH pB', sig(pu.push.pB), 'pA', sig(pu.push.pA), 'RA', pu.recoilAbsorbed ? sig(pu.recoilAbsorbed.J) : '-',
    '| PULL car vEnd', sig(pl.vEnd), 't10', sig(pl.t10m), 'ropeT', sig(pl.ropeT), 'RA', pl.recoilAbsorbed ? sig(pl.recoilAbsorbed.J) : '-', 'indep', sig(pl.vEnd > 0 ? P.vToMomentum(pl.vEnd, obj('car').m) + pl.resist * pl.t10m : 0),
    '| SHOVE vB', sig(sh.vB), 'slideB', sig(sh.slideB), 'RA', sh.recoilAbsorbed ? sig(sh.recoilAbsorbed.J) : '-', 'TG', sh.toGround ? sig(sh.toGround.J) : '-', 'TGB', sh.toGroundB ? sig(sh.toGroundB.J) : '-', 'pBpartner', sig(pOfE(sh.EB, ollie.m)));
}
