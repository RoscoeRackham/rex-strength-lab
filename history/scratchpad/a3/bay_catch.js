  // ---------------------------------------------------------------- catch
  const CATCH_D_MAX = Math.PI * K.R_E;
  const catchBall = () => (state.cObj === 'partner' ? null : objById(state.cObj));
  let slowTimer = null;
  function scheduleBaySlow() { clearTimeout(slowTimer); slowTimer = setTimeout(() => { save(); renderBay(true); }, 180); }
  function catchControls(Dmin) {
    const f = el('div', { class: 'field' }, el('label', { for: 'c-obj', text: 'Ball' }));
    const s = el('select', { id: 'c-obj' });
    const list = D.objects.filter((o) => !o.noThrow);
    const groups = [];
    for (const o of list) { let gp = groups.find((x) => x.name === o.group); if (!gp) { gp = { name: o.group, items: [] }; groups.push(gp); } gp.items.push(o); }
    for (const gp of groups) s.append(el('optgroup', { label: gp.name }, gp.items.map((o) => el('option', { value: o.id, text: o.name + ' · ' + fmtMass(o.m) }))));
    s.append(el('optgroup', { label: 'Each other' }, el('option', { value: 'partner', text: 'Rex tosses Ollie straight up and catches him' })));
    s.value = state.cObj;
    s.onchange = (e) => { state.cObj = e.target.value; update(); };
    f.append(s);
    const partner = state.cObj === 'partner';
    const lo = partner ? Math.log10(3) : Math.log10(Dmin), hi = partner ? 5 : Math.log10(CATCH_D_MAX);
    const val = Math.min(hi, Math.max(lo, state.cLogD));
    const label = (x) => (partner ? 'Toss height: ' : 'Distance between them: ') + (Math.abs(x - Math.log10(CATCH_D_MAX)) < 1e-6 ? 'the other side of the planet (' + fmtDist(CATCH_D_MAX) + ')' : fmtDist(Math.pow(10, x)));
    const df = el('div', { class: 'field' }, el('label', { for: 'c-dist', text: label(val) }));
    const r = el('input', { id: 'c-dist', type: 'range', min: String(lo), max: String(hi), step: '0.01', value: String(val) });
    r.oninput = (e) => { state.cLogD = Number(e.target.value); df.querySelector('label').textContent = label(state.cLogD); scheduleBaySlow(); };
    df.append(r);
    const chipVals = partner ? [[10, '10 m'], [100, '100 m'], [1000, '1 km']] : [[10, '10 m'], [100, '100 m'], [1000, '1 km'], [1e5, '100 km'], [1e6, '1,000 km'], [1e7, '10,000 km'], [CATCH_D_MAX, 'Other side of the planet']];
    df.append(el('div', { class: 'chips', role: 'group', 'aria-label': partner ? 'Toss height presets' : 'Distance presets', style: 'margin-top:4px' },
      chipVals.map(([d, t]) => el('button', { type: 'button', class: 'chip', id: 'cd-' + String(d).replace('.', '_'), 'aria-pressed': String(Math.abs(Math.log10(d) - val) < 0.005), onclick: () => { state.cLogD = Math.log10(d); update(); } }, t))));
    const st = el('div', { class: 'field' }, el('span', { class: 'lbl', id: 'c-style-lbl', text: 'Throw' }),
      el('div', { class: 'seg', role: 'group', 'aria-labelledby': 'c-style-lbl' },
        el('button', { type: 'button', id: 'c-easy', 'aria-pressed': String(state.cStyle === 'easy'), title: 'The slowest throw that reaches him', onclick: () => { state.cStyle = 'easy'; update(); } }, 'Gentle lob'),
        el('button', { type: 'button', id: 'c-hard', 'aria-pressed': String(state.cStyle === 'hard'), title: 'As hard as he can, flattest path', onclick: () => { state.cStyle = 'hard'; update(); } }, 'Fastball')));
    const miss = el('label', { class: 'check' }, el('input', { type: 'checkbox', id: 'c-miss', checked: state.cMiss || null, onchange: (e) => { state.cMiss = e.target.checked; update(); } }), el('span', { text: 'Show what happens if he misses' }));
    return el('div', { class: 'bay-controls' }, f, df, st, miss);
  }
  const verbOf = (h) => (h && h.mat ? h.mat.verb : 'melt');
  // one sentence for a leg; T throws to C
  function legVerdict(L, T, C, o, short) {
    const s = short || (o ? 'the ' + o.short : 'him');
    const S = capital(s);
    switch (L.result) {
      case 'thrower-black-hole': return T + ' is a black hole at this density. Nothing he throws can get out.';
      case 'cant-hold': return T + ' can’t throw ' + s + ': he can’t even hold it up (' + fmtSI(L.holdNeeded, 'N') + ').';
      case 'falls-back': return T + '’s own gravity wins. ' + S + ' needs ' + speedOnly(L.escapeNeeded) + ' just to climb out of his pull, and his best throw is ' + speedOnly(L.vMax) + '. It drops back into his hand.';
      case 'unreachable': return 'No throw gets ' + s + ' ' + fmtDist(L.D) + '. Air stops it within about ' + fmtDist(L.farthestAny.range) + ' at any speed below 1% of light speed.';
      case 'too-weak':
        if (L.heat && L.heat.kind === 'destroyed' && L.easyNeed) return T + ' can’t throw ' + s + ' ' + fmtDist(L.D) + ': his best goes ' + fmtDist(L.farthest.range) + '. Air is the wall. It would need about ' + speedOnly(L.easyNeed.vL) + ', and at that speed it would ' + verbOf(L.heat) + ' away long before it got there.';
        return T + ' can’t throw ' + s + ' that far. His best throw goes ' + (L.farthest && isFinite(L.farthest.range) ? fmtDist(L.farthest.range) : 'not far enough') + '.' + (L.needFactor && isFinite(L.needFactor) ? ' It needs ' + fmtRatio(L.needFactor) + ' the speed he has.' : '');
      case 'overshoots': return 'Thrown as hard as ' + T + ' can, ' + s + ' can’t come down on ' + C + ': kept low, it burns its speed in the air; aimed higher, it ' + (L.escaped ? 'leaves Earth for good' : 'goes into orbit') + '. Switch to Gentle lob.';
      case 'fireball': {
        const fb = L.fireball;
        if (fb.kind === 'before') return 'At ' + fmtSpeed(L.vL) + ' ' + s + ' turns into a fireball within about ' + fmtDist(fb.sweep) + ' of ' + T + '’s hand, before it reaches ' + C + '. What reaches him ' + fmtDist(L.D) + ' away is the blast' + (isFinite(fb.E) ? '.' : ', from unbounded energy, so no finite blast size applies.');
        if (fb.kind === 'plasma') return 'At ' + fmtSpeed(L.vL) + ' ' + s + ' turns to plasma at once. ' + C + ', ' + fmtDist(L.D) + ' away, is inside the fireball: about ' + (isFinite(fb.Earr) ? fmtSI(fb.Earr, 'J') : 'unbounded energy') + ' of it hits him.';
        const cc = fb.catch;
        return S + ' is so heavy for its size that it reaches ' + C + ' before it has pushed aside its own weight in air. It arrives white-hot at ' + fmtSpeed(L.vL) + ', carrying ' + (isFinite(fb.Earr) ? fmtSI(fb.Earr, 'J') : 'unbounded energy') + '.' +
          (cc.undefinedInf ? ' Infinite strength against infinite energy: the sim can’t call it.' : cc.clean ? ' ' + C + ' stops it in ' + fmtDist(cc.stroke) + ' with ' + fmtSI(cc.Fneed, 'N') + '.' : ' ' + C + ' can’t stop it (' + fmtN(cc.Fneed) + ' needed). It carries him off at ' + speedOnly(cc.recoilV) + '.');
      }
      case 'caught': {
        const k = L.catch;
        const pre = L.fullStrength ? 'It’s too heavy to lob gently that far, so ' + T + ' throws it as hard as he can. ' : '';
        if (L.style === 'easy' && !L.fullStrength) return T + ' lobs ' + s + ' ' + fmtDist(L.D) + ' to ' + C + ' at ' + speedOnly(L.aim.vL) + ', ' + sig(L.aim.thetaDeg, 2) + '° up. It reaches ' + C + ' ' + fmtTime(L.time) + ' later at ' + speedOnly(L.vArrive) + ', and he stops it by giving with it over ' + fmtDist(k.stroke) + '.';
        return pre + T + ' fires ' + s + ' at ' + speedOnly(L.aim.vL) + (L.aim.vL >= K.a0 ? ' (' + fmtMach(L.aim.vL) + ')' : '') + '. It reaches ' + C + ' ' + fmtTime(L.time) + ' later at ' + speedOnly(L.vArrive) + '. Stopping it in ' + fmtDist(k.stroke) + ' takes ' + fmtSI(k.F, 'N') + (k.slide > 0.01 ? '; his feet slide ' + fmtDist(k.slide) : '') + '.';
      }
      case 'slams': { const k = L.catch; return C + ' can’t stop it with his arms. Catching it in ' + fmtDist(k.stroke) + ' takes ' + fmtSI(k.Fneed, 'N') + '; he has ' + fmtN(k.Fcap) + '. It shoves his hands back to his chest and hits him at ' + speedOnly(k.vSlam) + '. He’s fine. ' + S + (o ? ' isn’t.' : ' is fine too.'); }
      case 'cant-hold-it': return C + ' can’t even hold ' + s + ' up (' + fmtSI(L.catch.holdLoad, 'N') + '). It knocks him back ' + fmtDist(L.catch.slide) + '. He’s fine.';
      default: return '';
    }
  }
  function bayCatch() {
    let cR = ctx(), cO = ctxOllie();
    const o = catchBall();
    const ballObj = o || P.partnerAsObject(cO.body, 'Ollie');
    const Dmin = P.catchMinD(cR.body, cO.body, ballObj);
    const out = [catchControls(Dmin), duoHeader(cR, cO)];
    const gate = duoGate(cR, cO);
    if (gate && gate.stop) { out.push(callout(gate.text)); return out; }
    if (gate) { out.push(callout(gate.text)); cR = Object.assign({}, cR, { groundHolds: true }); cO = Object.assign({}, cO, { groundHolds: true }); }
    if (!o) return out.concat(catchPartner(cR, cO));
    const Dd = Math.min(CATCH_D_MAX, Math.max(Dmin, Math.pow(10, state.cLogD)));
    const same = cR.F === cO.F && cR.body.m === cO.body.m && cR.body.H === cO.body.H && cR.anchor === cO.anchor;
    const a = P.catchLeg(cR, cO, o, Dd, state.cStyle);
    const b = same ? a : P.catchLeg(cO, cR, o, Dd, state.cStyle);
    const pull = P.mutualGravity(cR.body, cO.body, Dd);
    const holdR = P.anchorCapacity({ body: cR.body, surface: cR.surface, theta: 0, anchor: cR.anchor, groundHolds: cR.groundHolds }).R;
    const holdO = P.anchorCapacity({ body: cO.body, surface: cO.surface, theta: 0, anchor: cO.anchor, groundHolds: cO.groundHolds }).R;
    if (pull.F > Math.min(holdR, holdO)) {
      const tg = P.fallTogether(cR.body, cO.body, Dd, pull.dContact);
      out.push(verdict('They can’t play at this distance. Their pull on each other (' + fmtSI(pull.F, 'N') + ') beats ' + (holdR < holdO ? 'Rex' : 'Ollie') + '’s footing (' + fmtSI(Math.min(holdR, holdO), 'N') + '), so they slam together in ' + fmtTime(tg.t) + ' at ' + speedOnly(tg.vRel) + '. Bolt both to the planet to play.'));
      return out;
    }
    const round = a.result === 'caught' && b.result === 'caught' ? a.time + b.time + a.catch.tStroke + b.catch.tStroke : null;
    let v = legVerdict(a, 'Rex', 'Ollie', o);
    if (a.result === 'caught' && b !== a) v += ' Ollie throws it back: ' + legVerdict(b, 'Ollie', 'Rex', o).replace(/\.$/, '') + '.';
    else if (b !== a && b.result !== a.result) v += ' Throwing back: ' + legVerdict(b, 'Ollie', 'Rex', o);
    if (round) v += ' One round trip takes ' + fmtTime(round) + '.';
    out.push(verdict(v));
    const k = a.catch;
    const chips = [];
    if (a.result === 'fireball') chips.push(status('bad', 'Fireball, no ball arrives'));
    else if (['too-weak', 'unreachable'].includes(a.result)) chips.push(status('bad', 'Out of reach' + (a.farthest && isFinite(a.farthest.range) ? ' (best ' + fmtDist(a.farthest.range) + ')' : '')));
    else if (a.fullStrength || (a.style === 'hard' && a.aim)) chips.push(status(a.fullStrength ? 'warn' : 'info', a.fullStrength ? 'Full strength needed' : 'Fastball: ' + speedOnly(a.aim.vL)));
    else if (a.aim) chips.push(status('good', 'Gentle lob: ' + speedOnly(a.aim.vL)));
    if (k) {
      chips.push(a.result === 'caught' ? status('good', 'Clean catch: ' + (isFinite(k.Fcap) ? sig(100 * k.F / k.Fcap, 2) + '% of Ollie’s strength' : 'a sliver of unlimited strength')) : a.result === 'slams' ? status('bad', 'Too fast to stop: needs ' + fmtSI(k.Fneed, 'N')) : status('bad', 'Too heavy to hold'));
      if (cO.anchor === 'bolted') chips.push(status('info', 'Bolted to the planet'));
      else if (k.sinkRatio > 1) chips.push(status('bad', 'Feet sink: ' + fmtRatio(k.sinkRatio) + ' the ground’s limit'));
      else chips.push(k.slide > 0.01 ? status('warn', 'Slides ' + fmtDist(k.slide)) : status('good', 'Feet hold'));
      if (o.id === 'baseball') chips.push(status(k.baseballRatio > 1 ? 'warn' : 'info', sig(k.baseballRatio, 2) + '× a home-run hit’s squeeze'));
      else if (o.crush) chips.push(k.gripRatio > 1 ? status('bad', 'Hands punch into it') : status('good', 'Survives the catch'));
    }
    if (a.heat && a.heat.kind !== 'immune') chips.push(status(a.heat.kind === 'destroyed' ? 'bad' : a.heat.kind === 'warm' ? 'info' : 'warn', 'Nose air ' + big(a.heat.noseC, 2) + ' °C: ' + ({ warm: 'warms up', skin: 'skin ' + verbOf(a.heat) + 's', loses: 'loses up to ' + sig(100 * a.heat.frac, 2) + '%', destroyed: 'burns up on the way' })[a.heat.kind]));
    out.push(el('div', { class: 'status-row' }, chips.slice(0, 5)));
    if (a.aim && k) {
      out.push(tiles(
        tile('Throw', speedOnly(a.aim.vL), (a.aim.vL >= K.a0 ? fmtMach(a.aim.vL) + ' · ' : '') + sig(a.aim.thetaDeg, 2) + '° up · ' + (a.style === 'easy' ? 'gentle lob' : 'full strength') + (a.wells && a.wells.barrier > 0 ? ' · ' + speedOnly(Math.sqrt(2 * a.wells.barrier)) + ' just to get away from Rex' : '')),
        tile('Flight', fmtTime(a.time), a.wells && a.wells.wellDominated ? 'straight line through their pull' : (a.flight ? 'top ' + fmtDist(a.flight.apex) : '')),
        tile('Arrives at', speedOnly(a.vArrive), sig(a.angleDeg, 2) + '° down' + (a.wells && a.wells.GC > 0 ? ' · sped up by Ollie’s pull' : '')),
        tile('Catch force', fmtSI(k.F, 'N'), (isFinite(k.Fcap) ? sig(100 * k.F / k.Fcap, 2) + '% of Ollie’s strength · ' : '') + big(k.decelG, 2) + ' g on the ' + o.short),
        tile('Ollie slides', cO.anchor === 'bolted' ? 'bolted' : (k.slide > 0.005 ? fmtDist(k.slide) : 'nothing'), 'feet hold up to ' + fmtN(k.R)),
        round ? tile('Round trip', fmtTime(round), 'both throws and catches') : null));
    }
    if (a.flight && a.flight.path && a.flight.path.length > 1 && !(a.wells && a.wells.wellDominated)) out.push(trajectoryChart(a.flight.path, null, 'Flight path of the ' + o.short + ' from Rex to Ollie', a.flight.apex, null));
    const items = [];
    if (a.result === 'caught' && a.style === 'easy' && !a.fullStrength && Dd < 1e4) {
      const vv = Math.sqrt(g * Dd);
      items.push('The gentlest throw that gets there leaves at about ' + sig(a.aim.thetaDeg, 2) + '°. With no air it would be 45° at ' + speedOnly(vv) + '; drag asks for ' + sig(Math.max(0, 100 * (a.aim.vL / vv - 1)), 2) + '% more.');
    }
    if (['too-weak', 'unreachable', 'overshoots'].includes(a.result) && o.m / o.area < 10332) items.push('More speed hardly helps a ' + o.short + '. Above the speed of sound it loses 63% of its speed every ' + fmtDist(2 * o.m / (K.rho0 * o.CdSup * o.area)) + ' of air, then falls at about its terminal speed. The air above each square metre of ground weighs 10.3 t, far more than the ' + o.short + ' carries per square metre of its front (' + big(o.m / o.area, 2) + ' kg/m²).');
    if (k) {
      items.push('Catching is stopping momentum. Ollie’s hands give ' + fmtDist(k.stroke) + ', from full reach to his chest, so the force is the ' + o.short + '’s energy spread over that distance: ½mv²/d = ' + fmtSI(k.F, 'N') + '.');
      if (cO.anchor === 'bolted') items.push('Bolted to the planet, he doesn’t move: the Earth takes the momentum.');
      else if (k.slips) items.push('His feet hold only ' + fmtSI(k.R, 'N') + ' along that line, so he skids ' + fmtDist(k.slide) + ' while he stops it, the way you slide back catching a heavy medicine ball on ice.');
      if (k.gripRatio > 1) items.push('His palms press ' + fmtSI(Math.max(k.F, k.holdLoad) / k.contact, 'Pa') + ' into the ' + o.short + ', which gives way at about ' + fmtSI(o.crush, 'Pa') + '. To catch it whole he’d need a plate ' + fmtArea(k.plateNeeded) + '.');
      if (o.id === 'baseball' && k.baseballRatio > 0.1) items.push('That’s ' + sig(k.baseballRatio, 2) + '× the ~40,000 N squeeze of a home-run hit, which baseballs survive.' + (k.baseballRatio > 1 ? ' Past that, the sim can’t say when it bursts.' : ''));
    }
    if (a.heat && a.heat.mat) {
      const h = a.heat, flags = (h.extrapolated ? ' (Above 2.9 km/s at sea level this is beyond the heating formula’s tested range.)' : '') + (h.radiation ? ' (Above 11 km/s glowing air adds radiant heat the sim leaves out, so it would be worse.)' : '');
      if (h.kind === 'warm') items.push('The air at its nose peaks at ' + big(h.noseC, 2) + ' °C, below the ' + big(h.mat.tC, 4) + ' °C where ' + h.mat.label + ' starts to ' + h.mat.verb + ', so it only warms up.');
      else if (h.kind === 'skin') items.push('Air at its nose reaches ' + big(h.noseC, 2) + ' °C, past the ' + big(h.mat.tC, 4) + ' °C where ' + h.mat.label + ' starts to ' + h.mat.verb + ', but it’s only in the air ' + fmtTime(a.time || 0) + ': its surface suffers while the inside stays cool.' + flags);
      else items.push('Air heating could ' + h.mat.verb + ' away up to ' + sig(Math.min(100, 100 * h.frac), 2) + '% of it on the way (a rough upper bound).' + flags);
    }
    if (a.wells && a.wells.GT > 0) items.push('Rex’s own pull grabs at it: it needs ' + speedOnly(Math.sqrt(2 * a.wells.barrier)) + ' just to get away from him.');
    if (a.wells && a.wells.GC > 0 && a.aim) items.push('Ollie’s pull grabs it on arrival: a ' + speedOnly(a.aim.vL) + ' throw hits his hands at ' + speedOnly(a.vArrive) + '.');
    if (a.result === 'fireball') items.push('Past 1% of light speed the air can’t get out of the way. The ' + o.short + ' keeps its momentum while it scoops up air and is spent after about ' + fmtDist(a.fireball.sweep) + ', where it has met its own mass of air.');
    if (a.time > 60 && a.flight) items.push('Each throw takes ' + fmtTime(a.time) + '; it climbs ' + fmtDist(a.flight.apex) + (a.flight.apex > 1e5 ? ', above the Kármán line (100 km)' : '') + '.');
    out.push(happens(items));
    if (state.cMiss && a.miss) {
      const m = a.miss;
      out.push(callout('If Ollie misses, it lands ' + fmtDist(Math.max(0, m.past)) + ' behind him at ' + speedOnly(m.vImpact) + ': ' + fmtSI(m.E, 'J') + ' (' + fmtTNT(m.E) + ').' + (m.E > 4.184e9 && m.crater > 0 ? ' Crater up to ' + fmtDist(m.crater) + ' across.' : '') + (m.E > 4.184e9 && m.quake > 2 ? ' Felt like a magnitude ' + sig(m.quake, 2) + ' quake.' : '')));
      if (m.E > 4.184e6) out.push(blastBlock(m.E, 'where it lands'));
    }
    out.push(math([
      'Aim: the gentlest throw is the angle needing the least launch speed, each speed solved so the arc comes down at Ollie’s hand height (' + fmtDist(cO.body.releaseHeight) + ') ' + fmtDist(Dd) + ' away. Same air and round-Earth model as Throw.',
      'Fastball: his full-strength speed at each angle; the flattest angle whose path passes Ollie’s hands.',
      'Catch: F = m v²/(2d) if his footing holds (F ≤ R); otherwise F = (v²/(2d) + R/M)/(1/m + 1/M) and he slides. d = 0.3 × his height = ' + fmtDist(0.3 * cO.body.H) + '.',
      'Slide: the pair coasts to a stop against friction and air drag: x = (M+m)/(2k)·ln(1 + k u²/R).',
      'Nose heating (Sutton–Graves): q = 1.74 × 10⁻⁴ √(ρ/rₙ) v³ W/m², added up along the path; share it could melt ≈ heat × frontal area / (mass × 1 MJ/kg).',
      a.wells && (a.wells.GT > 0 || a.wells.GC > 0) ? 'Their gravity: Φ(x) = −G m_Rex/x − G m_Ollie/(D − x). Launch v² = v_air² + 2 × (top of Φ − Φ at release); arrival adds the drop into Ollie’s well.' : null,
      a.result === 'fireball' ? 'Above 1% of c: sweep = m/(ρ₀A) = ' + fmtDist(a.fireball.sweep) + '; energy reaching him ≈ E/(1 + D/sweep).' : null,
    ]));
    return out;
  }
  function catchPartner(cR, cO) {
    const hT = Math.pow(10, Math.min(5, Math.max(Math.log10(3), state.cLogD)));
    const t = P.tossPartner(cR, cO.body, 'Ollie', state.cStyle, hT), out = [];
    let v;
    if (t.result === 'cant-hold') v = 'Rex can’t toss Ollie: he can’t even hold him up (' + fmtSI(t.holdNeeded, 'N') + ').';
    else if (t.result === 'unreachable') v = 'No toss gets Ollie ' + fmtDist(hT) + ' up: air stops him first.';
    else if (t.result === 'too-weak') v = 'Rex can’t toss Ollie ' + fmtDist(hT) + ' up: it takes ' + speedOnly(t.v) + ' and his best is ' + speedOnly(t.vMax) + '.';
    else if (t.result === 'fireball') v = 'Rex tosses Ollie at ' + fmtSpeed(t.v) + '. The air in front of him turns into a fireball; Ollie doesn’t come back down.';
    else if (t.result === 'escapes') v = 'Rex tosses Ollie off the planet. He doesn’t come back down.';
    else if (t.result === 'orbit') v = 'Rex tosses Ollie into orbit.';
    else {
      v = 'Rex tosses Ollie ' + fmtDist(t.flight.apex) + ' up. He comes back down ' + fmtTime(t.flight.time) + ' later at ' + speedOnly(t.flight.vImpact) + ', and Rex catches him with ' + fmtSI(t.catch.F, 'N') + '.';
      if (t.result === 'slams') v = 'Rex tosses Ollie ' + fmtDist(t.flight.apex) + ' up. He comes back down at ' + speedOnly(t.flight.vImpact) + ', too fast for Rex’s arms: Ollie lands on him at ' + speedOnly(t.catch.vSlam) + '. Both are fine.';
      if (t.catch.sinkRatio > 1) v += ' Rex’s feet punch into the ' + cR.surface.short + '.';
    }
    out.push(verdict(v));
    if (t.flight && t.catch) out.push(tiles(
      tile('Toss speed', speedOnly(t.v), fmtMach(t.v)),
      tile('Height', fmtDist(t.flight.apex), 'back down after ' + fmtTime(t.flight.time)),
      tile('Comes down at', speedOnly(t.flight.vImpact), ''),
      tile('Catch force', fmtSI(t.catch.F, 'N'), isFinite(t.catch.Fcap) ? sig(100 * t.catch.F / t.catch.Fcap, 2) + '% of Rex’s strength' : '')));
    out.push(happens([
      'Ollie is indestructible, so the only question is whether Rex’s arms and the ground can stop him: his hands give ' + fmtDist(0.3 * cR.body.H) + ' while he catches.',
      'Straight up, his feet can’t slide, but the ground under them carries Ollie’s whole stopping force.',
    ]));
    return out;
  }
