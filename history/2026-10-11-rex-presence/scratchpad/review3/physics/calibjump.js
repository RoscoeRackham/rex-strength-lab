const W = require('./pw.js');
(async () => {
  const base = { action: 'jump', build: 'human', H: 2, m: 180, logKg: 6 };
  const p = await W.open(base);
  await W.waitDone(p);
  const pick = async (val, extra) => {
    if (extra) { await p.evaluate((x) => { const s = JSON.parse(localStorage.getItem('rex-lab-v1')); Object.assign(s, x); localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, extra); }
    await p.selectOption('#effort', val); await p.waitForTimeout(200); await W.waitDone(p);
    const t = await W.bayText(p);
    return t.split('\n').filter(l => /Effort:|ceiling|Plaster|plaster|lands|jumps|At this effort/i.test(l)).slice(0, 12).map(l => '  ' + l.slice(0, 260)).join('\n');
  };
  console.log('--- preset plaster'); console.log(await pick('plaster'));
  console.log('--- ceiling'); console.log(await pick('ceiling'));
  // custom effort via the slider: set value and dispatch input
  for (const lg of [5.34, 5.6, 5.75]) {
    await p.evaluate((v) => { const s = document.querySelector('#effort-use'); s.value = String(v); s.dispatchEvent(new Event('input', { bubbles: true })); }, lg);
    await p.waitForTimeout(600); await W.waitDone(p);
    const t = await W.bayText(p);
    console.log('--- custom 10^' + lg + ' kg'); console.log(t.split('\n').filter(l => /Effort:|Plaster|plaster|jumps|Above the courtesy|At this effort/i.test(l)).slice(0, 10).map(l => '  ' + l.slice(0, 260)).join('\n'));
  }
  if (p.errs.length) console.log(p.errs);
  await W.close();
})();
