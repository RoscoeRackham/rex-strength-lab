const { P, D, g, surf, obj, rex, ollie, ctxOf } = require('./common.js');
const t0 = Date.now();
for (const mv of ['throw','jump','stomp','punch','clap','sprint','pull']) {
  const o = mv==='throw'?{obj:obj('car'),angle:45,target:30}: mv==='jump'?{target:3}: mv==='punch'?{target:10.4}: mv==='clap'?{target:6}: mv==='sprint'?{target:12.42}: mv==='pull'?{obj:obj('bus'),target:10}:{};
  const t1=Date.now();
  const p = P.RESTRAINT.planNow(mv, ctxOf(Infinity), o);
  console.log(mv, Date.now()-t1, 'ms runs', p.runs(), 'goal', (p.goal().use/g).toPrecision(3), 'ceiling', JSON.stringify(p.ceiling()));
}
console.log(D.objects.map(o=>o.id+(o.passenger?'(P)':'')+':'+o.m).join(' '));
