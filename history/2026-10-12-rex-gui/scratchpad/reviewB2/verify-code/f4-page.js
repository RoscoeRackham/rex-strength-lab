const { open } = require('./pagelib.js');
(async () => {
  const P = await open();
  for (const air of [0, 0.5]) {
    await P.load({ duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', cLogD: 3, logKg: 20, airAbsorb: air }, 'duo-bay');
    await P.pick('#duo-effort', 'allout');
    await P.page.evaluate(() => document.querySelectorAll('#duo-bay details.math').forEach((d) => d.open = true));
    const t = await P.text('duo-bay');
    console.log('air', air, '| verdict:', (t.match(/turns into a fireball within about [^.]*\./) || t.match(/[^.]*fireball[^.]*\./) || [''])[0]);
    console.log('   happens:', (t.match(/Past 1% of light speed the air can’t get out of the way.{0,200}/) || ['-'])[0]);
    console.log('   math:', (t.match(/half its energy is heat at x = [^.]*\.[^.]*\./) || ['-'])[0]);
    const eng = await P.page.evaluate((air) => { const Pp = window.DinoPhys, D = window.DINO_DATA, g = Pp.K.g; const mk = (b) => Pp.makeBody({ build: b, H: 3.048, m: 3007 });
      const c = (b) => ({ F: 1e20 * g, mode: 'comic', body: mk(b), surface: D.surfaces.find((s) => s.id === 'concrete'), anchor: 'friction', airAbsorb: air, keepForm: true, unbreakable: true, ownRecoil: true });
      const L = Pp.catchLeg(c('rex'), c('ollie'), D.objects.find((o) => o.id === 'baseball'), 1000, 'hard'); return { res: L.result, sweep: L.fireball && L.fireball.sweep, sweepK: L.fireball && L.fireball.sweepK, Egap: L.fireball && L.fireball.Egap, kind: L.fireball && L.fireball.kind }; }, air);
    console.log('   engine:', JSON.stringify(eng));
  }
  console.log('errors', P.errs);
  await P.close();
})();
