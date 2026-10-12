const { open, bay, select, range, check, click, close, grep } = require('./pwlib.js');
(async () => {
  for (const gh of [false, true]) {
    const p = await open('wt', { group: 'duo', duoAction: 'catch', cObj: 'car', cStyle: 'hard', gentleHold: gh });
    if (gh) await check(p, 'sw-gentle', true);
    const t = await bay(p, 6000);
    console.log('=== gentle ' + gh + '\n' + grep(t, /palms|Gentle|plate|Courtesy|Effort|harms|fires|crush/i));
    if (p._errs.length) console.log(p._errs);
    await p.close();
  }
  await close();
})();
