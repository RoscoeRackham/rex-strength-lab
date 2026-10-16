const { P, D, g, rex, ollie, surf, obj } = require('./eng.js');
const bad = [], cnt = {};
const chk = (lab, x, keys) => { for (const k of keys) { const v = x && x[k]; if (!v) continue; cnt[k] = (cnt[k] || 0) + 1; for (const f of ['J', 'T']) if (typeof v[f] !== 'number' || Number.isNaN(v[f]) || v[f] < 0) bad.push(lab + ' ' + k + '.' + f + '=' + v[f]); } };
const noGround = (lab, x, keys) => { for (const k of keys) if (x && x[k]) bad.push(lab + ' has ' + k + ' with ownRecoil'); };
for (const lg of [3, 5, 8, 12, 16, 20, 26, Infinity]) for (const mode of ['comic', 'real']) for (const sid of ['sand', 'concrete', 'granite', 'ice', 'softclay']) for (const anchor of ['friction', 'bolted']) for (const ub of [false, true]) {
  const s = surf(sid); if (!s) continue;
  const c = { F: isFinite(lg) ? Math.pow(10, lg) * g : Infinity, mode, body: rex, surface: s, anchor, ownRecoil: true, unbreakable: ub, airAbsorb: 1, keepForm: true };
  const L = [lg, mode, sid, anchor, ub].join('|');
  for (const o of D.objects) { if (o.noThrow) continue; for (const a of [0, 45, 90]) { const r = P.throwObject(c, o, a); chk(L + ' throw ' + o.id + a, r, ['recoilAbsorbed']); noGround(L + ' throw ' + o.id + a, r, ['toGround']); } }
  for (const o of D.objects) if (!o.noPull) { const r = P.pull(c, o); chk(L + ' pull ' + o.id, r, ['recoilAbsorbed']); }
  chk(L + ' stomp', P.stomp(c), ['recoilAbsorbed']); chk(L + ' punch', P.punch(c), ['recoilAbsorbed']);
  const cO = Object.assign({}, c, { body: ollie });
  const sh = P.shove(c, cO); chk(L + ' shove', sh, ['recoilAbsorbed']); noGround(L + ' shove', sh, ['toGround']);
  const tp = P.throwPartner(c, cO, 45); if (tp.r) { chk(L + ' wthrow', tp.r, ['recoilAbsorbed']); noGround(L + ' wthrow', tp.r, ['toGround']); }
  const aw = P.armWrestle(c, Object.assign({}, cO, { F: c.F / 2 })); chk(L + ' arm', aw, ['recoilAbsorbed']);
  if (lg === 3 || lg === 8 || lg === 20 || lg === Infinity) for (const [oid, D0, st] of [['baseball', 10, 'hard'], ['car', 30, 'hard'], ['car', 30, 'easy'], ['bus', 10, 'hard'], ['piano', 100, 'easy']]) {
    const Lg = P.catchLeg(c, cO, obj(oid), D0, st); chk(L + ' catch ' + oid + st, Lg, ['recoilAbsorbedT', 'recoilAbsorbedC']); noGround(L + ' catch ' + oid + st + ' ' + Lg.result, Lg, ['toGroundT', 'toGroundC']);
    if (Lg.catch && (Lg.catch.uAfter || Lg.catch.slide || Lg.catch.carried)) bad.push(L + ' catch ' + oid + ' moves: ' + Lg.catch.uAfter + ' ' + Lg.catch.slide);
    if (['caught', 'slams', 'wreckage', 'cant-hold-it'].includes(Lg.result) && !Lg.recoilAbsorbedC) bad.push(L + ' catch ' + oid + ' ' + Lg.result + ' no recoilAbsorbedC');
    cnt['result:' + Lg.result] = (cnt['result:' + Lg.result] || 0) + 1;
  }
  if (lg === 3 || lg === 8 || lg === Infinity) for (const st of ['easy', 'hard']) { const t = P.tossPartner(c, ollie, 'Ollie', st, 10, 'friction'); chk(L + ' toss' + st, t, ['recoilAbsorbedT', 'recoilAbsorbedC']); noGround(L + ' toss' + st, t, ['toGroundT', 'toGroundC']); if (t.catch && !t.recoilAbsorbedC) bad.push(L + ' toss no C'); }
}
console.log(JSON.stringify(cnt)); console.log(bad.length, bad.slice(0, 20).join('\n'));
