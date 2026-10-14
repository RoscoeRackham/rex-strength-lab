const fs=require('fs');
const S=__dirname;
for (const [src,dst] of [[S+'/repo/rex-strength-lab/dist/index.html',S+'/branch.html'],[S+'/main-index.html',S+'/main.html']]) {
  const h=fs.readFileSync(src,'utf8');
  fs.writeFileSync(dst,'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>'+h+'</body></html>');
}
