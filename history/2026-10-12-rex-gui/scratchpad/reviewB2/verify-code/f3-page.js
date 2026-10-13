const { open } = require('./pagelib.js');
(async () => {
  const P = await open();
  // Throw tab
  await P.load({ action: 'throw', obj: 'baseball', angle: 0, logKg: 14 });
  await P.pick('#effort', 'windows');
  const t = await P.text('bay');
  console.log('THROW:', (t.match(/Effort:[^.]*\.[^.]*\./) || [''])[0], '|', (t.match(/[^.]*fireball at his hand[^.]*\./) || ['(no hand fireball text)'])[0]);
  // Catch tab
  await P.load({ duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', cLogD: 2, logKg: 14 }, 'duo-bay');
  await P.pick('#duo-effort', 'windows');
  const c = await P.page.evaluate(() => document.querySelector('#duo-bay .effort-read').textContent.replace(/\s+/g, ' '));
  console.log('CATCH:', c.slice(0, 500));
  const v = await P.text('duo-bay');
  console.log('CATCH bay speed:', (v.match(/[^.]*light speed[^.]*\./) || [''])[0]);
  console.log('errors', P.errs);
  await P.close();
})();
