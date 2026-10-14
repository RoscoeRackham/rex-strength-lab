const { P, D, g, surf, obj, rex, ollie, ctxOf, ON, sig, M } = require('./common.js');
const row = (label, s0, s1) => console.log(label.padEnd(44), 'ppv5 off', sig(P.ppvAt(s0, 5), 3), ' on', sig(P.ppvAt(s1, 5), 3), ' plaster off', sig(P.plasterReach(s0), 3), ' on', sig(P.plasterReach(s1), 3));
for (const sid of ['sand', 'concrete']) {
  for (const lg of [3.5, 4, 5, 6, 7, 8]) {
    const kg = Math.pow(10, lg);
    const c0 = ctxOf(kg, { surface: surf(sid) }), c1 = ctxOf(kg, { surface: surf(sid), unbreakable: true });
    const o0 = { surface: c0.surface, body: rex, m: rex.m, obj: obj('car'), angle: 30, near: 5 }, o1 = Object.assign({ unbreakable: true }, o0);
    // stomp
    const s0 = P.stomp(c0), s1 = P.stomp(c1);
    row(sid + ' 1e' + lg + ' stomp (breaks off: ' + (M.stomp.ground(s0, o0)) + ')', M.stomp.shake(s0, o0), M.stomp.shake(s1, o1));
    const j0 = P.jump(c0), j1 = P.jump(c1);
    row(sid + ' 1e' + lg + ' jump (overLimit off: ' + j0.overLimit + ', v ' + sig(j0.v,3) + '/' + sig(j1.v,3) + ')', M.jump.shake(j0, o0), M.jump.shake(j1, o1));
    const t0 = P.throwObject(c0, obj('car'), 30), t1 = P.throwObject(c1, obj('car'), 30);
    row(sid + ' 1e' + lg + ' throw car 30 (v ' + sig(t0.v,3) + '/' + sig(t1.v,3) + ')', M.throw.shake(t0, o0), M.throw.shake(t1, o1));
  }
}
