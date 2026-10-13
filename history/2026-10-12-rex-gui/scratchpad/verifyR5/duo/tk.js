// the charger's take-off (chargeTakeoff's rule) versus effort: Ollie jumps / stomp-launches onto standing Rex, powers on
const { P, g, ctxOf, oCtx, sig, surf, rex, ollie } = require('./h.js');
const src = process.argv[2] || 'jump', sf = process.argv[3] || 'concrete';
let prevP = 0, prevR = 0;
for (let lg = 3.5; lg <= 12; lg += 0.25) {
  const cR = ctxOf(Math.pow(10, lg), { surface: surf(sf) }), cO = oCtx(cR);
  const r = P.collide(cO, cR, { source: src, gb: 1, bounce: false });
  if (!r || r.noCharge) { console.log('10^' + lg.toFixed(2), 'noCharge', r && r.noCharge); continue; }
  let tk = null;
  if (r.speed.jump && r.speed.jump.pushOff && r.speed.jump.pushOff.J > 0) tk = r.speed.jump.pushOff;
  else if (r.speed.stomp) tk = P.RESTRAINT.MOVES.stomp.blow(r.speed.stomp, { body: ollie, surface: cO.surface, unbreakable: true });
  if (!tk) { console.log('10^' + lg.toFixed(2), 'no take-off'); continue; }
  const s = P.impulseSource(cO.surface, tk.J, Math.max(1e-9, tk.T)), ppv = P.ppvAt(s, 5), pr = P.plasterReach(s);
  const hit = r.toGround ? P.impulseSource(cR.surface, r.toGround.J, Math.max(1e-9, r.toGround.T)) : null;
  console.log('10^' + lg.toFixed(2), 'v0', sig(r.v0), 'tk J', sig(tk.J), 'T', sig(tk.T), 'whole', sig(tk.whole), 'ppv5', sig(ppv * 1000), 'plaster', sig(pr), '| hit plaster', hit ? sig(P.plasterReach(hit)) : '-', (ppv < prevP * (1 - 1e-9) ? ' ppv DOWN' : '') + (pr < prevR * (1 - 1e-9) ? ' plaster DOWN' : ''));
  prevP = ppv; prevR = pr;
}
