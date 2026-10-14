const fs = require('fs');
for (const [src, dst] of [['branch-index.html', 'pages/branch.html'], ['main-index.html', 'pages/main.html']]) {
  const html = fs.readFileSync(src, 'utf8');
  fs.writeFileSync(dst, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
}
