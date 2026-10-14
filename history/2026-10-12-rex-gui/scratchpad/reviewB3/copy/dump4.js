const { open, view } = require('./h.js');
const fs = require('fs');
const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
(async () => {
  const { browser, page, errs } = await open();
  const out = {};
  const grab = async (st, tab, eff) => { const t = await view(page, st, tab, eff); const a = t.indexOf('Adjust effort'); const b = t.indexOf('REX\n'); return t.slice(a, b > 0 ? b : a + 2000) + '\n...VERDICT: ' + t.slice(t.indexOf('VS\nOLLIE'), t.indexOf('VS\nOLLIE') + 900); };
  const setups = {
    collide: {}, collideBolt: { anchor: 'bolted' }, collideJump: { anchor: 'bolted', colSrc: 'jump', logKg: 6 },
    catchFast: { cStyle: 'hard', cObj: 'baseball' }, catchFastBig: { cStyle: 'hard', cObj: 'baseball', logKg: 8 },
    wrestleShove: { wrestleMove: 'shove' }, wrestleThrow: { wrestleMove: 'throw' }, wrestlePush: { wrestleMove: 'push' }, armBig: { logKg: 8 },
  };
  for (const [name, st] of Object.entries(setups)) {
    const tab = name.startsWith('collide') ? 'collide' : name.startsWith('catch') ? 'catch' : name.startsWith('wrestle') ? 'wrestle' : 'arm';
    for (const eff of ['rattle', 'plaster', 'windows', 'ground', 'houses', 'block']) {
      out[name + '/' + eff] = await grab(st, tab, eff);
      out[name + '/' + eff + '/off'] = await grab(Object.assign({}, st, OFF), tab, eff);
    }
    console.log('done', name);
    fs.writeFileSync('dump4.json', JSON.stringify(out, null, 1));
  }
  console.log('errs', errs);
  await browser.close();
})();
