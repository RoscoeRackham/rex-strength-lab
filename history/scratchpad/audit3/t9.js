const {P,D,g,ctx,obj}=require('./h.js');
let worst = [];
for (const mode of ['comic','real']) for (const anchor of ['friction','braced']) for (const H of [0.4, 2, 50]) for (const lg of [3, 4, 5, 6, 7, 8]) for (const oid of ['baseball','shot','car','tank','semi','loco']) {
  const c = ctx({mode, anchor, H, logKg: lg});
  const t0 = process.hrtime.bigint();
  P.throwObject(Object.assign({}, c, {record: true}), obj(oid), 45);
  const ms = Number(process.hrtime.bigint() - t0) / 1e6;
  worst.push([ms, mode, anchor, H, lg, oid]);
}
worst.sort((a, b) => b[0] - a[0]);
console.log(worst.slice(0, 8).map((w) => w[0].toFixed(0) + 'ms ' + w.slice(1).join(' ')).join('\n'));
