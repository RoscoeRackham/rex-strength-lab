const pw = require('./pw');
(async () => {
  for (const st of [{ action: 'punch', silentStrike: true }, { action: 'clap', silentStrike: true }]) {
    const p = await pw.open(st, { wait: 4000 });
    const lines = await p.evaluate(() => { document.querySelectorAll('#bay details').forEach((d) => (d.open = true)); return [...document.querySelectorAll('#bay p, #bay li, #bay .status, #bay .tile, #bay .verdict')].map((e) => e.innerText.replace(/\s+/g, ' ')); });
    console.log('=== ' + JSON.stringify(st));
    for (const l of [...new Set(lines)]) if (/Silent|absorb|thump|Effort:|speed|Subsonic|reaches|meet/i.test(l)) console.log('  ', l.slice(0, 350));
    const eng = await p.evaluate((a) => { const P = window.DinoPhys, D = window.DINO_DATA; const body = P.makeBody({ H: P.DEFAULT_BODIES.rex.H, m: P.DEFAULT_BODIES.rex.m, build: 'rex' }); const t = document.querySelector('.effort-read').innerText; const m = t.match(/lifting ([\d.,]+) (t|kg)/); const kg = parseFloat(m[1].replace(/,/g, '')) * (m[2] === 't' ? 1000 : 1); const c = { F: kg * 9.80665, mode: 'comic', body, surface: D.surfaces.find((s) => s.id === 'concrete'), groundHolds: false, anchor: 'friction', silentStrike: true }; const r = P[a](c); const mv = P.RESTRAINT.MOVES[a]; return { kg, v: r.vFist || r.vHand, mach: r.mach, E: r.E, blastNoSwitch: mv.blast(r, {}) }; }, st.action);
    console.log('  ENGINE', JSON.stringify(eng));
    await p.close();
  }
  await pw.close();
})();
