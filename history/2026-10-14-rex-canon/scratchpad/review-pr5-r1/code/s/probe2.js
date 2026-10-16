const run = require('./pw.js');
run(async ({ page, load, tile, text, glow }) => {
  // the header glow on the settled default page, against the ladder's strength for the tile's (Rex's) energy
  await load({});
  const g = await glow('#hero-glow');
  const w = await page.evaluate(() => { const t = document.querySelector('#bay .tile.shimmer .s'); return t ? t.textContent : null; });
  console.log('default header glow', JSON.stringify(g), '| tile line:', w);
  // the default game of catch (a baseball, gentle lob, 10 m, least disruptive)
  await load({ duoOpen: true, duoAction: 'catch' });
  console.log('catch default:', JSON.stringify(await tile('duo-bay')));
  await load({ duoOpen: true, duoAction: 'catch', cStyle: 'hard' }, 'allout');
  console.log('catch fastball all-out:', JSON.stringify(await tile('duo-bay')));
  // Weight what-if, dinosaur-killer and the Sun
  await load({ action: 'weight', growWhat: 'chicxulub' });
  console.log('weight chicxulub:', JSON.stringify(await tile('bay')), JSON.stringify(await glow('#hero-glow')));
  await load({ action: 'weight', growWhat: 'sun' });
  console.log('weight sun:', JSON.stringify(await tile('bay')));
  // a person thrown, default (least disruptive) and all-out
  await load({ action: 'throw', obj: 'person' });
  console.log('person least:', JSON.stringify(await tile('bay')));
  // Collide default and at 0.1% c; Rex charging Ollie
  await load({ duoOpen: true, duoAction: 'collide', colWho: 'rex' }, 'allout');
  console.log('collide Rex charges:', JSON.stringify(await tile('duo-bay')), JSON.stringify(await glow('#duo-bay .glow')));
  // the wrestle throw with Ollie throwing Rex at 1e9 kg
  await load({ duoOpen: true, duoAction: 'wrestle', wrestleMove: 'throw', wrestleWho: 'ollie', logKg: 9 }, 'allout');
  console.log('wrestle Ollie throws Rex 1e9:', JSON.stringify(await tile('duo-bay')));
});
