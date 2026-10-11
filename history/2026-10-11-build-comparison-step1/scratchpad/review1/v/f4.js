const R = process.argv[2];
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage();
  await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await p.goto('file://' + R + '/wrapped.html'); await p.waitForTimeout(2500);
  const r = await p.evaluate(() => ['ansur2_m_p5','ansur2_m_p50','ansur2_m_p95'].map(id => { const e = window.__bc.LIST.find(x => x.id === id);
     return id + ' H=' + e.height.value + ' W=' + e.mass.value.toFixed(2) + ' fat=' + e.bodyFat.value.toFixed(1) + ' (' + (e.bodyFat.lo||'') + '-' + (e.bodyFat.hi||'') + ') S=' + e.score.value.toFixed(2) + ' W/H3=' + (e.mass.value/Math.pow(e.height.value,3)).toFixed(2) + ' S@25.3%=' + (1.8*e.mass.value*(1-0.253)/Math.pow(e.height.value,3)).toFixed(2) + ' waist=' + e.girths.waist.value; }));
  console.log(r.join('\n'));
  const t = await p.evaluate(() => document.getElementById('under25').innerText.slice(0, 600));
  console.log(t);
  await b.close();
})();
