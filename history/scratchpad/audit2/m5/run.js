const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  async function go(init, title) {
    const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
    await p.addInitScript((s) => { if (s && !sessionStorage.getItem('done')) { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); sessionStorage.setItem('done','1'); } }, init);
    await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await p.waitForTimeout(800);
    const btns = await p.$$('article.feat');
    for (const a of btns) {
      const t = await a.$eval('.t', (e) => e.textContent);
      if (t === title) { await (await a.$('button.run')).click(); break; }
    }
    await p.waitForTimeout(1200);
    const st = await p.evaluate(() => localStorage.getItem('rex-lab-v1'));
    const txt = await p.evaluate(() => { const r = document.querySelector('.rig'); return r ? r.innerText : document.body.innerText.slice(0, 3000); });
    console.log('=== ', title, JSON.stringify(init)); console.log('state', st); console.log(txt.slice(0, 2500));
    await p.close();
  }
  await go(null, 'Superman catches a 777');
  await go({ logKg: Math.log10(511), inf: false, mode: 'real', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'throw', obj: 'car', angle: 45 }, 'Hurdle a twenty-story building');
  await go({ logKg: 5, inf: false, mode: 'real', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'throw', obj: 'car', angle: 45 }, 'Hurdle a twenty-story building');
  await go(null, 'Hurdle a twenty-story building');
  await b.close();
})();
