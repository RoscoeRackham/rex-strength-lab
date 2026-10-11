const g = 9.80665, G = 6.6743e-11;
const W = 180 * g;
// W-7 corrected: a body that can stand (1.4F >= W) but whose strength is below its footing needs mu > 1/1.4
console.log('stand needs F >=', W / 1.4, 'concrete R', 0.6 * W, 'gravel R', 0.84 * W);
const F = 140 * g, net = 0.84 * W - F, a = net / 360, x = 2.275;
console.log('W-7 on gravel, Rex 140 kg:', { F, net, a, t: Math.sqrt(2 * x / a), v: Math.sqrt(2 * a * x) });
// L-5/6 corrected thresholds using the peak vertical pull along a path beside the lifter at the contact offset
const mNS = 7.2e16, rEq = Math.cbrt(3 * 0.18 / (4 * Math.PI)), dc = 2 * rEq;
const peak = 0.3849 * G * mNS * mNS / (dc * dc); // max of y/(x^2+y^2)^1.5 * x^2 = 2/(3*sqrt(3))
console.log('peak factor', 2 / (3 * Math.sqrt(3)), 'peak pull', 2 / (3 * Math.sqrt(3)) * G * mNS * mNS / (dc * dc), 'need', 2 / (3 * Math.sqrt(3)) * G * mNS * mNS / (dc * dc) + mNS * g);
const need = 2 / (3 * Math.sqrt(3)) * G * mNS * mNS / (dc * dc) + mNS * g;
console.log('margin 1e23 kg', 1e23 * g / need, 'margin 1e22', 1e22 * g / need, 'threshold kg', need / g);
// Table lateral capacity, rough (estimates): steel peg 25 mm, grip ~7.5 cm above the top
const Fy = 250e6, d = 0.025, lev = 0.075;
const My = Fy * Math.PI * d ** 3 / 32, Mp = Fy * d ** 3 / 6;
const di = 0.019, Ztube = Math.PI / 64 * (d ** 4 - di ** 4) / (d / 2);
console.log('solid peg yield/plastic force kN', My / lev / 1e3, Mp / lev / 1e3, 'tube 25x3 yield kN', Fy * Ztube / lev / 1e3);
// topple (no table, upright): F h = W b/2
for (const [h, b] of [[1.2, 0.3], [1.3, 0.5]]) console.log('topple at h', h, 'stance', b, 'F', W * b / 2 / h);
// self-locking push angle on concrete
const mu = 0.6, phi = Math.atan(1 / mu); console.log('self-locking angle deg', phi * 180 / Math.PI, 'Ollie slides at C', mu * W / (Math.cos(phi) + mu * Math.sin(phi)));
// shover slide with full-body friction
const k = 0.5 * 1.225 * 0.8, slide = (v, R) => 180 / (2 * k) * Math.log1p(k * v * v / R);
console.log('W-1 slideA corrected', slide(49.2714, 0.6 * W), 'SH-5 slideA corrected', slide(71.1937, 0.6 * W));
