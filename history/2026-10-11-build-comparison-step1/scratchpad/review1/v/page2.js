const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = __dirname;
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await p.goto('file://' + S + '/wrapped.html');
  await p.waitForTimeout(2500);
  const r = await p.evaluate(() => {
    const bc = window.__bc;
    const bands = bc.SEQ.filter(s => s.kind === 'band').map(s => ({ id: s.id, tag: s.tag, lims: (s.limits||[]).map(L => L.id + ' ' + L.score) }));
    const notes = Array.from(document.querySelectorAll('.limitnote')).map(n => n.innerText);
    const endRule = document.getElementById('real-men-end'); 
    return { bands, notes, endRule: endRule ? endRule.innerText.slice(0, 400) : null, limitsSec: document.getElementById('limits').innerText.slice(0, 2500) };
  });
  console.log(JSON.stringify(r, null, 1));
  await b.close();
})();
