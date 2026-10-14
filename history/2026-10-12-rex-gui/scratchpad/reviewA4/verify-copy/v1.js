const { open } = require('./h');
(async () => {
  const base = { anchor: 'bolted', oAnchor: 'bolted', duoOpen: true, duoAction: 'collide', colMode: 'charge', colSrc: 'set', colGB: -4, surface: 'concrete' };
  let browser;
  for (const gh of [false, true]) {
    const r = await open(Object.assign({}, base, { groundHolds: gh }), { browser, wait: 4000 });
    browser = r.browser;
    const out = await r.page.evaluate(() => {
      const bay = document.querySelector('#duo-bay');
      const v = bay.querySelector('.verdict, .big, p');
      const chips = [...bay.querySelectorAll('.chip, .status')].map(c => c.textContent.trim());
      const hint = [...document.querySelectorAll('.hint')].find(h => h.textContent.includes('On, a push along'));
      const gh = document.querySelector('#ground-holds').checked;
      return { gh, verdictText: (bay.innerText.split('\n').filter(l => /Too fast|budge|move off|Bolted:|Comic ground:/.test(l))), hint: hint && hint.textContent };
    });
    console.log(JSON.stringify(out, null, 1));
    await r.ctx.close();
  }
  // Newton card text
  const r = await open(null, { browser });
  const card = await r.page.evaluate(() => { const all = [...document.querySelectorAll('*')].filter(e => e.children.length < 3 && /stops a push sliding/.test(e.textContent)); return all.map(e => e.textContent.trim()).sort((a,b)=>a.length-b.length)[0]; });
  console.log('CARD:', card);
  await browser.close();
})();
