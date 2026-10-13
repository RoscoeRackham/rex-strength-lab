const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const D = __dirname;
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage();
  await p.goto('file://' + D + '/branch.html'); await p.waitForTimeout(1500);
  const eng = await p.evaluate(() => {
    const P = window.DinoPhys, DD = window.DINO_DATA;
    const s = DD.surfaces.find(x => x.id === 'sand');
    const out = {};
    for (const [k, build] of [['rex', 'rex'], ['ollie', 'ollie']]) {
      const body = P.makeBody(Object.assign({ build }, P.DEFAULT_BODIES[k]));
      const a = P.anchorCapacity({ body, surface: s, anchor: 'friction' });
      out[k] = { m: body.m, mu: s.mu, mug_N: Math.round(s.mu * body.m * 9.80665), Nmax_N: Math.round(a.Nmax), R_N: Math.round(a.R), normalCapped: a.normalCapped, footArea: body.footArea };
    }
    return out;
  });
  console.log(JSON.stringify(eng, null, 1));
  await b.close();
})();
