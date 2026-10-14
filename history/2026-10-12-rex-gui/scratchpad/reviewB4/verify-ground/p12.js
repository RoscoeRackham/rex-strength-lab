const { open, settle, load, text } = require('./harness.js');
(async () => {
  const { browser, pg, errs } = await open();
  for (const [lab, st] of [['own recoil off', { ownRecoil: false }], ['own recoil on', {}]]) {
    await load(pg, Object.assign({ action: 'pull', obj: 'bus' }, st));
    await settle(pg, 'bay');
    await pg.selectOption('#effort', 'rattle'); await pg.waitForTimeout(600); await settle(pg, 'bay');
    const t = await text(pg, 'bay');
    console.log('=== ' + lab);
    console.log(t.split('\n').filter((l) => /shak|rope|planet|Effort:|footing/i.test(l)).slice(0, 10).join('\n'));
  }
  console.log('errors', errs);
  await browser.close();
})();
