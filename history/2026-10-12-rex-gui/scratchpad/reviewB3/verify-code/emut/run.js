// engine mutants for test/powers.js --skip-off
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const SRC = path.join(__dirname, '..', 'repo', 'rex-strength-lab');
const eng = fs.readFileSync(path.join(SRC, 'src/engine.js'), 'utf8');
const MUT = {
  e10: ['const Ediss = held ? E2 : 2 * Mb * E2 / (Mf + M1 + Mb);', 'const Ediss = E2;'],
  e16: ['const extra = (cA.unbreakable || cA.ownRecoil) && !push.stalled ?', 'const extra = cA.unbreakable && !push.stalled ?'],
  e17: ["shake: (r, o) => (o.ownRecoil && o.anchor !== 'bolted' && r.canMove", "shake: (r, o) => (o.ownRecoil && r.canMove"],
  e6: ["return ppvAt(own, o.near) > ppvAt(MOVES.throw.landShake(r, o), o.near) ? 'him' : 'landing';", "return 'landing';"],
};
const which = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(MUT);
for (const id of which) {
  const [a, b] = MUT[id];
  const n = eng.split(a).length - 1;
  if (n !== 1) { console.log(id, 'pattern count', n); continue; }
  const dir = path.join(__dirname, id);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(path.join(dir, 'src'), { recursive: true });
  execSync(`cp -r ${SRC}/test ${dir}/test && cp ${SRC}/src/data.js ${dir}/src/`);
  fs.writeFileSync(path.join(dir, 'src/engine.js'), eng.replace(a, b));
  let out;
  try { out = execSync(`node ${dir}/test/powers.js --skip-off`, { encoding: 'utf8', maxBuffer: 1e8, timeout: 600000 }); } catch (e) { out = e.stdout; }
  const fails = out.split('\n').filter((l) => /^FAIL/.test(l));
  console.log(id, out.trim().split('\n').pop(), fails.length ? '\n   ' + fails.join('\n   ') : '');
}
