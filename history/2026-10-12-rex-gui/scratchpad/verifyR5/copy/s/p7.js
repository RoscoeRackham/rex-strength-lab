const run = require('./harness.js');
const cases = [
  { id: 'pull-loco-granite', tab: 'pull', state: { obj: 'loco', ownRecoil: false, surface: 'granite', logKg: 14 }, pick: 'allout' },
];
run(cases).then((o) => { for (const [k, v] of Object.entries(o)) { console.log('##### ' + k); console.log(v.bay.split('\n').filter(l => /rope|footing|Footing|slip|limit/i.test(l)).join('\n')); } });
