const run = require('./harness.js');
const cases = [
  { id: 'jump-sand-10', tab: 'jump', state: { surface: 'sand', logKg: 10 }, pick: 'allout' },
  { id: 'stomp-sand-10', tab: 'stomp', state: { surface: 'sand', logKg: 10 }, pick: 'allout' },
  { id: 'jump-sand-7', tab: 'jump', state: { surface: 'sand', logKg: 7 }, pick: 'allout' },
  { id: 'stomp-sand-7', tab: 'stomp', state: { surface: 'sand', logKg: 7 }, pick: 'allout' },
];
run(cases).then((o) => { for (const [k, v] of Object.entries(o)) { console.log('##### ' + k); console.log(v.bay.split('\n').filter(l => /footprint|Footprint|print|Crater|surface|^Rex/i.test(l)).join('\n')); } });
