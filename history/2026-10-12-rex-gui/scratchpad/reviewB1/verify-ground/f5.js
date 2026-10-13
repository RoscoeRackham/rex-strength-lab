const { P, D, g, ON, OFF, ctx } = require('./h.js');
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const sf = D.surfaces.find(s => s.id === 'concrete');
for (const [E, form] of [[4.2e23, 1], [1e18, 1], [1e20, 0.5]]) {
  const Iu = P.instantGrowth(body, E, form, { surface: sf, unbreakable: true });
  const Ir = P.instantGrowth(body, E, form, { surface: sf, unbreakable: false });
  const J = Iu.grown.m * Iu.vSole;
  const src = P.impulseSource(sf, J, Iu.tau);
  console.log('E', E, 'form', form, '| unb: gives', Iu.gives, 'rise', Iu.rise.toPrecision(3), 'Pocean', Iu.Pocean.toPrecision(3), 'Eground', Iu.Eground, 'quake', Iu.quake, 'toGround?', 'toGround' in Iu,
    '| m', Iu.grown.m.toPrecision(3), 'vSole', Iu.vSole.toPrecision(3), 'tau', Iu.tau.toPrecision(3), 'J', J.toPrecision(3), 'plaster reach', P.plasterReach(src).toPrecision(3), 'feel reach', P.ppvReach(src, P.VIB.TH.feel).toPrecision(3),
    '| real: Eground', Ir.Eground.toPrecision(3), 'quake', Ir.quake && Ir.quake.toFixed(2));
}
