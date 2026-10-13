const { open } = require('./pw.js');
(async () => {
  const W = await open(process.argv[2]);
  const read = () => W.text('#duo-bay .effort-read');
  const base = { duoOpen: true, duoAction: 'catch', cObj: 'car', cStyle: 'hard', cLogD: 2, logKg: 10 };
  // reference: each preset alone
  const ref = {};
  for (const e of ['block', 'windows', 'plaster']) { await W.load(base, 'duo-bay'); await W.settle('duo-bay'); await W.pick('#duo-effort', e, 'duo-bay'); ref[e] = await read(); }
  // switch mid-search: block -> windows -> plaster quickly
  await W.load(base, 'duo-bay'); await W.settle('duo-bay');
  for (const e of ['block', 'windows', 'plaster']) { await W.page.selectOption('#duo-effort', e); await W.page.waitForTimeout(60); }
  const ok1 = await W.settle('duo-bay'); const got = await read();
  console.log('switched to plaster mid-search; settles:', ok1, 'matches plaster alone:', got === ref.plaster);
  if (got !== ref.plaster) console.log(' got:', got.slice(0, 200), '\n ref:', ref.plaster.slice(0, 200));
  // switch then close the element mid-search, reopen
  await W.load(base, 'duo-bay'); await W.settle('duo-bay');
  await W.page.selectOption('#duo-effort', 'block'); await W.page.waitForTimeout(50);
  await W.page.evaluate(() => { document.getElementById('duo').open = false; }); await W.page.waitForTimeout(1500);
  await W.page.evaluate(() => { document.getElementById('duo').open = true; });
  await W.page.waitForTimeout(500); const ok2 = await W.settle('duo-bay'); const g2 = await read();
  console.log('closed mid-search then reopened; effort select now:', await W.page.$eval('#duo-effort', (n) => n.value), 'settles', ok2, 'same as block alone:', g2 === ref.block);
  // a settings change mid-search (Ollie bolted), then back
  await W.load(base, 'duo-bay'); await W.settle('duo-bay');
  await W.page.selectOption('#duo-effort', 'windows'); await W.page.waitForTimeout(50);
  await W.page.evaluate(() => { document.getElementById('powers').open = true; });
  await W.page.setChecked('#bolt-ollie', true); await W.page.waitForTimeout(100); await W.page.setChecked('#bolt-ollie', false);
  await W.page.waitForTimeout(500); const ok3 = await W.settle('duo-bay'); const g3 = await read();
  console.log('settings changed and restored mid-search; settles', ok3, 'same as windows alone:', g3 === ref.windows);
  console.log('errors', W.errs);
  await W.close();
})();
