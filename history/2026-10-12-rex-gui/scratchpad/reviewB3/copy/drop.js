process.env.DIST = __dirname + '/index-drop.html'; process.env.PREVNAME = 'prev-drop.html';
const { open, view, SOLO } = require('./h.js');
const fs = require('fs');
const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
(async () => {
  const { browser, page, errs } = await open();
  const res = [];
  const dials = [Math.log10(90718), 6, 8, 10, 14, Math.log10(1.8e23)];
  const tabs = SOLO.concat(['arm', 'wrestle', 'catch', 'collide']);
  const variants = [{}, { airAbsorb: 0.5 }, { surface: 'sand' }, { anchor: 'bolted' }];
  for (const tab of tabs) for (const lk of dials) for (const v of variants) {
    const extraSets = tab === 'wrestle' ? [{ wrestleMove: 'shove' }, { wrestleMove: 'throw' }, { wrestleMove: 'lift' }] : tab === 'catch' ? [{ cStyle: 'hard' }, { cObj: 'partner' }] : tab === 'collide' ? [{}, { colSrc: 'jump' }] : tab === 'throw' ? [{}, { obj: 'baseball', angle: 0 }] : [{}];
    for (const ex of extraSets) {
      const st = Object.assign({ logKg: lk }, v, ex);
      await view(page, st, tab, SOLO.includes(tab) && ['walk', 'lift', 'weight'].includes(tab) ? null : 'allout');
      const d = await page.evaluate(() => { const x = window.__dropped || []; window.__dropped = []; return x; });
      for (const x of d) res.push({ st, tab, x });
    }
  }
  fs.writeFileSync('drop.json', JSON.stringify(res, null, 1));
  console.log('dropped sets', res.length, 'errs', errs.length);
  await browser.close();
})();
