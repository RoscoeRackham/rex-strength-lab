const fs=require('fs');
const body=fs.readFileSync('/home/user/dino-strength-sim/dist/index.html','utf8');
fs.writeFileSync(__dirname+'/page.html','<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{margin:0}[hidden]{display:none!important}</style></head><body>'+body+'</body></html>');
