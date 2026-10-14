const { session } = require('./lib2');
(async () => {
  const s = await session();
  for (const gnd of ['softclay']) {
    await s.load({ action: 'walk', surface: gnd, walker: 'both' });
    const a = (await s.text('#bay')).split('\n').filter(l => /print|sink|mired|clay|boot|paw/i.test(l)).slice(0, 6);
    // change only the clay's shear value (the Sources 'Ground shear strength' row), then redraw
    await s.page.evaluate((gnd) => { const sf = window.DINO_DATA.surfaces.find(x => x.id === gnd); sf.shear = sf.shear * 2; }, gnd);
    await s.page.selectOption('#surface', 'concrete'); await s.stable();
    await s.page.selectOption('#surface', gnd); await s.stable();
    const b = (await s.text('#bay')).split('\n').filter(l => /print|sink|mired|clay|boot|paw/i.test(l)).slice(0, 6);
    console.log('=== Walk on', gnd, '\n published shear:\n  ' + a.join('\n  ') + '\n doubled shear:\n  ' + b.join('\n  '));
  }
  console.log(s.errs);
  await s.browser.close();
})();
