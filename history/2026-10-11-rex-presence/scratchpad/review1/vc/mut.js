// node mut.js <id>  : applies mutation <id> to a copy of HEAD's src+test and runs test/presence.js
const fs = require('fs'), path = require('path'), { spawnSync, execSync } = require('child_process');
const M = {
  NF: ['src/engine.js', '(ramp ? 0.1875 : 0.375) * src.F', '(ramp ? 0.1875 : 0.5) * src.F'],
  PACE: ['src/engine.js', 'LOAD: { at: 1.2, vh: 1.5, slope: 0.25,', 'LOAD: { at: 1.2, vh: 1.5, slope: -0.25,'],
  M3: ['src/engine.js', 'if (!L || !L.landed || L.soft || !(L.v > 0)) return null;', 'if (!L || !L.landed || !(L.v > 0)) return null;'],
  M11: ['src/engine.js', 'const Eimpact = landed && !soft ?', 'const Eimpact = landed ?'],
  M4: ['src/engine.js', "{ id: 'boom', test: (m, r, o) => !(o.silentStrike && m.silent) && m.speed(r) >= K.a0 }", "{ id: 'boom', test: (m, r, o) => m.speed(r) >= K.a0 }"],
  M7: ['src/engine.js', 'out.cool = !!ctxT.coolFlight;', 'out.cool = false;'],
  M14: ['src/engine.js', 'dragLoss: !fallsBack && flight.landed && !flight.relativistic ? Math.max(', 'dragLoss: !fallsBack && flight.landed && !flight.relativistic ? 2 * Math.max('],
  M6: ['src/engine.js', 'out.gentleT = !!ctxT.gentleHold; out.gentleC = !!ctxC.gentleHold;', 'out.gentleT = false; out.gentleC = false;'],
  M15: ['src/engine.js', "    const Fu = driveStrength(ctx);\n    if (!(Fu > W)) {\n      return { thrust: 0, limit: 'effort'", "    const Fu = ctx.F;\n    if (!(Fu > W)) {\n      return { thrust: 0, limit: 'effort'"],
  M16: ['src/engine.js', "{ id: 'air', test: (m, r, o) => !!m.blast && blastRadius(m.blast(r, o), R.DP_HARM) >= o.near }", "{ id: 'air', test: (m, r, o) => false }"],
  M12: ['src/engine.js', "{ id: 'houses', test: (m, r, o) => !!m.blast && blastRadius(m.blast(r, o), R.DP_HOUSES) >= o.near }", "{ id: 'houses', test: (m, r, o) => false }"],
  M8: ['src/engine.js', 'const T = Math.max(Tp, Tu, Tl);', 'const T = 10 * Math.max(Tp, Tu, Tl);'],
  M9: ['src/engine.js', 'const tau = g.H / GROW.TISSUE_C;', 'const tau = 10 * g.H / GROW.TISSUE_C;'],
  M10: ['src/engine.js', 'EIBAND: [[0.044, 45], [0.1, 40], [0.2, 25], [0.6, 13], [1.6, 10]]', 'EIBAND: [[0.044, 90], [0.1, 80], [0.2, 50], [0.6, 26], [1.6, 20]]'],
  M13: ['src/engine.js', 'launchG: !push.stalled && push.t > 0 && isFinite(push.t) ? v / push.t / K.g', 'launchG: !push.stalled && push.t > 0 && isFinite(push.t) ? 2 * v / push.t / K.g'],
  NONE: null,
  PACE2: ['src/engine.js', 'Fhs = 2 * hs.share * body.m * hs.v * sc / Thv;', 'Fhs = 2 * hs.share * body.m * hs.v * sc * (0.18 / Fr) / Thv;'],
  SANE: ['src/engine.js', 'plasterWalk: 7.6e-3, plaster: 12.7e-3', 'plasterWalk: 7.6e-3, plaster: 12e-3'],
  SANE2: ['src/engine.js', 'const near = (ramp ? 0.1875 : 0.375) * src.F', 'const near = (ramp ? 0.1875 : 0.3) * src.F'],
};
const id = process.argv[2];
const base = path.join(__dirname, 'head', 'rex-strength-lab');
const dir = path.join(__dirname, 'mut', id);
execSync(`rm -rf ${dir} && mkdir -p ${dir} && cp -r ${base}/src ${base}/test ${dir}/`);
const m = M[id];
if (m) {
  const f = path.join(dir, m[0]); const s = fs.readFileSync(f, 'utf8');
  const cnt = s.split(m[1]).length - 1;
  if (cnt !== 1) { console.log(id + ': find string occurs ' + cnt + ' times'); process.exit(2); }
  fs.writeFileSync(f, s.replace(m[1], m[2]));
}
const r = spawnSync('node', ['test/presence.js'], { cwd: dir, encoding: 'utf8', maxBuffer: 1e8 });
const fails = (r.stdout || '').split('\n').filter((l) => l.startsWith('FAIL'));
console.log(id + ': exit ' + r.status + (r.status === 0 ? ' NOT CAUGHT' : ' caught') + ' | ' + (r.stdout || '').trim().split('\n').pop() + (fails.length ? ' | first fail: ' + fails[0].slice(0, 160) : '') + (r.stderr ? ' | stderr: ' + r.stderr.slice(0, 200) : ''));
