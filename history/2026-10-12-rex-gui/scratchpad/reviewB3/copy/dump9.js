process.env.DIST = __dirname + '/index-drop.html'; process.env.PREVNAME = 'prev-drop.html';
const { open, view } = require('./h.js');
const fs = require('fs');
(async () => {
  const { browser, page, errs } = await open();
  const out = {};
  for (const [k, st, tab, eff] of [
    ['catch-fast-default', { cStyle: 'hard', cObj: 'baseball' }, 'catch', null],
    ['catch-fast-default-off', { cStyle: 'hard', cObj: 'baseball', airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false }, 'catch', null],
  ]) { out[k] = await view(page, st, tab, eff); out[k + '/dropped'] = await page.evaluate(() => { const x = (window.__dropped || []).filter((d) => d.tab === 'catch'); window.__dropped = []; return x; }); }
  fs.writeFileSync('dump9.json', JSON.stringify(out, null, 1));
  console.log('errs', errs);
  await browser.close();
})();
