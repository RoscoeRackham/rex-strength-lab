const { open } = require('./page.js');
(async () => {
  const { browser, page, errs, load, pick, text, settle } = await open();
  const grab = async () => { const t = await text('duo-bay'); const i = t.indexOf('What happens') >= 0 ? 0 : 0; return t.slice(t.indexOf('Adjust effort'), t.indexOf('Adjust effort') + 1600); };
  for (const [st, eff] of [
    [{ duoOpen: true, duoAction: 'catch', cObj: 'baseball', logKg: 9 }, 'windows'],
    [{ duoOpen: true, duoAction: 'catch', cObj: 'baseball', logKg: 9 }, 'plaster'],
    [{ duoOpen: true, duoAction: 'catch', cObj: 'baseball', logKg: 9, airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false }, 'plaster'],
    [{ duoOpen: true, duoAction: 'arm', airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false }, 'plaster'],
    [{ duoOpen: true, duoAction: 'arm' }, 'plaster'],
    [{ duoOpen: true, duoAction: 'wrestle', wrestleMove: 'shove' }, 'plaster'],
  ]) {
    await load(st); await settle('duo-bay'); await pick('#duo-effort', eff);
    console.log('=====', JSON.stringify(st), eff, '\n', await grab());
  }
  console.log('ERRS', errs);
  await browser.close();
})();
