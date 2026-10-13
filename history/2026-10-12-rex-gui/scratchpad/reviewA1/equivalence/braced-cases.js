const fs = require('fs');
const SOLO = ['walk', 'lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight'];
const DUO = ['arm', 'wrestle', 'catch', 'collide'];
const bases = [
  { surface: 'concrete' },
  { surface: 'sand', logKg: 7 },
  { surface: 'granite', logKg: 12, mode: 'real' },
  { surface: 'softclay', logKg: 5, wrestleMove: 'lift', wrestleWho: 'ollie' },
  { surface: 'ice', logKg: 9, duoAction: 'collide', colSrc: 'sprint' },
  { surface: 'asphalt', logKg: 4.96, wrestleMove: 'lift', wrestleWho: 'rex', cObj: 'car', cStyle: 'hard' },
  { surface: 'gravel', inf: true },
  { surface: 'steel', logKg: 20, groundHolds: true },
];
const cases = [];
bases.forEach((b, i) => {
  for (const [tag, anchor, oAnchor] of [['bb', 'braced', 'braced'], ['bf', 'braced', 'friction'], ['fb', 'friction', 'braced'], ['ff', 'friction', 'friction'], ['bo', 'braced', 'bolted'], ['fo', 'friction', 'bolted']]) {
    cases.push({ id: 'braced' + i + tag, state: Object.assign({ action: 'throw' }, b, { anchor, oAnchor }), solo: SOLO, duo: DUO });
  }
});
// a saved 'Rex + Ollie' view on main (group duo) with no duoOpen: the branch must open the element on the saved tab
for (const d of DUO) cases.push({ id: 'group-' + d, state: { group: 'duo', duoAction: d, action: 'throw' }, mainGroup: 'duo', branchGroup: 'duo', branchNoOpen: true, solo: [], duo: [d] });
fs.writeFileSync(__dirname + '/braced.json', JSON.stringify(cases));
console.log(cases.length);
