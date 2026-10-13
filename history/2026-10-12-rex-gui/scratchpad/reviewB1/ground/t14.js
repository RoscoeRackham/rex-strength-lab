const { P, D, g, surf, obj, rex, ollie, ctxOf, ON, sig, M } = require('./common.js');
for (const sid of ['granite', 'concrete']) {
  for (const own of [false, true]) {
    const c = ctxOf(1e9, { surface: surf(sid), anchor: 'bolted', ownRecoil: own });
    const p = P.RESTRAINT.planNow('throw', c, { obj: obj('bus'), angle: 45, target: 30, near: 5 });
    const rr = p.result('preset:rattle'), rp = p.result('preset:plaster');
    const v = rr && !rr.never ? p.run(rr.use).v : null;
    console.log(sid, 'bolted, ownRecoil', own, 'rattle', rr.never ? 'never' : sig(rr.use / g, 3) + ' kg (v ' + sig(v, 4) + ')', 'plaster', rp.never ? 'never' : sig(rp.use / g, 3) + ' kg');
  }
  // same throw at a fixed effort: v and ppv
  for (const own of [false, true]) { const c = ctxOf(1e7, { surface: surf(sid), anchor: 'bolted', ownRecoil: own }); const r = P.throwObject(c, obj('bus'), 45); const o = { surface: c.surface, body: rex, ownRecoil: own, obj: obj('bus'), angle: 45 }; console.log('  1e7 kg bolted ownRecoil', own, 'v', sig(r.v, 6), 'ppv5', sig(P.ppvAt(M.throw.shake(r, o), 5), 3)); }
}
