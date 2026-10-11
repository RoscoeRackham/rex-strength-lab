const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await p.waitForTimeout(800);
  const feat = p.locator('article.feat', { hasText: 'Atlas holds up the heavens' });
  await feat.locator('button.run').click();
  await p.waitForTimeout(800);
  const txt = await p.evaluate(() => {
    const v = document.querySelector('.verdict'); const s = document.querySelector('.status-row');
    return { verdict: v && v.innerText, status: s && s.innerText, ls: localStorage.getItem('rex-lab-v1') };
  });
  console.log(JSON.stringify(txt, null, 1));
  // also check strength readout
  const dial = await p.evaluate(() => { const e = document.querySelector('#strength'); return e && e.value; });
  console.log('slider', dial);
  await p.screenshot({ path: '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/r13_atlas.png', fullPage: false });
  // Compare other exact-mass feats
  for (const t of ['511 kg deadlift','2,422 kg back lift','The car on the cover','Hulk holds up a mountain range','200 quintillion tons','Bench-pressing the planet']) {
    await p.locator('article.feat', { hasText: t }).locator('button.run').click();
    await p.waitForTimeout(300);
    const v = await p.evaluate(() => document.querySelector('.verdict').innerText + ' || ' + document.querySelector('.status-row').innerText);
    console.log(t, '=>', v.replace(/\n/g,' '));
  }
  await b.close();
})();
