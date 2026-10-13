const { NEW, launch, open, settle, txt } = require('./lib.js');
(async () => {
  const b = await launch();
  const p = await open(b, NEW, { anchor: 'bolted', oAnchor: 'bolted', duoOpen: true, duoAction: 'collide', colMode: 'charge', colSrc: 'set', colGB: -4, surface: 'concrete' }, { wait: 1500 });
  await settle(p, 'duo-bay');
  console.log('VERDICT:', await txt(p, '#duo-bay .verdict'));
  console.log('CHIPS:', await txt(p, '#duo-bay .status-row'));
  const t = await txt(p, '#duo-bay');
  console.log('HAPPENS boltsLate:', (t.match(/In [^.]*stress wave[^.]*\.[^.]*\./) || [''])[0]);
  const card = await p.evaluate(() => Array.from(document.querySelectorAll('#assume div')).find((d) => /Newton/.test(d.textContent)).textContent);
  console.log('NEWTON CARD:', card);
  const hint = await p.evaluate(() => document.querySelector('#bolt-lbl').parentElement.querySelector('.hint').textContent);
  console.log('BOLTED HINT:', hint);
  console.log(p.__errs);
  await b.close();
})();
