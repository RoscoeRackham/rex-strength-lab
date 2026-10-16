const { P, g, R3, O3, DIAL, ctx, sig, surf } = require('./common.js');
const out = {};
const ch = (F, o, xO, xR) => P.collide(ctx(F, O3, xO), ctx(F, R3, xR), o);
const pick = (r) => r.carry ? { outcome: r.outcome, F: r.carry.F, T: r.carry.T, FT: r.carry.F * r.carry.T, pGain: r.carry.pGain, footJ: r.carry.footJ, supplied: r.carry.supplied, rockGives: r.carry.rockGives, hold: r.carry.hold, holdH: r.hold && r.hold.H, depth: r.after && r.after.splat && r.after.splat.depth, Eground: r.after && r.after.splat && r.after.splat.Eground } : { outcome: r.outcome };
out.allout = pick(ch(DIAL, { source: 'sprint' }));
out.least = pick(ch(4260 * g, { source: 'sprint' }));
out.rock = pick(ch(DIAL, { source: 'sprint' }, { unbreakable: false }, { anchor: 'bolted', unbreakable: false }));
out.set1 = pick(ch(DIAL, { source: 'set', gb: 1 / P.K.c }));
out.jumpReal = pick(ch(DIAL, { source: 'jump' }, { unbreakable: false }, { unbreakable: false }));
out.jumpRealBolted = pick(ch(DIAL, { source: 'jump' }, { unbreakable: false }, { unbreakable: false, anchor: 'bolted' }));
// arm
const aw = (FR, FO, x) => P.armWrestle(ctx(FR, R3, x), ctx(FO, O3, x));
const a1 = aw(DIAL, 1000 * g, { keepForm: false });
out.arm1t = { outcome: a1.outcome, tableBreaks: a1.tableBreaks, by: a1.tableBreaksBy, padLoad: a1.padLoad, loserPadLoad: a1.loserPadLoad, tableLat: a1.tableLat, pin: a1.pin && { v: a1.pin.v, E: a1.pin.E, t: a1.pin.t }, slamRatio: a1.slamRatio };
const a2 = aw(1e6 * g, 90718.474 * g, { keepForm: false, unbreakable: false });
const a2b = P.armWrestle(ctx(1e6 * g, R3, { keepForm: false, unbreakable: false }), ctx(90718.474 * g, O3, { keepForm: false, unbreakable: false, anchor: 'bolted' }));
out.armTear = { outcome: a2b.outcome, tearB: a2b.tearB, contact: a2b.contact };
// steady push
const so = P.standoff(ctx(DIAL, O3), ctx(DIAL, R3));
out.push = { outcome: so.outcome, DA: so.DA, HB: so.HB, drive: so.drive };
const sor = P.standoff(ctx(DIAL, O3, { unbreakable: false }), ctx(DIAL, R3, { unbreakable: false, anchor: 'bolted' }));
out.pushRock = { outcome: sor.outcome, HB: sor.HB, rockGives: sor.rockGives, tearB: sor.tearB, rockTear: sor.rock && sor.rock.tear, drive: sor.drive };
// shoving match
const pm = P.pushMatch(ctx(DIAL, R3, { anchor: 'bolted', unbreakable: false }), ctx(DIAL, O3, { unbreakable: false }));
out.pmRock = { outcome: pm.outcome, vA: pm.vA, vB: pm.vB, tornA: pm.tornA, tearA: pm.tearA, footA: pm.footA, HA: pm.HA };
const pmu = P.pushMatch(ctx(Infinity, R3), ctx(Infinity, O3, { anchor: 'bolted' }));
out.pmInfBolted = { outcome: pmu.outcome, vA: pmu.vA, vB: pmu.vB, winner: pmu.winner, noAnswer: pmu.noAnswer };
const sbu = P.shoveBoth(ctx(Infinity, R3, { anchor: 'bolted' }), ctx(Infinity, O3));
out.sbInfBolted = { clash: sbu.clash, vA: sbu.vA, vB: sbu.vB, noAnswer: sbu.noAnswer, shover: sbu.shover };
console.log(JSON.stringify(out, null, 1));
