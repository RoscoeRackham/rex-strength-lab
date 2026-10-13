// Whole-page text outside the bays (sources table, assumption cards, feats, ladder) for both builds.
const fs = require('fs');
const H = require('./harness');
(async () => {
  const b = await H.launch();
  for (const [name, url] of [['new', H.NEW], ['old', H.OLD]]) {
    const p = await H.open(b, url, null);
    await p.waitForTimeout(3000);
    await p.evaluate(() => { for (const d of document.querySelectorAll('details')) d.open = true; });
    await p.waitForTimeout(1500);
    const t = await p.evaluate(() => { const c = document.body.cloneNode(true); for (const x of c.querySelectorAll('#bay, #duo-bay, script, style')) x.remove(); return c.innerText; });
    fs.writeFileSync(H.S + '/whole-' + name + '.txt', t);
    console.log(name, t.length);
    await p.context().close();
  }
  await b.close();
})();
