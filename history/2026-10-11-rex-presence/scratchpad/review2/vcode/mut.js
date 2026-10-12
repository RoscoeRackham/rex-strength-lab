const fs = require('fs'), path = require('path'), { execFile } = require('child_process');
const S = __dirname;
const MUT = [
 ['soil-throw', ["ground: (r, o) => !SOIL.has(o.surface && o.surface.id) && r.canMove && r.sinkRatio > 1", "ground: (r, o) => r.canMove && r.sinkRatio > 1"]],
 ['soil-sprint', ["ground: (r, o) => !SOIL.has(o.surface && o.surface.id) && !!r.sinks", "ground: (r, o) => !!r.sinks"]],
 ['soil-stomp', ["(!SOIL.has(o.surface && o.surface.id) && r.holeDepth >= 0.01)", "(r.holeDepth >= 0.01)"]],
 ['soil-jump', ["ground: (r, o) => !SOIL.has(o.surface && o.surface.id) && (r.groundFails", "ground: (r, o) => (r.groundFails"], ["ground: (r, o) => (SOIL.has(o.surface && o.surface.id) ? (r.groundFails && r.Eground >= 1e6) || !!(r.landing && r.landing.Eground >= 1e6)", "ground: (r, o) => (false ? 0"]],
 ['jump-no-landing-ground', ["(r.groundFails || !!(r.landing && r.landing.ratio > 1))", "(r.groundFails)"], [": r.groundFails || !!(r.landing && r.landing.ratio > 1))", ": r.groundFails)"]],
 ['stomp-no-stampMass', ["momentumOf(r.vFoot, Math.max(o.body.legEff, stampMass(o.body)))", "momentumOf(r.vFoot, o.body.legEff)"], ["momentumOf(r.vFoot, o.body.legEff) + Math.max(0, stampMass(o.body) - o.body.legEff) * Math.min(r.vFoot, stampSpeed(o.body))", "momentumOf(r.vFoot, o.body.legEff)"]],
 ['stomp-goal-feel', ["o.near) >= VIB.TH.feelOnce,", "o.near) >= VIB.TH.feel,"]],
 ['passenger-mean-g', ["PASSENGER.felt(Math.max(r.launchG, r.launchGPeak || 0), o.angle)", "PASSENGER.felt(r.launchG, o.angle)"]],
 ['instant-no-cap', ["vLeave = Math.min(vcm, Math.max(0, Fmax - g.m * K.g) * tau / g.m);", "vLeave = vcm;"]],
 ['instant-tau-x10', ["const tau = g.H / GROW.TISSUE_C;", "const tau = 10 * g.H / GROW.TISSUE_C;"]],
 ['gradual-T-half', ["const T = Math.max(Tp, Tu, Tl);", "const T = Math.max(Tp, Tu, Tl) / 2;"]],
 ['runaway-air-x100', ["(K.p0 + inst.dpHi) * g.dV / E", "100 * (K.p0 + inst.dpHi) * g.dV / E"]],
 ['clay-never-mired', ["const mired = WALK.HIP * body.H / 2;", "const mired = Infinity;"]],
 ['clap-not-silent', ["MOVES.punch.silent = true; MOVES.clap.silent = true;", "MOVES.punch.silent = true;"]],
 ['windows-near', ["R.DP_WINDOWS) >= R.STREET", "R.DP_WINDOWS) >= o.near"]],
 ['throw-no-shake', ["if (!r.canMove || !r.flight || !r.flight.landed || !(r.flight.vImpact > 0)) return null;", "return null;"]],
 ['CTRL-fine-off', ["const FINE = 7;", "const FINE = 0;"]],
 ['CTRL-dpharm-1000', ["DP_HARM: 100,", "DP_HARM: 1000,"]],
];
const repos = process.argv.slice(2);
const jobs = [];
for (const r of repos) {
  const src = path.join(S, r, 'rex-strength-lab');
  const eng = fs.readFileSync(path.join(src, 'src/engine.js'), 'utf8');
  for (const [name, ...alts] of MUT) {
    const hit = alts.find(([a]) => eng.split(a).length === 2);
    if (!hit) { jobs.push({ r, name, skip: true }); continue; }
    jobs.push({ r, name, src, eng: eng.replace(hit[0], hit[1]) });
  }
}
const out = []; let running = 0, i = 0;
const next = () => {
  while (running < 4 && i < jobs.length) {
    const j = jobs[i++];
    if (j.skip) { out.push(j.r + ' ' + j.name + ': pattern not found'); continue; }
    const d = path.join(S, 'mut', j.r, j.name); fs.rmSync(d, { recursive: true, force: true }); fs.mkdirSync(path.join(d, 'src'), { recursive: true });
    fs.cpSync(path.join(j.src, 'test'), path.join(d, 'test'), { recursive: true });
    fs.cpSync(path.join(j.src, 'research'), path.join(d, 'research'), { recursive: true });
    fs.copyFileSync(path.join(j.src, 'src/data.js'), path.join(d, 'src/data.js'));
    fs.writeFileSync(path.join(d, 'src/engine.js'), j.eng);
    running++;
    execFile('node', [path.join(d, 'test/presence.js')], { maxBuffer: 1 << 26, timeout: 900000 }, (err, so) => {
      running--;
      fs.writeFileSync(path.join(d, 'out.txt'), so || '');
      const fails = (so || '').split('\n').filter((l) => l.startsWith('FAIL'));
      const last = (so || '').trim().split('\n').pop();
      out.push(j.r + ' ' + j.name + ': ' + (fails.length ? 'CAUGHT ' + fails.length + ' e.g. ' + fails[0].slice(0, 100) : err ? 'ERROR ' + String(err).slice(0, 120) : 'NOT CAUGHT (' + last + ')'));
      if (running === 0 && i >= jobs.length) { out.sort(); console.log(out.join('\n')); } else next();
    });
  }
};
next();
