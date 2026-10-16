R = [
# the steady push: the one driven back is followed
("""      check('Collide, the steady push on and off', /^Ollie wins\\. He pushes with 890 kN and Rex can hold only 17\\.7 kN, so Rex is driven back\\. Ollie takes his own recoil, so his push back goes to his source and his own footing \\(17\\.7 kN\\) doesn’t cap his push\\.$/.test(v)""",
"""      check('Collide, the steady push on and off', /^Ollie wins\\. He pushes with 890 kN and Rex can hold only 17\\.7 kN, so Rex is driven back\\. Ollie takes his own recoil, so his push back goes to his source and his own footing \\(17\\.7 kN\\) doesn’t cap his push\\. Over the shove’s stroke \\(2\\.44 m\\) that sends Rex off at 37\\.6 m\\/s, and he slides 109 m before he stops\\.$/.test(v)"""),
# arm wrestling: the loser's pad breaks the table in the pin
("""      // Ollie at 1 t, Things keep their form off: the pin stays on the table (its pad holds only Ollie's press), slams
      // through it at 83 m/s; with the power off the pin's pad load breaks the table and they stand
      await load(Object.assign({ keepForm: false }, A)); await ollieKg(3); await pick('allout');
      const vp = await duoTxt('.verdict'), hp = await duoTxt('.happens');
      await load(Object.assign({ keepForm: false, ownRecoil: false }, A)); await ollieKg(3); await pick('allout');
      const vpo = await duoTxt('.verdict');
      check('arm wrestling, a pin never breaks the table with the power on', /^Rex pins Ollie in 2\\d(?:\\.\\d)? ms\\. The back of Ollie’s hand hits the pad at 83 m\\/s and goes through the table\\./.test(vp) && /Forcing an arm down: the winner’s elbow pad holds the loser’s press, 2\\.45 kN here\\..*So with the power on a pin never breaks the table/.test(hp)
        && /^The table can’t take the pin\\./.test(vpo), vp + ' | off ' + vpo.slice(0, 120));""",
"""      // Ollie at 1 t, Things keep their form off: Rex's pad holds only Ollie's press, but Ollie's pad carries what turns his
      // forearm against Rex's hand (24.2 kN), past the table's 15.1 kN, so the pin breaks the table and they stand, as with
      // the power off (by Rex's pad there); review round 1 of pull request 4
      await load(Object.assign({ keepForm: false }, A)); await ollieKg(3); await pick('allout');
      const vp = await duoTxt('.verdict'), hp = await duoTxt('.happens'), mp = await duoTxt('details.math .eq');
      await load(Object.assign({ keepForm: false, ownRecoil: false }, A)); await ollieKg(3); await pick('allout');
      const vpo = await duoTxt('.verdict');
      const ep = await eng('const r = P.armWrestle(mk({ keepForm: false }), mk({ keepForm: false, F: 1000 * g, body: P.makeBody(Object.assign({ build: "ollie" }, P.DEFAULT_BODIES.ollie)) })); return { by: r.tableBreaksBy, lp: r.loserPadLoad, lat: r.tableLat, v: r.pin && r.pin.v };');
      check('arm wrestling, the loser\\'s pad breaks the table in a pin with the power on', ep.by === 'pin' && ep.lp > ep.lat && /^The table can’t take the pin\\. Rex’s arm \\(222 kN\\) beats Ollie’s \\(2\\.45 kN\\), and forcing it down loads Ollie’s elbow pad with about 24\\.2 kN \\(what turns his forearm against Rex’s hand\\), more than the 15\\.1 kN the table carries\\. It tears out\\. Standing up, /.test(vp) && /he pins Ollie in 2\\d(?:\\.\\d)? ms\\. The back of Ollie’s hand swings down at 83 m\\/s\\./.test(vp)
        && /Forcing an arm down: the winner’s elbow pad holds the loser’s press, 2\\.45 kN here\\..*The loser’s pad still carries what turns his own forearm against the winner’s hand, about 24\\.2 kN: that is a force on the loser, not anyone’s push back, so no power takes it\\. That is more than the table carries, so the pin breaks it\\./.test(hp) && !/never breaks the table|never tears the table/.test(hp + vp)
        && /= 24\\.2 kN\\./.test(mp) && /^The table can’t take the pin\\. Rex’s arm \\(222 kN\\) beats Ollie’s \\(2\\.45 kN\\), and forcing it down loads Rex’s elbow pad/.test(vpo), vp + ' | ' + hp.slice(0, 300) + ' | off ' + vpo.slice(0, 160));"""),
# the switch note: the contest list and the energy split
("""        && /In their contests, every two-player test here, they let force move: the other’s push on him is real, and only his own push back is taken \\(They take their own recoil\\)\\. A catch is his own push too, so that power takes it back\\. So this switch acts in one case only: a throw that reaches the catcher as a fireball or plasma in the game of catch \\(Things keep their form off, some of the air’s drag left\\), which hits him rather than being caught\\./.test(place.note),""",
"""        && /In their contests \\(arm wrestling, every Wrestle move, Collide, the partner toss\\) they let force move: the other’s push on him is real, and only his own push back is taken \\(They take their own recoil\\)\\. A catch is his own push too, so that power takes it back\\. So this switch acts in one case only: a throw that reaches the catcher as a fireball or plasma in the game of catch \\(Things keep their form off, some of the air’s drag left\\), which hits him rather than being caught\\./.test(place.note)
        // (review round 1 of pull request 4: only the motion freed as it stops at him is taken back; the air's heat stays real)
        && /the motion it frees as it stops at him is taken back unless he means it \\(canon; the heat it made in the air on the way stays real\\)/.test(place.note) && !/the energy it frees where he stands is taken back/.test(place.note),"""),
# the cards: six powers, the energy split, the contest list
("""      check('the cards for pull request 4', /Never knocked back \\(one switch each, both on by default; canon, the rulings of 14 Oct 2026\\) means a hit from outside a contest doesn’t move him: its momentum goes to the endless ocean, even if he is bolted/.test(cards)""",
"""      check('the cards for pull request 4', /Never knocked back \\(one switch each, both on by default; canon, the rulings of 14 Oct 2026\\) means a hit from outside a contest doesn’t move him: its momentum goes to the endless ocean, even if he is bolted, and the motion it frees as it stops at him is taken back unless he means it \\(the heat it made in the air on the way stays real\\); in their contests \\(arm wrestling, every Wrestle move, Collide, the partner toss\\)/.test(cards)
        // (review round 1 of pull request 4: six powers on by default; the Newton card names the contests)
        && /so six powers are on unless the reader turns them off: Air resistance absorbed, Things keep their form, Unbreakable footing, They take their own recoil, Safe passenger and Never knocked back \\(one switch each\\)\\./.test(cards) && !/five powers are on|every two-player test|the energy it frees where he stands is taken back/.test(cards)
        && /Where a push or hit has no physical answer \\(canon: one held without limit by their powers, against a charger who can’t slow or an unlimited push\\), the lab can’t judge its harm, and the page says so rather than calling it harmless\\./.test(cards)"""),
]
