const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const D = __dirname;
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file://' + D + '/branch.html');
  await p.evaluate(() => { localStorage.setItem('rex-lab-v1', JSON.stringify({ anchor: 'bolted', oAnchor: 'bolted', duoOpen: true, duoAction: 'collide', colMode: 'charge', colSrc: 'set', colGB: -4, surface: 'concrete' })); });
  await p.reload(); await p.waitForTimeout(2500);
  const out = await p.evaluate(() => {
    const t = document.body.innerText;
    const find = (re) => { const m = t.match(re); return m ? m[0] : null; };
    const st = JSON.parse(localStorage.getItem('rex-lab-v1'));
    return {
      state: { anchor: st.anchor, oAnchor: st.oAnchor, duoOpen: st.duoOpen, duoAction: st.duoAction, colGB: st.colGB, surface: st.surface, colWho: st.colWho, colSrc: st.colSrc, groundHolds: st.groundHolds },
      verdict: find(/Too fast for the planet[^\n]*/),
      chip: find(/Too fast for the bolts to help/),
      card: find(/“Bolted to the planet” stops him[^\n]*/),
      hint: find(/On, nothing can slide[^\n]*/),
    };
  });
  console.log(JSON.stringify(out, null, 1));
  // engine directly
  const eng = await p.evaluate(() => Object.keys(window.DinoPhys).filter(k => /collide/i.test(k)));
  console.log('engine fns', eng, 'errors', errs);
  await b.close();
})();
