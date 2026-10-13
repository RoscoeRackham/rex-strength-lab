const { open } = require('./page.js');
(async () => {
  const { browser, page, errs, load, pick, text, settle } = await open();
  await load({ action: 'throw', obj: 'bus', angle: 45, logKg: 9 }); await pick('#effort', 'plaster');
  const t = await text('bay'); const i = t.indexOf('Adjust effort');
  console.log(t.slice(i, i + 1600));
  console.log('ERRS', errs);
  await browser.close();
})();
