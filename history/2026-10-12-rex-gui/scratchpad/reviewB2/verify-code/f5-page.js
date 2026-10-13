const { open } = require('./pagelib.js');
(async () => {
  const P = await open();
  for (const lg of [Math.log10(1.81e23), 25]) {
    await P.load({ duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', cLogD: 2, logKg: lg }, 'duo-bay');
    await P.pick('#duo-effort', 'allout');
    const r = await P.page.evaluate(() => { const bay = document.getElementById('duo-bay'); const tx = (n) => n ? n.textContent.replace(/\s+/g, ' ').trim() : ''; return { verdict: tx(bay.querySelector('.verdict')), tiles: Array.from(bay.querySelectorAll('.tiles')).map(tx) }; });
    console.log('logKg', lg.toFixed(3));
    console.log('  verdict:', r.verdict.slice(0, 700));
    console.log('  tiles:', r.tiles.join(' || ').slice(0, 900));
  }
  // engine: roundTrip and carried
  const e = await P.page.evaluate(() => { const Pp = window.DinoPhys, D = window.DINO_DATA, g = Pp.K.g; const mk = (b) => Pp.makeBody({ build: b, H: 3.048, m: 3007 });
    const c = (b) => ({ F: 1.81e23 * g, mode: 'comic', body: mk(b), surface: D.surfaces.find((s) => s.id === 'concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true });
    const o = D.objects.find((x) => x.id === 'baseball'); const a = Pp.catchLeg(c('rex'), c('ollie'), o, 100, 'hard'), b = Pp.catchLeg(c('ollie'), c('rex'), o, 100, 'hard');
    return { a: { res: a.result, carried: a.catch.carried, uAfter: a.catch.uAfter / Pp.K.c, slide: a.catch.slide }, b: { res: b.result, carried: b.catch.carried }, rt: Pp.catchRoundTrip(a, b) }; });
  console.log('engine', JSON.stringify(e));
  console.log('errors', P.errs);
  await P.close();
})();
