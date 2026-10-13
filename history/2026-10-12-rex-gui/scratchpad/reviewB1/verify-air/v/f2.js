const { P, obj, rex, ollie, ctx, K, D } = require('./env.js');
const c = K.c;
function run(kg, id, Dd) {
  const b = obj(id) || D.objects.find(o => o.id === id);
  const T = ctx(kg, rex()), C = ctx(kg, ollie());
  const L = P.catchLeg(T, C, b, Dd, 'hard');
  if (!L.catch) { console.log(id, kg, 'result', L.result, L.vArrive / c); return; }
  const k = L.catch, M = ollie().m, m = b.m, v = L.vArrive;
  const g = 1 / Math.sqrt(1 - (v / c) ** 2);
  const pIn = g * m * v;
  const Ein = g * m * c * c + M * c * c;           // total energy (Ollie at rest)
  // momentum-conserving final speed of everything together (ignoring footing impulse)
  const vFin = pIn * c * c / Ein;
  const pOutNewton = (M + m) * k.uAfter;
  console.log(`${id} kg=${kg.toExponential(2)} D=${Dd} result=${L.result} v/c=${(v/c).toFixed(12)} gamma=${g.toExponential(3)}`);
  console.log(`   uAfter=${(k.uAfter/c).toFixed(3)} c  slide=${k.slide.toFixed(0)} m  tStroke=${k.tStroke.toExponential(3)} s  F=${k.F.toExponential(3)} N  R=${k.R.toExponential(3)}  E1=${k.E1.toExponential(3)} J (share ${(k.firstShare*100).toFixed(3)}%)`);
  console.log(`   momentum-conserving vFin=${(vFin/c).toFixed(5)} c ; Newtonian (M+m)uAfter / pIn = ${(pOutNewton/pIn).toFixed(3)} ; F*tStroke/pIn = ${(k.F*k.tStroke/pIn).toFixed(3)}`);
  // exact first contact invariant mass
  const mh = k.mh; const Minv = Math.sqrt(m*m + mh*mh + 2*g*m*mh);
  const heat1 = (Minv - m - mh) * c * c, E0 = (g - 1) * m * c * c;
  console.log(`   exact first-contact invariant mass ${Minv.toFixed(1)} kg, heat ${heat1.toExponential(3)} J (${(heat1/E0*100).toFixed(2)}% of E0) vs code E1 ${k.E1.toExponential(3)}`);
}
run(1.81436948e23, 'baseball', 100);
run(1e20, 'car', 100);
run(1e20, 'bus', 100);
