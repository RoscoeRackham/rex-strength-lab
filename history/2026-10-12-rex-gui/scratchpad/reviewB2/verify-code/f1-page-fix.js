const { open } = require('./pagelib.js');
(async () => {
  const P = await open(__dirname + '/pmut/fix01.html');
  for (const [kf] of [[true], [false]]) {
    await P.load({ duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', cLogD: 2, logKg: 14, oM: 1e18, anchor: 'bolted', oAnchor: 'bolted', keepForm: kf }, 'bay'); await P.settle('duo-bay');
    await P.pick('#duo-effort', 'allout');
    const r = await P.page.evaluate(() => { const bay = document.getElementById('duo-bay'); const tx = (n) => n ? n.textContent.replace(/\s+/g, ' ').trim() : ''; return { verdict: tx(bay.querySelector('.verdict')), tiles: Array.from(bay.querySelectorAll('.tiles')).map(tx).join(' || '), happens: Array.from(bay.querySelectorAll('.happens')).map(tx).join(' || ') }; });
    console.log('keepForm', kf);
    console.log('  verdict:', r.verdict.slice(0, 600));
    console.log('  tiles:', r.tiles.slice(0, 500));
    console.log('  happens:', r.happens.slice(0, 900));
  }
  console.log('errors', P.errs);
  await P.close();
})();
