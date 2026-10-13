const { open } = require('./page.js');
(async () => {
  const { browser, page, errs, load, pick, text, settle } = await open();
  await load({ duoOpen: true, duoAction: 'wrestle', wrestleMove: 'throw', logKg: 7 }); await settle('duo-bay'); await pick('#duo-effort', 'allout');
  const t = await text('duo-bay'); const i = t.indexOf('Just standing\n\n');
  console.log(t.slice(i, i + 2500));
  console.log('has ground label:', /ground holds|their power holds|Unbreakable footing: it doesn/i.test(t));
  const r = await page.evaluate(() => { const P = window.DinoPhys, D = window.DINO_DATA; const s = D.surfaces.find(x => x.id === 'concrete'); const mk = (b) => ({ F: 1e7 * 9.80665, mode: 'comic', body: P.makeBody(b), surface: s, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true }); const t = P.throwPartner(mk({ build: 'rex', H: 3.048, m: 3007 }), mk({ build: 'ollie', H: 3.06, m: 3007 }), 45); return { raw: t.r.sinkRatioRaw, sink: t.r.sinkRatio }; });
  console.log(JSON.stringify(r));
  console.log('ERRS', errs);
  await browser.close();
})();
