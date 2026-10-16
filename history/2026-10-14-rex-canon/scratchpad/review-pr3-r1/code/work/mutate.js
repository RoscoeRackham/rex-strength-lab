// node mutate.js <id>: writes the mutant into mut/rex-strength-lab/src and rebuilds dist
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const W = __dirname, SRC = path.join(W, 'mut/rex-strength-lab/src');
const E0 = fs.readFileSync(path.join(W, 'engine.orig.js'), 'utf8'), A0 = fs.readFileSync(path.join(W, 'app.orig.html'), 'utf8');
const rep = (s, a, b) => { if (!s.includes(a)) throw new Error('not found: ' + a.slice(0, 80)); return s.split(a).join(b); };
const M = {
  orig: [(e) => e, (a) => a],
  dragOn: [(e) => rep(e, 'passenger: (r, o) => !o.safePassenger && (MOVES.throw.passengerLaunch(r, o) || MOVES.throw.passengerDrag(r, o)),', 'passenger: (r, o) => (!o.safePassenger && MOVES.throw.passengerLaunch(r, o)) || MOVES.throw.passengerDrag(r, o),'), (a) => a],
  dropEnergy: [(e) => rep(e, '? { absorbed: r.Eimpact, J:', '? { absorbed: 0, J:'), (a) => a],
  dropLanding: [(e) => rep(e, 'passengerLanding: (r, o) => (o && o.safePassenger', 'passengerLanding: (r, o) => (false && o && o.safePassenger'), (a) => a],
  momentumJ0: [(e) => rep(e, 'J: momentumOf(r.flight.vImpact, o.obj.m) } : null)', 'J: 0 } : null)'), (a) => a],
  momentumVanish: [(e) => rep(e, "if (!r.canMove || !r.flight || !r.flight.landed || !(r.flight.vImpact > 0)) return null;\n          const L = o.obj.L", "if (!r.canMove || !r.flight || !r.flight.landed || !(r.flight.vImpact > 0) || (o.safePassenger && o.obj.passenger)) return null;\n          const L = o.obj.L"), (a) => a],
  keepBlast: [(e) => rep(e, 'const land = r.flight.landed && !(o && o.safePassenger && o.obj && o.obj.passenger) ?', 'const land = r.flight.landed ?'), (a) => a],
  anyPowerSP: [(e) => rep(e, '|| !!c.unbreakable || !!c.ownRecoil);', '|| !!c.unbreakable || !!c.ownRecoil || !!c.safePassenger);'), (a) => a],
  skipMig: [(e) => e, (a) => rep(a, 'if (savedV < 3) state.safePassenger = true;', '')],
  mark2choice: [(e) => e, (a) => rep(a, 'if (savedV < 3) state.safePassenger = true;', 'if (savedV < 2) state.safePassenger = true;')],
  catchDrag: [(e) => e, (a) => rep(rep(a, 'if (!o.passenger || !L || !L.aim || state.safePassenger) return null;', 'if (!o.passenger || !L || !L.aim) return null;'), 'if (!(L.tPush > 0)) return null;\n    const nL', 'if (state.safePassenger || !(L.tPush > 0)) return null;\n    const nL')],
  oldChip: [(e) => e, (a) => rep(a, "if (c.safePassenger) return status('info', 'Safe passenger: a manageable push, spread through them');", "if (c.safePassenger) return dg > L.noHarm(1) ? status(dg > L.injury(2) ? 'bad' : 'warn', 'Safe passenger, but air drag ' + sig(dg, 2) + ' g') : status('info', 'Safe passenger: no harmful g-force');")],
  noCredit: [(e) => e, (a) => rep(a, "passenger: M.passenger && c.safePassenger && offHappens('passenger', { safePassenger: false }) ? 'Safe passenger' : null };", 'passenger: null };')],
  defaultOff: [(e) => e, (a) => rep(a, 'airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true,', 'airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: false,')],
  catchMissOld: [(e) => e, (a) => rep(a, 'else if (o.passenger && state.safePassenger) out.push(callout(', 'else if (false) out.push(callout(')],
  noBurnGuard: [(e) => e, (a) => rep(a, 'burns = !c.keepForm && f.maxStagT > 1200 && share < 1;', 'burns = false;')],
  oldDragText: [(e) => e, (a) => rep(a, "(sp ? '; Safe passenger spreads that through them too, so it stays a manageable push' : '')", "(sp && dg > L.noHarm(1) ? '; Safe passenger covers only his push, not the air' : '')")],
  catchMissNoSP: [(e) => e, (a) => rep(a, "Safe passenger spreads the landing through them and takes back its energy (' + fmtSI(m.E, 'J') + '), so they come down unharmed, with no crater or blast. Its push still reaches the ground and shakes it.'));", "Safe passenger spreads the landing through them and takes back its energy (' + fmtSI(m.E, 'J') + '), so they come down unharmed, with no crater or blast. Its push still reaches the ground and shakes it.'));\n        if (m.E > 4.184e6) out.push(blastBlock(m.E, 'where it lands'));")],
  tileOld: [(e) => e, (a) => rep(a, "spLand ? fmtSI(spLand.absorbed, 'J') + ' taken back: Safe passenger' : fmtTNT(r.Eimpact) + ' on impact'", "fmtTNT(r.Eimpact) + ' on impact'")],
};
const id = process.argv[2];
fs.writeFileSync(path.join(SRC, 'engine.js'), M[id][0](E0));
fs.writeFileSync(path.join(SRC, 'app.html'), M[id][1](A0));
execSync('node build.js', { cwd: path.join(W, 'mut/rex-strength-lab') });
console.log('mutant', id, 'built');
