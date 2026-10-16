# the round 3 fixes, each reverted on its own (whole fix: every hunk of git diff f25f9b4..ad1aa9c it made), and the
# round 2 mutants the round 3 test-only fixes guard against
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from mktree import E, A, S
R = {}
def rv(name, checks, hunksel=(), edits=(), trim='r3', powers=False): R[name] = dict(checks=checks, hunksel=hunksel, edits=edits, trim=trim, powers=powers)
C3 = lambda s: 'review round 3: ' + s
ARM = C3('arm wrestling standing, a bolted wrestler whose rock tears out is held by his feet alone')
MATH_NEW = "unlimited if bolted, though on real rock only until the rock around his bolts tears out (its shear strength × the buried area of his feet), and then his feet hold. The stronger"
MATH_OLD = "unlimited if bolted. The stronger"
# physics-arm-torn-rock-still-holds / copy-arm-torn-rock-still-unlimited
rv('F1-arm-torn-engine', ['8i', ARM], hunksel=[(E, [0, 1, 2, 3, 4])], powers=True)
rv('F1-arm-torn-page', [ARM], hunksel=[(A, [0, 1, 2, 3, 5, 6])], edits=[(A, MATH_NEW, MATH_OLD)])
rv('F1-arm-torn-both', ['8i', ARM], hunksel=[(E, [0, 1, 2, 3, 4]), (A, [0, 1, 2, 3, 5, 6])], edits=[(A, MATH_NEW, MATH_OLD)], powers=True)
# physics-collide-bounce-contact-travel-uncounted
BNC = C3('Collide\'s bounce counts the travel during the contact')
rv('F2-bounce-engine', ['8a', BNC], hunksel=[(E, [7, 8])], powers=True)
rv('F2-bounce-page', [BNC], hunksel=[(A, [11, 17])])
rv('F2-bounce-both', ['8a', BNC], hunksel=[(E, [7, 8]), (A, [11, 17])], powers=True)
# physics-walkout-end-position-unjudged
WO = C3('the walk-out judges where the loser ends up past the ring\'s edge')
WO_ITEM_NEW = "’s feet hand the ground.'\n        // (review round 3 of pull request 4: past the edge he slides on, and the effort search judges where he ends up)\n        + (r.slideL != null && isFinite(r.endL) ? ' ' + W + ' only pushes, so past the ring’s edge ' + L + ' slides on from ' + speedOnly(r.v) + ' for ' + fmtDist(r.slideL) + ' on his feet, ending up ' + fmtDist(r.endL) + ' from where he stood.' : ''));"
WO_ITEM_OLD = "’s feet hand the ground.');"
rv('F3-walkout-engine', ['8g', WO], hunksel=[(E, [5, 6])], powers=True)
rv('F3-walkout-page', [WO], hunksel=[(A, [9, 13, 14, 15])], edits=[(A, WO_ITEM_NEW, WO_ITEM_OLD)])
rv('F3-walkout-page-harm-only', [WO], hunksel=[(A, [13, 14, 15])])
rv('F3-walkout-both', ['8g', WO], hunksel=[(E, [5, 6]), (A, [9, 13, 14, 15])], edits=[(A, WO_ITEM_NEW, WO_ITEM_OLD)], powers=True)
# duo-walkout-cant-walk
rv('F5-cant-walk', [C3('the shoving match says why a walker who can\'t run shoves the other off')],
   edits=[(A, " : P.moveCheck(cw.F, cw.body.m).walk ? ' can walk but not run (running takes strength above his weight; see Sprint). The lab caps a walk-out at his top running speed, so he can’t walk ' : ' can’t walk, so he can’t walk ')", " : ' can’t walk, so he can’t walk ')")])
# duo-walkout-push-less-hold-label
rv('F6-push-less-hold', [C3('the walk-out names Rex\'s whole push where Ollie\'s mass sets the pace')],
   edits=[(A, "'His whole push sets it: ' + fmtN(r.walkPush) + ' (' + fmtN(r.walkPush - HlW) + ' more than ' + L + '’s hold)'", "'His push, less ' + L + '’s hold, sets it: ' + fmtN(r.walkPush)")])
# duo-torn-shoveoff-unlimited-feet
rv('F7-torn-feet', [C3('a bolted loser torn loose is held by his feet\'s 17.7 kN')],
   edits=[(A, "only ' + L + '’s feet hold him (' + fmtN(r.winner === 'A' ? r.holdAfterB : r.holdAfterA) + '): '", "only ' + L + '’s feet hold him (' + fmtN(Hl) + '): '")])
# copy-rex-ollie-card-stale-pin-feet
rv('F10-card', [C3('the Rex and Ollie card says the loser\'s feet carry only the force at his elbow in a pin')], hunksel=[(S, [0])])
# copy-arm-one-sided-chip-unqualified
rv('F11-chip', [C3('arm wrestling at unlimited strength, one bolted, the chip names the press with no answer')], hunksel=[(A, [4])])
# copy-arm-elbow-formula-rounding (both math lines back to two figures)
rv('F12-elbow-formula', [C3('the loser\'s elbow formula, as printed, gives the figure shown')],
   edits=[(A, "    const elbowF = '|' + sig(P.AW.holdArm, 4) + ' m_loser a − (loser’s arm + ' + sig(P.AW.effMass, 3) + ' m_loser a)| = |' + sig(P.AW.holdArm - P.AW.effMass, 3) + ' m_loser a − loser’s arm|';", "    const elbowF = '|0.012 m_loser a − (loser’s arm + 0.0097 m_loser a)|';"),
          (A, "    const aF = 'a = (winner’s arm − loser’s arm) / (' + sig(P.AW.effMass, 3) + ' × (m_Rex + m_Ollie))';", "    const aF = 'a = (winner’s arm − loser’s arm) / (0.0097 × (m_Rex + m_Ollie))';")])
# copy-bounce-math-quake-line
rv('F13-quake-line', [C3('Collide\'s bounce math has no quake model where nothing reaches the ground')], hunksel=[(A, [12])])
# copy-paradox-judges-takeoff-for-sprint
rv('F14-takeoff', ['review round 1: the paradox is never called harmless', C3('the no-answer caveat names the take-off only where there is one')], hunksel=[(A, [16, 18, 19, 20, 21])], trim='r1,r3')
# duo-r2-fix-parts-unchecked: the round 2 page fixes' parts, each mutated (the extended checks must fail)
rv('U1-pin-item-loser-arm', ['review round 2: standing, the loser\'s feet carry the force at his elbow'], edits=[(A, "' + (r.loserElbow != null ? 'what turns his forearm about his elbow' : 'his arm') + '", "his arm")], trim='r2')
rv('U2-arm-math-elbow', [C3('the loser\'s elbow formula, as printed, gives the figure shown')], edits=[(A, "; in a pin the loser’s feet (or bolts) carry the force at his elbow, ' + elbowF + ', ' + aF + '.'", ".'")])
rv('U3-bars-could-push', ['review round 2: the walking winner holds back, and his push back is reported'], edits=[(A, "].filter(Boolean).map((x) => (walkW && x.label === (walkW === 'A' ? 'Rex’s push' : 'Ollie’s push') ? Object.assign(x, { label: (walkW === 'A' ? 'Rex' : 'Ollie') + ' could push' }) : x)), (x) => fmtSI(x, 'N')));", "].filter(Boolean), (x) => fmtSI(x, 'N')));")], trim='r2')
rv('U10-both-bolt-chip', ['review round 2: Both at once counts the shove pressing on the bolted one\'s bolts'], edits=[(A, "boltShakeA ? groundShakeChip(boltShakeA, cP.surface, 'The push through ' + pusher + '’s bolts') : ", "")], trim='r2')
# duo-r2-mutants-survive
rv('N3-walk-J', ['8g'], edits=[(E, "const rw = { J: cl.body.m * v + Hl * t, T: t, thetaDeg: 0 };", "const rw = { J: (Hl + cl.body.m * a) * t, T: t, thetaDeg: 0 };")], powers=True, trim='')
rv('N10-match-x-swap', [C3('a bolted Rex\'s shove-off ceiling counts Ollie\'s travel')], edits=[(A, "slB = moved && r.vB > 0 ? (r.xB || 0) + r.slideB", "slB = moved && r.vB > 0 ? (r.xA || 0) + r.slideB")])
rv('N12-bolt-pulse-T', [C3('a bolted Rex\'s shove-off ceiling counts Ollie\'s travel')], edits=[(A, "wT = r.t > 0 ? Math.max(P.limbPulse(cwB.body), r.t) : 0", "wT = r.t")])
# control: no revert (every check must pass)
rv('Z-control', [], trim='r1,r2,r3', powers=True)
# a part of F1's page fix: the torn bolted WINNER's verdict (does any page check read it?)
rv('M1-arm-torn-winner-text', [ARM], edits=[(A, "(tornOf(sideW) ? capital(tornLine(sideW)) + ', less than ' + L + '’s press, so ' + W + '’s feet slide too.' : L + '’s press is more than '", "(false ? '' : L + '’s press is more than '")])
# round 2's whole page, engine and card under round 3's checks (the README: 10 of the 12 fail there)
rv('Y-f25-whole', [], hunksel=[(E, list(range(9))), (A, list(range(22))), (S, [0])])
# race attempts on the new waits (no fix reverted; every check should still pass if the waits wait for the condition)
# R1: every two-player redraw lands 800 ms after the change (old fixed 300 ms waits would read the stale bay)
rv('R1-slow-duo-redraw', [], edits=[(A, "requestAnimationFrame(() => setTimeout(run, 0));", "requestAnimationFrame(() => setTimeout(run, 800));")], trim='build,r1,r2,r3')
# R2: every two-player engine call 0.3 ms slower, so the searches run in the background ('Working out')
rv('R2-slow-engine', [], edits=[(A, "  const P = window.DinoPhys, D = window.DINO_DATA, K = P.K, g = K.g;", "  (function () { const X = window.DinoPhys; for (const k of ['armWrestle', 'pushMatch', 'shove', 'shoveBoth', 'liftPartner', 'throwPartner', 'catchGame', 'catchLeg', 'tossPartner', 'catchIt', 'collide', 'headOn', 'standoff']) { const f = X[k]; if (typeof f === 'function') X[k] = function () { const t = performance.now(); while (performance.now() - t < 0.3) { /* slow */ } return f.apply(this, arguments); }; } })();\n  const P = window.DinoPhys, D = window.DINO_DATA, K = P.K, g = K.g;")], trim='build,r1,r2,r3')
# a part of F14's page fix: the preset view's courtesy-ceiling line (hunk 20) back to 'those do' (does a check read it?)
rv('M2-takeoff-preset-ceiling-those', ['review round 1: the paradox is never called harmless', C3('the no-answer caveat names the take-off only where there is one')], hunksel=[(A, [20])], trim='r1,r3')
# and the least view's ceiling line (hunk 21) and the preset's never line (hunk 19), each alone
rv('M3-takeoff-least-ceiling-those', ['review round 1: the paradox is never called harmless'], hunksel=[(A, [21])], trim='r1')
rv('M4-takeoff-preset-never-those', ['review round 1: the paradox is never called harmless'], hunksel=[(A, [19])], trim='r1')
