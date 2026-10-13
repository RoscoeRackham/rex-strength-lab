const fs = require('fs');
const [src, out] = process.argv.slice(2);
const html = fs.readFileSync(src, 'utf8');
fs.writeFileSync(out, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
