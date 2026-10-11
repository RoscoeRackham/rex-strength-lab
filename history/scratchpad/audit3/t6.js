const {P,D,g,ctx,obj}=require('./h.js');
for (const oid of ['pyramid','tank','shot']) for (let lg = 6; lg <= 20; lg += 1) {
  const c = ctx({logKg: lg, anchor: 'bolted'});
  const t0 = Date.now();
  const r = P.throwObject(Object.assign({}, c, {record: true}), obj(oid), 90);
  const f = r.flight;
  if (!r.canMove) { console.log(oid, lg, 'cannot move'); continue; }
  console.log(oid, lg, 'v', r.v.toPrecision(3), 'apex', f.apex.toPrecision(3), 'range', f.range.toPrecision(3), 'time', f.time.toPrecision(3), 'landed', f.landed, 'esc', f.escaped, 'hill', !!f.leavesHill, 'orbit', f.orbit, 'timedOut', f.timedOut, 'rel', f.relativistic, 'ms', Date.now() - t0, 'pathpts', f.path ? f.path.length : 0);
}
