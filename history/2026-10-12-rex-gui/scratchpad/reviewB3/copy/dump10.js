const { open, view, settle } = require('./h.js');
const fs = require('fs');
(async () => {
  const { browser, page, errs } = await open();
  const out = {};
  for (const [k, st, mode, what] of [['inst-unb', {}, 'instant', 'krakatoa'], ['inst-real', { unbreakable: false }, 'instant', 'krakatoa'], ['grad-unb', {}, 'gradual', 'krakatoa']]) {
    out[k] = await view(page, st, 'weight', null, async (pg) => {
      await pg.evaluate(() => { document.getElementById('powers').open = true; });
      await pg.selectOption('#absorb', mode); await settle(pg);
      const btn = await pg.$$('button'); 
      await pg.evaluate((what) => { const b = Array.from(document.querySelectorAll('#bay button, #bay [role=radio], #bay .chip')).find((n) => /Dinosaur-killer/.test(n.textContent)); if (b) b.click(); }, what);
    });
  }
  fs.writeFileSync('dump10.json', JSON.stringify(out, null, 1));
  console.log('errs', errs);
  await browser.close();
})();
