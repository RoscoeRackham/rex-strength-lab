const pw = require('./pw');
(async () => {
  for (const [st, kg] of [[{ action: 'throw', obj: 'piano', surface: 'gravel', mode: 'real', logKg: 7 }, 5.5e5], [{ action: 'throw', obj: 'shot', surface: 'granite', mode: 'real', logKg: 8 }, 7.24e6]]) {
    const p = await pw.open(st, { wait: 6000 });
    await pw.setEffortLog(p, Math.log10(kg));
    await p.waitForTimeout(4000);
    const lines = await p.evaluate(() => { document.querySelectorAll('#bay details').forEach((d) => (d.open = true)); return [...document.querySelectorAll('#bay p, #bay li, #bay .status, #bay .chip')].map((e) => e.innerText.replace(/\s+/g, ' ')); });
    console.log('=== ' + JSON.stringify(st) + ' at ' + kg);
    for (const l of [...new Set(lines)]) if (/Grip|Effort:|Courtesy|None of|crush|hands/i.test(l)) console.log('  ', l.slice(0, 350));
    console.log('  errs', p.errs);
    await p.close();
  }
  await pw.close();
})();
