  // ---- BRIEF-canon.md item 6, pull request 5: the absorption shimmer. The Shimmer tile (the energy their powers take back
  // in the run a tab shows, from the engine's RESTRAINT.takenBack; its level from src/ladder.js's glow()) and the glow on
  // his art. Each check fails on pull request 4's page, and with its own part of the build reverted (README). Figures come
  // from the engine in the page, never typed here. Each read waits for the condition it needs (no fixed sleeps).
  if ((!only && !PR4_ONLY) || PR5_ONLY) {
    const r5 = [];
    const check = (label, cond, got) => { if (!cond) r5.push(label + ': ' + String(got).slice(0, 600)); };
    const newPage = async (opts) => {
      const pg = await browser.newPage(Object.assign({ viewport: { width: 1280, height: 900 } }, opts || {}));
      pg.errs = [];
      pg.on('pageerror', (e) => pg.errs.push('PAGEERROR ' + e.message));
      pg.on('console', (m) => { if (m.type() === 'error') pg.errs.push(m.text()); });
      await pg.goto(pathToFileURL(prev).href);
      return pg;
    };
    const page = await newPage();
    const settledOn = (pg, id) => pg.waitForFunction((i) => { const b = document.getElementById(i); return !!b && b.children.length > 0 && !/working it out|Working out/i.test(b.textContent); }, id, { polling: 30, timeout: 30000 });
    // load a saved state (the current save mark, so Safe passenger keeps what it says), then pick an effort as a reader does
    const loadOn = async (pg, st, effort) => {
      await pg.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), Object.assign({ saveV: 3 }, st)); await pg.reload();
      await settledOn(pg, 'bay'); if (st.duoOpen) await settledOn(pg, 'duo-bay');
      if (effort) {
        const sel = st.duoOpen ? '#duo-effort' : '#effort', bay = st.duoOpen ? 'duo-bay' : 'bay';
        await pg.evaluate(([s, b]) => { for (const n of document.getElementById(b).children) n.r5old = true; document.querySelector(s).dataset.r5 = '1'; }, [sel, bay]);
        await pg.selectOption(sel, effort);
        await pg.waitForFunction((b) => Array.from(document.getElementById(b).children).some((n) => !n.r5old), bay, { polling: 30, timeout: 30000 });
        await settledOn(pg, bay);
      }
    };
    const load = (st, effort) => loadOn(page, st, effort);
    // the Shimmer tile of a bay: its row, its place, its key, value and lines (no-break spaces as spaces)
    const tileOf = (bay, inSel) => page.evaluate(([b, sel]) => {
      const box = sel ? document.querySelector('#' + b + ' ' + sel) : document.getElementById(b), all = box ? Array.from(box.querySelectorAll('.tile.shimmer')) : [], t = all[0];
      if (!t) return null;
      const tx = (n) => n.textContent.replace(/ /g, ' ');
      return { n: all.length, last: t.parentElement.classList.contains('tiles') && t.parentElement.lastElementChild === t, k: tx(t.querySelector('.k')), v: tx(t.querySelector('.v')), s: Array.from(t.querySelectorAll('.s')).map(tx),
        markup: Array.from(t.children).map((c) => c.className).join(','), ariaHidden: !!t.closest('[aria-hidden="true"]'), text: tx(t) };
    }, [bay, inSel || null]);
    const bayText = (bay) => page.evaluate((b) => document.getElementById(b).textContent.replace(/ /g, ' ').replace(/\s+/g, ' '), bay);
    const glowOf = (sel) => page.evaluate((q) => { const g = document.querySelector(q); return g ? { hidden: g.hidden, strength: Number(g.dataset.strength), ariaHidden: g.getAttribute('aria-hidden'), pe: getComputedStyle(g).pointerEvents, n: g.children.length } : null; }, sel);
    // the engine and the ladder in the page, at the page's defaults (comic, concrete, standing, the default powers on,
    // all-out at the dial); tb(): the tally's total and each one's take; lad: the ladder's words for an energy
    const eng = (code, arg) => page.evaluate(([c, a]) => { const P = window.DinoPhys, D = window.DINO_DATA, g = P.K.g, L = window.EnergyLadder;
      const mk = (o) => Object.assign({ F: 100 * 907.18474 * g, mode: 'comic', body: P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), surface: D.surfaces.find((x) => x.id === 'concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true }, o || {});
      const O = () => P.makeBody(Object.assign({ build: 'ollie' }, P.DEFAULT_BODIES.ollie)), obj = (id) => D.objects.find((x) => x.id === id);
      const word = (J) => { const w = L.glow(J, D.energyRefs); return { text: w.none ? 'none' : w.text, strength: w.none ? 0 : w.strength, cmp: L.compare(J, D.energyRefs).text }; };
      const tb = (t) => ({ E: t.E, rex: t.by.rex.E, ollie: t.by.ollie.E, rexW: word(t.by.rex.E), ollieW: word(t.by.ollie.E), allW: word(t.E), parts: t.parts, rexParts: t.by.rex.parts, ollieParts: t.by.ollie.parts });
      try { return new Function('P', 'D', 'g', 'mk', 'O', 'obj', 'tb', 'word', 'a', c)(P, D, g, mk, O, obj, tb, word, a); } catch (e) { return { error: String(e) }; } }, [code, arg]);
    const SUPD = { '⁰': 0, '¹': 1, '²': 2, '³': 3, '⁴': 4, '⁵': 5, '⁶': 6, '⁷': 7, '⁸': 8, '⁹': 9 };
    // an energy as the page prints it: '103 kJ', '1.14 GJ', '2.7 × 10²⁴ J', 'about 5 × 10¹⁷ J'
    const parseJ = (t) => {
      let m = t.match(/(?:about )?([\d.,]+)? ?(?:× )?10([⁰¹²³⁴⁵⁶⁷⁸⁹]+) J\b/);
      if (m) return (m[1] ? Number(m[1].replace(/,/g, '')) : 1) * Math.pow(10, Number(m[2].split('').map((c) => SUPD[c]).join('')));
      m = t.match(/([\d.,]+) ([kMGTPE]?)J\b/);
      return m ? Number(m[1].replace(/,/g, '')) * ({ '': 1, k: 1e3, M: 1e6, G: 1e9, T: 1e12, P: 1e15, E: 1e18 })[m[2]] : NaN;
    };
    const cap = (x) => x.charAt(0).toUpperCase() + x.slice(1);
    const nearJ = (shown, J, tol) => Math.abs(shown / J - 1) <= (tol || 0.006);
    const OFF5 = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false, safePassenger: false, noKnockback: false, oNoKnockback: false, silentStrike: false, softLanding: false };
    const DUO = (x) => Object.assign({ duoOpen: true }, x);
    // 1. Rex's tabs: the tile ends the row, gives the engine's energy and what it comes from, the ladder's wording, the
    // level's word and the note once; no tile where nothing is taken back (Walk, Lift, Sprint, Pull, a stomp that breaks
    // nothing)
    const SOLO5 = [
      ['Throw (a car, all-out)', { action: 'throw', obj: 'car', angle: 45 }, 'const c = mk(), r = P.throwObject(c, obj("car"), 45); return tb(P.RESTRAINT.takenBack("throw", r, Object.assign({}, c, { obj: obj("car"), angle: 45 })));', 'the air’s drag on what he threw'],
      ['Jump (all-out, Soft landing)', { action: 'jump', softLanding: true }, 'const c = mk({ softLanding: true }); return tb(P.RESTRAINT.takenBack("jump", P.jump(c), c));', 'his landing, by Soft landing'],
      ['Stomp (all-out)', { action: 'stomp' }, 'const c = mk(); return tb(P.RESTRAINT.takenBack("stomp", P.stomp(c), c));', 'the ground kept whole'],
      ['Punch (10⁹ kg, Silent strike)', { action: 'punch', logKg: 9, silentStrike: true }, 'const c = mk({ F: 1e9 * g, silentStrike: true }); return tb(P.RESTRAINT.takenBack("punch", P.punch(c), c));', 'the blast, by Silent strike'],
      ['Clap (10⁹ kg, Silent strike)', { action: 'clap', logKg: 9, silentStrike: true }, 'const c = mk({ F: 1e9 * g, silentStrike: true }); return tb(P.RESTRAINT.takenBack("clap", P.clap(c), c));', 'the blast, by Silent strike'],
    ];
    {
      const bad = [];
      for (const [lab, st, code, from] of SOLO5) {
        await load(st, 'allout');
        const t = await tileOf('bay'), e = await eng(code);
        const ok = t && t.n === 1 && t.last && t.k === 'Shimmer' && e.E > 0 && t.v === cap(e.rexW.text) && t.s.length === 2 && nearJ(parseJ(t.s[0]), e.E) && t.s[0].includes(', from ' + from + ' · ' + e.rexW.cmp)
          && (t.s[1].match(/Gently warm, never scalding/g) || []).length === 1 && (t.text.match(/never scalding/g) || []).length === 1 && t.markup === 'k,v,s,s';
        if (!ok) bad.push(lab + ': ' + JSON.stringify(t) + ' engine ' + JSON.stringify(e && { E: e.E, w: e.rexW }));
      }
      for (const [lab, st, effort] of [['Walk', { action: 'walk' }], ['Lift', { action: 'lift' }], ['Sprint', { action: 'sprint' }], ['Pull', { action: 'pull' }], ['Stomp, least disruptive (the ground holds anyway)', { action: 'stomp' }]]) {
        await load(st, effort);
        const t = await tileOf('bay'), hg = await glowOf('#hero-glow');
        if (t || !hg || !hg.hidden || hg.strength !== 0) bad.push(lab + ': a tile or a glow where nothing is taken back: ' + JSON.stringify({ t, hg }));
      }
      check('pr5: the Shimmer tile on Rex\'s tabs (Throw, Jump, Stomp, Punch, Clap) ends the row with the engine\'s energy, what it comes from, the ladder\'s wording and the level\'s word, the note once; none where nothing is taken back', !bad.length, bad.join(' ;; '));
    }
    // 2. the two-player runs: the tile ends the row; its level is Rex's; each one who takes something in has his own line,
    // naming what it comes from, with the engine's figure and the ladder's wording
    const DUO5 = [
      ['the Wrestle throw (all-out)', DUO({ duoAction: 'wrestle', wrestleMove: 'throw', wAngle: 45 }), 'const A = mk(), B = mk({ body: O() }); return tb(P.RESTRAINT.takenBack("wrestleThrow", P.throwPartner(A, B, 45), { A, B, whoA: "rex", angle: 45 }));', { rex: 'the air’s drag on what he threw' }],
      ['the Wrestle throw at 10⁹ kg (all-out)', DUO({ duoAction: 'wrestle', wrestleMove: 'throw', wAngle: 45, logKg: 9 }), 'const A = mk({ F: 1e9 * g }), B = mk({ F: 1e9 * g, body: O() }); return tb(P.RESTRAINT.takenBack("wrestleThrow", P.throwPartner(A, B, 45), { A, B, whoA: "rex", angle: 45 }));', { ollie: 'the ground kept whole' }],
      ['the game of catch (a car, gentle lob, 10 m, all-out)', DUO({ duoAction: 'catch', cObj: 'car', cStyle: 'easy', cLogD: 1 }), 'const A = mk(), B = mk({ body: O() }), a = P.catchLeg(A, B, obj("car"), 10, "easy"); return tb(P.RESTRAINT.takenBack("catch", { a, b: a }, { A, B, whoA: "rex", obj: obj("car") }));', { rex: 'his catch', ollie: 'his catch' }],
      ['the partner toss (gentle, 10 m, all-out)', DUO({ duoAction: 'catch', cObj: 'partner', cStyle: 'easy', cLogD: 1 }), 'const A = mk(), B = mk({ body: O() }), t = P.tossPartner(A, B.body, "Ollie", "easy", 10, "friction"); return tb(P.RESTRAINT.takenBack("toss", t, { A, B, whoA: "rex" }));', { rex: 'his catch' }],
      ['Collide (Ollie\'s sprint, all-out)', DUO({ duoAction: 'collide' }), 'const A = mk({ body: O() }), B = mk(), r = P.collide(A, B, { source: "sprint" }); return tb(P.RESTRAINT.takenBack("collide", r, { A, B, whoA: "ollie" }));', { rex: 'the hit', ollie: 'his own stop after the hit' }],
    ];
    {
      const bad = [], who = [];
      for (const [lab, st, code, from] of DUO5) {
        await load(st, 'allout');
        const t = await tileOf('duo-bay'), e = await eng(code);
        const lines = t ? t.s.slice(0, -1) : [];
        const ok = t && t.n === 1 && t.last && t.k === 'Shimmer' && e.E > 0 && t.v === 'Rex: ' + e.rexW.text && (t.text.match(/never scalding/g) || []).length === 1;
        if (!ok) bad.push(lab + ': ' + JSON.stringify(t) + ' engine ' + JSON.stringify(e && { E: e.E, rex: e.rex, w: e.rexW }));
        // who: one line each for Rex and Ollie where each takes something in, in that order
        const wantWho = ['rex', 'ollie'].filter((w) => e[w] > 0);
        const whoOk = t && lines.length === wantWho.length && wantWho.every((w, i) => { const nm = w === 'rex' ? 'Rex' : 'Ollie', l = lines[i]; return l.startsWith(nm + ' takes in ') && nearJ(parseJ(l), e[w]) && l.includes(', from ' + from[w] + ' · ' + e[w + 'W'].cmp); })
          && Object.keys(from).sort().join() === wantWho.slice().sort().join() && (e.ollie > 0) === /Canon gives the shimmer to Rex; whether Ollie shows what he takes in is still to be ruled\./.test(t.text);
        if (!whoOk) who.push(lab + ': ' + JSON.stringify(lines) + ' engine rex ' + e.rex + ' ollie ' + e.ollie);
      }
      check('pr5: the Shimmer tile on the two-player runs (the Wrestle throw, the game of catch, the partner toss, Collide) ends the row with Rex\'s level, the note once', !bad.length, bad.join(' ;; '));
      check('pr5: the two-player tiles name who takes in each part (Rex, Ollie), with the engine\'s figures and the ladder\'s wording, and say canon gives the shimmer to Rex', !who.length, who.join(' ;; '));
    }
    // 3. with every power off nothing is taken back: no tile, and the header glow is off (the same runs with the powers on
    // have one, above)
    {
      const bad = [];
      for (const [lab, st] of [['Throw', { action: 'throw', obj: 'car' }], ['Jump', { action: 'jump' }], ['Stomp', { action: 'stomp' }], ['Punch at 10⁹ kg', { action: 'punch', logKg: 9 }], ['Clap at 10⁹ kg', { action: 'clap', logKg: 9 }], ['the Wrestle throw at 10⁹ kg', DUO({ duoAction: 'wrestle', wrestleMove: 'throw', logKg: 9 })], ['the game of catch', DUO({ duoAction: 'catch', cObj: 'car' })], ['the partner toss', DUO({ duoAction: 'catch', cObj: 'partner' })], ['Collide', DUO({ duoAction: 'collide' })]]) {
        await load(Object.assign({}, st, OFF5), 'allout');
        const t = await tileOf(st.duoOpen ? 'duo-bay' : 'bay'), hg = await glowOf('#hero-glow'), cg = st.duoAction === 'collide' ? await glowOf('#duo-bay .glow') : null;
        if (t || !hg || !hg.hidden || (cg && !cg.hidden)) bad.push(lab + ': ' + JSON.stringify({ t, hg, cg }));
      }
      // ... and the same Throw and Collide with the powers on do show one (so this check means something on any page)
      await load({ action: 'throw', obj: 'car' }, 'allout'); const onT = await tileOf('bay');
      await load(DUO({ duoAction: 'collide' }), 'allout'); const onC = await tileOf('duo-bay');
      if (!onT || !onC) bad.push('powers on: no tile on Throw or Collide');
      check('pr5: with every power off there is no Shimmer tile and no glow (with them on there is)', !bad.length, bad.join(' ;; '));
    }
    // 4. the Weight tab's growth what-if: the tile in its box, the rough energy to one figure, the header glow at its level
    {
      await load({ action: 'weight' });
      const none = await tileOf('bay', '.growth-whatif');
      await page.evaluate(() => { for (const n of document.getElementById('bay').children) n.r5old = true; document.getElementById('grow-what-krakatoa').click(); });
      await page.waitForFunction(() => Array.from(document.getElementById('bay').children).some((n) => !n.r5old), null, { polling: 30, timeout: 30000 });
      const t = await tileOf('bay', '.growth-whatif'), outside = await page.evaluate(() => Array.from(document.querySelectorAll('#bay .tile.shimmer')).filter((n) => !n.closest('.growth-whatif')).length), hg = await glowOf('#hero-glow');
      const e = await eng('const r = D.energyRefs.find((x) => x.id === "krakatoa"); return Object.assign(tb(P.RESTRAINT.takenBack("weight", null, { growE: r.J })), { rough: r.rough, J: r.J });');
      check('pr5: the Weight tab shows the shimmer in its growth what-if box (Krakatoa: the rough energy to one figure, the level\'s word, the header glow at its strength)', !none && t && t.last && outside === 0 && e.rough && t.v === cap(e.rexW.text) && /^About \d × 10[⁰¹²³⁴⁵⁶⁷⁸⁹]+ J taken in, from the growth what-if · /.test(t.s[0]) && nearJ(parseJ(t.s[0]), Number(e.J.toPrecision(1)), 1e-9) && t.s[0].endsWith(e.rexW.cmp)
        && hg && !hg.hidden && Math.abs(hg.strength - e.rexW.strength) < 1e-9, JSON.stringify({ none, t, outside, hg, e: e && { J: e.J, w: e.rexW } }));
    }
    // 5. unlimited strength: unbounded energy, said in words (no physical answer, no figure), never '∞' or 'Infinity'
    {
      const bad = [];
      for (const [lab, st] of [['Throw', { action: 'throw', obj: 'car', inf: true }], ['Clap (Silent strike)', { action: 'clap', silentStrike: true, inf: true }], ['the Wrestle throw', DUO({ duoAction: 'wrestle', wrestleMove: 'throw', inf: true })]]) {
        await load(st, 'allout');
        const t = await tileOf(st.duoOpen ? 'duo-bay' : 'bay');
        const ok = t && /∞|Infinity|NaN|undefined/.test(t.text) === false && t.v === (st.duoOpen ? 'Rex: a blinding flare' : 'A blinding flare') && /(Unbounded energy taken in|Rex takes in unbounded energy), from [^:]+: unlimited strength has no physical answer here, so there is no figure\./.test(t.text);
        if (!ok) bad.push(lab + ': ' + JSON.stringify(t));
      }
      check('pr5: at unlimited strength the tile says the energy is unbounded, in words, with no "∞"', !bad.length, bad.join(' ;; '));
    }
    // 6. screen readers: the tile is in the tab panel's accessibility tree, as plain text like the other tiles; the glow
    // layers are aria-hidden and ignored by it, and take no clicks
    {
      await load(DUO({ action: 'stomp', duoAction: 'collide' }), 'allout');
      await page.selectOption('#effort', 'allout'); await settledOn(page, 'bay');
      const t = await tileOf('bay'), aria = await page.locator('#bay').ariaSnapshot();
      const cdp = await page.context().newCDPSession(page);
      const ax = async (sel) => { const { root } = await cdp.send('DOM.getDocument', { depth: 0 }); const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: sel }); if (!nodeId) return null; const { nodes } = await cdp.send('Accessibility.getPartialAXTree', { nodeId, fetchRelatives: false }); return nodes[0] ? { ignored: nodes[0].ignored, why: (nodes[0].ignoredReasons || []).map((x) => x.name).join(',') } : null; };
      const hAx = await ax('#hero-glow'), cAx = await ax('#duo-bay .glow'), tAx = await ax('#bay .tile.shimmer'), hg = await glowOf('#hero-glow'), cg = await glowOf('#duo-bay .glow');
      await cdp.detach();
      const plainTile = await page.evaluate(() => { const t = document.querySelector('#bay .tile.shimmer'), o = document.querySelector('#bay .tile:not(.shimmer)'); return !!t && !!o && t.tagName === o.tagName && !t.hasAttribute('role') && !t.hasAttribute('aria-hidden') && !t.hasAttribute('aria-label'); });
      check('pr5: screen readers hear the Shimmer tile (in the accessibility tree, plain text like the other tiles) and not the glow layers (aria-hidden, ignored, no clicks)', t && plainTile && !t.ariaHidden && aria.includes('Shimmer') && aria.includes(t.v) && aria.includes('taken in, from the ground kept whole') && tAx && !tAx.ignored
        && hg && hg.ariaHidden === 'true' && hg.pe === 'none' && hAx && hAx.ignored && /ariaHidden/i.test(hAx.why) && cg && cg.ariaHidden === 'true' && cg.pe === 'none' && cAx && cAx.ignored && /ariaHidden/i.test(cAx.why),
        JSON.stringify({ t: t && t.v, plainTile, hAx, cAx, tAx, hg, cg }) + ' | ' + aria.slice(-400));
    }
    // 7. the glows follow Rex's own take: the header picture the run on Rex's tab, the Collide picture Rex's take in the
    // charge (a blast preset means Rex's hit: his take is none, while Ollie's own stop is still taken back)
    {
      const bad = [];
      await load({ action: 'stomp' }, 'allout');
      const hs = await glowOf('#hero-glow'), es = await eng('const c = mk(); return tb(P.RESTRAINT.takenBack("stomp", P.stomp(c), c));');
      if (!hs || hs.hidden || Math.abs(hs.strength - es.rexW.strength) > 1e-9 || !(hs.strength > 0)) bad.push('header, the stomp all-out: ' + JSON.stringify(hs) + ' engine ' + es.rexW.strength);
      const gb = Math.log10(0.001 / Math.sqrt(1 - 1e-6));
      await load(DUO({ action: 'walk', duoAction: 'collide', colSrc: 'set', colGB: gb }), 'allout');
      const ca = await glowOf('#duo-bay .glow'), ec = await eng('const A = mk({ body: O() }), B = mk(), r = P.collide(A, B, { source: "set", gb: a }); return tb(P.RESTRAINT.takenBack("collide", r, { A, B, whoA: "ollie" }));', 0.001 / Math.sqrt(1 - 1e-6)), hw = await glowOf('#hero-glow');
      if (!ca || ca.hidden || Math.abs(ca.strength - ec.rexW.strength) > 1e-9 || !hw || !hw.hidden) bad.push('Collide at 0.1% of light speed: ' + JSON.stringify({ ca, hw }) + ' engine ' + ec.rexW.strength);
      await page.evaluate(() => { for (const n of document.getElementById('duo-bay').children) n.r5old = true; });
      await page.selectOption('#duo-effort', 'windows');
      await page.waitForFunction(() => Array.from(document.getElementById('duo-bay').children).some((n) => !n.r5old), null, { polling: 30, timeout: 30000 }); await settledOn(page, 'duo-bay');
      const cm = await glowOf('#duo-bay .glow'), tm = await tileOf('duo-bay');
      if (!cm || !cm.hidden || cm.strength !== 0 || !tm || tm.v !== 'Rex: none' || !/^Ollie takes in /.test(tm.s[0])) bad.push('Collide meant (the windows preset): ' + JSON.stringify({ cm, tm }));
      check('pr5: the header glow follows the run on Rex\'s tab, and the Collide picture\'s Rex\'s own take in the charge (none when he means the hit, while Ollie\'s stop is taken back)', !bad.length, bad.join(' ;; '));
    }
    // 8. copy that the shimmer made wrong, now fixed: a catch's energy is taken back, not left as heat in his plush (and is
    // heat with the power off); the shimmer is drawn now; the Throw tab's drag-free figure says which figure the shimmer
    // counts; the charger's stop gives his motion, as the tile does
    {
      const bad = [];
      await load(DUO({ duoAction: 'catch', cObj: 'car' }), 'allout');
      const cOn = await bayText('duo-bay'), kOn = await tileOf('duo-bay');
      if (!/Stopping it frees [\d.,]+ [kMG]?J \([^)]*\) in his palms and arms\. A catch is absorbed \(canon, They take their own recoil\): that energy goes to the endless ocean with its push back, and the Shimmer tile counts it\./.test(cOn) || /heat in his indestructible plush/.test(cOn) || !kOn) bad.push('catch, power on: ' + ((cOn.match(/Stopping it[^.]*\.[^.]*\./) || [''])[0]));
      await load(DUO({ duoAction: 'catch', cObj: 'car', ownRecoil: false }), 'allout');
      const cOff = await bayText('duo-bay');
      if (!/into his palms and arms\. It ends up as heat in his indestructible plush/.test(cOff)) bad.push('catch, power off: ' + ((cOff.match(/Stopping it[^.]*\.[^.]*\./) || [''])[0]));
      await load(DUO({ duoAction: 'catch', cObj: 'partner' }), 'allout');
      const tOn = await bayText('duo-bay');
      if (!/Stopping him frees [\d.,]+ [kMG]?J \([^)]*\) in Rex’s arms\. A catch is absorbed \(canon, They take their own recoil\): that energy goes to the endless ocean with its push back, and the Shimmer tile counts it\./.test(tOn) || /heat in his plush/.test(tOn)) bad.push('toss, power on: ' + ((tOn.match(/Stopping him[^.]*\.[^.]*\./) || [''])[0]));
      await load(DUO({ duoAction: 'catch', cObj: 'partner', ownRecoil: false }), 'allout');
      if (!/into Rex’s arms, which ends up as heat in his plush\./.test(await bayText('duo-bay'))) bad.push('toss, power off');
      // the fireball's freed motion and Collide's hit
      await load(DUO({ duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', logKg: 14, keepForm: false, airAbsorb: 0.5 }), 'allout');
      const fb = await bayText('duo-bay');
      if (!/canon takes a hit’s freed energy back by default, so that part goes to the endless ocean \(the Shimmer tile counts it\)/.test(fb) || /draw yet|drawn here yet/.test(fb)) bad.push('fireball: ' + ((fb.match(/canon takes a hit[^.]*\./) || [''])[0]));
      await load(DUO({ duoAction: 'collide' }), 'allout');
      const co = await bayText('duo-bay'), kc = await tileOf('duo-bay');
      const stopM = co.match(/Ollie stops himself there \(his own push, so its push back, [\d,]+ kg·m\/s, and his motion, ([\d.,]+ [kMGT]?J), go to his source too\)/), ollieLine = kc && kc.s.find((x) => x.startsWith('Ollie takes in '));
      if (/draw yet|drawn here yet|not drawn/.test(co) || !/taken back by default \(the Shimmer tile\)/.test(co) || !/a hit’s freed energy is taken back by default \(the Shimmer tile counts it\)/.test(co) || !stopM || !ollieLine || !ollieLine.startsWith('Ollie takes in ' + stopM[1] + ', from his own stop after the hit')) bad.push('Collide: ' + (stopM ? stopM[0] : co.slice(0, 200)) + ' | ' + ollieLine);
      // the Throw tab at 100%: the drag-free figure, and the shimmer's (the tile's) figure named beside it
      await load({ action: 'throw', obj: 'car' }, 'allout');
      const th = await bayText('bay'), kt = await tileOf('bay'), dm = th.match(/The shimmer \(the Shimmer tile\) counts a different figure: what real air would have taken from this same throw, ([\d.,]+ [kMGT]?J)\. The figure above is the drag along the drag-free path, on a car that real air would have slowed\./);
      if (!dm || !kt || !kt.s[0].startsWith(dm[1] + ' taken in, from the air’s drag')) bad.push('Throw: ' + (dm ? dm[0] : (th.match(/No drag:[^]*?\. /) || [''])[0]) + ' | ' + (kt && kt.s[0]));
      check('pr5: the copy the shimmer made wrong is fixed (a catch\'s and the toss\'s energy taken back, heat only with the power off; no "not drawn yet"; the Throw tab names the shimmer\'s drag figure; the charger\'s stop gives the tile\'s figure)', !bad.length, bad.join(' ;; '));
    }
    if (page.errs.length) r5.push('page errors: ' + page.errs.slice(0, 3).join(' | '));
    await page.close();
    // 9-11. the glow on the art, at 390 and 1280 px, light and dark, with reduced motion (a static glow): it sits on his
    // eyes, mouth and feather tips (brighter there with the glow at full than at none) and nowhere else (the background,
    // the Collide picture's spires and caption unchanged); each picture's box is its image's own (no layout shift, the
    // header image at the 16 px gutter at 390 px), the glow layer fills it, and nothing scrolls sideways
    {
      const pg = await newPage({ reducedMotion: 'reduce' });
      const ART = await pg.evaluate(() => null);
      // the measured spots, read from the page's own glow layers (data-f: eye, mouth, tip; left/top/width/height in %)
      const spotsOf = (sel) => pg.evaluate((q) => Array.from(document.querySelectorAll(q + ' i')).map((i) => ({ f: i.dataset.f, x: parseFloat(i.style.left) / 100, y: parseFloat(i.style.top) / 100, rx: parseFloat(i.style.width) / 200, ry: parseFloat(i.style.height) / 200 })), sel);
      // places away from his features: the header's grey background and his black tank top; the Collide picture's
      // spires (left and right) and its caption
      const CONTROL = { hero: [[0.08, 0.06], [0.92, 0.06], [0.85, 0.45], [0.5, 0.52]], col: [[0.06, 0.12], [0.93, 0.22], [0.42, 0.905], [0.62, 0.905]] };
      const shots = {}, layout = [], scroll = [];
      const VIEWS = [[1280, 900, 'light'], [1280, 900, 'dark'], [390, 844, 'light'], [390, 844, 'dark']];
      const lum = (b64, pts) => pg.evaluate(async ([b, ps]) => { const im = new Image(); im.src = 'data:image/png;base64,' + b; await im.decode(); const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d'); x.drawImage(im, 0, 0);
        return ps.map(([fx, fy, hw]) => { const cx = Math.round(fx * im.width), cy = Math.round(fy * im.height), h = Math.max(1, hw || 1); const d = x.getImageData(Math.max(0, cx - h), Math.max(0, cy - h), 2 * h + 1, 2 * h + 1).data; let s = 0, n = 0; for (let i = 0; i < d.length; i += 4) { s += 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]; n++; } return s / n; }); }, [b64, pts]);
      for (const [nm, st, effort] of [['none', DUO({ action: 'walk', duoAction: 'collide', colMode: 'push' })], ['full', DUO({ action: 'throw', obj: 'car', inf: true, duoAction: 'collide', colSrc: 'set', colGB: 4 }), 'allout']]) {
        await pg.setViewportSize({ width: 1280, height: 900 });
        await loadOn(pg, st);
        if (effort) { await pg.selectOption('#effort', effort); await pg.waitForFunction(() => Number(document.getElementById('hero-glow').dataset.strength) === 1, null, { polling: 30, timeout: 30000 }); }
        const want = nm === 'full' ? 1 : 0;
        const gs = await pg.evaluate(() => [document.getElementById('hero-glow'), document.querySelector('#duo-bay .glow')].map((g) => (g ? (g.hidden ? 0 : Number(g.dataset.strength)) : null)));
        if (gs[0] !== want || gs[1] !== want) layout.push(nm + ': glow strengths ' + gs.join(', ') + ' (want ' + want + ')');
        for (const [w, h, scheme] of VIEWS) {
          await pg.setViewportSize({ width: w, height: h }); await pg.emulateMedia({ colorScheme: scheme });
          await pg.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
          await settledOn(pg, 'duo-bay');
          const geo = await pg.evaluate(() => { const R = (n) => { const r = n.getBoundingClientRect(); return [r.x, r.y, r.width, r.height]; };
            const hb = document.getElementById('hero-art'), hi = hb && hb.querySelector('img'), hl = hb && hb.querySelector('.glow'), cb = document.querySelector('#duo-bay .art-figure .glow-art'), ci = cb && cb.querySelector('img'), cl = cb && cb.querySelector('.glow');
            return { hb: hb && R(hb), hi: hi && R(hi), hl: hl && hl.children.length ? R(hl) : null, cb: cb && R(cb), ci: ci && R(ci), cl: cl ? R(cl) : null, hOver: hb ? getComputedStyle(hb).overflow : null, cOver: cb ? getComputedStyle(cb).overflow : null, vw: innerWidth, sx: document.documentElement.scrollWidth - document.documentElement.clientWidth }; });
          const same = (a, b) => a && b && a.every((v, i) => Math.abs(v - b[i]) < 0.6);
          const heroW = Math.min(168, Math.max(96, 0.2 * geo.vw)), colW = w <= 480 ? 260 : 220;
          if (!same(geo.hb, geo.hi) || !same(geo.cb, geo.ci) || geo.hOver !== 'hidden' || geo.cOver !== 'hidden' || Math.abs(geo.hi[2] - heroW) > 0.6 || Math.abs(geo.hi[3] - heroW * 558 / 432) > 0.6 || Math.abs(geo.ci[2] - colW) > 0.6 || Math.abs(geo.ci[3] - colW * 4 / 3) > 0.6 || (w === 390 && Math.abs(geo.hi[0] - 16) > 0.6)
            || (nm === 'full' && (!same(geo.hl, geo.hi) || !same(geo.cl, geo.ci)))) layout.push(nm + ' ' + w + ' ' + scheme + ': ' + JSON.stringify(geo));
          if (w === 390 && geo.sx > 0) scroll.push(nm + ' ' + scheme + ': scrolls sideways ' + geo.sx + ' px');
          const hS = await (await pg.$('#hero-art')).screenshot(), cS = await (await pg.$('#duo-bay .art-figure .glow-art')).screenshot();
          shots[nm + w + scheme] = { hero: hS.toString('base64'), col: cS.toString('base64') };
        }
      }
      const hero = await spotsOf('#hero-glow'), col = await spotsOf('#duo-bay .glow');
      const glowBad = [];
      for (const [w, , scheme] of VIEWS) for (const [pic, spots, ctl, W] of [['hero', hero, CONTROL.hero, w <= 480 ? 96 : 168], ['col', col, CONTROL.col, w <= 480 ? 260 : 220]]) {
        // each spot sampled at its centre over a window a third of its half-width (at least 1 px either side)
        const pts = spots.map((p) => [p.x, p.y, Math.round(p.rx * W / 3)]).concat(ctl.map(([x, y]) => [x, y, 2]));
        const a = await lum(shots['none' + w + scheme][pic], pts), b = await lum(shots['full' + w + scheme][pic], pts);
        const d = b.map((v, i) => v - a[i]), dS = d.slice(0, spots.length), dC = d.slice(spots.length);
        const by = (f) => dS.filter((x, i) => spots[i].f === f), mean = (xs) => xs.reduce((s, x) => s + x, 0) / xs.length;
        const eyes = by('eye'), mouth = by('mouth'), tips = by('tip');
        // brighter on every eye and mouth glow, on the feather tips on average and on most of them; unchanged elsewhere
        if (!spots.length || !(Math.min(...eyes) >= 20) || !(Math.min(...mouth) >= 20) || !(mean(tips) >= 12) || !(tips.filter((x) => x >= 6).length >= 0.7 * tips.length) || !(Math.max(...dC.map(Math.abs)) <= 2))
          glowBad.push(pic + ' ' + w + ' ' + scheme + ': eyes ' + eyes.map((x) => x.toFixed(0)).join('/') + ', mouth ' + mouth.map((x) => x.toFixed(0)).join('/') + ', tips mean ' + (tips.length ? mean(tips).toFixed(1) : 'none') + ', elsewhere ' + dC.map((x) => x.toFixed(1)).join('/'));
      }
      check('pr5: the glow sits on his eyes, mouth and feather tips on both pictures (brighter there at full than at none, unchanged on the background, spires and caption), at 390 and 1280 px, light and dark', hero.length > 0 && col.length > 0 && !glowBad.length, glowBad.join(' ;; '));
      check('pr5: each picture\'s box is its image\'s own (no layout shift; at 390 px the header image at the 16 px gutter), clips the glow, and the glow layer fills it', !layout.length, layout.join(' ;; '));
      check('pr5: with the Shimmer tile and the glow at full, nothing scrolls sideways at 390 px', !scroll.length && Object.keys(shots).length === 8, scroll.join(' ;; '));
      // reduced motion: the glow is still drawn, with no animation; with motion allowed it shimmers
      const still = await pg.evaluate(() => Array.from(document.querySelectorAll('.glow i')).map((i) => getComputedStyle(i).animationName));
      if (pg.errs.length) r5.push('page errors (art): ' + pg.errs.slice(0, 3).join(' | '));
      await pg.close();
      const pm = await newPage({ reducedMotion: 'no-preference' });
      await loadOn(pm, DUO({ action: 'stomp', duoAction: 'collide' }), 'allout');
      const moving = await pm.evaluate(() => Array.from(document.querySelectorAll('.glow i')).map((i) => getComputedStyle(i).animationName));
      await pm.close();
      check('pr5: reduced motion: the glow is static (no animation); with motion allowed it shimmers', still.length > 0 && still.every((x) => x === 'none') && moving.length > 0 && moving.every((x) => x === 'shimmer'), JSON.stringify({ still: [...new Set(still)], moving: [...new Set(moving)] }));
    }
    if (r5.length) fail('pull request 5 (the shimmer): ' + r5.join(' ;; ')); else okLog('pull request 5: the Shimmer tile ends the row on Throw, Jump, Stomp, Punch, Clap, the Wrestle throw, the game of catch, the partner toss and Collide with the engine\'s energy, the ladder\'s wording and the level, names who takes each part in on the two-player runs, shows in the Weight what-if box, says "unbounded" in words at unlimited strength, is gone with every power off and is what screen readers hear; the glow sits on his eyes, mouth and feather tips on both pictures at 390 and 1280 px, light and dark, follows Rex\'s own take, is aria-hidden, static under reduced motion, shifts nothing and scrolls nothing; the copy it made wrong is fixed');
  }
