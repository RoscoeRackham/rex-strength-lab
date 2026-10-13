const { open } = require('./harness2.js');
(async () => {
  const h = await open();
  const cases = [
    ['wrestle push', { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'push' }],
    ['wrestle lift', { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'lift' }],
    ['collide push', { duoOpen: true, duoAction: 'collide', colMode: 'push' }],
    ['collide charge, powers off', { duoOpen: true, duoAction: 'collide', airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false }],
    ['arm, powers off', { duoOpen: true, duoAction: 'arm', airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false }],
  ];
  for (const [name, st] of cases) {
    await h.load(st, 'duo-bay');
    const t = await h.text('duo-bay');
    const read = await h.page.evaluate(() => { const n = document.querySelector('#duo-bay .effort-read'); return n ? n.innerText : '(no effort box)'; });
    console.log('=== ' + name + ' (default least disruptive) ===\n' + read);
    console.log('  whole bay mentions shaking reason?', /equal and opposite|slow, steady load|slow load, not a blow|only through their powers/.test(t));
  }
  await h.pick('#duo-effort', 'plaster');
  console.log('=== arm, powers off, plaster preset ===\n' + await h.page.evaluate(() => document.querySelector('#duo-bay .effort-read').innerText));
  await h.load({ duoOpen: true, duoAction: 'wrestle', wrestleMove: 'push' }, 'duo-bay');
  await h.pick('#duo-effort', 'plaster');
  console.log('=== wrestle push, plaster preset ===\n' + await h.page.evaluate(() => document.querySelector('#duo-bay .effort-read').innerText));
  console.log('errs', h.errs);
  await h.browser.close();
})();
