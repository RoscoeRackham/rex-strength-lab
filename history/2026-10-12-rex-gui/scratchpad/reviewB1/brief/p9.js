const { open } = require('./page.js');
(async () => {
  const { browser, page, errs, load, pick, text, settle } = await open();
  await load({ duoOpen: true, duoAction: 'wrestle', wrestleMove: 'shove', surface: 'ice', logKg: 8 }); await settle('duo-bay'); await pick('#duo-effort', 'plaster');
  let t = await text('duo-bay'); let i = t.indexOf('Just standing\n\n');
  console.log(t.slice(i, i + 1400));
  await load({ action: 'throw', surface: 'ice', obj: 'bus', logKg: 8 }); await pick('#effort', 'plaster');
  t = await text('bay'); i = t.indexOf('Adjust effort');
  console.log('=== solo throw ice\n', t.slice(i, i + 900));
  console.log('ERRS', errs);
  await browser.close();
})();
