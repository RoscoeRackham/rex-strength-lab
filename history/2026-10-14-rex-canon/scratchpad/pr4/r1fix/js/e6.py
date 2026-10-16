R = [
("""        // out, or a bolted one shoves the other off ('shovedOff'). Each one's push back goes to his source; his feet hand
        // the ground only a friction drag while he slides, not a blow, so the lab counts no shaking. An unlimited push into
        // a partner bolted on real rock tears the rock out around his bolts.""",
"""        // out, or a bolted one shoves the other off ('shovedOff'). Each one's push back goes to his source; feet hand the
        // ground only a friction drag while he slides, not a blow, so the lab counts no shaking from them. A push past the
        // rock's tear load into a partner bolted on real rock tears the rock out around his bolts."""),
# why: the shoving match with the power on, by footing; the steady push with the power on
("""    const why = act === 'wrestle' && state.wrestleMove === 'push' ? (state.ownRecoil ? 'In a shoving match each one’s push back goes to the endless ocean (They take their own recoil), and the other’s push reaches the ground only through his feet or bolts, as a friction drag while he slides or a steady push, not a blow, so the lab counts no shaking from it. It models no air blast for this test.' : 'In a shoving match their pushes reach the ground equal and opposite, so no net push goes in to shake it, and nothing moves fast enough to make a blast.')
      : act === 'wrestle' && state.wrestleMove === 'lift' ? 'A lift is a slow, steady load, not a blow: the lab models no ground shaking, air blast or broken ground for it.'
        : act === 'collide' && state.colMode === 'push' ? 'A steady push is a slow load, not a blow: the lab models no ground shaking or air blast for it.' : null;
    if (e === 'ground' && !f.models.ground) return { gap: (act === 'wrestle' && state.wrestleMove === 'push') || (act === 'collide' && state.colMode === 'push') ? 'Standing, their feet slide long before the ground could break; the lab models the ground tearing out only around bolted feet.' : 'The lab doesn’t model the ground breaking in this test.', all: true };""",
"""    // (review round 1 of pull request 4: with the power on and one of them bolted, the push through his bolts is a pulse the
    // lab counts, so no reason is given there; the steady push with the power on drives the one pushed back)
    const bR = state.anchor === 'bolted', bO = state.oAnchor === 'bolted';
    const why = act === 'wrestle' && state.wrestleMove === 'push' ? (state.ownRecoil ? (bR !== bO ? null : bR && bO ? 'In a shoving match each one’s push back goes to the endless ocean (They take their own recoil). Both are bolted, so each one’s push reaches the ground through the other’s bolts as a steady push, equal and opposite a body length apart, not a blow, so the lab counts no shaking from it. It models no air blast for this test.' : 'In a shoving match each one’s push back goes to the endless ocean (They take their own recoil), and the other’s push reaches the ground only through his feet, as a friction drag while he slides, not a blow, so the lab counts no shaking from it. It models no air blast for this test.') : 'In a shoving match their pushes reach the ground equal and opposite, so no net push goes in to shake it, and nothing moves fast enough to make a blast.')
      : act === 'wrestle' && state.wrestleMove === 'lift' ? 'A lift is a slow, steady load, not a blow: the lab models no ground shaking, air blast or broken ground for it.'
        : act === 'collide' && state.colMode === 'push' ? (state.ownRecoil && !state.colImm ? 'In the steady push the pusher’s push back goes to the endless ocean (They take their own recoil), and the one pushed hands the ground only a steady push through his feet or bolts, or a friction drag while he is driven back and slides, not a blow, so the lab counts no shaking from it. It models no air blast for this test.' : 'A steady push is a slow load, not a blow: the lab models no ground shaking or air blast for it.') : null;
    if (e === 'ground' && !f.models.ground) return { gap: (act === 'wrestle' && state.wrestleMove === 'push') || (act === 'collide' && state.colMode === 'push') ? 'A wrestler standing on his feet slides long before the ground under him could break; the lab models the ground tearing out only around bolted feet.' : 'The lab doesn’t model the ground breaking in this test.', all: true };"""),
# duoRecoilWhy: the shoving match with one bolted where nothing goes through the bolts (his rock torn out, both on their feet)
("""    if (act === 'catch') return f.allReach ? 'They take their own recoil: the thrower’s push back and the catcher’s stop go to the endless ocean, so nothing in this test pushes on the ground to shake it.' : f.thrown ? catchLandWhy() : null;
    return null;
  };""",
"""    if (act === 'catch') return f.allReach ? 'They take their own recoil: the thrower’s push back and the catcher’s stop go to the endless ocean, so nothing in this test pushes on the ground to shake it.' : f.thrown ? catchLandWhy() : null;
    if (act === 'wrestle' && state.wrestleMove === 'push') return 'The lab counts the shaking from a push through a bolted wrestler’s bolts; here nothing goes through them (both end up on their feet), and feet hand the ground only a friction drag while they slide, which it doesn’t count as shaking.';
    return null;
  };"""),
]
