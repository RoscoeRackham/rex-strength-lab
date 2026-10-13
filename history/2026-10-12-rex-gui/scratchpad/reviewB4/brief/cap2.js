const {P,D,rex,surf,obj,ctx}=require('./h.js');
const g=P.K.g;
for (const [sid, oid, ang, lg] of [['concrete','car',90,8],['concrete','bus',90,9],['sand','car',90,6],['granite','car',90,8]]) {
  const c = ctx(Math.pow(10,lg), { surface: surf(sid) });
  const r = P.throwObject(c, obj(oid), ang);
  const tg = r.toGround, J = tg.J + (tg.supplied||0);
  // bearing: the ground's total bearing RB = Nfeet / sinkRatioRaw; Nfeet ~ push force + weight
  const Fpush = J / r.push.t, Nfeet = Fpush + rex.m*g, RB = Nfeet / r.sinkRatioRaw, bear = RB - rex.m*g;
  const Jspread = Math.min(J, bear * tg.T);
  const s1 = P.impulseSource(c.surface, tg.J, tg.T), s2 = P.impulseSource(c.surface, Jspread, tg.T);
  console.log(sid, oid, ang, '1e'+lg, 'RB', RB.toExponential(3), 'engine J', tg.J.toExponential(3), 'bearing x T', Jspread.toExponential(3), 'ratio', (Jspread/tg.J).toFixed(1), '| ppv5 engine', (P.ppvAt(s1,5)*1000).toPrecision(3),'mm/s plaster', P.plasterReach(s1).toPrecision(3), '| consistent', (P.ppvAt(s2,5)*1000).toPrecision(3), 'mm/s plaster', P.plasterReach(s2).toPrecision(3));
}
// compare: Collide held from above uses bearing x T over the spread pulse
const ollie=P.makeBody({build:'ollie',H:3.048,m:3007});
const cA = Object.assign(ctx(1e5, { surface: surf('sand') }), { body: ollie }), cB = ctx(1e5, { surface: surf('sand') });
const rc = P.collide(cA, cB, { source: 'jump' });
console.log('collide sand jump: toGround', rc.toGround);
// jump landing cap
const j = P.jump(ctx(1e8)); console.log('jump 1e8 landBear', j.landBear, 'pushOff', j.pushOff);
