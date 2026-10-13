const { open } = require('./h.js');
const cases = JSON.parse(process.argv[2]);
(async () => {
  const H = await open();
  for (const c of cases) {
    await H.load(c.state);
    if (c.pick) await H.pick(c.duo ? '#duo-effort' : '#effort', c.pick);
    const t = await H.text(c.duo ? 'duo-bay' : 'bay');
    console.log('\n######## ' + JSON.stringify(c) + '\n' + t);
  }
  console.log('ERRS', H.errs);
  await H.browser.close();
})();
