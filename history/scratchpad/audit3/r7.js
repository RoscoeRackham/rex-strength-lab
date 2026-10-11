const { P, D, g, S, O, ctx } = require('./common.js');
console.log('comicFrac', Object.fromEntries(['throwPush','throwWhip','punch','clap','jump','stomp'].map(k=>[k,P.MUSCLE[k].comicFrac])));
const c = ctx({ lg: 4.5 });
c.noBlend = true;
const r = P.throwOnce(c, O('car'), 45);
console.log('engine: v', r.v, 'recoilV', r.recoilV, 'pushA v', r.push.vA, 'F', r.F, 'Fdrive', r.Fdrive, 'heldBack', r.heldBack);
// independent 1-D reference
const th = Math.PI / 4, sin = Math.sin(th), cos = Math.cos(th), mu = 0.6;
const body = c.body; const arm = 2 * body.handEff; const mB = 1340 + arm, mA = body.m - arm;
const Fs = c.F; const Fdrive = Math.min(Fs, P.MUSCLE.throwPush.comicFrac * 2 * Fs);
const F = Math.sqrt(Fdrive ** 2 - (mB * g * cos) ** 2);
const R1 = (mu * (mA * g + mB * g * cos * cos) + mB * g * sin * cos) / (cos - mu * sin);
const fA = cos * (cos - mu * sin) * (F - R1), fB = F - mB * g * sin;
const t = Math.sqrt(2 * 1.6 / (fA / mA + fB / mB));
console.log('ref: F', F, 'R1', R1, 'vB', fB / mB * t, 'vA', fA / mA * t, 'recoil net of arm', (fA * t - fB * t * arm / mB) / body.m);
// held back to R
const tH = Math.sqrt(2 * 1.6 / (0 + (R1 - mB * g * sin) / mB));
console.log('held at R: vB', (R1 - mB * g * sin) / mB * tH);
