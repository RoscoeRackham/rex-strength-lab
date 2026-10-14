const { open } = require('./page.js');
(async () => {
  const { browser, page, errs, load, pick, text, settle } = await open();
  const grab = async () => { const t = await text('duo-bay'); return t.slice(t.indexOf('Just standing\n\n') , t.indexOf('Just standing\n\n') + 1300); };
  for (const [st, eff] of [
    [{ duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', logKg: 9 }, 'windows'],
    [{ duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', logKg: 6 }, 'windows'],
    [{ duoOpen: true, duoAction: 'catch', cObj: 'car', cStyle: 'hard', logKg: 9 }, 'houses'],
  ]) {
    await load(st); await settle('duo-bay'); await pick('#duo-effort', eff);
    console.log('=====', JSON.stringify(st), eff, '\n', await grab());
  }
  console.log('ERRS', errs);
  await browser.close();
})();
