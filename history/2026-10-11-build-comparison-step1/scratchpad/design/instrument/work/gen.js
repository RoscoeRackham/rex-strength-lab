const fs = require('fs');
const src = fs.readFileSync(__dirname + '/mock.src.html', 'utf8');
const data = fs.readFileSync(__dirname + '/mockdata.json', 'utf8');
const body = src.replace('/*__DATA__*/null', data);
const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<style>:root{color-scheme:light;padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom)}body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style>
</head><body>
${body}
</body></html>`;
fs.writeFileSync(__dirname + '/../mock.html', page);
console.log('wrote mock.html', page.length);
