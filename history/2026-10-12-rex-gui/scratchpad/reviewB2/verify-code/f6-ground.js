// the exact check of test/shots.js lines 457-460, on a given page
const { open } = require('./pagelib.js');
(async () => {
  for (const name of ['base', 'p02']) {
    const P = await open(__dirname + '/pmut/' + name + '.html');
    await P.load({ duoOpen: true, duoAction: 'collide', anchor: 'bolted' }, 'bay'); await P.settle('duo-bay'); await P.pick('#duo-effort', 'ground');
    const dg = await P.page.evaluate(() => document.querySelector('#duo-bay .effort-read').textContent.replace(/\s+/g, ' '));
    const failed = !/set aside for this test/.test(dg) || /Least disruptive already does this/.test(dg) || (/Courtesy ceiling/.test(dg) && !/On real ground, courtesy ceiling/.test(dg));
    const chips = await P.page.evaluate(() => Array.from(document.querySelectorAll('#duo-bay .status-row')).map((n) => n.textContent.replace(/\s+/g, ' ')).join(' | '));
    console.log(name, failed ? 'CHECK FAILS' : 'check passes', '|', dg.slice(0, 260));
    console.log('   chips:', chips.slice(0, 300));
    await P.close();
  }
})();
