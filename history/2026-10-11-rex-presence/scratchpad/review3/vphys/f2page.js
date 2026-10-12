const pw = require('./pw');
const cases = JSON.parse(process.argv[2]);
(async () => {
  for (const st of cases) {
    const p = await pw.open(Object.assign({ action: 'throw' }, st), { wait: 4000 });
    const lines = await p.evaluate(() => { document.querySelectorAll('#bay details').forEach(d=>d.open=true); return [...document.querySelectorAll('#bay p, #bay li, #bay .chip, #bay .status, #bay .verdict')].map(e => e.innerText.replace(/\s+/g,' ')); });
    console.log('=== ', JSON.stringify(st));
    for (const l of [...new Set(lines)]) if (/Effort:|shoved|Footing|Courtesy|hazard|Plaster|ground|Ground|crush|Grip|None of|nothing nearby|sound/i.test(l)) console.log('  ', l.slice(0, 300));
    console.log('  errs', p.errs);
    await p.close();
  }
  await pw.close();
})();
