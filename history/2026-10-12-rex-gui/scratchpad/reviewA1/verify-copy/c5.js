const { render } = require('./harness.js');
(async () => {
  const pick = (t, re) => t.split('\n').filter((l) => re.test(l)).map((l) => '  ' + l.slice(0, 300));
  const r = await render(__dirname + '/new/dist/index.html', { anchor: 'bolted', surface: 'concrete', duoOpen: true, duoAction: 'wrestle', wrestleMove: 'push' }, { duoEffort: 'allout', openAll: true });
  console.log('--- Wrestle push, Rex bolted (branch):');
  console.log(pick(r.duo, /Walking drive|^Drive =/i).join('\n'));
  const rm = await render(__dirname + '/main/dist/index.html', { anchor: 'bolted', surface: 'concrete', group: 'duo', duoAction: 'wrestle', wrestleMove: 'push' }, { duoEffort: 'allout', openAll: true });
  console.log('--- Wrestle push, Rex bolted (main):');
  console.log(pick(rm.bay, /Walking drive|^Drive =/i).join('\n'));
  console.log('mu*m*g for 3007 kg on concrete mu 0.6 =', (0.6 * 3007 * 9.80665 / 1000).toFixed(1), 'kN');
})();
