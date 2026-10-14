const open = require('./pw.js');
(async () => {
  const { browser, page, errs, load, tiles } = await open(+process.argv[2] || 1280);
  for (const action of ['punch', 'clap', 'stomp']) for (const logKg of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24, 26, 28, 30, 32, 34]) for (const allout of [false, true]) {
    await load({ action, logKg, mode: 'comic' }, allout);
    const t = (await tiles()).filter((x) => /Energy|Compared/.test(x));
    console.log(action, logKg, allout ? 'allout' : 'least', '::', t.join(' || '));
  }
  console.log('ERRS', errs.slice(0, 5));
  await browser.close();
})();
