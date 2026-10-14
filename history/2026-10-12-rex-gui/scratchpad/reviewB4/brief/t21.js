const { open, load, text, pick } = require('./pg.js');
(async () => {
  const { browser, page, errs } = await open();
  for (const st of [{ oSame: false, oLogKg: 4, logKg: 7 }, { oSame: false, oLogKg: 3, logKg: 3.3 }]) {
    await load(page, st, 'arm', true);
    await pick(page, '#duo-effort', 'allout', 'duo-bay');
    const t = await text(page, 'duo-bay');
    const i = t.indexOf('OLLIE\n');
    console.log('=== arm ' + JSON.stringify(st) + '\n', t.slice(i, i + 3000));
  }
  const r = await page.evaluate(() => { const P = window.DinoPhys, D = window.DINO_DATA; const s = D.surfaces.find(x => x.id === 'concrete'); const rb = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ob = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 }); const base = { mode: 'comic', surface: s, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
    const a = P.armWrestle(Object.assign({ F: 1e7 * 9.80665, body: rb }, base), Object.assign({ F: 1e4 * 9.80665, body: ob }, base));
    return { pin: a.pin, toGround: a.toGround, limb: P.limbPulse(rb), outcome: a.outcome }; });
  console.log(JSON.stringify(r));
  console.log(errs);
  await browser.close();
})();
