const { P, g, sig, F0, ctxOf, sf } = require('./common');
// the steady push with the pusher's own recoil taken: his push isn't capped by his own footing (prototype: DA = F)
function newStandoff(cA, cB) {
  const r = P.standoff(cA, cB);
  if (!cA.ownRecoil || r.blackHole || cB.immovable) return r;
  const out = Object.assign({}, r), DA = cA.F, HB = r.HB;
  out.DA = DA; out.pusherSlips = false; out.ownRecoil = true;
  if (!isFinite(DA) && !isFinite(HB)) { out.contact = Infinity; out.outcome = P.holdsGround(cB) ? 'paradox' : 'rockGives'; return out; }
  if (DA === HB) { out.outcome = 'stalemate'; out.contact = DA; }
  else if (DA > HB) { out.outcome = 'forceWins'; out.contact = HB; out.net = DA - HB; }
  else { out.outcome = 'objectHolds'; out.contact = DA; }
  return out;
}
const show = (r) => ({ outcome: r.outcome, DA: sig(r.DA), RA: sig(r.RA), HB: sig(r.HB), contact: sig(r.contact), slips: r.pusherSlips, rockrT: sig(r.rock && r.rock.rT), why: r.holdWhy });
for (const [label, F, ex, exB] of [['default dial, both standing', F0], ['default dial, Rex bolted', F0, {}, { anchor: 'bolted' }], ['default, Rex bolted real rock', F0, {}, { anchor: 'bolted', unbreakable: false }],
  ['1e9, both standing', 1e9 * g], ['unlimited, both standing', Infinity], ['unlimited, Rex bolted unbreakable', Infinity, {}, { anchor: 'bolted' }], ['unlimited, Rex bolted real rock', Infinity, {}, { anchor: 'bolted', unbreakable: false }],
  ['unlimited, Ollie bolted (pusher), Rex standing', Infinity, { anchor: 'bolted' }], ['powers off default', F0, { ownRecoil: false, unbreakable: false, keepForm: false, airAbsorb: 0 }, { ownRecoil: false, unbreakable: false, keepForm: false, airAbsorb: 0 }]]) {
  const cA = ctxOf('ollie', Object.assign({ F }, ex || {})), cB = ctxOf('rex', Object.assign({ F }, exB || {}));
  console.log(label, '\n  main ', JSON.stringify(show(P.standoff(cA, cB))), '\n  proto', JSON.stringify(show(newStandoff(cA, cB))));
}
