const { render } = require('./harness.js');
(async () => {
  const pick = (t, re) => t.split('\n').filter((l) => re.test(l)).map((l) => '  ' + l.slice(0, 300));
  for (const anchor of ['bolted', 'friction']) {
    const r = await render(__dirname + '/new/dist/index.html', { anchor, surface: 'concrete', action: 'sprint' }, { soloEffort: 'allout', openAll: true });
    console.log('--- Sprint, anchor=' + anchor + ', all-out, concrete (branch):');
    console.log(pick(r.bay, /Push-off|push-off|strong enough|grip on offer/i).join('\n'));
  }
  const rm = await render(__dirname + '/main/dist/index.html', { anchor: 'bolted', surface: 'concrete', action: 'sprint', group: 'solo' }, { soloEffort: 'allout', openAll: true });
  console.log('--- Sprint, bolted, main:');
  console.log(pick(rm.bay, /Push-off|push-off|strong enough|grip on offer/i).join('\n'));
  // engine check
  const vm = require('vm');
})();
