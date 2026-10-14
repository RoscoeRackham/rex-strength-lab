// The proposed in-place migration (keep 'rex-lab-v1'): app.html's saved-state block with the three retired keys
// swapped for the four new ones in DEFAULTS and VALID (an in-memory edit of the block; no file is changed).
global.window = {};
const fs = require('fs');
const ROOT = '/home/user/rex-strength-lab/rex-strength-lab';
const P = require('/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/engine-head.js'); require(ROOT + '/src/data.js');
const D = window.DINO_DATA, K = P.K, g = K.g;
const src = fs.readFileSync(ROOT + '/src/app.html', 'utf8');
let block = src.slice(src.indexOf('  const EFFORT_PRESETS = ['), src.indexOf('  const save = () =>'));
const rep = (a, b) => { if (!block.includes(a)) throw new Error('missing ' + a); block = block.replace(a, b); };
rep("surface: 'concrete', groundHolds: false, anchor", "surface: 'concrete', anchor");
rep('gentleHold: false, safePassenger: false, silentStrike: false, softLanding: false, coolFlight: false,', 'airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: false, silentStrike: false, softLanding: false,');
rep("inf: (v) => typeof v === 'boolean', groundHolds: (v) => typeof v === 'boolean',", "inf: (v) => typeof v === 'boolean',");
rep("gentleHold: (v) => typeof v === 'boolean', safePassenger", "airAbsorb: num(0, 1), keepForm: (v) => typeof v === 'boolean', unbreakable: (v) => typeof v === 'boolean', ownRecoil: (v) => typeof v === 'boolean', safePassenger");
rep(", coolFlight: (v) => typeof v === 'boolean',", ',');
function load(saved) {
  const store = { 'rex-lab-v1': saved === undefined ? null : JSON.stringify(saved) };
  const localStorage = { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = v; } };
  return new Function('P', 'D', 'K', 'g', 'localStorage', block + '\nreturn state;')(P, D, K, g, localStorage);
}
const KS = ['groundHolds', 'gentleHold', 'coolFlight', 'airAbsorb', 'keepForm', 'unbreakable', 'ownRecoil'];
const pick = (s) => Object.fromEntries(KS.filter((k) => k in s).map((k) => [k, s[k]]));
const cases = {
  firstVisit: undefined,
  preB_allOn: { groundHolds: true, gentleHold: true, coolFlight: true },
  preB_allOff: { groundHolds: false, gentleHold: false, coolFlight: false },
  postB_off: { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false },
  postB_mixed: { airAbsorb: 0.3, keepForm: true, unbreakable: false, ownRecoil: true },
  junk: { airAbsorb: 2, keepForm: 'no', unbreakable: 1, ownRecoil: null },
  junk2: { airAbsorb: -0.1 }, junk3: { airAbsorb: '0.5' },
};
for (const [n, s] of Object.entries(cases)) console.log(n.padEnd(12), JSON.stringify(pick(load(s))));
