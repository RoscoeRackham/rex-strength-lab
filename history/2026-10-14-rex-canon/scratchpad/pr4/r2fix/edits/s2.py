p='/home/user/rex-strength-lab/rex-strength-lab/test/shots.js'; s=open(p,encoding='utf-8').read()
anchor = r"""    if (errs.length) r4.push('page errors: ' + errs.slice(0, 3).join(' | '));
    if (r4.length) fail('pull request 4 (contests and Never knocked back): '"""
assert s.count(anchor)==1
block = r"""    // ---- review round 2 of pull request 4 (research/reviews/canon-4-round2.json): each check fails with its fix reverted
    {
      const W = { duoOpen: true, duoAction: 'wrestle' }, A = { duoOpen: true, duoAction: 'arm' };
      // physics-carried-hit-energy-omits-hold-work: the splat frees the force of the hit over the squash, the hold's work
      // included (499 kJ at the default sprint; at 1 m/s 7.05 kJ beside 22.4 kN, not 1.5 kJ)
      await load(COL); await pick('allout');
      const qh = await duoTxt('.happens'), qm = await duoTxt('details.math .eq');
      await load(Object.assign({ colSrc: 'set', colGB: Math.log10(1 / 299792458) }, COL)); await pick('allout');
      const qt1 = await duoTxt('.tiles');
      check('review round 2: the carried hit frees the force of the hit over the squash', /The hit frees 499 kJ \(120 g TNT\): the force of the hit over the squash \(31 cm\)\. That is Rex’s motion energy as Ollie sees it, plus the work his footing does holding him back over the squash\./.test(qh)
        && /plus the hold × s \(in Ollie’s frame the ground under Rex moves with Ollie and pushes Rex back with the hold over the squash\) = 499 kJ\./.test(qm) && /the splat frees Q = F × s/.test(qm) && /Energy freed at the hit ?7\.05 kJ/.test(qt1) && /Force of the hit ?22\.4 kN/.test(qt1), qh.slice(-900) + ' | ' + qt1.slice(0, 300));
      // copy-source-supplied-two-figures: one rounding (three figures) for the source's supply across the view
      await load(COL);
      const ct = await duoTxt('.tiles'), ch = await duoTxt('.happens'), cm = await duoTxt('details.math .eq');
      await load(Object.assign({ colBounce: 'bounce' }, COL)); await pick('allout');
      const cbt = await duoTxt('.tiles'), cbh = await duoTxt('.happens'), cbm = await duoTxt('details.math .eq');
      check('review round 2: the source\'s supply has one figure on a view', /Ollie’s source supplies ?23,500 kg·m\/s/.test(ct) && /about 23,500 kg·m\/s in all/.test(ch) && /: 23,500 kg·m\/s\./.test(cm) && !/23,000/.test(ct + ch + cm)
        && /Ollie’s source supplies ?109,000 kg·m\/s/.test(cbt) && /everything Rex gains \(109,000 kg·m\/s\)/.test(cbh) && /: 109,000 kg·m\/s\./.test(cbm) && !/110,000/.test(cbt + cbh + cbm), ct.slice(-200) + ' | ' + cbt.slice(-200));
      // physics-carried-motion-air-below-1pct-c: sent off faster than sound below 1% of light speed, his ride heats real air
      await load(Object.assign({ colSrc: 'set', colGB: Math.log10(0.001 / Math.sqrt(1 - 1e-6)) }, COL)); await pick('allout');
      const ah = await duoTxt('.happens'), ab = await duoAll();
      await load(Object.assign({ colSrc: 'set', colGB: Math.log10(500 / 299792458), colBounce: 'bounce' }, COL)); await pick('allout');
      const ah5 = await duoTxt('.happens'), ab5 = await duoAll();
      check('review round 2: a carried body faster than sound heats real air below 1% of light speed', /Carried at 300 km\/s, faster than sound, Rex’s body meets real air \(their own bodies do\)\. The air takes nearly all of his 135 TJ of motion \(32 kt TNT\) as he slides off/.test(ah) && /Damage radius if all of that energy went into the air as a blast \(Rex’s motion, heating the air as he slides off\)/.test(ab)
        && /Sent off at 1,000 m\/s, faster than sound, Rex’s body meets real air \(their own bodies do\)\. Of his 1\.5 GJ of motion the air takes 1\.45 GJ/.test(ah5) && /Blast radius by damage level/.test(ab5), ah.slice(-700) + ' | ' + ah5.slice(-400));
      // physics-steady-push-real-muscle-unlabelled: real muscle, the steady push's speed is an upper bound
      await load(Object.assign({ colMode: 'push', mode: 'real' }, COL)); await pick('allout');
      const rh = await duoTxt('.happens');
      check('review round 2: the steady push in real muscle is an upper bound', /With real muscle the push falls as the hands speed up, so this speed is an upper bound \(as in the shoving match\)\./.test(rh), rh.slice(-400));
      // physics-steady-push-lying-pusher: a pusher too weak to stand can't push, as in the shoving match
      await load(Object.assign({ colMode: 'push' }, COL)); await ollieKg(3.301); await pick('allout');
      const lv = await duoTxt('.verdict'), ls = await duoTxt('.status-row');
      check('review round 2: a pusher too weak to stand can\'t push', /^Ollie can’t push: at 3 t his strength \(19\.6 kN\) can’t stand him up \(see Weight\), so he lies flat, as in the shoving match\. Rex doesn’t move\.$/.test(lv) && /Ollie can’t stand, so he can’t push/.test(ls) && !/driven back/.test(lv), lv + ' | ' + ls);
      // physics-walkout-push-contradicts-motion: the walking winner holds back; his push is what keeps the loser at the pace
      const ewk = await eng('const r = P.pushMatch(mk(), mk({ F: 1000 * g, body: P.makeBody(Object.assign({ build: "ollie" }, P.DEFAULT_BODIES.ollie)) })); return { o: r.outcome, wp: r.walkPush, J: r.recoilAbsorbedA && r.recoilAbsorbedA.J };');
      await load(W); await ollieKg(3); await pick('allout');
      const wv = await duoTxt('.verdict'), wt = await duoTxt('.tiles'), ws = await duoTxt('.status-row'), wh = await duoTxt('.happens');
      const wpm = wt.match(/Rex’s push ?([\d.]+) kN ?real on Ollie: what keeps him at the walking pace \(Rex could push 890 kN\); its push back goes to Rex’s source/), wjm = wh.match(/Its push back goes to his source \(They take their own recoil\): ([\d,]+) kg·m\/s over the walk-out/);
      check('review round 2: the walking winner holds back, and his push back is reported', ewk.o === 'walkOut' && wpm && near(num(wpm[1]) * 1000, ewk.wp, 0.005) && wjm && near(num(wjm[1]), ewk.J, 0.02) && /Rex holds 17\.7 kN · can push 890 kN/.test(ws) && /Rex could push with 890 kN/.test(wv) && !/Rex’s push \(890 kN\) beats/.test(wv) && !/Rex’s push ?890 kN ?real on Ollie/.test(wt), wv + ' | ' + wt + ' | ' + JSON.stringify(ewk));
      // copy-shoving-match-stroke-formula: both shoved, each moves about half the stroke; shoved off, the loser all of it
      await load(W); await pick('allout');
      const sh2 = await duoTxt('.happens'), sm2 = await duoTxt('details.math .eq');
      await load(Object.assign({ anchor: 'bolted' }, W)); await pick('allout');
      const sh3 = await duoTxt('.happens');
      await load(Object.assign({ inf: true, oAnchor: 'bolted' }, W)); await pick('allout');
      const sh4 = await duoTxt('.happens');
      check('review round 2: the shoving match\'s stroke is described as built', /until the gap between them has grown by the shove’s stroke \(2\.44 m, an estimate; here Rex moves 1\.22 m and Ollie 1\.22 m of it\)/.test(sh2) && /until x_Rex \+ x_Ollie = d = 2\.44 m/.test(sm2) && !/over the stroke d = 2\.44 m/.test(sm2)
        && /Ollie is pushed by Rex’s push, less his own hold, over the whole shove’s stroke \(2\.44 m, an estimate\) while their hands stay on each other; Rex doesn’t move\. Then Ollie slides to a stop/.test(sh3) && !/Each is pushed/.test(sh3)
        && /Rex meets it as a fireball/.test(sh4) && !/each slides to a stop on his feet/.test(sh4), sh2.slice(0, 600) + ' | ' + sh3.slice(0, 400));
      // copy-bolted-winner-shake-not-shown: a bolted winner's bolts' pulse is shown, not only judged
      await load(Object.assign({ anchor: 'bolted', logKg: 6, oLogKg: 6 }, W)); await pick('plaster');
      const bs = await duoTxt('.status-row'), bh = await duoTxt('.happens');
      check('review round 2: the push through a bolted winner\'s bolts is shown', /The push through Rex’s bolts shakes the ground: plaster may crack out to/.test(bs) && /Bolted, Rex hands the ground Ollie’s push through his bolts: 140,000 kg·m\/s over 110 ms/.test(bh) && /his bolts hand the ground all of Ollie’s push \(140,000 kg·m\/s\)/.test(bh) && !/His feet hand the ground only what they hold against the other’s push \(Rex 140,000/.test(bh), bs + ' | ' + bh.slice(-600));
      // copy-empty-bar-caption: unlimited rows are listed, never 'Strength, footing and push: .'
      await load(Object.assign({ inf: true, anchor: 'bolted', oAnchor: 'bolted' }, W)); await pick('allout');
      const eb2 = await duoAll();
      check('review round 2: the shoving match\'s chart lists unlimited rows', /Strength, footing and push: Rex’s strength no limit · Rex’s push no limit · Ollie’s strength no limit · Ollie’s push no limit\./.test(eb2) && !/push: \./.test(eb2), eb2.slice(0, 400));
      // duo-both-at-once-bolts-pulse: Both at once with one bolted, the other's stalled shove presses on his bolts over the
      // stroke of his own real shove, a pulse into the ground (the shoving match's rule)
      const BB = { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'both' };
      await load(Object.assign({ anchor: 'bolted', logKg: 6, oLogKg: 6 }, BB)); await pick('plaster');
      const bp = await duoTxt('.effort-read'), bph = await duoTxt('.happens');
      await load(Object.assign({ oAnchor: 'bolted' }, BB)); await pick('rattle');
      const br2 = await duoTxt('.effort-read');
      check('review round 2: Both at once counts the shove pressing on the bolted one\'s bolts', /\(each as hard as lifting 3\d\d t\)\. The least effort that shakes the ground enough that plaster may crack 5 m away/.test(bp) && !/through his feet, a friction drag/.test(bp) && /Bolted, Rex doesn’t move: Ollie’s shove presses on his bolts for as long as Rex’s own shove drives Ollie off/.test(bph)
        && /\(each as hard as lifting 5\d\.\d t\)\. The least effort that rattles windows/.test(br2) && !/Even all-out, this test doesn’t rattle/.test(br2), bp.slice(0, 300) + ' | ' + br2.slice(0, 200));
      // duo-r2-mutant-survivors: (a) Both at once with Ollie bolted: one of them slides, not both; (b) no 'They mean it'
      // where nothing is meant (the paradox; a catch with no fireball)
      await load(Object.assign({ oAnchor: 'bolted' }, BB));
      const bo1 = await duoTxt('.effort-read');
      await load(Object.assign({ anchor: 'bolted' }, COL)); await pick('windows');
      const mn1 = await duoTxt('.effort-read');
      await load({ duoOpen: true, duoAction: 'catch', keepForm: false }); await pick('windows');
      const mn2 = await duoTxt('.effort-read');
      check('review round 2: Both at once with one bolted slides one of them, and nothing unmeant is called meant', /Past that, one of them slides 5\.17 m/.test(bo1) && !/both are shoved apart/.test(bo1) && !/They mean it/.test(mn1 + mn2), bo1.slice(0, 300) + ' | ' + mn1.slice(0, 200) + ' | ' + mn2.slice(0, 200));
      // duo-noanswer-follows-top: at an unlimited dial the jump's least disruptive effort is the paradox: the box says so
      await load(Object.assign({ colSrc: 'jump', inf: true }, COL));
      const nj = await duoTxt('.effort-read');
      await pick('windows');
      const njw = await duoTxt('.effort-read');
      check('review round 2: the no-answer caveat follows the effort shown, at an unlimited dial', /The hit has no physical answer here \(the canon’s ruling\), so the lab can’t judge its harm/.test(nj) && /The hit has no physical answer here/.test(njw) && !/Even all-out, this test doesn’t/.test(njw), nj.slice(0, 400) + ' | ' + njw.slice(0, 300));
      // physics-standing-pin-loser-elbow-force-unchecked: standing, the loser's feet (or his bolts' rock) carry the force at
      // his elbow; and at unlimited strength against a finite press it is unbounded, never NaN or 'about unlimited'
      await load(Object.assign({ keepForm: false }, A)); await ollieKg(3); await pick('allout');
      const ps = await duoTxt('.status-row'), ph = await duoTxt('.happens');
      await load(Object.assign({ keepForm: false, unbreakable: false, oAnchor: 'bolted', logKg: 7 }, A)); await ollieKg(3); await pick('allout');
      const pb7 = await duoTxt('.status-row');
      await load(Object.assign({ keepForm: false, inf: true }, A)); await ollieKg(3); await pick('allout');
      const pu = await duoAll();
      check('review round 2: standing, the loser\'s feet carry the force at his elbow', /Ollie’s feet slide: what turns his forearm \(24\.2 kN\) beats 17\.7 kN/.test(ps) && !/Ollie’s feet hold/.test(ps) && /what reaches his body is the force at his elbow that turns his forearm against Rex’s hand, about 24\.2 kN/.test(ph)
        && /Ground around Ollie’s bolts tears out/.test(pb7) && /loads Ollie’s elbow pad with an unbounded force/.test(pu) && /he presses with unlimited force/.test(pu) && !/NaN|about unlimited|his full unlimited/.test(pu), ps + ' | ' + pb7 + ' | ' + pu.slice(0, 400));
      // copy-arm-one-bolted-unlimited-no-answer: one held without limit, the press into him has no answer, his own flings the
      // other off
      await load(Object.assign({ keepForm: false, anchor: 'bolted', inf: true }, A)); await pick('allout');
      const ov = await duoTxt('.verdict'), os = await duoTxt('.status-row'), ot = await duoTxt('.tiles');
      check('review round 2: arm wrestling, one bolted at unlimited strength flings the other off', /Rex is bolted to ground their power holds, so Ollie’s unlimited press into him has no physical answer \(the canon’s ruling\) and moves nobody\. Rex’s own unlimited press on Ollie is real, and Ollie’s feet hold only 17\.7 kN, so he is flung off at just under light speed, with unlimited energy\./.test(ov)
        && /Ollie’s feet slide: the other’s unlimited press/.test(os) && /Ollie is flung off/.test(ot) && !/meets a hold without limit: there is no physical answer/.test(ov), ov + ' | ' + os + ' | ' + ot.slice(0, 300));
      // copy-catch-switches-differ: the return leg reaches Rex the same way, but his switch is set the other way, and its
      // own radii are shown
      await load({ duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', logKg: 14, keepForm: false, airAbsorb: 0.5, noKnockback: false }); await pick('allout');
      const kv = await duoTxt('.verdict'), ka = await duoAll();
      check('review round 2: the game of catch with the two switches set apart', /Thrown back, it reaches Rex as plasma too, but Rex’s Never knocked back is off \(Their powers\)\. It carries Rex off at 343 m\/s/.test(kv) && !/hits Rex the same way/.test(kv) && /\(the return throw: what it frees at Rex and as he rides on through the lower air\)/.test(ka), kv.slice(-400) + ' | ' + (ka.match(/Damage radius[^)]*\)/g) || []).join(' / '));
    }
"""
s = s.replace(anchor, block + anchor)
open(p,'w',encoding='utf-8').write(s)
