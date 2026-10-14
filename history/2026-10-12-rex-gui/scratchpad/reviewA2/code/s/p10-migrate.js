// saved-state migration and validators
const { wrap, launch, S } = require('./h.js');
const path = require('path');
const CASES = [
  ['{"duoOpen":"true"}'], ['{"duoOpen":1}'], ['{"group":"duo","duoOpen":false}'], ['{"group":"duo","duoAction":"bogus"}'],
  ['{"anchor":"braced","oAnchor":"bolted"}'], ['{"anchor":"dug","oAnchor":null}'], ['{"angle":30}'], ['{"angle":30,"wAngle":95}'], ['{"angle":"x"}'],
  ['{"wAngle":60}'], ['5'], ['"abc"'], ['[1,2]'], ['null'], ['{bad json'], ['{"group":"duo","duoOpen":"no"}'],
];
(async () => {
  const b = await launch(); const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto(wrap(path.join(S, 'lab/dist/index.html'), 'new'));
  for (const [raw] of CASES) {
    errs.length = 0;
    await p.evaluate((r) => localStorage.setItem('rex-lab-v1', r), raw);
    await p.reload(); await p.waitForTimeout(600);
    const r = await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('rex-lab-v1')); return { open: document.getElementById('duo').open, duoOpen: s.duoOpen, group: s.group, duoAction: s.duoAction, anchor: s.anchor, oAnchor: s.oAnchor, angle: s.angle, wAngle: s.wAngle, boltRex: document.getElementById('bolt-rex').checked, boltOllie: document.getElementById('bolt-ollie').checked, junk: Object.keys(s).filter((k) => /^\d+$/.test(k)) }; });
    console.log(raw.padEnd(40), JSON.stringify(r), errs.length ? 'ERRORS ' + errs.join(' | ') : '');
  }
  await b.close();
})();
