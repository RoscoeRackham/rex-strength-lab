const fs = require('fs');
const { rows } = JSON.parse(fs.readFileSync('all.json'));
const strKey = (c) => c.chip || ('1e' + c.log);
const key = (c) => [strKey(c), c.mode, c.surface + (c.groundHolds ? '+comic' : ''), c.anchor, c.size + 'm', c.tab, c.obj || '', c.angle != null ? '@' + c.angle : ''].join(' ');
const texts = (r) => [['verdict', r.verdict], ...r.chips.map((x) => ['chip', x]), ...r.tiles.map((t) => ['tile', t.join(' / ')]), ...r.happens.map((x) => ['li', x]), ...r.callouts.map((x) => ['callout', x]), ...r.muted.map((x) => ['muted', x]), ...r.svg.map((x) => ['svg', x]), ...r.math.map((x) => ['math', x])].filter((x) => x[1]);
const re = new RegExp(process.argv[2]);
const inc = process.argv[3] ? new RegExp(process.argv[3]) : null;
const ctxw = 90;
const seen = new Map();
for (const r of rows) {
  const k = key(r.cfg);
  if (inc && !inc.test(k)) continue;
  for (const [where, t] of texts(r)) {
    const lines = t.split('\n');
    for (const line of lines) {
      const m = line.match(re); if (!m) continue;
      const i = m.index;
      const snip = line.slice(Math.max(0, i - ctxw), i + ctxw);
      const sig = where + ' ' + snip.replace(/[\d.,]+/g, '#');
      if (!seen.has(sig)) seen.set(sig, { n: 0, ex: k + ' [' + where + '] …' + snip + '…' });
      seen.get(sig).n++;
    }
  }
}
for (const [s, v] of seen) console.log(v.n + '  ' + v.ex);
