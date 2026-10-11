const { P, D, g, surf, obj, V, C } = require('./h.js');
const o = obj(process.argv[2]); const lg = Number(process.argv[3]);
const cR = C({ kg: Math.pow(10, lg) });
const noFl = Object.assign({}, cR, { noFlight: true });
const ths = [0, 7.5, 15, 22.5, 30, 37.5, 45, 52.5, 60, 67.5, 75, 82.5, 90];
const tab = ths.map((th) => P.throwObject(noFl, o, th).v);
const vOf = (th) => { const x = Math.min(90, Math.max(0, th)) / 7.5, i = Math.min(11, Math.floor(x)), t = x - i; return tab[i] * (1 - t) + tab[i + 1] * t; };
for (const th of [60, 67.5, 70, 75, 78, 80, 82.5, 84, 86, 88, 89, 89.5, 90]) {
  const r = P.throwObject(noFl, o, th);
  console.log(th, 'direct', r.v.toPrecision(4), 'interp', vOf(th).toPrecision(4), 'ratio', (vOf(th) / r.v).toFixed(2), r.basis || '', r.slips ? 'slips' : '');
}
