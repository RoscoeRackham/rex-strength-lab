const { open } = require('./pagelib.js');
(async () => {
  const P = await open();
  await P.load({ duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', cLogD: 2, logKg: 14, oM: 1e18, anchor: 'bolted', oAnchor: 'bolted' }, 'bay'); await P.settle('duo-bay');
  await P.pick('#duo-effort', 'allout');
  const t = await P.text('duo-bay');
  console.log((t.match(/Stopping it puts[^.]*\.[^.]*\./) || ['(none)'])[0]);
  await P.close();
})();
