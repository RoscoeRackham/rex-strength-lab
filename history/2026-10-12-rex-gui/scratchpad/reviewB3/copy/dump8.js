const { open, view } = require('./h.js');
const fs = require('fs');
const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
(async () => {
  const { browser, page, errs } = await open();
  const out = {};
  for (const [k, st, tab, eff] of [
    ['col-stomp-unb-only-off', { colSrc: 'stomp', unbreakable: false }, 'collide', 'allout'],
    ['col-stomp-off', Object.assign({ colSrc: 'stomp' }, OFF), 'collide', 'allout'],
    ['col-jump-unb', { colSrc: 'jump' }, 'collide', 'allout'],
    ['col-jump-nounb', { colSrc: 'jump', unbreakable: false }, 'collide', 'allout'],
  ]) { out[k] = await view(page, st, tab, eff); console.log('done', k); fs.writeFileSync('dump8.json', JSON.stringify(out, null, 1)); }
  console.log('errs', errs);
  await browser.close();
})();
