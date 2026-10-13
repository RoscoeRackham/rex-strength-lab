// default Wrestle throw (Rex throws Ollie at 45 deg, dial 100 short tons, powers on, concrete): does real ground bear
// the landing? the weakGround parts
const { P, g, ctxOf, oCtx, sig, surf, ollie } = require('./h.js');
const kg = +(process.argv[2] || 100 * 907.18474), ang = +(process.argv[3] || 45);
const cA = ctxOf(kg), cB = oCtx(cA), t = P.throwPartner(cA, cB, ang), f = t.r.flight;
const v = f.vImpact, th = f.impactAngleDeg * Math.PI / 180, T = Math.max(1e-3, t.obj.L / v), J = P.vToMomentum(v, ollie.m);
const sf = cA.surface, Nmax = P.qultFor(sf, ollie.footB) * 2 * ollie.footArea, W = ollie.m * g;
const Jd = J * Math.sin(th), Jh = J * Math.cos(th), capD = (Nmax - W) * T, capH = sf.mu * Nmax * T;
console.log('range', sig(f.range), 'vImpact', sig(v), 'impact angle', sig(f.impactAngleDeg), 'T', sig(T), 's');
console.log('down: Jd', sig(Jd), 'cap (Nmax - W) T', sig(capD), '-> mean downward force Jd/T', sig(Jd / T), 'N vs bearing beyond weight', sig(Nmax - W), Jd <= capD ? '(real ground BEARS the landing)' : '(exceeds)');
console.log('side: Jh', sig(Jh), 'cap mu Nmax T', sig(capH), 'mu', sf.mu, '| real friction available mu (Jd + W T)', sig(sf.mu * (Jd + W * T)));
console.log('landToGround', JSON.stringify(t.landToGround));
// a sliding stop on unbroken ground: how far he would skid with the sideways momentum the lab hands to the ocean
const vSide = (Jh - Math.min(Jh, sf.mu * (Jd + W * T))) / ollie.m;
console.log('sideways speed left after the 1-pulse stop under real friction', sig(vSide), 'm/s; skid on mu g:', sig(vSide * vSide / (2 * sf.mu * g)), 'm');
