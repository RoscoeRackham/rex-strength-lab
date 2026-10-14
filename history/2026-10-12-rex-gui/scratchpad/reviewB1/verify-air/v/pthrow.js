const { withPage, grab } = require('./page.js');
const fs = require('fs');
(async () => {
  const errs = await withPage(async (page, load) => {
    const LK = Math.log10(1.81436948e23);
    const runs = [
      ['k0_keepOff', { action: 'throw', obj: 'baseball', angle: 0, logKg: LK, airAbsorb: 0, keepForm: false }],
      ['k0_keepOn', { action: 'throw', obj: 'baseball', angle: 0, logKg: LK, airAbsorb: 0, keepForm: true }],
      ['k50_keepOn', { action: 'throw', obj: 'baseball', angle: 0, logKg: LK, airAbsorb: 0.5, keepForm: true }],
      ['k100', { action: 'throw', obj: 'baseball', angle: 0, logKg: LK }],
    ];
    for (const [name, st] of runs) {
      await load(st, 'allout');
      const t = await page.evaluate(() => document.body.innerText);
      fs.writeFileSync(__dirname + '/throw_' + name + '.txt', t);
      const m = t.match(/Past about 1% of light speed[^\n]*/) || t.match(/Air resistance absorbed: with all of its drag[^\n]*/);
      console.log('=====', name, '\n', m ? m[0] : '(none)');
      const blast = t.match(/[^\n]*(blast|fireball)[^\n]*TNT[^\n]*/gi);
      console.log('  blast lines:', (blast || []).slice(0, 4).join('\n   '));
    }
  });
  console.log('errors', errs);
})();
