const { open, tab, bayText } = require('./libnew');
(async () => {
  const { browser, page, errs } = await open({});
  for (const t of ['collide', 'catch', 'wrestle', 'arm']) {
    await tab(page, t, true, 2500);
    const txt = await bayText(page);
    console.log('=== ' + t + '\n' + txt.slice(0, 1400));
  }
  console.log(errs);
  await browser.close();
})();
