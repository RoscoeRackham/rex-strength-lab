// Build the case list: a seeded random sample of saved states plus systematic edge cases.
const fs = require('fs');
const path = require('path');
global.window = global;
require(path.join(__dirname, 'branch/rex-strength-lab/src/data.js'));
const D = global.DINO_DATA;
const P = require(path.join(__dirname, 'branch/rex-strength-lab/src/engine.js'));
let seed = 20261012;
const rnd = () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const pick = (a) => a[Math.floor(rnd() * a.length)];
const logU = (lo, hi) => Math.pow(10, Math.log10(lo) + rnd() * (Math.log10(hi) - Math.log10(lo)));
const uni = (lo, hi) => lo + rnd() * (hi - lo);
const chance = (p) => rnd() < p;
const SOLO = ['walk', 'lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight'];
const DUO = ['arm', 'wrestle', 'catch', 'collide'];
const surfaces = D.surfaces.map((s) => s.id);
const objs = D.objects.map((o) => o.id);
const throwable = D.objects.filter((o) => !o.noThrow).map((o) => o.id);
const RHO0 = P.DEFAULT_BODIES.rex.m / P.bodyVolume(P.DEFAULT_BODIES.rex.H, 'rex');
const PRESETS = ['least', 'ceiling', 'rattle', 'plaster', 'windows', 'ground', 'houses', 'block', 'allout', 'custom'];

function body(prefix, build) {
  const r = rnd();
  let H, rho;
  if (prefix === '' && r < 0.15) return { H: 2, m: 180, build: 'human' };
  if (r < 0.35) H = 3.048; else if (r < 0.5) H = 0.4; else if (r < 0.62) H = 50; else H = logU(0.1, 500);
  const q = rnd();
  if (q < 0.45) rho = RHO0; else if (q < 0.7) rho = pick([10, 300, 1000, 7874, 22590, 1e5, 1e9, 1e17]); else rho = logU(10, 1e30);
  return { H, m: rho * P.bodyVolume(H, build), build };
}

function randomState() {
  const s = {};
  s.mode = chance(0.5) ? 'comic' : 'real';
  s.anchor = chance(0.5) ? 'friction' : 'bolted';
  s.oAnchor = chance(0.5) ? 'friction' : 'bolted';
  s.surface = pick(surfaces);
  s.groundHolds = chance(0.25);
  const k = rnd();
  if (k < 0.12) { s.inf = true; s.logKg = uni(2.7, 34); }
  else { s.inf = false; s.logKg = k < 0.25 ? uni(1, 2.71) : k < 0.32 ? Math.log10(511) : uni(2.71, 34); }
  const b = body('', 'rex'); s.H = b.H; s.m = b.m; s.build = b.build;
  const o = body('o', 'ollie'); s.oH = o.H; s.oM = o.m;
  s.action = 'throw';
  s.obj = pick(objs);
  s.angle = chance(0.2) ? pick([0, 45, 90, 89]) : Math.round(uni(0, 90));
  s.duoAction = pick(DUO);
  s.wrestleMove = pick(['push', 'shove', 'lift', 'throw']);
  s.wrestleWho = pick(['rex', 'ollie', 'both']);
  s.cObj = chance(0.15) ? 'partner' : pick(throwable);
  s.cLogD = chance(0.3) ? 1 : uni(0, 7.31);
  s.cStyle = chance(0.5) ? 'easy' : 'hard';
  s.cMiss = chance(0.2);
  s.colMode = chance(0.8) ? 'charge' : 'push';
  s.colWho = chance(0.5) ? 'ollie' : 'rex';
  s.colSrc = pick(['sprint', 'jump', 'stomp', 'set']);
  s.colGB = uni(-8.48, 4);
  s.colInf = chance(0.1);
  s.colBounce = chance(0.5) ? 'splat' : 'bounce';
  s.colImm = chance(0.15);
  s.near = chance(0.5) ? P.RESTRAINT.R.NEAR : logU(0.5, 1000);
  s.gThrow = chance(0.5) ? 30 : logU(0.1, 1e7);
  s.gJump = chance(0.5) ? 3 : logU(0.01, 1e5);
  s.gSprint = chance(0.5) ? 12.42 : logU(0.1, 3e8);
  s.gPull = chance(0.5) ? 10 : logU(0.01, 1e4);
  for (const sw of ['gentleHold', 'safePassenger', 'silentStrike', 'softLanding', 'coolFlight']) s[sw] = chance(0.3);
  s.walker = pick(['rex', 'ollie', 'both']);
  s.pace = pick(['stroll', 'walk', 'brisk', 'fast']);
  s.walkD = chance(0.5) ? 3 : logU(0.5, 10000);
  s.growS = uni(0, 1); s.growT = logU(1e-3, 1e6);
  return s;
}

const cases = [];
// random sample, every tab, with the reset-on-load settings exercised through the controls
for (let i = 0; i < 160; i++) {
  const state = randomState();
  const pre = [];
  if (chance(0.3)) { pre.push({ sel: '#o-own', click: true }); if (chance(0.15)) pre.push({ sel: '#o-inf', check: true }); else pre.push({ sel: '#o-strength', value: String(uni(1, 34).toFixed(2)), event: 'input' }); }
  const eff = chance(0.5) ? 'least' : pick(PRESETS);
  if (eff !== 'least') { pre.push({ sel: '#effort', value: eff, event: 'change' }); if (eff === 'custom') pre.push({ sel: '#effort-use', frac: rnd(), value: 'x', event: 'input' }); }
  const soloTab = {};
  if (chance(0.5)) soloTab.walk = [{ sel: '#step-effort', value: String(rnd().toFixed(2)), event: 'input' }];
  const duoPre = [];
  const de = rnd();
  if (de < 0.2) duoPre.push({ sel: '#duo-effort', value: 'allout', event: 'change' });
  else if (de < 0.4) { duoPre.push({ sel: '#duo-effort', value: 'custom', event: 'change' }); duoPre.push({ sel: '#duo-effort-use', frac: rnd(), value: 'x', event: 'input' }); }
  if (chance(0.15)) { duoPre.push({ sel: '#o-effort-own', check: true }); duoPre.push({ sel: '#o-effort-use', frac: rnd(), value: 'x', event: 'input' }); }
  // the saved duo tab first, then the others
  const duo = [state.duoAction].concat(DUO.filter((d) => d !== state.duoAction));
  cases.push({ id: 'rand' + i, state, pre, soloTab, duoPre, solo: SOLO, duo });
}

// systematic edge cases
const base = { action: 'throw' };
let n = 0;
const add = (state, extra) => cases.push(Object.assign({ id: 'edge' + (n++), state: Object.assign({}, base, state), solo: SOLO, duo: DUO }, extra || {}));
// muscle modes x footing combos x grounds x comic ground
for (const mode of ['comic', 'real']) for (const anchor of ['friction', 'bolted']) for (const oAnchor of ['friction', 'bolted']) for (const surface of ['sand', 'concrete', 'ice', 'granite']) for (const groundHolds of [false, true]) {
  if (groundHolds && (surface === 'sand' || surface === 'ice')) continue;
  add({ mode, anchor, oAnchor, surface, groundHolds });
}
// strengths
for (const lk of [Math.log10(511), 3, 4.96, 7, 10, 15, 20, 25, 30, 34]) add({ logKg: lk });
add({ inf: true });
add({ inf: true, anchor: 'bolted', oAnchor: 'bolted', surface: 'granite' });
add({ inf: true, groundHolds: true, mode: 'real' });
// sizes and densities
add({ H: 2, m: 180, build: 'human', logKg: Math.log10(511) });
add({ H: 2, m: 180, build: 'human', logKg: Math.log10(511), mode: 'real' });
add({ H: 50, m: RHO0 * P.bodyVolume(50, 'rex'), oH: 50, oM: RHO0 * P.bodyVolume(50, 'ollie') });
add({ H: 50, m: RHO0 * P.bodyVolume(50, 'rex'), logKg: 12 });
add({ H: 0.4, m: RHO0 * P.bodyVolume(0.4, 'rex') });
for (const rho of [10, 7874, 22590, 1e6, 1e12, 1e18, 1e25, 1e30]) add({ m: rho * P.bodyVolume(3.048, 'rex'), logKg: 20 });
add({ oM: 22590 * P.bodyVolume(3.048, 'ollie'), logKg: 9 });
// each switch alone, and all on
for (const sw of ['gentleHold', 'safePassenger', 'silentStrike', 'softLanding', 'coolFlight']) { add({ [sw]: true, logKg: 8 }); add({ [sw]: true, logKg: 14, obj: 'person', cObj: 'person' }); }
add({ gentleHold: true, safePassenger: true, silentStrike: true, softLanding: true, coolFlight: true, groundHolds: true, logKg: 12 });
// two-player sub-modes
for (const wrestleMove of ['push', 'shove', 'lift', 'throw']) for (const wrestleWho of ['rex', 'ollie', 'both']) for (const lk of [4.96, 9]) add({ wrestleMove, wrestleWho, logKg: lk, duoAction: 'wrestle' }, { solo: [], duo: ['wrestle'] });
for (const cObj of ['baseball', 'person', 'car', 'piano', 'partner', 'bus', 'shot']) for (const cLogD of [0.3, 1, 3, 6]) for (const cStyle of ['easy', 'hard']) add({ cObj, cLogD, cStyle, logKg: cStyle === 'hard' ? 8 : 4.96, duoAction: 'catch' }, { solo: [], duo: ['catch'] });
add({ cObj: 'baseball', cMiss: true, cStyle: 'hard', logKg: 10, duoAction: 'catch' }, { solo: [], duo: ['catch'] });
for (const colMode of ['charge', 'push']) for (const colWho of ['ollie', 'rex']) for (const colSrc of ['sprint', 'jump', 'stomp', 'set']) for (const colBounce of ['splat', 'bounce']) {
  if (colMode === 'push' && (colSrc !== 'sprint' || colBounce !== 'splat')) continue;
  add({ colMode, colWho, colSrc, colBounce, colGB: colSrc === 'set' ? -2 : -6.48, logKg: 8, duoAction: 'collide' }, { solo: [], duo: ['collide'] });
}
add({ colInf: true, colSrc: 'set', duoAction: 'collide' }, { solo: [], duo: ['collide'] });
add({ colImm: true, colSrc: 'set', colGB: 0, duoAction: 'collide' }, { solo: [], duo: ['collide'] });
add({ colImm: true, colSrc: 'sprint', anchor: 'bolted', oAnchor: 'bolted', logKg: 12, duoAction: 'collide' }, { solo: [], duo: ['collide'] });
add({ colSrc: 'set', colGB: 3.9, oAnchor: 'bolted', surface: 'granite', duoAction: 'collide' }, { solo: [], duo: ['collide'] });
// duo effort modes
for (const d of DUO) {
  add({ logKg: 9, duoAction: d }, { solo: [], duo: [d], duoPre: [{ sel: '#duo-effort', value: 'allout', event: 'change' }] });
  add({ logKg: 9, duoAction: d }, { solo: [], duo: [d], duoPre: [{ sel: '#duo-effort', value: 'custom', event: 'change' }, { sel: '#duo-effort-use', frac: 0.4, value: 'x', event: 'input' }] });
  add({ logKg: 9, duoAction: d }, { solo: [], duo: [d], pre: [{ sel: '#o-own', click: true }, { sel: '#o-strength', value: '6', event: 'input' }] });
  add({ logKg: 9, duoAction: d }, { solo: [], duo: [d], duoPre: [{ sel: '#o-effort-own', check: true }, { sel: '#o-effort-use', frac: 0.7, value: 'x', event: 'input' }] });
}
// solo effort presets on the effort tabs
for (const eff of PRESETS) add({ logKg: 12 }, { solo: ['throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull'], duo: [], pre: [{ sel: '#effort', value: eff, event: 'change' }].concat(eff === 'custom' ? [{ sel: '#effort-use', frac: 0.6, value: 'x', event: 'input' }] : []) });
// walk tab variants
for (const walker of ['rex', 'ollie', 'both']) for (const surface of ['sand', 'softclay', 'concrete', 'ice', 'steel']) add({ walker, surface, action: 'walk' }, { solo: ['walk'], duo: [], soloTab: { walk: [{ sel: '#step-effort', value: '0.7', event: 'input' }] } });
for (const c of cases) if (!(c.solo || []).length) c.mainGroup = 'duo';
fs.writeFileSync(path.join(__dirname, 'cases.json'), JSON.stringify(cases));
console.log(cases.length, 'cases;', cases.filter((c) => c.id.startsWith('rand')).length, 'random');
