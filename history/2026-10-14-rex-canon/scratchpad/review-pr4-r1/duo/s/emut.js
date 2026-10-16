const fs = require('fs'), { execSync } = require('child_process');
const ROOT = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr4-r1/duo/mut/rex-strength-lab';
const F = ROOT + '/src/engine.js';
const orig = fs.readFileSync(F, 'utf8');
const M = [
  ['E1 footJ dropped from supplied', 'supplied: pGain + footJ', 'supplied: pGain'],
  ['E2 bounce books the footing share', 'footF = bounce ? 0 : footSplat', 'footF = footSplat'],
  ['E3 bounce non-relativistic 2v', 'vBb = c * Math.tanh(2 * w)', 'vBb = 2 * v'],
  ['E4 no paradox from above', "const lim = holdsGround(cB) && (cB.anchor === 'bolted' || !horiz) ? hb.why : null;", "const lim = holdsGround(cB) && (cB.anchor === 'bolted') ? hb.why : null;"],
  ['E5 hitAbsorbed ignores meanIt', 'out.hitAbsorbed = { E: meanIt || bounce ? 0 : h2.Q };', 'out.hitAbsorbed = { E: bounce ? 0 : h2.Q };'],
  ['E6 Elocal ignores meanIt', 'out.Elocal = (meanIt && !bounce ? h2.Q : 0)', 'out.Elocal = (0)'],
  ['E7 knockAbsorbed.E = E', 'if (nkb) out.knockAbsorbed = { J: p, E: ctxC.meanIt ? 0 : Earr };', 'if (nkb) out.knockAbsorbed = { J: p, E: ctxC.meanIt ? 0 : E };'],
  ['E8 fireball Ereal ignores meanIt', 'const Ereal = nkb ? Egap + (ctxC.meanIt ? Earr : 0) : E;', 'const Ereal = nkb ? Egap : E;'],
  ['E9 Bolted wins over NKB', 'out.push = nkb ? { recoilV: 0, earthRecoilV: 0 }', 'out.push = nkb && !bolted ? { recoilV: 0, earthRecoilV: 0 }'],
  ['E10 pushMatchOwn footJ always the other push', 'const footJ = (moved, H, Pin) => (!isFinite(moved ? H : Pin) ? Infinity : (moved ? H : Pin) * t);', 'const footJ = (moved, H, Pin) => (!isFinite(Pin) ? Infinity : Pin * t);'],
  ['E11 walkOut ignores winner feet', 'a = Math.min(aL, aW);', 'a = aL;'],
  ['E13 standoff pusherSlips kept', 'pusherSlips: !own && cA.F > RA', 'pusherSlips: cA.F > RA'],
  ['E14 standoff rock dipole with own', "rockLoad(out.contact, cB, dSep, cA.anchor === 'bolted' && !own)", "rockLoad(out.contact, cB, dSep, cA.anchor === 'bolted')"],
  ['E15 no winnerSlides', 'if (tableBreaks && cw.ownRecoil) out.winnerSlides = Rw < Pl;', ''],
  ['E16 arm tear with own press', 'out.tearA = cA.anchor === \'bolted\' ? (cA.ownRecoil ? AB : AA) / groundTear(cA) : 0;', 'out.tearA = cA.anchor === \'bolted\' ? AA / groundTear(cA) : 0;'],
  ['E18 shoveBoth vA from rP', 'vA: rT.vB, slideA: rT.slideB, EA: rT.EB', 'vA: rP.vA, slideA: rP.slideA, EA: rP.EA'],
  ['E20 carry stop J 0', 'stop: { J: pA, E: KA }', 'stop: { J: 0, E: KA }'],
  ['E23 arm standing cap kept', 'const capA = tableBreaks && !cA.ownRecoil, capB = tableBreaks && !cB.ownRecoil;', 'const capA = tableBreaks, capB = tableBreaks;'],
  ['E24 pushMatch own if either', 'const own = !!(cA.ownRecoil && cB.ownRecoil);', 'const own = !!(cA.ownRecoil || cB.ownRecoil);'],
  ['E25 recoilAbsorbedA uses DB', 'if (DA > 0) r.recoilAbsorbedA = { J: isFinite(DA) ? DA * t : Infinity', 'if (DA > 0) r.recoilAbsorbedA = { J: isFinite(DB) ? DB * t : Infinity'],
  ['E26 fireball Eblast everything', 'out.Eblast = nkb ? Ereal :', 'out.Eblast = nkb ? out.Ehere :'],
  ['E27 before overpressure uses E', 'out.overpressure = isFinite(Ereal) ? overpressureAt(Ereal, r) : Infinity;', 'out.overpressure = isFinite(E) ? overpressureAt(E, r) : Infinity;'],
  ['E28 carried toGround includes pGain', "out.toGround = { J: footJ, T: Math.max(limbPulse(bB), cfx.t), how: 'carried' }", "out.toGround = { J: footJ + pGain, T: Math.max(limbPulse(bB), cfx.t), how: 'carried' }"],
  ['E29 knockAbsorbed J 0', 'if (nkb) out.knockAbsorbed = { J: p,', 'if (nkb) out.knockAbsorbed = { J: 0,'],
  ['E30 slide from rock friction uses hold', 'const Rb = rockGives ? hb.anc.R : Math.min(hb.R, hb.H);', 'const Rb = rockGives ? tear : Math.min(hb.R, hb.H);'],
  ['E31 pushMatchOwn shovedOff not walkOut when winner can walk', "if (!bolt(cw) && !tornL && moveCheck(cw.F, cw.body.m).walk) {", "if (false) {"],
  ['E32 bothShoved realUpper dropped', "if (cA.mode === 'real' || cB.mode === 'real') r.realUpper = true;", ''],
  ['E33 armWrestle flungApart instead of rockGives', "Object.assign(out, { clash: boltA && boltB ? 'rockGives' : 'flungApart' }", "Object.assign(out, { clash: 'flungApart' }"],
  ['E34 standoff own rockGives tearB uses both', "{ clash: 'rockGives', oneSided: true, tearB: groundTear(cB) }", "{ clash: 'rockGives', oneSided: false, tearB: groundTear(cB), tearA: groundTear(cA) }"],
];
const only = process.argv[2] ? process.argv[2].split(',') : null;
for (const [name, a, b] of M) {
  if (only && !only.some((o) => name.startsWith(o + ' '))) continue;
  const n = orig.split(a).length - 1;
  if (n !== 1) { console.log('SKIP', name, 'matches', n); continue; }
  fs.writeFileSync(F, orig.replace(a, b));
  let out = '';
  try { out = execSync('node test/powers-s68.js --skip-off', { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); } catch (e) { out = (e.stdout || '') + (e.stderr || ''); }
  const fails = out.split('\n').filter((l) => /^FAIL|Error|TypeError/.test(l)).map((l) => l.slice(0, 90));
  console.log(fails.length ? 'KILLED ' : 'SURVIVED', name, fails.length ? '| ' + fails.slice(0, 2).join(' || ') : '');
}
fs.writeFileSync(F, orig);
