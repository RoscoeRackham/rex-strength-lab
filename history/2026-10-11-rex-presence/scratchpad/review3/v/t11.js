const H = require('./h.js');
(async () => {
  for (const tab of ['punch', 'clap']) {
    let p = await H.open({ action: tab, silentStrike: true });
    await H.tab(p, tab);
    let t = await H.settle(p, 30000);
    console.log('=====', tab);
    for (const l of t.split('\n')) if (/Silent strike|thump|released when|Effort:|Fist speed|Hand speed|m\/s/.test(l)) console.log(l);
    await p.close();
  }
  await H.close();
})();
