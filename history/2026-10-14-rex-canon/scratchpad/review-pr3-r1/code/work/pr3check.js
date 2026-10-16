// Runs shots.js's pull request 3 checks (lines 856-928, verbatim) and its mass migration check on a given page file
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { readResult, settle } = require('/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r1/code/repo/rex-strength-lab/test/make-page-fixture.js');
(async () => {
  const body = fs.readFileSync(path.resolve(process.argv[2]), 'utf8');
  const prev = path.join(__dirname, 'mut-preview.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}</style></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  let problems = 0;
  const fail = (msg) => { problems++; console.log('PROBLEM ' + msg.slice(0, 600)); };
  const okLog = (msg) => console.log('ok   ' + msg.slice(0, 200));
  {
      const pg = await browser.newPage({ viewport: { width: 1280, height: 900 } });
      await pg.goto(pathToFileURL(prev).href);
      const after = async (st) => {
        await pg.evaluate((x) => { if (x) localStorage.setItem('rex-lab-v1', JSON.stringify(x)); else localStorage.clear(); }, st);
        await pg.reload(); await pg.waitForTimeout(500);
        return pg.evaluate(() => { const s = JSON.parse(localStorage.getItem('rex-lab-v1')); return [s.m, s.oM, s.saveV].join(); });
      };
      const fresh = await after(null), old = await after({ m: 3007, oM: 3007 }), older = await after({ m: 2700, oM: 2700 }), marked = await after({ m: 3007, oM: 3007, saveV: 2 }), marked3 = await after({ m: 3007, oM: 3007, saveV: 3 });
      if (fresh !== '3000,3000,3' || old !== '3000,3000,3' || older !== '3000,3000,3' || marked !== '3007,3007,3' || marked3 !== '3007,3007,3') fail('the default mass and its migration: fresh ' + fresh + ', older save ' + old + ', a 2,700 kg save ' + older + ', marked save ' + marked + ', marked 3 ' + marked3);
      else okLog('a fresh page and older saves with an old default (3,007 or 2,700 kg) use 3,000 kg; a save marked 2 or 3 keeps a visitor’s own 3,007 kg; every save is marked 3');
    await pg.close(); }
  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errs = [];
    page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await page.goto(pathToFileURL(prev).href);
    const load = async (st) => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(800); await settle(page, 'bay'); };
    const saved = () => page.evaluate(() => JSON.parse(localStorage.getItem('rex-lab-v1')));
    const bayText = () => page.evaluate(() => document.getElementById('bay').textContent.replace(/\s+/g, ' '));
    const pick = async (sel, v) => { await page.selectOption(sel, v); await page.waitForTimeout(300); await settle(page, sel === '#duo-effort' ? 'duo-bay' : 'bay'); };
    {
      const num = (x) => Number(String(x).replace(/,/g, ''));
      const soloTxt = (sel) => page.evaluate((s) => Array.from(document.querySelectorAll('#bay ' + s)).map((n) => n.textContent.replace(/\s+/g, ' ')).join(' / '), sel);
      const duoAll = () => page.evaluate(() => document.getElementById('duo-bay').textContent.replace(/\s+/g, ' '));
      const OFF_SP = { saveV: 3, safePassenger: false };
      // the default, and the save mark (decision 2): a fresh page has it on and saves it; an unmarked save, or one
      // marked 2, with it off loads with it on (off was the old default); a save marked 3 keeps it off (a choice)
      const spState = async (st) => { await page.evaluate((x) => { if (x) localStorage.setItem('rex-lab-v1', JSON.stringify(x)); else localStorage.clear(); }, st); await page.reload(); await page.waitForTimeout(800); await settle(page, 'bay');
        return page.evaluate(() => { const sv = JSON.parse(localStorage.getItem('rex-lab-v1')); return [document.getElementById('sw-passenger').checked, sv.safePassenger, sv.saveV].join(); }); };
      const spFresh = await spState(null), spOld = await spState({ safePassenger: false }), spTwo = await spState({ safePassenger: false, saveV: 2 }), spThree = await spState({ safePassenger: false, saveV: 3 });
      if (spFresh !== 'true,true,3' || spOld !== 'true,true,3' || spTwo !== 'true,true,3' || spThree !== 'false,false,3') fail('Safe passenger\'s default and the save mark (switch, saved, mark): fresh ' + spFresh + ', unmarked save with it off ' + spOld + ', marked 2 ' + spTwo + ', marked 3 ' + spThree);
      else okLog('Safe passenger is on on a fresh page and saved on; an unmarked save or one marked 2 with it off loads with it on; a save marked 3 keeps it off; every save is marked 3');
      // its place in Their powers: its own eyebrow, among the defaults, and the intro lists it as on by default
      const place = await page.evaluate(() => { const lab = document.getElementById('sw-passenger').closest('label'), prev = lab.previousElementSibling; return { brow: prev && prev.classList.contains('eyebrow') ? prev.textContent.trim() : null, hint: document.querySelector('#powers > p.hint').textContent.replace(/\s+/g, ' '), label: lab.textContent.replace(/\s+/g, ' ') }; });
      if (place.brow !== 'People they throw or catch' || !/Things keep their form, Safe passenger and Air resistance absorbed are on unless you turn them off/.test(place.hint) || !/feels only a manageable push, spread through their whole body, at the launch, in the air and when they land/.test(place.label) || /puts no g-force on them|the landing stay real/.test(place.label)) fail('Safe passenger in Their powers: ' + JSON.stringify(place).slice(0, 400));
      else okLog('Safe passenger has its own eyebrow (' + place.brow + '), the intro lists it as on by default, and its label covers the launch, the air and the landing');
      // the summary line: all five defaults read as one item; with Safe passenger off the others are listed without it;
      // with only Unbreakable footing off it is listed
      const sumOf = async (st) => { await load(st); return page.$eval('#powers-sum', (n) => n.textContent); };
      const sumFresh = await sumOf({ action: 'throw' }), sumOff = await sumOf(Object.assign({ action: 'throw' }, OFF_SP)), sumUb = await sumOf({ action: 'throw', saveV: 3, unbreakable: false });
      if (sumFresh !== 'Comic book · default powers on' || sumOff !== 'Comic book · unbreakable footing · own recoil · things keep their form · drag-free throws' || sumUb !== 'Comic book · own recoil · things keep their form · safe passenger · drag-free throws') fail('the Their powers summary: fresh "' + sumFresh + '", Safe passenger off "' + sumOff + '", Unbreakable footing off "' + sumUb + '"');
      else okLog('the Their powers summary counts Safe passenger among the default powers: "' + sumFresh + '"; off: "' + sumOff + '"');
      // the person throw at the defaults (decision 1; the brief's figures at 3,000 kg): least disruptive about 3.7% of
      // his strength (3.34 t), ceiling about 30% (27 t) from the landing's plaster; with it off, 0.37% (333 kg), the
      // person's g-force
      await load({ action: 'throw', obj: 'person' });
      const pOnE = await soloTxt('.effort-read'), pOnH = await soloTxt('.happens'), pOnT = await soloTxt('.tiles');
      await load(Object.assign({ action: 'throw', obj: 'person' }, OFF_SP));
      const pOffE = await soloTxt('.effort-read'), pOffH = await soloTxt('.happens');
      if (!/Effort: 3\.7% of his strength \(as hard as lifting 3\.34 t\)\. The gentlest push that lands the person 30 m away\./.test(pOnE) || !/Courtesy ceiling: 30% \(lifting 27 t\)\. Past that, the ground shakes hard enough that plaster may crack 5 m from where it lands\./.test(pOnE)
        || !/Effort: 0\.37% of his strength \(as hard as lifting 333 kg\)/.test(pOffE) || !/Courtesy ceiling: 0\.37% \(lifting 333 kg\)\. Past that, the person is pressed harder than amusement rides allow/.test(pOffE)) fail('the person throw\'s least effort and ceiling: on ' + pOnE.slice(0, 300) + ' | off ' + pOffE.slice(0, 200));
      else okLog('the person throw: least disruptive 3.7% (3.34 t), ceiling 30% (27 t) from the landing\'s plaster; with Safe passenger off 0.37% (333 kg), the person\'s g-force');
      // the landing (decisions 4 and 9): with it on the text names the energy taken back, as the engine gives it at the
      // effort shown, and the push that still reaches the ground; with it off, a fall the lab doesn't judge
      const useKg = (t) => { const m = t.match(/as hard as lifting ([\d.,]+)\s(t|kg)/); return m ? num(m[1]) * (m[2] === 't' ? 1000 : 1) : null; };
      const landOn = pOnH.match(/They land at ([\d.]+) m\/s, like falling ([\d.]+) m\. Safe passenger spreads the landing through them too and takes back its energy \(([\d.]+) kJ\), so they come down unharmed\. The landing’s push still reaches the ground, so it shakes the ground as a real landing does\./);
      const engLand = await page.evaluate((kg) => { const P = window.DinoPhys, D = window.DINO_DATA, g = P.K.g, body = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), o = D.objects.find((x) => x.id === 'person');
        const c = { F: 100 * 907.18474 * g, mode: 'comic', body, surface: D.surfaces.find((x) => x.id === 'concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, use: kg * g };
        const fn = P.RESTRAINT.MOVES.throw.passengerLanding, pl = fn && fn(P.throwObject(c, o, 45), { obj: o, safePassenger: true }); return pl ? pl.absorbed : null; }, useKg(pOnE));
      if (!landOn || !(engLand > 0) || Math.abs(num(landOn[3]) * 1000 / engLand - 1) > 0.01 || Math.abs(num(landOn[3]) - 14.6) > 0.05 || /The landing is still real/.test(pOnH) || !/Lands at ?18 m\/s ?14\.6 kJ taken back: Safe passenger/.test(pOnT)
        || !/The landing is still real: they hit the ground at [\d.]+ m\/s, like falling [\d.]+ m, unless someone catches them\. With Safe passenger off the lab doesn’t judge that fall\./.test(pOffH)) fail('the person\'s landing: on ' + ((pOnH.match(/They land at[^/]*/) || pOnH.match(/The landing is still real[^/]*/) || ['(none)'])[0]).slice(0, 300) + ' (engine ' + engLand + ' J) | off ' + ((pOffH.match(/The landing is still real[^/]*/) || ['(none)'])[0]).slice(0, 200));
      else okLog('the person\'s landing with Safe passenger on names the energy taken back (' + landOn[3] + ' kJ, the engine ' + (engLand / 1000).toFixed(1) + ' kJ) and the push that still shakes the ground; off, a fall the lab doesn\'t judge');
      // ... and where the flight would burn them (Things keep their form off, real air, a 10⁸ kg dial all-out), never
      // 'unharmed' (decision 6: Safe passenger doesn't cover heat)
      await load({ action: 'throw', obj: 'person', saveV: 3, keepForm: false, airAbsorb: 0, logKg: 8 }); await pick('#effort', 'allout');
      const hotH = await soloTxt('.happens'), hotE = await soloTxt('.effort-read');
      if (/so they come down unharmed/.test(hotH + hotE) || !/but it doesn’t cover the heating in flight \(below\), so the lab can’t say they come down unharmed/.test(hotH) || !/would melt or burn away/.test(hotH) || !/but not the heating in a flight this fast \(Things keep their form is off\)/.test(hotE)) fail('the hot person throw: ' + ((hotH.match(/They land at[^/]*/) || [hotH.slice(0, 200)])[0]).slice(0, 300) + ' | ' + ((hotE.match(/For a person[^/]*/) || ['(none)'])[0]));
      else okLog('a person thrown hot enough to burn (Things keep their form off) is never called unharmed; Safe passenger doesn\'t cover heat');
      // the effort box credits Safe passenger (decision 9): the same throw all-out with it off presses the person past
      // the ride limits; and its person line says what it covers
      await load({ action: 'throw', obj: 'person' });
      const crE = await page.$eval('#bay .effort-read', (n) => n.textContent.replace(/\s+/g, ' '));
      if (!/Safe passenger is on, so it leaves out the person pressed past the ride limits\./.test(crE) || !/Past ride limits for the person: never, because Safe passenger is on\./.test(crE) || !/For a person, Safe passenger covers the launch, the air in flight and the landing\. The landing’s energy is taken back, so they come down unharmed; its push still reaches the ground, and the shaking from it counts\./.test(crE)
        || !/For a person this covers the launch and the air in flight only\. The landing is a fall unless someone catches them, and with Safe passenger off the lab doesn’t judge it \(its shaking still counts\)\./.test(pOffE)) fail('the effort box for a person: ' + crE.slice(0, 500));
      else okLog('the effort box credits Safe passenger with the person pressed past the ride limits, and says what it covers (on) and what the lab leaves out (off)');
      // a very fast person (a 10^9.15 kg dial all-out, landing past 9.6 km/s): no crater or quake, the energy taken back
      await load({ action: 'throw', obj: 'person', logKg: 9.15 }); await pick('#effort', 'allout');
      const fastH = await soloTxt('.happens');
      if (!/Impact: [\d.]+ t TNT, all of it taken back by Safe passenger, so no crater, quake or blast where they land\. The landing’s push still reaches the ground and shakes it\./.test(fastH) || /crater up to|quake\./.test(fastH)) fail('a very fast person\'s impact: ' + ((fastH.match(/Impact:[^/]*/) || ['(no Impact item)'])[0]));
      else okLog('a very fast person\'s impact: the energy taken back by Safe passenger, no crater or quake');
      // Catch with a person (decision 7): with it on, no ride-limit harm, even the fastball in real air (pull request 2
      // flagged its drag), and a miss comes down unharmed; with it off the default lob is past the ride limits
      await load({ duoOpen: true, duoAction: 'catch', cObj: 'person', cStyle: 'hard', airAbsorb: 0, saveV: 3, safePassenger: true, cMiss: true }); await settle(page, 'duo-bay');
      const cOn = await duoAll();
      await load({ duoOpen: true, duoAction: 'catch', cObj: 'person' }); await settle(page, 'duo-bay');
      const cLob = await duoAll();
      await load(Object.assign({ duoOpen: true, duoAction: 'catch', cObj: 'person' }, OFF_SP)); await settle(page, 'duo-bay');
      const cOff = await duoAll();
      const RIDE = /past ride limits|harder than amusement rides allow/;
      if (RIDE.test(cOn) || RIDE.test(cLob) || !/Safe passenger: throw, flight and catch spread through them/.test(cOn) || !/Safe passenger: throw, flight and catch spread through them/.test(cLob) || !/If Ollie misses, they land [\d.]+ m behind him at [\d.]+ m\/s\. Safe passenger spreads the landing through them and takes back its energy \([\d.]+ kJ\), so they come down unharmed, with no crater or blast\. Its push still reaches the ground and shakes it\./.test(cOn)
        || !/the throw presses the person harder than amusement rides allow/.test(cOff)) fail('Catch with a person: on ' + ((cOn.match(/[^.]*(?:ride limits|rides allow)[^.]*\./) || cOn.match(/If Ollie misses[^.]*\./) || [cOn.slice(0, 200)])[0]) + ' | lob ' + ((cLob.match(/[^.]*(?:ride limits|rides allow)[^.]*\./) || [''])[0]) + ' | off ' + ((cOff.match(/[^.]*rides allow[^.]*\./) || ['(no harm)'])[0]));
      else okLog('Catch with a person: with Safe passenger on no ride-limit harm (the lob, and the fastball in real air), and a miss comes down unharmed; with it off the lob is past the ride limits');
    }
    await page.close();
  }
  await browser.close();
  console.log(problems ? 'PROBLEMS ' + problems : 'ALL OK');
  process.exit(problems ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
