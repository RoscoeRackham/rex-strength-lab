const { render } = require('./harness.js');
(async () => {
  const pick = (t, re) => t.split('\n').filter((l) => re.test(l)).map((l) => '  ' + l.slice(0, 260));
  const r = await render(__dirname + '/new/dist/index.html', { groundHolds: true, surface: 'concrete', action: 'throw' }, { soloEffort: 'allout', openAll: true });
  console.log('--- Throw, Comic ground on, standing, all-out:');
  console.log(pick(r.bay, /footing can only resist|flies backward|To stay put/i).join('\n'));
  console.log('--- Assumption cards on page:');
  console.log(pick(r.body, /Momentum is never absorbed|never thrown up|switch those limits off/).map(s=>s.slice(0,260)).join('\n'));
  // headings of the cards as rendered
  const idx = r.body.indexOf('Every push pushes him back');
  console.log('card context:', JSON.stringify(r.body.slice(idx - 40, idx + 200)));
  const i2 = r.body.indexOf('All of their powers are their absorption');
  console.log('card context:', JSON.stringify(r.body.slice(i2 - 30, i2 + 60)));
})();
