const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const D = __dirname;
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + D + '/branch.html');
  for (const [act, extra] of [['wrestle', { wrestleMove: 'push' }], ['arm', {}]]) {
    await p.evaluate(([act, extra]) => { localStorage.setItem('rex-lab-v1', JSON.stringify(Object.assign({ duoOpen: true, duoAction: act, surface: 'sand' }, extra))); }, [act, extra]);
    await p.reload(); await p.waitForTimeout(2500);
    // set duo effort to all-out for arm wrestle if there is a control
    if (act === 'arm') {
      const opts = await p.evaluate(() => [...document.querySelectorAll('input[type=radio], select option')].filter(e => /all-out|All-out|allout/i.test(e.value + ' ' + (e.labels && e.labels[0] ? e.labels[0].textContent : e.textContent))).map(e => (e.name || e.parentElement.id) + '=' + e.value));
      console.log('allout options', opts);
      await p.evaluate(() => { const r = [...document.querySelectorAll('input[type=radio]')].find(e => e.value === 'allout' && /duo/i.test(e.name)); if (r) { r.click(); } });
      await p.waitForTimeout(2500);
    }
    const out = await p.evaluate(() => {
      const duo = document.querySelector('#duo, [data-bay=duo], .duo') ;
      const t = document.body.innerText;
      const pick = (re) => (t.match(re) || []).slice(0, 3);
      return {
        verdicts: [...document.querySelectorAll('.verdict')].map(e => e.textContent),
        walk: pick(/Walking drive is friction[^\n]*/g),
        heavier: pick(/Equal bodies on equal ground[^\n]*/g),
        feet: pick(/Feet hold[^\n]*\n?[^\n]*/g),
        chips: pick(/(Rex|Ollie) holds [^\n]*/g),
        math: [...document.querySelectorAll('details')].filter(d => /Show the math/.test(d.querySelector('summary')?.textContent || '')).map(d => d.textContent).filter(s => /footing = μ/.test(s)).map(s => s.match(/[^.]*footing = μ[^.]*\.[^.]*\./g)),
      };
    });
    console.log(act, JSON.stringify(out, null, 1));
  }
  // engine check
  const eng = await p.evaluate(() => {
    const P = window.DinoPhys, DD = window.DINO_DATA;
    const s = DD.surfaces.find(x => x.id === 'sand');
    return { mu: s.mu, keys: Object.keys(P).filter(k => /anchor|footing|body/i.test(k)) };
  });
  console.log(JSON.stringify(eng), errs);
  await b.close();
})();
