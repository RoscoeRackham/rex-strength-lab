const open = require('./pw.js');
(async () => {
  const { browser, page, errs, load, tiles } = await open(390, process.argv[2] || 'light');
  const states = [
    [{ action: 'punch', logKg: 1 }, false], [{ action: 'clap', logKg: 1 }, false], [{ action: 'stomp', logKg: 1 }, false],
    [{ action: 'punch', logKg: 1, H: 0.05 }, false], [{ action: 'punch', logKg: 1, H: 0.01, m: 0.1 }, false],
    [{ action: 'punch', logKg: 12 }, true], [{ action: 'punch', logKg: 13 }, true], [{ action: 'punch', logKg: 30 }, true], [{ action: 'stomp', logKg: 26 }, true],
    [{ action: 'weight', m: 1e26 }, false], [{ action: 'weight', m: 1e19 }, false], [{ action: 'weight', H: 500, m: 1e27 }, false],
  ];
  for (const [st, allout] of states) {
    await load(st, allout);
    const ov = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    const t = (await tiles()).filter((x) => /Energy|Compared/.test(x));
    console.log(JSON.stringify(st), allout ? 'allout' : '', 'overflow=' + ov, '::', t.join(' || '));
    await page.screenshot({ path: process.env.S + '/n390_' + st.action + '_' + (st.logKg || st.m) + '_' + (st.H || '') + '.png', fullPage: false });
  }
  console.log('ERRS', errs.slice(0, 5));
  await browser.close();
})();
