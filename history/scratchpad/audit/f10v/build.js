const fs = require('fs'), path = require('path'); const __d = '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit';
const root = '/home/user/dino-strength-sim';
const src = (f) => fs.readFileSync(path.join(root, 'src', f), 'utf8');
let html = src('app.html');
html = html.replace('/*__ENGINE__*/', () => src('engine.js')).replace('/*__DATA__*/', () => src('data.js')).replace('__DINO_IMG__', '');
const wrapped = '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>';
fs.writeFileSync(path.join(__d, 'f10v', 'ui.html'), wrapped);
