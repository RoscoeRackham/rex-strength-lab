const { open } = require('./pagelib.js');
(async () => {
  const P = await open(__dirname + '/pmut/fix03.html');
  await P.load({ duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', cLogD: 2, logKg: 14 }, 'duo-bay');
  await P.pick('#duo-effort', 'windows');
  const c = await P.page.evaluate(() => document.querySelector('#duo-bay .effort-read').textContent.replace(/\s+/g, ' '));
  console.log('CATCH (fixed):', c.slice(0, 300));
  console.log('errors', P.errs);
  await P.close();
})();
