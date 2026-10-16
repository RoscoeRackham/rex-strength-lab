const fs = require('fs'), path = require('path');
const base = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r1/code';
for (const [name, dir] of [['pr3', 'repo'], ['pr2', 'wt-pr2'], ['main', 'wt-main']]) {
  const body = fs.readFileSync(path.join(base, dir, 'rex-strength-lab/dist/index.html'), 'utf8');
  fs.writeFileSync(path.join(__dirname, name + '.html'), '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
}
