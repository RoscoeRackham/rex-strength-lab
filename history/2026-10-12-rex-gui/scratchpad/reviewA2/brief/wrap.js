const fs=require('fs');
const [src,dst]=process.argv.slice(2);
fs.writeFileSync(dst,'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>'+fs.readFileSync(src,'utf8')+'</body></html>');
