// node mutate.js <name> : makes mut/<name>/rex-strength-lab with the mutant applied (from mutants.js)
const fs = require('fs'), path = require('path');
const S = __dirname, LAB = path.join(S, 'repo', 'rex-strength-lab');
const M = require('./mutants.js')[process.argv[2]];
if (!M) throw new Error('no mutant ' + process.argv[2]);
const dst = path.join(S, 'mut', process.argv[2], 'rex-strength-lab');
fs.rmSync(path.join(S, 'mut', process.argv[2]), { recursive: true, force: true });
fs.mkdirSync(dst, { recursive: true });
for (const d of ['src', 'test']) fs.cpSync(path.join(LAB, d), path.join(dst, d), { recursive: true });
fs.copyFileSync(path.join(LAB, 'build.js'), path.join(dst, 'build.js'));
fs.symlinkSync(path.join(LAB, 'assets'), path.join(dst, 'assets'));
for (const [file, find, repl] of M) {
  const f = path.join(dst, file); let s = fs.readFileSync(f, 'utf8');
  const n = s.split(find).length - 1;
  if (n !== 1) throw new Error(process.argv[2] + ': ' + n + ' matches in ' + file + ' for ' + find.slice(0, 80));
  s = s.replace(find, () => repl); fs.writeFileSync(f, s);
}
console.log('made', dst);
