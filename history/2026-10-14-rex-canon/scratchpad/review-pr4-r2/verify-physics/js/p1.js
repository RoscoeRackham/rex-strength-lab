const { open } = require('./page.js');
(async () => {
  const p = await open();
  for (const [lab, st] of [['default sprint', { duoOpen: true, duoAction: 'collide' }],
    ['jump, UF off, granite', { duoOpen: true, duoAction: 'collide', colSrc: 'jump', unbreakable: false, surface: 'granite' }],
    ['jump, UF off, concrete', { duoOpen: true, duoAction: 'collide', colSrc: 'jump', unbreakable: false }],
    ['1 m/s', { duoOpen: true, duoAction: 'collide', colSrc: 'set', colGB: Math.log10(1 / 299792458) }]]) {
    await p.load(st); await p.pick('allout');
    const t = await p.txt('.tiles'), h = await p.txt('.happens');
    const m1 = t.match(/Force of the hit[^/]*?ms/); const m2 = t.match(/Energy freed at the hit.{0,80}/);
    const m3 = h.match(/The hit frees [^.]*\./);
    console.log('==', lab, '\n  ', m1 && m1[0], '\n  ', m2 && m2[0], '\n  ', m3 && m3[0]);
  }
  console.log('errors', p.errs);
  await p.browser.close();
})();
