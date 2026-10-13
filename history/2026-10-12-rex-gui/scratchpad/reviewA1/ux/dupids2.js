const { NEW, launch } = require('./common');
(async () => {
  const b = await launch();
  const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const SOLO = ['walk', 'lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight'];
  const states = [{ duoAction: 'collide', colMode: 'push' }, { duoAction: 'collide', colSrc: 'jump' }, { duoAction: 'catch', cObj: 'partner' }, { duoAction: 'arm', duoEffort: 'custom' }, { duoAction: 'catch' }];
  const found = {};
  for (const st of states) for (const s of SOLO) {
    await page.goto(NEW()); await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(Object.assign({ duoOpen: true, action: x.s, effort: 'custom' }, x.st))), { st, s }); await page.reload(); await page.waitForTimeout(1500);
    await page.evaluate(() => { for (const d of document.querySelectorAll('#bay details, #duo-bay details')) d.open = true; });
    const dups = await page.evaluate(() => { const c = {}; for (const n of document.querySelectorAll('[id]')) c[n.id] = (c[n.id] || 0) + 1; return Object.keys(c).filter((k) => c[k] > 1); });
    for (const id of dups) (found[id] = found[id] || new Set()).add(s + '+' + JSON.stringify(st));
  }
  for (const k of Object.keys(found)) console.log(k, found[k].size, 'combos, e.g.', [...found[k]].slice(0, 2).join(' | '));
  await b.close();
})();
