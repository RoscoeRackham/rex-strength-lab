const fs = require('fs'), path = require('path');
const R = '/home/user/dino-strength-sim';
const src = (f) => fs.readFileSync(path.join(R, 'src', f), 'utf8');
const img = 'data:image/jpeg;base64,' + fs.readFileSync(path.join(R, 'assets', 'dino.jpg')).toString('base64');
let html = src('app.html');
html = html.replace('/*__ENGINE__*/', () => src('engine.js')).replace('/*__DATA__*/', () => src('data.js')).replace('__DINO_IMG__', img);
const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}[hidden]{display:none!important}</style></head><body>' + html + '</body></html>';
fs.writeFileSync(path.join(__dirname, 'preview.html'), wrapped);
console.log('built from src at', new Date().toISOString(), fs.statSync(path.join(R, 'src', 'app.html')).mtime.toISOString());
