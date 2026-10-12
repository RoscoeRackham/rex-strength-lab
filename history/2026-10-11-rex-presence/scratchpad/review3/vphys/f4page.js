const pw = require('./pw');
(async () => {
  const p = await pw.open({ build: 'human', H: 2, m: 180, action: 'jump', logKg: 6, surface: 'concrete' }, { wait: 5000 });
  const grab = async (tag) => {
    const lines = await p.evaluate(() => { document.querySelectorAll('#bay details').forEach((d) => (d.open = true)); return [...document.querySelectorAll('#bay .effort-read p, #bay .effort-read li, #bay select#effort')].map((e) => (e.tagName === 'SELECT' ? 'SELECT=' + e.value : e.innerText.replace(/\s+/g, ' '))); });
    console.log('--- ' + tag); for (const l of lines) console.log('  ', l.slice(0, 300));
  };
  await grab('least');
  for (const lk of [Math.log10(2.2e5), Math.log10(4e5)]) { await pw.setEffortLog(p, lk); await grab('custom ' + Math.pow(10, lk).toExponential(2)); }
  await p.selectOption('#effort', 'plaster'); await p.waitForTimeout(3000); await grab('preset plaster');
  console.log('errs', p.errs);
  await pw.close();
})();
