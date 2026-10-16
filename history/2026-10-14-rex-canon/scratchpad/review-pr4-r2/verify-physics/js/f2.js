const { P, g, R3, O3, dial, c3 } = require('./common.js');
const AW = P.AW;
function show(lab, cA, cB) {
  const r = P.armWrestle(cA, cB);
  const keys = ['outcome', 'winner', 'tableBreaks', 'tableBreaksBy', 'PA', 'PB', 'AA', 'AB', 'RA', 'RB', 'padLoad', 'loserPadLoad', 'loserSlides', 'winnerSlides', 'tearA', 'tearB', 'contact'];
  const o = {}; for (const k of keys) o[k] = typeof r[k] === 'number' ? +r[k].toPrecision(5) : r[k];
  console.log('==', lab); console.log(JSON.stringify(o));
  if (r.outcome === 'pin') {
    const aWins = r.winner === 'A', Pw = aWins ? r.AA : r.AB, Pl = aWins ? r.PB : r.PA, ml = (aWins ? cB : cA).body.m, M = AW.effMass * (cA.body.m + cB.body.m);
    const a = (Pw - Pl) / M, C = Pl + AW.effMass * ml * a, elbow = Math.abs(AW.holdArm * ml * a - C);
    const Rl = aWins ? r.RB : r.RA;
    console.log('  standing pin a', a.toFixed(1), 'C', C.toFixed(0), 'loser elbow force', elbow.toFixed(0), 'loser footing Rl', Rl.toFixed(0), 'elbow>Rl', elbow > Rl, '| engine loserSlides', r.loserSlides);
    return { r, elbow };
  }
  return { r };
}
// on the table (keepForm off): pin breaks table
const ollie1t = 1000 * g;
show('Rex dial vs Ollie 1 t, keepForm off (table breaks, standing)', c3(dial, R3, { keepForm: false }), c3(ollie1t, O3, { keepForm: false }));
// bolted loser on real rock
const x = show('Rex 1e7 kgf vs bolted Ollie 1 t, real rock, keepForm off, UF off', c3(1e7 * g, R3, { keepForm: false, unbreakable: false }), c3(ollie1t, O3, { keepForm: false, unbreakable: false, anchor: 'bolted' }));
// tear load of the rock
const st = P.standoff(c3(1e7 * g, R3, { unbreakable: false }), c3(dial, O3, { unbreakable: false, anchor: 'bolted' }));
console.log('  rock tear load (from standoff.tearB)', st.tearB, ' elbow/tear', x.elbow / st.tearB, ' engine tearB', x.r.tearB);
