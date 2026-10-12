const W = require('./pw.js');
(async () => {
  const p = await W.open({ action: 'jump', softLanding: true });
  // absorb mode resets each load: set via the UI select
  const sels = await p.evaluate(() => [...document.querySelectorAll('select')].map(s => s.id + ':' + [...s.options].map(o => o.value).join('/')));
  console.log(sels.join('\n'));
  await W.waitDone(p);
  let t = await W.bayText(p);
  console.log(t.split('\n').filter(l => /Soft landing|absorbed|Landing on|Effort|lands|Comes back/i.test(l)).join('\n'));
  const r = await p.evaluate(() => { const P = window.DinoPhys; return null; });
  await W.close();
})();
