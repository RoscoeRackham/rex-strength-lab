const {P,D,g,ctx,obj}=require('./h.js');
const out = {};
for (const H of [0.4, 2, 50]) for (const surface of ['concrete','sand']) for (let lg = 1; lg <= 12; lg += 0.25) {
  const c = ctx({logKg: lg, H, surface});
  const list = { jump: P.jump(c), stomp: P.stomp(c), punch: P.punch(c), clap: P.clap(c), car45: P.throwObject(c, obj('car'), 45), shot37: P.throwObject(c, obj('shot'), 37), ball0: P.throwObject(c, obj('baseball'), 0), tank30: P.throwObject(c, obj('tank'), 30) };
  for (const [k, r] of Object.entries(list)) if (r.basis === 'real') { const key = H + ' ' + surface + ' ' + k; (out[key] = out[key] || []).push(lg); }
}
for (const [k, v] of Object.entries(out)) console.log(k, 'real basis at lg', v[0], '..', v[v.length - 1], '(' + v.length + ' pts)');
