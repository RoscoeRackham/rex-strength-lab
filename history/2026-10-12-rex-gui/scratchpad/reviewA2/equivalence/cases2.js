// Targeted cases: braced migration, saved group 'duo', settings changed through the controls while the Rex + Ollie
// element is open or closed, record-book Simulate buttons, the element closed. -> cases2.json
const fs = require('fs');
const SOLO = ['walk', 'lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight'];
const DUO = ['arm', 'wrestle', 'catch', 'collide'];
const cases = [];
// 1. braced: each base state with braced / friction / bolted for Rex and Ollie
const bases = [
  { surface: 'concrete' },
  { surface: 'sand', logKg: 7 },
  { surface: 'granite', logKg: 12, mode: 'real' },
  { surface: 'softclay', logKg: 5, wrestleMove: 'lift', wrestleWho: 'ollie' },
  { surface: 'ice', logKg: 9, duoAction: 'collide', colSrc: 'sprint', colWho: 'rex' },
  { surface: 'asphalt', logKg: 4.96, wrestleMove: 'lift', wrestleWho: 'rex', cObj: 'car', cStyle: 'hard' },
  { surface: 'gravel', inf: true, wrestleMove: 'shove', wrestleWho: 'both' },
  { surface: 'steel', logKg: 20, groundHolds: true, wrestleMove: 'throw', angle: 30 },
  { surface: 'stiffclay', logKg: 8, H: 50, m: 1060 * 2.84 * Math.pow(50 / 3.048, 3), colMode: 'push' },
  { surface: 'concrete', logKg: 4.2, mode: 'real', wrestleMove: 'push' },
];
bases.forEach((b, i) => {
  for (const [tag, anchor, oAnchor] of [['bb', 'braced', 'braced'], ['bf', 'braced', 'friction'], ['fb', 'friction', 'braced'], ['ff', 'friction', 'friction'], ['bo', 'braced', 'bolted'], ['fo', 'friction', 'bolted'], ['ob', 'bolted', 'braced'], ['of', 'bolted', 'friction']]) {
    cases.push({ id: 'braced' + i + tag, state: Object.assign({ action: 'throw' }, b, { anchor, oAnchor }), solo: SOLO, duo: DUO });
  }
});
// 2. a saved 'Rex + Ollie' view on main (group duo) with no duoOpen, on each two-player tab and a few settings
for (const d of DUO) for (const extra of [{}, { logKg: 9, anchor: 'bolted' }, { cObj: 'car', cLogD: 3, wrestleMove: 'lift', colSrc: 'jump', surface: 'sand' }]) cases.push({ id: 'group-' + d + '-' + Object.keys(extra).length, state: Object.assign({ group: 'duo', duoAction: d, action: 'throw' }, extra), mainGroup: 'duo', branchGroup: 'duo', branchNoOpen: true, solo: SOLO, duo: [d].concat(DUO.filter((x) => x !== d)), duoFirst: true });
// a saved group 'solo' with duoOpen absent: the branch keeps the element closed (read only Rex's tabs)
cases.push({ id: 'group-solo-closed', state: { group: 'solo', action: 'stomp', logKg: 8 }, branchNoOpen: true, solo: SOLO, duo: [] });
// 3. settings changed through the controls after load, with the element open (branch) / the duo group showing (main)
const seqs = [
  [{ sel: '#tier-chips .chip[data-id="hulk"]', click: true }, { sel: '#surface', value: 'granite', event: 'change' }, { anchor: { who: 'rex', val: 'bolted' } }],
  [{ sel: '#mode-real', click: true }, { anchor: { who: 'ollie', val: 'bolted' } }, { sel: '#ground-holds', check: true }],
  [{ anchor: { who: 'rex', val: 'bolted' } }, { anchor: { who: 'ollie', val: 'bolted' } }, { anchor: { who: 'rex', val: 'friction' } }],
  [{ sel: '#size-chips .chip:nth-child(3)', click: true }, { sel: '#tier-chips .chip[data-id="secretwars"]', click: true }],
  [{ sel: '#o-height', value: '6', event: 'change' }, { sel: '#o-mass', value: '9000', event: 'change' }, { sel: '#surface', value: 'sand', event: 'change' }],
  [{ sel: '#height', value: '2.5', event: 'change' }, { sel: '#mass', value: '50000', event: 'change' }, { sel: '#sw-gentle', check: true }, { sel: '#sw-passenger', check: true }],
  [{ sel: '#tier-chips .chip[data-id="inf"]', click: true }, { anchor: { who: 'ollie', val: 'bolted' } }],
  [{ sel: '#strength', value: '15.3', event: 'input' }, { sel: '#strength', value: '15.3', event: 'change' }, { sel: '#sw-cool', check: true }, { sel: '#sw-silent', check: true }, { sel: '#sw-soft', check: true }],
  [{ sel: '#o-own', click: true }, { sel: '#o-strength', value: '12', event: 'input' }, { sel: '#o-density', value: '4.3', event: 'input' }],
  [{ sel: '#size-cal', click: true }, { sel: '#tier-chips .chip[data-id="human"]', click: true }, { anchor: { who: 'rex', val: 'bolted' } }],
];
seqs.forEach((seq, i) => {
  // on main the duo group shows while the settings change; on the branch the element is open
  cases.push({ id: 'seq' + i + '-open', state: { action: ['throw', 'sprint', 'pull', 'stomp', 'walk'][i % 5], duoAction: DUO[i % 4], logKg: 6 }, pre: seq.map((a) => Object.assign({ wait: 250 }, a)), solo: SOLO, duo: DUO, duoFirst: true });
  // the same changes made while the element is closed (branch), then it is opened
  cases.push({ id: 'seq' + i + '-closed', state: { action: ['throw', 'sprint', 'pull', 'stomp', 'walk'][i % 5], duoAction: DUO[(i + 1) % 4], logKg: 6 }, branchNoOpen: true, pre: seq.map((a) => Object.assign({ wait: 250 }, a)).concat([{ duoOpen: true, wait: 300 }]), solo: SOLO, duo: DUO });
  // open, change, close, change back half-way, reopen
  cases.push({ id: 'seq' + i + '-toggle', state: { action: 'throw', duoAction: DUO[(i + 2) % 4], logKg: 7 }, pre: [{ duoOpen: true, wait: 600 }].concat(seq.slice(0, 1).map((a) => Object.assign({ wait: 100 }, a)), [{ duoOpen: false, wait: 100 }], seq.slice(1).map((a) => Object.assign({ wait: 100 }, a)), [{ duoOpen: true, wait: 300 }]), branchNoOpen: true, solo: SOLO, duo: DUO, duoFirst: i % 2 === 0 });
});
// 4. the record books' Simulate buttons, from a state showing the two-player tests
for (let k = 0; k < 18; k++) cases.push({ id: 'feat' + k, state: { action: 'weight', duoAction: DUO[k % 4], group: 'duo', logKg: 6 }, mainGroup: 'duo', pre: [{ featIdx: k, wait: 400 }], solo: SOLO, duo: DUO, ladder: k % 3 === 0 });
// 5. the element closed: Rex's bay alone matches main's
for (let k = 0; k < 8; k++) cases.push({ id: 'closed' + k, state: { action: SOLO[k], logKg: 3 + 3 * k, anchor: k % 2 ? 'bolted' : 'friction', surface: ['sand', 'concrete', 'ice', 'granite'][k % 4], mode: k % 3 ? 'comic' : 'real' }, branchNoOpen: true, solo: SOLO, duo: [], ladder: true });
fs.writeFileSync(__dirname + '/cases2.json', JSON.stringify(cases));
console.log(cases.length);
