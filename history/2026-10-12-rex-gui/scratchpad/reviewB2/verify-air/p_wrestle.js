const { open, load, pick, text } = require('./page');
(async () => {
  const { browser, page, errs } = await open();
  await load(page, { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'throw', wAngle: 30, logKg: 22 }, 'duo-bay');
  await pick(page, '#duo-effort', 'allout', 'duo-bay');
  const t = await text(page, 'duo-bay');
  const i = t.indexOf('Ollie leaves'); console.log(t.slice(i, i + 2500));
  // engine: blast that duoFacts counts
  const res = await page.evaluate(() => {
    const P = window.DinoPhys, D = window.DINO_DATA;
    const st = JSON.parse(localStorage.getItem('rex-lab-v1'));
    const g = 9.80665;
    const bR = P.makeBody({ build: 'rex', H: st.H, m: st.m }), bO = P.makeBody({ build: 'ollie', H: st.oH, m: st.oM });
    const surface = D.surfaces.find((s) => s.id === st.surface);
    const base = { F: Math.pow(10, st.logKg) * g, mode: st.mode, surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
    const cA = Object.assign({}, base, { body: bR }), cB = Object.assign({}, base, { body: bO });
    const t = P.throwPartner(cA, cB, 30);
    const M = P.RESTRAINT.MOVES.throw, mo = { obj: t.obj, surface, body: bR, anchor: 'friction', angle: 30, near: 5, airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
    const parts = M.blastParts(t.r, mo);
    const gamma = 1 + t.r.Eobj / (t.obj.m * P.K.c * P.K.c);
    const h = P.handAir(bR, t.obj, t.r.v, gamma);
    return { v: t.r.v / P.K.c, parts, blast: M.blast(t.r, mo), hand: h, from: M.blastFrom(t.r, mo), DPharmRadius: P.blastRadius(M.blast(t.r, mo), P.RESTRAINT.R.DP_HARM) };
  });
  console.log(JSON.stringify(res));
  console.log('errs', errs);
  await browser.close();
})();
