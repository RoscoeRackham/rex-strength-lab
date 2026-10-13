const H = require('./harness');
(async () => {
  const b = await H.launch();
  for (const s of [{ cObj: 'car', cStyle: 'hard', surface: 'ice' }, { cObj: 'car', cStyle: 'hard', surface: 'ice', anchor: 'bolted' }]) {
    const p = await H.open(b, H.NEW, Object.assign({ duoOpen: true, duoAction: 'catch', duoEffort: 'all' }, s));
    await H.settle(p, '#duo-bay', 90000);
    // pick all-out in the effort select
    await p.selectOption('#duo-effort', { index: 1 }).catch(() => {});
    await p.waitForTimeout(500);
    await H.settle(p, '#duo-bay', 90000);
    const t = await p.evaluate(() => document.querySelector('#duo-bay').innerText);
    const m = t.match(/Throwing it shoves Rex back[^\n]*/);
    console.log(JSON.stringify(s), '\n', m ? m[0] : 'no recoil line', '\n', t.slice(t.indexOf('VS') + 2, t.indexOf('VS') + 600).replace(/\n+/g, ' | '));
    await p.context().close();
  }
  await b.close();
})();
