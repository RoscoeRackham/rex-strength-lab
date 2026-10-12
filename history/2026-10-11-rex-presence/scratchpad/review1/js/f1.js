const H = require('./h.js');
(async () => {
  for (const mv of ['clap', 'punch']) {
    const p = await H.open({ inf: true, action: mv, group: 'solo' });
    await H.tab(p, mv);
    for (const e of ['ceiling', 'rattle']) {
      await H.effort(p, e);
      const t = await H.text(p);
      console.log('=====', mv, e, '\n', t.slice(0, 4000));
      console.log('ARIA:', await H.aria(p));
    }
    console.log('errs', p._errs);
  }
  await H.close();
})();
