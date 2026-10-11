const P0 = require('/home/user/dino-strength-sim/src/engine.js');
const P1 = require('./r_patched/engine.js');
if (!global.window) global.window = {}; require("/home/user/dino-strength-sim/src/data.js"); const D = window.DINO_DATA;
const g = P0.K.g; const body = P0.makeBody({});
const surface = D.surfaces.find(s => s.id === 'concrete');
const ctx = { F: 1.36e14 * g, mode: 'real', body, surface, groundHolds: false, anchor: 'friction' };
const p0 = P0.punch(ctx), p1 = P1.punch(ctx);
const c = { d: body.strokes.punch, mA: body.m - body.handEff, mB: body.handEff, RA: p0.anchor.R, RB: 0, vmax: 17 };
// brute
let xA=0,xB=0,vA=0,vB=0; const F0=1e9, dt=1e-8;
while (xA+xB<c.d){const F=F0*P0.hill((vA+vB)/17,0.25);let aA=(vA>0||F>c.RA)?(F-c.RA)/c.mA:0,aB=(F-c.RB)/c.mB;const nA=Math.max(0,vA+aA*dt),nB=Math.max(0,vB+aB*dt);xA+=0.5*(vA+nA)*dt;xB+=0.5*(vB+nB)*dt;vA=nA;vB=nB;}
console.log('punch lurch old', p0.lurch.toFixed(4), 'finding-fix (d*vA/vmax)', (c.d * p1.recoilV / 17).toFixed(4), 'my fix', p1.lurch.toFixed(4), 'brute', xA.toFixed(4));
const j1 = P1.jump(ctx);
console.log('jump sink: finding-fix (d*vB/vmax)', (body.strokes.leg * j1.push.vB / 30).toFixed(4), 'my fix', j1.sink.toFixed(4));
