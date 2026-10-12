global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js'); require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const sand = D.surfaces.find((s) => s.id === 'sand');
const person = D.objects.find((o) => o.id === 'person');
console.log('person object:', person && { m: person.m, name: person.name, status: person.status });
const def = P.makeBody({}); console.log('makeBody({}) default:', def.H, def.m, def.build);
const f = (D.facts || []).filter ? null : null;
for (const [lab, H, m] of [['Baines 76.7 kg', 1.75, 76.7], ['person object', 1.75, person.m], ['makeBody default', def.H, def.m]]) {
  const v = P.presence(P.makeBody({ build: 'human', H, m }), sand, { effort: 0.5 }).ppv(53);
  console.log(lab, H, m, '->', (v * 1000).toPrecision(3), 'mm/s');
}
console.log(Object.keys(D).join(','));
