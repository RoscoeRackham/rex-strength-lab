global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const P = require(process.argv[2] === 'old' ? '/home/user/rex-strength-lab/rex-strength-lab/src/engine.js' : __dirname + '/engine-new.js');
const g = P.K.g, M = P.RESTRAINT.MOVES;
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3000 });
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const ctxOf = (kg, x) => Object.assign({ F: kg * g, mode: 'comic', body: rex, surface: surf('concrete'), anchor: 'friction' }, x || {});
const sig = (x) => (typeof x === 'number' ? x.toPrecision(4) : String(x));
const sets = { ON, OFF: {}, recoilOnly: { ownRecoil: true }, unbrOnly: { unbreakable: true }, unbrBolted: { unbreakable: true, anchor: 'bolted' }, onBolted: Object.assign({}, ON, { anchor: 'bolted' }) };
const dials = { def: 90718.474, '1e9': 1e9, '1e12': 1e12 };
let worst = 0; const rows = [];
const close = (tag, parts) => { // parts: {name: [x, y]}
  let sx = 0, sy = 0, scale = 0; for (const [x, y] of Object.values(parts)) { sx += x; sy += y; scale = Math.max(scale, Math.abs(x), Math.abs(y)); }
  const res = Math.hypot(sx, sy) / (scale || 1); worst = Math.max(worst, res);
  rows.push(tag + ' res ' + res.toExponential(1) + ' ' + Object.entries(parts).filter(([, [x, y]]) => x || y).map(([k, [x, y]]) => k + '(' + sig(x) + ',' + sig(y) + ')').join(' '));
};
for (const [sn, s] of Object.entries(sets)) for (const [dn, kg] of Object.entries(dials)) {
  const c = ctxOf(kg, s), w = rex.m * g;
  for (const ang of [0, 45, 90]) {
    const r = P.throwObject(c, obj('car'), ang); if (!r.canMove) continue;
    const th = ang * Math.PI / 180, cs = ang === 90 ? 0 : Math.cos(th), sn_ = Math.sin(th);
    const pObj = r.push.pB * obj('car').m / r.mB, pArm = r.push.pB * r.armMass / r.mB, pRec = Math.max(0, r.push.pA - pArm);
    const parts = { obj: [pObj * cs, pObj * sn_], body: [-pRec * cs, -pRec * sn_] };
    const tg = r.toGround, ra = r.recoilAbsorbed;
    if (tg) { if (tg.whole == null) parts.ground = [-tg.J * cs, -tg.J * sn_]; else { parts.ground = [-(tg.whole * cs - (tg.suppliedSide || 0)), -(tg.whole * sn_ - (tg.suppliedDown || 0))]; parts.oceanWeak = [-(tg.suppliedSide || 0), -(tg.suppliedDown || 0)]; } }
    else if (!ra) parts.groundDerived = [-(pObj - pRec) * cs, -(pObj - pRec) * sn_];   // powers off: not reported
    if (ra) parts.oceanRecoil = [-ra.J * cs, -ra.J * sn_];
    close(['throw', sn, dn, ang].join('|'), parts);
  }
  { // stomp along y (up +), after the blow; weights relative to static
    const st = P.stomp(c), mA = rex.m - rex.legEff, o = Object.assign({ surface: c.surface, body: rex }, s);
    const parts = { body: [0, st.push.pA] };
    // the push phase: standing foot unloads (or the bolts / power hold him)
    if (st.recoilAbsorbed) parts.oceanRecoil = [0, st.recoilAbsorbed.J];
    else parts.groundStanding = [0, st.push.pB - st.push.pA];   // (not reported: derived)
    parts.groundBlow = [0, -st.push.pB];   // the foot's own momentum at the blow (blow() adds a stamp effective-mass term on top, a gravity-driven part)
    close(['stomp', sn, dn].join('|'), parts);
  }
  { const pu = P.punch(c); const parts = { fist: [pu.push.pB, 0], body: [-pu.push.pA, 0] };
    if (pu.recoilAbsorbed) parts.oceanRecoil = [-pu.recoilAbsorbed.J, 0]; else parts.groundDerived = [-(pu.push.pB - pu.push.pA), 0];
    close(['punch(push end)', sn, dn].join('|'), parts); }
  { const cl = P.clap(c); close(['clap', sn, dn].join('|'), { hand1: [cl.push.pB, 0], hand2: [-cl.push.pB, 0], body: [0, 0] }); }
  { const j = P.jump(c), p = P.vToMomentum(j.v, rex.m), parts = { body: [0, p] };
    if (j.pushOff) { parts.ground = [0, -j.pushOff.J]; parts.oceanWeak = [0, -j.pushOff.supplied]; } else parts.groundDerived = [0, -p];
    close(['jump', sn, dn].join('|'), parts); }
  { const pl = P.pull(c, obj('bus')); if (pl.canMove) { const t = pl.t10m, a = pl.accel, mo = obj('bus').m;
    const parts = { load: [a * mo * t, 0], body: [a * rex.m * t, 0], groundLoadResist: [pl.resist * t, 0] };
    if (pl.recoilAbsorbed) { parts.oceanRecoil = [-pl.recoilAbsorbed.J, 0]; parts.groundFeet = [-a * rex.m * t, 0]; } else parts.groundFeet = [-pl.usable * t, 0];
    close(['pull', sn, dn].join('|'), parts); } }
}
console.log(rows.join('\n')); console.log('worst residual', worst.toExponential(2));
