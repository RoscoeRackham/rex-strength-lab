// Compare every tab's result text between main's build and the branch build for a few saved states.
const { chromium, CHROME, wrap, settle, readResult, S } = require('./h.js');
const fs = require('fs');
const SOLO = ['walk', 'lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight'], DUO = ['arm', 'wrestle', 'catch', 'collide'];
const STATES = {
  def: {},
  bolted: { anchor: 'bolted', oAnchor: 'bolted' },
  rexBolted: { anchor: 'bolted' },
  real: { mode: 'real', surface: 'gravel' },
  shove: { wrestleMove: 'shove', wrestleWho: 'both', angle: 30 },
  wthrow: { wrestleMove: 'throw', wrestleWho: 'ollie', angle: 30, colMode: 'push' },
  lift: { wrestleMove: 'lift', anchor: 'bolted', cObj: 'partner' },
};
const EDITS = [
  [/^(Pushing straight across: )(rex|ollie)\b/, (m, a, b) => a + b.charAt(0).toUpperCase() + b.slice(1)],
  [/ \(plus a little claw or boot bite if dug in\): /g, ', and none at all if he is bolted (the sim keeps a bolted wrestler planted: he holds but doesn’t walk the other out) or too heavy to walk: '],
  [/A heavier body, or one dug in, wins\./g, 'A heavier body wins.'],
  [/footing = μ m g \(\+ shear × buried area if dug in; unlimited if bolted\)\./g, 'footing = μ m g (unlimited if bolted).'],
  [/Drive = min\(strength, μ m g \+ ¼ shear × buried area if dug in\);/g, 'Drive = min(strength, μ m g);'],
];
const edit = (t) => EDITS.reduce((x, [re, to]) => x.replace(re, to), t);
(async () => {
  const which = process.argv[2] || 'both';
  const browser = await chromium.launch({ executablePath: CHROME });
  const res = {};
  for (const [label, src, isNew] of [['main', S + '/main-dist.html', false], ['branch', S + '/work/rex-strength-lab/dist/index.html', true]]) {
    const url = wrap(src, label + '-eq.html');
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errs = [];
    page.on('pageerror', (e) => errs.push(e.message));
    await page.goto(url);
    res[label] = {};
    for (const [sk, st] of Object.entries(STATES)) {
      for (const tab of SOLO.concat(DUO)) {
        const duo = DUO.includes(tab);
        const s = Object.assign({}, st, duo ? (isNew ? { duoOpen: true, duoAction: tab } : { group: 'duo', duoAction: tab }) : (isNew ? { action: tab } : { group: 'solo', action: tab }));
        await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), s);
        await page.reload(); await page.waitForTimeout(500);
        const id = isNew && duo ? 'duo-bay' : 'bay';
        await settle(page, id); await page.waitForTimeout(100); await settle(page, id);
        res[label][sk + '/' + tab] = await readResult(page, id);
      }
    }
    if (errs.length) console.log(label, 'errors', errs.slice(0, 3));
    await page.close();
  }
  await browser.close();
  fs.writeFileSync(S + '/equiv.json', JSON.stringify(res, null, 1));
  let n = 0;
  for (const k of Object.keys(res.main)) {
    const a = res.main[k], b = res.branch[k];
    for (const f of Object.keys(a)) {
      const av = JSON.stringify(Array.isArray(a[f]) ? a[f].map((x) => x && edit(x)) : a[f] && edit(a[f])), bv = JSON.stringify(b[f]);
      if (av !== bv) { n++; console.log('DIFF ' + k + ' ' + f + '\n  main   ' + av.slice(0, 1500) + '\n  branch ' + bv.slice(0, 1500)); }
    }
  }
  console.log('diffs', n);
})().catch((e) => { console.error(e); process.exit(1); });
