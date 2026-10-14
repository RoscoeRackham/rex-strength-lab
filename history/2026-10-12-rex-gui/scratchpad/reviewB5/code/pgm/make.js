const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const LAB = path.join(__dirname, '..', 'lab');
const app = fs.readFileSync(path.join(LAB, 'src', 'app.html'), 'utf8');
const M = {
  pA_solo_real_run_gone: ["const cE = eff && eff.real ? Object.assign({}, c0, { unbreakable: false }) : c0;", "const cE = c0;"],
  pG_override_leaks: ["try { parts = gate && gate.stop ? [callout(gate.text)] : BAYS[act](eff ? Object.assign({}, cE, { use: eff.use }) : cE); } finally { state.unbreakable = ub; }", "parts = gate && gate.stop ? [callout(gate.text)] : BAYS[act](eff ? Object.assign({}, cE, { use: eff.use }) : cE);"],
  pH_hint_any_share: ["if (!ready(p0, ['preset:' + e], t0)) { out.side = { p: p0, name: 'preset:' + e }; out.sideWhy = 'Working out whether letting the air take some would do it…'; }\n        else if (!p0.result('preset:' + e).never) {", "if (false) { }\n        else if (true) {"],
};
for (const [k, [a, b]] of Object.entries(M)) {
  const n = app.split(a).length - 1;
  if (n !== 1) { console.log('SKIP ' + k + ': ' + n); continue; }
  const d = path.join(__dirname, k);
  execSync('mkdir -p ' + d + ' && cd ' + LAB + ' && tar --exclude=./shots --exclude=./dist/preview.html -cf - . | tar -xf - -C ' + d);
  fs.writeFileSync(path.join(d, 'src', 'app.html'), app.replace(a, b));
  execSync('cd ' + d + ' && node build.js', { stdio: 'inherit' });
  fs.copyFileSync(path.join(__dirname, '..', 'shots5.js'), path.join(d, 'test', 'shots5.js'));
  console.log('built ' + k);
}
