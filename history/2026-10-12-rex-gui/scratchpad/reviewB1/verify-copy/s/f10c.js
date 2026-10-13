const { P, D, ctx, surf } = require('./env');
const ollie = P.makeBody({ build: 'ollie', H: 3.06, m: 3007 });
const kg = 100 * 907.18474;
for (const u of [true, false]) {
  const cO = ctx(kg, { body: ollie, ownRecoil: false, unbreakable: u }), cR = ctx(kg, { ownRecoil: false, unbreakable: u });
  const r = P.collide(cO, cR, { source: 'stomp', gb: Math.log10(100/299792458) });
  console.log('stomp-launch unbreakable', u, 'v0', r.v0, 'outcome', r.outcome, 'held', r.held, 'rock', r.rock && JSON.stringify({rT: r.rock.rT}), 'keys', Object.keys(r).filter(k=>/sink|rock|ground|tear|hole|crack/i.test(k)).join(','));
  const s = P.collide(cO, cR, { source: 'sprint', gb: 0 });
  console.log('sprint unbreakable', u, 'v0', s.v0, 'outcome', s.outcome, 'toGround', s.toGround && JSON.stringify(s.toGround), 'rock', s.rock && s.rock.rT);
}
