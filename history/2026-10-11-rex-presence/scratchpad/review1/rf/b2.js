const { open, bay, select, range, check, click, close, grep } = require('./pwlib.js');
(async () => {
  for (const ver of ['head', 'wt']) {
    const p = await open(ver, { group: 'duo', duoAction: 'wrestle', wrestleMove: 'throw', wrestleWho: 'rex' });
    let t = await bay(p, 5000);
    console.log('=== ' + ver + ' default least\n' + grep(t, /Effort|Courtesy|throws|can’t throw|air blast|Past that/i));
    await range(p, 'duo-effort-use', 4);
    t = await bay(p, 5000);
    console.log('=== ' + ver + ' custom 10 t\n' + grep(t, /Effort|Courtesy|throws|can’t throw|air blast|Past that/i));
    console.log('errors', p._errs);
  }
  await close();
})();
