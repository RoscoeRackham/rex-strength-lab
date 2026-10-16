const { P, D, g, rex, ollie, surf, obj, ON } = require('./eng.js');
const bad = [], cnt = { ra: 0, raT: 0, raC: 0 };
const chk = (tag, x, f) => { if (!x) return; cnt[f]++; for (const k of ['J', 'T']) { const v = x[k]; if (typeof v !== 'number' || Number.isNaN(v) || v < 0) bad.push(tag + ' ' + f + '.' + k + '=' + v); } const a = x.thetaDeg != null ? x.thetaDeg : x.angleDeg; if (typeof a !== 'number' || Number.isNaN(a)) bad.push(tag + ' angle ' + a); };
const fin = (tag, k, v) => { if (v != null && (Number.isNaN(v) || v < 0)) bad.push(tag + ' ' + k + '=' + v); };
const objs = ['car', 'bus', 'baseball', 'person', 'semi', 'motorcycle'];
for (const lg of [3, 5, 7, 9, 12, 15, 20, 26, 30, Infinity]) for (const sid of ['concrete', 'sand', 'ice', 'granite']) for (const mode of ['comic', 'real']) for (const anc of ['friction', 'bolted']) for (const unb of [true, false]) for (const kf of [true, false]) {
  const x = Object.assign({}, ON, { unbreakable: unb, keepForm: kf, anchor: anc }), F = lg === Infinity ? Infinity : Math.pow(10, lg) * g;
  const c = Object.assign({ F, mode, body: rex, surface: surf(sid) }, x), cO = Object.assign({}, c, { body: ollie });
  const tag = [lg, sid, mode, anc, unb, kf].join(' ');
  try {
    for (const o of ['car', 'bus', 'baseball']) for (const th of [0, 45, 90]) { const r = P.throwObject(c, obj(o), th); chk(tag + ' throw ' + o + th, r.recoilAbsorbed, 'ra'); if (r.toGround) bad.push(tag + ' throw toGround'); fin(tag + ' throw', 'sinkRatio', r.sinkRatio); fin(tag + ' throw', 'sinkRatioRaw', r.sinkRatioRaw); }
    const s = P.stomp(c); chk(tag + ' stomp', s.recoilAbsorbed, 'ra');
    const pu = P.punch(c); chk(tag + ' punch', pu.recoilAbsorbed, 'ra');
    const pl = P.pull(c, obj('bus')); chk(tag + ' pull', pl.recoilAbsorbed, 'ra');
    for (const ob of ['friction', 'bolted']) { const sh = P.shove(c, Object.assign({}, cO, { anchor: ob })); chk(tag + ' shove ' + ob, sh.recoilAbsorbed, 'ra'); if (sh.toGround) bad.push(tag + ' shove toGround'); if (sh.vA > 0) bad.push(tag + ' shove vA ' + sh.vA); }
    const tp = P.throwPartner(c, cO, 45); if (tp.r) { chk(tag + ' wthrow', tp.r.recoilAbsorbed, 'ra'); if (tp.r.toGround) bad.push(tag + ' wthrow toGround'); }
    for (const st of ['easy', 'hard']) { const t = P.tossPartner(c, ollie, 'Ollie', st, 10, 'friction'); chk(tag + ' toss ' + st, t.recoilAbsorbedT, 'raT'); chk(tag + ' toss ' + st, t.recoilAbsorbedC, 'raC'); if (t.toGroundT || t.toGroundC) bad.push(tag + ' toss toGround'); if (t.catch) fin(tag + ' toss', 'sinkRatio', t.catch.sinkRatio); }
    if (lg <= 26 || lg === Infinity) for (const o of objs) for (const [Dd, st] of [[10, 'hard'], [30, 'easy']]) { const L = P.catchLeg(c, cO, obj(o), Dd, st); chk(tag + ' catch ' + o + st, L.recoilAbsorbedT, 'raT'); chk(tag + ' catch ' + o + st, L.recoilAbsorbedC, 'raC');
      if (L.toGroundT || L.toGroundC) bad.push(tag + ' catch toGround'); if (L.catch && ['caught', 'slams', 'wreckage', 'cant-hold-it'].includes(L.result) && !(L.catch.uAfter === 0 && L.catch.slide === 0 && !L.catch.carried)) bad.push(tag + ' catcher moves ' + o + ' ' + L.result);
      if (L.catch) { fin(tag + ' catch ' + o, 'sinkRatio', L.catch.sinkRatio); fin(tag + ' catch ' + o, 'sinkRatioRaw', L.catch.sinkRatioRaw); }
      if (L.catch && ['caught', 'slams', 'wreckage', 'cant-hold-it'].includes(L.result) && !L.recoilAbsorbedC) bad.push(tag + ' catch no RAC ' + o + ' ' + L.result); }
    const aw = P.armWrestle(c, Object.assign({}, cO, { F: F / 2 })); if (aw.recoilAbsorbed) chk(tag + ' arm', aw.recoilAbsorbed, 'ra');
  } catch (e) { bad.push(tag + ' THROW ' + e.message); }
}
console.log(JSON.stringify(cnt), bad.length + ' problems'); for (const b of bad.slice(0, 40)) console.log(b);
