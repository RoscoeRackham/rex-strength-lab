// node run.js scen.js -> writes txt/<name>.txt
const H = require('./h.js'); const fs = require('fs');
const SOLO = ['walk', 'lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight'];
(async () => {
  const scen = require(require('path').resolve(process.argv[2]));
  const page = await H.open(1280, 900);
  for (const s of scen) {
    const st = Object.assign({}, s.st || {});
    const duo = !SOLO.includes(s.tab);
    if (duo) { st.duoAction = s.tab; st.duoOpen = true; } else st.action = s.tab;
    await H.load(page, st);
    if (s.effort) { await page.selectOption('#effort', s.effort); await H.settle(page); }
    if (s.duoEffort) { await page.selectOption('#duo-effort', s.duoEffort); await H.settle(page); }
    if (s.pre) { await page.evaluate(s.pre); await H.settle(page); }
    const t = await H.fullText(page, duo ? '#duo-bay' : '#bay');
    fs.writeFileSync(H.DIR + '/txt/' + s.name + '.txt', t);
    console.log('==== ' + s.name + (page.errs.length ? ' ERRS ' + page.errs.join('|') : ''));
    page.errs.length = 0;
  }
  await H.close();
})();
