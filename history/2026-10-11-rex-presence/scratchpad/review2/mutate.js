const fs = require('fs'), path = require('path'), { execFile } = require('child_process');
const SRC = '/home/user/rex-strength-lab/rex-strength-lab', OUT = path.join(__dirname, 'mut');
const M = [
  ['soil-jump', "ground: (r, o) => !SOIL.has(o.surface && o.surface.id) && (r.groundFails", "ground: (r, o) => (r.groundFails"],
  ['soil-sprint', "ground: (r, o) => !SOIL.has(o.surface && o.surface.id) && !!r.sinks", "ground: (r, o) => !!r.sinks"],
  ['soil-throw', "ground: (r, o) => !SOIL.has(o.surface && o.surface.id) && r.canMove && r.sinkRatio > 1", "ground: (r, o) => r.canMove && r.sinkRatio > 1"],
  ['soil-stomp', "r.crater > 0 || (!SOIL.has(o.surface && o.surface.id) && r.holeDepth >= 0.01)", "r.crater > 0 || r.holeDepth >= 0.01"],
  ['stomp-no-stampMass', "momentumOf(r.vFoot, Math.max(o.body.legEff, stampMass(o.body)))", "momentumOf(r.vFoot, o.body.legEff)"],
  ['stomp-goal-0.3mm', "goal: (r, o) => ppvAt(MOVES.stomp.shake(r, o), o.near) >= VIB.TH.feelOnce,", "goal: (r, o) => ppvAt(MOVES.stomp.shake(r, o), o.near) >= VIB.TH.feel,"],
  ['soft-0.31', "SOFT: 0.51,", "SOFT: 0.31,"],
  ['passenger-mean-g', "PASSENGER.felt(Math.max(r.launchG, r.launchGPeak || 0), o.angle)", "PASSENGER.felt(r.launchG, o.angle)"],
  ['passenger-no-drag', "|| PASSENGER.dragG(o.obj, r.v) > PASSENGER.noHarm(1)", "|| false"],
  ['instant-no-bearing-cap', "vLeave = Math.min(vcm, Math.max(0, Fmax - g.m * K.g) * tau / g.m);", "vLeave = vcm;"],
  ['instant-tau-x10', "const tau = g.H / GROW.TISSUE_C;", "const tau = 10 * g.H / GROW.TISSUE_C;"],
  ['gradual-T-half', "const T = Math.max(Tp, Tu, Tl);", "const T = Math.max(Tp, Tu, Tl) / 2;"],
  ['runaway-air-x100', "(K.p0 + inst.dpHi) * g.dV / E", "100 * (K.p0 + inst.dpHi) * g.dV / E"],
  ['fine-scan-off', "const FINE = 7;", "const FINE = 0;"],
  ['jump-no-landing-ground', "(r.groundFails || !!(r.landing && r.landing.ratio > 1))", "(r.groundFails)"],
  ['clap-not-silent', "MOVES.punch.silent = true; MOVES.clap.silent = true;", "MOVES.punch.silent = true;"],
  ['clay-never-mired', "const mired = WALK.HIP * body.H / 2;", "const mired = Infinity;"],
  ['preset-rattle-never', "{ id: 'rattle', test: (m, r, o) =>", "{ id: 'rattle', test: (m, r, o) => false &&"],
  ['preset-windows-near', "blastRadius(m.blast(r, o), R.DP_WINDOWS) >= R.STREET", "blastRadius(m.blast(r, o), R.DP_WINDOWS) >= o.near"],
  ['throw-no-shake', "if (!r.canMove || !r.flight || !r.flight.landed || !(r.flight.vImpact > 0)) return null;", "return null;"],
  ['air-hazard-1000Pa', "DP_HARM: 100,", "DP_HARM: 1000,"],
  ['sat-zero-speed', "return a > 0 && isFinite(a) && Math.abs(b - a) <= 1e-6 * a;", "return isFinite(a) && Math.abs(b - a) <= 1e-6 * a;"],
  ['sat-1pct', "Math.abs(b - a) <= 1e-6 * a; };", "Math.abs(b - a) <= 1e-2 * a; };"],
];
const only = process.argv[2] ? process.argv[2].split(',') : null;
const eng = fs.readFileSync(path.join(SRC, 'src/engine.js'), 'utf8');
const jobs = M.filter(([n]) => !only || only.includes(n));
let running = 0, idx = 0;
const res = [];
function next() {
  if (idx >= jobs.length) { if (!running) { res.sort(); console.log(res.join('\n')); } return; }
  const [name, a, b] = jobs[idx++];
  const cnt = eng.split(a).length - 1;
  if (cnt !== 1) { res.push(name + ': BAD PATTERN (' + cnt + ')'); return next(); }
  const d = path.join(OUT, name); fs.rmSync(d, { recursive: true, force: true }); fs.mkdirSync(path.join(d, 'src'), { recursive: true });
  fs.cpSync(path.join(SRC, 'test'), path.join(d, 'test'), { recursive: true });
  fs.copyFileSync(path.join(SRC, 'src/data.js'), path.join(d, 'src/data.js'));
  fs.writeFileSync(path.join(d, 'src/engine.js'), eng.replace(a, b));
  running++;
  execFile('node', [path.join(d, 'test/presence.js')], { maxBuffer: 1 << 26, timeout: 900000 }, (err, so) => {
    running--;
    const fails = (so || '').split('\n').filter((l) => l.startsWith('FAIL'));
    res.push(name + ': ' + (fails.length ? 'CAUGHT (' + fails.length + ' fail) e.g. ' + fails[0].slice(0, 110) : err ? 'ERROR ' + String(err).slice(0, 100) : 'NOT CAUGHT'));
    next();
  });
  if (running < 6) next();
}
next();
