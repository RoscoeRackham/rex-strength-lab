const { render } = require('./harness.js');
(async () => {
  const pick = (t, re) => t.split('\n').filter((l) => re.test(l)).map((l) => '  ' + l.slice(0, 300));
  const r1 = await render(__dirname + '/new/dist/index.html', { inf: true, anchor: 'bolted', surface: 'concrete', action: 'pull' }, { soloEffort: 'allout', openAll: true });
  console.log('--- Pull, Rex bolted, unlimited, all-out:');
  console.log(pick(r1.bay, /footing|bolted|tear/i).slice(0, 6).join('\n'));
  const r1b = await render(__dirname + '/new/dist/index.html', { inf: true, anchor: 'bolted', surface: 'concrete', action: 'throw' }, { soloEffort: 'allout', openAll: true });
  console.log('--- Throw, Rex bolted, unlimited, all-out:');
  console.log(pick(r1b.bay, /footing|bolted|tear/i).slice(0, 6).join('\n'));
  const r2 = await render(__dirname + '/new/dist/index.html', { inf: true, oAnchor: 'bolted', surface: 'concrete', duoOpen: true, duoAction: 'wrestle', wrestleMove: 'lift' }, { duoEffort: 'allout', openAll: true });
  console.log('--- Wrestle lift, Ollie bolted, unlimited, all-out:');
  console.log(pick(r2.duo, /bolted|ground|Can.t/i).slice(0, 6).join('\n'));
})();
