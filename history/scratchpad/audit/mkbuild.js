const fs = require('fs'); const path = require('path');
const R = '/home/user/dino-strength-sim';
const src = (f) => fs.readFileSync(path.join(R, 'src', f), 'utf8');
const uri = (f) => 'data:image/jpeg;base64,' + fs.readFileSync(path.join(R, 'assets', f)).toString('base64');
const IMAGES = { __DINO_IMG__: 'dino.jpg', __DUO_IMG__: 'duo.jpg', __ART_RIG__: 'art-rig.jpg', __ART_UNSTOPPABLE__: 'art-unstoppable.jpg', __ART_ARM__: 'art-arm.jpg', __FACE_REX__: 'face-rex.jpg', __FACE_OLLIE__: 'face-ollie.jpg' };
let html = src('app.html');
html = html.replace('/*__ENGINE__*/', () => src('engine.js')).replace('/*__DATA__*/', () => src('data.js'));
for (const [key, file] of Object.entries(IMAGES)) html = html.split(key).join(uri(file));
fs.writeFileSync(path.join(__dirname, 'index-fresh.html'), html);
