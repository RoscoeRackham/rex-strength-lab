// node one.js '<json state>' [maxchars]
const fs = require('fs');
const st = JSON.parse(process.argv[2]);
fs.writeFileSync('/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit/regr/_one.json', JSON.stringify([['one', st]]));
require('child_process').execFileSync('node', ['drive.js', '_one.json', '_one.jsonl'], { cwd: __dirname });
const r = JSON.parse(fs.readFileSync(__dirname + '/_one.jsonl', 'utf8').trim());
console.log('dt', r.dt.toFixed(0), 'errs', JSON.stringify(r.errs), JSON.stringify(r.perrs));
console.log(r.text.slice(0, Number(process.argv[3] || 3000)));
