// Inline the engine, data and images into one self-contained page.
const fs = require('fs');
const path = require('path');
const src = (f) => fs.readFileSync(path.join(__dirname, 'src', f), 'utf8');
const uri = (f) => 'data:image/jpeg;base64,' + fs.readFileSync(path.join(__dirname, 'assets', f)).toString('base64');
const IMAGES = { __DINO_IMG__: 'dino.jpg', __DUO_IMG__: 'duo.jpg', __ART_RIG__: 'art-rig.jpg', __ART_UNSTOPPABLE__: 'art-unstoppable.jpg', __ART_ARM__: 'art-arm.jpg', __FACE_REX__: 'face-rex.jpg', __FACE_OLLIE__: 'face-ollie.jpg' };
let html = src('app.html');
html = html.replace('/*__ENGINE__*/', () => src('engine.js')).replace('/*__LADDER__*/', () => src('ladder.js')).replace('/*__DATA__*/', () => src('data.js'));
for (const [key, file] of Object.entries(IMAGES)) {
  if (!html.includes(key)) throw new Error('placeholder missing: ' + key);
  html = html.split(key).join(uri(file));
}
fs.mkdirSync(path.join(__dirname, 'dist'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'dist', 'index.html'), html);
console.log('dist/index.html', (html.length / 1024).toFixed(1), 'KB');
