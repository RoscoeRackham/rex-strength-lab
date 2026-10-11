const fs = require('fs'), path = require('path');
const SRC = '/home/user/dino-strength-sim/src';
const src = (f) => fs.readFileSync(path.join(SRC, f), 'utf8');
const img = 'data:image/jpeg;base64,' + fs.readFileSync('/home/user/dino-strength-sim/assets/dino.jpg').toString('base64');
let html = src('app.html');
html = html.replace('/*__ENGINE__*/', () => src('engine.js')).replace('/*__DATA__*/', () => src('data.js')).replace('__DINO_IMG__', img);
const wrapped = '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>';
fs.writeFileSync(path.join(__dirname, 'page.html'), wrapped);
// also compare with dist
const dist = fs.readFileSync('/home/user/dino-strength-sim/dist/index.html', 'utf8');
console.log('dist contains current engine:', dist.includes(src('engine.js').slice(0, 2000)), dist.includes(src('engine.js').slice(-2000)));
console.log('dist DINO_DATA draft?', dist.includes('DRAFT data'));
