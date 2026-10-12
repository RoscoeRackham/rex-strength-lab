const pw = require('./pw');
(async () => {
  const p = await pw.open({ action: 'jump', softLanding: true });
  const t = await pw.bayText(p);
  for (const l of t.split('\n')) if (/Soft landing|Effort:|landing/i.test(l)) console.log('PAGE:', l.slice(0, 300));
  const eng = await p.evaluate(() => {
    const P = window.DinoPhys, D = window.DINO_DATA;
    const body = P.makeBody({ H: P.DEFAULT_BODIES.rex.H, m: P.DEFAULT_BODIES.rex.m, build: 'rex' });
    const surface = D.surfaces.find((s) => s.id === 'concrete');
    // find effort used from readout
    const txt = document.querySelector('.effort-read').innerText;
    const m = txt.match(/lifting ([\d.,]+) (t|kg)/);
    const kg = m ? parseFloat(m[1].replace(/,/g, '')) * (m[2] === 't' ? 1000 : 1) : null;
    const r = P.jump({ F: kg * 9.80665, mode: 'comic', body, surface, groundHolds: false, anchor: 'friction', softLanding: true });
    return { kg, E: r.landing.E, absorbed: r.landing.absorbed, ratio: r.landing.ratio, v: r.landing.v };
  });
  console.log('ENGINE', JSON.stringify(eng), 'E/absorbed', eng.E / eng.absorbed);
  console.log('errs', p.errs);
  await pw.close();
})();
