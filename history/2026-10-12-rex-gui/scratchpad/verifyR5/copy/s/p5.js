const run = require('./harness.js');
const cases = [];
for (const sf of ['sand', 'gravel', 'softclay', 'concrete', 'ice']) for (const st of [{}, { logKg: 10 }, { inf: true }])
  cases.push({ id: 'stomp-' + sf + '-' + JSON.stringify(st).replace(/\W/g, ''), tab: 'stomp', state: Object.assign({ surface: sf }, st), pick: 'allout' });
run(cases).then((o) => { for (const [k, v] of Object.entries(o)) { console.log('##### ' + k); console.log(v.bay.split('\n').filter(l => /foot’s push|Footprint|print kept|effort box|Plaster may crack|Hole/i.test(l)).join('\n')); } });
