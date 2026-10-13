const { open, view, SOLO } = require('./h.js');
const fs = require('fs');
(async () => {
  const { browser, page, errs } = await open();
  const out = {};
  for (const tab of SOLO.concat(['arm', 'wrestle', 'catch', 'collide'])) {
    for (const eff of [null, 'allout']) {
      out[tab + '/' + (eff || 'least')] = await view(page, {}, tab, eff);
    }
  }
  fs.writeFileSync('dump1.json', JSON.stringify(out, null, 1));
  console.log('errs', errs);
  await browser.close();
})();
