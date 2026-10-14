// node dump.js '<json state>' outprefix [effortValue] [duoEffortValue]
const H = require('./harness.js'), fs = require('fs');
(async () => {
  const st = JSON.parse(process.argv[2] || '{}'), pre = process.argv[3] || 'out', eff = process.argv[4], deff = process.argv[5];
  const c = await H.open();
  await H.load(c, st);
  if (eff) await H.pickEffort(c.page, '#effort', eff);
  if (deff && st.duoOpen) await H.pickEffort(c.page, '#duo-effort', deff);
  const t = await H.texts(c.page);
  fs.writeFileSync(pre + '.solo.txt', t.solo); if (t.duo) fs.writeFileSync(pre + '.duo.txt', t.duo);
  if (c.errs.length) console.log('ERRS', c.errs);
  await c.browser.close();
})();
