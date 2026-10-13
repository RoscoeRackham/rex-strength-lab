const { P, obj, rex, ctx, K } = require('./env.js');
const b = obj('baseball');
const c = ctx(1.81436948e23, rex());
const r = P.throwObject(c, b, 0);
const o = Object.assign({}, c, { obj: b, angle: 0, near: P.RESTRAINT.R.NEAR, target: 30 });
const M = P.RESTRAINT.MOVES.throw;
console.log('v/c', r.v / K.c, 'armMass', r.armMass, 'Eobj', r.Eobj.toExponential(3), 'stroke', r.stroke || r.push && r.push.d, 'keys', Object.keys(r).filter(k=>/arm|stroke|hand/i.test(k)).join(','));
const g = 1 + r.Eobj / (b.m * K.c * K.c);
const Earm = (g - 1) * r.armMass * K.c * K.c;
console.log('gamma', g.toExponential(3), 'arm KE at release', Earm.toExponential(3), 'ratio to ball', (Earm / r.Eobj).toFixed(1));
console.log('MOVES.throw.blast at 100%:', M.blast(r, o), 'parts', JSON.stringify(M.blastParts(r, o)), 'boomSpeed/c', M.boomSpeed(r, o) / K.c);
// hand air: area of a hand ~ palm area of the body
const body = c.body; console.log('palmArea', body.palmArea, 'frontArea', body.frontArea);
// lower bound: air mass swept by palm over 1 m at sea level at ~c, coasting snowplow heat; maintained-piston work ~ gamma * mu c^2
const mu = K.rho0 * body.palmArea * 1.0;
const x = mu / r.armMass, S = Math.sqrt(1 + 2 * g * x + x * x);
console.log('air swept by one palm per metre', mu.toFixed(4), 'kg; coasting snowplow rest heat', ((S - 1 - x) * r.armMass * K.c * K.c).toExponential(2), 'J; maintained piston work', (g * mu * K.c * K.c).toExponential(2), 'J; TNT Gt', ((S - 1 - x) * r.armMass * K.c * K.c / 4.184e18).toFixed(0));
