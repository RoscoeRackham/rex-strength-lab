const { P, D, g, surf, obj, rex, ollie, M, ctxOf, sig } = require('./common.js');
for (const sid of ['granite','concrete','sand','stiffclay','ice','steel']) for (let lg = 4; lg <= 9; lg += 0.5) {
  for (const own of [false, true]) {
  const c = ctxOf(Math.pow(10,lg)*g, { surface: surf(sid), unbreakable: true, ownRecoil: own });
  const s = P.stomp(c);
  const o = { body: rex, surface: c.surface, unbreakable: true };
  const fa = M.stomp.footAir(s, o);
  if (s.vFoot >= P.K.a0 && !s.realBreaks) console.log(sid, lg, own, 'vFoot', sig(s.vFoot), 'realHole', sig(s.realHole), 'E', sig(s.E), 'footAir', fa && sig(fa.E), 'blast', sig(M.stomp.blast(s, o)), 'work', sig(s.push.EA + s.push.EB), 'blastOff', sig(M.stomp.blast(P.stomp(Object.assign({}, c, {unbreakable:false})), {})));
  }
}
