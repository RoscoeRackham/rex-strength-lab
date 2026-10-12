const H = require('./h.js');
(async () => {
  const tabs = (process.argv[2] || 'walk,lift,throw,jump,stomp,punch,clap,sprint,pull').split(',');
  const st = JSON.parse(process.argv[3] || '{}');
  for (const t of tabs) {
    const p = await H.open(Object.assign({ action: t, group: 'solo' }, st));
    await H.waitDone(p);
    console.log('==================== ' + t + ' ' + JSON.stringify(st));
    console.log(await H.bay(p));
    if (p.errs.length) console.log('ERRS', p.errs);
    await p.close();
  }
  await H.close();
})();
