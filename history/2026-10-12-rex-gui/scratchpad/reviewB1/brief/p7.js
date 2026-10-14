const { open } = require('./page.js');
(async () => {
  const { browser, page, errs, load, pick, text, settle } = await open();
  const grab = async () => { const t = await text('duo-bay'); const i = t.indexOf('Just standing\n\n'); return t.slice(i, i + 1500); };
  for (const [st, eff] of [
    [{ duoOpen: true, duoAction: 'wrestle', wrestleMove: 'throw', logKg: 7 }, 'ground'],
    [{ duoOpen: true, duoAction: 'collide', colSrc: 'jump' }, 'plaster'],
  ]) {
    await load(st); await settle('duo-bay'); await pick('#duo-effort', eff);
    console.log('=====', JSON.stringify(st), eff, '\n', await grab());
  }
  console.log('ERRS', errs);
  await browser.close();
})();
