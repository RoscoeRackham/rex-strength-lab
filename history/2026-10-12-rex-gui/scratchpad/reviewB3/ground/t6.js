const { P, D, g, surf, obj, rex, ollie, M, ctxOf, sig } = require('./common.js');
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const c = ctxOf(90718*g, ON);
const p = P.RESTRAINT.planNow('stomp', c, {});
for (const id of ['goal']) console.log(id, p.result(id));
for (const id of ['rattle','plaster','windows','houses']) { const r = p.result('preset:'+id); const run = p.run(r.use); const off = P.stomp(Object.assign({}, c, {use: r.use, ownRecoil:false}));
  console.log(id, sig(r.use/g), 'kg; vFoot', sig(run.vFoot), 'push t', sig(run.push.t), 'limbPulse', sig(P.limbPulse(rex)), 'vBody without power', sig(off.vBody)); }
const ce = p.ceiling(); console.log('ceiling', ce.by, sig(ce.below/g));
