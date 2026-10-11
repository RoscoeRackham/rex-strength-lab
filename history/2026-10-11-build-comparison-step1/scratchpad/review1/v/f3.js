const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = __dirname;
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await p.goto('file://' + S + '/wrapped.html');
  await p.waitForTimeout(3000);
  for (const [shape, t] of [['ansur2_m_p50', 42.42], ['ansur2_m_p50', 217], ['ansur2_m_p50', 600], ['ansur2_m_p50', 900], ['ronnie_coleman', 217], ['ronnie_coleman', 600], ['ronnie_coleman', 900], ['ansur2_m_p50', 60]]) {
    await p.selectOption('#tShape', shape);
    await p.fill('#tTarget', String(t));
    await p.click('#targetBtn');
    await p.waitForFunction(() => !/Drawing/.test(document.getElementById('targetStatus').textContent), null, { timeout: 120000 });
    const st = await p.textContent('#targetStatus');
    console.log(shape, t, '=>', st);
  }
  await b.close();
})();
