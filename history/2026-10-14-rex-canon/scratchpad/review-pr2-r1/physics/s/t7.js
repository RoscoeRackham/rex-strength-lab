const { P, D, g, c, surf, obj, rex, ollie, ON, ctxOf, DEF, sig } = require('./hv.js');
for (const [F, dl] of [[DEF, 'def'], [1e9 * g, '1e9'], [1e20 * g, '1e20']]) for (const [sn, st] of Object.entries({ on: ON, own: { ownRecoil: true, keepForm: true }, unbr: { unbreakable: true, keepForm: true }, off: { keepForm: true } })) {
  if (process.env.VER === 'main' && sn !== 'on' && sn !== 'off' && sn !== 'unbr') continue;
  const cA = ctxOf(F, st), cB = Object.assign(ctxOf(F / 2, st), { body: ollie });
  const aw = P.armWrestle(cA, cB);
  if (aw.outcome !== 'pin') { console.log(dl, sn, aw.outcome); continue; }
  const pin = aw.pin, Aw = aw.AA, Pl = aw.PB;
  console.log(dl, sn, 'Aw', sig(Aw), 'Pl', sig(Pl), 't', sig(pin.t), 'v', sig(pin.v), 'M', sig(pin.M), 'E', sig(pin.E), 'pB=M v~', sig(pin.M * pin.v), 'Aw*t', sig(Aw * pin.t), '(Aw-Pl)t', sig((Aw - Pl) * pin.t), 'RA', aw.recoilAbsorbed ? sig(aw.recoilAbsorbed.J) : '-', 'TG', aw.toGround ? sig(aw.toGround.J) + ' T ' + sig(aw.toGround.T) : '-', 'limbPulse?');
}
