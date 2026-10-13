// broad sweep: tabs x power combos x dials x efforts; flags NaN/undefined/bare Infinity, 'Calculation failed', console errors
const { open } = require('./pw.js');
const bad = (t) => (t.match(/NaN|undefined|(?<![∞\w])Infinity|Calculation failed/g) || []);
(async () => {
  const W = await open(process.argv[2]);
  const combos = { on: {}, off: { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false }, half: { airAbsorb: 0.5 }, recoilOnly: { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: true }, ubOnly: { airAbsorb: 0, keepForm: false, unbreakable: true, ownRecoil: false } };
  const solo = process.argv[3] !== 'duo';
  const issues = [];
  let n = 0;
  if (solo) {
    for (const tab of ['throw', 'jump', 'stomp', 'punch', 'sprint', 'pull', 'clap']) for (const [cn, cv] of Object.entries(combos)) for (const lk of [3, 9, 'inf']) for (const eff of ['least', 'ground', 'block', 'plaster']) for (const extra of tab === 'throw' ? [{ obj: 'car', angle: 45 }, { obj: 'baseball', angle: 0 }, { obj: 'person', angle: 30 }] : [{}]) for (const sf of ['concrete', 'sand', 'ice']) {
      if (sf !== 'concrete' && (lk !== 9 || eff === 'block')) continue;
      const st = Object.assign({ action: tab, surface: sf }, lk === 'inf' ? { inf: true } : { logKg: lk }, cv, extra);
      try {
        await W.load(st);
        if (eff !== 'least') await W.pick('#effort', eff);
        const t = await W.text('#bay'); n++;
        const b = bad(t);
        if (b.length || W.errs.length) issues.push(JSON.stringify(st) + ' eff=' + eff + ': ' + b.join(',') + ' ' + W.errs.splice(0).join(' | ').slice(0, 200) + ' :: ' + (t.match(/[^.]{0,80}(NaN|undefined|Infinity|Calculation failed)[^.]{0,80}/) || [''])[0]);
      } catch (e) { issues.push(JSON.stringify(st) + ' eff=' + eff + ' THREW ' + e.message.slice(0, 200)); }
    }
  } else {
    for (const tab of ['arm', 'wrestle-push', 'wrestle-shove', 'wrestle-lift', 'wrestle-throw', 'catch', 'catch-partner', 'collide', 'collide-push']) for (const [cn, cv] of Object.entries(combos)) for (const lk of [5, 'inf']) for (const eff of ['least', 'ground', 'plaster', 'block']) for (const anc of ['friction', 'bolted']) {
      const [a, sub] = tab.split('-');
      const extra = a === 'wrestle' ? { wrestleMove: sub } : a === 'catch' && sub ? { cObj: 'partner' } : a === 'collide' && sub ? { colMode: 'push' } : {};
      const st = Object.assign({ duoOpen: true, duoAction: a, anchor: anc }, lk === 'inf' ? { inf: true } : { logKg: lk }, cv, extra);
      try {
        await W.load(st, 'duo-bay'); await W.settle('duo-bay');
        if (eff !== 'least') await W.pick('#duo-effort', eff, 'duo-bay');
        const t = await W.text('#duo-bay'); n++;
        const b = bad(t);
        if (b.length || W.errs.length) issues.push(JSON.stringify(st) + ' eff=' + eff + ': ' + b.join(',') + ' ' + W.errs.splice(0).join(' | ').slice(0, 200) + ' :: ' + (t.match(/[^.]{0,80}(NaN|undefined|Infinity|Calculation failed)[^.]{0,80}/) || [''])[0]);
      } catch (e) { issues.push(JSON.stringify(st) + ' eff=' + eff + ' THREW ' + e.message.slice(0, 200)); }
    }
  }
  console.log(n, 'states;', issues.length, 'issues');
  for (const i of issues) console.log(i);
  await W.close();
})();
