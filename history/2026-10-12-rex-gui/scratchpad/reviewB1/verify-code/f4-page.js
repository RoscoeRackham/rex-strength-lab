const { open, settle } = require('./lib.js');
(async () => {
  for (const which of ['main', 'branch']) {
    const saved = which === 'branch' ? { action: 'throw', obj: 'baseball', angle: 0, logKg: 23.26, airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false, mode: 'comic' } : { action: 'throw', obj: 'baseball', angle: 0, logKg: 23.26, mode: 'comic' };
    const { browser, page, errs } = await open(which, saved);
    await settle(page, '#bay');
    await page.selectOption('#effort', 'allout');
    await page.waitForTimeout(800);
    const t = await settle(page, '#bay');
    t.split('\n').filter((l) => /outweighs|fireball|vaporizes/.test(l)).forEach((l) => console.log(which, '::', l.slice(0, 600)));
    if (errs.length) console.log(errs);
    await browser.close();
  }
  const P = require('./branch/rex-strength-lab/src/engine.js');
  global.window = {}; require('./branch/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
  const o = D.objects.find((x) => x.id === 'baseball');
  const c = { F: Math.pow(10, 23.26) * P.K.g, mode: 'comic', body: P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), surface: D.surfaces.find((s) => s.id === 'concrete'), anchor: 'friction', airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
  const r = P.throwObject(c, o, 0);
  const fa = P.fastAir(o, r.Eobj, 0, 1);
  console.log('m', o.m, 'area', o.area, 'm/A', (o.m / o.area).toFixed(2), 'kg/m2; column', fa.column.toFixed(0), 'kg/m2; air in path', (fa.column * o.area).toFixed(0), 'kg; x', fa.x.toFixed(0), 'gm1', fa.gm1.toExponential(3), 'air share', (fa.E / r.Eobj).toFixed(3), 'punchesOut', fa.punchesOut);
})();
