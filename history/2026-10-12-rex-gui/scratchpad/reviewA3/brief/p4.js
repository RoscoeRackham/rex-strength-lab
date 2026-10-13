const { NEW, launch, open, settle, txt } = require('./lib.js');
(async () => {
  const b = await launch();
  const out = [];
  for (const surface of ['softclay', 'ice']) for (const logKg of [6, 9]) for (const action of ['lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight', 'walk']) {
    const p = await open(b, NEW, { anchor: 'bolted', surface, logKg, action, effort: 'allout' }, { wait: 600 });
    await settle(p, 'bay', 8000);
    const t = await txt(p, '#bay');
    const hits = (t.match(/[^.]*\b(slid|slide|slips?|sink|sinks|sinking|footing|bolt|friction|shoved back|flies backward)[^.]*\./gi) || []).map((s) => s.trim());
    out.push(`== ${surface} 1e${logKg} ${action}\n  ` + [...new Set(hits)].slice(0, 12).join('\n  '));
    await p.close();
  }
  require('fs').writeFileSync(__dirname + '/p4.out', out.join('\n'));
  await b.close();
})();
