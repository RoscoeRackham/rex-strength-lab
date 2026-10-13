const { open, view } = require('./h.js');
const fs = require('fs');
(async () => {
  const { browser, page, errs } = await open();
  const out = {};
  for (const sh of [0, 0.1, 0.5, 0.99]) for (const d of [1, 3]) {
    const k = 'share' + sh + '-logD' + d;
    const t = await view(page, { cStyle: 'hard', cObj: 'baseball', logKg: Math.log10(1.8e23), airAbsorb: sh, cLogD: d }, 'catch', 'allout');
    const i = t.indexOf('Just standing', t.indexOf('VS\nOLLIE')); out[k] = t.slice(i + 14, i + 900);
    const j = t.indexOf('Air resistance absorbed: their power'); out[k] += '\n..ITEM: ' + (j > 0 ? t.slice(j, j + 260) : 'none');
    console.log('=====', k); console.log(out[k]);
  }
  console.log('errs', errs);
  await browser.close();
})();
