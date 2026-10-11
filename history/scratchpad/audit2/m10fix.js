const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  p.on('pageerror', e => console.log('PAGEERR', e.message));
  await p.addInitScript(() => { if (!sessionStorage.getItem('done')) { sessionStorage.setItem('done','1'); localStorage.setItem('rex-lab-v1', JSON.stringify({logKg: Math.log10(5.1e18)+1e-12, inf:false, mode:'comic', surface:'concrete', groundHolds:false, anchor:'friction', H:2, m:180, action:'lift', obj:'sky', angle:45})); } });
  await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await p.waitForTimeout(800);
  const feats = await p.$$('article.feat');
  for (const f of feats) {
    const t = await f.$eval('.t', e => e.textContent);
    if (false) { await (await f.$('button.run')).click(); break; }
  }
  await p.waitForTimeout(800);
  const out = await p.evaluate(() => {
    const v = document.querySelector('.verdict');
    const chips = [...document.querySelectorAll('.status-row')].slice(0,1).map(r => r.innerText);
    return { verdict: v && v.innerText, chips, dial: (document.querySelector('#dial-who')||{}).textContent, st: localStorage.getItem('rex-lab-v1') };
  });
  console.log(JSON.stringify(out, null, 1));
  await p.screenshot({ path: '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/m10fix.png' });
  await b.close();
})();
