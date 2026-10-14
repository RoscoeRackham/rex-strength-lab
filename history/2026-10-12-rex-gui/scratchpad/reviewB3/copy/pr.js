const d = require('./' + process.argv[2]);
const keys = process.argv.slice(3);
const strip = (t) => t == null ? 'null' : t.split('\n').filter((l) => !/^.+ · [\d.,]+( ×)? ?(10\S+ )?(k?g|t|million t|billion t|quadrillion t|quintillion t|sextillion t)$/.test(l)).join('\n').replace(/EFFORT\n[\s\S]*?Custom \(use the slider\)\n/, 'EFFORT…\n');
for (const k of Object.keys(d)) if (!keys.length || keys.some((x) => k.startsWith(x))) { console.log('=====', k); console.log(strip(d[k])); }
