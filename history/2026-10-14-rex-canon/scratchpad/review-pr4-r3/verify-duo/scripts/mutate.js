// usage: node mutate.js <rex-strength-lab dir> <mutant ids comma-separated>
const fs = require('fs'), path = require('path');
const dir = process.argv[2], ids = process.argv[3].split(',');
const M = {
  U1: ['src/app.html', "' + (r.loserElbow != null ? 'what turns his forearm about his elbow' : 'his arm') + '", "his arm"],
  U3: ['src/app.html', "].filter(Boolean).map((x) => (walkW && x.label === (walkW === 'A' ? 'Rex’s push' : 'Ollie’s push') ? Object.assign(x, { label: (walkW === 'A' ? 'Rex' : 'Ollie') + ' could push' }) : x)), (x) => fmtSI(x, 'N')));", "].filter(Boolean), (x) => fmtSI(x, 'N')));"],
  U10: ['src/app.html', "boltShakeA ? groundShakeChip(boltShakeA, cP.surface, 'The push through ' + pusher + '’s bolts') : ", ""],
  N3: ['src/engine.js', "const rw = { J: cl.body.m * v + Hl * t, T: t, thetaDeg: 0 };", "const rw = { J: (Hl + cl.body.m * a) * t, T: t, thetaDeg: 0 };"],
  N10: ['src/app.html', "slB = moved && r.vB > 0 ? (r.xB || 0) + r.slideB", "slB = moved && r.vB > 0 ? (r.xA || 0) + r.slideB"],
  N12: ['src/app.html', "wT = r.t > 0 ? Math.max(P.limbPulse(cwB.body), r.t) : 0", "wT = r.t"],
};
for (const id of ids) {
  const [f, a, b] = M[id], p = path.join(dir, f), s = fs.readFileSync(p, 'utf8');
  const n = s.split(a).length - 1;
  if (n !== 1) { console.error(id + ': found ' + n + ' times'); process.exit(1); }
  fs.writeFileSync(p, s.replace(a, b)); console.log('applied ' + id);
}
