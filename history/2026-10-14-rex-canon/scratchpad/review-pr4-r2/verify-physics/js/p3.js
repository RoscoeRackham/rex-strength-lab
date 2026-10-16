const { open } = require('./page.js');
(async () => {
  const p = await open();
  await p.load({ duoOpen: true, duoAction: 'wrestle' }); await p.ollieKg(3); await p.pick('allout');
  console.log('VERDICT', await p.txt('.verdict'));
  console.log('STATUS', await p.txt('.status-row'));
  console.log('TILES', await p.txt('.tiles'));
  console.log('HAPPENS', (await p.txt('.happens')).slice(0, 2500));
  console.log('MATH', (await p.txt('details.math .eq')).slice(0, 1500));
  console.log('errors', p.errs);
  await p.browser.close();
})();
