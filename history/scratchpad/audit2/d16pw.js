const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const init of [
    { mode: 'real', logKg: Math.log10(511), inf: false, action: 'throw' },
    { mode: 'real', logKg: 20, inf: false, action: 'throw' },
    { mode: 'real', inf: true, logKg: 5, action: 'throw' },
    { mode: 'comic', logKg: Math.log10(511), inf: false, action: 'throw' },
  ]) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
    const p = await ctx.newPage();
    await p.addInitScript((s) => { try { const prev = JSON.parse(localStorage.getItem('rex-lab-v1') || 'null'); if (!prev) localStorage.setItem('rex-lab-v1', JSON.stringify(s)); } catch (e) {} }, init);
    await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await p.waitForTimeout(500);
    const before = await p.evaluate(() => localStorage.getItem('rex-lab-v1'));
    const card = p.locator('article.feat', { hasText: 'Hurdle a twenty-story building' });
    await card.locator('button.run').click();
    await p.waitForTimeout(800);
    const after = await p.evaluate(() => localStorage.getItem('rex-lab-v1'));
    const bay = await p.evaluate(() => { const r = document.querySelector('.rig'); return r ? r.innerText : 'no rig'; });
    console.log('=== init', JSON.stringify(init));
    console.log('before', before);
    console.log('after ', after);
    console.log(bay.slice(0, 2500));
    await p.screenshot({ path: 'd16_' + init.mode + '_' + (init.inf ? 'inf' : init.logKg.toFixed(1)) + '.png' });
    await ctx.close();
  }
  await b.close();
})();
