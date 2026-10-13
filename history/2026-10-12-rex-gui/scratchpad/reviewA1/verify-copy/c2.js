const { render } = require('./harness.js');
(async () => {
  const base = { inf: true, anchor: 'bolted', oAnchor: 'bolted', surface: 'concrete', duoOpen: true };
  const r1 = await render(__dirname + '/new/dist/index.html', { ...base, duoAction: 'arm' }, { duoEffort: 'allout' });
  const pick = (t, re) => t.split('\n').filter((l) => re.test(l)).map((l) => '  ' + l.slice(0, 400));
  console.log('--- Arm wrestle, both bolted, unlimited, all-out (duo bay lines with tear/shove/apart):');
  console.log(pick(r1.duo, /tears out|shoves|apart|light speed/i).join('\n'));
  const hint = r1.body.split('\n').find((l) => /^On, nothing can push him/.test(l));
  console.log('--- Bolted hint:', hint);
  const r2 = await render(__dirname + '/new/dist/index.html', { ...base, duoAction: 'wrestle', wrestleMove: 'push' }, { duoEffort: 'allout' });
  console.log('--- Wrestle push, both bolted, unlimited, all-out:');
  console.log(pick(r2.duo, /tears|shove|apart|light speed/i).join('\n'));
  console.log('errs', r1.errs, r2.errs);
})();
