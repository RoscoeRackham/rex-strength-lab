const { P, D, g, surf, obj, rex, ollie, ctxOf, ON, sig, M } = require('./common.js');
for (const sid of ['sand', 'concrete']) for (const [oid, Dd, style, kg] of [['car', 30, 'hard', 1e6], ['bus', 30, 'hard', 1e6], ['car', 30, 'easy', 1e5], ['baseball', 10, 'hard', 1e8]]) {
  const res = [];
  for (const ex of [{}, { unbreakable: true }]) {
    const cR = ctxOf(kg, Object.assign({ surface: surf(sid) }, ex)), cO = Object.assign({}, cR, { body: ollie });
    const L = P.catchLeg(cR, cO, obj(oid), Dd, style);
    res.push(JSON.stringify(ex) + ' ' + L.result + ' sinkRatio ' + sig(L.catch && L.catch.sinkRatio, 3) + ' vArr ' + sig(L.vArrive, 3) + ' keys ' + (L.catch ? Object.keys(L.catch).filter(k => /Raw|real/i.test(k)).join(',') : ''));
  }
  console.log(sid, oid, Dd, style, sig(kg, 2), '|', res.join(' | '));
}
