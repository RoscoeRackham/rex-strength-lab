// node buildmut.js <name> <search> <replace>   -> pmut/<name>.html (dist body), from the repo's src
const fs = require('fs'), path = require('path');
const R = '/home/user/rex-strength-lab/rex-strength-lab';
const [name, search, replace] = process.argv.slice(2);
const src = (f) => fs.readFileSync(path.join(R, 'src', f), 'utf8');
let app = src('app.html');
if (search) { const n = app.split(search).length - 1; if (n !== 1) { console.log('occurs', n); process.exit(2); } app = app.replace(search, replace); }
const uri = (f) => 'data:image/jpeg;base64,' + fs.readFileSync(path.join(R, 'assets', f)).toString('base64');
const IMAGES = { __DINO_IMG__: 'dino.jpg', __DUO_IMG__: 'duo.jpg', __ART_RIG__: 'art-rig.jpg', __ART_UNSTOPPABLE__: 'art-unstoppable.jpg', __ART_ARM__: 'art-arm.jpg', __FACE_REX__: 'face-rex.jpg', __FACE_OLLIE__: 'face-ollie.jpg' };
let html = app.replace('/*__ENGINE__*/', () => src('engine.js')).replace('/*__DATA__*/', () => src('data.js'));
for (const [k, f] of Object.entries(IMAGES)) html = html.split(k).join(uri(f));
fs.writeFileSync(path.join(__dirname, 'pmut', name + '.html'), html);
console.log('built', name);
