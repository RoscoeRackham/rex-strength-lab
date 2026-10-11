const P = require('/home/user/dino-strength-sim/src/engine.js');
const g = P.K.g, body = P.makeBody({});
const F = 511 * g * 0.3;
const sh = (RA, RB) => P.pushApart({ F, d: body.strokes.throw, mA: body.m - body.handEff, mB: 7.26 + body.handEff, RA, RB, mode: 'real', vmax: 55 }).vB;
const bl = (RA, RB) => P.pushApart({ F, d: body.strokes.whip, mA: body.m - body.whipEff, mB: 0.145 + body.whipEff, RA, RB, mode: 'real', vmax: 55 }).vB;
console.log('shot  fit conditions RA=1e9,RB=0:', sh(1e9, 0).toFixed(3), ' throwObject conditions RB=mBg sin37:', sh(4632, (7.26 + body.handEff) * g * Math.sin(37 * Math.PI / 180)).toFixed(3));
console.log('ball  fit conditions RA=1e9,RB=0:', bl(1e9, 0).toFixed(3), ' throwObject conditions:', bl(1e9, 0).toFixed(3));
// sensitivity of ball speed to force vs vmax
for (const ff of [0.3, 0.5, 1.0, 3.0]) console.log('ball, forceFrac', ff, 'vmax 55 ->', P.pushApart({ F: 511 * g * ff, d: body.strokes.whip, mA: body.m - body.whipEff, mB: 0.145 + body.whipEff, RA: Infinity, RB: 0, mode: 'real', vmax: 55 }).vB.toFixed(2));
