// node page-reverts.js [ids]: builds the page with one round 1 fix reverted, runs r1check.js on it
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const REPO = path.join(__dirname, 'repo/rex-strength-lab');
const rd = (f) => fs.readFileSync(path.join(REPO, 'src', f), 'utf8');
const IMAGES = { __DINO_IMG__: 'dino.jpg', __DUO_IMG__: 'duo.jpg', __ART_RIG__: 'art-rig.jpg', __ART_UNSTOPPABLE__: 'art-unstoppable.jpg', __ART_ARM__: 'art-arm.jpg', __FACE_REX__: 'face-rex.jpg', __FACE_OLLIE__: 'face-ollie.jpg' };
const uri = (f) => 'data:image/jpeg;base64,' + fs.readFileSync(path.join(REPO, 'assets', f)).toString('base64');
function build(app, eng) {
  let html = app.replace('/*__ENGINE__*/', () => eng).replace('/*__LADDER__*/', () => rd('ladder.js')).replace('/*__DATA__*/', () => rd('data.js'));
  for (const [k, f] of Object.entries(IMAGES)) html = html.split(k).join(uri(f));
  return html;
}
const REVERTS = require('./page-reverts-list.js');
const want = process.argv.slice(2);
for (const R of REVERTS.filter((r) => !want.length || want.includes(r.id))) {
  let app = rd('app.html'), eng = rd('engine.js'), err = null;
  for (const [file, f, r] of R.edits) {
    const s = file === 'engine' ? eng : app, n = s.split(f).length - 1;
    if (n !== 1) { err = file + ' find occurs ' + n + ' times: ' + f.slice(0, 90); break; }
    if (file === 'engine') eng = eng.replace(f, () => r); else app = app.replace(f, () => r);
  }
  if (err) { console.log(R.id, 'ERR', err); continue; }
  const out = path.join(__dirname, 'pages', R.id + '.dist.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, build(app, eng));
  const p = spawnSync('node', [path.join(__dirname, 'r1check.js'), out, R.id], { encoding: 'utf8', maxBuffer: 1 << 26 });
  let res; try { res = JSON.parse(p.stdout); } catch (e) { res = { items: ['PARSE ' + p.stdout.slice(0, 200) + p.stderr.slice(0, 400)] }; }
  const fails = res.items.filter((x) => !x.startsWith('ok '));
  console.log(R.id, fails.length ? 'CAUGHT' : 'NOT CAUGHT', '|', R.what, '|', fails.map((x) => x.slice(0, 120)).join(' || '), res.errs && res.errs.length ? 'ERRS ' + res.errs.join(';').slice(0, 200) : '');
}
