const fs = require('fs'), path = require('path'), { execFile } = require('child_process');
const LAB = path.join(__dirname, '../lab'), muts = require('./muts.js');
const only = process.argv[2] ? new RegExp(process.argv[2]) : null;
const list = muts.filter((m) => !only || only.test(m[0]));
function cpdir(a, b) { fs.mkdirSync(b, { recursive: true }); for (const f of fs.readdirSync(a)) { const s = path.join(a, f), d = path.join(b, f); if (fs.statSync(s).isDirectory()) cpdir(s, d); else fs.copyFileSync(s, d); } }
async function one([name, from, to]) {
  const dir = path.join(__dirname, 'm', name);
  fs.rmSync(dir, { recursive: true, force: true });
  cpdir(path.join(LAB, 'src'), path.join(dir, 'src')); cpdir(path.join(LAB, 'test'), path.join(dir, 'test'));
  const f = path.join(dir, 'src/engine.js'), s = fs.readFileSync(f, 'utf8'), n = s.split(from).length - 1;
  if (n !== 1) return name + ': PATTERN COUNT ' + n;
  fs.writeFileSync(f, s.replace(from, to));
  return new Promise((res) => execFile('node', ['test/powers.js', '--skip-off'], { cwd: dir, timeout: 600000, maxBuffer: 1e8 }, (err, out, errS) => {
    const fails = (out || '').split('\n').filter((l) => /^FAIL/.test(l)).map((l) => '    ' + l.slice(0, 220));
    const tail = ((out || '').match(/(\d+)\/(\d+) passed/) || ['(no summary) ' + (errS || '').slice(0, 300)])[0];
    res(name + ': ' + tail + '\n' + fails.join('\n'));
  }));
}
(async () => {
  const q = list.slice(), outs = [];
  await Promise.all([0, 1, 2, 3].map(async () => { while (q.length) { const m = q.shift(); const r = await one(m); console.log(r); } }));
})();
