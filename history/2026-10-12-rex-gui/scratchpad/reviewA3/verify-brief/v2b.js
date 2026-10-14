const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const D = __dirname;
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + D + '/branch.html');
  await p.evaluate(() => { localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, duoAction: 'arm', surface: 'sand' })); });
  await p.reload(); await p.waitForTimeout(2500);
  const radios = await p.evaluate(() => document.querySelector('#duo-effort')?.value);
  console.log(radios);
  await p.selectOption('#duo-effort', 'allout');
  await p.waitForTimeout(4000);
  const out = await p.evaluate(() => {
    const st = JSON.parse(localStorage.getItem('rex-lab-v1'));
    const t = document.body.innerText;
    return { duoEffort: st.duoEffort, sel: document.querySelector('#duo-effort').value,
      verdicts: [...document.querySelectorAll('.verdict')].map(e => e.textContent),
      tiles: [...document.querySelectorAll('.tile')].map(e => e.innerText.replace(/\n/g, ' | ')).filter(s => /Feet|feet|table|Table/.test(s)),
      math: (t.match(/[^.\n]*footing = μ[^\n]*/g) || []) };
  });
  console.log(JSON.stringify(out, null, 1), errs);
  // engine: Ollie's footing on sand
  const eng = await p.evaluate(() => {
    const P = window.DinoPhys, DD = window.DINO_DATA;
    const s = DD.surfaces.find(x => x.id === 'sand');
    const st = JSON.parse(localStorage.getItem('rex-lab-v1'));
    const rex = P.makeBody(st.H, st.m, 'rex'), ol = P.makeBody(st.oH, st.oM, 'ollie');
    const f = (body) => { const a = P.anchorCapacity({ body, surface: s, anchor: 'friction' }); return { m: body.m, mug: s.mu * body.m * 9.80665, Nmax: a.Nmax, R: a.R, footArea: body.footArea }; };
    return { rex: f(rex), ollie: f(ol) };
  });
  console.log(JSON.stringify(eng, null, 1));
  await b.close();
})();
