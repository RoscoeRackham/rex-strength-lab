const { open } = require('./page.js');
(async () => {
  const p = await open();
  await p.load({ duoOpen: true, duoAction: 'arm', keepForm: false }); await p.ollieKg(3); await p.pick('allout');
  console.log('VERDICT', await p.txt('.verdict'));
  console.log('STATUS', await p.txt('.status-row'));
  console.log('TILES', await p.txt('.tiles'));
  const h = await p.txt('.happens');
  const m = h.match(/[^.]*elbow pad[^.]*\.[^.]*\.[^.]*\./g); console.log('HAPPENS(elbow)', m);
  await p.load({ duoOpen: true, duoAction: 'arm', keepForm: false, unbreakable: false, oAnchor: 'bolted', logKg: 7 });
  await p.ollieKg(3); await p.pick('allout');
  console.log('\nBOLTED VERDICT', await p.txt('.verdict'));
  console.log('STATUS', await p.txt('.status-row'));
  console.log('TILES', await p.txt('.tiles'));
  const h2 = await p.txt('.happens'); console.log('HAPPENS', h2.slice(0, 1500));
  console.log('EFFORT', await p.txt('.effort-read'));
  console.log('errors', p.errs);
  await p.browser.close();
})();
