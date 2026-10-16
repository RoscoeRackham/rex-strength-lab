const { open } = require('./h.js');
(async () => {
  const { browser, page, load, text } = await open(1280);
  for (const ob of ['car', 'person', 'baseball']) {
    await load({ action: 'throw', obj: ob, angle: 45, airAbsorb: 0.5 }, 'allout');
    const t = await text('#bay');
    console.log('=== ' + ob + ' all-out 50%');
    for (const l of t.split('\n')) if (/Air resistance absorbed|taken in, from|shimmer|Shimmer tile|real air would/.test(l)) console.log('  ' + l.slice(0, 900));
  }
  // engine numbers for the car
  const e = await page.evaluate(() => { const P = window.DinoPhys, D = window.DINO_DATA, g = P.K.g;
    const c = { F: 100 * 907.18474 * g, mode: 'comic', body: P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), surface: D.surfaces.find((x) => x.id === 'concrete'), anchor: 'friction', airAbsorb: 0.5, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true };
    const o = D.objects.find((x) => x.id === 'car'); const r = P.throwObject(c, o, 45); const tb = P.RESTRAINT.takenBack('throw', r, Object.assign({}, c, { obj: o, angle: 45 }));
    return { dragLoss: r.dragLoss, dragLoss0: r.dragLoss0, Eobj: r.Eobj, oceanE: r.flight && r.flight.ocean && r.flight.ocean.E, tbDrag: tb.parts.drag, airE: r.flight && r.flight.air && r.flight.air.E }; });
  console.log('engine car 50%:', JSON.stringify(e));
  console.log('errs', page.errs);
  await browser.close();
})();
