const { open, settle, launch } = require('./lib.js');
(async () => {
  const b = await launch();
  const { ctx, page } = await open(b, 'branch', { action: 'throw', anchor: 'bolted', surface: 'sand', obj: 'car', angle: 45 });
  await settle(page, '#bay');
  await page.selectOption('#effort', 'allout');
  await page.waitForTimeout(400);
  await page.evaluate(() => document.querySelectorAll('#bay details').forEach(d => d.open = true));
  const t = await settle(page, '#bay');
  for (const line of t.split('\n')) if (/drives his feet down|footing never gives|Bolted|bolted/.test(line)) console.log('  ' + line.slice(0, 500));
  const r = await page.evaluate(() => { const P = window.DinoPhys, D = window.DINO_DATA; const s = D.surfaces.find(x => x.id === 'sand'); const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }); const car = D.objects.find(o => o.id === 'car');
    const a = P.anchorCapacity({ body: rex, surface: s, theta: Math.PI / 4, anchor: 'bolted', mB: car.m }); const f = P.anchorCapacity({ body: rex, surface: s, theta: Math.PI / 4, anchor: 'friction', mB: car.m }); return { boltedR: a.R, frictionR: f.R }; });
  console.log(r);
  await ctx.close(); await b.close();
})();
