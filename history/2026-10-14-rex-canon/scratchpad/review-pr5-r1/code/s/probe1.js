const run = require('./pw.js');
run(async ({ page, load, tile, text, glow }) => {
  // A. the default page: Throw, a car, least disruptive
  await load({});
  console.log('A default:', JSON.stringify(await tile('bay')), 'header', JSON.stringify(await glow('#hero-glow')));
  const eff = await page.evaluate(() => (document.getElementById('bay').textContent.match(/Effort[^.]{0,120}/) || [''])[0]);
  console.log('   effort:', eff);
  // engine at the least effort found as the test finds it
  const e = await page.evaluate(() => { const P = window.DinoPhys, D = window.DINO_DATA, g = P.K.g; const car = D.objects.find((o) => o.id === 'car');
    const c = { F: 100 * 907.18474 * g, mode: 'comic', body: P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), surface: D.surfaces.find((s) => s.id === 'concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true, silentStrike: false, softLanding: false };
    const p = P.RESTRAINT.planNow('throw', c, { obj: car, angle: 45, target: 30, near: 5, safePassenger: true }), u = p.goal().use; const r = P.throwObject(Object.assign({}, c, { use: u }), car, 45);
    return { u: u / g, E: P.RESTRAINT.takenBack('throw', r, Object.assign({}, c, { use: u, obj: car, angle: 45 })).E };
  });
  console.log('   engine least:', JSON.stringify(e));
  // B. Throw a car at 20 degrees, all-out
  await load({ action: 'throw', obj: 'car', angle: 20 }, 'allout');
  const eB = await page.evaluate(() => { const P = window.DinoPhys, D = window.DINO_DATA, g = P.K.g; const car = D.objects.find((o) => o.id === 'car');
    const c = { F: 100 * 907.18474 * g, mode: 'comic', body: P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), surface: D.surfaces.find((s) => s.id === 'concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true };
    const f = (th) => P.RESTRAINT.takenBack('throw', P.throwObject(c, car, th), Object.assign({}, c, { obj: car, angle: th })).E; return { at20: f(20), at45: f(45) }; });
  console.log('B 20deg all-out:', JSON.stringify(await tile('bay')), 'engine', JSON.stringify(eB));
  // C. game of catch, car fastball 10 km apart at 1e9 kg (all-out): a round trip
  await load({ duoOpen: true, duoAction: 'catch', cObj: 'car', cStyle: 'hard', cLogD: 4, logKg: 9 }, 'allout');
  console.log('C catch car hard 10 km 1e9:', JSON.stringify(await tile('duo-bay')));
  await load({ duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', cLogD: Math.log10(300), logKg: 8 }, 'allout');
  console.log('C2 catch baseball hard 300 m 1e8:', JSON.stringify(await tile('duo-bay')));
  // D. pyramid straight up at 1e17 kg, all-out
  await load({ action: 'throw', obj: 'pyramid', angle: 90, logKg: 17 }, 'allout');
  const tD = await text('bay');
  console.log('D pyramid up 1e17:', JSON.stringify(await tile('bay')), '|', (tD.match(/The shimmer \(the Shimmer tile\)[^.]*\.[^.]*\./) || [''])[0]);
  // E. a dense Rex (1e12 kg at 10 ft), a car at 45, dial 1e12 kg, all-out
  await load({ action: 'throw', obj: 'car', angle: 45, logKg: 12, m: 1e12 }, 'allout');
  const tE = await text('bay');
  console.log('E dense Rex:', JSON.stringify(await tile('bay')), '|', (tE.match(/The shimmer \(the Shimmer tile\)[^.]*\.[^.]*\./) || [''])[0], '|', (tE.match(/Needed to escape him[^A-Z]{0,80}/) || [''])[0]);
});
