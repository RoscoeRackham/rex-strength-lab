const run = require('./harness.js');
const cases = [
  { id: 'pull-car', tab: 'pull', state: { obj: 'car', ownRecoil: false }, pick: 'allout' },
  { id: 'pull-loco-dense', tab: 'pull', state: { obj: 'loco', ownRecoil: false, surface: 'granite', logKg: 14, m: 3e9 }, pick: 'allout' },
  { id: 'pull-loco-sand', tab: 'pull', state: { obj: 'loco', ownRecoil: false, surface: 'sand' }, pick: 'allout' },
  { id: 'pull-b777', tab: 'pull', state: { obj: 'b777', ownRecoil: false }, pick: 'allout' },
];
run(cases).then((o) => { for (const [k, v] of Object.entries(o)) { console.log('##### ' + k); console.log(v.bay.split('\n').filter(l => /rope|footing|Plaster|recoil|slip|feet/i.test(l)).join('\n')); } });
