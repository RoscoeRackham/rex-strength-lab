const { render } = require('./harness.js');
(async () => {
  const pick = (t, re) => t.split('\n').filter((l) => re.test(l)).map((l) => '  ' + l.slice(0, 420));
  for (const colWho of ['ollie', 'rex']) {
    const r = await render(__dirname + '/new/dist/index.html', { inf: true, anchor: 'bolted', oAnchor: 'bolted', surface: 'concrete', duoOpen: true, duoAction: 'collide', colMode: 'push', colImm: true, colWho }, { duoEffort: 'allout', openAll: true });
    console.log('--- Collide push, colImm, colWho=' + colWho + ':');
    console.log(pick(r.duo, /tears|shoved|driven back|light speed/i).slice(0, 6).join('\n'));
    if (colWho === 'ollie') console.log('--- Bolted hint (Their powers opened):', pick(r.body, /^On, nothing can push him/).join(''));
  }
})();
