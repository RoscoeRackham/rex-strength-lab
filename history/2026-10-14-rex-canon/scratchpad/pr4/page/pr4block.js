  // ---- BRIEF-canon.md item 4, pull request 4: contests (force moves: the other's push is real, only each one's own push
  // back goes to his source) and the two Never knocked back switches. Each check fails on pull request 3's page. Figures
  // at the 3,000 kg bodies and the page's default dial; the engine's own figures where a sentence quotes them.
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
      const mk = (b, o) => Object.assign({ F: 100 * 907.18474 * g, mode: 'comic', body: P.makeBody(Object.assign({ build: b }, P.DEFAULT_BODIES[b])), surface: D.surfaces.find((x) => x.id === 'concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true }, o || {});
      return new Function('P', 'D', 'g', 'mk', 'a', c)(P, D, g, mk, a); }, [code, arg]);
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
      const ms = h.match(/comes from Ollie’s source: ([\d,]+) kg·m\/s in all\. That is canon’s case “their own recoil”/);
      check('Collide, the default sprint carries Rex along', m && near(num(m[2]), e.v) && near(num(m[3]), e.slide) && Math.abs(num(m[2]) - 18.1) < 0.05 && Math.abs(num(m[3]) - 27.3) < 0.05 && ms && near(num(ms[1]), e.sup, 0.02) && Math.abs(num(ms[1]) - 55000) < 600
        && /Energy freed at the hit ?494 kJ ?120 g TNT · taken back by default/.test(t) && !/Momentum is never lost/.test(h) && /How far Ollie carries him is up to Ollie/.test(h), v + ' | ' + (ms ? ms[0] : h.slice(0, 200)));
      await load(Object.assign({ colBounce: 'bounce' }, COL)); await pick('allout');
      const vb = await duoTxt('.verdict'), tb = await duoTxt('.tiles');
      check('Collide, the default bounce sends Rex off at twice the speed', /Rex bounces off him and is sent off at 36\.3 m\/s, twice his speed, and slides 102 m\./.test(vb) && /Ollie’s source supplies ?110,000 kg·m\/s/.test(tb), vb);
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
      check('Collide at 0.1% of light speed: carried along, the energy taken back, real for the windows preset', /Rex is carried along at 300 km\/s\./.test(v) && /Ollie’s source supplies ?900 million kg·m\/s/.test(t) && /135 TJ ?32 kt TNT · taken back by default/.test(t) && /The hit’s energy is taken back: their power/.test(s)
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
      await load(Object.assign({ colMode: 'push' }, COL));
      const v = await duoTxt('.verdict'), t = await duoTxt('.tiles'), h = await duoTxt('.happens');
      await load(Object.assign({ colMode: 'push', ownRecoil: false }, COL));
      const vo = await duoTxt('.verdict'), ho = await duoTxt('.happens');
      check('Collide, the steady push on and off', /^Ollie wins\. He pushes with 890 kN and Rex can hold only 17\.7 kN, so Rex is driven back\. Ollie takes his own recoil, so his push back goes to his source and his own footing \(17\.7 kN\) doesn’t cap his push\.$/.test(v)
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
        && /Courtesy ceiling: 10% \(lifting 9\.06 t\)\. Past that, both are shoved apart and slide past the nearest people 5 m away/.test(b)
        && /^Pushing straight across: dead heat\. Both are far stronger than their footing/.test(vo) && /A shoving match is decided at the feet\. To push forward, each one has to grip the ground/.test(ho), v + ' | ' + b.slice(0, 200) + ' | off ' + vo.slice(0, 100));
      // a bolted wrestler's push is real: he shoves the other off ('shovedOff')
      await load(Object.assign({ anchor: 'bolted' }, W)); await pick('allout');
      const vb = await duoTxt('.verdict'), tb = await duoTxt('.tiles');
      check('the shoving match, Rex bolted shoves Ollie off', /^Rex is bolted, so he can’t walk Ollie out, but his push is real \(a contest lets force move\): he shoves Ollie off at 37\.6 m\/s, and Ollie slides 109 m\. Ollie’s push \(890 kN\) can’t move Rex’s bolts\./.test(vb) && /Winner ?Rex ?Rex shoves Ollie off/.test(tb), vb);
      // a walk-out where only one push beats the other's grip: on gravel, Ollie at a 2,200 kg what-if strength; Rex's own
      // feet set the pace (the Pull tab's rule), as the engine gives it
      const ew = await eng('const sf = D.surfaces.find((x) => x.id === "gravel"); const r = P.pushMatch(mk({ surface: sf }), mk({ surface: sf, F: 2200 * g, body: P.makeBody(Object.assign({ build: "ollie" }, P.DEFAULT_BODIES.ollie)) })); return { o: r.outcome, t: r.t, a: r.accel };');
      await load(Object.assign({ surface: 'gravel' }, W)); await ollieKg(Math.log10(2200)); await pick('allout');
      const vw = await duoTxt('.verdict'), hw = await duoTxt('.happens'), mw = vw.match(/Rex walks Ollie out of the ring in ([\d.]+) s\./);
      check('the shoving match, a walk-out paced by the winner\'s feet', ew.o === 'walkOut' && mw && near(num(mw[1]), ew.t, 0.01) && /Rex’s own feet set the pace: they can speed his body up only so fast against Ollie’s push\./.test(vw) && /Walking him out is paced by Rex’s own feet, as on the Pull tab/.test(hw), vw + ' (engine ' + ew.o + ' ' + ew.t + ' s)');
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
    // arm wrestling as built (reading B, decision 10): each pad holds the other's press; a pin never breaks the table
    // with the power on; standing, his own footing doesn't cap his press and his feet hold against the other's
    {
      const A = { duoOpen: true, duoAction: 'arm' };
      await load(A);
      const h = await duoTxt('.happens');
      check('arm wrestling, each pad holds the other\'s press', /Each one’s own push back goes to his source \(They take their own recoil\), but the other’s press on him is real \(a contest lets force move\)\. Under the rules each grips the table’s peg with his free hand and rests his elbow on a pad bolted to the table, so each pad holds the other’s press/.test(h), h.slice(0, 300));
      // Ollie at 1 t, Things keep their form off: the pin stays on the table (its pad holds only Ollie's press), slams
      // through it at 83 m/s; with the power off the pin's pad load breaks the table and they stand
      await load(Object.assign({ keepForm: false }, A)); await ollieKg(3); await pick('allout');
      const vp = await duoTxt('.verdict'), hp = await duoTxt('.happens');
      await load(Object.assign({ keepForm: false, ownRecoil: false }, A)); await ollieKg(3); await pick('allout');
      const vpo = await duoTxt('.verdict');
      check('arm wrestling, a pin never breaks the table with the power on', /^Rex pins Ollie in 21\.9 ms\. The back of Ollie’s hand hits the pad at 83 m\/s and goes through the table\./.test(vp) && /Forcing an arm down: the winner’s elbow pad holds the loser’s press, 2\.45 kN here\..*So with the power on a pin never breaks the table/.test(hp)
        && /^The table can’t take the pin\./.test(vpo), vp + ' | off ' + vpo.slice(0, 120));
      // standing (the table broken by both presses), equal: a dead heat at 222 kN, both pushed off their feet
      await load(Object.assign({ keepForm: false }, A)); await pick('allout');
      const vs = await duoTxt('.verdict'), ss = await duoTxt('.status-row');
      check('arm wrestling standing, both pushed off their feet', /Arm-wrestling standing up, it’s a dead heat at 222 kN: their arms are locked\. But each one’s press beats the other’s footing \(17\.7 kN\), so both are pushed off their feet, opposite ways, turning about their clasped hands\. The lab doesn’t follow that motion\./.test(vs) && /Rex’s feet slide/.test(ss) && /Ollie’s feet slide/.test(ss), vs + ' | ' + ss);
      // standing, Ollie at 200 short tons: his press isn't capped by his footing, so he pins Rex, and his own feet slide
      await load(Object.assign({ keepForm: false }, A)); await ollieKg(Math.log10(200 * 907.18474)); await pick('allout');
      const vw = await duoTxt('.verdict');
      check('arm wrestling standing, the stronger press pins', /Standing up, Ollie’s push back goes to his source, so his footing doesn’t cap his press: he presses with his full 445 kN\. That beats Rex’s arm \(222 kN\): he pins Rex in [\d.]+ ms, dragging him along as he goes\. Rex’s press is more than Ollie’s feet hold \(17\.7 kN\), so Ollie’s feet slide too\./.test(vw), vw);
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
        && /In their contests, every two-player test here, they let force move: the other’s push on him is real, and only his own push back is taken \(They take their own recoil\)\. A catch is his own push too, so that power takes it back\. So this switch acts in one case only: a throw that reaches the catcher as a fireball or plasma in the game of catch \(Things keep their form off, some of the air’s drag left\), which hits him rather than being caught\./.test(place.note),
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
      const ef = await eng('const o = D.objects.find((x) => x.id === "baseball"), F = 1e14 * g; const L = P.catchLeg(mk({ F, keepForm: false, airAbsorb: 0.5 }), mk({ F, keepForm: false, airAbsorb: 0.5, body: P.makeBody(Object.assign({ build: "ollie" }, P.DEFAULT_BODIES.ollie)) }), o, 10, "hard"); const f = L.fireball; return { J: f.knockAbsorbed && f.knockAbsorbed.J, Egap: f.Egap, Earr: f.Earr };');
      await load(FB); await pick('allout');
      const von = await duoTxt('.verdict'), hon = await duoAll();
      await load(Object.assign({ oNoKnockback: false }, FB)); await pick('allout');
      const voff = await duoTxt('.verdict');
      await load(Object.assign({ noKnockback: false }, FB)); await pick('allout');
      const vrex = await duoTxt('.verdict');
      const mJ = von.match(/Never knocked back: it doesn’t move Ollie\. Its momentum \(([\d.,]+ million) kg·m\/s\) goes to the endless ocean, and stopping it frees 3\.63 TJ where he stands\./);
      check('Never knocked back: the fireball case shows each switch', mJ && ef.J > 1e6 && near(ef.J, 1.03e6, 0.01) && /422 GJ of it is heat already made in the air on the way: that is real\. The rest, 3\.21 TJ, is its motion, freed as it stops at him: canon takes a hit’s freed energy back by default/.test(hon) && near(ef.Egap, 4.22e11, 0.005) && near(ef.Earr, 3.21e12, 0.005)
        && /That is Never knocked back’s case, and Ollie’s switch is on \(Their powers\): he isn’t moved, and its momentum goes to the endless ocean\./.test(hon) && !/carries Ollie off/.test(von)
        && /It carries Ollie off at 343 m\/s\. He’s fine\./.test(voff) && /Thrown back, it hits Rex the same way\. Never knocked back: it doesn’t move Rex\./.test(voff)
        && /Never knocked back: it doesn’t move Ollie\./.test(vrex) && /Thrown back, it hits Rex the same way\. It carries Rex off at 343 m\/s\./.test(vrex), von + ' | off ' + voff.slice(-200) + ' | Rex off ' + vrex.slice(-200));
      // the cards: Their powers, Unstoppable force vs immovable object, Two-player effort, Game of catch
      const cards = await page.evaluate(() => document.body.textContent.replace(/\s+/g, ' '));
      check('the cards for pull request 4', /Never knocked back \(one switch each, both on by default; canon, the rulings of 14 Oct 2026\) means a hit from outside a contest doesn’t move him: its momentum goes to the endless ocean, even if he is bolted/.test(cards)
        && /A charger who takes his own recoil \(the default\) doesn’t slow: canon sends the push back from his own hit to his source/.test(cards) && /one of them has to give and neither can: canon rules that the collision has no physical answer/.test(cards)
        && /both shoved apart in the shoving match, or carried along at the charger’s speed in Collide/.test(cards) && /count only for a blast preset \(rattle, windows, houses, a block\), which the lab reads as meaning it/.test(cards)
        && /Never knocked back does \(one switch each, on by default\): he isn’t moved, and its momentum goes to the endless ocean, bolted too/.test(cards) && !/Never knocked back[^.]*not in the lab yet/.test(cards), '(card text)');
    }
    if (errs.length) r4.push('page errors: ' + errs.slice(0, 3).join(' | '));
    if (r4.length) fail('pull request 4 (contests and Never knocked back): ' + r4.join(' ;; ')); else okLog('pull request 4: Collide carries the one hit along (on) or knocks him back (off), explains the paradox first (bolted, a 10⁹ kg jump and stomp), carries a Rex bolted on real rock with a plug of rock, takes the hit\'s energy back unless a blast preset means it, and its search stops at the carried slide; the steady push, the shoving match (both shoved apart, shoved off, a walk-out), Both at once, the Lift and arm wrestling (reading B) say what the engine does, on and off; the two Never knocked back switches are on by default, named, noted, saved and listed, change no tab but the fireball case, which shows each one; the cards');
    await page.close();
  }
