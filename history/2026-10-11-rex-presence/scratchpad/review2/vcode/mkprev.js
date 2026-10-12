const fs=require('fs'),path=require('path');
for (const r of process.argv.slice(2)) {
  const body=fs.readFileSync(path.join(r,'rex-strength-lab/dist/index.html'),'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}[hidden]{display:none!important}</style></head><body>' + body + '</body></html>';
  fs.writeFileSync(path.join(r,'rex-strength-lab/dist/preview.html'), wrapped);
}
