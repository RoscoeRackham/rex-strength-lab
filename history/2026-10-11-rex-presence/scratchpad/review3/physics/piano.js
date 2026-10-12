const W = require('./pw.js');
(async () => {
  const p = await W.open({ action: 'throw', obj: 'piano', surface: 'gravel', mode: 'real', logKg: 7 });
  await W.waitDone(p);
  await p.selectOption('#effort', 'ceiling'); await p.waitForTimeout(200); await W.waitDone(p);
  let t = await W.bayText(p);
  console.log('--- ceiling'); console.log(t.split('\n').filter(l => /Effort:|ceiling|Grip|crush|Hazards checked|None of the hazards/i.test(l)).slice(0, 10).map(l => '  ' + l.slice(0, 300)).join('\n'));
  await p.evaluate((v) => { const s = document.querySelector('#effort-use'); s.value = String(v); s.dispatchEvent(new Event('input', { bubbles: true })); }, Math.log10(5.5e5));
  await p.waitForTimeout(800); await W.waitDone(p);
  t = await W.bayText(p);
  console.log('--- custom 5.5e5 kg'); console.log(t.split('\n').filter(l => /Effort:|ceiling|Grip|crush|punch through|Above/i.test(l)).slice(0, 10).map(l => '  ' + l.slice(0, 300)).join('\n'));
  await W.close();
})();
