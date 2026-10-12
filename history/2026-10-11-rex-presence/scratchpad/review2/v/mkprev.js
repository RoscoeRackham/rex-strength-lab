const fs=require('fs');
const body=fs.readFileSync('/home/user/rex-strength-lab/rex-strength-lab/dist/index.html','utf8');
fs.writeFileSync(__dirname+'/preview.html','<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}[hidden]{display:none!important}</style></head><body>' + body + '</body></html>');
