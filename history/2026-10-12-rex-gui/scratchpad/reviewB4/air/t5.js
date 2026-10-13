const {P, obj, ctx, rex, ollie, ALL} = require('./load.js');
const c=P.K.c, R=P.K.R_E;
for (const D of [5e3, 1.1e4, 1.3e4, 1e5, 1e6]) {
  const cR = ctx(1e20, Object.assign({}, ALL)), cO = Object.assign({}, cR, { body: ollie });
  const L = P.catchLeg(cR, cO, obj('baseball'), D, 'hard');
  // independent: chord from (0, R+h0) to (R+h1) at angle phi
  const h0 = rex.releaseHeight, h1 = ollie.releaseHeight, phi = L.Dfl / R;
  const a0=R+h0, b0=R+h1; const bx=b0*Math.sin(phi), by=b0*Math.cos(phi)-a0; const th=Math.atan2(by,bx)*180/Math.PI;
  // param line P(t) = (t bx, a0 + t by); find where |P| = R
  const A = bx*bx+by*by, B = 2*a0*by, C0 = a0*a0 - R*R; const disc = B*B-4*A*C0;
  let hit = null; if (disc>=0) { const t1=(-B-Math.sqrt(disc))/(2*A); if (t1>0 && t1<1) { const x=t1*bx, y=a0+t1*by; hit = R*Math.atan2(x,y); } }
  console.log(D, L.result, 'th', L.aim && L.aim.thetaDeg.toFixed(6), th.toFixed(6), 'hitAt', L.hitsGround && L.hitsGround.at, hit, 'E', L.hitsGround && L.hitsGround.E.toExponential(3), 'past', L.miss && L.miss.past, 'crater', L.hitsGround && L.hitsGround.crater);
}
