const fs = require('fs'); const path = require('path');
const root = '/home/user/dino-strength-sim';
const src = (f) => fs.readFileSync(path.join(root, 'src', f), 'utf8');
let html = src('app.html');
html = html.replace('/*__ENGINE__*/', () => src('engine.js')).replace('/*__DATA__*/', () => src('data.js')).replace('__DINO_IMG__', '');
fs.writeFileSync(path.join(__dirname, 'app_built.html'), html);
