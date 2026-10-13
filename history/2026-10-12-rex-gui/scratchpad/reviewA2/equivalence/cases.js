// Round 2 case list: a seeded random sample of saved states plus systematic edge cases.
// Usage: node cases.js  -> cases.json
const fs = require('fs');
const path = require('path');
global.window = global;
require(path.join(__dirname, 'branch/rex-strength-lab/src/data.js'));
const D = global.DINO_DATA;
const P = require(path.join(__dirname, 'branch/rex-strength-lab/src/engine.js'));
let seed = 913700;   // a different seed from round 1 (20261012)
const rnd = () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const pick = (a) => a[Math.floor(rnd() * a.length)];
const logU = (lo, hi) => Math.pow(10, Math.log10(lo) + rnd() * (Math.log10(hi) - Math.log10(lo)));
const uni = (lo, hi) => lo + rnd() * (hi - lo);
const chance = (p) => rnd() < p;
const SOLO = ['walk', 'lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight'];
const DUO = ['arm', 'wrestle', 'catch', 'collide'];
const EFF_TABS = ['throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull'];
const surfaces = D.surfaces.map((s) => s.id);
const objs = D.objects.map((o) => o.id);
const throwable = D.objects.filter((o) => !o.noThrow).map((o) => o.id);
const RHO0 = P.DEFAULT_BODIES.rex.m / P.bodyVolume(P.DEFAULT_BODIES.rex.H, 'rex');
const RHO0o = P.DEFAULT_BODIES.ollie.m / P.bodyVolume(P.DEFAULT_BODIES.ollie.H, 'ollie');
const PRESETS = ['least', 'ceiling', 'rattle', 'plaster', 'windows', 'ground', 'houses', 'block', 'allout', 'custom'];

function rexBody() {
  const r = rnd();
  if (r < 0.15) return { H: 2, m: 180, build: 'human' };
  let H;
  if (r < 0.45) H = 3.048; else if (r < 0.55) H = 0.4; else if (r < 0.67) H = 50; else H = logU(0.1, 500);
  const q = rnd();
  let rho;
  if (q < 0.45) rho = RHO0; else if (q < 0.7) rho = pick([10, 300, 1000, 7874, 22590, 1e5, 1e9, 1e17]); else rho = logU(10, 1e30);
  return { H, m: rho * P.bodyVolume(H, 'rex'), build: 'rex' };
}
function ollieBody(rex) {
  const r = rnd();
  if (r < 0.3) return { oH: P.DEFAULT_BODIES.ollie.H, oM: P.DEFAULT_BODIES.ollie.m };
  let H;
  if (r < 0.45) H = rex.H; else if (r < 0.55) H = 50; else H = logU(0.1, 500);
  const q = rnd();
  const rho = q < 0.5 ? RHO0o : q < 0.75 ? pick([10, 1000, 7874, 22590, 1e9]) : logU(10, 1e30);
  return { oH: H, oM: rho * P.bodyVolume(H, 'ollie') };
}

function randomState() {
  const s = {};
  s.mode = chance(0.5) ? 'comic' : 'real';
  s.anchor = chance(0.5) ? 'friction' : 'bolted';
  s.oAnchor = chance(0.5) ? 'friction' : 'bolted';
  s.surface = chance(0.5) ? pick(['sand', 'concrete', 'ice', 'granite']) : pick(surfaces);
  s.groundHolds = chance(0.25);
  const k = rnd();
  if (k < 0.12) { s.inf = true; s.logKg = uni(2.7, 34); }
  else { s.inf = false; s.logKg = k < 0.2 ? uni(1, 2.71) : k < 0.28 ? Math.log10(511) : uni(2.71, 34); }
  const b = rexBody(); Object.assign(s, b);
  Object.assign(s, ollieBody(b));
  s.action = pick(SOLO);
  s.obj = pick(objs);
  s.angle = chance(0.25) ? pick([0, 30, 45, 60, 89, 90]) : Math.round(uni(0, 90));
  s.duoAction = pick(DUO);
  s.wrestleMove = pick(['push', 'shove', 'lift', 'throw']);
  s.wrestleWho = pick(['rex', 'ollie', 'both']);
  s.cObj = chance(0.15) ? 'partner' : pick(throwable);
  s.cLogD = chance(0.3) ? pick([1, 2, 3, 5, 7.31]) : uni(0, 7.31);
  s.cStyle = chance(0.5) ? 'easy' : 'hard';
  s.cMiss = chance(0.2);
  s.colMode = chance(0.75) ? 'charge' : 'push';
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
  s.growS = pick([0, 0.5, 1, uni(0, 1)]); s.growT = logU(1e-3, 1e6);
  return s;
}

const cases = [];
const N_RANDOM = Number(process.env.N_RANDOM || 180);
for (let i = 0; i < N_RANDOM; i++) {
  const state = randomState();
  const pre = [];
  // settings that reset on every load, set through the controls
  if (chance(0.25)) { pre.push({ sel: '#o-own', click: true }); if (chance(0.15)) pre.push({ sel: '#o-inf', check: true }); else pre.push({ sel: '#o-strength', value: String(uni(1, 34).toFixed(2)), event: 'input' }); }
  if (chance(0.2)) pre.push({ sel: '#absorb', value: pick(['gradual', 'instant', 'runaway']), event: 'change' });
  const eff = chance(0.45) ? 'least' : pick(PRESETS);
  if (eff !== 'least') { pre.push({ sel: '#effort', value: eff, event: 'change', needTab: true }); if (eff === 'custom') pre.push({ sel: '#effort-use', frac: rnd(), value: 'x', event: 'input', needTab: true }); }
  const soloTab = {};
  if (chance(0.5)) soloTab.walk = [{ sel: '#step-effort', value: String(rnd().toFixed(2)), event: 'input' }];
  if (chance(0.3)) soloTab.weight = [{ sel: '#grow-what-' + pick(['krakatoa', 'chicxulub', 'sun']), click: true }];
  const duoPre = [];
  const de = rnd();
  if (de < 0.2) duoPre.push({ sel: '#duo-effort', value: 'allout', event: 'change' });
  else if (de < 0.4) { duoPre.push({ sel: '#duo-effort', value: 'custom', event: 'change' }); duoPre.push({ sel: '#duo-effort-use', frac: rnd(), value: 'x', event: 'input' }); }
  if (chance(0.15)) { duoPre.push({ sel: '#o-effort-own', check: true }); duoPre.push({ sel: '#o-effort-use', frac: rnd(), value: 'x', event: 'input' }); }
  // the saved Rex tab first, then the others; the saved two-player tab first, then the others
  const solo = [state.action].concat(SOLO.filter((d) => d !== state.action));
  const duo = [state.duoAction].concat(DUO.filter((d) => d !== state.duoAction));
  // half the cases read the two-player tabs first (on the branch both bays are on the page at once)
  cases.push({ id: 'rand' + i, state, pre, soloTab, duoPre, solo, duo, duoFirst: chance(0.5), ladder: i % 6 === 0 });
}

// systematic edge cases
const base = { action: 'throw' };
let n = 0;
const add = (tag, state, extra) => cases.push(Object.assign({ id: 'edge' + (n++) + '-' + tag, state: Object.assign({}, base, state), solo: SOLO, duo: DUO }, extra || {}));
// muscle modes x footing combos x grounds x comic ground (two strengths)
for (const mode of ['comic', 'real']) for (const anchor of ['friction', 'bolted']) for (const oAnchor of ['friction', 'bolted']) for (const surface of ['sand', 'concrete', 'ice', 'granite']) for (const groundHolds of [false, true]) {
  if (groundHolds && (surface === 'sand' || surface === 'ice')) continue;
  add('foot', { mode, anchor, oAnchor, surface, groundHolds, logKg: surface === 'granite' ? 12 : surface === 'ice' ? 4.96 : 7 });
}
// strengths from below record-human to unlimited, both footings
for (const lk of [2, Math.log10(511), 3, 4.96, 7, 10, 15, 20, 25, 30, 34]) add('str', { logKg: lk, anchor: lk > 9 ? 'bolted' : 'friction', oAnchor: lk > 20 ? 'bolted' : 'friction' });
add('inf', { inf: true });
add('inf-bolt', { inf: true, anchor: 'bolted', oAnchor: 'bolted', surface: 'granite' });
add('inf-real-cg', { inf: true, groundHolds: true, mode: 'real' });
add('inf-sand-bolt', { inf: true, anchor: 'bolted', surface: 'sand' });
// sizes and densities
add('cal', { H: 2, m: 180, build: 'human', logKg: Math.log10(511) });
add('cal-real', { H: 2, m: 180, build: 'human', logKg: Math.log10(511), mode: 'real' });
add('cal-bolt', { H: 2, m: 180, build: 'human', logKg: Math.log10(511), anchor: 'bolted' });
add('kaiju', { H: 50, m: RHO0 * P.bodyVolume(50, 'rex'), oH: 50, oM: RHO0o * P.bodyVolume(50, 'ollie') });
add('kaiju12', { H: 50, m: RHO0 * P.bodyVolume(50, 'rex'), logKg: 12, anchor: 'bolted' });
add('plush', { H: 0.4, m: RHO0 * P.bodyVolume(0.4, 'rex'), oH: 0.4, oM: RHO0o * P.bodyVolume(0.4, 'ollie'), logKg: 3 });
add('tall', { H: 460, m: RHO0 * P.bodyVolume(460, 'rex'), logKg: 20 });
for (const rho of [10, 300, 7874, 22590, 1e6, 1e12, 1e18, 1e25, 1e30]) add('rho' + rho, { m: rho * P.bodyVolume(3.048, 'rex'), logKg: 20 });
for (const rho of [10, 22590, 1e12]) add('orho' + rho, { oM: rho * P.bodyVolume(3.048, 'ollie'), logKg: 9 });
// each switch alone, and all on
for (const sw of ['gentleHold', 'safePassenger', 'silentStrike', 'softLanding', 'coolFlight']) { add(sw, { [sw]: true, logKg: 8 }); add(sw + '-p', { [sw]: true, logKg: 14, obj: 'person', cObj: 'person' }); }
add('allsw', { gentleHold: true, safePassenger: true, silentStrike: true, softLanding: true, coolFlight: true, groundHolds: true, logKg: 12 });
// growth modes (reset each load; set through the controls) with the Weight tab's what-if chips
for (const ab of ['gradual', 'instant', 'runaway']) for (const gw of ['krakatoa', 'chicxulub', 'sun']) add('grow-' + ab + '-' + gw, { growS: pick([0, 0.5, 1]) }, { solo: ['weight'], duo: [], pre: [{ sel: '#absorb', value: ab, event: 'change' }], soloTab: { weight: [{ sel: '#grow-what-' + gw, click: true }] } });
// Wrestle: every move x who x footing
for (const wrestleMove of ['push', 'shove', 'lift', 'throw']) for (const wrestleWho of ['rex', 'ollie', 'both']) for (const [anchor, oAnchor] of [['friction', 'friction'], ['bolted', 'friction'], ['friction', 'bolted'], ['bolted', 'bolted']]) {
  if (wrestleWho === 'both' && wrestleMove !== 'shove') continue;
  add('wr', { wrestleMove, wrestleWho, anchor, oAnchor, logKg: pick([4.96, 7, 9, 12]), surface: pick(['concrete', 'sand', 'granite']), duoAction: 'wrestle', angle: pick([20, 45, 70]) }, { solo: [], duo: ['wrestle'] });
}
// Arm wrestle: footing x ground x comic ground
for (const [anchor, oAnchor] of [['friction', 'friction'], ['bolted', 'friction'], ['friction', 'bolted'], ['bolted', 'bolted']]) for (const surface of ['sand', 'concrete', 'granite']) for (const groundHolds of [false, true]) add('arm', { anchor, oAnchor, surface, groundHolds, logKg: 6, duoAction: 'arm' }, { solo: [], duo: ['arm'] });
// Catch: objects x distances x styles, partner, a miss, bolted thrower
for (const cObj of ['baseball', 'person', 'car', 'piano', 'partner', 'bus', 'shot', 'liberty']) for (const cLogD of [0.3, 1, 3, 6, 7.31]) for (const cStyle of ['easy', 'hard']) add('catch', { cObj, cLogD, cStyle, logKg: cStyle === 'hard' ? 8 : 4.96, duoAction: 'catch', anchor: chance(0.3) ? 'bolted' : 'friction' }, { solo: [], duo: ['catch'] });
add('catch-miss', { cObj: 'baseball', cMiss: true, cStyle: 'hard', logKg: 10, duoAction: 'catch' }, { solo: [], duo: ['catch'] });
add('catch-miss2', { cObj: 'car', cMiss: true, cStyle: 'easy', logKg: 6, duoAction: 'catch' }, { solo: [], duo: ['catch'] });
// Collide: mode x who x source x bounce x footing
for (const colMode of ['charge', 'push']) for (const colWho of ['ollie', 'rex']) for (const colSrc of ['sprint', 'jump', 'stomp', 'set']) for (const colBounce of ['splat', 'bounce']) for (const ft of ['ff', 'bb', 'fb']) {
  if (colMode === 'push' && (colSrc !== 'sprint' || colBounce !== 'splat')) continue;
  add('col', { colMode, colWho, colSrc, colBounce, colGB: colSrc === 'set' ? pick([-6, -2, 0, 2]) : -6.48, logKg: pick([6, 8, 12]), duoAction: 'collide', anchor: ft[0] === 'b' ? 'bolted' : 'friction', oAnchor: ft[1] === 'b' ? 'bolted' : 'friction' }, { solo: [], duo: ['collide'] });
}
add('col-inf', { colInf: true, colSrc: 'set', duoAction: 'collide' }, { solo: [], duo: ['collide'] });
add('col-imm', { colImm: true, colSrc: 'set', colGB: 0, duoAction: 'collide' }, { solo: [], duo: ['collide'] });
add('col-imm-bolt', { colImm: true, colSrc: 'sprint', anchor: 'bolted', oAnchor: 'bolted', logKg: 12, duoAction: 'collide' }, { solo: [], duo: ['collide'] });
add('col-fast-bolt', { colSrc: 'set', colGB: 3.9, oAnchor: 'bolted', surface: 'granite', duoAction: 'collide' }, { solo: [], duo: ['collide'] });
add('col-slow-foot', { colSrc: 'set', colGB: -7.5, surface: 'concrete', duoAction: 'collide' }, { solo: [], duo: ['collide'] });
// two-player effort modes
for (const d of DUO) {
  add('de-all-' + d, { logKg: 9, duoAction: d }, { solo: [], duo: [d], duoPre: [{ sel: '#duo-effort', value: 'allout', event: 'change' }] });
  add('de-cus-' + d, { logKg: 9, duoAction: d }, { solo: [], duo: [d], duoPre: [{ sel: '#duo-effort', value: 'custom', event: 'change' }, { sel: '#duo-effort-use', frac: 0.4, value: 'x', event: 'input' }] });
  add('o-own-' + d, { logKg: 9, duoAction: d }, { solo: [], duo: [d], pre: [{ sel: '#o-own', click: true }, { sel: '#o-strength', value: '6', event: 'input' }] });
  add('o-eff-' + d, { logKg: 9, duoAction: d }, { solo: [], duo: [d], duoPre: [{ sel: '#o-effort-own', check: true }, { sel: '#o-effort-use', frac: 0.7, value: 'x', event: 'input' }] });
  add('o-inf-' + d, { logKg: 7, duoAction: d }, { solo: [], duo: [d], pre: [{ sel: '#o-own', click: true }, { sel: '#o-inf', check: true }] });
}
// solo effort presets on the effort tabs, both footings
for (const eff of PRESETS) for (const anchor of ['friction', 'bolted']) add('eff-' + eff + '-' + anchor, { logKg: 12, anchor }, { solo: EFF_TABS, duo: [], pre: [{ sel: '#effort', value: eff, event: 'change', needTab: true }].concat(eff === 'custom' ? [{ sel: '#effort-use', frac: 0.6, value: 'x', event: 'input', needTab: true }] : []) });
// Sprint and Pull with bolted feet across strengths and grounds (their text changed on the branch)
for (const lk of [Math.log10(511), 4, 6, 9, 15]) for (const surface of ['sand', 'softclay', 'concrete', 'ice']) add('sprint-bolt', { logKg: lk, anchor: 'bolted', surface, action: 'sprint' }, { solo: ['sprint', 'pull', 'throw'], duo: [] });
// Walk tab variants
for (const walker of ['rex', 'ollie', 'both']) for (const surface of ['sand', 'softclay', 'concrete', 'ice', 'steel']) add('walk', { walker, surface, action: 'walk', groundHolds: chance(0.3) }, { solo: ['walk'], duo: [], soloTab: { walk: [{ sel: '#step-effort', value: pick(['0', '0.4', '1']), event: 'input' }] } });
// Ollie-heavy states where only Ollie walks/mires
add('walk-mired', { walker: 'ollie', surface: 'softclay', oM: 1e6, action: 'walk' }, { solo: ['walk'], duo: [] });
add('walk-mired2', { walker: 'both', surface: 'softclay', m: 1e6, oM: 1e6, action: 'walk' }, { solo: ['walk'], duo: [] });
for (const c of cases) if (!(c.solo || []).length) c.mainGroup = 'duo';
fs.writeFileSync(path.join(__dirname, 'cases.json'), JSON.stringify(cases));
console.log(cases.length, 'cases;', cases.filter((c) => c.id.startsWith('rand')).length, 'random');
