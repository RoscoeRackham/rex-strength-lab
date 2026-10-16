    // ---- review round 1 of BRIEF-canon.md pull request 2 (research/reviews/canon-2-round1.json): each of these fails on
    // the page before its fix
    {
      const duoTxt = (sel) => page.evaluate((s) => Array.from(document.querySelectorAll('#duo-bay ' + s)).map((n) => n.textContent.replace(/\s+/g, ' ')).join(' / '), sel);
      const num = (x) => Number(String(x).replace(/,/g, ''));
      const r1 = [];
      // code-1: an unlimited shove into a bolted Ollie on real rock, Rex standing with his recoil taken: only the rock
      // around Ollie's bolts tears out (Rex stays put); not 'both sets of bolts' with Rex shoved off at light speed
      const shoveInf = { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'shove', inf: true, oAnchor: 'bolted', unbreakable: false };
      await load(shoveInf); await settle(page, 'duo-bay');
      const infLeast = await duoTxt('.effort-read');
      await pick('#duo-effort', 'allout');
      const infV = await duoTxt('.verdict');
      if (!/the rock gives around Ollie’s bolts/.test(infV) || !/Rex’s push back goes to the endless ocean \(They take their own recoil\), so he stays put/.test(infV) || /both sets of bolts|shoves Rex and Ollie apart/.test(infV) || !/Past that, the rock tears out around Ollie’s bolts\./.test(infLeast)) r1.push('code-1, unlimited shove into a bolted Ollie: ' + infV.slice(0, 200) + ' | ' + infLeast.slice(0, 160));
      // copy-1: the default shove names Rex's push back, what Ollie leaves with and what his sliding feet hand the ground
      // (they add up; Ollie's share matches his speed; no 'equal and opposite share'); the power's hint states the rule
      await load({ duoOpen: true, duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'rex' }); await settle(page, 'duo-bay');
      const shH = await duoTxt('.happens'), shV = await duoTxt('.verdict');
      const shM = shH.match(/That push back on Rex \(([\d,]+) kg·m\/s\) goes to the endless ocean \(below\)\. Ollie leaves with ([\d,]+) kg·m\/s of it; the friction under his sliding feet hands the ground the rest \(([\d,]+) kg·m\/s\) while the push lasts\./), vO = shV.match(/Ollie flies back at ([\d.]+) m\/s/);
      const hint = await page.evaluate(() => document.getElementById('sw-recoil').parentElement.textContent.replace(/\s+/g, ' '));
      if (!shM || !vO || /equal and opposite share/.test(shH) || Math.abs(num(shM[2]) + num(shM[3]) - num(shM[1])) > 0.03 * num(shM[1]) || Math.abs(num(shM[2]) / (3000 * Number(vO[1])) - 1) > 0.02 || !(num(shM[3]) > 0.1 * num(shM[1]))
        || /as much momentum as what they set moving carries/.test(hint) || !/the whole push back of the move, the other way: the momentum of what they set moving or stop, plus whatever resists it while they push/.test(hint)) r1.push('copy-1, the shove\'s push back: ' + ((shH.match(/Newton’s third law[^/]*?(?=After|They take|$)/) || [shH.slice(0, 260)])[0]) + ' | hint ' + ((hint.match(/The endless ocean takes[^.]*\./) || [''])[0]));
      // copy-2: Ollie bolted (the shove stalls) and both bolted: the box and the item agree that the push presses into the
      // ground under Ollie and Rex's push back goes to the endless ocean; the toss with Ollie bolted describes no toss
      for (const [lab, st] of [['Ollie bolted', { oAnchor: 'bolted' }], ['both bolted', { oAnchor: 'bolted', anchor: 'bolted' }]]) {
        await load(Object.assign({ duoOpen: true, duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'rex' }, st)); await settle(page, 'duo-bay');
        const box = await duoTxt('.effort-read'), it = await duoTxt('.happens'), v = await duoTxt('.verdict');
        if (/nothing of the shove reaches the ground|sliding to a stop|presses into the ground under their feet|footing on both sides|either one’s footing/.test(box + it + v) || !/The one shoved still presses on the ground through his feet or bolts, a steady push/.test(box) || !/Ollie’s bolts hold, so the push presses into the ground under him, and Rex’s push back goes to the endless ocean/.test(it)) r1.push('copy-2, a stalled shove (' + lab + '): ' + v.slice(0, 100) + ' | ' + box.slice(-260) + ' | ' + it.slice(0, 260));
      }
      await load({ duoOpen: true, duoAction: 'catch', cObj: 'partner', oAnchor: 'bolted' }); await settle(page, 'duo-bay');
      const tossB = await duoTxt('.effort-read');
      if (/the toss and the catch are Rex’s own pushes/.test(tossB)) r1.push('copy-2, the toss with Ollie bolted (it can\'t be done): ' + tossB.slice(-200));
      // copy-3: a bolted pull with the power off takes a fraction of a second all-out, not 'a steady load over seconds'
      await load({ action: 'pull', obj: 'car', anchor: 'bolted', ownRecoil: false }); await pick('#effort', 'allout');
      const plV = await page.$eval('#bay .verdict', (n) => n.textContent.replace(/\s+/g, ' ')), plB = await page.$eval('#bay .effort-read', (n) => n.textContent.replace(/\s+/g, ' '));
      const plT = plV.match(/in ([\d.,]+ m?s)\./), plS = plB.match(/through his bolts into the planet, over the ([\d.,]+ m?s) the pull takes\. With They take their own recoil off the lab doesn’t count a bolted pull’s ground shaking/);
      if (/steady load over seconds/.test(plB) || !plT || !plS || plT[1] !== plS[1]) r1.push('copy-3, the bolted pull with the power off: ' + plV.slice(0, 60) + ' | ' + ((plB.match(/Bolted, the rope[^.]*\.[^.]*\./) || [plB.slice(0, 200)])[0]));
      // physics: a stomp standing with the power off is an upper bound too (his standing foot unloads), as bolted is;
      // with the power on it isn't
      const stompSay = async (st) => { await load(Object.assign({ action: 'stomp' }, st)); await pick('#effort', 'allout'); return page.$eval('#bay .happens', (n) => n.textContent.replace(/\s+/g, ' ')); };
      const st20 = await stompSay(Object.assign({ logKg: Math.log10(20000) }, POWERS_OFF)), stDef = await stompSay(POWERS_OFF), stOn = await stompSay({});
      if (!/his standing foot presses on it less by the part of the push that doesn’t lift him \(all of it here\)[^.]*so the shaking it gives is an upper bound/.test(st20) || !/his standing foot presses on it less by the part of the push that doesn’t lift him \(\d+% of the foot’s momentum here\)[^.]*upper bound/.test(stDef) || /upper bound/.test((stOn.match(/They take their own recoil: driving the foot[^.]*\.[^.]*\.[^.]*\./) || [''])[0]) || !/Nothing pulls on the ground through his standing foot/.test(stOn))
        r1.push('the stomp\'s upper bound, standing: off at 20,000 kg ' + ((st20.match(/The lab counts only[^.]*\./) || ['(none)'])[0]) + ' | off at the default ' + ((stDef.match(/The lab counts only[^.]*\./) || ['(none)'])[0]));
      // copy-4: a quick arm-wrestling pin with the power on names the momentum the swing's push backs leave in their source
      await load({ duoOpen: true, duoAction: 'arm' }); await settle(page, 'duo-bay');
      await page.evaluate(() => { document.getElementById('ollie-setup').open = true; });
      await page.click('#o-own'); await page.waitForTimeout(300);
      await page.evaluate(() => { const s = document.getElementById('o-strength'); s.value = '4.5'; s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); });
      await page.waitForTimeout(800); await settle(page, 'duo-bay'); await pick('#duo-effort', 'allout');
      const pinH = await duoTxt('.happens'), pinM = pinH.match(/table hands their momentum \(([\d,]+) kg·m\/s\)[^/]*on balance it takes ([\d,]+) kg·m\/s, up, the forearms’ momentum/);
      if (!pinM || pinM[1] !== pinM[2]) r1.push('copy-4, the quick pin\'s figure: ' + ((pinH.match(/Unbreakable footing: the ground under the table[^/]*/) || [pinH.slice(-300)])[0]));
      // (refuted, wording only) a catch that slams into Ollie: his arms stop part of it, his chest the rest, and the whole
      // catch is absorbed (canon)
      await load({ duoOpen: true, duoAction: 'catch', cObj: 'bus', cLogD: 1, cStyle: 'hard' }); await settle(page, 'duo-bay');
      const slamH = await duoTxt('.happens');
      if (!/Ollie’s arms stop part of it and the rest slams into his chest\. A catch is absorbed whole \(canon\), so all of the bus’s momentum \([\d,]+ kg·m\/s\) goes into their source/.test(slamH)) r1.push('the catch slam\'s wording: ' + ((slamH.match(/They take their own recoil: (stopping|Ollie’s arms)[^.]*\.[^.]*\./) || [slamH.slice(0, 200)])[0]));
      if (r1.length) fail('review round 1 (pull request 2): ' + r1.join(' ;; ')); else okLog('review round 1 (pull request 2): the unlimited shove into a bolted Ollie tears only his rock; the shove names its push back, Ollie\'s share and his feet\'s; a stalled shove and a bolted toss say what happens; the bolted pull\'s time; the standing stomp\'s upper bound; the quick pin\'s figure; the catch slam\'s wording');
    }
    // ---- end of review round 1 of pull request 2
