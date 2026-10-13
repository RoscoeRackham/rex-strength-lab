// Runs app.html's saved-state block (EFFORT_PRESETS .. save) on a fake localStorage, to show what a save becomes.
global.window = {};
const fs = require('fs');
const ROOT = '/home/user/rex-strength-lab/rex-strength-lab';
const P = require(process.argv[2] || ROOT + '/src/engine.js'); require(ROOT + '/src/data.js');
const D = window.DINO_DATA, K = P.K, g = K.g;
const src = fs.readFileSync(ROOT + '/src/app.html', 'utf8');
const a = src.indexOf('  const EFFORT_PRESETS = ['), b = src.indexOf('  const save = () =>');
const block = src.slice(a, b);
function load(saved) {
  const store = { 'rex-lab-v1': saved === undefined ? null : JSON.stringify(saved) };
  const localStorage = { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = v; } };
  const f = new Function('P', 'D', 'K', 'g', 'localStorage', block + '\nreturn state;');
  return f(P, D, K, g, localStorage);
}
const pick = (s, ks) => Object.fromEntries(ks.map((k) => [k, s[k]]));
const KS = ['groundHolds', 'gentleHold', 'coolFlight', 'airAbsorb', 'keepForm', 'unbreakable', 'ownRecoil', 'anchor', 'oAnchor', 'duoOpen', 'group', 'effort', 'duoEffort', 'wAngle', 'angle'];
const cases = {
  none: undefined,
  oldSwitchesOn: { groundHolds: true, gentleHold: true, coolFlight: true },
  oldSwitchesOff: { groundHolds: false, gentleHold: false, coolFlight: false },
  newKeysOff: { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false },
  junk: { groundHolds: 'yes', airAbsorb: 2, anchor: 'braced', group: 'duo', effort: 'block', duoEffort: 'plaster' },
};
for (const [n, s] of Object.entries(cases)) console.log(n.padEnd(15), JSON.stringify(pick(load(s), KS)));
console.log('DEFAULT keys', Object.keys(load(undefined)).length);
