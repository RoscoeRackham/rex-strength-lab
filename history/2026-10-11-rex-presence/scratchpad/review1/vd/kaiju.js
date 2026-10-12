const { open } = require('./pw.js');
const { P, rex, surf } = require('./base.js');
(async () => {
  const H = 50, m = 3007 * Math.pow(50 / 3.048, 3);
  const s = await open({ state: { H, m, inf: true, action: 'walk' } });
  await s.tab('walk'); await s.openAll();
  const t = await s.bay();
  console.log(t.split('\n').filter((l) => /Load:|Pace:/.test(l)).join('\n'));
  const b = P.makeBody({ build: 'rex', H, m });
  const st = P.walkStep(b, surf('concrete'), { effort: 0.5 });
  console.log('engine heel v', (0.57 * Math.sqrt(st.h / 0.9)).toFixed(2), 'T ordinary', st.Tpulse.toFixed(3));
  await s.browser.close();
})();
