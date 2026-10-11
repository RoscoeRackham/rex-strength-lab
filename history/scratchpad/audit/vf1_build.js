const fs = require('fs'), path = require('path');
const root = '/home/user/dino-strength-sim';
const src = (f) => fs.readFileSync(path.join(root, 'src', f), 'utf8');
let html = src('app.html');
html = html.replace('/*__ENGINE__*/', () => src('engine.js')).replace('/*__DATA__*/', () => src('data.js')).replace('__DINO_IMG__', '');
const wrapped = '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>';
fs.writeFileSync(path.join(__dirname, 'vf1', 'ui.html'), wrapped);
