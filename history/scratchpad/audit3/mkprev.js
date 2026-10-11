const fs=require('fs');
const body = fs.readFileSync('/home/user/dino-strength-sim/dist/index.html', 'utf8');
const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}[hidden]{display:none!important}</style></head><body>' + body + '</body></html>';
fs.writeFileSync(__dirname+'/preview.html', wrapped);
