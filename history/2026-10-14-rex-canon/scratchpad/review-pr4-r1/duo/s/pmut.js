const fs = require('fs'), { execSync } = require('child_process');
const ROOT = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr4-r1/duo/mut/rex-strength-lab';
const FA = ROOT + '/src/app.html', FE = ROOT + '/src/engine.js';
const origA = fs.readFileSync(FA, 'utf8'), origE = fs.readFileSync(FE, 'utf8');
const M = [
  ['P2 mean variant not passed (collide)', FA, 'const meanRun = !!(over && over.meanIt);', 'const meanRun = false;'],
  ['P3 Ollie gets Rex\'s switch', FA, 'noKnockback: state.oNoKnockback }, overrides', 'noKnockback: state.noKnockback }, overrides'],
  ['P4 duoKey without the switches', FA, ".concat(act === 'catch' ? [state.noKnockback, state.oNoKnockback] : [])", '.concat([])'],
  ['P6 no mean variant for catch', FA, "act === 'catch' ? state.cObj !== 'partner' && !state.keepForm && (state.noKnockback || state.oNoKnockback) : false", "act === 'catch' ? false : false"],
  ['P7 catch blast counts the absorbed motion', FA, '(L.fireball.knockAbsorbed ? L.fireball.Eblast : L.fireball.E)', 'L.fireball.E'],
  ['P10 collide search counts the absorbed hit energy', FA, "const Q = r.unbounded ? (r.outcome === 'carried' ? r.Elocal || 0 : 0)", "const Q = r.unbounded ? (r.outcome === 'carried' ? (r.Elocal || 0) + (r.meanIt ? 0 : r.Q || 0) : 0)"],
  ['P11 Rex ctx without his switch', FA, 'softLanding: state.softLanding, noKnockback: state.noKnockback };', 'softLanding: state.softLanding };'],
  ['E16 arm tear with own press', FE, "out.tearA = cA.anchor === 'bolted' ? (cA.ownRecoil ? AB : AA) / groundTear(cA) : 0;", "out.tearA = cA.anchor === 'bolted' ? AA / groundTear(cA) : 0;"],
  ['E25 recoilAbsorbedA uses DB', FE, 'if (DA > 0) r.recoilAbsorbedA = { J: isFinite(DA) ? DA * t : Infinity', 'if (DA > 0) r.recoilAbsorbedA = { J: isFinite(DB) ? DB * t : Infinity'],
  ['E32 bothShoved realUpper dropped', FE, "if (cA.mode === 'real' || cB.mode === 'real') r.realUpper = true;", ''],
];
const only = process.argv[2] ? process.argv[2].split(',') : null;
const args = process.argv[3] || '--pr4';
for (const [name, F, a, b] of M) {
  if (only && !only.some((o) => name.startsWith(o + ' '))) continue;
  const orig = F === FA ? origA : origE;
  const n = orig.split(a).length - 1;
  if (n !== 1) { console.log('SKIP', name, 'matches', n); continue; }
  fs.writeFileSync(F, orig.replace(a, b));
  let out = '';
  const t0 = Date.now();
  try { execSync('node build.js', { cwd: ROOT, stdio: 'ignore' }); out = execSync('node test/shots.js ' + args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1e8 }); } catch (e) { out = (e.stdout || '') + (e.stderr || ''); }
  const probs = out.split('\n').filter((l) => /^PROBLEM|Error/.test(l)).map((l) => l.slice(0, 300));
  console.log((probs.length ? 'KILLED  ' : 'SURVIVED ') + name + ' (' + Math.round((Date.now() - t0) / 1000) + ' s)' + (probs.length ? '\n    ' + probs.slice(0, 2).join('\n    ') : ''));
  fs.writeFileSync(F, orig);
}
fs.writeFileSync(FA, origA); fs.writeFileSync(FE, origE);
execSync('node build.js', { cwd: ROOT, stdio: 'ignore' });
