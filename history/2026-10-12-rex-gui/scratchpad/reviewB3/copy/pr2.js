const d = require('./' + process.argv[2]);
const keys = process.argv.slice(3);
for (const k of Object.keys(d)) if (!keys.length || keys.some((x) => k === x)) {
  let t = d[k] || 'null';
  const r = t.indexOf('VS\nOLLIE'); if (r > 0) { const i = t.indexOf('Just standing', r); const j = t.indexOf('Adjust effort'); t = t.slice(j, j + 1) + t.slice(i + 14); }
  t = t.replace(/\n\n+/g, '\n').split('\n').filter((l) => !/^[\d.,]+ (k?m|m)$/.test(l) && l !== '0').join('\n');
  console.log('=====', k); console.log(t);
}
