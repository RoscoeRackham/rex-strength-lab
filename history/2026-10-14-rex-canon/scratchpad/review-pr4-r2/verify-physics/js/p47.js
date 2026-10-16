const { open } = require('./page.js');
(async () => {
  const p = await open();
  // F7: Collide steady push, Ollie at 2,000 kgf
  await p.load({ duoOpen: true, duoAction: 'collide', colMode: 'push' }); await p.ollieKg(Math.log10(2000)); await p.pick('allout');
  console.log('F7 COLLIDE PUSH VERDICT', await p.txt('.verdict'));
  await p.load({ duoOpen: true, duoAction: 'wrestle' }); await p.ollieKg(Math.log10(2000)); await p.pick('allout');
  console.log('F7 WRESTLE STATUS', await p.txt('.status-row'));
  console.log('F7 WRESTLE VERDICT', await p.txt('.verdict'));
  // F4: default steady push, least disruptive
  await p.load({ duoOpen: true, duoAction: 'collide', colMode: 'push' }); await p.pick('least');
  console.log('F4 PUSH EFFORT', await p.txt('.effort-read'));
  console.log('F4 PUSH VERDICT', await p.txt('.verdict'));
  await p.load({ duoOpen: true, duoAction: 'wrestle' }); await p.pick('least');
  console.log('F4 WRESTLE EFFORT', await p.txt('.effort-read'));
  console.log('F4 WRESTLE VERDICT', await p.txt('.verdict'));
  console.log('errors', p.errs);
  await p.browser.close();
})();
