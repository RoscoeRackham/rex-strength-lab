  // ---------------------------------------------------------------- weight (density) tab
  const YEAR = 365.25 * 86400;
  const fmtDuration = (s) => (s < 2 * YEAR ? fmtTime(s) : big(s / YEAR, 2) + ' years');
  // masses to compare him with: sourced objects plus the moons in D.massRefs
  function massRefs() {
    const seen = new Set(), out = [];
    for (const r of (D.massRefs || []).concat(D.objects.filter((o) => !['bar511', 'backlift', 'desoto', 'ruyi', 'range150', 'allstar', 'cloud', 'bowling'].includes(o.id)).map((o) => ({ label: o.name, short: o.short, m: o.m })))) {
      if (seen.has(r.label)) continue; seen.add(r.label); out.push(r);
    }
    return out.sort((a, b) => a.m - b.m);
  }
  function nearestMassRef(m) {
    let best = null;
    for (const r of massRefs()) if (r.m <= m * 1.0001) best = r;
    return best;
  }
  function densityChipRow(pre, H, m, setM) {
    const rho = m / P.bodyVolume(H);
    const row = el('div', { class: 'chips', role: 'group', 'aria-label': 'Density presets', style: 'margin-top:0' });
    for (const d of densityPresets(H)) {
      const id = pre + 'chip-' + d.id;
      row.append(el('button', { type: 'button', class: 'chip', id, 'aria-pressed': String(Math.abs(Math.log10(d.rho / rho)) < 0.005), title: d.note || null, onclick: () => { setM(d.rho * P.bodyVolume(H)); update(); } }, d.chip));
    }
    return el('div', { class: 'field', style: 'margin-top:0;flex:1 1 100%' }, el('span', { class: 'lbl', text: 'Density' }), row);
  }
  // Earth seen from above the North Pole, with his path drawn in the frame that turns with the Earth.
  function earthCutaway(fall, endLabel) {
    const w = Math.min(chartW(), 420), h = w, cx = w / 2, cy = h / 2, R = w / 2 - 30, k = R / K.R_E;
    const svg = sv('svg', { viewBox: `0 0 ${w} ${h}`, role: 'img', 'aria-label': 'Cut-away of the Earth seen from above the North Pole, with Rex’s path from his starting point to where he ' + endLabel + '.' });
    const rings = [[6371e3, 'var(--surface-2)', 'crust and mantle'], [3480e3, 'var(--line)', 'outer core (liquid)'], [1221.5e3, 'var(--ink-3)', 'inner core']];
    for (const [r, fill] of rings) svg.append(sv('circle', { cx, cy, r: r * k, fill, stroke: 'var(--ink-3)', 'stroke-width': 1 }));
    svg.append(sv('circle', { cx, cy, r: 5701e3 * k, fill: 'none', stroke: 'var(--ink-3)', 'stroke-width': 1, 'stroke-dasharray': '3 4' }));
    // map Earth-fixed (x, y) so the start (R_E, 0) is at the top
    const P2 = (p) => { const r = Math.hypot(p[0], p[1]), th = Math.atan2(p[1], p[0]) + Math.PI / 2; return [cx + r * Math.cos(th) * k, cy - r * Math.sin(th) * k]; };
    const pts = fall.path || [];
    const step = Math.max(1, Math.floor(pts.length / 1500));
    const d = pts.filter((_, i) => i % step === 0 || i === pts.length - 1).map((p, i) => { const q = P2(p); return (i ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join(' ');
    if (d) svg.append(sv('path', { d, fill: 'none', stroke: 'var(--accent)', 'stroke-width': 2, 'stroke-linejoin': 'round' }));
    const s0 = P2([K.R_E, 0]), e = pts.length ? P2(pts[pts.length - 1]) : s0;
    svg.append(sv('circle', { cx: s0[0], cy: s0[1], r: 5, fill: 'var(--accent)', stroke: 'var(--surface)', 'stroke-width': 2 }));
    svg.append(sv('circle', { cx: e[0], cy: e[1], r: 5, fill: 'var(--ink)', stroke: 'var(--surface)', 'stroke-width': 2 }));
    svg.append(sv('text', { x: s0[0] + 9, y: s0[1] - 6, class: 'lbl-strong' }, 'starts here'));
    svg.append(sv('text', { x: Math.min(e[0] + 9, w - 4), y: Math.min(e[1] + 18, h - 4), 'text-anchor': e[0] > w - 120 ? 'end' : 'start', class: 'lbl-strong' }, endLabel));
    svg.append(sv('text', { x: cx, y: cy - 3480e3 * k + 14, 'text-anchor': 'middle' }, 'outer core'));
    svg.append(sv('text', { x: cx, y: cy + 4, 'text-anchor': 'middle', style: 'fill:var(--surface)' }, 'inner core'));
    svg.append(sv('text', { x: cx, y: cy + 5701e3 * k - 6, 'text-anchor': 'middle' }, 'mantle'));
    return el('div', {}, el('div', { class: 'viz', style: 'max-width:420px' }, svg),
      el('p', { class: 'muted', style: 'font-size:.85rem;margin-top:4px', text: 'Seen from above the North Pole. The Earth turns under him while he falls, so he drifts west of the exact opposite point. At the poles there would be no drift.' }));
  }

  function bayWeight(c) {
    const r = P.weight(c, { record: true });
    const out = [];
    out.push(el('div', { class: 'bay-controls' }, densityChipRow('w-', state.H, state.m, (m) => { state.m = m; })));
    const gr = r.grav, gd = r.ground, mv = r.move, pl = r.planet, f = r.fall, st = r.settle;
    const jumpR = pl.regime === 'none' && ['comic', 'stands', 'sinks'].includes(gd.regime) ? P.jump(c) : null;
    const ref = nearestMassRef(r.m);
    let v;
    if (pl.regime === 'blackHole') v = 'Rex is a black hole. At ' + fmtMass(r.m) + ', ' + sig(pl.massRatioEarth, 3) + ' times Earth’s mass, he fits inside his own event horizon (' + fmtDist(gr.rs) + ' in radius).';
    else if (pl.regime === 'earthFalls') v = 'Rex outweighs the Earth ' + fmtRatio(pl.massRatioEarth) + '. The planet falls onto him in about ' + fmtTime(pl.tff) + ' and is crushed around him.';
    else if (pl.regime === 'reshapes') v = 'Rex has ' + sig(100 * pl.massRatioEarth, 2) + '% of Earth’s mass. He sinks to the centre and his pull crushes the planet’s rock out to ' + fmtDist(gr.rCrush) + '.';
    else if (gd.regime === 'fallsThrough' && f && f.firstPass && st) v = 'Rex falls straight through the Earth. ' + fmtTime(f.firstPass.t) + ' later he coasts to a stop ' + fmtDist(f.firstPass.depthShort) + ' under the far side’s surface, then falls back in.';
    else if (gd.regime === 'fallsThrough' && f && f.stuck) v = f.stuck.layer === 'inner core' ? 'Rex sinks through the Earth and stops in the solid inner core, ' + fmtDist(f.stuck.r) + ' from the centre, ' + fmtTime(f.stuck.t) + ' later.' : 'Rex sinks ' + fmtDist(f.stuck.depth) + ' into the Earth and stops in the ' + f.stuck.layer + ', ' + fmtTime(f.stuck.t) + ' later.';
    else if (gd.regime === 'fallsThrough') v = 'Rex sinks into the Earth and swings back and forth through the centre for ' + fmtDuration(st ? st.years * YEAR : 0) + '.';
    else if (gd.regime === 'outOfSight') v = 'Rex sinks out of sight. The ' + c.surface.short + ' can’t hold him, so he goes down until he reaches bedrock.';
    else if (gd.regime === 'punchesThrough') v = c.surface.id === 'ice' ? 'Rex breaks through the ice and sinks to the bottom of the lake.' : 'Rex goes straight through ' + c.surface.short + '.';
    else if (gd.regime === 'sinks') v = gd.stage === 'rock' ? 'Rex’s feet punch into the granite. He sinks in up to his hips and stops.' : gd.stage === 'body' ? 'Rex sinks in up to his hips (' + fmtDist(gd.sink) + ') and stops.' : 'Rex sinks ' + fmtDist(gd.sink) + ' into the ' + c.surface.short + ' and stops.';
    else if (gd.regime === 'stands') v = 'Rex stands fine.';
    else v = 'Comic ground holds him up.';
    if (pl.regime === 'none' && ['comic', 'stands', 'sinks'].includes(gd.regime)) {
      if (!mv.stand) v += ' But he’s too heavy for his own legs: he can’t get up, walk or jump.';
      else if (!mv.walk) v += ' He can stand, but he’s too heavy to walk.';
    }
    if (pl.regime === 'none' && gr.beatsOutside) v += ' Anything within ' + fmtDist(gr.dBeat) + ' falls onto him.';
    out.push(verdict(v));

    const chips = [];
    if (pl.regime === 'blackHole') chips.push(status('bad', 'Black hole'));
    else if (pl.regime === 'earthFalls') chips.push(status('bad', 'Earth falls onto him'));
    else if (pl.regime === 'reshapes') chips.push(status('bad', 'Reshapes the planet'));
    else if (gd.regime === 'comic') chips.push(status('info', 'Ground: comic, never breaks'));
    else if (gd.regime === 'stands') chips.push(status('good', 'Ground holds (' + sig(100 * gd.standRatio, 2) + '% of limit)'));
    else if (gd.regime === 'sinks') chips.push(status('warn', 'Sinks ' + fmtDist(gd.sink)));
    else if (gd.regime === 'fallsThrough') chips.push(status('bad', 'No rock can hold him'));
    else chips.push(status('bad', 'Ground fails: ' + fmtRatio(gd.standRatio) + ' its limit'));
    if (pl.regime === 'none' && ['comic', 'stands', 'sinks'].includes(gd.regime)) {
      chips.push(mv.walk ? status('good', mv.run ? 'Can walk and run' : 'Can walk') : mv.stand ? status('warn', 'Can stand, can’t walk') : status('bad', 'Too heavy to get up'));
      if (jumpR) chips.push(jumpR.v > 0 && !jumpR.relativistic ? status('good', 'Jumps ' + (jumpR.flight.escaped ? 'off the planet' : fmtDist(jumpR.flight.apex))) : jumpR.v > 0 ? status('good', 'Jumps at ' + fmtSpeed(jumpR.v)) : status('bad', 'Can’t jump'));
    }
    if (pl.regime !== 'blackHole') {
      if (gr.beatsOutside) chips.push(status('warn', 'His pull beats Earth’s within ' + fmtDist(gr.dBeat)));
      else if (r.rho > 1e6) chips.push(status('info', 'His gravity: ' + sci(gr.gSurf / g, 2) + ' of Earth’s at his skin'));
      if (gr.bondiOutside) chips.push(status('bad', 'Air falls onto him'));
    }
    if (r.denserThanOsmium) chips.push(status('info', 'Held together only by being indestructible'));
    out.push(el('div', { class: 'status-row' }, chips));

    let regimeTile;
    if (pl.regime === 'blackHole') regimeTile = tile('Event horizon radius', fmtDist(gr.rs), 'his equal-volume radius is ' + fmtDist(gr.R));
    else if (pl.regime !== 'none') regimeTile = tile('Earth falls onto him in', fmtTime(pl.tff), 'free fall from the surface');
    else if (f && f.firstPass && st) regimeTile = tile('Settles at the centre after', '~' + fmtDuration(st.years * YEAR), big(st.halfPasses / 2, 2) + ' round trips');
    else if (f && f.stuck) regimeTile = tile('Where he stops', fmtDist(f.stuck.depth) + ' down', 'after ' + fmtTime(f.stuck.t) + ', top speed ' + speedOnly(f.maxV));
    else if (st) regimeTile = tile('Settles at the centre after', '~' + fmtDuration(st.years * YEAR), '');
    else regimeTile = tile('His pull beats Earth’s within', gr.beatsOutside ? fmtDist(gr.dBeat) : 'nowhere outside him', gr.beatsOutside ? '' : 'it would take ' + fmtDist(gr.dBeat) + ' from his middle');
    const E = pl.regime !== 'none' ? pl.eLow : r.energyJ;
    out.push(tiles(
      tile('Mass', fmtMass(r.m), ref ? (r.m / ref.m < 1.15 ? '≈ ' : fmtRatio(r.m / ref.m) + ' ') + ref.label.toLowerCase().replace(/^the /, 'the ') : fmtDensity(r.rho)),
      tile('Weight', fmtSI(r.W, 'N'), isFinite(c.F) ? (c.F >= r.W ? 'strength is ' + big(c.F / r.W, 3) + '× his weight' : 'strength is ' + sig(100 * c.F / r.W, 2) + '% of his weight') : 'unlimited strength'),
      tile('Pressure under his feet', fmtSI(gd.footPressure, 'Pa'), gd.regime === 'comic' ? 'comic ground' : 'ground limit ' + fmtSI(gd.q0, 'Pa')),
      pl.regime === 'blackHole' ? null : tile('Gravity at his skin', (gr.gSurf / g >= 0.01 ? sig(gr.gSurf / g, 2) : sci(gr.gSurf / g, 2)) + ' g', 'as a ball of his volume, ' + fmtDist(gr.R) + ' radius'),
      pl.regime === 'blackHole' ? null : tile('Escape speed from him', speedOnly(gr.vEsc), 'Earth’s: 11.2 km/s'),
      regimeTile,
      E > 0 ? tile('Energy released', fmtSI(E, 'J'), fmtTNT(E) + ' · ' + compareEnergy(E)) : null));

    // charts
    const refs = massRefs().filter((x) => x.m > r.m / 1e6 && x.m < r.m * 1e6);
    const below = massRefs().filter((x) => x.m <= r.m / 1e6).pop(), above = massRefs().find((x) => x.m >= r.m * 1e6);
    const rows = [below, ...refs, above].filter(Boolean).map((x) => ({ label: x.label, value: x.m }));
    rows.push({ label: 'Rex (' + fmtDensity(r.rho) + ')', value: r.m, highlight: true });
    rows.sort((a, b) => a.value - b.value);
    const pick = rows.length > 9 ? rows.filter((x, i) => x.highlight || Math.abs(i - rows.findIndex((y) => y.highlight)) <= 4) : rows;
    out.push(logBars('Rex’s mass compared', pick, fmtMass));
    if (pl.regime === 'none' && gd.regime === 'fallsThrough') out.push(logMeter('Weight vs what bedrock can carry under his whole body', gd.rockRatio));
    else if (pl.regime === 'none' && gd.regime !== 'comic') out.push(logMeter('Ground: pressure under his feet vs what ' + c.surface.short + ' can take', gd.standRatio));
    if (pl.regime === 'none' && f && f.path && f.path.length > 2) out.push(earthCutaway(f, f.firstPass ? 'turns back ' + fmtDist(f.firstPass.depthShort) + ' short' : 'stops here'));

    const items = [];
    if (pl.regime === 'blackHole') items.push('Squeezed this hard, his mass fits inside its own event horizon, r = 2GM/c² (the sim treats him as a ball of his volume). General relativity says ordinary matter can’t hold its shape once it’s within 9/8 of that radius (Buchdahl’s limit); only his indestructibility keeps him in one piece up to the horizon. The Earth falls in within about ' + fmtTime(pl.tff) + '. How fast it disappears depends on how fast the heat can escape, which the sim doesn’t model.');
    if (pl.regime === 'earthFalls' || pl.regime === 'reshapes') items.push('Rock can’t hold itself up against his pull: his gravity alone crushes rock out to ' + fmtDist(gr.rCrush) + '. The Earth falls onto him in about ' + fmtTime(pl.tff) + ', releasing roughly ' + fmtSI(pl.eLow, 'J') + ', ' + fmtRatio(pl.eLow / K.EARTH_BIND) + ' the energy that holds the Earth together. Read that as an order of magnitude.' + (pl.regime === 'reshapes' ? ' Past 1/1,000 of Earth’s mass his pull reshapes the planet around him, so the sim stops modelling the fall and the moves in detail.' : ''));
    if (pl.regime === 'none' && ['comic', 'stands', 'sinks'].includes(gd.regime)) {
      if (!mv.stand) items.push('His legs push with at most 1.4× the dial’s force (' + fmtSI(mv.legForce, 'N') + '). His weight is ' + fmtSI(mv.weight, 'N') + '. He can stand still, because his indestructible body takes the load, but he can’t bend his knees and push himself up again. Getting up needs a dial setting of ' + fmtMass(mv.standNeedKg) + '.');
      else if (!mv.walk) items.push('Each step puts about 1.2× his weight on one leg (people measure 1.0–1.5×). His legs can’t manage that, so he stays put. Walking needs a dial setting of ' + fmtMass(mv.walkNeedKg) + '.');
      else if (Math.abs(Math.log10(r.rho / 1000)) > 0.005) items.push('Walking needs about 1.2× his weight on one leg at each step. He has ' + fmtRatio(mv.legForce / (1.2 * mv.weight)) + ' what that takes.');
    }
    if (pl.regime === 'none') {
      if (gd.regime === 'stands') items.push('His feet press ' + fmtSI(gd.footPressure, 'Pa') + ' into the ' + c.surface.short + ', which gives at about ' + fmtSI(gd.q0, 'Pa') + '.');
      else if (gd.regime === 'sinks' && gd.stage === 'rock') items.push('Granite gives way under a foot at about 1.7 GPa (rough: 0.1–4 GPa). His feet press ' + fmtSI(gd.footPressure, 'Pa') + ', but his whole body spreads the load to ' + fmtSI(gd.bodyPressure, 'Pa') + ', which the rock can carry.');
      else if (gd.regime === 'sinks') items.push('The ' + c.surface.short + ' gives way under him (' + fmtRatio(gd.standRatio) + ' its limit). Soil gets stronger the deeper he goes, because the soil above presses it down (sand and gravel much more than clay), so he stops at ' + fmtDist(gd.sink) + '.' + (gd.stage === 'body' ? ' His legs go in first; once his wider body reaches the ground, the load spreads out.' : ''));
      else if (gd.regime === 'outOfSight') items.push('Soil can’t stop him. Soil layers are usually metres to tens of metres thick, so he sinks to bedrock, which can carry up to ' + fmtSI(gd.rockCap, 'N') + ' under his whole body. He weighs ' + fmtSI(gd.weight, 'N') + '.');
      else if (gd.regime === 'punchesThrough') items.push(c.surface.id === 'ice' ? 'Lake ice gives at about ' + fmtSI(gd.q0, 'Pa') + ' under his feet; he presses ' + fmtSI(gd.footPressure, 'Pa') + '. At any weight that breaks the ice he is far denser than water, so he sinks to the bottom.' : 'The ' + c.surface.short + ' is a thin layer. Once it breaks he’s in whatever is underneath, and the sim doesn’t know what that is.');
      else if (gd.regime === 'fallsThrough') items.push('No rock can hold him. Even bedrock gives at about 1.7 GPa (a rough figure; real rock runs 0.1–4 GPa), and his weight presses ' + fmtSI(gd.bodyPressure, 'Pa') + ' on it. Strength doesn’t help: there’s nothing under him that can push back.');
      if (gd.regime === 'fallsThrough' && f && f.firstPass && st) {
        items.push('He falls through the Earth’s layers like a stone dropped down a tunnel through the planet. With the Earth’s real density profile the trip takes about 38 minutes, and he passes the centre at ' + speedOnly(f.maxV) + '. Shoving rock aside costs him ' + fmtTNT(st.firstPassLossJ) + ' per trip, so he comes back up ' + fmtDist(f.firstPass.depthShort) + ' short of the far side, ' + fmtDist(Math.abs(f.firstPass.westKm) * 1000) + ' ' + (f.firstPass.westKm >= 0 ? 'west' : 'east') + ' of the exact opposite point, because the Earth turns under him.');
        items.push('He keeps swinging back and forth for about ' + fmtDuration(st.years * YEAR) + ', each trip a little shorter, and ends up at the centre. The time is rough: it depends on how rock resists him, which nobody has measured at these depths and speeds. On the way he releases ' + fmtSI(r.energyJ, 'J') + ' as heat (' + compareEnergy(r.energyJ) + ').');
      } else if (gd.regime === 'fallsThrough' && f && f.stuck) {
        items.push('He sinks at up to ' + speedOnly(f.maxV) + ', pushing rock aside (like the ground under a stomp) and breaking it. In the liquid outer core only the shoving is left. Gravity weakens toward the centre, and solid rock holds him ' + fmtDist(f.stuck.r) + ' from it. The Earth’s spin drifts him about ' + fmtDist(Math.abs(f.stuck.driftKm) * 1000) + ' ' + (f.stuck.driftKm >= 0 ? 'east' : 'west') + ' of straight down. The result is sensitive to how strong deep rock is.');
      }
    }
    if (pl.regime !== 'blackHole') {
      if (gr.beatsOutside) {
        const fall10 = P.infallFrom(gr.GM, gr.R, 10);
        items.push('Within ' + fmtDist(gr.dBeat) + ' his gravity is stronger than the Earth’s. Something dropped 10 m from him hits him ' + fmtTime(fall10.t) + ' later at ' + speedOnly(fall10.v) + '.' + (gr.tidal1g > 0 ? ' Within ' + fmtDist(gr.tidal1g) + ', the pull on a person’s near side beats their far side by more than 1 g, enough to stretch them.' : ''));
      } else if (r.rho >= 1e6) items.push('His gravity is real but tiny: ' + sci(gr.gSurf / g, 2) + ' of the Earth’s at his skin. It would only beat the Earth’s ' + fmtDist(gr.dBeat) + ' from his middle, inside his own body.');
      if (gr.bondiOutside) items.push('Air within about ' + fmtDist(gr.rBondi) + ' can’t push back against his pull (the Bondi radius). It falls in at up to ' + speedOnly(gr.vEsc) + ' and slams to a stop at his skin' + (isFinite(gr.infallT) ? ', heating to about ' + fmtTemp(gr.infallT) + ' (an upper bound)' : '') + '. Bondi’s formula gives ' + big(gr.bondiRate / 1000, 2) + ' tonnes of air a second, carrying ' + fmtSI(gr.infallPower, 'W') + ' of heat; that heat would push air back out, so the real rate would be lower.' + (gr.holdsAir ? ' Out in space at room temperature he could even hold onto an atmosphere of his own.' : ''));
    }
    if (r.denserThanOsmium && pl.regime !== 'blackHole') items.push('Osmium is the densest element at everyday pressure (22,587 kg/m³). Anything denser exists in nature only crushed inside a star.' + (r.nmCaveat ? ' Neutron-star matter stays this dense only under a neutron star’s gravity, at a pressure of about 3 × 10³² Pa. Freed, it expands violently into neutron-rich nuclei that then decay, giving up at least 16 MeV per neutron (about 370 kt of TNT per kilogram). For this Rex that’s ' + fmtSI(r.nmCaveat.J, 'J') + ', ' + sig(100 * r.nmCaveat.J / K.EARTH_BIND, 2) + '% of the energy it takes to blow the Earth apart. In the sim his indestructibility holds it together.' : ''));
    out.push(happens(items));
    out.push(math([
      'Volume = 0.18 m³ × (height ÷ 2 m)³ = ' + sig(r.V, 3) + ' m³; mass = density × volume = ' + fmtDensity(r.rho) + ' × ' + sig(r.V, 3) + ' m³ = ' + fmtMass(r.m) + '; weight W = m g = ' + fmtSI(r.W, 'N') + '.',
      'Legs push up to 1.4 × strength = ' + fmtSI(mv.legForce, 'N') + '. Stand: ≥ W. Walk: ≥ 1.2 W (Nilsson & Thorstensson 1989). Run (Sprint tab): strength > W.',
      'Feet: W ÷ (2 × ' + sig(c.body.footArea, 2) + ' m²) = ' + fmtSI(gd.footPressure, 'Pa') + '. Whole underside: W ÷ ' + sig(c.body.topArea, 2) + ' m² = ' + fmtSI(gd.bodyPressure, 'Pa') + '. Sand and gravel: limit + γ·depth·N_q (N_q 18.4 or 64.2; USACE EM 1110-1-1905). Clay: limit + γ·depth.',
      'Bedrock carries up to 1.7 GPa × his underside = ' + fmtSI(gd.rockCap, 'N') + ' (estimate). Bolted to the planet stops sliding, not sinking; only Comic ground keeps the floor whole.',
      'Inside the Earth: PREM density and gravity (Dziewonski & Anderson 1981); resistance = area × (rock strength + ρv²) against his motion relative to the turning rock; no strength in the liquid outer core; 3-D RK4 for the first trip, Earth turning once per 23.93 h; later trips averaged.',
      'His gravity treats him as a ball of equal volume, radius ' + fmtDist(gr.R) + '. Surface gravity GM/R², escape speed √(2GM/R), G = 6.674 × 10⁻¹¹. His pull equals the Earth’s at √(GM/g) = ' + fmtDist(gr.dBeat) + '.',
      'Air: Bondi radius GM/c² with c = 340 m/s = ' + fmtDist(gr.rBondi) + '; rate 2πG²M²ρ/c³ (upper bound). Rock crushed where ρ_rock·GM/r tops 1.7 GPa: ' + fmtDist(gr.rCrush) + ' (loose surface rock, 200 MPa: ' + fmtDist(gr.rCrushUnconfined) + ').',
      'Black hole when 2GM/c² ≥ R: density ≥ 3c²/(8πGR²) = ' + fmtDensity(P.blackHoleDensity(c.body.H)) + ' at this height.',
    ]));
    return out;
  }
