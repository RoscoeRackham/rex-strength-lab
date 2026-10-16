    // BRIEF-canon.md items 2 and 7: their own recoil goes to their source, the endless ocean, not into the planet. With the
    // defaults (and with both Bolted switches on too) no tab or card sends their own recoil into the planet, keeps
    // 'still obeys Newton' or says momentum is never absorbed; each tab is read at the least disruptive effort and all-out
    // ('not into the planet' is the new wording and is allowed; Bolted's own push 'into the planet instead' has no recoil
    // words; Collide's incoming hits are pull request 4's)
    const RECOIL_PLANET = /(?:recoil|push back|pull back)[^.]*(?<!not )into the planet|the planet keeps (?:the|it|no)\b|still obeys Newton|momentum is never absorbed|no power absorbs momentum/gi;
    const pageText = () => page.evaluate(() => { const b = document.body.cloneNode(true); b.querySelectorAll('script, style').forEach((x) => x.remove()); return b.textContent.replace(/\s+/g, ' '); });
    const planet = [];
    for (const foot of [{ anchor: 'friction', oAnchor: 'friction' }, { anchor: 'bolted', oAnchor: 'bolted' }]) {
      for (const tab of SOLO.concat(DUO)) {
        const duo = DUO.includes(tab), st = Object.assign({}, foot, duo ? { duoOpen: true, duoAction: tab } : { action: tab });
        await load(st); if (duo) await settle(page, 'duo-bay');
        for (const e of ['least', 'allout']) {
          if (e === 'allout') { if (duo) await pick('#duo-effort', 'allout'); else if (await page.$('#effort')) await pick('#effort', 'allout'); else continue; }
          const hits = (await pageText()).match(RECOIL_PLANET);
          if (hits) planet.push(tab + ' (' + foot.anchor + ', ' + e + '): ' + Array.from(new Set(hits)).join(' | ').slice(0, 200));
        }
      }
    }
    const eyebrow = await page.$eval('.hero .eyebrow', (n) => n.textContent.trim());
    if (planet.length || eyebrow !== 'Indestructible · never tires · unlimited') fail('their own recoil into the planet, or the old wording (BRIEF-canon.md items 2 and 7): eyebrow "' + eyebrow + '"; ' + planet.slice(0, 6).join(' ; '));
    else okLog('no tab or card sends their own recoil into the planet or says momentum is never absorbed (friction and bolted, least disruptive and all-out); the eyebrow reads "' + eyebrow + '"');
    // Pull says why it has no ground shaking: with the power on its rope's pull back goes to the endless ocean; with it off
    // it is a steady load the lab doesn't count (never the generic 'doesn't model' text, nor 'only with the power on')
    await load({ action: 'pull' }); await pick('#effort', 'plaster');
    const pullOn = await page.$eval('#bay .effort-read', (n) => n.textContent.replace(/\s+/g, ' '));
    await load({ action: 'pull', ownRecoil: false }); await pick('#effort', 'plaster');
    const pullOff = await page.$eval('#bay .effort-read', (n) => n.textContent.replace(/\s+/g, ' '));
    if (!/the rope’s pull back on him goes to the endless ocean, so nothing of the pull reaches the ground/.test(pullOn) || /doesn’t model the ground shaking from this move/.test(pullOn + pullOff) || !/the lab doesn’t count it/.test(pullOff) || /only with (They take their own recoil|the power) on/.test(pullOff)) fail('Pull should say why it has no ground shaking: on ' + pullOn.slice(0, 260) + ' | off ' + pullOff.slice(0, 260));
    else okLog('Pull says why it has no ground shaking, with the power on (the rope’s pull back goes to the endless ocean) and off (a steady load the lab doesn’t count)');
    // the Throw tab at the default least disruptive car throw names the momentum his source takes back (the brief's
    // 22,000 kg·m/s), as the engine gives it at the effort the page shows
    await load({ action: 'throw' });
    const thrT = await bayText(), thrM = thrT.match(/goes into their source, the endless ocean: ([\d,]+) kg·m\/s, the car’s momentum/), thrUse = thrT.match(/as hard as lifting ([\d.,]+)\s(t|kg)/);
    const thrJ = thrUse ? await page.evaluate((kg) => { const P = window.DinoPhys, D = window.DINO_DATA, g = P.K.g; const body = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex));
      const c = { F: 100 * 907.18474 * g, mode: 'comic', body, surface: D.surfaces.find((x) => x.id === 'concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, use: kg * g };
      const r = P.throwObject(c, D.objects.find((x) => x.id === 'car'), 45); return r.recoilAbsorbed ? r.recoilAbsorbed.J : null; }, Number(thrUse[1].replace(/,/g, '')) * (thrUse[2] === 't' ? 1000 : 1)) : null;
    const thrShown = thrM ? Number(thrM[1].replace(/,/g, '')) : null;
    if (!thrShown || !(thrJ > 0) || Math.abs(thrShown / thrJ - 1) > 0.03 || Math.abs(thrShown / 22000 - 1) > 0.03) fail('the default throw should name the momentum taken back (about 22,000 kg·m/s): shown ' + thrShown + ', engine ' + thrJ);
    else okLog('the default least disruptive car throw names the momentum his source takes back: ' + thrM[1] + ' kg·m/s (engine ' + Math.round(thrJ) + ')');
    // a catch the catcher's power keeps him planted in: the 10²⁰ kg fastball that carried him off at about 4,000 km/s
    await load({ duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', logKg: 20 }); await settle(page, 'duo-bay'); await pick('#duo-effort', 'allout');
    const carried = await page.$eval('#duo-bay', (n) => n.textContent.replace(/\s+/g, ' '));
    if (!/He isn’t carried off: without it the catch would carry him off/.test(carried) || /[Cc]arries Ollie off|carries him off at|Ollie carried off/.test(carried)) fail('the catch at a 10²⁰ kg dial should keep Ollie planted: ' + ((carried.match(/[^.]*carr[^.]*\./g) || []).join(' ') || carried.slice(0, 300)));
    else okLog('a catch at a 10²⁰ kg dial: Ollie isn’t carried off (his stop goes to the endless ocean)');
