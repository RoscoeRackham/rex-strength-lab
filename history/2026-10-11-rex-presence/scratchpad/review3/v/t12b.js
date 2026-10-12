const H = require('./h.js');
(async () => {
  let p = await H.open({ action: 'walk', surface: 'concrete', walkD: 3, pace: 'walk' });
  await H.tab(p, 'walk');
  for (const pace of ['walk', 'stroll', 'fast']) {
    await p.click('#pace-' + pace); await p.waitForTimeout(500);
    const t = (await H.bay(p)).replace(/ /g, ' ');
    const j = t.indexOf('At 3 m'); console.log('---', pace, '\n', t.slice(j, j + 520));
  }
  await H.close();
})();
