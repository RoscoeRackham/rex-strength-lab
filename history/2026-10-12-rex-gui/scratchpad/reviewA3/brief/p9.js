const { NEW, OLD, launch, open, settle, txt } = require('./lib.js');
(async () => {
  const b = await launch();
  for (const [name, url, st] of [['new', NEW, { surface: 'sand', duoOpen: true, duoAction: 'arm' }], ['old', OLD, { surface: 'sand', group: 'duo', duoAction: 'arm' }]]) {
    const p = await open(b, url, st, { wait: 1500 });
    const bay = name === 'new' ? 'duo-bay' : 'bay';
    await settle(p, bay);
    await p.selectOption('#duo-effort', 'allout'); await p.waitForTimeout(500); await settle(p, bay);
    console.log(name, 'VERDICT:', await txt(p, '#' + bay + ' .verdict'));
    console.log(name, 'TILES:', await txt(p, '#' + bay + ' .tiles'));
    const m = await txt(p, '#' + bay + ' details.math .eq');
    console.log(name, 'MATH:', (m.match(/The table carries[^]*?dragged\./) || [m.slice(0, 300)])[0]);
    await p.close();
  }
  await b.close();
})();
