const { launch, open, R } = require('./lib');
(async () => {
  const b = await launch();
  const { p } = await open(b, 1280, 900, 'light');
  const t = await p.evaluate(() => {
    const out = [];
    out.push('LIMITS: ' + document.getElementById('limits').innerText);
    document.querySelectorAll('.stop').forEach((s) => out.push('STOP ' + s.id + ': ' + s.querySelector('.stop-head').innerText + ' || ' + Array.from(s.querySelectorAll('.limitnote')).map((n) => n.innerText).join(' || ')));
    return out.join('\n\n');
  });
  console.log(t);
  await b.close();
})();
