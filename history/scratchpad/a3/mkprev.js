// Same wrapper test/shots.js writes, without the screenshots; plus a what-if copy that doesn't force oSame.
const fs = require('fs');
const body = fs.readFileSync('/home/user/dino-strength-sim/dist/index.html', 'utf8');
const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}[hidden]{display:none!important}</style></head><body>' + body + '</body></html>';
fs.writeFileSync('/home/user/dino-strength-sim/dist/preview.html', wrapped);
const key = 'state.oSame = true;   // Ollie is as strong as Rex';
if (!wrapped.includes(key)) throw new Error('oSame line not found');
fs.writeFileSync(__dirname + '/preview-whatif.html', wrapped.replace(key, '/* scratch what-if copy */   // Ollie is as strong as Rex'));
console.log('preview written');
