const { open } = require('./h.js');
(async () => {
  const { browser, page, load, text } = await open(1280);
  for (const a of ['punch', 'clap']) {
    await load({ action: a, logKg: 9, silentStrike: true }, 'allout');
    const t = await text('#bay');
    for (const l of t.split('\n')) if (/taken in, from|nothing outside changes/.test(l)) console.log(a + ': ' + l.slice(0, 400));
  }
  console.log('errs', page.errs);
  await browser.close();
})();
