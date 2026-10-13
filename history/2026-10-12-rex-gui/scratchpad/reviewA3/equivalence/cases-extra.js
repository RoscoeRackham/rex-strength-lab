// Extra cases: braced migration, saved group 'duo', the element closed, and a 390 px subset.
const fs = require('fs');
const path = require('path');
const all = JSON.parse(fs.readFileSync(path.join(__dirname, 'cases.json'), 'utf8'));
const SOLO = ['walk', 'lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight'];
const DUO = ['arm', 'wrestle', 'catch', 'collide'];
const out = [];
// 1. braced migration: main saved braced, main saved friction, branch saved braced, branch saved friction
const bases = [
  { surface: 'concrete', logKg: 7 }, { surface: 'sand', logKg: 5 }, { surface: 'granite', logKg: 12, mode: 'real' }, { surface: 'ice', logKg: 4.96 },
  { surface: 'softclay', logKg: 6, groundHolds: true }, { surface: 'stiffclay', logKg: 9, wrestleMove: 'shove', wrestleWho: 'both' },
  { surface: 'gravel', logKg: 8, wrestleMove: 'lift', wrestleWho: 'ollie', colMode: 'push' }, { surface: 'asphalt', logKg: 6, wrestleMove: 'push', colSrc: 'set', colGB: -6 },
  { surface: 'concrete', inf: true, logKg: 10 }, { surface: 'steel', logKg: 3, H: 2, m: 180, build: 'human' },
  { surface: 'sand', logKg: 10, wrestleMove: 'throw', colWho: 'rex' }, { surface: 'granite', logKg: 15, cObj: 'car', cStyle: 'hard', colBounce: 'bounce' },
];
const combos = [['braced', 'friction'], ['friction', 'braced'], ['braced', 'braced'], ['braced', 'bolted'], ['bolted', 'braced']];
let i = 0;
for (const b of bases) for (const [anchor, oAnchor] of combos) {
  if ((i++ % 2) && anchor === 'braced' && oAnchor === 'braced') continue;
  const fr = (x) => (x === 'braced' ? 'friction' : x);
  out.push({ id: 'braced' + out.length + '-' + anchor[1] + oAnchor[1], state: Object.assign({ action: 'sprint', duoAction: 'wrestle' }, b, { anchor, oAnchor }), solo: SOLO, duo: DUO,
    variants: [{ name: 'mainBraced', page: 'main' }, { name: 'mainFriction', page: 'main', override: { anchor: fr(anchor), oAnchor: fr(oAnchor) } }, { name: 'branch', page: 'branch' }, { name: 'branchFriction', page: 'branch', override: { anchor: fr(anchor), oAnchor: fr(oAnchor) } }] });
}
// 2. a saved group 'duo' (no duoOpen) opens the element on the saved tab
for (const d of DUO) for (const st of [{ logKg: 7 }, { logKg: 12, anchor: 'bolted', surface: 'granite' }, { logKg: 4.96, surface: 'sand', cObj: 'car', wrestleMove: 'lift' }])
  out.push({ id: 'group-' + d + '-' + out.length, state: Object.assign({ duoAction: d, action: 'jump' }, st), solo: ['jump'], duo: [d], duoFirst: true, variants: [{ name: 'main', page: 'main' }, { name: 'branch', page: 'branch', group: 'duo' }] });
// 3. the element closed while Rex's tabs are read, then opened by its summary
for (const c of all.filter((c) => /^rand/.test(c.id)).slice(0, 24)) out.push(Object.assign({}, c, { id: 'closed-' + c.id, duoFirst: false, variants: [{ name: 'main', page: 'main' }, { name: 'branch', page: 'branch', closed: true }] }));
fs.writeFileSync(path.join(__dirname, 'cases-extra.json'), JSON.stringify(out));
// 4. 390 px subset: random states and two-player edge cases
const narrow = all.filter((c) => /^rand(1|2)\d$/.test(c.id) || /edge\d+-(arm-bb-granite-10|wr-throw|catch-(car|partner)-3|col-charge-ollie-(sprint|set)-splat-(ff|bb)|de-|sprint-bolted-sand)/.test(c.id)).map((c) => Object.assign({}, c, { id: 'narrow-' + c.id }));
fs.writeFileSync(path.join(__dirname, 'cases-narrow.json'), JSON.stringify(narrow));
console.log(out.length, 'extra cases;', narrow.length, 'narrow cases');
