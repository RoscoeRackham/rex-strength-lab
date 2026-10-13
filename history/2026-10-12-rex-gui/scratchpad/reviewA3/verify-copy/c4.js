const { open, settle, launch } = require('./lib.js');
(async () => {
  const b = await launch();
  const st = { duoOpen: true, duoAction: 'arm', anchor: 'friction', oAnchor: 'bolted', surface: 'sand', oH: 6, oM: 22940 };
  const { ctx, page } = await open(b, 'branch', st);
  await settle(page, '#duo-bay');
  await page.selectOption('#duo-effort', 'allout');
  await page.waitForTimeout(400);
  const t = await settle(page, '#duo-bay');
  for (const line of t.split('\n')) if (/bolted|bolts|tears|3\.05 m|6 m ·/.test(line)) console.log('  ' + line);
  const r = await page.evaluate(() => {
    const P = window.DinoPhys, D = window.DINO_DATA, s = D.surfaces.find(x => x.id === 'sand');
    const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ol = P.makeBody({ build: 'ollie', H: 6, m: 22940 });
    return { rexTear: s.shear * rex.digArea, ollieTear: s.shear * ol.digArea };
  });
  console.log(r, 'errors:', page.errs);
  await ctx.close(); await b.close();
})();
