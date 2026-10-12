const H = require('./vh.js');
(async () => {
  const p = await H.open({ group: 'solo', action: 'weight' });
  await H.settle(p);
  const btns = await p.evaluate(() => [...document.querySelectorAll('#bay button, #bay .chip')].map((b) => b.innerText + '|' + (b.dataset.s || b.dataset.v || '')).join(' ; '));
  console.log(btns.slice(0, 600));
  await p.locator('#bay .chip', { hasText: 'Krakatoa' }).first().click();
  await p.waitForTimeout(300);
  const t = await p.evaluate(() => document.querySelector('.growth-whatif').innerText);
  console.log(t);
  await p.evaluate(() => { document.querySelector('#comic-setup').open = true; });
  await H.sel(p, '#absorb', 'gradual');
  console.log('---- gradual');
  console.log(await p.evaluate(() => document.querySelector('.growth-whatif').innerText));
  await p.close(); await H.close();
})();
