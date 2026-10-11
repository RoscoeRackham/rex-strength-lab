const { open, close } = require('./h.js');
(async () => {
  const { page, ctx } = await open({ w: 1280, h: 900, state: { action: 'lift', obj: 'piano' } });
  await page.evaluate(() => { const s = document.querySelector('#strength'); s.value = 2.68; s.dispatchEvent(new Event('input')); });
  let s = await page.evaluate(() => window.__snap());
  console.log('piano @2.68:', JSON.stringify({ dial: s.dial[0], verdict: s.verdict, chips: s.chips }));
  await page.locator('#bay').screenshot({ path: 'l06-piano.png' });
  // Atlas feat
  await page.evaluate(() => [...document.querySelectorAll('.feat')].find(f => f.textContent.includes('Atlas')).querySelector('.run').click());
  await page.waitForTimeout(300);
  s = await page.evaluate(() => window.__snap());
  console.log('Atlas:', JSON.stringify({ dial: s.dial[0], verdict: s.verdict, chips: s.chips }));
  // other feats: all run buttons
  const feats = await page.evaluate(() => [...document.querySelectorAll('.feat')].filter(f => f.querySelector('.run')).map(f => f.querySelector('.t').textContent));
  for (const t of feats) {
    await page.evaluate((t) => [...document.querySelectorAll('.feat')].find(f => f.querySelector('.t').textContent === t).querySelector('.run').click(), t);
    await page.waitForTimeout(150);
    s = await page.evaluate(() => window.__snap());
    console.log('FEAT', t, '|', s.dial[0], '|', s.dial[2], '|', s.verdict, '|', s.chips.join(' ; '));
  }
  // throw cant-move wording
  await ctx.close(); await close();
})();
