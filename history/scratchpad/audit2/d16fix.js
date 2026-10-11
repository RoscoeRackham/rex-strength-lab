const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const f of ['fixA.html', 'fixB.html']) for (const init of [
    { mode: 'real', logKg: Math.log10(511), inf: false, action: 'throw', H: 2, m: 180, groundHolds: false },
    { mode: 'real', logKg: Math.log10(511), inf: false, action: 'throw', H: 50, m: 180*Math.pow(25,3), groundHolds: false },
  ]) {
    const ctx = await b.newContext();
    const p = await ctx.newPage();
    await p.addInitScript((s) => { if (!localStorage.getItem('rex-lab-v1')) localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, init);
    await p.goto('file://' + process.cwd() + '/' + f);
    await p.waitForTimeout(400);
    await p.locator('article.feat', { hasText: 'Hurdle a twenty-story building' }).locator('button.run').click();
    await p.waitForTimeout(600);
    const st = JSON.parse(await p.evaluate(() => localStorage.getItem('rex-lab-v1')));
    const head = await p.evaluate(() => { const t = document.querySelector('.rig').innerText; const i = t.indexOf('PULL'); return t.slice(i + 4, i + 80).trim(); });
    console.log(f, 'H', init.H, '-> mode', st.mode, 'kg', Math.pow(10, st.logKg).toExponential(3), '|', head.split('\n')[0]);
    await ctx.close();
  }
  await b.close();
})();
