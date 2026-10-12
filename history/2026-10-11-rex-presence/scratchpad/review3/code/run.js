// Mutation runner (code lens): node run.js muts.json [parallel]. Each mutant gets its own copy of src/engine.js,
// src/data.js, test/ and research/final-presence.json under code/w/<id>, then runs test/presence.js there.
const fs = require('fs'), path = require('path'), { spawn } = require('child_process');
const SRC = '/home/user/rex-strength-lab/rex-strength-lab';
const HERE = __dirname;
const muts = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const par = Number(process.argv[3] || 2);
const engine = fs.readFileSync(path.join(SRC, 'src/engine.js'), 'utf8');
function setup(m) {
  const d = path.join(HERE, 'w', m.id);
  fs.rmSync(d, { recursive: true, force: true });
  fs.mkdirSync(path.join(d, 'src'), { recursive: true });
  fs.cpSync(path.join(SRC, 'test'), path.join(d, 'test'), { recursive: true });
  fs.cpSync(path.join(SRC, 'research', 'final-presence.json'), path.join(d, 'research', 'final-presence.json'));
  fs.copyFileSync(path.join(SRC, 'src/data.js'), path.join(d, 'src/data.js'));
  let e = engine;
  for (const [find, rep] of m.edits) {
    const n = e.split(find).length - 1;
    if (n !== 1) throw new Error(m.id + ': find occurs ' + n + ' times: ' + find);
    e = e.replace(find, () => rep);
  }
  fs.writeFileSync(path.join(d, 'src/engine.js'), e);
  return d;
}
let idx = 0, running = 0;
function next() {
  while (running < par && idx < muts.length) {
    const m = muts[idx++];
    let d;
    try { d = setup(m); } catch (e) { console.log(m.id, 'SETUP ERROR', e.message); continue; }
    running++;
    const p = spawn('node', ['test/presence.js'], { cwd: d });
    let out = '';
    p.stdout.on('data', (x) => (out += x)); p.stderr.on('data', (x) => (out += x));
    p.on('close', (code) => {
      running--;
      const fails = out.split('\n').filter((l) => l.startsWith('FAIL'));
      console.log(m.id, 'exit', code, 'fails', fails.length, fails.slice(0, 3).join(' || ').slice(0, 400), code && !fails.length ? out.slice(-300) : '');
      next();
    });
  }
}
next();
