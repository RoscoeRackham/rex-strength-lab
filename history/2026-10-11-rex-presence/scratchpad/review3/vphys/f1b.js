const pw = require('./pw');
(async () => {
  const p = await pw.open({ action: 'jump', softLanding: true });
  const lines = await p.evaluate(() => [...document.querySelectorAll('#bay p, #bay li, #bay .callout')].map(e => e.innerText.replace(/\s+/g,' ')));
  for (const l of lines) if (/Soft landing|^Effort|absorbed/i.test(l)) console.log('PAGE:', l.slice(0, 400));
  const pr = await p.evaluate(() => { const P = window.DinoPhys, D = window.DINO_DATA;
    const body = P.makeBody({ H: P.DEFAULT_BODIES.rex.H, m: P.DEFAULT_BODIES.rex.m, build: 'rex' });
    const surface = D.surfaces.find((s) => s.id === 'concrete');
    const o=[]; for (const kg of [22959, 22900, 23000]) { const r = P.jump({ F: kg*9.80665, mode:'comic', body, surface, groundHolds:false, anchor:'friction', softLanding:true}); o.push([kg, r.landing.E, r.landing.absorbed, r.landing.ratio]); } return o; });
  console.log(JSON.stringify(pr));
  await pw.close();
})();
