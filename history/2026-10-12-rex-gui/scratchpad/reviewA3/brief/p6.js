const { NEW, OLD, launch, open, settle, txt } = require('./lib.js');
(async () => {
  const b = await launch();
  const p = await open(b, NEW, { surface: 'sand', duoOpen: true, duoAction: 'wrestle' }, { wait: 1500 });
  await settle(p, 'duo-bay');
  console.log('VERDICT:', await txt(p, '#duo-bay .verdict'));
  console.log('CHIPS:', await txt(p, '#duo-bay .status-row'));
  console.log('HAPPENS:', await txt(p, '#duo-bay .happens'));
  console.log('MATH:', await txt(p, '#duo-bay details.math .eq'));
  await p.evaluate(() => document.querySelector('#duo-tabs #tab-arm').click()); await settle(p, 'duo-bay');
  console.log('ARM VERDICT:', await txt(p, '#duo-bay .verdict'));
  console.log('ARM TILES:', await txt(p, '#duo-bay .tiles'));
  console.log('ARM MATH:', await txt(p, '#duo-bay details.math .eq'));
  await b.close();
})();
