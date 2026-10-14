const H = require('./h.js');
(async () => {
  const p = await H.open({ state: { cObj: 'baseball', cStyle: 'hard', logKg: 8 } });
  await H.tab(p, 'catch', true);
  await H.setEffort(p, 'allout', true);
  const t = await p.evaluate(() => {
    const P = window.DinoPhys; return Array.from(document.querySelectorAll('#duo-bay li')).map((n) => n.textContent.slice(0, 90));
  });
  console.log(t.join('\n'));
  // engine directly with the page's ctx: compute catchLeg
  const r = await p.evaluate(() => { const P = window.DinoPhys, D = window.DINO_DATA; const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }); const sf = D.surfaces.find((s) => s.id === 'concrete');
    const c = { F: 1e8 * 9.80665, mode: 'comic', body, surface: sf, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
    const L = P.catchLeg(c, Object.assign({}, c, { body: P.makeBody({ build: 'rex', H: 3.06, m: 3007 }) }), D.objects.find((o) => o.id === 'baseball'), 10, 'hard');
    return { T: L.toGroundT, C: L.toGroundC, res: L.result }; });
  console.log(JSON.stringify(r));
  await H.close();
})();
