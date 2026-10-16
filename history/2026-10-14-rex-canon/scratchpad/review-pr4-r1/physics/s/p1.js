const { open } = require('./pg.js');
(async () => {
  const { browser, load, text, errs } = await open();
  const cases = JSON.parse(process.argv[2]);
  for (const [lab, st] of cases) {
    await load(Object.assign({ duoOpen: true, saveV: 3 }, st));
    const t = await text();
    console.log('===== ' + lab + '\n' + t.slice(0, +process.argv[3] || 6000));
  }
  console.log('errors', errs);
  await browser.close();
})();
