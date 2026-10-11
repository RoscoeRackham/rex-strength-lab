const X = require('./weight.js'); const { W, P, K } = X;
require('/home/user/dino-strength-sim/src/data.js'); const D = window.DINO_DATA;
const f = (x, n) => Number(x).toPrecision(n || 4);
const H = 2, V = P.bodyVolume(H);
const def = P.makeBody({ H }), ns = P.makeBody({ H, m: 4.12e17 * V }), wd = P.makeBody({ H, m: 2.77e9 * V });
console.log('Req', f(X.eqRadius(V), 6));
// T1 default self gravity
const sd = X.selfGravity(def); console.log('T1 default: GM', f(sd.GM), 'gSurf', f(sd.gSurf), 'vEsc', f(sd.vEsc), 'dBeat', f(sd.dBeat), 'rB', f(sd.rBondi), 'rs', f(sd.rs), 'compact', f(sd.compact));
const sn = X.selfGravity(ns); console.log('T2 NS: m', f(ns.m), 'GM', f(sn.GM), 'gSurf', f(sn.gSurf), 'in g', f(sn.gSurf / K.g), 'vEsc', f(sn.vEsc), 'dBeat', f(sn.dBeat), 'rB', f(sn.rBondi), 'bondi', f(sn.bondiRate), 'heat', f(sn.heatPerKg), 'power', f(sn.infallPower), 'stagT', f(sn.infallT), 'holdsAir', sn.holdsAir, 'rCrush', f(sn.rCrush), 'rCrushU', f(sn.rCrushUnconfined), 'tidal1g', f(sn.tidal1g), 'tidal@10m g', f(sn.tidal(10, 1.8) / K.g), 'decomp', f(sn.decompJ), 'ratio to Earth bind', f(sn.decompJ / 2.49e32), 'rs', f(sn.rs));
const in10 = X.infall(sn.GM, sn.R, 10); console.log('   infall from 10 m: t', f(in10.t), 'v', f(in10.v));
const swd = X.selfGravity(wd); console.log('T3 WD: m', f(wd.m), 'gSurf', f(swd.gSurf), 'vEsc', f(swd.vEsc), 'dBeat', f(swd.dBeat), 'rB', f(swd.rBondi), 'beatsOutside', swd.beatsOutside);
// BH
for (const h of [0.4, 2, 50]) { const rho = X.blackHoleDensity(h), v = P.bodyVolume(h); console.log('T4 BH H', h, 'Req', f(X.eqRadius(v)), 'rhoBH', f(rho), 'mBH', f(rho * v), 'in Earths', f(rho * v / W.M_E), 'Buchdahl mass', f(8 / 9 * rho * v)); }
const bh = P.makeBody({ H, m: X.blackHoleDensity(H) * V }); const sbh = X.selfGravity(bh); console.log('   BH body: rs', f(sbh.rs), 'R', f(sbh.R), 'blackHole', sbh.blackHole);
const ec = X.earthCollapse(bh.m); console.log('T5 Earth collapse onto BH Rex: tff s', f(ec.tff), 'Elow', f(ec.Elow), 'x binding', f(ec.Elow / 2.49e32));
const ec1 = X.earthCollapse(W.M_E); console.log('   m = ME: tff', f(ec1.tff), 'Elow', f(ec1.Elow));
// ground
const S = (id) => D.surfaces.find((s) => s.id === id);
for (const [nm, b] of [['default', def], ['steel', P.makeBody({ H, m: 7850 * V })], ['osmium', P.makeBody({ H, m: 22587 * V })], ['m2e7', P.makeBody({ H, m: 2e7 })]]) for (const sid of ['sand', 'gravel', 'softclay', 'concrete', 'granite']) { const g = X.groundUnderWeight(b, S(sid), false); console.log('T6 ground', nm, sid, g.regime, 'p1', f(g.footPressure), 'q0', f(g.q0), 'ratio', f(g.standRatio), 'sink', f(g.sink)); }
console.log('   thresholds: stands-on-concrete max m', f(2.5e6 * 2 * def.footArea / K.g), 'granite feet', f(1.7e9 * 2 * def.footArea / K.g), 'falls-through', f(1.7e9 * def.topArea / K.g), 'rho', f(1.7e9 * def.topArea / K.g / V));
// moves
for (const [nm, b, kg] of [['default@dial', def, 90718.474], ['NS@dial', ns, 90718.474], ['default@10kg', def, 10], ['default@150kg', def, 150]]) { const mv = X.moveCheck(kg * K.g, b.m); console.log('T7 moves', nm, mv.stand, mv.walk, mv.run, 'needs', f(mv.standNeedKg), f(mv.walkNeedKg), f(mv.runNeedKg)); }
// fall through
const ft = X.fallThrough(ns, { latDeg: 0, tMax: 3 * 3600, dtMax: 1, stopAtFirstTurn: true });
console.log('T8 NS first pass: t min', f(ft.firstTurn.out.t / 60), 'depth m', f(ft.firstTurn.out.depth), 'dLon', f(ft.firstTurn.out.dLonFromAntipode), 'km west', f(-ft.firstTurn.out.dLonFromAntipode * Math.PI / 180 * K.R_E / 1000), 'minR km', f(ft.minR / 1e3), 'maxV', f(ft.maxV));
const st = X.settle(ns); console.log('T9 NS settle: years', f(st.years), 'halfPasses', f(st.halfPasses), 'rStop m', f(st.rStop), 'first pass loss', f(st.firstPassLossJ), 'energy', f(st.energyJ), 'x Chicxulub', f(st.energyJ / 4.2e23), 'avg power TW', f(st.energyJ / (st.years * 3.15576e7) / 1e12));
const fw = X.fallThrough(wd, { latDeg: 0, tMax: 40 * 86400, dtMax: 1 }); console.log('T10 WD: stuck t h', f(fw.stuck.t / 3600), 'r km', f(fw.stuck.r / 1e3), 'maxV', f(fw.maxV), 'energy', f(wd.m * (0 - X.premPhi(fw.stuck.r))), 'Mt', f(wd.m * (0 - X.premPhi(fw.stuck.r)) / 4.184e15));
// gravity tunnel check (no drag)
const nd = X.fallThrough(ns, { latDeg: 90, tMax: 3 * 3600, dtMax: 0.5, stopAtFirstTurn: true, noDrag: true }); console.log('T11 pole, no drag: far turn t min', f(nd.firstTurn.out.t / 60), 'maxV', f(nd.maxV));
// mutual gravity
const mg = X.mutualGravity(ns.m, sn.R, ns.m, sn.R); console.log('T12 NS+NS contact d', f(mg.dContact), 'F', f(mg.Fcontact), 'x weight', f(mg.Fcontact / (ns.m * K.g)), 'lift kg to separate', f(mg.Fcontact / K.g), 'Ebind', f(mg.Ebind), 'equal-weight d', f(mg.dEqualWeight), 'slide d (mu .6)', f(Math.sqrt(W.G * ns.m / (0.6 * K.g))));
const ftg = X.fallTogether(ns.m, ns.m, mg.dContact, 10); console.log('   fall together from 10 m: t', f(ftg.t), 'v', f(ftg.v), 'E', f(W.G * ns.m * ns.m * (1 / mg.dContact - 1 / 10)));
const mgd = X.mutualGravity(180, sd.R, 180, sd.R); console.log('T13 default pair F', f(mgd.Fcontact), 'as mass mg', f(mgd.Fcontact / K.g * 1e6));
// throw escape
console.log('T14 NS escape speed from 0.5 m', f(X.escapeSpeedFrom(ns.m, 0.5)), 'vInf for 1.161e4', f(X.vInfinity(1.161e4, ns.m, 0.5)), 'pull at 1 m', f(X.selfPull(ns.m, 1)));
// presets masses
for (const [nm, rho] of [['plush', 30], ['human', 1060], ['steel', 7850], ['osmium', 22587], ['WD', 2.77e9], ['NS', 4.12e17]]) console.log('T15 preset', nm, 'm', f(rho * V));
console.log('Phobos', f(7.087e5 / W.G), 'Deimos', f(9.62e4 / W.G), 'NS/Phobos', f(ns.m / (7.087e5 / W.G)), 'WD/Nimitz', f(wd.m / 1.0394e8));
