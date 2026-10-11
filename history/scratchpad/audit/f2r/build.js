const fs = require('fs'), path = require('path');
const src = (f) => fs.readFileSync(path.join('/home/user/dino-strength-sim/src', f), 'utf8');
let html = src('app.html');
html = html.replace('/*__ENGINE__*/', () => src('engine.js')).replace('/*__DATA__*/', () => src('data.js')).replace('__DINO_IMG__', '');
fs.writeFileSync(path.join(__dirname, 'ui.html'), html);
