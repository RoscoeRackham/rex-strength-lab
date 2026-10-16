const { open } = require('./page.js');
(async () => {
  const p = await open();
  await p.load({ duoOpen: true, duoAction: 'collide', colMode: 'push', mode: 'real' }); await p.pick('allout');
  const a = await p.all();
  console.log('VERDICT', await p.txt('.verdict'));
  console.log('TILES', await p.txt('.tiles'));
  console.log('upper bound mentions:', (a.match(/[^.]*upper bound[^.]*\./gi) || []));
  console.log('real muscle mentions:', (a.match(/[^.]*[Rr]eal muscle[^.]*\./g) || []).slice(0, 6));
  console.log('stroke sentence:', (a.match(/[^.]*stroke[^.]*\.[^.]*\./g) || []).slice(0, 3));
  await p.load({ duoOpen: true, duoAction: 'wrestle', mode: 'real' }); await p.pick('allout');
  const b = await p.all();
  console.log('\nWRESTLE upper bound:', (b.match(/[^.]*upper bound[^.]*\./gi) || []));
  console.log('errors', p.errs);
  await p.browser.close();
})();
