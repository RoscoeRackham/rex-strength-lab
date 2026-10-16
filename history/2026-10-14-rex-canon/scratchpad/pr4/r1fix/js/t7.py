R = [
("""    if (errs.length) r4.push('page errors: ' + errs.slice(0, 3).join(' | '));
    if (r4.length) fail('pull request 4 (contests and Never knocked back): ' + r4.join(' ;; '));""",
"""    // ---- review round 1 of pull request 4 (research/reviews/canon-4-round1.json): each check fails on 238f570's page
    {
      const OL = (x) => P_OLLIE(x);
      // physics-carry-force-omits-hold-and-cap: the hit pushes with the squash's own force plus Rex's hold for the whole
      // squash, so force x time = what Ollie's source supplies; no cap, no 'the push rises until it gives'
      await load(COL);
      const t0 = await duoTxt('.tiles'), h0 = await duoTxt('.happens'), b0 = await duoTxt('svg text');
      const e0 = await eng('const r = P.collide(mk({ F: 4260 * g, body: P.makeBody(Object.assign({ build: "ollie" }, P.DEFAULT_BODIES.ollie)) }), mk({ F: 4260 * g }), { source: "sprint" }); return { F: r.carry.F, T: r.carry.T, sup: r.carry.supplied, sq: r.contact.soft.F };');
      await load(Object.assign({ colSrc: 'set', colGB: Math.log10(1 / 299792458) }, COL)); await pick('allout');
      const h1 = await duoTxt('.happens'), t1 = await duoTxt('.tiles');
      check('review round 1: the carried hit\\'s force includes the hold, uncapped', Math.abs(e0.F * e0.T / e0.sup - 1) < 1e-9 && /Force of the hit ?273 kN ?over 86 ms: the plush squash plus his footing \\(estimates\\)/.test(t0) && /pushes with about 273 kN: the squash’s own 255 kN plus the 17\\.7 kN with which his footing holds Rex back, since Ollie can’t slow\\. That force over that time is what Ollie’s source supplies\\./.test(h0)
        && /The hit: squash plus his hold/.test(b0) && /Ollie’s source supplies ?14,000 kg·m\\/s/.test(t1) && /what his footing hands the ground during the hit \\(11,100 kg·m\\/s\\)/.test(h1) && /Force of the hit ?22\\.4 kN/.test(t1) && !/the push rises until it gives|so here they are rough/.test(h0 + h1), t0.slice(0, 300) + ' | ' + t1.slice(-200));
      // physics-from-above-bolted-real-rock: landed on from above, a bolted Rex on real ground is held by the ground's
      // bearing (driven in, bolts and all), not torn loose with a plug of rock
      await load(Object.assign({ colSrc: 'jump', anchor: 'bolted', unbreakable: false }, COL)); await pick('allout');
      const sj = await duoTxt('.status-row'), hj = await duoTxt('.happens'), bj = await duoTxt('svg text'), tj = await duoTxt('.tiles');
      check('review round 1: from above, a bolted Rex on real ground is held by the ground\\'s bearing', /Rex driven into the ground/.test(sj) && !/torn loose with a plug of rock|tears out/.test(sj + hj) && /the ground under his feet, which bears 1\\.52 MN on the concrete slab \\(from above, his bolts go down into it with him/.test(hj) && /What holds Rex: the ground/.test(bj) && /Ollie’s source supplies ?110,000 kg·m\\/s/.test(tj), sj + ' | ' + hj.slice(0, 400));
      // duo-paradox-claimed-harmless and copy-paradox-coexist: a hit with no physical answer is never called harmless, and
      // the canon case isn't 'two settings that can't both hold'
      await load(Object.assign({ anchor: 'bolted' }, COL));
      const ep0 = await duoTxt('.effort-read'), hp0 = await duoTxt('.happens'), gp0 = await duoTxt('.case-grid td, .case-grid th, table td');
      await pick('windows');
      const ep1 = await duoTxt('.effort-read');
      check('review round 1: the paradox is never called harmless, and the canon case isn\\'t two settings that can\\'t both hold', /^All-out\\. Nothing the lab can judge in this test does harm here/.test(ep0) && /Courtesy ceiling: none that the lab can judge\\. The hit has no physical answer here \\(the canon’s ruling\\), so the lab can’t judge its harm; it judges only the charge \\(its speed against sound\\) and the charger’s take-off\\./.test(ep0)
        && /The hit has no physical answer here \\(the canon’s ruling\\), so the lab can’t judge its harm; it judges only the charge \\(its speed against sound\\) and the charger’s take-off\\. Even all-out, those don’t shatter windows 15 m away/.test(ep1) && !/Nothing in this test does harm|Even all-out, this test doesn’t|no cap needed/.test(ep0 + ep1)
        && /so physics has no answer here \\(the canon’s ruling\\)\\./.test(hp0) && !/can’t both hold|can’t exist in the same universe/.test(hp0 + gp0), ep0.slice(0, 300) + ' | ' + ep1.slice(0, 300));
      // duo-steady-push-no-harm and copy-push-harm: the one driven back is followed and judged; unlimited, he flies off
      await load(Object.assign({ colMode: 'push' }, COL));
      const sp0 = await duoTxt('.effort-read'), st0 = await duoTxt('.tiles');
      await load(Object.assign({ colMode: 'push', inf: true }, COL)); await pick('allout');
      const sp1 = await duoTxt('.effort-read');
      check('review round 1: the steady push follows and judges the one driven back', /Courtesy ceiling: 6% \\(lifting 5\\.47 t\\)\\. Past that, Rex is driven back and slides 5\\.\\d+ m, past the nearest people 5 m away\\./.test(sp0) && /Rex is driven off at ?7\\.\\d+ m\\/s ?over the shove’s stroke; slides/.test(st0)
        && /At this effort Rex is driven back faster than sound/.test(sp1) && !/Nothing in this test does harm|slow load, not a blow|no cap needed/.test(sp0 + sp1), sp0.slice(0, 300) + ' | ' + sp1.slice(-200));
      // physics-steady-push-bolted-real-rock: past the rock's tear load Rex is torn loose and driven back, not held
      await load(Object.assign({ colMode: 'push', anchor: 'bolted', unbreakable: false }, COL)); await pick('allout');
      const vr1 = await duoTxt('.verdict'), sr1 = await duoTxt('.status-row');
      check('review round 1: a steady push past the rock\\'s tear load tears a bolted Rex loose', /^Rex is bolted, but on real rock: Ollie’s push \\(890 kN\\) is more than the rock around his bolts takes \\(about 697 kN\\), so it tears out, and Rex is driven back with a plug of rock, held only by his feet \\(17\\.7 kN\\)\\./.test(vr1) && /Over the shove’s stroke \\(2\\.44 m\\) that sends Rex off at 37\\.6 m\\/s/.test(vr1) && /Rex’s rock tears loose/.test(sr1) && !/his bolts hold|Rex holds unlimited/.test(vr1 + sr1), vr1 + ' | ' + sr1);
      // copy-push-bars-390: the steady push's bar labels fit at 390 px
      await page.setViewportSize({ width: 390, height: 844 });
      await load(Object.assign({ colMode: 'push' }, COL));
      const clip = await page.evaluate(() => Array.from(document.querySelectorAll('#duo-bay svg')).flatMap((s) => { const sr = s.getBoundingClientRect(); return Array.from(s.querySelectorAll('text')).filter((t) => t.getBoundingClientRect().right > sr.right + 0.5 || t.getBoundingClientRect().left < sr.left - 0.5).map((t) => t.textContent); }));
      await page.setViewportSize({ width: 1280, height: 900 });
      check('review round 1: the steady push\\'s bar labels fit at 390 px', !clip.length, clip.join(' | '));
      // copy-shovingmatch-paradox-nothing-moves and duo-one-sided-paradox-nothing-moves: at unlimited strength only the push
      // into bolts held without limit has no answer; the bolted one's own push shoves the other off
      const W = { duoOpen: true, duoAction: 'wrestle' };
      await load(Object.assign({ inf: true, oAnchor: 'bolted' }, W)); await pick('allout');
      const vw1 = await duoTxt('.verdict'), ew1 = await duoTxt('.effort-read');
      await load(Object.assign({ wrestleMove: 'shove', wrestleWho: 'both', inf: true, anchor: 'bolted' }, W)); await pick('allout');
      const vb1 = await duoTxt('.verdict'), eb1 = await duoTxt('.effort-read'), tb1 = await duoTxt('.tiles');
      check('review round 1: one bolted at unlimited strength, the other\\'s push has no answer but his own is real', /^Ollie is bolted to ground that their power holds, so Rex’s unlimited push into his bolts meets a hold without limit: that push has no physical answer \\(the canon’s ruling\\), and it moves nobody\\. Ollie’s own push on Rex is real \\(a contest lets force move\\), and Rex holds only 17\\.7 kN, so Ollie shoves him off at just under light speed/.test(vw1) && /At this effort Rex is shoved off faster than sound/.test(ew1)
        && /^Rex is bolted to ground that their power holds, so Ollie’s unlimited shove into his bolts meets a hold without limit: that shove has no physical answer \\(the canon’s ruling\\), and it moves nobody\\. Rex’s own shove on Ollie is real \\(a contest lets force move\\): Ollie leaves at just under light speed\\./.test(vb1) && /At this effort someone flies off faster than sound/.test(eb1) && /Rex moves ?not at all ?bolted/.test(tb1) && !/Nothing moves/.test(vw1 + vb1), vw1 + ' | ' + vb1);
      // duo-ratio-long-digits: the ratio rounded, with separators
      await load(Object.assign({ logKg: 9, oLogKg: 9 }, W)); await pick('allout');
      { const v9 = await duoTxt('.verdict'); check('review round 1: the shoving match\\'s ratio is rounded', /about 560,000 times what holds the other/.test(v9) && !/\\d{6}/.test(v9.replace(/[\\d,.]+ (?:m|kN|GN|km)/g, '')), v9); }
      // physics-shoving-match-bolted-rock-claim, copy-shovingmatch-torn-unbounded, duo-push-ground-preset-reason: a
      // single bolted wrestler's rock is checked at any strength, his hold once torn is his feet's, and the ground preset
      // names his bolts
      await load(Object.assign({ anchor: 'bolted', unbreakable: false }, W)); await pick('allout');
      const vk = await duoTxt('.verdict');
      await load(Object.assign({ inf: true, oAnchor: 'bolted', unbreakable: false }, W)); await pick('allout');
      const vk2 = await duoTxt('.verdict'), sk2 = await duoTxt('.status-row'), hk2 = await duoTxt('.happens');
      await load(Object.assign({ anchor: 'bolted' }, W)); await pick('ground');
      const gk = await duoTxt('.effort-read');
      check('review round 1: a single bolted wrestler\\'s rock tears past its tear load, and then only his feet hold him', /more than what holds the other \\(Rex the rock around his bolts, about 697 kN, Ollie 17\\.7 kN\\)\\. The rock around Rex’s bolts tears out, and from then on only his feet hold him \\(17\\.7 kN\\)\\. They fly apart at 26\\.6 m\\/s each/.test(vk) && !/can’t move Rex’s bolts/.test(vk)
        && /Ollie the rock around his bolts, about 697 kN/.test(vk2) && /Ollie holds 17\\.7 kN once his rock tears/.test(sk2) && !/Ollie unbounded|Ollie holds unlimited/.test(vk2 + sk2 + hk2)
        && /The least effort that tears the rock out around Rex’s bolts\\./.test(gk) && !/Standing, their feet slide/.test(gk), vk + ' | ' + vk2.slice(0, 200) + ' | ' + gk.slice(0, 200));
      // duo-shoving-shake-reason: a bolted winner's bolts hand the ground the loser's push over the push, a pulse the lab
      // counts (at a 10^6 kg dial it may crack plaster)
      await load(Object.assign({ anchor: 'bolted', logKg: 6, oLogKg: 6 }, W)); await pick('plaster');
      const pk = await duoTxt('.effort-read');
      check('review round 1: the push through a bolted winner\\'s bolts shakes the ground', /The least effort that shakes the ground enough that plaster may crack 5 m away/.test(pk) && /At this effort the push through Rex’s bolts shakes the ground enough that plaster may crack 5 m away/.test(pk) && !/not a blow/.test(pk), pk.slice(0, 300));
      // copy-bothatonce-shove-tile: the shove that moves someone is the one shown, with its muscle basis
      await load(Object.assign({ wrestleMove: 'shove', wrestleWho: 'both', oAnchor: 'bolted' }, W)); await pick('allout');
      { const tb = await duoTxt('.tiles'), sb = await duoTxt('.status-row'); check('review round 1: Both at once shows the shove that moves Rex', /Ollie’s shove ?890 kN ?two hands/.test(tb) && !/Shove force ?299 kN/.test(tb) && /Comic mode: real muscle does better here/.test(sb), tb.slice(0, 200) + ' | ' + sb); }
      // duo-arm-loser-bolts-tear: a bolted loser's rock carries the loser's press in a standing pin (no tear here)
      await load({ duoOpen: true, duoAction: 'arm', keepForm: false, unbreakable: false, oAnchor: 'bolted', logKg: 6 }); await ollieKg(Math.log10(90718.474)); await pick('allout');
      { const sa = await duoTxt('.status-row'), va = await duoTxt('.verdict'), ea = await eng('const r = P.armWrestle(mk({ F: 1e6 * g, keepForm: false, unbreakable: false }), mk({ keepForm: false, unbreakable: false, anchor: "bolted", body: P.makeBody(Object.assign({ build: "ollie" }, P.DEFAULT_BODIES.ollie)) })); return { o: r.outcome, tB: r.tearB, PB: r.PB };');
        check('review round 1: a bolted loser\\'s rock carries the loser\\'s press in a standing pin', ea.o === 'pin' && ea.tB < 1 && /he pins Ollie in/.test(va) && !/Ground around Ollie’s bolts tears out/.test(sa), sa + ' | ' + JSON.stringify(ea)); }
      // copy-fireball-before-split: a fireball made before it reaches Ollie gives the split its verdict points to
      await load({ duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', logKg: 14, keepForm: false, airAbsorb: 0.5, cLogD: 3 }); await pick('allout');
      { const hf = await duoTxt('.happens'), vf = await duoTxt('.verdict'); check('review round 1: the fireball made on the way gives the split', /its motion as it reaches him is taken back: below/.test(vf) && /Stopping it at Ollie frees 3\\.63 TJ \\(870 t TNT\\) where he stands\\. 3\\.44 TJ of it is heat already made in the air on the way: that is real\\. The rest, 192 GJ, is its motion, freed as it stops at him/.test(hf), hf.slice(-500)); }
      // duo-mutant-survivors: (a) decision 5's effect on the search (the default set speed: the slide, not the hit's air
      // blast); (b) a switch turned over in place gives what a fresh load gives (the search's key carries the switches);
      // (d) unequal strengths: each one's push back is his own push x t, as the engine gives it
      await load(Object.assign({ colSrc: 'set' }, COL));
      { const es = await duoTxt('.effort-read'); check('review round 1: the default set speed\\'s ceiling is the carried slide, not the hit\\'s blast', /Even at the least they need to stand and walk, Rex is carried along at 100 m\\/s and ends up 516 m away, past the nearest people 5 m away\\./.test(es) && !/air blast/.test(es), es.slice(0, 300)); }
      const FB2 = { duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', logKg: 14, keepForm: false, airAbsorb: 0.5 };
      await load(FB2); await pick('windows');
      await page.click('#nkb-ollie'); await page.click('#nkb-rex'); await page.waitForTimeout(400); await settle(page, 'bay'); await page.waitForTimeout(300); await settle(page, 'duo-bay');
      const inPlace = JSON.stringify(await readResult(page, 'duo-bay'));
      await load(Object.assign({ noKnockback: false, oNoKnockback: false, duoEffort: 'windows' }, FB2));
      const fresh = JSON.stringify(await readResult(page, 'duo-bay'));
      check('review round 1: a Never knocked back switch turned over in place gives what a fresh load gives', inPlace === fresh && /It carries Ollie off at 343 m\\/s/.test(fresh), inPlace.slice(0, 300) + ' || ' + fresh.slice(0, 300));
      const eu = await eng('const r = P.pushMatch(mk(), mk({ F: 1e5 * g, body: P.makeBody(Object.assign({ build: "ollie" }, P.DEFAULT_BODIES.ollie)) })); return { a: r.recoilAbsorbedA.J, b: r.recoilAbsorbedB.J, o: r.outcome };');
      await load(W); await ollieKg(5); await pick('allout');
      { const hu = await duoTxt('.happens'), mu = hu.match(/each one’s push back goes to the endless ocean \\(Rex ([\\d,]+) kg·m\\/s, Ollie ([\\d,]+) kg·m\\/s, over the push\\)/);
        check('review round 1: unequal pushes, each one\\'s push back is his own', eu.o === 'bothShoved' && mu && near(num(mu[1]), eu.a, 0.02) && near(num(mu[2]), eu.b, 0.02) && eu.b > 1.05 * eu.a, (mu ? mu[0] : hu.slice(0, 300)) + ' ' + JSON.stringify(eu)); }
    }
    if (errs.length) r4.push('page errors: ' + errs.slice(0, 3).join(' | '));
    if (r4.length) fail('pull request 4 (contests and Never knocked back): ' + r4.join(' ;; '));"""),
]
