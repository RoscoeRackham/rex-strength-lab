const pw = require('./pw');
const cases = JSON.parse(process.argv[2]);
(async () => {
  for (const st of cases) {
    const p = await pw.open(Object.assign({ group: 'duo' }, st), { wait: 6000 });
    const lines = await p.evaluate(() => { document.querySelectorAll('#bay details').forEach(d=>d.open=true); return [...document.querySelectorAll('#bay p, #bay li, #bay .verdict')].map(e => e.innerText.replace(/\s+/g,' ')); });
    console.log('=== ', JSON.stringify(st));
    for (const l of [...new Set(lines)]) if (/Effort|shoved|Courtesy|harm|All-out|throws|lands|ceiling|least they need|needs|can’t throw/i.test(l)) console.log('  ', l.slice(0, 400));
    console.log('  errs', p.errs);
    await p.close();
  }
  await pw.close();
})();
