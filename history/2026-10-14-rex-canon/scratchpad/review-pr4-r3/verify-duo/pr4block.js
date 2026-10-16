  if (!only || PR4_ONLY) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errs = [];
    page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await page.goto(pathToFileURL(prev).href);
    const load = async (st) => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(800); await settle(page, 'bay'); if (st.duoOpen) { await page.waitForTimeout(300); await settle(page, 'duo-bay'); } };
    const pick = async (v) => { await page.selectOption('#duo-effort', v); await page.waitForTimeout(300); await settle(page, 'duo-bay'); };
    const duoTxt = (sel) => page.evaluate((s) => Array.from(document.querySelectorAll('#duo-bay ' + s)).map((n) => n.textContent.replace(/\s+/g, ' ')).join(' / '), sel);
    const duoAll = () => page.evaluate(() => document.getElementById('duo-bay').textContent.replace(/\s+/g, ' '));
    // Ollie's own what-if strength (log10 kg), set as a reader does (the page resets it on every load)
    const ollieKg = async (logKg) => { await page.evaluate(() => { document.getElementById('ollie-setup').open = true; }); await page.click('#o-own'); await page.waitForTimeout(300);
      await page.evaluate((v) => { const s = document.getElementById('o-strength'); s.value = String(v); s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); }, logKg); await page.waitForTimeout(800); await settle(page, 'duo-bay'); };
    const num = (x) => Number(String(x).replace(/,/g, ''));
    const near = (a, b, tol) => Math.abs(a / b - 1) <= (tol || 0.01);
    // the engine at the page's defaults (comic, concrete, standing, the four default powers on, all-out at the dial)
    const eng = (code, arg) => page.evaluate(([c, a]) => { const P = window.DinoPhys, D = window.DINO_DATA, g = P.K.g;
      const mk = (o) => Object.assign({ F: 100 * 907.18474 * g, mode: 'comic', body: P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), surface: D.surfaces.find((x) => x.id === 'concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true }, o || {});
      try { return new Function('P', 'D', 'g', 'mk', 'a', c)(P, D, g, mk, a); } catch (e) { return { error: String(e) }; } }, [code, arg]);
    const r4 = [];
    const check = (label, cond, got) => { if (!cond) r4.push(label + ': ' + String(got).slice(0, 500)); };
    const COL = { duoOpen: true, duoAction: 'collide' };
    // Collide's charge (decisions 1, 2, 5): a charger who takes his own recoil doesn't slow; the one hit is carried along
    // at his speed (splat) or sent off at twice it (bounce), and his source supplies the momentum; the hit's freed energy
    // is taken back by default. With the power off, pull request 3's physics (knocked back at 8.97 m/s).
    {
      const e = await eng('const r = P.collide(mk({ body: P.makeBody(Object.assign({ build: "ollie" }, P.DEFAULT_BODIES.ollie)) }), mk(), { source: "sprint" }); return { v: r.carry && r.carry.v, sup: r.carry && r.carry.supplied, slide: r.after && r.after.splat.slide, Q: r.h && r.h.Q };');
      await load(COL); await pick('allout');
      const v = await duoTxt('.verdict'), h = await duoTxt('.happens'), t = await duoTxt('.tiles');
      const m = v.match(/^Ollie hits Rex at ([\d.]+) m\/s and doesn’t slow: he takes his own recoil, so the push back from the hit goes to his source\. Rex is carried along at ([\d.]+) m\/s\. When Ollie stops, at the end of the squash, Rex slides ([\d.]+) m before he stops\.$/);
      const ms = h.match(/comes from Ollie’s source: (?:about )?([\d,]+) kg·m\/s in all\. That is canon’s case “their own recoil”/);
      check('Collide, the default sprint carries Rex along', m && near(num(m[2]), e.v) && near(num(m[3]), e.slide) && Math.abs(num(m[2]) - 18.1) < 0.05 && Math.abs(num(m[3]) - 27.3) < 0.05 && ms && near(num(ms[1]), e.sup, 0.02) && Math.abs(num(ms[1]) - 55000) < 600
        && /Energy freed at the hit ?499 kJ ?120 g TNT · taken back by default/.test(t) && !/Momentum is never lost/.test(h) && /How far Ollie carries him is up to Ollie/.test(h), v + ' | ' + (ms ? ms[0] : h.slice(0, 200)));
      await load(Object.assign({ colBounce: 'bounce' }, COL)); await pick('allout');
      const vb = await duoTxt('.verdict'), tb = await duoTxt('.tiles');
      check('Collide, the default bounce sends Rex off at twice the speed', /Rex bounces off him and is sent off at 36\.3 m\/s, twice his speed, and slides 102 m\./.test(vb) && /Ollie’s source supplies ?109,000 kg·m\/s/.test(tb), vb);
      await load(Object.assign({ ownRecoil: false }, COL)); await pick('allout');
      const vo = await duoTxt('.verdict'), ho = await duoTxt('.happens');
      check('Collide with They take their own recoil off (pull request 3\'s physics)', /^Ollie hits Rex at 18\.1 m\/s\. Rex is knocked back at 8\.97 m\/s and the two slide 6\.97 m before they stop\.$/.test(vo) && /Momentum is never lost/.test(ho) && !/doesn’t slow/.test(vo + ho) && m, vo);
    }
    // the paradox (decision 3), explained first, and no page error: Rex bolted (on ground Unbreakable footing holds), and
    // Ollie landing on him from above at a 10^9 kg dial (the jump and the stomp-launch)
    for (const [lab, st, held] of [['Rex bolted', { anchor: 'bolted' }, /Rex is bolted to ground that Unbreakable footing never lets break, and whatever push the ground can’t bear, their power supplies, so nothing limits his hold\./],
      ['the jump at a 10⁹ kg dial', { colSrc: 'jump', logKg: 9 }, /Ollie comes down on him from above, and the ground under Rex’s feet holds him up\. Unbreakable footing never lets it give/],
      ['the stomp-launch at a 10⁹ kg dial', { colSrc: 'stomp', logKg: 9 }, /Ollie comes down on him from above/]]) {
      const before = errs.length;
      await load(Object.assign({}, COL, st)); await pick('allout');
      const v = await duoTxt('.verdict'), all = await duoAll();
      // first: the verdict comes before every other result element (chips, tiles, the effort box, what happens)
      const first = await page.evaluate(() => { const b = document.getElementById('duo-bay'), vd = b.querySelector('.verdict'); if (!vd) return false; return Array.from(b.querySelectorAll('.status-row, .tiles, .effort-read, .happens, .callout, details.math')).every((n) => vd.compareDocumentPosition(n) & Node.DOCUMENT_POSITION_FOLLOWING); });
      check('Collide, the paradox explained first (' + lab + ')', first && /^No physical answer here, and the page isn’t broken: this is the canon’s ruling\. Ollie takes his own recoil, so nothing can slow him: the push back from his hit goes to his source\./.test(v) && held.test(v) && /One of them has to give, and neither can, so physics has no answer\.$/.test(v)
        && !/Bolted: Earth takes the blow|Calculation failed|The ground holds the blow/.test(all) && errs.length === before, v + ' | first ' + first + ' | ' + errs.slice(before).join(' '));
    }
    // Rex bolted on real rock (Unbreakable footing off): not held without limit, so the rock tears and he is carried
    await load(Object.assign({ anchor: 'bolted', unbreakable: false }, COL)); await pick('allout');
    { const v = await duoTxt('.verdict'); check('Collide, bolted on real rock: carried with a plug of rock', /Rex is bolted, but on real rock: the rock around his bolts tears out \(at about 697 kN\), and he is carried along at 18\.1 m\/s with a plug of rock\./.test(v), v); }
    // a set speed of 0.1% of light speed (300 km/s): carried at that speed, 135 TJ taken back; the windows preset means it
    {
      const colGB = Math.log10(0.001 / Math.sqrt(1 - 1e-6));
      await load(Object.assign({ colSrc: 'set', colGB }, COL)); await pick('allout');
      const v = await duoTxt('.verdict'), t = await duoTxt('.tiles'), s = await duoTxt('.status-row');
      await pick('windows');
      const eb = await duoTxt('.effort-read'), sw = await duoTxt('.status-row'), tw = await duoTxt('.tiles');
      check('Collide at 0.1% of light speed: carried along, the energy taken back, real for the windows preset', /Rex is carried along at 300 km\/s\./.test(v) && /Ollie’s source supplies ?899 million kg·m\/s/.test(t) && /135 TJ ?32 kt TNT · taken back by default/.test(t) && /The hit’s energy is taken back: their power/.test(s)
        && /They mean it: the energy the hit frees, which is taken back by default, is real for this preset\./.test(eb) && /He means it: the hit’s energy is real/.test(sw) && /135 TJ ?32 kt TNT · real: he means it/.test(tw), v + ' | ' + eb.slice(0, 300));
    }
    // the two-player effort search: the slide harm with the one hit carried at the charger's speed (least disruptive
    // 4,260 kg-force, against pull request 3's 8,430); at a 10^9 kg jump the paradox leaves only Ollie's take-off
    await load(COL);
    { const b = await duoTxt('.effort-read'); check('Collide, least disruptive: Rex carried past the nearest people', /Courtesy ceiling: 4\.7% \(lifting 4\.26 t\)\. Past that, Rex is carried along at [\d.]+ m\/s and ends up [\d.]+ m away, past the nearest people 5 m away\./.test(b), b); }
    await load(Object.assign({ colSrc: 'jump', logKg: 9 }, COL));
    { const b = await duoTxt('.effort-read'); check('Collide, a 10⁹ kg jump: only the take-off shakes the ground', /Courtesy ceiling: 0\.12% \(lifting 1,210 t\)\. Past that, the charger’s take-off, pushed into the unbreakable ground, shakes it/.test(b), b); }
    // the thought experiment sets the charger's own recoil aside (decision 4)
    await load(Object.assign({ colImm: true }, COL)); await pick('allout');
    { const v = await duoTxt('.verdict'); check('Collide, the truly immovable thought experiment', /Ollie stops dead\. All 120 g TNT of his energy is freed at the hit\. \(The thought experiment sets Ollie’s own recoil aside too: it is about the test, not their powers\.\)/.test(v), v); }
    // Collide's steady push (decision 7): the pusher's own footing doesn't cap his push; the force between their hands is
    // the push that drives Rex back. Off: pull request 3's dead heat.
    {
      // (all-out: with the power on the least disruptive effort now stops where Rex's slide reaches the people, 5.47 t)
      await load(Object.assign({ colMode: 'push' }, COL)); await pick('allout');
      const v = await duoTxt('.verdict'), t = await duoTxt('.tiles'), h = await duoTxt('.happens');
      await load(Object.assign({ colMode: 'push', ownRecoil: false }, COL));
      const vo = await duoTxt('.verdict'), ho = await duoTxt('.happens');
      check('Collide, the steady push on and off', /^Ollie wins\. He pushes with 890 kN and Rex can hold only 17\.7 kN, so Rex is driven back\. Ollie takes his own recoil, so his push back goes to his source and his own footing \(17\.7 kN\) doesn’t cap his push\. Over the shove’s stroke \(2\.44 m\) that sends Rex off at 37\.6 m\/s, and he slides 109 m before he stops\.$/.test(v)
        && /Force between them ?890 kN ?the same both ways between their hands; Rex’s feet pass 17\.7 kN of it to the ground and the rest drives him back; Ollie’s side goes to his source/.test(t) && !/both forces end up in the ground/.test(h)
        && /^Dead heat\. Ollie pushes with 17\.7 kN and Rex holds 17\.7 kN\. Neither moves\./.test(vo) && /both forces end up in the ground/.test(ho), v + ' | ' + t.slice(-200) + ' | off ' + vo);
      // unlimited into a bolted Rex: the one-sided paradox (not 'one unbreakable system'); on real rock only Rex's rock tears
      await load(Object.assign({ colMode: 'push', inf: true, anchor: 'bolted' }, COL)); await pick('allout');
      const vp = await duoTxt('.verdict');
      await load(Object.assign({ colMode: 'push', inf: true, anchor: 'bolted', unbreakable: false }, COL)); await pick('allout');
      const vr = await duoTxt('.verdict'), all = await duoAll();
      check('Collide, an unlimited steady push into a bolted Rex', /^Nothing moves: Rex is bolted to ground that their power holds, so nothing can move him, and Ollie’s push back goes to the endless ocean/.test(vp) && !/one unbreakable system|from bolted feet/.test(vp)
        && /the rock gives around Rex’s bolts\. The bolts are comic, the rock isn’t: it tears out, and Rex leaves at just under light speed with a plug of rock, with unlimited energy\. Ollie’s push back goes to the endless ocean/.test(vr) && !/both sets of bolts|NaN/.test(all), vp + ' | ' + vr);
    }
    // the shoving match (decision 8): both shoved apart (26.6 m/s each, about 57 m), the item rewritten, and equal bodies
    // always shoved apart; the least disruptive effort now stops at both sliding past the people; off: the dead heat
    {
      const e = await eng('const r = P.pushMatch(mk(), mk({ body: P.makeBody(Object.assign({ build: "ollie" }, P.DEFAULT_BODIES.ollie)) })); return { o: r.outcome, v: r.vA, s: r.slideA };');
      const W = { duoOpen: true, duoAction: 'wrestle' };
      await load(W);
      const b = await duoTxt('.effort-read');
      await pick('allout');
      const v = await duoTxt('.verdict'), h = await duoTxt('.happens');
      await load(Object.assign({ ownRecoil: false }, W));
      const vo = await duoTxt('.verdict'), ho = await duoTxt('.happens');
      const m = v.match(/They fly apart at ([\d.]+) m\/s each and slide about ([\d.]+) m\./);
      check('the shoving match, both shoved apart (on) and the dead heat (off)', e.o === 'bothShoved' && /^Pushing straight across, both are shoved apart\. They take their own recoil, so neither push costs the pusher his grip: each pushes with the effort he uses \(890 kN each\), about 50 times what holds the other \(17\.7 kN each\)\./.test(v) && m && near(num(m[1]), e.v) && Math.abs(num(m[1]) - 26.6) < 0.05 && near(num(m[2]), e.s, 0.005)
        && /a shoving match is decided at the feet of the one being pushed/.test(h) && !/To push forward, each one has to grip the ground/.test(h) && /Equal bodies on equal ground are always shoved apart with the power on: even the least effort the lab lets them use, enough to stand and walk \(as hard as lifting 2\.57 t each\), is more than either one’s grip on any ground here/.test(h)
        && /Courtesy ceiling: 8% \(lifting 7\.3 t\)\. Past that, both are shoved apart and end up past the nearest people 5 m away/.test(b)
        && /^Pushing straight across: dead heat\. Both are far stronger than their footing/.test(vo) && /A shoving match is decided at the feet\. To push forward, each one has to grip the ground/.test(ho), v + ' | ' + b.slice(0, 200) + ' | off ' + vo.slice(0, 100));
      // a bolted wrestler's push is real: he shoves the other off ('shovedOff')
      await load(Object.assign({ anchor: 'bolted' }, W)); await pick('allout');
      const vb = await duoTxt('.verdict'), tb = await duoTxt('.tiles');
      check('the shoving match, Rex bolted shoves Ollie off', /^Rex is bolted, so he can’t walk Ollie out, but his push is real \(a contest lets force move\): he shoves Ollie off at 37\.6 m\/s, and Ollie slides 109 m\. Ollie’s push \(890 kN\) can’t move Rex’s bolts\./.test(vb) && /Winner ?Rex ?Rex shoves Ollie off/.test(tb), vb);
      // a walk-out where only one push beats the other's grip: on gravel, Ollie at a what-if strength of 10^3.34 kg (about
      // 2,190 kg, on the slider's 0.01 steps); Rex's own feet set the pace (the Pull tab's rule), as the engine gives it
      const ew = await eng('const sf = D.surfaces.find((x) => x.id === "gravel"); const r = P.pushMatch(mk({ surface: sf }), mk({ surface: sf, F: Math.pow(10, 3.34) * g, body: P.makeBody(Object.assign({ build: "ollie" }, P.DEFAULT_BODIES.ollie)) })); return { o: r.outcome, t: r.t, a: r.accel };');
      await load(Object.assign({ surface: 'gravel' }, W)); await ollieKg(3.34); await pick('allout');
      const vw = await duoTxt('.verdict'), hw = await duoTxt('.happens'), mw = vw.match(/Rex walks Ollie out of the ring in ([\d.]+) s\./);
      check('the shoving match, a walk-out paced by the winner\'s feet', ew.o === 'walkOut' && mw && near(num(mw[1]), ew.t, 0.01) && /Rex’s own feet set the pace: they can speed his body up only so fast against Ollie’s push, so he holds back, pushing Ollie only as hard as keeps him at that pace \([\d.]+ kN\)\./.test(vw) && /Walking him out is paced by Rex’s own feet, as on the Pull tab/.test(hw), vw + ' (engine ' + ew.o + ' ' + ew.t + ' s)');
    }
    // Both at once (decision 9): each shoved by the other's shove; off: the stronger shove sets the push
    {
      const B = { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'both' };
      await load(B); await pick('allout');
      const v = await duoTxt('.verdict'), h = await duoTxt('.happens');
      await load(Object.assign({ ownRecoil: false }, B)); await pick('allout');
      const ho = await duoTxt('.happens');
      check('Both at once, on and off', /^They shove each other apart: each is shoved by the other’s shove, and each one’s push back goes to the endless ocean\. Ollie flies back at 21\.1 m\/s and slides [\d.]+ m; Rex flies back at 21\.1 m\/s and slides [\d.]+ m\./.test(v) && !/the stronger shove sets the push/.test(h) && /each is shoved by the other’s shove, worked out as on the Shove tab/.test(h)
        && /Both shove at once: the stronger shove sets the push/.test(ho), v + ' | ' + h.slice(0, 200));
    }
    // the Lift tab (decision 11): with the power on the lift models a partner who doesn't resist
    await load({ duoOpen: true, duoAction: 'wrestle', wrestleMove: 'lift' });
    { const h = await duoTxt('.happens'); await load({ duoOpen: true, duoAction: 'wrestle', wrestleMove: 'lift', ownRecoil: false }); const ho = await duoTxt('.happens');
      check('Lift, the partner who doesn\'t resist', /The lift models a partner who lets himself be lifted/.test(h) && !/that push stays between the two of them/.test(h) && /Ollie can’t make himself heavier by pushing down on Rex: that push stays between the two of them/.test(ho), h.slice(0, 200)); }
    // arm wrestling as built (reading B, decision 10): each pad holds the other's press; with the winner's power on, the
    // loser's pad can still break the table in a pin (review round 1); standing, his own footing doesn't cap his press, his
    // feet hold against the other's, and in a pin the loser's feet carry the force at his elbow (review round 2)
    {
      const A = { duoOpen: true, duoAction: 'arm' };
      await load(A);
      const h = await duoTxt('.happens');
      check('arm wrestling, each pad holds the other\'s press', /Each one’s own push back goes to his source \(They take their own recoil\), but the other’s press on him is real \(a contest lets force move\)\. Under the rules each grips the table’s peg with his free hand and rests his elbow on a pad bolted to the table, so each pad holds the other’s press/.test(h), h.slice(0, 300));
      // Ollie at 1 t, Things keep their form off: Rex's pad holds only Ollie's press, but Ollie's pad carries what turns his
      // forearm against Rex's hand (24.2 kN), past the table's 15.1 kN, so the pin breaks the table and they stand, as with
      // the power off (by Rex's pad there); review round 1 of pull request 4
      await load(Object.assign({ keepForm: false }, A)); await ollieKg(3); await pick('allout');
      const vp = await duoTxt('.verdict'), hp = await duoTxt('.happens'), mp = await duoTxt('details.math .eq');
      await load(Object.assign({ keepForm: false, ownRecoil: false }, A)); await ollieKg(3); await pick('allout');
      const vpo = await duoTxt('.verdict');
      const ep = await eng('const r = P.armWrestle(mk({ keepForm: false }), mk({ keepForm: false, F: 1000 * g, body: P.makeBody(Object.assign({ build: "ollie" }, P.DEFAULT_BODIES.ollie)) })); return { by: r.tableBreaksBy, lp: r.loserPadLoad, lat: r.tableLat, v: r.pin && r.pin.v };');
      check('arm wrestling, the loser\'s pad breaks the table in a pin with the power on', ep.by === 'pin' && ep.lp > ep.lat && /^The table can’t take the pin\. Rex’s arm \(222 kN\) beats Ollie’s \(2\.45 kN\), and forcing it down loads Ollie’s elbow pad with about 24\.2 kN \(what turns his forearm against Rex’s hand\), more than the 15\.1 kN the table carries\. It tears out\. Standing up, /.test(vp) && /he pins Ollie in 2\d(?:\.\d)? ms, dragging him along as he goes\. The back of Ollie’s hand swings down at 83 m\/s\./.test(vp)
        && /Forcing an arm down: the winner’s elbow pad holds the loser’s press, 2\.45 kN here\..*The loser’s pad still carries what turns his own forearm against the winner’s hand, about 24\.2 kN: that is a force on the loser, not anyone’s push back, so no power takes it\. That is more than the table carries, so the pin breaks it\./.test(hp) && !/never breaks the table|never tears the table/.test(hp + vp)
        && /= 24\.2 kN\./.test(mp) && /^The table can’t take the pin\. Rex’s arm \(222 kN\) beats Ollie’s \(2\.45 kN\), and forcing it down loads Rex’s elbow pad/.test(vpo), vp + ' | ' + hp.slice(0, 300) + ' | off ' + vpo.slice(0, 160));
      // standing (the table broken by both presses), equal: a dead heat at 222 kN, both pushed off their feet
      await load(Object.assign({ keepForm: false }, A)); await pick('allout');
      const vs = await duoTxt('.verdict'), ss = await duoTxt('.status-row');
      check('arm wrestling standing, both pushed off their feet', /Arm-wrestling standing up, it’s a dead heat at 222 kN: their arms are locked\. But each one’s press beats the other’s footing \(17\.7 kN\), so both are pushed off their feet, opposite ways, turning about their clasped hands\. The lab doesn’t follow that motion\./.test(vs) && /Rex’s feet slide/.test(ss) && /Ollie’s feet slide/.test(ss), vs + ' | ' + ss);
      // standing, Ollie at 200 short tons: his press isn't capped by his footing, so he pins Rex, and his own feet slide
      await load(Object.assign({ keepForm: false }, A)); await ollieKg(Math.log10(200 * 907.18474)); await pick('allout');
      const vw = await duoTxt('.verdict');
      check('arm wrestling standing, the stronger press pins', /Standing up, Ollie’s push back goes to his source, so his footing doesn’t cap his press: he presses with his full 44\d kN\. That beats Rex’s arm \(222 kN\): he pins Rex in [\d.]+ ms, dragging him along as he goes\. Rex’s press is more than Ollie’s feet hold \(17\.7 kN\), so Ollie’s feet slide too\./.test(vw), vw);
    }
    // the two Never knocked back switches (decisions 12 and 15): in Their powers next to the Bolted pair, on by default,
    // each with its note; an old save loads with both on; the summary line lists them
    {
      const sw = async (st) => { await page.evaluate((x) => { if (x) localStorage.setItem('rex-lab-v1', JSON.stringify(x)); else localStorage.clear(); }, st); await page.reload(); await page.waitForTimeout(800);
        return page.evaluate(() => { const r = document.getElementById('nkb-rex'), o = document.getElementById('nkb-ollie'), sv = JSON.parse(localStorage.getItem('rex-lab-v1') || '{}'); return r && o ? [r.checked, o.checked, sv.noKnockback, sv.oNoKnockback, document.getElementById('powers-sum').textContent].join('|') : 'missing'; }); };
      const fresh = await sw(null), old = await sw({ action: 'throw', saveV: 3 }), older = await sw({ action: 'throw' }), rexOff = await sw({ action: 'throw', noKnockback: false }), ollieOff = await sw({ action: 'throw', oNoKnockback: false });
      const place = await page.evaluate(() => { const r = document.getElementById('nkb-rex'), o = document.getElementById('nkb-ollie'), b = document.getElementById('bolt-ollie'), note = r && document.getElementById(r.getAttribute('aria-describedby') || 'x');
        return r && o ? { names: [r.getAttribute('aria-label'), o.getAttribute('aria-label')], inPowers: document.getElementById('powers').contains(r) && document.getElementById('powers').contains(o), afterBolted: !!(b.compareDocumentPosition(r) & Node.DOCUMENT_POSITION_FOLLOWING), sameNote: o.getAttribute('aria-describedby') === r.getAttribute('aria-describedby'), note: note ? note.textContent.replace(/\s+/g, ' ') : '' } : null; });
      check('Never knocked back: on by default, an old save loads with both on, each switch named, next to Bolted, with its note', fresh === 'true|true|true|true|Comic book · default powers on' && old === 'true|true|true|true|Comic book · default powers on' && older === 'true|true|true|true|Comic book · default powers on'
        && rexOff === 'false|true|false|true|Comic book · unbreakable footing · own recoil · things keep their form · safe passenger · drag-free throws · never knocked back: Ollie' && ollieOff === 'true|false|true|false|Comic book · unbreakable footing · own recoil · things keep their form · safe passenger · drag-free throws · never knocked back: Rex'
        && place && place.names.join() === 'Never knocked back: Rex,Never knocked back: Ollie' && place.inPowers && place.afterBolted && place.sameNote
        && /In their contests \(arm wrestling, every Wrestle move, Collide, the partner toss\) they let force move: the other’s push on him is real, and only his own push back is taken \(They take their own recoil\)\. A catch is his own push too, so that power takes it back\. So this switch acts in one case only: a throw that reaches the catcher as a fireball or plasma in the game of catch \(Things keep their form off, some of the air’s drag left\), which hits him rather than being caught\./.test(place.note)
        // (review round 1 of pull request 4: only the motion freed as it stops at him is taken back; the air's heat stays real)
        && /the motion it frees as it stops at him is taken back unless he means it \(canon; the heat it made in the air on the way stays real\)/.test(place.note) && !/the energy it frees where he stands is taken back/.test(place.note),
        JSON.stringify({ fresh, old, older, rexOff, ollieOff, place }));
      // turning either off changes no result on any tab (each read at its default, least disruptive effort)
      const changed = [];
      for (const tab of SOLO.concat(DUO)) {
        const res = [];
        for (const k of [{}, { noKnockback: false }, { oNoKnockback: false }]) {
          await load(Object.assign(DUO.includes(tab) ? { duoOpen: true, duoAction: tab } : { action: tab }, k));
          res.push(JSON.stringify(await readResult(page, DUO.includes(tab) ? 'duo-bay' : 'bay')));
        }
        if (res[1] !== res[0] || res[2] !== res[0]) changed.push(tab + (res[1] !== res[0] ? ' (Rex off)' : '') + (res[2] !== res[0] ? ' (Ollie off)' : ''));
      }
      check('Never knocked back: turning either switch off changes no result on any tab at its defaults', !changed.length && fresh !== 'missing', changed.join(', '));
      // ... except the fireball case (Things keep their form off, some of the air's drag left, a 10^14 kg dial, a
      // fastball, all-out): on, Ollie isn't moved and its momentum goes to the endless ocean, and of the energy freed
      // where he stands only the air's heat is real; off, it carries him off; Rex's switch shows on the return leg
      const FB = { duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', logKg: 14, keepForm: false, airAbsorb: 0.5 };
      const ef = await eng('const o = D.objects.find((x) => x.id === "baseball"), F = 1e14 * g; const L = P.catchLeg(mk({ F, keepForm: false, airAbsorb: 0.5 }), mk({ F, keepForm: false, airAbsorb: 0.5, body: P.makeBody(Object.assign({ build: "ollie" }, P.DEFAULT_BODIES.ollie)) }), o, 10, "hard"); const f = L.fireball || {}; return { result: L.result, J: f.knockAbsorbed && f.knockAbsorbed.J, Egap: f.Egap, Earr: f.Earr };');
      await load(FB); await pick('allout');
      const von = await duoTxt('.verdict'), hon = await duoAll();
      await load(Object.assign({ oNoKnockback: false }, FB)); await pick('allout');
      const voff = await duoTxt('.verdict');
      await load(Object.assign({ noKnockback: false }, FB)); await pick('allout');
      const vrex = await duoTxt('.verdict');
      const mJ = von.match(/Never knocked back: it doesn’t move Ollie\. Its momentum \(([\d.,]+ million) kg·m\/s\) goes to the endless ocean, and stopping it frees 3\.63 TJ where he stands\./);
      check('Never knocked back: the fireball case shows each switch', mJ && ef.J > 1e6 && near(ef.J, 1.03e6, 0.01) && /422 GJ of it is heat already made in the air on the way: that is real\. The rest, 3\.21 TJ, is its motion, freed as it stops at him: canon takes a hit’s freed energy back by default/.test(hon) && near(ef.Egap, 4.22e11, 0.005) && near(ef.Earr, 3.21e12, 0.005)
        && /That is Never knocked back’s case, and Ollie’s switch is on \(Their powers\): he isn’t moved, and its momentum goes to the endless ocean\./.test(hon) && !/carries Ollie off/.test(von)
        // (review round 2 of pull request 4: the return leg reaches Rex the same way, but his switch is set the other way)
        && /It carries Ollie off at 343 m\/s\. He’s fine\./.test(voff) && /Thrown back, it reaches Rex as plasma too, but Rex’s Never knocked back is on \(Their powers\)\. Never knocked back: it doesn’t move Rex\./.test(voff)
        && /Never knocked back: it doesn’t move Ollie\./.test(vrex) && /Thrown back, it reaches Rex as plasma too, but Rex’s Never knocked back is off \(Their powers\)\. It carries Rex off at 343 m\/s\./.test(vrex), von + ' | off ' + voff.slice(-200) + ' | Rex off ' + vrex.slice(-200));
      // the cards: Their powers, Unstoppable force vs immovable object, Two-player effort, Game of catch
      const cards = await page.evaluate(() => document.body.textContent.replace(/\s+/g, ' '));
      check('the cards for pull request 4', /Never knocked back \(one switch each, both on by default; canon, the rulings of 14 Oct 2026\) means a hit from outside a contest doesn’t move him: its momentum goes to the endless ocean, even if he is bolted, and the motion it frees as it stops at him is taken back unless he means it \(the heat it made in the air on the way stays real\); in their contests \(arm wrestling, every Wrestle move, Collide, the partner toss\)/.test(cards)
        // (review round 1 of pull request 4: six powers on by default; the Newton card names the contests)
        && /so six powers are on unless the reader turns them off: Air resistance absorbed, Things keep their form, Unbreakable footing, They take their own recoil, Safe passenger and Never knocked back \(one switch each\)\./.test(cards) && !/five powers are on|every two-player test|the energy it frees where he stands is taken back/.test(cards)
        && /Where a push or hit has no physical answer \(canon: one held without limit by their powers, against a charger who can’t slow or an unlimited push\), the lab can’t judge its harm, and the page says so rather than calling it harmless\./.test(cards)
        && /A charger who takes his own recoil \(the default\) doesn’t slow: canon sends the push back from his own hit to his source/.test(cards) && /one of them has to give and neither can: canon rules that the collision has no physical answer/.test(cards)
        && /both shoved apart in the shoving match, or carried along at the charger’s speed in Collide/.test(cards) && /count only for a blast preset \(rattle, windows, houses, a block\), which the lab reads as meaning it/.test(cards)
        && /Never knocked back does \(one switch each, on by default\): he isn’t moved, and its momentum goes to the endless ocean, bolted too/.test(cards) && !/Never knocked back, (?:not|which isn’t) in the lab yet/.test(cards), '(card text)');
    }
    // ---- review round 1 of pull request 4 (research/reviews/canon-4-round1.json): each check fails on 238f570's page
    {
      // physics-carry-force-omits-hold-and-cap: the hit pushes with the squash's own force plus Rex's hold for the whole
      // squash, so force x time = what Ollie's source supplies; no cap, no 'the push rises until it gives'
      await load(COL);
      const t0 = await duoTxt('.tiles'), h0 = await duoTxt('.happens'), b0 = await duoTxt('svg text');
      const e0 = await eng('const r = P.collide(mk({ F: 4260 * g, body: P.makeBody(Object.assign({ build: "ollie" }, P.DEFAULT_BODIES.ollie)) }), mk({ F: 4260 * g }), { source: "sprint" }); return { F: r.carry.F, T: r.carry.T, sup: r.carry.supplied, sq: r.contact.soft.F };');
      await load(Object.assign({ colSrc: 'set', colGB: Math.log10(1 / 299792458) }, COL)); await pick('allout');
      const h1 = await duoTxt('.happens'), t1 = await duoTxt('.tiles');
      check('review round 1: the carried hit\'s force includes the hold, uncapped', Math.abs(e0.F * e0.T / e0.sup - 1) < 1e-9 && /Force of the hit ?273 kN ?over 86 ms: the plush squash plus his footing \(estimates\)/.test(t0) && /pushes with about 273 kN: the squash’s own 255 kN plus the 17\.7 kN with which his footing holds Rex back, since Ollie can’t slow\. That force over that time is what Ollie’s source supplies\./.test(h0)
        && /The hit: squash plus his hold/.test(b0) && /Ollie’s source supplies ?14,100 kg·m\/s/.test(t1) && /what his footing hands the ground during the hit \(11,100 kg·m\/s\)/.test(h1) && /Force of the hit ?22\.4 kN/.test(t1) && !/the push rises until it gives|so here they are rough/.test(h0 + h1), t0.slice(0, 300) + ' | ' + t1.slice(-200));
      // physics-from-above-bolted-real-rock: landed on from above, a bolted Rex on real ground is held by the ground's
      // bearing (driven in, bolts and all), not torn loose with a plug of rock
      await load(Object.assign({ colSrc: 'jump', anchor: 'bolted', unbreakable: false }, COL)); await pick('allout');
      const sj = await duoTxt('.status-row'), hj = await duoTxt('.happens'), bj = await duoTxt('svg text'), tj = await duoTxt('.tiles');
      check('review round 1: from above, a bolted Rex on real ground is held by the ground\'s bearing', /Rex driven into the ground/.test(sj) && !/torn loose with a plug of rock|tears out/.test(sj + hj) && /the ground under his feet, which bears 1\.52 MN on the concrete slab \(from above, his bolts go down into it with him/.test(hj) && /What holds Rex: the ground/.test(bj) && /Ollie’s source supplies ?107,000 kg·m\/s/.test(tj), sj + ' | ' + hj.slice(0, 400));
      // duo-paradox-claimed-harmless and copy-paradox-coexist: a hit with no physical answer is never called harmless, and
      // the canon case isn't 'two settings that can't both hold'
      await load(Object.assign({ anchor: 'bolted' }, COL));
      const ep0 = await duoTxt('.effort-read'), hp0 = await duoTxt('.happens'), gp0 = await duoTxt('.case-grid td, .case-grid th, table td');
      await pick('windows');
      const ep1 = await duoTxt('.effort-read');
      check('review round 1: the paradox is never called harmless, and the canon case isn\'t two settings that can\'t both hold', /^All-out\. Nothing the lab can judge in this test does harm here/.test(ep0) && /Courtesy ceiling: none that the lab can judge\. The hit has no physical answer here \(the canon’s ruling\), so the lab can’t judge its harm; it judges only the charge \(its speed against sound\) and the charger’s take-off\./.test(ep0)
        && /The hit has no physical answer here \(the canon’s ruling\), so the lab can’t judge its harm; it judges only the charge \(its speed against sound\) and the charger’s take-off\. Even all-out, those don’t shatter windows 15 m away/.test(ep1) && !/Nothing in this test does harm|Even all-out, this test doesn’t|no cap needed/.test(ep0 + ep1)
        && /so physics has no answer here \(the canon’s ruling\)\./.test(hp0) && !/can’t both hold|can’t exist in the same universe/.test(hp0 + gp0), ep0.slice(0, 300) + ' | ' + ep1.slice(0, 300));
      // duo-steady-push-no-harm and copy-push-harm: the one driven back is followed and judged; unlimited, he flies off
      await load(Object.assign({ colMode: 'push' }, COL));
      const sp0 = await duoTxt('.effort-read'), st0 = await duoTxt('.tiles');
      await load(Object.assign({ colMode: 'push', inf: true }, COL)); await pick('allout');
      const sp1 = await duoTxt('.effort-read');
      // (and the presets' reasons with the power on: the one pushed hands the ground a friction drag; only he slides)
      await load(Object.assign({ colMode: 'push' }, COL)); await pick('plaster');
      const sp2 = await duoTxt('.effort-read');
      await pick('ground');
      const sp3 = await duoTxt('.effort-read');
      check('review round 1: the steady push follows and judges the one driven back', /Courtesy ceiling: 4\.1% \(lifting 3\.68 t\)\. Past that, Rex is driven back 2\.44 m and slides on, ending up 5\.\d+ m from where he stood, past the nearest people 5 m away\./.test(sp0) && /Rex is driven off at ?5\.\d+ m\/s ?over the shove’s stroke; slides/.test(st0)
        && /At this effort Rex is driven back faster than sound/.test(sp1) && !/Nothing in this test does harm|slow load, not a blow|no cap needed/.test(sp0 + sp1 + sp2)
        && /In the steady push the pusher’s push back goes to the endless ocean \(They take their own recoil\), and the one pushed hands the ground only a steady push through his feet or bolts, or a friction drag while he is driven back and slides, not a blow/.test(sp2) && /Standing, the one pushed slides long before the ground under him could break/.test(sp3) && !/their feet slide/.test(sp3), sp0.slice(0, 300) + ' | ' + sp1.slice(-200) + ' | ' + sp2.slice(0, 200) + ' | ' + sp3.slice(0, 200));
      // physics-steady-push-bolted-real-rock: past the rock's tear load Rex is torn loose and driven back, not held
      await load(Object.assign({ colMode: 'push', anchor: 'bolted', unbreakable: false }, COL)); await pick('allout');
      const vr1 = await duoTxt('.verdict'), sr1 = await duoTxt('.status-row');
      await load(Object.assign({ colMode: 'push', anchor: 'bolted' }, COL)); await pick('ground');
      const gr1 = await duoTxt('.effort-read');
      check('review round 1: a steady push past the rock\'s tear load tears a bolted Rex loose', /^Rex is bolted, but on real rock: Ollie’s push \(890 kN\) is more than the rock around his bolts takes \(about 697 kN\), so it tears out, and Rex is driven back with a plug of rock, held only by his feet \(17\.7 kN\)\./.test(vr1) && /Over the shove’s stroke \(2\.44 m\) that sends Rex off at 37\.6 m\/s/.test(vr1) && /Rex’s rock tears loose/.test(sr1) && !/his bolts hold|Rex holds unlimited/.test(vr1 + sr1)
        && /lifting 13\.5 t\)\. The least effort that breaks the rock around Rex’s bolts\./.test(gr1), vr1 + ' | ' + sr1 + ' | ' + gr1.slice(0, 200));
      // copy-push-bars-390: the steady push's bar labels fit at 390 px
      await page.setViewportSize({ width: 390, height: 844 });
      await load(Object.assign({ colMode: 'push' }, COL));
      const clip = await page.evaluate(() => Array.from(document.querySelectorAll('#duo-bay svg')).flatMap((s) => { const sr = s.getBoundingClientRect(); return Array.from(s.querySelectorAll('text')).filter((t) => t.getBoundingClientRect().right > sr.right + 0.5 || t.getBoundingClientRect().left < sr.left - 0.5).map((t) => t.textContent); }));
      await page.setViewportSize({ width: 1280, height: 900 });
      check('review round 1: the steady push\'s bar labels fit at 390 px', !clip.length, clip.join(' | '));
      // copy-shovingmatch-paradox-nothing-moves and duo-one-sided-paradox-nothing-moves: at unlimited strength only the push
      // into bolts held without limit has no answer; the bolted one's own push shoves the other off
      const W = { duoOpen: true, duoAction: 'wrestle' };
      await load(Object.assign({ inf: true, oAnchor: 'bolted' }, W)); await pick('allout');
      const vw1 = await duoTxt('.verdict'), ew1 = await duoTxt('.effort-read');
      await load(Object.assign({ wrestleMove: 'shove', wrestleWho: 'both', inf: true, anchor: 'bolted' }, W)); await pick('allout');
      const vb1 = await duoTxt('.verdict'), eb1 = await duoTxt('.effort-read'), tb1 = await duoTxt('.tiles');
      check('review round 1: one bolted at unlimited strength, the other\'s push has no answer but his own is real', /^Ollie is bolted to ground that their power holds, so Rex’s unlimited push into his bolts meets a hold without limit: that push has no physical answer \(the canon’s ruling\), and it moves nobody\. Ollie’s own push on Rex is real \(a contest lets force move\), and Rex holds only 17\.7 kN, so Ollie shoves him off at just under light speed/.test(vw1) && /At this effort Rex is shoved off faster than sound/.test(ew1)
        && /^Rex is bolted to ground that their power holds, so Ollie’s unlimited shove into his bolts meets a hold without limit: that shove has no physical answer \(the canon’s ruling\), and it moves nobody\. Rex’s own shove on Ollie is real \(a contest lets force move\): Ollie leaves at just under light speed\./.test(vb1) && /At this effort someone flies off faster than sound/.test(eb1) && /Rex moves ?not at all ?bolted/.test(tb1) && !/Nothing moves/.test(vw1 + vb1), vw1 + ' | ' + vb1);
      // duo-ratio-long-digits: the ratio rounded, with separators
      await load(Object.assign({ logKg: 9, oLogKg: 9 }, W)); await pick('allout');
      { const v9 = await duoTxt('.verdict'); check('review round 1: the shoving match\'s ratio is rounded', /about 560,000 times what holds the other/.test(v9) && !/\d{6}/.test(v9.replace(/[\d,.]+ (?:m|kN|GN|km)/g, '')), v9); }
      // physics-shoving-match-bolted-rock-claim, copy-shovingmatch-torn-unbounded, duo-push-ground-preset-reason: a
      // single bolted wrestler's rock is checked at any strength, his hold once torn is his feet's, and the ground preset
      // names his bolts
      await load(Object.assign({ anchor: 'bolted', unbreakable: false }, W)); await pick('allout');
      const vk = await duoTxt('.verdict');
      await load(Object.assign({ inf: true, oAnchor: 'bolted', unbreakable: false }, W)); await pick('allout');
      const vk2 = await duoTxt('.verdict'), sk2 = await duoTxt('.status-row'), hk2 = await duoTxt('.happens');
      await load(Object.assign({ anchor: 'bolted' }, W)); await pick('ground');
      const gk = await duoTxt('.effort-read');
      await load(Object.assign({ anchor: 'bolted', unbreakable: false }, W)); await pick('plaster');
      const gk2 = await duoTxt('.effort-read');
      check('review round 1: a single bolted wrestler\'s rock tears past its tear load, and then only his feet hold him', /more than what holds the other \(Rex the rock around his bolts, about 697 kN, Ollie 17\.7 kN\)\. The rock around Rex’s bolts tears out, and from then on only his feet hold him \(17\.7 kN\)\. They fly apart at 26\.6 m\/s each/.test(vk) && !/can’t move Rex’s bolts/.test(vk)
        && /Ollie the rock around his bolts, about 697 kN/.test(vk2) && /Ollie holds 17\.7 kN once his rock tears/.test(sk2) && !/Ollie unbounded|Ollie holds unlimited/.test(vk2 + sk2 + hk2)
        && /The least effort that tears the rock out around Rex’s bolts\./.test(gk) && !/Standing, their feet slide/.test(gk)
        && /Even all-out, this test doesn’t shake the ground enough that plaster may crack 5 m away\. The lab counts a push through a bolted wrestler’s bolts as shaking where he shoves the other off over the stroke, a quick pulse\. None goes through them that way here/.test(gk2), vk + ' | ' + vk2.slice(0, 200) + ' | ' + gk.slice(0, 200) + ' | ' + gk2.slice(0, 300));
      // duo-shoving-shake-reason: a bolted winner's bolts hand the ground the loser's push over the push, a pulse the lab
      // counts (at a 10^6 kg dial it may crack plaster)
      await load(Object.assign({ anchor: 'bolted', logKg: 6, oLogKg: 6 }, W)); await pick('plaster');
      const pk = await duoTxt('.effort-read');
      check('review round 1: the push through a bolted winner\'s bolts shakes the ground', /The least effort that shakes the ground enough that plaster may crack 5 m away/.test(pk) && /At this effort the push through Rex’s bolts shakes the ground enough that plaster may crack 5 m away/.test(pk) && !/not a blow/.test(pk), pk.slice(0, 300));
      // copy-bothatonce-shove-tile: the shove that moves someone is the one shown, with its muscle basis
      await load(Object.assign({ wrestleMove: 'shove', wrestleWho: 'both', oAnchor: 'bolted' }, W)); await pick('allout');
      { const tb = await duoTxt('.tiles'), sb = await duoTxt('.status-row'); check('review round 1: Both at once shows the shove that moves Rex', /Ollie’s shove ?890 kN ?two hands/.test(tb) && !/Shove force ?299 kN/.test(tb) && /Comic mode: real muscle does better here/.test(sb), tb.slice(0, 200) + ' | ' + sb); }
      // duo-arm-loser-bolts-tear: a bolted loser's rock carries what reaches him in a standing pin (no tear here); since
      // review round 2 that is the force at his elbow, not his own press
      await load({ duoOpen: true, duoAction: 'arm', keepForm: false, unbreakable: false, oAnchor: 'bolted', logKg: 6 }); await ollieKg(Math.log10(90718.474)); await pick('allout');
      { const sa = await duoTxt('.status-row'), va = await duoTxt('.verdict'), ea = await eng('const r = P.armWrestle(mk({ F: 1e6 * g, keepForm: false, unbreakable: false }), mk({ keepForm: false, unbreakable: false, anchor: "bolted", body: P.makeBody(Object.assign({ build: "ollie" }, P.DEFAULT_BODIES.ollie)) })); return { o: r.outcome, tB: r.tearB, PB: r.PB };');
        check('review round 1: a bolted loser\'s rock carries what reaches him in a standing pin', ea.o === 'pin' && ea.tB < 1 && /he pins Ollie in/.test(va) && !/Ground around Ollie’s bolts tears out/.test(sa), sa + ' | ' + JSON.stringify(ea)); }
      // copy-fireball-before-split: a fireball made before it reaches Ollie gives the split its verdict points to
      await load({ duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', logKg: 14, keepForm: false, airAbsorb: 0.5, cLogD: 3 }); await pick('allout');
      { const hf = await duoTxt('.happens'), vf = await duoTxt('.verdict'); check('review round 1: the fireball made on the way gives the split', /its motion as it reaches him is taken back: below/.test(vf) && /Stopping it at Ollie frees 3\.63 TJ \(870 t TNT\) where he stands\. 3\.44 TJ of it is heat already made in the air on the way: that is real\. The rest, 192 GJ, is its motion, freed as it stops at him/.test(hf), hf.slice(-500)); }
      // duo-mutant-survivors: (a) decision 5's effect on the search (the default set speed: the slide, not the hit's air
      // blast); (b) a switch turned over in place gives what a fresh load gives (the search's key carries the switches);
      // (d) unequal strengths: each one's push back is his own push x t, as the engine gives it
      await load(Object.assign({ colSrc: 'set' }, COL));
      { const es = await duoTxt('.effort-read'); check('review round 1: the default set speed\'s ceiling is the carried slide, not the hit\'s blast', /Even at the least they need to stand and walk, Rex is carried along at 100 m\/s and ends up 516 m away, past the nearest people 5 m away\./.test(es) && !/air blast/.test(es), es.slice(0, 300)); }
      const FB2 = { duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', logKg: 14, keepForm: false, airAbsorb: 0.5 };
      await load(FB2); await pick('windows');
      await page.evaluate(() => { document.getElementById('nkb-ollie').click(); document.getElementById('nkb-rex').click(); }); await page.waitForTimeout(400); await settle(page, 'bay'); await page.waitForTimeout(300); await settle(page, 'duo-bay');
      const inPlace = JSON.stringify(await readResult(page, 'duo-bay'));
      await pick('allout');
      const vIn = await duoTxt('.verdict');
      await load(Object.assign({ noKnockback: false, oNoKnockback: false }, FB2)); await pick('windows');
      const fresh = JSON.stringify(await readResult(page, 'duo-bay'));
      check('review round 1: a Never knocked back switch turned over in place gives what a fresh load gives', inPlace === fresh && /It carries Ollie off at 343 m\/s/.test(vIn), inPlace.slice(0, 300) + ' || ' + fresh.slice(0, 300) + ' || ' + vIn.slice(-200));
      const eu = await eng('const r = P.pushMatch(mk(), mk({ F: 1e5 * g, body: P.makeBody(Object.assign({ build: "ollie" }, P.DEFAULT_BODIES.ollie)) })); return { a: r.recoilAbsorbedA.J, b: r.recoilAbsorbedB.J, o: r.outcome };');
      await load(W); await ollieKg(5); await pick('allout');
      { const hu = await duoTxt('.happens'), mu = hu.match(/each one’s push back goes to the endless ocean \(Rex ([\d,]+) kg·m\/s, Ollie ([\d,]+) kg·m\/s, over the push\)/);
        check('review round 1: unequal pushes, each one\'s push back is his own', eu.o === 'bothShoved' && mu && near(num(mu[1]), eu.a, 0.02) && near(num(mu[2]), eu.b, 0.02) && eu.b > 1.05 * eu.a, (mu ? mu[0] : hu.slice(0, 300)) + ' ' + JSON.stringify(eu)); }
    }
    // ---- review round 2 of pull request 4 (research/reviews/canon-4-round2.json): each check fails with its fix reverted
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
      // (a bounce off a 200 m/s charge sends Rex off at 400 m/s: the charge is below the speed of sound, his ride isn't)
      await load(Object.assign({ colSrc: 'set', colGB: Math.log10(200 / 299792458), colBounce: 'bounce' }, COL));
      const ae2 = await duoTxt('.effort-read');
      check('review round 2: a carried body faster than sound heats real air below 1% of light speed', /Carried at 300 km\/s, faster than sound, Rex’s body meets real air \(their own bodies do\)\. The air takes nearly all of his 135 TJ of motion \(32 kt TNT\) as he slides off/.test(ah) && /Damage radius if all of that energy went into the air as a blast \(Rex’s motion, heating the air as he slides off\)/.test(ab)
        && /Sent off at 1,000 m\/s, faster than sound, Rex’s body meets real air \(their own bodies do\)\. Of his 1\.5 GJ of motion the air takes 1\.45 GJ/.test(ah5) && /Damage radius if all of that energy went into the air as a blast \(Rex’s motion, heating the air as he slides off\)/.test(ab5)
        && /Rex is sent off faster than sound, and the air he heats as he slides off risks damage 5 m away/.test(ae2) && !/the hit’s air blast/.test(ae2), ah.slice(-700) + ' | ' + ah5.slice(-400) + ' | ' + ae2.slice(0, 300));
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
      // physics-slide-harm-ignores-stroke (copy-push-distance-left-out-of-slide-harm): the Two-player effort card says the
      // search counts how far the push carries him (the ceilings are checked above: 3.68 t and 7.3 t)
      const cardsR2 = await page.evaluate(() => document.body.textContent.replace(/\s+/g, ' '));
      check('review round 2: the Two-player effort card counts the push\'s travel', /in the shoving match, the steady push and Collide’s charge it counts how far the push or the charge carries him too\)\./.test(cardsR2), '(card text)');
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
    if (errs.length) r4.push('page errors: ' + errs.slice(0, 3).join(' | '));
    if (r4.length) fail('pull request 4 (contests and Never knocked back): ' + r4.join(' ;; ')); else okLog('pull request 4: Collide carries the one hit along (on) or knocks him back (off), explains the paradox first (bolted, a 10⁹ kg jump and stomp), carries a Rex bolted on real rock with a plug of rock, takes the hit\'s energy back unless a blast preset means it, and its search stops at the carried slide; the steady push, the shoving match (both shoved apart, shoved off, a walk-out), Both at once, the Lift and arm wrestling (reading B) say what the engine does, on and off; the two Never knocked back switches are on by default, named, noted, saved and listed, change no tab but the fireball case, which shows each one; the cards');
    await page.close();
  }
  await browser.close();
  if (problems) { console.log('PROBLEMS: see above'); process.exit(1); }
})().catch((e) => { console.error(e); process.exit(1); });
