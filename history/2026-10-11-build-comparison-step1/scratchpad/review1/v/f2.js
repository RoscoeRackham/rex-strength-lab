const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = __dirname;
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await p.goto('file://' + S + '/wrapped.html');
  await p.waitForTimeout(2500);
  const r = await p.evaluate(() => {
    const bc = window.__bc, D = window.COMPARE_DATA, T = D.outline, out = [];
    bc.LIST.filter(e => e.score.value > 0 && e.score.value <= 33 && e.girths && e.girths.chest).forEach(e => {
      const g = {}; window.BuildCalc.SITES.forEach(s => g[s] = e.girths[s].value);
      const mk = (deg) => window.Figure.human(T, e.height.value, g, {}, { buttockFit: window.BuildCalc.FRUSTUM.M.buttock, armDeg: deg });
      const fig = mk(20);
      out.push(e.id.padEnd(22) + ' S ' + e.score.value.toFixed(1) + ' armRest ' + window.Figure.armRestAngle(mk).toFixed(1) + ' thighTouch ' + window.Figure.thighContact(fig).toFixed(2));
    });
    // also the p50 at own height and a few lower ones
    ['ansur2_m_p50','ansur2_m_p95','steve_reeves_1947','arnold_schwarzenegger','ansur2_m_largest_arm'].forEach(id => { const e = bc.LIST.find(x => x.id === id); if (!e) return; const g = {}; window.BuildCalc.SITES.forEach(s => g[s] = e.girths[s].value);
      const mk = (deg) => window.Figure.human(T, e.height.value, g, {}, { buttockFit: window.BuildCalc.FRUSTUM.M.buttock, armDeg: deg });
      out.push(e.id.padEnd(22) + ' S ' + e.score.value.toFixed(1) + ' armRest ' + window.Figure.armRestAngle(mk).toFixed(1) + ' thighTouch ' + window.Figure.thighContact(mk(20)).toFixed(2)); });
    return out;
  });
  console.log(r.join('\n'));
  await b.close();
})();
