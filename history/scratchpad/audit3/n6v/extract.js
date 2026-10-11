const fs = require('fs');
const [src, out] = process.argv.slice(2);
const h = fs.readFileSync(src, 'utf8');
const scripts = [...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
scripts.forEach((s, i) => console.log(i, s.length, s.slice(0, 120).replace(/\n/g, ' ')));
const eng = scripts.find(s => /function pushApart/.test(s));
const data = scripts.find(s => /DINO_DATA\s*=/.test(s));
fs.writeFileSync(out + '-engine.js', eng);
fs.writeFileSync(out + '-data.js', data);
